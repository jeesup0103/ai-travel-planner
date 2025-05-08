import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Drawer,
  ListItemButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Send as SendIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { ChatSession, Message, Location } from '../types/chat';

const drawerWidth = 300;

const Chat: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Trip to San Francisco',
      timestamp: new Date(),
      messages: [],
    },
    {
      id: '2',
      title: 'Tokyo Adventure',
      timestamp: new Date(),
      messages: [],
    }
  ]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDeleteClick = (chatId: string) => {
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (chatToDelete) {
      setChatSessions(prev => prev.filter(chat => chat.id !== chatToDelete));
      if (selectedChat === chatToDelete) {
        setSelectedChat(null);
        setMessages([]);
      }
    }
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    const chat = chatSessions.find(c => c.id === chatId);
    setMessages(chat?.messages || []);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call your AI service endpoint here
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.locations) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const mapCenter = locations.length > 0
    ? locations[0]
    : { lat: 37.5665, lng: 126.9780 }; // Default to Seoul

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative',
            mt: 0,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Typography variant="h6" sx={{ p: 2, bgcolor: 'background.paper' }}>
          Chats
        </Typography>
        <Divider />
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          <List>
            {chatSessions.map((chat) => (
              <ListItem
                key={chat.id}
                disablePadding
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDeleteClick(chat.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton onClick={() => handleChatSelect(chat.id)} selected={selectedChat === chat.id}>
                  <ListItemText
                    primary={chat.title}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Paper
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          mx: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                    color: message.sender === 'user' ? 'black' : 'text.primary',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>

                </Paper>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            gap: 1,
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: 'background.paper',
            position: 'sticky',
            bottom: 0,
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Paper>

      <Paper sx={{ flex: 1 }}>
        {!isLoaded ? (
          <CircularProgress />
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={13}
          >
            {locations.map((location) => (
              <Marker
                key={`${location.lat}-${location.lng}`}
                position={{ lat: location.lat, lng: location.lng }}
                title={location.name}
              />
            ))}
          </GoogleMap>
        )}
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Chat
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this chat?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;