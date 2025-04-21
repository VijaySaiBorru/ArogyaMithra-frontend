// src/features/api/admissionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/admission`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const admissionApi = createApi({
  reducerPath: "admissionApi",
  baseQuery,
  tagTypes: ["Admission"],
  endpoints: (builder) => ({
    // Admit Patient
    admitPatient: builder.mutation({
      query: (patientData) => ({
        url: "/admit",
        method: "POST",
        body: patientData,
      }),
      invalidatesTags: ["Admission"],
    }),
    getAdmittedPatients: builder.query({
      query: () => ({
        url: '/admitted-patients', // The endpoint for fetching admitted patients
        method: 'GET',
      }),
      // Optional: you can add caching and invalidation logic if needed
      providesTags: ['Admission'], // This can be useful if you want to track admission data changes
    }),

    // Update Fees
    updateFees: builder.mutation({
      query: ({ admission_id, feesData }) => ({
        url: `/fees/${admission_id}`,
        method: "PUT",
        body: feesData,
      }),
      invalidatesTags: (result, error, { admission_id }) => [
        { type: "Admission", id: admission_id },
      ],
    }),

    // Discharge Patient
    dischargePatient: builder.mutation({
      query: (admission_id) => ({
        url: `/discharge/${admission_id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, admission_id) => [
        { type: "Admission", id: admission_id },
      ],
    }),
  }),
});

export const {
  useAdmitPatientMutation,
  useUpdateFeesMutation,
  useDischargePatientMutation,
  useGetAdmittedPatientsQuery
} = admissionApi;

export default admissionApi;
