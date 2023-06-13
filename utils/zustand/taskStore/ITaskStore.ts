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
  tasks: {
    todo: {
      tasks: ITask[] | null;
      tasksIsLoading: boolean;
    };
    "in-progress": {
      tasks: ITask[] | null;
      tasksIsLoading: boolean;
    };
    completed: {
      tasks: ITask[] | null;
      tasksIsLoading: boolean;
    };
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
  priority: string;
  realm: string;
  status: string;
  tags: string[];
  title: string;
  userId: string;
};
