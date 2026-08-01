# ShopQL — React E-Commerce Frontend

A modern e-commerce storefront built with React 19, GraphQL, and AWS Cognito authentication. Deployed on Vercel.

**Live URL:** https://react-ecommerce-graphql.vercel.app

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| Apollo Client | GraphQL queries and mutations |
| Tailwind CSS v4 | Utility-first styling |
| react-oidc-context | AWS Cognito authentication (OIDC/PKCE flow) |
| Vercel | Hosting and deployment |

---

## Features

- **Browse products** — search by name, filter by category (public)
- **Product detail** — view description, reviews, rating (public)
- **Cart** — add/remove items, persisted in `localStorage` (public)
- **Checkout** — place orders with shipping address (login required)
- **My Orders** — view order history and status (login required)
- **Admin Panel** — manage products, orders, and users (admin only)
- **AWS Cognito auth** — sign up, sign in, sign out via Cognito Hosted UI

---

## Project Structure

```
src/
├── apollo/
│   └── client.js              # Apollo Client setup with auth link (Bearer token)
├── components/
│   ├── Navbar.jsx              # Navigation with cart count and auth state
│   ├── ProductCard.jsx         # Product grid card with Add to Cart
│   ├── ProductForm.jsx         # Create/edit product form (admin)
│   ├── Modal.jsx               # Reusable modal wrapper
│   └── LoadingSpinner.jsx      # Loading indicator
├── context/
│   └── CartContext.jsx         # Cart state + localStorage persistence
├── graphql/
│   ├── queries.js              # All GraphQL queries (ME, PRODUCTS, ORDERS, etc.)
│   └── mutations.js            # All GraphQL mutations (CREATE_ORDER, etc.)
├── pages/
│   ├── HomePage.jsx            # Product grid with search and category filter
│   ├── ProductDetailPage.jsx   # Product detail + reviews + add to cart
│   ├── CartPage.jsx            # Cart items + checkout form
│   ├── OrdersPage.jsx          # User's order history
│   └── AdminPage.jsx           # Admin tabs: Products | Orders | Users
├── App.jsx                     # Routes, auth token sync to Apollo
├── main.jsx                    # App entry point — all providers
└── index.css                   # Tailwind CSS directives
```

---

## Authentication Flow

This app uses **AWS Cognito** with the Authorization Code + PKCE flow via `react-oidc-context`.

```
User clicks Login / Register
         ↓
Redirected to Cognito Hosted UI
         ↓
User signs up or logs in on Cognito
         ↓
Cognito redirects back to app with an auth code
         ↓
react-oidc-context exchanges code → gets ID token + Access token
         ↓
App.jsx useEffect fires:
  1. setAccessToken(id_token)  ← Apollo attaches Bearer token to every request
  2. fetchMe()                 ← saves/updates user in MongoDB on first login
         ↓
User is authenticated — protected routes unlock
```

> **Why the ID token and not the access token?**
> Cognito's access token does not include the `email` field — only the ID token does.
> The backend `isAdmin()` check compares `user.email` against `ADMIN_EMAIL`,
> so we must send the ID token.

---

## Route Protection

| Route | Access |
|-------|--------|
| `/` | Public |
| `/product/:id` | Public |
| `/cart` | Public (checkout requires login) |
| `/orders` | Login required |
| `/admin` | Admin email only |

The `PrivateRoute` component in `App.jsx` calls `auth.signinRedirect()` if the user is not authenticated, redirecting them to the Cognito Hosted UI.

Admin access is checked against `VITE_ADMIN_EMAIL` in the frontend and `ADMIN_EMAIL` in the backend resolver.

---

## Apollo Client — How the Token Is Attached

```
Apollo Client
    └── authLink  (runs before every request)
           └── reads module-level `accessToken` variable
           └── adds header:  Authorization: Bearer <id_token>
    └── httpLink  →  VITE_GRAPHQL_URI (backend)
```

The token is stored in a plain module-level variable and updated by `setAccessToken()`
called from `App.jsx` whenever `auth.user?.id_token` changes.

This pattern avoids a timing problem: Apollo initialises before the user logs in,
so reading the token from React state at init time always gives `null`.
A module-level variable is updated later and read fresh on each request.

---

## Environment Variables

Create a `.env` file in the project root (or set these in the Vercel dashboard):

```env
# AWS Cognito
VITE_COGNITO_AUTHORITY=https://cognito-idp.us-east-1.amazonaws.com/<USER_POOL_ID>
VITE_COGNITO_CLIENT_ID=<APP_CLIENT_ID>
VITE_COGNITO_REDIRECT_URI=https://your-app.vercel.app
VITE_COGNITO_SCOPE=phone openid email
VITE_COGNITO_DOMAIN=https://<YOUR_DOMAIN>.auth.us-east-1.amazoncognito.com
VITE_COGNITO_LOGOUT_URI=https://your-app.vercel.app

# Admin
VITE_ADMIN_EMAIL=your-admin@email.com

# Backend GraphQL URL
VITE_GRAPHQL_URI=https://your-backend.vercel.app/graphql
```

> All `VITE_` variables are **public** — they are embedded in the browser bundle at build time.
> Never store secrets (private keys, passwords) here.

---

## Local Development

```bash
npm install
npm run dev
```

The Vite dev server proxies `/graphql` to `localhost:5000` (configured in `vite.config.js`),
so no CORS issues during local development.

---

## Deployment (Vercel)

1. Push the repo to GitHub
2. Import the repo in Vercel and set the **root directory** to `ecommerce`
3. Add all `VITE_*` environment variables in **Vercel → Settings → Environment Variables**
4. Deploy

### Why `vercel.json` is needed

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

React Router does **client-side routing** — the server only ever serves `index.html`.
When you refresh `/orders`, Vercel looks for an `orders` file that doesn't exist and returns 404.
The rewrite rule tells Vercel to always serve `index.html` and let React Router
decide what to render based on the URL.

---

## AWS Cognito Setup

In the AWS Cognito console → Your User Pool → App clients → App client → Hosted UI:

| Setting | Value |
|---------|-------|
| Allowed callback URLs | `https://your-app.vercel.app` and `http://localhost:5173` |
| Allowed sign-out URLs | `https://your-app.vercel.app` and `http://localhost:5173` |
| OAuth 2.0 grant types | Authorization code grant |
| OpenID Connect scopes | `openid`, `email`, `phone` |
