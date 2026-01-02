
export interface TestCase {
  id: string; 
  description: string;
  steps: string; // Multi-line string with numbered steps
  expectedResult: string;
  priority?: 'High' | 'Medium' | 'Low'; // AI prioritized field
}

export type DownloadFormat = 'doc' | 'csv' | 'pdf' | 'json' | 'analysis-pdf';

export type RequirementSource = 
  | { type: 'text'; content: string }
  | { type: 'file'; data: string; mimeType: string; fileName: string };

export interface RiskArea {
  area: string;
  level: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

export interface UXPrediction {
  feature: string;
  prediction: string;
  frictionScore: number; // 1-10
  suggestions: string[];
}

export interface AnalysisData {
  summary: string;
  riskAreas: RiskArea[];
  smokeTestIds: string[];
  sanityTestIds: string[];
  priorityMaps: { id: string; priority: 'High' | 'Medium' | 'Low' }[];
  coverageMetrics: {
    functional: number;
    ui: number;
    edgeCases: number;
    security: number;
  };
  uxPredictions: UXPrediction[];
}

// Grounding metadata types
export interface WebGroundingChunk {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: WebGroundingChunk;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}
