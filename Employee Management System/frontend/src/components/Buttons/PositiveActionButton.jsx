import React from 'react'

const PositiveActionButton = ({text, onClick}) => {
  return (
    <button onClick={onClick} className='positive-action-btn'>{text}</button>
  )
}

export default PositiveActionButton;
