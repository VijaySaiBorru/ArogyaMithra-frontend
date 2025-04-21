import React, { useState } from 'react';

const RecordVitals = ({ nurseId }) => {
  const [vitals, setVitals] = useState({
    patientId: '',
    temperature: '',
    pulse: '',
    bloodPressure: '',
  });

  const handleChange = (e) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for submit logic
    console.log("Submitting vitals:", vitals);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🩺 Record Patient Vitals</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={vitals.patientId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter patient ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Temperature (°C)</label>
          <input
            type="number"
            name="temperature"
            value={vitals.temperature}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., 98.6"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Pulse (bpm)</label>
          <input
            type="number"
            name="pulse"
            value={vitals.pulse}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., 72"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Blood Pressure (mmHg)</label>
          <input
            type="text"
            name="bloodPressure"
            value={vitals.bloodPressure}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., 120/80"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Vitals
        </button>
      </form>
    </div>
  );
};

export default RecordVitals;
