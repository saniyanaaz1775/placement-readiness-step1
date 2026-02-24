import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'

const STORAGE_KEY = 'prp_history_v1'

export default function History() {
  const [history, setHistory] = useState([])
  const [corruptedCount, setCorruptedCount] = useState(0)

  useEffect(() => {
    try {
      const { entries, corrupted } = require('../utils/skillExtractor').loadHistoryWithStats()
      setHistory(entries)
      setCorruptedCount(corrupted || 0)
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <div className="p-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Analysis History</h2>
        {history.length === 0 && <div className="text-sm text-gray-500">No saved analyses yet.</div>}
        {corruptedCount > 0 && <div className="text-sm text-yellow-700 mb-3">One saved entry couldn't be loaded. Create a new analysis.</div>}
        <ul className="space-y-3">
          {history.map((h) => (
            <li key={h.id} className="p-2 border rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{h.company || 'Unknown Company'}</div>
                  <div className="text-xs text-gray-500">{h.role || '(no role)'} • {new Date(h.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">{h.finalScore ?? h.baseScore}</div>
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

