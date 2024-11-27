import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userLogout } from "../redux/reducer/userReducer";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isopen, setIsopen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(userLogout());
    navigate("/login");
  };

  const logoutHandler = async () => {
    try {
      setIsopen(false);
      signOut(auth);
      toast.success(`Sign Out Successfully`);
    } catch (error) {
      toast.error(`Sign Out Failed`);
    }
  };

  return (
    <nav className="header">
      <Link onClick={() => setIsopen(false)} to={"/"}>
        Home
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
                <FaSignOutAlt onClick={logout} />
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
