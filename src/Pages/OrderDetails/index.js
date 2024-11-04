import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Paper, Divider } from '@mui/material';
import { fetchDataFromApi } from '../../utils/api'; // Adjust the path as needed

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const data = await fetchDataFromApi(`/api/order/order/${orderId}`);
        setOrderData(data);
      } catch (error) {
        console.error('Error fetching order data', error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (!orderData) {
    return <Typography>Loading...</Typography>;
  }

  return (
     <section className="Details section">
      <div className="container">
        <div className="row">
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Order Details
          </Typography>
          <Divider />
          <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
            Order ID: {orderData._id}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Date: {new Date(orderData.date).toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Status: {orderData.orderStatus}
          </Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6" gutterBottom>
            Customer Information
          </Typography>
          <Typography variant="body1">
            Name: {orderData.name}
          </Typography>
          <Typography variant="body1">
            Email: {orderData.email}
          </Typography>
          <Typography variant="body1">
            Phone: {orderData.phoneNumber}
          </Typography>
          <Typography variant="body1">
            Address: {`${orderData.address?.streetAddressLine1}, ${orderData.address?.streetAddressLine2}, ${orderData.address?.city}, ${orderData.address?.state}, ${orderData.address?.country}, ${orderData.address?.pincode}`}
          </Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6" gutterBottom>
            Items
          </Typography>
          {orderData.items.map((item) => (
            <Typography key={item._id} variant="body1">
              {item.productName} x {item.quantity} - ₹{item.price}
            </Typography>
          ))}
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1">
            Shipping Method: {orderData.shippingMethod}
          </Typography>
          <Typography variant="body1">
            Payment Method: {orderData.paymentMethod}
          </Typography>
          <Typography variant="body1">
            Order Notes: {orderData.orderNotes}
          </Typography>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Total Amount: ₹{orderData.totalAmount}
          </Typography>
          <Typography variant="body1">
            Payment Status: {orderData.paymentStatus}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
    </div>
    </div>
    </section>
  );
};

export default OrderDetails;
