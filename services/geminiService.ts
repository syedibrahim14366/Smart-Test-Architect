
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { TestCase, RequirementSource, AnalysisData } from '../types';
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

export const generateTestCases = async (
  source: RequirementSource, 
  totalCount: number,
  onProgress?: (current: number) => void
): Promise<TestCase[]> => {
  const ai = getAI();
  const allTestCases: TestCase[] = [];
  const batchSize = TEST_CASE_BATCH_SIZE;
  const iterations = Math.ceil(totalCount / batchSize);

  for (let i = 0; i < iterations; i++) {
    const currentBatchTarget = Math.min(batchSize, totalCount - allTestCases.length);
    const startNum = allTestCases.length + 1;
    const endNum = allTestCases.length + currentBatchTarget;

    const basePrompt = `
      You are an expert Test Case Generator.
      Based on the requirements, generate exactly ${currentBatchTarget} detailed test cases.
      Batch ${i + 1} of ${iterations}. Range: ${startNum}-${endNum}.
      
      Output ONLY a JSON array:
      [{ "id": "TC-XXX", "description": "...", "steps": "1...\\n2...", "expectedResult": "..." }]
    `;

    const contents: any = { parts: [] };
    if (source.type === 'text') {
      contents.parts.push({ text: `${basePrompt}\n\nRequirements:\n${source.content}` });
    } else {
      contents.parts.push({ inlineData: { data: source.data, mimeType: source.mimeType } });
      contents.parts.push({ text: basePrompt });
    }

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents,
        config: { responseMimeType: "application/json", temperature: 0.7 }
      });
      const batchResults = parseJsonFromText<TestCase[]>(response.text);
      if (Array.isArray(batchResults)) {
        allTestCases.push(...batchResults);
        if (onProgress) onProgress(allTestCases.length);
      }
      if (iterations > 1) await new Promise(r => setTimeout(r, 400));
    } catch (error) {
      if (allTestCases.length > 0) break; 
      throw error;
    }
  }
  return allTestCases.slice(0, totalCount);
};

export const analyzeTestSuite = async (source: RequirementSource, testCases: TestCase[]): Promise<AnalysisData> => {
  const ai = getAI();
  // Sample test cases for analysis context
  const sampleCases = testCases.slice(0, 50);

  const prompt = `
    Analyze the following test suite against the requirements.
    1. Identify Risk Areas (High/Medium/Low) based on complexity.
    2. Select Smoke (critical path) and Sanity (focused logic) IDs.
    3. Assign a Priority ('High', 'Medium', or 'Low') to each test case based on business value and impact. 
    4. Calculate Coverage Metrics as percentages.
    5. Provide UX Predictions and friction scores.
    
    Test Cases Sample (IDs to prioritize): ${JSON.stringify(sampleCases.map(tc => tc.id))}
    
    Output ONLY valid JSON matching this structure:
    {
      "summary": "string",
      "riskAreas": [{ "area": "string", "level": "High|Medium|Low", "reasoning": "string" }],
      "smokeTestIds": ["string"],
      "sanityTestIds": ["string"],
      "priorityMaps": [{ "id": "string", "priority": "High|Medium|Low" }],
      "coverageMetrics": { "functional": 0-100, "ui": 0-100, "edgeCases": 0-100, "security": 0-100 },
      "uxPredictions": [{ "feature": "string", "prediction": "string", "frictionScore": 1-10, "suggestions": ["string"] }]
    }
  `;

  const contents: any = { parts: [] };
  if (source.type === 'text') {
    contents.parts.push({ text: `${prompt}\n\nRequirements:\n${source.content}` });
  } else {
    contents.parts.push({ inlineData: { data: source.data, mimeType: source.mimeType } });
    contents.parts.push({ text: prompt });
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents,
    config: { responseMimeType: "application/json", temperature: 0.4 }
  });

  return parseJsonFromText<AnalysisData>(response.text);
};

export const simulateExecution = async (testCases: TestCase[]): Promise<string> => {
  const ai = getAI();
  
  // Feature: Prioritize simulation execution
  // Sort test cases: High > Medium > Low > undefined
  const sortedCases = [...testCases].sort((a, b) => {
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    const pA = a.priority ? priorityOrder[a.priority] : 3;
    const pB = b.priority ? priorityOrder[b.priority] : 3;
    return pA - pB;
  });

  const testCasesToSimulate = sortedCases.slice(0, 15); 
  
  const prompt = `
    Simulate Playwright execution for the following test cases.
    Note: These have been prioritized by AI for execution. Focus on the High priority ones first.
    
    Test Cases for Simulation:
    ${JSON.stringify(testCasesToSimulate, null, 2)}
    
    For each test case:
    - State if it's High/Medium/Low priority.
    - Narrative the steps taken.
    - Report Pass/Fail status.
  `;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: prompt,
    config: { temperature: 0.3 }
  });
  return response.text;
};
