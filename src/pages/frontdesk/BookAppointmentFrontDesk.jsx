import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  useGetSlotsQuery,
  useBookAppointmentMutation,
} from "../../redux/appointment/appointmentApi";
import { useGetAllDoctorsQuery } from "../../redux/user/userApi";
import { useGetAllPatientsQuery } from "../../redux/patient/patientApi";

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

const BookAppointmentFrontDesk = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Departments");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Normal");

  const { data: allDoctors = [] } = useGetAllDoctorsQuery();
  const { data: allPatients = [] } = useGetAllPatientsQuery();

  const filteredDoctors =
    selectedSpecialization === "All Departments"
      ? allDoctors
      : allDoctors.filter((doc) => doc.specialization === selectedSpecialization);

  const {
    data: slots = [],
    isLoading: slotsLoading,
  } = useGetSlotsQuery(
    { hcp_id: selectedDoctor?.hcp_id, day: `${date}T00:00:00.000Z` },
    { skip: !selectedDoctor || !date }
  );

  const [bookAppointment, { isLoading: booking }] = useBookAppointmentMutation();

  const handleBook = async () => {
    // Always require patient, department, doctor
    if (!selectedPatient || !selectedDoctor || !selectedSpecialization) {
      return Swal.fire("Incomplete Fields", "Please select patient, department, and doctor.", "warning");
    }

    // For Normal, require slot and date
    if (priority === "Normal" && (!selectedSlot || !date)) {
      return Swal.fire("Incomplete Fields", "Please select date and slot.", "warning");
    }

    try {
      await bookAppointment({
        patient_id: selectedPatient.patient_id,
        priority,
        notes,
        doctor_id: selectedDoctor.hcp_id,
        slot_id: priority === "Normal" ? selectedSlot.slot_id : null,
        date:
          priority === "Normal"
            ? selectedSlot.slot_date
            : new Date().toISOString().split("T")[0], // or let backend assign
      }).unwrap();

      Swal.fire("Success", "Appointment booked successfully!", "success");

      setSelectedSlot(null);
      setSelectedDoctor(null);
      setSelectedSpecialization("All Departments");
      setDate("");
      setNotes("");
      setPriority("Normal");
      setSelectedPatient(null);
    } catch (err) {
      Swal.fire("Booking Failed", err?.data?.error || "An error occurred", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-4xl font-extrabold mb-10 text-blue-800 text-center tracking-tight">
        Book Appointment (Front Desk)
      </h2>

      {/* Patient Selector */}
      <div className="mb-8">
        <label className="block mb-2 font-semibold text-blue-700 text-lg">Select Patient</label>
        <select
          value={selectedPatient?.patient_id || ""}
          onChange={(e) => {
            const selected = allPatients.find((p) => p.patient_id === Number(e.target.value));
            setSelectedPatient(selected || null);
          }}
          className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Select Patient --</option>
          {allPatients.map((p) => (
            <option key={p.patient_id} value={p.patient_id}>
              {p.name} ({p.patient_id})
            </option>
          ))}
        </select>
      </div>

      {/* Department Dropdown */}
      <div className="mb-8">
        <label className="block mb-2 font-semibold text-blue-700 text-lg">Select Department</label>
        <select
          value={selectedSpecialization}
          onChange={e => {
            setSelectedSpecialization(e.target.value);
            setSelectedDoctor(null);
            setSelectedSlot(null);
            setDate("");
          }}
          className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          {departments.map(dept => (
            <option key={dept.name} value={dept.name}>
              {dept.icon} {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor Dropdown */}
      {filteredDoctors.length > 0 && (
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-blue-700 text-lg">Select Doctor</label>
          <select
            value={selectedDoctor?.hcp_id || ""}
            onChange={(e) => {
              const doc = filteredDoctors.find((d) => d.hcp_id === Number(e.target.value));
              setSelectedDoctor(doc);
              const today = new Date().toISOString().split("T")[0];
              setDate(today);
              setSelectedSlot(null);
            }}
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select Doctor --</option>
            {filteredDoctors.map((doc) => (
              <option key={doc.hcp_id} value={doc.hcp_id}>
                {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>
      )}
       {/* Priority & Notes */}
       <div className="mb-6">
        <label className="block mb-2 font-semibold text-blue-700 text-lg">Priority</label>
        <select
          className="w-full p-3 border border-blue-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            if (e.target.value === "Emergency") {
              setSelectedSlot(null);
              setDate("");
            }
          }}
        >
          <option value="Normal">Normal</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      {/* For Emergency/Urgent, show info and skip slot/date */}
      {(priority === "Emergency") && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p>
            For <b>{priority}</b> cases, appointment will be booked immediately without slot selection.
          </p>
        </div>
      )}

      {/* Date Picker & Slot Picker for Normal */}
      {priority === "Normal" && selectedDoctor && (
        <>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-blue-700 text-lg">Select Date</label>
            <input
              type="date"
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSlot(null);
              }}
            />
          </div>
          {selectedDoctor && date && slots && slots.length === 0 && (
            <div className="mb-6 text-center text-red-600 font-semibold">
              No available slots for the selected date and doctor.
            </div>
          )}
          {slots && slots.length > 0 && (
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-blue-700 text-lg">Available Slots</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {slots.map((slot) => (
                  <button
                    key={slot.slot_id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border transition font-medium ${
                      selectedSlot?.slot_id === slot.slot_id
                        ? "bg-blue-600 text-white"
                        : "bg-white border-blue-200 hover:bg-blue-100 text-blue-800"
                    }`}
                  >
                    {slot.start_time} - {slot.end_time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

     

      <label className="block mb-2 font-semibold text-blue-700 text-lg">Additional Notes</label>
      <textarea
        className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
        rows="3"
        placeholder="Type any notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* Book Button */}
      <button
        onClick={handleBook}
        disabled={booking}
        className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {booking ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
};

export default BookAppointmentFrontDesk;
