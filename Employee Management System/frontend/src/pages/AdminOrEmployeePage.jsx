import React from 'react';
import { Link } from 'react-router-dom';
import { } from 'react-icons/fa'

const AdminOrEmployeePage = () => {
  return (
    <div className='choice-wrapper'>
      <ul className='choice-list'>
        <Link className='choice-card' to="/admin-login"><li>Login As Admin</li></Link>
        <Link className='choice-card' to="/employee-login"><li >Login As Employee</li></Link>
      </ul>
    </div>
  )
}

export default AdminOrEmployeePage;
