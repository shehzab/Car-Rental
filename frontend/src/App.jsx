import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminCars from './pages/Admin/AdminCars';
import AdminBookings from './pages/Admin/AdminBookings';
import BookingForm from './pages/BookingForm';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import { BookingProvider } from './context/BookingContext';
const App = () => {
  return (
    <Router>
      <BookingProvider>
      <div className=" min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-20">
        <main >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking/:carId"
              element={
                <PrivateRoute>
                  <BookingForm />
                </PrivateRoute>
              }
            />
            
            {/* Admin-only Routes */}
            <Route
              path="/admin/cars"
              element={
                <AdminRoute>
                  <AdminCars />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              }
            />
            
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        </div>
        <Footer />
      </div>
      </BookingProvider>
    </Router>
  );
};

export default App;