import { Button, useColorMode } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { MainLayout } from '../components/layouts';
import s from '../styles/Home.module.css';
import { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className={s.container}>
      <main className={s.main}>
        <h1 className={s.title}>Strona główna</h1>

        <p className={s.description}>
          <Button onClick={toggleColorMode}>
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
          </Button>
        </p>
      </main>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
