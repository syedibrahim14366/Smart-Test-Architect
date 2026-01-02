
import React from 'react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { Terminal } from 'lucide-react';

interface ExecutionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: string;
}

export const ExecutionReportModal: React.FC<ExecutionReportModalProps> = ({ isOpen, onClose, report }) => {
  // Basic markdown-like parsing for display
  const formatReport = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('### Simulating Test Case')) {
          return <h3 key={index} className="text-lg font-semibold text-sky-400 mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('**Test Case') && line.endsWith('**')) {
          const status = line.includes('PASSED') ? 'text-green-400' : line.includes('FAILED') ? 'text-red-400' : 'text-yellow-400';
          return <p key={index} className={`font-bold ${status} mt-1 mb-3`}>{line.substring(2, line.length - 2)}</p>;
        }
        if (line.startsWith('Action:')) {
          return <p key={index} className="text-slate-300"><strong className="text-slate-100">{line.substring(0,7)}</strong>{line.substring(7)}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-slate-300 text-sm leading-relaxed">{line}</p>;
      });
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Test Execution Simulation" icon={<Terminal className="text-sky-400" />}>
      <div className="mt-4 max-h-[60vh] overflow-y-auto p-1 bg-slate-900/50 rounded-md border border-slate-700">
        <pre className="whitespace-pre-wrap font-mono text-xs p-4">{formatReport(report)}</pre>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="secondary">Close</Button>
      </div>
    </Modal>
  );
};
