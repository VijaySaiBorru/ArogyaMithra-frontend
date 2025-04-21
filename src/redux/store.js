import { configureStore } from '@reduxjs/toolkit'
import hcpApi from './hcp/hcpApi';
import userApi from './user/userApi';
import patientApi from './patient/patientApi';
import userReducer from "./user/userSlice";
import patientReducer from './patient/patientSlice';
import roomApi from './room/roomApi';
import admissionApi from './admission/admissionApi';
import testApi from './test/testApi';
import appointmentApi from './appointment/appointmentApi';
import treatmentApi from './treatment/treatmentApi';
export const store=configureStore({
    reducer:{
        [hcpApi.reducerPath] : hcpApi.reducer,
        [userApi.reducerPath] : userApi.reducer,
        user: userReducer,
        [patientApi.reducerPath] : patientApi.reducer,
        patient: patientReducer,
        [roomApi.reducerPath] : roomApi.reducer,
        [admissionApi.reducerPath] : admissionApi.reducer,
        [testApi.reducerPath] : testApi.reducer,
        [appointmentApi.reducerPath] : appointmentApi.reducer,
        [treatmentApi.reducerPath] : treatmentApi.reducer,
    },
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(hcpApi.middleware,userApi.middleware,patientApi.middleware,roomApi.middleware,admissionApi.middleware,testApi.middleware,appointmentApi.middleware,treatmentApi.middleware),
});