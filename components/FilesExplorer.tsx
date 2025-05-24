import report from "../coverage-files/report.json";
import React, { useEffect, useState } from "react";

// You can pass the file path as a prop if needed
const COVERAGE_FILE_PATH = "/coverage-files/report.json";

type CoverageMap = {
  [filename: string]: any;
};

export const FilesExplorer: React.FC = () => {
  const [filenames, setFilenames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFilenames(Object.keys(report.coverageMap));
  }, []);

  if (error) {
    return <div>Error loading coverage filenames: {error}</div>;
  }

  return (
    <div>
      <h2>Files reported in coverage:</h2>
      <ul>
        {filenames.map((filename) => (
          <li key={filename}>{filename}</li>
        ))}
      </ul>
    </div>
  );
};

export default FilesExplorer;
