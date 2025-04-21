import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGetAppointmentsForDoctorQuery, useUpdateAppointmentStatusMutation } from '../../redux/appointment/appointmentApi';
import { FaCheckCircle, FaTimesCircle, FaCalendarCheck, FaExclamationTriangle, FaEdit } from 'react-icons/fa';
import AddTestForm from './AddTestForm';
import AddTreatmentForm from './AddTreatmentForm';

const ViewAppointmentsForDoctor = ({ doctorId }) => {
  const { data: appointments, error, isLoading } = useGetAppointmentsForDoctorQuery(doctorId);
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedTestAppointmentId, setSelectedTestAppointmentId] = useState(null);
  const [editAppointmentId, setEditAppointmentId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Scheduled');
  const [subFilter, setSubFilter] = useState('Emergency');

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2, ease: 'easeOut' },
    }),
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
    }),
  };

  if (isLoading) return <div className="text-center py-4 text-blue-500">Loading appointments...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading appointments: {error.data?.error || error.message}</div>;

  const statusCounts = appointments?.reduce(
    (acc, appointment) => {
      const status = appointment.status?.toLowerCase();
      if (status === 'scheduled') {
        acc.scheduled += 1;
        if (appointment.priority?.toLowerCase() === 'emergency') acc.emergency += 1;
        else acc.nonEmergency += 1;
      } else if (status === 'cancelled') {
        acc.cancelled += 1;
      } else if (status === 'completed') {
        acc.completed += 1;
      }
      return acc;
    },
    { scheduled: 0, emergency: 0, nonEmergency: 0, cancelled: 0, completed: 0 }
  );

  const filteredAppointments = appointments?.filter(
    (appointment) => appointment.status.toLowerCase() === filterStatus.toLowerCase()
  );

  const subFilteredAppointments =
    filterStatus === 'Scheduled'
      ? filteredAppointments?.filter((appointment) =>
          subFilter === 'Emergency'
            ? appointment.priority?.toLowerCase() === 'emergency'
            : appointment.priority?.toLowerCase() !== 'emergency'
        )
      : filteredAppointments;

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus({ appointment_id: appointmentId, status: 'Completed' }).unwrap();
      alert('Appointment marked as completed!');
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Failed to mark appointment as completed.');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus({ appointment_id: appointmentId, status: 'Cancelled' }).unwrap();
      alert('Appointment marked as cancelled!');
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Failed to mark appointment as cancelled.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Doctor's Appointments</h1>

      {/* Main Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {[
          { status: 'Scheduled', count: statusCounts.scheduled, color: 'blue', emergencyCount: statusCounts.emergency },
          { status: 'Completed', count: statusCounts.completed, color: 'green' },
          { status: 'Cancelled', count: statusCounts.cancelled, color: 'red' },
        ].map((btn, index) => (
          <motion.button
            key={btn.status}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-4 ${
              filterStatus === btn.status
                ? `bg-gradient-to-r from-${btn.color}-600 to-${btn.color}-700 text-white focus:ring-${btn.color}-300`
                : `bg-white text-${btn.color}-700 border-2 border-${btn.color}-300 hover:bg-${btn.color}-100 focus:ring-${btn.color}-200`
            }`}
            onClick={() => {
              setFilterStatus(btn.status);
              if (btn.status === 'Scheduled') setSubFilter('Emergency');
            }}
            aria-label={`Filter by ${btn.status.toLowerCase()} appointments`}
          >
            {btn.status} ({btn.count})
            {btn.status === 'Scheduled' && btn.emergencyCount > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {btn.emergencyCount} Emergency
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Sub-Filter Buttons for Scheduled */}
      {filterStatus === 'Scheduled' && (
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <motion.button
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-4 ${
              subFilter === 'Emergency'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white focus:ring-red-300'
                : 'bg-white text-red-700 border-2 border-red-300 hover:bg-red-100 focus:ring-red-200'
            }`}
            onClick={() => setSubFilter('Emergency')}
            aria-label="Filter by emergency scheduled appointments"
          >
            Emergency Appointments ({statusCounts.emergency})
          </motion.button>
          <motion.button
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-4 ${
              subFilter === 'Non-Emergency'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white focus:ring-blue-300'
                : 'bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-100 focus:ring-blue-200'
            }`}
            onClick={() => setSubFilter('Non-Emergency')}
            aria-label="Filter by non-emergency scheduled appointments"
          >
            Non-Emergency Appointments ({statusCounts.nonEmergency})
          </motion.button>
        </div>
      )}


      {/* Appointments List */}
      <div className="grid md:grid-cols-2 gap-6">
        {subFilteredAppointments && subFilteredAppointments.length > 0 ? (
          subFilteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.appointment_id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className={`border rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg ${
                appointment.priority?.toLowerCase() === 'emergency'
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center mb-2">
                {appointment.priority?.toLowerCase() === 'emergency' && (
                  <FaExclamationTriangle className="text-red-600 mr-2" />
                )}
                <p>
                  <span className="font-semibold">Appointment ID:</span> {appointment.appointment_id}
                </p>
              </div>
              <p className="mb-2">
                <span className="font-semibold">Patient ID:</span>{' '}
                <Link
                  to={`/patient/${appointment.patient_id}/record`}
                  className="text-blue-600 hover:underline"
                >
                  {appointment.patient_id}
                </Link>
              </p>
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{' '}
                <span
                  className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                    appointment.status === 'Scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : appointment.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {appointment.status}
                </span>
              </p>
              {appointment.priority && (
                <p className="mb-2">
                  <span className="font-semibold">Priority:</span>{' '}
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                      appointment.priority === 'Emergency'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {appointment.priority}
                  </span>
                </p>
              )}
              <p className="mb-2">
                <span className="font-semibold">Date:</span>{' '}
                {new Date(appointment.date_time).toLocaleDateString()}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Time:</span>{' '}
                {new Date(appointment.date_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p>
                <span className="font-semibold">Notes:</span> {appointment.notes || 'None'}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {appointment.status === 'Scheduled' && (
                  <>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all w-full sm:w-auto"
                      onClick={() => setSelectedAppointmentId(appointment.appointment_id)}
                    >
                      <FaCalendarCheck /> Add Prescription
                    </button>
                    <button
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-all w-full sm:w-auto"
                      onClick={() => setSelectedTestAppointmentId(appointment.appointment_id)}
                    >
                      <FaCheckCircle /> Add Tests
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-all w-full sm:w-auto"
                      onClick={() => handleCancelAppointment(appointment.appointment_id)}
                    >
                      <FaTimesCircle /> Cancel Appointment
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-all w-full sm:w-auto"
                      onClick={() => handleCompleteAppointment(appointment.appointment_id)}
                    >
                      <FaCheckCircle /> Mark as Completed
                    </button>
                  </>
                )}
                {/* {appointment.status === 'Completed' && (
                 
                )} */}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500">
            No {subFilter === 'Emergency' ? 'emergency' : subFilter.toLowerCase() || filterStatus.toLowerCase()}{' '}
            appointments found.
          </p>
        )}
      </div>

      {/* Modal for Add Prescription */}
      {selectedAppointmentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-lg relative p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setSelectedAppointmentId(null)}
            >
              ×
            </button>
            <AddTreatmentForm appointmentId={selectedAppointmentId} />
          </div>
        </div>
      )}

      {/* Modal for Add Tests */}
      {selectedTestAppointmentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-5 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-lg relative p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setSelectedTestAppointmentId(null)}
            >
              ×
            </button>
            <AddTestForm appointmentId={selectedTestAppointmentId} />
          </div>
        </div>
      )}

      {/* Modal for Edit Appointment */}
      {editAppointmentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-lg relative p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setEditAppointmentId(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Appointment</h2>
            <AddTreatmentForm appointmentId={editAppointmentId} isEditMode />
            <AddTestForm appointmentId={editAppointmentId} isEditMode />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointmentsForDoctor;