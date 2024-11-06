import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Listing from "./Pages/Listing";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import SignIn from "./Pages/SignIn";
import ScrollToTop from "./Components/ScrollToTop";
import SignUp from "./Pages/SignUp";
import Header from "./Components/Header";
import MyList from "./Pages/MyList";
import Search from "./Pages/Search";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import MyAccount from "./Pages/MyAccount";
import OrderDetails from "./Pages/OrderDetails";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Components/Footer";
import ProductModal from "./Components/ProductModal";
import { postCartData, fetchDataFromApi } from "./utils/api"; // Ensure this import is correct
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyContext = createContext();

function App() {
  const [open, setOpen] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [productForModal, setProductForModal] = useState(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cartFields, setCartFields] = useState([]);
  const [cartProductData, setCartProductData] = useState([]);
  const [myList, setMyList] = useState([]);
  useEffect(() => {
    getCountryList("https://countriesnow.space/api/v0.1/countries/");
  }, []);
  useEffect(() => {
    if (isLogin) {
      setIsHeaderFooterShow(true);
    }
  }, [isLogin]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    } else {
      setIsLogin(false);
    }
  }, []);

  const getCountryList = async (url) => {
    try {
      const response = await axios.get(url);
      setCountryList(response.data.data);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const addToCart = async (data) => {
    if (!user) {
    // Show a message prompting the user to log in
    toast.error("Login to add product to cart.");
    return;
  }

    try {
      const response = await postCartData("/api/cart/add", data);

      if (response.status === 201) {
        setCartFields((prevCartFields) => [...prevCartFields, response.data]);
        toast.success("Product added to cart successfully!");
      } else if (response.status === 400) {
        // Handle already added product case
        toast.error(response.data.message || "Product is already in the cart.");
        setCartFields([...response.data]);
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error adding product to cart."
      );
    }

    // window.location.reload();
  };
  useEffect(() => {
    const fetchMyListData = async () => {
      if (user?.userId) {
        try {
          const response = await fetchDataFromApi(
            `/api/my-list/${user?.userId}`
          );
          if (response.status === 200) {
            setMyList(response.data); // Store the wishlist data in state
            localStorage.setItem("myList", JSON.stringify(response.data));
          }
        } catch (error) {
          console.error("Failed to fetch my list data:", error);
        }
      }
    };

    fetchMyListData(); // Fetch the list data when the user is logged in
  }, [user]);
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await fetchDataFromApi(`/api/cart/${user.userId}`);
        setCartProductData(cartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user?.userId) {
      fetchCartData();
    }
  }, [user?.userId]);

  const values = {
    countryList,
    selectedCountry,
    setSelectedCountry,
    open,
    setOpen,
    isHeaderFooterShow,
    setIsHeaderFooterShow,
    isLogin,
    setIsLogin,
    productForModal,
    setProductForModal,
    user,
    setUser,
    addToCart,
    cartFields,
    setCartFields,
    myList,
    setMyList,
    cartProductData,
    setCartProductData,
  };

  return (
    <BrowserRouter>
      <ScrollToTop />  
      <MyContext.Provider value={values}>
        {isHeaderFooterShow && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subcat/:subcat" element={<Listing />} />
          <Route path="/category/:catName" element={<Listing />} />
          <Route path="/viewall" element={<Listing />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/review" element={<ProductDetails />} />
          <Route path="/cart/:userId" element={<Cart />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/orders/:userId" element={<Orders />} />
          <Route path="/search" element={<Search />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/my-account/:userId" element={<MyAccount />} />
        </Routes>
        {isHeaderFooterShow && <Footer />}
        {open && productForModal && (
          <ProductModal
            open={open}
            onClose={() => setOpen(false)}
            product={productForModal}
          />
        )}
        <ToastContainer />
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
