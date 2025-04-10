import { useState, useEffect } from 'react';
import axios from 'axios';

const useCars = () => {
  const [cars, setCars] = useState([]);
  const [currentCar, setCurrentCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/cars');
      setCars(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a single car by ID
  const getCarById = async (id) => {
    try {
      setLoading(true);
      setCurrentCar(null); // Reset current car
      const res = await axios.get(`/api/cars/${id}`);
      setCurrentCar(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all cars on initial load
  useEffect(() => {
    fetchCars();
  }, []);

  return { 
    cars, 
    currentCar,
    getCarById,
    loading, 
    error,
    fetchCars // Optional: in case you need to refresh the list
  };
};

export default useCars;