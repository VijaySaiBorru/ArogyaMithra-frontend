import React, { useState } from 'react';
import { useGetAllTestsQuery, usePrescribeTestsMutation } from '../../redux/test/testApi';
import { useGetAppointmentDetailsQuery } from '../../redux/appointment/appointmentApi';

const AddTestForm = ({ appointmentId }) => {
  const { data: tests, isLoading } = useGetAllTestsQuery();
  const [selectedTests, setSelectedTests] = useState([]);
  const [search, setSearch] = useState('');
  const [prescribeTests, { isLoading: prescribing, isSuccess, isError, error }] = usePrescribeTestsMutation();
  const { data: appointment, isLoading: loadingAppointment } = useGetAppointmentDetailsQuery(appointmentId);

  const handleCheckboxChange = (testId) => {
    setSelectedTests((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await prescribeTests({ appointment_id: appointmentId, test_ids: selectedTests }).unwrap();
      alert("Tests prescribed successfully!");
      setSelectedTests([]);
    } catch (err) {
      console.error("Prescription error:", err);
    }
  };

  const filteredTests = tests?.filter((test) =>
    test.test_name.toLowerCase().includes(search.toLowerCase())
  );

  const getTestName = (testId) => tests?.find((t) => t.test_id === testId)?.test_name || testId;

  return (
    <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto">
      {/* Appointment Details */}
      {loadingAppointment ? (
        <p className="text-gray-500">Loading appointment details...</p>
      ) : appointment ? (
        <div className="bg-gray-100 p-4 rounded shadow mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Appointment Details</h3>
          <p><span className="font-semibold">Patient Name:</span> {appointment.patient.name}</p>
          <p><span className="font-semibold">Doctor:</span> {appointment.name}</p>
          <p><span className="font-semibold">Date:</span> {new Date(appointment.date_time).toLocaleDateString()}</p>
          <p><span className="font-semibold">Reason:</span> {appointment.notes}</p>
        </div>
      ) : (
        <p className="text-red-600">Failed to load appointment details.</p>
      )}

      <h2 className="text-xl font-bold mb-4">Prescribe Tests for Appointment No - {appointmentId}</h2>

      {/* Search Bar with Button */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => {
            // This will re-filter the tests with current search term
            const searchTerm = search.trim();
            setSearch(searchTerm);
          }}
          className="text-white absolute end-2.5 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5"
        >
          Search
        </button>
      </div>

      {/* Test List */}
      {isLoading ? (
        <p className="text-gray-500">Loading tests...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="border border-gray-200 p-4 rounded mb-4 bg-gray-50 max-h-40 overflow-y-auto">
            {filteredTests?.length > 0 ? (
              filteredTests.map((test) => (
                <div key={test.test_id} className="flex items-start space-x-2 mb-3">
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(test.test_id)}
                    onChange={() => handleCheckboxChange(test.test_id)}
                    className="h-5 w-5 mt-1"
                  />
                  <div>
                    <p className="font-medium">{test.test_name}</p>
                    <p className="text-sm text-gray-600">Test ID: {test.test_id}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tests found for this search.</p>
            )}
          </div>

          {/* Selected Tests Summary */}
          {selectedTests.length > 0 && (
            <div className="mb-4 border border-blue-200 rounded">
              <div className="bg-blue-50 px-3 py-2 font-semibold text-blue-700 border-b border-blue-200 flex items-center">
                <span className="mr-2">✅</span> Selected Tests:
              </div>
              <div className="max-h-32 overflow-y-auto px-3 py-2 space-y-2">
                {selectedTests.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between bg-white px-3 py-2 border border-blue-100 rounded shadow-sm"
                  >
                    <span>{getTestName(id)}</span>
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange(id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      ❌ Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white py-2 z-10">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={prescribing || selectedTests.length === 0}
            >
              {prescribing ? "Prescribing..." : "Prescribe Selected Tests"}
            </button>
          </div>

          {/* Success / Error Messages */}
          {isSuccess && <p className="text-green-600 mt-2">✔ Tests prescribed successfully!</p>}
          {isError && <p className="text-red-600 mt-2">❌ Error: {error?.data?.error || "Something went wrong."}</p>}
        </form>
      )}
    </div>
  );
};

export default AddTestForm;
