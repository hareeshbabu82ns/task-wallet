export type IWallteStore = {
  balance: number | null;
  credit: number | null;
  debit: number | null;
  realm: string | null;
  isLoading: boolean;
  id: string | null;
  filters?: { [key: string]: string } | null;
  transactions: ITransaction[] | null;
  setBalance: (
    balance: number,
    credit: number,
    debit: number,
    realm: string,
    id: string | null
  ) => void;
  setTransactions: (transactions: ITransaction[] | null) => void;
  setisLoading: (isLoading: boolean) => void;
};

export type ITransaction = {
  date: string;
  userId: string;
  type: string;
  description: string;
  balance: 12000;
  realm: string;
  from: null;
  to: null;
  amount: 12000;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  method: string;
};
