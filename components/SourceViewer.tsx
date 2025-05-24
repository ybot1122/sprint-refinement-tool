import fs from "fs";

// Annotates lines based on statement coverage
function getLinesStatus(
  source: string,
  coverage: any
): ("covered" | "uncovered" | undefined)[] {
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

/**
 * Component to display source code with coverage highlighting.
 */
export function SourceViewer({
  filePath,
  coverage,
}: {
  filePath: string;
  coverage: any;
}) {
  let source = "";
  try {
    source = fs.readFileSync(filePath, "utf-8");
  } catch (e) {
    return <div style={{ color: "red" }}>Could not read file: {filePath}</div>;
  }
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
