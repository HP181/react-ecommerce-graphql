import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { PRODUCTS, CATEGORIES } from '../graphql/queries'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HomePage() {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('')

  // Fetch all products — pass search/category as variables to filter on backend
  const { data, loading } = useQuery(PRODUCTS, {
    variables: { search, category },
  })

  // Fetch category list for the filter dropdown
  const { data: catData } = useQuery(CATEGORIES)

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6">
      {/* Search bar + category filter */}
      <div className="flex gap-3 mb-6">
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {catData?.categories?.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Product grid — responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.products?.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {data?.products?.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}
    </div>
  )
}
