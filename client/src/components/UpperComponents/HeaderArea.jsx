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

// Helper to normalize IDs to string form
const normalize = (list) => list.map(String);

export default function HeaderArea({
  currentDeck,
  setCurrentDeck,
  deckNameInput,
  setDeckNameInput,
  format,
  setFormat,
  currentFormat,
  currentDeckData,
  setCurrentDeckData,
}) {
  const deckName = (deckNameInput ?? '').trim();

  const [copyDialogOpen, setCopyDialogOpen] = React.useState(false);
  const [selectedTargetFormat, setSelectedTargetFormat] = React.useState('');

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const openSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Save current deck to the current format
  const handleSave = () => {
    if (!deckName) {
      openSnackbar("Please enter a deck name.", "warning");
      return;
    }

    const updatedFormats = [...format];
    const formatIndex = updatedFormats.findIndex((f) => f.name === currentFormat);
    if (formatIndex === -1) {
      console.error("Current format not found");
      return;
    }

    const formatObj = updatedFormats[formatIndex];
    if (!formatObj.decks) formatObj.decks = {};

    formatObj.decks[deckName] = {
      main: normalize(currentDeckData.main),
      extra: normalize(currentDeckData.extra),
      side: normalize(currentDeckData.side),
    };

    // Sort decks alphabetically
    formatObj.decks = Object.fromEntries(
      Object.entries(formatObj.decks).sort(([a], [b]) => a.localeCompare(b))
    );

    setFormat(updatedFormats);
    setCurrentDeck(deckName);
    openSnackbar(`Deck '${deckName}' saved successfully.`, 'success');
  };

  // Copy current deck to a different format
  const handleConfirmCopy = () => {
    const name = (deckNameInput ?? '').trim();
    if (!name) {
      openSnackbar("Please enter a deck name.", "warning");
      return;
    }

    if (!selectedTargetFormat) {
      openSnackbar("Please select a format to copy to.", "warning");
      return;
    }

    const copiedDeck = {
      main: normalize(currentDeckData.main),
      extra: normalize(currentDeckData.extra),
      side: normalize(currentDeckData.side),
    };

    const updatedFormats = format.map((f) => {
      if (f.name !== selectedTargetFormat) return f;

      const existingDecks = f.decks || {};
      const updatedDecks = {
        ...existingDecks,
        [name]: copiedDeck,
      };

      return {
        ...f,
        decks: Object.fromEntries(
          Object.entries(updatedDecks).sort(([a], [b]) => a.localeCompare(b))
        ),
      };
    });

    setFormat(updatedFormats);
    setCurrentDeck(name);
    setCopyDialogOpen(false);
    openSnackbar(`Deck copied to ${selectedTargetFormat} as '${name}'`, 'success');
  };

  // Delete the current deck from the current format
  const handleDelete = () => {
    const updatedFormats = [...format];
    const formatIndex = updatedFormats.findIndex((f) => f.name === currentFormat);
    if (formatIndex === -1) {
      console.error("Current format not found for deletion");
      return;
    }

    const formatObj = updatedFormats[formatIndex];
    if (!formatObj.decks?.[deckName]) {
      openSnackbar("No such deck found to delete", "warning");
      return;
    }

    delete formatObj.decks[deckName];

    const remainingDecks = Object.keys(formatObj.decks);
    const nextDeck = remainingDecks[0] ?? "";

    setFormat(updatedFormats);
    setCurrentDeck(nextDeck);
    setDeckNameInput(nextDeck);
    setCurrentDeckData({ main: [], extra: [], side: [] });
    setConfirmOpen(false);
    openSnackbar(`Deck '${deckName}' deleted.`, "info");
  };

  return (
    <div className="header-area">
      {/* Deck name input */}
      <Box component="form" noValidate autoComplete="off" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
        <TextField
          label="Deck Name"
          value={deckNameInput ?? ''}
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

      {/* Action buttons */}
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
          <Button
            onClick={() => {
              setSelectedTargetFormat(
                format.find((f) => f.name !== currentFormat)?.name ?? ''
              );
              setCopyDialogOpen(true);
            }}
          >
            Copy to...
          </Button>
          <Button onClick={() => setConfirmOpen(true)}>Delete</Button>
        </ButtonGroup>
      </Box>

      {/* Snackbar feedback */}
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

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
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

      {/* Copy to another format dialog */}
      <Dialog open={copyDialogOpen} onClose={() => setCopyDialogOpen(false)}>
        <DialogTitle>Copy deck to another format</DialogTitle>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, p: 2 }}>
          <select
            value={selectedTargetFormat}
            onChange={(e) => setSelectedTargetFormat(e.target.value)}
            style={{ padding: '8px', fontSize: '1rem' }}
          >
            {format
              .filter((f) => f.name !== currentFormat)
              .map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
          </select>
          <Button variant="contained" onClick={handleConfirmCopy}>
            Confirm Copy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
