import { gql } from '@apollo/client'

// --- AUTH ---
// Note: mutations use `input:` wrapper objects — that's how the backend expects them

export const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(input: { name: $name, email: $email, password: $password }) {
      token
      user { id name email role }
    }
  }
`

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      user { id name email role }
    }
  }
`

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

// --- PRODUCTS ---
// Backend field is `stock`, not `countInStock`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!, $description: String!, $price: Float!,
    $category: String!, $stock: Int!, $image: String
  ) {
    createProduct(input: {
      name: $name, description: $description, price: $price,
      category: $category, stock: $stock, image: $image
    }) {
      id name price stock
    }
  }
`

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!, $name: String!, $description: String!, $price: Float!,
    $category: String!, $stock: Int!, $image: String
  ) {
    updateProduct(id: $id, input: {
      name: $name, description: $description, price: $price,
      category: $category, stock: $stock, image: $image
    }) {
      id name price stock
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`

export const ADD_REVIEW = gql`
  mutation AddReview($productId: ID!, $rating: Int!, $comment: String!) {
    addReview(productId: $productId, rating: $rating, comment: $comment) {
      id rating numReviews
      reviews { id name rating comment }
    }
  }
`

// --- ORDERS ---
// OrderItemInput only needs { product: ID!, quantity: Int! }
// Backend calculates price/name from the product itself

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $items: [OrderItemInput!]!,
    $shippingAddress: ShippingAddressInput!
  ) {
    createOrder(items: $items, shippingAddress: $shippingAddress) {
      id totalAmount status
    }
  }
`

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id status
    }
  }
`

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`
