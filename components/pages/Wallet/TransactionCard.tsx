import { ITransaction } from "@/utils/zustand/walletStore/IWalletStore";
import moment from "moment";
import React from "react";
import { BsCurrencyRupee } from "react-icons/bs";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";

const TransactionCard: React.FC<{ transaction: ITransaction }> = ({
  transaction,
}) => {
  const date = new Date(transaction.date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return (
    <div className="w-full p-2 px-8 rounded-2xl shadow-shadow-primary-xsm flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
          {transaction.type === "credit" ? (
            <GiReceiveMoney className="w-6 h-6 text-[#37b24d]" />
          ) : (
            <GiPayMoney className="w-6 h-6 text-[#f03e3e]" />
          )}
          <div className="flex justify-center text-base gap-1.5">
            <span className=" text-gray-300">
              {transaction.type === "credit" ? "Recieved from: " : "Paid To:"}
            </span>
            <span className="font-medium">
              {" "}
              {transaction.type === "credit"
                ? transaction.from
                : transaction.to}
            </span>
          </div>
        </div>
        <span className="text-sm self-start">{formattedDate}</span>
      </div>
      <div>
        <div className="flex flex-col items-end">
          <span
            className={`text-lg flex items-center ${
              transaction.type === "credit"
                ? "text-[#37b24d]"
                : "text-[#f03e3e]"
            }`}
          >
            <BsCurrencyRupee />
            {transaction.amount}
          </span>
          <span className={`text-sm flex items-center gap-1`}>
            <span>Remaining Balance:</span>
            {transaction.balance}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
