import React, { useState } from 'react';

const MedicationLog = ({ nurseId }) => {
  const [medication, setMedication] = useState({
    patientId: '',
    medicineName: '',
    dosage: '',
    timeGiven: '',
  });

  const handleChange = (e) => {
    setMedication({ ...medication, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for Redux dispatch or API call
    console.log("Logging medication:", medication);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">💊 Log Medication Administered</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={medication.patientId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter patient ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Medicine Name</label>
          <input
            type="text"
            name="medicineName"
            value={medication.medicineName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., Paracetamol"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Dosage</label>
          <input
            type="text"
            name="dosage"
            value={medication.dosage}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., 500mg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Time Given</label>
          <input
            type="time"
            name="timeGiven"
            value={medication.timeGiven}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Log
        </button>
      </form>
    </div>
  );
};

export default MedicationLog;
