
import React, { useState, useRef, useCallback } from 'react';
import { Button } from './common/Button';
import { MAX_SRS_LENGTH } from '../constants';
import { Send, Upload, FileText, X, File, AlertCircle, Cpu, Terminal } from 'lucide-react';
import type { RequirementSource } from '../types';

interface SrsInputFormProps {
  onSubmit: (source: RequirementSource) => void;
  initialSrs?: string;
  disabled?: boolean;
}

export const SrsInputForm: React.FC<SrsInputFormProps> = ({ onSubmit, initialSrs = '', disabled }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [srsText, setSrsText] = useState<string>(initialSrs);
  const [file, setFile] = useState<{ data: string; mimeType: string; fileName: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Payload exceeds 10MB capacity.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setFile({
        data: base64,
        mimeType: selectedFile.type || 'application/octet-stream',
        fileName: selectedFile.name,
        size: selectedFile.size
      });
      setError(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'text' && srsText.trim()) {
      onSubmit({ type: 'text', content: srsText });
    } else if (activeTab === 'file' && file) {
      onSubmit({ type: 'file', ...file });
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 max-w-sm mx-auto shadow-2xl">
        <button
          className={`flex-1 px-6 py-2.5 font-orbitron text-[9px] uppercase tracking-[0.2em] font-black rounded-xl transition-all ${activeTab === 'text' ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'text-slate-500 hover:text-sky-400'}`}
          onClick={() => setActiveTab('text')}
        >
          Console
        </button>
        <button
          className={`flex-1 px-6 py-2.5 font-orbitron text-[9px] uppercase tracking-[0.2em] font-black rounded-xl transition-all ${activeTab === 'file' ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'text-slate-500 hover:text-sky-400'}`}
          onClick={() => setActiveTab('file')}
        >
          Data-Link
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {activeTab === 'text' ? (
          <div className="relative group">
            <div className="absolute -top-3 left-6 bg-slate-950 px-3 text-[9px] font-black font-orbitron text-sky-500 uppercase tracking-widest z-10">
              Neural Input Matrix
            </div>
            <div className="relative glass-panel rounded-3xl overflow-hidden border-2 border-slate-800 focus-within:border-sky-500/50 transition-all">
              <textarea
                rows={12}
                className="w-full p-8 bg-transparent text-slate-100 placeholder:text-slate-700 transition-all font-mono text-xs leading-relaxed outline-none resize-none"
                placeholder="Paste requirements, user stories, or technical specifications here..."
                value={srsText}
                onChange={(e) => setSrsText(e.target.value)}
                maxLength={MAX_SRS_LENGTH}
                disabled={disabled}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                <div 
                  className="h-full bg-sky-500 transition-all duration-500 shadow-[0_0_10px_rgba(14,165,233,1)]"
                  style={{ width: `${(srsText.length / MAX_SRS_LENGTH) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between mt-4 px-4 text-[8px] font-mono text-slate-600 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Terminal size={10} /> Stream: {srsText.length} bytes</span>
              <span>Capacity: {MAX_SRS_LENGTH} chars</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer glass-panel border-2 border-dashed border-slate-800 hover:border-sky-500/50 hover:bg-sky-500/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center transition-all duration-500"
              >
                <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 group-hover:border-sky-500/30 group-hover:shadow-[0_0_40px_rgba(14,165,233,0.1)] transition-all mb-8">
                  <Upload className="w-12 h-12 text-slate-700 group-hover:text-sky-400 group-hover:scale-110 transition-all duration-500" />
                </div>
                <h3 className="text-white font-orbitron font-black text-sm uppercase tracking-widest mb-2">Initialize Data Intake</h3>
                <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">Supports PDF, TXT, Markdown // Max 10MB</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.txt,.md"
                />
              </div>
            ) : (
              <div className="glass-panel border-2 border-emerald-500/20 bg-emerald-500/5 rounded-3xl p-8 flex items-center justify-between shadow-[0_0_40px_rgba(16,185,129,0.05)] animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <FileText className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-orbitron font-black text-sm tracking-wide">{file.fileName}</h3>
                    <p className="text-emerald-500/60 font-mono text-[9px] uppercase tracking-widest">
                      Payload Detected: {(file.size / 1024).toFixed(1)} KB // Handshake OK
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-4 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10">
          <div className="flex items-center gap-4 px-6 py-3 bg-slate-900/50 rounded-full border border-slate-800">
             <Cpu size={14} className="text-sky-500 animate-pulse" />
             <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Engine Ready for Symmetrization</span>
          </div>
          <Button 
            type="submit" 
            disabled={disabled || (activeTab === 'text' ? !srsText.trim() : !file)}
            variant="primary"
            size="large"
            className="w-full sm:w-auto shadow-[0_0_30px_rgba(14,165,233,0.2)]"
          >
            Symmetrize Source <Send size={14} className="ml-3" />
          </Button>
        </div>
      </form>
    </div>
  );
};
