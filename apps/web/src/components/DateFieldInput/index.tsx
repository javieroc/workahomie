import {
  forwardRef,
  InputProps,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormControlProps,
} from '@chakra-ui/react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import classes from './styles.module.css';

type DateFieldInputProps<T extends FieldValues> = FormControlProps &
  UseControllerProps<T> &
  Pick<ReactDatePickerProps, 'selectsStart' | 'startDate' | 'selectsEnd' | 'endDate' | 'minDate'>;

const CustomInput = forwardRef<InputProps, 'input'>((props, ref) => (
  <Input ref={ref} {...props} width="100%" />
));

function DateFieldInput<T extends FieldValues>({
  name,
  label,
  control,
  isRequired,
  size = 'sm',
  ...rest
}: DateFieldInputProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  return (
    <FormControl isInvalid={!!fieldState.error} {...rest} isRequired={isRequired} marginBottom="4">
      {label && (
        <FormLabel htmlFor={name} fontSize={size}>
          {label}
        </FormLabel>
      )}
      <DatePicker
        wrapperClassName={classes.fullWidth}
        className={classes.general}
        calendarClassName={classes.calendar}
        dayClassName={() => classes.calendarDay}
        weekDayClassName={() => classes.calendarDay}
        monthClassName={() => classes.calendarMonth}
        value={field.value}
        onChange={field.onChange}
        selected={field.value}
        customInput={<CustomInput size={size} />}
        placeholderText="mm/dd/yyyy"
      />
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export { DateFieldInput };
