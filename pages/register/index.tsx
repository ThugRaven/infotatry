import { useToast } from '@chakra-ui/react';
import { Logo } from '@components/common';
import { GridLayout } from '@components/layouts';
import { Button, Input } from '@components/ui';
import s from '@styles/Register.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';
import { z } from 'zod';
import image_2 from '../../public/image_2.jpg';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const router = useRouter();

  const register = async (registerForm: RegisterForm) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerForm),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
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

  const registerMutation = useMutation(register);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const nameSchema = z.string().min(3, {
        message: 'Nazwa użytkownika musi mieć co najmniej 3 znaki!',
      });
      const emailSchema = z
        .string()
        .email({ message: 'Niepoprawny adres email!' });
      const passwordSchema = z
        .string()
        .min(3, { message: 'Hasło musi mieć co najmniej 3 znaki!' });
      const _name = nameSchema.parse(name);
      const _email = emailSchema.parse(email);
      const _password = passwordSchema.parse(password);

      registerMutation.mutate(
        { name: _name, email: _email, password: _password },
        {
          onSuccess: (data) => {
            router.push('/');
            console.log(data);
            console.log(data && data._id);
          },
        },
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Wystąpił błąd!',
          description: error.issues[0].message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <div className={s.container}>
        <form onSubmit={handleRegister} className={s.login__form}>
          <Link href={'/'} className={s.logo}>
            <Logo />
          </Link>
          <span className={s.action}>Zarejestruj się</span>
          <Input
            type="text"
            name="name"
            placeholder="Nazwa użytkownika"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            name="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button>Zarejestruj się</Button>
          <div className={s.divider}>
            <span className={s.divider__text}>lub</span>
          </div>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`}>
            <Button variant="outline" className={s.google} type="button">
              Zaloguj się przez Google
            </Button>
          </a>
          <span className={s.register}>
            Masz konto?{' '}
            <Link href={'/login'} className={s.register__link}>
              Zaloguj się
            </Link>
          </span>
        </form>
      </div>
      <div className={s.image__wrapper}>
        <Image
          className={s.image}
          src={image_2}
          alt="Giewont"
          fill
          sizes="(max-width: 1024px) 100vw,
              50vw"
          placeholder="blur"
        />
      </div>
    </>
  );
};

Register.getLayout = function getLayout(page: ReactElement) {
  return <GridLayout>{page}</GridLayout>;
};

export default Register;
