import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { User } from 'oidc-client-ts'

const AUTHORITY = import.meta.env.VITE_COGNITO_AUTHORITY
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID

// oidc-client-ts stores the logged-in user in sessionStorage
// This reads the access token from there without needing a React hook
function getAccessToken() {
  const key  = `oidc.user:${AUTHORITY}:${CLIENT_ID}`
  const raw  = sessionStorage.getItem(key)
  if (!raw) return null
  const user = User.fromStorageString(raw)
  return user?.access_token || null
}

// Attach the Bearer token to every GraphQL request
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken()
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})

const httpLink = createHttpLink({
  // In dev: Vite proxy forwards /graphql → localhost:5000
  // In production: VITE_GRAPHQL_URI points to deployed backend
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
