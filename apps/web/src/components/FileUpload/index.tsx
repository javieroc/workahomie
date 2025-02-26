import {
  Image,
  FormControl,
  FormLabel,
  InputGroup,
  FormErrorMessage,
  FormControlProps,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import React, { useRef, useState } from 'react';
import { PlusSquareIcon } from '@chakra-ui/icons';

type FileUploadProps<T extends FieldValues> = FormControlProps &
  UseControllerProps<T> & {
    url?: string;
    width?: string;
    placeholder?: string;
  };

function FileUpload<T extends FieldValues>({
  name,
  label,
  placeholder = 'Picture',
  size,
  control,
  url,
  width,
  isRequired,
  ...rest
}: FileUploadProps<T>) {
  const [preview, setPreview] = useState(url);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    field: { ref, onChange, value, ...inputProps },
    fieldState,
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    ref(event);
    const file = event.target.files[0];
    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <FormControl isInvalid={!!fieldState.error} {...rest} marginBottom={4}>
      {label && (
        <FormLabel htmlFor="writeUpFile" size={size ?? 'sm'}>
          {label}
        </FormLabel>
      )}
      <InputGroup>
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          ref={inputRef}
          onChange={handleChange}
          {...inputProps}
          style={{ display: 'none' }}
        />

        <VStack onClick={() => inputRef?.current?.click()} cursor="pointer">
          <Image
            src={preview}
            fallbackSrc={`https://placehold.co/150x150?text=${placeholder}`}
            width={width ?? '150px'}
            objectFit="cover"
          />
          <IconButton
            aria-label="Add image"
            icon={<PlusSquareIcon />}
            marginTop="0px !important"
            borderTopRadius={0}
            width="100%"
            size="xs"
            colorScheme="pink"
          />
        </VStack>
      </InputGroup>
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export { FileUpload };
