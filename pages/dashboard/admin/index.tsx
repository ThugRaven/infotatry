import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement } from 'react';

const DashboardAdmin = () => {
  return (
    <>
      <SEO title="Admin Dashboard" />
      Admin Dashboard
    </>
  );
};

DashboardAdmin.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardAdmin;
