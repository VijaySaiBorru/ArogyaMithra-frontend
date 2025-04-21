import React, { useState } from 'react';

const JuniorDoctorRecordVitals = ({ doctorId }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    temperature: '',
    bloodPressure: '',
    heartRate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Vitals:', formData);
    alert('Vitals recorded successfully (dummy)');
    setFormData({ patientId: '', temperature: '', bloodPressure: '', heartRate: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Record Vitals</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="patientId"
          placeholder="Patient ID"
          value={formData.patientId}
          onChange={handleChange}
          className="border px-3 py-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="temperature"
          placeholder="Temperature (°F)"
          value={formData.temperature}
          onChange={handleChange}
          className="border px-3 py-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="bloodPressure"
          placeholder="Blood Pressure (e.g., 120/80)"
          value={formData.bloodPressure}
          onChange={handleChange}
          className="border px-3 py-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="heartRate"
          placeholder="Heart Rate (bpm)"
          value={formData.heartRate}
          onChange={handleChange}
          className="border px-3 py-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Vitals
        </button>
      </form>
    </div>
  );
};

export default JuniorDoctorRecordVitals;
