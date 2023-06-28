import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import InputField from '../components/InputField';
import PositiveActionButton from '../components/Buttons/PositiveActionButton';



const PostNewJobPage = () => {
    const { User } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [jobSalary, setJobSalary] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const userId = User.id;


    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [departments, setDepartments] = useState(null)

    useEffect(() => {
        // get all the departments from the database
        const fetchDepartments = async () => {
            const res = await axios.get('/api/v1/admin/all-departments').then(res => {
                const departments = res.data.data.departments;
                setDepartments(departments)
                setIsLoading(false)
            }).catch(err => {
                setIsError(true)
            })
        }
        fetchDepartments()
    }, [])

    const navigateBack = () => {
        navigate('/careers')
    }
    const createJobVacancy = async(e) => {
        e.preventDefault();
        if (jobTitle === "" || jobDescription === "" || jobLocation === "" || jobSalary === "" || departmentId === "" || userId === "") {
            toast.error("Please fill in all the job fields 😑");
            return;
        }
        // Validate salary field
        if (isNaN(parseFloat(jobSalary))) {
            // Display error message or perform error handling
            toast.error('Invalid salary input. Please enter a number 😑')
            return;
        }

        const jobData = {
            job_title:jobTitle,
            job_description:jobDescription,
            job_location:jobLocation,
            job_salary:jobSalary,
            department_id : parseInt(departmentId),
            job_posted_by:userId
        }
        
        const res = await axios.post('/api/v1/admin/jobs/post-job', jobData).then(res => {
            toast.success('Vacancy posted succesfully 🙂');
            navigate('/careers');
        }).catch(err => {
            toast.error(`${err.data} 😶`);
            console.log(err)
        })

    }
    return (
        <div>
            <form>
                <h1>Open Job Vacancy</h1>

                <InputField label="Job Title" type="text" id="job_title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                <div>
                    <label htmlFor="job_description">Job Description</label>
                    <textarea
                        placeholder='Job responsibilities'
                        id='job_description'
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>
                </div>

                <InputField label="Job Location" type="text" id="job_location" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} />
                
                <InputField label="Job Salary" type="text" id="job_salary" value={jobSalary} onChange={(e) => setJobSalary(e.target.value)} />
                <div>
                    <label htmlFor="job_department">Job Department</label>
                    <select name="" id="" onChange={(e) => setDepartmentId(e.target.value)}>
                        <option value={null}>--Select department--</option>
                        {isLoading ? (
                            <option value="">Departments loading...</option>
                        ) : (
                            departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.department_name}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                <div>
                    <PositiveActionButton onClick={createJobVacancy} text="Create Job"/>
                    <PositiveActionButton onClick={navigateBack} text="Go Back To Job Vacancies"/>
                </div>
            </form>
        </div>
    )
}

export default PostNewJobPage;
