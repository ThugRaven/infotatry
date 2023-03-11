import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { getServerSidePropsIsAdmin } from '@lib/api';
import { ReactElement } from 'react';

export const getServerSideProps = getServerSidePropsIsAdmin;

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
