import { useMutation, useQuery } from '@apollo/client';
import React, { createContext, useContext, useState } from 'react';
import {
  CreateUserMutation,
  CreateUserVariables,
  CREATE_USER_MUTATION,
} from '../graphql/createUser';
import { GetUsersQuery, GET_USERS_QUERY } from '../graphql/getUsers';

export interface User {
  id: number;
  name: string;
  age: number;
}

export interface Result {
  failed: boolean;
}

export interface UsersService {
  users: User[] | undefined;
  createUser: (name: string, age: number) => Promise<void>;
}

export const UserContext = createContext<UsersService | undefined>(undefined);

export const UsersProvider: React.FC = ({ children }) => {
  const [createUserMutation] = useMutation<CreateUserMutation, CreateUserVariables>(
    CREATE_USER_MUTATION,
  );
  const { data, refetch } = useQuery<GetUsersQuery>(GET_USERS_QUERY);

  const users: User[] | undefined = data?.getUsers;

  const createUser = async (name: string, age: number): Promise<void> => {
    try {
      await createUserMutation({
        variables: {
          input: {
            name,
            age,
          },
        },
      });
      await new Promise<void>((r) => setTimeout(() => r(), 1500));
      refetch();
    } catch (error) {
      throw new Error('Could not create the user');
    }
  };

  return <UserContext.Provider value={{ createUser, users }}>{children}</UserContext.Provider>;
};

export const useUsers = (): UsersService => {
  const service = useContext(UserContext);
  if (!service) {
    throw new Error('useUsers must be within UsersProvider');
  }
  return service;
};

type RequestStatus = 'initial' | 'loading' | 'success' | 'fail';

export interface CreateUserService {
  status: RequestStatus;
  createUser: (name: string, age: number) => void;
}

export const useCreateUser = (): CreateUserService => {
  const { createUser: _createUser } = useUsers();
  const [status, setStatus] = useState<RequestStatus>('initial');

  const createUser = async (name: string, age: number): Promise<void> => {
    try {
      setStatus('loading');
      await _createUser(name, age);
      setStatus('success');
    } catch (error) {
      setStatus('fail');
    }
  };

  return { createUser, status };
};
