import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PositiveActionButton from '../components/Buttons/PositiveActionButton'
import NagativeActionButton from '../components/Buttons/NegativeActionButton'

const AllLeaveRequests = () => {
  const { User } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [requests, setRequests] = useState([]);
  const [displayedRequests, setDisplayedRequests] = useState('pending');
  const [employee, setEmployee] = useState({});

  const [requestResponded, setrequestresponded] = useState(false)

  useEffect(() => {
    const getAllEmployeeLeaveRequests = async () => {
      try {
        const res = await axios.get(`/api/v1/employee/get-all-leave-requests`);
        setRequests(res.data.data.requests);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
        console.log(err);
      }
    };
    getAllEmployeeLeaveRequests();
  }, [requestResponded]);

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const employeeId = requests[0].employeeId;
        const res = await axios.get(`/api/v1/admin/get-employee-by-id/${employeeId}`);
        setEmployee(res.data.data.employee);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
        console.log(err);
      }
    };
    if (requests.length > 0) {
      getEmployeeDetails();
    }
  }, [requests]);

  const handlePendingRequestsClick = () => {
    setDisplayedRequests('pending');
  };

  const handleAcceptedRequestsClick = () => {
    setDisplayedRequests('accepted');
  };

  const handleRejectedRequestsClick = () => {
    setDisplayedRequests('rejected');
  };

  const handleAcceptRequest = async (id) => {
    const managerResponse = {
      id,
      status: 'accepted',
      managerEmail: User.email,
      employeeId: employee.id,
      employeeEmail: employee.email
    }
    await axios.patch(`/api/v1/employee/update-leave-request`, managerResponse);
    if (requestResponded) {
      setrequestresponded(false);
    } else {
      setrequestresponded(true);
    }
    toast.success('Leave request approved 🤝')
  }

  const handleDeclineRequest = async (id) => {
    const managerResponse = {
      id,
      status: 'rejected',
      managerEmail: User.email,
      employeeId: employee.id,
      employeeEmail: employee.email
    }
    await axios.patch(`/api/v1/employee/update-leave-request`, managerResponse);
    if (requestResponded) {
      setrequestresponded(false);
    } else {
      setrequestresponded(true);
    }
    toast.success('Leave request declined ❌')
  }

  const filteredRequests = requests.filter(request => request.status === displayedRequests);

  return (
    <div>
      <div className='response-buttons'>
        <button className='response-btn' onClick={handlePendingRequestsClick}>Pending Requests</button>
        <button className='response-btn' onClick={handleAcceptedRequestsClick}>Accepted Requests</button>
        <button className='response-btn' onClick={handleRejectedRequestsClick}>Rejected Requests</button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading requests.</div>
      ) : (
        <>
          {filteredRequests.length === 0 && (
            <div>
              <h1>There are no {displayedRequests} leave requests 🙂</h1>
            </div>
          )}

          {filteredRequests.length > 0 && (
            <div>
              <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Employee Surname</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Reason for Leave</th>
              {displayedRequests === 'pending' && (
                <th>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request.id}>
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{request.startDate}</td>
                <td>{request.endDate}</td>
                <td>{request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase()}</td>
                <td>{request.reasonForLeave}</td>
                {displayedRequests === 'pending' && (
                  <td>
                    <div className='action'>
                      <button onClick={() => handleAcceptRequest(request.id)} >Accept</button>
                      <button onClick={() => {handleDeclineRequest(request.id)}}>Decline</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllLeaveRequests;