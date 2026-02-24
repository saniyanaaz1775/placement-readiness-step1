import React from 'react'

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border rounded-md p-5 ${className}`}>
      {children}
    </div>
  )
}

