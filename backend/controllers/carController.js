import Car from '../models/Car.js';

// Get all cars
export const getAllCars = async (req, res) => {
  try {
    // Allow filtering by query parameters
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Create query
    let query = Car.find(queryObj);
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    // Execute query
    const cars = await query;
    
    // Count total documents for pagination
    const totalCars = await Car.countDocuments(queryObj);
    
    res.status(200).json({
      success: true,
      count: cars.length,
      total: totalCars,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCars / limit)
      },
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new car
export const createCar = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add cars'
      });
    }
    
    const car = await Car.create(req.body);
    
    res.status(201).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update car
export const updateCar = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update cars'
      });
    }
    
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete car
export const deleteCar = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete cars'
      });
    }
    
    const car = await Car.findByIdAndDelete(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle car availability
export const toggleAvailability = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update car availability'
      });
    }
    
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    car.available = !car.available;
    await car.save();
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};