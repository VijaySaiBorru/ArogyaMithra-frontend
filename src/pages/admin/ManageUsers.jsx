import React, { useState } from 'react';
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation, // ✅ Import update mutation
} from '../../redux/user/userApi';
import UserCard from './UserCard';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const { data: users, error, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation(); // ✅ Use update mutation
  const [roleFilter, setRoleFilter] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const handleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${user.name} from the database.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user.user_id).unwrap();
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', 'There was an issue deleting the user.', 'error');
      }
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  // ✅ Actual update logic using updateUser mutation
// ✅ Actual update logic using updateUser mutation
// ✅ Actual update logic using updateUser mutation
const handleSave = async (updatedUser) => {
  try {
    // Exclude 'user_id' and wrap the rest in 'data'
    const { user_id, ...data } = updatedUser; // Destructure and exclude user_id

    data.salary = Number(data.salary); // Ensure salary is a number
    
    // Send 'data' (excluding user_id) in the update request
    await updateUser({user_id, data }).unwrap();
    
    Swal.fire('Success!', 'User updated successfully.', 'success');
    setIsEditModalOpen(false);
  } catch (err) {
    Swal.fire('Error!', 'There was an issue updating the user.', 'error');
  }
};

  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  const filteredUsers = roleFilter
    ? users.filter((user) => user.role === roleFilter)
    : users;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Select which users to view:
      </label>

      <select
        className="p-2 border rounded-lg mb-6 w-full max-w-xs"
        value={roleFilter}
        onChange={handleFilterChange}
      >
        <option value="">All Users</option>
        <option value="frontdesk">Frontdesk Operators</option>
        <option value="dataentry">Data Entry Operators</option>
      </select>

      {currentUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUsers.map((user) => (
            <div key={user.user_id} className="relative">
              <UserCard user={user} onDelete={handleDelete} onEdit={handleEdit} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-4">
          No users found for this role.
        </p>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border rounded-md mx-2 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`p-2 border rounded-md mx-2 ${
              pageNumber === currentPage ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border rounded-md mx-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(currentUser); // ✅ Save edited user
              }}
            >
              <label className="block text-sm font-medium text-gray-600">Username</label>
              <input
                type="text"
                value={currentUser.username}
                disabled
                className="w-full p-2 mt-1 border rounded-md bg-gray-100 cursor-not-allowed"
              />

              <label className="block text-sm font-medium text-gray-600 mt-4">Email</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full p-2 mt-1 border rounded-md bg-gray-100 cursor-not-allowed"
              />

              <label className="block text-sm font-medium text-gray-600 mt-4">Role</label>
              <select
                value={currentUser.role}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, role: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              >
                <option value="admin">Admin</option>
                <option value="hcp">Healthcare Provider</option>
                <option value="frontdesk">Frontdesk</option>
                <option value="dataentry">Data Entry</option>
              </select>

              <label className="block text-sm font-medium text-gray-600 mt-4">Salary</label>
              <input
                type="number"
                value={currentUser.salary || ''}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, salary: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              />

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
