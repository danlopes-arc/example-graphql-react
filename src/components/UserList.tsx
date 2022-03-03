import React from 'react';
import { useUsers } from '../services/UsersService';

export const UserList: React.VFC = () => {
  const { users } = useUsers();

  return !users ? (
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
  );
};
