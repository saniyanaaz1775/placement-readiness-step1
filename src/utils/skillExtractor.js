const STORAGE_KEY = 'prp_history_v1'

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('loadHistory error', e)
    return []
  }
}

export function loadHistoryWithStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [], corrupted: 0 }
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return { entries: [], corrupted: 1 }
    const entries = []
    let corrupted = 0
    arr.forEach((it) => {
      if (it && it.id && it.createdAt && typeof it.jdText === 'string') {
        entries.push(it)
      } else {
        corrupted += 1
      }
    })
    return { entries, corrupted }
  } catch (e) {
    console.error('loadHistoryWithStats error', e)
    return { entries: [], corrupted: 1 }
  }
}

export function loadEntryById(id) {
  const h = loadHistory()
  return h.find((it) => it.id === id) || null
}

export function saveOrUpdateEntry(entry) {
  try {
    const arr = loadHistory()
    const idx = arr.findIndex((e) => e.id === entry.id)
    if (idx >= 0) {
      arr[idx] = entry
    } else {
      arr.unshift(entry)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  } catch (e) {
    console.error('saveOrUpdateEntry error', e)
  }
}

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
  Object.entries(CATEGORIES).forEach(([cat, arr]) => {
    found[cat] = []
    arr.forEach((kw) => {
      const plain = kw.replace('.', '\\.')
      const re = new RegExp(`\\b${plain}\\b`, 'i')
      if (re.test(text || '')) {
        found[cat].push(kw)
      }
    })
  })
  return found
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

  const cats = Object.keys(skills)
  rounds['Round 1: Aptitude / Basics'] = [
    'Basic math & logical reasoning',
    'Time management for problem solving',
    'Simple coding exercises (arrays/strings)'
  ].concat(templates.general.slice(0,2))

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

  Object.keys(rounds).forEach((r) => {
    if (rounds[r].length < 5) {
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
  while (qs.length < 10) {
    qs.push('Describe a time you solved a hard bug and how you approached it.')
  }
  return qs.slice(0,10)
}

function readinessScore({ skills, company, role, jdText }) {
  let score = 35
  const categories = Object.keys(skills)
  score += Math.min(6, categories.length) * 5
  if (company) score += 10
  if (role) score += 10
  if ((jdText || '').length > 800) score += 10
  return Math.min(100, score)
}

// Company intel heuristics
function generateCompanyIntel(company = '', skills = {}) {
  const name = (company || '').trim()
  const knownEnterprises = ['amazon','google','microsoft','ibm','infosys','tcs','wipro','accenture','cognizant']
  const lower = name.toLowerCase()
  let sizeCategory = 'Startup'
  let industry = 'Technology Services'

  if (!name) {
    return {
      name: '',
      industry,
      sizeCategory,
      hiringFocus: 'Practical problem solving + stack depth',
      note: 'Demo Mode: Company intel generated heuristically.'
    }
  }

  // simple industry guesses
  if (lower.includes('bank') || lower.includes('finance') || lower.includes('capital')) industry = 'Financial Services'
  if (lower.includes('health') || lower.includes('clinic') || lower.includes('hospital')) industry = 'Healthcare'
  if (lower.includes('analytics') || lower.includes('data')) industry = 'Analytics'

  // size heuristics: known list => Enterprise
  if (knownEnterprises.some(k => lower.includes(k))) {
    sizeCategory = 'Enterprise'
  } else {
    // fallback: treat unknown as Startup
    sizeCategory = 'Startup'
  }

  const hiringFocus = sizeCategory === 'Enterprise'
    ? 'Structured DSA + core fundamentals'
    : 'Practical problem solving + stack depth'

  return {
    name,
    industry,
    sizeCategory,
    hiringFocus,
    note: 'Demo Mode: Company intel generated heuristically.'
  }
}

// Round mapping generator
function generateRoundMapping(companyIntel, skills) {
  const rounds = []
  const size = (companyIntel && companyIntel.sizeCategory) || 'Startup'
  const hasCore = !!skills.core
  const hasWeb = !!skills.web

  if (size === 'Enterprise') {
    rounds.push({
      title: 'Round 1: Online Test (DSA + Aptitude)',
      why: 'Standardized screening for large applicant pools; focuses on algorithmic skills and speed.'
    })
    rounds.push({
      title: 'Round 2: Technical (DSA + Core CS)',
      why: 'Deep evaluation of algorithms, data structures and system fundamentals.'
    })
    rounds.push({
      title: 'Round 3: Tech + Projects',
      why: 'Assess practical engineering, system design and code quality in context of real projects.'
    })
    rounds.push({
      title: 'Round 4: HR / Managerial',
      why: 'Behavioral fit, communication and organizational fit.'
    })
  } else if (size === 'Mid-size') {
    rounds.push({
      title: 'Round 1: Coding exercise',
      why: 'Practical coding task to assess hands-on ability.'
    })
    rounds.push({
      title: 'Round 2: Technical interview',
      why: 'System & stack knowledge relevant to role.'
    })
    rounds.push({
      title: 'Round 3: HR',
      why: 'Fit and expectations.'
    })
  } else { // Startup
    if (hasWeb) {
      rounds.push({
        title: 'Round 1: Practical coding (take-home or live)',
        why: 'Startups prioritize practical ability to ship features quickly.'
      })
      rounds.push({
        title: 'Round 2: System discussion',
        why: 'Discuss architecture, trade-offs and ownership.'
      })
      rounds.push({
        title: 'Round 3: Culture / Fit',
        why: 'Small teams need strong collaboration and adaptability.'
      })
    } else if (hasCore) {
      rounds.push({
        title: 'Round 1: Coding exercise',
        why: 'Problem-solving skills to validate fundamentals.'
      })
      rounds.push({
        title: 'Round 2: Technical deep-dive',
        why: 'Focus on algorithms and core CS concepts.'
      })
      rounds.push({
        title: 'Round 3: HR / Founders chat',
        why: 'Evaluate long-term fit and motivation.'
      })
    } else {
      rounds.push({
        title: 'Round 1: Practical assessment',
        why: 'General evaluation of applied skills.'
      })
      rounds.push({
        title: 'Round 2: Technical discussion',
        why: 'Role-specific technical evaluation.'
      })
      rounds.push({
        title: 'Round 3: HR',
        why: 'Fit and culture.'
      })
    }
  }
  return rounds
}
export function analyzeJob({ company = '', role = '', jdText = '' }) {
  const skills = extractSkills(jdText)
  const checklist = makeChecklist(skills)
  const plan = makePlan(skills)
  const questions = makeQuestions(skills)
  const score = readinessScore({ skills, company, role, jdText })
  const companyIntel = generateCompanyIntel(company, skills)
  const roundMapping = generateRoundMapping(companyIntel, skills)
  return { skills, checklist, plan, questions, score, companyIntel, roundMapping }
}

export default {
  loadHistory,
  loadEntryById,
  saveOrUpdateEntry,
  analyzeJob
}

// Build standardized history entry
export function createHistoryEntry({ id, createdAt, company = '', role = '', jdText = '', analysisResult }) {
  const now = createdAt || new Date().toISOString()
  const uid = id || (Date.now().toString())
  const res = analysisResult || analyzeJob({ company, role, jdText })

  // normalize skills to standard keys
  const skills = {
    coreCS: res.skills.core ? res.skills.core.slice() : [],
    languages: res.skills.languages ? res.skills.languages.slice() : [],
    web: res.skills.web ? res.skills.web.slice() : [],
    data: res.skills.data ? res.skills.data.slice() : [],
    cloud: res.skills.cloud ? res.skills.cloud.slice() : [],
    testing: res.skills.testing ? res.skills.testing.slice() : [],
    other: []
  }

  // If nothing detected, populate other with defaults
  const anyDetected = Object.values(skills).some((arr) => arr.length > 0)
  if (!anyDetected) {
    skills.other = ['Communication', 'Problem solving', 'Basic coding', 'Projects']
  }

  // checklist -> array [{ roundTitle, items }]
  const checklistArray = []
  if (res.checklist && typeof res.checklist === 'object') {
    Object.entries(res.checklist).forEach(([roundTitle, items]) => {
      checklistArray.push({ roundTitle, items: items.slice() })
    })
  }

  // plan7Days -> { day, focus, tasks[] }
  const plan7Days = (res.plan || []).map((p) => ({
    day: p.day,
    focus: p.title || p.title,
    tasks: []
  }))

  // roundMapping normalize { roundTitle, focusAreas[], whyItMatters }
  const roundMapping = (res.roundMapping || []).map((r) => ({
    roundTitle: r.title || r.roundTitle || '',
    focusAreas: r.focusAreas || [],
    whyItMatters: r.why || r.whyItMatters || ''
  }))

  const entry = {
    id: uid,
    createdAt: now,
    company: company || '',
    role: role || '',
    jdText: jdText || '',
    extractedSkills: skills,
    roundMapping,
    checklist: checklistArray,
    plan7Days,
    questions: res.questions ? res.questions.slice() : [],
    baseScore: Number(res.score || 0),
    skillConfidenceMap: {},
    finalScore: Number(res.score || 0),
    updatedAt: now,
    companyIntel: res.companyIntel || null
  }

  // persist using saveOrUpdateEntry to ensure dedupe
  saveOrUpdateEntry(entry)
  return entry
}