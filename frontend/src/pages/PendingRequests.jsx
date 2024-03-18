import { useEffect, useState, useContext } from "react";
import { allRequests } from "../apis/product";
import { useNavigate } from "react-router-dom";

const PendingRequests = () => {
  const [products, setProducts] = useState([]);
  const redirect = useNavigate();

  useEffect(() => {
    async function apiCall() {
      const result = await allRequests();
      const pendingRequests = result.productReview.filter((item) => {
        return item.status === "pending";
      });
      setProducts(pendingRequests);
    }
    apiCall();
  }, []);

  return (
    <div className="flex p-5 flex-wrap gap-5 justify-evenly">
      {products.map((item, index) => {
        return (
          <div
            className="block rounded-lg bg-white w-[45%] md:w-[20%] cursor-pointer"
            key={index}
            onClick={() => {
              redirect(`/pendingRequests/${item._id}`);
            }}
          >
            <div className="relative overflow-hidden bg-cover bg-no-repeat h-[30vh]">
              <img
                className="rounded-lg sm:m-h-64 md:h-[100%] w-full"
                src={item.image}
                alt="prodcutImage"
              />
            </div>
            <div className="p-2">
              <div className="flex justify-between">
                <h5 className="mb-2 text-xl font-bold leading-tight text-neutral-800 ">
                  {item.department}
                </h5>
              </div>
              <p className="mb-1 text-neutral-600 text-sm">
                {item.productName}
              </p>
              <h5 className="mb-2 text-sm font-semibold leading-tight text-neutral-800 ">
                Price: ₹ {item.price}
              </h5>
            </div>
            <div className="text-center w-[100%] h-[5vh] font-bold text-lg uppercase rounded-sm bg-yellow-600">
              {item.status}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PendingRequests;
