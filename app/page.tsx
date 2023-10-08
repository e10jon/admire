'use client'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

export default function Home() {
  const options = [{ id: '123', label: 'Bob', description: 'A guy' }]

  return (
    <div>
      <Autocomplete
        disablePortal
        options={options}
        renderInput={(params) => <TextField {...params} />}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          )
        }}
      />
    </div>
  )
}
