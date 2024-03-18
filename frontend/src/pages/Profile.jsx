import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/context/authContext";
import { allRequests } from "../apis/product";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const redirect = useNavigate();
  const { userType } = useContext(AuthContext);
  const [fetchedDetails, setFetchedDetails] = useState(null);
  useEffect(() => {
    async function fetchAllRequest() {
      const result = await allRequests();
      setFetchedDetails(result);
    }
    fetchAllRequest();
  }, []);
  return (
    <div className="flex flex-col px-10 mt-5 w-full items-center">
      {userType && fetchedDetails && (
        <>
          <h1 className="text-3xl font-bold underline">Profile Details</h1>
          <div className="mt-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase text-lg">name:</span>
                <span className="text-blue-800 font-semibold">
                  {" "}
                  {fetchedDetails.userDetails.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase text-lg">email:</span>
                <span className="text-blue-800 font-semibold">
                  {fetchedDetails.userDetails.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase text-lg">role:</span>
                <span className="text-blue-800 font-semibold">{userType}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase text-lg">
                  Total requests:
                </span>
                <span className="text-blue-800 font-semibold">
                  {fetchedDetails.productReview.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase text-lg">
                  Pending requests:
                </span>
                <span className="text-blue-800 font-semibold">
                  {
                    fetchedDetails.productReview.filter((item) => {
                      return item.status === "pending";
                    }).length
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase text-lg">
                  Approved requests:
                </span>
                <span className="text-blue-800 font-semibold">
                  {
                    fetchedDetails.productReview.filter((item) => {
                      return item.status === "approved";
                    }).length
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase text-lg">
                  Rejected requests:
                </span>
                <span className="text-blue-800 font-semibold">
                  {
                    fetchedDetails.productReview.filter((item) => {
                      return item.status === "rejected";
                    }).length
                  }
                </span>
              </div>
              {userType === "admin" ? (
                <button
                  className="bg-yellow-400 rounded-lg py-2 text-xl mt-5 font-bold cursor-pointer"
                  onClick={() => {
                    redirect("/pendingRequests");
                  }}
                >
                  Pending Requests
                </button>
              ) : (
                <button
                  className="bg-yellow-400 rounded-lg py-2 text-xl mt-5 font-bold cursor-pointer"
                  onClick={() => {
                    redirect("/profile/mySubmission");
                  }}
                >
                  My Submission
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
