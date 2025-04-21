import React, { useState } from 'react';
import { useGetCompletedTestsQuery, useEditTestResultMutation } from '../../redux/test/testApi';

const CompletedTests = () => {
  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [testToEdit, setTestToEdit] = useState(null);
  const [result, setResult] = useState('');
  const [testDate, setTestDate] = useState('');
  const [file, setFile] = useState('');

  const limit = 10;

  const { data: testsData, error, isLoading, isError } = useGetCompletedTestsQuery({ page, limit });
  const [editTestResult] = useEditTestResultMutation();

  // Always work with an array for mapping
  const data = Array.isArray(testsData) ? testsData : [];

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error fetching completed tests: {error?.message || "Unknown error"}
      </div>
    );
  }

  // Render empty state when no data is available
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No completed tests found.
      </div>
    );
  }

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1)); // Prevent going below page 1
  };

  const handleViewReport = (base64Report) => {
    if (!base64Report) return;
    const base64Data = base64Report.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArrays], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open();
    newWindow.document.write('<iframe src="' + url + '" width="100%" height="100%" frameborder="0"></iframe>');
  };

  const handleEdit = (test) => {
    setTestToEdit(test);
    setResult(test.result || '');
    setTestDate(new Date(test.test_date).toISOString().split('T')[0]);
    setFile(null); // Reset file input
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      let base64File = testToEdit.file;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          base64File = reader.result;
          try {
            await editTestResult({
              prescribed_test_id: testToEdit.prescribed_test_id,
              result,
              test_date: testDate,
              file: base64File,
            }).unwrap();
            setIsEditing(false); // Close the modal after saving
          } catch (error) {
            alert('Failed to save test result: ' + (error?.data?.error || error.message));
          }
        };
        reader.readAsDataURL(file);
      } else {
        await editTestResult({
          prescribed_test_id: testToEdit.prescribed_test_id,
          result,
          test_date: testDate,
          file: base64File || null,
        }).unwrap();
        setIsEditing(false);
      }
    } catch (error) {
      alert('Failed to save test result: ' + (error?.data?.error || error.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Completed Prescribed Tests</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Test ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Appointment ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Test Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Result</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Test Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Report</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((test) => (
              <tr key={test.prescribed_test_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{test.prescribed_test_id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{test.appointment_id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{test.test_name}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{test.result || 'Pending'}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{test.test_date ? new Date(test.test_date).toLocaleDateString() : ''}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {test.file && (
                    <button
                      onClick={() => handleViewReport(test.file)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      View Report
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  <button
                    onClick={() => handleEdit(test)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page}</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Edit Test Result</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Result</label>
              <input
                type="text"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Test Date</label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Report File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedTests;
