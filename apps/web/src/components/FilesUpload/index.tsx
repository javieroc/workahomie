import { FC, useRef } from 'react';
import { IconButton, Wrap, WrapItem } from '@chakra-ui/react';
import { useFieldArray, useFormContext, Control } from 'react-hook-form';
import { PlusSquareIcon, CloseIcon } from '@chakra-ui/icons';
import { UpdateHostPlaceFormValues } from 'src/pages/Host/types';
import { FileUpload } from '../FileUpload';

const FilesUpload: FC = () => {
  const { control } = useFormContext<UpdateHostPlaceFormValues>();

  const existing = useFieldArray({
    control,
    name: 'pictures.existing',
  });

  const newly = useFieldArray({
    control,
    name: 'pictures.new',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddNewFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    Array.from(files).forEach((file) => {
      newly.append(file);
    });
  };

  return (
    <Wrap spacing="4">
      {existing.fields.map((field, index) => (
        <WrapItem key={field.id}>
          <FileUpload
            name={`pictures.existing.${index}.url`}
            control={control as unknown as Control<UpdateHostPlaceFormValues>}
            url={field.url}
            width="240px"
          />
          <IconButton
            aria-label="Remove existing image"
            icon={<CloseIcon />}
            size="xs"
            onClick={() => existing.remove(index)}
          />
        </WrapItem>
      ))}
      {newly.fields.map((field, index) => (
        <WrapItem key={field.id}>
          <FileUpload
            name={`pictures.new.${index}`}
            control={control as unknown as Control<UpdateHostPlaceFormValues>}
            width="240px"
          />
          <IconButton
            aria-label="Remove new image"
            icon={<CloseIcon />}
            size="xs"
            onClick={() => newly.remove(index)}
          />
        </WrapItem>
      ))}

      <IconButton
        aria-label="Add image"
        icon={<PlusSquareIcon />}
        colorScheme="pink"
        size="sm"
        onClick={() => newly.append(new File([''], ''))}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={handleAddNewFiles}
      />
    </Wrap>
  );
};

export { FilesUpload };
