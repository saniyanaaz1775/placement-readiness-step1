import React, { useEffect, useState, useMemo } from 'react'
import Card from '../components/Card'
import { loadHistory, loadEntryById, saveOrUpdateEntry } from '../utils/skillExtractor'
import { useLocation, useNavigate } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function Results() {
  const q = useQuery()
  const id = q.get('id')
  const [entry, setEntry] = useState(null)
  const navigate = useNavigate()
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({})
  const [adjustedScore, setAdjustedScore] = useState(null)

  // flatten skills helper
  const flattenSkills = (skillsObj) => {
    const set = new Set()
    Object.values(skillsObj || {}).forEach((arr) => arr.forEach((s) => set.add(s)))
    return Array.from(set)
  }

  useEffect(() => {
    if (id) {
      const e = loadEntryById(id)
      setEntry(e || null)
    } else {
      const h = loadHistory()
      setEntry(h.length ? h[0] : null)
    }
  }, [id])

  // initialize skill confidence map when entry loads
  useEffect(() => {
    if (!entry) {
      setSkillConfidenceMap({})
      setAdjustedScore(null)
      return
    }
    // load existing map or default to 'practice'
    const map = entry.skillConfidenceMap ? { ...entry.skillConfidenceMap } : {}
    const skills = flattenSkills(entry.extractedSkills)
    skills.forEach((s) => {
      if (!map[s]) map[s] = 'practice'
    })
    setSkillConfidenceMap(map)
    // compute adjusted score
    const base = entry.readinessScore || entry.readinessScore || 35
    const calc = computeAdjustedScore(base, map)
    setAdjustedScore(calc)
  }, [entry])

  // recompute adjusted score when map changes and persist
  useEffect(() => {
    if (!entry) return
    const base = entry.readinessScore || 35
    const score = computeAdjustedScore(base, skillConfidenceMap)
    setAdjustedScore(score)
    // persist to storage: update entry with new map and adjusted score
    const updated = { ...entry, skillConfidenceMap: { ...skillConfidenceMap }, readinessScoreAdjusted: score }
    saveOrUpdateEntry(updated)
    // also update local state entry so UI reflects persisted version
    setEntry(updated)
  }, [skillConfidenceMap])

  function computeAdjustedScore(base, map) {
    let score = Number(base) || 0
    Object.values(map || {}).forEach((v) => {
      if (v === 'know') score += 2
      if (v === 'practice') score -= 2
    })
    if (score < 0) score = 0
    if (score > 100) score = 100
    return score
  }

  const weakSkills = useMemo(() => {
    return Object.entries(skillConfidenceMap || {})
      .filter(([k, v]) => v === 'practice')
      .map(([k]) => k)
  }, [skillConfidenceMap])
  if (!entry) {
    return (
      <Card>
        <div className="text-center">
          <div className="text-lg font-semibold">No analysis found</div>
          <div className="mt-2 text-sm text-gray-600">Run an analysis from the Analyze page or check History.</div>
          <div className="mt-4">
            <button onClick={()=>navigate('/dashboard/analyze')} className="px-4 py-2 bg-primary text-white rounded">Go to Analyze</button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleString()}</div>
            <div className="text-xl font-semibold">{entry.company || 'Unknown Company'}</div>
            <div className="text-sm text-gray-600">{entry.role || '—'}</div>
          </div>
          <div className="text-3xl font-bold">{adjustedScore ?? entry.readinessScore}</div>
        </div>
      </Card>

      {entry.companyIntel && (
        <Card>
          <h4 className="font-semibold mb-2">Company Intel <span className="text-xs text-gray-500 ml-2">Demo Mode</span></h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium">Industry</div>
              <div className="text-sm text-gray-700">{entry.companyIntel.industry}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Estimated size</div>
              <div className="text-sm text-gray-700">{entry.companyIntel.sizeCategory}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Typical Hiring Focus</div>
              <div className="text-sm text-gray-700">{entry.companyIntel.hiringFocus}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">{entry.companyIntel.note}</div>
        </Card>
      )}

      {entry.roundMapping && (
        <Card>
          <h4 className="font-semibold mb-3">Round Mapping</h4>
          <div className="flex flex-col">
            {entry.roundMapping.map((r, idx) => (
              <div key={idx} className="flex gap-4 items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">{idx+1}</div>
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-gray-600 mt-1">Why this round matters: {r.why}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h4 className="font-semibold mb-2">Extracted Skills</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(entry.extractedSkills).map(([cat, arr]) => (
            <div key={cat} className="min-w-[180px]">
              <div className="text-sm font-medium">{cat}</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {arr.map((s) => {
                  const state = skillConfidenceMap[s] || 'practice'
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">{s}</span>
                      <div className="flex rounded-md overflow-hidden border text-xs">
                        <button
                          onClick={() =>
                            setSkillConfidenceMap((m) => ({ ...m, [s]: 'know' }))
                          }
                          className={`px-2 py-1 ${state === 'know' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                          aria-pressed={state === 'know'}
                        >
                          I know
                        </button>
                        <button
                          onClick={() =>
                            setSkillConfidenceMap((m) => ({ ...m, [s]: 'practice' }))
                          }
                          className={`px-2 py-1 ${state === 'practice' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                          aria-pressed={state === 'practice'}
                        >
                          Need practice
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-3">
          <button
            className="px-3 py-1 border rounded"
            onClick={() => {
              const text = entry.plan.map((d) => `Day ${d.day}: ${d.title}`).join('\n')
              navigator.clipboard.writeText(text)
            }}
          >
            Copy 7-day plan
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => {
              // flatten checklist sections
              const txt = Object.entries(entry.checklist)
                .map(([r, items]) => `${r}:\n- ${items.join('\n- ')}`)
                .join('\n\n')
              navigator.clipboard.writeText(txt)
            }}
          >
            Copy round checklist
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => {
              const txt = entry.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
              navigator.clipboard.writeText(txt)
            }}
          >
            Copy 10 questions
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => {
              const parts = []
              parts.push(`Company: ${entry.company || ''}`)
              parts.push(`Role: ${entry.role || ''}`)
              parts.push(`Readiness Score: ${adjustedScore ?? entry.readinessScore}`)
              parts.push('\nKey skills:')
              Object.entries(entry.extractedSkills).forEach(([cat, arr]) => {
                parts.push(`${cat}: ${arr.join(', ')}`)
              })
              parts.push('\n7-day plan:')
              parts.push(...entry.plan.map((d) => `Day ${d.day}: ${d.title}`))
              parts.push('\nRound checklist:')
              Object.entries(entry.checklist).forEach(([r, items]) => {
                parts.push(`${r}:\n- ${items.join('\n- ')}`)
              })
              parts.push('\nQuestions:')
              parts.push(...entry.questions.map((q, i) => `${i + 1}. ${q}`))
              const blob = new Blob([parts.join('\n\n')], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${(entry.company || 'analysis').replace(/\s+/g, '_')}_analysis.txt`
              document.body.appendChild(a)
              a.click()
              a.remove()
              URL.revokeObjectURL(url)
            }}
          >
            Download as TXT
          </button>
        </div>
      </Card>

      <Card>
        <h4 className="font-semibold mb-2">7-Day Plan</h4>
        <ol className="list-decimal ml-5">
          {entry.plan.map((d)=> <li key={d.day}>{`Day ${d.day}: ${d.title}`}</li>)}
        </ol>
      </Card>

      <Card>
        <h4 className="font-semibold mb-2">Interview Questions</h4>
        <ol className="list-decimal ml-5">
          {entry.questions.map((q,idx)=> <li key={idx}>{q}</li>)}
        </ol>
      </Card>
    </div>
  )
}

