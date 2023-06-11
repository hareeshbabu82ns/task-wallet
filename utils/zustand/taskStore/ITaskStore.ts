export type ITaskStore = {
  allTasks: TaskList[] | null;
  setAllTasks: (allTasks: TaskList[]) => void;
};

export type TaskList = {
  status: string;
  isLoading: boolean;
  tasks: [];
};
