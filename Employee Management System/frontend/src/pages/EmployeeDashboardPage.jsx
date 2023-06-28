import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CandidateDashboard from '../components/CandidateDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';
import AdminDashboardPage from './AdminDashboardPage';



const EmployeeDashboardPage = () => {
  const { User } = useSelector(state => state.auth);
  const [isEmployee, setIsEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const email = User.email;
    async function fetchEmploymentStatus(){
      setIsLoading(true);
      try {
        const res = await axios.get('/api/v1/admin/get-employee-by-user-email', {
          params : { email }
        });
        setIsEmployee(res.data)
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false)
    }
    fetchEmploymentStatus();
  }, [User])

  


  const renderContent = () => {
    if(isLoading){
      return <div>Still Loading...</div>
    }

    if (isError) {
      return <p>Error occurred while fetching employment status.</p>;
    }

    if(User.is_admin == "false"){
      if(isEmployee){
        if(isEmployee.employee){
          return (
            <div>
              <EmployeeDashboard employee={isEmployee}/>
            </div>
          )
        }else{
          return (
            <div>
              <CandidateDashboard />
            </div>
          )
        }
      }
    }else{
      return(
        <AdminDashboardPage />
      )
    }

    return null;
  }

  return(
    <div>
      {renderContent()}
    </div>
  )
  
}

export default EmployeeDashboardPage;
