import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const { User } = useSelector(state => state.auth );
  return User ? <Outlet /> : <Navigate to='/login-as' replace />
}

export default PrivateRoutes;
