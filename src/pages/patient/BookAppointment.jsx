import React, { useState } from "react";
import {
  useGetSlotsQuery,
  useBookAppointmentMutation,
} from "../../redux/appointment/appointmentApi";
import { useGetAllDoctorsQuery } from "../../redux/user/userApi";
import DoctorCard from "../../components/doctor.jsx";

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

const BookAppointment = ({ patientData }) => {
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Departments");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [showDepartmentList, setShowDepartmentList] = useState(true);
  const [showDoctorList, setShowDoctorList] = useState(true);

  const { data: allDoctors = [] } = useGetAllDoctorsQuery();
  const patient_id = patientData.patient_id;

  const filteredDoctors =
    selectedSpecialization === "All Departments"
      ? allDoctors
      : allDoctors.filter((doc) => doc.specialization === selectedSpecialization);

  // When a doctor is selected, set date to today automatically
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorList(false);
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setSelectedSlot(null);
  };

  const {
    data: slots = [],
    isLoading: slotsLoading,
  } = useGetSlotsQuery(
    { hcp_id: selectedDoctor?.hcp_id, day: `${date}T00:00:00.000Z` },
    { skip: !selectedDoctor || !date }
  );

  const [bookAppointment, { isLoading: booking }] = useBookAppointmentMutation();

  const handleBook = async () => {
    if (!selectedSlot || !date || !selectedDoctor)
      return alert("Select everything first.");
    try {
      await bookAppointment({
        slot_id: selectedSlot.slot_id,
        date: selectedSlot.slot_date,
        patient_id,
        priority,
        notes,
      }).unwrap();
      alert("Appointment booked successfully!");
      setSelectedSlot(null);
      setSelectedDoctor(null);
      setSelectedSpecialization("All Departments");
      setDate("");
      setNotes("");
      setPriority("Normal");
      setShowDepartmentList(true);
      setShowDoctorList(true);
    } catch (err) {
      alert(err?.data?.error || "Booking failed");
    }
  };

  const handleCategoryChange = (dept) => {
    setSelectedSpecialization(dept.name);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setDate("");
    setShowDepartmentList(false);
    setShowDoctorList(true);
  };

  const handleGoBackDoctor = () => {
    setSelectedDoctor(null);
    setShowDoctorList(true);
    setSelectedSlot(null);
    setDate("");
  };

  const handleGoBack = () => {
    setSelectedSpecialization("All Departments");
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setDate("");
    setShowDepartmentList(true);
    setShowDoctorList(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Book an Appointment</h2>

      {showDepartmentList ? (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Select Department</h3>
          <div className="flex flex-wrap justify-start gap-4">
            {departments.map((dept) => (
              <div
                key={dept.name}
                onClick={() => handleCategoryChange(dept)}
                className={`cursor-pointer transition-all flex flex-col justify-center items-center p-6 border rounded-lg shadow-lg transform hover:scale-105 duration-300 ease-in-out ${
                  selectedSpecialization === dept.name
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                } w-full sm:w-48 md:w-56`}
              >
                <div className="text-4xl mb-3">{dept.icon}</div>
                <span className="font-medium text-center text-base sm:text-lg">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Selected Department: {selectedSpecialization}
          </h3>
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Go Back
          </button>
        </div>
      )}

      {filteredDoctors.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Select Doctor</h3>
          {showDoctorList ? (
            <div className="flex flex-wrap justify-start gap-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.hcp_id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className={`cursor-pointer transition-all ${
                    selectedDoctor?.hcp_id === doctor.hcp_id
                      ? "border-2 border-blue-500"
                      : "border-2 border-gray-300"
                  } w-full sm:w-48 md:w-56 rounded-xl`}
                >
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-4">
                <DoctorCard doctor={selectedDoctor} />
                <button
                  onClick={handleGoBackDoctor}
                  className="ml-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Change Doctor
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optionally allow changing the date */}
      {selectedDoctor && (
        <div className="mb-8 bg-gray-50 p-6 rounded-xl">
          <label className="block text-lg font-medium mb-3 text-gray-700">Select Appointment Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSelectedSlot(null);
            }}
            min={new Date().toISOString().split("T")[0]}
            className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {slotsLoading && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600 text-lg">Loading available time slots...</p>
        </div>
      )}

      {!slotsLoading && selectedDoctor && date && slots.length === 0 && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600 text-lg">No available slots for the selected date.</p>
        </div>
      )}

      {slots.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Available Time Slots</h3>
          <div className="flex overflow-x-auto gap-4 py-2">
            {slots
              .filter((slot) => new Date(slot.slot_date).toISOString().split("T")[0] === date)
              .map((slot) => (
                <button
                  key={slot.slot_id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`min-w-[130px] max-w-[180px] px-4 py-3 rounded-xl transition-all flex flex-col items-center justify-center ${
                    selectedSlot?.slot_id === slot.slot_id
                      ? "bg-green-500 text-white border-2 border-green-600 shadow-lg"
                      : "bg-white hover:bg-green-50 border-2 border-gray-300 hover:border-green-400"
                  }`}
                  style={{
                    flex: "0 0 auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span className="text-lg font-semibold">
                    {slot.start_time.slice(0,5)} - {slot.end_time.slice(0,5)}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      {selectedSlot && (
        <div className="bg-blue-50 p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Appointment Details</h3>
            <button
              onClick={() => setSelectedSlot(null)}
              className="text-lg text-gray-600 hover:text-red-600 transition-all"
            >
              <span className="font-semibold">X</span>
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h4 className="font-bold text-gray-800 mb-2">Doctor: {selectedDoctor?.name}</h4>
            <p className="text-gray-600 mb-1">Department: {selectedDoctor?.specialization}</p>
            <p className="text-gray-600 mb-1">Date: {date}</p>
            <p className="text-gray-600 mb-1">
              Time: {selectedSlot.start_time} - {selectedSlot.end_time}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="Normal">Normal</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-2">Additional Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Enter any symptoms, previous history, or other concerns..."
              />
            </div>
            <button
              onClick={handleBook}
              disabled={booking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
            >
              {booking ? "Booking..." : "Confirm Appointment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
