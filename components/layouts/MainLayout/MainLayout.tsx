import { Avatar, Button, Text } from '@chakra-ui/react';
import { useAuth } from 'hooks/useAuth';
import { useSignOut } from 'hooks/useSignOut';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import s from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { data: session, status } = useSession();
  const { user, status: authStatus } = useAuth();
  const router = useRouter();
  const handleSignOut = useSignOut();

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
        <div className={s.auth}>
          {authStatus === 'authenticated' ? (
            <>
              <Text fontSize={'lg'}>Witaj 2 {user?.name}!</Text>
              <Button onClick={handleSignOut}>Wyloguj się</Button>
            </>
          ) : (
            <Button onClick={() => router.push('/login')}>Zaloguj się</Button>
          )}
        </div>
      </header>
      {children}
    </div>
  );
};

export default MainLayout;
