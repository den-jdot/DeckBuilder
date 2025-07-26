import { useState } from 'react';

export default function TrunkListing({
  cardMap,
  visibleIds,
  setCurrentCard,
  addCard,
  currentDeckData,
  setCurrentDeckData,
  nameFilter,
  setNameFilter,
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const EXTRA_DECK_TYPES = [
    'Fusion',
    'Synchro',
    'XYZ',
    'Link',
    'Synchro Pendulum',
    'Fusion Pendulum',
    'XYZ Pendulum',
  ];

  const isExtraType = (card) =>
    EXTRA_DECK_TYPES.some((type) =>
      card?.type?.toLowerCase().includes(type.toLowerCase())
    );

  const handleAdd = (id) => {

    const card = cardMap[String(id)];
    if (!card) return;

    const zone = isExtraType(card) ? 'extra' : 'main';
    addCard(id, zone);
  };

const removeCard = (idToRemove) => {
  setCurrentDeckData((prev) => {
    const removeFrom = (zoneArray) => {
      const index = zoneArray.findIndex((id) => String(id) === String(idToRemove));
      if (index !== -1) {
        const copy = [...zoneArray];
        copy.splice(index, 1);
        return copy;
      }
      return zoneArray;
    };

    return {
      main: removeFrom(prev.main),
      extra: removeFrom(prev.extra),
      side: removeFrom(prev.side),
    };
  });

  console.log(`Removed card ${idToRemove} from deck by dropping into trunk.`);
};

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const droppedId = e.dataTransfer.getData('text/plain');
    if (droppedId) {
      removeCard(droppedId);
    }
  };

  return (
    <div
      className="trunk-listing"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      style={{
        backgroundColor: isDraggingOver ? '#eef' : 'transparent',
        transition: 'background-color 0.2s',
      }}
    >
      {visibleIds.map((id) => {
        const card = cardMap[id];
        if (!card) return null;

        return (
          <div
            key={card.id}
            className="card-entry"
            draggable
            onClick={() => {
              setCurrentCard(card);
              console.log('Clicked card:', card);
            }}
            onDragStart={(e) => e.dataTransfer.setData('text/plain', card.id)}
            onDoubleClick={() => handleAdd(card.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleAdd(card.id);
            }}
            style={{ cursor: 'grab' }}
          >
            <img
              src={card.card_images?.[0]?.image_url_small}
              alt={card.name}
              className="card-image"
            />
          </div>
        );
      })}
    </div>
  );
}
