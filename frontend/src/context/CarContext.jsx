import React, { createContext, useContext, useState, useEffect } from 'react';

const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Fake data until API is connected
    const demoCars = [
      { id: 1, name: 'Camry', price: 50, image: '/assets/camry.jpg' },
      { id: 2, name: 'Tesla', price: 100, image: '/assets/tesla.jpg' },
    ];
    setCars(demoCars);
  }, []);

  return (
    <CarContext.Provider value={{ cars }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => useContext(CarContext);
