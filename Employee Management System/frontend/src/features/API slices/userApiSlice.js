import apiSlice from "./APISlice";
const URL = `/api/v1`;


const userApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        // Function for handling the employee login
        registerEmployee : builder.mutation({
            query : (userData) => ({
                url : `${URL}/employee/employee-signup`,
                method : 'POST',
                body : userData
            })
        }),
        loginEmployee : builder.mutation({
            query : (userData) => ({
                url: `${URL}/employee/employee-login`,
                method : 'POST',
                body : userData
            })
        }),
        loginAdmin : builder.mutation({
            query : (userData) => ({
                url : `${URL}/admin/admin-login`,
                method : 'POST',
                body : userData
            })
        }),
        // Function for handling the admin register
        registerAdmin : builder.mutation({
            query : (userData) => ({
                url : `${URL}/admin/admin-signup`,
                method : 'POST',
                body : userData
            })
        })
    })
})

export const { useRegisterEmployeeMutation, useLoginEmployeeMutation, useLoginAdminMutation, useRegisterAdminMutation } = userApiSlice;