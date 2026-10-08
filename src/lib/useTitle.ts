import { useEffect } from 'react';
import { BRAND } from '../data/site';

export function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${BRAND}`;
  }, [title]);
}
