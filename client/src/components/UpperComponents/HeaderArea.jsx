import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function HeaderArea({
  currentDeck,
  setCurrentDeck,
  deckNameInput,
  setDeckNameInput,
  format,
  setFormat,
  currentFormat,
  currentDeckIds,
  setCurrentDeckIds,
}) {
  const deckName = deckNameInput.trim();

  // Snackbar state
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });

  const openSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Delete confirmation dialog state
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleSave = () => {
    if (!deckName) {
      openSnackbar("Please enter a deck name.", "warning");
      return;
    }

    const updatedFormat = [...format];
    const formatIndex = updatedFormat.findIndex(f => f.name === currentFormat);

    if (formatIndex === -1) {
      console.error("Current format not found");
      return;
    }

    const formatObj = updatedFormat[formatIndex];
    if (!formatObj.decks) formatObj.decks = {};

    // Save only IDs
    formatObj.decks[deckName] = [...currentDeckIds];

    // Sort decks alphabetically
    const sortedDecks = Object.entries(formatObj.decks).sort(([a], [b]) => a.localeCompare(b));
    formatObj.decks = Object.fromEntries(sortedDecks);

    setFormat(updatedFormat);
    setCurrentDeck(deckName);
    openSnackbar(`Deck '${deckName}' saved successfully.`, 'success');
    console.log(`Deck '${deckName}' saved with IDs:`, currentDeckIds);
  };

  const handleDelete = () => {
    const updatedFormat = [...format];
    const formatIndex = updatedFormat.findIndex(f => f.name === currentFormat);

    if (formatIndex === -1) {
      console.error("Current format not found for deletion");
      return;
    }

    const formatObj = updatedFormat[formatIndex];

    if (!formatObj.decks?.[deckName]) {
      openSnackbar("No such deck found to delete", 'warning');
      return;
    }

    delete formatObj.decks[deckName];

    const remainingDecks = Object.keys(formatObj.decks);
    const nextDeck = remainingDecks[0] ?? "";

    setFormat(updatedFormat);
    setCurrentDeck(nextDeck);
    setDeckNameInput(nextDeck);
    setCurrentDeckIds([]);

    openSnackbar(`Deck '${deckName}' deleted.`, 'info');
    console.log(`Deck '${deckName}' deleted.`);
    setConfirmOpen(false);
  };

  return (
    <div className="header-area">
      {/* Deck name input */}
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
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
            },
          }}
        />
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > *': { m: 1 },
        }}
      >
        <ButtonGroup variant="contained" aria-label="Deck actions">
          <Button onClick={handleSave}>Save</Button>
          <Button disabled>Copy to...</Button>
          <Button onClick={() => setConfirmOpen(true)}>Delete</Button>
        </ButtonGroup>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>{`Are you sure you want to delete '${deckName}'?`}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
