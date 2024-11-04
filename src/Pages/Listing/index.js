import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import Button from "@mui/material/Button";
import { IoIosMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { HiViewGrid } from "react-icons/hi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ProductItem from "../../Components/ProductItem";
import Pagination from "@mui/material/Pagination";
import { fetchDataFromApi } from "../../utils/api"; // Adjust the path as needed

const Listing = () => {
  const { catName, subcat } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate(); // To help in navigation
  const [productView, setProductView] = useState("four");
  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  const openDropdown = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fetch products based on category or subcategory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await fetchDataFromApi(`/api/products`);

        let filteredByRoute = productsData;

        if (catName) {
          filteredByRoute = filteredByRoute.filter((product) => product.category === catName || product.subCat === subcat);
        }

        setProducts(filteredByRoute);

        const uniqueBrands = Array.from(new Set(filteredByRoute.map((product) => product.brand)));
        setBrands(uniqueBrands);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [catName, subcat]);

  // Clear products when navigating between routes
  useEffect(() => {
    setProducts([]);
    setFilteredProducts([]);
  }, [catName, subcat]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subcats = subcat ? [subcat] : [];
    const subcatsParam = params.get("subcats");
    if (subcatsParam) {
      subcats.push(...subcatsParam.split(","));
    }
    const brands = params.get("brands") ? params.get("brands").split(",") : [];
    const minPrice = params.get("mp") ? Number(params.get("mp")) : 100;
    const maxPrice = params.get("mxp") ? Number(params.get("mxp")) : 60000;

    const filtered = products.filter((product) => {
      const matchesSubcat = subcats.length === 0 || subcats.includes(product.subCat);
      const matchesBrand = brands.length === 0 || brands.includes(product.brand);
      const matchesPrice = product.discountPrice >= minPrice && product.discountPrice <= maxPrice;

      return matchesSubcat && matchesBrand && matchesPrice;
    });

    setFilteredProducts(filtered);
  }, [location.search, products, subcat]);

  // Function to handle subcategory changes
  const handleSubcatChange = (selectedSubcats) => {
    if (selectedSubcats.length === 1) {
      // If only one subcategory is selected, navigate to the subcategory route
      navigate(`/category/${selectedSubcats[0]}`);
    } else {
      // If multiple subcategories are selected, update the URL with the selected subcategories
      const params = new URLSearchParams(location.search);
      params.set("subcats", selectedSubcats.join(","));

      navigate(`${location.pathname}?${params.toString()}`);
    }
  };

  return (
    <>
      <section className="product_Listing_Page">
        <div className="productListing d-flex">
          <Sidebar brands={brands} onSubcatChange={handleSubcatChange} /> {/* Pass brands and handleSubcatChange to Sidebar */}
          <div className="content_right">
            <img
              src="https://klbtheme.com/bacola/wp-content/uploads/2021/08/bacola-banner-18.jpg"
              alt=""
              className="img"
            />
            <div className="showBy mt-3 mr-0 d-flex align-items-center">
              <div className="d-flex btnWrapper">
                <Button className={productView === "one" ? "act" : ""} onClick={() => setProductView("one")}>
                  <IoIosMenu />
                </Button>
                <Button className={productView === "two" ? "act" : ""} onClick={() => setProductView("two")}>
                  <HiViewGrid />
                </Button>
                <Button className={productView === "three" ? "act" : ""} onClick={() => setProductView("three")}>
                  <CgMenuGridR />
                </Button>
                <Button className={productView === "four" ? "act" : ""} onClick={() => setProductView("four")}>
                  <TfiLayoutGrid4Alt />
                </Button>
              </div>
              <div className="ml-auto showByFilter">
                <Button onClick={handleClick}>
                  Show 9 &nbsp; <FaAngleDown className="mb-2" />
                </Button>
                <Menu
                  id="basic-menu"
                  className="w-100 showPerPageDp mt-0"
                  anchorEl={anchorEl}
                  open={openDropdown}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleClose}>9</MenuItem>
                  <MenuItem onClick={handleClose}>18</MenuItem>
                  <MenuItem onClick={handleClose}>27</MenuItem>
                  <MenuItem onClick={handleClose}>36</MenuItem>
                </Menu>
              </div>
            </div>
            <div className="productListing">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductItem key={product._id} itemView={productView} product={product} />
                ))
              ) : (
                <div className="no-products">
                  <p>No products available for this category or subcategory.</p>
                </div>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-center mt-5">
              <Pagination count={10} color="primary" size="large" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Listing;
