import { useState } from 'react';

const initialParams = {
  pageIndex: 0,
  pageSize: 20,
};

const usePagination = (defaultParams = initialParams) => {
  const [paginationParams, setPaginationParams] = useState(defaultParams);

  return { paginationParams, setPaginationParams };
};

export { usePagination };
