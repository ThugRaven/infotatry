import { AuthContext, AuthValue, User } from 'context/AuthContext';
import { ReactNode, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        console.log('user', data);
        throw new Error(data.message);
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const { isLoading, refetch } = useQuery<any, Error>(
    ['user', user?.id],
    fetchUser,
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 15 * 1000, // 15 seconds
      onSuccess: (data) => {
        console.log('setUser');
        console.log(data);
        if (data.user) {
          setUser({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.image,
          });
        } else {
          setUser(null);
        }
      },
    },
  );

  const authValue = useMemo<AuthValue>(() => {
    console.log('useMemo update');
    return {
      user,
      status: isLoading
        ? 'loading'
        : user
        ? 'authenticated'
        : 'unauthenticated',
      refetch,
    };
  }, [user, isLoading]);

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
