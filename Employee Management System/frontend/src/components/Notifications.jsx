import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { FaClock, FaEnvelope } from 'react-icons/fa'

const Notifications = () => {
    const [notifications, setNotifications] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);



    useEffect(() => {
        const getAllNotifications = async () => {
            const res = await axios.get('/api/v1/employee/get-all-notifications').then(res => {
                setNotifications(res.data.notifications);
                setIsLoading(false)
            }).catch(err => {
                setIsError(true)
            })
        }
        getAllNotifications()
    }, [])

    console.log(notifications)
    const renderContent = () => {
        if (isLoading) {
            return <div>Employees loading...</div>
        }

        if (isError) {
            return <div>Whoops an error occured, try refreshing the page</div>
        }

        if (notifications) {
            return (
                <div>
                    <h1>Notifications</h1>

                    <div className='notification-container' >
                        {
                            notifications.map(notification => {
                                const date = new Date(notification.notificationPostedAt);
                                const time = date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div className='notification'>
                                        <div className='notification-info' key={notification.id}>
                                            <FaEnvelope className='icon' />
                                            <p className='notification-text'>{notification.notification}</p>
                                        </div>
                                        <div className='notification-time'>
                                            <FaClock className='icon'/>
                                            <span className='notification-time'>{time}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        }
    }

    return (
        renderContent()
    )


}

export default Notifications;
