import React from 'react';
import { FaUserCircle, FaCalendarAlt } from 'react-icons/fa';

const EmployeeInfoInHeader = ({ employee, jobState }) => {
    return (
        <div>
            <div className='employee-info'>
                <FaUserCircle className='icon employee-icon' />
                <h1 className='employee-name'>{employee.first_name} {employee.last_name}</h1>
            </div>
            
            <div className='title-date-wrapper'>
            <p className='job-title'> {jobState.job_title}</p>
                <FaCalendarAlt />
                <span>Started on {employee.hire_date}</span>
            </div>
        </div>
    )
}

export default EmployeeInfoInHeader;
