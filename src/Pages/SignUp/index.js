import React, { useEffect, useState, useContext } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/download.png";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import google from "../../assets/images/g-plus.png";
import fb from "../../assets/images/fb.png";
import { ToastContainer, toast } from "react-toastify";
import { postData } from "../../utils/api";
import { useNavigate } from 'react-router-dom'; 
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    context.setIsHeaderFooterShow(false);
  }, [context]);

  // State for form fields
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false
  });

  // State for errors
  const [errors, setErrors] = useState({});

  // Handle form field changes
  const handleChange = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  // Validate form fields
  const validate = () => {
    const errors = {};
    if (!formFields.name) errors.name = "Name is required";
    if (!formFields.email) errors.email = "Email is required";
    if (!formFields.phone) errors.phone = "Phone number is required";
    if (!formFields.password) errors.password = "Password is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validate()) {
    return;
  }

  setLoading(true); // Show loader

  try {
    const response = await postData("/api/user/sign-up", formFields);

    // Check the status code and handle accordingly
    if (response.status === 201) {
      toast.success("User added successfully!");
      setTimeout(() => {
        navigate("/sign-in");
      }, 1500);

    } else if (response.status === 409) { // Assuming 409 for conflict
      toast.error("User with this email or phone number already exists");
    } else {
      toast.error("An error occurred during registration");
    }
  } catch (error) {
    if (error.response && error.response.data) {
      const backendErrors = error.response.data.message;
      toast.error(backendErrors || "An error occurred during registration");
    } else {
      toast.error("Something went wrong. Please try again later.");
    }
  } finally {
    setLoading(false); // Hide loader
  }
};

  return (
    <>
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
        <div className="containerform">
          <div className="signup-full-box d-flex align-items-center justify-content-center flex-column">
            <div
              className="d-flex align-items-center mt-2"
              style={{ position: "relative", zIndex: 1000 }}
            >
              <Link to="/">
                <img src={Logo} alt="logo" className="logo" />
              </Link>
            </div>
            <div className="sign-form-parent">
              <div className="container full padding0">
                <h2 className="text-b mt-0 mb-0">Sign Up</h2>
                <form
                  className="signupform"
                  id="signupform"
                  name="sign-up"
                  onSubmit={handleSubmit}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          id="name"
                          name="name"
                          label="Name"
                          required
                          type="text"
                          variant="standard"
                          className="w-100"
                          value={formFields.name}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          id="phone"
                          name="phone"
                          label="Phone No"
                          required
                          type="number"
                          variant="standard"
                          className="w-100"
                          value={formFields.phone}
                          onChange={handleChange}
                          error={!!errors.phone}
                          helperText={errors.phone}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <TextField
                      id="email"
                      name="email"
                      label="Email"
                      required
                      type="email"
                      variant="standard"
                      className="pb-3 w-100"
                      value={formFields.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                    <TextField
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      required
                      className="w-100"
                      variant="standard"
                      value={formFields.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </div>
                  <div className="text-center d-flex align-items-center">
                    <div className="col-md-6">
                      <Button
                        type="submit"
                        className="btn btn-blue btn-lg w-100 mt-0 mt-1" disabled={loading===true ? true: false}
                      >{loading ? <CircularProgress size={24} /> : "Sign Up"} {/* Conditionally show loader */}
                        
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
                      Already Registered?{" "}
                      <Link to="/sign-in" className="border-effect">
                        Sign In
                      </Link>
                    </span>
                  </div>
                </form>
              
              </div>
            </div>
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
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default SignUp;
