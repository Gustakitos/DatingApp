import React, { ReactNode, createContext, useState } from 'react';
import { Member } from './models/Member';

type UserContextValue = {
  photoUrl: string | null;
  setPhotoUrl: (url: string | null) => void;
  memberList: Member[];
  setMemberList: (memberList: Member[]) => void;
};

const initialContextValue: UserContextValue = {
  photoUrl: null,
  setPhotoUrl: () => {},
  memberList: [],
  setMemberList: () => {},
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextValue>(
  initialContextValue
);

export function UserProvider({ children }: UserProviderProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [memberList, setMemberList] = useState<Member[]>([]);

  console.log("list: ", memberList);

  return (
    <UserContext.Provider value={{ photoUrl, setPhotoUrl, memberList, setMemberList }}>
      {children}
    </UserContext.Provider>
  );
};
