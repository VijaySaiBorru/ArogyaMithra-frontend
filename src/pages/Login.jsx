import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginUserMutation } from '../redux/user/userApi';
import { useLoginPatientMutation } from '../redux/patient/patientApi';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { setPatient } from '../redux/patient/patientSlice';
import { setUser } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { motion } from "framer-motion";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginUser, { isLoading: isUserLoading, isError: isUserError, error: userError }] = useLoginUserMutation();
  const [loginPatient, { isLoading: isPatientLoading, isError: isPatientError, error: patientError }] = useLoginPatientMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedPatient = JSON.parse(localStorage.getItem("patient"));
    if (storedUser) {
      if (storedUser.role === "admin") navigate("/admin-dashboard");
      else if (storedUser.role === "frontdesk") navigate("/frontdesk-dashboard");
      else if (storedUser.role === "dataentry") navigate("/dataentry-dashboard");
      else if (storedUser.role === "hcp") {
        const designation = storedUser.hcpData?.designation;
        if (designation === "Doctor") navigate("/doctor-dashboard");
        else if (designation === "Nurse") navigate("/nurse-dashboard");
        else if (designation === "Junior Doctor") navigate("/jr-doctor-dashboard");
        else if (designation === "Therapist") navigate("/therapist-dashboard");
        else navigate("/");
      } else {
        navigate("/");
      }
    } else if (storedPatient) {
      navigate("/patient-dashboard");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    const payload = {
      usernameOrEmail: data.emailOrUsername,
      password: data.password,
    };
    try {
      let response;
      if (data.role === "hospital-user") {
        response = await loginUser(payload).unwrap();
        localStorage.setItem("token", response.token);
        dispatch(setUser({ user: response.user }));
        Swal.fire({
          title: 'Success!',
          text: 'Hospital user login successful!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        if(response.user.role === "admin") {navigate("/admin-dashboard");}
        else if(response.user.role === "frontdesk") {navigate("/frontdesk-dashboard");}
        else  if(response.user.role === "dataentry") {navigate("/dataentry-dashboard");}
        else  if(response.user.role === "hcp") {
          if(response.user.hcpData.designation === "Doctor"){
            navigate("/doctor-dashboard");
          }
          else if(response.user.hcpData.designation === "Nurse") {
            navigate("/nurse-dashboard"); 
          }
          else if(response.user.hcpData.designation === "Junior Doctor") {
            navigate("/jr-doctor-dashboard"); 
          }
          else if(response.user.hcpData.designation === "Therapist") {
            navigate("/therapist-dashboard"); 
          }
        }
        else {navigate("/");}
      } else if (data.role === "patient") {
        response = await loginPatient(payload).unwrap();
        localStorage.setItem("token", response.token);
        dispatch(setPatient({ patient: response.patient }));
        Swal.fire({
          title: 'Success!',
          text: 'Patient login successful!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        navigate("/patient-dashboard");
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err?.data?.message || 'Login failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="flex w-full max-w-4xl shadow-lg rounded-xl overflow-hidden">
        {/* Left Side: Image */}
        <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center">
          <img src="/aboutus.png" alt="Login Visual" className="object-cover w-full h-full" />
        </div>
        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-12 bg-white relative">
          {/* Logo space */}
          <div className="flex items-center justify-center w-full gap-4 mt-10 mb-6">
          <Link to="/" title="Go to home page">
            <img src="/logo.png" alt="Logo" className="h-12 cursor-pointer transition-transform hover:scale-105" />
          </Link>
          <h1 className="text-3xl font-bold text-blue-600">Please Login</h1>
        </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email or Username</label>
              <input
                type="text"
                {...register('emailOrUsername', { 
                  required: 'Email or Username is required',
                  validate: (value) => {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    const usernameRegex = /^[a-zA-Z0-9._]+$/;
                    if (!emailRegex.test(value) && !usernameRegex.test(value)) {
                      return 'Enter a valid email or username';
                    }
                    return true;
                  }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email or username"
              />
              {errors.emailOrUsername && <p className="text-red-500 text-sm mt-1">{errors.emailOrUsername.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Role</label>
              <select
                {...register('role', { required: 'Please select your role' })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                <option value="patient">Patient</option>
                <option value="hospital-user">Hospital User</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
                disabled={isUserLoading || isPatientLoading}
              >
                {isUserLoading || isPatientLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-700">
              Don't have an account? 
              <Link to="/register" className="text-blue-600 hover:underline ml-1">
                Register here
              </Link>
            </p>
          </div>
          {(isUserError || isPatientError) && (
            <p className="text-red-500 text-center mt-4">{userError?.data?.message || patientError?.data?.message || "Login failed. Please try again."}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
