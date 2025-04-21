import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRegisterHCPMutation } from "../redux/hcp/hcpApi";
import { useRegisterUserMutation } from "../redux/user/userApi";
import { useRegisterPatientMutation, useVerifyPatientOtpMutation } from "../redux/patient/patientApi";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const departments = [
  { name: "General Medicine", icon: "🏥" },
  { name: "Cardiology", icon: "❤️" },
  { name: "Neurology", icon: "🧠" },
  { name: "Orthopedics", icon: "🦴" },
  { name: "Pediatrics", icon: "👶" },
  { name: "Dermatology", icon: "🌞" },
  { name: "Ophthalmology", icon: "👁️" },
  { name: "Gynecology", icon: "👩‍⚕️" },
  { name: "General Surgery", icon: "🔪" },
  { name: "Psychiatry", icon: "🧘" },
  { name: "Endocrinology", icon: "🧑‍⚕️💡" },
  { name: "Gastroenterology", icon: "🍽️💊" },
  { name: "Oncology", icon: "🎗️" },
  { name: "Pulmonology", icon: "🌬️🫁" },
  { name: "Rheumatology", icon: "🦴💪" },
  { name: "Nephrology", icon: "🧑‍⚕️💧" },
  { name: "Hematology", icon: "🩸" },
  { name: "Urology", icon: "💦🩺" },
  { name: "Allergy and Immunology", icon: "🌼🤧" },
  { name: "Anesthesiology", icon: "💉😴" },
  { name: "Physical Therapy", icon: "🏋️‍♂️💪" },
  { name: "Pain Management", icon: "🌿💊" },
  { name: "Geriatrics", icon: "👵👴" },
];

// OTP Input UI
const OTPInput = ({ length = 6, onComplete }) => {
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(length).fill(""));

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (idx < length - 1 && val) inputsRef.current[idx + 1].focus();
    if (newOtp.every((d) => d)) onComplete(newOtp.join(""));
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const newOtp = [...otp];
      newOtp[idx - 1] = "";
      setOtp(newOtp);
      inputsRef.current[idx - 1].focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-12 h-12 text-2xl text-center border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};

