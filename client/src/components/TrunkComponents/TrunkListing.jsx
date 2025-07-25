export default function TrunkListing({
  cardMap,
  visibleIds,
  setCurrentCard,
  addCard,
  currentDeckData,
  setCurrentDeckData,
}) {
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

  return (
    <div className="trunk-listing">
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
