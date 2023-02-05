import { Button, Flex } from '@chakra-ui/react';
import NodeIcon from '@components/icons/NodeIcon';
import { PopupState } from 'pages/map';
import { useEffect, useState } from 'react';
import { FaHiking } from 'react-icons/fa';
import { MdAdd, MdLandscape, MdSwapVert } from 'react-icons/md';
import SearchInputTest from '../SearchInputTest';
import s from './SearchRoute.module.css';

interface SearchRouteProps {
  onSearch: (searchForm: SearchForm) => void;
  popupState: PopupState;
}

export type SearchForm = { [key: number]: string };

const SearchRoute = ({ onSearch, popupState }: SearchRouteProps) => {
  const [searchForm, setSearchForm] = useState<string[]>(['', '']);

  useEffect(() => {
    console.log(popupState);
    const newSearchForm = [...searchForm];
    if (popupState.name) {
      switch (popupState.type) {
        case 'start': {
          newSearchForm[0] = popupState.name;
          break;
        }
        case 'mid': {
          newSearchForm.splice(searchForm.length - 1, 0, popupState.name);
          break;
        }
        case 'end': {
          newSearchForm[searchForm.length - 1] = popupState.name;
          break;
        }
      }

      setSearchForm(newSearchForm);
    }
  }, [popupState]);

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

  const handleRemoveDestination = (index: number) => {
    const newSearchForm = [...searchForm];

    if (searchForm.length <= 2) {
      newSearchForm[index] = '';
    } else {
      newSearchForm.splice(index, 1);
    }

    setSearchForm(newSearchForm);
  };

  const handleReverseRoute = () => {
    const newSearchForm = [...searchForm].reverse();
    setSearchForm(newSearchForm);
  };

  return (
    <form onSubmit={handleSearchRoute}>
      <div className={s.search}>
        <SearchInputTest
          icon={<FaHiking />}
          searchResults={{ nodes: [], trails: [] }}
          placeholder="Punkt początkowy..."
          name="0"
          value={searchForm[0]}
          onChange={handleSearchChange}
          onSearch={() => {
            console.log('search');
          }}
          onClick={() => {
            console.log('click');
          }}
          onRemove={() => handleRemoveDestination(0)}
        />

        <SearchInputTest
          icon={searchForm.length <= 2 ? <MdLandscape /> : <NodeIcon />}
          searchResults={{ nodes: [], trails: [] }}
          placeholder="Punkt docelowy..."
          name="1"
          value={searchForm[1]}
          onChange={handleSearchChange}
          onSearch={() => {
            console.log('search');
          }}
          onClick={() => {
            console.log('click');
          }}
          onRemove={() => handleRemoveDestination(1)}
        />

        {searchForm.length >= 2 && (
          <>
            {searchForm.map((value, index) => {
              if (index > 1) {
                return (
                  <SearchInputTest
                    key={index}
                    icon={
                      searchForm.length - 1 !== index ? (
                        <NodeIcon />
                      ) : (
                        <MdLandscape />
                      )
                    }
                    searchResults={{ nodes: [], trails: [] }}
                    placeholder="Punkt docelowy..."
                    name={index.toString()}
                    value={searchForm[index]}
                    onChange={handleSearchChange}
                    onSearch={() => {
                      console.log('search');
                    }}
                    onClick={() => {
                      console.log('click');
                    }}
                    onRemove={() => handleRemoveDestination(index)}
                  />
                );
              }
            })}
          </>
        )}
      </div>

      <div className={s.search__actions}>
        <button
          className={s.search__action}
          aria-label="Odwróć trasę"
          type="button"
          onClick={handleAddDestination}
          disabled={!searchForm.every((value) => value != '')}
        >
          <MdAdd className={s.search__icon} />
          <span>Dodaj punkt</span>
        </button>
        <button
          className={s.search__action}
          aria-label="Dodaj punkt"
          type="button"
          onClick={handleReverseRoute}
        >
          <MdSwapVert className={s.search__icon} />
          <span>Odwróć trasę</span>
        </button>
      </div>

      <Flex direction="column" gap={2}>
        <Button colorScheme="blue" type="submit">
          Search
        </Button>
      </Flex>
    </form>
  );
};

export default SearchRoute;