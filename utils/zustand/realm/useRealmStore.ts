import { create } from "zustand";
import { Client, Account, ID, Databases, Query } from "appwrite";
import { toast } from "react-toastify";
import { z } from "zod";
import { IRealm, IRealmStore } from "./IRealmStore";

const client = new Client();
const account = new Account(client);
const database = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("647dc841ab72fff2362b"); // Your project ID

export const useRealmStore = create<IRealmStore>((set) => ({
  currentRealm: null,
  realms: null,
  setCurrentRealm: (currentRealm) => {
    set({ currentRealm });
  },
  setRealms: (realms) => {
    set({ realms });
  },
}));

export const createRealm = async (
  name: string,
  description: string,
  userId: string,
  realmStore: IRealmStore
) => {
  try {
    const res = await database.createDocument(
      "647e598757fffd819407",
      "647e598d8ec64b37fb3a",
      ID.unique(),
      {
        name,
        description,
        userId,
      }
    );
    toast.success("Realm created successfully");
    console.log(res);
  } catch (error: any) {
    console.log(error);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const getRealms = async (userId: string, realmStore: IRealmStore) => {
  try {
    const res: any = await database.listDocuments(
      "647e598757fffd819407",
      "647e598d8ec64b37fb3a",
      [Query.limit(10)]
    );

    console.log(res);

    const realms = res.documents.map((e: any) => {
      return { name: e.name, description: e.description, userId: e.userId };
    });
    toast.success("Realm fetched successfully");
    realmStore.setRealms(realms);
    console.log(res);
  } catch (error: any) {
    console.log(error);
    toast.error(error?.message || "Something Went Wrong!");
  }
};
