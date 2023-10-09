'use client'

import { Combobox } from '@headlessui/react'
import { useState } from 'react'

const people = [
  { id: '123', name: 'Bob', description: 'A guy' },
  { id: '121', name: 'Tim', description: 'A guy' },
  { id: '124', name: 'Fred', description: 'A guy' },
]

export default function Home() {
  const [person, setPerson] = useState<(typeof people)[number]>()
  const [query, setQuery] = useState('')

  return (
    <div>
      <Combobox value={person} onChange={setPerson}>
        <Combobox.Input onChange={(event) => setQuery(event.target.value)} className='border' />
        <Combobox.Options>
          {people.map((person) => (
            <Combobox.Option key={person.id} value={person} className='border'>
              <span>{person.name} </span>
              <span className='text-sm text-slate-500'>{person.description}</span>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  )
}
