import { create } from "zustand";
import { Client, ID, Databases, Query, Storage } from "appwrite";
import { toast } from "react-toastify";
import { ETaskStatuses, ITaskStore, ITask, ITaskListInfo } from "./ITaskStore";
import { DropResult } from "react-beautiful-dnd";
import { Dispatch, SetStateAction } from "react";

const client = new Client();
const database = new Databases(client);
const storage = new Storage(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("647dc841ab72fff2362b"); // Your project ID

export const useTasksStore = create<ITaskStore>((set) => ({
  todo: null,
  setTodo: (todo) => {
    set({ todo });
  },
  "in-progress": null,
  setInProgress: (inProgress) => {
    set({ "in-progress": inProgress });
  },
  completed: null,
  setCompleted: (completed) => {
    set({ completed });
  },
}));

export const createTask = async (input: {
  taskStore: ITaskStore;
  userId: string;
  realm: string;
  status: ETaskStatuses;
  priority: string;
  title: string;
  description: string;
  onSuccess: () => void;
  images?: File[];
  dueDate?: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const {
      description,
      priority,
      realm,
      status,
      title,
      userId,
      images,
      setIsLoading,
      onSuccess,
      taskStore,
    } = input;

    setIsLoading(true);

    const imagesUrl: string[] = [];

    if (images) {
      await Promise.all(
        images.map(async (file) => {
          const promise = await storage.createFile(
            process.env.NEXT_PUBLIC_STORAGE_ID || "",
            ID.unique(),
            file
          );
          imagesUrl.push(
            `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_STORAGE_ID}/files/${promise.$id}/view?project=647dc841ab72fff2362b`
          );
        })
      );
    }

    // if (taskStore[status])
    //   console.log(taskStore?.tasks, taskStore?.tasks[status]?.totalLength);

    const res: any = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID || "",
      ID.unique(),
      {
        userId: userId,
        realm: realm,
        title,
        status,
        priority,
        description: description,
        keywords: `${title}`,
        images: imagesUrl,
        index: (taskStore[status]?.totalLength || 0) + 1,
      }
    );

    // if( taskStore?.tasks && taskStore?.tasks[status]){

    if (taskStore[status]) {
      const updateTaskFunction =
        (status === "in-progress" && taskStore.setInProgress) ||
        (status === "todo" && taskStore.setTodo);
      status === "completed" && taskStore.setCompleted;

      const updatedTasks: ITaskListInfo = Object.assign(taskStore[status]!, {});
      updatedTasks.tasks = [res, ...updatedTasks.tasks!];

      if (updateTaskFunction) updateTaskFunction(updatedTasks);
    }

    setIsLoading(false);
    onSuccess();
  } catch (error: any) {
    input.setIsLoading(false);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const hanldeDragDrop = async (input: {
  taskStore: ITaskStore;
  result: DropResult;
}) => {
  try {
    const { result, taskStore } = input;

    console.log(result);

    if (!result.destination?.droppableId) return;

    const sourceTasksColumn = Object.assign(
      taskStore[result.source.droppableId as ETaskStatuses]!,
      {}
    );

    const setSourceTasksFunction =
      (result.source.droppableId === "in-progress" &&
        taskStore.setInProgress) ||
      (result.source.droppableId === "todo" && taskStore.setTodo) ||
      (result.source.droppableId === "completed" && taskStore.setCompleted);

    const destinationTasksColumn = Object.assign(
      taskStore[result.destination.droppableId as ETaskStatuses]!,
      {}
    );

    const setDestinationTasksFunction =
      (result.destination.droppableId === "in-progress" &&
        taskStore.setInProgress) ||
      (result.destination.droppableId === "todo" && taskStore.setTodo) ||
      (result.destination.droppableId === "completed" &&
        taskStore.setCompleted);

    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    )
      return;

    if (
      result.source.droppableId === result.destination.droppableId &&
      taskStore[result.source.droppableId as ETaskStatuses] &&
      sourceTasksColumn &&
      destinationTasksColumn
    ) {
      const removedElements = sourceTasksColumn.tasks?.splice(
        result.source.index,
        1
      );

      // Insert the element at the desired position
      if (removedElements)
        destinationTasksColumn.tasks?.splice(
          result.destination.index,
          0,
          removedElements[0]
        );
      if (setDestinationTasksFunction)
        setDestinationTasksFunction(destinationTasksColumn);
      await database.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID || "",
        process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID || "",
        result.draggableId,
        {
          index: result.destination.index,
        }
      );
    }

    if (
      result.source.droppableId !== result.destination.droppableId &&
      sourceTasksColumn &&
      destinationTasksColumn
    ) {
      const removedElements = sourceTasksColumn.tasks?.splice(
        result.source.index,
        1
      );

      sourceTasksColumn.totalLength = sourceTasksColumn.totalLength! - 1;

      destinationTasksColumn.totalLength =
        destinationTasksColumn.totalLength! + 1;

      // Insert the element at the desired position
      if (removedElements)
        destinationTasksColumn.tasks?.splice(
          result.destination.index,
          0,
          removedElements[0]
        );

      if (setDestinationTasksFunction)
        setDestinationTasksFunction(destinationTasksColumn);

      await database.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID || "",
        process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID || "",
        result.draggableId,
        {
          status: result.destination.droppableId,
          index: result.destination.index,
        }
      );
    }
  } catch (error: any) {
    // input.setIsLoading(false);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

// TEST

export const getTasks = async (input: {
  taskStore: ITaskStore;
  userId: string;
  realm: string;
  status: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  filters?: {
    priority?: string;
    keyword?: string;
    date?: string;
  };
}) => {
  try {
    const { realm, userId, taskStore, filters, status, setIsLoading } = input;

    console.log(filters);
    setIsLoading(true);
    const getQueryList = (status: string) => {
      return [
        Query.equal("userId", userId),
        Query.equal("realm", realm),
        Query.equal("status", status),
        Query.limit(20),
        // Query.orderAsc("$id"),
        Query.orderAsc("index"),
        Query.orderDesc("$updatedAt"),
      ];
    };

    const queries = getQueryList(status);

    if (filters?.priority) {
      queries.push(Query.equal("priority", filters.priority));
    }

    if (filters?.keyword) {
      queries.push(Query.search("keywords", filters.keyword));
    }

    const res: any = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID || "",
      queries
    );

    const taskList: ITaskListInfo = {
      tasks: res.documents as ITask[],
      hasMore: res.total > res.documents.length,
      totalLength: res.documents.length,
    };

    const setTasksFunction =
      (status === "in-progress" && taskStore.setInProgress) ||
      (status === "todo" && taskStore.setTodo) ||
      (status === "completed" && taskStore.setCompleted);

    if (setTasksFunction) setTasksFunction(taskList);
    setIsLoading(false);
  } catch (error: any) {
    input.setIsLoading(false);
    toast.error(error?.message || "Something Went Wrong!");
  }
};
