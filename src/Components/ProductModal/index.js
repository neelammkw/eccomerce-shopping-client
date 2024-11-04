import { postData, removeMyListItem } from "../../utils/api";
import React, { useContext, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import QuantityBox from "../QuantityBox";
import { IoIosHeartEmpty, IoMdHeart, IoIosGitCompare } from "react-icons/io";
import { MyContext } from "../../App";
import ProductZoom from "../ProductZoom";
import {  toast } from "react-toastify";
import { LiaCartPlusSolid } from "react-icons/lia";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

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

const StyledDialogContent = styled("div")({
  padding: "10px",
  maxWidth: "800px",
  margin: "auto",
  backgroundColor: "white",
});

const StyledProductHeader = styled("div")({
  display: "flex",
  justifyContent: "left",
  alignItems: "left",
  borderBottom: "1px solid #ddd",
  flexDirection: "column",
});

const StyledProductDetails = styled("div")({
  marginTop: "16px",
});
const ProductModal = React.memo(({ open, onClose, product }) => {


const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const { user, myList, setMyList } = context;
  const [isInList, setIsInList] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");

  // Handlers for size, color, and weight
  const handleSizeChange = (event) => setSelectedSize(event.target.value);
  const handleColorChange = (event) => setSelectedColor(event.target.value);
  const handleWeightChange = (event) => setSelectedWeight(event.target.value);

  // Function to handle adding/removing a product to/from the wishlist
const handleAddToWishlist = async () => {
  if (!user) {
    toast.error("Please log in to add products to My List.");
    return;
  }

  if (isProcessing) return;

  setIsProcessing(true);
  setIsLoading(true); 

  try {
    const wishlistItem = {
      productId: product?._id,
      productName: product?.name,
      image: product?.images[0],
      rating: product?.rating,
      discountPrice: product?.discountPrice,
      userId: user.userId,
    };

    let wishlist = JSON.parse(localStorage.getItem("myList")) || [];
setIsLoading(false); 
    if (isInList) {
      // Remove from wishlist
      const res = await removeMyListItem(
        `/api/my-list/product/${user.userId}/${product?._id}`
      );

      if (res) {
        setIsInList(false);

        const updatedLocalList = JSON.parse(localStorage.getItem("myList")) || [];
        const newLocalList = updatedLocalList.filter(item => item.productId !== product?._id);
        setMyList(newLocalList);
        localStorage.setItem("myList", JSON.stringify(newLocalList));

        toast.success("Item removed from list.");
      } else {
        toast.error("Failed to remove item from list.");
      }
    } else {
      const isAlreadyInList = wishlist.some(
        (item) => item.productId === product._id
      );
      if (isAlreadyInList) {
        toast.error("Product is already in the List.");
        setIsInList(true);
        return;
      }

      // Add to wishlist
      const response = await postData("/api/my-list/add", wishlistItem);
      if (response.status === 201) {
        setIsInList(true);
        toast.success("Product added to My List successfully!");
         const updatedList = [...myList, wishlistItem];
          setMyList(updatedList);
          localStorage.setItem("myList", JSON.stringify(updatedList));

        // wishlist.push(wishlistItem);
        // localStorage.setItem("myList", JSON.stringify(wishlist));
      } else {
        toast.error(response.data.message || "Failed to add product to List.");
      }
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update My List.");
  } finally {
    setIsProcessing(false);
  }
};


  const checkIfInList = () => {
    if (!user || !product._id) return;

    // Check localStorage
    let wishlist = JSON.parse(localStorage.getItem("myList")) || [];
    const productInList = wishlist.some(
      (item) => item.productId === product._id
    );

    if (productInList) {
      setIsInList(productInList);
    }
  };

  useEffect(() => {
    checkIfInList();
  }, [user, product, myList]);

  // Function to add a product to the cart
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
// context.setCartFields([...context.cartFields, updatedCartFields]);

     context.addToCart(updatedCartFields);
  };

  // Function to handle quantity change
  const handleQuantityChange = (newQuantity) => {
    setProductQuantity(newQuantity);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogContent>
        <StyledProductHeader>
          <div className="d-flex headermodal">
            <Typography variant="h6" className="mt-0">
              {product?.name}
            </Typography>
            <div className="product-meta top d-flex align-items-center">
              <div className="sku-wrapper d-flex align-items-center">
                <span>Brands: </span>
                <span className="sku mr-3 ml-2">{product?.brand}</span>
              </div>
              <Rating
                name="read-only"
                value={product?.rating}
                readOnly
                size="small"
                className="align-items-center mb-2"
              />
            </div>
          </div>
          <div className="btnclose">
            <IconButton onClick={onClose}>
              <MdClose />
            </IconButton>
          </div>
        </StyledProductHeader>

        <div className="row mt-2 productDetailModal">
          <div className="col-md-5">
            <ProductZoom images={product?.images || []} />
          </div>
          <div className="col-md-7">
            <div className="productDetails">
              <StyledProductDetails>
                <StyledPrice>
                  <OriginalPrice variant="body2">
                    Rs {product?.price}
                  </OriginalPrice>
                  <DiscountedPrice variant="h6">
                    Rs {product?.discountPrice}
                  </DiscountedPrice>
                </StyledPrice>
                <span className="badge bg-success">IN STOCK</span>
                <Typography variant="body2">{product?.description}</Typography>
                <div className="productSize d-flex align-items-center">
                  <FormControl variant="outlined" style={{ minWidth: 120 }}>
                    <InputLabel>Size</InputLabel>
                    <Select
                      value={selectedSize}
                      onChange={handleSizeChange}
                      label="Size"
                    >
                      {product?.sizes?.split(/[\s,]+/).map((size, index) => (
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
                      {product?.colors?.split(/[\s,]+/).map((color, index) => (
                        <MenuItem key={index} value={color.trim()}>
                          {color.trim()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="d-flex flex-column mb-3">
                  <QuantityBox
                    initialQuantity={productQuantity}
                    onQuantityChange={handleQuantityChange}
                  />
                </div>
              </StyledProductDetails>
              <span className="btnaddtocart mt-2">
                {" "}
                <Button
                  variant="contained"
                  className="addToCartBtn "
                  startIcon={<LiaCartPlusSolid />}
                  onClick={addToCart}
                >
                  Add to Cart
                </Button>
              </span>
              <div className="btngroupmodal mt-2 mb-5">
                <Button
                  variant="outlined"
                  className="addToWishlistBtn mr-3 " 
                  startIcon={
                    isInList ? (
                      <IoMdHeart className="text-danger" />
                    ) : (
                      <IoIosHeartEmpty />
                    )
                  }
                  onClick={handleAddToWishlist}
                >
                  {isInList ? "In WishList" : "Add to List"}
                </Button>
                <Button
                  variant="outlined"
                  className="addToCompareBtn"
                  startIcon={<IoIosGitCompare />}
                >
                  Add to Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      </StyledDialogContent>
    </Dialog>
  ); 
  });



export default ProductModal;
