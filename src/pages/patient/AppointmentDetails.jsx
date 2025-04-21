import React from 'react';
import { useGetAppointmentDetailsQuery } from '../../redux/appointment/appointmentApi';

const AppointmentDetails = ({ appointmentId }) => {
  const { data: appointment, isLoading: loadingAppointment, error } = useGetAppointmentDetailsQuery(appointmentId);

  if (loadingAppointment) return <div className="text-center mt-4 text-blue-500">Loading appointment details...</div>;
  if (error) return <div className="text-center mt-4 text-red-500">Failed to load appointment details.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Appointment Details</h2>

      <p><strong>Doctor:</strong> {appointment.doctor_name}</p>
      <p><strong>Date & Time:</strong> {new Date(appointment.date_time).toLocaleString()}</p>
      <p><strong>Specialization:</strong> {appointment.specialization}</p>
      <p><strong>Patient Notes:</strong> {appointment.notes || "No notes provided"}</p>
      <p><strong>Status:</strong> {appointment.status}</p>
      <p><strong>Location:</strong> {appointment.location}</p>
    </div>
  );
};

export default AppointmentDetails;
