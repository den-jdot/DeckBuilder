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
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const extraDeckCards = currentDeckData.extra
    .map((id) => cards[String(id)])
    .filter(
      (card) =>
        card &&
        EXTRA_DECK_TYPES.some((type) =>
          card.type?.toLowerCase().includes(type.toLowerCase())
        )
    );

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
        border: isDraggingOver ? '2px dashed #8e44ad' : '2px dashed transparent',
        transition: 'border 0.2s ease',
        boxSizing: 'border-box',
      }}
    >
      <div className="deck-header">
        <div className="deck-counter">
          <div className="name-box">EXTRA</div>
          <Stack direction="row" spacing={1}>
            <Button sx={{ backgroundColor: '#676e73ff', color: 'white' }}>
              {extraDeckCards.length}
            </Button>
          </Stack>
        </div>

        <div className="type-counter">
          <Stack direction="row" spacing={1}>
            <Button sx={{ backgroundColor: '#9c27b0', color: 'white' }}>
              {
                extraDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('fusion')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#d0d0d0ff', color: 'black' }}>
              {
                extraDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('synchro')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#191919ff', color: 'white' }}>
              {
                extraDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('xyz')
                ).length
              }
            </Button>
            <Button sx={{ backgroundColor: '#2196f3', color: 'white' }}>
              {
                extraDeckCards.filter((card) =>
                  card.humanReadableCardType?.toLowerCase().includes('link')
                ).length
              }
            </Button>
          </Stack>
        </div>
      </div>

      <div className="sub-deck-card-grid">
        {extraDeckCards.map((card, index) => (
          <img
            key={`${card.id}-${index}`}
            src={card.card_images?.[0]?.image_url_small}
            alt={card.name}
            className="deck-card-entry"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData('text/plain', String(card.id))
            }
            onDoubleClick={() => addCard(String(card.id))}
            onContextMenu={(e) => {
              e.preventDefault();
              removeCard(card.id);
            }}
            onClick={() => {
              setCurrentCard(card);
              console.log('Clicked card:', card);
            }}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '80px',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
            title="Double-click to remove / Right-click to add duplicate"
          />
        ))}
      </div>
    </div>
  );
}
