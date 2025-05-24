import React, { useState } from "react";

type CoverageReport = any; // For brevity, use 'any', but you can define a proper type

function parseJSONFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        resolve(json);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function parseTextFile(file: File): Promise<{ name: string; content: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve({ name: file.name, content: event.target?.result as string });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function getLinesStatus(
  source: string,
  coverage: any
): ("covered" | "uncovered" | undefined)[] {
  // Generate an array with status for each line in the source code
  const lines = source.split("\n");
  const status = Array(lines.length).fill(undefined);

  if (!coverage?.statementMap || !coverage?.s) return status;

  Object.entries(coverage.statementMap).forEach(([id, loc]: [string, any]) => {
    const count = coverage.s[id];
    const lineStart = loc.start.line - 1;
    const lineEnd = (loc.end.line ?? loc.start.line) - 1;
    for (let i = lineStart; i <= lineEnd; i++) {
      status[i] = count > 0 ? "covered" : "uncovered";
    }
  });
  return status;
}

function SourceViewer({ source, coverage }: { source: string; coverage: any }) {
  const lines = source.split("\n");
  const status = getLinesStatus(source, coverage);

  return (
    <pre
      style={{
        background: "#20232a",
        color: "#fff",
        padding: 16,
        borderRadius: 8,
        overflow: "auto",
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            background:
              status[i] === "covered"
                ? "#263d29"
                : status[i] === "uncovered"
                ? "#3d2626"
                : "transparent",
            color: status[i] === "uncovered" ? "#ffbbbb" : "#fff",
            padding: "0 4px",
          }}
        >
          <span style={{ opacity: 0.5, userSelect: "none" }}>
            {(i + 1).toString().padStart(4, " ")}{" "}
          </span>
          {line}
        </div>
      ))}
    </pre>
  );
}

function App() {
  const [report, setReport] = useState<CoverageReport | null>(null);
  const [sources, setSources] = useState<{ name: string; content: string }[]>(
    []
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleReportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await parseJSONFile(file);
    setReport(data);
  };

  const handleSourceFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const parsed = await Promise.all(Array.from(files).map(parseTextFile));
    setSources(parsed);
  };

  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>Jest Coverage Annotator</h1>
      <div>
        <label>Upload Coverage Report (.json): </label>
        <input type="file" accept=".json" onChange={handleReportFile} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Upload Source Files: </label>
        <input type="file" multiple onChange={handleSourceFiles} />
      </div>
      {sources.length > 0 && (
        <div style={{ margin: "16px 0" }}>
          <label>View file: </label>
          <select
            value={selectedFile ?? ""}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            <option value="">-- select a file --</option>
            {sources.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedFile && report && (
        <SourceViewer
          source={sources.find((s) => s.name === selectedFile)?.content || ""}
          coverage={Object.values(report.coverageMap).find((c: any) =>
            c.path.endsWith(selectedFile)
          )}
        />
      )}
      {!selectedFile && (
        <p>Upload files and select a file to view annotated coverage.</p>
      )}
    </div>
  );
}

export default App;
