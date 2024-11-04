import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchDataFromApi, removeCartItem } from "../../utils/api"; // Adjust the path as needed

const Orders = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // For selected product details
  const [dialogOpen, setDialogOpen] = useState(false); // For dialog box
  const [page, setPage] = useState(0); // Pagination: Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Pagination: Orders per page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchDataFromApi(`/api/order/user/${userId}`);

        if (response && Array.isArray(response)) {
          setOrders(response);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
    setSelectedProduct(null); // Reset the selected product
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await removeCartItem(`/api/order/${orderId}`, orderId ); // Adjust API path if needed
      if (response) {
        setOrders(orders.filter((order) => order._id !== orderId)); // Remove deleted order from state
        alert("Order deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order.");
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="orders-container">
      <h5>Orders for User ID: {userId}</h5>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Name(s)</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Address</th>
            <th>Order Date</th>
            <th>Actions</th> {/* Added Actions column for Delete */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Apply pagination
              .map((order) => (
                <tr key={order.orderId}>
                  <td
                    style={{ cursor: "pointer", color: "#2d09bd" }}
                    onClick={() => navigate(`/order/${order._id}`)} // Navigate to order details page
                  >
                    {order.orderId}
                  </td>
                  <td>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleProductClick(item)} // Click to open dialog
                        style={{
                          cursor: "pointer",
                          color: "#2d09bd",
                        }}
                      >
                        {item.productName?.substr(0, 20) + "..."} *{" "}
                        {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>{order.totalAmount}</td>
                  <td>
                    {order.paymentStatus}
                    <br /> {order.paymentId}
                  </td>
                  <td>
                    {order?.orderStatus === "processing" ? (
                      <span className="badge badge-danger">
                        {order.orderStatus}
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        {order.orderStatus}
                      </span>
                    )}
                  </td>
                  <td>
                    {order.address?.streetAddressLine1}, {order.address?.city}
                    <br /> {order.address?.state}
                  </td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>
                    <IconButton
                      onClick={() => handleDeleteOrder(order._id)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="9">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Dialog Box for Product Details */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <div>
              {selectedProduct.image && (
                <img
                  src={`https://ecommerce-shopping-server.onrender.com/uploads/${selectedProduct.image}`}
                  alt={selectedProduct.productName}
                  style={{
                    width: "100%",
                    maxHeight: "240px",
                    objectFit: "contain",
                    marginBottom: "5px",
                  }}
                />
              )}
              <table className="product-details-table">
                <tbody>
                  <tr>
                    <td>
                      <strong>Product Name:</strong>
                    </td>
                    <td>{selectedProduct.productName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Quantity:</strong>
                    </td>
                    <td>{selectedProduct.quantity}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Price:</strong>
                    </td>
                    <td>₹{selectedProduct.price}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Subtotal:</strong>
                    </td>
                    <td>
                      ₹{selectedProduct.quantity * selectedProduct.price}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Orders;
