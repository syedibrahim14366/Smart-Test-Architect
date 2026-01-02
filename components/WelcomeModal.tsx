
import React from 'react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { BrainCircuit, Cpu, ShieldCheck, Zap, Activity, Info } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="System Initialization" 
      icon={<BrainCircuit className="text-sky-400" />}
    >
      <div className="space-y-8 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-sky-500/20 p-8 shadow-inner">
          <div className="absolute top-0 right-0 p-4 opacity-5 animate-pulse">
            <Cpu size={120} />
          </div>
          
          <h3 className="text-2xl font-orbitron font-black text-white mb-4 tracking-tight">
            Welcome to <span className="text-sky-400">LeanISTQB TestGen</span>
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
            This high-scale test architect utilizes <span className="text-sky-300">Gemini 3 Pro</span> to autonomously transform your product requirements into comprehensive validation logic following ISTQB principles.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4 bg-sky-500/5 rounded-xl border border-sky-500/10 hover:border-sky-500/40 transition-all group">
              <Zap className="text-amber-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest mb-1">Synthesis</span>
              <p className="text-[9px] text-slate-500 font-mono">Convert SRS to 1000+ test nodes in seconds.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 hover:border-indigo-500/40 transition-all group">
              <ShieldCheck className="text-sky-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest mb-1">Mapping</span>
              <p className="text-[9px] text-slate-500 font-mono">Neural extraction of expected scenarios.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/40 transition-all group">
              <Activity className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest mb-1">Analysis</span>
              <p className="text-[9px] text-slate-500 font-mono">Strategic risk and UX friction scoring.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
            <div className="p-2 bg-sky-500/10 rounded-lg shrink-0">
              <Info size={16} className="text-sky-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-1">How to Initialize</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                1. Input your Raw Requirements or Upload a Documentation File.<br/>
                2. Review the Neural Extraction Blueprint.<br/>
                3. Configure Node Capacity (500-1000 tests).<br/>
                4. Execute Strategic Analysis for Risk Scoring.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={onClose} variant="primary" size="large" className="w-full sm:w-auto shadow-[0_0_25px_rgba(14,165,233,0.4)]">
            Initialize Core Engine
          </Button>
        </div>
      </div>
    </Modal>
  );
};