export type IAuthStore = {
  loggedIn: boolean;
  user: null | IUser;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (loggedIn: boolean, user: IUser | null) => void;
};

export type IUser = {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  email: string;
  emailVerification: boolean;
  name: string;
  passwordUpdate: string;
  phone: string;
  phoneVerification: boolean;
  prefs?: { role?: string };
  registration: string;
  status: boolean;
};
