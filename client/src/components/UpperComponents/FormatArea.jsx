import { useState } from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


export default function FormatArea({format, currentFormat, setFormat, setCurrentFormat, currentDeck, setCurrentDeck}) {

  const deckList = ['My Dragon Deck', 'Control Edison', 'TeleDAD Classic']; // Replace or pull from state later

  const handleChange = (event) => {
    setCurrentFormat(event.target.value);
  };

  return (
    <>
        <div className="format-area">
          <div className="format-selector">
            <Box sx={{ width: 160, color: 'white' }}>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="format-select">
                  Format
                </InputLabel>
                <NativeSelect
                  value={currentFormat}
                  onChange={handleChange}
                  inputProps={{
                    name: 'format',
                    id: 'format-select',
                  }}
                >
                  {format.map((fmt) => (
                    <option key={fmt} value={fmt}>
                      {fmt}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Box>
          </div>

          <div className="deck-selector">
            <Box sx={{ width: 160 }}>
              <Autocomplete
                freeSolo
                value={currentDeck}
                onChange={(event, newValue) => {
                  setCurrentDeck(newValue || "");
                }}
                onInputChange={(event, newInputValue) => {
                  setCurrentDeck(newInputValue);
                }}
                options={deckList}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Deck"
                    variant="standard"
                    InputLabelProps={{ style: { color: 'white' } }}
                    sx={{
                      input: { color: 'white' },
                      '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                      '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                    }}
                  />
                )}
              />
            </Box>
          </div>
        </div>
    </>
  )
}