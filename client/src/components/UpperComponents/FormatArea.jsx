import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function FormatArea({
  format,
  currentFormat,
  setCurrentFormat,
  currentDeck,
  setCurrentDeck
}) {
  const handleFormatChange = (event) => {
    const selectedFormat = event.target.value;
    setCurrentFormat(selectedFormat);

    // Auto-select first available deck in new format, if any
    const formatObj = format.find(f => f.name === selectedFormat);
    const firstDeck = formatObj?.decks ? Object.keys(formatObj.decks)[0] : "";
    setCurrentDeck(firstDeck);
  };

  const handleDeckChange = (event) => {
    setCurrentDeck(event.target.value);
  };

  const currentFormatObj = format.find(f => f.name === currentFormat);
  const deckNames = currentFormatObj?.decks ? Object.keys(currentFormatObj.decks) : ["test1", "test2"];

  return (
    <div className="format-area">
      <div className="format-selector">
        <Box sx={{ width: 160, color: 'white' }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="format-select">Format</InputLabel>
            <NativeSelect
              value={currentFormat}
              onChange={handleFormatChange}
              inputProps={{ name: 'format', id: 'format-select' }}
            >
              {format.map(fmt => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Box>
      </div>

      <div className="deck-selector">
        <Box sx={{ width: 160, color: 'white' }}>
          <Autocomplete
            freeSolo
            options={deckNames}
            value={currentDeck}
            onChange={(event, newValue) => {
              setCurrentDeck(newValue ?? "");  // handles selection from dropdown
            }}
            onInputChange={(event, newInputValue) => {
              setCurrentDeck(newInputValue);   // handles typing custom input
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Deck"
                variant="standard"
              />
            )}
          />
        </Box>
      </div>
    </div>
  );
}
