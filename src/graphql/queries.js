import { gql } from '@apollo/client'

// Ask the server "who am I?" — uses the HTTP-only cookie automatically
export const ME = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`

// Get all products — optional filters
export const PRODUCTS = gql`
  query Products($category: String, $search: String) {
    products(category: $category, search: $search) {
      id
      name
      description
      price
      category
      stock
      image
      rating
      numReviews
    }
  }
`

// Get one product with its reviews
export const PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      category
      stock
      image
      rating
      numReviews
      reviews {
        id
        name
        rating
        comment
      }
    }
  }
`

// Get unique category strings for the filter dropdown
export const CATEGORIES = gql`
  query Categories {
    categories
  }
`

// Get the logged-in user's own orders
export const MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id
      totalAmount
      status
      isPaid
      createdAt
      items {
        name
        quantity
        price
        image
      }
      shippingAddress {
        address
        city
        country
      }
    }
  }
`

// Admin only — get all orders
export const ORDERS = gql`
  query Orders {
    orders {
      id
      totalAmount
      status
      isPaid
      createdAt
      user {
        name
        email
      }
      items {
        name
        quantity
        price
      }
    }
  }
`

// Admin only — get all users
export const USERS = gql`
  query Users {
    users {
      id
      name
      email
      role
    }
  }
`
