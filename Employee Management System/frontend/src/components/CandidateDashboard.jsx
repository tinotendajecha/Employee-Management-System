import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { setApplicationId } from '../features/slices/JobApplicationSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'



const CandidateDashboard = () => {

  const dispatch = useDispatch();

  let [application, setApplication] = useState('');
  const[jobName, setJobName] = useState('')
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false)
  const { User } = useSelector((state) => state.auth);
  const { applicationId } = useSelector((state) => state.jobApplication)
  const email = {
    email: User.email
  }
  useEffect(() => {
    const fetchMyJobApplications = async () => {
      const res = axios.post('/api/v1/employee/get-all-my-job-applications', email).then(res => {
        setApplication(res.data.data);
        setIsLoading(false)
      }).catch(err => {
        setIsError(true)
      })
    }
    fetchMyJobApplications()
  }, [applicationId])


  const handleDeleteApplication = async() => {
    const id =  application.application[0].id
    
    // Setting the application id so that redux will detect state changes
    dispatch(setApplicationId(id));

    const res = await axios.delete(`/api/v1/employee/delete-application/${id}`)
      .then((res) => console.log(res))
      .catch(err => setIsError(true))
    
    // Setting back the application id so that redux will detect state changes and re-render the page
    dispatch(setApplicationId(null));
    toast.success('Job application deleted succesfully 👍')
  }

  const getJobName = async() => {
    if(application.application){
      const id = application.application[0].job_id
      const res = await axios.get(`/api/v1/admin/jobs/get-job-by-id/${id}`)
                  .then(res => {
                    const job_title = res.data?.data?.result?.job_title;
                    setJobName(job_title)
                }).catch(err => {
                  console.log(err)
                })
    }
  }
  getJobName()
  

  const renderContent = () => {

    if (isLoading) {
      return <div>Employment status is loading...</div>
    }

    if (isError) {
      return <div>Whoops, an error occured, try refreshing the page</div>
    }

    if (application.application) {
      return (
        <div>
          <div>
          <h1>My Job Applications</h1>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Vacancy</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{application.application[0].first_name}</td>
                <td>{application.application[0].last_name}</td>
                <td>{application.application[0].email}</td>
                <td>{jobName}</td>
                <td>{application.application[0].phoneNumber}</td>
                <td>{application.application[0].status}</td>
                <td><button className='action-btn' onClick={handleDeleteApplication}>Delete <FaTrash /></button></td>
              </tr>
            </tbody>
          </table>
          </div>

          <div>
            <h2>Welcome</h2>
            <p>Thank you for your interest in checking out our careers and creating a login to our Career site.  This will allow you to check the status of your application and receive important updates and materials related to your application.</p>
          </div>
        </div>
      )
    }

    if(application.message){
      return (
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{application.message}</td>
              <td>
                <Link to="/careers"><button>Apply for a job</button></Link>
              </td>
            </tr>
          </tbody>

        </table>
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

export default CandidateDashboard;
