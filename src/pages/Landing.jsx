import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import { Code, Video, BarChart2 } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="text-xl font-serif text-gray-900">Placement Readiness</div>
        <nav className="space-x-4">
          <Link to="/dashboard" className="text-sm text-gray-600">Dashboard</Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <Hero />

        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FeatureCard icon={<Code size={28} />} title="Practice Problems" desc="Solve curated problems with instant feedback." />
          <FeatureCard icon={<Video size={28} />} title="Mock Interviews" desc="Live and recorded mock interviews with feedback." />
          <FeatureCard icon={<BarChart2 size={28} />} title="Track Progress" desc="Visualize your improvement over time." />
        </section>
      </main>

      <footer className="border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

