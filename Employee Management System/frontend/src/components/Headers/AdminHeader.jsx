import React from 'react';
import { logoutUser } from '../../features/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa'

const AdminHeader = () => {
  const { User } = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    toast.success('Succesfully logged out 🙂')
  }
  return (
    <div className='header'>
      <div className='user-id-wrapper'>
        <FaUserCircle />
        <p className='user-id'>{User.email}</p>
      </div>
      <ul className='nav-list'>
        <Link className='nav-link' to='/admin-dashboard'><li>Dashboard</li></Link>
        <Link className='nav-link' to="/careers"><li>Hiring</li></Link>
        <Link className='nav-link' to="/all-candidates"><li>Candidates</li></Link>
        <Link className='nav-link' to="/all-leave-requests"><li>Leave Requests</li></Link>
        <li>
          <button className='auth-btn' 
            onClick={handleLogout}
          >Logout</button>
        </li>
      </ul>
    </div>
  )
}

export default AdminHeader;
