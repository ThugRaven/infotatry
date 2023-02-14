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

  const signInFetch = async (signInForm: SignInForm) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInForm),
        credentials: 'include',
      });

      if (!response.ok) {
        // const data = await response.json();
        throw new Error(response.status.toString());
      }

      console.log(response);

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
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
            return router.push('/');
          }
          return router.push('/login');
        },
      },
    );
  };

  return handleSignIn;
};
