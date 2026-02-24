// Simple keyword-based skill extractor and planner generator
const CATEGORIES = {
  core: ['DSA','OOP','DBMS','OS','Networks'],
  languages: ['Java','Python','JavaScript','TypeScript','C','C++','C#','Go'],
  web: ['React','Next.js','Node.js','Express','REST','GraphQL'],
  data: ['SQL','MongoDB','PostgreSQL','MySQL','Redis'],
  cloud: ['AWS','Azure','GCP','Docker','Kubernetes','CI/CD','Linux'],
  testing: ['Selenium','Cypress','Playwright','JUnit','PyTest']
}

function findKeywords(text) {
  const found = {}
  const lower = text.toLowerCase()
  Object.entries(CATEGORIES).forEach(([cat, arr]) => {
    found[cat] = []
    arr.forEach((kw) => {
      const plain = kw.toLowerCase().replace('.', '\\.')
      const re = new RegExp(`\\b${plain}\\b`, 'i')
      if (re.test(text)) {
        found[cat].push(kw)
      }
    })
  })
  return found
}

function anyDetected(found) {
  return Object.values(found).some((arr) => arr.length > 0)
}

function extractSkills(jdText) {
  const found = findKeywords(jdText)
  let skills = {}
  Object.keys(found).forEach((k) => {
    if (found[k].length) skills[k] = Array.from(new Set(found[k]))
  })
  if (Object.keys(skills).length === 0) {
    skills['general'] = ['General fresher stack']
  }
  return skills
}

function makeChecklist(skills) {
  // Template items per category
  const templates = {
    core: [
      'Review data structures fundamentals',
      'Practice basic algorithms (sorting/searching)',
      'Study OOP concepts and design patterns',
      'Revise operating systems basics',
      'Brush up on networking fundamentals'
    ],
    languages: [
      'Write small projects in preferred language',
      'Practice language-specific interview questions',
      'Master common libraries and toolchains',
      'Debugging and performance tips',
      'Understand package & dependency management'
    ],
    web: [
      'Review component architecture (React)',
      'Understand server-side rendering (Next.js)',
      'API design: REST vs GraphQL',
      'Authentication and state management',
      'Deploy a small web service (Node/Express)'
    ],
    data: [
      'Practice SQL queries and joins',
      'Indexing and query optimization',
      'Understand NoSQL basics (MongoDB)',
      'Data modeling and transactions',
      'Backup and replication fundamentals'
    ],
    cloud: [
      'Basics of cloud providers (AWS/GCP/Azure)',
      'Containerization with Docker',
      'Orchestration basics with Kubernetes',
      'CI/CD pipelines overview',
      'Linux command-line proficiency'
    ],
    testing: [
      'Write unit tests for core modules',
      'Practice end-to-end testing basics',
      'Familiarize with test runners (JUnit, PyTest)',
      'Use testing tools (Selenium/Cypress)',
      'Mocking and test doubles'
    ],
    general: [
      'Brush up on basic programming concepts',
      'Practice simple coding problems',
      'Prepare a clean resume',
      'Do mock interviews with peers',
      'Review common HR questions'
    ]
  }

  const rounds = {
    'Round 1: Aptitude / Basics': [],
    'Round 2: DSA + Core CS': [],
    'Round 3: Tech interview (projects + stack)': [],
    'Round 4: Managerial / HR': []
  }

  // Fill each round with items based on detected skills
  const cats = Object.keys(skills)
  // Round 1 generic items
  rounds['Round 1: Aptitude / Basics'] = [
    'Basic math & logical reasoning',
    'Time management for problem solving',
    'Simple coding exercises (arrays/strings)'
  ].concat(templates.general.slice(0,2))

  // Round 2: core + languages + data
  cats.forEach((cat) => {
    if (['core','languages','data'].includes(cat)) {
      rounds['Round 2: DSA + Core CS'].push(...templates[cat].slice(0,3))
    }
  })

  if (skills.web) {
    rounds['Round 3: Tech interview (projects + stack)'].push(...templates.web.slice(0,3))
  }
  if (skills.cloud) {
    rounds['Round 3: Tech interview (projects + stack)'].push(...templates.cloud.slice(0,2))
  }
  if (skills.testing) {
    rounds['Round 3: Tech interview (projects + stack)'].push(...templates.testing.slice(0,2))
  }

  // Ensure at least 5 items in rounds 2 and 3
  Object.keys(rounds).forEach((r) => {
    if (rounds[r].length < 5) {
      // push general items to reach 5
      rounds[r] = rounds[r].concat(templates.general).slice(0, Math.max(5, rounds[r].length))
    }
  })

  return rounds
}

function makePlan(skills) {
  const base = [
    { day: 1, title: 'Basics & core CS' },
    { day: 2, title: 'Basics & core CS' },
    { day: 3, title: 'DSA & coding practice' },
    { day: 4, title: 'DSA & coding practice' },
    { day: 5, title: 'Project & resume alignment' },
    { day: 6, title: 'Mock interviews' },
    { day: 7, title: 'Revision & weak areas' }
  ]
  // adapt for detected skills
  if (skills.web) {
    base[4].title = 'Project: frontend + resume alignment'
    base[5].title = 'Mock interviews (frontend focus)'
  }
  if (skills.data) {
    base[3].title = 'DSA + Database practice'
  }
  if (skills.cloud) {
    base[5].title += ' + deployment review'
  }
  return base
}

function makeQuestions(skills) {
  const qs = []
  if (skills.data) {
    qs.push('Explain indexing and when it helps.')
    qs.push('How do transactions work in relational databases?')
  }
  if (skills.web) {
    qs.push('Explain state management options in React and trade-offs.')
    qs.push('How does server-side rendering differ from client-side rendering?')
  }
  if (skills.core) {
    qs.push('How would you optimize search in sorted data?')
    qs.push('Explain object-oriented principles and give examples.')
  }
  if (skills.languages && skills.languages.includes('Python')) {
    qs.push('What are common Python performance pitfalls?')
  }
  if (skills.cloud) {
    qs.push('How would you design a simple scalable service on AWS?')
  }
  if (skills.testing) {
    qs.push('How do you design end-to-end tests for a web application?')
  }
  // Ensure 10 questions
  while (qs.length < 10) {
    qs.push('Describe a time you solved a hard bug and how you approached it.')
  }
  return qs.slice(0,10)
}

function readinessScore({ skills, company, role, jdText }) {
  let score = 35
  const categories = Object.keys(skills)
  score += Math.min(6, categories.length) * 5 // +5 per category up to 6 categories (max +30)
  if (company) score += 10
  if (role) score += 10
  if ((jdText || '').length > 800) score += 10
  return Math.min(100, score)
}

export function analyzeJob({ company = '', role = '', jdText = '' }) {
  const skills = extractSkills(jdText)
  const checklist = makeChecklist(skills)
  const plan = makePlan(skills)
  const questions = makeQuestions(skills)
  const score = readinessScore({ skills, company, role, jdText })
  return { skills, checklist, plan, questions, score }
}

export function saveEntry(entry) {
  const key = 'prp_history'
  const raw = localStorage.getItem(key)
  const arr = raw ? JSON.parse(raw) : []
  arr.unshift(entry)
  localStorage.setItem(key, JSON.stringify(arr))
}

export function loadHistory() {
  const key = 'prp_history'
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : []
}

export function loadEntryById(id) {
  const h = loadHistory()
  return h.find((e) => e.id === id)
}

