import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { IconButton } from '@components/ui';
import Button from '@components/ui/Button';
import classNames from 'classnames';
import { User } from 'context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';
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
      <IconButton
        buttonType="action"
        aria-label="Menu"
        onClick={onOpen}
        className={s.menu}
      >
        <MdMenu />
      </IconButton>
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

          <DrawerBody>
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
