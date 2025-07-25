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

  const countCopies = (id) => currentDeckData.filter((x) => x === id).length;

  const totalCountOf = (predicate) =>
    currentDeckData.filter((id) => predicate(cards[String(id)])).length;

  const addCard = (id, zone) => {
    const card = cards[String(id)];
    if (!card) return;

    const totalCopies = countCopies(id);
    if (totalCopies >= 3) {
      console.log('Maximum 3 copies allowed.');
      return;
    }

    const mainDeckCount = totalCountOf((c) => !isExtraType(c));
    const extraDeckCount = totalCountOf((c) => isExtraType(c));
    const totalCount = currentDeckData.length;
    const sideDeckCount = totalCount - mainDeckCount - extraDeckCount;

    if (zone === 'main') {
      if (isExtraType(card)) {
        console.log('Card is Extra Deck type, cannot add to Main Deck.');
        return;
      }
      if (mainDeckCount >= 60) {
        console.log('Main Deck is full (60 cards max).');
        return;
      }
    } else if (zone === 'extra') {
      if (!isExtraType(card)) {
        console.log('Card is not an Extra Deck type.');
        return;
      }
      if (extraDeckCount >= 15) {
        console.log('Extra Deck is full (15 cards max).');
        return;
      }
    } else if (zone === 'side') {
      if (sideDeckCount >= 15) {
        console.log('Side Deck is full (15 cards max).');
        return;
      }
    }

    setCurrentDeckData((prev) => [...prev, id]);
    console.log(`Added card ${id} to ${zone} deck.`);
  };

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
