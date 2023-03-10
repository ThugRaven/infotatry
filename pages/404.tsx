import { SEO } from '@components/common';
import { MainLayout } from '@components/layouts';
import s from '@styles/Custom404.module.css';
import { ReactElement } from 'react';

const Custom404 = () => {
  return (
    <>
      <SEO title="404: Strony nie znaleziono" />
      <div className={s.container}>
        <span className={s.code}>404</span> Strony nie znaleziono.
      </div>
    </>
  );
};

Custom404.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout maxHeight>{page}</MainLayout>;
};

export default Custom404;
