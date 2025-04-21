import React, { useEffect, useState } from 'react';
import { useGetTreatmentsForPatientQuery } from '../../redux/treatment/treatmentApi';

const TreatmentDisplay = ({ patientData }) => {
  const [groupedData, setGroupedData] = useState([]);
   console.log(patientData);
   const { data: treatmentData, isLoading, isError } = useGetTreatmentsForPatientQuery(patientData.patient_id);

  useEffect(() => {
    if (treatmentData && treatmentData.length > 0) {
      const appointmentMap = {};

      treatmentData.forEach((entry) => {
        const { appointment_id, treatment_id, diagnosis, treatment_plan, medications } = entry;

        if (!appointmentMap[appointment_id]) {
          appointmentMap[appointment_id] = {
            appointment_id,
            treatments: {},
          };
        }

        if (!appointmentMap[appointment_id].treatments[treatment_id]) {
          appointmentMap[appointment_id].treatments[treatment_id] = {
            treatment_id,
            diagnosis: diagnosis || 'N/A',
            treatment_plan: treatment_plan || 'N/A',
            medications: [],
          };
        }

        // Push all medications under this treatment
        if (Array.isArray(medications)) {
          medications.forEach((med) => {
            appointmentMap[appointment_id].treatments[treatment_id].medications.push({
              medicine_name: med.medicine_name || 'N/A',
              dosage: med.dosage || '-',
              frequency: med.frequency || '-',
              duration: med.duration || '-',
            });
          });
        }
      });

      const structured = Object.values(appointmentMap).map((appointment) => ({
        ...appointment,
        treatments: Object.values(appointment.treatments),
      }));

      setGroupedData(structured);
    }
  }, [treatmentData]);

    if (isLoading) return <p className="text-gray-500">Loading treatment data...</p>;
    if (isError) return <p className="text-red-500">Failed to load treatment data.</p>;


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Treatment Records</h2>

      {groupedData.length > 0 ? (
        groupedData.map((appointment) => (
          <div key={appointment.appointment_id} className="mb-10">
            <h3 className="text-lg font-bold text-indigo-600 mb-3">
              Appointment ID: {appointment.appointment_id}
            </h3>

            {appointment.treatments.map((treatment) => (
              <div
                key={treatment.treatment_id}
                className="border border-blue-300 bg-blue-50 rounded-xl shadow p-5 mb-6"
              >
                <div className="mb-4">
                  <h4 className="text-xl font-semibold text-blue-900">
                    Treatment ID: {treatment.treatment_id}
                  </h4>
                  <p className="text-sm text-gray-700">
                    <strong>Diagnosis:</strong> {treatment.diagnosis}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Treatment Plan:</strong> {treatment.treatment_plan}
                  </p>
                </div>

                {treatment.medications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border text-sm rounded">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left p-2 border">Medicine Name</th>
                          <th className="text-left p-2 border">Dosage</th>
                          <th className="text-left p-2 border">Frequency</th>
                          <th className="text-left p-2 border">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {treatment.medications.map((med, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-2 border">{med.medicine_name}</td>
                            <td className="p-2 border">{med.dosage}</td>
                            <td className="p-2 border">{med.frequency}</td>
                            <td className="p-2 border">{med.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No medications prescribed.</p>
                )}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No treatment records available.</p>
      )}
    </div>
  );
};

export default TreatmentDisplay;
