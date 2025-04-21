import React, { useState } from 'react';
import { useAddTestResultsMutation } from '../../redux/test/testApi';
import Swal from 'sweetalert2';

const EnterTestData = () => {
  const [formData, setFormData] = useState({
    prescribed_test_id: '',
    result: '',
    test_date: '',
    file: '', // base64 string
  });
  const [fileName, setFileName] = useState('');
  const [formError, setFormError] = useState('');
  const [addTestResults, { isLoading, isSuccess, isError, error }] = useAddTestResultsMutation();

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
      const base64String = reader.result;
      setFormData((prev) => ({ ...prev, file: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { prescribed_test_id, result, test_date, file } = formData;
    if (!prescribed_test_id || !result || !test_date || !file) {
      setFormError('All fields including PDF report are required.');
      return;
    }
  
    try {
      await addTestResults(formData).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Test result added successfully!',
      });
      setFormData({ prescribed_test_id: '', result: '', test_date: '', file: '' });
      setFileName('');
      setFormError('');
    } catch (err) {
      console.error('Error submitting result:', err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was an error submitting the test result.',
      });
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Enter Test Results</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prescribed_test_id" className="block text-sm font-medium">
            Prescribed Test ID
          </label>
          <input
            type="text"
            id="prescribed_test_id"
            name="prescribed_test_id"
            value={formData.prescribed_test_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g. 101"
          />
        </div>

        <div>
          <label htmlFor="result" className="block text-sm font-medium">
            Result
          </label>
          <input
            type="text"
            id="result"
            name="result"
            value={formData.result}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g. Positive/Negative"
          />
        </div>

        <div>
          <label htmlFor="test_date" className="block text-sm font-medium">
            Test Date
          </label>
          <input
            type="date"
            id="test_date"
            name="test_date"
            value={formData.test_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Modern File Upload */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium mb-1">
            Upload PDF Report
          </label>
          <div className="flex items-center gap-3">
            {/* Hidden file input */}
            <input
              type="file"
              id="file"
              name="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Styled label as button */}
            <label
              htmlFor="file"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all font-medium shadow"
            >
              Choose PDF
            </label>
            {/* Show file name if selected */}
            {fileName && (
              <span className="text-sm text-gray-700 truncate max-w-[120px]">{fileName}</span>
            )}
          </div>
        </div>

        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        {isError && <p className="text-red-500 text-sm">Error: {error?.data?.error || 'Failed to submit result'}</p>}
        {isSuccess && <p className="text-green-500 text-sm">Test result submitted successfully!</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
        >
          {isLoading ? 'Submitting...' : 'Submit Result'}
        </button>
      </form>
    </div>
  );
};

export default EnterTestData;
