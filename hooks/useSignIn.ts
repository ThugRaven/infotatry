import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { z } from 'zod';
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
        if (data.message === 'User banned' && data.until) {
          const until =
            data.until === -1
              ? 'permanentnie'
              : `do dnia ${new Date(data.until).toLocaleString()}`;
          throw new Error(
            `Użytkownik zablokowany ${until}${
              data.reason && `\nPowód: ${data.reason}`
            }`,
          );
        }
        throw new Error(data.message || response.status.toString());
      }

      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast({
          title: 'Wystąpił błąd!',
          description:
            error.message === 'User not found'
              ? 'Użytkownik nie znaleziony'
              : error.message === 'Provider'
              ? 'Użytkownik utworzony przy pomocy zewnętrznego dostawcy'
              : error.message === 'Incorrect password'
              ? 'Niepoprawne hasło'
              : error.message,
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
    try {
      const emailSchema = z
        .string()
        .email({ message: 'Niepoprawny adres email!' });
      const passwordSchema = z
        .string()
        .min(3, { message: 'Hasło musi mieć co najmniej 3 znaki!' });
      const _email = emailSchema.parse(email);
      const _password = passwordSchema.parse(password);

      signInMutation.mutate(
        { email: _email, password: _password },
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0].message;
      }
    }
  };

  return handleSignIn;
};
