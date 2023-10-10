'use client'

import SelectListEntry from './components/select-list-entry'
import times from 'lodash/times'
import { useState } from 'react'

export default function Home() {
  const [numEntries, setNumEntries] = useState(1)

  return (
    <div className='p-4'>
      <div className='text-xl mb-3'>Create a list of people you admire</div>

      <div>
        {times(numEntries).map((_, index) => (
          <SelectListEntry key={index} position={index + 1} className='border p-2 mb-2' />
        ))}
      </div>

      <div>
        {numEntries <= 20 && (
          <div>
            <button type='button' onClick={() => setNumEntries(numEntries + 1)} className='underline'>
              Add entry
            </button>
          </div>
        )}

        {numEntries > 1 && (
          <div>
            <button type='button' onClick={() => setNumEntries(numEntries - 1)} className='underline'>
              Remove entry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
