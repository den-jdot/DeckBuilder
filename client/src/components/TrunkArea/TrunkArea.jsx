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
  sortConfig,
  setSortConfig
}) {
  // Local state for internal card display
  const [cardMap, setCardMap] = useState({});
  const [cardIds, setCardIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Filter state for trunk listing
  const [nameFilter, setNameFilter] = useState("");
  const [humanReadableCardTypeFilter, setHumanReadableCardTypeFilter] = useState(""); //Tuner, Synchro, Flip, Continuous, Counter etc.
  const [frameTypeFilter, setFrameTypeFilter] = useState(""); //Normal, Effect, Ritual, Fusion, Synchro, Xyz, Link
  const [attributeFilter, setAttributeFilter] = useState(""); //DARK, LIGHT, etc.
  const [levelFilter, setLevelFilter] = useState({ min: 0, max: 13 }); //Includes Ranks, Links
  const [atkFilter, setAtkFilter] = useState({ min: 0, max: 10000 });
  const [defFilter, setDefFilter] = useState({ min: 0, max: 10000 });
  const [descFilter, setDescFilter] = useState(""); //Effect Text
  const [raceFilter, setRaceFilter] = useState(""); //Color, ST Icon, Warrior, Spellcaster, etc.
  const [subTypeFilter, setSubTypeFilter] = useState(""); //Tuner, Spirit, Gemini, Union, Flip, etc.
  const [spellFilter, setSpellFilter] = useState(""); //Field, Equip, Quick-Play, etc.
  const [trapFilter, setTrapFilter] = useState(""); //Normal, Continuous, Counter, etc.

  // Pagination setup
  const cardsPerPage = 25;
  const start = currentPage * cardsPerPage;
  const end = start + cardsPerPage;

  const accepted = [];
  const rejected = [];

  for (const id of cardIds) {
    const card = cardMap[id];
    if (!card) {
      rejected.push({ id, reason: "Missing card data" });
      continue;
    }

    // OLD NAME FILTER
    // if (!card.name.toLowerCase().includes(nameFilter.toLowerCase())) {
    //   rejected.push({ id, name: card.name, reason: "Name filter" });
    //   continue;
    // }

    if (nameFilter) {
      const terms = nameFilter.toLowerCase().split(/\s+/);
      const cardName = card.name?.toLowerCase() ?? "";
      const allTermsMatch = terms.every(term => cardName.includes(term));
      if (!allTermsMatch) {
        rejected.push({ id, name: card.name, reason: "Description filter" });
        continue;
      }
    }

    if (descFilter) {
      const terms = descFilter.toLowerCase().split(/\s+/);
      const cardDesc = card.desc?.toLowerCase() ?? "";
      const allTermsMatch = terms.every(term => cardDesc.includes(term));
      if (!allTermsMatch) {
        rejected.push({ id, name: card.name, reason: "Description filter" });
        continue;
      }
    }

    if (humanReadableCardTypeFilter.length > 0 &&
      !humanReadableCardTypeFilter.some(term =>
        card.humanReadableCardType?.toLowerCase().includes(term.toLowerCase())
      )
    ) {
      rejected.push({
        id,
        name: card.name,
        reason: `Missing subtype match: ${card.humanReadableCardType}`
      });
      continue;
    }

    if (frameTypeFilter.length > 0 &&
      !frameTypeFilter.some(term =>
        card.frameType?.toLowerCase().includes(term.toLowerCase())
      )
    ) {
      rejected.push({
        id,
        name: card.name,
        reason: `Missing subtype match: ${card.frameType}`
      });
      continue;
    }

    if (raceFilter && card.race !== raceFilter) {
      rejected.push({ id, name: card.name, reason: "Race filter" });
      continue;
    }

    if (!card.type.toLowerCase().includes(subTypeFilter.toLowerCase())) {
      rejected.push({ id, name: card.name, reason: "Sub Type filter" });
      continue;
    }

    if (attributeFilter &&
      (!card.attribute || !card.attribute.toLowerCase().includes(attributeFilter.toLowerCase()))
    ) {
      rejected.push({ id, name: card.name, reason: "Attribute filter" });
      continue;
    }

    // Pre Check for Stat Filters
    const isMonster = card.type?.toLowerCase().includes("monster");

    const isStatFilterActive =
      levelFilter.min > 0 ||
      levelFilter.max < 13 ||
      atkFilter.min > 0 ||
      atkFilter.max < 10000 ||
      defFilter.min > 0 ||
      defFilter.max < 10000;

    if (isStatFilterActive && !isMonster) {
      rejected.push({ id, name: card.name, reason: "Non-monster excluded due to stat filters" });
      continue;
    }

    if (levelFilter.min != null && card.level < levelFilter.min) {
      rejected.push({ id, name: card.name, reason: `Level ${card.level} < min ${levelFilter.min}` });
      continue;
    }

    if (levelFilter.max != null && card.level > levelFilter.max) {
      rejected.push({ id, name: card.name, reason: `Level ${card.level} > max ${levelFilter.max}` });
      continue;
    }

    const isMeaningfulStat = (val) =>
      typeof val === 'number' && !isNaN(val);

    // ATK filter
    if (
      atkFilter.min != null &&
      card.atk !== -1 &&
      isMeaningfulStat(card.atk) &&
      card.atk < atkFilter.min
    ) {
      rejected.push({ id, name: card.name, reason: `ATK ${card.atk} < min ${atkFilter.min}` });
      continue;
    }

    if (
      atkFilter.max != null &&
      card.atk !== -1 &&
      isMeaningfulStat(card.atk) &&
      card.atk > atkFilter.max
    ) {
      rejected.push({ id, name: card.name, reason: `ATK ${card.atk} > max ${atkFilter.max}` });
      continue;
    }

    // DEF filter
    if (
      defFilter.min != null &&
      card.def !== -1 &&
      isMeaningfulStat(card.def) &&
      card.def < defFilter.min
    ) {
      rejected.push({ id, name: card.name, reason: `DEF ${card.def} < min ${defFilter.min}` });
      continue;
    }

    if (
      defFilter.max != null &&
      card.def !== -1 &&
      isMeaningfulStat(card.def) &&
      card.def > defFilter.max
    ) {
      rejected.push({ id, name: card.name, reason: `DEF ${card.def} > max ${defFilter.max}` });
      continue;
    }

    // Spell and Trap filters
    if (!card.race.toLowerCase().includes(spellFilter.toLowerCase())) {
      rejected.push({ id, name: card.name, reason: "Sub Type filter" });
      continue;
    }

    if (!card.race.toLowerCase().includes(trapFilter.toLowerCase())) {
      rejected.push({ id, name: card.name, reason: "Sub Type filter" });
      continue;
    }

    accepted.push(id);
  }

  // console.log("❌ Rejected cards:", rejected);
  // console.log("✅ Accepted card count:", accepted.length);

  const filteredIds = accepted;
  
  const sortedIds = [...filteredIds].sort((a, b) => {
    const cardA = cardMap[a];
    const cardB = cardMap[b];

    for (const { field, direction } of sortConfig) {
      let valA = cardA?.[field];
      let valB = cardB?.[field];

      // Normalize special values (e.g., "?" or null or undefined)
      if (valA === "?" || valA === undefined || valA === null) valA = NaN;
      if (valB === "?" || valB === undefined || valB === null) valB = NaN;

      // If both are numbers (e.g. atk/def/level), compare numerically
      if (typeof valA === "number" && typeof valB === "number") {
        if (isNaN(valA) && isNaN(valB)) continue;
        if (isNaN(valA)) return 1;
        if (isNaN(valB)) return -1;

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        continue;
      }

      // Otherwise treat as strings
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return direction === "asc" ? -1 : 1;
      if (strA > strB) return direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  
  const visibleIds = sortedIds.slice(start, end);
  const maxPages = Math.ceil(sortedIds.length / cardsPerPage);

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
      console.log(`Dropped ${droppedId} onto TrunkArea (no-op here)`);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [nameFilter,
      descFilter,
      humanReadableCardTypeFilter,
      frameTypeFilter,
      attributeFilter,
      levelFilter.min,
      levelFilter.max,
      atkFilter.min,
      atkFilter.max,
      defFilter.min,
      defFilter.max,
      raceFilter,
      subTypeFilter,
      spellFilter,
      trapFilter,]);

  return (
    <div
      className="trunk-area"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <TrunkFilter
        nameFilter={nameFilter} setNameFilter={setNameFilter}
        humanReadableCardTypeFilter={humanReadableCardTypeFilter} setHumanReadableCardTypeFilter={setHumanReadableCardTypeFilter}
        frameTypeFilter={frameTypeFilter} setFrameTypeFilter={setFrameTypeFilter}
        attributeFilter={attributeFilter} setAttributeFilter={setAttributeFilter}
        levelFilter={levelFilter} setLevelFilter={setLevelFilter}
        atkFilter={atkFilter} setAtkFilter={setAtkFilter}
        defFilter={defFilter} setDefFilter={setDefFilter}
        descFilter={descFilter} setDescFilter={setDescFilter}
        raceFilter={raceFilter} setRaceFilter={setRaceFilter}
        subTypeFilter={subTypeFilter} setSubTypeFilter={setSubTypeFilter}
        spellFilter={spellFilter} setSpellFilter={setSpellFilter}
        trapFilter={trapFilter} setTrapFilter={setTrapFilter}
        sortConfig={sortConfig} setSortConfig={setSortConfig}
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
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
      />
      <TrunkNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        maxPages={maxPages}
      />
    </div>
  );
}