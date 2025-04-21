// src/features/patient/patientSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Function to load patient data from localStorage (if any)
const loadPatientFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('patient');
        if (serializedState == null) return { patient: null };
        return { patient: JSON.parse(serializedState) };
    } catch (error) {
        return { patient: null };
    }
};

// Initial state, loading from localStorage
const initialState = loadPatientFromLocalStorage();

const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        // Action to set patient data in the Redux store and localStorage
        setPatient: (state, action) => {
            state.patient = action.payload.patient;
            localStorage.setItem('patient', JSON.stringify(state.patient));
        },
        // Action to clear patient data
        clearPatient: (state) => {
            state.patient = null;
            localStorage.removeItem('patient');
        },
    },
});

// Export actions to be dispatched in components
export const { setPatient, clearPatient } = patientSlice.actions;
export default patientSlice.reducer;