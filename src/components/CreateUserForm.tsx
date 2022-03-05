import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { useUsers, ValidationError } from '../services/UsersService';
import { FormInput } from './FormInput';
import { FormSelect, SelectOption } from './FormSelect';

export const CreateUserForm: React.VFC = () => {
  const { createUser } = useUsers();
  const [hasUnknownError, setHasUnknownError] = useState(false);

  const initalValues = {
    name: '',
    age: '' as number | '',
    state: '',
  };

  type FormValues = typeof initalValues;

  const onSubmit = async (
    { name, age, state }: FormValues,
    { setSubmitting, resetForm, setErrors }: FormikHelpers<FormValues>,
  ): Promise<void> => {
    try {
      setHasUnknownError(false);
      await createUser({ name, age: parseInt(String(age)) || 0, state });
      resetForm();
    } catch (error) {
      setSubmitting(false);
      if (error instanceof ValidationError) {
        setErrors(error.messages);
        return;
      }
      setHasUnknownError(true);
    }
  };

  const validate = (values: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.name.trim()) {
      errors.name = 'Required';
    }

    if (values.state === '') {
      errors.state = 'Required';
    }

    if (values.age !== '') {
      if (!Number.isInteger(values.age)) {
        errors.age = 'Must be an integer';
      } else if (values.age < 1) {
        errors.age = 'Must be greater than 0';
      }
    }

    return errors;
  };

  const stateOptions: SelectOption[] = [
    { value: 'ba', displayText: 'Bahia' },
    { value: 'mg', displayText: 'Minas Gerais' },
  ];

  return (
    <Formik initialValues={initalValues} validate={validate} onSubmit={onSubmit}>
      {({ touched, isSubmitting, isValid }): React.ReactNode => {
        const isTouched = !!Object.keys(touched).length;
        return (
          <Form>
            <FormInput name="name" label="Name" />
            <FormInput name="age" label="Age" type="number" />
            <FormSelect name="state" label="State" options={stateOptions} />
            <input type="submit" disabled={isSubmitting || (!isValid && isTouched)} value="Send" />
            {hasUnknownError && <div>Oops! Something went wrong. Try again.</div>}
          </Form>
        );
      }}
    </Formik>
  );
};
