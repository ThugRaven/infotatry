import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { decode } from '@lib/utils';
import { FitBoundsOptions, LngLat, LngLatBounds } from 'mapbox-gl';
import { Node, Trail } from 'pages/dashboard/admin/map';
import { useEffect, useRef, useState } from 'react';
import SearchResult from '../SearchResult';
import s from './SearchInput.module.css';

type Results = {
  nodes: Node[];
  trails: Trail[];
};

export type CameraAction = {
  bounds: LngLatBounds;
  options: FitBoundsOptions;
};

interface SearchInputProps {
  results: Results;
  onSearch: (query: string) => void;
  onClick: (cameraAction: CameraAction) => void;
}

const SearchInput = ({ results, onSearch, onClick }: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const hasResults = results.nodes.length > 0 || results.trails.length > 0;
  const searchRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);
    onSearch(query.trim().toLowerCase());
  };

  const handleClick = (type: 'node' | 'trail', id: number) => {
    if (type === 'node') {
      let node = results.nodes.find((node) => node.id === id);

      if (node) {
        onClick({
          bounds: new LngLat(node.lng, node.lat).toBounds(0),
          options: { maxZoom: 19 },
        });
        setIsOpen(false);
      }
    } else if (type === 'trail') {
      let trail = results.trails.find((trail) => trail.id === id);

      if (trail) {
        let decoded = decode(trail.encoded);
        const bounds = new LngLat(decoded[0][1], decoded[0][0]).toBounds(0);

        decoded.forEach((node) => {
          bounds.extend([node[1], node[0]]);
        });

        onClick({
          bounds,
          options: {
            padding: 100,
            maxZoom: 18,
          },
        });
        setIsOpen(false);
      }
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleDocumentClick = (e: MouseEvent) => {
    if (!searchRef.current?.contains(e.target as HTMLElement)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className={s.search__wrapper} ref={searchRef}>
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
        <Input
          type="text"
          placeholder="Szukaj..."
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </InputGroup>
      {hasResults && isOpen && (
        <ul className={s.search__results}>
          {results.nodes.length > 0 &&
            results.nodes.map((node) => (
              <SearchResult
                id={node.id}
                name={node.name}
                type="node"
                icon={`node - ${node.type}`}
                onClick={handleClick}
              />
            ))}
          {results.trails.length > 0 &&
            results.trails.map((trail) => (
              <SearchResult
                id={trail.id}
                name={`${trail.name.start} - ${trail.name.end}`}
                type="trail"
                icon={'trail'}
                onClick={handleClick}
              />
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
