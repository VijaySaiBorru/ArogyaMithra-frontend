import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(`/api/reset-password/${token}`, data);
      Swal.fire('Success!', 'Your password has been reset.', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Reset failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center text-blue-600">Reset Password</h2>

        <div>
          <label className="block text-gray-700">New Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full border p-2 rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
