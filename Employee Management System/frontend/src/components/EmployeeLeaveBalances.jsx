import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { FaMedkit, FaPlane } from 'react-icons/fa';

// component requires the email as a prop
const EmployeeLeaveBalances = ({ email }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [employee, setEmployee] = useState();

    const [leaveBalances, setLeaveBalances] = useState('')

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
    }, [email])

    useEffect(() => {
        if (employee) {
            const getLeaveBalances = async () => {
                const res = await axios.post(`/api/v1/employee/get-employee-leave-balances/${employee.id}`).then(res => {
                    const leaveBalance = res.data?.data.leaveBalances[0]
                    setLeaveBalances(leaveBalance)
                    setIsLoading(false)
                }).catch(err => {
                    setIsError(true)
                })
            }
            getLeaveBalances()
        }
    }, [employee])

    const renderContent = () => {
        if (isLoading) {
            return <div>Loading...</div>
        }
        if (isError) {
            return <div>Oops an error occured, try reloading the page</div>
        }
        if (employee && leaveBalances) {
            return (
                <div>
                    <div>
                        <h2><FaMedkit />Sick Days Left</h2>
                        <h1>{leaveBalances.sick_leave_days} Days</h1>
                    </div>

                    <div>
                        <h2><FaPlane />Holiday Days Left</h2>
                        <h1>{leaveBalances.sick_leave_days} Days</h1>
                    </div>
                </div>
            )
        }
    }


    return (
        renderContent()
    )
}

export default EmployeeLeaveBalances;
