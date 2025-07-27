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
  const [typeLineFilter, setTypeLineFilter] = useState(""); //Warrior, Tuner, Synchro Flip, etc.
  const [attributeFilter, setAttributeFilter] = useState(""); //DARK, LIGHT, etc.
  const [levelFilter, setLevelFilter] = useState({ min: 0, max: 13 }); //Includes Ranks, Links
  const [atkFilter, setAtkFilter] = useState({ min: 0, max: 10000 });
  const [defFilter, setDefFilter] = useState({ min: 0, max: 10000 });
  const [descFilter, setDescFilter] = useState(""); //Effect Text
  const [cardTypeFilter, setCardTypeFilter] = useState(""); //Color, ST Icon

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

    // Desc filter (example: Effect Description)
    if (descFilter) {
      const terms = descFilter.toLowerCase().split(/\s+/); // split on whitespace
      const cardDesc = card.desc?.toLowerCase() ?? "";

      const allTermsMatch = terms.every(term => cardDesc.includes(term));
      if (!allTermsMatch) return false;
    }

    // // Attribute filter (like "DARK", "LIGHT", etc.)
    // if (attributeFilter && card.attribute !== attributeFilter) return false;

    // Level filter
    if (levelFilter.min != null && card.level < levelFilter.min) return false;
    if (levelFilter.max != null && card.level > levelFilter.max) return false;

    // ATK filter
    if (atkFilter.min != null && card.atk < atkFilter.min) return false;
    if (atkFilter.max != null && card.atk > atkFilter.max) return false;

    // DEF filter
    if (defFilter.min != null && card.def < defFilter.min) return false;
    if (defFilter.max != null && card.def > defFilter.max) return false;

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
      <TrunkFilter
        nameFilter={nameFilter} setNameFilter={setNameFilter}
        typeLineFilter={typeLineFilter} setTypeLineFilter={setTypeLineFilter}
        attributeFilter={attributeFilter} setAttributeFilter={setAttributeFilter}
        levelFilter={levelFilter} setLevelFilter={setLevelFilter}
        atkFilter={atkFilter} setAtkFilter={setAtkFilter}
        defFilter={defFilter} setDefFilter={setDefFilter}
        descFilter={descFilter} setDescFilter={setDescFilter}
        cardTypeFilter={cardTypeFilter} setCardTypeFilter={setCardTypeFilter}
      />
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
