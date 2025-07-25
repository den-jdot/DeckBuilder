export default function TrunkListing({ cardMap, setCurrentCard, visibleIds, setCurrentDeckIds, currentDeckIds }) {

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
              console.log("Clicked card:", card);
            }}
            onDragStart={(e) => e.dataTransfer.setData('text/plain', card.id)}
            onDoubleClick={() => addCard(String(card.id))}
            onContextMenu={(e) => {
              e.preventDefault();
              addCard(String(card.id));
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
