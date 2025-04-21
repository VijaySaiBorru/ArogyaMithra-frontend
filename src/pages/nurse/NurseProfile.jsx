import React, { useEffect, useState } from 'react';
import { useUpdateHCPMutation } from '../../redux/hcp/hcpApi';
import getBaseUrl from '../../utils/baseURL';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/userSlice';

const NurseProfile = ({ nurseData }) => {
  const dispatch = useDispatch();
  const [imageSrc, setImageSrc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    designation: '',
    specialization: '',
    contact: '',
    salary: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateHCPMutation();

  useEffect(() => {
    if (nurseData) {
      setFormData({
        name: nurseData.name || '',
        username: nurseData.username || '',
        email: nurseData.email || '',
        role: nurseData.role || '',
        designation: nurseData.hcpData?.designation || '',
        specialization: nurseData.hcpData?.specialization || '',
        contact: nurseData.hcpData?.contact || '',
        salary: nurseData.salary || '',
        password: '',
      });
      fetchProfileImage(nurseData.id);
    }
  }, [nurseData]);

  const fetchProfileImage = async (userId) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/user/image/${userId}`);
      const data = await response.json();
      if (response.ok && data.base64) {
        setImageSrc(data.base64);
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
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
      setFormError('Name, Username, and Email are required.');
      return;
    }

    const { role, ...updatedData } = formData;

    const processUpdate = async (finalData) => {
      try {
        const response = await updateUser({ user_id: nurseData.id, data: finalData }).unwrap();
        dispatch(setUser({ user: response.user }));
        setShowModal(false);
        alert('Profile updated successfully!');
        fetchProfileImage(nurseData.id);
      } catch (err) {
        console.error("Update error:", err);
      }
    };

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedData.image = reader.result;
        processUpdate(updatedData);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      processUpdate(updatedData);
    }
  };

  if (!nurseData) return <p>Loading profile data...</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold">Nurse Profile</h1>
        <p className="text-xl mt-2">Manage your professional details here.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mt-6 relative">
        <button
          onClick={() => setShowModal(true)}
          className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-200"
        >
          Update Profile
        </button>

        <div className="flex items-center gap-8">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Nurse Profile"
              className="w-40 h-40 rounded-full border-4 border-green-500 object-cover"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-lg"><strong>Name:</strong> {formData.name}</p>
            <p className="text-lg"><strong>Username:</strong> {formData.username}</p>
            <p className="text-lg"><strong>Email:</strong> {formData.email}</p>
            <p className="text-lg"><strong>Role:</strong> {formData.role}</p>
            <p className="text-lg"><strong>Designation:</strong> {formData.designation}</p>
            <p className="text-lg"><strong>Specialization:</strong> {formData.specialization}</p>
            <p className="text-lg"><strong>Contact:</strong> {formData.contact}</p>
            <p className="text-lg"><strong>Salary:</strong> ₹{formData.salary}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold text-center mb-4">Update Nurse Profile</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4 items-center">
                <img
                  src={previewImage || imageSrc}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              {[
                { label: 'Full Name', name: 'name' },
                { label: 'Username', name: 'username' },
                { label: 'Email', name: 'email', disabled: true },
                { label: 'Role', name: 'role', disabled: true },
                { label: 'Designation', name: 'designation', disabled: true },
                { label: 'Specialization', name: 'specialization' },
                { label: 'Contact', name: 'contact' },
                { label: 'Salary', name: 'salary', disabled: true },
              ].map(({ label, name, disabled }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-semibold">{label}</label>
                  <input
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    disabled={disabled}
                    placeholder={label}
                    className={`w-full border p-2 rounded ${disabled ? 'bg-gray-100' : ''}`}
                  />
                </div>
              ))}

              <div>
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

              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
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

export default NurseProfile;
