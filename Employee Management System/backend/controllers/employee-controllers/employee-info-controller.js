const EmployeeInfo = require('../../models/employee-models/employee-info-model');
const asyncHandler = require('express-async-handler')


// Controller for completing employee profile
const employeeCompleteProfile = asyncHandler(async(req, res) => {
    const {email, address,dob,next_of_kin,next_of_kin_phone_number,marital_status,account_number,health_info,criminal_record,citizenship,gender,race} = req.body;

    
    const employeeInfo = await EmployeeInfo.create(email, address,dob,next_of_kin,next_of_kin_phone_number,marital_status,account_number,health_info,criminal_record,citizenship,gender,race);

    res.status(200).json({
        message : 'success 🙂',
        employeeInfo
    })
})

const findEmployeeInfoByEmail = asyncHandler(async(req, res) => {
    const { email } = req.body;

    const employeeInfo = await EmployeeInfo.findByEmail(email);

    res.status(200).json({
        data : {
            employeeInfo : employeeInfo
        }
    })
})

module.exports = {
    employeeCompleteProfile,
    findEmployeeInfoByEmail
}