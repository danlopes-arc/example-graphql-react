import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import {
  CreateUserMutation,
  CreateUserVariables,
  CREATE_USER_MUTATION,
} from './graphql/createUser';
import { GetUsersQuery, GET_USERS_QUERY } from './graphql/getUsers';

export const App: React.VFC = () => {
  const [createUser] = useMutation<CreateUserMutation, CreateUserVariables>(CREATE_USER_MUTATION);
  const { data: getUsersData, refetch } = useQuery<GetUsersQuery>(GET_USERS_QUERY);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setHasErrors(false);
    try {
      await createUser({
        variables: {
          input: {
            name,
            age: parseInt(age) || 0,
          },
        },
      });
      await new Promise<void>((r) => setTimeout(() => r(), 1500));
      setName('');
      setAge('');
      refetch();
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
      {!getUsersData ? (
        <div>loading users...</div>
      ) : (
        <ul>
          {getUsersData.getUsers.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong>, {user.age}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
