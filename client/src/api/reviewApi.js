import API from "./api";

// Get all reviews of a product
export const getReviews = async (productId) => {
  const res = await API.get(`/reviews/${productId}`);
  return res.data;
};

// Add a review
export const addReview = async (reviewData) => {
  const res = await API.post("/reviews", reviewData);
  return res.data;
};