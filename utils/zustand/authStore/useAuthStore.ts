import { create } from "zustand";
import { Client, Account, ID, Databases } from "appwrite";
import { toast } from "react-toastify";
import { IAuthStore, IUser } from "./authTypes";

const client = new Client();
const account = new Account(client);
const database = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("647dc841ab72fff2362b"); // Your project ID

export const useAuthStore = create<IAuthStore>((set) => ({
  loggedIn: false,
  user: null,
  setUser: (loggedIn, user) => {
    set({ loggedIn, user });
  },
}));

export const getUser = async (authStore: IAuthStore) => {
  try {
    const userDetails = await account.get();
    authStore.setUser(true, userDetails);
    console.log(userDetails);
  } catch (error: any) {
    authStore.setUser(false, null);
  }
};

export const signUp = async (
  name: string,
  email: string,
  password: string,
  authStore: IAuthStore
) => {
  try {
    const userDetails = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    const profileRes = await database.createDocument(
      "647e598757fffd819407",
      "647f9d0051f0ebff84be",
      ID.unique(),
      {
        name,
        email,
        userId: userDetails?.$id,
      }
    );
    authStore.setUser(true, userDetails);
    console.log(profileRes);
    toast.success("Account created successfully");
  } catch (error: any) {
    console.log(error);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const loginUser = async (
  email: string,
  password: string,
  authStore: IAuthStore
) => {
  try {
    await account.createEmailSession(email, password);
    const userDetails = await account.get();
    authStore.setUser(true, userDetails);
    console.log(userDetails);
  } catch (error: any) {
    console.log(error);
    toast.error(error?.message || "Something Went Wrong!");
  }
};

export const logoutUser = async (authStore: IAuthStore) => {
  try {
    console.log(await account.deleteSessions());
    authStore.setUser(false, null);
  } catch (error: any) {
    console.log(error);
    toast.error(error?.message || "Something Went Wrong!");
  }
};
