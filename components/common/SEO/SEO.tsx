import Head from 'next/head';
import { ReactNode } from 'react';
import config from '../../../config/seo-config.json';

interface SEOProps {
  title?: string;
  description?: string;
  openGraph?: {
    title?: string;
    type?: string;
    locale?: string;
    description?: string;
    site_name?: string;
    url?: string;
  };
  robots?: string;
  children?: ReactNode;
}

const SEO = ({ title, description, openGraph, robots, children }: SEOProps) => {
  return (
    <Head>
      <title key="title">
        {title ? `${config.titleTemplate.replace(/%s/g, title)}` : config.title}
      </title>
      <meta
        key="description"
        name="description"
        content={description || config.description}
      />
      <meta
        key="og:type"
        property="og:type"
        content={openGraph?.type ?? config.openGraph.type}
      />
      <meta
        key="og:title"
        property="og:title"
        content={
          openGraph?.title ?? config.openGraph.title ?? title ?? config.title
        }
      />
      <meta
        key="og:description"
        property="og:description"
        content={
          openGraph?.description ??
          config.openGraph.description ??
          description ??
          config.description
        }
      />
      <meta
        key="og:site_name"
        property="og:site_name"
        content={openGraph?.site_name ?? config.openGraph.site_name}
      />
      <meta
        key="og:url"
        property="og:url"
        content={openGraph?.url ?? config.openGraph.url}
      ></meta>
      {openGraph?.locale && (
        <meta key="og:locale" property="og:locale" content={openGraph.locale} />
      )}
      <meta key="robots" name="robots" content={robots ?? 'index,follow'} />
      <meta
        key="googlebot"
        name="googlebot"
        content={robots ?? 'index,follow'}
      ></meta>
      {children}
    </Head>
  );
};

export default SEO;
