# FANLUXE — Premium Fan Merchandise E-commerce

A full-stack React + Firebase e-commerce starter for a luxury fan merchandise and accessories brand. It includes customer storefront, authentication, cart + checkout, user dashboard, and admin operations.

## Stack

- **React + Vite**
- **Tailwind CSS** (glassmorphism + gradients + dark mode)
- **Firebase**: Auth, Firestore, Storage, Analytics
- **React Router**
- **Zustand** for app state
- **Framer Motion** animations
- **Recharts** admin analytics
- **PWA** via `vite-plugin-pwa`

## Features Included

- Google authentication with persistent session and role-aware UI
- Home page with premium hero + featured products + category cards
- Product listing with category/price/search filters
- Product detail page with add-to-cart CTA
- Cart with quantity controls + local persistence
- Checkout form that creates Firestore order docs
- User dashboard (profile, orders history, wishlist summary)
- Admin panel (`/admin`) with:
  - Product add/edit/delete
  - Product image upload to Firebase Storage
  - Order status updates
  - Revenue/user/order summary + chart
- Dark/light mode toggle
- Toast notifications + skeleton loaders
- Lazy-loaded routes and images
- Firebase rules examples (`firestore.rules`, `storage.rules`)

## Project Structure

```txt
src/
  components/
  context/
  firebase/
    config.js
    auth.js
    db.js
    storage.js
  hooks/
  pages/
    Home.jsx
    Product.jsx
    ProductDetail.jsx
    Cart.jsx
    Checkout.jsx
    Dashboard.jsx
    Admin.jsx
  utils/
```

## 1) Firebase Setup

1. Create a Firebase project.
2. Enable **Authentication → Google provider**.
3. Create **Firestore database** in production mode.
4. Enable **Firebase Storage**.
5. (Optional) Enable **Analytics**.
6. Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

7. Deploy rules:

```bash
firebase deploy --only firestore:rules,storage
```

## 2) Local Development

```bash
npm install
npm run dev
```

Visit: `http://localhost:3000`

## 3) Firestore Collections

### users
- uid
- name
- email
- photoURL
- role (`"user" | "admin"`)
- createdAt

### products
- id
- name
- description
- price
- discount
- category
- images[]
- stock
- createdAt

### orders
- orderId
- userId
- items[]
- totalPrice
- status
- createdAt

### wishlist
- userId
- productIds[]

## 4) Admin Access

To grant admin access, set role field for a user document:

```json
{ "role": "admin" }
```

After role update, re-login to refresh claims/profile state.

## 5) Deploy

### Vercel
- Import Git repo
- Add all `VITE_FIREBASE_*` env vars
- Build command: `npm run build`
- Output dir: `dist`

### Firebase Hosting

```bash
npm run build
firebase init hosting
firebase deploy --only hosting
```

## Notes for Production Hardening

- Move order/payment flow to Cloud Functions for payment gateway verification.
- Validate all write payloads server-side via functions.
- Add indexing for compound Firestore queries.
- Use signed upload URLs for stricter Storage controls.
- Add end-to-end tests + Sentry monitoring.
