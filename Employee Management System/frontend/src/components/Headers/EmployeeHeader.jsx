import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { logoutUser } from '../../features/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import CandidateHeader from './EmployeeHeaders/CandidateHeader';
import HiredEmployeeHeader from './EmployeeHeaders/HiredEmployeeHeader';

const EmployeeHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { User } = useSelector(state => state.auth);
  const [isEmployee, setIsEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const email = User.email;
    async function fetchEmploymentStatus() {
      setIsLoading(true);
      try {
        const res = await axios.get('/api/v1/admin/get-employee-by-user-email', {
          params: { email }
        });
        setIsEmployee(res.data)
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false)
    }
    fetchEmploymentStatus();
  }, [User])

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    toast.success('Succesfully logged out 🙂')
  }

  const renderContent = () => {
    if (isLoading) {
      return <div>Still Loading...</div>
    }

    if (isError) {
      return <p>Error occurred while fetching employment status.</p>;
    }

    if (isEmployee) {
      if (isEmployee.employee) {
        return (
          <HiredEmployeeHeader handleLogout={handleLogout} />
        )
      } else {
        return (
          <CandidateHeader handleLogout={handleLogout} />
        )
      }
    }
    return null;
  }

  return(
    <div>
      {renderContent()}
    </div>
  )

}

export default EmployeeHeader;
