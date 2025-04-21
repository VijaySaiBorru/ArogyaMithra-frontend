import React, { useEffect, useState } from 'react';

const TreatmentDisplay = ({ treatmentData }) => {
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    if (treatmentData && treatmentData.length > 0) {
      // First group by appointment_id
      const groupedByAppointment = treatmentData.reduce((acc, curr) => {
        const appointmentId = curr.appointment_id;
        const treatmentId = curr.treatment_id;

        if (!acc[appointmentId]) {
          acc[appointmentId] = {
            appointment_id: appointmentId,
            treatments: {}
          };
        }

        if (!acc[appointmentId].treatments[treatmentId]) {
          acc[appointmentId].treatments[treatmentId] = {
            treatment_id: treatmentId,
            diagnosis: curr.diagnosis || 'N/A',
            treatment_plan: curr.treatment_plan || 'N/A',
            medications: [],
          };
        }

        if (Array.isArray(curr.medications)) {
          curr.medications.forEach((med) => {
            acc[appointmentId].treatments[treatmentId].medications.push({
              medicine_name: med.medicine_name || 'N/A',
              dosage: med.dosage || '-',
              frequency: med.frequency || '-',
              duration: med.duration || '-',
            });
          });
        }

        return acc;
      }, {});

      // Convert object to array
      const structured = Object.values(groupedByAppointment).map((appointment) => ({
        ...appointment,
        treatments: Object.values(appointment.treatments),
      }));

      setGroupedData(structured);
    }
  }, [treatmentData]);

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
