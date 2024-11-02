import { FormHelperText } from '@mui/material';
import _ from 'lodash';
import { Control, useFormState } from 'react-hook-form';

interface Props {
  control: Control<any>;
  name: string;
  fieldName?: string;
}

const FormErrorText = ({ control, name, fieldName = '' }: Props) => {
  const { touchedFields, errors, isSubmitted, isValid } = useFormState({
    control,
  });
  const fieldTouched = Object.hasOwn(touchedFields, name);

  if (isValid) return null;

  if (fieldTouched === false && isSubmitted === false) return null;

  if (errors[name]?.type === 'required') {
    return (
      <FormHelperText error>
        {_.capitalize(fieldName || name)} required
      </FormHelperText>
    );
  }

  return (
    <FormHelperText error>{errors[name]?.message?.toString()}</FormHelperText>
  );
};

export default FormErrorText;
