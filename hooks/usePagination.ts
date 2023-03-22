import { useCallback, useState } from 'react';

export const usePagination = () => {
  const [page, setPage] = useState(1);

  const handlePageClick = useCallback((page: number) => {
    setPage(page);
  }, []);

  return { page, handlePageClick };
};
