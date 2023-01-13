import { Button } from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import { MapContainer } from '@components/map';
import s from '@styles/Hikes.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/router';
import { Node, Trail } from 'pages/dashboard/admin/map';
import { ReactElement, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import features from '../../../public/features.json';

const PlannedHike = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routeNodes, setRouteNodes] = useState<Node[]>([]);

  useEffect(() => {
    const data = features;
    setTrails(data.trails as Trail[]);
    setNodes(data.nodes as Node[]);
  }, []);

  const router = useRouter();
  const { id } = router.query;

  // useEffect(() => {
  //   console.log('useEffect');
  //   if (id && typeof id === 'string' && nodes) {
  //     const decoded = decodeURIComponent(id);
  //     const idsArray = decoded.split(',');
  //     console.log(idsArray);
  //     const route: Node[] = [];
  //     idsArray.forEach((id) => {
  //       const node = nodes.find((node) => node.id === parseInt(id));
  //       if (node) {
  //         console.log(node);
  //         route.push(node);
  //       }
  //     });
  //     setRouteNodes(route);
  //   }
  // }, [id, nodes]);

  const fetchHike = async (id: string | string[] | undefined) => {
    try {
      console.log('fetch');
      console.log(id);

      const response = await fetch(
        `http://localhost:8080/hikes/planned/${id}`,
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

  const { isLoading, error, data } = useQuery<any, Error>(
    ['route', id],
    () => fetchHike(id),
    {
      enabled: Boolean(id),
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

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
        isLoading={isLoading}
      ></MapContainer>

      <div>Elevation profile</div>
    </div>
  );
};

PlannedHike.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default PlannedHike;
