import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    jobs : null
}

const jobsSlice = createSlice({
    name : "jobs",
    initialState,
    reducers : {
        setJobsAction : (state, action) => {
            //Function which sets all the job vacancies
            state.jobs = action.payload;
        }
    }
})

export const { setJobsAction } = jobsSlice.actions;

export default jobsSlice.reducer;
