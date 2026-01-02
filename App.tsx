
import React, { useState, useCallback } from 'react';
import { SrsInputForm } from './components/SrsInputForm';
import { TestCaseGenerationOptions } from './components/TestCaseGenerationOptions';
import { TestCaseViewer } from './components/TestCaseViewer';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ExecutionReportModal } from './components/ExecutionReportModal';
import { Spinner } from './components/common/Spinner';
import { generateTestCases, simulateExecution, analyzeTestSuite } from './services/geminiService';
import { downloadFile } from './services/downloadService';
import type { TestCase, DownloadFormat, RequirementSource, AnalysisData } from './types';
import { AlertTriangle, FileText, BrainCircuit } from 'lucide-react';

type AppStage = 'srsInput' | 'selectCount' | 'displayResults' | 'analysisView';

const App: React.FC = () => {
  const [appStage, setAppStage] = useState<AppStage>('srsInput');
  const [reqSource, setReqSource] = useState<RequirementSource | null>(null);
  const [testCases, setTestCases] = useState<TestCase[] | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [targetCount, setTargetCount] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [showExecutionModal, setShowExecutionModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);

  React.useEffect(() => {
    if (!process.env.API_KEY) {
      setError("Gemini API Key (process.env.API_KEY) is not configured.");
      setApiKeyError(true);
    }
  }, []);

  const handleRequirementSubmit = useCallback((source: RequirementSource) => {
    if (apiKeyError) return;
    setReqSource(source);
    setAppStage('selectCount');
    setError(null);
  }, [apiKeyError]);

  const handleGenerateTestCases = useCallback(async (count: 500 | 1000) => {
    if (apiKeyError || !reqSource) return;
    setIsLoading(true);
    setProgress(0);
    setTargetCount(count);
    setError(null);
    setTestCases(null);
    try {
      const generated = await generateTestCases(reqSource, count, (current) => {
        setProgress(current);
      });
      setTestCases(generated);
      setAppStage('displayResults');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setIsLoading(false);
    }
  }, [reqSource, apiKeyError]);

  const handleAnalyzeSuite = useCallback(async () => {
    if (apiKeyError || !testCases || !reqSource) return;
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await analyzeTestSuite(reqSource, testCases);
      setAnalysisData(analysis);
      setAppStage('analysisView');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setIsLoading(false);
    }
  }, [testCases, reqSource, apiKeyError]);

  const handleExecuteTestCases = useCallback(async () => {
    if (apiKeyError || !testCases) return;
    setIsExecuting(true);
    try {
      const result = await simulateExecution(testCases);
      setExecutionResult(result);
      setShowExecutionModal(true);
    } catch (err) {
      setError("Execution simulation failed.");
    } finally {
      setIsExecuting(false);
    }
  }, [testCases, apiKeyError]);

  const handleDownload = useCallback((format: DownloadFormat) => {
    if (!testCases) return;
    const sourceInfo = reqSource?.type === 'text' ? reqSource.content : `Doc: ${reqSource?.fileName}`;
    downloadFile(testCases, format, sourceInfo, analysisData || undefined);
  }, [testCases, reqSource, analysisData]);
  
  const handleReset = useCallback(() => {
    setAppStage('srsInput');
    setReqSource(null);
    setTestCases(null);
    setAnalysisData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 text-center">
        <div className="inline-flex items-center space-x-3 mb-4 bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/20">
          <BrainCircuit className="w-5 h-5 text-sky-400" />
          <span className="text-sky-300 text-sm font-semibold tracking-wide uppercase">AI QA Intelligence Engine</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-indigo-300 tracking-tight">
          Smart Test Architect
        </h1>
      </header>

      {error && (
        <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}
      
      <main className="w-full max-w-5xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-10 transition-all">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner size="large" />
            <h3 className="mt-8 text-slate-200 text-2xl font-bold">
              {appStage === 'displayResults' ? 'Deep AI Analysis...' : 'Generating Intelligence...'}
            </h3>
            {targetCount > 0 && progress < targetCount && (
               <div className="mt-4 w-full max-w-xs bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                  <div className="bg-sky-500 h-full transition-all duration-500" style={{ width: `${(progress / targetCount) * 100}%` }} />
               </div>
            )}
            <p className="mt-4 text-slate-500 text-sm animate-pulse">Consulting Gemini for QA insights...</p>
          </div>
        )}

        {!isLoading && appStage === 'srsInput' && (
          <SrsInputForm onSubmit={handleRequirementSubmit} initialSrs={reqSource?.type === 'text' ? reqSource.content : ''} disabled={apiKeyError} />
        )}

        {!isLoading && appStage === 'selectCount' && (
          <TestCaseGenerationOptions onGenerate={handleGenerateTestCases} onBack={() => setAppStage('srsInput')} />
        )}
        
        {!isLoading && appStage === 'displayResults' && testCases && (
          <TestCaseViewer
            testCases={testCases}
            onExecute={handleExecuteTestCases}
            onDownload={handleDownload}
            onAnalyze={handleAnalyzeSuite}
            isExecuting={isExecuting}
            onReset={handleReset}
          />
        )}

        {!isLoading && appStage === 'analysisView' && analysisData && testCases && (
          <AnalysisDashboard 
            data={analysisData} 
            testCases={testCases} 
            onBack={() => setAppStage('displayResults')}
            onDownloadReport={() => handleDownload('analysis-pdf')}
          />
        )}
      </main>

      {showExecutionModal && executionResult && (
        <ExecutionReportModal isOpen={showExecutionModal} onClose={() => setShowExecutionModal(false)} report={executionResult} />
      )}
    </div>
  );
};

export default App;
