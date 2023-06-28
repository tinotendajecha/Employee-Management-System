const Department = require('../../models/admin-models/department-model');
const asyncHandler = require('express-async-handler');

// Creating a department
const createDepartment = asyncHandler(async(req,res) => {
    const { department_name } = req.body;

    const department = await Department.create(department_name);
    
    res.status(200).json({
        message : "Department successfully added 🎉",
        data : {
            department
        }
    })
})


//Getting all department
const getAllDepartments = asyncHandler(async(req,res) => {
    const departments = await Department.getAllDepartments();

    res.status(200).json({
        message : 'success 🙂',
        data : {
            departments
        }
    })
})

// Get department by Id
const getDepartmentById = asyncHandler(async(req,res) => {
    const id  = req.params.id

    const department = await Department.getDepartmentById(id)

    res.status(200).json({
        message : 'success 🙂',
        data : {
            department
        }
    })
})


//Deleting a department
const deleteDepartment = asyncHandler(async(req,res) => {
    const id = req.params.id;
    console.log(id)
    await Department.deleteById(id)

    res.status(200).json({
        message : 'Department successfully removed 🙂'
    })
})

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    deleteDepartment
}
