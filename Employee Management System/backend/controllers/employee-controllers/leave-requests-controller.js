const asyncHandler = require('express-async-handler');
const LeaveRequest = require('../../models/employee-models/LeaveRequests');
const Notification = require('../../models/employee-models/Notifications');
const LeaveBalances = require('../../models/employee-models/LeaveBalances');

const createLeaveRequest = asyncHandler(async (req, res) => {
    // This controller will create a leave request and also a notifcation
    const { employeeId, startDate, endDate, reasonForLeave, employeeEmail, managerId } = req.body;


    //  This info will be for creating the leave request
    // employee_id, start_date, end_date, reason_for_leave

    const leaveRequest = await LeaveRequest.create(employeeId, startDate, endDate, reasonForLeave);

    if (leaveRequest) {
        //  This info will be for creating a new notification
        // managerId and employeeEmail for creating the notification
        // The notification message is hard coded in here
        const message = `${employeeEmail} is requesting for a leave from ${startDate} to ${endDate}`;

        await Notification.create(message, employeeEmail, managerId);
    }

    res.status(200).json({
        data : {
            leaveRequest
        }
    })
})

const getLeaveRequestsByUserId = asyncHandler(async(req, res) => {
    const id = req.params.id;

    const leaveRequest = await LeaveRequest.getByEmployeeId(id);

    res.status(200).json({
        data : {
            leaveRequest
        }
    })
})

const getAllLeaveRequests = asyncHandler(async(req, res) => {
    const requests = await LeaveRequest.getAll();

    res.status(200).json({
        data : {
            requests
        }
    })
})

const updateLeaveRequest = asyncHandler(async(req, res) => {
    const { id, status, managerEmail, employeeId, employeeEmail } = req.body;

    const updatedRequest = await LeaveRequest.updateById(id, status);
    
    const message = `${employeeEmail} leave request has been ${status}`
    // Create a notification
    const notification = await Notification.create(message, managerEmail, employeeId);

    res.status(200).json({
        updatedRequest
    })
})

const getEmployeeLeaveBalancesById = asyncHandler(async(req, res) => {
    const id = req.params.id;
    const leaveBalances = await LeaveBalances.getEmployeesLeaveInformation(id);

    res.status(200).json({
        data : {
            leaveBalances
        }
    })
    
})


module.exports = {
    createLeaveRequest,
    getEmployeeLeaveBalancesById,
    getLeaveRequestsByUserId,
    getAllLeaveRequests,
    updateLeaveRequest
}