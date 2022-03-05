import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      age
    }
  }
`;

export interface CreateUserMutation {
  createUser: {
    id: number;
    name: string;
    age: number;
  };
}

export interface CreateUserInput {
  name: string;
  age: number;
}

export interface CreateUserVariables {
  input: CreateUserInput;
}
