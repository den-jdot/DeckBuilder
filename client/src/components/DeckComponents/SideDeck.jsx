import { useState } from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


export default function SideDeck() {

  return (
    <>
        <div className="side-deck">
          <div className="deck-header">
            <div className="deck-counter">
              <div className="name-box">
                SIDE
              </div>
              <Stack direction="row" spacing={1}>
                <Button sx={{ backgroundColor: '#676e73ff', color: 'white' }}>1</Button>
              </Stack>
            </div>
          </div>
            <h2>Side Deck</h2>
            <p>This is where you can manage your Side Deck items.</p>
        </div>
    </>
  )
}