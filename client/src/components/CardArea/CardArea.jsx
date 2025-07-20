export default function CardArea({ currentCard }) {
  return (
    <div className="card-area">
      {currentCard ? (
        <>
          <h2>{currentCard.name}</h2>
          <img src={currentCard.card_images?.[0]?.image_url} alt={currentCard.name} />
          <p>Type: {currentCard.type}</p>
          <p>Desc: {currentCard.desc}</p>
          {/* Add more details if needed */}
        </>
      ) : (
        <p>Select a card to see details.</p>
      )}
    </div>
  );
}
