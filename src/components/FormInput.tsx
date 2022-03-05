import { Field, ErrorMessage } from 'formik';
import { HTMLInputTypeAttribute } from 'react';

interface FromFieldProps {
  name: string;
  label?: string;
  type?: HTMLInputTypeAttribute;
}

export const FormInput: React.VFC<FromFieldProps> = ({ name, label = name, type = 'text' }) => {
  return (
    <div>
      <label>
        <div>{label}</div>
        <Field name={name} type={type} />
      </label>
      <ErrorMessage name={name} />
    </div>
  );
};
