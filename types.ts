
export interface TestCase {
  id: string; 
  title: string;
  testBasis: string;
  testCondition: string;
  preconditions: string;
  steps: string;
  testData: string;
  expectedResult: string;
  testType: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ExpectedScenario {
  id: string;
  requirement: string;
  testScenario: string;
  complexity: 'High' | 'Medium' | 'Low';
  rationale: string;
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
  frictionScore: number;
  suggestions: string[];
}

export interface HallucinationMetrics {
  integrityScore: number;
  ghostRequirements: number;
  dataMirage: number;
  logicConsistency: number;
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
  hallucinationMetrics: HallucinationMetrics;
}

export interface VirtualFile {
  path: string;
  name: string;
  content: string;
}

export interface AutomationProject {
  files: VirtualFile[];
  activeFilePath: string;
}

// Grounding metadata types
export interface WebGroundingChunk { uri: string; title: string; }
export interface GroundingChunk { web?: WebGroundingChunk; }
export interface GroundingMetadata { groundingChunks?: GroundingChunk[]; }
export interface Candidate { groundingMetadata?: GroundingMetadata; }
