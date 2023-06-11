import { create } from "zustand";
import { Client, Account, ID, Databases, Query } from "appwrite";
import { toast } from "react-toastify";
import { z } from "zod";
import { IRealm, IRealmStore } from "./IRealmStore";
import { Dispatch, SetStateAction } from "react";

const client = new Client();
const account = new Account(client);
const database = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID || ""); // Your project ID

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
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      "647e598d8ec64b37fb3a",
      ID.unique(),
      {
        name,
        description,
        userId,
      }
    );
    toast.success("Realm created successfully");
    const newRealm = {
      name,
      description,
      userId,
      id: res.$id,
    };
    realmStore.setCurrentRealm(newRealm);

    console.log(realmStore.currentRealm);

    if (realmStore.realms)
      realmStore.setRealms([...realmStore.realms, newRealm] || []);
    else realmStore.setRealms([newRealm]);
  } catch (error: any) {
    console.log(error);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const getRealms = async (
  userId: string,
  realmStore: IRealmStore,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true);
    const res: any = await database.listDocuments(
      "647e598757fffd819407",
      "647e598d8ec64b37fb3a",
      [Query.limit(100), Query.equal("userId", userId)]
    );

    const realms = res.documents.map((e: any) => {
      return { name: e.name, description: e.description, userId: e.userId };
    });
    toast.success("Realm fetched successfully");
    realmStore.setRealms(realms);
    setIsLoading(false);
  } catch (error: any) {
    console.log(error);
    setIsLoading(false);
    toast.error(error?.message || "Something Went Wrong!");
  }
};
