import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HiredEmployeeHeader = ({handleLogout}) => {
    const User = useSelector(state => state.auth)
  return (
    <div className='header'>
            <p>{User.email}</p>
            <ul className='nav-list'>
              <Link className='nav-link' to='/employee-dashboard'><li>Dashboard</li></Link>
              <Link className='nav-link' to='/request-leave'><li>Request leave</li></Link>
              <li>
                <button className='auth-btn' onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
  )
}

export default HiredEmployeeHeader
