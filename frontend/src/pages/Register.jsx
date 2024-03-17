import { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { register } from "../apis/auth";
import { AuthContext } from "../components/context/authContext";

const Singup = () => {
  const redirect = useNavigate();
  const { isLogin, userType } = useContext(AuthContext);

  useEffect(() => {
    if (isLogin) {
      redirect(`/dashboard/${userType}`);
    }
  }, []);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    admin: null,
  });

  const [submitButton, setSubmitButton] = useState(false);

  const validateForm = (name, email, password, admin) => {
    let error = false;

    if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(name) || name === "") {
      toast.error("Invalid Name");
      error = true;
    }
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

    if (!admin) {
      toast.error("Select your role");
      error = true;
    }

    return !error;
  };

  const handleSumbit = async (e) => {
    setSubmitButton(true);
    e.preventDefault();
    const validate = validateForm(
      user.name,
      user.email,
      user.password,
      user.admin
    );

    console.log("hhhh");
    if (validate) {
      user.admin = user.admin === "admin" ? true : false;
      const result = await register(
        user.name,
        user.email,
        user.password,
        user.admin
      );
      if (result.status === "SUCCESS") {
        toast.success(result.message);
        setTimeout(() => {
          redirect("/");
        }, 2000);
      } else {
        toast.error(result.message);
      }
    }
    setSubmitButton(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-200">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2 ">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full border-4 ">
            <h1 className="mb-4 text-3xl text-center">Create Account</h1>
            <input
              type="text"
              className="block border-2 border-grey-light w-full p-3 rounded mb-2"
              name="fullname"
              placeholder="Full Name"
              value={user.name}
              onChange={(e) => {
                setUser({ ...user, name: e.target.value });
              }}
            />
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
            <div className="flex justify-center items-center w-full gap-5 mb-4">
              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  checked={user.admin === "admin"}
                  onChange={(e) => setUser({ ...user, admin: e.target.value })}
                  className="cursor-pointer"
                />
                <label htmlFor="admin" className="text-xl font-semibold">
                  Admin
                </label>
              </div>
              <div className="flex">
                <input
                  type="radio"
                  id="teamMember"
                  name="role"
                  value="team member"
                  checked={user.admin === "team member"}
                  onChange={(e) => setUser({ ...user, admin: e.target.value })}
                  className="cursor-pointer"
                />
                <label htmlFor="teamMember" className="text-xl font-semibold">
                  Team Member
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitButton}
              className="block bg-violet-950 text-white text-xl border-2 border-black w-full p-3 rounded mb-1"
              onClick={handleSumbit}
            >
              Create Account
            </button>

            <div className="text-center text-sm text-grey-dark mt-4">
              By signing up, you agree to the
              <a
                className="no-underline border-b border-grey-dark text-grey-dark"
                href="#"
              >
                Terms of Service
              </a>
              and
              <a
                className="no-underline border-b border-grey-dark text-grey-dark"
                href="#"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <div className="text-grey-dark mt-1">
            Already have an account?{" "}
            <a
              className="no-underline text-blue-600 border-b border-blue"
              href="../"
            >
              Log in
            </a>
            .
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
      </div>
    </>
  );
};

export default Singup;
