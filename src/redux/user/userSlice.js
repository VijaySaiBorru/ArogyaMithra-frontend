// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Function to load user data from localStorage (if any)
const loadUserFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('user');
        if (serializedState == null) return { user: null };
        return { user: JSON.parse(serializedState) };
    } catch (error) {
        return { user: null };
    }
};

// Initial state, loading from localStorage
const initialState = loadUserFromLocalStorage();

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Action to set user data in the Redux store and localStorage
        setUser: (state, action) => {
            state.user = action.payload.user;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        // Action to logout (clear user data from Redux store and localStorage)
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

// Export actions to be dispatched in components
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;