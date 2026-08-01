import { useQuery } from '@apollo/client'
import { MY_ORDERS } from '../graphql/queries'
import LoadingSpinner from '../components/LoadingSpinner'

export default function OrdersPage() {
  const { data, loading } = useQuery(MY_ORDERS)

  if (loading) return <LoadingSpinner />

  const orders = data?.myOrders || []

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}

      {orders.map(order => (
        <div key={order.id} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            {/* Show last 6 chars of the MongoDB ID */}
            <span>Order #{order.id.slice(-6)}</span>
            <span className="capitalize font-semibold text-blue-600">{order.status}</span>
          </div>

          {/* `items` and `quantity` — matching backend field names */}
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          {/* `totalAmount` — matching backend field name */}
          <div className="border-t mt-2 pt-2 text-right font-bold">
            Total: ${order.totalAmount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