const Register = () => {
  const [role, setRole] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [step, setStep] = useState("form");
  const [pendingPatient, setPendingPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
  const password = watch("password");
  const navigate = useNavigate();

  const [registerHCP] = useRegisterHCPMutation();
  const [registerUser] = useRegisterUserMutation();
  const [registerPatient] = useRegisterPatientMutation();
  const [verifyPatientOtp] = useVerifyPatientOtpMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setValue("image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    data.image = imageBase64;
    setIsLoading(true);
    try {
      if (data.role === "patient") {
        await registerPatient(data).unwrap();
        setPendingPatient(data);
        setStep("otp");
        Swal.fire("OTP Sent!", "Check your email for the OTP.", "success");
      } else if (data.role === "hcp") {
        await registerHCP(data).unwrap();
        Swal.fire("Success!", "HCP registered successfully!", "success");
        navigate("/login");
      } else {
        await registerUser(data).unwrap();
        Swal.fire("Success!", "User registered successfully!", "success");
        navigate("/login");
      }
    } catch (err) {
      let errorMessage = "Something went wrong while registering.";
      if (err?.status === 409 || err?.status === 400) {
        errorMessage = err.data?.error || "User already exists. Please try a different email.";
      }
      Swal.fire("Registration Failed", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (otpValue) => {
    setIsLoading(true);
    try {
      await verifyPatientOtp({ email: pendingPatient.email, otp: otpValue }).unwrap();
      Swal.fire("Success!", "Patient registered successfully!", "success");
      navigate("/login");
    } catch (err) {
      Swal.fire("Verification Failed", err.data?.error || "Invalid OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50"
    >
      <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-white">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-0 md:p-2 bg-white relative">
          <div className="flex items-center justify-center w-full gap-4 mt-2 mb-6">
            <Link to="/" title="Go to home page">
              <img src="/logo.png" alt="Logo" className="h-10 cursor-pointer transition-transform hover:scale-105" />
            </Link>
            <h1 className="text-3xl font-bold text-blue-700">Register</h1>
          </div>
          <div className="w-full max-w-md flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
            <div className="flex-1 overflow-y-auto px-6 pb-5">
              {step === "form" ? (
                <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* All fields as in your original file */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input type="text" {...register("name", { required: "Name is required" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your full name" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input type="email" {...register("email", { required: "Email is required" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your email" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Username</label>
                    <input type="text" {...register("username", { required: "Username is required", pattern: { value: /^\S+$/, message: "Username must not contain spaces" } })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your username" />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                    <input type="password" {...register("password", { required: "Password is required", pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, message: "Password must be at least 8 characters with uppercase, lowercase, and a number" } })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your password" />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                    <input type="password" {...register("confirmPassword", { required: "Please confirm your password", validate: (value) => value === password || "Passwords do not match" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Confirm your password" />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Role</label>
                    <select {...register("role", { required: "Please select your role" })} className="w-full border border-gray-300 rounded px-4 py-2" onChange={(e) => setRole(e.target.value)}>
                      <option value="">Select Role</option>
                      <option value="patient">Patient</option>
                      <option value="hcp">Health Care Professional</option>
                      <option value="frontdesk">Front Desk Operator/ Receptionist</option>
                      <option value="dataentry">Data Entry Operator</option>
                      <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                  </div>
                  {/* File Upload for non-patient roles */}
                  {role && role !== "patient" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Upload Image</label>
                      <label htmlFor="file-upload" className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Choose File</label>
                      <input type="file" id="file-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
                      {imageBase64 && (
                        <div className="mt-2">
                          <img src={imageBase64} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-blue-200" />
                        </div>
                      )}
                    </div>
                  )}
                  {role === "admin" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Company's Secret Code</label>
                      <input type="password" {...register("admin_secret", { required: "Company secret code is required for admin registration" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter company secret code" />
                      {errors.admin_secret && <p className="text-red-500 text-sm mt-1">{errors.admin_secret.message}</p>}
                    </div>
                  )}
                  {role === "hcp" && (
                    <>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Healthcare Professional Code</label>
                        <input type="text" {...register("hcp_code", { required: "Healthcare professional code is required" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your healthcare professional code" />
                        {errors.hcp_code && <p className="text-red-500 text-sm mt-1">{errors.hcp_code.message}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Designation</label>
                        <select {...register("designation", { required: "Please select your designation" })} className="w-full border border-gray-300 rounded px-4 py-2">
                          <option value="">Select Designation</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Nurse">Nurse</option>
                          <option value="Junior Doctor">Junior Doctor</option>
                          <option value="Therapist">Therapist</option>
                        </select>
                        {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Specialization</label>
                        <select {...register("specialization", { required: "Specialization is required" })} className="w-full border border-gray-300 rounded px-4 py-2" defaultValue="">
                          <option value="" disabled>Select Specialization</option>
                          {departments.map((dept) => (
                            <option key={dept.name} value={dept.name}>
                              {dept.icon} {dept.name}
                            </option>
                          ))}
                        </select>
                        {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Contact</label>
                        <input type="text" {...register("contact", { required: "Contact is required" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your contact number" />
                        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                      </div>
                    </>
                  )}
                  {(role === "frontdesk" || role === "dataentry") && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        {role === "frontdesk" ? "Front Desk Operator Code" : "Data Entry Operator Code"}
                      </label>
                      <input type="text" {...register("desk_code", { required: "Operator code is required" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your operator code" />
                      {errors.desk_code && <p className="text-red-500 text-sm mt-1">{errors.desk_code.message}</p>}
                    </div>
                  )}
                  {/* Patient-specific fields */}
                  {role === "patient" && (
                    <>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
                        <input type="date" {...register("dob", { required: "Date of birth is required" })} className="w-full border border-gray-300 rounded px-4 py-2" />
                        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Gender</label>
                        <select {...register("gender", { required: "Gender is required" })} className="w-full border border-gray-300 rounded px-4 py-2">
                          <option value="">Select Gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Blood Group</label>
                        <select {...register("blood_group", { required: "Blood group is required" })} className="w-full border border-gray-300 rounded px-4 py-2">
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
                        {errors.blood_group && <p className="text-red-500 text-sm mt-1">{errors.blood_group.message}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Contact</label>
                        <input type="text" {...register("contact", { required: "Contact is required" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your contact" />
                        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Address</label>
                        <input type="text" {...register("address", { required: "Address is required" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your address" />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Insurance ID</label>
                        <input type="text" {...register("insurance_id", { required: "Insurance ID is required" })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your Insurance ID" />
                        {errors.insurance_id && <p className="text-red-500 text-sm mt-1">{errors.insurance_id.message}</p>}
                      </div>
                    </>
                  )}
                  <button type="submit" className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                  </button>
                </form>
              ) : (
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-bold text-blue-700">Verify OTP</h2>
                  <p className="text-gray-600">Sent to {pendingPatient?.email}</p>
                  <OTPInput length={6} onComplete={handleOtpVerification} />
                  <button onClick={() => setStep("form")} className="text-blue-600 hover:text-blue-800 text-sm">
                    ← Back to registration
                  </button>
                </div>
              )}
            </div>
            <div className="px-6 pb-4">
              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-100 to-green-100 items-center justify-center">
          <img src="/register.png" alt="Register Visual" className="object-cover w-full h-full" />
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
