const asyncHandler = require('express-async-handler');
const Job = require('../../models/admin-models/job-posting-model');
const User = require('../../models/login-signup-model/user-model')


// Create job handler 
// HTTP POST
// Endpoint  /jobs/post-job
const post_job = asyncHandler(async (req, res) => {
    const { job_title, job_description, job_location, job_salary, job_posted_by, department_id } = req.body;

    // Check if the user exists in the users table
    const user = await User.findById(job_posted_by);
    if (!user) {
        res.status(404).json({
            error: 'User posting the job not found 🤔'
        })
        return;
    }

    // Create a new job
    const result = await Job.create(job_title, job_description, job_location, job_salary, job_posted_by, department_id);

    // Return the created job
    return res.status(201).json({
        message: `Job posted sucessfully 🙂`,
        data: {
            result
        }
    });
})

// Get all jobs handler 
// HTTP GET
// Endpoint  /jobs/all-jobs
const getAllJobs = asyncHandler(async (req, res) => {
    // Get all jobs from the database
    const jobs = await Job.findAll();

    // Return the list of jobs
    return res.status(200).json({
        message: "Success 🙂",
        data: {
            jobs
        }
    });
})

// Get job by title 
// HTTP GET   
// Endpoint  /jobs/get-job-by-title/:title
const getJobByTitle = asyncHandler(async (req, res) => {
    const title = req.params.title
    const result = await Job.findByTitle(title);

    res.status(200).json({
        message: 'Success 🙂',
        data: result
    })
})

//Get job by id
//HTTP GET
// Endpoint /jobs/get-job-by-id/:id
const getJobById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await Job.findById(id);
    res.status(200).json({
        message: 'Success 🙂',
        data: {
            result
        }
    })

})

// Delete job by id
// HTTP GET
// Endpoint /jobs/delete-job/:id
const deleteJobById = asyncHandler(async (req, res) => {
    const id = req.params.id

    await Job.deleteById(id)

    res.status(200).json({
        message: 'Job post deleted successfully 🙂'
    })
})

module.exports = {
    post_job,
    getAllJobs,
    getJobByTitle,
    getJobById,
    deleteJobById
}



