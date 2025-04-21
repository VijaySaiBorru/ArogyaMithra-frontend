import React, { useState } from "react";
import { useGetAdmittedPatientsQuery } from "../../redux/admission/admissionApi";

const AdmittedPatientsList = () => {
  const { data, isLoading, isError, error } = useGetAdmittedPatientsQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  // Loading and error states
  if (isLoading)
    return (
      <p className="text-center text-gray-600">Loading admitted patients...</p>
    );
  if (isError)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  // No admitted patients case
  if (!Array.isArray(data) || data.length === 0)
    return (
      <p className="text-center text-gray-600">No admitted patients found.</p>
    );

  // Pagination logic
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / patientsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
        Admitted Patients
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Admission ID</th>
              <th className="p-4 text-left">Patient ID</th>
              <th className="p-4 text-left">Patient Name</th>
              <th className="p-4 text-left">Room ID</th>
              <th className="p-4 text-left">Admit Date</th>
              <th className="p-4 text-left">Total Fees</th>
              <th className="p-4 text-left">Remaining Fees</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => (
              <tr
                key={patient.admission_id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">{patient.admission_id}</td>
                <td className="p-4">{patient.patient_id}</td>
                <td className="p-4">{patient.patient_name}</td>
                <td className="p-4">{patient.room_id}</td>
                <td className="p-4">
                  {new Date(patient.admit_date).toLocaleDateString()}
                </td>
                <td className="p-4">₹{patient.total_fees}</td>
                <td className="p-4">₹{patient.remaining_fees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdmittedPatientsList;
