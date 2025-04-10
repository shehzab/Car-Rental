import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';

const BookingCard = ({ booking }) => {
  const { updateBookingStatus } = useBooking();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Format date to display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate booking duration
  const calculateDuration = () => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays;
  };

  // Get status color
  const getStatusColor = () => {
    switch (booking.status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status update
  const handleStatusUpdate = async (status) => {
    try {
      setIsUpdating(true);
      await updateBookingStatus(booking._id, status);
      setIsUpdating(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">
              {booking.car?.make} {booking.car?.model}
            </h3>
            <p className="text-sm text-gray-600">
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor()}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Price:</span>
            <span className="font-bold">${booking.totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-700">Duration:</span>
            <span>{calculateDuration()} days</span>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center focus:outline-none"
        >
          {isExpanded ? 'Show less' : 'Show more'}
          <svg 
            className={`ml-1 w-4 h-4 transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600">Pick-up Location:</p>
                <p className="font-medium">{booking.pickupLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Drop-off Location:</p>
                <p className="font-medium">{booking.dropoffLocation}</p>
              </div>
            </div>
            
            {booking.additionalServices && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">Additional Services:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {booking.additionalServices.insurance && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Insurance</span>
                  )}
                  {booking.additionalServices.childSeat && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Child Seat</span>
                  )}
                  {booking.additionalServices.gps && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">GPS</span>
                  )}
                  {!booking.additionalServices.insurance && 
                   !booking.additionalServices.childSeat && 
                   !booking.additionalServices.gps && (
                    <span className="text-gray-500 text-sm">None</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">Payment Status:</p>
              <span className={`text-sm px-2 py-1 rounded ${
                booking.paymentStatus === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : booking.paymentStatus === 'refunded'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </span>
            </div>
            
            {/* Actions */}
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <div className="mt-4 flex flex-wrap gap-2">
                {booking.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={isUpdating}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-50"
                  >
                    {isUpdating ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;