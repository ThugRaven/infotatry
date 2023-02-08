import { Avatar } from '@chakra-ui/react';
import Button from '@components/ui/Button';
import classNames from 'classnames';
import { User } from 'context/AuthContext';
import { useSignOut } from 'hooks/useSignOut';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../Logo';
import s from './Header.module.css';

type NavRoute = {
  name: string;
  path: string;
};

interface HeaderProps {
  navRoutes: NavRoute[];
  user: User | null;
  isLoggedIn?: boolean;
}

const Header = ({ navRoutes, user, isLoggedIn = false }: HeaderProps) => {
  const router = useRouter();
  const handleSignOut = useSignOut();

  return (
    <header className={classNames(s.header)}>
      <Link href={'/'}>
        <a className={s.logo}>
          <Logo />
        </a>
      </Link>
      <nav className={s.nav}>
        <ul className={s.nav__routes}>
          {navRoutes.map((route) => {
            return (
              <li key={route.name}>
                <Link href={route.path}>
                  <a className={s.route__item}>{route.name}</a>
                </Link>
              </li>
            );
          })}
          <Button onClick={handleSignOut}>Wyloguj się</Button>
        </ul>
      </nav>
      {user && isLoggedIn ? (
        <div className={s.profile}>
          {user.name} <Avatar name={user.name} src={user.image} />
        </div>
      ) : (
        <div className={s.actions}>
          <Button onClick={() => router.push('/login')}>Zaloguj się</Button>
          <Button variant="outline" onClick={() => router.push('/register')}>
            Zarejestruj się
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
