import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase/firebase";
import { getUser, useLoginMutation } from "../redux/api/userAPI";
import { useDispatch } from "react-redux";
import { userExist } from "../redux/reducer/userReducer";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user);
      } else {
        console.log("Not Logged In");
      }
    });
  }, []);

  const loginHandler = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      console.log("39 Login FILE ", user);

      // Attempt to log in via your API
      const res = await login({
        _id: user.uid,
        name: user.displayName!,
        email: user.email!,
        gender,
        role: "user",
        photo: user.photoURL!,
        dob: date,
      });

      console.log("Login API Response:", res);

      if ("data" in res && res.data) {
        console.log("User data being dispatched to Redux:", res.data.user);

        dispatch(userExist(res.data.user));
        toast.success("Sign in Successful!");
        navigate("/");
      } else {
        const userDetails = await getUser(user.uid);
        if (userDetails) {
          console.log("Login API failed, fetching user details manually...");
          dispatch(userExist(userDetails));

          toast.success("Sign in Successful!");
          navigate("/");
        } else {
          toast.error("Failed to fetch user details.");
        }
      }
    } catch (error) {
      console.error("Sign in Error:", error);
      toast.error("Sign in Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>
        <div>
          <label htmlFor="gender">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="DOB">Date of birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle />
            Sign in with Google
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
