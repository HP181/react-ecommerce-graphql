import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate, Link } from 'react-router-dom'
import { LOGIN } from '../graphql/mutations'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { refetch } = useAuth()
  const navigate = useNavigate()

  const [login] = useMutation(LOGIN)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login({ variables: form })
      // After login the server set a cookie — re-run ME query to update user state
      await refetch()
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          required
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        No account? <Link to="/register" className="text-blue-600">Register</Link>
      </p>
    </div>
  )
}
