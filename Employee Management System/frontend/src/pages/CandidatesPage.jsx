import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import NegativeActionButton from '../components/Buttons/NegativeActionButton';
import PositiveActionButton from '../components/Buttons/PositiveActionButton';


const CandidatesPage = () => {

  const { User } = useSelector((state) => state.auth)
  const [candidates, setCandidates] = useState('');
  const [jobs, setJobs] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false)

  const [hireEmployeeState, setHireEmployeeState] = useState(false);
  const [rejectEmployeeState, setRejectEmployeeState] = useState(false);

  useEffect(() => {
    const getAllCandidates = async () => {
      const res = await axios.get('/api/v1/employee/get-all-pending-applications').then(res => {
        const candidates = res.data?.data?.applications;
        setCandidates(candidates);
        setIsLoading(false)
      }).catch(err => {
        setIsError(true);
      })
    }
    const getAllJobs = async () => {
      const res = await axios.get('/api/v1/admin/jobs/all-jobs').then(res => {
        const fetchedJobs = res.data?.data?.jobs
        setJobs(fetchedJobs)
      }).catch(err => {
        setIsError(true)
      })
    }
    getAllCandidates();
    getAllJobs();
  }, [hireEmployeeState, rejectEmployeeState])

  const handleAcceptCandidate = async (id, firstName, lastName, email, phoneNumber, jobId, departmentId) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-indexed, so we need to add 1
    const year = today.getFullYear();

    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;


    const employeeData = {
      application_id: id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      hire_date: formattedDate,
      job_id: jobId,
      manager_id: User.id,
      department_id: departmentId
    }

    // Post details to the api for hiring employees
    const res = await axios.post('/api/v1/admin/hire-employee', employeeData).then(res => {
      console.log(res);
      toast.success(`${firstName} ${lastName} succesfully hired 🤝`);
      setHireEmployeeState(true)
    }).catch(err => {
      setIsError(true)
    })

  }

  const handleRejectCandidate = async (id) => {
    const res = await axios.post(`/api/v1/admin/reject-employee/${id}`).then(res => {
      toast.success('Application rejected ❌')
      setRejectEmployeeState(true)
    }).catch(err => {
      setIsError(true)
    })
  }

  const renderContent = () => {
    if (isLoading) {
      return <div>Candidates are loading...</div>
    }

    if (isError) {
      return <div>Oops an error occured, try refreshing the page</div>
    }

    if (candidates.length === 0) {
      return <h1>There are currently no candidates available 🙂</h1>
    }

    if (candidates && jobs) {
      return (
        <div>
          <h1>Candidates</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Vacancy</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            {
              candidates.map(candidate => {
                const job = jobs.find(job => job.id === candidate.job_id);
                return (
                  <tbody key={candidate.id}>
                    <tr>
                      <td>{candidate.first_name}</td>
                      <td>{candidate.last_name}</td>
                      <td>{candidate.email}</td>
                      <td>{candidate.phoneNumber}</td>
                      <td>{job ? job.job_title : ''}</td>
                      <td>{candidate.status}</td>
                      <td>
                        <div className='hire-reject-buttons'>
                          <button
                          onClick={
                            () => handleAcceptCandidate(
                              candidate.id,
                              candidate.first_name,
                              candidate.last_name,
                              candidate.email,
                              candidate.phoneNumber,
                              candidate.job_id,
                              job.department_id,
                            )
                          }
                          >Hire</button>
                          <button
                          onClick={() => handleRejectCandidate(candidate.id)}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )
              })
            }
          </table>
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

export default CandidatesPage
