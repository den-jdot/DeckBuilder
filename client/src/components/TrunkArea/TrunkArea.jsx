import { useEffect, useState } from 'react';
import TrunkFilter from '../TrunkComponents/TrunkFilter';
import TrunkListing from '../TrunkComponents/TrunkListing';
import TrunkNav from '../TrunkComponents/TrunkNav';

export default function TrunkArea({
  cards,
  setCurrentCard,
  addCard,
  currentDeckData,
  setCurrentDeckData,
  sortConfig,
  setSortConfig,
  banStatus,
  banlist,
  hoverCard,
  setHoverCard,
  hoverTimeout
}) {
  // Local pagination and filtering state
  const [cardIds, setCardIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [nameFilter, setNameFilter] = useState("");
  const [humanReadableCardTypeFilter, setHumanReadableCardTypeFilter] = useState([]);
  const [frameTypeFilter, setFrameTypeFilter] = useState([]);
  const [attributeFilter, setAttributeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState({ min: 0, max: 13 });
  const [atkFilter, setAtkFilter] = useState({ min: 0, max: 10000 });
  const [defFilter, setDefFilter] = useState({ min: 0, max: 10000 });
  const [descFilter, setDescFilter] = useState("");
  const [raceFilter, setRaceFilter] = useState("");
  const [subTypeFilter, setSubTypeFilter] = useState("");
  const [spellFilter, setSpellFilter] = useState("");
  const [trapFilter, setTrapFilter] = useState("");
  const [scaleFilter, setScaleFilter] = useState({ min: 0, max: 13 });
  const [banFilter, setBanFilter] = useState([]); // "", "0", "1", "2"

  const cardsPerPage = 25;
  const start = currentPage * cardsPerPage;
  const end = start + cardsPerPage;

  // Recompute cardIds whenever the cards prop updates
  useEffect(() => {
    setCardIds(Object.keys(cards));
  }, [cards]);

  // Apply filters
  const accepted = [];

  for (const id of cardIds) {
    const card = cards[id];
    if (!card) continue;

    // --- Name filter ---
    if (nameFilter) {
      const terms = nameFilter.toLowerCase().split(/\s+/);
      const cardName = card.name?.toLowerCase() ?? "";
      if (!terms.every(term => cardName.includes(term))) continue;
    }

    // --- Desc filter ---
    if (descFilter) {
      const terms = descFilter.toLowerCase().split(/\s+/);
      const cardDesc = card.desc?.toLowerCase() ?? "";
      if (!terms.every(term => cardDesc.includes(term))) continue;
    }

    // --- Human-readable type filter ---
    if (
      humanReadableCardTypeFilter.length > 0 &&
      !humanReadableCardTypeFilter.some(term =>
        card.humanReadableCardType?.toLowerCase().includes(term.toLowerCase())
      )
    ) continue;

    // --- Frame type filter ---
    if (
      frameTypeFilter.length > 0 &&
      !frameTypeFilter.some(term =>
        card.frameType?.toLowerCase().includes(term.toLowerCase())
      )
    ) continue;

    // --- Race & sub-type filter ---
    if (raceFilter && card.race !== raceFilter) continue;
    if (subTypeFilter && !card.type.toLowerCase().includes(subTypeFilter.toLowerCase())) continue;

    // --- Attribute filter ---
    if (
      attributeFilter &&
      (!card.attribute || !card.attribute.toLowerCase().includes(attributeFilter.toLowerCase()))
    ) continue;

    // --- Level/ATK/DEF filters ---
    const isMonster = card.type?.toLowerCase().includes("monster");

    const isStatFilterActive =
      levelFilter.min > 0 || levelFilter.max < 13 ||
      atkFilter.min > 0 || atkFilter.max < 10000 ||
      defFilter.min > 0 || defFilter.max < 10000;

    if (isStatFilterActive && !isMonster) continue;

    if (levelFilter.min && card.level < levelFilter.min) continue;
    if (levelFilter.max && card.level > levelFilter.max) continue;

    if (atkFilter.min && card.atk !== -1 && card.atk < atkFilter.min) continue;
    if (atkFilter.max && card.atk !== -1 && card.atk > atkFilter.max) continue;

    if (defFilter.min && card.def !== -1 && card.def < defFilter.min) continue;
    if (defFilter.max && card.def !== -1 && card.def > defFilter.max) continue;

    // --- Pendulum Scale filter ---
    const scaleActive = scaleFilter.min > 0 || scaleFilter.max < 13;
    if (scaleActive) {
      if (typeof card.scale !== 'number') continue;
      if (card.scale < scaleFilter.min || card.scale > scaleFilter.max) continue;
    }

    // --- Spell/Trap subtype filters ---
    if (spellFilter && !card.race.toLowerCase().includes(spellFilter.toLowerCase())) continue;
    if (trapFilter && !card.race.toLowerCase().includes(trapFilter.toLowerCase())) continue;

    // --- Banlist filter ---
    if (banFilter.length > 0 && !banFilter.includes(card.banStatus)) continue;

    accepted.push(id);
  }

  // Sort and paginate
  const sortedIds = [...accepted].sort((a, b) => {
    const cardA = cards[a];
    const cardB = cards[b];

    for (const { field, direction } of sortConfig) {
      let valA = cardA?.[field];
      let valB = cardB?.[field];

      // Special handling for frameType sorting
      if (field === "frameType") {
        // Monsters first
        const isMonsterA = cardA.type?.toLowerCase().includes("monster") ? 0 : 1;
        const isMonsterB = cardB.type?.toLowerCase().includes("monster") ? 0 : 1;
        if (isMonsterA !== isMonsterB) return isMonsterA - isMonsterB;

        // Among monsters, Normal first
        const isNormalA = cardA.humanReadableCardType?.toLowerCase().includes("normal") ? 0 : 1;
        const isNormalB = cardB.humanReadableCardType?.toLowerCase().includes("normal") ? 0 : 1;
        if (isNormalA !== isNormalB) return isNormalA - isNormalB;

        // Fall back to string comparison of frameType
        valA = cardA.frameType ?? "";
        valB = cardB.frameType ?? "";
      }

      // Normalize missing/unknown values
      if (valA === "?" || valA === undefined || valA === null) valA = NaN;
      if (valB === "?" || valB === undefined || valB === null) valB = NaN;

      // Numeric comparison
      if (typeof valA === "number" && typeof valB === "number") {
        if (isNaN(valA) && isNaN(valB)) continue;
        if (isNaN(valA)) return 1;
        if (isNaN(valB)) return -1;
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        continue;
      }

      // String comparison
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return direction === "asc" ? -1 : 1;
      if (strA > strB) return direction === "asc" ? 1 : -1;
    }

    // Fallback: alphabetical by card name
    return (cardA.name ?? "").localeCompare(cardB.name ?? "");
  });


  const visibleIds = sortedIds.slice(start, end);
  const maxPages = Math.ceil(sortedIds.length / cardsPerPage);

  // Reset page on filter changes
  useEffect(() => setCurrentPage(0), [
    nameFilter, descFilter, humanReadableCardTypeFilter, frameTypeFilter,
    attributeFilter, levelFilter.min, levelFilter.max,
    atkFilter.min, atkFilter.max, defFilter.min, defFilter.max,
    raceFilter, subTypeFilter, spellFilter, trapFilter,
    scaleFilter.min, scaleFilter.max, banFilter // 👈 added banFilter
  ]);

  return (
    <div className="trunk-area" onDragOver={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()}>
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
        scaleFilter={scaleFilter} setScaleFilter={setScaleFilter}
        banFilter={banFilter} setBanFilter={setBanFilter} // 👈 pass filter state
      />

      <TrunkListing
        cardMap={cards}
        visibleIds={visibleIds}
        setCurrentCard={setCurrentCard}
        addCard={addCard}
        currentDeckData={currentDeckData}
        setCurrentDeckData={setCurrentDeckData}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        banStatus={banStatus}
        banlist={banlist}
        hoverCard={hoverCard}
        setHoverCard={setHoverCard}
        hoverTimeout={hoverTimeout}
      />

      <TrunkNav currentPage={currentPage} setCurrentPage={setCurrentPage} maxPages={maxPages} />
    </div>
  );
}
