import { useToast } from '@chakra-ui/react';
import Logo from '@components/common/Logo';
import GridLayout from '@components/layouts/GridLayout';
import { Input } from '@components/ui';
import Button from '@components/ui/Button';
import s from '@styles/Register.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';
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
    e.preventDefault();
    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: (data) => {
          router.push('/');
          console.log(data);
          console.log(data && data._id);
        },
      },
    );
  };

  return (
    <>
      <div className={s.container}>
        <form onSubmit={handleRegister} className={s.login__form}>
          <Link href={'/'}>
            <a className={s.logo}>
              <Logo />
            </a>
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
            <Link href={'/login'}>
              <a className={s.register__link}>Zaloguj się</a>
            </Link>
          </span>
        </form>
      </div>
      <div className={s.image__wrapper}>
        <Image
          className={s.image}
          src={image_2}
          alt="Giewont"
          layout="fill"
          objectFit="cover"
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
