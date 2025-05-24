import report from "../coverage-files/report.json";
import React, { useState } from "react";

// Helper to split Windows and POSIX paths into parts
function splitPath(filePath: string) {
  return filePath.split(/[/\\]+/);
}

function getAllFiles(coverageMap: { [filename: string]: any }) {
  return Object.keys(coverageMap);
}

function buildFileTree(filePaths: string[]) {
  const root: any = {};

  for (const fullPath of filePaths) {
    const parts = splitPath(fullPath);
    let node = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!node[part]) {
        node[part] = i === parts.length - 1 ? null : {};
      }
      node = node[part];
    }
  }

  return root;
}

// Find common path prefix among Windows/POSIX paths
function getCommonPathPrefix(paths: string[]): string[] {
  if (!paths.length) return [];
  const splitPaths = paths.map(splitPath);
  const minLen = Math.min(...splitPaths.map((p) => p.length));
  let prefix: string[] = [];
  for (let i = 0; i < minLen; i++) {
    const segment = splitPaths[0][i];
    if (splitPaths.every((parts) => parts[i] === segment)) {
      prefix.push(segment);
    } else {
      break;
    }
  }
  return prefix;
}

interface FileTableProps {
  tree: any;
  pathPrefix?: string[];
  onFolderClick: (path: string[]) => void;
  selectedPath: string[];
  commonPrefix: string[];
}

const FileTable: React.FC<FileTableProps> = ({
  tree,
  pathPrefix = [],
  onFolderClick,
  selectedPath,
  commonPrefix,
}) => {
  const entries = Object.entries(tree);

  // Folders first, then files, both alphabetically
  const folders = entries
    .filter(([, v]) => v !== null)
    .sort(([a], [b]) => a.localeCompare(b));
  const files = entries
    .filter(([, v]) => v === null)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
            Name
          </th>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
            Type
          </th>
        </tr>
      </thead>
      <tbody>
        {folders.map(([folderName]) => (
          <tr key={folderName}>
            <td>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#0057b8",
                  cursor: "pointer",
                  textDecoration: "underline",
                  font: "inherit",
                  padding: 0,
                }}
                onClick={() => onFolderClick([...pathPrefix, folderName])}
              >
                📁 {folderName}
              </button>
            </td>
            <td>Folder</td>
          </tr>
        ))}
        {files.map(([fileName]) => (
          <tr key={fileName}>
            <td>📄 {fileName}</td>
            <td>File</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const FilesExplorer: React.FC = () => {
  const files = getAllFiles(report.coverageMap);
  const commonPrefix = getCommonPathPrefix(files);
  // Remove the common prefix from file paths for the tree
  const trimmedFiles = files.map((f) =>
    splitPath(f).slice(commonPrefix.length).join("/")
  );
  const tree = buildFileTree(trimmedFiles);

  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  // Traverse the tree to the current selected path
  let currentTree = tree;
  for (const part of selectedPath) {
    if (currentTree[part]) {
      currentTree = currentTree[part];
    } else {
      currentTree = {};
      break;
    }
  }

  // Breadcrumb navigation (with common prefix shown as the root - or omitted)
  const breadcrumb = [
    <span
      key="root"
      style={{ color: selectedPath.length === 0 ? "#0057b8" : "#007" }}
    >
      <button
        style={{
          background: "none",
          border: "none",
          color: "#0057b8",
          cursor: "pointer",
          font: "inherit",
          padding: 0,
        }}
        disabled={selectedPath.length === 0}
        onClick={() => setSelectedPath([])}
      >
        {commonPrefix.length ? commonPrefix.join("/") : "root"}
      </button>
    </span>,
    ...selectedPath.map((part, idx) => (
      <span key={idx}>
        {" / "}
        <button
          style={{
            background: "none",
            border: "none",
            color: "#0057b8",
            cursor: "pointer",
            font: "inherit",
            padding: 0,
          }}
          disabled={idx === selectedPath.length - 1}
          onClick={() => setSelectedPath(selectedPath.slice(0, idx + 1))}
        >
          {part}
        </button>
      </span>
    )),
  ];

  return (
    <div>
      <h2>Files reported in coverage:</h2>
      <div style={{ marginBottom: 12 }}>{breadcrumb}</div>
      <FileTable
        tree={currentTree}
        pathPrefix={selectedPath}
        onFolderClick={setSelectedPath}
        selectedPath={selectedPath}
        commonPrefix={commonPrefix}
      />
    </div>
  );
};

export default FilesExplorer;
