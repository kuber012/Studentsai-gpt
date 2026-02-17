import React from 'react';
import { Lock, Zap } from 'lucide-react';

interface LimitWarningProps {
  type: 'text' | 'image';
  isOpen: boolean;
  onClose: () => void;
}

export const LimitWarning: React.FC<LimitWarningProps> = ({ type, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center transform transition-all scale-100">
        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={32} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">Daily Limit Reached</h3>
        
        <p className="text-slate-600 mb-6">
          You have reached your free daily limit for {type === 'text' ? 'questions (5)' : 'images (3)'}.
          Please upgrade to premium to continue learning without limits!
        </p>
        
        <div className="flex flex-col gap-3">
          <button className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2">
            <Zap size={20} fill="currentColor" />
            Upgrade to Premium
          </button>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-medium py-2"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
