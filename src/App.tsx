import React, { useState } from 'react';
import { useUsers } from './services/UsersService';

export const App: React.VFC = () => {
  const { createUser, users } = useUsers();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setHasErrors(false);
    try {
      await createUser(name, parseInt(age) || 0);

      setName('');
      setAge('');
    } catch (error) {
      setHasErrors(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <fieldset disabled={isLoading}>
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
        {hasErrors && <p>Oops, something went wrong :(</p>}
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
