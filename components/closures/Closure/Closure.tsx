import s from './Closure.module.css';

interface ClosureProps {
  title: string;
  reason: string;
  since: string | null;
  until: string | null;
  source: string | null;
  description: string;
}

const dateFormat = Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
});

const Closure = ({
  title,
  reason,
  since,
  until,
  source,
  description,
}: ClosureProps) => {
  return (
    <li className={s.closure}>
      <div className={s.closure__type}>Zamknięcie szlaku</div>
      <h3 className={s.closure__title}>{title}</h3>
      <div className={s.closure__reason}>{reason}</div>
      <div className={s.closure__date}>
        {since ? dateFormat.format(new Date(since)) : 'Nie ustalono'} -{' '}
        {until ? dateFormat.format(new Date(until)) : 'Nie ustalono'}
      </div>
      {source && (
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className={s.closure__source}
        >
          Źródło komunikatu
        </a>
      )}
      <div className={s.closure__desc}>{description}</div>
    </li>
  );
};

export default Closure;
