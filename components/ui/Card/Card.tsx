import classNames from 'classnames';
import React from 'react';
import s from './Card.module.css';

interface CardProps {
  children?: React.ReactNode;
  cardTitle?: string;
}

const Card = ({
  children,
  cardTitle,
  className,
  ...props
}: CardProps & React.HTMLAttributes<HTMLElement>) => {
  return (
    <section className={classNames(s.card, className)} {...props}>
      {cardTitle && <h2 className={s.title}>{cardTitle}</h2>}
      {children}
    </section>
  );
};

export default Card;
