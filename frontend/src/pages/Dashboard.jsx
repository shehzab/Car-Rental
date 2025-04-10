import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserBookings } from '../api/bookings'; 
import axios from 'axios';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings();
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [currentUser, navigate]);

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(bookings.map((booking) =>
        booking._id === bookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    } catch (err) {
      setError('Failed to cancel booking. Please try again later.');
      console.error('Error cancelling booking:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-blue-400 font-medium text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen w-full text-center p-8">
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
    <div className="w-full px-4 py-12 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-blue-400 border-b border-gray-800 pb-4">My Dashboard</h1>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 transition-all duration-300 hover:shadow-blue-900/20">
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
          <span className="bg-blue-600 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
          </span>
          My Bookings
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-gray-700 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <p className="text-gray-400 text-lg mb-4">You don't have any bookings yet.</p>
            <button 
              onClick={() => navigate('/cars')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-300 shadow-lg hover:shadow-blue-600/50"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-700 border-b border-gray-600">
                  <th className="p-4 text-left text-gray-300">Car</th>
                  <th className="p-4 text-left text-gray-300">Pickup Date</th>
                  <th className="p-4 text-left text-gray-300">Return Date</th>
                  <th className="p-4 text-left text-gray-300">Total Price</th>
                  <th className="p-4 text-left text-gray-300">Status</th>
                  <th className="p-4 text-left text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr 
                    key={booking._id} 
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="bg-gray-600 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <span className="font-medium text-white">
                          {booking.car?.make} {booking.car?.model}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(booking.pickupDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(booking.returnDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4 font-mono font-medium text-green-400">${booking.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-green-900/30 text-green-400 border border-green-500'
                            : booking.status === 'pending'
                            ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500'
                            : 'bg-red-900/30 text-red-400 border border-red-500'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded hover:shadow-lg transition-all duration-200 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* User Quick Info */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 transition-all duration-300 hover:shadow-blue-900/20">
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
          <span className="bg-blue-600 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </span>
          Account Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Email</p>
            <p className="text-white">{currentUser.email}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Name</p>
            <p className="text-white">{currentUser.name || 'Not provided'}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Member Since</p>
            <p className="text-white">{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Account Type</p>
            <p className="text-white">{currentUser.isAdmin ? 'Administrator' : 'Standard User'}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => navigate('/profile')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 shadow hover:shadow-blue-600/50"
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;