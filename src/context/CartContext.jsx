import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // Load cart from localStorage so it survives page refresh
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage every time cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Add item or increase quantity if already in cart
  function addToCart(product, qty = 1) {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        // Update quantity for existing item
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      // Add new item
      return [...prev, { ...product, qty }]
    })
  }

  // Remove an item completely from cart
  function removeFromCart(productId) {
    setCart(prev => prev.filter(i => i.id !== productId))
  }

  // Empty the whole cart (called after placing an order)
  function clearCart() {
    setCart([])
  }

  // Total number of items (sum of all quantities)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  // Total price
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
