import { useState, useEffect } from 'react';
import './App.css';

import UpperArea from './components/UpperArea/UpperArea.jsx';
import CardArea from './components/CardArea/CardArea.jsx';
import DeckArea from './components/DeckArea/DeckArea.jsx';
import TrunkArea from './components/TrunkArea/TrunkArea.jsx';

function App() {
  // === Card and deck state ===
  const [cards, setCards] = useState(() => ({}));
  const [currentDeckIds, setCurrentDeckIds] = useState([]); // array of card IDs
  const [currentCard, setCurrentCard] = useState(null);

  // === Format handling ===
  const DEFAULT_FORMATS = [
    { name: "TenguPlant", decks: {} },
    { name: "Edison", decks: {} },
    { name: "TeleDAD", decks: {} },
    { name: "Goat", decks: {} },
  ];

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
      return localStorage.getItem('currentFormat') ?? "TenguPlant";
    } catch {
      return "TenguPlant";
    }
  });

  const [currentDeck, setCurrentDeck] = useState(() => {
    try {
      return localStorage.getItem('currentDeck') ?? "";
    } catch {
      return "";
    }
  });

  const [deckNameInput, setDeckNameInput] = useState(currentDeck);

  // === Sync deck name input when current deck changes ===
  useEffect(() => {
    setDeckNameInput(currentDeck);
  }, [currentDeck]);

  // === Persist to localStorage ===
  useEffect(() => {
    localStorage.setItem('format', JSON.stringify(format));
  }, [format]);

  useEffect(() => {
    localStorage.setItem('currentFormat', currentFormat);
  }, [currentFormat]);

  useEffect(() => {
    localStorage.setItem('currentDeck', currentDeck);
  }, [currentDeck]);

  useEffect(() => {
  if (!currentDeck || !currentFormat) return;

  setFormat((prevFormats) =>
    prevFormats.map((f) => {
      if (f.name !== currentFormat) return f;

      return {
        ...f,
        decks: {
          ...f.decks,
          [currentDeck]: [...currentDeckIds], // overwrite the saved version
        },
      };
    })
  );
  }, [currentDeckIds]);

  useEffect(() => {
    if (!currentDeck || !currentFormat) return;

    const formatObj = format.find((f) => f.name === currentFormat);
    if (!formatObj) return;

    const savedDeck = formatObj.decks?.[currentDeck];
    if (Array.isArray(savedDeck)) {
      setCurrentDeckIds(savedDeck);
    } else {
      setCurrentDeckIds([]); // If deck doesn't exist yet, start empty
    }
  }, [currentDeck, currentFormat]);

  // === Debug log ===
  useEffect(() => {
    console.log("Cards updated in App:", Object.keys(cards));
  }, [cards]);

  return (
    <main>
      <UpperArea
        format={format}
        setFormat={setFormat}
        currentFormat={currentFormat}
        setCurrentFormat={setCurrentFormat}
        currentDeck={currentDeck}
        setCurrentDeck={setCurrentDeck}
        deckNameInput={deckNameInput}
        setDeckNameInput={setDeckNameInput}
        cards={cards}
        setCurrentCard={setCurrentCard}
        currentDeckIds={currentDeckIds}
        setCurrentDeckIds={setCurrentDeckIds}
      />

      <div className="main-app">
        <CardArea currentCard={currentCard} />

        <DeckArea
          format={format}
          setFormat={setFormat}
          currentFormat={currentFormat}
          setCurrentFormat={setCurrentFormat}
          currentDeck={currentDeck}
          setCurrentDeck={setCurrentDeck}
          deckNameInput={deckNameInput}
          setDeckNameInput={setDeckNameInput}
          cards={cards}
          setCurrentCard={setCurrentCard}
          currentDeckIds={currentDeckIds}
          setCurrentDeckIds={setCurrentDeckIds}
        />

        <TrunkArea
          format={format}
          setFormat={setFormat}
          currentFormat={currentFormat}
          setCurrentFormat={setCurrentFormat}
          currentDeck={currentDeck}
          setCurrentDeck={setCurrentDeck}
          deckNameInput={deckNameInput}
          setDeckNameInput={setDeckNameInput}
          cards={cards}
          setCards={setCards}
          setCurrentCard={setCurrentCard}
          currentDeckIds={currentDeckIds}
          setCurrentDeckIds={setCurrentDeckIds}
        />
      </div>
    </main>
  );
}

export default App;
