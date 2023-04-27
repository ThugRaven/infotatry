import { Avatar } from '@chakra-ui/react';
import { LoadingOverlay, SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { Card } from '@components/ui';
import { getServerSidePropsIsAuthenticated } from '@lib/api';
import s from '@styles/Profile.module.css';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import Link from 'next/link';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { CompletedHike, PlannedHike } from 'types/hikes-types';

const dateTimeFormat = Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
  timeStyle: 'short',
});

const ListItem = ({
  date,
  nameStart,
  nameEnd,
  path,
}: {
  date: string;
  nameStart: string;
  nameEnd: string;
  path: string;
}) => {
  return (
    <li>
      <Link href={path}>
        <a className={s.item}>
          <div className={s.item__date}>
            {dateTimeFormat.format(new Date(date))}
          </div>
          <div>
            {nameStart} - {nameEnd}
          </div>
        </a>
      </Link>
    </li>
  );
};

export const getServerSideProps = getServerSidePropsIsAuthenticated;

const Profile = () => {
  const { user } = useAuth();

  const fetchLastHikes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/hikes/last`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

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

  const { isLoading: isLoadingLastHikes, data: lastHikes } = useQuery<
    {
      plannedHikes: PlannedHike[];
      completedHikes: CompletedHike[];
    },
    Error
  >(['hikes-last', user?.id], fetchLastHikes, {
    enabled: true,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <>
      <SEO title="Mój profil" />
      <div className={s.container}>
        {user && (
          <div className={s.wrapper}>
            <Card className={classNames(s.user, s.card)}>
              <Avatar name={user?.name} src={user?.image} />
              <span>{user.name}</span>
            </Card>
            <Card cardTitle="Ostatnie wędrówki" className={s.card} />
            <div className={s.hikes}>
              {isLoadingLastHikes && <LoadingOverlay />}
              <Card cardTitle={'Zaplanowane'} className={s.card}>
                {lastHikes && lastHikes.plannedHikes?.length > 0 && (
                  <ul className={s.hikes__list}>
                    {lastHikes.plannedHikes.map((hike) => (
                      <ListItem
                        key={hike._id}
                        date={hike.createdAt}
                        nameStart={hike.name.start}
                        nameEnd={hike.name.end}
                        path={`/hikes/planned/${hike._id}`}
                      />
                    ))}
                  </ul>
                )}
              </Card>
              <Card cardTitle={'Przebyte'} className={s.card}>
                {lastHikes && lastHikes.completedHikes?.length > 0 && (
                  <ul className={s.hikes__list}>
                    {lastHikes.completedHikes.map((hike) => (
                      <ListItem
                        key={hike._id}
                        date={hike.createdAt}
                        nameStart={hike.name.start}
                        nameEnd={hike.name.end}
                        path={`/hikes/completed/${hike._id}`}
                      />
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout maxHeight={true}>{page}</DashboardLayout>;
};

export default Profile;
