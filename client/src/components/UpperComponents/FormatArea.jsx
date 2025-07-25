import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FormatArea({
  format,
  setFormat,
  currentFormat,
  setCurrentFormat,
  currentDeck,
  setCurrentDeck,
}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showNoDecksAlert, setShowNoDecksAlert] = React.useState(false);

  const currentFormatObj = Array.isArray(format)
    ? format.find(f => f.name === currentFormat)
    : null;

    // console.log("FormatList:", format);
    // console.log("Current Format Name:", currentFormat);
    // console.log("Matched Format Object:", currentFormatObj);

  if (!currentFormatObj) {
    return <p style={{ color: 'white' }}>Loading format data...</p>;
  }

  const deckNames = currentFormatObj?.decks ? Object.keys(currentFormatObj.decks) : [];

  React.useEffect(() => {
    const idx = deckNames.indexOf(currentDeck);
    if (idx !== -1 && idx !== selectedIndex) {
      setSelectedIndex(idx);
    }
  }, [currentDeck, deckNames]);

  const handleFormatChange = (event) => {
    const selectedFormat = event.target.value;
    setCurrentFormat(selectedFormat);

    const formatObj = format.find((f) => f.name === selectedFormat);
    const firstDeck = formatObj?.decks ? Object.keys(formatObj.decks)[0] : "";
    setCurrentDeck(firstDeck);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setCurrentDeck(deckNames[index]);
    setOpen(false);
  };

  const handleToggle = () => {
    if (deckNames.length === 0) {
      setShowNoDecksAlert(true);
      return;
    }
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  return (
    <div className="format-area">
      {/* FORMAT SELECTOR */}
      <div className="format-selector">
        <Box sx={{ width: 160, color: 'white' }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="format-select">Format</InputLabel>
            <NativeSelect
              value={currentFormat}
              onChange={handleFormatChange}
              inputProps={{ name: 'format', id: 'format-select' }}
            >
              {format.map((fmt) => (
                <option key={fmt.name} value={fmt.name}>
                  {fmt.name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Box>
      </div>

      {/* DECK SELECTOR */}
      <div className="deck-selector">
        <ButtonGroup
          variant="contained"
          ref={anchorRef}
          aria-label="Deck selection menu"
        >
          <Button onClick={handleToggle}>Deck Selection</Button>
          <Button
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="show deck menu"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>

        <Popper
          sx={{ zIndex: 1 }}
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          role={undefined}
          transition
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {deckNames.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

      {/* SNACKBAR ALERT */}
      <Snackbar
        open={showNoDecksAlert}
        autoHideDuration={3000}
        onClose={() => setShowNoDecksAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowNoDecksAlert(false)} severity="info">
          No decks found for this format.
        </Alert>
      </Snackbar>
    </div>
  );
}
