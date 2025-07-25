import { useEffect, useState } from 'react';
import './App.css';

import UpperArea from './components/UpperArea/UpperArea.jsx';
import CardArea from './components/CardArea/CardArea.jsx';
import DeckArea from './components/DeckArea/DeckArea.jsx';
import TrunkArea from './components/TrunkArea/TrunkArea.jsx';

function App() {
  // Card and UI state
  const [cards, setCards] = useState({});
  const [currentCard, setCurrentCard] = useState(null);

  // Format and deck metadata
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
  const [currentDeckData, setCurrentDeckData] = useState({
    main: [],
    extra: [],
    side: [],
  });

  // Sync deckNameInput when deck changes
  useEffect(() => {
    setDeckNameInput(currentDeck);
  }, [currentDeck]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('format', JSON.stringify(format));
  }, [format]);

  useEffect(() => {
    localStorage.setItem('currentFormat', currentFormat);
  }, [currentFormat]);

  useEffect(() => {
    localStorage.setItem('currentDeck', currentDeck);
  }, [currentDeck]);

  // Save deck data into format object
  useEffect(() => {
    if (!currentDeck || !currentFormat) return;

    setFormat((prevFormats) =>
      prevFormats.map((f) =>
        f.name === currentFormat
          ? { ...f, decks: { ...f.decks, [currentDeck]: { ...currentDeckData } } }
          : f
      )
    );
  }, [currentDeckData]);

  // Load deck from saved format
  useEffect(() => {
    if (!currentDeck || !currentFormat) return;
    const formatObj = format.find((f) => f.name === currentFormat);
    if (!formatObj) return;

    const savedDeck = formatObj.decks?.[currentDeck];
    setCurrentDeckData(
    savedDeck && typeof savedDeck === 'object'
      ? {
          main: Array.isArray(savedDeck.main) ? savedDeck.main : [],
          extra: Array.isArray(savedDeck.extra) ? savedDeck.extra : [],
          side: Array.isArray(savedDeck.side) ? savedDeck.side : [],
        }
      : { main: [], extra: [], side: [] }
  );

  }, [currentDeck, currentFormat]);

  // === Card Adding Handlers ===
  const countCopies = (zone, id) => currentDeckData[zone].filter((x) => x === id).length;

  const addCardToDeck = (zone, id) => {
    if (!cards[id]) return;

    const maxPerCard = 3;
    const maxSizes = { main: 60, extra: 15, side: 15 };
    const currentZone = currentDeckData[zone];

    if (currentZone.length >= maxSizes[zone]) return;
    if (countCopies(zone, id) >= maxPerCard) return;

    setCurrentDeckData((prev) => ({
      ...prev,
      [zone]: [...prev[zone], id],
    }));
  };

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
        currentDeckData={currentDeckData}
        setCurrentDeckData={setCurrentDeckData}
      />

      <div className="main-app">
        <CardArea currentCard={currentCard} />

        <DeckArea
          currentFormat={currentFormat}
          currentDeck={currentDeck}
          setCurrentDeck={setCurrentDeck}
          cards={cards}
          setCurrentCard={setCurrentCard}
          currentDeckData={currentDeckData}
          setCurrentDeckData={setCurrentDeckData}
        />

        <TrunkArea
          cards={cards}
          setCards={setCards}
          setCurrentCard={setCurrentCard}
          addToMainDeck={(id) => addCardToDeck('main', id)}
          addToExtraDeck={(id) => addCardToDeck('extra', id)}
          addToSideDeck={(id) => addCardToDeck('side', id)}
        />
      </div>
    </main>
  );
}

export default App;