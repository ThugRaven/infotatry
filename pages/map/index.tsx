import {
  Button,
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
} from '@chakra-ui/react';
import { MainLayout } from '@components/layouts';
import { MapContainer, MapSidebar } from '@components/map';
import { TrailSegment } from '@components/route/RouteSegments/RouteSegments';
import WeatherModal from '@components/weather/WeatherModal';
import s from '@styles/MapPage.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/router';
import { ReactElement, useReducer, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { CurrentWeatherResponse } from 'types/weather-types';
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
  segments?: TrailSegment[];
  distance: number;
  time: number;
  ascent: number;
  descent: number;
  type: 'normal' | 'closed' | 'shortest';
  weatherSite: WeatherSite | null;
};

export interface PopupState {
  type: 'start' | 'mid' | 'end';
  feature: 'node' | 'trail' | null;
  name: string | null;
}

export interface PopupAction {
  type: 'START_NODE' | 'MIDDLE_NODE' | 'END_NODE';
  payload: {
    feature: 'node' | 'trail' | null;
    name: string | null;
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
    feature: null,
    name: null,
  });
  const router = useRouter();
  const [hoveredNode, setHoveredNode] = useState(-1);
  const [hoveredTrail, setHoveredTrail] = useState(-1);

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

  const fetchCurrentWeather = async (name?: string) => {
    console.log('data', data);

    try {
      if (!name) {
        return false;
      }
      console.log('fetch');
      console.log(query);

      const response = await fetch(
        `http://localhost:8080/weather/current/${name}`,
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
    isLoading: isLoadingCurrentWeather,
    error: currentWeatherError,
    data: currentWeatherData,
  } = useQuery<CurrentWeatherResponse, Error>(
    ['current-weather', data && data[0].weatherSite?.name],
    () => fetchCurrentWeather(data && data[0].weatherSite?.name),
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
    isLoading: isLoadingWeatherForecast,
    error: weatherForecastError,
    data: weatherForecastData,
  } = useQuery<any, Error>(
    ['weather', data && data[0].weatherSite?.name],
    () => fetchWeatherForecast(data && data[0].weatherSite?.name),
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
  } = useQuery<any, Error>(['avalanches-last'], () => fetchAvalanches(), {
    refetchOnWindowFocus: false,
    cacheTime: 15 * 60 * 1000, // 15 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    onSuccess: (data) => {
      console.log('onSuccess avalanche bulletin');
      console.log(data);
    },
  });

  const handleSearch = (searchForm: SearchForm) => {
    console.log('handleSearch');
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

  const handleHover = (id: number, type: 'node' | 'trail') => {
    if (type === 'node') {
      setHoveredNode(id);
    } else {
      setHoveredTrail(id);
    }
  };

  return (
    <>
      <div className={s.container}>
        <div className={s.map}>
          <MapContainer
            padding={isOpen ? width : 0}
            trailIds={data && data[index].trails}
            popupDispatch={dispatch}
            hoveredNode={hoveredNode}
            hoveredTrail={hoveredTrail}
          />
        </div>
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
          increase={avalanchesData && avalanchesData[0].increase}
          currentWeather={currentWeatherData}
          onWeatherModalOpen={onWeatherModalOpen}
          onHover={handleHover}
          className={s.sidebar}
        />
        <Modal isOpen={isModalOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
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

              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Zaplanuj wędrówkę
                </Button>
                <Button onClick={onClose}>Anuluj</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
        <WeatherModal
          location={(data && data[index].weatherSite?.name) ?? ''}
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
