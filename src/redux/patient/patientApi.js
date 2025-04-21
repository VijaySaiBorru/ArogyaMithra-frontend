import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../utils/baseURL";

// Create the base query with token auth
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/patient`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery,
  tagTypes: ["Patient", "Appointment"],
  endpoints: (builder) => ({
    // Register patient
    // Step 1: Register patient (sends OTP)
    registerPatient: builder.mutation({
      query: (patientData) => ({
        url: '/register',
        method: 'POST',
        body: patientData,
      }),
    }),
    registerFrontdeskPatient: builder.mutation({
      query: (patientData) => ({
        url: '/frontdesk-register',
        method: 'POST',
        body: patientData,
      }),
    }),
    // Step 2: Verify OTP and complete registration
    verifyPatientOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: '/verify-register',
        method: 'POST',
        body: { email, otp },
      }),
    }),

    // Login patient
    loginPatient: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Get all patients (not typically used on frontend, but added for completeness)
    getAllPatients: builder.query({
      query: () => "/",
      providesTags: ["Patient"],
    }),
    // Get patient by ID
    getPatientById: builder.query({
      query: (id) => `patients/${id}`, // API endpoint for fetching a patient by ID
      providesTags: (result, error, id) => [{ type: 'Patient', id }], // Optional: cache this patient's data with the ID tag
    }),
    // Search patients by partial username
    searchPatients: builder.query({
      query: (queryText) => `patients/search?q=${queryText}`, // endpoint with query param
    
      providesTags: (result) => {
        // Check if result is an array and handle accordingly
        if (Array.isArray(result)) {
          return [
            ...result.map(({ patient_id }) => ({ type: 'Patient', patient_id })),
            { type: 'Patient', id: 'LIST' },
          ];
        }
    
        // If result is not an array, return the LIST tag only
        return [{ type: 'Patient', id: 'LIST' }];
      },
    }),
    
    // Get patient appointments
    getPatientAppointments: builder.query({
      query: () => "/appointments",
      providesTags: ["Appointment"],
    }),

    // Book appointment
    bookAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: "/book-appointment",
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Appointment"],
    }),

    // Update patient
    updatePatient: builder.mutation({
      query: (patientData) => ({
        url: "/update",
        method: "PUT",
        body: patientData,
      }),
      invalidatesTags: ["Patient"],
    }),
    // Delete patient
  deletePatient: builder.mutation({
    query: (patient_id) => ({
      url: `/delete/${patient_id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Patient"],
  }),

  }),
});

export const {
  useRegisterPatientMutation,
  useVerifyPatientOtpMutation,
  useLoginPatientMutation,
  useGetAllPatientsQuery,
  useGetPatientAppointmentsQuery,
  useBookAppointmentMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useGetPatientByIdQuery,
  useSearchPatientsQuery,
  useRegisterFrontdeskPatientMutation
} = patientApi;

export default patientApi;
