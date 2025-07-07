import React, { useState, useRef, useEffect } from 'react';

import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  CircularProgress,
  Drawer,
  ListItemButton,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Send as SendIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { ChatSession, Message, ChatResponse, Place, LatLng } from '../types/chat';

const drawerWidth = 300;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading:authLoading, logout } = useAuth();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLng>({ lat: 37.5665, lng: 126.9780 });
  const [recentPlaceUpdate, setRecentPlaceUpdate] = useState(false);
  // const [setRoutes] = useState<Route[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mapValid = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const mapId = process.env.REACT_APP_GOOGLE_MAPID || '';
  // const { isLoaded } = useLoadScript({

  // });

  const { chatId } = useParams<{ chatId: string }>();

  // Load chat sessions on mount
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    axios.get<ChatSession[]>(`${API_URL}/chats`)
      .then(res => setChatSessions(
        res.data.map(s => ({
          ...s,
          id: String(s.id),
          timestamp: new Date(s.timestamp)
        }))
      ))
      .catch(error => {
        console.error('Failed to load chats:', error);
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      });
  }, [authLoading, user, navigate, logout]);

  // Redirect invalid chatId
  useEffect(() => {
    const chatExists = chatSessions.some(session => session.id === chatId);
    if (!chatExists) {
      if (chatSessions.length > 0) {
        navigate(`/chat/${chatSessions[0].id}`);
      } else {
        navigate(`/chat`);
      }
    }
  }, [chatId, chatSessions, navigate]);

  // Load messages when chatId in URL changes
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    axios.get<Message[]>(`${API_URL}/chats/${chatId}`)
      .then(res =>
        setMessages(res.data.map(m => ({
          ...m,
          id: String(m.id),
          timestamp: new Date(m.timestamp),
        })))
      )
      .catch(err => {
        console.error('Failed to load messages:', err);
        setMessages([]);
      });
  }, [chatId]);

  // Scroll-to-bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // whenever places updates, recenter on the first one
  useEffect(() => {
    if (places.length > 0 && places[0].lat != null && places[0].lng != null) {
      setMapCenter({ lat: places[0].lat, lng: places[0].lng });
      setRecentPlaceUpdate(true);
    }
  }, [places]);

  // Select a chat and fetch its messages
  const handleChatSelect = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  // Create new chat session
  const handleNewChat = async () => {
    const title = prompt('Enter title for new chat:');
    if (!title?.trim()) return;
    try {
      const res = await axios.post<ChatSession>(`${API_URL}/chats`, { title });
      const session = {
        ...res.data,
        id: String(res.data.id),
        timestamp: new Date(res.data.timestamp)
      };
      setChatSessions([session, ...chatSessions]);
      navigate(`/chat/${session.id}`);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create chat', err);
    }
  };

  // Delete chat session
  const handleDeleteClick = (chatId: string) => {
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (chatToDelete) {
      await axios.delete(`${API_URL}/chats/${chatToDelete}`);
      setChatSessions(cs => cs.filter(c => c.id !== chatToDelete));
      if (chatId === chatToDelete) {
        navigate(`/chat`);
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

  // Send message and get AI reply
  const handleSend = async () => {
    if (!input.trim() || !chatId) return;
    const text = input.trim();

    const userMsg: Message = {
      id: Date.now().toString(),
      chatSessionId: Number(chatId),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(ms => [...ms, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post<ChatResponse>(
        `${API_URL}/chat/message`,
        { chatSessionId: Number(chatId), text }
      );

      const { summaryResponse, places: newPlaces } = res.data.recommendation;
      console.log("Summary Response : ", summaryResponse);
      console.log("Places received:", newPlaces);
      if (newPlaces && newPlaces.length > 0) {
        console.log("First place details:", {
          name: newPlaces[0].name,
          address: newPlaces[0].address,
          lat: newPlaces[0].lat,
          lng: newPlaces[0].lng,
          rating: newPlaces[0].rating
        });
      }
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        chatSessionId: Number(chatId),
        text: summaryResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(ms => [...ms, aiMsg]);
      setPlaces(newPlaces || []);
      // setRoutes(newRoutes || []);

      // Move camera to first place if available
      if (newPlaces && newPlaces.length > 0 && newPlaces[0].lat && newPlaces[0].lng) {
        const firstPlace = newPlaces[0];
        const map = document.querySelector('gmp-map') as any;
        if (map) {
          map.panTo({ lat: firstPlace.lat, lng: firstPlace.lng });
        }
      }
    } catch (err) {
      console.error('AI request failed', err);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Chats</Typography>
          <IconButton onClick={handleNewChat}><AddIcon/></IconButton>
        </Box>
        <Divider/>
        <List sx={{ overflow: 'auto', flexGrow: 1 }}>
          {chatSessions.map(chat => (
            <ListItemButton
              key={chat.id}
              selected={chat.id === chatId}
              onClick={() => handleChatSelect(chat.id)}
              sx={{ display: 'flex',
               justifyContent: 'space-between',
               bgcolor: chat.id === chatId ? 'grey.300' : 'transparent',
               '&:hover': {
                 bgcolor: chat.id === chatId ? 'grey.400' : 'grey.200',
               },
              }}
            >
              <ListItemText primary={chat.title}/>
              <IconButton edge="end" onClick={() => handleDeleteClick(chat.id)}>
                <DeleteIcon fontSize="small"/>
              </IconButton>
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Paper sx={{ flex: 1, mx: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {messages.map(msg => (
              <ListItem
                key={msg.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.100',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography>{msg.text}</Typography>
                </Paper>
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </ListItem>
            ))}
            {loading && (
              <ListItem key="loading" sx={{ flexDirection: 'column', alignItems: 'flex-start' }} >
                <Paper sx={{ p: 2, maxWidth: '80%', bgcolor: 'grey.100' }}>
                  <CircularProgress size={20}/>
                </Paper>
              </ListItem>
            )}
            <div ref={messagesEndRef}/>
          </List>
        </Box>
        <Box sx={{ p: 2, display: 'flex', gap: 1, borderTop: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!chatId || loading}
          />
          <IconButton onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? <CircularProgress size={24}/> : <SendIcon/>}
          </IconButton>
        </Box>
      </Paper>

      <Paper sx={{ flex: 1 }}>
        <APIProvider apiKey={mapValid} onLoad={() => console.log('Maps API has loaded. ')}>
          <Map
            defaultZoom={13}
            defaultCenter={ mapCenter }
            center={ recentPlaceUpdate ? mapCenter : undefined }
            mapId={ mapId }
            onCameraChanged={ev => {
              setRecentPlaceUpdate(false);
              console.log('camera moved:', ev.detail.center);
            }}>

            {places.map((place, index) => (
              <AdvancedMarker
                key={`place-${index}`}
                position={{
                  lat: place.lat || mapCenter.lat,
                  lng: place.lng || mapCenter.lng
                }}
                title={place.name}
                onClick={() => {
                  console.log('Clicked place:', place.name, 'Address:', place.address, 'Rating:', place.rating);
                }}
              >
                <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>Are you sure?</DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;