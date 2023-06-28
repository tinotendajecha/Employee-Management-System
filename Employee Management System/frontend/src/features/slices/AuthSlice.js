import { createSlice } from '@reduxjs/toolkit';

const initialUserInfo = {
    username : null,
    email : null,
    is_admin : null
}

// Initializing the state of the user and retrieving it from the local storage if it exists
const initialState = {
    User : localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')) : initialUserInfo
}

// This piece of state will determine if the user is logged in or not
const userSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        setUserCredentials : (state, action) => {
            const userInfo = action.payload
            console.log(userInfo)
            localStorage.setItem('User', JSON.stringify(userInfo))
            state.User = userInfo;
        },
        logoutUser: (state) => {
            localStorage.removeItem('User')
            state.User = initialUserInfo
        }
    }
})

// Exporting our actions for use in the applications various components
export const { setUserCredentials, logoutUser } = userSlice.actions;

//Exporting the user slice reducer for use in the store
export default userSlice.reducer;
