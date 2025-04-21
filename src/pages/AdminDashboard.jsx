import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Import the components for each section
import AdminProfile from './admin/AdminProfile';
import ManageUsers from './admin/ManageUsers';
import ManageRooms from './admin/ManageRooms';
import ManageAppointments from './admin/ManageAppointments';
import ManageHCPUsers from './admin/ManageHCPUsers';
import ManageTests from './admin/ManageTests';
import AdminAddUserForm from './admin/RegisterUser';
import ManagePatients from './admin/ManagePatients';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);
    const [activeComponent, setActiveComponent] = useState('userProfile'); // Default to userProfile

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: 'Error!',
                text: 'You are not logged in.',
                icon: 'error',
                confirmButtonText: 'Login',
            }).then(() => navigate("/login"));
        }

        const adminInfo = JSON.parse(localStorage.getItem("user"));
        if (!adminInfo || adminInfo.role !== 'admin') {
            Swal.fire({
                title: 'Error!',
                text: 'You are not logged in as admin.',
                icon: 'error',
                confirmButtonText: 'Login',
            }).then(() => navigate("/login"));
            return; // Exit early if not admin
        }
        if (adminInfo) {
            setAdminData(adminInfo);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Function to set the active component
    const handleSidebarClick = (component) => {
        setActiveComponent(component);
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">Admin Panel</h2>

                    {/* Sidebar Items */}
                    <button
                        onClick={() => handleSidebarClick('userProfile')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        👤 Manage User Profile
                    </button>
                    <button
                        onClick={() => handleSidebarClick('addUsers')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        👥 Add/Register Users
                    </button>

                    <button
                        onClick={() => handleSidebarClick('manageUsers')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        👥 Manage Users
                    </button>
                    <button
                        onClick={() => handleSidebarClick('manageHCPUsers')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        👩‍⚕️🧑‍⚕️ Manage HCP Users
                    </button>
                    <button
                        onClick={() => handleSidebarClick('managePatients')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        👥 Manage Patients
                    </button>

                    <button
                        onClick={() => handleSidebarClick('manageRooms')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        🏠 Manage Rooms
                    </button>

                    <button
                        onClick={() => handleSidebarClick('manageAppointments')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        📅 Manage Appointments
                    </button>
                    <button
                        onClick={() => handleSidebarClick('addTests')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        🧪 Manage Tests
                    </button>

                </div>

                {/* Logout */}
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
                    {/* Welcome Admin (Concise and Grand) */}
                    <h1 className="text-4xl font-bold text-blue-600">Welcome Admin</h1>
                    <p className="text-xl text-gray-700 mt-2">You're in charge of everything here!</p>
                </div>

                {/* Render the active component */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    {activeComponent === 'userProfile' && <AdminProfile adminData={adminData} />}
                    {activeComponent === 'manageUsers' && <ManageUsers />}
                    {activeComponent === 'manageHCPUsers' && <ManageHCPUsers />}
                    {activeComponent === 'manageRooms' && <ManageRooms />}
                    {activeComponent === 'manageAppointments' && <ManageAppointments />}
                    {activeComponent === 'addTests' && <ManageTests />}
                    {activeComponent === 'addUsers' && <AdminAddUserForm />}
                    {activeComponent === 'managePatients' && <ManagePatients />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
