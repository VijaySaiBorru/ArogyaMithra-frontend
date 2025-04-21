import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Import components for each section
import FrontdeskProfile from './frontdesk/FrontdeskProfile';
import AdmitPatient from './frontdesk/AdmitPatient';
import RegisterPatient from './frontdesk/RegisterPatient';
import UpdateFeesForm from './frontdesk/EditPatient';
import DischargePatient from './frontdesk/DischargePatient';
import AdmittedPatientsList from './frontdesk/AdmitPatientsList';
import BookAppointmentFrontDesk from './frontdesk/BookAppointmentFrontDesk';

const FrontdeskDashboard = () => {
    const navigate = useNavigate();
    const [operatorData, setOperatorData] = useState(null);
    const [activeComponent, setActiveComponent] = useState('profile'); // Default to profile

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

        const operatorInfo = JSON.parse(localStorage.getItem("user"));
         if (!operatorInfo || operatorInfo.role !== 'frontdesk') {
                    Swal.fire({
                        title: 'Error!',
                        text: 'You are not logged in as Frontdesk Operator.',
                        icon: 'error',
                        confirmButtonText: 'Login',
                    }).then(() => navigate("/login"));
                    return; // Exit early if not admin
                }
        if (operatorInfo) {
            setOperatorData(operatorInfo);
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
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">Front Desk Panel</h2>

                    {/* Sidebar Items */}
                    <button
                        onClick={() => handleSidebarClick('profile')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        👤 Profile
                    </button>
                    <button
                        onClick={() => handleSidebarClick('registerPatient')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        ✍️ Register Patient
                    </button>

                    <button
                        onClick={() => handleSidebarClick('admitPatient')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        🏥 Admit Patient
                    </button>
                    <button
                        onClick={() => handleSidebarClick('bookappoinment')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        🏥 Book Appoinment
                    </button>
                    <button
                        onClick={() => handleSidebarClick('admittedPatient')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        🏥 Admitted Patients List
                    </button>
                    
                    <button
                        onClick={() => handleSidebarClick('editPatient')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        ✏️ Edit Patient Fees
                    </button>
                    <button
                        onClick={() => handleSidebarClick('dischargePatient')}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 mb-2"
                    >
                        ✏️ Discharge Patient
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
                    {/* Welcome Front Desk Operator */}
                    <h1 className="text-4xl font-bold text-blue-600">Welcome Front Desk Operator</h1>
                    <p className="text-xl text-gray-700 mt-2">Manage patient admissions and registrations here!</p>
                </div>

                {/* Render the active component */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    {activeComponent === 'profile' && <FrontdeskProfile frontDeskData={operatorData} />}
                    {activeComponent === 'admitPatient' && <AdmitPatient />}
                    {activeComponent === 'registerPatient' && <RegisterPatient />}
                    {activeComponent === 'editPatient' && <UpdateFeesForm />}
                    {activeComponent === 'dischargePatient' && <DischargePatient />}
                    {activeComponent === 'admittedPatient' && <AdmittedPatientsList />}
                    {activeComponent === 'bookappoinment' && <BookAppointmentFrontDesk />}
                </div>
            </div>
        </div>
    );
};

export default FrontdeskDashboard;
