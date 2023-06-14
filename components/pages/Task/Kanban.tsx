import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import { ETaskStatuses } from "@/utils/zustand/taskStore/ITaskStore";
import {
  getTasks,
  hanldeDragDrop,
  useTasksStore,
} from "@/utils/zustand/taskStore/useTaskStore";
import React, { useEffect, useState } from "react";
import { BsCircleHalf } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import * as TbIcons from "react-icons/tb";
import TaskCard from "./TaskCard";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { TaskFilters } from "@/pages/[realm]/tasks";

const boards = [
  {
    heading: "Todo",
    enum: ETaskStatuses["todo"],
    icon: (
      <TbIcons.TbCircleDotted className="w-[22px] h-[22px] fill-[#adb5bd]" />
    ),
  },
  {
    heading: "In-Progess",
    enum: ETaskStatuses["in-progress"],
    icon: <BsCircleHalf className="w-[19px] h-[19px] fill-primary" />,
  },
  {
    heading: "Completed",
    enum: ETaskStatuses["completed"],
    icon: <FaCheckCircle className="w-[19px] h-[19px] fill-lime-500" />,
  },
];

const Kanban: React.FC<{ filters?: TaskFilters }> = ({ filters }) => {
  const taskStore = useTasksStore((s) => s);

  return (
    <div className="w-full h-full grow gap-10 overflow-hidden flex justify-between">
      <DragDropContext
        onDragEnd={(res) => hanldeDragDrop({ result: res, taskStore })}
      >
        {boards.map((board) => (
          <TasksColumn filters={filters} key={board.enum} {...board} />
        ))}
      </DragDropContext>
    </div>
  );
};

export default Kanban;

const TasksColumn: React.FC<{
  heading: string;
  enum: ETaskStatuses;
  icon: React.JSX.Element;
  filters?: TaskFilters;
}> = (props) => {
  const taskStore = useTasksStore((s) => s);

  const { user } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeOut: NodeJS.Timeout;

    if (currentRealm && user && !isLoading) {
      timeOut = setTimeout(() => {
        getTasks({
          setIsLoading: setIsLoading,
          taskStore,
          userId: user.$id,
          realm: currentRealm.name,
          status: props.enum,
          filters: props.filters,
        });
      }, 500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [user, currentRealm, props.filters]);

  return (
    <Droppable droppableId={props.enum}>
      {(droppableProvided, droppableSnapshot) => (
        <div
          className="w-full h-full relative shadow-shadow-form-input rounded-2xl overflow-auto pb-3"
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
        >
          <div className="w-full shadow-shadow-primary-sm mb-6 sticky top-0 left-0 px-8 py-3 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <span className="text-lg">{props.heading}</span>
              {props.icon}
            </div>
            <span className="bg-bg-primary-light px-3 rounded-xl">
              {taskStore[props.enum] && taskStore[props.enum]?.totalLength}
            </span>
          </div>
          <div className="flex flex-col gap-4 px-6">
            {taskStore[props.enum] &&
              !isLoading &&
              taskStore[props.enum]?.tasks?.map((e, i) => (
                <TaskCard task={e} key={e.$id} index={i} />
              ))}
          </div>
          {droppableProvided.placeholder}
          {isLoading && <TodoSkeleton />}
        </div>
      )}
    </Droppable>
  );
};

const TodoSkeleton = () => {
  return (
    <div className="w-full h-fit flex flex-col gap-4 px-6 mt-4">
      <Skeleton
        className="w-full h-32 shadow-shadow-primary-xsm"
        baseColor="#212529"
        highlightColor="#202020"
      ></Skeleton>
      <Skeleton
        className="w-full h-24 shadow-shadow-primary-xsm"
        baseColor="#212529"
        highlightColor="#202020"
      ></Skeleton>
      <Skeleton
        className="w-full h-48 shadow-shadow-primary-xsm"
        baseColor="#212529"
        highlightColor="#202020"
      ></Skeleton>
    </div>
  );
};
