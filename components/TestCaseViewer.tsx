
import React, { useState } from 'react';
import type { TestCase, DownloadFormat } from '../types';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { 
  Download, 
  Play, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  FileJson, 
  FileText, 
  FileSpreadsheet, 
  FileArchive,
  BarChart3,
  Search,
  AlertCircle
} from 'lucide-react';

interface TestCaseViewerProps {
  testCases: TestCase[];
  onExecute: () => void;
  onDownload: (format: DownloadFormat) => void;
  onAnalyze: () => void;
  isExecuting: boolean;
  onReset: () => void;
}

const TestCaseItem: React.FC<{ testCase: TestCase; index: number }> = ({ testCase, index }) => {
  const [isExpanded, setIsExpanded] = useState(index < 3);

  const getPriorityStyles = (p?: string) => {
    switch(p) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-sky-500/30 transition-all group overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-5 text-left transition-colors group-hover:bg-slate-700/30"
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs font-black text-sky-400/60 bg-sky-400/5 px-2 py-0.5 rounded border border-sky-400/10 uppercase tracking-tighter">
              {testCase.id}
            </span>
            {testCase.priority && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getPriorityStyles(testCase.priority)}`}>
                {testCase.priority} Priority
              </span>
            )}
          </div>
          <h3 className="text-md font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
            {testCase.description}
          </h3>
        </div>
        {isExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
      </button>
      {isExpanded && (
        <div className="p-6 pt-0 space-y-4 border-t border-slate-700/30 bg-slate-950/20">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">Steps</span>
            <div className="text-sm text-slate-300 bg-slate-900/50 p-4 rounded-xl font-mono leading-relaxed border border-slate-800">
              {testCase.steps.split('\n').map((step, i) => (
                <div key={i} className="mb-1">{step}</div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">Expected Outcome</span>
            <p className="text-sm text-sky-200/80 bg-sky-500/5 p-4 rounded-xl border border-sky-500/10 italic">
              {testCase.expectedResult}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const TestCaseViewer: React.FC<TestCaseViewerProps> = ({ testCases, onExecute, onDownload, onAnalyze, isExecuting, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 8;

  const filtered = testCases.filter(tc => 
    Object.values(tc).some(v => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sorting: High priority tests show up first
  const sorted = [...filtered].sort((a, b) => {
    const pOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    const pA = a.priority ? pOrder[a.priority] : 3;
    const pB = b.priority ? pOrder[b.priority] : 3;
    return pA - pB;
  });

  const displayed = showAll ? sorted : sorted.slice(0, itemsPerPage);

  const hasPriorities = testCases.some(tc => tc.priority);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white">Generated Suite</h2>
          <p className="text-slate-500 text-sm mt-1">
            {testCases.length} specialized test cases engineered by Gemini
            {hasPriorities && <span className="text-sky-400 font-semibold ml-1">• AI Prioritized</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onAnalyze} variant="primary" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/20 border-none px-6">
            <BarChart3 size={18} className="mr-2" /> {hasPriorities ? 'Re-Analyze Suite' : 'Analyze & Prioritize'}
          </Button>
          <Button onClick={onExecute} disabled={isExecuting} variant="secondary">
            {isExecuting ? <Spinner size="small" className="mr-2" /> : <Play size={18} className="mr-2" />}
            AI Simulation
          </Button>
           <Button onClick={onReset} variant="outline">
            <RefreshCw size={18} className="mr-2" /> Reset
          </Button>
        </div>
      </div>

      {!hasPriorities && (
        <div className="bg-sky-500/5 border border-sky-500/10 p-4 rounded-xl flex items-center gap-3 text-sky-200/70 text-sm italic">
          <AlertCircle size={18} className="shrink-0" />
          <span>Tip: Click "Analyze & Prioritize" to let AI rank critical test cases for faster execution.</span>
        </div>
      )}

      <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Download size={16} className="text-slate-500" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Export Formats</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => onDownload('json')} variant="outline" size="small" className="border-slate-700"><FileJson size={16} className="mr-2" /> JSON</Button>
          <Button onClick={() => onDownload('doc')} variant="outline" size="small" className="border-slate-700"><FileText size={16} className="mr-2" /> DOC</Button>
          <Button onClick={() => onDownload('csv')} variant="outline" size="small" className="border-slate-700"><FileSpreadsheet size={16} className="mr-2" /> CSV</Button>
          <Button onClick={() => onDownload('pdf')} variant="outline" size="small" className="border-slate-700"><FileArchive size={16} className="mr-2" /> PDF</Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text"
          placeholder="Filter test cases (ID, description, priority)..."
          className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-500 transition-all text-slate-200 placeholder-slate-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {displayed.map((tc, index) => (
          <TestCaseItem key={tc.id} testCase={tc} index={index} />
        ))}
        {displayed.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No test cases match your search criteria.
          </div>
        )}
      </div>
      
      {sorted.length > itemsPerPage && (
        <div className="text-center pt-4">
          <Button onClick={() => setShowAll(!showAll)} variant="outline" size="medium">
            {showAll ? 'Show Condensed' : `View All ${sorted.length} Cases`}
          </Button>
        </div>
      )}
    </div>
  );
};
