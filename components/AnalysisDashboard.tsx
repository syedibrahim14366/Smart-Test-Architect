
import React from 'react';
import type { AnalysisData, TestCase } from '../types';
import { Button } from './common/Button';
import { 
  ShieldAlert, 
  Flame, 
  CheckCircle2, 
  LayoutDashboard, 
  Download, 
  ArrowLeft, 
  Zap, 
  Users, 
  TrendingUp,
  BarChart3,
  Star
} from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisData;
  testCases: TestCase[];
  onBack: () => void;
  onDownloadReport: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, testCases, onBack, onDownloadReport }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const MetricCircle = ({ value, label, color }: { value: number; label: string; color: string }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r={radius} className="stroke-slate-800 fill-none" strokeWidth="8" />
            <circle 
              cx="48" cy="48" r={radius} 
              className={`fill-none transition-all duration-1000 ease-out ${color}`} 
              strokeWidth="8" 
              strokeDasharray={circumference} 
              strokeDashoffset={offset} 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{value}%</span>
          </div>
        </div>
        <span className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
    );
  };

  const highPriorityCases = testCases.filter(tc => tc.priority === 'High');
  const highPriorityCount = highPriorityCases.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="text-sky-400" />
            AI Quality Insights
          </h2>
          <p className="text-slate-400 mt-1">Deep analysis of your {testCases.length} generated test cases</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" size="medium">
            <ArrowLeft size={18} className="mr-2" /> Back to Suite
          </Button>
          <Button onClick={onDownloadReport} variant="primary" size="medium">
            <Download size={18} className="mr-2" /> Download AI Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
          <MetricCircle value={data.coverageMetrics.functional} label="Functional" color="stroke-sky-500" />
        </div>
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
          <MetricCircle value={data.coverageMetrics.ui} label="UI / UX" color="stroke-indigo-500" />
        </div>
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
          <MetricCircle value={data.coverageMetrics.edgeCases} label="Edge Cases" color="stroke-violet-500" />
        </div>
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
          <MetricCircle value={data.coverageMetrics.security} label="Security" color="stroke-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg shadow-sky-500/5">
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="text-sky-400 w-5 h-5 fill-sky-400/20" />
                <h3 className="font-bold text-slate-100">Prioritization Strategy</h3>
              </div>
              <span className="text-xs bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-500/20 font-bold uppercase tracking-wider">
                {highPriorityCount} High Priority Tests
              </span>
            </div>
            <div className="p-6">
               <p className="text-sm text-slate-300 leading-relaxed mb-6">
                AI has analyzed your requirements and prioritized your test suite. 
                Below are all high-priority cases covering core business logic and critical data flows. 
                Simulation runs these first to provide immediate feedback on vital application paths.
              </p>
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {highPriorityCases.length > 0 ? (
                  highPriorityCases.map(tc => (
                    <div key={tc.id} className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-700/50 rounded-lg hover:border-sky-500/30 transition-all">
                       <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-red-400/80 uppercase px-1.5 py-0.5 bg-red-400/5 border border-red-400/20 rounded">
                           {tc.id}
                         </span>
                         <span className="text-xs text-slate-200 line-clamp-1">{tc.description}</span>
                       </div>
                       <span className="text-[10px] font-bold text-red-400 uppercase shrink-0 ml-4">Critical</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No high-priority test cases identified.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/60 flex items-center gap-2">
              <ShieldAlert className="text-red-400 w-5 h-5" />
              <h3 className="font-bold text-slate-100">Critical Risk Areas</h3>
            </div>
            <div className="p-6 space-y-4">
              {data.riskAreas.map((risk, i) => (
                <div key={i} className={`p-4 rounded-xl border ${getRiskColor(risk.level)} transition-all hover:scale-[1.01]`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg">{risk.area}</span>
                    <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-black/20">{risk.level} Risk</span>
                  </div>
                  <p className="text-sm opacity-80 leading-relaxed">{risk.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/60 flex items-center gap-2">
              <Users className="text-violet-400 w-5 h-5" />
              <h3 className="font-bold text-slate-100">UX Experience Prediction</h3>
            </div>
            <div className="p-6 space-y-4">
              {data.uxPredictions.map((ux, i) => (
                <div key={i} className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/30">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-sky-300 text-sm">{ux.feature}</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono opacity-60">Friction: {ux.frictionScore}/10</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 italic">"{ux.prediction}"</p>
                  <div className="space-y-1.5">
                    {ux.suggestions.slice(0, 2).map((s, si) => (
                      <div key={si} className="flex items-start gap-2 text-[10px] text-slate-300">
                        <Zap size={10} className="text-amber-400 mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/60 flex items-center gap-2">
              <Flame className="text-orange-400 w-5 h-5" />
              <h3 className="font-bold text-slate-100">Smoke Test Suite</h3>
            </div>
            <div className="p-6 bg-slate-900/20">
              <div className="flex flex-wrap gap-2">
                {data.smokeTestIds.map(id => (
                  <span key={id} className="px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg text-xs font-bold hover:bg-orange-500/20 cursor-default transition-all">
                    {id}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Critical path tests prioritized for immediate deployment health checks.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/60 flex items-center gap-2">
              <CheckCircle2 className="text-sky-400 w-5 h-5" />
              <h3 className="font-bold text-slate-100">Sanity Test Suite</h3>
            </div>
            <div className="p-6 bg-slate-900/20">
              <div className="flex flex-wrap gap-2">
                {data.sanityTestIds.map(id => (
                  <span key={id} className="px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-bold hover:bg-sky-500/20 cursor-default transition-all">
                    {id}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Logic verification tests prioritized for verifying stability after updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
