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
  const [searchForm, setSearchForm] = useState<SearchForm>({});

  useEffect(() => {
    if (!ref.current) return;
    onWidthChange(ref.current.offsetWidth);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSearchForm((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleSearchRoute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchForm);
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
          <FormControl isRequired>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon />}
              />
              <Input
                type="text"
                placeholder="Starting point"
                name="1"
                value={searchForm[1]}
                onChange={handleSearchChange}
                mb={2}
              />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon />}
              />
              <Input
                type="text"
                placeholder="Destination"
                name="2"
                value={searchForm[2]}
                onChange={handleSearchChange}
                mb={2}
              />
            </InputGroup>
          </FormControl>

          <Flex direction="column" gap={2}>
            <Button colorScheme="blue" type="submit">
              Search
            </Button>
          </Flex>
        </form>

        {isLoading
          ? 'Loading...'
          : error
          ? 'An error has occured: ' + error.message
          : data && data.route
          ? `${data.route.name.start} - ${data.route.name.end} - ${data.route.distance}m`
          : data && data.message}
      </div>
    </div>
  );
};

export default MapSidebar;
