import { IconButton, Input } from '@components/ui';
import { useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import s from './SearchInputTest.module.css';

interface SearchInputProps {
  icon: React.ReactNode;
  onRemove: () => void;
}

const SearchInputTest = ({
  icon,
  onRemove,
  ...props
}: SearchInputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);
  };

  return (
    <div className={s.search__wrapper} ref={searchRef}>
      <div className={s.search__icon}>{icon}</div>
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        className={s.search__input}
        {...props}
      />
      <IconButton
        buttonType="action"
        aria-label="Usuń punkt"
        onClick={onRemove}
        className={s.search__remove}
        type="button"
      >
        <MdClose />
      </IconButton>
    </div>
  );
};

export default SearchInputTest;
