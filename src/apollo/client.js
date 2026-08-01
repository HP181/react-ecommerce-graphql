import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// Module-level token — updated by React whenever auth state changes (see App.jsx)
let accessToken = null

export function setAccessToken(token) {
  accessToken = token
}

// Attach the token to every GraphQL request header
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
  },
}))

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || '/graphql',
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
})

export default client
