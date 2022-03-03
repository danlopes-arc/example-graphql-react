import React, { useEffect, useState } from 'react';
import { useCreateUser, useUsers } from './services/UsersService';

export const App: React.VFC = () => {
  const { users } = useUsers();
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
    <>
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
        </fieldset>
        {status === 'fail' && <p>Oops, something went wrong :(</p>}
        {status === 'loading' && <p>Creating...</p>}
      </form>
      {!users ? (
        <div>loading users...</div>
      ) : users.length === 0 ? (
        <div>no users</div>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong>, {user.age}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
