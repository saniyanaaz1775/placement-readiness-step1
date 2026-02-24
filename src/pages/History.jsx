import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'

const STORAGE_KEY = 'prp_history_v1'

export default function History() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <div className="p-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Analysis History</h2>
        {history.length === 0 && <div className="text-sm text-gray-500">No saved analyses yet.</div>}
        <ul className="space-y-3">
          {history.map((h) => (
            <li key={h.id} className="p-2 border rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{h.company || 'Unknown Company'}</div>
                  <div className="text-xs text-gray-500">{h.role || '(no role)'} • {new Date(h.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">{h.readinessScore}</div>
                  <Link to="/results" className="px-3 py-1 border rounded-md text-sm">View</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

