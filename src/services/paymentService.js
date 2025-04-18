import API from '../api/api';
import { loadScript } from '../utils/loadScript';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID; // Replace with your test key

export const initializeRazorpay = async () => {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  if (!res) {
    throw new Error('Razorpay SDK failed to load');
  }
};

export const createRazorpayOrder = async (orderId) => {
  try {
    const response = await API.post('/payment/create-razorpay-order', { orderId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create payment order');
  }
};

export const processPayment = async (orderDetails, onSuccess, onFailure) => {
  try {
    await initializeRazorpay();
    
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: 'Fabrico Ecom',
      description: `Order Payment #${orderDetails.orderId}`,
      order_id: orderDetails.razorpayOrderId,
      handler: async (response) => {
        try {
          const verificationResponse = await API.post('/payment/verify-payment', {
            orderId: orderDetails.orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          });
          
          if (verificationResponse.data.success) {
            onSuccess(orderDetails.orderId);
          } else {
            onFailure(orderDetails.orderId);
          }
        } catch (error) {
          onFailure(orderDetails.orderId);
        }
      },
      prefill: {
        name: orderDetails.customerName,
        email: orderDetails.customerEmail,
        contact: orderDetails.customerPhone
      },
      theme: {
        color: '#ef4444'
      },
      modal: {
        ondismiss: () => {
          onFailure(orderDetails.orderId);
        }
      }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  } catch (error) {
    onFailure(orderDetails.orderId);
  }
};