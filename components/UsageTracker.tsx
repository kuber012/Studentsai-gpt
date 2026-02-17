import React from 'react';
import { UsageStats, LimitConfig } from '../types';
import { MessageSquare, ImageIcon, Zap } from 'lucide-react';

interface UsageTrackerProps {
  usage: UsageStats;
  limits: LimitConfig;
  onReset?: () => void;
}

export const UsageTracker: React.FC<UsageTrackerProps> = ({ usage, limits, onReset }) => {
  const textPercent = Math.min((usage.textCount / limits.maxText) * 100, 100);
  const imagePercent = Math.min((usage.imageCount / limits.maxImages) * 100, 100);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between text-xs sm:text-sm shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2" title="Text Questions">
          <MessageSquare size={14} className="text-brand-600" />
          <div className="flex flex-col">
             <span className="font-medium text-slate-600">Questions</span>
             <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
               <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${textPercent}%` }} />
             </div>
          </div>
          <span className="text-gray-400 font-mono">{usage.textCount}/{limits.maxText}</span>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <div className="flex items-center gap-2" title="Image Uploads">
          <ImageIcon size={14} className="text-purple-600" />
          <div className="flex flex-col">
             <span className="font-medium text-slate-600">Images</span>
             <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
               <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${imagePercent}%` }} />
             </div>
          </div>
           <span className="text-gray-400 font-mono">{usage.imageCount}/{limits.maxImages}</span>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="text-xs text-gray-400 hover:text-brand-600 underline ml-4 hidden sm:block"
      >
        Reset Limits (Demo)
      </button>

      <div className="ml-4 flex items-center gap-1 text-amber-500 font-medium cursor-pointer hover:text-amber-600 transition-colors">
        <Zap size={14} fill="currentColor" />
        <span className="hidden sm:inline">Premium</span>
      </div>
    </div>
  );
};
