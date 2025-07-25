import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function MainDeck({ cards, currentDeckIds, setCurrentDeckIds, setCurrentCard, currentFormat }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const mainDeckCards = currentDeckIds
    .map((id) => cards[String(id)])
    .filter(Boolean);

  const canAddCard = (id) => {
    const count = currentDeckIds.filter((x) => x === id).length;
    if (currentDeckIds.length >= 60) {
      console.log("Main Deck is full (60 cards max).");
      return false;
    }
    if (count >= 3) {
      console.log("Maximum 3 copies of this card allowed.");
      return false;
    }
    return true;
  };

  const addCard = (id) => {
    if (!canAddCard(id)) return;
    setCurrentDeckIds((prev) => [...prev, id]);
    console.log(`Card with ID ${id} added to Main Deck.`);
  };

  const removeCard = (idToRemove) => {
    setCurrentDeckIds((prev) => {
      const index = prev.findIndex((id) => String(id) === String(idToRemove));
      if (index === -1) return prev;
      const newDeck = [...prev];
      newDeck.splice(index, 1);
      return newDeck;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const droppedId = String(e.dataTransfer.getData("text/plain"));
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
      className="main-deck"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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
            <Button sx={{ backgroundColor: '#ac9f27ff', color: 'white' }}>0</Button>
            <Button sx={{ backgroundColor: '#c56c14ff', color: 'white' }}>0</Button>
            <Button sx={{ backgroundColor: '#095492ff', color: 'white' }}>0</Button>
            <Button sx={{ backgroundColor: '#1e9f3eff', color: 'white' }}>0</Button>
            <Button sx={{ backgroundColor: '#e91e63', color: 'white' }}>0</Button>
          </Stack>
        </div>
      </div>

      <div className="deck-card-grid">
        {mainDeckCards.map((card, index) => (
          <img
            key={`${card.id}-${index}`}
            src={card.card_images?.[0]?.image_url_small}
            alt={card.name}
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("text/plain", String(card.id))
            }
            onDoubleClick={() => removeCard(card.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              addCard(String(card.id));
            }}
            onClick={() => {
              setCurrentCard(card);
              console.log("Clicked card:", card);
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
