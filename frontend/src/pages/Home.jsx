import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuresRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });
    
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      observer.observe(card);
      // Add initial classes
      card.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
    });
    
    return () => {
      featureCards.forEach(card => observer.unobserve(card));
    };
  }, []);

  return (
    <div className="bg-black text-gray-100">
      {/* Hero Section with animated gradient background */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent opacity-50 animate-pulse"></div>
        </div>
        
        {/* Car silhouette in background */}
        <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-full opacity-10 bg-[url('https://via.placeholder.com/1000')] bg-no-repeat bg-right-bottom bg-contain"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 animate-fadeIn">
              <h1 className="text-6xl md:text-7xl font-bold mb-2">
                <span className="text-gray-400 inline-block animate-slideInUp">Rent</span>
                <span className="text-blue-400 inline-block animate-slideInUp delay-300">My</span>
                <span className="text-white inline-block animate-slideInUp delay-500">Ride</span>
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full animate-expandWidth"></div>
            </div>
            <p className="text-xl md:text-2xl mb-10 text-gray-300 animate-fadeIn opacity-0" style={{animationDelay: "0.7s", animationFillMode: "forwards"}}>
              Find and book the perfect car for your next adventure
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fadeIn opacity-0" style={{animationDelay: "1s", animationFillMode: "forwards"}}>
              <Link
                to="/cars"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 border border-blue-500 shadow-lg transform hover:-translate-y-1 hover:shadow-blue-500/20"
              >
                Browse Cars
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section with animations */}
      <section ref={featuresRef} className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose RentMyRide</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-800 hover:border-blue-500 group transition-all duration-300">
              <div className="text-blue-400 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-100 text-center">Fast & Easy Booking</h3>
              <p className="text-gray-400 text-center">Book your ride in minutes with our streamlined reservation process. No paperwork, no hassle.</p>
            </div>
            
            <div className="feature-card bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-800 hover:border-purple-500 group transition-all duration-300">
              <div className="text-purple-400 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-100 text-center">Quality Guaranteed</h3>
              <p className="text-gray-400 text-center">All our vehicles are regularly maintained and inspected for your safety and comfort.</p>
            </div>
            
            <div className="feature-card bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-800 hover:border-green-500 group transition-all duration-300">
              <div className="text-green-400 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-100 text-center">24/7 Support</h3>
              <p className="text-gray-400 text-center">Our customer service team is available around the clock to assist you with any questions.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How It Works</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Renting a car with us is simple and straightforward</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center feature-card">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-900 flex items-center justify-center text-blue-400 text-2xl font-bold mb-4">1</div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Browse Our Cars</h3>
              <p className="text-gray-400">Find the perfect vehicle for your needs from our diverse fleet.</p>
            </div>
            
            <div className="text-center feature-card">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-900 flex items-center justify-center text-purple-400 text-2xl font-bold mb-4">2</div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Make a Reservation</h3>
              <p className="text-gray-400">Select your dates and complete the booking process online.</p>
            </div>
            
            <div className="text-center feature-card">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-900 flex items-center justify-center text-green-400 text-2xl font-bold mb-4">3</div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Pick Up Your Car</h3>
              <p className="text-gray-400">Collect your vehicle from our convenient locations.</p>
            </div>
            
            <div className="text-center feature-card">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-900 flex items-center justify-center text-red-400 text-2xl font-bold mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Enjoy Your Journey</h3>
              <p className="text-gray-400">Hit the road with confidence and return the car when done.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call To Action */}
      <section className="py-24 bg-gradient-to-t from-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to hit the road?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-xl mx-auto">Experience the freedom of the open road with our premium fleet of vehicles.</p>
          <Link
            to="/cars"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 inline-block"
          >
            Explore Our Fleet
          </Link>
        </div>
      </section>
      
      {/* Add CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 128px; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease forwards;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .animate-expandWidth {
          animation: expandWidth 1.5s ease-in-out forwards;
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
};

export default Home;