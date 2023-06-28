import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaThumbsUp } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify'
import {useNavigate} from  'react-router-dom';
import InputField from '../components/InputField';
import PositiveActionButton from '../components/Buttons/PositiveActionButton'


const EmployeeCompleteProfile = () => {

  const navigate = useNavigate()
  const { User } = useSelector((state) => state.auth)

  const [isError, setIsError] = useState(false)

  // Employee Profile variables
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [race, setRace] = useState('')
  const [citizenship, setCitizenship] = useState('')
  const [criminalRecord, setCriminalRecord] = useState('')
  const [nextOfKin, setNextOfKin] = useState('')
  const [nextOfKinPhoneNumber, setNextOfKinPhoneNumber] = useState('')
  const [homeAddress, sethomeAddress] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [healthInfo, setHealthInfo] = useState('');

  const handleSubmitInfo = async(e) => {
    e.preventDefault();
    const userEmail = User.email;
    let next_of_kin_name_without_spaces = nextOfKin.replace(/\s+/g, '');

    const employeeInfo = {
      email: userEmail,
      address: homeAddress,
      dob,
      next_of_kin:next_of_kin_name_without_spaces,
      next_of_kin_phone_number:nextOfKinPhoneNumber,
      marital_status:maritalStatus,
      account_number : accountNumber,
      health_info: healthInfo,
      criminal_record:criminalRecord,
      citizenship,
      gender,
      race
    }
    const res = await axios.post('/api/v1/employee/complete-employee-profile', employeeInfo).then(res => {
      navigate('/employee-dashboard');
      toast.success('Thank you for completing your profile information 🙂')
    }).catch(err => {
      setIsError(true)
      toast.error('An error occured')
    })
  }

  return (
    <div>
      <h1>We need some of your information</h1>

      <form action="">
        <InputField label="Date Of Birth" type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} />
        <div>
          <label htmlFor="gender">Gender</label>
          <select name="" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <InputField label="Citizenship" type="text" id="citizenship" value={citizenship} onChange={(e) => setCitizenship(e.target.value)} />

        <div>
          <label htmlFor="race">Race</label>
          <select id="race" value={race} onChange={(e) => setRace(e.target.value)}>
          <option value="">Select Race</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Asian">Asian</option>
            <option value="Latino">Latino</option>
          </select>
        </div>

        <div>
          <label htmlFor="criminalRecord">Do you have a criminal record</label>
          <select name="" id="criminalRecord" value={criminalRecord} onChange={(e) => setCriminalRecord(e.target.value)}>
          <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <InputField label="Full name of your next of Kin" type="text" id="nextOfKin" value={nextOfKin} onChange={(e) => setNextOfKin(e.target.value)} />

        <InputField label="Next of Kin's Phone Number" type="text" id="nextOfKinPhoneNumber" value={nextOfKinPhoneNumber} onChange={(e) => setNextOfKinPhoneNumber(e.target.value)} />

        <InputField label="Where do you reside ?" type="text" id="homeAddress" value={homeAddress} onChange={(e) => sethomeAddress(e.target.value)} />

        <div>
          <label htmlFor="maritalStatus">Marital Status</label>
          <select id="maritalStatus" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
          <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
            <option value="Domestic Union">Domestic union</option>
            <option value="Civil Union">Civil union</option>
          </select>
        </div>
        
        <InputField label="Account Number" type="text" id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />

        <div>
          <label htmlFor="healthInfo">Do you have any health problems ?</label>
          <textarea
            id="healthInfo"
            cols="30"
            rows="10"
            placeholder='Give us a brief description of your health problems'
            value={healthInfo}
            onChange={(e) => setHealthInfo(e.target.value)}></textarea>
        </div>

        <div>
            <PositiveActionButton onClick={handleSubmitInfo} text="Submit"/>
        </div>



      </form>
    </div>
  )
}

export default EmployeeCompleteProfile;
