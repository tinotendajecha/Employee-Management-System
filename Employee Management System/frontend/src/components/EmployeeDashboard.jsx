import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaBriefcase, FaUserCircle, FaDollarSign, FaRegCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import Notifications from '../components/Notifications';
import PositiveActionButton from './Buttons/PositiveActionButton';
import Tasks from './Tasks'


const EmployeeDashboard = ({ employee }) => {
  const navigate = useNavigate();

  const [jobState, setJobState] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [employeeHasProfile, setEmployeeHasProfile] = useState('');
  const [profileLoadedState, setProfileLoadedState] = useState(false);
  const [profileStatusIsLoading, setProfileStatusIsLoading] = useState(true);
  const [profileStatusIsError, setProfileStatusIsError] = useState(false)

  const employeeId = employee.employee.id;
  

  useEffect(() => {
    const getJobInfo = async () => {
      const jobId = employee.employee.job_id;
      const res = await axios.get(`/api/v1/admin/jobs/get-job-by-id/${jobId}`).then(res => {
        const job = res.data?.data?.result
        setIsLoading(false);
        setJobState(job)
      }).catch(err => {
        setIsError(true)
      })
    }
    const determineProfileStatus = async () => {
      const userEmail = {
        email: employee.employee.email
      }

      const res = await axios.post(`/api/v1/employee/find-employee-info-by-email`, userEmail).then(res => {
        setProfileStatusIsLoading(false)
        setProfileLoadedState(true)
        const hasInfo = res.data?.data?.employeeInfo;
        setEmployeeHasProfile(hasInfo)
      }).catch(err => {
        setProfileStatusIsError(true)
      })
    }
    getJobInfo()
    determineProfileStatus();
  }, [])

  const handleCompleteProfile = () => {
    navigate('/complete-my-profile')
  }

  const renderContent = () => {
    if (isLoading && profileStatusIsLoading) {
      return <div>Loading....</div>
    }

    if (isError && profileStatusIsError) {
      return <div>Oops an error occured, try refreshing the page</div>
    }

    if (jobState && profileLoadedState) {
      return (
        <div>
          <div className='employee-info'>
            <div>
              <div>
                <div>
                  <FaUserCircle />
                </div>

                <div>
                  <p>Welcome back,</p>
                  <h2>{employee.employee.first_name} {employee.employee.last_name}</h2>
                  <p>{jobState.job_title}</p>
                </div>
              </div>

              <div>
                {
                  employeeHasProfile ? (
                    <PositiveActionButton text="Profile" />
                  ) : (
                    <PositiveActionButton text="Complete My Profile" onClick={handleCompleteProfile} />
                  )
                }
              </div>

            </div>

            <div>
              <div>
                <FaBriefcase />
                <span>Full-time</span>
              </div>
              <div>
                <FaDollarSign />
                {
                  Math.floor(jobState.job_salary)
                }
              </div>
              <div>
                <FaRegCalendarAlt />
                <span>Started on {employee.employee.hire_date}</span>
              </div>
            </div>
          </div>

          <div>
            <Tasks id={employeeId}/>

            <div className='notifications'>
                <Notifications />
            </div>
          </div>

        </div>
      )
    }
    return null;
  }

  return (
    renderContent()
  )

}

export default EmployeeDashboard;
