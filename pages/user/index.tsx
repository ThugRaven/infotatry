import { Avatar, Text, VStack } from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import s from '@styles/User.module.css';
import { useAuth } from 'hooks/useAuth';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';

const User = () => {
  const { user, status } = useAuth();

  const fetchHikesCount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/hikes/count`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

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

  const { isLoading, error, data } = useQuery<any, Error>(
    ['hikes-count', user?.id],
    fetchHikesCount,
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

  return (
    <div className={s.container}>
      {user && (
        <>
          <Avatar name={user?.name} src={user?.image} />
          <Text fontSize={'lg'} mt={1}>
            {user?.name}
          </Text>
          <VStack spacing={0} mt={2}>
            <span>Planned hikes: {data?.plannedHikes}</span>
            <span>Completed hikes: {data?.completedHikes}</span>
          </VStack>
        </>
      )}
    </div>
  );
};

User.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default User;
