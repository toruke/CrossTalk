'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Minimize2, MessageCircle } from 'lucide-react';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { getInitials } from '@/src/lib/displayName';
import { useWebSocket } from '@/src/contexts/WebSocketContext';

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

interface ChatPopupProps {
  contactId: string;
  contactName: string;
  onClose: () => void;
}

export const ChatPopup = ({ contactId, contactName, onClose }: ChatPopupProps) => {
  const { prismaUser } = usePrismaUser();
  const { isConnected, sendMessage, loadMessages, onNewMessage, onMessagesLoaded } = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  // Load messages when popup opens
  useEffect(() => {
    if (isConnected) {
      loadMessages(contactId);
    }
  }, [isConnected, contactId, loadMessages]);

  // Listen for loaded messages
  useEffect(() => {
    return onMessagesLoaded((loadedMessages) => {
      setMessages(loadedMessages);
    });
  }, [onMessagesLoaded]);

  // Listen for new messages (only from/to this contact)
  useEffect(() => {
    if (!prismaUser) return;
    const myId = String(prismaUser.id);

    return onNewMessage((msg) => {
      const isRelevant =
        (msg.senderId === String(contactId) && msg.receiverId === myId) ||
        (msg.senderId === myId && msg.receiverId === String(contactId));

      if (isRelevant) {
        setMessages(prev => [...prev, msg]);
      }
    });
  }, [onNewMessage, contactId, prismaUser]);

  const handleSend = () => {
    if (!input.trim() || !isConnected || !prismaUser) return;
    sendMessage(contactId, input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        height: isMinimized ? 'auto' : '600px'
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-6 right-6 w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E7F88] to-[#176570] p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
            {getInitials({ firstName: contactName.split(' ')[0], lastName: contactName.split(' ')[1] || '' })}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{contactName}</h3>
            <div className="flex items-center gap-1.5 text-xs">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-gray-300'}`} />
              <span className="opacity-90">{isConnected ? 'En ligne' : 'Hors ligne'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
            style={{ maxHeight: '450px' }}
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                <p>Aucun message pour le moment</p>
                <p className="text-xs mt-1">Commencez la conversation !</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isOwn = msg.senderId === String(prismaUser?.id);
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${isOwn ? 'bg-[#1E7F88] text-white' : 'bg-white text-gray-800'} px-4 py-2.5 rounded-2xl ${isOwn ? 'rounded-tr-md' : 'rounded-tl-md'} shadow-sm`}>
                        <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Écrivez un message..."
                rows={1}
                className="flex-1 resize-none bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E7F88]/30 transition-all"
                style={{ maxHeight: '100px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !isConnected}
                className="bg-[#1E7F88] text-white p-2.5 rounded-xl hover:bg-[#176570] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1E7F88]/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
