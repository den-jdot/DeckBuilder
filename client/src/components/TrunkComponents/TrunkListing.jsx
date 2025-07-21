export default function TrunkListing({ cards, setCurrentCard }) {
  return (
    <div className="trunk-listing">
      {cards.map((card) => (
        <div
          key={card.id}
          className="card-entry"
          onClick={() => setCurrentCard(card)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={card.card_images?.[0]?.image_url_small}
            alt={card.name}
            className="card-image"
          />
          {/* <p className="card-name">{card.name}</p> */}
        </div>
      ))}
    </div>
  );
}
