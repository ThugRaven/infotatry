import classNames from 'classnames';
import { ReactNode } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import s from './Pagination.module.css';

interface PaginationProps {
  page: number;
  pageSize: number;
  count: number;
  onPageClick: (page: number) => void;
}

const Pagination = ({
  page,
  pageSize,
  count,
  onPageClick,
}: PaginationProps) => {
  const buttons = [];
  const lastPage = Math.ceil(count / pageSize);

  for (let i = Math.max(page - 1, 1); i <= Math.min(page + 1, lastPage); i++) {
    buttons.push(
      <PaginationButton
        key={i}
        onClick={() => {
          onPageClick(i);
        }}
        isActivePage={i === page}
        required={i === page}
      >
        {i}
      </PaginationButton>,
    );
  }

  return (
    <div className={s.pagination}>
      <span>
        {page * pageSize - pageSize + 1} -{' '}
        {page * pageSize > count ? count : page * pageSize} z {count}
      </span>
      <div className={s.pagination__buttons}>
        {page !== 1 && (
          <PaginationButton
            key={'first'}
            onClick={() => {
              onPageClick(1);
            }}
          >
            {1}
          </PaginationButton>
        )}
        <PaginationButton
          key={'previous'}
          onClick={() => {
            onPageClick(Math.max(page - 1, 1));
          }}
          disabled={page === 1}
          required
        >
          <MdKeyboardArrowLeft />
        </PaginationButton>
        {buttons}
        <PaginationButton
          key={'next'}
          onClick={() => {
            onPageClick(Math.min(page + 1, lastPage));
          }}
          disabled={page === lastPage}
          required
        >
          <MdKeyboardArrowRight />
        </PaginationButton>
        {page !== lastPage && (
          <PaginationButton
            key={'last'}
            onClick={() => {
              onPageClick(lastPage);
            }}
          >
            {lastPage}
          </PaginationButton>
        )}
      </div>
    </div>
  );
};

const PaginationButton = ({
  children,
  required = false,
  isActivePage = false,
  ...props
}: {
  children: ReactNode;
  required?: boolean;
  isActivePage?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={classNames(s.pagination__button, {
        [s['pagination__button--active']]: isActivePage,
        [s['pagination__button--optional']]: !required,
      })}
      {...props}
    >
      {children}
    </button>
  );
};

export default Pagination;
