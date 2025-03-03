import {
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import { MapContainer, MapSidebar } from '@components/map';
import { SearchForm } from '@components/map/MapSidebar/MapSidebar';
import { Button } from '@components/ui';
import { WeatherModal } from '@components/weather';
import s from '@styles/MapPage.module.css';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useReducer, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Route } from 'types/route-types';
import {
  CurrentWeatherResponse,
  WeatherForecastResponse,
} from 'types/weather-types';
import { Avalanche } from './avalanches';

interface HikeArgs {
  query: SearchForm | null;
  date: number;
}

export interface PopupState {
  type: 'start' | 'mid' | 'end' | 'camera';
  feature: 'node' | 'trail' | null;
  name: string | null;
  bounds?: [[number, number], [number, number]];
}

export interface PopupAction {
  type: 'START_NODE' | 'MIDDLE_NODE' | 'END_NODE' | 'CAMERA';
  payload: {
    feature: 'node' | 'trail' | null;
    name: string | null;
    bounds?: [[number, number], [number, number]];
  };
}

const popupReducer = (state: PopupState, action: PopupAction): PopupState => {
  switch (action.type) {
    case 'START_NODE': {
      return {
        type: 'start',
        feature: action.payload.feature,
        name: action.payload.name,
      };
    }
    case 'MIDDLE_NODE': {
      return {
        type: 'mid',
        feature: action.payload.feature,
        name: action.payload.name,
      };
    }
    case 'END_NODE': {
      return {
        type: 'end',
        feature: action.payload.feature,
        name: action.payload.name,
      };
    }
    case 'CAMERA': {
      return {
        type: 'camera',
        feature: action.payload.feature,
        name: null,
        bounds: action.payload.bounds,
      };
    }
    default:
      return state;
  }
};

const MapPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [width, setWidth] = useState(0);
  const [query, setQuery] = useState<SearchForm | null>(null);
  const [index, setIndex] = useState(0);
  const [state, dispatch] = useReducer(popupReducer, {
    type: 'start',
    feature: null,
    name: null,
  });
  const router = useRouter();
  const toast = useToast();
  const [hoveredNode, setHoveredNode] = useState(-1);
  const [selectedNode, setSelectedNode] = useState(-1);
  const [hoveredTrail, setHoveredTrail] = useState(-1);
  const [selectedTrail, setSelectedTrail] = useState(-1);

  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isWeatherModalOpen,
    onOpen: onWeatherModalOpen,
    onClose: onWeatherModalClose,
  } = useDisclosure();
  let nextDay = new Date();
  nextDay = new Date(
    new Date(nextDay.setDate(new Date().getDate() + 1)).setHours(15, 0, 0, 0),
  );
  const [date, setDate] = useState(
    new Date(nextDay).toISOString().slice(0, -1),
  );

  const onToggle = useCallback(() => {
    setIsCollapsed((collapsed) => !collapsed);
  }, []);

  const onWidthChange = useCallback((width: number) => {
    setWidth(width);
  }, []);

  const fetchRoute = async (query: SearchForm | null) => {
    try {
      console.log('fetch');
      console.log(query);
      if (!query) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/route/${query}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        if (data && data.status && data.message && data.status === 404) {
          throw new Error(data.message);
        }
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
      retry: (failureCount, error) => {
        if (failureCount === 3 || error.message === 'Route not found') {
          return false;
        }
        return true;
      },
      onSuccess: (data) => {
        console.log('onSuccess Route');
        console.log(data);
        setIndex(0);
      },
    },
  );

  const fetchCurrentWeather = async (name?: string) => {
    console.log('data', data);

    try {
      if (!name) {
        return false;
      }
      console.log('fetch');
      console.log(query);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/weather/current/${name}`,
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

  const { data: currentWeatherData } = useQuery<CurrentWeatherResponse, Error>(
    ['current-weather', data && data[index].weatherSite],
    () => fetchCurrentWeather(data && data[index].weatherSite),
    {
      enabled: Boolean(data),
      refetchOnWindowFocus: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('onSuccess current weather');
        console.log(data);
      },
    },
  );

  const fetchWeatherForecast = async (name?: string) => {
    console.log('data', data);

    try {
      if (!name) {
        return false;
      }
      console.log('fetch');
      console.log(query);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/weather/forecast/${name}`,
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

  const { data: weatherForecastData } = useQuery<
    WeatherForecastResponse,
    Error
  >(
    ['weather', data && data[index].weatherSite],
    () => fetchWeatherForecast(data && data[index].weatherSite),
    {
      enabled: Boolean(isWeatherModalOpen),
      refetchOnWindowFocus: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('onSuccess weather forecast');
        console.log(data);
      },
    },
  );

  const fetchAvalanches = async () => {
    console.log('data', data);

    try {
      console.log('fetch');
      console.log(query);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/avalanches/`,
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

  const { data: avalanchesData } = useQuery<Avalanche[], Error>(
    ['avalanches-last'],
    () => fetchAvalanches(),
    {
      refetchOnWindowFocus: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('onSuccess avalanche bulletin');
        console.log(data);
      },
    },
  );

  const handleSearch = useCallback((searchForm: SearchForm | null) => {
    console.log('handleSearch');
    if (!searchForm) {
      setSelectedNode(-1);
      setSelectedTrail(-1);
      return setQuery(null);
    }

    let searchQuery = '';
    for (const key in searchForm) {
      const element = searchForm[key];
      searchQuery = searchQuery.concat(element + ';');
    }
    searchQuery = searchQuery.slice(0, -1);
    setQuery(searchQuery.trim().toLowerCase());
  }, []);

  const createHike = async ({ query, date }: HikeArgs) => {
    try {
      if (!query || !data) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hikes/planned`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            date,
          }),
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
            setIsCollapsed(false);
            router.push(`/hikes/planned/${data._id}`);
          }
        },
        onError: (error) => {
          if (error instanceof Error) {
            if (error.message === 'Unauthorized') {
              toast({
                title: 'Wystąpił błąd!',
                description: 'Aby zaplanować wędrówkę należy być zalogowanym!',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            }
          }
        },
      },
    );
  };

  const handleSelectRoute = useCallback((index: number) => {
    console.log(index);
    setIndex(index);
  }, []);

  const handleHover = useCallback((id: number, type: 'node' | 'trail') => {
    if (type === 'node') {
      setHoveredNode(id);
    } else {
      setHoveredTrail(id);
    }
  }, []);

  const handleSelectSegment = useCallback(
    (id: number, type: 'node' | 'trail') => {
      if (type === 'node') {
        setSelectedNode(id);
        setSelectedTrail(-1);
      } else {
        setSelectedNode(-1);
        setSelectedTrail(id);
      }
    },
    [],
  );

  const handleClick = useCallback((id: number, type: 'node' | 'trail') => {
    if (type === 'node') {
      setSelectedNode((v) => (v === id ? -1 : id));
      setSelectedTrail(-1);
    } else {
      setSelectedNode(-1);
      setSelectedTrail((v) => (v === id ? -1 : id));
    }
  }, []);

  return (
    <>
      <div className={s.container}>
        <div className={s.map}>
          <MapContainer
            padding={isCollapsed ? width : 0}
            trailIds={data && data[index].trails}
            popupDispatch={dispatch}
            hoveredNode={hoveredNode}
            selectedNode={selectedNode}
            hoveredTrail={hoveredTrail}
            selectedTrail={selectedTrail}
            bounds={state.bounds}
          />
        </div>
        <MapSidebar
          isCollapsed={isCollapsed}
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
          increase={avalanchesData && avalanchesData[0].increase}
          currentWeather={currentWeatherData}
          onWeatherModalOpen={onWeatherModalOpen}
          onHover={handleHover}
          onSelectSegment={handleSelectSegment}
          onClick={handleClick}
          className={s.sidebar}
        />
        <Modal isOpen={isModalOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent className={s.modal}>
            <ModalHeader>Wybierz datę i godzinę wędrówki</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handlePlanHike}>
              <ModalBody>
                <FormControl isRequired>
                  <Input
                    type="datetime-local"
                    name="date"
                    mb={2}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter className={s.footer}>
                <Button>Zaplanuj wędrówkę</Button>
                <Button onClick={onClose} variant="outline" type="button">
                  Anuluj
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
        <WeatherModal
          location={(data && data[index].weatherSite) ?? ''}
          weatherData={{
            currentWeather: currentWeatherData,
            weatherForecast: weatherForecastData,
          }}
          isOpen={isWeatherModalOpen}
          onClose={onWeatherModalClose}
        />
      </div>
    </>
  );
};

MapPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout maxHeight={true}>{page}</MainLayout>;
};

export default MapPage;
