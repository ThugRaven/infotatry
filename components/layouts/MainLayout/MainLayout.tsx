import { Header } from '@components/common';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import { ReactNode } from 'react';
import s from './MainLayout.module.css';

interface MainLayoutProps {
  maxHeight?: boolean;
  children: ReactNode;
}

const MainLayout = ({
  maxHeight = false,
  children,
  className,
  ...props
}: MainLayoutProps & React.HTMLAttributes<HTMLDivElement>) => {
  const { user, status: authStatus } = useAuth();

  return (
    <div
      className={classNames(
        s.container,
        {
          [s['max-height']]: maxHeight,
        },
        className,
      )}
      {...props}
    >
      <Header
        navRoutes={[
          {
            name: 'Mapa',
            path: '/',
          },
          {
            name: 'Lawiny',
            path: '/avalanches',
          },
          {
            name: 'Zamknięcia',
            path: '/closures',
          },
        ]}
        user={user}
        isLoggedIn={authStatus === 'authenticated'}
      />
      {children}
    </div>
  );
};

export default MainLayout;
