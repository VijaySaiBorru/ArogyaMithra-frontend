import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/room`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery,
  tagTypes: ["Room"],
  endpoints: (builder) => ({
    // Add Room
    addRoom: builder.mutation({
      query: (roomData) => ({
        url: "/add",
        method: "POST",
        body: roomData,
      }),
      invalidatesTags: ["Room"],
    }),

    // Update Room
    updateRoom: builder.mutation({
      query: ({ room_id, ...roomData }) => ({
        url: `/update/${room_id}`,
        method: "PUT",
        body: roomData,
      }),
      invalidatesTags: (result, error, { room_id }) => [{ type: "Room", id: room_id }],
    }),
    deleteRoom: builder.mutation({
        query: (room_id) => ({
          url: `/room-delete/${room_id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Room'],
      }),
    // Get Available Rooms
    getAvailableRooms: builder.query({
      query: () => "/available",
      providesTags: ["Room"],
    }),
     // Get Available Rooms
     getAllRooms: builder.query({
        query: () => "/",
        providesTags: ["Room"],
      }),
  }),
});

export const {
  useAddRoomMutation,
  useUpdateRoomMutation,
  useGetAvailableRoomsQuery,
  useGetAllRoomsQuery,
  useDeleteRoomMutation
} = roomApi;

export default roomApi;