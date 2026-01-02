
import { GoogleGenAI, Type } from "@google/genai";
import type { TestCase, RequirementSource, AnalysisData, ExpectedScenario } from '../types';
import { GEMINI_TEXT_MODEL, TEST_CASE_BATCH_SIZE } from '../constants';

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API Key is not configured.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const parseJsonFromText = <T,>(text: string): T => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON from text:", jsonStr, e);
    throw new Error(`Failed to parse AI response as JSON.`);
  }
};

const SCENARIO_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      requirement: { type: Type.STRING },
      testScenario: { type: Type.STRING },
      complexity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
      rationale: { type: Type.STRING }
    },
    required: ['id', 'requirement', 'testScenario', 'complexity', 'rationale']
  }
};

const TEST_CASE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      testBasis: { type: Type.STRING },
      testCondition: { type: Type.STRING },
      preconditions: { type: Type.STRING },
      steps: { type: Type.STRING },
      testData: { type: Type.STRING },
      expectedResult: { type: Type.STRING },
      testType: { type: Type.STRING },
      priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
    },
    required: ['id', 'title', 'testBasis', 'testCondition', 'preconditions', 'steps', 'testData', 'expectedResult', 'testType', 'priority']
  }
};

const SYSTEM_INSTRUCTION = `
  You are an ISTQB-certified Software Test Engineer.
  Generate test cases using a lean, ISTQB-compliant format only.

  Mandatory structure (JSON):
  - id: Test Case ID
  - title: Title
  - testBasis: User Story / Requirement / Rule
  - testCondition: Test Condition
  - preconditions: Preconditions
  - steps: Numbered actions only
  - testData: Test Data
  - expectedResult: Expected Result
  - testType: Test Type
  - priority: High, Medium, or Low

  Rules:
  1. Follow ISTQB principles strictly.
  2. Derive each test condition directly from the test basis.
  3. One validation goal per test case.
  4. Keep output concise and execution-ready.
  5. Do NOT add execution fields (Actual Result, Status).
  6. Do NOT include explanations, assumptions, or commentary.
  7. Use clear, professional testing language.
  8. Optimize for fast AI generation and real-world usability.
`;

export const extractScenarios = async (source: RequirementSource): Promise<ExpectedScenario[]> => {
  const ai = getAI();
  const prompt = `
    Analyze the provided document data and extract the "Expected Test Scenarios".
    Return a JSON array of scenarios strictly matching the schema.
    Ensure "testScenario" field describes the testing goal clearly.
  `;
  const contents: any = { parts: [{ text: prompt }] };
  if (source.type === 'file') {
    contents.parts.push({ inlineData: { data: source.data, mimeType: source.mimeType } });
  } else {
    contents.parts.push({ text: `Source Context: ${source.content}` });
  }

  const response = await ai.models.generateContent({ 
    model: GEMINI_TEXT_MODEL, 
    contents, 
    config: { 
      responseMimeType: "application/json",
      responseSchema: SCENARIO_SCHEMA,
      systemInstruction: SYSTEM_INSTRUCTION
    } 
  });
  
  return parseJsonFromText<ExpectedScenario[]>(response.text);
};

export const generateTestCases = async (
  source: RequirementSource, 
  totalCount: number | 'auto',
  onProgress?: (current: number) => void
): Promise<TestCase[]> => {
  const ai = getAI();
  const allTestCases: TestCase[] = [];
  
  const basePrompt = `
    Input: ${source.type === 'text' ? source.content : 'Requirement document provided via file'}.
    Task: Generate ${totalCount === 'auto' ? 'exhaustive' : totalCount} ISTQB-compliant test cases.
    Focus on functional paths, edge cases, and security logic.
  `;

  if (totalCount === 'auto') {
    const contents: any = { parts: [] };
    if (source.type === 'file') {
      contents.parts.push({ inlineData: { data: source.data, mimeType: source.mimeType } });
    }
    contents.parts.push({ text: basePrompt });

    const response = await ai.models.generateContent({ 
      model: GEMINI_TEXT_MODEL, 
      contents, 
      config: { 
        responseMimeType: "application/json",
        responseSchema: TEST_CASE_SCHEMA,
        systemInstruction: SYSTEM_INSTRUCTION
      } 
    });
    
    const results = parseJsonFromText<TestCase[]>(response.text);
    allTestCases.push(...results);
    if (onProgress) onProgress(allTestCases.length);
    return allTestCases;
  }

  const batchSize = TEST_CASE_BATCH_SIZE;
  const iterations = Math.ceil(totalCount / batchSize);

  for (let i = 0; i < iterations; i++) {
    const currentBatchTarget = Math.min(batchSize, totalCount - allTestCases.length);
    const contents: any = { parts: [] };
    if (source.type === 'file') {
      contents.parts.push({ inlineData: { data: source.data, mimeType: source.mimeType } });
    }
    contents.parts.push({ text: `${basePrompt}\nGenerate batch ${i+1} containing ${currentBatchTarget} items.` });

    const response = await ai.models.generateContent({ 
      model: GEMINI_TEXT_MODEL, 
      contents, 
      config: { 
        responseMimeType: "application/json",
        responseSchema: TEST_CASE_SCHEMA,
        systemInstruction: SYSTEM_INSTRUCTION
      } 
    });

    const batchResults = parseJsonFromText<TestCase[]>(response.text);
    allTestCases.push(...batchResults);
    if (onProgress) onProgress(allTestCases.length);
  }
  return allTestCases;
};

