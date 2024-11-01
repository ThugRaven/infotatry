import { Spinner } from '@chakra-ui/react';
import { Closure } from '@components/closures';
import { SEO } from '@components/common';
import { MainLayout } from '@components/layouts';
import s from '@styles/Closures.module.css';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';

type Closure = {
  _id: string;
  type: string;
  title: string;
  reason: string;
  since: string | null;
  until: string | null;
  description: string;
  source: string | null;
};

const Closures = () => {
  const fetchClosures = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/announcements/closures`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

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

  const { isLoading: isLoadingClosures, data: closuresData } = useQuery<
    Closure[],
    Error
  >(['closures'], fetchClosures, {
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 15 * 60 * 1000, // 15 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <>
      <SEO title="Zamknięcia szlaków" />
      <div className={s.container}>
        <div className={s.wrapper}>
          <section className={s.card}>
            <h2 className={s.title}>Zamknięcia szlaków</h2>
            {closuresData ? (
              <ul className={s.closures}>
                {closuresData &&
                  closuresData.map((closure) => (
                    <Closure
                      key={closure._id}
                      title={closure.title}
                      reason={closure.reason}
                      since={closure.since}
                      until={closure.until}
                      source={closure.source}
                      description={closure.description}
                    />
                  ))}
              </ul>
            ) : isLoadingClosures ? (
              <div className={s.spinner}>
                <Spinner thickness="5px" size="xl" color="black" />
              </div>
            ) : (
              <p className={s.error}>Błąd wczytywania danych</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

Closures.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Closures;
