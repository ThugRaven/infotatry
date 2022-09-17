import { Avatar, Button, Text } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav>
          <ul className={styles.nav}>
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
      </header>
      {children}
    </div>
  );
};

export default DashboardLayout;
