import API from './api.js';

export const createOfferApi = async (data) => {
  try {
    const response = await API.post('/offers', data);
    return response;
  } catch (error) {
    console.error('Error creating offer:', error.response?.data || error);
    throw error;
  }
};

export const getAllOffersApi = async (params) => {
  try {
    const response = await API.get('/offers', { params });
    return response;
  } catch (error) {
    console.error('Error fetching offers:', error.response?.data || error);
    throw error;
  }
};

export const updateOfferApi = async (offerId, data) => {
  try {
    const response = await API.put(`/offers/${offerId}`, data);
    return response;
  } catch (error) {
    console.error('Error updating offer:', error.response?.data || error);
    throw error;
  }
};

export const toggleOfferStatusApi = async (offerId) => {
  try {
    const response = await API.put(`/offers/${offerId}/toggle-status`);
    return response;
  } catch (error) {
    console.error('Error toggling offer status:', error.response?.data || error);
    throw error;
  }
};