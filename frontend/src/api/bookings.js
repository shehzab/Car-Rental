import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/bookings`;
console.log('📦 Booking API URL:', API_URL);


// Create a new booking
export const createBooking = async (bookingData) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

    // 👇 Add these logs for debugging
  console.log('🌍 API URL:', API_URL);
  console.log('🔐 Token:', token);
  console.log('📦 Booking Data:', bookingData);

  const response = await axios.post(API_URL, bookingData, config);
  return response.data;
};

// Get user bookings
export const getUserBookings = async () => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/me`, config);
  return response.data;
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/${bookingId}`, config);
  return response.data;
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${bookingId}/status`, { status }, config);
  return response.data;
};

// Check car availability
export const checkCarAvailability = async (carId, startDate, endDate) => {
  const params = new URLSearchParams({
    carId,
    startDate,
    endDate,
  });

  const response = await axios.get(`${API_URL}/check-availability?${params}`);
  return response.data;
};

// Admin: Get all bookings
export const getAllBookings = async () => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/all`, config);
  return response.data;
};

// Admin: Update payment status
export const updatePaymentStatus = async (bookingId, paymentStatus) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${bookingId}/payment`, { paymentStatus }, config);
  return response.data;
};


