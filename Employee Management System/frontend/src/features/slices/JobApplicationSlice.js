//This slice stores the state of the job i am applying for

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    jobId : localStorage.getItem('jobId') ? JSON.parse(localStorage.getItem('jobId')) : null,
    applicationId : null
}

const jobApplicationSlice = createSlice({
    name : 'jobApplicationSlice',
    initialState,
    reducers : {
        setJobId : (state, action) => {
            state.jobId = action.payload;
            localStorage.setItem('jobId' , action.payload)
        },
        setApplicationId : (state, action) => {
            state.applicationId = action.payload
        }
    }
});

export const { setJobId, setApplicationId } = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;