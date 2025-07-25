import { useState } from 'react'


export default function TrunkFilter({ nameFilter, setNameFilter }) {

  return (
    <>
        <div className="trunk-filter">
            <input
              type="text"
              placeholder="Search by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              style={{ marginBottom: '10px', width: '100%' }}
            />
        </div>
    </>
  )
}