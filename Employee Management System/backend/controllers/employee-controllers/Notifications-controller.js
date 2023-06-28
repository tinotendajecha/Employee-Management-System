const asyncHandler = require('express-async-handler')
const Notification = require('../../models/employee-models/Notifications');


const getAllNotifications = asyncHandler(async(req, res) => {
    const notifications = await Notification.getAll();

    res.status(200).json({
        notifications
    })
})


module.exports = {
    getAllNotifications
}