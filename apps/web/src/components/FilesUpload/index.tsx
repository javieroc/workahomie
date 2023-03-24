import { FC } from 'react';
import { IconButton, Wrap, WrapItem } from '@chakra-ui/react';
import { UseControllerProps, useFieldArray } from 'react-hook-form';
import { PlusSquareIcon, CloseIcon } from '@chakra-ui/icons';
import { FileUpload } from '../FileUpload';

type FilesUploadProps = UseControllerProps & {
  urls?: string[];
};

const FilesUpload: FC<FilesUploadProps> = ({ name, control, urls }) => {
  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });

  return (
    <Wrap spacing="4">
      {fields.map((field, index) => (
        <WrapItem key={field.id}>
          <FileUpload
            name={`${name}.${index}`}
            width="240px"
            {...(urls?.length ? { url: urls[index] } : {})}
          />
          <IconButton
            aria-label="Remove image"
            icon={<CloseIcon />}
            colorScheme="purple"
            size="xs"
            onClick={() => {
              remove(index);
            }}
          />
        </WrapItem>
      ))}
      <IconButton
        aria-label="Add image"
        icon={<PlusSquareIcon />}
        colorScheme="pink"
        size="sm"
        onClick={() => append(new File([''], ''))}
      />
    </Wrap>
  );
};

export { FilesUpload };
