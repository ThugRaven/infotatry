import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { Card } from '@components/ui';
import { getServerSidePropsIsAuthenticated } from '@lib/api';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import s from '@styles/Stats.module.css';
import classNames from 'classnames';
import { User } from 'context/AuthContext';
import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';

export const getServerSideProps = getServerSidePropsIsAuthenticated;

const Stats = () => {
  const { user } = useAuth();

  const fetchUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const { data: userData } = useQuery<{ user: User }, Error>(
    ['user', user?.id],
    fetchUser,
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

  return (
    <>
      <SEO title="Moje statystyki" />
      <div className={s.container}>
        {user && userData && userData.user.stats && (
          <div className={s.wrapper}>
            <Card cardTitle="Moje statystyki" className={s.card} />
            <ul className={s.stats__list}>
              {[
                {
                  name: 'Dystans',
                  value: formatMetersToKm(userData.user.stats.distance),
                  unit: 'km',
                },
                {
                  name: 'Czas',
                  value: formatMinutesToHours(userData.user.stats.time),
                  unit: 'h',
                },
                {
                  name: 'Podejścia',
                  value: userData.user.stats.ascent,
                  unit: 'm',
                },
                {
                  name: 'Zejścia',
                  value: userData.user.stats.descent,
                  unit: 'm',
                },
              ].map((item) => (
                <li key={item.name}>
                  <Card className={classNames(s.card, s.stats__item)}>
                    <span className={s.item__name}>{item.name}</span>
                    <span className={s.item__value}>
                      {item.value}
                      <span className={s.item__unit}>{item.unit}</span>
                    </span>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

Stats.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout maxHeight={true}>{page}</DashboardLayout>;
};

export default Stats;
