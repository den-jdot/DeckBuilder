import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function SideDeck({
  cards,
  currentDeckData,
  setCurrentDeckData,
  setCurrentCard,
  addCard,
  banStatus, // ✅ for banlist badge
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const typeOrder = { Monster: 0, Spell: 1, Trap: 2 };

  const defaultSortDeck = (cardA, cardB) => {
    const typeA = cardA.type?.includes("Monster")
      ? "Monster"
      : cardA.type?.includes("Spell")
      ? "Spell"
      : cardA.type?.includes("Trap")
      ? "Trap"
      : "Other";

    const typeB = cardB.type?.includes("Monster")
      ? "Monster"
      : cardB.type?.includes("Spell")
      ? "Spell"
      : cardB.type?.includes("Trap")
      ? "Trap"
      : "Other";

    const orderA = typeOrder[typeA] ?? 99;
    const orderB = typeOrder[typeB] ?? 99;
    if (orderA !== orderB) return orderA - orderB;

    const lvlA = cardA.level ?? -1;
    const lvlB = cardB.level ?? -1;
    if (lvlA !== lvlB) return lvlB - lvlA;

    const atkA = cardA.atk ?? -1;
    const atkB = cardB.atk ?? -1;
    if (atkA !== atkB) return atkA - atkB;

    const defA = cardA.def ?? -1;
    const defB = cardB.def ?? -1;
    if (defA !== defB) return defA - defB;

    return (cardA.name ?? "").localeCompare(cardB.name ?? "");
  };

  // Sorted side deck cards
  const sideDeckCards = currentDeckData.side
    .map((id) => cards[String(id)])
    .filter((card) => card)
    .sort(defaultSortDeck);

  const removeCard = (idToRemove) => {
    setCurrentDeckData((prev) => {
      const updatedSide = [...prev.side];
      const index = updatedSide.findIndex((id) => String(id) === String(idToRemove));
      if (index === -1) return prev;
      updatedSide.splice(index, 1);
      return { ...prev, side: updatedSide };
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const droppedId = String(e.dataTransfer.getData('text/plain'));
    if (droppedId) addCard(droppedId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <div
      className="side-deck"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        backgroundColor: isDraggingOver ? '#eef' : 'transparent',
        transition: 'background-color 0.2s',
      }}
    >
      <div className="deck-header">
        <div className="deck-counter">
          <div className="name-box">SIDE</div>
          <Stack direction="row" spacing={1}>
            <Button sx={{ backgroundColor: '#676e73ff', color: 'white' }}>
              {sideDeckCards.length}
            </Button>
          </Stack>
        </div>
      </div>

      <div className="sub-deck-card-grid">
        {sideDeckCards.map((card, index) => {
          const status = banStatus(card.name); // ✅ banlist status

          return (
            <div
              key={`${card.id}-${index}`}
              className="deck-card-entry"
              style={{ position: 'relative', cursor: 'pointer' }}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData('text/plain', String(card.id))
              }
              onDoubleClick={() => addCard(String(card.id))}
              onContextMenu={(e) => {
                e.preventDefault();
                removeCard(card.id);
              }}
              onClick={() => setCurrentCard(card)}
              title="Double-click to remove / Right-click to add duplicate"
            >
              <div className="card-wrapper">
                <img
                  src={card.card_images?.[0]?.image_url_small}
                  alt={card.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '80px',
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
