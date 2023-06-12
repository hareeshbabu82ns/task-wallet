import useInput from "@/hooks/useInput";
import {
  getTransactions,
  useWalletStore,
} from "@/utils/zustand/walletStore/useWalletStore";
import React, { useEffect, useState } from "react";
import * as BsIcons from "react-icons/bs";
import * as GiIcons from "react-icons/gi";
import * as IoIcons from "react-icons/io5";
import FilterOptions from "@/components/common/filters/FilterOptions";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import { Popover } from "@headlessui/react";
import { motion } from "framer-motion";
import { RxChevronDown } from "react-icons/rx";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const transactionTypes = [
  { name: "All", value: "" },
  { name: "Credit", value: "credit" },
  { name: "Debit", value: "debit" },
];

const transactionMethods = [
  { name: "All", value: "" },
  { name: "Online", value: "online" },
  { name: "Cash", value: "cash" },
];

const WalletHeader = () => {
  const transactionTypeInput = useInput<string>(() => {
    return true;
  }, transactionTypes[0].name);

  const transactionMethodInput = useInput<string>(() => {
    return true;
  }, transactionMethods[0].name);

  const walletStore = useWalletStore((s) => s);

  const { user } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);

  const { balance, credit, debit } = walletStore;

  const [selectedDay, setSelectedDay] = useState<null | dayjs.Dayjs>(null);

  const [showCalender, setShowCalender] = useState(false);

  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (currentRealm && user) {
      getTransactions({
        walletStore,
        realm: currentRealm?.name,
        userId: user?.$id,
        filters: {
          transactionType:
            transactionTypeInput.value === "All"
              ? undefined
              : transactionTypeInput.value.toLowerCase(),
          transactionMedthod:
            transactionMethodInput.value === "All"
              ? undefined
              : transactionMethodInput.value.toLowerCase(),
          toDate: selectedDay ? selectedDay.toISOString() : undefined,
          search: input ? input : undefined,
        },
      });
    }
  }, [
    transactionTypeInput.value,
    transactionMethodInput.value,
    selectedDay,
    input,
  ]);

  useEffect(() => {
    // Function to be executed on click
    const handleClick = () => {
      // Perform your desired action here
      setShowCalender(false);
    };

    // Add event listener to the document
    document.addEventListener("click", handleClick);

    // Cleanup function to remove the event listener
    return () => {
      try {
        document.removeEventListener("click", handleClick);
      } catch (error) {}
    };
  }, []);

  return (
    <div className="w-full py-3 justify-center gap-14  inset-0 flex">
      <div className="grow flex flex-col gap-2">
        <div className="relative">
          <input
            onChange={handleInputChange}
            className="w-full pl-12 autofill:!text-red-200 outline-1 outline-offset-2 focus:outline-none bg-bg-primary shadow-shadow-form-input rounded-2xl py-2"
          />
          <IoIcons.IoSearch className="absolute top-1/2 -translate-y-1/2 left-4 min-w-5 min-h-5" />
        </div>
        <div className="ml-auto flex gap-3">
          <FilterOptions
            multiple={false}
            {...transactionMethodInput}
            label="Online/Cash"
            options={transactionMethods}
          />
          <FilterOptions
            multiple={false}
            {...transactionTypeInput}
            options={transactionTypes}
            label="Cred/Debt"
          />
          <div
            onClick={(e) => {
              console.log(showCalender);
              setShowCalender(!showCalender);
              e.stopPropagation();
            }}
            className="relative cursor-pointer z-10 flex w-full min-w-[9rem] max-w-[9rem] items-center  rounded-lg bg-bg-primary px-3 py-1.5 shadow-shadow-form-input outline-1 outline-offset-2 focus:!outline-blue-700"
          >
            {!selectedDay ? "Select Date" : selectedDay.format("DD/MM/YYYY")}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <RxChevronDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
            <motion.div
              animate={showCalender ? "open" : "closed"}
              variants={{
                open: { opacity: 1, y: 0, pointerEvents: "all" },
                closed: { opacity: 0, y: "-20%", pointerEvents: "none" },
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full !bg-bg-primary-light !scale-[.8] rounded-lg !absolute top-full -translate-x-[15%] -translate-y-[7%]"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  onChange={(e) => setSelectedDay(e)}
                  className="!bg-bg-primary-light !text-white rounded-lg"
                  defaultValue={dayjs("2022-04-17")}
                />{" "}
              </LocalizationProvider>
            </motion.div>
          </div>
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
