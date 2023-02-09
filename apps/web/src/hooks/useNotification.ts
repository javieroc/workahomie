import { useToast, UseToastOptions } from '@chakra-ui/react';

function useNotification(options: UseToastOptions = {}) {
  return useToast({
    position: 'top-right',
    duration: 2000,
    isClosable: true,
    ...options,
  });
}

export { useNotification };
