import { ErrorMessage, Field, useField } from 'formik';

export interface SelectOption {
  value: string;
  displayText?: string;
}

interface FromSelectProps {
  name: string;
  label?: string;
  options: SelectOption[];
}

export const FormSelect: React.FC<FromSelectProps> = ({ name, label = name, options }) => {
  const [field] = useField(name);
  return (
    <div>
      <label>
        <div>{label}</div>
        <Field name={name} as="select">
          {field.value === '' && <option value=""></option>}
          {options.map(({ value, displayText = value }) => (
            <option key={value} value={value}>
              {displayText}
            </option>
          ))}
        </Field>
      </label>
      <ErrorMessage name={name} />
    </div>
  );
};
