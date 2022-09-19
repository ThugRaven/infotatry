import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement } from 'react';

const DashboardAdminMap = () => {
  return (
    <>
      <SEO title="Admin Dashboard - Map" />
      Admin Dashboard - Map
    </>
  );
};

DashboardAdminMap.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardAdminMap;