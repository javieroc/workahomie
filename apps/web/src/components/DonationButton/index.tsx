import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useDonate } from 'src/hooks/useDonate';
import { AiFillHeart } from 'react-icons/ai';

const DonationButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: donate, isPending } = useDonate();

  return (
    <>
      <Button
        colorScheme="orange"
        variant="solid"
        size="md"
        onClick={onOpen}
        rightIcon={<AiFillHeart />}
      >
        Donate
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Support Workahomie ❤️</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text>Choose your donation amount:</Text>
              {[5, 10, 20].map((amount) => (
                <Button
                  key={amount}
                  w="100%"
                  colorScheme="orange"
                  variant="outline"
                  isLoading={isPending}
                  onClick={() => donate({ amount })}
                >
                  €{amount}
                </Button>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export { DonationButton };
