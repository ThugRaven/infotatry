import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { getServerSidePropsIsAuthenticated } from '@lib/api';
import s from '@styles/Dashboard.module.css';
import Link from 'next/link';
import { ReactElement } from 'react';
import { FaHiking } from 'react-icons/fa';
import {
  MdBarChart,
  MdOutlineDashboard,
  MdOutlineSettings,
  MdPersonOutline,
} from 'react-icons/md';

export const getServerSideProps = getServerSidePropsIsAuthenticated;

const Dashboard = () => {
  return (
    <>
      <SEO title="Dashboard" />
      <div className={s.container}>
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
              <Link href={path} className={s.list__item}>
                <div className={s.icon}>{icon}</div>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
