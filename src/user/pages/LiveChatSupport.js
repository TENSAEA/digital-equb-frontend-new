import React, { useState } from 'react';
import { Box, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, Typography } from '@mui/material';
import { Chat as LiveChatSupportIcon, Close as CloseIcon } from '@mui/icons-material';

const LiveChatSupport = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
      // Simulate a response from the support
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'This is a response from support.', sender: 'support' },
        ]);
      }, 1000);
    }
  };

  return (
    <>
      <Box
        position="fixed"
        bottom={16}
        right={16}
        zIndex={1000}
      >
        <IconButton
          color="primary"
          onClick={handleOpen}
          sx={{
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#e0f7fa',
            },
          }}
        >
          <LiveChatSupportIcon />
        </IconButton>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Live Chat Support
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" height="400px">
            <Box flex="1" overflow="auto" mb={2}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                  mb={1}
                >
                  <Box
                    borderRadius={1}
                    p={1}
                    bgcolor={message.sender === 'user' ? '#e0f7fa' : '#f0f0f0'}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box display="flex">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                color="primary"
                variant="contained"
                onClick={handleSendMessage}
                sx={{ ml: 1 }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LiveChatSupport;
