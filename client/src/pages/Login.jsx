import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { loginUser } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.email.trim() ||
      !form.password.trim()
    ) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      window.dispatchEvent(
        new Event("authUpdated")
      );

      if (data.user.role === "admin") {
        navigate("/dashboard", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-zinc-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[720px] max-w-6xl overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left panel */}
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur">
                <ShoppingBag size={24} />
              </div>

              <div>
                <p className="text-2xl font-extrabold tracking-tight">
                  VISTORA
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-100">
                  Shop Smart. Live Better.
                </p>
              </div>
            </Link>

            <div className="mt-20 max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
                <Sparkles size={15} />
                Smarter Shopping
              </span>

              <h1 className="mt-7 text-5xl font-extrabold leading-[1.08] tracking-tight">
                Welcome back to your shopping experience.
              </h1>

              <p className="mt-6 text-lg leading-8 text-blue-100">
                Sign in to manage orders, save your
                favorite products, and continue
                shopping with Vistora.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={
                <ShieldCheck size={21} />
              }
              title="Secure Access"
              description="Your account and order data stay protected."
            />

            <FeatureCard
              icon={
                <ShoppingBag size={21} />
              }
              title="Quick Checkout"
              description="Return to your cart and orders instantly."
            />
          </div>
        </section>

        {/* Right panel */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-950/30">
                <ShoppingBag size={21} />
              </div>

              <div>
                <p className="text-xl font-extrabold">
                  VISTORA
                </p>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Shop Smart. Live Better.
                </p>
              </div>
            </Link>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Account Login
              </p>

              <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Welcome Back
              </h2>

              <p className="mt-4 leading-7 text-zinc-400">
                Sign in to continue shopping smarter
                with Vistora.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5"
            >
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                  {error}
                </div>
              )}

              <FormField
                label="Email Address"
                icon={<Mail size={19} />}
              >
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-13 w-full bg-transparent pr-4 text-sm text-white outline-none placeholder:text-zinc-600"
                  required
                />
              </FormField>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-300">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-400 transition hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="flex min-h-13 items-center rounded-2xl border border-zinc-700 bg-zinc-950 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <span className="flex h-full w-12 shrink-0 items-center justify-center text-zinc-500">
                    <Lock size={19} />
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-13 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="flex h-12 w-12 shrink-0 items-center justify-center text-zinc-500 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-4 font-bold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={19}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-800" />

              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                New to Vistora?
              </span>

              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <Link
              to="/register"
              className="flex w-full items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 font-semibold text-zinc-300 transition hover:border-blue-500 hover:bg-blue-500/5 hover:text-white"
            >
              Create an Account
            </Link>

            <p className="mt-8 text-center text-xs leading-6 text-zinc-600">
              By signing in, you agree to Vistora's
              Terms of Service and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

const FormField = ({
  label,
  icon,
  children,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-zinc-300">
        {label}
      </label>

      <div className="flex min-h-13 items-center rounded-2xl border border-zinc-700 bg-zinc-950 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
        <span className="flex h-full w-12 shrink-0 items-center justify-center text-zinc-500">
          {icon}
        </span>

        {children}
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-blue-100">
        {description}
      </p>
    </div>
  );
};

export default Login;