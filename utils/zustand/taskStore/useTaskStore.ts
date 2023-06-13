import { create } from "zustand";
import { Client, ID, Databases, Query, Storage } from "appwrite";
import { toast } from "react-toastify";
import { ETaskStatuses, ITaskList, ITaskStore } from "./ITaskStore";
import { DropResult } from "react-beautiful-dnd";

const client = new Client();
const database = new Databases(client);
const storage = new Storage(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("647dc841ab72fff2362b"); // Your project ID

export const useTasksStore = create<ITaskStore>((set) => ({
  tasks: null,
  setTasks: (tasks) => {
    set({ tasks });
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

    if (taskStore.tasks)
      console.log(taskStore?.tasks, taskStore?.tasks[status]?.totalLength);

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
        index:
          taskStore?.tasks && taskStore?.tasks[status]?.totalLength
            ? taskStore?.tasks[status]?.totalLength! + 1
            : 1,
      }
    );

    // if( taskStore?.tasks && taskStore?.tasks[status]){

    if (taskStore.tasks) {
      const updatedTasks = Object.assign(taskStore?.tasks, {});

      updatedTasks[status].tasks = [res, ...(updatedTasks[status].tasks || [])];

      taskStore.setTasks(updatedTasks);
    }

    setIsLoading(false);
    onSuccess();
  } catch (error: any) {
    input.setIsLoading(false);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const getTasks = async (input: {
  taskStore: ITaskStore;
  userId: string;
  realm: string;
}) => {
  try {
    const { realm, userId, taskStore } = input;

    const todoTasks = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID || "",
      [
        Query.equal("userId", userId),
        Query.equal("realm", realm),
        Query.equal("status", ETaskStatuses.todo),
        Query.limit(20),
        // Query.orderAsc("$id"),
        Query.orderAsc("index"),
        Query.orderDesc("$updatedAt"),

        // FILTERS
      ]
    );

    const inProgressTasks = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID || "",
      [
        Query.equal("userId", userId),
        Query.equal("realm", realm),
        Query.equal("status", ETaskStatuses["in-progress"]),
        Query.limit(20),
        // Query.orderAsc("$id"),
        Query.orderAsc("index"),
        Query.orderDesc("$updatedAt"),
      ]
    );

    const completedTasks = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID || "",
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID || "",
      [
        Query.equal("userId", userId),
        Query.equal("realm", realm),
        Query.equal("status", ETaskStatuses.completed),
        Query.limit(20),
        // Query.orderAsc("$id"),
        Query.orderAsc("index"),
        Query.orderDesc("$updatedAt"),
      ]
    );

    const tasks: ITaskList = {
      todo: {
        tasks: todoTasks.documents as any,
        tasksIsLoading: false,
        totalLength: todoTasks.total,
      },
      "in-progress": {
        tasks: inProgressTasks.documents as any,
        tasksIsLoading: false,
        totalLength: inProgressTasks.total,
      },
      completed: {
        tasks: completedTasks.documents as any,
        tasksIsLoading: false,
        totalLength: completedTasks.total,
      },
    };

    taskStore.setTasks(tasks);
  } catch (error: any) {
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const hanldeDragDrop = async (input: {
  taskStore: ITaskStore;
  result: DropResult;
}) => {
  try {
    const {
      result,
      taskStore: { tasks, setTasks },
    } = input;

    console.log(result);

    if (!result.destination?.droppableId || !tasks) return;

    const tasksCopy = Object.assign(tasks, {});

    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    )
      return;

    if (
      result.source.droppableId === result.destination.droppableId &&
      tasksCopy[result.source.droppableId as ETaskStatuses]
    ) {
      const removedElements = tasksCopy[
        result.source.droppableId as ETaskStatuses
      ]?.tasks?.splice(result.source.index, 1);

      // Insert the element at the desired position
      if (removedElements)
        tasksCopy[result.source.droppableId as ETaskStatuses]?.tasks?.splice(
          result.destination.index,
          0,
          removedElements[0]
        );
      setTasks(tasksCopy);
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
      tasksCopy[result.source.droppableId as ETaskStatuses] &&
      tasksCopy[result.destination.droppableId as ETaskStatuses]
    ) {
      const removedElements = tasksCopy[
        result.source.droppableId as ETaskStatuses
      ]?.tasks?.splice(result.source.index, 1);

      tasksCopy[result.source.droppableId as ETaskStatuses].totalLength =
        tasksCopy[result.source.droppableId as ETaskStatuses].totalLength! - 1;

      tasksCopy[result.destination.droppableId as ETaskStatuses].totalLength =
        tasksCopy[result.destination.droppableId as ETaskStatuses]
          .totalLength! + 1;

      // Insert the element at the desired position
      if (removedElements)
        tasksCopy[
          result.destination.droppableId as ETaskStatuses
        ]?.tasks?.splice(result.destination.index, 0, removedElements[0]);
      setTasks(tasksCopy);
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
