import { ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import AvalancheInfo from '@components/avalanche/AvalancheInfo';
import RouteResult from '@components/route/RouteResult';
import { SearchRoute } from '@components/search';
import { PopupState } from 'pages/map';
import React, { useEffect, useRef, useState } from 'react';
import s from './MapSidebar.module.css';

interface MapSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onWidthChange: (width: number) => void;
  isLoading: boolean;
  error: Error | null;
  data: any;
  onSearch: (searchForm: SearchForm) => void;
  onPlanHike: () => void;
  index: number;
  onSelectRoute: (index: number) => void;
  popupState: PopupState;
  dangerLevel: number | null;
  // onPreviousRoute: () => void;
  // onNextRoute: () => void;
}

export type SearchForm = { [key: number]: string };

const MapSidebar = ({
  isOpen,
  onToggle,
  onWidthChange,
  isLoading,
  error,
  data,
  onSearch,
  onPlanHike,
  index,
  onSelectRoute,
  popupState,
  dangerLevel,
}: // onPreviousRoute,
// onNextRoute,
MapSidebarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [searchForm, setSearchForm] = useState<string[]>(['', '']);

  useEffect(() => {
    if (!ref.current) return;
    onWidthChange(ref.current.offsetWidth);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newSearchForm = [...searchForm];
    newSearchForm[parseInt(name)] = value;
    setSearchForm(newSearchForm);
  };

  const handleSearchRoute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchForm.some((value) => value == '')) {
      console.log('Search cancelled - not every field is filled in');
      return;
    }
    console.log('Search');
    onSearch(searchForm);
  };

  const handleAddDestination = () => {
    setSearchForm((state) => [...state, '']);
  };

  const handleRemoveDestination = () => {
    if (searchForm.length <= 2) {
      return;
    }
    const newSearchForm = [...searchForm];
    newSearchForm.pop();
    setSearchForm(newSearchForm);
  };

  const currentRoute = data && data[index];

  return (
    <div className={s.wrapper}>
      <div className={`${s.container} ${!isOpen ? s.collapsed : ''}`} ref={ref}>
        <button className={s.toggle} onClick={onToggle}>
          <ChevronLeftIcon
            w={6}
            h={6}
            className={`${s.toggle__icon} ${!isOpen ? s.rotate : ''}`}
          />
        </button>
        <form onSubmit={handleSearchRoute}>
          <FormControl>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Starting point"
                name="0"
                value={searchForm[0]}
                onChange={handleSearchChange}
                mb={2}
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Destination"
                name="1"
                value={searchForm[1]}
                onChange={handleSearchChange}
                mb={2}
              />
            </InputGroup>
          </FormControl>

          {searchForm.length >= 2 && (
            <>
              {searchForm.map((value, index) => {
                if (index > 1) {
                  return (
                    <FormControl key={index}>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon />
                        </InputLeftElement>
                        <Input
                          type="text"
                          placeholder="Destination"
                          name={index.toString()}
                          value={searchForm[index]}
                          onChange={handleSearchChange}
                          mb={2}
                        />
                      </InputGroup>
                    </FormControl>
                  );
                }
              })}

              <Button
                colorScheme="blue"
                mb={2}
                onClick={handleAddDestination}
                disabled={!searchForm.every((value) => value != '')}
              >
                Add destination
              </Button>

              <Button
                colorScheme="blue"
                ml={2}
                mb={2}
                onClick={handleRemoveDestination}
                disabled={searchForm.length <= 2}
              >
                Remove destination
              </Button>
            </>
          )}

          <Flex direction="column" gap={2}>
            <Button colorScheme="blue" type="submit">
              Search
            </Button>
          </Flex>
        </form>

        <Button colorScheme="blue" mt={2} onClick={onPlanHike}>
          Plan a hike
        </Button>

        {isLoading ? (
          'Loading...'
        ) : error ? (
          'An error has occured: ' + error.message
        ) : data && currentRoute ? (
          <>
            <div className={s.route__info}>
              <p>{`${currentRoute.name.start} - ${currentRoute.name.end}`}</p>
              <p title={`${currentRoute.distance} m`}>{`${
                (Math.floor(currentRoute.distance / 1000) * 1000 +
                  Math.round((currentRoute.distance % 1000) / 100) * 100) /
                1000
              } km`}</p>
              <p title={`${currentRoute.time} min.`}>{`${Math.floor(
                currentRoute.time / 60,
              )}:${
                currentRoute.time % 60 >= 10
                  ? currentRoute.time % 60
                  : `0${currentRoute.time % 60}`
              } h`}</p>
              <p>Ascent: {`${currentRoute.ascent} m`}</p>
              <p>Descent: {`${currentRoute.descent} m`}</p>
            </div>
          </>
        ) : (
          data && data.message
        )}

        <SearchRoute onSearch={onSearch} popupState={popupState} />

        {isLoading ? (
          'Loading...'
        ) : error ? (
          'An error has occured: ' + error.message
        ) : data && data.length > 0 ? (
          <>
            <ul>
              {data.toString()}
              {data.map((route: any, idx: number) => (
                <RouteResult
                  key={idx}
                  index={idx}
                  active={index === idx}
                  type={route.type}
                  distance={route.distance}
                  time={route.time}
                  ascent={route.ascent}
                  descent={route.descent}
                  segments={route.segments}
                  onClick={() => onSelectRoute(idx)}
                />
              ))}
            </ul>
          </>
        ) : (
          data && data.message
        )}

        <AvalancheInfo level={dangerLevel} />

        {/* <HStack justifyContent={'center'} mt={2}>
          <IconButton aria-label="Previous route" onClick={onPreviousRoute}>
            <ChevronLeftIcon boxSize={6} />
          </IconButton>
          <IconButton aria-label="Next route" onClick={onNextRoute}>
            <ChevronRightIcon boxSize={6} />
          </IconButton>
        </HStack> */}
      </div>
    </div>
  );
};

export default MapSidebar;
