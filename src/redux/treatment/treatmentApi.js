import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/treatment`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const treatmentApi = createApi({
  reducerPath: "treatmentApi",
  baseQuery,
  tagTypes: ["Treatment","Appointmnets"],
  endpoints: (builder) => ({
    // Add Treatment (POST /add)
    addTreatment: builder.mutation({
      query: (treatmentData) => ({
        url: "/add",
        method: "POST",
        body: treatmentData,
      }),
      invalidatesTags: ["Treatment"],
    }),

    // Get Treatment by Appointment ID (GET /:appointment_id)
    getTreatmentByAppointment: builder.query({
      query: (appointment_id) => `/${appointment_id}`,
      providesTags: (result, error, appointment_id) => [
        { type: "Treatment", id: appointment_id },
      ],
    }),

    // Get all treatments for a patient (GET /:patient_id/treatments)
    getTreatmentsForPatient: builder.query({
      query: (patient_id) => `/treatments/${patient_id}`,
      providesTags: (result, error, patient_id) => [
        { type: "Treatment", id: patient_id },
      ],
    }),

    // ✅ Update Treatment by Appointment ID (PUT /:appointment_id)
    // updateTreatment: builder.mutation({
    //   query: (data) => ({
    //     url: `/${data.appointment_id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: (result, error, data) => [
    //     { type: "Treatment", id: data.appointment_id },
    //   ],
    // }),
     // Update appointment details (for editing completed appointments)
     updateAppointmentDetails: builder.mutation({
      query: ({ appointment_id, ...body }) => ({
        url: `/appointment/${appointment_id}/details`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Appointments"],
    }),
  }),
});

export const {
  useAddTreatmentMutation,
  useGetTreatmentByAppointmentQuery,
  useGetTreatmentsForPatientQuery,
  // useUpdateTreatmentMutation,
  useUpdateAppointmentDetailsMutation
} = treatmentApi;

export default treatmentApi;
