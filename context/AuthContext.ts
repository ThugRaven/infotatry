import { createContext } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  roles: string[];
  ban: Ban;
};

export type Ban = {
  duration: number | null;
  bannedAt: Date | null;
  reason?: string;
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
