import { Flex, IconButton, Button } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
};

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps): JSX.Element {
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Flex alignItems="center" marginTop="26px" alignSelf="flex-end">
      <Flex>
        <IconButton
          aria-label="Go first page"
          onClick={() => onPageChange(0)}
          isDisabled={currentPage === 0}
          icon={<FiChevronsLeft />}
          marginRight="8px"
          colorScheme="purple"
          size="sm"
        />
        <IconButton
          aria-label="Go prev page"
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 0}
          icon={<FiChevronLeft />}
          colorScheme="purple"
          size="sm"
        />
      </Flex>

      <Flex alignItems="center" margin="0 16px">
        {pagesArray.map((page, index) => (
          <Button
            key={index}
            onClick={() => onPageChange(page - 1)}
            isActive={currentPage === page - 1}
            size="sm"
            marginX="2px"
            colorScheme={currentPage === page - 1 ? 'purple' : 'gray'}
          >
            {page}
          </Button>
        ))}
      </Flex>

      <Flex>
        <IconButton
          aria-label="Go next page"
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages - 1}
          icon={<FiChevronRight />}
          colorScheme="purple"
          size="sm"
        />
        <IconButton
          aria-label="Go last page"
          onClick={() => onPageChange(totalPages - 1)}
          isDisabled={currentPage === totalPages - 1}
          icon={<FiChevronsRight />}
          marginLeft="8px"
          colorScheme="purple"
          size="sm"
        />
      </Flex>
    </Flex>
  );
}

export { Pagination };
