// This slice will be used to keep the state of the employee we are managing
import { createSlice } from "@reduxjs/toolkit";

const initialEmployeeInfo = {
    id : null,
    first_name : null,
    last_name : null,
    hire_date : null,
    email : null,
    manager_id : null,
    phone_number : null,
    department_id : null,
    job_id : null
}

const initialState = {
    employee : localStorage.getItem('employee') ? JSON.parse(localStorage.getItem('employee')) : initialEmployeeInfo,
}

const employeeSlice = createSlice({
    name : 'employee',
    initialState,
    reducers : {
        setEmployee : (state, action) => {
            state.employee = action.payload;
            localStorage.setItem('employee', JSON.stringify(state.employee))
        },
        clearEmployee : (state) => {
            state.employee = initialEmployeeInfo;
            localStorage.removeItem('employee');
        }
    }
})

export const  { setEmployee, clearEmployee } = employeeSlice.actions;


export default employeeSlice.reducer;