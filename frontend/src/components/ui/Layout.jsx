// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-16 px-4"> {/* adjust pt-16 to match your navbar height */}
        {children}
      </main>
    </>
  );
};

export default Layout;
