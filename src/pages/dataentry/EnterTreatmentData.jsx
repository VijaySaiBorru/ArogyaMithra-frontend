import React, { useState } from "react";
import { useAddTreatmentMutation } from "../../redux/treatment/treatmentApi";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import swal from "sweetalert";
import TreatmentPDF from "../../components/pdf/TreatmentPDF";
import { useGetAppointmentDetailsQuery } from "../../redux/appointment/appointmentApi";

const EnterTreatmentData = () => {
  const [formData, setFormData] = useState({
    appointment_id: "",
    diagnosis: "",
    treatment_plan: "",
    medications: [
      { medicine_name: "", dosage: "", frequency: "", duration: "" },
    ],
  });

  const [addTreatment, { isLoading }] = useAddTreatmentMutation();
  const { data: appointmentDetails } = useGetAppointmentDetailsQuery(formData.appointment_id, {
    skip: !formData.appointment_id,
  });
  
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
    try {
      await addTreatment(formData).unwrap();
  
      const willDownload = await swal({
        title: "Success!",
        text: "Treatment added successfully. Do you want to download the prescription?",
        icon: "success",
        buttons: ["No", "Yes"],
      });
  
      if (willDownload) {
        const blob = await pdf(
          <TreatmentPDF data={formData} appointmentDetails={appointmentDetails} />
        ).toBlob();
        
        saveAs(blob, `Prescription_${formData.appointment_id}.pdf`);
      } else {
        await swal("Done!", "Treatment was added successfully.", "success");
      }
  
      // Reset form
      setFormData({
        appointment_id: "",
        diagnosis: "",
        treatment_plan: "",
        medications: [
          { medicine_name: "", dosage: "", frequency: "", duration: "" },
        ],
      });
    } catch (err) {
      console.error("Submission error:", err);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };
  

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Enter Treatment Data</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="appointment_id"
          placeholder="Appointment ID"
          value={formData.appointment_id}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <textarea
          name="treatment_plan"
          placeholder="Treatment Plan"
          value={formData.treatment_plan}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        ></textarea>

        <div>
          <h3 className="text-lg font-semibold mb-2">Medications</h3>
          {formData.medications.map((med, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Medicine Name"
                value={med.medicine_name}
                onChange={(e) => handleChange(e, index, "medicine_name")}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Dosage"
                value={med.dosage}
                onChange={(e) => handleChange(e, index, "dosage")}
                className="w-32 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Frequency"
                value={med.frequency}
                onChange={(e) => handleChange(e, index, "frequency")}
                className="w-32 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Duration"
                value={med.duration}
                onChange={(e) => handleChange(e, index, "duration")}
                className="w-32 p-2 border rounded"
              />
              {formData.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicationField(index)}
                  className="text-red-600 hover:text-red-800 font-bold text-xl"
                  title="Remove"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addMedicationField}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Add another medication
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {isLoading ? "Submitting..." : "Submit Treatment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnterTreatmentData;
