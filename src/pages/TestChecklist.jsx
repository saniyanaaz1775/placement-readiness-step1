import React, { useEffect, useState } from 'react'
import Card from '../components/Card'

const STORAGE_KEY = 'prp_test_checklist_v1'

const TESTS = [
  { id: 't1', label: 'JD required validation works', hint: 'Submit empty JD and confirm validation blocks analysis.' },
  { id: 't2', label: 'Short JD warning shows for <200 chars', hint: 'Paste a short JD (<200 chars) and verify warning appears.' },
  { id: 't3', label: 'Skills extraction groups correctly', hint: 'Ensure extracted skills are grouped (core/web/data/etc).' },
  { id: 't4', label: 'Round mapping changes based on company + skills', hint: 'Use Enterprise company and DSA keywords; round flow should reflect enterprise.' },
  { id: 't5', label: 'Score calculation is deterministic', hint: 'Re-run same JD and confirm base score matches.' },
  { id: 't6', label: 'Skill toggles update score live', hint: 'On results, toggle skills and see score change immediately.' },
  { id: 't7', label: 'Changes persist after refresh', hint: 'Toggle a skill, refresh, ensure toggle remains.' },
  { id: 't8', label: 'History saves and loads correctly', hint: 'Run an analysis and check it appears in History.' },
  { id: 't9', label: 'Export buttons copy the correct content', hint: 'Use copy buttons and paste into a text editor to verify.' },
  { id: 't10', label: 'No console errors on core pages', hint: 'Open console and navigate core pages; no errors should appear.' }
]

function loadChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveChecklist(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (e) {
    // ignore
  }
}

export default function TestChecklist() {
  const [state, setState] = useState(() => loadChecklist())

  useEffect(() => {
    saveChecklist(state)
  }, [state])

  const passedCount = TESTS.reduce((acc, t) => (state[t.id] ? acc + 1 : acc), 0)

  function toggle(id) {
    setState((s) => ({ ...s, [id]: !s[id] }))
  }

  function resetAll() {
    setState({})
    saveChecklist({})
  }

  const allPassed = passedCount === TESTS.length

  return (
    <div className="p-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">PRP Test Checklist</h2>
            <div className="text-sm text-gray-600 mt-1">Ensure all tests pass before shipping.</div>
          </div>
          <div className="text-sm font-semibold">Tests Passed: {passedCount} / {TESTS.length}</div>
        </div>

        <div className="mt-4">
          {passedCount < TESTS.length && (
            <div className="mb-3 text-sm text-yellow-700">Fix issues before shipping.</div>
          )}
          <ul className="space-y-3">
            {TESTS.map((t) => (
              <li key={t.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!state[t.id]}
                  onChange={() => toggle(t.id)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{t.label}</div>
                  <div className="text-xs text-gray-500 mt-1">How to test: {t.hint}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-3">
            <button onClick={resetAll} className="px-3 py-2 border rounded">Reset checklist</button>
          </div>
        </div>
      </Card>
    </div>
  )
}

