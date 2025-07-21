import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function HeaderArea({currentDeck, deckNameInput, setDeckNameInput}) {

  return (
    <>
      <div className="header-area">
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Deck Name"
            value={deckNameInput}
            onChange={(e) => setDeckNameInput(e.target.value)}
            variant="outlined"
            InputLabelProps={{
              style: { color: 'white' },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                }
              },
            }}
          />
        </Box>
      </div>
    </>
  )
}