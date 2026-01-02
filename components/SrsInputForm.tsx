
import React, { useState, useRef, useCallback } from 'react';
import { Button } from './common/Button';
import { MAX_SRS_LENGTH } from '../constants';
import { Send, Upload, FileText, X, File, AlertCircle } from 'lucide-react';
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

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size exceeds 10MB limit.");
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
    reader.onerror = () => setError("Failed to read file.");
    
    if (selectedFile.type === 'application/pdf') {
      reader.readAsDataURL(selectedFile);
    } else {
      // For text files, we could also just read as text, but for the API consistency 
      // with PDFs we'll use base64 for PDF and text for others if needed.
      // However, Gemini can handle text/plain in inlineData too.
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const dummyEvent = { target: { files: [droppedFile] } } as any;
      handleFileChange(dummyEvent);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'text' && srsText.trim()) {
      onSubmit({ type: 'text', content: srsText });
    } else if (activeTab === 'file' && file) {
      onSubmit({ type: 'file', ...file });
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-700">
        <button
          className={`px-6 py-2 font-medium transition-colors ${activeTab === 'text' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
          onClick={() => setActiveTab('text')}
        >
          Text Input
        </button>
        <button
          className={`px-6 py-2 font-medium transition-colors ${activeTab === 'file' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
          onClick={() => setActiveTab('file')}
        >
          Upload Document
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'text' ? (
          <div>
            <label htmlFor="srs" className="block text-sm font-medium text-slate-400 mb-2">
              Paste SRS, FSD or User Stories
            </label>
            <textarea
              id="srs"
              rows={12}
              className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-500 transition-all"
              placeholder="e.g. 'As a user, I want to be able to reset my password via email...'"
              value={srsText}
              onChange={(e) => setSrsText(e.target.value)}
              maxLength={MAX_SRS_LENGTH}
              disabled={disabled}
            />
            <div className="flex justify-between mt-2">
              <p className="text-xs text-slate-500">
                {srsText.length} / {MAX_SRS_LENGTH} characters
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!file ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer border-2 border-dashed border-slate-700 hover:border-sky-500 bg-slate-900/30 rounded-xl p-12 flex flex-col items-center justify-center transition-all"
              >
                <Upload className="w-12 h-12 text-slate-500 group-hover:text-sky-400 mb-4 transition-colors" />
                <p className="text-slate-300 font-medium">Click to upload or drag & drop</p>
                <p className="text-slate-500 text-sm mt-1">Supported: PDF, TXT, MD (Max 10MB)</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.txt,.md"
                />
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-sky-500/30 rounded-lg p-6 flex items-center justify-between shadow-lg animate-in fade-in zoom-in duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sky-500/10 rounded-full">
                    <File className="w-8 h-8 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold truncate max-w-[250px]">{file.fileName}</h3>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">
                      {(file.size / 1024).toFixed(1)} KB • {file.mimeType.split('/')[1]}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-700/50">
          <Button 
            type="submit" 
            disabled={disabled || (activeTab === 'text' ? !srsText.trim() : !file)}
            variant="primary"
            size="large"
            className="group"
          >
            Process Requirements <Send size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
};
