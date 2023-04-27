import AvalancheDry0 from '@components/icons/AvalancheDry0';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { FaHiking } from 'react-icons/fa';
import {
  MdBarChart,
  MdMap,
  MdOutlineCampaign,
  MdOutlineDashboard,
  MdOutlineSettings,
  MdPeopleOutline,
  MdPersonOutline,
} from 'react-icons/md';
import MainLayout from '../MainLayout';
import s from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  maxHeight?: boolean;
  children: ReactNode;
}

const DashboardLayout = ({
  maxHeight = false,
  children,
}: DashboardLayoutProps) => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <MainLayout maxHeight={maxHeight}>
      <div className={s.container}>
        <nav className={s.nav}>
          <ul className={s.list}>
            {[
              {
                icon: <MdOutlineDashboard />,
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                icon: <MdPersonOutline />,
                name: 'Profil',
                path: '/dashboard/profile',
              },
              {
                icon: <FaHiking />,
                name: 'Wędrówki',
                path: '/dashboard/hikes',
              },
              {
                icon: <MdBarChart />,
                name: 'Statystyki',
                path: '/dashboard/stats',
              },
              {
                icon: <MdOutlineSettings />,
                name: 'Ustawienia',
                path: '/dashboard/settings',
              },
            ].map(({ name, icon, path }) => (
              <li key={name}>
                <Link href={path}>
                  <a
                    className={classNames(s.list__item, {
                      [s['list__item--active']]: path === router.pathname,
                    })}
                  >
                    <div className={s.icon}>{icon}</div>
                    <span className={s.item__text}>{name}</span>
                    <span className={s.item__tooltip}>{name}</span>
                  </a>
                </Link>
              </li>
            ))}
            {user && user.roles.includes('admin') && (
              <>
                <div className={s.list__title}>Admin</div>
                <div className={s.list__divider}></div>
                {[
                  {
                    icon: <MdOutlineDashboard />,
                    name: 'Admin Dashboard',
                    path: '/dashboard/admin',
                  },
                  {
                    icon: <MdMap />,
                    name: 'Mapa',
                    path: '/dashboard/admin/map',
                  },
                  {
                    icon: <MdOutlineCampaign />,
                    name: 'Ogłoszenia',
                    path: '/dashboard/admin/announcements',
                  },
                  {
                    icon: <AvalancheDry0 />,
                    name: 'Komunikaty lawinowe',
                    path: '/dashboard/admin/avalanches',
                  },
                  {
                    icon: <MdPeopleOutline />,
                    name: 'Użytkownicy',
                    path: '/dashboard/admin/users',
                  },
                ].map(({ name, icon, path }) => (
                  <li key={name}>
                    <Link href={path}>
                      <a
                        className={classNames(s.list__item, {
                          [s['list__item--active']]: path === router.pathname,
                        })}
                      >
                        <div className={s.icon}>{icon}</div>
                        <span className={s.item__text}>{name}</span>
                        <span className={s.item__tooltip}>{name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
        {children}
      </div>
    </MainLayout>
  );
};

export default DashboardLayout;
