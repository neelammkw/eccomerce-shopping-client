import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "../../../Components/ProductItem";
import { fetchDataFromApi } from "../../../utils/api"; // Adjust the path as needed

const RelatedProducts = ({ id, subcat, brand, title }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productsData = await fetchDataFromApi(`/api/products`);

        const filteredProducts = productsData.filter(
          (product) =>
            (product.subCat === subcat || product.brand === brand) &&
            product._id !== id
        );

        setRelatedProducts(filteredProducts.slice(0, 8)); // Show up to 8 related products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllProducts();
  }, [subcat, brand, id]);

  return (
    <div className="productRow relatedProduct mt-5">
      <div className="d-flex align-items-center mb-3">
        <div className="info">
          <h3 className="mb-0 hd ml-10">{title}</h3>
          <p className="text mb-0 ml-10">
            Do not miss the current offers until the end.
          </p>
        </div>
      </div>
      <div className="product_row w-100">
        <Swiper
          slidesPerView={5}
          pagination={{ clickable: true }}
          modules={[Navigation]}
          slidesPerGroup={3}
          navigation={true}
          className="mySwiper"
        >
          {relatedProducts.map((product, index) => (
            <SwiperSlide key={product._id || index}>
              <ProductItem product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedProducts;
