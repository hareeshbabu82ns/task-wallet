import Kanban from "@/components/pages/Task/Kanban";
import NewTaskModal from "@/components/pages/Task/NewTaskModal";
import TaskPageHeader from "@/components/pages/Task/TaskPageHeader";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import {
  getTasks,
  useTasksStore,
} from "@/utils/zustand/taskStore/useTaskStore";
import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";

export type TaskFilters = {
  keyword?: string;
  priority?: string;
};

const TasksPage = () => {
  const [newTransactionModal, setNewTransactionModal] = useState(false);

  const [filters, setFilters] = useState<TaskFilters | null>(null);

  return (
    <div className="p-10 py-6 relative flex flex-col gap-10 h-full">
      <button
        onClick={() => setNewTransactionModal(true)}
        className="p-1 bg-gradient-to-b z-10 from-primary to-secondary justify-center flex items-center gap-2 fixed rounded-full right-[4rem] bottom-[4rem]"
      >
        <IoIosAdd className="w-8 h-8" />
      </button>
      <NewTaskModal
        setOpen={setNewTransactionModal}
        open={newTransactionModal}
      />{" "}
      <TaskPageHeader filters={filters || undefined} setFilters={setFilters} />
      <Kanban filters={filters || undefined} />
    </div>
  );
};

export default TasksPage;
