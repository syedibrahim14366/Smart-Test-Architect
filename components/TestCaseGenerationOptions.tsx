
import React from 'react';
import { Button } from './common/Button';
import { ArrowLeft, Zap, Cpu, Sparkles, ShieldCheck } from 'lucide-react';

interface TestCaseGenerationOptionsProps {
  onGenerate: (count: 500 | 1000 | 'auto') => void;
  onBack: () => void;
}

export const TestCaseGenerationOptions: React.FC<TestCaseGenerationOptionsProps> = ({ onGenerate, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-16 py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-white uppercase tracking-tighter glow-text">
          Initialization Capacity
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto font-mono text-xs leading-relaxed uppercase tracking-[0.2em]">
          Configure the neural depth for requirement synthesis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Rapid Mode */}
        <div 
          onClick={() => onGenerate(500)}
          className="group relative cursor-pointer glass-panel p-10 rounded-[2.5rem] border border-slate-800/50 hover:border-sky-500/50 transition-all duration-500 flex flex-col items-center gap-8 text-center"
        >
          <div className="p-6 bg-sky-500/10 rounded-3xl border border-sky-500/20 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]">
            <Zap className="w-12 h-12 text-sky-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-orbitron font-black text-white group-hover:text-sky-300 transition-colors">500 Nodes</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
              Standard logic validation suite optimized for rapid feedback loops.
            </p>
          </div>
          <div className="mt-auto w-full">
            <Button variant="outline" className="w-full group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500">Initialize</Button>
          </div>
        </div>

        {/* Deep Mode */}
        <div 
          onClick={() => onGenerate(1000)}
          className="group relative cursor-pointer glass-panel p-10 rounded-[2.5rem] border border-slate-800/50 hover:border-indigo-500/50 transition-all duration-500 flex flex-col items-center gap-8 text-center"
        >
          <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <Cpu className="w-12 h-12 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-orbitron font-black text-white group-hover:text-indigo-300 transition-colors">1000 Nodes</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
              Comprehensive logic matrix with high-density edge-case detection.
            </p>
          </div>
          <div className="mt-auto w-full">
            <Button variant="outline" className="w-full group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500">Initialize</Button>
          </div>
        </div>

        {/* Autonomous Mode */}
        <div 
          onClick={() => onGenerate('auto')}
          className="group relative cursor-pointer glass-panel p-10 rounded-[2.5rem] border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-500 flex flex-col items-center gap-8 text-center bg-emerald-500/5"
        >
          <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-12 h-12 text-emerald-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-orbitron font-black text-emerald-300 transition-colors">Autonomous</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
              AI-driven synthesis determining exact density for 100% logic coverage.
            </p>
          </div>
          <div className="mt-auto w-full">
            <Button variant="primary" className="w-full bg-emerald-600 hover:bg-emerald-500 border-none shadow-[0_0_20px_rgba(16,185,129,0.3)]">Let AI Decide</Button>
          </div>
          {/* Status Badge */}
          <div className="absolute top-6 right-6 flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/30 px-2 py-1 rounded-full bg-black/40">
            <ShieldCheck size={10} /> Precision Max
          </div>
        </div>
      </div>

       <div className="pt-10 flex justify-center">
        <Button onClick={onBack} variant="ghost" className="text-slate-500 hover:text-white">
          <ArrowLeft size={16} className="mr-3" /> Re-scan Requirements
        </Button>
      </div>
    </div>
  );
};
