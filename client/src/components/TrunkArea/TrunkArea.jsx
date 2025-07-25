import { useEffect, useState } from 'react';
import TrunkFilter from '../TrunkComponents/TrunkFilter';
import TrunkListing from '../TrunkComponents/TrunkListing';
import TrunkNav from '../TrunkComponents/TrunkNav';

export default function TrunkArea({
  cards,
  currentDeck,
  currentDeckIds,
  currentFormat,
  deckNameInput,
  format,
  setCards,
  setCurrentCard,
  setCurrentDeck,
  setCurrentDeckIds,
  setCurrentFormat,
  setDeckNameInput,
  setFormat,
}) {
  // === State ===
  const [cardMap, setCardMap] = useState({});
  const [cardIds, setCardIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // === Constants ===
  const cardsPerPage = 30;
  const maxPages = Math.ceil(cardIds.length / cardsPerPage);
  const start = currentPage * cardsPerPage;
  const end = start + cardsPerPage;
  const visibleIds = cardIds.slice(start, end);

  // === Data Fetch ===
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('/cards/TenguPlant.json');
        const data = await res.json();

        const byId = {};
        const ids = [];

        for (const card of data.data) {
          byId[String(card.id)] = card;
          ids.push(card.id);
        }

        setCardMap(byId);
        setCardIds(ids);
        setCards(byId); // passes cards back to App
      } catch (err) {
        console.error('Error loading cards:', err);
      }
    };

    fetchCards();
  }, [setCards]);

  // === Drag-to-remove handler ===
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData("text/plain");
    if (droppedId) {
      setCurrentDeckIds((prev) => prev.filter((id) => id !== droppedId));
      console.log(`Removed ${droppedId} from Main Deck`);
    }
  };

  // === Render ===
  return (
    <div
      className="trunk-area"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <TrunkFilter />
      <TrunkListing
        cardMap={cardMap}
        visibleIds={visibleIds}
        setCurrentCard={setCurrentCard}
        currentDeckIds={currentDeckIds}
        setCurrentDeckIds={setCurrentDeckIds}
      />
      <TrunkNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        maxPages={maxPages}
      />
    </div>
  );
}
