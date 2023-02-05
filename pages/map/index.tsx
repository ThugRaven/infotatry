import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import { MapContainer, MapSidebar } from '@components/map';
import s from '@styles/MapPage.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/router';
import { ReactElement, useReducer, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { SearchForm } from '../../components/map/MapSidebar/MapSidebar';

interface HikeArgs {
  query: SearchForm | null;
  date: number;
}

type WeatherSite = {
  id: number;
  name: string;
};

export type Route = {
  name: {
    start: string;
    end: string;
  };
  trails: number[];
  distance: number;
  time: number;
  ascent: number;
  descent: number;
  weatherSite: WeatherSite | null;
};

export interface PopupState {
  type: 'start' | 'mid' | 'end';
  name: string | null;
}

export interface PopupAction {
  type: 'START_NODE' | 'MIDDLE_NODE' | 'END_NODE';
  payload: string | null;
}

const popupReducer = (state: PopupState, action: PopupAction): PopupState => {
  switch (action.type) {
    case 'START_NODE': {
      return {
        type: 'start',
        name: action.payload,
      };
    }
    case 'MIDDLE_NODE': {
      return {
        type: 'mid',
        name: action.payload,
      };
    }
    case 'END_NODE': {
      return {
        type: 'end',
        name: action.payload,
      };
    }
    default:
      return state;
  }
};

const MapPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(0);
  const [query, setQuery] = useState<SearchForm | null>(null);
  const [index, setIndex] = useState(0);
  const [state, dispatch] = useReducer(popupReducer, {
    type: 'start',
    name: '',
  });
  const router = useRouter();

  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  let nextDay = new Date();
  nextDay = new Date(
    new Date(nextDay.setDate(new Date().getDate() + 1)).setHours(15, 0, 0, 0),
  );
  const [date, setDate] = useState(
    new Date(nextDay).toISOString().slice(0, -1),
  );

  const onToggle = () => {
    setIsOpen((open) => !open);
  };

  const onWidthChange = (width: number) => {
    setWidth(width);
  };

  const fetchRoute = async (query: SearchForm | null) => {
    try {
      console.log('fetch');
      console.log(query);

      const response = await fetch(`http://localhost:8080/route/${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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

  const { isLoading, error, data } = useQuery<Route[], Error>(
    ['route', query],
    () => fetchRoute(query),
    {
      enabled: Boolean(query),
      refetchOnWindowFocus: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('onSuccess Route');
        console.log(data);
        setIndex(0);
      },
    },
  );

  const fetchWeather = async (name?: string) => {
    console.log('data', data);

    try {
      if (!name) {
        return false;
      }
      console.log('fetch');
      console.log(query);

      const response = await fetch(
        `http://localhost:8080/weather/forecast/${name}`,
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

  const {
    isLoading: isLoadingForecast,
    error: forecastError,
    data: forecastData,
  } = useQuery<any, Error>(
    ['weather', data && data[0].weatherSite?.name],
    () => fetchWeather(data && data[0].weatherSite?.name),
    {
      enabled: Boolean(data),
      refetchOnWindowFocus: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('onSuccess Weather');
        console.log(data);
      },
    },
  );

  const fetchAvalanches = async () => {
    console.log('data', data);

    try {
      console.log('fetch');
      console.log(query);

      const response = await fetch(`http://localhost:8080/avalanches/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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

  const {
    isLoading: isLoadingAvalanches,
    error: avalanchesError,
    data: avalanchesData,
  } = useQuery<any, Error>(['avalanche-bulletin'], () => fetchAvalanches(), {
    refetchOnWindowFocus: false,
    cacheTime: 15 * 60 * 1000, // 15 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    onSuccess: (data) => {
      console.log('onSuccess avalanche bulletin');
      console.log(data);
    },
  });

  const handleSearch = (searchForm: SearchForm) => {
    let searchQuery = '';
    for (const key in searchForm) {
      const element = searchForm[key];
      searchQuery = searchQuery.concat(element + ';');
    }
    searchQuery = searchQuery.slice(0, -1);
    setQuery(searchQuery.trim().toLowerCase());
  };

  const createHike = async ({ query, date }: HikeArgs) => {
    try {
      if (!query || !data) {
        return null;
      }

      const response = await fetch('http://localhost:8080/hikes/planned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          date,
        }),
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

  const hikeMutation = useMutation((newHike: HikeArgs) => createHike(newHike));

  const handlePlanHike = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data) {
      console.log(data);
    }

    hikeMutation.mutate(
      { query, date: new Date(date).getTime() },
      {
        onSuccess: (data) => {
          console.log(data);
          console.log(data && data._id);
          if (data) {
            setIsOpen(false);
            router.push(`/hikes/planned/${data._id}`);
          }
        },
      },
    );
  };

  const handleSelectRoute = (index: number) => {
    console.log(index);

    setIndex(index);
  };

  // const handlePreviousRoute = () => {
  //   if (data) {
  //     setIndex((prevIndex) => (prevIndex === 0 ? prevIndex : prevIndex - 1));
  //   }
  // };

  // const handleNextRoute = () => {
  //   if (data) {
  //     setIndex((prevIndex) =>
  //       prevIndex === data.length - 1 ? prevIndex : prevIndex + 1,
  //     );
  //   }
  // };

  return (
    <>
      <div className={s.container}>
        <MapSidebar
          isOpen={isOpen}
          onToggle={onToggle}
          onWidthChange={onWidthChange}
          isLoading={isLoading}
          error={error}
          data={data}
          onSearch={handleSearch}
          onPlanHike={onOpen}
          index={index}
          onSelectRoute={handleSelectRoute}
          popupState={state}
          dangerLevel={(avalanchesData && avalanchesData[0].danger) ?? null}
          // onPreviousRoute={handlePreviousRoute}
          // onNextRoute={handleNextRoute}
        />
        <span>{forecastData?.list[0].main.temp}</span>
        <MapContainer
          padding={isOpen ? width : 0}
          trailIds={data && data[index].trails}
          popupDispatch={dispatch}
        />
        <Modal isOpen={isModalOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select date and time of hike</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handlePlanHike}>
              <ModalBody>
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="datetime-local"
                    name="date"
                    mb={2}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Plan a hike
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

MapPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default MapPage;
