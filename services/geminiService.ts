
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
  // We sample test cases if the suite is huge for the analysis prompt
  const sampleCases = testCases.slice(0, 50);

  const prompt = `
    Analyze the following test suite against the provided requirements.
    1. Identify Risk Areas (High/Medium/Low) based on feature complexity.
    2. Select critical Smoke Test IDs and Sanity Test IDs from the provided list.
    3. Calculate coverage metrics (Functional, UI, Edge Cases, Security) as percentages.
    4. Provide UX Predictions: How will users experience these features? Predict friction and suggest improvements.
    
    Test Cases Sample: ${JSON.stringify(sampleCases)}
    
    Output ONLY valid JSON matching this structure:
    {
      "summary": "Overall analysis summary",
      "riskAreas": [{ "area": "string", "level": "High|Medium|Low", "reasoning": "string" }],
      "smokeTestIds": ["TC-ID"],
      "sanityTestIds": ["TC-ID"],
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
  const testCasesToSimulate = testCases.slice(0, 15); 
  const prompt = `Simulate Playwright execution for: ${JSON.stringify(testCasesToSimulate)}`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: prompt,
    config: { temperature: 0.3 }
  });
  return response.text;
};
