import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllCars,
  createCar,
  updateCar,
  deleteCar
} from '../controllers/carController.js';

// Import any booking controllers you might need
import bookingController from '../controllers/bookingController.js';

const { getAllBookings, updateBookingStatus } = bookingController;


const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);

// Check if user is admin
const checkAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin only'
    });
  }
  next();
};

// Admin car routes
router.get('/cars', checkAdmin, getAllCars);
router.post('/cars', checkAdmin, createCar);
router.put('/cars/:id', checkAdmin, updateCar);
router.delete('/cars/:id', checkAdmin, deleteCar);

// Admin booking routes (commented out until you implement booking controller)
router.get('/bookings', checkAdmin, getAllBookings);
router.put('/bookings/:id/status', checkAdmin, updateBookingStatus);

// Get admin dashboard stats
router.get('/stats', checkAdmin, async (req, res) => {
  try {
    // This is a placeholder - you'll need to implement your actual stats
    // gathering logic based on your specific needs
    
    res.status(200).json({
      success: true,
      data: {
        totalCars: 0, // replace with actual count
        availableCars: 0, // replace with actual count
        totalBookings: 0, // replace with actual count
        activeBookings: 0, // replace with actual count
        revenue: {
          today: 0,
          thisWeek: 0,
          thisMonth: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;