
import React, { useState } from 'react';
import { 
  FileCode, 
  Folder, 
  Play, 
  Save, 
  ChevronRight, 
  ChevronDown, 
  Search,
  Settings,
  X,
  Plus,
  Zap,
  Bot,
  ArrowLeft,
  Code2,
  MousePointer2,
  History,
  FolderOpen,
  Eye,
  CheckCircle2
} from 'lucide-react';
import type { VirtualFile, AutomationProject } from '../types';
import { Button } from './common/Button';

interface AutomationDashboardProps {
  project: AutomationProject;
  onBack: () => void;
  onUpdateFile: (path: string, content: string) => void;
}

export const AutomationDashboard: React.FC<AutomationDashboardProps> = ({ project, onBack, onUpdateFile }) => {
  const [activeFile, setActiveFile] = useState<VirtualFile | null>(
    project.files.find(f => f.path === project.activeFilePath) || project.files[0] || null
  );
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Welcome to Playwright AI Shell', 'Type "npx playwright test" to execute...']);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'explorer' | 'playwright'>('explorer');

  const executeCommand = (cmd: string) => {
    setTerminalOutput(prev => [...prev, `> ${cmd}`]);
    if (cmd === 'npx playwright test') {
      setIsExecuting(true);
      setTerminalOutput(prev => [...prev, 'Running Playwright tests...', 'Scanning specs...', 'Found ' + (project?.files?.length || 0) + ' files...']);
      
      setTimeout(() => {
        setTerminalOutput(prev => [
          ...prev, 
          '✔ tests/e2e.spec.ts:15 (2.4s)', 
          '✔ pages/AppPage.ts: Locators Validated (0.1s)', 
          'Pass Rate: 100% (12 tests)',
          '---------------------------------------',
          'Generating Results...',
          'CREATED: /results/test-report.json',
          'CREATED: /results/screenshots/failure_tc01.png (Simulated)',
          '12 passed (5.8s)'
        ]);
        setIsExecuting(false);
      }, 3000);
    } else {
      setTerminalOutput(prev => [...prev, `Command not found: ${cmd}`]);
    }
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeFile) {
      onUpdateFile(activeFile.path, e.target.value);
    }
  };

  const simulatePickLocator = () => {
    setTerminalOutput(prev => [...prev, '[Playwright Extension] Picking locator...']);
    setTimeout(() => {
      const mockLocator = `this.page.getByRole('button', { name: 'Submit' })`;
      if (activeFile && activeFile.path.includes('AppPage.ts')) {
        const newContent = activeFile.content + `\n  // Added via Playwright Extension\n  readonly submitButton = ${mockLocator};`;
        onUpdateFile(activeFile.path, newContent);
        setTerminalOutput(prev => [...prev, `[Playwright Extension] Picked: ${mockLocator}`]);
      } else {
        setTerminalOutput(prev => [...prev, '[Error] Please select AppPage.ts in the editor to add locators.']);
      }
    }, 1000);
  };

  if (!project || !project.files) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0d1117] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Project failed to load correctly.</p>
          <Button onClick={onBack} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1117] text-slate-300 flex flex-col font-sans overflow-hidden animate-in fade-in duration-500">
      {/* Top Header */}
      <header className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="small" className="border-none hover:bg-white/10">
            <ArrowLeft size={16} className="mr-2" /> Back to Suite
          </Button>
          <div className="h-4 w-px bg-slate-700 mx-2" />
          <div className="flex items-center gap-2">
            <Code2 className="text-sky-400" size={18} />
            <span className="text-sm font-bold text-white">Playwright AI Studio</span>
            <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded ml-2 uppercase font-black tracking-tighter">Pro Framework</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => executeCommand('npx playwright test')} 
            variant="primary" 
            size="small" 
            disabled={isExecuting}
            className="bg-emerald-600 hover:bg-emerald-500 border-none shadow-lg shadow-emerald-900/20"
          >
            <Play size={14} className="mr-2 fill-current" /> {isExecuting ? 'Running...' : 'Run Automation'}
          </Button>
          <Button variant="outline" size="small" className="border-[#30363d] hover:bg-white/5">
            <Save size={14} className="mr-2" /> Save Project
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-4 gap-6">
          <FolderOpen 
            size={24} 
            className={`cursor-pointer transition-colors ${activeSidebarTab === 'explorer' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`} 
            onClick={() => setActiveSidebarTab('explorer')}
          />
          <MousePointer2 
            size={24} 
            className={`cursor-pointer transition-colors ${activeSidebarTab === 'playwright' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setActiveSidebarTab('playwright')}
          />
          <History size={24} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
          <div className="mt-auto mb-4">
            <Settings size={24} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col">
          {activeSidebarTab === 'explorer' ? (
            <>
              <div className="p-3 text-[10px] uppercase font-black tracking-widest text-slate-500 flex justify-between items-center">
                <span>Explorer: Project</span>
                <Plus size={14} className="cursor-pointer hover:text-white" />
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <div className="space-y-1">
                  <div className="flex items-center px-4 py-1 text-slate-100 hover:bg-[#161b22] cursor-pointer">
                    <ChevronDown size={14} className="mr-1" />
                    <Folder size={16} className="text-sky-400 mr-2" />
                    <span className="text-xs font-semibold tracking-tight">src</span>
                  </div>
                  {project.files.map(file => (
                    <div 
                      key={file.path}
                      onClick={() => setActiveFile(file)}
                      className={`flex items-center pl-10 pr-4 py-1.5 text-xs cursor-pointer transition-colors ${activeFile?.path === file.path ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-slate-400 hover:bg-[#161b22] hover:text-slate-200'}`}
                    >
                      <FileCode size={14} className="mr-2 opacity-70" />
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center px-4 py-1 text-slate-400 hover:bg-[#161b22] cursor-pointer mt-4">
                    <ChevronRight size={14} className="mr-1" />
                    <Folder size={16} className="text-slate-500 mr-2" />
                    <span className="text-xs">results</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer2 className="text-sky-400" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Playwright Extension</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                Simulate picking locators from your live application. Added directly to active Page Object.
              </p>
              <Button onClick={simulatePickLocator} variant="outline" className="w-full text-xs border-sky-500/30 text-sky-400 hover:bg-sky-500/10">
                <Search size={14} className="mr-2" /> Pick New Locator
              </Button>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-[#0d1117]">
          {/* Tabs */}
          <div className="h-9 bg-[#161b22] flex items-center overflow-x-auto border-b border-[#30363d]">
            {activeFile ? (
              <div className="px-4 h-full flex items-center bg-[#0d1117] border-t border-sky-400 text-xs text-white min-w-[120px]">
                <FileCode size={14} className="mr-2 text-sky-400" />
                <span className="truncate font-mono">{activeFile.name}</span>
                <X size={14} className="ml-3 hover:text-red-400 cursor-pointer" />
              </div>
            ) : (
              <div className="px-4 text-xs text-slate-600">No file open</div>
            )}
          </div>

          {/* Code Input */}
          <div className="flex-1 relative font-mono text-sm">
            {activeFile ? (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0d1117] border-r border-[#30363d] flex flex-col items-center pt-4 text-slate-600 select-none">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <span key={i} className="leading-6 text-[11px]">{i + 1}</span>
                  ))}
                </div>
                <textarea
                  className="absolute left-12 right-0 top-0 bottom-0 bg-transparent text-slate-300 p-4 outline-none resize-none leading-6 focus:bg-white/[0.01]"
                  value={activeFile.content}
                  onChange={handleEditorChange}
                  spellCheck={false}
                  autoFocus
                />
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 italic">
                Select a file from the explorer to start editing
              </div>
            )}
          </div>

          {/* Bottom Panel (Terminal) */}
          {showTerminal && (
            <div className="h-1/3 bg-[#0d1117] border-t border-[#30363d] flex flex-col shadow-2xl">
              <div className="h-8 bg-[#161b22] px-4 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="text-slate-100 border-b-2 border-sky-400 h-full flex items-center px-1">Terminal</span>
                  <span className="cursor-pointer hover:text-slate-300">Output</span>
                </div>
                <X size={14} className="cursor-pointer" onClick={() => setShowTerminal(false)} />
              </div>
              <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-black/40">
                {terminalOutput.map((line, i) => (
                  <div key={i} className="mb-1">
                    <span className={line.startsWith('✔') || line.includes('Pass') ? 'text-emerald-400' : line.startsWith('>') ? 'text-sky-400' : line.startsWith('[Error]') ? 'text-red-400' : 'text-slate-400'}>
                      {line}
                    </span>
                  </div>
                ))}
                <div className="flex items-center text-sky-400 mt-2">
                  <span className="mr-2">$</span>
                  <input 
                    type="text" 
                    className="bg-transparent outline-none flex-1 border-none p-0 text-slate-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        executeCommand((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    placeholder="Type command..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Panel */}
        <div className="w-80 bg-[#161b22] border-l border-[#30363d] flex flex-col">
          <div className="p-4 border-b border-[#30363d] flex items-center gap-2">
            <Bot className="text-sky-400" size={20} />
            <h3 className="font-bold text-white text-sm">Automation Assistant</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-6">
            <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] text-xs leading-relaxed">
              <p className="text-slate-300 font-bold mb-2">AI Summary:</p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex gap-2"><CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" /> Locators generated from steps</li>
                <li className="flex gap-2"><CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" /> POM classes defined</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-500">Actions</span>
              <Button variant="outline" size="small" className="w-full justify-start text-xs border-indigo-500/20 bg-indigo-500/5">
                <Zap size={14} className="mr-2 text-indigo-400" /> Refactor to Clean Code
              </Button>
              <Button variant="outline" size="small" className="w-full justify-start text-xs border-emerald-500/20 bg-emerald-500/5">
                <Eye size={14} className="mr-2 text-emerald-400" /> Explain Selection
              </Button>
            </div>
          </div>
          <div className="p-4 border-t border-[#30363d]">
            <input 
              type="text" 
              placeholder="Ask AI..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
