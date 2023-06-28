import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'

const CandidateHeader = ({ handleLogout }) => {
  const { User } = useSelector(state => state.auth)
  return (
    <div className='header'>
      <div className='user-id-wrapper'>
        <FaUserCircle />
        <p className='user-id'>{User.email}</p>
      </div>
      <ul className='nav-list'>
        <Link className='nav-link' to='/employee-dashboard'><li>My Job Applications</li></Link>
        <Link className='nav-link' to='/careers'><li>Search for Jobs</li></Link>
        <li>
          <button className='auth-btn' onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  )
}

export default CandidateHeader;
