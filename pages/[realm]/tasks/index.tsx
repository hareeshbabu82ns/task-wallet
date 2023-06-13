import Kanban from "@/components/pages/Task/Kanban";
import NewTaskModal from "@/components/pages/Task/NewTaskModal";
import TaskPageHeader from "@/components/pages/Task/TaskPageHeader";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import { getTasks } from "@/utils/zustand/taskStore/useTaskStore";
import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";

const TasksPage = () => {
  const [newTransactionModal, setNewTransactionModal] = useState(false);

  const { user } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);

  useEffect(() => {
    if (currentRealm && user) {
      getTasks({ userId: user.$id, realm: currentRealm.name });
    }
  }, [user, currentRealm]);

  return (
    <div className="p-10 py-3 relative flex flex-col gap-10 grow h-fit">
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
      <Kanban />
    </div>
  );
};

export default TasksPage;
