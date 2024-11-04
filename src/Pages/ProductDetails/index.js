import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductZoom from "../../Components/ProductZoom";
import Rating from "@mui/material/Rating";
import { LiaCartPlusSolid } from "react-icons/lia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import {  toast } from "react-toastify";

import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import QuantityBox from "../../Components/QuantityBox";
import {
  IoMdHeart,
  IoIosGitCompare,
  IoMdHeartEmpty,
} from "react-icons/io";
import RelatedProducts from "./RelatedProducts";
import RecentlyViewedProducts from "./RecentlyViewedProducts";
import { MyContext } from "../../App";

import {
  getProductById,
  getProductReviews,
  postData,
  removeMyListItem,
} from "../../utils/api"; // Adjust the path as needed

const StyledPrice = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: "8px",
});

const OriginalPrice = styled(Typography)({
  textDecoration: "line-through",
  marginRight: "8px",
  color: "#888",
});

const DiscountedPrice = styled(Typography)({
  color: "#e53935",
  fontWeight: "bold",
});

const StyledProductDetails = styled("div")({
  marginTop: "16px",
});

const ProductDetails = () => {
  const { productId } = useParams();
  const context = useContext(MyContext);
  const [isInList, setIsInList] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviewData, setReviewData] = useState({
    name: "",
    email: "",
    review: "",
  });
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);
  const { user, myList, setMyList } = useContext(MyContext);

const checkIfInList = useCallback(() => {
  if (!user || !product?._id) return;

  let wishlist = JSON.parse(localStorage.getItem("myList")) || [];
  const productInList = wishlist.some(
    (item) => item.productId === product._id
  );
  if (productInList) {
    setIsInList(productInList);
  }
}, [user, product]);

