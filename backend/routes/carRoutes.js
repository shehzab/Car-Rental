import express from 'express';
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  toggleAvailability
} from '../controllers/carController.js';
import { protect } from '../middleware/auth.js';
import Car from '../models/Car.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error fetching car by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public routes
router.get('/', getAllCars);
router.get('/:id', getCarById);



// Protected routes (admin only)
router.post('/', protect, createCar);
router.put('/:id', protect, updateCar);
router.delete('/:id', protect, deleteCar);
router.patch('/:id/toggle-availability', protect, toggleAvailability);

export default router;