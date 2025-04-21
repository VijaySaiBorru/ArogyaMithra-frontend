import React from 'react';

const UserCard = ({ user, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto space-y-4">
      {/* User Image */}
      <div className="flex justify-center">
        <img
          src={user.image} // Ensure the image URL is correct (base64 or URL)
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
        />
      </div>

      {/* User Info */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
        <p className="text-md text-gray-500">{user.role}</p>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-around space-x-4">
        {/* Edit Button */}
        <button
          onClick={() => onEdit(user)} // Trigger edit functionality
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Edit
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(user)} // Trigger delete functionality
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
