import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllDoctorsQuery } from "../redux/user/userApi";
import DoctorCard from "../components/doctor.jsx";

// Department cards with optional emoji icons
const departments = [
  { name: "All Departments", icon: "🏥" },
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

const BookAppointment = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Departments");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const navigate = useNavigate();

  const { data: allDoctors = [] } = useGetAllDoctorsQuery();
  const filteredDoctors =
    selectedSpecialization === "All Departments"
      ? allDoctors
      : allDoctors.filter((doc) => doc.specialization === selectedSpecialization);

  const handleCategoryChange = (dept) => {
    setSelectedSpecialization(dept.name);
    setSelectedSlot(null);
    setDate("");
  };

  const handleDoctorSelection = (doctorId) => {
    navigate(`/appointment/${doctorId}`);
  };

  return (
    <div className="flex w-full">
      {/* Side Panel for Departments with Internal Scroll */}
      <div className="w-64 p-6 bg-gray-50 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Select Department</h3>
        <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
          <div className="flex flex-col space-y-4">
            {departments.map((dept) => (
              <div
                key={dept.name}
                onClick={() => handleCategoryChange(dept)}
                className={`cursor-pointer transition-all flex items-center p-4 border rounded-lg transform hover:scale-105 duration-300 ease-in-out ${
                  selectedSpecialization === dept.name
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                }`}
              >
                <div className="text-2xl mr-2">{dept.icon}</div>
                <span className="font-medium text-base">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full p-6 bg-white rounded-lg shadow-lg ml-6">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Book an Appointment</h2>

        {filteredDoctors.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Select Doctor</h3>
            <div className="flex flex-wrap justify-start gap-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.hcp_id}
                  onClick={() => handleDoctorSelection(doctor.hcp_id)}
                  className={`cursor-pointer transition-all ${
                    "border-2 border-gray-300 hover:border-blue-500"
                  } w-full sm:w-48 md:w-56 rounded-xl transform hover:scale-105 duration-300 ease-in-out`}
                >
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other elements like date picker and slots, not updated for this page */}
      </div>
    </div>
  );
};

export default BookAppointment;
