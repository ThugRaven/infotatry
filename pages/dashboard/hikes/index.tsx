import { LoadingOverlay, Pagination, SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { Button, Card } from '@components/ui';
import {
  PaginationResponse,
  getServerSidePropsIsAuthenticated,
} from '@lib/api';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import s from '@styles/Hikes.module.css';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import { usePagination } from 'hooks/usePagination';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { MdTrendingDown, MdTrendingUp } from 'react-icons/md';
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
  time,
  distance,
  ascent,
  descent,
  type,
  path,
}: {
  date: string;
  nameStart: string;
  nameEnd: string;
  time?: number;
  distance?: number;
  ascent?: number;
  descent?: number;
  type: 'planned' | 'completed';
  path: string;
}) => {
  return (
    <li>
      <Link href={path} className={s.item}>
        <div className={s.item__date}>
          {dateTimeFormat.format(new Date(date))}
        </div>
        <div>
          {nameStart} - {nameEnd}
        </div>
        {type === 'completed' && time && distance && ascent && descent && (
          <div className={s.stats}>
            <span className={s.value} title={`${time} min.`}>
              {formatMinutesToHours(time)}
              <span className={s.unit}>h</span>
            </span>
            <span className={s.value} title={`${distance} m`}>
              {formatMetersToKm(distance)}
              <span className={s.unit}>km</span>
            </span>
            <div
              className={classNames(
                s.stats__elevation,
                s['stats__elevation--ascent'],
              )}
            >
              <MdTrendingUp className={s.icon} />
              <span className={s.value}>
                {ascent}
                <span className={s.unit}>m</span>
              </span>
            </div>
            <div
              className={classNames(
                s.stats__elevation,
                s['stats__elevation--descent'],
              )}
            >
              <MdTrendingDown className={s.icon} />
              <span className={s.value}>
                {descent}
                <span className={s.unit}>m</span>
              </span>
            </div>
          </div>
        )}
      </Link>
    </li>
  );
};

export const getServerSideProps = getServerSidePropsIsAuthenticated;

const Hikes = () => {
  const { user } = useAuth();
  const [hikesType, setHikesType] = useState<'planned' | 'completed'>(
    'planned',
  );
  const { page, handlePageClick } = usePagination();
  useEffect(() => {
    handlePageClick(1);
  }, [hikesType, handlePageClick]);

  const fetchPlannedHikes = async (page: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/hikes/planned?page=${page}`,
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

  const fetchCompletedHikes = async (page: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/hikes/completed?page=${page}`,
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

  const { data: plannedHikes, isFetching: isFetchingPlannedHikes } = useQuery<
    PaginationResponse<PlannedHike[]>,
    Error
  >(['hikes-planned', user?.id, page], () => fetchPlannedHikes(page), {
    enabled: hikesType === 'planned',
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 15 * 60 * 1000, // 15 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { data: completedHikes, isFetching: isFetchingCompletedHikes } =
    useQuery<PaginationResponse<CompletedHike[]>, Error>(
      ['hikes-completed', user?.id, page],
      () => fetchCompletedHikes(page),
      {
        enabled: hikesType === 'completed',
        refetchOnWindowFocus: false,
        retry: false,
        cacheTime: 15 * 60 * 1000, // 15 minutes
        staleTime: 10 * 60 * 1000, // 10 minutes
        keepPreviousData: true,
        onSuccess: (data) => {
          console.log(data);
        },
      },
    );

  return (
    <>
      <SEO title="Moje wędrówki" />
      <div className={s.container}>
        {user && (
          <div className={s.wrapper}>
            <Card cardTitle={'Moje wędrówki'} className={s.card}>
              <div className={s.buttons}>
                <Button
                  onClick={() => setHikesType('planned')}
                  variant={hikesType === 'planned' ? 'solid' : 'outline'}
                >
                  Zaplanowane
                </Button>
                <Button
                  onClick={() => setHikesType('completed')}
                  variant={hikesType === 'completed' ? 'solid' : 'outline'}
                >
                  Przebyte
                </Button>
              </div>
            </Card>
            {hikesType === 'planned' && (
              <Card cardTitle={'Zaplanowane'} className={s.card}>
                {isFetchingPlannedHikes && <LoadingOverlay />}
                {plannedHikes && plannedHikes.data.length > 0 && (
                  <>
                    <ul className={s.hikes__list}>
                      {plannedHikes.data.map((hike) => (
                        <ListItem
                          key={hike._id}
                          date={hike.createdAt}
                          nameStart={hike.name.start}
                          nameEnd={hike.name.end}
                          type="planned"
                          path={`/hikes/planned/${hike._id}`}
                        />
                      ))}
                    </ul>
                    <Pagination
                      page={page}
                      pageSize={plannedHikes.pageSize}
                      count={plannedHikes.count}
                      onPageClick={handlePageClick}
                    />
                  </>
                )}
              </Card>
            )}
            {hikesType === 'completed' && (
              <Card cardTitle={'Przebyte'} className={s.card}>
                {isFetchingCompletedHikes && <LoadingOverlay />}
                {completedHikes && completedHikes.data.length > 0 && (
                  <>
                    <ul className={s.hikes__list}>
                      {completedHikes.data.map((hike) => (
                        <ListItem
                          key={hike._id}
                          date={hike.createdAt}
                          nameStart={hike.name.start}
                          nameEnd={hike.name.end}
                          time={hike.time}
                          distance={hike.distance}
                          ascent={hike.ascent}
                          descent={hike.descent}
                          type="completed"
                          path={`/hikes/completed/${hike._id}`}
                        />
                      ))}
                    </ul>
                    <Pagination
                      page={page}
                      pageSize={completedHikes.pageSize}
                      count={completedHikes.count}
                      onPageClick={handlePageClick}
                    />
                  </>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
};

Hikes.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout maxHeight={true}>{page}</DashboardLayout>;
};

export default Hikes;
