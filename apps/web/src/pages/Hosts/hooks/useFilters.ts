import { useAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { filtersAtom } from '../store';

const useFilters = () => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      lat: lat ? Number.parseFloat(lat) : undefined,
      lng: lng ? Number.parseFloat(lng) : undefined,
    }));
  }, [lat, lng, setFilters]);

  return { filters, setFilters };
};

export { useFilters };
