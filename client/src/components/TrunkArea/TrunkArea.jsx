import { useEffect, useState } from 'react';
import TrunkFilter from '../TrunkComponents/TrunkFilter';
import TrunkListing from '../TrunkComponents/TrunkListing';
import TrunkNav from '../TrunkComponents/TrunkNav';

export default function TrunkArea({
  cards,
  setCards,
  setCurrentCard,
  addCard,
  currentDeckData,
  setCurrentDeckData,
  currentFormat,
}) {
  // Local state for internal card display
  const [cardMap, setCardMap] = useState({});
  const [cardIds, setCardIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Filter state for trunk listing
  const [nameFilter, setNameFilter] = useState("");  

  // Pagination setup
  const cardsPerPage = 30;
  const start = currentPage * cardsPerPage;
  const end = start + cardsPerPage;

  const filteredIds = cardIds.filter((id) => {
    const card = cardMap[id];

    // Reject if no card (edge case)
    if (!card) return false;

    // Name filter
    if (!card.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;

    // // Type filter (example: "Monster", "Spell", etc.)
    // if (typeFilter && !card.type.toLowerCase().includes(typeFilter.toLowerCase())) return false;

    // // Attribute filter (like "DARK", "LIGHT", etc.)
    // if (attributeFilter && card.attribute !== attributeFilter) return false;

    // // Level filter
    // if (minLevel && card.level < minLevel) return false;
    // if (maxLevel && card.level > maxLevel) return false;

    // // ATK/DEF filter
    // if (minATK && card.atk < minATK) return false;
    // if (maxATK && card.atk > maxATK) return false;

    return true; // Only include cards passing all checks
  });

  const visibleIds = filteredIds.slice(start, end);
  const maxPages = Math.ceil(filteredIds.length / cardsPerPage);



  // Fetch card data from local JSON
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`/cards/${currentFormat}.json`);
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
  }, [setCards, currentFormat]);

  // Allow dropping cards back from decks to trunk
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData("text/plain");
    if (droppedId) {
      // Drop logic is handled by decks; trunk only receives
      console.log(`Dropped ${droppedId} onto TrunkArea (no-op here)`);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [nameFilter]);

  return (
    <div
      className="trunk-area"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <TrunkFilter nameFilter={nameFilter} setNameFilter={setNameFilter} />
      <TrunkListing
        cardMap={cards}
        visibleIds={visibleIds}
        setCurrentCard={setCurrentCard}
        addCard={addCard}
        currentDeckData={currentDeckData}
        setCurrentDeckData={setCurrentDeckData}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
      />
      <TrunkNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        maxPages={maxPages}
      />
    </div>
  );
}
