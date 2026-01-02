
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, icon }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="glass-panel w-full max-w-2xl rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-sky-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none"></div>
        
        {/* Corner Decorators */}
        <div className="bracket-corner corner-tl translate-x-1 translate-y-1"></div>
        <div className="bracket-corner corner-tr -translate-x-1 translate-y-1"></div>
        <div className="bracket-corner corner-bl translate-x-1 -translate-y-1"></div>
        <div className="bracket-corner corner-br -translate-x-1 -translate-y-1"></div>

        <div className="flex items-center justify-between p-8 border-b border-sky-500/10 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20">
              {icon}
            </div>
            <h2 className="text-2xl font-orbitron font-black text-white uppercase tracking-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-all p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto relative z-10 max-h-[80vh] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
