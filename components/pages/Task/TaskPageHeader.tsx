import useInput from "@/hooks/useInput";
import { useWalletStore } from "@/utils/zustand/walletStore/useWalletStore";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as BsIcons from "react-icons/bs";
import * as GiIcons from "react-icons/gi";
import * as IoIcons from "react-icons/io5";
import FilterOptions from "@/components/common/filters/FilterOptions";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import {
  getTasks,
  useTasksStore,
} from "@/utils/zustand/taskStore/useTaskStore";
import { TaskFilters } from "@/pages/[realm]/tasks";

const taskPriorities = [
  { name: "All" },
  { name: "Urgent" },
  { name: "High" },
  { name: "Medium" },
  { name: "Low" },
];

const TaskPageHeader: React.FC<{
  filters?: TaskFilters;
  setFilters: Dispatch<SetStateAction<TaskFilters | null>>;
}> = ({ filters, setFilters }) => {
  const { user } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);

  const [filterChanged, setFilterChanged] = useState(false);

  const taskStore = useTasksStore((s) => s);

  const [keyword, setKeyword] = useState("");

  const taskPriorityInput = useInput<string>(() => {
    return true;
  }, taskPriorities[0].name);

  useEffect(() => {
    let timeOut: NodeJS.Timeout;

    if (currentRealm && user && filterChanged) {
      timeOut = setTimeout(() => {
        setFilters({
          priority:
            taskPriorityInput.value === "All"
              ? undefined
              : taskPriorityInput.value,
          keyword: keyword,
        });
      }, 500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [taskPriorityInput.value, filterChanged, keyword]);

  useEffect(() => {
    if (
      (!filterChanged && taskPriorityInput.value !== "All") ||
      keyword.length > 0
    )
      setFilterChanged(true);
  }, [taskPriorityInput.value, keyword]);

  return (
    <div className="w-full justify-end gap-4  inset-0 flex items-center">
      <h2 className="mb-2 px-2 text-xl font-medium mr-auto">Tasks</h2>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            onChange={(e) => setKeyword(e.target.value)}
            className="w-fit min-w-[18rem] pl-12 autofill:!text-red-200 outline-1 text-sm outline-offset-2 focus:!outline-blue-700 bg-bg-primary shadow-shadow-form-input rounded-lg py-1.5"
          />
          <IoIcons.IoSearch className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4" />
        </div>
      </div>
      <div className="">
        <FilterOptions
          multiple={false}
          label="Select Priority"
          {...taskPriorityInput}
          options={taskPriorities}
        />
      </div>
    </div>
  );
};

export default TaskPageHeader;
