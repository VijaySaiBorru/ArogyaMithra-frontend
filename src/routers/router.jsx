import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import PatientDashboard from "../pages/PatientDashboard";
import FrontdeskDashboard from "../pages/FrontdeskDashboard";
import DataentryDashboard from "../pages/DataentryDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import JuniorDoctor from "../pages/JuniorDoctor";
import Therapist from "../pages/Therapist";
import NurseDashboard from "../pages/Nurse";

import Services from "../pages/Services";
import BookAppoinments from "../pages/BookAppoinments";
import DoctorDetails from "../components/DoctorDetails";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import AboutHospital from "../components/AboutHospital";
import JuniorDoctorDashboard from "../pages/JuniorDoctor";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path:"",
                element: <Home />
            },
            {
                path:"/services",
                element: <Services/>
            },
            {
                path:"/about-hospital",
                element:<AboutHospital />
            },
            {
                path:"/about",
                element:<About/>
            },
            {
                path:"/contact",
                element:<Contact />
            },
            {
                path:"/admin-dashboard",
                element:<AdminDashboard />
            },
            {
                path:"/frontdesk-dashboard",
                element:<FrontdeskDashboard />
            },
            {
                path:"/dataentry-dashboard",
                element:<DataentryDashboard />
            },
            {
                path:"/patient-dashboard",
                element:<PatientDashboard />
            },
            {
                path:"/doctor-dashboard",
                element:<DoctorDashboard />
            },
            {
                path:"/jr-doctor-dashboard",
                element:<JuniorDoctorDashboard />
            },
            {
                path:"/nurse-dashboard",
                element:<NurseDashboard />
            },
            {
                path:"/therapist-dashboard",
                element:<Therapist />
            },
            {
                path:"/appointments",
                element:<BookAppoinments />
            },
            {
                path:"/appointment/:doctorId",
                 element :<DoctorDetails />
            },
            {
                path:"/forgot-password",
                 element :<ForgotPassword />
            },
            {
                path:"/reset-password/:tokenId",
                 element :<ResetPassword />
            }
        ]
    },
    {
        path:"/login",
        element: <Login />
    },
    {
        path:"/register",
        element: <Register />
    },
]);
export default router;