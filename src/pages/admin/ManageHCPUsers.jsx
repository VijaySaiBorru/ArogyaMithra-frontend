import React, { useEffect, useState } from 'react';
import { useGetAllHCPUsersQuery } from '../../redux/user/userApi';
import { useDeleteHCPMutation, useUpdateHCPMutation } from '../../redux/hcp/hcpApi';
import HCPUserCard from './HCPUserCard';

const ManageHCPUsers = () => {
  const { data, error, isLoading } = useGetAllHCPUsersQuery();
  const [hcpUsers, setHcpUsers] = useState([]);
  const [designationFilter, setDesignationFilter] = useState('');
  const [deleteHCP] = useDeleteHCPMutation();
  const [updateHCP] = useUpdateHCPMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);  // Change this value as needed

  // List of Designations and Specializations
  const designations = ['Doctor', 'Nurse', 'Junior Doctor', 'Therapist'];
  const departments = [
    "General Medicine", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", 
    "Dermatology", "Ophthalmology", "Gynecology", "General Surgery", "Psychiatry", 
    "Endocrinology", "Gastroenterology", "Oncology", "Pulmonology", "Rheumatology", 
    "Nephrology", "Hematology", "Urology", "Allergy and Immunology", "Anesthesiology", 
    "Physical Therapy", "Pain Management", "Geriatrics"
  ];

  useEffect(() => {
    if (data) {
      setHcpUsers(data);
    }
  }, [data]);

  const handleFilterChange = (e) => {
    setDesignationFilter(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHCP(id);
      setHcpUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedUser = {
      ...selectedUser,
      name: selectedUser.name,
      email: selectedUser.name,
      designation: formData.get("designation"),
      specialization: formData.get("specialization"),
      contact: formData.get("contact"),
      salary: formData.get("salary"),
    };
    try {
      await updateHCP({ user_id: selectedUser.user_id, data: updatedUser });
      setHcpUsers((prev) => 
        prev.map((user) =>
          user.user_id === selectedUser.user_id ? updatedUser : user
        )
      );
      closeModal();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const filteredUsers = designationFilter
    ? hcpUsers.filter((user) => user.designation === designationFilter)
    : hcpUsers;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching HCP users.</p>;

  return (
    <div className="p-4">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Select designation to view:
      </label>
      <select
        className="p-2 border rounded-lg mb-6 w-full max-w-xs"
        value={designationFilter}
        onChange={handleFilterChange}
      >
        <option value="">All Designations</option>
        {designations.map((designation) => (
          <option key={designation} value={designation}>
            {designation}
          </option>
        ))}
      </select>

      {currentUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentUsers.map((user) => (
            <HCPUserCard
              key={user.user_id}
              user={user}
              onDelete={handleDelete} // Pass the handleDelete function
              onUpdate={handleUpdate} // Pass the handleUpdate function
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-4">
          No users found for this designation.
        </p>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">Update HCP User</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedUser.name || ''}
                  className="w-full p-2 mt-1 border rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={selectedUser.email || ''}
                  className="w-full p-2 mt-1 border rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm">Designation</label>
                <select
                  name="designation"
                  defaultValue={selectedUser.designation || 'Doctor'}
                  className="w-full border px-3 py-2 rounded"
                >
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm">Specialization</label>
                <select
                  name="specialization"
                  defaultValue={selectedUser.specialization || 'General Medicine'}
                  className="w-full border px-3 py-2 rounded"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm">Contact</label>
                <input
                  type="text"
                  name="contact"
                  defaultValue={selectedUser.contact || ''}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 text-sm">Salary</label>
                <input
                  type="number"
                  name="salary"
                  step="0.01"
                  defaultValue={selectedUser.salary || ''}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHCPUsers;
