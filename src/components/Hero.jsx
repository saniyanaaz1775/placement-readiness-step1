import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="mt-8 bg-gradient-to-b from-white to-white">
      <div className="max-w-4xl mx-auto text-center py-20 px-6">
        <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 leading-tight">Ace Your Placement</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">Practice, assess, and prepare for your dream job</p>
        <div className="mt-8">
          <Link to="/dashboard" className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-md hover:brightness-95 transition">
            Get Started
          </Link>
        </div>
      </div>
    </section>
  )
}

