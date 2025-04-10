import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.options('*', cors());

// Middleware
app.use(express.json()); // Parse JSON bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Car Rental API Running 🚗');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Optional: Only log route paths in a safe way
  try {
    app._router.stack
      .filter(r => r.route && r.route.path)
      .forEach(r => {
        const methods = Object.keys(r.route.methods).map(m => m.toUpperCase()).join(',');
        console.log(`[ROUTE] ${methods} ${r.route.path}`);
      });
  } catch (e) {
    console.warn("⚠️ Could not print routes:", e.message);
  }
});
