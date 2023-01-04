import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import s from '@styles/Hikes.module.css';
import { useSignIn } from 'hooks/useSignIn';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { ReactElement, useState } from 'react';

interface LoginForm {
  name: string;
  email: string;
  password: string;
}

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignIn();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn({ name, email, password });
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
          Log in
        </Button>
      </form>
      <a href="http://localhost:8080/auth/login/google">
        <Button colorScheme="blue" mt={3}>
          Log in with Google
        </Button>
      </a>
    </div>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Login;
