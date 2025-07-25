import { useState } from 'react'
import MainDeck from '../DeckComponents/MainDeck'
import ExtraDeck from '../DeckComponents/ExtraDeck'
import SideDeck from '../DeckComponents/SideDeck'

export default function DeckArea({
  cards,
  setCurrentCard,
  currentFormat,
  currentDeck,
  currentDeckIds,
  setCurrentDeckIds, 
  format,
  setFormat,
  setCurrentFormat,
  deckNameInput,
  setDeckNameInput
}) {

  return (
    <>
        <div className="deck-area">
            <MainDeck
              key={Object.keys(cards).length}
              cards={cards}
              setCurrentCard={setCurrentCard}
              currentFormat={currentFormat}
              currentDeck={currentDeck}
              currentDeckIds={currentDeckIds}
              setCurrentDeckIds={setCurrentDeckIds}
            />
            <ExtraDeck />
            <SideDeck />
        </div>
    </>
  )
}