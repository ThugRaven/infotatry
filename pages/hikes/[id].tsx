import { MainLayout } from '@components/layouts';
import { MapContainer } from '@components/map';
import s from '@styles/Hikes.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/router';
import { Node, Trail } from 'pages/dashboard/admin/map';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import features from '../../public/features.json';

const Hikes = () => {
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

      const response = await fetch(`http://localhost:8080/hikes/${id}`, {
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

  return (
    <div className={s.container}>
      <ul>
        {routeNodes.map((node, index) => (
          <li key={`${node.id}-${index}`}>
            {node.id} | {node.name}
          </li>
        ))}
      </ul>

      <MapContainer
        trailIds={data && data.route ? data.route.trails : null}
        hike={data && data.route ? null : data}
        isLoading={isLoading}
      ></MapContainer>
    </div>
  );
};

Hikes.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Hikes;
