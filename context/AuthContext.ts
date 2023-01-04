import { createContext } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type AuthValue = {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  refetch?: () => void;
};

export const AuthContext = createContext<AuthValue>({
  user: null,
  status: 'unauthenticated',
});
