import API from "./api";

// Get All Users
export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Delete User
export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");

  const response = await API.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};