import React, { useEffect } from 'react';
import EmployeeLeaveBalances from '../components/EmployeeLeaveBalances';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios';
import PositiveActionButton from '../components/Buttons/PositiveActionButton';
import InputField from '../components/InputField';


const RequestLeavePage = () => {
  const navigate = useNavigate();
  const { User } = useSelector((state) => state.auth);
  const email = User.email;


  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [employee, setEmployee] = useState();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('')
  const [reasonForLeave, setReasonForLeave] = useState('')


  useEffect(() => {
    const getEmployeeInfo = async () => {
      const res = await axios.get(`/api/v1/admin/get-employee-by-user-email?email=${email}`).then(res => {
        const employee = res.data.employee
        setEmployee(employee)
      }).catch(err => {
        setIsError(true)
      })
    }
    getEmployeeInfo();

  }, [])

  const [leaveRequest, setLeaveRequest] = useState('')

  useEffect(() => {
    if (employee) {
      const getLeaveRequests = async () => {
        const res = await axios.post(`/api/v1/employee/get-request-by-user-id/${employee.id}`).then(res => {
          const req = res.data.data.leaveRequest[0] || res.data.data.leaveRequest
          setLeaveRequest(req)
          setIsLoading(false)
        }).catch(err => {
          console.log(err)
        })
      }
      getLeaveRequests()
    }
  }, [employee])

  const handleApply = async (e) => {
    e.preventDefault();
    const formData = {
      employeeId: employee.id,
      startDate,
      endDate,
      reasonForLeave,
      employeeEmail: employee.email,
      managerId: employee.manager_id
    }
    const res = await axios.post(`/api/v1/employee/post-leave-request`, formData).then(res => {
      navigate('/employee-dashboard')
      toast.success('Leave request submitted, Wait for response from manager')
    }).catch(err => {
      setIsError(true)
    })
  }

  console.log(leaveRequest)


  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>
    }
    if (isError) {
      return <div>Oops an error occured, try reloading the page</div>
    }
    if (employee && leaveRequest) {
      if (leaveRequest.status === 'pending') {
        return (
          <div>
            <h1>You already applied for leave, wait for your response 🙂</h1>
          </div>
        )
      }
      if (leaveRequest.status === 'accepted' && Date.parse(leaveRequest.endDate) > Date.now()) {
        return (
          <div>
            <h1>Your leave application has been approved</h1>
            <h2>Leave is due on {leaveRequest.endDate}</h2>
          </div>
        )
      }

      return (
        <div>
          {/* <EmployeeLeaveBalances email={email} /> */}
          <h1>Provide information for your request</h1>
          <form action="">
            <InputField label="Start Date" type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <InputField label="End Date" type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            <div>
              <label htmlFor="reason">Reason for leave</label>
              <textarea
                cols="30" rows="10"
                id="reason"
                value={reasonForLeave}
                onChange={(e) => setReasonForLeave(e.target.value)}></textarea>
            </div>

            <div>
              <PositiveActionButton text="Apply" onClick={handleApply} />
            </div>
          </form>
        </div>
      )


    }
  }



  return (
    renderContent()
  )
}

export default RequestLeavePage
