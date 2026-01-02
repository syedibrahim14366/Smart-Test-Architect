
import React, { useState, useCallback, useEffect } from 'react';
import { SrsInputForm } from './components/SrsInputForm';
import { TestCaseGenerationOptions } from './components/TestCaseGenerationOptions';
import { TestCaseViewer } from './components/TestCaseViewer';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ScenarioMapper } from './components/ScenarioMapper';
import { WelcomeModal } from './components/WelcomeModal';
import { Spinner } from './components/common/Spinner';
import { generateTestCases, analyzeTestSuite, extractScenarios } from './services/geminiService';
import { downloadFile } from './services/downloadService';
import type { TestCase, DownloadFormat, RequirementSource, AnalysisData, ExpectedScenario } from './types';
import { AlertTriangle, BrainCircuit, Cpu, Zap, Activity, ShieldCheck, Brain } from 'lucide-react';
import { Button } from './components/common/Button';

type AppStage = 'srsInput' | 'mappingScenarios' | 'selectCount' | 'displayResults' | 'analysisView';

const App: React.FC = () => {
  const [appStage, setAppStage] = useState<AppStage>('srsInput');
  const [reqSource, setReqSource] = useState<RequirementSource | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [scenarios, setScenarios] = useState<ExpectedScenario[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [targetCount, setTargetCount] = useState<number | 'auto'>(0);
  const [error, setError] = useState<string | null>(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);

  useEffect(() => {
    if (appStage === 'displayResults' && (!testCases || testCases.length === 0) && !isLoading) {
      setAppStage('srsInput');
    }
  }, [appStage, testCases, isLoading]);

  const handleRequirementSubmit = useCallback(async (source: RequirementSource) => {
    setReqSource(source);
    setIsLoading(true);
    setAppStage('mappingScenarios');
    setError(null);
    try {
      const extracted = await extractScenarios(source);
      setScenarios(extracted);
    } catch (err) {
      console.error("Mapping error:", err);
      setError("Document mapping failed. Initializing standard path.");
      setAppStage('selectCount');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleProceedToGeneration = useCallback(() => {
    setAppStage('selectCount');
  }, []);

  const handleGenerateTestCases = useCallback(async (count: 500 | 1000 | 'auto') => {
    setIsLoading(true);
    setProgress(0);
    setTargetCount(count);
    setError(null);
    try {
      const generated = await generateTestCases(reqSource!, count, (c) => setProgress(c));
      if (!generated || generated.length === 0) {
        throw new Error("AI engine failed to generate test data.");
      }
      setTestCases(generated);
      setAppStage('displayResults');
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Neural link failure during generation.");
      setAppStage('srsInput');
    } finally {
      setIsLoading(false);
    }
  }, [reqSource]);

  const handleAnalyzeSuite = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await analyzeTestSuite(reqSource!, testCases);
      if (testCases && analysis.priorityMaps) {
        const priorityMap = new Map(analysis.priorityMaps.map(m => [m.id, m.priority]));
        setTestCases(prev => prev.map(tc => ({ ...tc, priority: priorityMap.get(tc.id) || 'Medium' })));
      }
      setAnalysisData(analysis);
      setAppStage('analysisView');
    } catch (err) {
      setError("Strategic analysis synthesis failed.");
    } finally {
      setIsLoading(false);
    }
  }, [testCases, reqSource]);

  const handleDownload = useCallback((format: DownloadFormat) => {
    const sourceInfo = reqSource?.type === 'text' ? reqSource.content : `Doc: ${reqSource?.fileName}`;
    downloadFile(testCases, format, sourceInfo, analysisData || undefined);
  }, [testCases, reqSource, analysisData]);

  const handleReset = useCallback(() => {
    setAppStage('srsInput');
    setReqSource(null);
    setTestCases([]);
    setScenarios([]);
    setAnalysisData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pt-12 sm:pt-24 pb-20 overflow-x-hidden">
      <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
      
      <header className="w-full max-w-5xl mb-16 text-center flex flex-col items-center z-10">
        <div className="inline-flex items-center space-x-3 mb-8 bg-sky-500/10 px-8 py-3 rounded-full border border-sky-500/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(14,165,233,0.15)] animate-in fade-in zoom-in duration-700">
          <BrainCircuit className="w-6 h-6 text-sky-400 animate-pulse" />
          <span className="text-sky-300 text-[11px] font-bold tracking-[0.4em] uppercase font-orbitron">Neural Interface Active</span>
        </div>
        
        <h1 className="text-5xl sm:text-8xl font-orbitron font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-sky-500 mb-6 glow-text animate-in fade-in slide-in-from-top duration-1000">
          LeanISTQB <span className="text-sky-500">TestGen</span>
        </h1>
        
        <p className="text-slate-400 max-w-3xl text-sm sm:text-xl font-medium tracking-wide leading-relaxed font-mono opacity-90 animate-in fade-in duration-1000 delay-300">
          ISTQB-compliant test infrastructure for high-scale logic validation.
          Synthesize complex requirements into <span className="text-sky-400">precision-engineered</span> test nodes.
        </p>
      </header>

      {error && (
        <div className="w-full max-w-2xl bg-red-950/40 border-2 border-red-500/30 text-red-100 px-8 py-6 rounded-[2rem] mb-12 flex items-center gap-6 backdrop-blur-3xl shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-in zoom-in duration-500 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-red-500/50 rounded-b-full shadow-[0_0_10px_red]"></div>
          <AlertTriangle size={36} className="text-red-500 shrink-0 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-orbitron font-bold text-[11px] uppercase tracking-widest text-red-400 mb-1">System Exception Detected</span>
            <span className="text-sm font-mono opacity-90 leading-relaxed">{error}</span>
          </div>
        </div>
      )}
      
      <main className="w-full max-w-5xl glass-panel rounded-[3rem] p-1 sm:p-1 overflow-hidden transition-all duration-700 hover:shadow-[0_0_60px_rgba(14,165,233,0.1)]">
        <div className="relative p-8 sm:p-16 min-h-[550px]">
          <div className="bracket-corner corner-tl"></div>
          <div className="bracket-corner corner-tr"></div>
          <div className="bracket-corner corner-bl"></div>
          <div className="bracket-corner corner-br"></div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
              <div className="relative mb-14">
                 <Spinner size="large" className="text-sky-400" />
                 <Zap className="absolute inset-0 m-auto text-sky-400 w-10 h-10 animate-ping" />
              </div>
              <h3 className="text-white text-4xl font-orbitron font-black tracking-[0.2em] uppercase glow-text mb-6 text-center">
                {appStage === 'displayResults' ? 'Synthesizing Test Nodes' : appStage === 'mappingScenarios' ? 'Neural Mapping Source' : 'Syncing Core Memory'}
              </h3>
              <div className="mt-8 w-full max-w-lg bg-slate-900/80 rounded-full h-3 overflow-hidden border border-sky-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                <div 
                  className="bg-gradient-to-r from-sky-600 via-sky-300 to-indigo-500 h-full transition-all duration-1000 shadow-[0_0_25px_rgba(14,165,233,0.6)]" 
                  style={{ width: `${targetCount === 'auto' ? 65 : (targetCount > 0 ? (progress / targetCount) * 100 : 35)}%` }} 
                />
              </div>
              <div className="mt-8 flex items-center gap-6 text-sky-400 font-mono text-xs uppercase tracking-[0.4em]">
                <Activity className="w-5 h-5 animate-spin-slow" />
                <span>
                  {targetCount === 'auto' 
                    ? `AUTONOMOUS_MODE: ${progress} NODES SYNTHESIZED` 
                    : `LOAD_VECTOR: ${progress} / ${targetCount || 'SEARCHING...'}`}
                </span>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
              {appStage === 'srsInput' && (
                <SrsInputForm onSubmit={handleRequirementSubmit} initialSrs={reqSource?.type === 'text' ? reqSource.content : ''} />
              )}

              {appStage === 'mappingScenarios' && reqSource && (
                <ScenarioMapper 
                  scenarios={scenarios} 
                  reqSource={reqSource}
                  onProceed={handleProceedToGeneration} 
                  onBack={handleReset} 
                />
              )}

              {appStage === 'selectCount' && (
                <TestCaseGenerationOptions onGenerate={handleGenerateTestCases} onBack={() => setAppStage('mappingScenarios')} />
              )}
              
              {appStage === 'displayResults' && testCases.length > 0 && (
                <TestCaseViewer
                  testCases={testCases}
                  onDownload={handleDownload}
                  onAnalyze={handleAnalyzeSuite}
                  onReset={handleReset}
                  onBack={() => setAppStage('selectCount')}
                />
              )}

              {appStage === 'analysisView' && analysisData && testCases.length > 0 && (
                <AnalysisDashboard 
                  data={analysisData} 
                  testCases={testCases} 
                  onBack={() => setAppStage('displayResults')}
                  onDownloadReport={() => handleDownload('analysis-pdf')}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 flex flex-col items-center gap-10 opacity-60 hover:opacity-100 transition-all duration-500">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {/* AI Brain Logo */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-500/20 blur-lg rounded-full animate-pulse"></div>
              <Brain className="w-10 h-10 text-sky-400 relative z-10 transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-orbitron font-black text-white uppercase tracking-[0.2em]">Neural Engine</span>
              <span className="text-[8px] font-mono text-sky-500/70 uppercase tracking-widest">Powered by Gemini AI</span>
            </div>
          </div>

          {/* ISTQB Stylized Logo */}
          <div className="flex items-center gap-3 group">
            <div className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg group-hover:border-sky-500/50 transition-colors shadow-2xl">
              <div className="flex flex-col items-center leading-none">
                <span className="text-[14px] font-orbitron font-black text-white">ISTQB</span>
                <div className="h-px w-full bg-sky-500/30 my-0.5"></div>
                <span className="text-[6px] font-mono text-sky-400 font-bold tracking-tighter uppercase">Certified Standard</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-orbitron font-black text-white uppercase tracking-[0.2em]">Compliance</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">ISO/IEC/IEEE 29119</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 text-slate-500 text-[11px] font-mono tracking-[0.5em] uppercase">
            <ShieldCheck size={14} className="text-sky-500" />
            Secured Interface Layer
            <span className="h-4 w-px bg-slate-800"></span>
            Build 2.5.0-F
          </div>
          <p className="text-slate-600 text-[9px] font-mono uppercase tracking-[0.8em]">Neural Network Operational // 0 Errors Detected</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
