"use client";

import { useState } from "react";
import { Sidebar } from "@/src/components/Sidebar";
import { mockMessages } from "@/src/lib/mock-data";
import { Send, Search } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useTheme } from "@/src/components/ThemeContext";

const contacts = [
  { id: "u2", name: "Marie Lambert", role: "Professeure de Maths", initials: "ML", unread: 0 },
  { id: "u5", name: "Jean Renard", role: "Professeur de Français", initials: "JR", unread: 1 },
  { id: "u3", name: "Sophie Dupont", role: "Parent", initials: "SD", unread: 0 },
];

export default function MessagesPage() {
  const { isDark } = useTheme();
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [newMessage, setNewMessage] = useState("");

  const conversation = mockMessages.filter(
    (m) =>
      m.expediteur === selectedContact.name || m.destinataire === selectedContact.name
  );

  return (
    <div className={cn("flex min-h-screen transition-colors duration-300", isDark ? "bg-slate-950" : "bg-slate-50")}>
      <Sidebar role="eleve" userName="Lucas Dupont" userInitials="LD" />

      <main className="flex-1 flex overflow-hidden" style={{ height: "100vh" }}>
        {/* Liste contacts */}
        <div className={cn("w-72 border-r flex flex-col", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
          <div className={cn("p-4 border-b", isDark ? "border-slate-800" : "border-slate-100")}>
            <h1 className={cn("text-base font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Messages</h1>
            <div className="relative">
              <Search size={15} className={cn("absolute left-3 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} />
              <input
                type="text"
                placeholder="Rechercher…"
                className={cn(
                  "w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400",
                  isDark 
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200"
                )}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b",
                  isDark ? "border-slate-800" : "border-slate-50",
                  selectedContact.id === contact.id 
                    ? isDark ? "bg-blue-900/20" : "bg-blue-50"
                    : isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                  isDark ? "bg-blue-900/30" : "bg-indigo-100"
                )}>
                  <span className={cn("text-xs font-semibold", isDark ? "text-blue-400" : "text-indigo-700")}>{contact.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium truncate", isDark ? "text-white" : "text-slate-900")}>{contact.name}</p>
                  <p className={cn("text-xs truncate", isDark ? "text-slate-500" : "text-slate-400")}>{contact.role}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="w-5 h-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {contact.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className={cn("flex-1 flex flex-col", isDark ? "bg-slate-950" : "bg-slate-50")}>
          {/* Header */}
          <div className={cn("border-b px-6 py-4 flex items-center gap-3", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", isDark ? "bg-blue-900/30" : "bg-indigo-100")}>
              <span className={cn("text-xs font-semibold", isDark ? "text-blue-400" : "text-indigo-700")}>{selectedContact.initials}</span>
            </div>
            <div>
              <p className={cn("font-semibold text-sm", isDark ? "text-white" : "text-slate-900")}>{selectedContact.name}</p>
              <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{selectedContact.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {conversation.length === 0 ? (
              <div className={cn("text-center text-sm mt-16", isDark ? "text-slate-500" : "text-slate-400")}>
                Démarrez une conversation avec {selectedContact.name}
              </div>
            ) : (
              conversation.map((msg) => {
                const isMe = msg.expediteur === "Lucas Dupont";
                return (
                  <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-sm rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        isMe
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-sm"
                          : isDark 
                            ? "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm"
                            : "bg-white border border-slate-100 text-slate-800 shadow-sm rounded-bl-sm"
                      )}
                    >
                      <p>{msg.contenu}</p>
                      <p className={cn("text-xs mt-1", isMe ? "text-blue-200" : isDark ? "text-slate-500" : "text-slate-400")}>
                        {msg.date}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className={cn("border-t p-4", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Écrire un message…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className={cn(
                  "flex-1 px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400",
                  isDark 
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200"
                )}
              />
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium">
                <Send size={15} />
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
