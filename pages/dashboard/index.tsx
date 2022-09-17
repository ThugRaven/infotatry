import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement } from 'react';

const Dashboard = () => {
  return (
    <>
      <SEO title="Dashboard" />
      Dashboard
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
