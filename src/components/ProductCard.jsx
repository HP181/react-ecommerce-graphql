import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// Displays a single product in the product grid
export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
      {/* Product image — clicking navigates to detail page */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-3">
        <Link to={`/product/${product.id}`} className="font-semibold hover:text-blue-600">
          {product.name}
        </Link>

        <div className="flex justify-between items-center mt-2">
          <span className="text-blue-600 font-bold">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">⭐ {product.rating.toFixed(1)}</span>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-blue-600 text-white py-1 rounded disabled:bg-gray-400"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
