import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { Bot, User, Clock } from 'lucide-react';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? 'bg-brand-600 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden ${
            isUser 
              ? 'bg-brand-600 text-white rounded-tr-none' 
              : 'bg-white border border-gray-100 text-slate-800 rounded-tl-none'
          }`}>
            
            {message.image && (
              <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                <img 
                  src={message.image} 
                  alt="User upload" 
                  className="max-h-64 object-contain w-full bg-black/10"
                />
              </div>
            )}

            <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'prose-slate'}`}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>
          
          <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
             <Clock size={10} />
             {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
