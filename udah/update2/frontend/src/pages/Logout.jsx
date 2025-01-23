import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { clearUser } from "../store/userSlice"; // Import clearUser action

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get the dispatch function

  useEffect(() => {
    // Clear user data from Redux store
    dispatch(clearUser());

    // Redirect to Login page
    navigate("/login");
  }, [navigate, dispatch]);

  return null;
};

export default Logout;
