import axios from "axios";

// Base URL for the API
// const BASE_URL = "http://localhost:4000";
const BASE_URL = "https://ecommerce-shopping-server.onrender.com" ;

export const fetchCategories = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

export const editCategories = async (url, updateData) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error editing categories:", error);
    return error;
  }
};

export const deleteCategories = async (url) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting categories:", error);
    return error;
  }
};

export const postData = async (url, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, formData);
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    return error;
  }
};

export const postCartData = async (url, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, formData);
    return response;
  } catch (error) {
    console.error("Error posting cart data:", error);
    return error;
  }
};

export const postProduct = async (url, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error posting product:", error);
    return error;
  }
};

export const deleteProduct = async (url) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return error;
  }
};

export const getProductById = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching product:", error);
    return error;
  }
};
export const getProductReviews = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching product:", error);
    return error;
  }
};


export const updateCartItemQuantity = async (url, quantity) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, { quantity });
    return response.data; // Return the updated cart item
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return error;
  }
};

export const removeCartItem = async (url) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return error;
  }
};

export const removeAllCartItems = async (url) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error removing all cart items:", error);
    return error;
  }
};
export const removeMyListItem = async (url) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return error;
  }
};

export const removeAllMyListItems = async (url) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error removing all cart items:", error);
    return error;
  }
};

export const updateProduct = async (url, updateData) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return error;
  }
};
export const saveOrder = async (orderData) => {
  try {
    const response = await axios.post("/api/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};


export const fetchUserData = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data; // Return the user data
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
};

// Update user profile
export const updateUserProfile = async (url,  formData) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    return false;
  }
};

// Change user password

export const changeUserPassword = async (userId, oldPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/user/${userId}/password`,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error changing user password:', error);
    return { success: false, message: error.response?.data?.message || 'Server error' };
  }
};
