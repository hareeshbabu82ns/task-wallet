import { create } from "zustand";
import { Client, ID, Databases, Query, Storage } from "appwrite";
import { toast } from "react-toastify";
import { ETaskStatuses, ITaskList, ITaskStore } from "./ITaskStore";

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
  const { realm, userId, taskStore } = input;

  const todoTasks = await database.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID || "",
    process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID || "",
    [
      Query.equal("userId", userId),
      Query.equal("realm", realm),
      Query.equal("status", ETaskStatuses.todo),
      Query.limit(20),
      Query.orderDesc("$id"),
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
      Query.orderDesc("$id"),
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
      Query.orderDesc("$id"),
    ]
  );

  const tasks: ITaskList = {
    todo: {
      tasks: todoTasks.documents as any,
      tasksIsLoading: false,
    },
    "in-progress": {
      tasks: inProgressTasks.documents as any,
      tasksIsLoading: false,
    },
    completed: {
      tasks: completedTasks.documents as any,
      tasksIsLoading: false,
    },
  };

  taskStore.setTasks(tasks);
};
