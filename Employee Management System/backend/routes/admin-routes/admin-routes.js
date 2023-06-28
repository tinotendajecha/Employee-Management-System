var express = require('express');
var router = express.Router();

// Importing the login controllers
const login = require('../../controllers/admin-controllers/admin-login');
const signup = require('../../controllers/admin-controllers/admin-signup');

// Login and signup for admin
router.route('/admin-login').post(login)
router.route('/admin-signup').post(signup)

// Importing the departments controllers
const { createDepartment,
    getAllDepartments,
    getDepartmentById,
    deleteDepartment } = require('../../controllers/admin-controllers/department-controller')

// Managing departments by admins
router.route('/create-department').post(createDepartment)
router.route('/all-departments').get(getAllDepartments)
router.route('/department/:department-name').get(getDepartmentById)
router.route('/delete-department/:id').delete(deleteDepartment);

// Importing the jobs controllers
const {
    post_job,
    getAllJobs,
    getJobByTitle,
    getJobById,
    deleteJobById
} = require('../../controllers/admin-controllers/jobs-controller')

// Routes for manipulating the job model
router.route('/jobs/post-job').post(post_job)
router.route('/jobs/all-jobs').get(getAllJobs)
router.route('/jobs/get-job-by-title/:title').get(getJobByTitle)
router.route('/jobs/get-job-by-id/:id').get(getJobById)
router.route('/jobs/delete-job/:id').delete(deleteJobById)

// Importing the employees controller
const { getAllEmployees,
    hireEmployee,
    rejectEmployee,
    getEmployeeByUserEmail,
    getSpecificManagersEmployees,
    getEmployeeById
}
    = require('../../controllers/admin-controllers/employee-controller')

// Employee routes
router.route('/get-all-employees').get(getAllEmployees);
router.route('/hire-employee').post(hireEmployee);
router.route('/get-employee-by-user-email').get(getEmployeeByUserEmail);
router.route('/get-specific-managers-employees/:id').get(getSpecificManagersEmployees);
router.route('/reject-employee/:id').post(rejectEmployee);
router.route('/get-employee-by-id/:id').get(getEmployeeById)

const { getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByEmployeeId } = require('../../controllers/admin-controllers/Tasks-controller')

router.route('/get-all-tasks').get(getAllTasks);
router.route('/create-task').post(createTask);
router.route('/get-tasks-by-id/:id').get(getTaskById);
router.route('/get-task-by-employee-id/:id').get(getTasksByEmployeeId);
router.route('/update-task-status').patch(updateTask);
router.route('/delete-task-by-id/:id').delete(deleteTask);

module.exports = router;