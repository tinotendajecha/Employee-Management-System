const Application = require('../../models/employee-models/job-applications-model')
const asyncHandler = require('express-async-handler')

//  Method POST
//  employee/create-application
const createApplication = asyncHandler(async (req, res) => {

    const {first_name,last_name,email,phoneNumber,job_id,status,applied_at,reviewed_by,reviewed_at } = req.body;

    // check if the email is already a candidate
    const applicationExists = await Application.findByEmail(email);

    if(applicationExists){
        res.status(200).json({
            message : "You have already submitted an application, Wait for your response 🤔"
        })
        return;
    }

    // const applicationData = req.body
    await Application.create(first_name,last_name,email,phoneNumber,job_id,status,applied_at,reviewed_by,reviewed_at);

    res.status(201).json({
        message : 'Application submitted succesfully 🙂'
    })

})

//Get application by the userId
const getSingleUserApplications = asyncHandler(async(req, res) => {
    const email = req.body.email;
    console.log(email)
    const application = await Application.findByEmail(email);
    
    if(!application){
        res.status(200).json({
            data : {
                message : 'You have no active applications 🤔'
            }
        })
        return;
    }

    res.status(200).json({
        message : 'Success 🙂',
        data : {
            application
        }
    })
})


// Method POST
// endpoint employee/get-all-applications
const getAllPendingApplication = asyncHandler(async(req, res) => {
    const applications = await Application.findAllPending();

    res.status(200).json({
        message : 'success',
        data : {
            applications
        }
    })
})

// Get an application by its application id
const getApplicationById = asyncHandler(async(req, res) => {
    const id = req.params.id
    res.send('Handler for getting application by its id ' + id)
});

const deleteJobApplication = asyncHandler(async(req,res) => {
    const id  = req.params.id
    
    const result = await Application.deleteById(id);

    res.status(200).json({
        message : 'Job application deleted succesfully 👍'
    })
})





module.exports = {
    createApplication,
    getAllPendingApplication,
    getApplicationById,
    getSingleUserApplications,
    deleteJobApplication,
}