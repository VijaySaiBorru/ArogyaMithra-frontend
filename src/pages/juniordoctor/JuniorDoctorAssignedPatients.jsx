import React, { useEffect, useState } from 'react';

const dummyPatients = [
  { id: 'P001', name: 'John Doe', age: 45, condition: 'Diabetes' },
  { id: 'P002', name: 'Jane Smith', age: 37, condition: 'Hypertension' },
];

const JuniorDoctorAssignedPatients = ({ doctorId }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setPatients(dummyPatients);
    }, 500);
  }, [doctorId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Assigned Patients</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">Patient ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Age</th>
              <th className="px-4 py-2 border-b">Condition</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{patient.id}</td>
                <td className="px-4 py-2 border-b">{patient.name}</td>
                <td className="px-4 py-2 border-b">{patient.age}</td>
                <td className="px-4 py-2 border-b">{patient.condition}</td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                  No patients assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JuniorDoctorAssignedPatients;
