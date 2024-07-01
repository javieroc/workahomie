import { FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import classes from './styles.module.css';

interface DateRangeInputFieldProps {
  startName: string;
  startLabel: string;
  endName: string;
  endLabel: string;
  size?: 'sm' | 'md' | 'lg';
}

const DateRangeInputField: FC<DateRangeInputFieldProps> = ({
  startName,
  startLabel,
  endName,
  endLabel,
  size,
}) => {
  const { control } = useFormContext();

  const {
    field: { value: startValue, onChange: onStartChange },
    fieldState: fieldStateStart,
  } = useController({
    name: startName,
    control,
  });

  const {
    field: { value: endValue, onChange: onEndChange },
    fieldState: fieldStateEnd,
  } = useController({
    name: endName,
    control,
  });

  return (
    <>
      <FormControl isInvalid={!!fieldStateStart.error} isRequired marginBottom="4">
        {startLabel && (
          <FormLabel htmlFor={startName} fontSize={size}>
            {startLabel}
          </FormLabel>
        )}
        <DatePicker
          wrapperClassName={classes.fullWidth}
          className={classes.general}
          calendarClassName={classes.calendar}
          dayClassName={() => classes.calendarDay}
          weekDayClassName={() => classes.calendarDay}
          monthClassName={() => classes.calendarMonth}
          selected={startValue}
          onChange={(date) => onStartChange(date)}
          selectsStart
          startDate={startValue}
          endDate={endValue}
          customInput={<Input width="100%" size={size} />}
          placeholderText="Start Date"
        />
        <FormErrorMessage>{fieldStateStart.error?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!fieldStateEnd.error} isRequired marginBottom="4">
        {endLabel && (
          <FormLabel htmlFor={endName} fontSize={size}>
            {endLabel}
          </FormLabel>
        )}
        <DatePicker
          wrapperClassName={classes.fullWidth}
          className={classes.general}
          calendarClassName={classes.calendar}
          dayClassName={() => classes.calendarDay}
          weekDayClassName={() => classes.calendarDay}
          monthClassName={() => classes.calendarMonth}
          selected={endValue}
          onChange={(date) => onEndChange(date)}
          selectsEnd
          startDate={startValue}
          endDate={endValue}
          minDate={startValue}
          customInput={<Input width="100%" size={size} />}
          placeholderText="End Date"
        />
        <FormErrorMessage>{fieldStateEnd.error?.message}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export { DateRangeInputField };
