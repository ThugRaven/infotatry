import Button from '@components/ui/Button';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../Logo';
import s from './Header.module.css';

type NavRoute = {
  name: string;
  path: string;
};

interface HeaderProps {
  children: React.ReactNode;
  navRoutes: NavRoute[];
  isLoggedIn: boolean;
}

const Header = ({ children, navRoutes, isLoggedIn }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className={classNames(s.header)}>
      <Link href={'/'}>
        <a>
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
        </ul>
      </nav>
      <div className={s.actions}>
        <Button onClick={() => router.push('/login')}>Zaloguj się</Button>
        <Button variant="outline" onClick={() => router.push('/register')}>
          Zarejestruj się
        </Button>
      </div>
      <div className={s.profile}></div>
    </header>
  );
};

export default Header;
