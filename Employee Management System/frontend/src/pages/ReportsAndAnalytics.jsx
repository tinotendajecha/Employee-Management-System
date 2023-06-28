import React from 'react';
import { useSelector } from 'react-redux';
import Tasks from '../components/Tasks';

const ReportsAndAnalytics = () => {
  const {employee} = useSelector((state) => state.employee)
  
  return (
    <div>
      <Tasks id={employee.id}/>
    </div>
  )
}

export default ReportsAndAnalytics
