import React from 'react';

const AssignedPatients = ({ nurseId }) => {
  // Placeholder patient data (can remove later)
  const dummyPatients = [
    { id: 'P001', name: 'John Doe', room: '101A', diagnosis: 'Flu' },
    { id: 'P002', name: 'Jane Smith', room: '102B', diagnosis: 'Fracture' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🧍‍♂️ Assigned Patients</h2>

      {/* Info Text */}
      <p className="text-sm text-gray-600 mb-4">
        Nurse ID: <span className="font-medium">{nurseId}</span>
      </p>

      {/* Patient Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Patient ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Room</th>
              <th className="border px-4 py-2">Diagnosis</th>
            </tr>
          </thead>
          <tbody>
            {dummyPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="border px-4 py-2">{patient.id}</td>
                <td className="border px-4 py-2">{patient.name}</td>
                <td className="border px-4 py-2">{patient.room}</td>
                <td className="border px-4 py-2">{patient.diagnosis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedPatients;
