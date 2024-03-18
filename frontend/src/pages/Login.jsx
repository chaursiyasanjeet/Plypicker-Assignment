import { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login } from "../apis/auth";
import { AuthContext } from "../components/context/authContext";

const Login = () => {
  const { isLogin, setIsLogin, userType, setUserType } =
    useContext(AuthContext);

  const redirect = useNavigate();

  // if (isLogin) {
  //   redirect(`/dashboard/${userType}`);
  // }
  useEffect(() => {
    if (isLogin) {
      redirect(`/dashboard/${userType}`);
    }
  }, []);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [submitButton, setSubmitButton] = useState(false);

  const validateForm = (email, password) => {
    let error = false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter valid email");
      error = true;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      toast.error(
        "Password should contain at least one uppercase, one lowercase, one number, and one special character"
      );
      error = true;
    }

    return !error;
  };

  const handleSumbit = async (e) => {
    setSubmitButton(true);
    e.preventDefault();
    const validate = validateForm(user.email, user.password);

    if (validate) {
      const result = await login(user.email, user.password);
      if (result.status === "SUCCESS") {
        toast.success(result.message);
        localStorage.setItem("plyPickerToken", result.jwtToken);
        setTimeout(() => {
          const user = result.admin ? "admin" : "teamMember";
          setUserType(user);
          setIsLogin(true);
          redirect(`/dashboard/${user}`);
        }, 2000);
      } else {
        toast.error(result.message);
      }
    }
    setSubmitButton(false);
  };

  return (
    <>
      <div className="min-h-[90vh] flex flex-col bg-gray-200">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2 ">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full border-4 ">
            <h1 className="mb-4 text-3xl text-center">Welcome Back !!</h1>
            <input
              type="text"
              className="block border-2 border-grey-light w-full p-3 rounded mb-2"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
              }}
            />
            <input
              type="password"
              className="block border-2 border-grey-light w-full p-3 rounded mb-4"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />
            <button
              type="submit"
              disabled={submitButton}
              className="block bg-violet-950 text-white text-xl border-2 border-black w-full p-3 rounded mb-1"
              onClick={handleSumbit}
            >
              Log In
            </button>
          </div>
          <div className="text-grey-dark mt-1">
            Don't have an account??{" "}
            <a
              className="no-underline text-blue-600 border-b border-blue"
              href="../register"
            >
              Register here
            </a>
            .
          </div>
        </div>
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

export default Login;
