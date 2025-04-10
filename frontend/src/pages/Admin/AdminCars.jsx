import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const AdminCars = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    seats: '',
    transmission: 'automatic',
    fuelType: 'petrol',
    available: true,
    imageUrl: '',
    description: ''
  });

  // Redirect if not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/cars');
      setCars(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openAddModal = () => {
    setFormData({
      make: '',
      model: '',
      year: '',
      price: '',
      seats: '',
      transmission: 'automatic',
      fuelType: 'petrol',
      available: true,
      imageUrl: '',
      description: ''
    });
    setEditMode(false);
    setModalOpen(true);
  };

  const openEditModal = (car) => {
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      seats: car.seats,
      transmission: car.transmission,
      fuelType: car.fuelType,
      available: car.available,
      imageUrl: car.imageUrl || '',
      description: car.description || ''
    });
    setCurrentCar(car);
    setEditMode(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCar(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode && currentCar) {
        await axios.put(`/api/cars/${currentCar._id}`, formData);
        setSuccessMessage('Car updated successfully!');
      } else {
        await axios.post('/api/cars', formData);
        setSuccessMessage('New car added successfully!');
      }
      
      closeModal();
      fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save car');
    }
  };

  const deleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`/api/cars/${carId}`);
        fetchCars();
        setSuccessMessage('Car deleted successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete car');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-blue-400 font-medium text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Manage Cars</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Car
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Car Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Specifications
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {cars.length > 0 ? (
                  cars.map((car) => (
                    <tr key={car._id} className="hover:bg-gray-750">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {car.imageUrl ? (
                            <img className="h-16 w-24 object-cover rounded-md mr-4" src={car.imageUrl} alt={`${car.make} ${car.model}`} />
                          ) : (
                            <div className="h-16 w-24 bg-gray-700 rounded-md flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{car.make} {car.model}</div>
                            <div className="text-sm text-gray-400">{car.year}</div>
                            <div className="font-bold text-blue-400">${car.price}/day</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div><span className="text-gray-400">Seats:</span> {car.seats}</div>
                          <div><span className="text-gray-400">Transmission:</span> {car.transmission}</div>
                          <div><span className="text-gray-400">Fuel:</span> {car.fuelType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${car.available ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                          {car.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(car)}
                            className="text-indigo-400 hover:text-indigo-300 transition duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteCar(car._id)}
                            className="text-red-400 hover:text-red-300 transition duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <p className="text-xl font-medium">No cars found</p>
                        <p className="mt-1">Click 'Add New Car' to add a car to the fleet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Car Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-medium text-white">
                {editMode ? 'Edit Car' : 'Add New Car'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    min="1900"
                    max="2099"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Price per Day ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Seats</label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="20"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Fuel Type</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/car-image.jpg"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
                    />
                    <label className="ml-2 block text-sm text-gray-300">Available for rent</label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
                >
                  {editMode ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars;