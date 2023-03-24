import { SEO } from '@components/common';
import AvalancheDry0 from '@components/icons/AvalancheDry0';
import { DashboardLayout } from '@components/layouts';
import { getServerSidePropsIsAdmin } from '@lib/api';
import s from '@styles/DashboardAdmin.module.css';
import Link from 'next/link';
import { ReactElement } from 'react';
import {
  MdMap,
  MdOutlineCampaign,
  MdOutlineDashboard,
  MdPeopleOutline,
} from 'react-icons/md';

export const getServerSideProps = getServerSidePropsIsAdmin;

const DashboardAdmin = () => {
  return (
    <>
      <SEO title="Admin Dashboard" />
      <div className={s.container}>
        <ul className={s.list}>
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
                <a className={s.list__item}>
                  <div className={s.icon}>{icon}</div>
                  {name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

DashboardAdmin.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardAdmin;
