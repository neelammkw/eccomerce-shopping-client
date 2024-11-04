import React, { useState, useEffect, useContext , useCallback } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData ,removeMyListItem} from "../../utils/api";
import {  useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const history = useNavigate();
  const { user, setCartProductData, setCartFields } = useContext(MyContext);
  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    streetAddressLine1: "",
    streetAddressLine2: "",
    phoneNumber: "",
    emailaddress: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    freeDelivery: false,
    createAccount: false,
    shipToDifferentAddress: false,
    orderNotes: "",
    shippingMethod: "flat_rate",
    paymentMethod: "",
    userId: "",
    totalAmount: "",
  });
  const [cartData, setCartData] = useState([]);
const calculateTotalAmount = useCallback(() => {
    let total = cartData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    total += formFields.shippingMethod === "flat_rate" ? 5 : 0;
    return total;
  }, [cartData, formFields.shippingMethod]);


  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (user && user.userId) {
          const res = await fetchDataFromApi(`/api/cart/${user.userId}`);
          setCartData(res || []); // Ensure cartData is always an array
        }
      } catch (error) {
        console.error("Error fetching cart data", error);
      }
    };

    fetchCartData();
  }, [user]);

const clearCart = async () => {
  try {
    const response = await removeMyListItem(`/api/cart/${user.userId}`);
    if (response) {
      setCartProductData([]); // Clear the cart in the state
      setCartData([]); 
      setCartFields([]);       // Clear cartData used for the checkout page
      toast.success("Cart cleared successfully!");
    } else {
      toast.error("Failed to clear cart.");
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    toast.error("Error clearing cart.");
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleCheckboxChange = (e) => {
  //   const { name, checked } = e.target;
  //   setFormFields((prev) => ({
  //     ...prev,
  //     [name]: checked,
  //   }));
  // };
useEffect(() => {
  if (user && user.userId) {
    setFormFields(prev => ({
      ...prev,
      userId: user.userId,
      totalAmount: calculateTotalAmount()
    }));
  }
}, [user, cartData, calculateTotalAmount]);

  // const handleRadioChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormFields((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
      if (
    !formFields.firstName ||
    !formFields.lastName ||
    !formFields.streetAddressLine1 ||
    !formFields.city ||
    !formFields.state ||
    !formFields.country ||
    !formFields.pincode ||
    !formFields.phoneNumber ||
    !formFields.emailaddress
  ) {
    alert("Please fill out all required fields.");
    return;
  }


    try {
      const response = await postData("/api/order/createOrder", {
        amount: calculateTotalAmount(),
        currency: "INR",
      });
      if (!response) {
        throw new Error("Failed to create Razorpay order");
      }


      if (!window.Razorpay) {
        alert("Razorpay SDK is not loaded. Please try again later.");
        return;
      }

      const options = {
        key: "rzp_test_lB0ridajf6SZMy",
        key_secret: "unyNcWMOu5Lbhl5CWExl6gF3",
        amount: response.data.order.amount,
        currency: "INR",
        name: "E-Bharat",
        description: "Thank you for your order",
        order_id: response.data.order.id,

        handler: async (response) => {
          const paymentData = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            formFields: {
            ...formFields,
            paymentMethod: "Razorpay",  // Set payment method here
          },

            cartData,
          };
          const orderResponse = await postData(
            `/api/order/postOrderData`,
            paymentData
          );

          if (orderResponse) {
            toast.success("Payment successful! Your order has been placed.");
            clearCart(); 

            history(`/order/${orderResponse.data.order._id}`);
          } else {
            toast.error("Payment failed! Please try again.");
          }

        },
        prefill: {
          name: `${formFields.firstName} ${formFields.lastName}`,
          email: formFields.emailaddress,
          contact: formFields.phoneNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment process", error);
      toast.error("Payment initiation failed! Please try again.");

    }
  };

  const cartTotal = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCharge = formFields.shippingMethod === "flat_rate" ? 5 : 0;
  const cartSubtotal = cartTotal + shippingCharge;

  return (
    <Grid container spacing={2} style={{ marginBottom: "40px" }}>
      <Grid item xs={12} md={7} style={{ marginLeft: "32px" }}>
        <Paper
          elevation={3}
          style={{ padding: "15px", marginTop: "20px", marginLeft: "50px" }}
        >
          <Typography variant="h6" gutterBottom>
            Billing Details
          </Typography>
          <Divider />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} style={{ marginTop: "20px" }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="First Name"
                  name="firstName"
                  value={formFields.firstName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Last Name"
                  name="lastName"
                  value={formFields.lastName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Street Address Line 1"
                  name="streetAddressLine1"
                  value={formFields.streetAddressLine1}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Street Address Line 2"
                  name="streetAddressLine2"
                  value={formFields.streetAddressLine2}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="City"
                  name="city"
                  value={formFields.city}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="State"
                  name="state"
                  value={formFields.state}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Country"
                  name="country"
                  value={formFields.country}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Pincode"
                  name="pincode"
                  value={formFields.pincode}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Phone Number"
                  name="phoneNumber"
                  value={formFields.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Email Address"
                  name="emailaddress"
                  value={formFields.emailaddress}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <div className="textfields">
            <TextField
            
              label="Order Notes"
              name="orderNotes"
              value={formFields.orderNotes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            /></div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginTop: "20px" }}
              disabled={!user || cartData.length === 0}
            >
              Place Order
            </Button>
          </form>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: "15px", marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Your Order
          </Typography>
          <Divider />
          {cartData.length === 0 ? (
            <Typography variant="body1" gutterBottom>
              Your cart is empty.
            </Typography>
          ) : (
            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              {cartData.map((item) => (
                <Grid item xs={12} key={item._id}>
                  <Typography variant="body1">
                    {item.productName} x {item.quantity}{" "}
                    <span style={{ float: "right" }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </Typography>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Divider />
                <Typography variant="body1">
                  Shipping
                  <span style={{ float: "right" }}>
                    ₹{formFields.shippingMethod === "flat_rate" ? 5 : 0}
                  </span>
                </Typography>
                <Divider />
                <Typography variant="h6" style={{ marginTop: "10px" }}>
                  Total{" "}
                  <span style={{ float: "right" }}>
                    ₹{cartSubtotal.toFixed(2)}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Checkout;
