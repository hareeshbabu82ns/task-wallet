import useInput from "@/hooks/useInput";
import { useWalletStore } from "@/utils/zustand/walletStore/useWalletStore";
import React from "react";
import * as BsIcons from "react-icons/bs";
import * as GiIcons from "react-icons/gi";
import * as IoIcons from "react-icons/io5";
import FilterOptions from "@/components/common/filters/FilterOptions";

const transactionTypes = [
  { name: "All", value: "" },
  { name: "Credit", value: "" },
  { name: "Debit", value: "" },
];

const TaskPageHeader = () => {
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
      </div>
      <div className="ml-auto">
        <FilterOptions
          multiple={false}
          {...transactionTypeInput}
          options={transactionTypes}
        />
      </div>
    </div>
  );
};

export default TaskPageHeader;
