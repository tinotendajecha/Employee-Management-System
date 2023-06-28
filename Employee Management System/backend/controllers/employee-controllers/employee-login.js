const asyncHandler = require('express-async-handler')
const User = require('../../models/login-signup-model/user-model');
const bcrypt = require('bcrypt');

// Admin login
// Route /api/v1/employee/employee-login

const login = asyncHandler(async(req, res) => {

    const { email, password} = req.body;

    const user = await User.findByEmail(email);

    if(!user){
        res.status(400).json({
            error : 'Incorrect email or password 🤔'
        })
        return;
    }

    //Comparing the hashed password to the password input by the user
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        res.status(400).json({
            error : 'Incorrect email or password 😡'
        })
        return;
    }
    delete user.password;
    res.status(200).json({
        message : "Logged in succesfully 🎉",
        data : {
            user
        }
    })
})

module.exports = login
