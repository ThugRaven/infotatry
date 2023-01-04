import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import s from '@styles/Hikes.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const register = async (registerForm: RegisterForm) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });

      if (!response.ok) {
        const data = await response.json();
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

  const registerMutation = useMutation(register);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerMutation.mutate(
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
      <form onSubmit={handleRegister}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={name}
            mb={2}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
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
          Register
        </Button>
      </form>
    </div>
  );
};

Register.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Register;
