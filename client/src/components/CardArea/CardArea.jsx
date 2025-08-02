export default function CardArea({ currentCard, setCurrentCard }) {
  return (
    <div className="card-area">
      {currentCard ? (
        <>
          <img
            src={currentCard.card_images?.[0]?.image_url}
            alt={currentCard.name}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.1rem" }}>
            <button
              style={{
                marginLeft: "auto",
                background: "#c62828",
                color: "white",
                border: "none",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onClick={() => setCurrentCard(null)}
            >
              ✖ Clear
            </button>
            <p>{currentCard.humanReadableCardType}</p>
          </div>
          <p>Desc: {currentCard.desc}</p>
        </>
      ) : (
        <p>Select a card to see details.</p>
      )}
    </div>
  );
}