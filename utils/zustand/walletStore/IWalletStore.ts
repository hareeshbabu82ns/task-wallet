export type IWallteStore = {
  balance: number | null;
  credit: number | null;
  debit: number | null;
  realm: string | null;
  isLoading: boolean;
  newPageIsLoading: boolean;
  id: string | null;
  transactions: ITransaction[] | null;
  hasMore: boolean | null;
  setBalance: (
    balance: number,
    credit: number,
    debit: number,
    realm: string,
    id: string | null
  ) => void;
  setTransactions: (
    transactions: ITransaction[] | null,
    page: number | null,
    hasMore: boolean | null
  ) => void;
  setisLoading: (isLoading: boolean) => void;
  transactionsIsLoading: boolean;
  setTransactionsIsLoading: (transactionsIsLoading: boolean) => void;
  setNewPageIsLoading: (newPageIsLoading: boolean) => void;
  page: number | null;
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
