import React, { useEffect, useContext, useState } from "react";
import { MyContext } from "../../App";
import Logo from "../../assets/images/download.png";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import google from "../../assets/images/g-plus.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../utils/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setIsHeaderFooterShow(false);
  }, [context]);

  const validate = () => {
    let errors = {};

    if (!formFields.email) {
      errors.email = "Email is required";
      toast.error("Email is required");
    }
    if (!formFields.password) {
      errors.password = "Password is required";
      toast.error("Password is required");
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  const signInWithGoogle = async (e) => {
    e.preventDefault(); 
    setGoogleLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the Google ID token from Firebase
      const idToken = await user.getIdToken();
      
      // Send the Google ID token to your backend
      const response = await postData("/api/user/authWithGoogle", {
        token: idToken
      });

      // Check if response is successful
      if (response.status === 200) {
        const { token: jwtToken, user: apiUser } = response;

        localStorage.setItem("token", jwtToken);

        const userData = {
          name: apiUser.name,
          email: apiUser.email,
          userId: apiUser._id,
          profilePhoto: apiUser.profilePhoto,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        context.setUser(userData);
        context.setIsLogin(true);
        toast.success("Logged in successfully with Google!");
        navigate("/");
      } else {
        toast.error(response.message || "Google sign-in failed.");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      // More specific error handling
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Google authentication failed");
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.info("Google sign-in was cancelled");
      } else {
        toast.error("An error occurred during Google sign-in. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const response = await postData("/api/user/login", formFields);
      if (response && response.status === 200) {
        const { token, user } = response;
        const userdata = {
          name: user.name,
          email: user.email,
          userId: user._id,
          profilePhoto: user.profilePhoto,
        };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userdata));
        context.setUser(userdata);
        context.setIsLogin(true);
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        toast.error(
          response.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Login failed");
      } else {
        toast.error("An error occurred during login. Please try again later.");
      }
    }
  };

  return (
    <section className="section signInPage">
      <div className="shape-bottom">
        <svg
          fill="#fff"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 1921 819.8"
          style={{ enableBackground: "new 0 0 1921 819.8" }}
          xmlSpace="preserve"
        >
          <path
            className="st0"
            d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6
              c107.6,57,212.1,40.7,245.7,34.4c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
          />
        </svg>
      </div>
      <div className="container">
        <div className="sign-full-box d-flex align-items-center justify-content-center flex-column">
          <div
            className="d-flex align-items-center mt-2"
            style={{ position: "relative", zIndex: 1000000 }}
          >
            <Link to="/">
              <img src={Logo} alt="logo" className="logo" />
            </Link>
          </div>
          <div className="sign-form-parent">
            <div className="container full padding0">
              <h2 className="text-b mt-0 mb-0">Sign In</h2>
              <br />
              <form
                className="form"
                id="signinform"
                name="sign-in"
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <TextField
                    id="email"
                    label="Email"
                    required
                    type="email"
                    variant="standard"
                    className="pb-3 w-100"
                    name="email"
                    value={formFields.email}
                    onChange={handleChange}
                  />
                  <br />
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    required
                    className="w-100"
                    variant="standard"
                    name="password"
                    value={formFields.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
                <div className="forgot-pass">
                  <Link to="/forgot-password" className="border-effect">
                    Forgot password?
                  </Link>
                </div>
                <br />
                <div className="text-center d-flex align-items-center">
                  <div className="col-md-6">
                    <Button
                      type="submit"
                      className="btn btn-blue btn-lg w-100 mt-0 mt-1"
                    >
                      Sign In
                    </Button>
                  </div>
                  <div className="col-md-6">
                    <Link to="/">
                      <Button
                        className="btn-cl btn-big col ml-3"
                        variant="outlined"
                        onClick={() => context.setIsHeaderFooterShow(true)}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="already-login-strip col-md-12 res-padding0 res-text-center pl-0 mt-2">
                  <span>
                    Not Registered?{" "}
                    <Link to="/sign-up" className="border-effect">
                      Sign Up
                    </Link>
                  </span>
                </div>
              </form>
              <br />
              <h5 className="text-center">Or continue with social account</h5>
              <br />
              <div className="d-flex align-items-center justify-content-center socialimg">
                <Button
                  className="cursor rounded-circle d-flex align-items-center justify-content-center"
                  rel="noopener noreferrer"
                  onClick={signInWithGoogle}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <div className="spinner-border spinner-border-sm text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <img src={google} alt="Google Sign In" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default SignIn;