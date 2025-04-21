import React, { useEffect, useState } from 'react';
import { useUpdateUserMutation } from '../../redux/user/userApi';
import getBaseUrl from '../../utils/baseURL';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/userSlice';
import Swal from 'sweetalert2';

const DataEntryProfile = ({ dataEntryData }) => {
  const dispatch = useDispatch();
  const [imageSrc, setImageSrc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (dataEntryData) {
      setFormData({
        name: dataEntryData.name || '',
        username: dataEntryData.username || '',
        email: dataEntryData.email || '',
        role: dataEntryData.role || '',
        password: '',
      });
      fetchProfileImage(dataEntryData.id);
    }
  }, [dataEntryData]);

  const fetchProfileImage = async (userId) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/user/image/${userId}`);
      const data = await response.json();
      if (response.ok && data.base64) {
        setImageSrc(data.base64);
      } else {
        console.error('Failed to load image:', data.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
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
      setFormError('All fields are required.');
      return;
    }

    const updatedData = { ...formData };
    delete updatedData.role;

    const processUpdate = async (finalData) => {
      try {
        const response = await updateUser({ user_id: dataEntryData.id, data: finalData }).unwrap();
        dispatch(setUser({ user: response.user }));
        setShowModal(false);
        await fetchProfileImage(dataEntryData.id);

        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile details have been updated successfully.',
          confirmButtonColor: '#16a34a',
        });
      } catch (err) {
        console.error("Update error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err?.data?.error || 'Something went wrong. Please try again.',
          confirmButtonColor: '#dc2626',
        });
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

  if (!dataEntryData) {
    return <p>Loading profile data...</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold">Data Entry Operator Profile</h1>
        <p className="text-xl mt-2">Manage your profile details here.</p>
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
              alt="Data Entry Profile"
              className="w-40 h-40 rounded-full border-4 border-green-500 object-cover"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500">Loading Image...</span>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-lg"><strong>Full Name:</strong> {dataEntryData.name}</p>
            <p className="text-lg"><strong>Username:</strong> {dataEntryData.username}</p>
            <p className="text-lg"><strong>Email:</strong> {dataEntryData.email}</p>
            <p className="text-lg"><strong>Role:</strong> {dataEntryData.role}</p>
            <p className="text-lg"><strong>Salary:</strong> ₹{dataEntryData.salary}</p>
            <p className="text-lg"><strong>Joined:</strong> {new Date(dataEntryData.joined_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
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

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
              <div className="flex gap-4 items-center">
                <img
                  src={previewImage || imageSrc}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold">Full Name</label>
                <input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full border p-2 rounded" />

                <label htmlFor="username" className="block text-sm font-semibold">Username</label>
                <input id="username" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="w-full border p-2 rounded" />

                <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                <input id="email" name="email" value={formData.email} disabled className="w-full border p-2 rounded bg-gray-100" />

                <label htmlFor="role" className="block text-sm font-semibold">Role</label>
                <input id="role" name="role" value={dataEntryData.role} disabled className="w-full border p-2 rounded bg-gray-100" />

                <label htmlFor="password" className="block text-sm font-semibold">New Password</label>
                <input id="password" type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="New Password" className="w-full border p-2 rounded" />
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-all duration-200">
                {isLoading ? 'Updating...' : 'Save Changes'}
              </button>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntryProfile;
