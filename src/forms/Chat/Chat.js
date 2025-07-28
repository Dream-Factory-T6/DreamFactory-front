import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { EMOJIS } from './emojis';

function Chat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef(null);
  const connectionAttemptRef = useRef(null);

  const getUsernameFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.username || 'User';
      } catch (error) {
        return 'User';
      }
    }
    return '';
  };

  useEffect(() => {
    const newUsername = getUsernameFromToken();
    
    if (newUsername !== username) {
      if (stompClient) {
        stompClient.deactivate();
        setStompClient(null);
      }
      setIsConnected(false);
      setHasJoined(false);
    }
    
    setUsername(newUsername);
  }, [username, stompClient]);

  useEffect(() => {
    if (isOpen) {
      if (rooms.length === 0) {
        const fallbackRooms = [
          { id: 'general', name: 'General' },
          { id: 'support', name: 'Support' },
          { id: 'random', name: 'Random' }
        ];
        setRooms(fallbackRooms);
      }
      
      const currentUsername = getUsernameFromToken();
      if (currentUsername && (!stompClient || !isConnected)) {
        if (stompClient) {
          stompClient.deactivate();
          setStompClient(null);
        }
        setIsConnected(false);
        setHasJoined(false);
      }
    }
  }, [isOpen, rooms.length, username, stompClient, isConnected]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const currentUsername = getUsernameFromToken();
    if (!currentUsername) {
      setIsConnected(false);
      return;
    }

    if (username !== currentUsername) {
      setUsername(currentUsername);
    }

    if (connectionAttemptRef.current) {
      clearTimeout(connectionAttemptRef.current);
    }

    const token = localStorage.getItem('token');
    if (!token) {

      setIsConnected(false);
      return;
    }

    if (stompClient && isConnected) {
      if (stompClient.connected) {
        return;
      } else {

        stompClient.deactivate();
        setStompClient(null);
        setIsConnected(false);
        setHasJoined(false);
      }
    }

    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
      setIsConnected(false);
      setHasJoined(false);
    }

    const connectWebSocket = () => {
      const token = localStorage.getItem('token');
      const currentUsername = getUsernameFromToken();
      
      if (!token) {

        setIsConnected(false);
        return;
      }
      
      if (!currentUsername) {

        setIsConnected(false);
        return;
      }
      

      
      const socket = new SockJS('http://localhost:8080/ws');
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          'Authorization': `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {

        setIsConnected(true);
        setStompClient(client);

        client.subscribe(`/topic/room/${currentRoom}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, receivedMessage]);
        });

        setTimeout(() => {
          if (client.connected) {
            const currentUsername = getUsernameFromToken();
            client.publish({
              destination: '/app/chat.addUser',
              body: JSON.stringify({
                sender: currentUsername,
                type: 'JOIN',
                roomId: currentRoom
              })
            });
            setHasJoined(true);

          }
        }, 200);
      };

      client.onStompError = (frame) => {

        setIsConnected(false);
        setHasJoined(false);
        
        setTimeout(() => {
          if (isOpen && username) {

            connectWebSocket();
          }
        }, 3000);
      };

      client.onWebSocketError = (error) => {

        setIsConnected(false);
        setHasJoined(false);
        
        setTimeout(() => {
          if (isOpen && username) {

            connectWebSocket();
          }
        }, 3000);
      };

      client.onWebSocketClose = () => {

        setIsConnected(false);
        setHasJoined(false);
      };

      client.activate();
    };

    connectionAttemptRef.current = setTimeout(connectWebSocket, 100);

    return () => {
      if (connectionAttemptRef.current) {
        clearTimeout(connectionAttemptRef.current);
      }
    };
  }, [isOpen, username, currentRoom]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/chat/room/${currentRoom}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        setMessages([]);
      }
    };

    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:8080/api/chat/rooms', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedRooms = data.map(roomName => ({
              id: roomName,
              name: roomName.charAt(0).toUpperCase() + roomName.slice(1)
            }));
            setRooms(formattedRooms);
          } else {
            throw new Error('No rooms data received');
          }
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        const fallbackRooms = [
          { id: 'general', name: 'General' },
          { id: 'support', name: 'Support' },
          { id: 'random', name: 'Random' }
        ];
        setRooms(fallbackRooms);
      }
    };

    fetchMessages();
    fetchRooms();
  }, [isOpen, currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !stompClient || !isConnected) {
      return;
    }

    const chatMessage = {
      sender: username,
      content: newMessage,
      type: 'CHAT',
      roomId: currentRoom,
      timestamp: new Date().toISOString()
    };

    try {
      stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });
      setNewMessage('');
    } catch (error) {

    }
  };

  const handleRoomChange = (roomId) => {
    if (stompClient && isConnected) {
      try {
        const currentSubscription = stompClient.subscriptions[`/topic/room/${currentRoom}`];
        if (currentSubscription) {
          currentSubscription.unsubscribe();
        }
        
        stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, receivedMessage]);
        });

        stompClient.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({
            sender: username,
            type: 'JOIN',
            roomId: roomId
          })
        });
      } catch (error) {

      }
    }
    
    setCurrentRoom(roomId);
    setMessages([]);
    setHasJoined(false);
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojis(false);
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  useEffect(() => {
    if (!isOpen) {
      if (stompClient) {
        stompClient.deactivate();
        setStompClient(null);
      }
      setIsConnected(false);
      setHasJoined(false);
      if (connectionAttemptRef.current) {
        clearTimeout(connectionAttemptRef.current);
      }
    }
  }, [isOpen, stompClient]);

  if (!isOpen) return null;

  return (
    <div className={styles.chatOverlay}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <h3>Chat</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.chatContent}>
          <div className={styles.roomsSidebar}>
            <h4>Rooms</h4>
            <div className={styles.roomList}>
              {rooms.length === 0 ? (
                <div className={styles.loadingRooms}>
                  Loading rooms...
                </div>
              ) : (
                rooms.map((room, index) => (
                  <button
                    key={`room-${room.id || room.name || index}`}
                    className={`${styles.roomButton} ${currentRoom === room.id ? styles.activeRoom : ''}`}
                    onClick={() => handleRoomChange(room.id)}
                  >
                    {room.name || `Room ${index + 1}`}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={styles.messagesContainer}>
            <div className={styles.messagesList}>
              {messages.map((message, index) => (
                <div
                  key={`${message.sender}-${message.timestamp}-${index}`}
                  className={`${styles.message} ${
                    message.sender === username ? styles.ownMessage : styles.otherMessage
                  }`}
                >
                  <div className={styles.messageHeader}>
                    <span className={styles.sender}>{message.sender}</span>
                    <span className={styles.timestamp}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={styles.messageContent}>
                    {message.type === 'JOIN' ? (
                      <span className={styles.joinMessage}>
                        {message.sender} joined the room
                      </span>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className={styles.messageForm}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={styles.messageInput}
                  disabled={!isConnected}
                />
                <button
                  type="button"
                  onClick={toggleEmojis}
                  className={styles.emojiButton}
                  disabled={!isConnected}
                >
                  😊
                </button>
              </div>
              
              {showEmojis && (
                <div className={styles.emojiPanel}>
                  {EMOJIS.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className={styles.emojiItem}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                type="submit"
                className={styles.sendButton}
                disabled={!isConnected || !newMessage.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {!isConnected && (
          <div className={styles.connectionStatus}>
            Connecting to chat server... (User: {username})
          </div>
        )}
        {isConnected && (
          <div className={`${styles.connectionStatus} ${styles.connectedStatus}`}>
            Connected to chat as {username}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
