import React from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2

const HCPUserCard = ({ user, onDelete, onUpdate }) => {

  // Function to handle the delete confirmation with SweetAlert
  const handleDelete = async (id) => {
    // Show SweetAlert confirmation before deletion
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    // If user confirms deletion
    if (result.isConfirmed) {
      try {
        onDelete(id); // Call onDelete prop to delete the user
        Swal.fire('Deleted!', 'The user has been deleted.', 'success'); // Show success message
      } catch (err) {
        console.error('Error deleting user:', err);
        Swal.fire('Error!', 'There was an issue deleting the user.', 'error'); // Show error message
      }
    } else {
      Swal.fire('Cancelled', 'The user was not deleted.', 'info'); // Show cancellation message
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-full max-w-md">
      {/* User Image */}
      <div className="flex-shrink-0 mb-4">
        <img
          src={user.image || "https://via.placeholder.com/150"} // Fallback image if no image is provided
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>
      
      {/* User Info */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.designation} - {user.specialization}</p>
        <p className="text-sm text-gray-500">{user.role}</p>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>
      
      {/* Contact and Salary */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">Contact: {user.contact}</p>
        <p className="text-sm text-gray-600">Salary: ${user.salary}</p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col items-center w-full space-y-2">
        {/* Update Button */}
        <button
          onClick={() => onUpdate(user)}  // Trigger onUpdate when clicked
          className="bg-green-500 text-white px-6 py-2 rounded-lg w-full hover:bg-green-600"
        >
          Update
        </button>
        {/* Remove Button with SweetAlert */}
        <button
          onClick={() => handleDelete(user.hcp_id)}  // Trigger handleDelete with SweetAlert
          className="bg-red-500 text-white px-6 py-2 rounded-lg w-full hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default HCPUserCard;
