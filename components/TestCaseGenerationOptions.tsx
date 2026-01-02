
import React from 'react';
import { Button } from './common/Button';
import { ListChecks, ArrowLeft } from 'lucide-react';

interface TestCaseGenerationOptionsProps {
  onGenerate: (count: 500 | 1000) => void;
  onBack: () => void;
}

export const TestCaseGenerationOptions: React.FC<TestCaseGenerationOptionsProps> = ({ onGenerate, onBack }) => {
  return (
    <div className="text-center space-y-8 py-8">
      <h2 className="text-2xl font-semibold text-sky-300">Choose Test Case Count</h2>
      <p className="text-slate-300 max-w-md mx-auto">
        Select how many test cases you'd like Gemini AI to generate based on your SRS.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Button onClick={() => onGenerate(500)} variant="secondary" size="large" className="w-full sm:w-auto">
          <ListChecks size={20} className="mr-2" /> Generate 500 Test Cases
        </Button>
        <Button onClick={() => onGenerate(1000)} variant="secondary" size="large" className="w-full sm:w-auto">
          <ListChecks size={20} className="mr-2" /> Generate 1000 Test Cases
        </Button>
      </div>
       <div className="mt-8">
        <Button onClick={onBack} variant="outline" size="medium">
          <ArrowLeft size={18} className="mr-2" /> Back to SRS Input
        </Button>
      </div>
    </div>
  );
};
