import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";

import { registerUser } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "user",
    adminCode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (
      form.accountType === "admin" &&
      !form.adminCode.trim()
    ) {
      alert("Enter the admin registration code");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        accountType: form.accountType,
        adminCode:
          form.accountType === "admin"
            ? form.adminCode.trim()
            : "",
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-zinc-700 bg-zinc-800/80 pl-12 pr-4 text-white outline-none placeholder:text-zinc-500 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <section className="min-h-[calc(100vh-76px)] w-full bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/30 lg:grid-cols-2">
        {/* Left side */}
        <div className="hidden bg-zinc-900 border-r border-zinc-800 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
           <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 text-blue-400">
              <UserPlus size={27} />
            </div>

            <h1 className="mt-8 text-4xl font-bold text-white">
              Join Vistora
            </h1>

            <p className="mt-5 max-w-md text-lg leading-8 text-zinc-400">
              Create your account and start shopping
              smarter with secure checkout, order
              tracking, wishlists and more.
            </p>
          </div>

         <div className="rounded-2xl border border-zinc-800 bg-zinc-800/60 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} />

              <div>
                <p className="font-bold">
                  Secure Registration
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  Your account information is protected.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <div className="text-center lg:text-left">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-400">
                Welcome to Vistora
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Create Account
              </h2>

              <p className="mt-3 text-zinc-400">
                Register to shop smart and live better.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
            >
              <div className="relative">
                <User
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Full name"
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="relative">
                <Mail
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Email address"
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Password"
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  placeholder="Confirm password"
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="pt-2">
                <p className="mb-3 text-sm font-semibold text-zinc-300">
                  Account Type
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${
                      form.accountType === "user"
                        ? "border-blue-500 bg-blue-500/15 text-blue-300 ring-2 ring-blue-500/10"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value="user"
                      checked={
                        form.accountType === "user"
                      }
                      onChange={handleChange}
                      className="hidden"
                    />

                    Customer
                  </label>

                  <label
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${
                      form.accountType === "admin"
                        ? "border-purple-500 bg-purple-500/15 text-purple-300 ring-2 ring-purple-500/10"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value="admin"
                      checked={
                        form.accountType === "admin"
                      }
                      onChange={handleChange}
                      className="hidden"
                    />

                    Admin
                  </label>
                </div>
              </div>

              {form.accountType === "admin" && (
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4">
                  <div className="relative">
                    <ShieldCheck
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                    />

                    <input
                      type="password"
                      name="adminCode"
                      value={form.adminCode}
                      placeholder="Admin registration code"
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-purple-500/30 bg-zinc-800 pl-12 pr-4 text-white outline-none placeholder:text-zinc-500 transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10"
                      required
                    />
                  </div>

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Admin registration requires the
                    authorized secret code.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 font-bold text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-purple-700 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-400 transition hover:text-blue-300"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;