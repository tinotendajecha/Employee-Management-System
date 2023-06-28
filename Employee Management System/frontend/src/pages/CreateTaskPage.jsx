import React, { useState } from 'react';
import InputField from '../components/InputField';
import PositiveActionButton from '../components/Buttons/PositiveActionButton';
import { useSelector } from 'react-redux';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'

const CreateTaskPage = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const { User } = useSelector((state) => state.auth)
  const { employee } = useSelector((state) => state.employee)

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if(title === "" || description == "" || deadline == ""){
      toast.error('Please in all the fields');
      return
    } 
    const taskData = {
      title,
      description,
      deadline,
      managerId : User.id,
      employeeId : employee.id
    }
    const res = await axios.post('/api/v1/admin/create-task' , taskData).then(res => {
      toast.success('Task assigned succesfully 🤝');
      navigate('/manage-employee')
    })
  }

  return (
    <div>
      <h1>Assign New Task</h1>
      <form>
        <InputField label="Title" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className='text-area-field'>
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <InputField label="Deadline" type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

        <div>
          <PositiveActionButton onClick={handleCreateTask} text="Create Task" />
        </div>
      </form>
    </div>
  )
}

export default CreateTaskPage;