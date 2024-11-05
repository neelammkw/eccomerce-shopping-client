import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { IoBagOutline } from "react-icons/io5";
import { FaClipboardCheck, FaHeart } from "react-icons/fa";
import { BsCurrencyRupee } from "react-icons/bs";
import Logo from "../../assets/images/download.png";
import CountryDropdown from "../CountryDropdown";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

const Header = () => {
  const { cartFields = [], user, setIsLogin, setUser, setCartFields, setMyList,setCartProductData } = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const context = useContext(MyContext);

  const fetchCartData = useCallback(async () => {
    if (user?.userId) {
      try {
        const cartData = await fetchDataFromApi(`/api/cart/${user.userId}`);
        setCartFields(cartData);
        setCartProductData(cartData);
        const total = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
        setCartTotal(total);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
  }, [user, setCartFields, setCartProductData]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  useEffect(() => {
    if (Array.isArray(cartFields)) {
      const total = cartFields.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
      setCartTotal(total);
    } else {
      setCartTotal(0);
    }
  }, [cartFields]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
  localStorage.clear();
  setIsLogin(false);
  setUser(null);
  setCartFields([]); // Clear cart
  setMyList([]); // Clear wishlist
  setAnchorEl(null);
  navigate("/");
};


  const goToCart = () => {
  const userId = user?.userId;
  if (userId) {
    navigate(`/cart/${userId}`);
  } else {
    navigate("/sign-in");
  }
};

  return (
    <div className="container">
      <div className="header">
        <div className="row">
          <div className="mr-3 logoWrapper d-flex align-items-center">
            <Link to="/">
              <img src={Logo} alt="logo" className="logo" />
            </Link>
          </div>
          <div className="col-sm-9 d-flex align-items-center part2">
            {context.countryList.length !== 0 && <CountryDropdown />}

            <SearchBox />
            <div className="part3 d-flex align-items-center ml-auto">
              {!user ? (
                <Link to="/sign-in">
                  <Button className="btn-blue btn-big btn-lg mr-2 btn-round">
                    Sign In
                  </Button>
                </Link>
              ) : (
                <>
                  <Button className="myAcc d-flex align-items-center" onClick={handleClick}>
                    <div className="userImg">
                      <span className="rounded-circle"><img
                  src={`https://ecommerce-shopping-server.onrender.com/uploads/${user.profilePhoto}`}
                  alt="avatar"
                /></span>
                    </div>
                    <div className="userInfo">
                      <h6 className="mb-0">{user.name}</h6>
                      <p className="mb-0">{user.email}</p>
                    </div>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Link to="/my-account">
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <PersonAdd />
                        </ListItemIcon>
                        My Account
                      </MenuItem>
                    </Link>
                    <Link to={`/orders/${user.userId}`}>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <FaClipboardCheck />
                        </ListItemIcon>
                        My Orders
                      </MenuItem>
                    </Link>
                    <Link to="/my-list">
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <FaHeart />
                        </ListItemIcon>
                        My WishList
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={logout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}

              <div className="ml-auto cartTab d-flex align-items-center mt-0">
                <BsCurrencyRupee />
                <div className="price">{cartTotal}</div>
                <div className="position-relative ml-2">
                  <Button className="btnuser -mt-2" onClick={goToCart}>
                    <IoBagOutline />
                  </Button>
                  <span className="d-flex count align-items-center justify-content-center">
                    {cartFields.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Header;
