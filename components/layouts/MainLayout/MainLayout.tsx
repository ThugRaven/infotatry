import { Avatar, Button, Text } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [count, setCount] = useState(0);
  const { data: session, status } = useSession();

  return (
    <div>
      <header className={styles.header}>
        Header
        <Button onClick={() => setCount((state) => state + 1)}>
          Count {count}
        </Button>
        <div className={styles.auth}>
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
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/map">Mapa</Link>
            </li>
          </ul>
        </nav>
      </header>
      {children}
    </div>
  );
};

export default MainLayout;
