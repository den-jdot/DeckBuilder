import { useState } from 'react'
import FormatArea from '../UpperComponents/FormatArea'
import HeaderArea from '../UpperComponents/HeaderArea'
import MiscArea from '../UpperComponents/MiscArea'

export default function UpperArea({format, currentFormat, setFormat, setCurrentFormat, currentDeck, setCurrentDeck, deckNameInput, setDeckNameInput}) {

  return (
    <>
        <div className="upper-area">
            <FormatArea format={format} currentFormat={currentFormat} setFormat={setFormat} setCurrentFormat={setCurrentFormat} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} />
            <HeaderArea currentDeck={currentDeck} deckNameInput={deckNameInput} setDeckNameInput={setDeckNameInput}/>
            <MiscArea />
        </div>
    </>
  )
}