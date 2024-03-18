import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails, submitUpdate } from "../apis/product";
import { AuthContext } from "../components/context/authContext";
import { ToastContainer, toast } from "react-toastify";

const ProductDetails = () => {
  const { isLogin, userType } = useContext(AuthContext);
  const { productId } = useParams();
  const redirect = useNavigate();

  const [productDetails, setProductDetails] = useState();
  const [submitButton, setSubmitButton] = useState(false);

  async function fetchProductDetails() {
    const result = await getProductDetails(productId);
    setProductDetails(result.product);
  }

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleSumbit = async () => {
    setSubmitButton(true);
    const result = await submitUpdate(productDetails);
    console.log(result);
    if (result.status === "SUCCESS") {
      toast.success(result.message);
      setTimeout(() => {
        if (userType === "admin") {
          fetchProductDetails();
        } else {
          redirect(`/dashboard/${userType}`);
        }
      }, 2000);
    } else {
      toast.error(result.message);
    }
    setSubmitButton(false);
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row justify-between px-20 mt-10 h-full">
        {productDetails && (
          <>
            <div className="md:w-[45%] w-full">
              {typeof productDetails.image === "object" ? (
                <img
                  src={URL.createObjectURL(productDetails.image[0])}
                  alt="productImage"
                  className="rounded mb-2 md:h-[70%] w-full h-[50vh]"
                />
              ) : (
                <img
                  src={productDetails.image}
                  alt="productImage"
                  className="rounded mb-2 md:h-[70%] w-full h-[50vh]"
                />
              )}
              <input
                type="file"
                src={productDetails.image}
                className="w-full bg-gray-400 p-1 rounded-md"
                onChange={(e) => {
                  if (typeof productDetails.image === "object") {
                    setProductDetails({
                      ...productDetails,
                      image: [...productDetails.image, e.target.files],
                    });
                  }
                  setProductDetails({
                    ...productDetails,
                    image: [e.target.files[0]],
                  });
                }}
              />
            </div>

            <div className="flex flex-col md:w-[45%] w-full md:m-0">
              <span className="font-semibold">Department:</span>
              <input
                type="text"
                className="w-ful rounded-sm px-2"
                value={productDetails.department}
                onChange={(e) => {
                  setProductDetails({
                    ...productDetails,
                    department: e.target.value,
                  });
                }}
              />
              <span className="font-semibold">Product Name:</span>
              <input
                type="text"
                className="w-full rounded-sm px-2"
                value={productDetails.productName}
                onChange={(e) => {
                  setProductDetails({
                    ...productDetails,
                    productName: e.target.value,
                  });
                }}
              />
              <span className="font-semibold">Price:</span>
              <input
                type="number"
                className="w-full rounded-sm px-2"
                value={productDetails.price}
                onChange={(e) => {
                  setProductDetails({
                    ...productDetails,
                    price: e.target.value,
                  });
                }}
              />
              <span className="font-semibold">Product Description:</span>
              <textarea
                className="w-full h-[20vh] px-2 resize-none rounded-sm"
                value={productDetails.productDescription}
                onChange={(e) => {
                  setProductDetails({
                    ...productDetails,
                    productDescription: e.target.value,
                  });
                }}
              ></textarea>
            </div>
          </>
        )}
      </div>
      <div className="w-full flex flex-col items-center pb-5">
        {userType === "admin" ? (
          <button
            className="bg-yellow-500 w-max py-2 px-5  rounded-lg font-bold cursor-pointer"
            onClick={handleSumbit}
            disabled={submitButton}
          >
            Update Product Details
          </button>
        ) : (
          <button
            className="bg-yellow-500 w-max py-2 px-5  rounded-lg font-bold cursor-pointer"
            onClick={handleSumbit}
            disabled={submitButton}
          >
            Sumbit for review
          </button>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default ProductDetails;
