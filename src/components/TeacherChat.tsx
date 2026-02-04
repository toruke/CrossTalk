'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, Mic, Image as ImageIcon } from 'lucide-react';
import { api } from '@/src/services/api';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';

interface Message {
  id: string;
  role: 'teacher' | 'user';
  content: string;
  timestamp: Date;
}

export const TeacherChat = ({ teacherId, teacherName }: { teacherId: string; teacherName: string }) => {
  const { prismaUser, loading: userLoading } = usePrismaUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load existing messages when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      if (!teacherId || !prismaUser || userLoading) return;

      setLoading(true);
      try {
        const apiMessages = await api.getMessages(String(prismaUser.id), teacherId);

        // Transform API messages to component format
        const transformedMessages: Message[] = apiMessages.map(msg => ({
          id: msg.id,
          role: msg.senderId === String(prismaUser.id) ? 'user' : 'teacher',
          content: msg.content,
          timestamp: new Date(msg.createdAt),
        }));

        if (transformedMessages.length > 0) {
          setMessages(transformedMessages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        // Keep the default welcome message if loading fails
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [teacherId, prismaUser, userLoading]);

  const handleSend = async () => {
    if (!input.trim() || !teacherId || !prismaUser) return;

    const messageContent = input;
    setInput('');

    // Optimistically add user message to UI
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      // Send message to API
      const sentMessage = await api.sendMessage(String(prismaUser.id), teacherId, messageContent);

      // Replace temp message with real one from API
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempUserMsg.id
            ? { ...msg, id: sentMessage.id }
            : msg
        )
      );

      // TODO: In a real implementation, use WebSocket to receive teacher responses
      // For now, messages from teacher need to be fetched or received via WebSocket

    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally: show error to user or retry
      alert('Erreur lors de l\'envoi du message. Vérifiez que le backend est démarré.');
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1E7F88]/10 rounded-full flex items-center justify-center text-[#1E7F88]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{teacherName}</h2>
            <span className="text-xs text-gray-500">Professeur</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-[#1E7F88] text-white' : 'bg-white border border-gray-200 text-[#1E7F88] shadow-sm'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-[#1E7F88] text-white rounded-tr-none shadow-md shadow-[#1E7F88]/20' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                }`}>
                  <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 items-center ml-11">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
                <span className="text-xs text-[#1E7F88]/60 font-medium">Le professeur réfléchit...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6">
        <div className="relative flex items-center bg-white p-2 rounded-2xl shadow-lg border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[#1E7F88] text-white p-3 rounded-xl hover:bg-[#176570] disabled:opacity-50 disabled:hover:bg-[#1E7F88] transition-all shadow-lg shadow-[#1E7F88]/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[11px] text-gray-400 mt-3">
          {loading ? '🔄 Chargement des messages...' : '💡 Messages envoyés au backend. WebSocket à implémenter pour les réponses en temps réel.'}
        </p>
      </div>
    </div>
  );
};
