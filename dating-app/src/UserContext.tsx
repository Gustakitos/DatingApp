import React, { ReactNode, createContext, useState } from 'react';

type UserContextValue = {
  photoUrl: string | null;
  setPhotoUrl: (url: string | null) => void;
};

const initialContextValue: UserContextValue = {
  photoUrl: null,
  setPhotoUrl: () => {},
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextValue>(
  initialContextValue
);

export function UserProvider({ children }: UserProviderProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ photoUrl, setPhotoUrl }}>
      {children}
    </UserContext.Provider>
  );
};
