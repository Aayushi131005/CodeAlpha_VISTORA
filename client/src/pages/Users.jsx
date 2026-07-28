import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  CalendarDays,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User,
  UserCheck,
  Users as UsersIcon,
} from "lucide-react";

import {
  deleteUser,
  getUsers,
} from "../api/userApi";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] =
    useState("");
  const [roleFilter, setRoleFilter] =
    useState("All");
  const [deletingId, setDeletingId] =
    useState("");

  const loggedInUser = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load users:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const targetUser = users.find(
      (user) => user._id === id
    );

    if (!targetUser) {
      return;
    }

    if (targetUser.role === "admin") {
      alert(
        "Administrator accounts are protected."
      );
      return;
    }

    if (targetUser._id === loggedInUser?._id) {
      alert(
        "You cannot delete your current account."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete ${targetUser.name || "this user"}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteUser(id);

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    } finally {
      setDeletingId("");
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query) ||
        user._id
          ?.toLowerCase()
          .includes(query);

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const summary = useMemo(() => {
    const admins = users.filter(
      (user) => user.role === "admin"
    ).length;

    const customers = users.filter(
      (user) => user.role !== "admin"
    ).length;

    return {
      total: users.length,
      admins,
      customers,
    };
  }, [users]);

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <section className="min-h-[calc(100vh-76px)] bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              User Management
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-blue-400">
                <UsersIcon size={24} />
              </div>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Users
              </h1>
            </div>

            <p className="mt-3 max-w-2xl text-zinc-400">
              View registered accounts and manage
              customer access.
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                loading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <SummaryCard
            icon={<UsersIcon size={22} />}
            label="Total Users"
            value={summary.total}
            iconClass="bg-blue-500/10 text-blue-400"
          />

          <SummaryCard
            icon={<Shield size={22} />}
            label="Administrators"
            value={summary.admins}
            iconClass="bg-purple-500/10 text-purple-400"
          />

          <SummaryCard
            icon={<UserCheck size={22} />}
            label="Customers"
            value={summary.customers}
            iconClass="bg-emerald-500/10 text-emerald-400"
          />
        </div>

        {/* Users table */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                All Users
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {filteredUsers.length} of{" "}
                {users.length} accounts shown
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search name or email"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
              >
                <option value="All">
                  All Roles
                </option>

                <option value="admin">
                  Administrators
                </option>

                <option value="user">
                  Customers
                </option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto animate-spin text-blue-400" />

                <p className="mt-4 text-zinc-400">
                  Loading users...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <AlertTriangle size={28} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Unable to load users
              </h3>

              <p className="mt-2 text-zinc-400">
                {error}
              </p>

              <button
                type="button"
                onClick={loadUsers}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
                <UsersIcon size={29} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No Users Found
              </h3>

              <p className="mt-2 text-zinc-500">
                Try changing your search or role
                filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px]">
                <thead className="bg-zinc-950/60">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    <th className="px-6 py-4">
                      User
                    </th>

                    <th className="px-6 py-4">
                      Email
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800">
                  {filteredUsers.map(
                    (user) => {
                      const isCurrentUser =
                        user._id ===
                        loggedInUser?._id;

                      const isAdmin =
                        user.role === "admin";

                      const isDeleting =
                        deletingId === user._id;

                      return (
                        <tr
                          key={user._id}
                          className="transition hover:bg-zinc-800/40"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                                  isAdmin
                                    ? "bg-purple-500/10 text-purple-400"
                                    : "bg-blue-500/10 text-blue-400"
                                }`}
                              >
                                {user.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-xs truncate font-bold text-white">
                                  {user.name ||
                                    "Unnamed User"}
                                </p>

                                <p className="mt-1 font-mono text-xs text-zinc-500">
                                  #
                                  {user._id
                                    ?.slice(-8)
                                    .toUpperCase()}
                                </p>

                                {isCurrentUser && (
                                  <span className="mt-2 inline-flex rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
                                    Current Account
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm text-zinc-400">
                            {user.email ||
                              "Email unavailable"}
                          </td>

                          <td className="px-6 py-5">
                            {isAdmin ? (
                              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400">
                                <Shield size={15} />
                                Administrator
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300">
                                <User size={15} />
                                Customer
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <CalendarDays
                                size={16}
                              />
                              {formatDate(
                                user.createdAt
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end">
                              {isAdmin ||
                              isCurrentUser ? (
                                <span className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-500">
                                  <Shield size={16} />
                                  Protected
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      user._id
                                    )
                                  }
                                  disabled={
                                    isDeleting
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isDeleting ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2
                                      size={16}
                                    />
                                  )}

                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const SummaryCard = ({
  icon,
  label,
  value,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-sm font-semibold text-zinc-400">
        {label}
      </p>

      <p className="mt-1 text-3xl font-extrabold text-white">
        {value}
      </p>
    </div>
  );
};

export default Users;