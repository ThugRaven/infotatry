import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { getServerSidePropsIsAuthenticated } from '@lib/api';
import { ReactElement } from 'react';

export const getServerSideProps = getServerSidePropsIsAuthenticated;

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
