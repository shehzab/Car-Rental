import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// Set auth token for axios requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get all cars
export const getAllCars = async () => {
  try {
    const response = await axios.get(`${API_URL}/cars`);
    // Ensure we return the array of cars directly
    return response.data.data || [];
  } catch (error) {
    console.error('Error in getAllCars:', error);
    return [];
  }
};

// Get car by ID
export const getCarById = async (carId) => {
  try {
    const response = await axios.get(`${API_URL}/cars/${carId}`);
    return { car: response.data }; // ✅ wrap in { car: ... }
  } catch (error) {
    console.error('Error in getCarById:', error);
    throw error.response?.data || { message: 'Error fetching car details' };
  }
};

// Admin: Create a new car
export const createCar = async (carData, token) => {
  setAuthToken(token);
  try {
    const response = await axios.post(`${API_URL}/admin/cars`, carData);
    return response.data.car || response.data;
  } catch (error) {
    console.error('Error in createCar:', error);
    throw error.response?.data || { message: 'Error creating car' };
  }
};

// Admin: Update car
export const updateCar = async (carId, carData, token) => {
  setAuthToken(token);
  try {
    const response = await axios.put(`${API_URL}/admin/cars/${carId}`, carData);
    return response.data.car || response.data;
  } catch (error) {
    console.error('Error in updateCar:', error);
    throw error.response?.data || { message: 'Error updating car' };
  }
};

// Admin: Delete car
export const deleteCar = async (carId, token) => {
  setAuthToken(token);
  try {
    const response = await axios.delete(`${API_URL}/admin/cars/${carId}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteCar:', error);
    throw error.response?.data || { message: 'Error deleting car' };
  }
};

// Filter cars by criteria
export const filterCars = async (filters) => {
  try {
    const response = await axios.get(`${API_URL}/cars/filter`, { params: filters });
    return response.data.cars || response.data || [];
  } catch (error) {
    console.error('Error in filterCars:', error);
    return [];
  }
};

// Check car availability for specific dates
export const checkCarAvailability = async (carId, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/cars/${carId}/availability`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error in checkCarAvailability:', error);
    throw error.response?.data || { message: 'Error checking availability' };
  }
};

// Get featured/popular cars
export const getFeaturedCars = async () => {
  try {
    const response = await axios.get(`${API_URL}/cars/featured`);
    return response.data.cars || response.data || [];
  } catch (error) {
    console.error('Error in getFeaturedCars:', error);
    return [];
  }
};

// Upload car image
export const uploadCarImage = async (carId, imageFile, token) => {
  setAuthToken(token);
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await axios.post(`${API_URL}/admin/cars/${carId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in uploadCarImage:', error);
    throw error.response?.data || { message: 'Error uploading image' };
  }
};