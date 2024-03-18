import { useEffect, useState, useContext } from "react";
import { getProducts } from "../apis/product";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/authContext";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const redirect = useNavigate();
  const { isLogin } = useContext(AuthContext);

  useEffect(() => {
    async function apiCall() {
      const result = await getProducts();
      setProducts(result.product);
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
              redirect(`/product/${item._id}`);
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
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
