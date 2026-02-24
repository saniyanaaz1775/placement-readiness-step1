import React, { useState } from 'react'
import Card from '../components/Card'
import { analyzeJob, saveEntry } from '../utils/skillExtractor'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8)
}

export default function Analyze() {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [result, setResult] = useState(null)

  function handleAnalyze() {
    const res = analyzeJob({ company, role, jdText })
    const entry = {
      id: uid(),
      createdAt: new Date().toISOString(),
      company,
      role,
      jdText,
      extractedSkills: res.skills,
      plan: res.plan,
      checklist: res.checklist,
      questions: res.questions,
      readinessScore: res.score
    }
    saveEntry(entry)
    setResult(entry)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Job Description Analyzer</h2>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <input placeholder="Company (optional)" value={company} onChange={(e)=>setCompany(e.target.value)} className="border p-2 rounded" />
          <input placeholder="Role (optional)" value={role} onChange={(e)=>setRole(e.target.value)} className="border p-2 rounded" />
          <textarea placeholder="Paste job description here" value={jdText} onChange={(e)=>setJdText(e.target.value)} rows={8} className="border p-3 rounded" />
          <div className="flex gap-3">
            <button onClick={handleAnalyze} className="px-4 py-2 bg-primary text-white rounded">Analyze</button>
          </div>
        </div>
      </Card>

      {result && (
        <Card>
          <h3 className="text-lg font-semibold mb-2">Analysis Result</h3>
          <div className="mb-2">Readiness Score: <strong>{result.readinessScore}</strong></div>
          <div className="mb-2">Company: {result.company || '—'}</div>
          <div className="mb-2">Role: {result.role || '—'}</div>
          <div className="mb-4">
            <h4 className="font-medium">Extracted Skills</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(result.extractedSkills).map(([cat, arr]) => (
                <div key={cat} className="mr-2">
                  <div className="text-sm font-semibold">{cat}</div>
                  <div className="flex gap-2 mt-1">
                    {arr.map((s)=> <span key={s} className="px-2 py-1 bg-gray-100 rounded text-sm">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <h4 className="font-medium">Rounds Checklist</h4>
            <div className="mt-2">
              {Object.entries(result.checklist).map(([round, items])=>(
                <div key={round} className="mb-3">
                  <div className="font-semibold">{round}</div>
                  <ul className="list-disc ml-5">
                    {items.map((it,idx)=> <li key={idx}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <h4 className="font-medium">7-Day Plan</h4>
            <ol className="list-decimal ml-5">
              {result.plan.map((d)=> <li key={d.day}>{`Day ${d.day}: ${d.title}`}</li>)}
            </ol>
          </div>
          <div>
            <h4 className="font-medium">Top Interview Questions</h4>
            <ol className="list-decimal ml-5">
              {result.questions.map((q,idx)=> <li key={idx}>{q}</li>)}
            </ol>
          </div>
        </Card>
      )}
    </div>
  )
}

