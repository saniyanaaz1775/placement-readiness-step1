import React from 'react'

export default function ResultView({ result }) {
  if (!result) {
    return <div className="text-sm text-gray-500">No result to show.</div>
  }

  return (
    <div>
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
    </div>
  )
}

