import React, { useState, useContext } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/profileIcon.svg";
import { AuthContext } from "./context/authContext";

const Header = () => {
  const { isLogin, setIsLogin } = useContext(AuthContext);
  const redirect = useNavigate();
  const [toggle, setToggle] = useState(false);

  return (
    <div className="w-screen h-[10vh] bg-yellow-300 px-5 flex items-center gap-5 justify-between">
      <img
        src={logo}
        alt="websiteLogo"
        className="h-[60%] cursor-pointer"
        onClick={() => {
          redirect("/");
        }}
      />
      {isLogin && (
        <div className="flex gap-2">
          <img
            src={profileIcon}
            alt="profileIcon"
            className="h-[5vh] cursor-pointer"
            onClick={() => {
              setToggle((prev) => !prev);
            }}
          />
          <div
            className={`${
              toggle ? "flex" : "hidden"
            } absolute top-[10vh] right-0 bg-yellow-300 flex-col w-[30vw] md:w-[15vw] gap-1 p-2 z-10`}
          >
            <button
              className="font-bold cursor-pointer text-lg bg-yellow-500 rounded-lg text-center"
              onClick={() => {
                redirect("/profile");
              }}
            >
              My Profile
            </button>
            <button
              className="font-bold cursor-pointer text-lg bg-yellow-500 rounded-lg text-center"
              onClick={() => {
                setIsLogin(false);
                localStorage.removeItem("plyPickerToken");
                redirect("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
