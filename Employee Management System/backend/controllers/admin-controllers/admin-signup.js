const asyncHandler = require('express-async-handler');
const User = require('../../models/login-signup-model/user-model');
const bcrypt = require('bcrypt');


//    Admin signup controller
//    /api/v1/admin/admin-signup
const signup = asyncHandler(async(req,res) => {
    const { email, password, username} = req.body;
    const is_admin = 'true';
    const newUsername = `${username}-sybrin-admin`;

    //Checking if the email already exists in the database
    const user = await User.findByEmail(email);
    
    if(user){
        res.status(400).json({
            error : 'User already exists! 🤔'
        })
        return;
    }

    //If user does not exist hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    User.create(email, hashedPassword, is_admin, newUsername)
    
    res.status(200).json({
        message : 'Admin account succesfully created 🙂',
        user : {
            email,
            username : newUsername,
            is_admin,
        }
    })
})

module.exports = signup
