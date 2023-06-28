import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaCheck, FaDollarSign, FaMapPin } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PositiveActionButton from '../components/Buttons/PositiveActionButton';
import InputField from '../components/InputField';

const SingleJobPostPage = () => {
  const navigate = useNavigate()
  const { jobId } = useSelector((state) => state.jobApplication);
  const { User } = useSelector((state) => state.auth)
  const [jobs, setJobs] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get('/api/v1/admin/jobs/all-jobs').then(res => {
        setJobs(res.data.data.jobs)
        setIsLoading(false)
      }).catch(err => {
        setIsError(true)
      })
    }
    fetchJobs()
  }, [])

  // Form details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const email = User.email;
  const [phoneNumber, setPhoneNumber] = useState('');
  const job_id = jobId;
  const status = 'pending';
  const appliedAt = new Date();

  const handleCompleteApplication = async (e) => {
    e.preventDefault();
    if(firstName === "" || lastName === "" || phoneNumber === ""){
      toast.error('Please fill in all the fields 🧐')
      return;
    }
    const applicantData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phoneNumber: phoneNumber,
      job_id,
      status,
      applied_at: appliedAt,
    }

    const res = await axios.post('/api/v1/employee/create-application', applicantData).then(res => {
      const successMsg = res.data.message;
      toast.success(successMsg);
    }).catch(err => {
      toast.error(err.data.message);
    })
    navigate('/employee-dashboard')
  }

  const renderContent = () => {
    if (isLoading) {
      return <div>Page Loading...</div>
    }

    if (isError) {
      return <div>whoops...an error occured please reload the page</div>
    }

    if (jobs) {
      let job = jobs.filter(job => job.id === jobId);
      job = job[0]
      return (
        <div>
          <div>
            <h1>{job.job_title}</h1>
            <p>{job.job_description}</p>

            <div>
              <span>
                <FaMapPin />
                {job.job_location}</span>
              <span>
                <FaDollarSign />
                {job.job_salary}</span>
            </div>
          </div>

          <div>
            <form >
              <h1>We need some of your details</h1>
              <InputField label="First Name" type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <InputField label="Last Name" type="text" id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <InputField label="Phone Number" type="text" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <div>
                <PositiveActionButton text="Complete application" onClick={handleCompleteApplication} />
              </div>
            </form>
          </div>

        </div>
      )
    }

    return null;
  }



  return (
    <div>
      {renderContent()}
    </div>
  )
}

export default SingleJobPostPage;

