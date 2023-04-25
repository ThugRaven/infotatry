import { useToast } from '@chakra-ui/react';
import { AuthContext, AuthValue, User } from 'context/AuthContext';
import { useSignOut } from 'hooks/useSignOut';
import { ReactNode, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();
  const id = 'banned-toast';
  const handleSignOut = useSignOut('/login');

  const fetchUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
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

  const { isLoading, refetch } = useQuery<{ user: User }, Error>(
    ['user', user?.id],
    fetchUser,
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 15 * 1000, // 15 seconds
      onSuccess: (data) => {
        console.log('setUser');
        console.log(data);
        const user = data.user;

        if (user) {
          if (
            user.ban &&
            user.ban.duration &&
            user.ban.bannedAt &&
            (new Date(user.ban.bannedAt).getTime() + user.ban.duration >
              Date.now() ||
              user.ban.duration === -1)
          ) {
            setUser((state) => {
              if (state !== null && !toast.isActive(id)) {
                toast({
                  id,
                  title: 'Wystąpił błąd!',
                  description: 'Zostałeś zablokowany!',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
                handleSignOut();
              }
              return null;
            });
          } else {
            setUser({
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              roles: user.roles,
              ban: user.ban,
              stats: user.stats,
            });
          }
        } else {
          setUser(null);
        }
      },
    },
  );

  const authValue = useMemo<AuthValue>(() => {
    console.log('authValue update');
    return {
      user,
      status: isLoading
        ? 'loading'
        : user
        ? 'authenticated'
        : 'unauthenticated',
      refetch,
    };
  }, [user, isLoading, refetch]);

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
