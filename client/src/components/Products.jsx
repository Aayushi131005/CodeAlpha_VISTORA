import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { getProducts } from "../api/productApi";
import ProductCard from "./ProductCard";

const Products = () => {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] =
    useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] =
    useState("All");

  const [sort, setSort] =
    useState("newest");

  useEffect(() => {
    setSearch(
      searchParams.get("search") || ""
    );
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let data = [...products];

    const searchText = search
      .trim()
      .toLowerCase();

    if (searchText) {
      data = data.filter((product) => {
        const name =
          product.name?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() ||
          "";

        const productCategory =
          product.category?.toLowerCase() ||
          "";

        return (
          name.includes(searchText) ||
          description.includes(searchText) ||
          productCategory.includes(searchText)
        );
      });
    }

    if (category !== "All") {
      data = data.filter(
        (product) =>
          product.category === category
      );
    }

    if (sort === "priceLow") {
      data.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
    } else if (sort === "priceHigh") {
      data.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );
    } else if (sort === "rating") {
      data.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    } else {
      data.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    setFilteredProducts(data);
  }, [
    products,
    search,
    category,
    sort,
  ]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      const productList = Array.isArray(data)
        ? data
        : [];

      setProducts(productList);
      setFilteredProducts(productList);
    } catch (error) {
      console.error(error);

      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(
      products
        .map(
          (product) =>
            product.category
        )
        .filter(Boolean)
    ),
  ];

  return (
    <section
      id="products"
      className="min-h-screen bg-zinc-950 text-white"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Our Collection
            </p>

            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
              Featured Products
            </h1>

            <p className="mt-2 text-zinc-400">
              Explore our latest products and
              find something you love.
            </p>
          </div>

          <p className="text-sm font-medium text-zinc-400">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}{" "}
            found
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                style={{ left: "16px" }}
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={{
                  paddingLeft: "48px",
                  paddingRight: "16px",
                }}
                className="w-full h-12 rounded-xl border border-zinc-700 bg-zinc-800 text-white outline-none placeholder:text-zinc-500 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <SlidersHorizontal
                size={18}
                className="absolute top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                style={{ left: "16px" }}
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                style={{
                  paddingLeft: "46px",
                  paddingRight: "40px",
                }}
                className="w-full h-12 appearance-none rounded-xl border border-zinc-700 bg-zinc-800 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 lg:w-56"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="w-full h-12 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 lg:w-56"
            >
              <option value="newest">
                Newest
              </option>

              <option value="priceLow">
                Price: Low to High
              </option>

              <option value="priceHigh">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>
            </select>
          </div>
        </div>

        {/* Product Content */}
        {loading ? (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />

              <h2 className="mt-4 text-lg font-semibold text-white">
                Loading products...
              </h2>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-20 text-center">
            <h2 className="text-2xl font-bold text-white">
              No Products Found
            </h2>

            <p className="mt-2 text-zinc-400">
              Try another search or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSort("newest");
              }}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;