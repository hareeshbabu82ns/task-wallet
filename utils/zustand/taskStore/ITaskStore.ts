export enum ETaskStatuses {
  todo = "todo",
  "in-progress" = "in-progress",
  completed = "completed",
}

export enum ETaskPriorities {
  uergent = "urgent",
  high = "high",
  medium = "medium",
  low = "low",
}

export type ITaskStore = {
  tasks: ITaskList | null;
  setTasks: (allTasks: ITaskList) => void;
};

export type ITaskList = {
  todo: {
    tasks: ITask[] | null;
    tasksIsLoading: boolean;
    totalLength: number | null;
  };
  "in-progress": {
    tasks: ITask[] | null;
    tasksIsLoading: boolean;
    totalLength: number | null;
  };
  completed: {
    tasks: ITask[] | null;
    tasksIsLoading: boolean;
    totalLength: number | null;
  };
};

export type ITask = {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $updatedAt: string;
  completedOn: null;
  description: string;
  dueDate: null;
  images: string[];
  keywords: string;
  priority: ETaskPriorities;
  realm: string;
  status: ETaskStatuses;
  tags: string[];
  title: string;
  userId: string;
};
