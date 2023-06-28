import React from 'react'

const NegativeActionButton = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

export default NegativeActionButton;
