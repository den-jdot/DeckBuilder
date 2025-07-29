import { useEffect, useState } from 'react';
import './App.css';

import UpperArea from './components/UpperArea/UpperArea.jsx';
import CardArea from './components/CardArea/CardArea.jsx';
import DeckArea from './components/DeckArea/DeckArea.jsx';
import TrunkArea from './components/TrunkArea/TrunkArea.jsx';

function App() {
  // --- Card & Deck State ---
  const [cards, setCards] = useState({});
  const [currentCard, setCurrentCard] = useState(null);
  const [currentDeckData, setCurrentDeckData] = useState({ main: [], extra: [], side: [] });

  // --- Auto-import all card JSONs (incremental) ---
  const cardFiles = import.meta.glob('./cards/*.json', { eager: true });
  const DEFAULT_FORMATS = Object.keys(cardFiles)
    .map((path) => ({ name: path.split('/').pop().replace('.json', ''), decks: {} }))
    .sort((a, b) => a.name.localeCompare(b.name)); // chronological by filename

  // --- Format & Deck Metadata ---
  const [format, setFormat] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('format'));
      return Array.isArray(stored) ? stored : DEFAULT_FORMATS;
    } catch {
      return DEFAULT_FORMATS;
    }
  });

  const [currentFormat, setCurrentFormat] = useState(() => {
    try {
      return localStorage.getItem('currentFormat') ?? DEFAULT_FORMATS[0]?.name ?? '';
    } catch {
      return DEFAULT_FORMATS[0]?.name ?? '';
    }
  });

  const [currentDeck, setCurrentDeck] = useState(() => {
    try {
      return localStorage.getItem('currentDeck') ?? '';
    } catch {
      return '';
    }
  });

  const [deckNameInput, setDeckNameInput] = useState(currentDeck);

  // --- Sorting ---
  const [sortConfig, setSortConfig] = useState([{ field: 'name', direction: 'asc' }]);

  // --- LocalStorage Sync ---
  useEffect(() => localStorage.setItem('format', JSON.stringify(format)), [format]);
  useEffect(() => localStorage.setItem('currentFormat', currentFormat), [currentFormat]);
  useEffect(() => localStorage.setItem('currentDeck', currentDeck), [currentDeck]);

  // --- Sync deckNameInput when deck changes ---
  useEffect(() => setDeckNameInput(currentDeck), [currentDeck]);

  // --- Auto-add new formats if new JSONs appear ---
  useEffect(() => {
    const existingNames = new Set(format.map((f) => f.name));
    const missing = DEFAULT_FORMATS.filter((f) => !existingNames.has(f.name));
    if (missing.length > 0) setFormat((prev) => [...prev, ...missing]);
  }, []);

  // --- Save current deck into format state ---
  useEffect(() => {
    if (!currentDeck || !currentFormat) return;
    const normalize = (list) => list.map(String);

    setFormat((prevFormats) =>
      prevFormats.map((f) =>
        f.name === currentFormat
          ? {
              ...f,
              decks: {
                ...f.decks,
                [currentDeck]: {
                  main: normalize(currentDeckData.main),
                  extra: normalize(currentDeckData.extra),
                  side: normalize(currentDeckData.side),
                },
              },
            }
          : f
      )
    );
  }, [currentDeckData, currentDeck, currentFormat]);

  // --- Load deck when format or deck changes ---
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

  // --- Merge card JSONs up to the selected format ---
  useEffect(() => {
    const buildCardPool = async () => {
      try {
        const sortedFormats = Object.keys(cardFiles)
          .map((path) => path.split("/").pop().replace(".json", ""))
          .sort();

        const currentIndex = sortedFormats.indexOf(currentFormat);
        if (currentIndex === -1) return;

        const byId = {};
        const ids = [];

        for (let i = 0; i <= currentIndex; i++) {
          const fmtName = sortedFormats[i];
          const filePath = Object.keys(cardFiles).find((path) =>
            path.includes(fmtName + ".json")
          );
          if (!filePath) continue;

          const rawData = cardFiles[filePath].data ?? cardFiles[filePath];
          const cardsArray = Array.isArray(rawData.data) ? rawData.data : rawData;

          for (const card of cardsArray) {
            const stringId = String(card.id);
            if (!byId[stringId]) ids.push(stringId);
            byId[stringId] = card;
          }
        }

        setCards(byId);
        console.log(`✅ Card pool for ${currentFormat}: ${ids.length} cards loaded.`);
      } catch (err) {
        console.error("❌ Error building card pool:", err);
      }
    };

    buildCardPool();
  }, [currentFormat]);

  // --- Deck Adding Logic ---
  const EXTRA_DECK_TYPES = ['Fusion', 'Synchro', 'XYZ', 'Link', 'Synchro Pendulum', 'Fusion Pendulum', 'XYZ Pendulum'];
  const isExtraType = (card) => EXTRA_DECK_TYPES.some((type) => card?.type?.toLowerCase().includes(type.toLowerCase()));

  const countCopies = (id) => {
    const strId = String(id);
    return (
      currentDeckData.main.filter((x) => String(x) === strId).length +
      currentDeckData.extra.filter((x) => String(x) === strId).length +
      currentDeckData.side.filter((x) => String(x) === strId).length
    );
  };

  const totalCountOf = (predicate) =>
    currentDeckData.main.filter((id) => predicate(cards[String(id)])).length +
    currentDeckData.extra.filter((id) => predicate(cards[String(id)])).length +
    currentDeckData.side.filter((id) => predicate(cards[String(id)])).length;

  const addCard = (id, zone) => {
    const card = cards[String(id)];
    if (!card) return;

    const totalCopies = countCopies(id);
    if (totalCopies >= 3) return;

    const mainDeckCount = totalCountOf((c) => !isExtraType(c));
    const extraDeckCount = totalCountOf((c) => isExtraType(c));
    const sideDeckCount = totalCountOf(() => true) - mainDeckCount - extraDeckCount;

    if (zone === 'main') {
      if (isExtraType(card) || mainDeckCount >= 60) return;
    } else if (zone === 'extra') {
      if (!isExtraType(card) || extraDeckCount >= 15) return;
    } else if (zone === 'side') {
      if (sideDeckCount >= 15) return;
    }

    setCurrentDeckData((prev) => ({ ...prev, [zone]: [...prev[zone], id] }));
  };

  // --- Render ---
  return (
    <main>
      <div className="main-app">
        <div className="left-app">
          <UpperArea
            setCards={setCards}
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
