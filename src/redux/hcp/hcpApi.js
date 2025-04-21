import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../utils/baseURL";

// Base query for API requests
const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/hcp`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        return Headers;
    }
});

// HCP API service for Redux Toolkit
const hcpApi = createApi({
    reducerPath: 'hcpApi',
    baseQuery,
    tagTypes: ["HCP"],
    endpoints: (builder) => ({
        // Fetch all HCPs
        getAllHCPs: builder.query({
            query: () => "/",
            providesTags: ["HCP"]
        }),

        // Fetch a single HCP by ID
        getHCPById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "HCP", id }]
        }),

        // Register a new HCP
        registerHCP: builder.mutation({
            query: (newHCP) => ({
                url: "/register",
                method: "POST",
                body: newHCP
            }),
            invalidatesTags: ["HCP"]
        }),

        // Update an existing HCP
        updateHCP: builder.mutation({
            query: ({ user_id, ...rest }) => ({
                url: `/${user_id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "HCP", id }]
        }),

        // Delete an HCP
        deleteHCP: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "HCP", id }]
        })
    })
});

export const {
    useGetAllHCPsQuery,
    useGetHCPByIdQuery,
    useRegisterHCPMutation,
    useUpdateHCPMutation,
    useDeleteHCPMutation
} = hcpApi;

export default hcpApi;
