import { create } from "zustand";
import { Client, ID, Databases, Query } from "appwrite";
import { toast } from "react-toastify";
import { ITransaction, IWallteStore } from "./IWalletStore";

const client = new Client();
const database = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("647dc841ab72fff2362b"); // Your project ID

export const useWalletStore = create<IWallteStore>((set) => ({
  balance: null,
  credit: null,
  debit: null,
  realm: null,
  id: null,
  transactions: null,
  filters: null,
  transactionsIsLoading: false,
  newPageIsLoading: false,
  hasMore: false,
  page: null,
  setTransactionsIsLoading: (transactionsIsLoading) => {
    set({ transactionsIsLoading });
  },
  setTransactions: (transactions, page, hasMore) => {
    set({ transactions, page, hasMore });
  },
  setBalance: (balance, credit, debit, realm, id) => {
    set({ balance, realm, credit, debit, id });
  },
  isLoading: false,
  setisLoading: (isLoading) => {
    set({ isLoading });
  },
  setNewPageIsLoading: (newPageIsLoading) => {
    set({ newPageIsLoading });
  },
}));

export const getRealmBalance = async (input: {
  userId: string;
  realm: string;
  walletStore: IWallteStore;
}) => {
  try {
    input.walletStore.setisLoading(true);
    const res = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_WALLET_COLLECTION_ID || "",
      [Query.equal("userId", input.userId), Query.equal("realm", input.realm)]
    );
    if (res.total === 0) {
      createRealmWallet({
        userId: input.userId,
        realm: input.realm,
        walletStore: input.walletStore,
      });
    } else {
      input.walletStore.setBalance(
        res.documents[0].balance,
        res.documents[0].credit,
        res.documents[0].debit,
        res.documents[0].realm,
        res.documents[0].$id
      );
    }
    input.walletStore.setisLoading(false);
  } catch (error: any) {
    console.log(error);
    input.walletStore.setisLoading(false);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const createRealmWallet = async (input: {
  userId: string;
  realm: string;
  walletStore: IWallteStore;
}) => {
  try {
    input.walletStore.setisLoading(true);
    const res = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_WALLET_COLLECTION_ID || "",
      ID.unique(),
      {
        userId: input.userId,
        realm: input.realm,
        balance: 0,
        credit: 0,
        debit: 0,
      }
    );

    input.walletStore.setBalance(res.balance, 0, 0, input.realm, res.$id);
    input.walletStore.setisLoading(false);
  } catch (error: any) {
    console.log(error);
    input.walletStore.setisLoading(false);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const createTransaction = async (input: {
  transactionType: string;
  amount: number;
  date: string;
  userId: string;
  realm: string;
  method: string;
  walletStore: IWallteStore;
  onSuccess: () => void;
  description?: string;
  to?: string;
  from?: string;
}) => {
  try {
    input.walletStore.setisLoading(true);
    const {
      balance: currentBalance,
      credit: currentCredit,
      debit: currentDebit,
      id: walletId,
    } = input.walletStore;

    if (
      currentBalance === null ||
      currentCredit === null ||
      currentDebit === null ||
      walletId === null
    )
      return;

    const balance =
      input.transactionType === "Credit"
        ? currentBalance + Number(input.amount)
        : currentBalance - Number(input.amount);

    const creditType =
      input.transactionType === "Credit"
        ? { from: input.from }
        : { to: input.to };

    const debit =
      input.transactionType === "Credit"
        ? currentDebit
        : currentDebit + input.amount;

    const credit =
      input.transactionType === "Credit"
        ? currentCredit + input.amount
        : currentCredit;

    console.log(input.method.toLowerCase(), input.amount);

    const res = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_TRANSACTION_COLLECTION_ID || "",
      ID.unique(),
      {
        date: input.date,
        amount: input.amount,
        userId: input.userId,
        realm: input.realm,
        type: input.transactionType.toLowerCase(),
        ...creditType,
        description: input.description || "",
        balance: balance,
        method: input.method.toLowerCase(),
        keywords: `${input?.from ? input.from : input.to || ""} ${
          input.description
        }`,
      }
    );

    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_WALLET_COLLECTION_ID || "",
      walletId,
      {
        credit,
        balance: balance,
        debit,
      }
    );

    input.walletStore.setBalance(balance, credit, debit, input.realm, walletId);
    const newArray = [
      res as ITransaction,
      ...(input.walletStore.transactions || []),
    ].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      return 0;
    });

    input.walletStore.setTransactions(
      newArray,
      input.walletStore.page,
      input.walletStore.hasMore
    );
    input.onSuccess();
    input.walletStore.setisLoading(false);
  } catch (error: any) {
    console.log(error);
    input.walletStore.setisLoading(false);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const getTransactions = async (input: {
  walletStore: IWallteStore;
  userId: string;
  realm: string;
  page: number;
  filters?: {
    transactionType?: string;
    transactionMedthod?: string;
    toDate?: string;
    search?: string;
  };
}) => {
  try {
    const { realm, userId, walletStore, filters, page } = input;

    walletStore.setTransactionsIsLoading(true);

    if (page > 1) {
      walletStore.setNewPageIsLoading(true);
    }

    const queryList = [Query.limit(15), Query.offset((page - 1) * 15)];

    queryList.push(Query.equal("userId", userId));
    queryList.push(Query.equal("realm", realm));

    filters?.transactionType &&
      queryList.push(Query.equal("type", filters?.transactionType));

    filters?.transactionMedthod &&
      queryList.push(Query.equal("method", filters.transactionMedthod));

    filters?.toDate && queryList.push(Query.lessThan("date", filters?.toDate));

    if (filters?.search) {
      queryList.push(Query.search("keywords", filters.search));
    }

    const res = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_TRANSACTION_COLLECTION_ID || "",
      queryList
    );

    const prevTransactions = walletStore.transactions || [];
    const updatedArray = [
      ...(page > 1 ? prevTransactions : []),
      ...(res.documents as ITransaction[]),
    ];
    updatedArray.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      return 0;
    });

    walletStore.setTransactions(
      updatedArray,
      page,
      updatedArray?.length < res.total
    );
    walletStore.setTransactionsIsLoading(false);
    if (page > 1) {
      walletStore.setNewPageIsLoading(false);
    }
  } catch (error: any) {
    input.walletStore.setNewPageIsLoading(false);
    input.walletStore.setTransactionsIsLoading(false);
    toast.error(error?.message || "Something Went Wrong!");
  }
};
