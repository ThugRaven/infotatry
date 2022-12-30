import { Avatar, Button, Text } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useMutation } from 'react-query';
import s from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  const logout = async (x: number) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        // const data = await response.json();
        throw new Error(response.status.toString());
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const logoutMutation = useMutation(logout);

  const handleLogout = () => {
    logoutMutation.mutate(1, {
      onSuccess: () => {
        router.reload();
      },
    });
  };

  return (
    <div className={s.container}>
      <header className={s.header}>
        <nav>
          <ul className={s.nav}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/map">Mapa</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <div className={s.auth}>
          {status === 'authenticated' ? (
            <>
              {session.user?.image && <Avatar src={session.user.image} />}
              <Text fontSize={'lg'}>Witaj {session.user?.name}!</Text>
              <Button onClick={() => signOut()}>Wyloguj się</Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>Zaloguj się</Button>
          )}
        </div>
        <Button onClick={handleLogout}>Logout</Button>
      </header>
      {children}
    </div>
  );
};

export default MainLayout;