export const analyzeTestSuite = async (source: RequirementSource, testCases: TestCase[]): Promise<AnalysisData> => {
  const ai = getAI();
  const sampleCases = testCases.slice(0, 50);
  const prompt = `
    Analyze the provided ISTQB test suite and requirements.
    Test Suite Sample: ${JSON.stringify(sampleCases)}
    
    Return a JSON quality report:
    {
      "summary": "Strategic summary",
      "riskAreas": [{"area": "string", "level": "High|Medium|Low", "reasoning": "string"}],
      "smokeTestIds": ["string array"],
      "sanityTestIds": ["string array"],
      "priorityMaps": [{"id": "string", "priority": "High|Medium|Low"}],
      "coverageMetrics": {"functional": 0, "ui": 0, "edgeCases": 0, "security": 0},
      "uxPredictions": [{"feature": "string", "prediction": "string", "frictionScore": 0, "suggestions": ["string"]}],
      "hallucinationMetrics": {
        "integrityScore": 0-100,
        "ghostRequirements": 0-100 (percentage of tests that might refer to non-existent features),
        "dataMirage": 0-100 (percentage of test data that seems fictional/out-of-context),
        "logicConsistency": 0-100 (percentage of internal logical consistency)
      }
    }
  `;
  const contents: any = { parts: [{ text: prompt }] };
  if (source.type === 'file') contents.parts.push({ inlineData: { data: source.data, mimeType: source.mimeType } });
  
  const response = await ai.models.generateContent({ 
    model: GEMINI_TEXT_MODEL, 
    contents, 
    config: { 
      responseMimeType: "application/json",
      systemInstruction: SYSTEM_INSTRUCTION
    } 
  });
  
  return parseJsonFromText<AnalysisData>(response.text);
};

export const generateTestPlan = async (source: RequirementSource): Promise<string> => {
  const ai = getAI();
  
  const systemInstruction = `
    You are an ISTQB-certified Test Manager.
    Create a lean, practical Test Plan compliant with ISTQB principles and aligned with ISO/IEC/IEEE 29119-3.

    Mandatory sections (do not add or remove):
    1. Test Plan Identifier
    2. Test Basis
    3. Test Objectives
    4. Test Scope (In Scope / Out of Scope)
    5. Test Approach & Strategy
    6. Test Types & Levels
    7. Entry Criteria & Exit Criteria
    8. Test Environment & Tools
    9. Roles & Responsibilities
    10. Risks & Mitigation
    11. Test Deliverables
    12. High-Level Schedule

    Rules:
    - Follow ISTQB and risk-based testing principles strictly.
    - Keep the document concise and execution-focused (2–3 pages maximum).
    - Use professional testing language suitable for audits and real-world projects.
    - Avoid excessive theory, repetition, or generic explanations.
    - Support AI-generated test cases where applicable.
    - Do NOT include templates, instructional text, or commentary.
    - Use Markdown for formatting headers.
    - Output must be a production-ready Test Plan only.
  `;

  const contents: any = { parts: [{ text: "Input: Project overview and requirements provided. Generate the Test Plan." }] };
  if (source.type === 'file') {
    contents.parts.push({ inlineData: { data: source.data, mimeType: source.mimeType } });
  } else {
    contents.parts.push({ text: `Project Overview: ${source.content}` });
  }

  const response = await ai.models.generateContent({ 
    model: 'gemini-3-pro-preview', 
    contents, 
    config: { 
      systemInstruction
    } 
  });
  
  return response.text || "Failed to generate Test Plan.";
};
