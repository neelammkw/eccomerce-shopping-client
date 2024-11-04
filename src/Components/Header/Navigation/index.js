import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { IoIosMenu } from "react-icons/io";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../../../utils/api"; // Adjust the path as needed

const Navigation = () => {
  const [isOpenSidebarVal, setisOpenSidebarVal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subcatData, setSubcatData] = useState({});
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await fetchDataFromApi("/api/categories");
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const subcategoriesData = await fetchDataFromApi("/api/subcategories");
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    const fetchSubcatData = async () => {
      try {
        const promises = subcategories.map((subcat) =>
          fetchDataFromApi(`/api/subcategories/${subcat._id}`)
        );
        const results = await Promise.all(promises);
        const data = results.reduce((acc, curr, index) => {
          acc[subcategories[index]._id] = curr;
          return acc;
        }, {});
        setSubcatData(data);
      } catch (error) {
        console.error("Error fetching subcategory data:", error);
      }
    };

    if (subcategories.length > 0) {
      fetchSubcatData();
    }
  }, [subcategories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setisOpenSidebarVal(false);
      }
    };

    if (isOpenSidebarVal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenSidebarVal]);

  const getCategoryWithSubcategories = () => {
    return categories.map((category) => ({
      ...category,
      subcategories: subcategories.filter(
        (subcat) => subcat.category._id === category._id
      ),
    }));
  };

  // Limit to 5 categories
  const categoriesWithSubcategories = getCategoryWithSubcategories();
  const categoriesWithSubcategories2 = getCategoryWithSubcategories().slice(0, 6);

  const handleCategoryClick = (subcat) => {
    navigate(`/subcat/${subcat}?mp=100&mxp=60000`);
  };

  return (
    <nav>
      <div className="navcontainer">
        <div className="row d-flex">
          <div className="col-sm-3 navpart1">
            <div className="catWrapper">
              <Button
                className="btn btn-14 align-items-center"
                onClick={() => setisOpenSidebarVal(!isOpenSidebarVal)}
              >
                <span className="icon1 mr-2">
                  <IoIosMenu />
                </span>
                <span className="text">All Categories</span>
                <span className="icon2 ml-2">
                  <FaAngleDown />
                </span>
              </Button>
            </div>
            <div
              className={`sidebarNav shadow ${isOpenSidebarVal ? "open" : ""}`}
              ref={sidebarRef}
            >
              <ul>
                {categoriesWithSubcategories.map((category) => (
                  <li key={category._id}>
                    <Button>
                      {category.name}
                      <FaAngleRight className="ml-auto" />
                    </Button>
                    {category.subcategories.length > 0 ? (
                      <div className="submenu">
                        {category.subcategories.map((subcat) => (
                          <Button
                            key={subcat._id}
                            onClick={() => handleCategoryClick(subcat.subcat)}
                          >
                            {subcat.subcat}
                            {subcatData[subcat.subcat]?.length === 0 && (
                              <span className="no-products"> (No products)</span>
                            )}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="submenu">
                        <span>No subcategories available</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-sm-9.1 navpart2 d-flex ml-auto">
            <div className="nav-scroll">
              <ul className="list list-inline ml-auto">
                <li className="list-inline-item">
                  <Link to="/">Home</Link>
                </li>
                {categoriesWithSubcategories2.map((category) => (
                  <li className="list-inline-item" key={category._id}>
                    <div className="category-item">
                      <Link
                        to={`/category/${category.name}`}
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        {category.name}
                      </Link>
                      {category.subcategories.length > 0 ? (
                        <div className="submenu">
                          {category.subcategories.map((subcat) => (
                            <Button
                              key={subcat._id}
                              onClick={() => handleCategoryClick(subcat.subcat)}
                            >
                              {subcat.subcat}
                              {subcatData[subcat._id]?.length === 0 && (
                                <span className="no-products"> (No products)</span>
                              )}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="submenu">
                          <span>No subcategories available</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
               
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
