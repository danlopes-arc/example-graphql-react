import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { UsersProvider } from './services/UsersService';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <UsersProvider>
        <App />
      </UsersProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