useEffect(() => {
  const fetchProductDetails = async () => {
    try {
      const productdata = await getProductById(`/api/products/${productId}`);
      setProduct(productdata);

      const reviewsData = await getProductReviews(`/api/review/${productId}`);
      setReviews(reviewsData);

      checkIfInList();
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  fetchProductDetails();
}, [productId, checkIfInList]);

useEffect(() => {
  checkIfInList();
  window.scrollTo(0, 0);
}, [user, product, myList, checkIfInList]);


  const handleAddToMyList = async () => {
    if (!user) {
      toast.error("Please log in to add products to My List.");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const myListData = {
        productId: product._id,
        productName: product.name,
        image: product.images[0],
        rating: product.rating,
        discountPrice: product.discountPrice,
        userId: user.userId,
      };

      let wishlist = JSON.parse(localStorage.getItem("myList")) || [];

      if (isInList) {
        await removeMyListItem(
          `/api/my-list/product/${user.userId}/${product._id}`
        );
        setIsInList(false);
        toast.success("Item removed from list.");

        const updatedList = myList.filter(
          (item) => item.productId !== product._id
        );
        setMyList(updatedList);
        localStorage.setItem("myList", JSON.stringify(updatedList));
      } else {
        const isAlreadyInList = wishlist.some(
          (item) => item.productId === product._id
        );
        if (isAlreadyInList) {
          toast.error("Product is already in the List.");
          setIsInList(true);
          return;
        }

        const response = await postData("/api/my-list/add", myListData);
        if (response.status === 201) {
          setIsInList(true);
          toast.success("Product added to My List!");

          const updatedList = [...myList, myListData];
          setMyList(updatedList);
          localStorage.setItem("myList", JSON.stringify(updatedList));

          // wishlist.push(myListData);
          // localStorage.setItem("myList", JSON.stringify(wishlist));
        } else {
          toast.error(
            response.data.message || "Failed to add product to List."
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update My List.");
    } finally {
      setIsProcessing(false);
    }
  };
  if (!product) {
    return <div>Loading...</div>;
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user")); // Get user ID from local storage
      const reviewPayload = {
        productId,
        CustomerId: user?.userId, // Include userId
        CustomerEmail: reviewData.email,
        CustomerName: reviewData.name,
        ratings: reviewData.ratings,
        review: reviewData.review,
      };
       await postData("/api/review/add", reviewPayload);
      // await postData(reviewPayload);
      setReviewData({
        name: "",
        email: "",
        review: "",
      });
      // Optionally, refetch product details to include new review
      const updatedReviews = await getProductReviews(
        `/api/review/${productId}`
      );
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    setProductQuantity(newQuantity);
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleWeightChange = (event) => {
    setSelectedWeight(event.target.value);
  };
  const addToCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const updatedCartFields = {
      productName: product?.name,
      image: product?.images[0],
      rating: product?.rating,
      price: product?.discountPrice,
      quantity: productQuantity,
      size: selectedSize,
      color: selectedColor,
      weight: selectedWeight,
      subtotal: product?.discountPrice * productQuantity,
      productId: product?._id,
      userId: user?.userId,
    };
    // handleAddProductSuccess();
    context.addToCart(updatedCartFields);
    // context.setCartFields([...context.cartFields, updatedCartFields]);
  };

  return (
    <section className="productDetails section">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <ProductZoom images={product.images} />
          </div>
          <div className="col-md-7">
            <h2 className="hd text-capitalize">{product.name}</h2>
            <ul className="list list-inline d-flex align-items-center mt-0 mb-0">
              <li className="list-inline-item">
                <div className="d-flex inline-item-center mt-0">
                  <span className="text-light2">Brands: &nbsp;</span>
                  <span>{product.brand}</span>
                </div>
              </li>
              <li className="list-inline-item d-flex align-items-center">
                <Rating
                  name="read-only"
                  value={product.rating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <span className="text-light2 cursor ml-2">
                  {product.numReviews} Review(s)
                </span>
              </li>
            </ul>

            <div className="d-flex info">
              <div className="productDetails">
                <StyledProductDetails className="mt-0">
                  <StyledPrice>
                    {product.discountPrice && (
                      <OriginalPrice variant="body2">
                        ${product.price}
                      </OriginalPrice>
                    )}
                    <DiscountedPrice variant="h6">
                      ${product.discountPrice}
                    </DiscountedPrice>
                  </StyledPrice>
                  <span
                    className={`badge ${
                      product.inStock ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                  </span>
                  <Typography variant="body2" className="mt-2">
                    {product.description}
                  </Typography>
                  <div className="productSize d-flex align-items-center">
                    <FormControl variant="outlined" style={{ minWidth: 120 }}>
                      <InputLabel>Size</InputLabel>
                      <Select
                        value={selectedSize}
                        onChange={handleSizeChange}
                        label="Size"
                      >
                        {product.sizes.split(/[\s,]+/).map((size, index) => (
                          <MenuItem key={index} value={size.trim()}>
                            {size.trim()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, marginLeft: "10px" }}
                    >
                      <InputLabel>Weight</InputLabel>
                      <Select
                        value={selectedWeight}
                        onChange={handleWeightChange}
                        label="Weight"
                      >
                        {product.weight.split(",").map((weight, index) => (
                          <MenuItem key={index} value={weight.trim()}>
                            {weight.trim()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      variant="outlined"
                      style={{ minWidth: 120, marginLeft: "10px" }}
                    >
                      <InputLabel>Color</InputLabel>
                      <Select
                        value={selectedColor}
                        onChange={handleColorChange}
                        label="Color"
                      >
                        {product.colors.split(/[\s,]+/).map((color, index) => (
                          <MenuItem key={index} value={color.trim()}>
                            {color.trim()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <Box mt={2}>
                    <div className="d-flex align-items-center">
                      <QuantityBox
                        initialQuantity={productQuantity}
                        onQuantityChange={handleQuantityChange}
                      />
                      <Button
                        className="btn-blue btn-big btn-round ml-3 align-items-center"
                        onClick={addToCart}
                      >
                        <LiaCartPlusSolid className="mr-2 mt-0" />
                        Add To Cart
                      </Button>
                    </div>
                    <div className="d-flex align-items-center mt-4 btnaction">
                      <Button
                        onClick={handleAddToMyList}
                        disabled={isProcessing}
                        className={isInList ? "heart-added" : "heart"}
                      >
                        {isInList ? (
                          <IoMdHeart color="red" />
                        ) : (
                          <IoMdHeartEmpty />
                        )}{" "}
                        &nbsp; {isInList ? "In WishList" : "Add to List"}
                      </Button>
                      <Button className="btn-link addwishlist ml-4">
                        <IoIosGitCompare />
                        &nbsp; Add To Compare
                      </Button>
                    </div>
                  </Box>
                </StyledProductDetails>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="ProductDatas">
        <section className="woocommerce-tabs wc-tabs-wrapper mt-10 w-50">
          <ul className="tabs wc-tabs" role="tablist">
            <li
              className={`reviews_tab ${
                activeTab === "reviews" ? "active" : ""
              }`}
              id="tab-title-reviews"
              role="tab"
              aria-controls="tab-reviews"
              onClick={() => handleTabClick("reviews")}
            >
              <button
    type="button"
    
  >
    Reviews ({product.numReviews})
  </button>
            </li>
            <li
              className={`description_tab ${
                activeTab === "description" ? "active" : ""
              }`}
              id="tab-title-description"
              role="tab"
              aria-controls="tab-description"
              onClick={() => handleTabClick("description")}
            >
               <button
    type="button"
    
  >Description</button>
            </li>
            <li
              className={`additional_information_tab ${
                activeTab === "additional_information" ? "active" : ""
              }`}
              id="tab-title-additional_information"
              role="tab"
              aria-controls="tab-additional_information"
              onClick={() => handleTabClick("additional_information")}
            >
               <button
    type="button"
    
  >Additional information</button>
            </li>
          </ul>
          <div
            className="woocommerce-Tabs-panel woocommerce-Tabs-panel--description panel entry-content wc-tab mt-2"
            id="tab-description"
            role="tabpanel"
            aria-labelledby="tab-title-description"
            style={{
              display: activeTab === "description" ? "block" : "none",
            }}
          >
            <p>{product.description}</p>
          </div>
          <div
            className="woocommerce-Tabs-panel woocommerce-Tabs-panel--additional_information panel entry-content wc-tab mt-2"
            id="tab-additional_information"
            role="tabpanel"
            aria-labelledby="tab-title-additional_information"
            style={{
              display:
                activeTab === "additional_information" ? "block" : "none",
            }}
          >
            <table className="woocommerce-product-attributes shop_attributes">
              <tbody>
                <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_brands">
                  <th className="woocommerce-product-attributes-item__label">
                    Brands:
                  </th>
                  <td className="woocommerce-product-attributes-item__value">
                    {product.brand}
                  </td>
                </tr>{" "}
                <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_brands ">
                  <th className="woocommerce-product-attributes-item__label">
                    Colors:
                  </th>
                  <td className="woocommerce-product-attributes-item__value ">
                    {product.colors.split(/[\s,]+/).map((colors, index) => (
                      <li key={index} className="list-inline-item">
                        {colors.trim()}
                      </li>
                    ))}
                  </td>
                </tr>
                <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_brands">
                  <th className="woocommerce-product-attributes-item__label">
                    Weight:
                  </th>
                  <td className="woocommerce-product-attributes-item__value ">
                    {product.weight}
                  </td>
                </tr>
                <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_brands">
                  <th className="woocommerce-product-attributes-item__label">
                    Sizes:
                  </th>
                  <td className="woocommerce-product-attributes-item__value ">
                    {product.sizes.split(/[\s,]+/).map((sizes, index) => (
                      <li key={index} className="list-inline-item">
                        {sizes.trim()}
                      </li>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className="woocommerce-Tabs-panel woocommerce-Tabs-panel--reviews panel entry-content wc-tab mt-2"
            id="tab-reviews"
            role="tabpanel"
            aria-labelledby="tab-title-reviews"
            style={{
              display: activeTab === "reviews" ? "block" : "none",
            }}
          >
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                name="name"
                value={reviewData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <div className="d-flex align-items-center">
                <TextField
                  label="Email"
                  name="email"
                  value={reviewData.email}
                  onChange={handleInputChange}
                  type="email"
                  fullWidth
                  margin="normal"
                  required
                />

                <Rating
                  name="rating"
                  value={reviewData.ratings}
                  onChange={(event, newValue) =>
                    setReviewData({ ...reviewData, ratings: newValue })
                  }
                  precision={0.5}
                  size="medium"
                />
              </div>

              <TextField
                label="Review"
                name="review"
                value={reviewData.review}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Submit Review
              </Button>
            </form>
          </div>
        </section>
        <div className="productReviews mt-4 w-50">
          <Typography variant="h6">Product Reviews</Typography>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review">
                <div className="review-header">
                  <Typography variant="subtitle1" className="reviewer-name">
                    {review.CustomerName}
                  </Typography>

                  <div className="review-rating">
                    <Rating
                      name="read-only"
                      value={review.ratings}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </div>
                  <Typography variant="caption" className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
                <Typography variant="body2" className="review-text">
                  {review.review}
                </Typography>
              </div>
            ))
          ) : (
            <Typography variant="body2" className="no-reviews">
              No reviews yet.
            </Typography>
          )}
        </div>
      </section>

      <RecentlyViewedProducts title="Recently Viewed Products" />

      <RelatedProducts
        id={product._id}
        subcat={product.subCat}
        brand={product.brand}
        title="Related Products"
      />
    </section>
  );
};

export default ProductDetails;
