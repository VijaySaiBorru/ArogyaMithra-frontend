import React, { useState } from 'react';
import { useGetPendingPrescribedTestsQuery, useAddTestResultsMutation } from '../../redux/test/testApi';
import Swal from 'sweetalert2';

const UploadPendingTestResult = () => {
  const { data: pendingTestsData, isLoading: loadingTests, isError: errorTests } = useGetPendingPrescribedTestsQuery();
  const [addTestResults, { isLoading: isSubmitting }] = useAddTestResultsMutation();

  // Ensure pendingTests is always an array
  const pendingTests = Array.isArray(pendingTestsData) ? pendingTestsData : [];

  const [formData, setFormData] = useState({
    prescribed_test_id: '',
    result: '',
    test_date: '',
    file: '',
  });
  const [fileName, setFileName] = useState('');
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, file: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { prescribed_test_id, result, test_date, file } = formData;

    if (!prescribed_test_id || !result || !test_date || !file) {
      setFormError('All fields are required.');
      return;
    }

    try {
      await addTestResults(formData).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Test result uploaded successfully!',
      });
      setFormData({ prescribed_test_id: '', result: '', test_date: '', file: '' });
      setFileName('');
      setFormError('');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err?.data?.error || 'Something went wrong while submitting.',
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Upload Pending Test Result</h2>

      {loadingTests ? (
        <p className="text-center text-gray-500">Loading pending tests...</p>
      ) : errorTests ? (
        <p className="text-red-500 text-center">Failed to load pending tests</p>
      ) : pendingTests.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No pending prescribed tests found!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prescribed_test_id" className="block text-sm font-medium">
              Select Pending Prescribed Test
            </label>
            <select
              name="prescribed_test_id"
              id="prescribed_test_id"
              value={formData.prescribed_test_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select Test --</option>
              {pendingTests.map((test) => (
                <option key={test.prescribed_test_id} value={test.prescribed_test_id}>
                  {`[Prescribed Test Id - ${test.prescribed_test_id}] ${test.test_name} (Appointment ID: ${test.appointment_id})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="result" className="block text-sm font-medium">
              Result
            </label>
            <input
              type="text"
              name="result"
              id="result"
              value={formData.result}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="e.g. Positive / Negative"
            />
          </div>

          <div>
            <label htmlFor="test_date" className="block text-sm font-medium">
              Test Date
            </label>
            <input
              type="date"
              name="test_date"
              id="test_date"
              value={formData.test_date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium mb-1">
              Upload PDF Report
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="file"
                name="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
              >
                Choose PDF
              </label>
              {fileName && <span className="text-sm text-gray-700 truncate max-w-[120px]">{fileName}</span>}
            </div>
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Result'}
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadPendingTestResult;
