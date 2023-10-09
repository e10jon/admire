'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { Result } from '@/app/server/wikidata-api'
import classNames from 'classnames'
import debounce from 'lodash/debounce'

export default function SelectListEntry({ position }: { position: number }) {
  const [person, setPerson] = useState<Result[number] | null>(null)
  const [query, setQuery] = useState('')
  const [people, setPeople] = useState<Result | null>(null)
  const [fetching, setFetching] = useState<boolean>(false)
  const [addPersonMode, setAddPersonMode] = useState(false)

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

      {(() => {
        if (addPersonMode)
          return (
            <>
              <form>
                <div>
                  <label>Name</label>
                  <input name='name' />
                </div>

                <div>
                  <label>Description</label>
                  <input name='description' />
                </div>
              </form>

              <button type='button' onClick={() => setAddPersonMode(false)}>
                Cancel
              </button>
            </>
          )

        if (person)
          return (
            <span>
              Selected {person.name}{' '}
              <button type='button' onClick={() => setPerson(null)}>
                Remove
              </button>
            </span>
          )

        return (
          <Combobox value={person} onChange={setPerson}>
            <Combobox.Input onChange={debouncedSetQuery} className='border' />
            {fetching && 'Fetching...'}

            <Combobox.Options>
              {(() => {
                if (people === null) return

                if (people.length > 0)
                  return people
                    .map((person) => (
                      <Combobox.Option key={person.id} value={person} className='border'>
                        {({ active }) => (
                          <div className={classNames(active && 'bg-yellow-50')}>
                            <span>{person.name} </span>
                            <span className='text-sm text-slate-500'>{person.description}</span>
                          </div>
                        )}
                      </Combobox.Option>
                    ))
                    .concat(
                      <div>
                        <button type='button' onClick={() => setAddPersonMode(true)}>
                          Add your own
                        </button>
                      </div>
                    )

                return (
                  <div>
                    No results!{' '}
                    <button type='button' onClick={() => setAddPersonMode(true)}>
                      Add your own
                    </button>
                  </div>
                )
              })()}
            </Combobox.Options>
          </Combobox>
        )
      })()}

      {person || addPersonMode ? (
        <div>
          <label>Reason</label>
          <input name='reason' />
        </div>
      ) : null}
    </div>
  )
}
