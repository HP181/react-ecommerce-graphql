import { createContext, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ME } from '../graphql/queries'
import { LOGOUT } from '../graphql/mutations'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // ME asks the server "who is logged in?" using the HTTP-only cookie
  // errorPolicy: 'ignore' → don't crash when not logged in (server throws UNAUTHENTICATED)
  const { data, loading, refetch } = useQuery(ME, {
    errorPolicy: 'ignore',
  })

  const [logoutMutation] = useMutation(LOGOUT)

  // `me` is null when not logged in
  const user = data?.me || null

  async function logout() {
    await logoutMutation()
    refetch()  // re-run ME so `user` becomes null everywhere
  }

  return (
    <AuthContext.Provider value={{ user, loading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Shorthand hook — use this in any component instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext)
}
