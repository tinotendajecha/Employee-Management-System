import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Pie } from 'react-chartjs-2';
import PositiveActionButton from './Buttons/PositiveActionButton';
import Chart from 'chart.js/auto';

// This component takes in an employee id as a prop and renders the employee's tasks

const Tasks = ({ id }) => {
  const { User } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [tasks, setTasks] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [taskUpdated, setTaskUpdated] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    async function getEmployeeTasks() {
      try {
        const res = await axios.get(`/api/v1/admin/get-task-by-employee-id/${id}`);
        const tasks = res.data.data.tasks;
        setTasks(tasks);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
      }
    }
    getEmployeeTasks();
  }, [taskUpdated, id]);

  const handleCompleteTask = async (taskId) => {
    const taskData = {
      id: taskId,
      status: 'completed',
    };
    try {
      await axios.patch(`/api/v1/admin/update-task-status`, taskData);
      toast.success('Thank you for completing this task 🙂');
      setTaskUpdated(!taskUpdated);
    } catch (error) {
      toast.error('Failed to mark task as complete');
    }
  };

  const destroyChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
      setChartInstance(null);
    }
  };

  const renderChart = () => {
    if (!chartRef.current || !tasks) {
      return;
    }
    destroyChart();
    const completedTasks = tasks.filter((task) => task.status === 'completed');
    const pendingTasks = tasks.filter((task) => task.status === 'pending');

    const data = {
      labels: ['Completed Tasks', 'Pending Tasks'],
      datasets: [
        {
          data: [completedTasks.length, pendingTasks.length],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };

    const newChartInstance = new Chart(chartRef.current, {
      type: 'pie',
      data: data,
    });
    setChartInstance(newChartInstance);
  };

  useEffect(() => {
    renderChart();
  }, [tasks]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div>
          <h1>Tasks are loading...</h1>
        </div>
      );
    }
    if (isError) {
      return (
        <div>
          <h1>Oops an error occurred, try refreshing the page</h1>
        </div>
      );
    }
    if (tasks && tasks.length === 0 && User.is_admin === 'false') {
      return (
        <div>
          <h1>You currently have no tasks assigned to you 🙂</h1>
        </div>
      );
    }
    if (tasks) {
      return (
        <div>
          {
            User.is_admin === 'true' ? (
              tasks.length > 0 ? (
                <h1>This employee's Tasks</h1>
              ) : null
            ) : null
          }
          {tasks.map((task) => {
            if (User.is_admin === 'false' && task.status !== 'pending') {
              return null; // skip rendering this task
            }
            return (
              <div key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>{task.deadline}</p>
                {User.is_admin === 'false' && (
                  <PositiveActionButton text="Mark complete" onClick={() => handleCompleteTask(task.id)} />
                )}
                {User.is_admin === 'true' && <p>{task.status}</p>}
              </div>
            );
          })}
          {tasks.length > 0 ? (
            <div>
              <h1>Tasks Overview</h1>
              <canvas ref={chartRef} />
            </div>
          ) : <h1>This employee has no tasks yet 🙂</h1>}
        </div>
      );
    }
    return null;
  };

  return renderContent();
};

export default Tasks;