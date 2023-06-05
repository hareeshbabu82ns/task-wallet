import { create } from "zustand";
import { Client, Account, ID } from "appwrite";
import { toast } from "react-toastify";
import { IAuthStore, IUser } from "./authTypes";

const client = new Client();
const account = new Account(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("6478b7591a8b5aab1527"); // Your project ID

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
    authStore.setUser(true, userDetails);
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
