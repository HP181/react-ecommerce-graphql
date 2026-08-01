import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { PRODUCT } from '../graphql/queries'
import { ADD_REVIEW } from '../graphql/mutations'
import { useAuth } from 'react-oidc-context'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ProductDetailPage() {
  const { id } = useParams()  // get product id from URL (/product/:id)
  const auth = useAuth()
  const { addToCart } = useCart()

  const [qty, setQty]         = useState(1)
  const [rating, setRating]   = useState(5)
  const [comment, setComment] = useState('')

  const { data, loading } = useQuery(PRODUCT, { variables: { id } })

  const [addReview] = useMutation(ADD_REVIEW, {
    // Re-fetch this product so new review appears immediately
    refetchQueries: [{ query: PRODUCT, variables: { id } }],
  })

  if (loading) return <LoadingSpinner />
  const p = data?.product
  if (!p) return <p className="p-6">Product not found.</p>

  async function handleReview(e) {
    e.preventDefault()
    await addReview({ variables: { productId: id, rating, comment } })
    setComment('')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <img src={p.image} alt={p.name} className="w-full md:w-80 h-64 object-cover rounded" />

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{p.name}</h1>
          <p className="text-gray-500 my-2">{p.description}</p>
          <p className="text-blue-600 text-2xl font-bold">${p.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">⭐ {p.rating.toFixed(1)} ({p.numReviews} reviews)</p>
          {/* Backend uses `stock` */}
          <p className="text-sm mt-1">{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p>

          {p.stock > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <input
                type="number" min={1} max={p.stock}
                value={qty}
                onChange={e => setQty(Number(e.target.value))}
                className="border rounded w-16 px-2 py-1"
              />
              <button
                onClick={() => addToCart(p, qty)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {p.reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        {p.reviews.map((r, i) => (
          <div key={i} className="border-b py-3">
            <div className="flex justify-between">
              <strong>{r.name}</strong>
              <span>{'⭐'.repeat(r.rating)}</span>
            </div>
            <p className="text-gray-600 mt-1">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Review form — only visible when logged in */}
      {auth.isAuthenticated && (
        <form onSubmit={handleReview} className="mt-6 flex flex-col gap-3 max-w-md">
          <h3 className="font-semibold">Write a Review</h3>
          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} stars</option>)}
          </select>
          <textarea
            placeholder="Your comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded">
            Submit Review
          </button>
        </form>
      )}
    </div>
  )
}
