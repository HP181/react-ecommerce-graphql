import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      {/* Site logo / home link */}
      <Link to="/" className="text-xl font-bold">ShopQL</Link>

      <div className="flex items-center gap-4">
        {/* Cart icon with item count badge */}
        <Link to="/cart" className="relative">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            {/* Only show Admin link if user is an admin */}
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <Link to="/orders">My Orders</Link>
            <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
