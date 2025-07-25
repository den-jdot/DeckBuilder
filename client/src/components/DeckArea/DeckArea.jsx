import MainDeck from '../DeckComponents/MainDeck';
import ExtraDeck from '../DeckComponents/ExtraDeck';
import SideDeck from '../DeckComponents/SideDeck';

export default function DeckArea({
  cards,
  setCurrentCard,
  currentFormat,
  currentDeck,
  setCurrentDeck,
  currentDeckData,
  setCurrentDeckData,
  addCard
}) {

  return (
    <div className="deck-area">
      <MainDeck
        key={Object.keys(cards).length}
        cards={cards}
        setCurrentCard={setCurrentCard}
        currentFormat={currentFormat}
        currentDeck={currentDeck}
        currentDeckData={currentDeckData}
        setCurrentDeckData={setCurrentDeckData}
        addCard={(id) => addCard(id, 'main')}
      />
      <ExtraDeck
        cards={cards}
        currentDeckData={currentDeckData}
        setCurrentDeckData={setCurrentDeckData}
        setCurrentCard={setCurrentCard}
        addCard={(id) => addCard(id, 'extra')}
      />
      <SideDeck
        cards={cards}
        currentDeckData={currentDeckData}
        setCurrentDeckData={setCurrentDeckData}
        setCurrentCard={setCurrentCard}
        addCard={(id) => addCard(id, 'side')}
      />
    </div>
  );
}
