import React from "react";
import Slider from "react-slick";

const HomeBanner = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:true,
    autoplay:true,
  };

  return (
    
    <div className="homebannerSection">
      <Slider {...settings}>

       <div className="item">
          <img
            src="https://sslimages.shoppersstop.com/sys-master/root/h83/h17/31263722242078/skincare----For--Her-web_Aw23.jpg"
            className="w-100"
            alt="Menswear Banner"
          />
        </div>
        <div className="item">
          <img
            src="https://cmsimages.shoppersstop.com/static_web_8e17f67fdc/static_web_8e17f67fdc.jpg"
            className="w-100"
            alt="Menswear Banner"
          />
        </div>
        
        <div className="item">
          <img
            src="https://cmsimages.shoppersstop.com/static_web_Stop_Life_10feaf9320/static_web_Stop_Life_10feaf9320.png"
            className="w-70"
            alt="Main Banner"
          />
        </div> 
        <div className="item">
          <img
            src="https://sslimages.shoppersstop.com/sys-master/root/hc9/h3d/31263721848862/Watches--For--Her-web_Aw233.jpg"
            className="w-100"
            alt="Watches Banner"
          />
        </div>
        <div className="item">
          <img
            src="https://cmsimages.shoppersstop.com/static_web_Biba_Global_Desi_and_more_a0e91c950b/static_web_Biba_Global_Desi_and_more_a0e91c950b.png"
            className="w-70"
            alt="Main Banner"
          />
        </div>
         <div className="item">
          <img
            src="https://sslimages.shoppersstop.com/sys-master/root/h42/h1b/31263722373150/Jewellery--For--Her-web_Aw23.jpg"
            className="w-100"
            alt="Watches Banner"
          />
        </div>
        
      </Slider>
    </div>
  );
};

export default HomeBanner;
