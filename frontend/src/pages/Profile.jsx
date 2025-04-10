import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, loading: authLoading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  // Initialize form data when user data is loaded
  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        country: currentUser.country || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);
    
    try {
      await updateProfile(formData);
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed:', error);
      setUpdateError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-blue-400 font-medium text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-gray-900 min-h-screen text-center p-8">
        <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-yellow-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-white text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please sign in to view and manage your profile information.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">User Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-300"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {updateSuccess && (
            <div className="mb-4 p-4 bg-green-800 text-green-100 rounded-md">
              Profile updated successfully!
            </div>
          )}

          {updateError && (
            <div className="mb-4 p-4 bg-red-800 text-red-100 rounded-md">
              {updateError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.username || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <p className="text-white text-lg">{currentUser.email || "Not provided"}</p>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.phone || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.address || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 mb-2">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.city || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.country || "Not provided"}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;