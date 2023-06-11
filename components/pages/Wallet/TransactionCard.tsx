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
    <div className="w-full p-2 px-8 rounded-2xl shadow-shadow-primary-xsm gap-8 flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
          {transaction.type === "credit" ? (
            <GiReceiveMoney className="w-6 h-6 text-[#37b24d]" />
          ) : (
            <GiPayMoney className="w-6 h-6 text-[#f03e3e]" />
          )}
          <div className="flex justify-center text-base flex-col">
            <div className="flex gap-1.5">
              <span className=" text-gray-300">
                {transaction.type === "credit" ? "Recieved from: " : "Paid To:"}
              </span>
              <span className="font-medium flex flex-col items-start">
                {" "}
                <span>
                  {transaction.type === "credit"
                    ? transaction.from
                    : transaction.to}
                </span>
              </span>
            </div>
            <span className="text-sm ">{formattedDate}</span>
          </div>
        </div>
      </div>
      {/* <div className="flex self-end ml-auto flex-col justify-end text-sm">
        <span>{transaction.type}</span>
        <span>
          Method:{" "}
          {transaction.method.replace(
            transaction.method[0],
            transaction.method[0].toUpperCase()
          )}
        </span>
      </div> */}
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
            <span>
              {transaction.type === "credit" ? "+" : "-"}
              {transaction.amount}
            </span>
          </span>
          <span className={`text-sm gap-4 flex items-center`}>
            <span>
              Method:{" "}
              {transaction.method.replace(
                transaction.method[0],
                transaction.method[0].toUpperCase()
              )}
            </span>
            <span>
              <span>Updated Balance: </span>
              {transaction.balance}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
