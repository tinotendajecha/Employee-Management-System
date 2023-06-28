const asyncHandler = require('express-async-handler');
const Employee = require('../../models/admin-models/employee-model');
const Application = require('../../models/employee-models/job-applications-model')


// HTTP GET
// Endpoint     /get-all-employees

const getAllEmployees = asyncHandler(async(req,res) => {
    const employees = await Employee.findAll();

    res.status(200).json({
        message : 'success 🙂',
        data : {
            employees
        }
    })
})

// Controller for adding a candidate to the employees table
const hireEmployee = asyncHandler(async(req,res) => {
    const { application_id,first_name, last_name, email, phone_number, hire_date, job_id, manager_id, department_id } = req.body;

    // Passing in the id to change the status of the application to accepted
    await Application.changeApplicationStatusToAccepted(application_id)

    const employee = await Employee.create(first_name, last_name, email, phone_number, hire_date, job_id, manager_id, department_id);

    res.status(201).json({
        message : "Employee succesfully hired! 🙂",
        data : {
            employee
        }
    })
})

//  Thie controller is for rejecting an employee
const rejectEmployee = asyncHandler(async(req, res) => {
    const id = req.params.id;
    await Application.changeApplicationStatusToRejected(id);

    res.status(200).json({
        message : 'Application rejected ❌'
    })
})

// Controller for getting an employee by their unique email
const getEmployeeByUserEmail = asyncHandler(async(req, res) => {
    const { email } = req.query
    const employee = await Employee.findByUserEmail(email);

    res.status(200).json({
        employee
    })

})

//Controller for getting employees that belongs to a specific manager
const getSpecificManagersEmployees = asyncHandler(async(req, res) => {
    const id = req.params.id
    
    const employees = await Employee.findByManagersId(id);

    if(employees.length === 0){
        res.status(200).json({
            message : 'You have not hired any employees yet 🙂',
            employees
        })
        return;
    }

    res.status(200).json({
        message : 'Success 🙂',
        employees
    })

})

// Get employee by their id
const getEmployeeById = asyncHandler(async(req, res) => {
    const id = req.params.id
    const employee = await Employee.findById(id);

    res.status(200).json({
        data : {
            employee
        }
    })
})

module.exports = {
    getAllEmployees,
    hireEmployee,
    rejectEmployee,
    getEmployeeByUserEmail,
    getSpecificManagersEmployees,
    getEmployeeById
}

