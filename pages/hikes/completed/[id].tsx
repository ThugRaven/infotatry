import { SEO } from '@components/common';
import { MainLayout } from '@components/layouts';
import { MapContainer } from '@components/map';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import s from '@styles/Hikes.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';

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

    const response = await fetch(
      `http://localhost:8080/hikes/completed/${id}`,
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
      throw new Error(error.message);
    }
  }

  return {
    props: { hike },
  };
};

const CompletedHike = ({ hike }: any) => {
  console.log('getServerSideProps', hike);

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
        {/* <ul>
        {routeNodes.map((node, index) => (
          <li key={`${node.id}-${index}`}>
            {node.id} | {node.name}
            </li>
        ))}
      </ul> */}

        {hike && (
          <>
            <h1
              className={s.hike__names}
            >{`${hike.name.start} - ${hike.name.end}`}</h1>
            <ul className={s.hike__info}>
              <li title={`${hike.distance} m`}>
                <span>Distance</span>
                {`${
                  (Math.floor(hike.distance / 1000) * 1000 +
                    Math.round((hike.distance % 1000) / 100) * 100) /
                  1000
                } km`}
              </li>
              <li title={`${hike.time} min.`}>
                <span>Time</span>
                {`${Math.floor(hike.time / 60)}:${
                  hike.time % 60 >= 10 ? hike.time % 60 : `0${hike.time % 60}`
                } h`}
              </li>
              <li>
                <span>Ascent</span>
                {`${hike.ascent} m`}
              </li>
              <li>
                <span>Descent</span>
                {`${hike.descent} m`}
              </li>
            </ul>
          </>
        )}

        <MapContainer
          trailIds={hike && hike.encoded != '' ? hike.trails : null}
          hike={hike && hike.encoded == '' ? null : hike}
        ></MapContainer>

        <div>Elevation profile</div>
      </div>
    </>
  );
};

CompletedHike.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default CompletedHike;
