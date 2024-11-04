import React, { useEffect, useState, useContext } from "react";
import HomeBanner from "../../Components/HomeBanner";
import banner1 from "../../assets/images/banner-box.jpg";
import banner2 from "../../assets/images/banner-04.jpg";
import Button from "@mui/material/Button";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import coupon from "../../assets/images/coupon.png";
import { IoMailOutline } from "react-icons/io5";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [catData, setCatData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [fashionProducts, setFashionProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const context = useContext(MyContext);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleViewAll = () => {
    navigate("/viewall"); // Navigate to the /viewall route
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchDataFromApi("/api/categories");
        setCatData(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const data = await fetchDataFromApi("/api/products/featured");
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const data = await fetchDataFromApi("/api/products");
        setAllProducts(data);
        setNewProducts(data.slice(0, 8));
        setFashionProducts(
          data.filter((product) => product.category === "Fashion").slice(0, 4)
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategories();
    fetchFeaturedProducts();
    fetchAllProducts();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    context.setIsHeaderFooterShow(true);
  }, [context]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === "All") {
      setNewProducts(allProducts.slice(0, 8));
    } else {
      setNewProducts(
        allProducts
          .filter((product) => product.category === newValue)
          .slice(0, 8)
      );
    }
  };

  return (
    <>
      <HomeBanner />
      {catData?.length !== 0 && <HomeCat catData={catData} />}

      <section className="homeProducts">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="banner">
                <img src={banner1} alt="shop" className="cursor w-100 mb-3" />
              </div>
              <div className="banner">
                <img src={banner2} alt="shop" className="cursor w-100" />
              </div>
              <div className="banner">
                <img
                  src="https://klbtheme.com/bacola/wp-content/uploads/2021/08/bacola-banner-16.jpg"
                  alt="shop"
                  className="cursor w-100"
                />
              </div>
            </div>
            <div className="col-md-9">
              <div className="productRow mt-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="info">
                    <h3 className="mb-0 hd">FEATURED PRODUCTS</h3>
                    <p className="text mb-0">
                      Do not miss the current offers until the end.
                    </p>
                  </div>
                  <Button className="viewallbtn ml-auto"  onClick={handleViewAll}>
                    View All
                    <IoIosArrowRoundForward />
                  </Button>
                </div>
                <div className="product_row w-100">
                  {featuredProducts?.length !== 0 ? (
                    <Swiper
                      slidesPerView={4}
                      pagination={{ clickable: true }}
                      modules={[Navigation, Pagination]}
                      navigation={true}
                      className="mySwiper"
                    >
                      {featuredProducts?.map((product, index) => (
                        <SwiperSlide key={index}>
                          <ProductItem product={product} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <span>No products available</span>
                  )}
                </div>
              </div>
              <div className="productRow mt-5">
                <div className="d-flex align-items-center mb-3">
                  <div className="info w-75">
                    <h3 className="mb-0 hd ">NEW PRODUCTS</h3>
                    <p className="text mb-0">
                      Do not miss the current offers until the end.
                    </p>
                  </div>
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="All" value="All" />
                    {catData.map((category) => (
                      <Tab
                        key={category._id}
                        label={category.name}
                        value={category.name}
                      />
                    ))}
                  </Tabs>
                </div>
                <div className="product_row w-100 mt-4 d-flex product_row2">
                  {newProducts?.length !== 0 ? (
                    newProducts?.map((product) => (
                      <ProductItem key={product.id} product={product} />
                    ))
                  ) : (
                    <span>No products available</span>
                  )}
                </div>
              </div>
              <div className="productRow mt-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="info">
                    <h3 className="mb-0 hd">FASHION</h3>
                    <p className="text mb-0">
                      Do not miss the current offers until the end.
                    </p>
                  </div>
                  <Button className="viewallbtn ml-auto">
                    View All
                    <IoIosArrowRoundForward />
                  </Button>
                </div>
                <div className="product_row w-100">
                  {fashionProducts?.length !== 0 ? (
                    <Swiper
                      slidesPerView={4}
                      pagination={{ clickable: true }}
                      modules={[Navigation, Pagination]}
                      navigation={true}
                      className="mySwiper"
                    >
                      {fashionProducts?.map((product, index) => (
                        <SwiperSlide key={index}>
                          <ProductItem product={product} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <span>No products available</span>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex">
              <div className="banner mt-4 pl-4">
                <img
                  src="https://klbtheme.com/bacola/wp-content/uploads/2021/08/home-banner-22.jpg"
                  className="cursor w-100"
                  alt="shop"
                />
              </div>
              <div className="banner mt-4 pl-4">
                <img
                  src="https://klbtheme.com/bacola/wp-content/uploads/2021/08/home-banner-23.jpg"
                  alt="shop"
                  className="cursor w-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="text-white mb-1">
                $20 discount for your first order
              </p>
              <h3 className="text-white">join our newsletter and get...</h3>
              <p className="text-light">
                Join our email subscription
                <br /> now to get updates on promotions and coupons.
              </p>
              <form>
                <IoMailOutline />
                <input type="text" placeholder="Your Email Address" />
                <Button>Subscribe</Button>
              </form>
            </div>
            <div className="col-md-6">
              <img src={coupon} alt="coupon" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
