import React, { useState, useEffect, useContext } from "react";
import { IoTrashBin } from "react-icons/io5";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../App";
import {
  fetchDataFromApi,
  removeMyListItem,
  removeAllMyListItems,
} from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { BsCurrencyRupee } from "react-icons/bs";
import emptyListImage from "../../assets/images/empty-cart.jpg"; // Import your empty list image
import { FaHome } from "react-icons/fa";

const MyList = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyListData = async () => {
      try {
        setLoading(true);
        const myListData = await fetchDataFromApi(
          `/api/my-list/${user.userId}`
        );
        setProducts(myListData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (user.userId) {
      fetchMyListData();
    }
  }, [user.userId]);

  useEffect(() => {
    // Update localStorage when products state changes
    localStorage.setItem("myList", JSON.stringify(products));
  }, [products]);

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product._id));
    }
    setSelectAll(!selectAll);
  };

  const handleRemoveItem = async (productId) => {
    setLoading(true);
    try {
      await removeMyListItem(`/api/my-list/item/${user.userId}/${productId}`);

      const updatedMyListData = await fetchDataFromApi(
        `/api/my-list/${user.userId}`
      );
      setProducts(updatedMyListData);
      toast.success("Item removed from list.");

      // Update localStorage after removal
      const updatedLocalList = JSON.parse(localStorage.getItem("myList")) || [];
      const newLocalList = updatedLocalList.filter(item => item._id !== productId);
      localStorage.setItem("myList", JSON.stringify(newLocalList));
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Error removing item.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAll = async () => {
    setLoading(true);
    toast.dismiss();
    try {
      await removeAllMyListItems(`/api/my-list/${user.userId}`);
      setProducts([]);
      toast.success("All items removed from list.");

      // Clear localStorage after removing all items
      localStorage.setItem("myList", JSON.stringify([]));
    } catch (error) {
      console.error("Error removing all items:", error);
      toast.error("Error removing all items.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="hd">Your Favorite Products</h2>
        {products.length === 0 && !loading ? (
          <div className="empty-list-wrapper w-30">
            <img
              src={emptyListImage}
              alt="Empty list"
              className="empty-list-image w-30"
            />
            <h4>Your MyList is currently empty.</h4>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              <FaHome /> &nbsp; Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <p>
              There are <b className="text-red">{products.length}</b> products
              in your list
            </p>
            <div className="cart">
              {loading && <div className="loader">Loading...</div>}
              <div className="cart-notices-wrapper"></div>
              <div className="row content-wrapper sidebar-right">
                <div className="col-12 col-md-12 col-lg-12 content-primary">
                  <div className="cart-wrapper">
                    <div className="col-md-11">
                      <form className="cart-form">
                        <table
                          className="table shop_table shop_table_responsive cart cart-form__contents"
                          cellSpacing="0"
                        >
                          <thead className="thead">
                            <tr>
                              <th className="product-thumbnail checkbox-button">
                                <button type="button" onClick={handleSelectAll}>
                                  {selectAll ? (
                                    <RiCheckboxFill />
                                  ) : (
                                    <RiCheckboxBlankLine />
                                  )}
                                </button>
                              </th>
                              <th className="product-name">Product</th>
                              <th className="product-price">Price</th>
                              <th className="product-price">Rating</th>
                              <th className="product-remove">Remove</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(products) &&
                              products.map((product) => (
                                <tr
                                  key={product._id}
                                  className="cart-form__cart-item cart_item align-items-center"
                                >
                                  <td className="product-thumbnail">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSelectProduct(product._id)
                                      }
                                    >
                                      {selectedProducts.includes(
                                        product._id
                                      ) ? (
                                        <RiCheckboxFill />
                                      ) : (
                                        <RiCheckboxBlankLine />
                                      )}
                                    </button>
                                  </td>
                                  <td
                                    className="product-thumbnail d-flex flex-row"
                                    data-title="Product"
                                  >
                                    <div>
                                      <a
                                        href={`/product/${product.productId._id}`}
                                      >
                                        <img
                                          loading="lazy"
                                          decoding="async"
                                          width="100"
                                          height="100"
                                          src={`https://ecommerce-shopping-server.onrender.com/uploads/${product.image}`}
                                          alt={product.productName}
                                        />
                                      </a>
                                    </div>
                                    <div>
                                      <a
                                        href={`/product/${product.productId._id}`}
                                      >
                                       &nbsp;&nbsp;&nbsp; {product.productName}
                                      </a>
                                      
                                    </div>
                                  </td>
                                  <td
                                    className="product-price"
                                    data-title="Price"
                                  >
                                    <span className="cart-Price-amount amount">
                                      <span className="cart-Price-currencySymbol">
                                        <BsCurrencyRupee />
                                      </span>
                                      {product.discountPrice}
                                    </span>
                                  </td>
                                  <td
                                    className="product-rating"
                                    data-title="Rating"
                                  >
                                    <span className="cart-Rating-amount amount">
                                      <Rating
                                        name="read-only"
                                        value={product.rating}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                      />
                                    </span>
                                  </td>

                                  <td className="product-remove">
                                    <button
                                      type="button"
                                      className="remove"
                                      aria-label={`Remove ${product.productName} from list`}
                                      onClick={() =>
                                        handleRemoveItem(product._id)
                                      }
                                    >
                                      <IoTrashBin />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            <tr>
                              <td colSpan="6" className="actions">
                                <div className="actions-wrapper">
                                  <button
                                    type="button"
                                    className="button remove-all"
                                    onClick={handleRemoveAll}
                                    disabled={products.length === 0}
                                  >
                                    Remove All
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </section>
  );
};

export default MyList;
