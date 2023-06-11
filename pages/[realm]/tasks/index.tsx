import NewTaskModal from "@/components/pages/Task/NewTaskModal";
import TaskPageHeader from "@/components/pages/Task/TaskPageHeader";
import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";

const TasksPage = () => {
  const [newTransactionModal, setNewTransactionModal] = useState(false);

  return (
    <div className="p-20 py-6 relative flex flex-col gap-10 h-fit">
      <button
        onClick={() => setNewTransactionModal(true)}
        className="p-1 bg-gradient-to-b from-primary to-secondary justify-center flex items-center gap-2 fixed rounded-full right-[4rem] bottom-[4rem]"
      >
        <IoIosAdd className="w-8 h-8" />
      </button>
      <NewTaskModal
        setOpen={setNewTransactionModal}
        open={newTransactionModal}
      />{" "}
      <TaskPageHeader />
    </div>
  );
};

export default TasksPage;
