import { useEffect, useState, useRef } from 'react';
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

  // Sorting state
  const [sortConfig, setSortConfig] = useState(
    [{ field: '', direction: 'asc' }]  // Default sort by name ascending
  );

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
    console.log(`Current format set to: ${currentFormat}`);
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

  // Function to add a card to the current deck
  // const addCardToDeck = (zone, id) => {
  //   if (!cards[id]) return;

  //   const maxPerCard = 3;
  //   const maxSizes = { main: 60, extra: 15, side: 15 };
  //   const currentZone = currentDeckData[zone];

  //   if (currentZone.length >= maxSizes[zone]) return;
  //   if (countCopies(zone, id) >= maxPerCard) return;

  //   setCurrentDeckData((prev) => ({
  //     ...prev,
  //     [zone]: [...prev[zone], id],
  //   }));
  // };

  const EXTRA_DECK_TYPES = [
    'Fusion',
    'Synchro',
    'XYZ',
    'Link',
    'Synchro Pendulum',
    'Fusion Pendulum',
    'XYZ Pendulum',
  ];

  const isExtraType = (card) =>
    EXTRA_DECK_TYPES.some((type) =>
      card?.type?.toLowerCase().includes(type.toLowerCase())
    );

  const countCopies = (id) => (
    currentDeckData.main.filter((x) => x === id).length +
    currentDeckData.extra.filter((x) => x === id).length +
    currentDeckData.side.filter((x) => x === id).length
  );

  const totalCountOf = (predicate) => (
    currentDeckData.main.filter((id) => predicate(cards[String(id)])).length +
    currentDeckData.extra.filter((id) => predicate(cards[String(id)])).length +
    currentDeckData.side.filter((id) => predicate(cards[String(id)])).length
  );

  // const inFlightAddRef = useRef({}); // key: id, value: timestamp

  const addCard = (id, zone) => {
    const card = cards[String(id)];
    if (!card) return;

    // const now = Date.now();
    // const lastAddTime = inFlightAddRef.current[id] || 0;

    // // Prevent repeated adds within 200ms
    // if (now - lastAddTime < 200) {
    //   console.log(`Prevented rapid duplicate add of ${id}`);
    //   return;
    // }

    // inFlightAddRef.current[id] = now;

    const totalCopies = countCopies(id);
    if (totalCopies >= 3) {
      console.log('Maximum 3 copies allowed.');
      return;
    }

    const mainDeckCount = totalCountOf((c) => !isExtraType(c));
    const extraDeckCount = totalCountOf((c) => isExtraType(c));
    const sideDeckCount = totalCountOf(() => true) - mainDeckCount - extraDeckCount;

    if (zone === 'main') {
      if (isExtraType(card)) {
        console.log('Card is Extra Deck type, cannot add to Main Deck.');
        return;
      }
      if (mainDeckCount >= 60) {
        console.log('Main Deck is full (60 cards max).');
        return;
      }
    } else if (zone === 'extra') {
      if (!isExtraType(card)) {
        console.log('Card is not an Extra Deck type.');
        return;
      }
      if (extraDeckCount >= 15) {
        console.log('Extra Deck is full (15 cards max).');
        return;
      }
    } else if (zone === 'side') {
      if (sideDeckCount >= 15) {
        console.log('Side Deck is full (15 cards max).');
        return;
      }
    }

    setCurrentDeckData((prev) => ({
      ...prev,
      [zone]: [...prev[zone], id],
    }));
    console.log(`Added card ${id} to ${zone} deck.`);
  };



  return (
    <main>
      <div className="main-app">
        <div className="left-app">
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

          <div className="lower-app">

            <CardArea currentCard={currentCard} />

            <DeckArea
              currentFormat={currentFormat}
              currentDeck={currentDeck}
              setCurrentDeck={setCurrentDeck}
              cards={cards}
              setCurrentCard={setCurrentCard}
              currentDeckData={currentDeckData}
              setCurrentDeckData={setCurrentDeckData}
              addCard={addCard}
            />
          </div>

        </div>

      

        <TrunkArea
          cards={cards}
          setCards={setCards}
          setCurrentCard={setCurrentCard}
          addCard={addCard}
          currentDeckData={currentDeckData}
          setCurrentDeckData={setCurrentDeckData}
          currentFormat={currentFormat}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
        />

      </div>
      
    </main>
  );
}

export default App;