import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  Image as ImageIcon,
  Loader2,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/productApi";

const initialForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
  stock: "",
};

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load products:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const category =
        product.category?.toLowerCase() || "";

      return (
        name.includes(query) ||
        category.includes(query)
      );
    });
  }, [products, search]);

  const totalStock = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          total + Number(product.stock || 0),
        0
      ),
    [products]
  );

  const lowStockProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          Number(product.stock || 0) <= 5
      ).length,
    [products]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      price: product.price ?? "",
      category: product.category || "",
      description: product.description || "",
      image: product.image || "",
      stock: product.stock ?? "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (submitting) {
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (
      !productData.name ||
      !productData.category ||
      !productData.description ||
      !productData.image
    ) {
      alert("Please complete all product fields.");
      return;
    }

    if (
      Number.isNaN(productData.price) ||
      productData.price < 0
    ) {
      alert("Please enter a valid product price.");
      return;
    }

    if (
      Number.isNaN(productData.stock) ||
      productData.stock < 0
    ) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await updateProduct(
          editingId,
          productData
        );
      } else {
        await addProduct(productData);
      }

      closeForm();
      await loadProducts();
    } catch (error) {
      console.error(
        "Product operation failed:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Product operation failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId("");
    }
  };

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <section className="min-h-[calc(100vh-76px)] bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Product Management
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-blue-400">
                <Package size={24} />
              </div>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Products
              </h1>
            </div>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Add new products, update inventory and
              manage the Vistora catalogue.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={loadProducts}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={19} />
              Add Product
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <SummaryCard
            icon={<Package size={22} />}
            label="Total Products"
            value={products.length}
            iconClass="bg-blue-500/10 text-blue-400"
          />

          <SummaryCard
            icon={<Boxes size={22} />}
            label="Total Stock"
            value={totalStock}
            iconClass="bg-emerald-500/10 text-emerald-400"
          />

          <SummaryCard
            icon={<AlertTriangle size={22} />}
            label="Low Stock"
            value={lowStockProducts}
            iconClass="bg-amber-500/10 text-amber-400"
          />
        </div>

        {/* Product table */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                All Products
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {filteredProducts.length} of{" "}
                {products.length} products shown
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
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
                placeholder="Search products or categories"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto animate-spin text-blue-400" />

                <p className="mt-4 text-zinc-400">
                  Loading products...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <AlertTriangle size={28} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Unable to load products
              </h3>

              <p className="mt-2 text-zinc-400">
                {error}
              </p>

              <button
                type="button"
                onClick={loadProducts}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
                <Package size={29} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No Products Found
              </h3>

              <p className="mt-2 text-zinc-500">
                {search
                  ? "Try changing your search."
                  : "Add your first product to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead className="bg-zinc-950/60">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    <th className="px-6 py-4">
                      Product
                    </th>

                    <th className="px-6 py-4">
                      Category
                    </th>

                    <th className="px-6 py-4">
                      Price
                    </th>

                    <th className="px-6 py-4">
                      Stock
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800">
                  {filteredProducts.map(
                    (product) => {
                      const stock = Number(
                        product.stock || 0
                      );

                      const isDeleting =
                        deletingId === product._id;

                      return (
                        <tr
                          key={product._id}
                          className="transition hover:bg-zinc-800/40"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-white">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={
                                      product.name ||
                                      "Product"
                                    }
                                    className="h-full w-full object-contain p-2"
                                    onError={(event) => {
                                      event.currentTarget.style.display =
                                        "none";
                                    }}
                                  />
                                ) : (
                                  <ImageIcon
                                    size={26}
                                    className="text-zinc-400"
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-xs truncate font-bold text-white">
                                  {product.name ||
                                    "Unnamed product"}
                                </p>

                                <p className="mt-1 max-w-xs truncate text-sm text-zinc-500">
                                  {product.description ||
                                    "No description"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300">
                              {product.category ||
                                "Uncategorized"}
                            </span>
                          </td>

                          <td className="px-6 py-5 font-bold text-blue-400">
                            ₹
                            {formatPrice(
                              product.price
                            )}
                          </td>

                          <td className="px-6 py-5 font-semibold text-zinc-200">
                            {stock}
                          </td>

                          <td className="px-6 py-5">
                            {stock === 0 ? (
                              <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">
                                Out of Stock
                              </span>
                            ) : stock <= 5 ? (
                              <span className="rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400">
                                Low Stock
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                                In Stock
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditForm(
                                    product
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                              >
                                <Pencil size={16} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    product._id
                                  )
                                }
                                disabled={isDeleting}
                                className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isDeleting ? (
                                  <Loader2
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={16} />
                                )}

                                Delete
                              </button>
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

      {/* Add/Edit modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={closeForm}
        >
          <form
            onSubmit={handleSubmit}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/60 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">
                  {editingId
                    ? "Update Catalogue"
                    : "New Catalogue Item"}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {editingId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Enter product information and
                  inventory details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />

              <FormField
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter category"
              />

              <FormField
                label="Price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />

              <FormField
                label="Stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                min="0"
              />

              <div className="sm:col-span-2">
                <FormField
                  label="Image URL"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-zinc-300">
                  Description
                </span>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write a short product description"
                  required
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </label>
            </div>

            {form.image && (
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="mb-3 text-sm font-semibold text-zinc-300">
                  Image Preview
                </p>

                <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-white">
                  <img
                    src={form.image}
                    alt="Product preview"
                    className="h-full w-full object-contain p-4"
                  />
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingId ? (
                      <Pencil size={18} />
                    ) : (
                      <Plus size={18} />
                    )}

                    {editingId
                      ? "Update Product"
                      : "Add Product"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
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

const FormField = ({
  label,
  ...inputProps
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-zinc-300">
        {label}
      </span>

      <input
        {...inputProps}
        required
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
      />
    </label>
  );
};

export default Admin;