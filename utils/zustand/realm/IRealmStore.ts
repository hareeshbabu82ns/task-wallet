export type IRealmStore = {
  currentRealm: IRealm | null;
  realms: IRealm[] | null;
  setCurrentRealm: (currentRealm: IRealm | null) => void;
  setRealms: (realms: IRealm[] | null) => void;
};

export type IRealm = {
  name: string;
  id: string;
  userId: string;
  description?: string;
};
