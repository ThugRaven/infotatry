import { signIn } from '@lib/auth-utils';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useAuth } from './useAuth';

interface SignInForm {
  name: string;
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

  const handleSignIn = ({ name, email, password }: SignInForm) => {
    signInMutation.mutate(
      { name, email, password },
      {
        onSuccess: (data) => {
          console.log(data);
          console.log(data && data._id);
          signIn(auth.refetch, router);
        },
      },
    );
  };

  return handleSignIn;
};
