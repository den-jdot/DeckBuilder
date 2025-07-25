import FormatArea from '../UpperComponents/FormatArea';
import HeaderArea from '../UpperComponents/HeaderArea';
import MiscArea from '../UpperComponents/MiscArea';

export default function UpperArea({
  format,
  setFormat,
  currentFormat,
  setCurrentFormat,
  currentDeck,
  setCurrentDeck,
  deckNameInput,
  setDeckNameInput,
  cards,
  currentDeckData,
  setCurrentDeckData,
}) {
  return (
    <div className="upper-area">
      <FormatArea
        format={format}
        setFormat={setFormat}
        currentFormat={currentFormat}
        setCurrentFormat={setCurrentFormat}
        currentDeck={currentDeck}
        setCurrentDeck={setCurrentDeck}
      />

      <HeaderArea
        format={format}
        setFormat={setFormat}
        currentDeck={currentDeck}
        setCurrentDeck={setCurrentDeck}
        currentFormat={currentFormat}
        deckNameInput={deckNameInput}
        setDeckNameInput={setDeckNameInput}
        cards={cards}
        currentDeckData={currentDeckData}
        setCurrentDeckData={setCurrentDeckData}
      />

      <MiscArea />
    </div>
  );
}
