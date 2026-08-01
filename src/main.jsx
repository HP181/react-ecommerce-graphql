import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { AuthProvider as CognitoProvider } from 'react-oidc-context'
import client from './apollo/client'
import { CartProvider } from './context/CartContext'
import App from './App'
import "./index.css"

// All values come from .env file (VITE_ prefix makes them available in the browser)
const cognitoAuthConfig = {
  authority:     import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id:     import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri:  import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: "code",
  scope:         import.meta.env.VITE_COGNITO_SCOPE,
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CognitoProvider {...cognitoAuthConfig}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <CartProvider>
            <App />
          </CartProvider>
        </BrowserRouter>
      </ApolloProvider>
    </CognitoProvider>
  </StrictMode>
)
