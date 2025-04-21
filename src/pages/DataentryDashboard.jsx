import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Components (you can create these separately)
import EnterTestData from './dataentry/EnterTestData';
import EnterTreatmentData from './dataentry/EnterTreatmentData';
import DataentryProfile from './dataentry/DataentryProfile';
import UploadPendingTestResult from './dataentry/PendingTests';
import CompletedTests from './dataentry/CompletedTests';

const DataentryDashboard = () => {
  const navigate = useNavigate();
  const [dataEntryUser, setDataEntryUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState('profile');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Error!',
        text: 'You are not logged in.',
        icon: 'error',
        confirmButtonText: 'Login',
      }).then(() => navigate('/login'));
    }

    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo || userInfo.role !== 'dataentry') {
      Swal.fire({
        title: 'Error!',
        text: 'You are not logged in as a Data Entry Operator.',
        icon: 'error',
        confirmButtonText: 'Login',
      }).then(() => navigate('/login'));
      return;
    }
    console.log(userInfo)
    setDataEntryUser(userInfo);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Data Entry Panel</h2>

          <button
            onClick={() => handleSidebarClick('profile')}
            className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
          >
            👤 Profile
          </button>
          <button
            onClick={() => handleSidebarClick('pending')}
            className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
          >
            🧪Check Pending Tests
          </button>

          <button
            onClick={() => handleSidebarClick('enterTest')}
            className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
          >
            🧪 Enter Test Data
          </button>

          <button
            onClick={() => handleSidebarClick('enterTreatment')}
            className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
          >
            💊 Enter Treatment Data
          </button>
          <button
            onClick={() => handleSidebarClick('completed')}
            className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
          >
            💊 Completed Tests
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
          <h1 className="text-4xl font-bold text-blue-600">Welcome Data Entry Operator</h1>
          <p className="text-xl text-gray-700 mt-2">Enter and manage patient test and treatment records here!</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {activeComponent === 'profile' && <DataentryProfile dataEntryData={dataEntryUser} />}
          {activeComponent === 'enterTest' && <EnterTestData />}
          {activeComponent === 'enterTreatment' && <EnterTreatmentData />}
          {activeComponent === 'pending' && <UploadPendingTestResult/>}
          {activeComponent === 'completed' && <CompletedTests />}
        </div>
      </div>
    </div>
  );
};

export default DataentryDashboard;
