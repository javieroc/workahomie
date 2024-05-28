import { FC } from 'react';
import { Flex, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { usePagination } from 'src/pages/Hosts/hooks';

interface PaginationControlProps {
  total: number;
}

const PaginationControl: FC<PaginationControlProps> = ({ total }) => {
  const {
    paginationParams: { pageIndex, pageSize },
    setPaginationParams,
  } = usePagination();
  const totalPages = Math.ceil(total / pageSize);
  const getCanPreviousPage = () => pageIndex > 0;
  const getCanNextPage = () => pageIndex < totalPages - 1;
  const goFirstPage = () => setPaginationParams({ pageSize, pageIndex: 0 });
  const goLastPage = () => setPaginationParams({ pageSize, pageIndex: totalPages - 1 });
  const goNextPage = () => setPaginationParams({ pageSize, pageIndex: pageIndex + 1 });
  const goPreviousPage = () => setPaginationParams({ pageSize, pageIndex: pageIndex - 1 });

  return (
    <Flex alignItems="center" marginTop="26px" alignSelf="center">
      <Flex>
        <Tooltip label="First Page">
          <IconButton
            aria-label="Go first page"
            onClick={() => goFirstPage()}
            isDisabled={!getCanPreviousPage()}
            icon={<FiChevronsLeft />}
            marginRight="8px"
            colorScheme="purple"
            size="sm"
          />
        </Tooltip>
        <Tooltip label="Previous Page">
          <IconButton
            aria-label="Go prev page"
            onClick={() => goPreviousPage()}
            isDisabled={!getCanPreviousPage()}
            icon={<FiChevronLeft />}
            colorScheme="purple"
            size="sm"
          />
        </Tooltip>
      </Flex>

      <Flex alignItems="center" margin="0 16px">
        <Text>
          Page{' '}
          <Text fontWeight="bold" as="span">
            {pageIndex + 1}
          </Text>{' '}
          of{' '}
          <Text fontWeight="bold" as="span">
            {totalPages}
          </Text>
        </Text>
      </Flex>

      <Flex>
        <Tooltip label="Next Page">
          <IconButton
            aria-label="Go next page"
            onClick={() => goNextPage()}
            isDisabled={!getCanNextPage()}
            icon={<FiChevronRight />}
            colorScheme="purple"
            size="sm"
          />
        </Tooltip>
        <Tooltip label="Last Page">
          <IconButton
            aria-label="Go last page"
            onClick={() => goLastPage()}
            isDisabled={!getCanNextPage()}
            icon={<FiChevronsRight />}
            marginLeft="8px"
            colorScheme="purple"
            size="sm"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export { PaginationControl };
