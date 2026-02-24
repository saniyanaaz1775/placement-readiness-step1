import React, { useEffect, useState } from 'react'
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

  // Analysis state
  const [jdText, setJdText] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const STORAGE_KEY = 'prp_history_v1'

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load history', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (e) {
      console.error('Failed to save history', e)
    }
  }, [history])

  // Skill categories and keywords (case-insensitive)
  const SKILL_CATEGORIES = {
    'Core CS': ['dsa', 'oop', 'dbms', 'os', 'networks'],
    Languages: ['java', 'python', 'javascript', 'typescript', 'c\\+\\+', 'c#', '\\bc\\b', 'go'],
    Web: ['react', 'next.js', 'nextjs', 'node.js', 'node', 'express', 'rest', 'graphql'],
    Data: ['sql', 'mongodb', 'postgresql', 'mysql', 'redis'],
    'Cloud/DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'ci cd', 'linux'],
    Testing: ['selenium', 'cypress', 'playwright', 'junit', 'pytest']
  }

  function extractSkills(text) {
    const found = {}
    const lower = (text || '').toLowerCase()
    Object.keys(SKILL_CATEGORIES).forEach((cat) => {
      const kws = SKILL_CATEGORIES[cat]
      const matches = []
      kws.forEach((kw) => {
        const re = new RegExp(`\\b${kw}\\b`, 'i')
        if (re.test(text)) matches.push(kw.replace(/\\\\/g, '').replace(/\\b/g, ''))
      })
      if (matches.length) found[cat] = Array.from(new Set(matches))
    })
    if (Object.keys(found).length === 0) {
      found['General'] = ['General fresher stack']
    }
    return found
  }

  function generateChecklist(skills) {
    // Template-based items; include conditional items based on detected skills
    const rounds = {
      'Round 1: Aptitude / Basics': [
        'Quantitative aptitude practice (time-bound)',
        'Logical reasoning drills',
        'Basic programming syntax review',
        'Data types and complexity basics',
        'Basic SQL queries'
      ],
      'Round 2: DSA + Core CS': [
        'Array & String problems (easy → medium)',
        'Linked Lists and Trees fundamentals',
        'Algorithm complexity and optimization',
        'OS/DBMS conceptual review',
        'Implement common data structures'
      ],
      'Round 3: Tech interview (projects + stack)': [
        'Project walkthrough preparation',
        'Explain architecture and trade-offs',
        'Stack-specific deep-dive (APIs, frameworks)',
        'Build small demo or reproducible example',
        'System design basics for given role'
      ],
      'Round 4: Managerial / HR': [
        'Behavioral questions and STAR stories',
        'Mock HR rounds',
        'Salary & offer negotiation basics',
        'Company research and role expectations',
        'Resume and LinkedIn alignment'
      ]
    }

    // Customize checklist items depending on presence of categories
    const has = (cat) => skills[cat] && skills[cat].length > 0

    if (has('Web')) {
      rounds['Round 3: Tech interview (projects + stack)'].push('Frontend deep-dive: React hooks, state management')
    }
    if (has('Data') || has('Core CS')) {
      rounds['Round 2: DSA + Core CS'].push('Database indexing and query optimization')
    }
    if (has('Cloud/DevOps')) {
      rounds['Round 3: Tech interview (projects + stack)'].push('Deployment & CI/CD pipeline overview')
    }

    return rounds
  }

  function generatePlan(skills) {
    const plan = [
      { day: 1, title: 'Basics & Core CS' },
      { day: 2, title: 'Basics & Core CS' },
      { day: 3, title: 'DSA & Coding Practice' },
      { day: 4, title: 'DSA & Coding Practice' },
      { day: 5, title: 'Project & Resume Alignment' },
      { day: 6, title: 'Mock Interviews' },
      { day: 7, title: 'Revision & Weak Areas' }
    ]
    // adapt
    if (skills.Web) {
      plan[4].title = 'Project & Frontend alignment (React)'
      plan[5].title = 'Mock Interviews (Frontend focus)'
    }
    if (skills['Cloud/DevOps']) {
      plan[5].title = 'Mock Interviews (Deployment + DevOps)'
    }
    return plan
  }

  function generateQuestions(skills) {
    const qs = []
    const add = (q) => qs.push(q)
    if (skills.Data) {
      if (skills.Data.some((s) => /sql|postgresql|mysql/i.test(s))) {
        add('Explain indexing and when it helps in SQL databases.')
      }
      if (skills.Data.some((s) => /mongodb/i.test(s))) {
        add('Explain differences between SQL and MongoDB and when to choose each.')
      }
    }
    if (skills.Web) {
      if (skills.Web.some((s) => /react/i.test(s))) {
        add('Explain state management options in React and trade-offs (Context, Redux, Zustand, Recoil).')
      }
      if (skills.Web.some((s) => /graphql/i.test(s))) {
        add('How does GraphQL differ from REST and what are pros/cons?')
      }
    }
    if (skills['Core CS']) {
      add('How would you optimize search in sorted data? Discuss time and space trade-offs.')
      add('Explain common sorting algorithms and when to use each.')
    }
    if (skills['Cloud/DevOps']) {
      add('Describe Docker vs VM and when to use containerization.')
      add('Explain basics of Kubernetes and how it helps with scaling.')
    }
    if (skills.Languages) {
      if (skills.Languages.some((s) => /python/i.test(s))) {
        add('How do you manage dependencies and virtual environments in Python projects?')
      }
      if (skills.Languages.some((s) => /java/i.test(s))) {
        add('Explain the Java memory model and common performance pitfalls.')
      }
    }
    // fill to 10 with generic but specific prompts
    const fillers = [
      'Describe a time you had to debug a difficult production issue.',
      'Explain how you would design a URL shortening service.',
      'How do you ensure code quality in a team?'
    ]
    for (const f of fillers) add(f)
    return qs.slice(0, 10)
  }

  function calculateReadiness(skills, companyName, roleName, jd) {
    let score = 35
    const categoriesPresent = Object.keys(skills).length
    score += Math.min(categoriesPresent * 5, 30)
    if (companyName && companyName.trim()) score += 10
    if (roleName && roleName.trim()) score += 10
    if ((jd || '').length > 800) score += 10
    return Math.min(score, 100)
  }

  function analyze() {
    const extracted = extractSkills(jdText)
    const checklist = generateChecklist(extracted)
    const plan = generatePlan(extracted)
    const questions = generateQuestions(extracted)
    const score = calculateReadiness(extracted, company, role, jdText)

    const entry = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      company,
      role,
      jdText,
      extractedSkills: extracted,
      plan,
      checklist,
      questions,
      readinessScore: score
    }

    setResult(entry)
    setHistory((h) => [entry, ...h])
    setSelectedId(entry.id)
    // persist handled by effect
  }

  function loadHistoryItem(id) {
    const item = history.find((h) => h.id === id)
    if (item) {
      setResult(item)
      setSelectedId(item.id)
    }
  }

  function clearHistory() {
    setHistory([])
    setResult(null)
    setSelectedId(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Analysis input + results (full width) */}
      <div className="md:col-span-2">
        <Card className="mb-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <input
                  placeholder="Company (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="border rounded-md px-3 py-2 w-1/2 mr-2"
                />
                <input
                  placeholder="Role (optional)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border rounded-md px-3 py-2 w-1/2"
                />
              </div>

              <textarea
                placeholder="Paste the job description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={6}
                className="mt-4 w-full border rounded-md p-3"
              />

              <div className="flex gap-3 mt-3">
                <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={analyze}>
                  Analyze
                </button>
                <button
                  className="px-4 py-2 border rounded-md"
                  onClick={() => {
                    setJdText('')
                    setCompany('')
                    setRole('')
                  }}
                >
                  Clear
                </button>
                <button className="px-4 py-2 border rounded-md" onClick={clearHistory}>
                  Clear History
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <h4 className="font-semibold">History</h4>
              <div className="mt-3 space-y-2 max-h-56 overflow-auto">
                {history.length === 0 && <div className="text-sm text-gray-500">No history yet.</div>}
                {history.map((h) => (
                  <div
                    key={h.id}
                    className={`p-2 border rounded-md cursor-pointer ${selectedId === h.id ? 'bg-gray-100' : 'bg-white'}`}
                    onClick={() => loadHistoryItem(h.id)}
                  >
                    <div className="text-sm font-medium">{h.company || 'Unknown Company'}</div>
                    <div className="text-xs text-gray-500">{h.role || '(no role)'} • {new Date(h.createdAt).toLocaleString()}</div>
                    <div className="text-xs text-gray-700 mt-1">Score: {h.readinessScore}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Result display */}
          {result && (
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{result.role || 'Role'}</div>
                  <div className="text-sm text-gray-500">{result.company}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{result.readinessScore}</div>
                  <div className="text-xs text-gray-500">Readiness Score</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <h5 className="font-semibold">Key skills</h5>
                  {Object.keys(result.extractedSkills).map((cat) => (
                    <div key={cat} className="mt-2">
                      <div className="text-sm font-medium">{cat}</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {result.extractedSkills[cat].map((s) => (
                          <span key={s} className="text-xs px-2 py-1 bg-gray-100 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="md:col-span-1">
                  <h5 className="font-semibold">7-day plan</h5>
                  <ol className="mt-2 list-decimal list-inside text-sm">
                    {result.plan.map((p) => (
                      <li key={p.day} className="mb-1">{p.title}</li>
                    ))}
                  </ol>
                </div>

                <div className="md:col-span-1">
                  <h5 className="font-semibold">Top Questions</h5>
                  <ol className="mt-2 list-decimal list-inside text-sm space-y-1">
                    {result.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="font-semibold">Round-wise checklist</h5>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(result.checklist).map((r) => (
                    <div key={r}>
                      <div className="font-medium">{r}</div>
                      <ul className="list-disc list-inside text-sm mt-2">
                        {result.checklist[r].map((it, idx) => (
                          <li key={idx}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
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

