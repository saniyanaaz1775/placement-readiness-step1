import React from 'react'
import Card from '../components/Card'
import { loadHistory } from '../utils/skillExtractor'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const history = loadHistory()
  const navigate = useNavigate()

  if (!history.length) {
    return (
      <Card>
        <div>No history yet. Run an analysis to populate history.</div>
      </Card>
    )
  }

  return (
    <div className="grid gap-3">
      {history.map((h) => (
        <Card key={h.id}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{h.company || 'Company'}</div>
              <div className="text-sm text-gray-500">{h.role || 'Role'}</div>
              <div className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-lg font-bold">{h.readinessScore}</div>
              <div>
                <button onClick={() => navigate(`/results?id=${h.id}`)} className="px-3 py-1 bg-primary text-white rounded">
                  View
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

