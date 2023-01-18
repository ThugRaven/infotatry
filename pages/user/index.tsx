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

  const fetchPlannedHikes = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/hikes/planned?${new URLSearchParams({
          page: '1',
        })}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
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

  const {
    isLoading: isLoadingCount,
    error: errorCount,
    data: hikesCount,
  } = useQuery<any, Error>(['hikes-count', user?.id], fetchHikesCount, {
    enabled: true,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const {
    isLoading: isLoadingPlanned,
    error: errorPlanned,
    data: plannedHikes,
  } = useQuery<any, Error>(['hikes-planned', user?.id], fetchPlannedHikes, {
    enabled: true,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const plannedHikesList = plannedHikes ? (
    <ul>
      {plannedHikes.data.map((hike: any) => (
        <li key={hike._id}>
          {hike.name ? `${hike.name.start} - ${hike.name.end}` : hike.query}
        </li>
      ))}
    </ul>
  ) : (
    <div>No planned hikes found!</div>
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
            <span>Planned hikes: {hikesCount?.plannedHikes}</span>
            <span>Completed hikes: {hikesCount?.completedHikes}</span>
          </VStack>
          {plannedHikesList}
        </>
      )}
    </div>
  );
};

User.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default User;
