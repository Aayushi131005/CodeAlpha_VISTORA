import API from "./api";

// Add Product to Wishlist
export const addWishlist = async (data) => {
  const res = await API.post("/wishlist", data);
  return res.data;
};

// Get User Wishlist
export const getWishlist = async (userId) => {
  const res = await API.get(`/wishlist/${userId}`);
  return res.data;
};

// Remove Wishlist Item
export const removeWishlist = async (id) => {
  const res = await API.delete(`/wishlist/${id}`);
  return res.data;
};

// Clear Wishlist
export const clearWishlist = async (userId) => {
  const res = await API.delete(`/wishlist/clear/${userId}`);
  return res.data;
};