import React, { useRef, useState } from "react";
import Slider from "react-slick";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductZoom = ({ images }) => {
  const [ setSlideIndex] = useState(0);
  const productSliderBig = useRef();
  const productSliderSml = useRef();

  const goToSlide = (index) => {
    setSlideIndex(index);
    productSliderBig.current.slickGoTo(index);
    productSliderSml.current.slickGoTo(index);
  };

  const productSliderOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const productSliderSmlOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="ProductZoomModal">
      <div className="productZoom position-relative">
        <Slider
          {...productSliderOptions}
          ref={productSliderBig}
          className="sliderbig"
        >
          {images && images.map((image, index) => (
            <div key={index}>
              <Zoom>
                <img
                  src={`https://ecommerce-shopping-server.onrender.com/uploads/${image}`}
                  alt={`product-${index}`}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </Zoom>
            </div>
          ))}
        </Slider>
        <Slider
          {...productSliderSmlOptions}
          ref={productSliderSml}
          className="slidersml"
        >
          {images && images.map((image, index) => (
            <div className="item" key={index} onClick={() => goToSlide(index)}>
              <img
                src={`https://ecommerce-shopping-server.onrender.com/uploads/${image}`}
                alt={`product-${index}`}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductZoom;
