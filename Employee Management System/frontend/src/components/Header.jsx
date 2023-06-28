import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminHeader from './Headers/AdminHeader';
import EmployeeHeader from './Headers/EmployeeHeader';
import myLogo from '../assets/management.png'

const Header = () => {
  const { User } = useSelector(state => state.auth);

  if (User.is_admin === "false") {
    return (
      <EmployeeHeader />
    )
  } else if (User.is_admin === "true") {
    return (
      <AdminHeader />
    )
  } else {
    return (
      <div>
        <nav className='header'>

          <div className='logo-wrapper'>
            <img src={myLogo} alt="" />
          </div>

          <ul className='nav-list'>
            <Link className='nav-link' to="/"><li>Home</li></Link>
            <Link className='nav-link' to="/careers"><li>Find Jobs</li></Link>
            <Link className='nav-link' to="/login-as"><span>Sign In</span></Link>
          </ul>
        </nav>
      </div>
    )
  }


}

export default Header;
