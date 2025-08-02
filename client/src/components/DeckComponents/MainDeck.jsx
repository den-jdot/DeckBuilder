import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function MainDeck({
  cards,
  currentDeckData,
  setCurrentDeckData,
  setCurrentCard,
  addCard,
  banStatus,
  hoverCard,
  setHoverCard,
  hoverTimeout
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const mainDeckCards = currentDeckData.main
    .map((id) => cards[String(id)])
    .filter(
      (card) =>
        card &&
        !card.type?.toLowerCase().includes('fusion') &&
        !card.type?.toLowerCase().includes('synchro') &&
        !card.type?.toLowerCase().includes('xyz') &&
        !card.type?.toLowerCase().includes('link')
    );

  const removeCard = (idToRemove) => {
    setCurrentDeckData((prev) => {
      const zone = [...prev.main];
      const index = zone.findIndex((id) => String(id) === String(idToRemove));
      if (index === -1) return prev;
      zone.splice(index, 1);
      return { ...prev, main: zone };
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const droppedId = String(e.dataTransfer.getData('text/plain'));
    if (droppedId) addCard(droppedId, 'main');
  };

  const defaultSortDeck = (cardA, cardB) => {
    const typeOrder = { Monster: 0, Spell: 1, Trap: 2 };

    const typeA = cardA.type?.includes("Monster") ? "Monster" :
                  cardA.type?.includes("Spell")   ? "Spell" :
                  cardA.type?.includes("Trap")    ? "Trap" : "Other";

    const typeB = cardB.type?.includes("Monster") ? "Monster" :
                  cardB.type?.includes("Spell")   ? "Spell" :
                  cardB.type?.includes("Trap")    ? "Trap" : "Other";

    const orderA = typeOrder[typeA] ?? 100;
    const orderB = typeOrder[typeB] ?? 100;
    if (orderA !== orderB) return orderA - orderB;

    const lvlA = cardA.level ?? -1;
    const lvlB = cardB.level ?? -1;
    if (lvlA !== lvlB) return lvlB - lvlA;

    const atkA = cardA.atk ?? -1;
    const atkB = cardB.atk ?? -1;
    if (atkA !== atkB) return atkB - atkA;

    const defA = cardA.def ?? -1;
    const defB = cardB.def ?? -1;
    if (defA !== defB) return defB - defA;

    const raceA = cardA.race ?? "";
    const raceB = cardB.race ?? "";
    // Put "Normal" first
    if (raceA === "Normal" && raceB !== "Normal") return -1;
    if (raceB === "Normal" && raceA !== "Normal") return 1;

    if (raceA !== raceB) return raceA.localeCompare(raceB);

    return (cardA.name ?? "").localeCompare(cardB.name ?? "");
  };

  const applySort = () => {
    const sorted = [...currentDeckData.main]
      .map((id) => cards[String(id)])
      .filter((card) => !!card)
      .sort(defaultSortDeck)
      .map((card) => String(card.id));

    setCurrentDeckData((prev) => ({
      ...prev,
      main: sorted,
    }));
  };

  const applyShuffle = () => {
    const shuffled = [...currentDeckData.main];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCurrentDeckData((prev) => ({
      ...prev,
      main: shuffled,
    }));
  };

  return (
    <div
      className="main-deck"
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      style={{
        backgroundColor: isDraggingOver ? '#eef' : 'transparent',
        transition: 'background-color 0.2s',
      }}
    >
      <div className="deck-header">
        <div className="deck-counter">
          <div className="name-box">MAIN</div>
          <Stack direction="row" spacing={1}>
            <Button sx={{ backgroundColor: '#676e73ff', color: 'white' }}>
              {mainDeckCards.length}
            </Button>
            <div className="deck-sort-controls card-type-buttons">
              <button onClick={applySort}>Sort</button>
              <button onClick={applyShuffle}>Shuffle</button>
            </div>
          </Stack>
        </div>

        <div className="type-counter">
          <Stack direction="row" spacing={1}>
            <Button sx={{ backgroundColor: '#ac9f27ff', color: 'white' }}>
              {
                mainDeckCards.filter(
                  (card) =>
                    !card.humanReadableCardType?.toLowerCase().includes('effect') &&
                    card.humanReadableCardType?.toLowerCase().includes('monster') &&
                    !card.humanReadableCardType?.toLowerCase().includes('ritual')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#c56c14ff', color: 'white' }}>
              {
                mainDeckCards.filter(
                  (card) =>
                    card.humanReadableCardType?.toLowerCase().includes('effect') &&
                    card.humanReadableCardType?.toLowerCase().includes('monster') &&
                    !card.humanReadableCardType?.toLowerCase().includes('ritual')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#095492ff', color: 'white' }}>
              {
                mainDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('ritual')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#1e9f3eff', color: 'white' }}>
              {
                mainDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('spell')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#e91e63', color: 'white' }}>
              {
                mainDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('trap')
                ).length
              }
            </Button>
          </Stack>
        </div>
      </div>

      <div className="deck-card-grid">
        {mainDeckCards.map((card, index) => {
          const status = banStatus(card.name); // ✅ define status here

          return (
            <div
              key={`${card.id}-${index}`}
              className="deck-card-entry"
              style={{ position: 'relative', cursor: 'pointer' }}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', String(card.id))}
              onDoubleClick={() => addCard(String(card.id))}
              onContextMenu={(e) => {
                e.preventDefault();
                removeCard(card.id);
              }}
              onClick={() => {setCurrentCard(card); console.log('Clicked card object:', card);}}
              title="Double-click to remove / Right-click to add duplicate"
              onMouseEnter={() => {
                if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                setHoverCard(card);
              }}
              onMouseLeave={() => {
                if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                hoverTimeout.current = setTimeout(() => setHoverCard(null), 150);
              }}
            >
              <div className="card-wrapper">
                <img
                  src={card.card_images?.[0]?.image_url_small}
                  alt={card.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100px',
                    objectFit: 'contain',
                    
                  }}
                />
                {status && (
                  <div className={`ban-badge ${status}`}>
                    {status === "banned" ? "0" : status === "limited" ? "1" : "2"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
