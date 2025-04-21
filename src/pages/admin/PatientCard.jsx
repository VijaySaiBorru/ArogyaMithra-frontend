import React from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import moment from 'moment'; // for formatting dates

const PatientCard = ({ patient, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-2">{patient.name}</h3>
      <p><strong>Username:</strong> {patient.username}</p>
      <p><strong>Gender:</strong> {patient.gender}</p>
      <p><strong>DOB:</strong> {moment(patient.dob).format('DD MMM YYYY')}</p>
      <p><strong>Email:</strong> {patient.email}</p>
      <p><strong>Contact:</strong> {patient.contact}</p>
      <p><strong>Address:</strong> {patient.address}</p>
      <p><strong>Blood Group:</strong> {patient.bloodgroup}</p>
      <p><strong>Insurance ID:</strong> {patient.insurance_id}</p>
      <p><strong>Joined Date:</strong> {moment(patient.joined_date).format('DD MMM YYYY')}</p>
      <p><strong>Medical History:</strong> {patient.medical_history || "N/A"}</p>

      <div className="flex justify-end mt-4 space-x-3">
        <button
          onClick={() => onEdit(patient)}
          className="text-blue-500 hover:text-blue-700"
          title="Edit"
        >
          <PencilIcon size={18} />
        </button>
        {/* <button
          onClick={() => onDelete(patient)}
          className="text-red-500 hover:text-red-700"
          title="Delete"
        >
          <TrashIcon size={18} />
        </button> */}
      </div>
    </div>
  );
};

export default PatientCard;
