import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import DetailItem from '../components/DetailItem';
import NegativeActionButton from '../components/Buttons/NegativeActionButton';
import PositiveActionButton from '../components/Buttons/PositiveActionButton';
import { useNavigate } from 'react-router-dom';
import EmployeeInfoInHeader from '../components/EmployeeInfoInHeader';
import { useDispatch } from 'react-redux';
import { clearEmployee } from '../features/slices/EmployeeSlice';



const ManageEmployeePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [jobState, setJobState] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [employeeProfile, setEmployeeProfile] = useState(false);
    const [profileIsLoading, setProfileIsLoading] = useState(true);
    const [profileIsError, setProfileIsError] = useState(false)
    const [employeeInfoLoaded, setEmployeeInfoLoaded] = useState(false)

    const { employee } = useSelector((state) => state.employee)

    useEffect(() => {
        const getJobInfo = async () => {
            const jobId = employee.job_id;
            const res = await axios.get(`/api/v1/admin/jobs/get-job-by-id/${jobId}`).then(res => {
                const job = res.data?.data?.result
                setIsLoading(false);
                setJobState(job)
            }).catch(err => {
                setIsError(true)
            })
        }
        const getEmployeeInfo = async () => {
            const userEmail = {
                email: employee.email
            }
            const res = await axios.post(`/api/v1/employee/find-employee-info-by-email`, userEmail).then(res => {
                setProfileIsLoading(false)
                const hasInfo = res.data?.data?.employeeInfo;
                setEmployeeProfile(hasInfo)
                setEmployeeInfoLoaded(true)
            }).catch(err => {
                setProfileIsError(true)
            })
        }
        getJobInfo();
        getEmployeeInfo();
    }, [])


    const handleAssignTask = () => {
            navigate('/assign-new-task')
    };

    const handleCheckPerformance = () => {
        navigate('/reports-and-analytics')
    };

    const handleNavigateBack = () => {
        //dispatch function to reset employees
        dispatch(clearEmployee());
        navigate('/employee-dashboard')
    }

    const renderContent = () => {
        if (isLoading && profileIsLoading) {
            return <div>Loading....</div>
        }

        if (isError && profileIsError) {
            return <div>Oops an error occured, try refreshing the page</div>
        }

        if (jobState && employeeInfoLoaded) {
            return (
                <div>
                    <div>
                        <EmployeeInfoInHeader employee={employee} jobState={jobState} />

                        <div className='response-buttons assign-check-btn'>
                            <PositiveActionButton onClick={handleAssignTask} text="Assign Task" />
                            <PositiveActionButton onClick={handleCheckPerformance} text="Check Perfomance" />
                        </div>

                    </div>

                    {
                        employeeProfile ? (
                            <div>
                                <DetailItem label="Phone Number" value={employee.phone_number} />
                                <DetailItem label="Email Address" value={employeeProfile.email} />
                                <DetailItem label="Account Number" value={employeeProfile.account_number} />
                                <DetailItem label="Home Address" value={employeeProfile.address} />
                                <DetailItem label="Citizenship" value={employeeProfile.citizenship} />
                                <DetailItem label="Date Of Birth" value={employeeProfile.dob} />
                                <DetailItem label="Gender" value={employeeProfile.gender} />
                                <DetailItem label="Marital Status" value={employeeProfile.marital_status} />
                                <DetailItem label="Next Of Kin" value={employeeProfile.next_of_kin} />
                                <DetailItem label="Next Of Kin's Contact details" value={employeeProfile.next_of_kin_phone_number} />
                                <DetailItem label="Race" value={employeeProfile.race} />
                                <DetailItem label="Criminal Record" value={employeeProfile.criminal_record} />
                                <DetailItem label="Health Information" value={employeeProfile.health_info} />
                            </div>
                        ) : (
                            <div>
                                <h1>This employee has not filled in their details yet 🙂</h1>
                            </div>
                        )
                    }
                    <PositiveActionButton onClick={handleNavigateBack} text="Back to dashboard" />
                </div>
            )
        }
        return null;
    }

    return (
        renderContent()
    )


}

export default ManageEmployeePage
