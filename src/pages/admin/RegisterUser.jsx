import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRegisterHCPMutation } from "../../redux/hcp/hcpApi";
import { useRegisterUserMutation } from "../../redux/user/userApi";
import { useRegisterFrontdeskPatientMutation } from "../../redux/patient/patientApi";
import Swal from "sweetalert2";

// Department list for HCP specialization
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

const ADMIN_SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE;
const HCP_SECRET_CODE = import.meta.env.VITE_HCP_SECRET_CODE;
const DESK_SECRET_CODE = import.meta.env.VITE_DESK_SECRET_CODE;

const AdminAddUserForm = () => {
  const [role, setRole] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const password = watch("password");
  const [registerHCP] = useRegisterHCPMutation();
  const [registerUser] = useRegisterUserMutation();
  const [registerPatient] = useRegisterFrontdeskPatientMutation();

  // Handle image upload
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

  // Form submission logic
  const onSubmit = async (data) => {
    data.image = imageBase64;

    // Inject secret codes from env for appropriate roles
    if (data.role === "admin") {
      data.admin_secret = ADMIN_SECRET_CODE;
    } else if (data.role === "hcp") {
      data.hcp_code = HCP_SECRET_CODE;
    } else if (data.role === "frontdesk" || data.role === "dataentry") {
      data.desk_code = DESK_SECRET_CODE;
    }

    try {
      if (data.role === "patient") {
        await registerPatient(data).unwrap();
        Swal.fire({ icon: "success", title: "Success", text: "Patient registered successfully!" });
      } else if (data.role === "hcp") {
        await registerHCP(data).unwrap();
        Swal.fire({ icon: "success", title: "Success", text: "HCP registered successfully!" });
      } else if (["admin", "frontdesk", "dataentry"].includes(data.role)) {
        await registerUser(data).unwrap();
        Swal.fire({ icon: "success", title: "Success", text: "User registered successfully!" });
      }
      reset();
      setRole("");
      setImageBase64("");
    } catch (err) {
      let errorMessage = "Something went wrong while registering.";
      if (err?.status === 409 || err?.status === 400) {
        errorMessage = err.data?.error || "User already exists. Please try a different email.";
      }
      Swal.fire({ icon: "error", title: "Registration Failed", text: errorMessage });
    }
  };

  return (
    <div className="bg-white p-8 max-w-lg mx-auto rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add User (Admin Panel)</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full border rounded px-3 py-2"
            placeholder="Full name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        {/* Username */}
        <div>
          <label className="block font-medium mb-1">Username</label>
          <input
            type="text"
            {...register("username", {
              required: "Username is required",
              pattern: { value: /^\S+$/, message: "No spaces allowed" }
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Username"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>
        {/* Password */}
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                message: "Min 8 chars, uppercase, lowercase, number"
              }
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        {/* Confirm Password */}
        <div>
          <label className="block font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (value) => value === password || "Passwords do not match"
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>
        {/* Role */}
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full border rounded px-3 py-2"
            onChange={e => setRole(e.target.value)}
            value={role}
          >
            <option value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="hcp">Health Care Professional</option>
            <option value="frontdesk">Front Desk Operator</option>
            <option value="dataentry">Data Entry Operator</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>
        {role && role !== "patient" && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Upload Image</label>
            <div className="flex flex-col items-center">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
                style={{ minWidth: 180 }}
              >
                {imageBase64 ? "Change Image" : "Choose Image"}
              </label>
              {imageBase64 && (
                <div className="mt-3">
                  <img
                    src={imageBase64}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 shadow"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* HCP fields */}
        {role === "hcp" && (
          <>
            <div>
              <label className="block font-medium mb-1">Designation</label>
              <select
                {...register("designation", { required: "Designation is required" })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Designation</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Junior Doctor">Junior Doctor</option>
                <option value="Therapist">Therapist</option>
              </select>
              {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Specialization</label>
              <select
                {...register("specialization", { required: "Specialization is required" })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Specialization</option>
                {departments.map((dept) => (
                  <option key={dept.name} value={dept.name}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
              {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization.message}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Contact</label>
              <input
                type="text"
                {...register("contact", { required: "Contact is required" })}
                className="w-full border rounded px-3 py-2"
                placeholder="Contact number"
              />
              {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
            </div>
          </>
        )}
        {/* Patient fields */}
        {role === "patient" && (
          <>
            <div>
              <label className="block font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                {...register("dob", { required: "DOB is required" })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Blood Group</label>
              <select
                {...register("blood_group", { required: "Blood group is required" })}
                className="w-full border rounded px-3 py-2"
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
              {errors.blood_group && <p className="text-red-500 text-sm">{errors.blood_group.message}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Contact</label>
              <input
                type="text"
                {...register("contact", { required: "Contact is required" })}
                className="w-full border rounded px-3 py-2"
                placeholder="Contact"
              />
              {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <input
                type="text"
                {...register("address", { required: "Address is required" })}
                className="w-full border rounded px-3 py-2"
                placeholder="Address"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Insurance ID</label>
              <input
                type="text"
                {...register("insurance_id", { required: "Insurance ID is required" })}
                className="w-full border rounded px-3 py-2"
                placeholder="Insurance ID"
              />
              {errors.insurance_id && <p className="text-red-500 text-sm">{errors.insurance_id.message}</p>}
            </div>
          </>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
          Register User
        </button>
      </form>
    </div>
  );
};

export default AdminAddUserForm;
