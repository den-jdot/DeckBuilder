import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const EXTRA_DECK_TYPES = [
  "Fusion",
  "Synchro",
  "XYZ",
  "Link",
  "Synchro Pendulum",
  "Fusion Pendulum",
  "XYZ Pendulum"
];

export default function ExtraDeck({
  cards,
  currentDeckData,
  setCurrentDeckData,
  setCurrentCard,
  addCard,
  banStatus, // ✅ new prop for banlist visuals
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const removeCard = (idToRemove) => {
    setCurrentDeckData((prev) => {
      const updatedExtra = [...prev.extra];
      const index = updatedExtra.findIndex((id) => String(id) === String(idToRemove));
      if (index === -1) return prev;
      updatedExtra.splice(index, 1);
      return { ...prev, extra: updatedExtra };
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const droppedId = String(e.dataTransfer.getData('text/plain'));
    if (droppedId) addCard(droppedId);
  };

  const sortedExtraDeckCards = currentDeckData.extra
    .map((id) => cards[String(id)])
    .filter(
      (card) =>
        card &&
        EXTRA_DECK_TYPES.some((type) =>
          card.type?.toLowerCase().includes(type.toLowerCase())
        )
    )
    .sort((cardA, cardB) => {
      const getTypeOrder = (type) => {
        if (!type) return 99;
        type = type.toLowerCase();
        if (type.includes("monster")) return 0;
        if (type.includes("spell")) return 1;
        if (type.includes("trap")) return 2;
        return 3;
      };

      const typeA = getTypeOrder(cardA.type);
      const typeB = getTypeOrder(cardB.type);
      if (typeA !== typeB) return typeA - typeB;

      // Frame type (Fusion < Synchro < XYZ < Link)
      const frameOrder = {
        fusion: 0,
        synchro: 1,
        xyz: 2,
        link: 3,
      };
      const frameA = frameOrder[cardA.frameType?.toLowerCase()] ?? 99;
      const frameB = frameOrder[cardB.frameType?.toLowerCase()] ?? 99;
      if (frameA !== frameB) return frameA - frameB;

      // Level (descending)
      const lvlA = cardA.level ?? -1;
      const lvlB = cardB.level ?? -1;
      if (lvlA !== lvlB) return lvlB - lvlA;

      // ATK (descending)
      const atkA = cardA.atk ?? -1;
      const atkB = cardB.atk ?? -1;
      if (atkA !== atkB) return atkB - atkA;

      // DEF (descending)
      const defA = cardA.def ?? -1;
      const defB = cardB.def ?? -1;
      if (defA !== defB) return defB - defA;

      // Name alphabetical
      return (cardA.name ?? "").localeCompare(cardB.name ?? "");
    });

  return (
    <div
      className="extra-deck"
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
          <div className="name-box">EXTRA</div>
          <Stack direction="row" spacing={1}>
            <Button sx={{ backgroundColor: '#676e73ff', color: 'white' }}>
              {sortedExtraDeckCards.length}
            </Button>
          </Stack>
        </div>

        <div className="type-counter">
          <Stack direction="row" spacing={1}>
            <Button sx={{ backgroundColor: '#9c27b0', color: 'white' }}>
              {
                sortedExtraDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('fusion')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#d0d0d0ff', color: 'black' }}>
              {
                sortedExtraDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('synchro')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#191919ff', color: 'white' }}>
              {
                sortedExtraDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('xyz')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#2196f3', color: 'white' }}>
              {
                sortedExtraDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('link')
                ).length
              }
            </Button>
          </Stack>
        </div>
      </div>

      <div className="sub-deck-card-grid">
        {sortedExtraDeckCards.map((card, index) => {
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
