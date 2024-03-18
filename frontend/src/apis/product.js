import axios from "axios";
const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export const getProducts = async () => {
  try {
    const requrl = `${backendURL}/products`;
    const token = localStorage.getItem("plyPickerToken");
    const config = {
      headers: {
        token: token,
      },
    };
    const response = await axios.get(requrl, config);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};
export const getProductDetails = async (productId) => {
  try {
    const requrl = `${backendURL}/products/${productId}`;
    const token = localStorage.getItem("plyPickerToken");
    const config = {
      headers: {
        token: token,
      },
    };
    const response = await axios.get(requrl, config);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};

export const submitUpdate = async (details) => {
  try {
    const requrl = `${backendURL}/submitRequest/${details._id}`;
    const token = localStorage.getItem("plyPickerToken");
    const formData = new FormData();
    formData.append("productName", details.productName);
    formData.append("price", details.price);
    formData.append("department", details.department);
    formData.append("productDescription", details.productDescription);

    if (details.image && details.image.length > 0) {
      for (let i = 0; i < details.image.length; i++) {
        formData.append("images", details.image[i]);
      }
    }

    const config = {
      headers: {
        token: token,
      },
    };

    const response = await axios.post(requrl, formData, config);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};

export const allRequests = async () => {
  try {
    const requrl = `${backendURL}/allRequests`;
    const token = localStorage.getItem("plyPickerToken");
    const config = {
      headers: {
        token: token,
      },
    };
    const response = await axios.get(requrl, config);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};
export const requestDetails = async (id) => {
  try {
    const requrl = `${backendURL}/request/${id}`;
    const token = localStorage.getItem("plyPickerToken");
    const config = {
      headers: {
        token: token,
      },
    };
    const response = await axios.get(requrl, config);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};

export const reviewRequest = async (id, approve) => {
  try {
    const requrl = `${backendURL}/reviewRequest/${id}`;
    const token = localStorage.getItem("plyPickerToken");
    const config = {
      headers: {
        token: token,
      },
    };
    const payLoad = {
      approve: approve ? true : false,
    };

    const response = await axios.post(requrl, payLoad, config);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};
