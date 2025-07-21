import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

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

            <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
          m: 1,
        },
      }}
    >
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button>Save</Button>
        <Button>Copy to...</Button>
        <Button>Delete</Button>
      </ButtonGroup>
    </Box>
      </div>
    </>
  )
}