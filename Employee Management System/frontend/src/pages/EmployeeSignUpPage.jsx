import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserCredentials } from '../features/slices/AuthSlice';
import { useRegisterEmployeeMutation } from '../features/API slices/userApiSlice';
import InputField from '../components/InputField';
import PositiveActionButton from '../components/Buttons/PositiveActionButton';


const EmployeeSignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerEmployee, { isLoading, isError }] = useRegisterEmployeeMutation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (password === confirmPassword) {
      try {
        const res = await registerEmployee({
          email,
          password,
          username
        }).unwrap();
        const createdUser = res.user;
        if (createdUser) {
          dispatch(setUserCredentials(createdUser))
          navigate("/employee-dashboard")
        }

      } catch (err) {
        toast.error(err.data.error)
      }
    } else {
      toast.error('Passwords do not match 🤔')
    }



  }
  return (
    <div className="auth-page">
      <h1>Sign Up</h1>
      <form>
        <InputField label="Username" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

        <InputField label="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <InputField label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <InputField label="Confirm Password" type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <div className="auth-btn-wrapper">
          <button onClick={handleRegister} className="auth-btn">Sign Up</button>
        </div>
        <div className="prompt-wrapper">
          <p>Already have an account ? </p>
          <Link className="link" to='/employee-login'>Login</Link>
        </div>
      </form>
    </div>
  )
}

export default EmployeeSignUpPage;
