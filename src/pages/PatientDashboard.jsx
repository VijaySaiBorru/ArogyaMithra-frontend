import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Import your components (you can build these separately)
import PatientProfile from "./patient/PatientProfile";
import BookAppointment from "./patient/BookAppointment";
import ViewTreatments from "./patient/ViewTreatments";
import ViewTests from "./patient/ViewTests";
import UpcomingAppointments from "./patient/UpcomingAppointments";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [activeComponent, setActiveComponent] = useState("profile");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const patient = JSON.parse(localStorage.getItem("patient"));

    if (!token || !patient) {
      Swal.fire({
        title: "Access Denied",
        text: "You must be logged in as a patient to access this dashboard.",
        icon: "error",
        confirmButtonText: "Login",
      }).then(() => navigate("/login"));
    } else {
      setPatientData(patient);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patient");
    navigate("/login");
  };
  console.log(patientData)

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Patient Panel</h2>

          <button
            onClick={() => setActiveComponent("profile")}
            className="block w-full text-left py-2 mb-2 text-gray-700 hover:text-blue-600"
          >
            👤 Profile
          </button>

          <button
            onClick={() => setActiveComponent("bookAppointment")}
            className="block w-full text-left py-2 mb-2 text-gray-700 hover:text-blue-600"
          >
            📅 Book Appointment
          </button>
          <button
            onClick={() => setActiveComponent("upcoming")}
            className="block w-full text-left py-2 mb-2 text-gray-700 hover:text-blue-600"
          >
            ⏳ Upcoming Appointments
          </button>

          <button
            onClick={() => setActiveComponent("tests")}
            className="block w-full text-left py-2 mb-2 text-gray-700 hover:text-blue-600"
          >
            🧪 Tests & Results
          </button>


          <button
            onClick={() => setActiveComponent("treatments")}
            className="block w-full text-left py-2 mb-2 text-gray-700 hover:text-blue-600"
          >
            💊 View Treatments
          </button>

          
          
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center bg-red-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-700 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
        >
          <span className="mr-2 text-2xl">🚪</span> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-4xl font-bold text-blue-600">Welcome, {patientData?.name || "Patient"}</h1>
          <p className="text-xl text-gray-700 mt-2">Manage your health records and appointments</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeComponent === "profile" && <PatientProfile patientData={patientData} />}
          {activeComponent === "bookAppointment" && <BookAppointment patientData={patientData} />}
          {activeComponent === "upcoming" && <UpcomingAppointments patientData={patientData} />}
          {activeComponent === "tests" && <ViewTests patientData={patientData} />}
          {activeComponent === "treatments" && <ViewTreatments patientData={patientData} />}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
