import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Send, Image as ImageIcon, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { ChatMessage, UsageStats, Role } from './types';
import { LIMITS } from './constants';
import { generateStudyResponse } from './services/geminiService';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { UsageTracker } from './components/UsageTracker';
import { LimitWarning } from './components/LimitWarning';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-1',
  role: 'model',
  text: "Hello! I'm **StudyAI**. \n\nI can help you with Math, Science, History, Languages, and more. \n\nAsk me a question or upload an image of your homework!",
  timestamp: Date.now(),
};

export default function App() {
  
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);

  const handleLogin = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};
  
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Usage tracking
  const [usage, setUsage] = useState<UsageStats>({ textCount: 0, imageCount: 0 });
  const [limitWarning, setLimitWarning] = useState<{ show: boolean, type: 'text' | 'image' }>({ show: false, type: 'text' });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (usage.imageCount >= LIMITS.maxImages) {
        setLimitWarning({ show: true, type: 'image' });
        // Clear input so user can't select
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isTyping) return;

    // Check limits
    if (selectedImage && usage.imageCount >= LIMITS.maxImages) {
      setLimitWarning({ show: true, type: 'image' });
      return;
    }
    if (!selectedImage && usage.textCount >= LIMITS.maxText) {
      setLimitWarning({ show: true, type: 'text' });
      return;
    }

    // Update stats
    setUsage(prev => ({
      textCount: prev.textCount + 1,
      imageCount: selectedImage ? prev.imageCount + 1 : prev.imageCount
    }));

    const newUserMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: inputText,
      image: selectedImage || undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const responseText = await generateStudyResponse(newUserMessage.text, newUserMessage.image);
      
      const botMessage: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetLimits = () => {
    setUsage({ textCount: 0, imageCount: 0 });
    setLimitWarning({ show: false, type: 'text' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      <button onClick={handleLogin}>
  Login with Google
</button>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 text-brand-600">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-brand">
            <BookOpen size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">StudyAI</h1>
        </div>
        <div className="text-xs text-gray-500 hidden md:block">
          Your Personal AI Tutor
        </div>
      </header>

      {/* Usage Tracker */}
      <UsageTracker usage={usage} limits={LIMITS} onReset={resetLimits} />

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="max-w-3xl mx-auto flex flex-col min-h-full justify-end">
           {/* Messages */}
           <div className="flex-1 pb-4">
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-6">
                <div className="flex items-end gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                    <Sparkles size={16} className="animate-pulse" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2 text-gray-400 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto space-y-3">
          
          {selectedImage && (
             <div className="relative inline-block">
               <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200 relative group">
                 <img src={selectedImage} alt="Preview" className="h-full w-full object-cover" />
                 <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                 >
                   Remove
                 </button>
               </div>
             </div>
          )}

          <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all shadow-sm">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
              title="Upload Image"
            >
              <ImageIcon size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageSelect}
            />

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={usage.textCount >= LIMITS.maxText ? "Daily limit reached..." : "Ask a question..."}
              disabled={usage.textCount >= LIMITS.maxText && !selectedImage}
              className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-800 placeholder-gray-400 resize-none py-3 max-h-32"
              rows={1}
              style={{ minHeight: '44px' }}
            />

            <button
              onClick={handleSendMessage}
              disabled={(!inputText.trim() && !selectedImage) || isTyping || (usage.textCount >= LIMITS.maxText && !selectedImage)}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                (!inputText.trim() && !selectedImage) || isTyping
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-400">
            StudyAI can make mistakes. Check important info.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LimitWarning 
        isOpen={limitWarning.show} 
        type={limitWarning.type} 
        onClose={() => setLimitWarning({ ...limitWarning, show: false })} 
      />
    </div>
  );
}
