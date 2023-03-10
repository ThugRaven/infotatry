import { SEO } from '@components/common';
import { MainLayout } from '@components/layouts';
import s from '@styles/Custom500.module.css';
import { ReactElement } from 'react';

const Custom500 = () => {
  return (
    <>
      <SEO title="500: Wewnętrzny błąd serwera" />
      <div className={s.container}>
        <span className={s.code}>500</span> Wewnętrzny błąd serwera.
      </div>
    </>
  );
};

Custom500.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout maxHeight>{page}</MainLayout>;
};

export default Custom500;
