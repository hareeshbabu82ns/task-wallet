import { ITransaction } from "../walletStore/IWalletStore";

export type IDashboardStore = {
  walletData: IWalletChartData[] | null;
  setWalletData: (walletData: IWalletChartData[] | null) => void;
};

export type IWalletChartData = {
  date: string;
  credited: number;
  debited: number;
};
