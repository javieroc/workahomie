import { useAtom } from 'jotai';
import { paginationParamsAtom } from '../store';

const usePagination = () => {
  const [paginationParams, setPaginationParams] = useAtom(paginationParamsAtom);

  return { paginationParams, setPaginationParams };
};

export { usePagination };
