'use client'

import SelectListEntry from './components/select-list-entry'
import times from 'lodash/times'
import { useState } from 'react'

export default function Home() {
  const [numEntries, setNumEntries] = useState(1)

  return (
    <>
      <div>
        {times(numEntries).map((_, index) => (
          <SelectListEntry key={index} position={index + 1} />
        ))}
      </div>

      <div>
        {numEntries <= 20 && (
          <button type='button' onClick={() => setNumEntries(numEntries + 1)}>
            Add entry
          </button>
        )}

        {numEntries > 1 && (
          <button type='button' onClick={() => setNumEntries(numEntries - 1)}>
            Remove entry
          </button>
        )}
      </div>
    </>
  )
}
