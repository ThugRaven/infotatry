import { NextRouter } from 'next/router';

export const signIn = (
  refetch: (() => void) | undefined,
  router: NextRouter,
) => {
  if (refetch) {
    refetch();
    return router.push('/');
  }
  return router.push('/login');
};

export const signOut = (
  refetch: (() => void) | undefined,
  router: NextRouter,
) => {
  if (refetch) {
    refetch();
    return router.push('/');
  }
  return router.push('/login');
};
