import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useAuth } from './useAuth';

export const useSignOut = () => {
  const auth = useAuth();
  const router = useRouter();

  const signOutFetch = async () => {
    try {
      const response = await fetch(`http://localhost:8080/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        // const data = await response.json();
        throw new Error(response.status.toString());
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const signOutMutation = useMutation(signOutFetch);

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: (data) => {
        console.log(data);
        console.log(data && data._id);

        if (auth.refetch) {
          auth.refetch();
          return router.push('/');
        }
        return router.push('/login');
      },
    });
  };

  return handleSignOut;
};
