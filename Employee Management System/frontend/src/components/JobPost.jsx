import { FaDollarSign, FaMapPin } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setJobId } from '../features/slices/JobApplicationSlice';
import PositiveActionButton from './Buttons/PositiveActionButton';


const JobPost = ({ job }) => {
    const { User } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navigateToLogin = () => {
        navigate('/employee-login')
    }

    const handleJobApplication = () => {
        // Setting the global variable jobId to keep track of the job we are applying
        let id = job.id;
        dispatch(setJobId(id));
        navigate('/job-information');
    }

    return (
        <div className='job-post'>
            <h1>{job.job_title}</h1>
            <p>{job.job_description}</p>
            <div className='job-info-wrapper'>

                <div>
                    <div className='info'>
                    <FaMapPin className='icon'/>
                        <span> {job.job_location}</span>
                    </div>
                    <div className='info'>
                        <FaDollarSign  className='icon'/>
                        <span>{job.job_salary}</span>
                    </div>
                </div>

                {
                    User.is_admin === 'false' ? (
                        <PositiveActionButton text="Apply" onClick={handleJobApplication} />
                    ) : null
                }
                {
                    !User.email ? (
                        <PositiveActionButton text="Login to apply" onClick={navigateToLogin} />
                    ) : null
                }
            </div>

        </div>
    )
}

export default JobPost
