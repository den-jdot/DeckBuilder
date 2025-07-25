import { useEffect, useState } from 'react';
import TrunkFilter from '../TrunkComponents/TrunkFilter';
import TrunkListing from '../TrunkComponents/TrunkListing';
import TrunkNav from '../TrunkComponents/TrunkNav';

export default function TrunkArea({
  cards,
  setCards,
  setCurrentCard,
  addToMainDeck,
  addToExtraDeck,
  addToSideDeck,
  addCard,
  currentDeckData,
}) {
  // Local state for internal card display
  const [cardMap, setCardMap] = useState({});
  const [cardIds, setCardIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Pagination setup
  const cardsPerPage = 30;
  const start = currentPage * cardsPerPage;
  const end = start + cardsPerPage;
  const visibleIds = cardIds.slice(start, end);
  const maxPages = Math.ceil(cardIds.length / cardsPerPage);

  // Fetch card data from local JSON
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('/cards/TenguPlant.json');
        const data = await res.json();

        const byId = {};
        const ids = [];

        for (const card of data.data) {
          const stringId = String(card.id);
          byId[stringId] = card;
          ids.push(stringId);
        }

        setCardMap(byId);
        setCardIds(ids);
        setCards(byId); // Sync with parent
      } catch (err) {
        console.error('Error loading cards:', err);
      }
    };

    fetchCards();
  }, [setCards]);

  // Allow dropping cards back from decks to trunk
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData("text/plain");
    if (droppedId) {
      // Drop logic is handled by decks; trunk only receives
      console.log(`Dropped ${droppedId} onto TrunkArea (no-op here)`);
    }
  };

  return (
    <div
      className="trunk-area"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <TrunkFilter />
      <TrunkListing
        cardMap={cards}
        visibleIds={visibleIds}
        setCurrentCard={setCurrentCard}
        addToMainDeck={addToMainDeck}
        addToExtraDeck={addToExtraDeck}
        addToSideDeck={addToSideDeck}
        addCard={addCard}
        currentDeckData={currentDeckData}
      />
      <TrunkNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        maxPages={maxPages}
      />
    </div>
  );
}
