import React from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const SearchNavBar = () => {
  const { User } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const navigateToPostVacancyPage = () => {
    navigate('/post-new-job');
  }

  return (
    <div>
      <div className='search-bar-container'>
        <div className='search-bar-wrapper'>
          <FaSearch className='search-icon'/>
          <input className='search-box' type="text" placeholder='Search for a job' ></input>
        </div>
        <div>
          <button className='auth-btn search-btn'>Search</button>
        </div>
      </div>

      {User.is_admin === 'true' ? (
        <div className='create-btn-wrapper'>
          <button className='auth-btn create-job-btn' onClick={navigateToPostVacancyPage}>
            Create Job <FaPlus />
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default SearchNavBar;
