import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { CREATE_ORDER } from '../graphql/mutations'

export default function CartPage() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart()
  const navigate = useNavigate()

  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' })

  const [createOrder] = useMutation(CREATE_ORDER)

  async function handleCheckout(e) {
    e.preventDefault()

    // OrderItemInput only needs { product: ID!, quantity: Int! }
    // The backend looks up price/name from the product in the database
    const items = cart.map(i => ({
      product: i.id,
      quantity: i.qty,
    }))

    await createOrder({ variables: { items, shippingAddress: address } })

    clearCart()
    navigate('/orders')
  }

  if (cart.length === 0) {
    return <p className="p-6 text-center text-gray-500">Your cart is empty.</p>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cart</h1>

      {cart.map(item => (
        <div key={item.id} className="flex items-center gap-4 border-b py-3">
          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
          <div className="flex-1">
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
          </div>
          <p className="font-bold">${(item.price * item.qty).toFixed(2)}</p>
          <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">
            Remove
          </button>
        </div>
      ))}

      <p className="text-right text-xl font-bold mt-4">Total: ${cartTotal.toFixed(2)}</p>

      <form onSubmit={handleCheckout} className="mt-6 flex flex-col gap-3">
        <h2 className="font-semibold text-lg">Shipping Address</h2>

        {/* Match ShippingAddressInput field names exactly */}
        {[
          { name: 'address',    placeholder: 'Street Address' },
          { name: 'city',       placeholder: 'City' },
          { name: 'postalCode', placeholder: 'Postal Code' },
          { name: 'country',    placeholder: 'Country' },
        ].map(f => (
          <input
            key={f.name}
            placeholder={f.placeholder}
            value={address[f.name]}
            onChange={e => setAddress(p => ({ ...p, [f.name]: e.target.value }))}
            required
            className="border rounded px-3 py-2"
          />
        ))}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded mt-2">
          Place Order
        </button>
      </form>
    </div>
  )
}
