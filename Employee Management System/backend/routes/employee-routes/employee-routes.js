var express = require('express');
var router = express.Router();

const login = require('../../controllers/employee-controllers/employee-login');
const signup = require('../../controllers/employee-controllers/employee-signup')

router
    .route('/employee-login')
    .post(login)
    
router
    .route('/employee-signup')
    .post(signup)

const { 
     createApplication,
     getAllPendingApplication,
     getApplicationById,
     getSingleUserApplications,
     deleteJobApplication 
    } = require('../../controllers/employee-controllers/application-controller')
router.route('/create-application').post(createApplication);
router.route('/get-all-pending-applications').get(getAllPendingApplication);
router.route('/get-by-application-id/:id').post(getApplicationById);
router.route('/get-all-my-job-applications').post(getSingleUserApplications);
router.route('/delete-application/:id').delete(deleteJobApplication);

const {
    employeeCompleteProfile,
    findEmployeeInfoByEmail
} = require('../../controllers/employee-controllers/employee-info-controller');

router.route('/complete-employee-profile').post(employeeCompleteProfile);
router.route('/find-employee-info-by-email').post(findEmployeeInfoByEmail);


const { createLeaveRequest, getEmployeeLeaveBalancesById, getLeaveRequestsByUserId, getAllLeaveRequests, updateLeaveRequest } = require('../../controllers/employee-controllers/leave-requests-controller');

router.route('/post-leave-request').post(createLeaveRequest);
router.route('/get-employee-leave-balances/:id').post(getEmployeeLeaveBalancesById);
router.route('/get-request-by-user-id/:id').post(getLeaveRequestsByUserId);
router.route('/get-all-leave-requests').get(getAllLeaveRequests);
router.route('/update-leave-request').patch(updateLeaveRequest)

const { getAllNotifications } = require('../../controllers/employee-controllers/Notifications-controller');

router.route('/get-all-notifications').get(getAllNotifications);

module.exports = router;