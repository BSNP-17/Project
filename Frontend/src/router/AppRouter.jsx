/**
 * AppRouter.jsx
 * 
 * NOTE: All routing is centrally managed in App.jsx using React Router v6.
 * Protected routes use the PrivateRoute component which checks for a JWT
 * token in localStorage before allowing access.
 * 
 * Public Routes:    /login, /register
 * Protected Routes: /home, /buses, /seat/:busId, /payment/:bookingId,
 *                   /profile, /my-bookings, /cart, /booking-success/:id
 * 
 * To add a new route:
 * 1. Create your page component in src/pages/
 * 2. Import it in App.jsx
 * 3. Add a <Route> wrapped in <PrivateRoute> if authentication is needed
 */

export {}; // This file serves as routing documentation
