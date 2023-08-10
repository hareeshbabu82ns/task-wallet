import { create } from "zustand";
import { Client, ID, Databases, Query, Storage } from "appwrite";
import { toast } from "react-toastify";
import { IDashboardStore, IWalletChartData } from "./IDashboardStore";
import { ITransaction, IWallteStore } from "../walletStore/IWalletStore";
import dayjs from "dayjs";

const client = new Client();
const database = new Databases( client );
const storage = new Storage( client );

client
  .setEndpoint( process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ) // Your API Endpoint
  .setProject( process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ); // Your project ID

export const useDashboardStore = create<IDashboardStore>( ( set ) => ( {
  walletData: null,
  setWalletData: ( walletData ) => {
    set( { walletData } );
  },
} ) );

export const getWalletData = async ( input: {
  dashboardStore: IDashboardStore;
  userId: string;
  realm: string;
  page: number;
  filters: {
    days: number;
  };
} ) => {
  try {
    const { realm, userId, dashboardStore, filters, page } = input;

    const queryList = [ Query.limit( 100 ), Query.offset( ( page - 1 ) * 100 ) ];

    queryList.push( Query.equal( "userId", userId ) );
    queryList.push( Query.equal( "realm", realm ) );

    const today = new Date();
    today.setDate( today.getDate() - filters.days );
    console.log( today );
    queryList.push( Query.lessThan( "date", new Date().toISOString() ) );

    queryList.push( Query.greaterThan( "date", today.toISOString() ) );
    const res: { documents: ITransaction[] } = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID || "",
      queryList
    );

    if ( res.documents ) {
      const modifiedData: {
        [ date: string ]: {
          date: string;
          credited: number;
          debited: number;
          method: string;
        };
      } = {};
      res.documents.forEach( ( tran ) => {
        const modifiedDate: any = dayjs( tran.date ).format( "D MMMM YY" );
        if ( modifiedData[ modifiedDate ] ) {
          modifiedData[ modifiedDate ] = {
            date: modifiedDate,
            credited:
              tran.type === "credit"
                ? modifiedData[ modifiedDate ].credited + tran.amount
                : modifiedData[ modifiedDate ].credited,
            debited:
              tran.type === "debit"
                ? modifiedData[ modifiedDate ].debited + tran.amount
                : modifiedData[ modifiedDate ].debited,
            method: tran.method,
          };
        } else {
          modifiedData[ modifiedDate ] = {
            date: modifiedDate,
            credited: tran.type === "credit" ? tran.amount : 0,
            debited: tran.type === "debit" ? tran.amount : 0,
            method: tran?.method,
          };
        }
      } );
      const dataArr = Object.values( modifiedData )
        .map( ( val ) => val )
        .sort( ( a, b ) => {
          const dateA = new Date( a.date );
          const dateB = new Date( b.date );

          if ( dateA < dateB ) {
            return -1;
          }
          if ( dateA > dateB ) {
            return 1;
          }
          return 0;
        } );
      dashboardStore.setWalletData( dataArr );
    }
  } catch ( error: any ) {
    toast.error( error?.message || "Something Went Wrong!" );
  }
};
