import fs from "fs";
import path from "path";

const coverageFilePath = "./coverage/coverage-final.json";
const reportFilePath = "./report.json";

function parseTestReport(reportData) {
  let markdown = "# Test Report\n\n";
  markdown += "## Failed Tests\n\n";
  markdown += "| File | Test | Status |\n";
  markdown += "|------|------|--------|\n";

  reportData.testResults.forEach((test) => {
    test.assertionResults.forEach((a) => {
      if (a.status === "failed") {
        const fileName = path.basename(test.name);
        markdown += `| ${fileName} | ${a.fullName} | FAILED |\n`;
      }
    });
  });

  markdown += "\n## Passing Tests\n\n";
  markdown += "| File | Test | Status |\n";
  markdown += "|------|------|--------|\n";

  reportData.testResults.forEach((test) => {
    test.assertionResults.forEach((a) => {
      if (a.status === "passed") {
        const fileName = path.basename(test.name);
        markdown += `| ${fileName} | ${a.fullName} | PASSED |\n`;
      }
    });
  });

  return markdown;
}

fs.readFile(reportFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading report file:", err);
    return;
  }

  const reportData = JSON.parse(data);
  const markdown = parseTestReport(reportData);

  console.log(markdown);
});

function parseCoverageData(coverageData) {
  let markdown = "# Coverage Summary\n\n";
  markdown += "| File | Statements | Branches | Functions | Lines |\n";
  markdown += "|------|------------|----------|-----------|-------|\n";

  for (const [file, data] of Object.entries(coverageData)) {
    const { statements, branches, functions, lines } = data;
    markdown += `| ${file} | ${statements.pct}% | ${branches.pct}% | ${functions.pct}% | ${lines.pct}% |\n`;
  }

  return markdown;
}
