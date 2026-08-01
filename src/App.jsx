import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { useLazyQuery } from '@apollo/client'
import { setAccessToken } from './apollo/client'
import { ME } from './graphql/queries'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import AdminPage from './pages/AdminPage'

// Redirects to Cognito login if not authenticated
function PrivateRoute({ children }) {
  const auth = useAuth()
  if (auth.isLoading) return <div className="p-10 text-center">Loading...</div>
  if (!auth.isAuthenticated) {
    auth.signinRedirect()
    return null
  }
  return children
}

export default function App() {
  const auth = useAuth()
  const [fetchMe] = useLazyQuery(ME)

  useEffect(() => {
    const token = auth.user?.id_token || null
    // 1. Give Apollo the token so all future requests include Authorization header
    setAccessToken(token)
    // 2. If logged in, call ME — this saves/updates the user in MongoDB
    //    (backend does an upsert so it works for both new and returning users)
    if (token) fetchMe()
  }, [auth.user?.id_token])

  if (auth.isLoading) return <div className="p-10 text-center">Loading...</div>
  if (auth.error)     return <div className="p-10 text-center text-red-500">Auth error: {auth.error.message}</div>

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public — anyone can browse */}
        <Route path="/"            element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart"        element={<CartPage />} />

        {/* Private — must be logged in */}
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/admin"  element={<PrivateRoute><AdminPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}
