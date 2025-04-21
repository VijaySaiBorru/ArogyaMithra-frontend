import React, { useState } from 'react';
import { useAdmitPatientMutation } from '../../redux/admission/admissionApi';
import { useGetAvailableRoomsQuery } from '../../redux/room/roomApi';
import { useSearchPatientsQuery } from '../../redux/patient/patientApi';

const AdmitPatient = () => {
  const [admitPatient, { isLoading, isError, error }] = useAdmitPatientMutation();
  const { data: roomsResponse, isLoading: roomsLoading, isError: roomsError, refetch } = useGetAvailableRoomsQuery();

  const availableRooms = roomsResponse?.available_rooms
    ? Object.values(roomsResponse.available_rooms).flat()
    : [];

  const [formData, setFormData] = useState({
    patient_name: '',
    room_id: '',
    total_fees: '',
    remaining_fees: '',
    fee_paid_details: [], // Can be empty if no fee paid
  });

  const [formError, setFormError] = useState('');
  const [patientQuery, setPatientQuery] = useState('');
  const { data: patientSuggestions = [] } = useSearchPatientsQuery(patientQuery, {
    skip: patientQuery.length < 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientSelect = (username) => {
    setFormData((prev) => ({ ...prev, patient_name: username }));
    setPatientQuery(''); // Clear suggestions
  };

  const handleFeePaidDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFeePaidDetails = [...formData.fee_paid_details];
    updatedFeePaidDetails[index] = { ...updatedFeePaidDetails[index], [name]: value };
    setFormData((prev) => ({ ...prev, fee_paid_details: updatedFeePaidDetails }));
  };

  const handleAddFeePaidDetail = () => {
    setFormData((prev) => ({
      ...prev,
      fee_paid_details: [
        ...prev.fee_paid_details,
        { amount_paid: '', payment_method: '', payment_date: '', transaction_id: '' },
      ],
    }));
  };

  const handleRemoveFeePaidDetail = (index) => {
    const updatedFeePaidDetails = formData.fee_paid_details.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, fee_paid_details: updatedFeePaidDetails }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { patient_name, room_id, total_fees, remaining_fees, fee_paid_details } = formData;

    // Validate form
    if (!patient_name || !room_id || !total_fees || !remaining_fees) {
      setFormError('Patient Name, Room, Total Fees, and Remaining Fees are required.');
      return;
    }

    try {
      // Check room availability and other conditions from backend
      await admitPatient(formData).unwrap();
      alert('Patient admitted successfully!');
      
      // Refetch rooms after successful admission
      refetch();

      setFormData({
        patient_name: '',
        room_id: '',
        total_fees: '',
        remaining_fees: '',
        fee_paid_details: [], // Reset the fee details
      });
      setFormError('');
    } catch (err) {
      console.error('Error admitting patient:', err);
      setFormError('Error admitting patient.');
    }
  };

  return (
    <div className=" mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-4">Admit Patient</h1>

      {/* No available rooms message */}
      {availableRooms.length === 0 ? (
        <p className="text-red-500 text-center">No rooms available, can't admit patients at the moment.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient search input */}
          <div className="relative">
            <label htmlFor="patient_name" className="block text-sm font-semibold">
              Patient User Name
            </label>
            <input
              id="patient_name"
              name="patient_name"
              type="text"
              value={formData.patient_name}
              onChange={(e) => {
                handleInputChange(e);
                setPatientQuery(e.target.value);
              }}
              className="w-full border p-3 rounded-lg"
              placeholder="Type to search patient"
              autoComplete="off"
            />
            {patientQuery.length >= 2 && patientSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full mt-1 rounded max-h-40 overflow-y-auto shadow">
                {patientSuggestions.map((p) => (
                  <li
                    key={p.patient_id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePatientSelect(p.username)}
                  >
                    {p.username} ({p.name}) (Patient id - {p.patient_id})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Room select dropdown */}
          <div>
            <label htmlFor="room_id" className="block text-sm font-semibold">Available Room</label>
            <select
              id="room_id"
              name="room_id"
              value={formData.room_id}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select a Room</option>
              {roomsLoading && <option disabled>Loading rooms...</option>}
              {roomsError && <option disabled>Error loading rooms</option>}
              {availableRooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  Room #{room.room_number} - {room.type} ({room.charges_per_day}/day)
                </option>
              ))}
            </select>
          </div>

          {/* Fees Inputs */}
          <div>
            <label htmlFor="total_fees" className="block text-sm font-semibold">Total Fees</label>
            <input
              id="total_fees"
              name="total_fees"
              type="number"
              value={formData.total_fees}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-lg"
              placeholder="Total Fees"
            />
          </div>

          <div>
            <label htmlFor="remaining_fees" className="block text-sm font-semibold">Remaining Fees</label>
            <input
              id="remaining_fees"
              name="remaining_fees"
              type="number"
              value={formData.remaining_fees}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-lg"
              placeholder="Remaining Fees"
            />
          </div>

          {/* Fee Paid Details (Optional) */}
          <div>
            <label className="block text-sm font-semibold">Fee Paid Details (Optional)</label>
            {formData.fee_paid_details.map((detail, index) => (
              <div key={index} className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    name="amount_paid"
                    value={detail.amount_paid}
                    onChange={(e) => handleFeePaidDetailsChange(index, e)}
                    className="w-1/4 border p-3 rounded-lg"
                    placeholder="Amount Paid"
                  />
                  <input
                    name="payment_method"
                    value={detail.payment_method}
                    onChange={(e) => handleFeePaidDetailsChange(index, e)}
                    className="w-1/4 border p-3 rounded-lg"
                    placeholder="Payment Method"
                  />
                  <input
                    name="payment_date"
                    value={detail.payment_date}
                    onChange={(e) => handleFeePaidDetailsChange(index, e)}
                    className="w-1/4 border p-3 rounded-lg"
                    placeholder="Payment Date"
                  />
                  <input
                    name="transaction_id"
                    value={detail.transaction_id}
                    onChange={(e) => handleFeePaidDetailsChange(index, e)}
                    className="w-1/4 border p-3 rounded-lg"
                    placeholder="Transaction ID"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeePaidDetail(index)}
                    className="text-red-500 p-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddFeePaidDetail}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200"
            >
              Add Fee Payment
            </button>
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            {isLoading ? 'Admitting...' : 'Admit Patient'}
          </button>

          {isError && <p className="text-red-500 text-sm">Error: {error?.data?.error || 'Admission failed'}</p>}
        </form>
      )}
    </div>
  );
};

export default AdmitPatient;
