import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetAllPatientRecordsQuery } from '../../redux/appointment/appointmentApi';
import { FaExclamationTriangle } from 'react-icons/fa';
import AddTreatmentForm from './AddTreatmentForm';
import EditTreatmentDoctor from './EditTreatmentform';
import AddTestForm from './AddTestForm';
import TreatmentDisplay from './Displaytreatment';

const PatientRecords = ({ doctorId }) => {
  const [patientIdFilter, setPatientIdFilter] = useState('');
  const [editAppointmentId, setEditAppointmentId] = useState(null);
  const [editMode, setEditMode] = useState(null); // 'edit' or 'add'

  const { data: patientRecords, error, isLoading, refetch } = useGetAllPatientRecordsQuery({ hcp_id: doctorId });

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
    }),
  };
  console.log(patientRecords)

  const filteredRecords = patientIdFilter
    ? patientRecords?.filter((record) => record.patient_id.toString().includes(patientIdFilter))
    : patientRecords;

  console.log(filteredRecords);

  if (isLoading) return <div className="text-center py-4 text-blue-500">Loading patient records...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading records: {error.data?.error || error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">All Patient Records (Completed Appointments)</h1>

      <div className="mb-6">
        <input
          type="text"
          value={patientIdFilter}
          onChange={(e) => setPatientIdFilter(e.target.value)}
          placeholder="Filter by Patient ID"
          className="w-full max-w-md border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
        />
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        {filteredRecords?.length > 0 ? (
          filteredRecords.map((record, index) => (
            <motion.div
              key={record.appointment_id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className={`border rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg ${record.priority?.toLowerCase() === 'emergency'
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-white'
                }`}
            >
              <div className="flex items-center mb-2">
                {record.priority?.toLowerCase() === 'emergency' && (
                  <FaExclamationTriangle className="text-red-600 mr-2" />
                )}
                <p>
                  <span className="font-semibold">Appointment ID:</span> {record.appointment_id}
                </p>
              </div>
              <p className="mb-2"><span className="font-semibold">Patient ID:</span> {record.patient_id}</p>
              <p className="mb-2"><span className="font-semibold">Date:</span> {new Date(record.date_time).toLocaleDateString()}</p>
              <p className="mb-2"><span className="font-semibold">Time:</span> {new Date(record.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="mb-2">
                <span className="font-semibold">Priority:</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-sm font-medium ${record.priority === 'Emergency' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                  {record.priority || 'Normal'}
                </span>
              </p>
              <p className="mb-2"><span className="font-semibold">Doctor:</span> {record.designation} ({record.specialization || 'N/A'})</p>

              {/* <TreatmentDisplay treatmentData={filteredRecords} ></TreatmentDisplay> */}
              {/* Prescribed Tests Table */}
              {record.prescribed_tests?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">Prescribed Tests</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 text-left border-b">Test Name</th>
                          <th className="py-2 px-4 text-left border-b">Result</th>
                          <th className="py-2 px-4 text-left border-b">Report</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.prescribed_tests.map((test) => {
                          const viewReport = () => {
                            try {
                              const base64String = test.file.split(',')[1] || test.file;
                              const byteCharacters = atob(base64String);
                              const byteNumbers = new Array(byteCharacters.length)
                                .fill()
                                .map((_, i) => byteCharacters.charCodeAt(i));
                              const byteArray = new Uint8Array(byteNumbers);
                              const blob = new Blob([byteArray], { type: 'application/pdf' });
                              const url = URL.createObjectURL(blob);
                              window.open(url, '_blank');
                            } catch (err) {
                              alert('Failed to open report. The file might be corrupted.');
                              console.error('Base64 decoding failed:', err);
                            }
                          };
                          
                          const downloadReport = () => {
                            try {
                              const base64String = test.file.split(',')[1] || test.file;
                              const byteCharacters = atob(base64String);
                              const byteNumbers = new Array(byteCharacters.length)
                                .fill()
                                .map((_, i) => byteCharacters.charCodeAt(i));
                              const byteArray = new Uint8Array(byteNumbers);
                              const blob = new Blob([byteArray], { type: 'application/pdf' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `Report_${test.test_name}_${record.patient_id}.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            } catch (err) {
                              alert('Failed to download report. The file might be corrupted.');
                              console.error('Download failed:', err);
                            }
                          };
                          

                          return (
                            <tr key={test.prescribed_test_id} className="hover:bg-gray-50">
                              <td className="py-2 px-4 border-b">{test.test_name}</td>
                              <td className="py-2 px-4 border-b">{test.result || 'Pending'}</td>
                              <td className="py-2 px-4 border-b">
                                {test.file ? (
                                  <div className="flex gap-4 text-sm">
                                    <button
                                      onClick={viewReport}
                                      className="text-blue-600 hover:underline"
                                    >
                                      View
                                    </button>
                                    <button
                                      onClick={downloadReport}
                                      className="text-green-600 hover:underline"
                                    >
                                      Download
                                    </button>
                                  </div>
                                ) : (
                                  'Not Uploaded'
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}



              <p className="mb-2"><span className="font-semibold">Diagnosis:</span> {record.diagnosis || 'None'}</p>
              <p className="mb-2"><span className="font-semibold">Treatment Plan:</span> {record.treatment_plan || 'None'}</p>
              <p className="mb-2"><span className="font-semibold">Notes:</span> {record.notes || 'None'}</p>


              {/* Medications Table */}
              {record.medications?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">Medications</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 text-left border-b">Medicine Name</th>
                          <th className="py-2 px-4 text-left border-b">Dosage</th>
                          <th className="py-2 px-4 text-left border-b">Frequency</th>
                          <th className="py-2 px-4 text-left border-b">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.medications.map((med, idx) => (
                          <tr key={`${record.appointment_id}-med-${idx}`} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{med.medicine_name}</td>
                            <td className="py-2 px-4 border-b">{med.dosage || '-'}</td>
                            <td className="py-2 px-4 border-b">{med.frequency || '-'}</td>
                            <td className="py-2 px-4 border-b">{med.duration || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto"
                  onClick={() => {
                    setEditAppointmentId(record.appointment_id);
                    setEditMode('edit');
                  }}
                >
                  ✎ Edit Medications
                </button>

                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
                  onClick={() => {
                    setEditAppointmentId(record.appointment_id);
                    setEditMode('add');
                  }}
                >
                  ➕ Add Medication
                </button>

                <button
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all w-full sm:w-auto"
                  onClick={() => {
                    setEditAppointmentId(record.appointment_id);
                    setEditMode('add-test');
                  }}
                >
                  ➕ Add Test
                </button>

              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500">
            {patientIdFilter
              ? `No completed appointments found for Patient ID: ${patientIdFilter}.`
              : 'No completed appointments found.'}
          </p>
        )}
      </div>

      {/* Modal */}
      {editAppointmentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-lg relative p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => {
                setEditAppointmentId(null);
                setEditMode(null);
                refetch();
              }}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editMode === 'edit' ? 'Edit Appointment' : 'Add Medication'}
            </h2>

            {editMode === 'edit' && (
              <EditTreatmentDoctor appointmentId={editAppointmentId} isEditMode />
            )}

            {editMode === 'add' && (
              <AddTreatmentForm appointmentId={editAppointmentId} isEditMode />
            )}

            {editMode === 'add-test' && (
              <AddTestForm appointmentId={editAppointmentId} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
