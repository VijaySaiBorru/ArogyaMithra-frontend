import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useGetAllAppointmentsQuery, useUpdateAppointmentStatusMutation } from '../../redux/appointment/appointmentApi';

const ManageAppointments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  const { data, error, isLoading, refetch } = useGetAllAppointmentsQuery({
    page: currentPage,
    limit: appointmentsPerPage,
  });

  const [updateStatus] = useUpdateAppointmentStatusMutation();

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const appointments = Array.isArray(data?.appointments) ? data.appointments : [];
  const totalAppointments = data?.total || 0;
  const totalPages = Math.ceil(totalAppointments / appointmentsPerPage);

  const handleCancel = async (appointment_id) => {
    const confirm = await Swal.fire({
      title: 'Cancel Appointment?',
      text: "Are you sure you want to cancel this appointment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
    });

    if (confirm.isConfirmed) {
      try {
        await updateStatus({ appointment_id, status: 'Cancelled' }).unwrap();
        await Swal.fire('Cancelled!', 'Appointment has been cancelled.', 'success');
        refetch();
      } catch (err) {
        console.error(err);
        Swal.fire('Error!', 'Could not cancel the appointment.', 'error');
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Appointments</h2>

      {isLoading && <p>Loading appointments...</p>}
      {error && <p className="text-red-500">Error loading appointments.</p>}

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.appointment_id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-700">
                Dr. {appointment.doctor_name} ({appointment.specialization})
              </h3>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  appointment.status === 'Cancelled'
                    ? 'bg-red-100 text-red-600'
                    : appointment.status === 'Completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {appointment.status}
              </span>
            </div>
            <p><strong>🧑 Patient:</strong> {appointment.patient?.patient_name}</p>
            <p><strong>📅 Date & Time:</strong> {new Date(appointment.date_time).toLocaleString()}</p>
            <p><strong>📝 Notes:</strong> {appointment.notes || 'N/A'}</p>

            {appointment.status !== 'Cancelled' && (
              <button
                onClick={() => handleCancel(appointment.appointment_id)}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Appointment
              </button>
            )}
          </div>
        ))}

      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageAppointments;
