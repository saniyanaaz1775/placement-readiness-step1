import React from 'react'

export default function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 border rounded-md shadow-none">
      <div className="flex items-center gap-4">
        <div className="text-primary">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-gray-600">{desc}</p>
    </div>
  )
}

