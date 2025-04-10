import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import mongoose from 'mongoose';

// Check availability
const checkAvailability = async (req, res) => {
  const { carId, startDate, endDate } = req.query;

  if (!carId || !startDate || !endDate) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  const bookings = await Booking.find({
    car: carId,
    $or: [
      { startDate: { $lte: endDate, $gte: startDate } },
      { endDate: { $lte: endDate, $gte: startDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
    ],
  });

  if (bookings.length > 0) {
    return res.status(400).json({ available: false, message: 'Car not available for selected dates' });
  }

  res.status(200).json({ available: true });
};

// Create a booking
const createBooking = async (req, res) => {
  try {
    const {
      carId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      additionalServices
    } = req.body;

    const userId = req.user._id;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const diffTime = Math.abs(endDateTime - startDateTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let totalPrice = car.price * diffDays;

    if (additionalServices) {
      if (additionalServices.insurance) totalPrice += 15 * diffDays;
      if (additionalServices.childSeat) totalPrice += 5 * diffDays;
      if (additionalServices.gps) totalPrice += 10 * diffDays;
    }

    const newBooking = await Booking.create({
      user: userId,
      car: carId,
      startDate: startDateTime,
      endDate: endDateTime,
      pickupLocation,
      dropoffLocation,
      totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
      additionalServices: additionalServices || {},
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: 'Booking creation failed', error: error.message });
  }
};

// Get all bookings (admin)
const getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate('user car');
  res.status(200).json(bookings);
};

// Get bookings for current user
const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('car');
  res.status(200).json(bookings);
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('user car');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const isOwner = booking.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.status(200).json(booking);
};

// Update booking status (e.g., confirmed, cancelled)
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  booking.status = status;
  await booking.save();

  res.status(200).json(booking);
};

// Update payment status (admin only)
const updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  booking.paymentStatus = paymentStatus;
  await booking.save();

  res.status(200).json(booking);
};

// Delete a booking
const deleteBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const isOwner = booking.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  await booking.remove();
  res.status(200).json({ message: 'Booking deleted' });
};

export default {
  checkAvailability,
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  deleteBooking,
};
