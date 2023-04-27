import { useDisclosure } from '@chakra-ui/react';
import { SEO } from '@components/common';
import { MainLayout } from '@components/layouts';
import { MapContainer } from '@components/map';
import { RouteSegments } from '@components/route';
import { Button } from '@components/ui';
import { WeatherModal } from '@components/weather';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import s from '@styles/CompletedHike.module.css';
import { GetServerSideProps } from 'next';
import { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { CompletedHike } from 'types/hikes-types';
import {
  CurrentWeatherResponse,
  WeatherForecastResponse,
} from 'types/weather-types';

export const getServerSideProps: GetServerSideProps<{
  hike: CompletedHike;
}> = async (context) => {
  const { id } = context.query;

  console.log(id);
  console.log(context.req.cookies);
  const authCookie = context.req.cookies['connect.sid'];
  let hike = null;

  try {
    console.log('fetch');
    console.log(id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/hikes/completed/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `connect.sid=${authCookie};`,
        },
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    hike = await response.json();
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (error.message == '401') {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
      if (error.message == '404' || error.message === '400') {
        return {
          notFound: true,
        };
      }
    }

    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  return {
    props: { hike },
  };
};

const CompletedHikePage = ({ hike }: { hike: CompletedHike }) => {
  const [hoveredNode, setHoveredNode] = useState(-1);
  const [hoveredTrail, setHoveredTrail] = useState(-1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleHover = (id: number, type: 'node' | 'trail') => {
    if (type === 'node') {
      setHoveredNode(id);
    } else {
      setHoveredTrail(id);
    }
  };

  const fetchCurrentWeather = async (name?: string) => {
    try {
      if (!name) {
        return false;
      }
      console.log('fetch');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/weather/current/${name}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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

  const { data: currentWeatherData } = useQuery<CurrentWeatherResponse, Error>(
    ['current-weather', hike && hike.weatherSite],
    () => fetchCurrentWeather(hike && hike.weatherSite),
    {
      enabled: Boolean(hike),
      refetchOnWindowFocus: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('onSuccess current weather');
        console.log(data);
      },
    },
  );

  const fetchWeatherForecast = async (name?: string) => {
    try {
      if (!name) {
        return false;
      }
      console.log('fetch');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/weather/forecast/${name}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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

  const { data: weatherForecastData } = useQuery<
    WeatherForecastResponse,
    Error
  >(
    ['weather', hike && hike.weatherSite],
    () => fetchWeatherForecast(hike && hike.weatherSite),
    {
      enabled: Boolean(isOpen),
      refetchOnWindowFocus: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('onSuccess weather forecast');
        console.log(data);
      },
    },
  );

  return (
    <>
      <SEO
        title={`Przebyta wędrówka: ${hike.name.start} - ${
          hike.name.end
        }, ${formatMetersToKm(hike.distance)} km, ${formatMinutesToHours(
          hike.time,
        )} h`}
      />

      <div className={s.container}>
        <aside className={s.segments}>
          <RouteSegments
            segments={(hike && hike.segments) ?? []}
            onHover={handleHover}
          />
        </aside>
        <section className={s.stats}>
          <h2
            className={s.location__name}
          >{`${hike.name.start} - ${hike.name.end}`}</h2>
          <ul className={s.stats__list}>
            {[
              {
                name: 'Dystans',
                value: formatMetersToKm(hike.distance),
                unit: 'km',
              },
              {
                name: 'Czas',
                value: formatMinutesToHours(hike.time),
                unit: 'h',
              },
              {
                name: 'Podejścia',
                value: hike.ascent,
                unit: 'm',
              },
              {
                name: 'Zejścia',
                value: hike.descent,
                unit: 'm',
              },
            ].map((item) => (
              <li key={item.name} className={s.stats__item}>
                <span className={s.item__name}>{item.name}</span>
                <span className={s.item__value}>
                  {item.value}
                  <span className={s.item__unit}>{item.unit}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className={s.buttons}>
            <Button onClick={onOpen} variant="outline" responsive>
              Informacje pogodowe
            </Button>
          </div>
        </section>
        <section className={s.map}>
          <MapContainer
            hike={hike}
            hoveredNode={hoveredNode}
            hoveredTrail={hoveredTrail}
          />
        </section>
        <WeatherModal
          location={hike.weatherSite}
          weatherData={{
            currentWeather: currentWeatherData,
            weatherForecast: weatherForecastData,
          }}
          isOpen={isOpen}
          onClose={onClose}
        />
      </div>
    </>
  );
};

CompletedHikePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout maxHeight={true}>{page}</MainLayout>;
};

export default CompletedHikePage;
