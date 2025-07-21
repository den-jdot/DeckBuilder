import { useState } from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


export default function ExtraDeck() {

  return (
    <>
        <div className="extra-deck">
          <div className="deck-header">
            <div className="deck-counter">
              <div className="name-box">
                EXTRA
              </div>
              <Stack direction="row" spacing={1}>
                <Button sx={{ backgroundColor: '#676e73ff', color: 'white' }}>1</Button>
              </Stack>
            </div>
            <div className="type-counter">
              <Stack direction="row" spacing={1}>
                <Button sx={{ backgroundColor: '#9c27b0', color: 'white' }}>3</Button>
                <Button sx={{ backgroundColor: '#d0d0d0ff', color: 'black' }}>2</Button>
                <Button sx={{ backgroundColor: '#191919ff', color: 'white' }}>2</Button>
                <Button sx={{ backgroundColor: '#2196f3', color: 'white' }}>1</Button>

              </Stack>
            </div>
          </div>

            <h2>Extra Deck</h2>
            <p>This is where you can manage your Extra Deck items.</p>
        </div>
    </>
  )
}