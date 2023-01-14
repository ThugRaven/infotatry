import { Button } from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import { MapContainer } from '@components/map';
import s from '@styles/Hikes.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
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
  const data = hike;
  console.log('getServerSideProps', data);

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
    if (data) {
      console.log(data);
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
  console.log(data && data.encoded != '' ? data.trails : null);
  console.log(data && data.encoded == '' ? null : data);

  return (
    <div className={s.container}>
      {/* <ul>
        {routeNodes.map((node, index) => (
          <li key={`${node.id}-${index}`}>
            {node.id} | {node.name}
          </li>
          ))}
      </ul> */}

      {data && (
        <>
          <h1
            className={s.hike__names}
          >{`${data.name.start} - ${data.name.end}`}</h1>
          <ul className={s.hike__info}>
            <li title={`${data.distance} m`}>
              <span>Distance</span>
              {`${
                (Math.floor(data.distance / 1000) * 1000 +
                  Math.round((data.distance % 1000) / 100) * 100) /
                1000
              } km`}
            </li>
            <li title={`${data.time} min.`}>
              <span>Time</span>
              {`${Math.floor(data.time / 60)}:${
                data.time % 60 >= 10 ? data.time % 60 : `0${data.time % 60}`
              } h`}
            </li>
            <li>
              <span>Ascent</span>
              {`${data.ascent} m`}
            </li>
            <li>
              <span>Descent</span>
              {`${data.descent} m`}
            </li>
          </ul>
          <Button colorScheme="blue" mb={2} onClick={handleSaveHike}>
            Save hike
          </Button>
        </>
      )}

      <MapContainer
        trailIds={data && data.encoded != '' ? data.trails : null}
        hike={data && data.encoded == '' ? null : data}
      ></MapContainer>

      <div>Elevation profile</div>
    </div>
  );
};

PlannedHike.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default PlannedHike;
