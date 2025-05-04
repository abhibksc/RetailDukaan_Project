import React, { useState } from 'react';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    profilePicture: null,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    role: 'Admin',
    address: '123 Main St, Anytown, USA',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newProfile, setNewProfile] = useState(profile);

  const handleProfilePictureChange = (e) => {
    console.log(newProfile);

    const file = e.target.files[0];
    if (file) {
      setNewProfile({
        ...newProfile,
        profilePicture: URL.createObjectURL(file),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfile({ ...newProfile, [name]: value });
  };

  const handleSave = () => {
    // setProfile(newProfile);


    console.log(newProfile);
    // setIsEditing(false);
  };

  const handleEdit = () => {
    console.log(newProfile);

    setIsEditing(true);
    setNewProfile(profile);
  };

  const handleCancel = () => {
    console.log(newProfile);

    setIsEditing(false);
    setNewProfile(profile);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
      <h2 className="text-lg font-bold mb-6 text-purple-700 animate-pulse">Admin Profile</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <div className="mt-2 flex items-center">
          {profile.profilePicture && (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="h-20 w-20 rounded-full border-2 border-purple-500 mr-4"
            />
          )}
          {isEditing && (
            <input
              type="file"
              onChange={handleProfilePictureChange}
              className="py-2 px-3 border border-gray-300 rounded-md shadow-sm"
            />
          )}
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={newProfile.name}
            onChange={handleInputChange}
            className="mt-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full"
          />
        ) : (
          <p className="mt-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full">
            {profile.name}
          </p>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={newProfile.email}
            onChange={handleInputChange}
            className="mt-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full"
          />
        ) : (
          <p className="mt-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full">
            {profile.email}
          </p>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        {isEditing ? (
          <input
            type="tel"
            name="phone"
            value={newProfile.phone}
            onChange={handleInputChange}
            className="mt-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full"
          />
        ) : (
          <p className="mt-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full">
            {profile.phone}
          </p>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Role/Position</label>
        <p className="mt-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full">
          {profile.role}
        </p>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        {isEditing ? (
          <textarea
            name="address"
            value={newProfile.address}
            onChange={handleInputChange}
            className="mt-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full"
          />
        ) : (
          <p className="mt-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full">
            {profile.address}
          </p>
        )}
      </div>
      <div className="flex justify-end">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-sm mr-2 transition-colors duration-300 hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              onClick={()=>handleSave()}
              className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md shadow-sm transition-colors duration-300 hover:bg-green-600"
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm transition-colors duration-300 hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
