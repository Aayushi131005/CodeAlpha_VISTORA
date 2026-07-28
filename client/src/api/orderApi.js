import API from "./api";

// Place Order
export const placeOrder = async (orderData) => {
  const res = await API.post("/orders", orderData);
  return res.data;
};

// Get Logged-in User Orders
export const getMyOrders = async (userId) => {
  const res = await API.get(`/orders/my/${userId}`);
  return res.data;
};

// Get All Orders (Admin)
export const getAllOrders = async () => {
  const res = await API.get("/orders");
  return res.data;
};

// Update Order Status (Admin)
export const updateOrderStatus = async (id, orderStatus) => {
  const res = await API.put(`/orders/${id}`, {
    orderStatus,
  });

  return res.data;
};