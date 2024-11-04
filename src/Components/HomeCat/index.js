import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const HomeCat = (props) => {
  const [categoryNames, setCategoryNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Extract category names from props.catData
    if (props.catData && Array.isArray(props.catData)) {
      const names = props.catData.map((cat) => cat.name);
      setCategoryNames(names);
    }
  }, [props.catData]);

  const handleCategoryClick = (catName) => {
    // Log the selected category name to the console

    // Encode the category name for use in the URL
    const encodedCatName = encodeURIComponent(catName);
    
    // Navigate to the listing page with the selected category name as a parameter
    navigate(`/category/${encodedCatName}`);
  };

  return (
    <section className="homeCat">
      <div className="container">
        <h3 className="m-3 hd">Featured Categories</h3>
        <Swiper
          slidesPerView={6}
          spaceBetween={0}
          slidesPerGroup={3}
          navigation={true}
          modules={[Navigation]}
          className="CatSwiper"
        >
          {categoryNames?.map((catName, index) => (
            <SwiperSlide key={index}>
              <div
                className="homeCat_item text-center cursor"
                onClick={() => handleCategoryClick(catName)}
              >
                <div className="homeCat_item_img">
                  <img
                    src={`https://ecommerce-shopping-server.onrender.com/uploads/${props.catData[index].images[0]}`}
                    alt={catName}
                    height="100px"
                  />
                </div>
                <h6>{catName}</h6>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeCat;
