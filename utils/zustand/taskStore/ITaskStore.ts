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
  todo: ITaskListInfo | null;
  setTodo: (todo: ITaskListInfo) => void;
  "in-progress": ITaskListInfo | null;
  setInProgress: (inProgress: ITaskListInfo) => void;
  completed: ITaskListInfo | null;
  setCompleted: (completed: ITaskListInfo) => void;
};

export type ITaskListInfo = {
  tasks: ITask[] | null;
  hasMore: boolean;
  totalLength: number | null;
  page: number | null;
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
