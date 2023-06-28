import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setJobsAction } from '../features/slices/JobsSlice';
import JobPost from '../components/JobPost';
import SearchNavBar from '../components/SearchNavBar';

const JobPostsPage = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [jobs, setJobs] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobs = async() => {
      const res = await axios.get('/api/v1/admin/jobs/all-jobs').then(res => {
        const jobs = res.data.data.jobs
        setIsLoading(false);
        setJobs(jobs);
        //Setting our jobs global variable
        dispatch(setJobsAction(jobs))
      }).catch(err => {
        setIsError(true)
      })
    }
    fetchJobs()
  }, [])
  
  
  

  const renderContent = () => {
    if(isLoading){
      return <div>Job vacancies loading...</div>
    }

    if(isError){
      return <div>whoops...Error loading job vacancies </div>
    }

    if(jobs){
      return (
        <div className='posts'>
          {
            jobs.map((job) => <JobPost key={job.id} job={job} />)
          }
        </div>
      )
    }
    return null;
  }

  return (

    <div>
      <SearchNavBar />
      {renderContent()}
    </div>
  )
  
}

export default JobPostsPage;
