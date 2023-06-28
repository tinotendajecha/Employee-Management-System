import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import apiSlice from "../features/API slices/APISlice";
import authSliceReducer from '../features/slices/AuthSlice'
import jobsSliceReducer from '../features/slices/JobsSlice'
import jobApplicationReducer from "../features/slices/JobApplicationSlice";
import EmployeeReducer from "../features/slices/EmployeeSlice";

const store = configureStore({
    reducer : {
        auth : authSliceReducer,
        jobApplication : jobApplicationReducer,
        jobs : jobsSliceReducer,
        employee : EmployeeReducer,
        [apiSlice.reducerPath] : apiSlice.reducer,
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools : true
})

export default store;