import { Avatar, Button, Text } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import s from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { data: session, status } = useSession();

  return (
    <div className={s.container}>
      <header className={s.header}>
        <nav>
          <ul className={s.nav}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <div>Admin</div>
            <li>
              <Link href="/dashboard/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link href="/dashboard/admin/map">Map</Link>
            </li>
            <li>
              <Link href="/dashboard/admin/announcements">Announcements</Link>
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
      </header>
      {children}
    </div>
  );
};

export default DashboardLayout;
