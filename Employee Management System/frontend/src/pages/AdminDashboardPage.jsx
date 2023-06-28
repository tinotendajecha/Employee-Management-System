import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEmployee } from '../features/slices/EmployeeSlice';
import PositiveActionButton from '../components/Buttons/PositiveActionButton';
import Notifications from '../components/Notifications';



const AdminDashboardPage = () => {
  // Getting the logged in manager's id
  const { User } = useSelector((state) => state.auth);

  const [managersEmployees, setManagersEmployees] = useState('');
  const [jobs, setJobs] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Managers id
  const managersId = User.id;
  useEffect(() => {
    const getMyEmployees = async () => {
      const res = await axios.get(`/api/v1/admin/get-specific-managers-employees/${managersId}`).then(res => {
        const employees = res.data.employees
        setManagersEmployees(employees);
        setIsLoading(false)
      }).catch(err => {
        setIsError(true)
      })

      const getJobs = async() => {
        const res = await axios.get('/api/v1/admin/jobs/all-jobs').then(res => {
          setJobs(res.data?.data?.jobs)
        }).catch(err => {
          setIsError(true)
        })
      }
      getJobs()
      
    }
    getMyEmployees()
  }, [])
  
  const handleManage = (employee) => {
    dispatch(setEmployee(employee));
    navigate('/manage-employee');
  }
  

  const renderContent = () => {
    if (isLoading) {
      return <div>Employees loading...</div>
    }

    if (isError) {
      return <div>Whoops an error occured, try refreshing the page</div>
    }

    if (managersEmployees && jobs ) {
      return (
        <div>
          <div>
            <h1>My Team</h1>
            {
              managersEmployees.length === 0 ? (
                <div>
                  <h1>You have not yet hired any employees 🙂</h1>
                  <div>
                    <Link to='/careers'><span>Post vacancy</span></Link>
                    <Link to='/all-candidates'>Open Candidates</Link>
                  </div>
                </div>
              ) : (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th >Name </th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Position</th>
                        <th>Hire Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>


                    {managersEmployees.map(employee => {
                      const job = jobs.find((job) => job.id === employee.job_id);
                      return (
                        <tbody key={employee.id}>
                          <tr >
                            <td>{employee.first_name}</td>
                            <td>{employee.last_name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phone_number}</td>
                            <td>{job ? job.job_title : null}</td>
                            <td>{employee.hire_date}</td>
                            <td>
                              <PositiveActionButton onClick={(e) => {handleManage(employee)}} text="Manage"/>
                            </td>
                          </tr>
                        </tbody>
                      )
                    })}

                  </table>
                </div>
              )
            }
          </div>

          <div>
            <Notifications />
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

export default AdminDashboardPage;
