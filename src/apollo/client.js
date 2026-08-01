import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  // In dev: Vite proxy forwards /graphql → localhost:5000
  // In production: VITE_GRAPHQL_URI env var points to the deployed backend
  uri: import.meta.env.VITE_GRAPHQL_URI || '/graphql',
  credentials: 'include', // send HTTP-only cookie with every request
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: { merge: false },
          orders:   { merge: false },
          myOrders: { merge: false },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
});

export default client;
