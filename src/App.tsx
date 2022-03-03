import React from 'react';
import { CreateUserForm } from './components/CreateUserForm';
import { UserList } from './components/UserList';

export const App: React.VFC = () => {
  return (
    <div>
      <CreateUserForm />
      <UserList />
    </div>
  );
};
