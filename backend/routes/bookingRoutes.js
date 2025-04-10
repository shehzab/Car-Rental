import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { protect as auth } from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';
console.log('📦 bookingRoutes.js loaded');


const router = express.Router();

router.get('/check-availability', bookingController.checkAvailability);

router.post('/', auth, bookingController.createBooking);
router.post('/', auth, (req, res) => {
  console.log('✅ POST /api/bookings HIT');
  res.json({ message: 'it worked' });
});

router.get('/all', auth, roleCheck('admin'), bookingController.getAllBookings);

router.get('/me', auth, bookingController.getUserBookings);

router.get('/:id', auth, bookingController.getBookingById);

router.put('/:id/status', auth, bookingController.updateBookingStatus);

router.put('/:id/payment', auth, roleCheck('admin'), bookingController.updatePaymentStatus);

router.delete('/:id', auth, bookingController.deleteBooking);

export default router;
