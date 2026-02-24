import React, { useEffect, useState } from 'react'
import Card from '../components/Card'

const CHECK_KEY = 'prp_test_checklist_v1'
const SHIP_KEY = 'prp_shipped_v1'

function loadChecklist() {
  try {
    const raw = localStorage.getItem(CHECK_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export default function Ship() {
  const [complete, setComplete] = useState(false)
  const [shipped, setShipped] = useState(false)

  useEffect(() => {
    const map = loadChecklist()
    const allIds = Object.keys(map)
    // we expect 10 tests; ensure all true
    const ok = allIds.length >= 10 && allIds.every((k) => map[k] === true)
    setComplete(ok)
    const s = localStorage.getItem(SHIP_KEY)
    setShipped(s === '1')
  }, [])

  function doShip() {
    localStorage.setItem(SHIP_KEY, '1')
    setShipped(true)
  }

  return (
    <div className="p-6">
      <Card>
        <h2 className="text-xl font-semibold">Ship Release</h2>
        {!complete && (
          <div className="mt-4">
            <div className="text-sm text-yellow-700">Shipping is locked until all tests pass.</div>
            <div className="mt-3">
              <a href="/prp/07-test" className="px-3 py-2 border rounded">Go to Test Checklist</a>
            </div>
          </div>
        )}

        {complete && !shipped && (
          <div className="mt-4">
            <div className="text-sm text-green-700">All tests passed. Ready to ship.</div>
            <div className="mt-3">
              <button onClick={doShip} className="px-4 py-2 bg-primary text-white rounded">Ship</button>
            </div>
          </div>
        )}

        {shipped && (
          <div className="mt-4">
            <div className="text-sm text-green-800">Application marked as shipped.</div>
          </div>
        )}
      </Card>
    </div>
  )
}

