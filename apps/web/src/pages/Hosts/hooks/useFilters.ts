import { useAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { filtersAtom } from '../store';

const useFilters = () => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat') ?? undefined;
  const lng = searchParams.get('lng') ?? undefined;

  useEffect(() => {
    setFilters({
      lat,
      lng,
    });
  }, [lat, lng, setFilters]);

  return { filters, setFilters };
};

export { useFilters };
