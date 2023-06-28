const asyncHandler = require('express-async-handler');
const Task = require('../../models/admin-models/tasks-model');



const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.findAll();

    res.status(200).json({
        message: 'success 🙂',
        data: {
            tasks,
        },
    });
});


const createTask = asyncHandler(async (req, res) => {
    const { title, description, employeeId, managerId, deadline } = req.body;
    console.log({ title, description, employeeId, managerId, deadline })

    const task = await Task.create(title, description, employeeId, managerId, deadline);

    res.status(201).json({
        message: 'Task created successfully! 🙂',
        data: {
            task,
        },
    });
});

const getTaskById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const task = await Task.findById(id);

    if (!task) {
        res.status(404).json({
            message: 'Task not found 😕',
        });
        return;
    }

    res.status(200).json({
        message: 'success 🙂',
        data: {
            task,
        },
    });
});

const getTasksByEmployeeId = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;

    const tasks = await Task.findByEmployeeId(employeeId);

    if (tasks.length === 0) {
        res.status(200).json({
            data : {
                tasks : []
            }
        });
        return;
    }

    res.status(200).json({
        message: 'success 🙂',
        data: {
            tasks,
        },
    });
});



const updateTask = asyncHandler(async (req, res) => {
    const { id, status } = req.body;

    const task = await Task.update(id, status);

    if (!task) {
        res.status(404).json({
            message: 'Task not found 😕',
        });
        return;
    }

    res.status(200).json({
        message: 'Task updated successfully! 🙂',
        data: {
            task,
        },
    });
});


const deleteTask = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const task = await Task.findById(id);

    if (!task) {
        res.status(404).json({
            message: 'Task not found 😕',
        });
        return;
    }

    await Task.delete(id);

    res.status(200).json({
        message: 'Task deleted successfully! 🙂',
    });
});

module.exports = {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByEmployeeId
};