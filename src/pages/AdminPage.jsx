import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { PRODUCTS, ORDERS, USERS } from '../graphql/queries'
import { DELETE_PRODUCT, UPDATE_ORDER_STATUS, DELETE_ORDER } from '../graphql/mutations'
import { useAuth } from 'react-oidc-context'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import ProductForm from '../components/ProductForm'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [tab, setTab]           = useState('products')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)

  // Only users whose email matches VITE_ADMIN_EMAIL can access admin
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  if (auth.isAuthenticated && auth.user?.profile.email !== adminEmail) {
    navigate('/')
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Tab switcher */}
      <div className="flex gap-3 mb-6">
        {['products', 'orders', 'users'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded capitalize ${tab === t ? 'bg-blue-600 text-white' : 'border'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <ProductsTab
          onNew={() => { setEditing(null); setShowForm(true) }}
          onEdit={p  => { setEditing(p);   setShowForm(true) }}
        />
      )}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'users'  && <UsersTab />}

      {showForm && (
        <Modal
          title={editing ? 'Edit Product' : 'New Product'}
          onClose={() => setShowForm(false)}
        >
          <ProductForm product={editing} onClose={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  )
}

// ── Products tab ─────────────────────────────────────────────────────────────
function ProductsTab({ onNew, onEdit }) {
  const { data, loading } = useQuery(PRODUCTS)
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: PRODUCTS }],
  })

  if (loading) return <LoadingSpinner />

  return (
    <>
      <button onClick={onNew} className="bg-green-600 text-white px-4 py-2 rounded mb-4">
        + New Product
      </button>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.products?.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">${p.price.toFixed(2)}</td>
              {/* `stock` matches backend field */}
              <td className="p-2 border">{p.stock}</td>
              <td className="p-2 border flex gap-2">
                <button onClick={() => onEdit(p)} className="text-blue-600">Edit</button>
                <button
                  onClick={() => deleteProduct({ variables: { id: p.id } })}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// ── Orders tab ────────────────────────────────────────────────────────────────
function OrdersTab() {
  const { data, loading } = useQuery(ORDERS)
  const [updateStatus] = useMutation(UPDATE_ORDER_STATUS)
  const [deleteOrder]  = useMutation(DELETE_ORDER, { refetchQueries: [{ query: ORDERS }] })

  if (loading) return <LoadingSpinner />

  const statuses = ['pending', 'processing', 'shipped', 'delivered']

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2 border">ID</th>
          <th className="p-2 border">User</th>
          <th className="p-2 border">Total</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data?.orders?.map(o => (
          <tr key={o.id} className="hover:bg-gray-50">
            <td className="p-2 border">#{o.id.slice(-6)}</td>
            <td className="p-2 border">{o.userEmail}</td>
            {/* `totalAmount` matches backend field */}
            <td className="p-2 border">${o.totalAmount.toFixed(2)}</td>
            <td className="p-2 border">
              <select
                value={o.status}
                onChange={e => updateStatus({ variables: { id: o.id, status: e.target.value } })}
                className="border rounded px-2 py-1"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
            <td className="p-2 border">
              <button
                onClick={() => deleteOrder({ variables: { id: o.id } })}
                className="text-red-500"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Users tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const { data, loading } = useQuery(USERS)

  if (loading) return <LoadingSpinner />

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Role</th>
        </tr>
      </thead>
      <tbody>
        {data?.users?.map(u => (
          <tr key={u.id} className="hover:bg-gray-50">
            <td className="p-2 border">{u.name}</td>
            <td className="p-2 border">{u.email}</td>
            <td className="p-2 border capitalize">{u.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
