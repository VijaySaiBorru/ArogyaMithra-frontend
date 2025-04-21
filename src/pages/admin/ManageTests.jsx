import React, { useState, useEffect } from 'react';
import {
  useAddTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useGetAllTestsQuery,
} from '../../redux/test/testApi';
import Swal from 'sweetalert2';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// Reusable Input Component
const InputField = ({ name, value, onChange, placeholder, type = 'text', required = false }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full border border-gray-300 p-2 rounded"
    required={required}
  />
);

const ManageTests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const { data: testsData, error, isLoading, refetch } = useGetAllTestsQuery();

  const [addTest] = useAddTestMutation();
  const [updateTest] = useUpdateTestMutation();
  const [deleteTest] = useDeleteTestMutation();

  const [addForm, setAddForm] = useState({
    test_name: '',
    description: '',
    fee: '',
  });

  const [editForm, setEditForm] = useState({
    test_name: '',
    description: '',
    fee: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  // Pagination calculations
  const tests = testsData || [];
  const totalPages = Math.ceil(tests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTests = tests.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentTest) {
      setEditForm({
        test_name: currentTest.test_name,
        description: currentTest.description,
        fee: currentTest.fee,
      });
    }
  }, [currentTest]);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.test_name || !addForm.fee) {
      Swal.fire({ icon: 'warning', title: 'Please fill all required fields!' });
      return;
    }

    try {
      await addTest(addForm).unwrap();
      setAddForm({ test_name: '', description: '', fee: '' });
      Swal.fire({
        icon: 'success',
        title: 'Test added successfully!',
        text: `Test Name: ${addForm.test_name}`,
      });
      refetch();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add test',
        text: err.message || 'Something went wrong!',
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.test_name || !editForm.fee) {
      Swal.fire({ icon: 'warning', title: 'Please fill all required fields!' });
      return;
    }

    try {
      await updateTest({ test_id: currentTest.test_id, ...editForm }).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Test updated successfully!',
        text: `Test Name: ${editForm.test_name}`,
      });
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update test',
        text: err.message || 'Something went wrong!',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTest(id).unwrap();
      Swal.fire({ icon: 'success', title: 'Test deleted successfully!' });
      refetch();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete test',
        text: err.message || 'Something went wrong!',
      });
    }
  };

  const openEditModal = (test) => {
    setCurrentTest(test);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTest(null);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading test data.</p>;

  return (
    <div>
      {/* Add Test Form */}
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">Add New Medical Test</h2>
      <form className="space-y-4" onSubmit={handleAddSubmit}>
        <InputField name="test_name" value={addForm.test_name} onChange={handleAddChange} placeholder="Test Name" required />
        <InputField name="description" value={addForm.description} onChange={handleAddChange} placeholder="Description" />
        <InputField name="fee" value={addForm.fee} onChange={handleAddChange} placeholder="Price" type="number" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Test
        </button>
      </form>

      {/* List of Tests */}
      <h2 className="text-2xl font-semibold text-blue-600 mt-8 mb-4">All Tests</h2>
      <div className="space-y-4">
        {currentTests.map((t) => (
          <div key={t.test_id} className="flex justify-between items-center border p-4 rounded-lg">
            <div>
              <h3 className="font-semibold">{t.test_name}</h3>
              <p>{t.description}</p>
              <p className="font-bold">Fee: ₹{t.fee}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => openEditModal(t)} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                Edit
              </button>
              <button onClick={() => handleDelete(t.test_id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700 self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for Edit Test */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Test"
        className="bg-white p-6 rounded-lg shadow-lg w-1/3 mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-xl font-semibold mb-4">Edit Test</h3>
        <form className="space-y-4" onSubmit={handleEditSubmit}>
          <InputField name="test_name" value={editForm.test_name} onChange={handleEditChange} placeholder="Test Name" required />
          <InputField name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" />
          <InputField name="fee" value={editForm.fee} onChange={handleEditChange} placeholder="Price" type="number" required />
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Changes
            </button>
            <button type="button" onClick={closeModal} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageTests;
