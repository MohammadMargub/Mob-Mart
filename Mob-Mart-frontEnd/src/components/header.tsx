import React, { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  const user = { _id: "gss", role: "admin" };
  const [isopen, setIsopen] = useState<boolean>(false);

  const logoutHandler = () => {
    setIsopen(false);
  };

  return (
    <nav className="header">
      <Link onClick={() => setIsopen(false)} to={"/"}>
        Home{" "}
      </Link>
      <Link onClick={() => setIsopen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link onClick={() => setIsopen(false)} to={"/cart"}>
        <FaShoppingBag />
      </Link>

      {user?._id ? (
        <>
          <button onClick={() => setIsopen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isopen}>
            <div>
              {user.role === "admin" && (
                <Link onClick={() => setIsopen(false)} to="/admin/dashboard">
                  Admin
                </Link>
              )}
              <Link onClick={() => setIsopen(false)} to="/orders">
                Orders
              </Link>
              <button onClick={() => logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
