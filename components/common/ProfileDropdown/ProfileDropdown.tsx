import classNames from 'classnames';
import { useSignOut } from 'hooks/useSignOut';
import Link from 'next/link';
import {
  MdOutlineDashboard,
  MdOutlineLogout,
  MdOutlineSettings,
  MdPersonOutline,
} from 'react-icons/md';
import s from './ProfileDropdown.module.css';

interface ProfileDropdownProps {
  onClick: () => void;
}

const ProfileDropdown = ({ onClick }: ProfileDropdownProps) => {
  const handleSignOut = useSignOut();

  return (
    <nav className={s.dropdown}>
      <ul className={s.list}>
        {[
          {
            icon: <MdPersonOutline />,
            name: 'Profil',
            path: '/dashboard/profile',
          },
          {
            icon: <MdOutlineDashboard />,
            name: 'Dashboard',
            path: '/dashboard',
          },
          {
            icon: <MdOutlineSettings />,
            name: 'Ustawienia',
            path: '/dashboard/settings',
          },
        ].map(({ name, icon, path }) => (
          <li key={name}>
            <Link href={path} className={s.list__item} onClick={onClick}>
              <div className={s.icon}>{icon}</div>
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <div className={s.divider}></div>
      <button
        className={classNames(s.list__item, s.logout)}
        onClick={handleSignOut}
      >
        <div className={s.icon}>
          <MdOutlineLogout />
        </div>
        Wyloguj się
      </button>
    </nav>
  );
};

export default ProfileDropdown;
