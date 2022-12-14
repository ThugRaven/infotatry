import { ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import s from './MapSidebar.module.css';

interface MapSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onWidthChange: (width: number) => void;
  isLoading: boolean;
  error: Error | null;
  data: any;
  onSearch: (searchForm: SearchForm) => void;
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
}: MapSidebarProps) => {
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
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon />}
              />
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
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon />}
              />
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
                        <InputLeftElement
                          pointerEvents="none"
                          children={<SearchIcon />}
                        />
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

        {isLoading ? (
          'Loading...'
        ) : error ? (
          'An error has occured: ' + error.message
        ) : data && data.route ? (
          <div className={s.route__info}>
            <p>{`${data.route.name.start} - ${data.route.name.end}`}</p>
            <p title={`${data.route.distance} m`}>{`${
              (Math.floor(data.route.distance / 1000) * 1000 +
                Math.round((data.route.distance % 1000) / 100) * 100) /
              1000
            } km`}</p>
            <p title={`${data.route.duration} min.`}>{`${Math.floor(
              data.route.duration / 60,
            )}:${
              data.route.duration % 60 >= 10
                ? data.route.duration % 60
                : `0${data.route.duration % 60}`
            } h`}</p>
            <p>Ascent: {`${data.route.ascent} m`}</p>
            <p>Descent: {`${data.route.descent} m`}</p>
          </div>
        ) : (
          data && data.message
        )}
      </div>
    </div>
  );
};

export default MapSidebar;
