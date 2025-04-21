import React, { useState, useEffect } from "react";
import {
  useAddTreatmentMutation,
  useGetTreatmentByAppointmentQuery,
} from "../../redux/treatment/treatmentApi";
import { useGetAppointmentDetailsQuery } from "../../redux/appointment/appointmentApi";

const AddTreatmentDoctor = ({ appointmentId }) => {
  console.log(appointmentId);
  const [formData, setFormData] = useState({
    appointment_id: appointmentId || "",
    diagnosis: "",
    treatment_plan: "",
    medications: [{ medicine_name: "", dosage: "", frequency: "", duration: "" }],
  });

  const [addTreatment, { isLoading, isSuccess, isError, error }] = useAddTreatmentMutation();
  const [updateTreatment] = useAddTreatmentMutation();
  const { data: appointment, isLoading: loadingAppointment } = useGetAppointmentDetailsQuery(appointmentId);
  const { data: existingTreatment, isLoading: loadingTreatment } = useGetTreatmentByAppointmentQuery(appointmentId);

  useEffect(() => {
    // Make sure we don't set existing data in the form to prevent pre-filling
    if (existingTreatment) {
      // Optionally handle logic for update scenario if needed, but no pre-filling
    }
  }, [existingTreatment, appointmentId]);

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (field !== null && index !== null) {
      const meds = [...formData.medications];
      meds[index][field] = value;
      setFormData({ ...formData, medications: meds });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addMedicationField = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { medicine_name: "", dosage: "", frequency: "", duration: "" }],
    }));
  };

  const removeMedicationField = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validMedications = formData.medications.filter(
      (med) => med.medicine_name.trim() !== ""
    );

    const payload = {
      ...formData,
      medications: validMedications,
    };

    try {
      if (existingTreatment) {
        await updateTreatment(payload).unwrap();
        alert("Treatment updated successfully!");
      } else {
        await addTreatment(payload).unwrap();
        alert("Treatment added successfully!");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow h-[calc(100vh-80px)] flex flex-col overflow-hidden mt-2">
      <div className="p-6 overflow-y-auto flex-grow">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Enter Treatment Data</h2>

        {loadingAppointment || loadingTreatment ? (
          <p className="text-gray-500">Loading appointment and treatment details...</p>
        ) : appointment ? (
          <div className="bg-gray-100 p-4 rounded shadow mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Appointment Details</h3>
            <p><span className="font-semibold">Patient Name:</span> {appointment.patient.name}</p>
            <p><span className="font-semibold">Doctor:</span> {appointment.name}</p>
            <p><span className="font-semibold">Date:</span> {new Date(appointment.date_time).toLocaleDateString()}</p>
            <p><span className="font-semibold">Time:</span> {appointment.time}</p>
            <p><span className="font-semibold">Reason:</span> {appointment.notes}</p>
          </div>
        ) : (
          <p className="text-red-600">Failed to load appointment details.</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="diagnosis"
            placeholder="Diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
            className="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="treatment_plan"
            placeholder="Treatment Plan"
            value={formData.treatment_plan}
            onChange={handleChange}
            required
            className="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Medications</h3>
            {formData.medications.map((med, index) => (
              <div key={index} className="relative mb-4">
                <div className="flex flex-wrap gap-3 pr-8">
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={med.medicine_name}
                    onChange={(e) => handleChange(e, index, "medicine_name")}
                    className="flex-1 min-w-[150px] p-2 border border-black rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => handleChange(e, index, "dosage")}
                    className="w-28 p-2 border border-black rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) => handleChange(e, index, "frequency")}
                    className="w-32 p-2 border border-black rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => handleChange(e, index, "duration")}
                    className="w-32 p-2 border border-black rounded"
                    required
                  />
                </div>
                {formData.medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicationField(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-lg font-bold"
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMedicationField}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              + Add another medication
            </button>
          </div>

          {isSuccess && <p className="text-green-600">✔ Treatment saved successfully!</p>}
          {isError && <p className="text-red-600">❌ Error: {error?.data?.error || "Something went wrong."}</p>}
        </form>
      </div>

      <div className="p-6 border-t bg-gray-50">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? "Submitting..." : existingTreatment ? "Update Treatment" : "Submit Treatment"}
        </button>
      </div>
    </div>
  );
};

export default AddTreatmentDoctor;
