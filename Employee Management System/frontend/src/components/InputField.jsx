import React from 'react'

const InputField = ({label, type, value, onChange, id}) => {
  return (
    <div className='input-wrapper'>
      <label className='label' htmlFor={id}>{label}</label>
      <input 
      className='text-box'
        id={id}
        type={type} 
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default InputField
