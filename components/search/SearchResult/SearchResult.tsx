import { ReactNode } from 'react';
import s from './SearchResult.module.css';

interface SearchResultProps {
  id: number;
  name: string;
  type: 'node' | 'trail';
  icon: ReactNode;
  onClick: (type: 'node' | 'trail', id: number) => void;
}

const SearchResult = ({ id, name, type, icon, onClick }: SearchResultProps) => {
  const handleClick = () => {
    onClick(type, id);
  };

  return (
    <li key={`${type}-${id}`}>
      <a className={s.search__result} onClick={handleClick}>
        <div className={s.result__icon}>{icon}</div>
        <span>{name}</span>
      </a>
    </li>
  );
};

export default SearchResult;
