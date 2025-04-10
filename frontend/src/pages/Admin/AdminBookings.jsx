import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser || !currentUser.isAdmin) {
      navigate('/login');
      return;
    }

    fetchAllBookings();
  }, [currentUser, authLoading, navigate]);

  const fetchAllBookings = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/bookings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/bookings/${bookingId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBookings(bookings.map(booking =>
        booking._id === bookingId
          ? { ...booking, status }
          : booking
      ));
    } catch (err) {
      setError('Failed to update booking status. Please try again later.');
      console.error('Error updating booking status:', err);
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  if (authLoading || loadingData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-blue-400 font-medium text-lg">Loading bookings...</p>
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
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-blue-400 border-b border-gray-800 pb-4">
          Manage Bookings
        </h1>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 transition-all duration-300 hover:shadow-blue-900/20">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0">Booking Administration</h2>

            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                    filter === status 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-gray-700 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-400 text-lg">No bookings found for the selected filter.</p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
                >
                  Show All Bookings
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700 border-b border-gray-600">
                    <th className="p-4 text-left text-gray-300">User</th>
                    <th className="p-4 text-left text-gray-300">Car</th>
                    <th className="p-4 text-left text-gray-300">Pickup Date</th>
                    <th className="p-4 text-left text-gray-300">Return Date</th>
                    <th className="p-4 text-left text-gray-300">Total Price</th>
                    <th className="p-4 text-left text-gray-300">Status</th>
                    <th className="p-4 text-left text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr 
                      key={booking._id} 
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="p-4 text-gray-300">
                        {booking.user?.email || booking.user?.name || 'Unknown User'}
                      </td>
                      <td className="p-4 text-white font-medium">
                        {booking.car?.make} {booking.car?.model}
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
                      <td className="p-4 font-mono font-medium text-green-400">
                        ${booking.totalPrice.toFixed(2)}
                      </td>
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
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded hover:shadow-lg transition-all duration-200 text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded hover:shadow-lg transition-all duration-200 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
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

        {/* Admin Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 transition-all duration-300 hover:shadow-blue-900/20">
            <div className="flex items-center">
              <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-white text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 transition-all duration-300 hover:shadow-yellow-900/20">
            <div className="flex items-center">
              <div className="bg-yellow-900/30 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending Bookings</p>
                <p className="text-white text-2xl font-bold">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 transition-all duration-300 hover:shadow-green-900/20">
            <div className="flex items-center">
              <div className="bg-green-900/30 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Confirmed Bookings</p>
                <p className="text-white text-2xl font-bold">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;