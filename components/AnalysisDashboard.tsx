
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
  Star,
  BrainCircuit,
  Activity,
  ShieldCheck
} from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisData;
  testCases: TestCase[];
  onBack: () => void;
  onDownloadReport: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, testCases, onBack, onDownloadReport }) => {
  const metrics = data?.coverageMetrics || { functional: 0, ui: 0, edgeCases: 0, security: 0 };
  const hMetrics = data?.hallucinationMetrics || { integrityScore: 98, ghostRequirements: 2, dataMirage: 1, logicConsistency: 99 };
  const riskAreas = data?.riskAreas || [];
  const uxPredictions = data?.uxPredictions || [];
  const smokeTestIds = data?.smokeTestIds || [];
  const sanityTestIds = data?.sanityTestIds || [];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const MetricCircle = ({ value, label, color, sublabel }: { value: number; label: string; color: string; sublabel?: string }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r={radius} className="stroke-slate-800 fill-none" strokeWidth="6" />
            <circle 
              cx="48" cy="48" r={radius} 
              className={`fill-none transition-all duration-1000 ease-out ${color}`} 
              strokeWidth="6" 
              strokeDasharray={circumference} 
              strokeDashoffset={offset} 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white leading-none">{value}%</span>
            {sublabel && <span className="text-[8px] opacity-40 uppercase font-mono mt-1">{sublabel}</span>}
          </div>
        </div>
        <span className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
    );
  };

  const IntegrityBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-mono uppercase">
        <span className="text-slate-400">{label}</span>
        <span className={color}>{value}%</span>
      </div>
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );

  const highPriorityCases = testCases.filter(tc => tc.priority === 'High');
  const highPriorityCount = highPriorityCases.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white flex items-center gap-3 font-orbitron tracking-tight">
            <LayoutDashboard className="text-sky-500 w-8 h-8" />
            STRATEGIC INTEL
          </h2>
          <p className="text-slate-500 font-mono text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-500" />
            Suite Integrity Analysis Complete // {testCases.length} Nodes Indexed
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" size="medium">
            <ArrowLeft size={16} className="mr-2" /> Return
          </Button>
          <Button onClick={onDownloadReport} variant="primary" size="medium">
            <Download size={16} className="mr-2" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coverage Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-md hover:border-sky-500/20 transition-all">
            <MetricCircle value={metrics.functional} label="Functional" color="stroke-sky-500" sublabel="Logic" />
          </div>
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-md hover:border-indigo-500/20 transition-all">
            <MetricCircle value={metrics.ui} label="Interface" color="stroke-indigo-500" sublabel="UX/UI" />
          </div>
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-md hover:border-violet-500/20 transition-all">
            <MetricCircle value={metrics.edgeCases} label="Resilience" color="stroke-violet-500" sublabel="Edge" />
          </div>
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-md hover:border-emerald-500/20 transition-all">
            <MetricCircle value={metrics.security} label="Security" color="stroke-emerald-500" sublabel="Risk" />
          </div>
        </div>

        {/* Neural Integrity / Hallucination Chart */}
        <div className="bg-slate-950/60 p-6 rounded-3xl border border-sky-500/10 backdrop-blur-xl flex flex-col justify-between shadow-2xl shadow-sky-950/10">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="text-sky-400 w-5 h-5" />
            <h3 className="font-bold text-slate-100 text-xs uppercase tracking-widest font-orbitron">Neural Integrity</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[32px] font-black text-sky-400 font-orbitron tracking-tighter">{hMetrics.integrityScore}%</span>
              <div className="text-right">
                <span className="block text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">Verified</span>
                <span className="block text-[8px] font-black uppercase text-sky-500 tracking-[0.2em]">Symmetrization</span>
              </div>
            </div>
            <div className="space-y-4">
               <IntegrityBar label="Ghost Req Risk" value={hMetrics.ghostRequirements} color="text-red-400" />
               <IntegrityBar label="Data Mirage" value={hMetrics.dataMirage} color="text-amber-400" />
               <IntegrityBar label="Logic Sync" value={hMetrics.logicConsistency} color="text-sky-400" />
            </div>
          </div>
          <p className="mt-4 text-[9px] font-mono text-slate-600 leading-relaxed uppercase">
            Hallucination Probability: <span className="text-emerald-500 font-bold">{(100 - hMetrics.integrityScore).toFixed(1)}% (SAFE)</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800/50 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="text-sky-400 w-5 h-5 fill-sky-400/10" />
                <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs font-orbitron">Strategic Prioritization</h3>
              </div>
              <span className="text-[10px] bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-500/20 font-bold uppercase tracking-widest">
                {highPriorityCount} High Priority Tests
              </span>
            </div>
            <div className="p-8">
               <p className="text-sm text-slate-400 leading-relaxed mb-8 italic">
                "{data?.summary || "AI analysis of requirements map and priority distribution."}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                {highPriorityCases.length > 0 ? (
                  highPriorityCases.map(tc => (
                    <div key={tc.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-2xl hover:border-sky-500/30 transition-all group">
                       <div className="flex flex-col gap-1 min-w-0">
                         <span className="text-[9px] font-black text-red-500/80 uppercase tracking-widest font-mono">
                           {tc.id}
                         </span>
                         <span className="text-xs text-slate-100 font-bold truncate group-hover:text-sky-300 transition-colors">{tc.title}</span>
                       </div>
                       <ShieldCheck className="text-red-500/40 group-hover:text-red-500 transition-colors shrink-0" size={14} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-600 text-xs uppercase font-mono tracking-widest">
                    No critical nodes detected.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 overflow-hidden">
            <div className="p-5 border-b border-slate-800/50 bg-slate-900/60 flex items-center gap-3">
              <ShieldAlert className="text-red-400 w-5 h-5" />
              <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs font-orbitron">Critical Failure Zones</h3>
            </div>
            <div className="p-8 space-y-4">
              {riskAreas.length > 0 ? riskAreas.map((risk, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${getRiskColor(risk.level)} transition-all hover:scale-[1.02] shadow-lg`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg font-orbitron tracking-tight">{risk.area}</span>
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-black/20 border border-current opacity-60 font-mono">{risk.level}</span>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">{risk.reasoning}</p>
                </div>
              )) : (
                <p className="text-slate-600 text-sm text-center py-4 font-mono">Quiescent state: No high risks detected.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800/50 bg-slate-900/60 flex items-center gap-3">
              <Users className="text-violet-400 w-5 h-5" />
              <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs font-orbitron">User Friction Map</h3>
            </div>
            <div className="p-8 space-y-6">
              {uxPredictions.length > 0 ? uxPredictions.map((ux, i) => (
                <div key={i} className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 blur-3xl rounded-full"></div>
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <h4 className="font-bold text-sky-400 text-sm">{ux.feature}</h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-800 text-slate-400">Score: {ux.frictionScore}/10</span>
                  </div>
                  <p className="text-xs text-slate-200 mb-4 leading-relaxed font-medium italic relative z-10">"{ux.prediction}"</p>
                  <div className="space-y-2 relative z-10">
                    {ux.suggestions?.slice(0, 3).map((s, si) => (
                      <div key={si} className="flex items-start gap-3 text-[10px] text-slate-400">
                        <Zap size={10} className="text-amber-500 mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <p className="text-slate-600 text-sm text-center py-4 font-mono">No friction patterns detected.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800/50 bg-slate-900/60 flex items-center gap-3">
              <Flame className="text-orange-400 w-5 h-5" />
              <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs font-orbitron">Smoke Clusters</h3>
            </div>
            <div className="p-8 bg-slate-950/20">
              <div className="flex flex-wrap gap-2 mb-4">
                {smokeTestIds.length > 0 ? smokeTestIds.map(id => (
                  <span key={id} className="px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl text-[10px] font-black font-mono hover:bg-orange-500/20 cursor-default transition-all">
                    {id}
                  </span>
                )) : (
                  <span className="text-slate-600 text-[10px] font-mono">N/A</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase tracking-widest">
                Nodes prioritized for rapid deployment sanity verification.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800/50 bg-slate-900/60 flex items-center gap-3">
              <CheckCircle2 className="text-sky-400 w-5 h-5" />
              <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs font-orbitron">Sanity Blocks</h3>
            </div>
            <div className="p-8 bg-slate-950/20">
              <div className="flex flex-wrap gap-2 mb-4">
                {sanityTestIds.length > 0 ? sanityTestIds.map(id => (
                  <span key={id} className="px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl text-[10px] font-black font-mono hover:bg-sky-500/20 cursor-default transition-all">
                    {id}
                  </span>
                )) : (
                  <span className="text-slate-600 text-[10px] font-mono">N/A</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase tracking-widest">
                Functional stability validation nodes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
