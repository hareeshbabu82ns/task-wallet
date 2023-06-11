import useInput from "@/hooks/useInput";
import { useWalletStore } from "@/utils/zustand/walletStore/useWalletStore";
import React from "react";
import * as BsIcons from "react-icons/bs";
import * as GiIcons from "react-icons/gi";
import * as IoIcons from "react-icons/io5";
import FilterOptions from "@/components/common/filters/FilterOptions";

const transactionTypes = [
  { name: "All", value: "" },
  { name: "Credit", value: "credit" },
  { name: "Debit", value: "debit" },
];

const WalletHeader = () => {
  const transactionTypeInput = useInput<string>(() => {
    return true;
  }, transactionTypes[0].name);
  const walletStore = useWalletStore((s) => s);

  const { balance, realm, credit, debit } = walletStore;

  return (
    <div className="w-full py-3 justify-center gap-14  inset-0 flex">
      <div className="grow flex flex-col gap-2">
        <div className="relative">
          <input className="w-full pl-12 autofill:!text-red-200 outline-1 outline-offset-2 focus:!outline-blue-700 bg-bg-primary shadow-shadow-form-input rounded-2xl py-2" />
          <IoIcons.IoSearch className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5" />
        </div>
        <div className="ml-auto">
          <FilterOptions
            multiple={false}
            {...transactionTypeInput}
            options={transactionTypes}
          />
        </div>
      </div>
      <div className="bg-bg-primary ml-auto items-center min-w-[14rem] justify-between shadow-shadow-primary-xsm p-6 py-2 rounded-xl flex gap-5">
        <div className="flex flex-col gap-1 justify-between">
          <span>Balance</span>
          <span className="text-xl flex items-center text-primary">
            {" "}
            <BsIcons.BsCurrencyRupee className="w-[1.2rem] h-[1.2rem]" />
            {balance}
          </span>
        </div>
        <div>
          <IoIcons.IoWallet className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="bg-bg-primary items-center min-w-[14rem] shadow-shadow-primary-xsm justify-between p-6 py-2 rounded-xl flex gap-5">
        <div className="flex flex-col gap-1 justify-between">
          <span>Credited</span>
          <span className="text-xl flex items-center text-[#37b24d]">
            {" "}
            <BsIcons.BsCurrencyRupee
              color="#37b24d"
              className="w-[1.2rem] h-[1.2rem]"
            />
            +{credit}
          </span>
        </div>
        <div>
          <GiIcons.GiReceiveMoney color="#37b24d" className="w-8 h-8" />
        </div>
      </div>
      <div className="bg-bg-primary items-center min-w-[14rem] shadow-shadow-primary-xsm p-6 justify-between py-2 rounded-xl flex gap-5">
        <div className="flex flex-col gap-1 justify-between">
          <span>Debited</span>
          <span className="text-xl flex items-center text-[#f03e3e]">
            {" "}
            <BsIcons.BsCurrencyRupee className="w-[1.2rem] h-[1.2rem]" />-
            {debit}
          </span>
        </div>
        <div>
          <GiIcons.GiPayMoney color="#f03e3e" className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default WalletHeader;
