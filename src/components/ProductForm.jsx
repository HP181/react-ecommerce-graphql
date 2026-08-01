import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../graphql/mutations'
import { PRODUCTS } from '../graphql/queries'

// Used for both creating a new product and editing an existing one.
// If `product` prop is passed → edit mode. Otherwise → create mode.
export default function ProductForm({ product, onClose }) {
  // Pre-fill form fields when editing (backend uses `stock`, not `countInStock`)
  const [form, setForm] = useState({
    name:        product?.name        || '',
    description: product?.description || '',
    price:       product?.price       || '',
    image:       product?.image       || '',
    category:    product?.category    || '',
    stock:       product?.stock       || '',
  })

  const isEdit = Boolean(product)

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: PRODUCTS }],
  })

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: PRODUCTS }],
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const vars = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    }
    if (isEdit) {
      await updateProduct({ variables: { id: product.id, ...vars } })
    } else {
      await createProduct({ variables: vars })
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {['name', 'description', 'image', 'category'].map(field => (
        <input
          key={field}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
      ))}

      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
        className="border rounded px-3 py-2"
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        required
        className="border rounded px-3 py-2"
      />

      <button type="submit" className="bg-blue-600 text-white py-2 rounded">
        {isEdit ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  )
}
