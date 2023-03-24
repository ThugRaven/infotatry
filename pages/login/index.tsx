import { useToast } from '@chakra-ui/react';
import Logo from '@components/common/Logo';
import GridLayout from '@components/layouts/GridLayout';
import { Input } from '@components/ui';
import Button from '@components/ui/Button';
import s from '@styles/Login.module.css';
import { useSignIn } from 'hooks/useSignIn';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement, useState } from 'react';
import image_1 from '../../public/image_1.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignIn();
  const toast = useToast();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password });

    const errorMessage = signIn({ email, password });

    if (errorMessage) {
      toast({
        title: 'Wystąpił błąd!',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <div className={s.container}>
        <form onSubmit={handleLogin} className={s.login__form}>
          <Link href={'/'}>
            <a className={s.logo}>
              <Logo />
            </a>
          </Link>
          <span className={s.action}>Zaloguj się</span>
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
          <Button>Zaloguj się</Button>
          <div className={s.divider}>
            <span className={s.divider__text}>lub</span>
          </div>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`}>
            <Button variant="outline" className={s.google} type="button">
              Zaloguj się przez Google
            </Button>
          </a>
          <span className={s.register}>
            Nie masz konta?{' '}
            <Link href={'/register'}>
              <a className={s.register__link}>Zarejestruj się</a>
            </Link>
          </span>
        </form>
      </div>
      <div className={s.image__wrapper}>
        <Image
          className={s.image}
          src={image_1}
          alt="Polana Strążyska"
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

Login.getLayout = function getLayout(page: ReactElement) {
  return <GridLayout>{page}</GridLayout>;
};

export default Login;
