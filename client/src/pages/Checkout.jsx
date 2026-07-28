import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { getCart } from "../api/cartApi";
import { placeOrder } from "../api/orderApi";

const initialCart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
};

const initialAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const Checkout = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [cart, setCart] =
    useState(initialCart);

  const [address, setAddress] =
    useState(initialAddress);

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCart();

      setCart({
        items: Array.isArray(data?.items)
          ? data.items
          : [],
        subtotal: Number(
          data?.subtotal || 0
        ),
        shipping: Number(
          data?.shipping || 0
        ),
        tax: Number(data?.tax || 0),
        total: Number(data?.total || 0),
      });
    } catch (err) {
      console.error(
        "Failed to load cart:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load checkout details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((currentAddress) => ({
      ...currentAddress,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateAddress = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const hasEmptyField =
      requiredFields.some(
        (field) =>
          !address[field]?.trim()
      );

    if (hasEmptyField) {
      setError(
        "Please complete all shipping address fields."
      );
      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        address.phone.trim()
      )
    ) {
      setError(
        "Please enter a valid 10-digit Indian phone number."
      );
      return false;
    }

    if (
      !/^\d{6}$/.test(
        address.pincode.trim()
      )
    ) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return false;
    }

    return true;
  };

  const handleOrder = async () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }

    if (cart.items.length === 0) {
      setError(
        "Your cart is empty. Add products before placing an order."
      );
      return;
    }

    if (!validateAddress()) {
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      await placeOrder({
        userId: user._id,
        shippingAddress: {
          ...address,
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          address: address.address.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
          country: address.country.trim(),
        },
        paymentMethod: "COD",
      });

      setSuccess(true);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      setTimeout(() => {
        navigate("/orders");
      }, 1400);
    } catch (err) {
      console.error(
        "Failed to place order:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  if (!user) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <ShoppingBag size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Login Required
          </h1>

          <p className="mt-3 text-zinc-400">
            Please login before proceeding
            to checkout.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login to Continue
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500" />

          <h2 className="mt-5 text-xl font-semibold">
            Preparing checkout...
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Loading your cart and order
            summary.
          </p>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-zinc-900 p-8 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={34} />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Order Placed Successfully
          </h1>

          <p className="mt-3 text-zinc-400">
            Your order has been confirmed.
            Redirecting you to your orders.
          </p>

          <Loader2 className="mx-auto mt-6 animate-spin text-blue-400" />
        </div>
      </section>
    );
  }

  if (cart.items.length === 0) {
    return (
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-400">
            <ShoppingBag size={38} />
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Your Cart Is Empty
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-zinc-400">
            Add products to your cart before
            proceeding to checkout.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-76px)] bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-blue-400">
              <ShieldCheck size={24} />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Secure Checkout
              </p>

              <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
                Complete Your Order
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Enter your delivery information
            and review your order before
            confirming.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Shipping form */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/20 sm:p-8">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <MapPin size={21} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Shipping Address
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Provide the address where
                  your order should be delivered.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <InputField
                label="Full Name"
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={<User size={18} />}
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                icon={<Phone size={18} />}
                inputMode="numeric"
                maxLength={10}
              />

              <div className="sm:col-span-2">
                <InputField
                  label="Street Address"
                  name="address"
                  value={address.address}
                  onChange={handleChange}
                  placeholder="House number, street, locality"
                  icon={<MapPin size={18} />}
                />
              </div>

              <InputField
                label="City"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="Enter city"
              />

              <InputField
                label="State"
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="Enter state"
              />

              <InputField
                label="Pincode"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                inputMode="numeric"
                maxLength={6}
              />

              <InputField
                label="Country"
                name="country"
                value={address.country}
                onChange={handleChange}
                placeholder="Country"
                disabled
              />
            </div>

            {/* Payment method */}
            <div className="mt-8 border-t border-zinc-800 pt-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    Payment Method
                  </h3>

                  <p className="text-sm text-zinc-400">
                    Select how you want to pay.
                  </p>
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-4 rounded-2xl border border-blue-500 bg-blue-500/5 p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked
                  readOnly
                  className="h-4 w-4 accent-blue-600"
                />

                <div className="flex-1">
                  <p className="font-semibold text-white">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    Pay when your order arrives.
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  Available
                </span>
              </label>
            </div>
          </div>

          {/* Order summary */}
          <aside className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/20 lg:sticky lg:top-28">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Package size={21} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Order Summary
                </h2>

                <p className="text-sm text-zinc-400">
                  {cart.items.length}{" "}
                  {cart.items.length === 1
                    ? "item"
                    : "items"}
                </p>
              </div>
            </div>

            <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
              {cart.items.map((item) => {
                const product =
                  item.productId || {};

                const itemTotal =
                  Number(product.price || 0) *
                  Number(item.quantity || 0);

                return (
                  <div
                    key={item._id}
                    className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={
                            product.name ||
                            "Product"
                          }
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <Package
                          size={24}
                          className="text-zinc-400"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">
                        {product.name ||
                          "Product unavailable"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm font-bold text-blue-400">
                        ₹
                        {formatPrice(
                          itemTotal
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-4 border-t border-zinc-800 pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹
                  {formatPrice(
                    cart.subtotal
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">
                  Shipping
                </span>

                <span className="font-semibold">
                  ₹
                  {formatPrice(
                    cart.shipping
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">
                  Tax
                </span>

                <span className="font-semibold">
                  ₹{formatPrice(cart.tax)}
                </span>
              </div>
            </div>

            <div className="my-6 border-t border-zinc-800" />

            <div className="flex items-end justify-between gap-4">
              <span className="text-lg font-bold">
                Total
              </span>

              <span className="text-3xl font-extrabold text-blue-400">
                ₹{formatPrice(cart.total)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleOrder}
              disabled={placingOrder}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {placingOrder ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Placing Order...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Place Order
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
              By placing your order, you
              confirm that your delivery
              information is correct.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

const InputField = ({
  label,
  icon,
  ...inputProps
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-zinc-300">
        {label}
      </span>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
            {icon}
          </span>
        )}

        <input
          {...inputProps}
          required
          className={`w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 ${
            icon ? "pl-11" : ""
          }`}
        />
      </div>
    </label>
  );
};

export default Checkout;