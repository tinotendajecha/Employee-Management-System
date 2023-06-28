import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App';

import store from './app/store';
import { Provider } from 'react-redux';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { toast } from 'react-toastify';

// Pages in the application
import LandingPage from './pages/LandingPage';
import AdminOrEmployeePage from './pages/AdminOrEmployeePage';
import JobPostsPage from './pages/JobPostsPage';
import FeaturesPage from './pages/FeaturesPage';
import EmployeeSignUpPage from './pages/EmployeeSignUpPage';
import AdminLoginPage from './pages/AdminLoginPage';
import EmployeeLoginPage from './pages/EmployeeLoginPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PostNewJobPage from './pages/PostNewJobPage';
import PrivateRoutes from './components/PrivateRoutes';
import SingleJobPostPage from './pages/SingleJobPostPage';
import EmployeesPage from './pages/EmployeesPage';
import CandidatesPage from './pages/CandidatesPage';
import ReportsAndAnalytics from './pages/ReportsAndAnalytics';
import EmployeeCompleteProfile from './pages/EmployeeCompleteProfile';
import ManageEmployeePage from './pages/ManageEmployeePage';
import RequestLeavePage from './pages/RequestLeavePage';
import AllLeaveRequests from './pages/AllLeaveRequests';
import CreateTaskPage from './pages/CreateTaskPage';
import AdminRegister from './pages/AdminRegister';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' Component={LandingPage} />
      <Route path='/login-as' Component={AdminOrEmployeePage} />
      <Route path='/careers' Component={JobPostsPage} />
      <Route path='/app-features' Component={FeaturesPage} />
      <Route path='/sign-up' Component={EmployeeSignUpPage} />
      <Route path='/admin-login' Component={AdminLoginPage} />
      <Route path='/employee-login' Component={EmployeeLoginPage} />
      {/* All private routes here */}
      <Route path='/' element={<PrivateRoutes />}>
        <Route path='/employee-dashboard' Component={EmployeeDashboardPage} />
        <Route path='/admin-dashboard' Component={AdminDashboardPage} />
        <Route path='/post-new-job' Component={PostNewJobPage}/>
        <Route path='/job-information' Component={SingleJobPostPage} />
        <Route path='/all-employees' Component={EmployeesPage} />
        <Route path='/all-candidates' Component={CandidatesPage} />
        <Route path='/reports-and-analytics' Component={ReportsAndAnalytics} />
        <Route path='/complete-my-profile' Component={EmployeeCompleteProfile} />
        <Route path='/manage-employee' Component={ManageEmployeePage} />
        <Route path='/request-leave' Component={RequestLeavePage} />
        <Route path='/all-leave-requests' Component={AllLeaveRequests}/>
        <Route path='/assign-new-task' Component={CreateTaskPage} />
        <Route path='/admin-register' Component={AdminRegister} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)
