import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAllDoctorsQuery } from "../redux/user/userApi";
import { useGetSlotsQuery } from "../redux/appointment/appointmentApi";
import Swal from "sweetalert2";

// Helper to get next 7 days
const getNext7Days = () => {
  const days = [];
  const options = { weekday: "short", day: "numeric" };
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      label: date.toLocaleDateString("en-US", options).toUpperCase(),
      value: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: date.getDate(),
    });
  }
  return days;
};

const calculateExperience = (joinedDate) => {
  const currentDate = new Date();
  const joinedDateObj = new Date(joinedDate);

  let experienceYears = currentDate.getFullYear() - joinedDateObj.getFullYear();
  const currentMonth = currentDate.getMonth();
  const joinedMonth = joinedDateObj.getMonth();

  // Check if the current date is before the doctor's join date in the year
  if (currentMonth < joinedMonth || (currentMonth === joinedMonth && currentDate.getDate() < joinedDateObj.getDate())) {
    experienceYears -= 1;
  }

  return experienceYears;
};

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { data: allDoctors = [] } = useGetAllDoctorsQuery();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].value);
  const [selectedTime, setSelectedTime] = useState("");
  const [customDate, setCustomDate] = useState(""); // State for custom date picker visibility

  const selectedDoctor = allDoctors.find(
    (doc) => doc.hcp_id.toString() === doctorId
  );

  // Ensure that slots default to an empty array if the query response is not an array
  const {
    data: slots = [],
    isLoading: slotsLoading,
  } = useGetSlotsQuery(
    { hcp_id: selectedDoctor?.hcp_id, day: `${selectedDate}T00:00:00.000Z` },
    { skip: !selectedDoctor || !selectedDate }
  );

  useEffect(() => {
    if (selectedDoctor) {
      setDoctor(selectedDoctor);
    }
  }, [doctorId, allDoctors]);

  const handleBookAppointment = () => {
    Swal.fire({
      icon: "info",
      title: "Login Required",
      text: "To book an appointment for doctors, please login or register as a patient.",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Login / Register",
      confirmButtonColor: "#5565FD",
      cancelButtonColor: "#d33"
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to the login/register page
        navigate("/login");
      } else if (result.isDismissed) {
        // User clicked 'Cancel', handle accordingly (e.g., show a message or close the modal)
        console.log("User canceled the login process.");
      }
    });
  };

  if (!doctor || slotsLoading) return <div>Loading...</div>;

  const experience = doctor.joined_date ? calculateExperience(doctor.joined_date) : 0;

  // Check availability of slots
  const areSlotsAvailable = slots && slots.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Left: Doctor Image */}
        <div className="md:w-1/3 flex justify-center items-start">
          <img
            src={doctor.image || "https://via.placeholder.com/300x350"}
            alt={doctor.name}
            className="rounded-3xl object-cover w-[320px] h-[350px] bg-blue-500"
            style={{ backgroundColor: "#5565FD" }}
          />
        </div>
        {/* Right: Doctor Info */}
        <div className="md:w-2/3 flex flex-col justify-start">
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-gray-800">{doctor.name}</h2>
              <img src="/bluetick.png" alt="Verified" className="w-5 h-5 ml-2" />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-lg text-gray-600">{doctor.specialization}</span>
              <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm">
                {experience} Year{experience > 1 ? "s" : ""}
              </span>
            </div>
            {/* About / Bio */}
            <div className="mt-6">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-semibold text-gray-700">About</span>
                <span title="About doctor" className="text-gray-400 cursor-pointer">ⓘ</span>
              </div>
              <p className="text-gray-700 text-base">
                {doctor.about ||
                  "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies."}
              </p>
            </div>
            {/* Appointment Fee */}
            <div className="mt-4 text-lg">
              <span className="font-semibold">Appointment fee:</span>{" "}
              <span className="font-bold text-gray-800">₹{doctor.fee || 200}</span>
            </div>
          </div>
          {/* Booking Slots */}
          <div className="mt-10">
            <div className="font-semibold text-gray-700 mb-3">Booking slots</div>
            {/* Date slots - horizontally scrollable */}
            <div className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap flex gap-4 mb-6 pb-2 no-scrollbar">
              {getNext7Days().map((day) => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDate(day.value)}
                  className={`flex flex-col items-center px-4 py-3 rounded-full border transition-all flex-shrink-0
                    ${selectedDate === day.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-blue-100"
                    }`}
                >
                  <span className="font-bold text-sm">{day.day}</span>
                  <span className="text-lg">{day.date}</span>
                </button>
              ))}
              {/* Custom Date Button */}
              <button
                onClick={() => setCustomDate(true)}
                className={`flex flex-col items-center px-4 py-3 rounded-full border transition-all flex-shrink-0
                  ${customDate ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-blue-100"}
                `}
              >
                <span className="font-bold text-sm">Custom Date</span>
              </button>
            </div>
            {/* Custom Date Picker */}
            {customDate && (
              <div className="mb-6">
                <input
                  type="date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  value={selectedDate}
                  className="px-4 py-2 rounded-full border text-gray-700"
                />
                <button
                  onClick={() => setCustomDate(false)}
                  className="ml-4 text-blue-600"
                >
                  Cancel
                </button>
              </div>
            )}
            {/* Time slots - horizontally scrollable */}
            <div className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap flex gap-4 pb-2 no-scrollbar">
              {areSlotsAvailable ? (
                slots.map((slot) => (
                  <button
                    key={slot.slot_id}
                    onClick={() => setSelectedTime(slot.start_time)}
                    className={`px-6 py-2 rounded-full border text-base transition-all flex-shrink-0
                      ${selectedTime === slot.start_time
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-100"
                      }`}
                  >
                    {slot.start_time} - {slot.end_time}
                  </button>
                ))
              ) : (
                <span className="text-red-500">No booking slots available</span>
              )}
            </div>

            <div className="mt-8">
              <button
                className={`w-[320px] rounded-full text-white font-semibold text-lg py-3 transition ${areSlotsAvailable ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
                onClick={handleBookAppointment}
                disabled={!areSlotsAvailable}
              >
                {areSlotsAvailable ? "Book an appointment" : "No slots available"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
