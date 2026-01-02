
import { jsPDF } from 'jspdf';
import type { TestCase, DownloadFormat, AnalysisData } from '../types';

const generateJsonContent = (testCases: TestCase[]): string => JSON.stringify(testCases, null, 2);

const generateDocContent = (testCases: TestCase[], srsText: string): string => {
  let content = `AI Quality Report\n\nRequirements Context: ${srsText.substring(0, 500)}...\n\nTest Cases:\n\n`;
  testCases.forEach(tc => {
    content += `${tc.id}: ${tc.description}\nSteps:\n${tc.steps}\nExpected: ${tc.expectedResult}\n\n`;
  });
  return content;
};

const generateCsvContent = (testCases: TestCase[]): string => {
  const header = "ID,Description,Steps,Expected Result\n";
  return header + testCases.map(tc => {
    const q = (f: string) => `"${f.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    return [q(tc.id), q(tc.description), q(tc.steps), q(tc.expectedResult)].join(",");
  }).join("\n");
};

export const generateAnalysisPdf = (data: AnalysisData, testCases: TestCase[]): void => {
  const doc = new jsPDF();
  let y = 20;
  const margin = 20;

  const title = (t: string) => {
    doc.setFontSize(18); doc.setFont(undefined, 'bold');
    doc.text(t, margin, y); y += 12;
  };
  const body = (t: string) => {
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    const split = doc.splitTextToSize(t, 170);
    doc.text(split, margin, y); y += split.length * 5 + 5;
  };

  title("AI-Powered Test Suite Analysis");
  body(`Summary: ${data.summary}`);

  title("Risk Assessment");
  data.riskAreas.forEach(r => {
    doc.setFontSize(12); doc.setFont(undefined, 'bold');
    doc.text(`${r.area} (${r.level} Risk)`, margin, y); y += 6;
    body(r.reasoning);
  });

  title("Coverage Metrics");
  body(`Functional: ${data.coverageMetrics.functional}% | UI: ${data.coverageMetrics.ui}% | Edge Cases: ${data.coverageMetrics.edgeCases}% | Security: ${data.coverageMetrics.security}%`);

  title("UX Predictions");
  data.uxPredictions.forEach(u => {
    doc.setFontSize(12); doc.setFont(undefined, 'bold');
    doc.text(u.feature, margin, y); y += 6;
    body(`${u.prediction} (Friction: ${u.frictionScore}/10)`);
  });

  doc.save("ai-analysis-report.pdf");
};

export const downloadFile = (testCases: TestCase[], format: DownloadFormat, srsText: string, analysisData?: AnalysisData): void => {
  if (format === 'analysis-pdf' && analysisData) {
    generateAnalysisPdf(analysisData, testCases);
    return;
  }

  let content = '';
  let filename = 'test-cases';
  let mimeType = 'text/plain';

  switch (format) {
    case 'json': content = generateJsonContent(testCases); filename += '.json'; mimeType = 'application/json'; break;
    case 'doc': content = generateDocContent(testCases, srsText); filename += '.doc'; mimeType = 'application/msword'; break;
    case 'csv': content = generateCsvContent(testCases); filename += '.csv'; mimeType = 'text/csv'; break;
    case 'pdf': 
      const doc = new jsPDF();
      doc.text("Test Case Suite", 20, 20);
      let y = 30;
      testCases.slice(0, 30).forEach(tc => {
        doc.setFontSize(10);
        doc.text(`${tc.id}: ${tc.description}`, 20, y);
        y += 10;
        if (y > 280) { doc.addPage(); y = 20; }
      });
      doc.save("test-cases.pdf");
      return;
    default: return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
};
