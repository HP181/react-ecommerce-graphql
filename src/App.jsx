import { Routes, Route } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const auth = useAuth()

  if (auth.isLoading) return <div className="p-10 text-center">Loading...</div>

  if (auth.error) return <div className="p-10 text-center text-red-500">Auth error: {auth.error.message}</div>

  // Not logged in → show sign-in screen instead of the app
  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">ShopQL</h1>
        <p className="text-gray-500">Please sign in to continue</p>
        <button
          onClick={() => auth.signinRedirect()}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Sign in
        </button>
      </div>
    )
  }

  // Logged in → show full app
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart"        element={<CartPage />} />
        <Route path="/orders"      element={<OrdersPage />} />
        <Route path="/admin"       element={<AdminPage />} />
      </Routes>
    </>
  )
}
