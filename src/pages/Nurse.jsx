import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Placeholder nurse components
import NurseProfile from './nurse/NurseProfile';
import AssignedPatients from './nurse/AssignedPatients';
import RecordVitals from './nurse/RecordVitals';
import MedicationLog from './nurse/MedicationLog';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [nurseData, setNurseData] = useState(null);
  const [activeComponent, setActiveComponent] = useState('profile');

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("user"));

    if (!token || !userInfo || userInfo.hcpData?.designation !== 'Nurse') {
      Swal.fire({
        title: 'Access Denied',
        text: 'You must be logged in as a nurse.',
        icon: 'error',
        confirmButtonText: 'Login',
      }).then(() => navigate('/login'));
    } else {
      setNurseData(userInfo);
    }
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: "You'll be signed out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
  };

  if (!nurseData) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-700 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-6">Nurse Panel</h2>

          <button
            onClick={() => setActiveComponent('profile')}
            className={`block w-full text-left py-2 mb-2 ${activeComponent === 'profile' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
          >
            👩‍⚕️ My Profile
          </button>

          <button
            onClick={() => setActiveComponent('patients')}
            className={`block w-full text-left py-2 mb-2 ${activeComponent === 'patients' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
          >
            🧍‍♂️ Assigned Patients
          </button>

          <button
            onClick={() => setActiveComponent('vitals')}
            className={`block w-full text-left py-2 mb-2 ${activeComponent === 'vitals' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
          >
            🩺 Record Vitals
          </button>

          <button
            onClick={() => setActiveComponent('medication')}
            className={`block w-full text-left py-2 mb-2 ${activeComponent === 'medication' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
          >
            💊 Medication Log
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
      <div className="flex-1 p-10">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-4xl font-bold text-green-600">Welcome Nurse {nurseData.name}</h1>
          <p className="text-lg text-gray-700 mt-2">Here's your dashboard overview.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeComponent === 'profile' && <NurseProfile nurseData={nurseData} />}
          {activeComponent === 'patients' && <AssignedPatients nurseId={nurseData.nurseData?.nurse_id} />}
          {activeComponent === 'vitals' && <RecordVitals nurseId={nurseData.nurseData?.nurse_id} />}
          {activeComponent === 'medication' && <MedicationLog nurseId={nurseData.nurseData?.nurse_id} />}
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
