import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropoffLocation: {
    type: String,
    required: true
  },
  additionalServices: {
    insurance: {
      type: Boolean,
      default: false
    },
    childSeat: {
      type: Boolean,
      default: false
    },
    gps: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

// Validate that end date is after start date
bookingSchema.pre('validate', function (next) {
  if (this.startDate >= this.endDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});

// Method to calculate booking duration in days
bookingSchema.methods.getDuration = function () {
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
