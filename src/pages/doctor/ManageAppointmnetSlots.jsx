import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  useGetUpcomingDoctorSLotsQuery,
  useDeleteSlotMutation,
} from '../../redux/appointment/appointmentApi';

const ITEMS_PER_PAGE = 5;

const ManageAppointmentSlots = ({ doctorId }) => {
  const { data: slots = [], isLoading, isError } = useGetUpcomingDoctorSLotsQuery(doctorId);
  const [deleteSlot] = useDeleteSlotMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState('');

  const handleDelete = async (slot_id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the slot.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteSlot(slot_id).unwrap();
        Swal.fire('Deleted!', 'The slot has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete the slot.', 'error');
      }
    }
  };

const validSlots = Array.isArray(slots) ? slots : [];

const filteredSlots = filterDate
  ? validSlots.filter((slot) => new Date(slot.slot_date).toISOString().slice(0, 10) === filterDate)
  : validSlots;


  const totalPages = Math.ceil(filteredSlots.length / ITEMS_PER_PAGE);
  const paginatedSlots = filteredSlots.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleFilterChange = (e) => {
    setFilterDate(e.target.value);
    setCurrentPage(1); // reset to page 1 on new filter
  };

  if (isLoading) return <div className="text-blue-500 text-lg">Loading slots...</div>;
  if (isError) return <div className="text-red-500 text-lg">Error fetching slots.</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Manage Appointment Slots</h2>

      {/* Date Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {filteredSlots.length === 0 ? (
        <p className="text-gray-600">No slots found for the selected criteria.</p>
      ) : (
        <>
          <table className="w-full border border-gray-300 rounded overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Start Time</th>
                <th className="border p-3 text-left">End Time</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSlots.map((slot) => (
                <tr key={slot.slot_id} className="hover:bg-gray-50 transition">
                  <td className="border p-3">
                    {new Date(slot.slot_date).toLocaleDateString()}
                  </td>
                  <td className="border p-3">{slot.start_time}</td>
                  <td className="border p-3">{slot.end_time}</td>
                  <td className="border p-3">
                    <button
                      onClick={() => handleDelete(slot.slot_id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
            >
              Prev
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageAppointmentSlots;
