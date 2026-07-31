import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import Users from "./pages/Users";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";

function Home() {
  return (
    <>
      <Hero />
      <Products />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full overflow-x-hidden bg-zinc-950">
        <Navbar />

        <main className="w-full">
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Product Details */}
            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />

            {/* Cart */}
            <Route
              path="/cart"
              element={<Cart />}
            />

            {/* Wishlist */}
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            {/* Authentication */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* Checkout */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* My Orders */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Admin Orders */}
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />

            {/* Admin Users */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Users />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;