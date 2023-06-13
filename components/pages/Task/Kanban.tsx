import React from "react";

const Kanban = () => {
  return (
    <div className="w-full h-full grow gap-10 overflow-hidden flex justify-between">
      <TasksColumn heading="Todo" />
      <TasksColumn heading="In-Progress" />
      <TasksColumn heading="Completed" />
    </div>
  );
};

export default Kanban;

const TasksColumn: React.FC<{ heading: string }> = () => {
  return (
    <div className="w-full h-full relative shadow-shadow-form-input rounded-2xl overflow-auto">
      <div className="w-full h-14 shadow-shadow-primary-sm sticky top-0 left-0"></div>
      <div className="w-full h-20 bg-slate-100"></div>
      <div className="w-full h-20 bg-slate-100"></div>
      <div className="w-full h-20 bg-slate-100"></div>
      <div className="w-full h-20 bg-slate-100"></div>
      <div className="w-full h-20 bg-slate-100"></div>
      <div className="w-full h-20 bg-slate-100"></div>
      <div className="w-full h-20 bg-slate-100"></div>
      <div className="w-full h-20 bg-slate-100"></div>
      <div className="w-full h-20 bg-slate-100"></div>
    </div>
  );
};
