import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

export type APIUserResponse = {
  message: string;
};

export type APIRedirect = {
  redirect: {
    destination: string;
    permanent: boolean;
  };
};

export type PaginationResponse<T> = {
  page: number;
  pageSize: number;
  count: number;
  data: T;
};

export const isAdmin = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) => {
  console.log(context.req.cookies);

  const authCookie = context.req.cookies['connect.sid'];
  let response: APIUserResponse | APIRedirect | undefined;

  try {
    const _response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/admin`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `connect.sid=${authCookie};`,
        },
        credentials: 'include',
      },
    );

    if (!_response.ok) {
      throw new Error(_response.status.toString());
    }

    response = await _response.json();
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (error.message == '401') {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
    }

    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  if (!response) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  return response;
};

export const isAuthenticated = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) => {
  console.log(context.req);
  console.log(context.req.cookies);

  const authCookie = context.req.cookies['connect.sid'];
  let response: APIUserResponse | APIRedirect | undefined;

  try {
    const _response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/authenticated`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `connect.sid=${authCookie};`,
        },
        credentials: 'include',
      },
    );

    if (!_response.ok) {
      throw new Error(_response.status.toString());
    }

    response = await _response.json();
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (error.message == '401') {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
    }

    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  if (!response) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  return response;
};

export const getServerSidePropsIsAdmin: GetServerSideProps<
  APIUserResponse
> = async (context) => {
  const response = await isAdmin(context);

  if ('redirect' in response) {
    return response;
  }

  return {
    props: response,
  };
};

export const getServerSidePropsIsAuthenticated: GetServerSideProps<
  APIUserResponse
> = async (context) => {
  const response = await isAuthenticated(context);

  if ('redirect' in response) {
    return response;
  }

  return {
    props: response,
  };
};
