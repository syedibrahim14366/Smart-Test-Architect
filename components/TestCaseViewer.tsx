
import React, { useState } from 'react';
import type { TestCase, DownloadFormat } from '../types';
import { Button } from './common/Button';
import { 
  ChevronDown, 
  BarChart3,
  Search,
  CheckCircle2,
  Box,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Zap,
  RefreshCw,
  Database,
  Tag
} from 'lucide-react';

interface TestCaseViewerProps {
  testCases: TestCase[];
  onDownload: (format: DownloadFormat) => void;
  onAnalyze: () => void;
  onReset: () => void;
  onBack: () => void;
}

const TestCaseItem: React.FC<{ testCase: TestCase; index: number }> = ({ testCase, index }) => {
  const [isExpanded, setIsExpanded] = useState(index < 1);
  const displayId = testCase.id || `TC-${index + 1}`;

  const getPriorityStyles = (p?: string) => {
    switch(p) {
      case 'High': return 'text-red-400 border-red-500/30 bg-red-500/5';
      case 'Medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
      case 'Low': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
      default: return 'text-slate-500 border-slate-700 bg-slate-800/20';
    }
  };

  return (
    <div className={`group relative transition-all duration-500 ${isExpanded ? 'mb-8' : 'mb-3'}`}>
      <div className="absolute -left-4 top-10 bottom-0 w-px bg-gradient-to-b from-sky-500/40 to-transparent hidden xl:block"></div>
      
      <div className={`glass-panel rounded-3xl overflow-hidden border-l-4 transition-all duration-300 ${testCase.priority === 'High' ? 'border-l-red-500' : 'border-l-sky-500'} ${isExpanded ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900/40' : 'hover:translate-x-1 hover:bg-slate-900/20'}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-6 p-6 text-left"
        >
          <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 w-16 h-16 rounded-2xl shrink-0 font-orbitron group-hover:border-sky-500/50 transition-colors shadow-inner">
             <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Node_ID</span>
             <span className="text-xl font-black text-white">{displayId}</span>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                {testCase.title}
              </h3>
              {testCase.priority && (
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest font-orbitron ${getPriorityStyles(testCase.priority)}`}>
                  {testCase.priority}
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-slate-300 truncate uppercase tracking-tight">
               <span className="text-sky-400 font-bold">{testCase.testType}</span> // ISTQB_COMPLIANT_NODE
            </p>
          </div>

          <div className={`p-3 rounded-xl border border-slate-800 transition-all duration-500 ${isExpanded ? 'bg-sky-500/20 text-sky-400 rotate-180 border-sky-500/40 shadow-[0_0_20px_rgba(14,165,233,0.2)]' : 'text-slate-500'}`}>
            <ChevronDown size={20} />
          </div>
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-8 pt-4 animate-in slide-in-from-top-4 duration-500">
            <div className="h-px bg-slate-800/50 mb-8"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Metadata Cluster */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Test Basis
                  </span>
                  <div className="bg-black/30 p-5 rounded-xl border border-slate-800 text-xs text-slate-100 leading-relaxed italic font-medium">
                    {testCase.testBasis}
                  </div>
                </div>
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> Test Condition
                  </span>
                  <div className="bg-black/30 p-5 rounded-xl border border-slate-800 text-xs text-slate-100 leading-relaxed font-medium">
                    {testCase.testCondition}
                  </div>
                </div>
              </div>

              {/* Action Cluster */}
              <div className="lg:col-span-2 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                     <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                       <Layers size={14} /> Preconditions
                     </span>
                     <div className="bg-black/30 p-5 rounded-xl border border-slate-800 text-xs text-slate-200 min-h-[80px]">
                       {testCase.preconditions || 'None specified'}
                     </div>
                   </div>
                   <div className="space-y-3">
                     <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                       <Database size={14} /> Test Data
                     </span>
                     <div className="bg-black/30 p-5 rounded-xl border border-slate-800 text-xs text-slate-200 min-h-[80px]">
                       {testCase.testData || 'No input data required'}
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                      <Terminal size={14} /> Execution Sequence
                    </span>
                    <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-100 space-y-4 shadow-inner">
                      {testCase.steps.split('\n').filter(s => s.trim()).map((step, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <span className="text-sky-500/50 select-none font-bold">[{String(i+1).padStart(2,'0')}]</span>
                          <span className="leading-relaxed">{step.trim().replace(/^\d+\.\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 size={14} /> Synthesized Expected Result
                    </span>
                    <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/30 text-xs text-white font-bold leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                      {testCase.expectedResult}
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] bg-slate-900/60 p-5 rounded-xl border border-slate-800/50">
               <span className="flex items-center gap-2"><Tag size={12} className="text-sky-500" /> Type: <span className="text-white font-bold">{testCase.testType}</span></span>
               <span className="flex items-center gap-2 text-sky-400/80"><Cpu size={12} /> LeanISTQB Engine Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TestCaseViewer: React.FC<TestCaseViewerProps> = ({ testCases, onDownload, onAnalyze, onReset, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 10;
  
  const filtered = testCases.filter(tc => 
    tc.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tc.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tc.testBasis?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const displayed = showAll ? filtered : filtered.slice(0, itemsPerPage);

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-slate-800/50 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Box className="text-sky-500 w-10 h-10" />
            <h2 className="text-3xl sm:text-4xl font-orbitron font-black text-white glow-text uppercase tracking-tight">
              Logic Vault
            </h2>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2 text-emerald-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ISTQB Compliance Layer Active
            </span>
            <span className="h-4 w-px bg-slate-800"></span>
            Capacity: <span className="text-sky-400 font-bold">{testCases.length} Nodes</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <Button onClick={onBack} variant="outline" size="medium" className="px-5">
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
          <Button onClick={onAnalyze} variant="primary" size="medium" className="flex-1 lg:flex-none">
            <BarChart3 size={16} className="mr-2" /> Strategic Intel
          </Button>
          <Button onClick={onReset} variant="outline" size="medium" className="px-5">
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-3 space-y-8">
          <div className="glass-panel p-6 rounded-3xl border border-sky-500/10">
            <h4 className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-6 px-2">Extraction Protocol</h4>
            <div className="space-y-2">
              <Button onClick={() => onDownload('json')} variant="ghost" className="w-full px-4 py-3.5 border border-slate-800 group/btn">
                <div className="flex items-center justify-between w-full min-w-0 gap-3">
                  <span className="font-mono text-[10px] truncate flex-1 text-left text-slate-400 group-hover/btn:text-sky-300">JSON EXPORT</span>
                  <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 transition-opacity shrink-0 text-sky-400" />
                </div>
              </Button>
              <Button onClick={() => onDownload('csv')} variant="ghost" className="w-full px-4 py-3.5 border border-slate-800 group/btn">
                <div className="flex items-center justify-between w-full min-w-0 gap-3">
                  <span className="font-mono text-[10px] truncate flex-1 text-left text-slate-400 group-hover/btn:text-sky-300">CSV EXPORT</span>
                  <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 transition-opacity shrink-0 text-sky-400" />
                </div>
              </Button>
              <Button onClick={() => onDownload('pdf')} variant="ghost" className="w-full px-4 py-3.5 border border-slate-800 group/btn">
                <div className="flex items-center justify-between w-full min-w-0 gap-3">
                  <span className="font-mono text-[10px] truncate flex-1 text-left text-slate-400 group-hover/btn:text-sky-300">PDF REPORT</span>
                  <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 transition-opacity shrink-0 text-sky-400" />
                </div>
              </Button>
            </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Query Logic Map..."
              className="w-full pl-12 pr-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:border-sky-500 outline-none text-slate-200 font-mono text-xs transition-all placeholder:text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="xl:col-span-9 space-y-6">
          <div className="flex justify-between items-center px-2">
             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Showing: <span className="text-sky-400 font-bold">{displayed.length}</span> / {filtered.length} Segments</span>
             {filtered.length > itemsPerPage && !showAll && (
               <button onClick={() => setShowAll(true)} className="text-[10px] font-orbitron text-sky-400 hover:text-white transition-all uppercase tracking-widest font-black">Expand Logic Full</button>
             )}
          </div>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            {displayed.length > 0 ? (
              displayed.map((tc, index) => <TestCaseItem key={tc.id || index} testCase={tc} index={index} />)
            ) : (
              <div className="text-center py-32 glass-panel rounded-3xl border-dashed border-2 border-slate-800">
                <Search size={48} className="mx-auto text-slate-800 mb-6" />
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Null return on logic query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};