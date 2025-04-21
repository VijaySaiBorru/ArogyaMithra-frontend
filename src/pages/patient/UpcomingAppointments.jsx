import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  useGetAppointmentsForPatientQuery,
  useUpdateAppointmentStatusMutation,
} from '../../redux/appointment/appointmentApi';

const UpcomingAppointments = ({ patientData }) => {
  const [appointments, setAppointments] = useState([]);
  const patient_id = patientData.patient_id;

  const { data, error, isLoading } = useGetAppointmentsForPatientQuery(patient_id);
  const [updateAppointmentStatus, { isLoading: canceling }] = useUpdateAppointmentStatusMutation();

  useEffect(() => {
    if (data) {
      const upcoming = data.filter(
        (appt) => appt.status !== 'Cancelled' && new Date(appt.date_time) > new Date()
      );
      setAppointments(upcoming);
    }
  }, [data]);

  const handleCancel = async (appointmentId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
    });

    if (result.isConfirmed) {
      try {
        await updateAppointmentStatus({
          appointment_id: appointmentId,
          status: 'Cancelled',
        }).unwrap();

        setAppointments((prev) =>
          prev.filter((appt) => appt.appointment_id !== appointmentId)
        );

        Swal.fire({
          title: 'Cancelled!',
          text: 'Your appointment has been cancelled.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error('Cancellation failed:', err);
        Swal.fire('Error!', 'Failed to cancel appointment.', 'error');
      }
    }
  };

  if (isLoading) return <div className="text-center mt-4 text-blue-500">Loading...</div>;
  if (error) return <div className="text-center mt-4 text-red-500">Error loading appointments!</div>;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Upcoming Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No upcoming appointments</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((appointment, index) => (
              <div
                key={appointment.id || `${appointment.name}-${appointment.date_time}-${index}`}
                className="border border-gray-300 shadow-md rounded-xl p-5 hover:shadow-lg transition duration-200 bg-gray-50"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  👨‍⚕️ Dr. {appointment.name}
                </h3>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">📅 Date & Time:</span>{' '}
                  {new Date(appointment.date_time).toLocaleString()}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">📝 Notes/Reason:</span>{' '}
                  {appointment.notes || 'No additional notes'}
                </p>
                <p className="text-gray-600 mt-2 text-sm">
                  Appointment ID:{' '}
                  <span className="text-xs">{appointment.appointment_id}</span>
                </p>

                <button
                  onClick={() => handleCancel(appointment.appointment_id)}
                  className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition disabled:opacity-50"
                  disabled={canceling}
                >
                  Cancel Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
