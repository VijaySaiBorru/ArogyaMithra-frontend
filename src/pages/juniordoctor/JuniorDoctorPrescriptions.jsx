import React, { useEffect, useState } from 'react';

const dummyPrescriptions = [
  { id: 'RX001', patient: 'John Doe', medicine: 'Metformin', dosage: '500mg twice a day' },
  { id: 'RX002', patient: 'Jane Smith', medicine: 'Lisinopril', dosage: '10mg daily' },
];

const JuniorDoctorPrescriptions = ({ doctorId }) => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setPrescriptions(dummyPrescriptions);
    }, 500);
  }, [doctorId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Prescriptions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">Prescription ID</th>
              <th className="px-4 py-2 border-b">Patient Name</th>
              <th className="px-4 py-2 border-b">Medicine</th>
              <th className="px-4 py-2 border-b">Dosage</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((rx) => (
              <tr key={rx.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{rx.id}</td>
                <td className="px-4 py-2 border-b">{rx.patient}</td>
                <td className="px-4 py-2 border-b">{rx.medicine}</td>
                <td className="px-4 py-2 border-b">{rx.dosage}</td>
              </tr>
            ))}
            {prescriptions.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                  No prescriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JuniorDoctorPrescriptions;
