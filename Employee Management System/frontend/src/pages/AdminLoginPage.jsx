import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginAdminMutation } from "../features/API slices/userApiSlice";
import { setUserCredentials } from "../features/slices/AuthSlice";
import { toast } from 'react-toastify';
import PositiveActionButton from "../components/Buttons/PositiveActionButton";
import InputField from "../components/InputField";
import { Link } from "react-router-dom";

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginAdmin, { isLoading, isError }] = useLoginAdminMutation();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const userData = {
        email,
        password
      }
      const res = await loginAdmin(userData).unwrap();
      const fetchedUser = res.data.user
      if (fetchedUser.is_admin === "false") {
        toast.error("Account does not belong to an admin. Login as employee instead 🧐");
        navigate('/employee-login')
        return;
      }
      dispatch(setUserCredentials(fetchedUser));
      navigate('/admin-dashboard');
      toast.success(`Hey ${fetchedUser.username}, welcome 🤩`);
    } catch (err) {
      toast.error(err.data.error)
    }

  }
  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form>
        <InputField label="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="auth-btn-wrapper">
          <button onClick={handleLogin} className="auth-btn">Login</button>
        </div>
        <div className="prompt-wrapper">
          <p>Don't have an account ? </p>
          <Link className="link" to='/admin-register'>Sign Up</Link>
        </div>
      </form>
    </div>
  )
}

export default AdminLoginPage
