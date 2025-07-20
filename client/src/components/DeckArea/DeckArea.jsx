import { useState } from 'react'
import MainDeck from '../DeckComponents/MainDeck'
import ExtraDeck from '../DeckComponents/ExtraDeck'
import SideDeck from '../DeckComponents/SideDeck'

export default function DeckArea() {

  return (
    <>
        <div className="deck-area">
            <MainDeck />
            <ExtraDeck />
            <SideDeck />
        </div>
    </>
  )
}