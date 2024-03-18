import {
  BrowserRouter as Router,
  Route,
  Routes,
  redirect,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { verifyUserJWT } from "./apis/auth";
import { AuthContext } from "./components/context/authContext";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import MySumbission from "./pages/MySumbission";
import PendingRequests from "./pages/PendingRequests";
import PendingRequestDetails from "./pages/PendingRequestDetails";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [userType, setUserType] = useState();

  useEffect(() => {
    async function apiCall() {
      const data = await verifyUserJWT();
      if (data.status === "SUCCESS") {
        setIsLogin(true);
        setUserType(data.admin ? "admin" : "teamMember");
      }
    }
    apiCall();
  }, [isLogin, userType]);

  return (
    <div className="w-screen min-h-screen bg-gray-200">
      <Router>
        <AuthContext.Provider
          value={{ isLogin, setIsLogin, userType, setUserType }}
        >
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/:usertype" element={<Dashboard />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/mySubmission" element={<MySumbission />} />
            <Route path="/pendingRequests" element={<PendingRequests />} />
            <Route
              path="/pendingRequests/:id"
              element={<PendingRequestDetails />}
            />
          </Routes>
        </AuthContext.Provider>
      </Router>
    </div>
  );
};

export default App;
