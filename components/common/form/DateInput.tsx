import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { RxChevronDown } from "react-icons/rx";
import { motion } from "framer-motion";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DateInput = () => {
  const [showCalender, setShowCalender] = useState(false);

  const [selectedDay, setSelectedDay] = useState<null | dayjs.Dayjs>(null);

  useEffect(() => {
    // Function to be executed on click
    const handleClick = () => {
      // Perform your desired action here
      setShowCalender(false);
      console.log("as");
    };

    // Add event listener to the document
    document.addEventListener("click", handleClick);

    // Cleanup function to remove the event listener
    return () => {
      try {
        document.removeEventListener("click", handleClick);
      } catch (error) {
        console.log("AS");
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 relative z-50">
      <label
        className="text-grey-light"
        // htmlFor={`form-${lable.toLowerCase().split(" ").join("-")}`}
        // style={{ color: labelModifier }}
      >
        {"Due Date"}
      </label>
      <div
        onClick={(e) => {
          setShowCalender(!showCalender);
          e.stopPropagation();
        }}
        className="relative h-fit cursor-pointer z-50 flex w-full items-center bg-bg-primary  input2 rounded-lg px-3 py-1.5 shadow-shadow-form-input !bg-transparent autofill:shadow-shadow-form-autofill autofill:!text-red-200 outline-0 outline-offset-2 focus:outline-blue-700"
      >
        {!selectedDay ? "Select Date" : selectedDay.format("DD/MM/YYYY")}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <RxChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
        <motion.div
          animate={showCalender ? "open" : "closed"}
          variants={{
            open: { opacity: 1, y: 0, pointerEvents: "all" },
            closed: { opacity: 0, y: "-20%", pointerEvents: "none" },
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full !bg-bg-primary-light !scale-[.8] rounded-lg z-50 !absolute top-full left-[0%]  -translate-y-[7%]"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              onChange={(e) => {
                setShowCalender(false);
                setSelectedDay(e);
              }}
              className="!bg-bg-primary-light !text-white rounded-lg !z-50"
              defaultValue={dayjs(new Date().toISOString())}
            />{" "}
          </LocalizationProvider>
        </motion.div>
      </div>
    </div>
  );
};

export default DateInput;
