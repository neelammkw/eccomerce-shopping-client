import React, { useState, useEffect } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api"; // Adjust the path as needed

const Sidebar = ({ brands }) => {
  const { catName } = useParams(); // Extract the category name from the URL
  const [value, setValue] = useState([100, 60000]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcats, setSelectedSubcats] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        let endpoint = "/api/subcategories";
        if (catName) {
          endpoint = `/api/subcategories?category=${catName}`; // Adjust endpoint to fetch subcategories for the specific category
        }
        const subcategoriesData = await fetchDataFromApi(endpoint);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [catName]);

  const handleSubcatChange = (event) => {
    const { value, checked } = event.target;
    setSelectedSubcats((prevSelectedSubcats) =>
      checked
        ? [...prevSelectedSubcats, value]
        : prevSelectedSubcats.filter((subcat) => subcat !== value)
    );
  };

  const handleBrandChange = (event) => {
    const { value, checked } = event.target;
    setSelectedBrands((prevSelectedBrands) =>
      checked
        ? [...prevSelectedBrands, value]
        : prevSelectedBrands.filter((brand) => brand !== value)
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (selectedSubcats.length > 0) {
      params.set("subcats", selectedSubcats.join(","));
    } else {
      params.delete("subcats");
    }

    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(","));
    } else {
      params.delete("brands");
    }

    params.set("mp", value[0]);
    params.set("mxp", value[1]);

    navigate({ search: params.toString() });
  }, [selectedSubcats, selectedBrands, value, navigate, location.search]);

  return (
    <>
      <div className="sidebar">
        <div className="filterBox">
          <h6>PRODUCT CATEGORIES</h6>
          <div className="scroll">
            <ul>
              {subcategories.map((subcat) => (
                <li key={subcat._id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={subcat.subcat}
                        checked={selectedSubcats.includes(subcat.subcat)}
                        onChange={handleSubcatChange}
                      />
                    }
                    label={subcat.subcat}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="filterBox pt-2 pb-5 mr-3">
          <h6 className="pb-3 pt-2">FILTER BY PRICE</h6>
          <RangeSlider
            value={value}
            onInput={setValue}
            min={100}
            max={60000}
            step={5}
          />
          <div className="d-flex pt-2 pr-10 priceRange">
            <span>
              From: <strong className="text-success">Rs: {value[0]} </strong>
            </span>
            <span className="ml-auto">
              To: <strong className="text-success">Rs: {value[1]}</strong>
            </span>
          </div>
        </div>
        <div className="filterBox">
          <h6>PRODUCT STATUS</h6>
          <div className="scroll">
            <ul>
              <li>
                <FormControlLabel control={<Checkbox />} label="In Stock" />
              </li>
              <li>
                <FormControlLabel control={<Checkbox />} label="On Sale" />
              </li>
            </ul>
          </div>
        </div>
        <div className="filterBox">
          <h6>BRANDS</h6>
          <div className="scroll">
            <ul>
              {brands.map((brand) => (
                <li key={brand}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={brand}
                        checked={selectedBrands.includes(brand)}
                        onChange={handleBrandChange}
                      />
                    }
                    label={brand}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <br />
        <Link to="#">
          <img
            src="https://klbtheme.com/bacola/wp-content/uploads/2021/05/sidebar-banner.gif"
            alt=""
            className="w-100"
          />
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
