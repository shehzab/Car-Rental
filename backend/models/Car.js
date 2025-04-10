import mongoose from 'mongoose';

const carSchema = mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Please add the car make']
    },
    model: {
      type: String,
      required: [true, 'Please add the car model']
    },
    year: {
      type: Number,
      required: [true, 'Please add the car year'],
      min: [1900, 'Year must be at least 1900'],
      max: [2099, 'Year must be at most 2099']
    },
    price: {
      type: Number,
      required: [true, 'Please add the rental price per day'],
      min: [0, 'Price must be a positive number']
    },
    seats: {
      type: Number,
      required: [true, 'Please add the number of seats'],
      min: [1, 'Car must have at least 1 seat'],
      max: [10, 'Car cannot have more than 10 seats']
    },
    transmission: {
      type: String,
      required: [true, 'Please specify the transmission type'],
      enum: ['automatic', 'manual']
    },
    fuelType: {
      type: String,
      required: [true, 'Please specify the fuel type'],
      enum: ['petrol', 'diesel', 'electric', 'hybrid']
    },
    available: {
      type: Boolean,
      default: true
    },
    imageUrl: {
      type: String
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Car = mongoose.model('Car', carSchema);

export default Car;