import { gql } from '@apollo/client';

export const GET_USERS_QUERY = gql`
  query {
    getUsers {
      id
      name
      age
    }
  }
`;

export interface GetUsersQuery {
  getUsers: {
    id: number;
    name: string;
    age: number;
  }[];
}
