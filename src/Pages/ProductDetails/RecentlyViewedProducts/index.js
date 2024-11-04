import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

import { fetchDataFromApi } from "../../../utils/api"; // Adjust the path as needed
import ProductItem from "../../../Components/ProductItem";

const RecentlyViewedProducts = ({ title }) => {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);

  useEffect(() => {
    const fetchRecentlyViewedProducts = async () => {
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      if (recentlyViewed.length > 0) {
        try {
          const productsData = await Promise.all(
            recentlyViewed.map(id => fetchDataFromApi(`/api/products/${id}`))
          );
          setRecentlyViewedProducts(productsData);
        } catch (error) {
          console.error("Error fetching recently viewed products:", error);
        }
      }
    };

    fetchRecentlyViewedProducts();
  }, []);

  return (
    <div className="recentlyViewedProducts mt-5 ml-10">
     <h3 className="mb-0 hd ml-10">{title}</h3>
      <div className="product_row w-100">
        <Swiper
          slidesPerView={5}
          pagination={{ clickable: true }}
          modules={[Navigation]}
          slidesPerGroup={3}
          navigation={true}
          className="mySwiper"
        >
          {recentlyViewedProducts.map((product, index) => (
            <SwiperSlide key={product._id || index}>
              <ProductItem product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;
