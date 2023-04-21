import NodeIcon from '@components/icons/NodeIcon';
import { SearchForm } from '@components/map/MapSidebar/MapSidebar';
import { useDebounce } from 'hooks/useDebounce';
import { PopupState } from 'pages';
import { useCallback, useEffect, useState } from 'react';
import { FaHiking } from 'react-icons/fa';
import { MdAdd, MdClose, MdLandscape, MdSwapVert } from 'react-icons/md';
import SearchInputTest from '../SearchInputTest';
import s from './SearchRoute.module.css';

interface SearchRouteProps {
  onSearch: (searchForm: SearchForm) => void;
  onClear: () => void;
  popupState: PopupState;
  hasRoute: boolean;
}

const SearchRoute = ({
  onSearch,
  onClear,
  popupState,
  hasRoute,
}: SearchRouteProps) => {
  const [searchForm, setSearchForm] = useState<string[]>(['', '']);
  const debouncedSearchForm = useDebounce<string[]>(searchForm, 1000);

  useEffect(() => {
    console.log(popupState);
    const { feature, name, type } = popupState;
    if (feature && name) {
      const trailNames = name.split('-').map((name) => name.trim());
      switch (type) {
        case 'start': {
          if (feature === 'node') {
            setSearchForm((oldSearchForm) => {
              const newSearchForm = [...oldSearchForm];
              newSearchForm[0] = name;
              return newSearchForm;
            });
          } else if (feature === 'trail') {
            setSearchForm((oldSearchForm) => {
              const newSearchForm = [...oldSearchForm];
              newSearchForm[0] = trailNames[0];
              newSearchForm[1] = trailNames[1];
              return newSearchForm;
            });
          }
          break;
        }
        case 'mid': {
          if (feature === 'node') {
            setSearchForm((oldSearchForm) => {
              const newSearchForm = [...oldSearchForm];
              newSearchForm.splice(oldSearchForm.length - 1, 0, name);
              return newSearchForm;
            });
          } else if (feature === 'trail') {
            setSearchForm((oldSearchForm) => {
              const newSearchForm = [...oldSearchForm];
              newSearchForm.splice(oldSearchForm.length - 1, 0, ...trailNames);
              return newSearchForm;
            });
          }
          break;
        }
        case 'end': {
          if (feature === 'node') {
            setSearchForm((oldSearchForm) => {
              const newSearchForm = [...oldSearchForm];
              newSearchForm[oldSearchForm.length - 1] = name;
              return newSearchForm;
            });
          } else if (feature === 'trail') {
            setSearchForm((oldSearchForm) => {
              const newSearchForm = [...oldSearchForm];
              newSearchForm[oldSearchForm.length - 1] = trailNames[0];
              newSearchForm.push(trailNames[1]);
              return newSearchForm;
            });
          }
          break;
        }
      }
    }
  }, [popupState]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newSearchForm = [...searchForm];
    newSearchForm[parseInt(name)] = value;
    setSearchForm(newSearchForm);
  };

  const handleSearchRoute = useCallback(() => {
    if (debouncedSearchForm.some((value) => value == '')) {
      console.log('Search cancelled - not every field is filled in');
      return;
    }
    console.log('Search');
    onSearch(debouncedSearchForm);
  }, [debouncedSearchForm, onSearch]);

  useEffect(() => {
    handleSearchRoute();
  }, [debouncedSearchForm, handleSearchRoute]);

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

  const handleClearRoute = () => {
    setSearchForm(['', '']);
    onClear();
  };

  return (
    <>
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
          aria-label="Dodaj punkt"
          type="button"
          onClick={handleAddDestination}
          disabled={!searchForm.every((value) => value != '')}
        >
          <MdAdd className={s.search__icon} />
          <span>Dodaj punkt</span>
        </button>
        <button
          className={s.search__action}
          aria-label="Odwróć trasę"
          type="button"
          onClick={handleReverseRoute}
        >
          <MdSwapVert className={s.search__icon} />
          <span>Odwróć trasę</span>
        </button>
        {(hasRoute || searchForm.some((value) => value !== '')) && (
          <button
            className={s.search__action}
            aria-label="Wyczyść"
            type="button"
            onClick={handleClearRoute}
          >
            <MdClose className={s.search__icon} />
            <span>Wyczyść</span>
          </button>
        )}
      </div>
    </>
  );
};

export default SearchRoute;
