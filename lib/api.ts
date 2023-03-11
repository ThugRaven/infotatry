import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

export type ApiResponse = {
  message: string;
};

export type ApiRedirect = {
  redirect: {
    destination: string;
    permanent: boolean;
  };
};

export const isAdmin = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) => {
  console.log(context.req.cookies);

  const authCookie = context.req.cookies['connect.sid'];
  let response: ApiResponse | ApiRedirect | undefined;

  try {
    const _response = await fetch(`http://localhost:8080/user/admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `connect.sid=${authCookie};`,
      },
      credentials: 'include',
    });

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
  console.log(context.req.cookies);

  const authCookie = context.req.cookies['connect.sid'];
  let response: ApiResponse | ApiRedirect | undefined;

  try {
    const _response = await fetch(`http://localhost:8080/user/authenticated`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `connect.sid=${authCookie};`,
      },
      credentials: 'include',
    });

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
  ApiResponse
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
  ApiResponse
> = async (context) => {
  const response = await isAuthenticated(context);

  if ('redirect' in response) {
    return response;
  }

  return {
    props: response,
  };
};
