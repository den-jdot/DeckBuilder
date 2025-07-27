import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function MainDeck({
  cards,
  currentDeckData,
  setCurrentDeckData,
  setCurrentCard,
  addCard,
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
        border: isDraggingOver ? '2px dashed #5f9ea0' : '2px dashed transparent',
        transition: 'border 0.2s ease',
        boxSizing: 'border-box',
      }}
    >
      <div className="deck-header">
        <div className="deck-counter">
          <div className="name-box">MAIN</div>
          <Stack direction="row" spacing={1}>
            <Button sx={{ backgroundColor: '#676e73ff', color: 'white' }}>
              {mainDeckCards.length}
            </Button>
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
        {mainDeckCards.map((card, index) => (
          <img
            key={`${card.id}-${index}`}
            src={card.card_images?.[0]?.image_url_small}
            alt={card.name}
            className="deck-card-entry"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', String(card.id));
            }}
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
              maxWidth: '120px',
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
