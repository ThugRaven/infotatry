import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useAuth } from './useAuth';

export const useSignOut = (callbackUrl?: string) => {
  const auth = useAuth();
  const router = useRouter();

  const signOutFetch = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      return data;
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
          return router.push(callbackUrl ?? '/');
        }
        return router.push('/login');
      },
    });
  };

  return handleSignOut;
};
