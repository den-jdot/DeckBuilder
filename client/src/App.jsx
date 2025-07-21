import { useState, useEffect } from 'react'
import './App.css'

import UpperArea from './components/UpperArea/UpperArea.jsx'
import CardArea from './components/CardArea/CardArea.jsx'
import DeckArea from './components/DeckArea/DeckArea.jsx'
import TrunkArea from './components/TrunkArea/TrunkArea.jsx'



function App() {

  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);

  const DEFAULT_FORMATS = ["TenguPlant", "Edison", "TeleDAD", "Goat"];
  const [format, setFormat] = useState(() => {
    try {
      const stored = localStorage.getItem('format');
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_FORMATS;
    } catch {
      return DEFAULT_FORMATS;
    }
  });

  const [currentFormat, setCurrentFormat] = useState(() => {
    try {
      const stored = localStorage.getItem('currentFormat');
      return stored ?? "TenguPlant";
    } catch {
      return "TenguPlant";
    }
  });

  const [currentDeck, setCurrentDeck] = useState("");

  const [deckNameInput, setDeckNameInput] = useState("");

  useEffect(() => {
    setDeckNameInput(currentDeck);
  }, [currentDeck]);


  return (
    <>
      <main>
        <UpperArea 
          format={format}
          setFormat={setFormat}
          currentFormat={currentFormat}
          setCurrentFormat={setCurrentFormat}
          currentDeck={currentDeck}
          setCurrentDeck={setCurrentDeck}
          deckNameInput={deckNameInput}
          setDeckNameInput={setDeckNameInput}/>

          <div className="main-app">

            <CardArea
              currentCard={currentCard} />
            <DeckArea
              cards={cards}
              setCurrentCard={setCurrentCard}
              currentFormat={currentFormat}
              currentDeck={currentDeck} />
            <TrunkArea
              cards={cards}
              setCards={setCards}
              setCurrentCard={setCurrentCard}
              currentFormat={currentFormat} />

          </div>
      </main>
    </>
  )
}

export default App
