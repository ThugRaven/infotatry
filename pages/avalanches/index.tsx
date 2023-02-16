import AvalancheAspect from '@components/avalanche/AvalancheAspect';
import AvalancheIcon from '@components/avalanche/AvalancheIcon';
import AvalancheInfo from '@components/avalanche/AvalancheInfo';
import AvalancheProblem from '@components/avalanche/AvalancheProblem';
import { MainLayout } from '@components/layouts';
import s from '@styles/Avalanches.module.css';
import classNames from 'classnames';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement, useId, useState } from 'react';
import { useQuery } from 'react-query';

export type Avalanche = {
  danger: number;
  increase: boolean;
  am: {
    elevation?: number;
    danger: number[];
    increase: boolean[];
    problem: string[];
    aspect: string[];
  };
  pm: {
    elevation?: number;
    danger: number[];
    increase: boolean[];
    problem: string[];
    aspect: string[];
  };
  forecast: number;
  until: string;
  createdAt: string;
};

const dateTimeFormat = Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
  timeStyle: 'short',
});

const dateFormat = Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
});

const AvalancheInfoItemStats = ({
  increase,
  level,
  problem,
  aspect,
}: {
  level: number;
  increase?: boolean;
  problem: string;
  aspect: string;
}) => {
  return (
    <li>
      <AvalancheIcon level={level} increase={increase} />
      <AvalancheProblem problem={problem} />
      <AvalancheAspect aspect={aspect} />
    </li>
  );
};

const AvalancheInfoItem = ({
  am,
  elevation,
  danger,
  increase,
  problem,
  aspect,
}: {
  am: boolean;
  elevation?: number;
  danger: number[];
  increase: boolean[];
  problem: string[];
  aspect: string[];
}) => {
  const offset = (elevation ?? 0) / 3000;
  const id = useId();

  const getStopColor = (level: number) => {
    return level === 1
      ? '#bad37c'
      : level === 2
      ? '#ffff00'
      : level === 3
      ? '#fe9800'
      : level === 4 || level === 5
      ? '#fe0000'
      : '#000000';
  };

  return (
    <div className={s.details__wrapper}>
      <span>{am ? 'Przed południem (AM)' : 'Po południu (PM)'}</span>
      <div className={s.details__info}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classNames(s.elevation)}
        >
          <path
            d="M9.33332 4L6.83332 7.33333L8.73332 9.86667L7.66666 10.6667C6.53999 9.16667 4.66666 6.66667 4.66666 6.66667L0.666656 12H15.3333L9.33332 4Z"
            fill={`url(#gradient-${id})`}
            stroke="black"
            strokeWidth="0.25"
          />
          <defs>
            <linearGradient id={`gradient-${id}`} x2="0%" y1="100%">
              <stop offset={offset} stopColor={getStopColor(danger[0])} />
              <stop
                offset={offset}
                stopColor={getStopColor(danger[1] ?? danger[0])}
              />
            </linearGradient>
          </defs>
        </svg>
        {elevation && <span>{elevation}</span>}
        <ul className={s.details__list}>
          {elevation && (
            <AvalancheInfoItemStats
              key={'1'}
              level={danger[1]}
              increase={increase[1]}
              problem={problem[1]}
              aspect={aspect[1] ?? ''}
            />
          )}
          <AvalancheInfoItemStats
            key={'0'}
            level={danger[0]}
            increase={increase[0]}
            problem={problem[0]}
            aspect={aspect[0] ?? ''}
          />
        </ul>
      </div>
    </div>
  );
};

