import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/appointment`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery,
  tagTypes: ["Slots", "Appointments"],
  endpoints: (builder) => ({
    // Doctor: Add available slot
    addSlot: builder.mutation({
      query: (slotData) => ({
        url: "/slots",
        method: "POST",
        body: slotData,
      }),
      invalidatesTags: ["Slots"],
    }),

    // Get available slots for a doctor on a day
    getSlots: builder.query({
      query: ({ hcp_id, day }) => `/slots/${hcp_id}/${day}`,
      providesTags: ["Slots"],
    }),

    // Patient: Book an appointment
    bookAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: "/book",
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Appointments", "Slots"],
    }),

    // Doctor: Get appointments for a doctor
    getAppointmentsForDoctor: builder.query({
      query: (hcp_id) => `/appointments/${hcp_id}`,
      providesTags: ["Appointments"],
    }),

    // Patient: Get appointments for a patient
    getAppointmentsForPatient: builder.query({
      query: (patient_id) => `/appointments/patient/${patient_id}`,
      providesTags: ["Appointments"],
    }),

    // Doctor: Update appointment status
    updateAppointmentStatus: builder.mutation({
      query: ({ appointment_id, status }) => ({
        url: `/appointments/${appointment_id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Appointments"],
    }),

    // Delete slot (Doctor)
    deleteSlot: builder.mutation({
      query: (slot_id) => ({
        url: `/slots/${slot_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Slots"],
    }),

    // Generate recurring weekly slots (Doctor)
    generateWeeklySlots: builder.mutation({
      query: (weeklySlotData) => ({
        url: "/slots/recurring",
        method: "POST",
        body: weeklySlotData,
      }),
      invalidatesTags: ["Slots"],
    }),

    // Get all appointments (Admin)
    getAllAppointments: builder.query({
      query: () => `/appointments/admin`,
      providesTags: ["Appointments"],
    }),
    getUpcomingDoctorSLots:builder.query({
      query: (doctorId)=>`/upcomingslots/${doctorId}`,
      providesTags: ["Slots"],
    }),

    // Get appointment details
    getAppointmentDetails: builder.query({
      query: (appointment_id) => `/appointment/${appointment_id}`,
      providesTags: ["Appointments"],
    }),

    // Get patient record (single patient)
    getPatientRecord: builder.query({
      query: (patient_id) => `/patient/${patient_id}/record`,
      providesTags: ["Appointments"],
    }),

    // Get all patient records (completed appointments across all patients)
    getAllPatientRecords: builder.query({
      query: ({hcp_id}) => `/patientrecords/${hcp_id}`,
      providesTags: ["Appointments"],
    }),
  
   
  }),
});

export const {
  useAddSlotMutation,
  useGetSlotsQuery,
  useBookAppointmentMutation,
  useGetAppointmentsForDoctorQuery,
  useGetAppointmentsForPatientQuery,
  useUpdateAppointmentStatusMutation,
  useDeleteSlotMutation,
  useGenerateWeeklySlotsMutation,
  useGetAllAppointmentsQuery,
  useGetAppointmentDetailsQuery,
  useGetPatientRecordQuery,
  useGetAllPatientRecordsQuery,
  useGetUpcomingDoctorSLotsQuery
} = appointmentApi;

export default appointmentApi;