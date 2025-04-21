import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../utils/baseURL";

// Create the base query with token auth
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/user`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User", "Doctor"],
  endpoints: (builder) => ({
    // Register
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Login
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ user_id, ...data }) => ({
        url: `/update/${user_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { user_id }) => [{ type: "User", id: user_id }],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (user_id) => ({
        url: `/delete/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, user_id) => [{ type: "User", id: user_id }],
    }),

    // Get all doctors
    getAllDoctors: builder.query({
      query: () => "/doctors",
      providesTags: ["Doctor"],
    }),
     // Get all users except hcp
     getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),
    // Get all hcp users
    getAllHCPUsers: builder.query({
      query: () => "/hcpusers",
      providesTags: ["User"],
    }),
    // Get all fdo users
    getAllFDOUsers: builder.query({
      query: () => "/fdousers",
      providesTags: ["User"],
    }),
    // Get all deo users
    getAllDEOUsers: builder.query({
      query: () => "/deousers",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAllDoctorsQuery,
  useGetAllUsersQuery,
  useGetAllHCPUsersQuery,
  useGetAllFDOUsersQuery,
  useGetAllDEOUsersQuery
} = userApi;

export default userApi;
