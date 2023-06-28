import React from 'react'

const DetailItem = ({label, value}) => {
  return (
    <div className='detail-item'>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

export default DetailItem;

