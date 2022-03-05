import { useMutation, useQuery } from '@apollo/client';
import React, { createContext, useContext, useState } from 'react';
import {
  CreateUserMutation,
  CreateUserVariables,
  CREATE_USER_MUTATION,
} from '../graphql/createUser';
import { GetUsersQuery, GET_USERS_QUERY } from '../graphql/getUsers';

interface ValidationResponse {
  type: 'validation';
  messages: Record<string, string>;
}

export class ValidationError extends Error {
  constructor(public readonly messages: Record<string, string>) {
    super('ValidationError');
  }
}

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const ex = error.graphQLErrors?.[0]?.extensions?.exception?.response;
      if (ex?.type === 'validation') {
        throw new ValidationError((ex as ValidationResponse).messages);
      }

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
  validationErrors: Record<string, string>;
}

export const useCreateUser = (): CreateUserService => {
  const { createUser: _createUser } = useUsers();
  const [status, setStatus] = useState<RequestStatus>('initial');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const createUser = async (name: string, age: number): Promise<void> => {
    try {
      setStatus('loading');
      setValidationErrors({});
      await _createUser(name, age);
      setStatus('success');
    } catch (error) {
      setStatus('fail');
      if (error instanceof ValidationError) {
        setValidationErrors(error.messages);
      }
    }
  };

  return { createUser, status, validationErrors };
};
