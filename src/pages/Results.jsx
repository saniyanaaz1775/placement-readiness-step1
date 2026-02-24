import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import ResultView from '../components/ResultView'

const STORAGE_KEY = 'prp_history_v1'

export default function Results() {
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const arr = JSON.parse(raw)
        if (arr && arr.length) setLatest(arr[0])
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <div className="p-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Latest Analysis Result</h2>
        <ResultView result={latest} />
      </Card>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { loadHistory, loadEntryById } from '../utils/skillExtractor'
import { useLocation, useNavigate } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function Results() {
  const q = useQuery()
  const id = q.get('id')
  const [entry, setEntry] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      const e = loadEntryById(id)
      setEntry(e || null)
    } else {
      const h = loadHistory()
      setEntry(h.length ? h[0] : null)
    }
  }, [id])

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
          <div className="text-3xl font-bold">{entry.readinessScore}</div>
        </div>
      </Card>

      <Card>
        <h4 className="font-semibold mb-2">Extracted Skills</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(entry.extractedSkills).map(([cat, arr]) => (
            <div key={cat}>
              <div className="text-sm font-medium">{cat}</div>
              <div className="flex gap-2 mt-1">
                {arr.map((s)=> <span key={s} className="px-2 py-1 bg-gray-100 rounded text-sm">{s}</span>)}
              </div>
            </div>
          ))}
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

