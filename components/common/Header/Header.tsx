import { Avatar } from '@chakra-ui/react';
import Button from '@components/ui/Button';
import classNames from 'classnames';
import { User } from 'context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Logo from '../Logo';
import ProfileDropdown from '../ProfileDropdown';
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
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as HTMLElement)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <header className={classNames(s.header)}>
      <div className={s.wrapper}>
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
          </ul>
        </nav>
      </div>
      {user && isLoggedIn ? (
        <div className={s.profile} ref={ref}>
          <button
            className={classNames(s.profile__btn, {
              [s['profile--active']]: open,
            })}
            onClick={() => setOpen((value) => !value)}
          >
            {user.name} <Avatar name={user.name} src={user.image} />
          </button>
          {open && <ProfileDropdown onClick={() => setOpen(false)} />}
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
