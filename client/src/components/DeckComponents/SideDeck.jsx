import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function SideDeck({
  cards,
  currentDeckData,
  setCurrentDeckData,
  setCurrentCard,
  addCard,
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // === Filter Side Deck cards (not Extra Deck types) ===
  const sideDeckCards = currentDeckData.side
    .map((id) => cards[String(id)])
    .filter((card) => card); // optionally filter more strictly if needed

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
        border: isDraggingOver ? '2px dashed #c62828' : '2px dashed transparent',
        transition: 'border 0.2s ease',
        boxSizing: 'border-box',
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
        {sideDeckCards.map((card, index) => (
          <img
            key={`${card.id}-${index}`}
            src={card.card_images?.[0]?.image_url_small}
            alt={card.name}
            className="deck-card-entry"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData('text/plain', String(card.id))
            }
            onDoubleClick={() => removeCard(card.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              addCard(String(card.id));
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
