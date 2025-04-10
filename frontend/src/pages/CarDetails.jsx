import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BookingModal from '../components/BookingModal';
import axios from 'axios';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        // Get the API URL from environment variables or use the default
        const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API}/cars/${id}`);
        console.log('Car data fetched:', res.data);
        setCar(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load car details', err);
        setError('Failed to load car details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="animate-pulse flex space-x-2">
        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-red-900 bg-opacity-50 p-6 rounded-xl border border-red-700 text-white max-w-md">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!car) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700 text-white max-w-md">
        <h2 className="text-xl font-bold mb-2">No Car Found</h2>
        <p>Could not find details for this vehicle.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {car.make} {car.model}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded mb-6"></div>
          </div>

          {/* Car Image */}
          {car.imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
              <img 
                src={car.imageUrl} 
                alt={`${car.make} ${car.model}`} 
                className="w-full h-64 object-cover object-center"
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Vehicle Specifications</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-300">Year: <span className="text-white font-medium">{car.year}</span></p>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-300">Price/Day: <span className="text-white font-medium">${car.price}</span></p>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-300">Seats: <span className="text-white font-medium">{car.seats}</span></p>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-gray-300">Fuel Type: <span className="text-white font-medium">{car.fuelType && car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1)}</span></p>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <p className="text-gray-300">Transmission: <span className="text-white font-medium">{car.transmission && car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}</span></p>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-300">Available: <span className="text-white font-medium">{car.available ? 'Yes' : 'No'}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">About this Vehicle</h2>
              <p className="text-gray-300">{car.description || 'No description available for this vehicle.'}</p>
            </div>
          </div>
          
          {/* Features Highlights */}
          <div className="mb-8">
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Features Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                  <div className="mr-3 bg-blue-900 bg-opacity-30 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Model Year</p>
                    <p className="text-white font-medium">{car.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                  <div className="mr-3 bg-green-900 bg-opacity-30 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Daily Rate</p>
                    <p className="text-white font-medium">${car.price}/day</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                  <div className="mr-3 bg-purple-900 bg-opacity-30 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Fuel Type</p>
                    <p className="text-white font-medium">{car.fuelType && car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium flex items-center hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 transform hover:scale-105"
              disabled={!car.available}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {car.available ? 'Book Now' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        car={car}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default CarDetails;