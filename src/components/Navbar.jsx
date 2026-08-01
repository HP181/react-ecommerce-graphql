import { Link } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { useCart } from '../context/CartContext'

// Read from .env
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const CLIENT_ID      = import.meta.env.VITE_COGNITO_CLIENT_ID
const LOGOUT_URI     = import.meta.env.VITE_COGNITO_LOGOUT_URI

export default function Navbar() {
  const auth = useAuth()
  const { cartCount } = useCart()

  async function handleSignOut() {
    // 1. Clear the local session (removes token from sessionStorage)
    await auth.removeUser()
    // 2. Redirect to Cognito logout to clear the server-side session too
    window.location.href =
      `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">ShopQL</Link>

      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {auth.isAuthenticated ? (
          <>
            <span className="text-sm opacity-80">{auth.user?.profile.email}</span>
            <Link to="/orders">My Orders</Link>
            <button
              onClick={handleSignOut}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => auth.signinRedirect()}>Login</button>
            <button
              onClick={() => auth.signinRedirect()}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
