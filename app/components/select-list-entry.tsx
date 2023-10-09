'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { Result } from '@/app/server/wikidata-api'
import debounce from 'lodash/debounce'

export default function SelectListEntry({ position }: { position: number }) {
  const [person, setPerson] = useState<Result[number] | null>(null)
  const [query, setQuery] = useState('')
  const [people, setPeople] = useState<Result | null>(null)
  const [fetching, setFetching] = useState<boolean>(false)

  const debouncedSetQuery = useRef(
    debounce<(event: ChangeEvent<HTMLInputElement>) => void>((event) => {
      setQuery(event.target.value)
    }, 300)
  ).current

  useEffect(() => {
    if (query === '') {
      setPeople(null)
      return
    }

    const path = `/api/people?name=${query}`
    console.log(`Fetching ${path}`)
    setFetching(true)
    fetch(path)
      .then((res) => res.json() as unknown as { people: Result })
      .then((res) => {
        setPeople(res.people)
      })
      .finally(() => {
        setFetching(false)
      })
  }, [query])

  return (
    <div>
      <span>{position}</span>

      {person ? (
        <span>
          Selected {person.name}{' '}
          <button type='button' onClick={() => setPerson(null)}>
            Remove
          </button>
        </span>
      ) : (
        <Combobox value={person} onChange={setPerson}>
          <Combobox.Input onChange={debouncedSetQuery} className='border' />
          {fetching && 'Fetching...'}

          <Combobox.Options>
            {(() => {
              if (people === null) return

              if (people.length > 0)
                return people.map((person) => (
                  <Combobox.Option key={person.id} value={person} className='border'>
                    <span>{person.name} </span>
                    <span className='text-sm text-slate-500'>{person.description}</span>
                  </Combobox.Option>
                ))

              return <div>No results!</div>
            })()}
          </Combobox.Options>
        </Combobox>
      )}
    </div>
  )
}