export default function TrunkListing({ cardMap, setCurrentCard, visibleIds }) {
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
