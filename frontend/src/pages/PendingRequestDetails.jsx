import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { requestDetails } from "../apis/product";
import { ToastContainer, toast } from "react-toastify";
import { reviewRequest } from "../apis/product";

const PendingRequestDetails = () => {
  const redirect = useNavigate();
  const { id } = useParams();
  const [requestedChange, setRequestedChange] = useState(null);

  useEffect(() => {
    async function getDetails() {
      const result = await requestDetails(id);
      setRequestedChange(result.productReview);
    }
    getDetails();
  });

  const handleSumbit = async (approve) => {
    const result = await reviewRequest(requestedChange._id, approve);
    if (result.status === "SUCCESS") {
      toast.success(result.message);
      setTimeout(() => {
        redirect("/profile");
      }, 2000);
    } else {
      toast.error(result.message);
      setTimeout(() => {
        redirect("/profile");
      }, 2000);
    }
  };
  return (
    <>
      <div className="w-full flex flex-col md:flex-row justify-between px-20 mt-10">
        {requestedChange && (
          <>
            <div className="md:w-[50%] w-full h-[35vh] md:h-[60vh] rounded bg-blue-500 mb-3">
              <img
                src={requestedChange.image}
                alt="productImage"
                className="rounded mb-2 md:h-[70%] w-full h-full"
              />
            </div>

            <div className="flex flex-col md:w-[45%] w-full md:m-0 rounded gap-2">
              <div>
                <span className="font-bold">Department:</span>
                <div className="w-full rounded-sm px-2 mb-2 border-black border-2">
                  {requestedChange.department}
                </div>
              </div>
              <div>
                <span className="font-bold">Productname:</span>
                <div className="rounded border-black border-2">
                  {requestedChange.productName}
                </div>
              </div>

              <div>
                <span className="font-bold">Price:</span>
                <div className="border-black border-2">
                  {requestedChange.price}
                </div>
              </div>

              <div>
                <span className="font-bold">ProductDescription:</span>
                <div className="border-black border-2">
                  {requestedChange.productDescription}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center pb-5 gap-5 mt-20 md:mt-5">
        <button
          className="bg-yellow-500 md:w-[10vw] w-[70%] py-2 px-5  rounded-lg font-bold cursor-pointer"
          onClick={(e) => {
            handleSumbit(true);
          }}
        >
          Approve
        </button>

        <button
          className="bg-yellow-500 md:w-[10vw] w-[70%] py-2 px-5  rounded-lg font-bold cursor-pointer"
          onClick={(e) => {
            handleSumbit(false);
          }}
        >
          Reject
        </button>
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

export default PendingRequestDetails;
