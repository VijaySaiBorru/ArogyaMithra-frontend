import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRegisterFrontdeskPatientMutation } from '../../redux/patient/patientApi';  // Adjust path as per your directory structure

const RegisterPatient = () => {
  const dispatch = useDispatch();
  const [registerPatient, { isLoading, isSuccess, isError, error }] = useRegisterFrontdeskPatientMutation();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
    insurance_id: '',
    blood_group: '' // New blood group field
  });
  const [formError, setFormError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Password validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    } else if (!hasUpperCase || !hasLowerCase) {
      return 'Password must contain at least one uppercase and one lowercase letter.';
    }
    return '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (
      !formData.name ||
      !formData.dob ||
      !formData.gender ||
      !formData.contact ||
      !formData.address ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.insurance_id ||
      !formData.blood_group // Check if blood group is provided
    ) {
      setFormError('All fields are required.');
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    } else {
      setPasswordError('');
    }

    // Call the registerPatient mutation
    try {
      await registerPatient(formData).unwrap();
      setFormError('');
      alert('Patient registered successfully!');
      // Optionally, you can clear the form or redirect to another page after success
    } catch (err) {
      console.error('Registration error:', err);
      setFormError('Error registering patient.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center">Register New Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Full Name"
          />
        </div>

        <div>
          <label htmlFor="dob" className="block text-sm font-semibold">Date of Birth</label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-semibold">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-semibold">Contact</label>
          <input
            id="contact"
            name="contact"
            type="text"
            value={formData.contact}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Contact Number"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Address"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Email"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-semibold">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Password"
          />
        </div>

        <div>
          <label htmlFor="insurance_id" className="block text-sm font-semibold">Insurance ID</label>
          <input
            id="insurance_id"
            name="insurance_id"
            type="text"
            value={formData.insurance_id}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Insurance ID"
          />
        </div>

        {/* Blood Group Field */}
        <div>
          <label htmlFor="blood_group" className="block text-sm font-semibold">Blood Group</label>
          <select
            id="blood_group"
            name="blood_group"
            value={formData.blood_group}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
        >
          {isLoading ? 'Registering...' : 'Register Patient'}
        </button>

        {isError && <p className="text-red-500 text-sm">Error: {error?.data?.error || 'Registration failed'}</p>}
      </form>
    </div>
  );
};

export default RegisterPatient;
