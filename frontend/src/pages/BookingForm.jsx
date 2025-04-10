import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCarById } from '../api/cars';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const BookingForm = () => {
  const { carId } = useParams();
  const { currentUser } = useAuth();

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  useEffect(() => {
    console.log('BookingForm mounted!');
    console.log('carId from route:', carId);

    if (!carId) {
      console.warn('Missing carId from route params!');
      return;
    }

    const fetchCar = async () => {
      try {
        const carData = await getCarById(carId);
        console.log('✅ Car fetched:', carData);
        setCar(carData);
      } catch (err) {
        console.error('❌ Failed to fetch car:', err);
        alert('Car details not found.');
      }
    };

    fetchCar();
  }, [carId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting booking...');
    console.log('car state:', car);

    if (!car) {
      alert('❗ Car details are not loaded.');
      return;
    }

    try {
      const booking = {
        car: car._id,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        customer: currentUser ? currentUser._id : 'N/A'
      };

      console.log('Sending booking:', booking);

      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API}/bookings`, booking);

      console.log('✅ Booking successful:', response.data);
      alert('Booking successful!');
    } catch (error) {
      console.error('❌ Booking failed:', error);
      alert('Booking failed.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md p-8">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            Book Your Ride
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Pickup Location</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter pickup location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Dropoff Location</label>
              <input
                type="text"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter dropoff location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Customer</label>
              <input
                type="text"
                value={currentUser ? currentUser.name : 'N/A'}
                disabled
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 transform hover:scale-[1.02]"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;