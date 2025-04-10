import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarCard } from '../components/cars/CarCard';
import { getAllCars } from '../api/cars';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'price-low',
    transmission: '',
    fuelType: ''
  });
  const [filteredCars, setFilteredCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await getAllCars();
        
        const carsData = response.cars || response || [];
        
        // Ensure we have an array before setting state
        if (Array.isArray(carsData)) {
          setCars(carsData);
          setFilteredCars(carsData);
        } else {
          console.error('Unexpected API response format:', response);
          setCars([]);
          setFilteredCars([]);
          setError('Received invalid data format from server');
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again later.');
        setCars([]);
        setFilteredCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Apply filters and sorting whenever cars or filters change
  useEffect(() => {
    if (!cars.length) return;
    
    let result = [...cars];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(car => 
        car.make.toLowerCase().includes(searchLower) || 
        car.model.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply transmission filter
    if (filters.transmission) {
      result = result.filter(car => car.transmission === filters.transmission);
    }
    
    // Apply fuel type filter
    if (filters.fuelType) {
      result = result.filter(car => car.fuelType === filters.fuelType);
    }
    
    // Apply sorting
    if (filters.sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'name') {
      result.sort((a, b) => a.make.localeCompare(b.make));
    }
    
    setFilteredCars(result);
  }, [cars, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      sort: 'price-low',
      transmission: '',
      fuelType: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-blue-400 font-medium text-lg">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-center p-8">
        <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-red-400 mb-6 text-lg">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-blue-400 border-b border-gray-800 pb-4">
          Available Cars
        </h1>
        
        {/* Filters Section */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="w-full lg:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by make or model..."
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/6">
              <select
                name="transmission"
                value={filters.transmission}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Transmissions</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            <div className="w-full lg:w-1/6">
              <select
                name="fuelType"
                value={filters.fuelType}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Fuel Types</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            <div className="w-full lg:w-1/6">
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            
            <button
              onClick={resetFilters}
              className="w-full lg:w-auto bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {filteredCars.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No cars match your filters</h3>
            <p className="text-gray-400 mb-4">Try changing your search criteria or reset filters.</p>
            <button 
              onClick={resetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div 
                key={car._id} 
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  {car.imageUrl ? (
                    <img 
                      src={car.imageUrl} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-700 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-xs font-bold">
                    {car.fuelType}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold text-white">
                      {car.make} {car.model}
                    </h2>
                    <span className="bg-blue-900/30 text-blue-400 border border-blue-500 px-2 py-1 rounded text-xs">
                      {car.year}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="text-gray-400 text-sm">{car.seats} seats</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-400 text-sm">{car.transmission}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-400">
                      ${car.price}
                      <span className="text-sm text-gray-400 font-normal">/day</span>
                    </div>
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                        onClick={() => navigate(`/cars/${car._id}`)}
                      >
                        View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;