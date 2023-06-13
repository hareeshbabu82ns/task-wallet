import { ITask } from "@/utils/zustand/taskStore/ITaskStore";
import dayjs from "dayjs";
import Image from "next/image";
import React, { forwardRef } from "react";
import { Draggable } from "react-beautiful-dnd";

interface ComponetProps {
  task: ITask;
  index: number;
}

const TaskCard = forwardRef<HTMLDivElement, ComponetProps>(
  ({ task, index }) => {
    const clippedText =
      task.description.length >= 70
        ? task.description.slice(0, 70) + "..."
        : task.description;
    // return clippedText + '...'; // Add ellipsis sign

    return (
      <Draggable draggableId={task.$id} index={index}>
        {(draggableProvided, draggableSnapshot) => (
          <div
            className="w-full shadow-shadow-primary-xsm bg-bg-primary  py-2 pb-0 pt-4 relative rounded-lg flex flex-col"
            {...draggableProvided.dragHandleProps}
            {...draggableProvided.draggableProps}
            ref={draggableProvided.innerRef}
          >
            <div className="px-3">
              <span
                className={`absolute right-0 text-xs top-0 px-3 rounded-bl-lg border py-0.5 border-dashed rounded-tr-lg ${
                  task.priority === "urgent" && "border-[#FE2F48]"
                } ${task.priority === "high" && "border-[#fa5252]"} ${
                  task.priority === "medium" && "border-[#fcc419]"
                } ${task.priority === "low" && "border-[#868e96]"}`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="font-medium">{task.title}</span>
                <span className="text-text-secondary text-sm">
                  {clippedText}
                </span>

                {task.images.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {task.images.length > 0 &&
                      task.images.map((url) => (
                        <Image
                          key={url}
                          src={url}
                          width={58}
                          height={58}
                          alt="Task Image"
                          className="w-[4.5rem] rounded-lg h-[4.5rem] object-cover"
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="py-2 px-3 mt-4 border-t text-text-secondary border-border-primary flex justify-between items-center">
              <span className="text-xs">
                {dayjs(task.$createdAt).format("D MMMM YYYY")}
              </span>
              {task.dueDate && (
                <span className="text-xs">
                  Due date {dayjs(task.dueDate).format("D MMMM YYYY")}
                </span>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  }
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
