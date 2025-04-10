import { createContext, useReducer, useContext } from 'react';
import * as bookingAPI from '../api/bookings';

// Context
const BookingContext = createContext();

// Initial State
const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  success: false,
};

// Actions
const actions = {
  REQUEST: 'REQUEST',
  BOOKING_SUCCESS: 'BOOKING_SUCCESS',
  BOOKINGS_SUCCESS: 'BOOKINGS_SUCCESS',
  BOOKING_DETAILS_SUCCESS: 'BOOKING_DETAILS_SUCCESS',
  UPDATE_SUCCESS: 'UPDATE_SUCCESS',
  FAIL: 'FAIL',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  RESET_SUCCESS: 'RESET_SUCCESS',
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case actions.REQUEST:
      return { ...state, loading: true };
    case actions.BOOKING_SUCCESS:
      return { ...state, loading: false, currentBooking: action.payload, success: true };
    case actions.BOOKINGS_SUCCESS:
      return { ...state, loading: false, bookings: action.payload };
    case actions.BOOKING_DETAILS_SUCCESS:
      return { ...state, loading: false, currentBooking: action.payload };
    case actions.UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentBooking: action.payload,
        success: true,
        bookings: state.bookings.map(b =>
          b._id === action.payload._id ? action.payload : b
        ),
      };
    case actions.FAIL:
      return { ...state, loading: false, error: action.payload };
    case actions.CLEAR_ERRORS:
      return { ...state, error: null };
    case actions.RESET_SUCCESS:
      return { ...state, success: false };
    default:
      return state;
  }
};

// Provider
export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Create Booking
  const createBooking = async (bookingData) => {
    try {
      dispatch({ type: actions.REQUEST });
      const res = await bookingAPI.createBooking(bookingData);
      dispatch({ type: actions.BOOKING_SUCCESS, payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ type: actions.FAIL, payload: err.response?.data?.message || 'Failed to create booking' });
      throw err;
    }
  };

  // Get User Bookings
  const getUserBookings = async () => {
    try {
      dispatch({ type: actions.REQUEST });
      const res = await bookingAPI.getUserBookings();
      dispatch({ type: actions.BOOKINGS_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: actions.FAIL, payload: err.response?.data?.message || 'Failed to fetch bookings' });
    }
  };

  // Get Booking By ID
  const getBookingById = async (id) => {
    try {
      dispatch({ type: actions.REQUEST });
      const res = await bookingAPI.getBookingById(id);
      dispatch({ type: actions.BOOKING_DETAILS_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: actions.FAIL, payload: err.response?.data?.message || 'Failed to fetch booking details' });
    }
  };

  // Update Booking Status
  const updateBookingStatus = async (id, status) => {
    try {
      dispatch({ type: actions.REQUEST });
      const res = await bookingAPI.updateBookingStatus(id, status);
      dispatch({ type: actions.UPDATE_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: actions.FAIL, payload: err.response?.data?.message || 'Failed to update booking status' });
    }
  };

  // Check Car Availability
  const checkCarAvailability = async (carId, startDate, endDate) => {
    try {
      const res = await bookingAPI.checkCarAvailability(carId, startDate, endDate);
      return res.data;
    } catch (err) {
      console.error('Availability Error:', err);
      throw err;
    }
  };

  // Admin: Get All Bookings
  const getAllBookings = async () => {
    try {
      dispatch({ type: actions.REQUEST });
      const res = await bookingAPI.getAllBookings();
      dispatch({ type: actions.BOOKINGS_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: actions.FAIL, payload: err.response?.data?.message || 'Failed to fetch all bookings' });
    }
  };

  const clearErrors = () => dispatch({ type: actions.CLEAR_ERRORS });
  const resetSuccess = () => dispatch({ type: actions.RESET_SUCCESS });

  return (
    <BookingContext.Provider
      value={{
        ...state,
        createBooking,
        getUserBookings,
        getBookingById,
        updateBookingStatus,
        checkCarAvailability,
        getAllBookings,
        clearErrors,
        resetSuccess,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
};

export default BookingContext;
