import React, { useEffect, useState } from 'react';

export interface Route {
  path: string; // e.g. "/car/ferrari-roma"
  segments: string[];
  query: URLSearchParams;
}

function parse(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [p, q = ''] = raw.split('?');
  const path = '/' + p.replace(/^\/+|\/+$/g, '');
  return { path, segments: path.split('/').filter(Boolean), query: new URLSearchParams(q) };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function navigate(to: string) {
  const next = '#' + to;
  if (window.location.hash === next) return;
  window.location.hash = to;
}

/** Update the query part of the current hash without adding a history entry. */
export function replaceQuery(params: Record<string, string | undefined>) {
  const { path, query } = parse();
  Object.entries(params).forEach(([k, v]) => (v ? query.set(k, v) : query.delete(k)));
  const qs = query.toString();
  const url = `${window.location.pathname}${window.location.search}#${path}${qs ? '?' + qs : ''}`;
  window.history.replaceState(null, '', url);
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, children, ...rest }: LinkProps) {
  return (
    <a href={'#' + to} {...rest}>
      {children}
    </a>
  );
}
