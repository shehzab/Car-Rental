import { useNavigate } from 'react-router-dom';

export const CarCard = ({ car }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 rounded shadow p-4 border border-gray-700">
      <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded mb-2" />
      <h3 className="text-xl font-bold text-white">{car.name}</h3>
      <p className="text-gray-300 mb-2">${car.price}/day</p>
      <button
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
        onClick={() => navigate(`/book/${car._id}`)}
      >
        Book Now
      </button>
    </div>
  );
};
