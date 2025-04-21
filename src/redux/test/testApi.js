import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/test`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const testApi = createApi({
  reducerPath: "testApi",
  baseQuery,
  tagTypes: ["Test", "Prescribed", "Results"],
  endpoints: (builder) => ({
    // Admin: Add test
    addTest: builder.mutation({
      query: (testData) => ({
        url: "/add",
        method: "POST",
        body: testData,
      }),
      invalidatesTags: ["Test"],
    }),

    // Admin: Update test
    updateTest: builder.mutation({
      query: ({ test_id, ...data }) => ({
        url: `/update/${test_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { test_id }) => [{ type: "Test", id: test_id }],
    }),

    // Admin: Delete test
    deleteTest: builder.mutation({
      query: (test_id) => ({
        url: `/delete/${test_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, test_id) => [{ type: "Test", id: test_id }],
    }),

    // Public: Get all tests
    getAllTests: builder.query({
      query: () => "/all",
      providesTags: ["Test"],
    }),

    // Doctor/DEO: Prescribe tests
    prescribeTests: builder.mutation({
      query: (prescriptionData) => ({
        url: "/prescribe",
        method: "POST",
        body: prescriptionData,
      }),
      invalidatesTags: ["Prescribed"],
    }),
    getCompletedTests: builder.query({
      query: ({ page = 1, limit = 10 }) => `/completed-tests?page=${page}&limit=${limit}`,
      providesTags: ['CompletedTests'],
    }),
    getCompletedTestById: builder.query({
      query: (id) => `/completed-tests/${id}`,
      providesTags: ['CompletedTest'],
    }),
    editTestResult: builder.mutation({
      query: ({ prescribed_test_id, result, test_date, file }) => ({
        url: `/edit-test/${prescribed_test_id}`,
        method: 'PUT',
        body: { result, test_date, file },
      }),
      invalidatesTags: ['CompletedTests'],
    }),

    // DEO: Add test results
    addTestResults: builder.mutation({
      query: (resultsData) => ({
        url: "/results",
        method: "POST",
        body: resultsData,
      }),
      invalidatesTags: ["Results"],
    }),

    // Get prescribed tests by appointment ID
    getPrescribedTests: builder.query({
      query: (appointment_id) => `/prescribed/${appointment_id}`,
      providesTags: (result, error, id) => [{ type: "Prescribed", id }],
    }),
    // Add this inside your `testApi` or relevant slice
    getPendingPrescribedTests: builder.query({
      query: () => '/prescribed-tests/pending',
      providesTags: ['Prescribed'],
    }),

    // Get test results by appointment ID
    getTestResults: builder.query({
      query: (appointment_id) => `/results/${appointment_id}`,
      providesTags: (result, error, id) => [{ type: "Results", id }],
    }),

    // Get test results for doctor (extra endpoint)
    getTestResultsForDoctor: builder.query({
      query: (appointment_id) => `/results/${appointment_id}/doctor`,
      providesTags: (result, error, id) => [{ type: "Results", id }],
    }),
     // Query to get test results for a patient by patient_id
     getTestResultsForPatient: builder.query({
      query: (patient_id) => `/testResultsForPatient/${patient_id}`,
      providesTags: (result, error, patient_id) => [
        { type: 'TestResults', id: patient_id },
      ],
    }),
  }),
});

export const {
  useAddTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useGetAllTestsQuery,
  usePrescribeTestsMutation,
  useAddTestResultsMutation,
  useGetPrescribedTestsQuery,
  useGetTestResultsQuery,
  useGetTestResultsForDoctorQuery,
  useGetTestResultsForPatientQuery,
  useGetPendingPrescribedTestsQuery,
  useEditTestResultMutation,
  useGetCompletedTestByIdQuery,
  useGetCompletedTestsQuery
} = testApi;

export default testApi;
