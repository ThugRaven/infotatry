import { MainLayout } from '@components/layouts';
import { MapContainer } from '@components/map';
import s from '@styles/Trips.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/router';
import { Node, Trail } from 'pages/dashboard/admin/map';
import { ReactElement, useEffect, useState } from 'react';
import features from '../../public/features.json';

const Trips = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routeNodes, setRouteNodes] = useState<Node[]>([]);

  useEffect(() => {
    const data = features;
    setTrails(data.trails as Trail[]);
    setNodes(data.nodes as Node[]);
  }, []);

  const router = useRouter();
  const { ids } = router.query;

  useEffect(() => {
    console.log('useEffect');
    if (ids && typeof ids === 'string' && nodes) {
      const decoded = decodeURIComponent(ids);
      const idsArray = decoded.split(',');
      console.log(idsArray);
      const route: Node[] = [];
      idsArray.forEach((id) => {
        const node = nodes.find((node) => node.id === parseInt(id));
        if (node) {
          console.log(node);
          route.push(node);
        }
      });
      setRouteNodes(route);
    }
  }, [ids, nodes]);

  return (
    <div className={s.container}>
      <ul>
        {routeNodes.map((node, index) => (
          <li key={`${node.id}-${index}`}>
            {node.id} | {node.name}
          </li>
        ))}
      </ul>

      <MapContainer></MapContainer>
    </div>
  );
};

Trips.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Trips;
