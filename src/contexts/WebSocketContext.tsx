'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

type MessageHandler = (message: Message) => void;
type MessagesLoadedHandler = (messages: Message[]) => void;

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (receiverId: string, content: string) => void;
  loadMessages: (contactId: string) => void;
  onNewMessage: (handler: MessageHandler) => () => void;
  onMessagesLoaded: (handler: MessagesLoadedHandler) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { prismaUser } = usePrismaUser();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageHandlersRef = useRef<Set<MessageHandler>>(new Set());
  const messagesLoadedHandlersRef = useRef<Set<MessagesLoadedHandler>>(new Set());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!prismaUser) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' || process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://localhost:4000`; // Note: In prod this should likely be the actual backend URL
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      ws.send(JSON.stringify({
        type: 'auth',
        userId: String(prismaUser.id),
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'messagesLoaded') {
        messagesLoadedHandlersRef.current.forEach(handler => handler(data.messages));
      } else if (data.type === 'newMessage') {
        messageHandlersRef.current.forEach(handler => handler(data.message));
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Reconnect after 3s
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };
  }, [prismaUser]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: 'sendMessage',
      receiverId,
      content,
    }));
  }, []);

  const loadMessages = useCallback((contactId: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: 'loadMessages',
      contactId,
    }));
  }, []);

  const onNewMessage = useCallback((handler: MessageHandler) => {
    messageHandlersRef.current.add(handler);
    return () => {
      messageHandlersRef.current.delete(handler);
    };
  }, []);

  const onMessagesLoaded = useCallback((handler: MessagesLoadedHandler) => {
    messagesLoadedHandlersRef.current.add(handler);
    return () => {
      messagesLoadedHandlersRef.current.delete(handler);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage, loadMessages, onNewMessage, onMessagesLoaded }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
