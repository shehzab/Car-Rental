import React, { useState } from 'react';

const CarFilters = ({ onFilter }) => {
  const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(search.toLowerCase());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Search by car name"
        className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default CarFilters;