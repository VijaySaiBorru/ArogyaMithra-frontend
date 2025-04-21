import React, { useEffect, useState } from 'react';
import {
  useGetAllRoomsQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from '../../redux/room/roomApi';
import Swal from 'sweetalert2';

const ManageRooms = () => {
  const { data, error, isLoading, refetch } = useGetAllRoomsQuery();
  const [addRoom] = useAddRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const rooms = Array.isArray(data) ? data : data?.rooms || [];

  const [form, setForm] = useState({
    room_number: '',
    type: 'Normal',
    charges_per_day: '',
    capacity: ''
  });

  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editForm, setEditForm] = useState({
    room_number: '',
    type: 'Normal',
    status: 'Available',
    charges_per_day: '',
    capacity: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;
  const totalRoomsCount = rooms.length;
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(totalRoomsCount / roomsPerPage);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!form.room_number || !form.charges_per_day) return;
    
    if (form.type === 'General' && !form.capacity) {
      Swal.fire({
        title: 'Error!',
        text: 'Capacity is required for General rooms',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      await addRoom(form).unwrap();
      setForm({ room_number: '', type: 'Normal', charges_per_day: '', capacity: '' });
      Swal.fire({
        title: 'Success!',
        text: 'Room created successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      console.error('Failed to add room:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create room.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const startEditing = (room) => {
    setEditingRoomId(room.room_id);
    setEditForm({
      room_number: room.room_number,
      type: room.type,
      status: room.status,
      charges_per_day: room.charges_per_day,
      capacity: room.capacity || ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (editForm.type === 'General' && !editForm.capacity) {
      Swal.fire({
        title: 'Error!',
        text: 'Capacity is required for General rooms',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      await updateRoom({ room_id: editingRoomId, ...editForm }).unwrap();
      refetch();
      setEditingRoomId(null);
      Swal.fire({
        title: 'Success!',
        text: 'Room updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      console.error('Failed to update room:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update room.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

   const handleDeleteRoom = async (room_id) => {
      try {
        await deleteRoom(room_id).unwrap();
        Swal.fire({
          title: 'Deleted!',
          text: 'Room deleted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        refetch();
      } catch (err) {
        console.error('Failed to delete room:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete room.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };
  
    // Count the number of Normal and ICU rooms
    const normalRoomsCount = rooms.filter(room => room.type === 'Normal').length;
    const icuRoomsCount = rooms.filter(room => room.type === 'ICU').length;
  
    // Change page handler
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Rooms</h2>

      {/* Add Room Form */}
      <form onSubmit={handleAddRoom} className="bg-white p-4 rounded-lg shadow-md mb-8 max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Room</h3>

        <div className="mb-3">
          <label className="block mb-1 text-gray-600">Room Number</label>
          <input
            type="text"
            name="room_number"
            value={form.room_number}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 text-gray-600">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="Normal">Normal</option>
            <option value="ICU">ICU</option>
            <option value="General">General</option>
          </select>
        </div>

        {form.type === 'General' && (
          <div className="mb-3">
            <label className="block mb-1 text-gray-600">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required={form.type === 'General'}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Charges Per Day</label>
          <input
            type="number"
            name="charges_per_day"
            value={form.charges_per_day}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Room
        </button>
      </form>

      {/* Room Cards */}
      {isLoading ? (
        <p>Loading rooms...</p>
      ) : error ? (
        <p>Error loading rooms.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRooms.map((room) => (
            <div key={room.room_id} className="bg-white p-4 rounded-lg shadow-md">
              {editingRoomId === room.room_id ? (
                <form onSubmit={handleUpdateRoom} className="space-y-2">
                  <input
                    type="text"
                    name="room_number"
                    value={editForm.room_number}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-md"
                  />
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Normal">Normal</option>
                    <option value="ICU">ICU</option>
                    <option value="General">General</option>
                  </select>
                  {editForm.type === 'General' && (
                    <input
                      type="number"
                      name="capacity"
                      value={editForm.capacity}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded-md"
                      required={editForm.type === 'General'}
                    />
                  )}
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Partially Occupied">Partially Occupied</option>
                  </select>
                  <input
                    type="number"
                    name="charges_per_day"
                    value={editForm.charges_per_day}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-md"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRoomId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Room {room.room_number}
                  </h3>
                  <p className="text-gray-600">Type: {room.type}</p>
                  {room.type === 'General' && (
                    <p className="text-gray-600">Capacity: {room.capacity}</p>
                  )}
                  <p className="text-gray-600">Status: {room.status}</p>
                  <p className="text-gray-600">
                    Charges per Day: ₹{room.charges_per_day}
                  </p>
                  <button
                    onClick={() => startEditing(room)}
                    className="mt-2 text-sm text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.room_id)}
                    className="mt-2 text-sm text-red-600 hover:bg-red-100 px-3 py-1 rounded-md transition-all duration-300"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-4 text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageRooms;
