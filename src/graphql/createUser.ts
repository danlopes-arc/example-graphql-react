import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      age
      state
    }
  }
`;

export interface CreateUserMutation {
  createUser: {
    id: number;
    name: string;
    age: number;
    state: string;
  };
}

export interface CreateUserInput {
  name: string;
  age: number;
  state: string;
}

export interface CreateUserVariables {
  input: CreateUserInput;
}
