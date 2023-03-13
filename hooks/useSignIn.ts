import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useAuth } from './useAuth';

interface SignInForm {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const auth = useAuth();
  const router = useRouter();
  const toast = useToast();

  const signInFetch = async (signInForm: SignInForm) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signInForm),
          credentials: 'include',
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || response.status.toString());
      }

      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast({
          title: 'Wystąpił błąd!',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw new Error(error.message);
      }
    }
  };

  const signInMutation = useMutation(signInFetch);

  const handleSignIn = ({ email, password }: SignInForm) => {
    signInMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log(data);
          console.log(data && data._id);

          if (auth.refetch) {
            auth.refetch();
            toast.closeAll();
            return router.push('/');
          }
          return router.push('/login');
        },
      },
    );
  };

  return handleSignIn;
};
