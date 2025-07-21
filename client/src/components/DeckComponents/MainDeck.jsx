import { useState } from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


export default function MainDeck() {

  return (
    <>
        <div className="main-deck">
          <div className="deck-header">
            <div className="deck-counter">
              <div className="name-box">
                MAIN
              </div>
              <Stack direction="row" spacing={1}>
                <Button sx={{ backgroundColor: '#676e73ff', color: 'white' }}>1</Button>
              </Stack>
            </div>
            <div className="type-counter">
              <Stack direction="row" spacing={1}>
                <Button sx={{ backgroundColor: '#ac9f27ff', color: 'white' }}>1</Button>
                <Button sx={{ backgroundColor: '#c56c14ff', color: 'white' }}>1</Button>
                <Button sx={{ backgroundColor: '#095492ff', color: 'white' }}>1</Button>
                <Button sx={{ backgroundColor: '#1e9f3eff', color: 'white' }}>1</Button>
                <Button sx={{ backgroundColor: '#e91e63', color: 'white' }}>2</Button>
              </Stack>
            </div>

          </div>
            <h2>Main Deck</h2>
            <p>This is where you can manage your Main Deck items.</p>
        </div>
    </>
  )
}