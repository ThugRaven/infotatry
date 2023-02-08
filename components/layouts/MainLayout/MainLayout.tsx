import Header from '@components/common/Header';
import { useAuth } from 'hooks/useAuth';
import { useSignOut } from 'hooks/useSignOut';
import { useSession } from 'next-auth/react';
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
      <Header
        navRoutes={[
          {
            name: 'Mapa',
            path: '/map',
          },
          {
            name: 'Dashboard',
            path: '/dashboard',
          },
        ]}
        user={user}
        isLoggedIn={authStatus === 'authenticated'}
      />

      {/* <header className={s.header}>
        <nav>
          <ul className={s.nav}>
            <li>
              <NextLink href="/">Home</NextLink>
            </li>
            <li>
              <NextLink href="/map">Mapa</NextLink>
            </li>
            <li>
              <NextLink href="/dashboard">Dashboard</NextLink>
            </li>
          </ul>
        </nav>

        <Logo />
        <CustomButton>Zaloguj się</CustomButton>
        <CustomButton variant="outline">Zaloguj się</CustomButton>
        <div className={s.auth}>
          {status === 'authenticated' ? (
            <>
              {session.user?.image && <Avatar src={session.user.image} />}
              <Text fontSize={'lg'}>Witaj {session.user?.name}!</Text>
              <Button onClick={() => signOut()}>Wyloguj się</Button>
            </>
          ) : (
            <Button variant={'outline'} onClick={() => signIn()}>
              Zaloguj się
            </Button>
          )}
        </div>
        <div className={s.auth}>
          {authStatus === 'authenticated' ? (
            <>
              <Text fontSize={'lg'}>
                Witaj{' '}
                <NextLink href="/user" passHref>
                  <Link>{user?.name}!</Link>
                </NextLink>
              </Text>
              <Button onClick={handleSignOut}>Wyloguj się</Button>
            </>
          ) : (
            <Button onClick={() => router.push('/login')}>Zaloguj się</Button>
          )}
        </div>
      </header> */}
      {children}
    </div>
  );
};

export default MainLayout;
