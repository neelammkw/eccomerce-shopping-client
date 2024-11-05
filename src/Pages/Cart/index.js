import React, { useState, useEffect, useContext } from "react";
import { IoTrashBin } from "react-icons/io5";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import QuantityBox from "../../Components/QuantityBox";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../App";
import {
  fetchDataFromApi,
  updateCartItemQuantity,
  removeCartItem,
  removeAllCartItems,
} from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { IoBagCheckOutline } from "react-icons/io5";
import { BsCurrencyRupee } from "react-icons/bs";

const Cart = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useContext(MyContext);
  const navigate = useNavigate();

  const shippingCharge = 0.0;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const cartData = await fetchDataFromApi(`/api/cart/${user.userId}`);
        setProducts(cartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (user.userId) {
      fetchCartData();
    }
  }, [user.userId]);

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

  const handleQuantityChange = (productId, newQuantity) => {
    setUpdatedQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const handleUpdateCart = async () => {
    try {
      setLoading(true);
      toast.dismiss();
      for (const productId in updatedQuantities) {
        await updateCartItemQuantity(
          `/api/cart/${user.userId}/${productId}`,
          updatedQuantities[productId]
        );
      }
      const updatedCartData = await fetchDataFromApi(
        `/api/cart/${user.userId}`
      );
      setProducts(updatedCartData);
      setUpdatedQuantities({});
      toast.success("Cart updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setLoading(true);
    try {
      await removeCartItem(`/api/cart/${user.userId}/${productId}`);
      const updatedCartData = await fetchDataFromApi(
        `/api/cart/${user.userId}`
      );
      setProducts(updatedCartData);
      toast.success("Item removed from cart.");
      // window.location.reload();
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
      await removeAllCartItems(`/api/cart/${user.userId}`);
      setProducts([]);
      toast.success("All items removed from cart.");
      // window.location.reload();
    } catch (error) {
      console.error("Error removing all items:", error);
      toast.error("Error removing all items.");
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = products.reduce((total, product) => {
    const quantity = updatedQuantities[product._id] || product.quantity;
    return total + product.price * quantity;
  }, 0);
  const handleCheckout = () => {
    navigate("/checkout"); // Navigate to the checkout page
  };

  const cartSubtotal = cartTotal + shippingCharge;

  return (
    <section className="section">
      <div className="container">
        <h2 className="hd">Your Cart</h2>
        <p>
          There are <b className="text-red">{products.length}</b> products in
          your cart
        </p>
        <div className="cart">
          {loading && <div className="loader">Loading...</div>}
          <div className="cart-notices-wrapper"></div>
          <div className="row content-wrapper sidebar-right">
            <div className="col-12 col-md-12 col-lg-12 content-primary">
              <div className="cart-wrapper">
                <div className="col-md-8">
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
                          <th className="product-quantity">Quantity</th>
                          <th className="product-subtotal">Subtotal</th>
                          <th className="product-remove">Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(products) &&
                          products.map((product) => {
                            const productQuantity =
                              updatedQuantities[product._id] !== undefined
                                ? updatedQuantities[product._id]
                                : product.quantity;

                            const productSubtotal = (
                              product.price * productQuantity
                            ).toFixed(2);

                            return (
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
                                    {selectedProducts.includes(product._id) ? (
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
                                        width="90"
                                        height="90"
                                        src={`https://ecommerce-shopping-server.onrender.com/uploads/${product.image}`}
                                        alt={product.productName}
                                      />
                                    </a>
                                  </div>
                                  <div>
                                    <a
                                      href={`/product/${product.productId._id}`}
                                    >
                                      {product.productId.name}
                                    </a>
                                    <br />
                                    <Rating
                                      name="read-only"
                                      value={product.rating}
                                      readOnly
                                      precision={0.5}
                                      size="small"
                                    />
                                  </div>
                                </td>
                                <td
                                  className="product-price"
                                  data-title="Price"
                                >
                                  <span className="cart-Price-amount amount">
                                    <span className="cart-Price-currencySymbol">
                                      $
                                    </span>
                                    {product.price.toFixed(2)}
                                  </span>
                                </td>
                                <td
                                  className="product-quantity"
                                  data-title="Quantity"
                                >
                                  <div className="quantity">
                                    <QuantityBox
                                      initialQuantity={product.quantity}
                                      onQuantityChange={(newQuantity) =>
                                        handleQuantityChange(
                                          product._id,
                                          newQuantity
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                                <td
                                  className="product-subtotal"
                                  data-title="Subtotal"
                                >
                                  <span className="cart-Price-amount amount">
                                    <span className="cart-Price-currencySymbol">
                                      <BsCurrencyRupee />
                                    </span>
                                    {productSubtotal}
                                  </span>
                                </td>
                                <td className="product-remove">
                                  <button
                                    type="button"
                                    className="remove"
                                    aria-label={`Remove ${product.productName} from cart`}
                                    onClick={() =>
                                      handleRemoveItem(product._id)
                                    }
                                  >
                                    <IoTrashBin />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        <tr>
                          <td colSpan="6" className="actions">
                            <div className="actions-wrapper">
                              <div className="coupon">
                                <label
                                  htmlFor="coupon_code"
                                  className="screen-reader-text"
                                >
                                  Coupon:
                                </label>
                                <input
                                  type="text"
                                  name="coupon_code"
                                  className="input-text"
                                  id="coupon_code"
                                  placeholder="Coupon code"
                                />
                                <button
                                  type="submit"
                                  className="button"
                                  name="apply_coupon"
                                >
                                  Apply coupon
                                </button>
                              </div>
                              <button
                                type="button"
                                className="button"
                                name="update_cart"
                                onClick={handleUpdateCart}
                                disabled={
                                  Object.keys(updatedQuantities).length === 0
                                }
                              >
                                Update cart
                              </button>
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
                <div className="cart-collaterals col-md-4">
                  <div className="cart_totals">
                    <h3>Cart totals</h3>
                    <table
                      cellSpacing="0"
                      className="shop_table shop_table_responsive"
                    >
                      <tbody>
                        <tr className="cart-subtotal">
                          <th>Total</th>
                          <td data-title="Subtotal">
                            <span className="Price-amount amount">
                              <span className="Price-currencySymbol">
                                <BsCurrencyRupee />
                              </span>
                              {cartTotal.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                        <tr className="shipping">
                          <th>Shipping</th>
                          <td data-title="Shipping">
                            <span className="Price-amount amount">
                              <span className="Price-currencySymbol">
                                <BsCurrencyRupee />
                              </span>
                              {shippingCharge.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                        <tr className="tax">
                          <th>Estimate For</th>
                          <td data-title="Tax">
                            <span className="Price-amount amount">
                              <span className="Price-currencySymbol">
                                Vadodara
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr className="order-total">
                          <th>SubTotal</th>
                          <td data-title="Total">
                            <strong>
                              <span className="Price-amount amount">
                                <span className="Price-currencySymbol">
                                  <BsCurrencyRupee />
                                </span>
                                {cartSubtotal.toFixed(2)}
                              </span>
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="actions checkout">
                      <Link to="/checkout">
                        <button
                          type="button "
                          className="button"
                          onClick={handleCheckout}
                        >
                          <IoBagCheckOutline /> &nbsp; Check Out
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Cart;
