import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { currentUser, isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleAdminMenu = () => {
    setAdminMenuOpen(!adminMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (adminMenuOpen) setAdminMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenus = (e) => {
    if (!e.target.closest('.menu-container')) {
      setAdminMenuOpen(false);
      setUserMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', closeMenus);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', closeMenus);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black to-gray-800 px-4 py-3 flex items-center justify-between shadow">

      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white flex items-center group">
              <span className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300">Rent</span>
              <span className="text-white group-hover:text-gray-200 transition-colors duration-300">MyCar</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/cars" 
              className={`hover:text-blue-400 transition-all duration-300 relative ${
                isActive('/cars') ? 'text-blue-400' : 'text-gray-200'
              }`}
            >
              Browse Cars
              {isActive('/cars') && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 transform scale-x-100 origin-left transition-transform duration-300"></span>
              )}
              {!isActive('/cars') && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link 
                    to="/dashboard" 
                    className={`hover:text-blue-400 transition-all duration-300 relative ${
                      isActive('/dashboard') ? 'text-blue-400' : 'text-gray-200'
                    }`}
                  >
                    Dashboard
                    {isActive('/dashboard') && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 transform scale-x-100 origin-left transition-transform duration-300"></span>
                    )}
                  </Link>
                )}

                {isAdmin && (
                  <div className="relative menu-container">
                    <button
                      className={`hover:text-blue-400 focus:outline-none transition-all duration-300 flex items-center ${
                        adminMenuOpen ? 'text-blue-400' : 'text-gray-200'
                      }`}
                      onClick={toggleAdminMenu}
                    >
                      Admin
                      <svg
                        className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                          adminMenuOpen ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    {adminMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg py-2 z-20 border border-gray-700 transform transition-all duration-200 origin-top-right animate-fadeIn">
                        <Link
                          to="/admin/cars"
                          className="block px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                          </svg>
                          Manage Cars
                        </Link>
                        <Link
                          to="/admin/bookings"
                          className="block px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          Manage Bookings
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div className="relative menu-container">
                  <button
                    className={`hover:text-blue-400 focus:outline-none transition-all duration-300 flex items-center ${
                      userMenuOpen ? 'text-blue-400' : 'text-gray-200'
                    }`}
                    onClick={toggleUserMenu}
                  >
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-2 border border-gray-600">
                      <span className="font-medium text-sm">{currentUser?.username?.[0]?.toUpperCase() || 'A'}</span>
                    </div>
                    <span className="mr-1">{currentUser?.username || 'Account'}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        userMenuOpen ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg py-2 z-20 border border-gray-700 transform transition-all duration-200 origin-top-right animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{currentUser?.email || currentUser?.username}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-200 hover:text-blue-400 transition-all duration-300 relative group">
                  Login
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="text-gray-200 hover:text-white focus:outline-none" 
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
