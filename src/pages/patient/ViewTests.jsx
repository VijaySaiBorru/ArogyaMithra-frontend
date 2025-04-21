import React, { useState } from 'react';
import { useGetTestResultsForPatientQuery } from '../../redux/test/testApi';

const ViewTests = ({ patientData }) => {
  const { patient_id } = patientData;
  const { data, error, isLoading } = useGetTestResultsForPatientQuery(patient_id);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  if (isLoading) return <div className="text-center mt-4 text-blue-500">Loading test results...</div>;
  if (error) return <div className="text-center mt-4 text-red-500">Error loading test results!</div>;

  const testResults = Array.isArray(data) ? data : [];

  // Group by appointment_id
  const groupedResults = testResults.reduce((acc, curr) => {
    const { appointment_id } = curr;
    if (!acc[appointment_id]) {
      acc[appointment_id] = [];
    }
    acc[appointment_id].push(curr);
    return acc;
  }, {});

  const appointmentIds = Object.keys(groupedResults);
  const totalPages = Math.ceil(appointmentIds.length / resultsPerPage);

  const paginatedAppointmentIds = appointmentIds.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const openPDF = (base64String) => {
    const byteCharacters = atob(base64String.split(',')[1] || base64String);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  const downloadPDF = (base64String, filename) => {
    const byteCharacters = atob(base64String.split(',')[1] || base64String);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Prescribed Tests and their Results
        </h2>

        {appointmentIds.length === 0 ? (
          <p className="text-center text-gray-600">No tests prescribed for this patient.</p>
        ) : (
          <>
            <div className="space-y-10">
              {paginatedAppointmentIds.map((appointmentId) => (
                <div
                  key={appointmentId}
                  className="bg-gray-50 p-6 rounded-lg shadow border"
                >
                  <h3 className="text-2xl font-semibold mb-4 text-blue-700">
                    Appointment ID: {appointmentId}
                  </h3>
                  <div className="space-y-4">
                    {groupedResults[appointmentId].map((testResult, index) => (
                      <div key={index} className="border-b border-gray-200 pb-2">
                        <p className="text-lg text-gray-700">
                          <strong>Test:</strong> {testResult.test_name}
                        </p>
                        <p className="text-gray-600">
                          <strong>Result:</strong>{' '}
                          {testResult.result || 'No result available'}
                        </p>
                        <p className="text-gray-600">
                          <strong>Test Date:</strong>{' '}
                          {testResult.test_date === 'Not available'
                            ? 'Not available'
                            : testResult.test_date.split(',')[0]}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Status:</strong>{' '}
                          <span
                            className={`font-medium ${
                              testResult.result === 'Test not completed'
                                ? 'text-yellow-500'
                                : 'text-green-500'
                            }`}
                          >
                            {testResult.result === 'Test not completed'
                              ? 'Pending'
                              : 'Completed'}
                          </span>
                        </p>

                        {/* View and Download buttons only for completed tests */}
                        {testResult.result !== 'Test not completed' && testResult.file && (
                          <div className="flex space-x-4 mt-2 gap-3">
                            <button
                              onClick={() => openPDF(testResult.file)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition-all duration-150 shadow-sm"
                            >
                              <span role="img" aria-label="View">📄</span> View Report
                            </button>
                            <button
                              onClick={() => downloadPDF(testResult.file, `${testResult.test_name}_report.pdf`)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-medium rounded hover:bg-green-200 transition-all duration-150 shadow-sm"
                            >
                              <span role="img" aria-label="Download">⬇️</span> Download Report
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium mt-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewTests;