const Avalanches = () => {
  const [index, setIndex] = useState(0);

  const fetchAvalanches = async () => {
    try {
      console.log('fetch');

      const response = await fetch(`http://localhost:8080/avalanches/week`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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

  const {
    isLoading: isLoadingAvalanches,
    error: avalanchesError,
    data: avalanchesData,
  } = useQuery<Avalanche[], Error>(
    ['avalanche-bulletin'],
    () => fetchAvalanches(),
    {
      refetchOnWindowFocus: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('onSuccess avalanche bulletin');
        console.log(data);
      },
    },
  );

  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <section className={classNames(s.card, s.current)}>
          <h2 className={s.title}>Aktualne zagrożenie lawinowe</h2>
          <div className={s.avalanche__info}>
            <AvalancheInfo
              level={(avalanchesData && avalanchesData[index].danger) ?? 0}
            />
          </div>
          <div className={s.current__info}>
            <div className={classNames(s.info, s['info--left'])}>
              <span>Aktualizacja</span>
              <span className={s.info__value}>
                {avalanchesData &&
                  dateTimeFormat.format(
                    new Date(avalanchesData[index].createdAt),
                  )}
              </span>
            </div>
            <div className={classNames(s.info, s['info--center'])}>
              <span>Źródło</span>
              <a
                href="https://lawiny.topr.pl/"
                target={'_blank'}
                rel={'noopener noreferrer'}
                className={s.info__link}
              >
                lawiny.topr.pl
              </a>
            </div>
            <div className={classNames(s.info, s['info--right'])}>
              <span>Obowiązuję do</span>
              <span className={s.info__value}>
                {avalanchesData &&
                  dateTimeFormat.format(new Date(avalanchesData[index].until))}
              </span>
            </div>
          </div>
        </section>
        <section className={classNames(s.card, s.details)}>
          <h2 className={s.title}>Szczegóły zagrożenia</h2>
          <AvalancheInfoItem
            am={true}
            elevation={avalanchesData && avalanchesData[index].am.elevation}
            danger={(avalanchesData && avalanchesData[index].am.danger) ?? []}
            increase={
              (avalanchesData && avalanchesData[index].am.increase) ?? []
            }
            problem={(avalanchesData && avalanchesData[index].am.problem) ?? []}
            aspect={
              (avalanchesData && avalanchesData[index].am.aspect) ?? ['', '']
            }
          />
          <AvalancheInfoItem
            am={false}
            elevation={avalanchesData && avalanchesData[index].pm.elevation}
            danger={(avalanchesData && avalanchesData[index].pm.danger) ?? []}
            increase={
              (avalanchesData && avalanchesData[index].pm.increase) ?? []
            }
            problem={(avalanchesData && avalanchesData[index].pm.problem) ?? []}
            aspect={
              (avalanchesData && avalanchesData[index].pm.aspect) ?? ['', '']
            }
          />
        </section>

        <section className={classNames(s.card, s.bulletins)}>
          <h2 className={s.title}>Historia i prognoza</h2>
          <ul className={s.bulletins__list}>
            {avalanchesData &&
              avalanchesData.map((avalanche, idx, array) => {
                const _index = array.length - 1 - idx;
                const data = array[_index];

                return (
                  <li
                    key={new Date(data.until).getTime()}
                    onClick={() => setIndex(_index)}
                  >
                    <button
                      className={classNames(s.bulletins__item, {
                        [s['bulletins__item--active']]: _index === index,
                      })}
                    >
                      <span>{dateFormat.format(new Date(data.until))}</span>
                      <AvalancheIcon
                        level={data.danger}
                        increase={data.increase}
                        className={s.icon}
                        levelClassName={s.icon__level}
                      />
                    </button>
                  </li>
                );
              })}
            {avalanchesData && (
              <li key={'forecast'}>
                <button
                  className={classNames(
                    s.bulletins__item,
                    s.bulletins__forecast,
                  )}
                >
                  <span>
                    {dateFormat.format(
                      new Date(avalanchesData[0].until).setDate(
                        new Date(avalanchesData[0].until).getDate() + 1,
                      ),
                    )}
                  </span>
                  <AvalancheIcon
                    level={avalanchesData[0].forecast}
                    increase={false}
                    className={s.icon}
                    levelClassName={s.icon__level}
                  />
                </button>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

Avalanches.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Avalanches;
