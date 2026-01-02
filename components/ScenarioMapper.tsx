
import React, { useState } from 'react';
import type { ExpectedScenario, RequirementSource } from '../types';
import { Button } from './common/Button';
import { 
  Network, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Layers, 
  Activity,
  Zap,
  Box,
  FileText,
  FileSearch,
  Download,
  X
} from 'lucide-react';
import { generateTestPlan } from '../services/geminiService';
import { Modal } from './common/Modal';

interface ScenarioMapperProps {
  scenarios: ExpectedScenario[];
  reqSource: RequirementSource;
  onProceed: () => void;
  onBack: () => void;
}

export const ScenarioMapper: React.FC<ScenarioMapperProps> = ({ scenarios, reqSource, onProceed, onBack }) => {
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [testPlan, setTestPlan] = useState<string | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const plan = await generateTestPlan(reqSource);
      setTestPlan(plan);
      setIsPlanModalOpen(true);
    } catch (err) {
      console.error("Test Plan generation error:", err);
      alert("Neural sync failed during Test Plan generation.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const getComplexityColor = (c: string) => {
    switch(c) {
      case 'High': return 'text-red-400 border-red-500/30 bg-red-500/5';
      case 'Medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
      case 'Low': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
      default: return 'text-sky-400 border-sky-500/30 bg-sky-500/5';
    }
  };

  return (
    <div className="space-y-12 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800/50 pb-8">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-orbitron font-black text-white glow-text flex items-center gap-4">
            <Network className="text-sky-400 w-10 h-10" />
            DOCUMENT BLUEPRINT
          </h2>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Neural Extraction Complete: <span className="text-sky-400 font-bold">{scenarios.length} Nodes Detected</span>
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Button onClick={onBack} variant="outline" size="medium" className="border-slate-800">
            <ArrowLeft size={16} className="mr-2" /> Re-Scan
          </Button>
          <Button 
            onClick={handleGeneratePlan} 
            variant="outline" 
            size="medium" 
            disabled={isGeneratingPlan}
            className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
          >
            {isGeneratingPlan ? (
              <Activity className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileSearch size={16} className="mr-2" />
            )}
            Generate Test Plan
          </Button>
          <Button onClick={onProceed} variant="primary" className="shadow-[0_0_20px_rgba(14,165,233,0.3)]">
            Expand into Full Suite <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
        {scenarios.map((scenario, index) => (
          <div 
            key={scenario.id || index} 
            className="glass-panel p-6 rounded-2xl border border-slate-800/50 hover:border-sky-500/30 transition-all group relative overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Box size={80} />
            </div>

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-sky-500 uppercase tracking-widest mb-1">REQ_NODE</span>
                <span className="text-xl font-orbitron font-black text-white">{scenario.id}</span>
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded border uppercase tracking-widest font-orbitron ${getComplexityColor(scenario.complexity)}`}>
                {scenario.complexity} Complexity
              </span>
            </div>

            <div className="space-y-5 relative z-10">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <ShieldCheck size={12} /> Logic Requirement
                </span>
                <p className="text-sm text-slate-100 font-medium leading-relaxed">{scenario.requirement}</p>
              </div>

              <div className="bg-sky-500/10 p-5 rounded-xl border border-sky-500/20 shadow-inner">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Zap size={12} /> Expected Test Scenario
                </span>
                <p className="text-sm text-white leading-relaxed italic font-medium">
                  {scenario.testScenario || "Synthesis in progress..."}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Analysis Rationale</span>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{scenario.rationale}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-sky-500/5 border border-sky-500/20 p-8 rounded-3xl flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
        <div className="bg-sky-500/10 p-5 rounded-2xl border border-sky-500/20">
          <Layers className="w-10 h-10 text-sky-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-orbitron font-black text-base uppercase tracking-wider">Ready for Deep Expansion</h4>
          <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">
            The neural mapping has identified the core logical paths. Click "Execute Generation" to synthesize these blueprints into detailed, ISTQB-compliant test cases.
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <Button onClick={onProceed} variant="primary" size="large" className="flex-1 lg:flex-none">
            Execute Generation
          </Button>
        </div>
      </div>

      {/* Test Plan Modal */}
      <Modal 
        isOpen={isPlanModalOpen} 
        onClose={() => setIsPlanModalOpen(false)} 
        title="Production Test Plan"
        icon={<FileText className="text-indigo-400" />}
      >
        <div className="space-y-6 py-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-[60vh] custom-scrollbar shadow-inner prose prose-invert prose-xs max-w-none">
            {testPlan?.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-orbitron font-black text-sky-400 mb-4 mt-6 border-b border-sky-500/20 pb-2">{line.replace('# ', '')}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-orbitron font-black text-indigo-300 mb-3 mt-6 border-b border-indigo-500/10 pb-1 uppercase tracking-tight">{line.replace('## ', '')}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-white mb-2 mt-4 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>{line.replace('### ', '')}</h3>;
              return <p key={i} className="mb-2">{line}</p>;
            })}
          </div>
          <div className="flex justify-between items-center bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" size={20} />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">ISTQB / ISO 29119-3 Compliant Synthesis</span>
            </div>
            <Button 
              onClick={() => {
                const blob = new Blob([testPlan || ''], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'TestPlan.md';
                a.click();
              }} 
              variant="outline" 
              size="small"
            >
              <Download size={14} className="mr-2" /> Download MD
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
