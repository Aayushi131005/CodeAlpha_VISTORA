import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Shield,
  ShoppingBag,
  ShoppingCart,
  User,
  Users,
  X,
} from "lucide-react";

import { getCart } from "../api/cartApi";

function Navbar() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] =
    useState(false);
  const [cartCount, setCartCount] =
    useState(0);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin = user?.role === "admin";

  const loadCartCount = async () => {
    try {
      if (!user || isAdmin) {
        setCartCount(0);
        return;
      }

      const data = await getCart();

      const items = Array.isArray(data?.items)
        ? data.items
        : [];

      const total = items.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0),
        0
      );

      setCartCount(total);
    } catch (err) {
      console.error(
        "Failed to load cart count:",
        err
      );

      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();

    window.addEventListener(
      "cartUpdated",
      loadCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadCartCount
      );
    };
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const value = keyword.trim();

    navigate(
      value
        ? `/?search=${encodeURIComponent(
            value
          )}`
        : "/"
    );

    setMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(
      new Event("authUpdated")
    );

    navigate("/");
    window.location.reload();
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const adminLinkClass = ({
    isActive,
  }) =>
    `hidden rounded-lg px-3 py-2 text-sm font-semibold transition lg:block ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center gap-5">
          {/* Logo */}
          <Link
            to={isAdmin ? "/dashboard" : "/"}
            onClick={closeMenu}
            className="shrink-0"
          >
            <div className="flex flex-col leading-none">
              <span className="gradient-text text-2xl font-extrabold tracking-tight md:text-3xl">
                VISTORA
              </span>

              <span className="mt-1 hidden whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:block">
                Shop Smart. Live Better.
              </span>
            </div>
          </Link>

          {/* Desktop customer search */}
          {!isAdmin && (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden min-w-0 flex-1 xl:block"
            >
              <div className="relative mx-auto w-full max-w-xl">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(event) =>
                    setKeyword(
                      event.target.value
                    )
                  }
                  className="block h-12 w-full rounded-full border border-slate-200 bg-slate-100 py-3 pl-14 pr-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </form>
          )}

          {/* Desktop navigation */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
            {!isAdmin && (
              <>
                <NavLink
                  to="/"
                  className={({
                    isActive,
                  }) =>
                    `hidden rounded-lg px-3 py-2 text-sm font-semibold transition lg:block ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                    }`
                  }
                >
                  Home
                </NavLink>

                {user && (
                  <>
                    <Link
                      to="/wishlist"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Wishlist"
                    >
                      <Heart size={21} />
                    </Link>

                    <NavLink
                      to="/orders"
                      className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-purple-50 hover:text-purple-600 lg:flex"
                    >
                      <ShoppingBag size={18} />
                      My Orders
                    </NavLink>
                  </>
                )}

                <Link
                  to="/cart"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                  aria-label="Cart"
                >
                  <ShoppingCart size={21} />

                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-1 text-[10px] font-bold text-white shadow">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                {/* Admin role badge — no redirect */}
                <div className="flex cursor-default items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 font-semibold text-white shadow-md">
                  <Shield size={18} />
                  Admin
                </div>

                <NavLink
                  to="/dashboard"
                  className={adminLinkClass}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/admin"
                  end
                  className={adminLinkClass}
                >
                  Products
                </NavLink>

                <NavLink
                  to="/admin/orders"
                  className={adminLinkClass}
                >
                  Orders
                </NavLink>

                <NavLink
                  to="/admin/users"
                  className={({
                    isActive,
                  }) =>
                    `hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition lg:flex ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                    }`
                  }
                >
                  <Users size={18} />
                  Users
                </NavLink>
              </>
            )}

            {user ? (
              <div className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    <User size={18} />
                  </div>

                  <div className="hidden text-left lg:block">
                    <p className="max-w-36 truncate text-sm font-bold text-slate-900">
                      {user.name}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      {isAdmin
                        ? "Administrator"
                        : "Customer"}
                    </p>
                  </div>
                </button>

                {/* Account dropdown */}
                <div className="absolute right-0 top-full hidden pt-4 group-hover:block">
                  <div className="w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20">
                          <User size={30} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xl font-extrabold">
                            {user.name}
                          </p>

                          <p className="mt-1.5 truncate text-sm text-blue-100">
                            {user.email}
                          </p>

                          <span className="mt-3 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold">
                            {isAdmin
                              ? "Admin Account"
                              : "Customer Account"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isAdmin && (
                      <div className="space-y-2 p-4">
                        <p className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                          My Account
                        </p>

                        <DropdownLink
                          to="/orders"
                          onClick={closeMenu}
                          icon={
                            <ShoppingBag
                              size={21}
                            />
                          }
                          title="My Orders"
                          description="Track your purchases"
                          iconClass="bg-purple-100 text-purple-600"
                          hoverClass="hover:bg-purple-50 hover:text-purple-700"
                        />

                        <DropdownLink
                          to="/wishlist"
                          onClick={closeMenu}
                          icon={
                            <Heart size={21} />
                          }
                          title="Wishlist"
                          description="View saved products"
                          iconClass="bg-rose-100 text-rose-600"
                          hoverClass="hover:bg-rose-50 hover:text-rose-700"
                        />
                      </div>
                    )}

                    {isAdmin && (
                      <div className="space-y-2 p-4">
                        <p className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                          Administration
                        </p>

                        <DropdownLink
                          to="/dashboard"
                          icon={
                            <LayoutDashboard
                              size={21}
                            />
                          }
                          title="Dashboard"
                          description="View store performance"
                          iconClass="bg-indigo-100 text-indigo-600"
                          hoverClass="hover:bg-indigo-50 hover:text-indigo-700"
                        />

                        <DropdownLink
                          to="/admin"
                          icon={
                            <Package size={21} />
                          }
                          title="Products"
                          description="Manage all products"
                          iconClass="bg-cyan-100 text-cyan-600"
                          hoverClass="hover:bg-cyan-50 hover:text-cyan-700"
                        />

                        <DropdownLink
                          to="/admin/orders"
                          icon={
                            <ShoppingCart
                              size={21}
                            />
                          }
                          title="Orders"
                          description="Manage customer orders"
                          iconClass="bg-amber-100 text-amber-600"
                          hoverClass="hover:bg-amber-50 hover:text-amber-700"
                        />

                        <DropdownLink
                          to="/admin/users"
                          icon={
                            <Users size={21} />
                          }
                          title="Users"
                          description="Manage customer accounts"
                          iconClass="bg-emerald-100 text-emerald-600"
                          hoverClass="hover:bg-emerald-50 hover:text-emerald-700"
                        />
                      </div>
                    )}

                    <div className="border-t border-slate-200 bg-slate-50 p-4">
                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-red-600 transition hover:bg-red-100"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
                          <LogOut size={21} />
                        </div>

                        <div className="text-left">
                          <p className="font-bold">
                            Logout
                          </p>

                          <p className="mt-1 text-sm text-red-400">
                            Sign out of your
                            account
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="gradient-button rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Tablet search */}
        {!isAdmin && (
          <form
            onSubmit={handleSearchSubmit}
            className="hidden pb-4 md:block xl:hidden"
          >
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(event) =>
                  setKeyword(event.target.value)
                }
                className="block h-11 w-full rounded-full border border-slate-200 bg-slate-100 py-3 pl-14 pr-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </form>
        )}

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="pb-5 md:hidden">
            {!isAdmin && (
              <form
                onSubmit={handleSearchSubmit}
                className="relative mb-4"
              >
                <Search
                  size={18}
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(event) =>
                    setKeyword(
                      event.target.value
                    )
                  }
                  className="block h-11 w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-14 pr-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
            )}

            <div className="space-y-2 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">
              {!isAdmin && (
                <>
                  <MobileLink
                    to="/"
                    onClick={closeMenu}
                  >
                    Home
                  </MobileLink>

                  {user && (
                    <>
                      <MobileLink
                        to="/wishlist"
                        onClick={closeMenu}
                      >
                        Wishlist
                      </MobileLink>

                      <MobileLink
                        to="/orders"
                        onClick={closeMenu}
                      >
                        My Orders
                      </MobileLink>
                    </>
                  )}

                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <span>Cart</span>

                    {cartCount > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1 text-xs text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white">
                    <Shield size={18} />
                    Administrator
                  </div>

                  <MobileLink
                    to="/dashboard"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </MobileLink>

                  <MobileLink
                    to="/admin"
                    onClick={closeMenu}
                  >
                    Manage Products
                  </MobileLink>

                  <MobileLink
                    to="/admin/orders"
                    onClick={closeMenu}
                  >
                    Manage Orders
                  </MobileLink>

                  <MobileLink
                    to="/admin/users"
                    onClick={closeMenu}
                  >
                    Manage Users
                  </MobileLink>
                </>
              )}

              {user ? (
                <>
                  <div className="my-2 border-t border-slate-200" />

                  <div className="px-4 py-3">
                    <p className="font-bold text-slate-900">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-sm text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full rounded-xl px-4 py-3 text-left font-bold text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="gradient-button rounded-xl px-4 py-3 text-center font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

const DropdownLink = ({
  to,
  icon,
  title,
  description,
  iconClass,
  hoverClass,
}) => (
  <Link
    to={to}
    className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-slate-700 transition ${hoverClass}`}
  >
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
    >
      {icon}
    </div>

    <div>
      <p className="font-bold">{title}</p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  </Link>
);

const MobileLink = ({
  to,
  onClick,
  children,
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block rounded-xl px-4 py-3 font-semibold transition ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
      }`
    }
  >
    {children}
  </NavLink>
);

export default Navbar;