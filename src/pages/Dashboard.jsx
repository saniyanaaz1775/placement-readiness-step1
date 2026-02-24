import React from 'react'
import Card from '../components/Card'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const radarData = [
  { subject: 'DSA', A: 75 },
  { subject: 'System Design', A: 60 },
  { subject: 'Communication', A: 80 },
  { subject: 'Resume', A: 85 },
  { subject: 'Aptitude', A: 70 }
]

function CircularProgress({ value = 72, size = 140 }) {
  const radius = 54
  const stroke = 10
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          stroke="#eee"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="circle-progress"
          stroke="#6b21a8"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 800ms ease-in-out' }}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="mt-3 text-center">
        <div className="text-3xl font-semibold">{value}</div>
        <div className="text-sm text-gray-600">Readiness Score</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const lastTopic = { title: 'Dynamic Programming', completed: 3, total: 10 }
  const weekly = { solved: 12, target: 20, activeDays: ['Mon', 'Tue', 'Thu', 'Sat'] }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4">Overall Readiness</h3>
        <div className="flex items-center justify-center">
          <CircularProgress value={72} />
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Skill Breakdown</h3>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Skills" dataKey="A" stroke="#6b21a8" fill="#6b21a8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-3">Continue Practice</h3>
        <div className="mb-3">
          <div className="text-sm text-gray-700 font-medium">{lastTopic.title}</div>
          <div className="text-xs text-gray-500">{`${lastTopic.completed}/${lastTopic.total} completed`}</div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-3 bg-primary"
            style={{ width: `${(lastTopic.completed / lastTopic.total) * 100}%` }}
          />
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-md">Continue</button>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-3">Weekly Goals</h3>
        <div className="text-sm text-gray-700 mb-2">Problems Solved: {weekly.solved}/{weekly.target} this week</div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
          <div className="h-3 bg-primary" style={{ width: `${(weekly.solved / weekly.target) * 100}%` }} />
        </div>

        <div className="flex items-center gap-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => {
            const active = weekly.activeDays.includes(d)
            return (
              <div key={d} className="flex flex-col items-center text-xs">
                <div className={`w-8 h-8 rounded-full ${active ? 'bg-primary' : 'bg-gray-200'}`} />
                <div className="mt-1">{d.slice(0,3)}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-3">Upcoming Assessments</h3>
        <ul className="space-y-3">
          <li>
            <div className="font-medium">DSA Mock Test</div>
            <div className="text-sm text-gray-500">Tomorrow, 10:00 AM</div>
          </li>
          <li>
            <div className="font-medium">System Design Review</div>
            <div className="text-sm text-gray-500">Wed, 2:00 PM</div>
          </li>
          <li>
            <div className="font-medium">HR Interview Prep</div>
            <div className="text-sm text-gray-500">Friday, 11:00 AM</div>
          </li>
        </ul>
      </Card>
    </div>
  )
}

