import React, { useState } from 'react';
import {
  useGetAllPatientsQuery,
  useDeletePatientMutation,
  useUpdatePatientMutation,
} from '../../redux/patient/patientApi';
import PatientCard from './PatientCard';
import Swal from 'sweetalert2';

const ManagePatients = () => {
  const { data: patients, error, isLoading } = useGetAllPatientsQuery();
  const [deletePatient] = useDeletePatientMutation();
  const [updatePatient] = useUpdatePatientMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  const handleDelete = async (patient) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${patient.name}'s record.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deletePatient(patient.patient_id).unwrap();
        Swal.fire('Deleted!', 'The patient has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', 'There was an issue deleting the patient.', 'error');
      }
    }
  };

  const handleEdit = (patient) => {
    console.log(patient);
    setCurrentPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedPatient) => {
    try {
      const { patient_id, ...data } = updatedPatient;
  
      console.log('Sending to backend:',patient_id, data);
         await updatePatient({ patient_id, data:data }).unwrap();
  
      Swal.fire('Success!', 'Patient updated successfully.', 'success');
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error!', 'There was an issue updating the patient.', 'error');
    }
  };
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading patients</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Manage Patients</h1>

      {patients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <PatientCard
              key={patient.patient_id}
              patient={patient}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-4">No patients found.</p>
      )}

      {isEditModalOpen && currentPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto py-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Patient</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(currentPatient);
              }}
            >
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                value={currentPatient.name || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, name: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              />

              {/* <label className="block text-sm font-medium text-gray-600 mt-4">Age</label>
              <input
                type="number"
                value={currentPatient.age || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, age: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              /> */}

              <label className="block text-sm font-medium text-gray-600 mt-4">Gender</label>
              <select
                value={currentPatient.gender || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, gender: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>

              <label className="block text-sm font-medium text-gray-600 mt-4">DOB</label>
              <input
                type="date"
                value={currentPatient.dob || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, dob: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              />

              <label className="block text-sm font-medium text-gray-600 mt-4">Email</label>
              <input
                type="email"
                value={currentPatient.email || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, email: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              />

              <label className="block text-sm font-medium text-gray-600 mt-4">Contact</label>
              <input
                type="tel"
                value={currentPatient.contact || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, contact: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              />

              <label className="block text-sm font-medium text-gray-600 mt-4">Address</label>
              <input
                type="text"
                value={currentPatient.address || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, address: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              />

              <label className="block text-sm font-medium text-gray-600 mt-4">Blood Group</label>
              <select
                value={currentPatient.blood_group || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, blood_group: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>

              <label className="block text-sm font-medium text-gray-600 mt-4">Insurance ID</label>
              <input
                type="text"
                value={currentPatient.insurance_id || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, insurance_id: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              />

              <label className="block text-sm font-medium text-gray-600 mt-4">Medical History</label>
              <textarea
                value={currentPatient.medical_history || ''}
                onChange={(e) =>
                  setCurrentPatient({ ...currentPatient, medical_history: e.target.value })
                }
                className="w-full p-2 mt-1 border rounded-md"
              />

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;
