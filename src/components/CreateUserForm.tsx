import React, { useEffect, useState } from 'react';
import { useCreateUser } from '../services/UsersService';

export const CreateUserForm: React.VFC = () => {
  const { createUser, status } = useCreateUser();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (status === 'success') {
      setAge('');
      setName('');
    }
  }, [status]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    createUser(name, parseInt(age) || 0);
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={status === 'loading'}>
        <label>
          <div>name</div>
          <input type="text" value={name} onChange={(e): void => setName(e.target.value)} />
        </label>
        <label>
          <div>age</div>
          <input type="number" value={age} onChange={(e): void => setAge(e.target.value)} />
        </label>
        <div>
          <input type="submit" value="create" />
        </div>
        {status === 'fail' && <p>Oops, something went wrong :(</p>}
        {status === 'loading' && <p>Creating...</p>}
      </fieldset>
    </form>
  );
};
