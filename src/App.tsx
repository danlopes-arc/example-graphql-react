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
      <UserList />
    </>
  );
};

const UserList: React.VFC = () => {
  const { data } = useQuery<GetUsersQuery>(GET_USERS_QUERY);

  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <ul>
      {data.getUsers.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong>, {user.age}
        </li>
      ))}
    </ul>
  );
};
