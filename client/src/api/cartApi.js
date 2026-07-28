import API from "./api";

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getCart = async () => {
  const user = getUser();

  if (!user) {
    return {
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    };
  }

  const res = await API.get("/cart", {
    params: {
      userId: user._id,
    },
  });

  return res.data;
};

export const addToCart = async (productId) => {
  const user = getUser();

  if (!user) {
    alert("Please login first");
    return;
  }

  const res = await API.post("/cart", {
    userId: user._id,
    productId,
  });

  return res.data;
};

export const increaseQty = async (id) => {
  return API.put(`/cart/increase/${id}`);
};

export const decreaseQty = async (id) => {
  return API.put(`/cart/decrease/${id}`);
};

export const removeCart = async (id) => {
  return API.delete(`/cart/${id}`);
};