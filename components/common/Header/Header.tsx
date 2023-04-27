import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { Button, IconButton } from '@components/ui';
import classNames from 'classnames';
import { User } from 'context/AuthContext';
import { useSignOut } from 'hooks/useSignOut';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { MdClose, MdMenu, MdOutlineLogout } from 'react-icons/md';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSignOut = useSignOut();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as HTMLElement)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('click', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [open]);

  return (
    <header className={classNames(s.header)}>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <IconButton
            buttonType="action"
            aria-label="Close"
            onClick={onClose}
            className={s.drawer__close}
          >
            <MdClose />
          </IconButton>

          <DrawerHeader>Nawigacja</DrawerHeader>

          <DrawerBody className={s.drawer__body}>
            <nav className={s.drawer__nav}>
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

            {user && isLoggedIn ? (
              <div className={classNames(s.profile, s['profile--mobile'])}>
                <Link href={'/dashboard/profile'}>
                  <a className={s.profile__btn}>
                    <Avatar name={user.name} src={user.image} />
                    <span className={s.profile__name}>Moje konto</span>
                  </a>
                </Link>
                <button className={s.logout} onClick={handleSignOut}>
                  <div className={s.icon}>
                    <MdOutlineLogout />
                  </div>
                  Wyloguj się
                </button>
              </div>
            ) : (
              <div className={classNames(s.actions, s['actions--mobile'])}>
                <Button onClick={() => router.push('/login')}>
                  Zaloguj się
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/register')}
                >
                  Zarejestruj się
                </Button>
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <div className={s.wrapper}>
        <Link href={'/'}>
          <a className={s.logo}>
            <Logo textClassName={s.logo__text} />
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
      <div className={s.actions__wrapper}>
        <IconButton
          buttonType="action"
          aria-label="Menu"
          onClick={onOpen}
          className={s.menu}
        >
          <MdMenu />
        </IconButton>
        {user && isLoggedIn ? (
          <div className={s.profile} ref={ref}>
            <button
              className={classNames(s.profile__btn, {
                [s['profile--active']]: open,
              })}
              onClick={() => setOpen((value) => !value)}
            >
              <span className={s.profile__name}>{user.name}</span>
              <Avatar name={user.name} src={user.image} />
            </button>
            {open && <ProfileDropdown onClick={() => setOpen(false)} />}
          </div>
        ) : (
          <div className={classNames(s.actions, s['actions--pc'])}>
            <Button onClick={() => router.push('/login')}>Zaloguj się</Button>
            <Button variant="outline" onClick={() => router.push('/register')}>
              Zarejestruj się
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
