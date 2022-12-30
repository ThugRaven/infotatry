import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import s from '@styles/Hikes.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';

interface LoginForm {
  name: string;
  email: string;
  password: string;
}

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const login = async (loginForm: LoginForm) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
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

  const loginMutation = useMutation(login);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(
      { name, email, password },
      {
        onSuccess: (data) => {
          router.push('/');
          console.log(data);
          console.log(data && data._id);
          if (data) {
            // router.push(`/hikes/completed/${data._id}`);
          }
        },
      },
    );
  };

  return (
    <div className={s.container}>
      <form onSubmit={handleLogin}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={email}
            mb={2}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={password}
            mb={2}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" mr={3} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Login;
