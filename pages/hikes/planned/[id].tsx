import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import { MapContainer } from '@components/map';
import RouteSegments from '@components/route/RouteSegments';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import s from '@styles/PlannedHike.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';

export const getServerSideProps: GetServerSideProps<{ hike: any }> = async (
  context,
) => {
  const { id } = context.query;

  console.log(id);
  console.log(context.req.cookies);
  const authCookie = context.req.cookies['connect.sid'];
  let hike = null;

  try {
    console.log('fetch');
    console.log(id);

    const response = await fetch(`http://localhost:8080/hikes/planned/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `connect.sid=${authCookie};`,
      },
      credentials: 'include',
    });

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
      throw new Error(error.message);
    }
  }

  return {
    props: { hike },
  };
};

const PlannedHike = ({ hike }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [hoveredNode, setHoveredNode] = useState(-1);
  const [hoveredTrail, setHoveredTrail] = useState(-1);
  console.log('getServerSideProps', hike);

  const saveHike = async (id: string | string[] | undefined) => {
    try {
      console.log(id);

      const response = await fetch(
        `http://localhost:8080/hikes/completed/${id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ avoidClosedTrails: true }),
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

  const hikeMutation = useMutation((id: string | string[] | undefined) =>
    saveHike(id),
  );

  const handleSaveHike = () => {
    if (hike) {
      console.log(hike);
    }

    hikeMutation.mutate(id, {
      onSuccess: (data) => {
        console.log(data);
        console.log(data && data._id);
        if (data) {
          router.push(`/hikes/completed/${data._id}`);
        }
      },
    });
  };
  console.log('TEST');
  console.log(hike && hike.encoded != '' ? hike.trails : null);
  console.log(hike && hike.encoded == '' ? null : hike);

  const handleHover = (id: number, type: 'node' | 'trail') => {
    if (type === 'node') {
      setHoveredNode(id);
    } else {
      setHoveredTrail(id);
    }
  };

  return (
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
        <Button colorScheme="blue" mb={2} onClick={handleSaveHike}>
          Save hike
        </Button>
      </section>
      <section className={s.map}>
        <MapContainer
          trailIds={hike && hike.encoded != '' ? hike.trails : null}
          hike={hike && hike.encoded == '' ? null : hike}
          hoveredNode={hoveredNode}
          hoveredTrail={hoveredTrail}
        />
      </section>
      <section className={s.details}>
        <Tabs>
          <TabList>
            <Tab>Profil wysokości</Tab>
            <Tab>Pogoda</Tab>
            <Tab>Informacje</Tab>
            <Tab>Zapisz</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>Profil wysokości</TabPanel>
            <TabPanel>Pogoda</TabPanel>
            <TabPanel>Informacje</TabPanel>
            <TabPanel>Zapisz</TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </div>
  );
};

PlannedHike.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout className={s.layout}>{page}</MainLayout>;
};

export default PlannedHike;
