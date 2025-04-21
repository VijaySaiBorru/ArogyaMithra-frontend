import React, { useEffect, useState } from 'react';
import { useUpdatePatientMutation } from '../../redux/patient/patientApi';
import getBaseUrl from '../../utils/baseURL';
import { useDispatch } from 'react-redux';
import { setPatient } from '../../redux/patient/patientSlice';

const PatientProfile = ({ patientData }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    age: '',
    gender: '',
    bloodgroup: '',
    medical_history: '',
    password: '',
    dob: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const [updatePatient, { isLoading, isSuccess, isError, error }] = useUpdatePatientMutation();

  useEffect(() => {
    if (patientData) {
      setFormData({
        name: patientData.name || '',
        username: patientData.username || '',
        email: patientData.email || '',
        age: patientData.age || '',
        gender: patientData.gender || '',
        bloodgroup: patientData.bloodgroup || '',
        medical_history: patientData.medical_history || '',
        password: '',
        dob: patientData.dob || '',
      });
    }
  }, [patientData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordValidation = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!regex.test(password)) {
      setPasswordError('Password must be at least 8 characters long, with one uppercase and one lowercase letter.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && !handlePasswordValidation(formData.password)) return;

    if (!formData.name || !formData.username || !formData.email) {
      setFormError('All fields are required.');
      return;
    }

    const updatedData = { ...formData ,
      dob: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : null,
    };
    if (!updatedData.password) delete updatedData.password;


    try {
      const response = await updatePatient({ patient_id: patientData.id, data: updatedData }).unwrap();
      dispatch(setPatient({ patient: response.patient }));
      setShowModal(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const displayGender = (gender) => {
    switch (gender) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      case 'O':
        return 'Other';
      default:
        return '';
    }
  };

  if (!patientData) {
    return <p>Loading profile data...</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold">Patient Profile</h1>
        <p className="text-xl mt-2">Manage your profile details here.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mt-6 relative">
        <button
          onClick={() => setShowModal(true)}
          className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-200"
        >
          Update Profile
        </button>

        <div className="space-y-4">
          <p className="text-lg"><strong>Full Name:</strong> {patientData.name}</p>
          <p className="text-lg"><strong>Username:</strong> {patientData.username}</p>
          <p className="text-lg"><strong>Email:</strong> {patientData.email}</p>
          <p className="text-lg"><strong>Age:</strong> {calculateAge(patientData.dob)}</p>
          <p className="text-lg"><strong>Gender:</strong> {displayGender(patientData.gender)}</p>
          <p className="text-lg"><strong>Blood Group:</strong> {patientData.bloodgroup}</p>
          <p className="text-lg"><strong>Medical History:</strong> {patientData.medical_history}</p>
          <p className="text-lg"><strong>Joined:</strong> {new Date(patientData.joined_date).toLocaleDateString()}</p>
        </div>
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
        onClick={() => setShowModal(false)}
      >
        &times;
      </button>

      <div className="text-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">Update Profile</h3>
        <p className="bg-green-100 text-green-700 text-sm p-2 rounded mt-2 inline-block">
          You can update only the fields you want to change.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold">Full Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />

          <label htmlFor="username" className="block text-sm font-semibold">Username</label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
            className="w-full border p-2 rounded"
          />

          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />

        <label htmlFor="dob" className="block text-sm font-semibold">Date of Birth</label>
        <input
          id="dob"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />


          <label htmlFor="gender" className="block text-sm font-semibold">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>

          <label htmlFor="bloodGroup" className="block text-sm font-semibold">Blood Group</label>
          <input
            id="bloodgroup"
            name="bloodgroup"
            value={formData.bloodgroup}
            onChange={handleInputChange}
            placeholder="Blood Group"
            className="w-full border p-2 rounded"
          />

          <label htmlFor="medical_history" className="block text-sm font-semibold">Medical History</label>
          <textarea
            id="medical_history"
            name="medical_history"
            value={formData.medical_history}
            onChange={handleInputChange}
            placeholder="Medical History"
            className="w-full border p-2 rounded"
          />

          <label htmlFor="password" className="block text-sm font-semibold">New Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="New Password"
            className="w-full border p-2 rounded"
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-all duration-200">
          {isLoading ? 'Updating...' : 'Save Changes'}
        </button>

        {isError && <p className="text-red-500 text-sm">Error: {error?.data?.error || 'Update failed'}</p>}
        {isSuccess && <p className="text-green-500 text-sm">Profile updated!</p>}
        {formError && <p className="text-red-500 text-sm">{formError}</p>}
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default PatientProfile;
