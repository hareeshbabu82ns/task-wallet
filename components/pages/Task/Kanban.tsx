import React from "react";

const Kanban = () => {
  return (
    <div className="w-full h-full grow gap-10 flex justify-between">
      <TasksColumn heading="Todo" />
      <TasksColumn heading="In-Progress" />
      <TasksColumn heading="Completed" />
    </div>
  );
};

export default Kanban;

const TasksColumn: React.FC<{ heading: string }> = () => {
  return (
    <div className="w-full h-full shadow-shadow-form-input rounded-2xl"></div>
  );
};
