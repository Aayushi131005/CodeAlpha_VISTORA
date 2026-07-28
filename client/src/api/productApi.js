import API from "./api";

// =========================
// Get All Products
// =========================
export const getProducts = async (
  search = "",
  category = "All",
  sort = "newest"
) => {
  const res = await API.get("/products", {
    params: {
      search,
      category,
      sort,
    },
  });

  return res.data;
};

// =========================
// Search Products
// =========================
export const searchProducts = async (keyword) => {
  const res = await API.get(`/products/search?keyword=${keyword}`);
  return res.data;
};

// =========================
// Get Single Product
// =========================
export const getProduct = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

// =========================
// Add Product
// =========================
export const addProduct = async (product) => {
  const res = await API.post("/products", product);
  return res.data;
};

// =========================
// Update Product
// =========================
export const updateProduct = async (id, product) => {
  const res = await API.put(`/products/${id}`, product);
  return res.data;
};

// =========================
// Delete Product
// =========================
export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};