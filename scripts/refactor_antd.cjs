const fs = require("fs");
const path = require("path");

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  let needsButton = false;
  let needsInput = false;

  if (/<button/g.test(content)) {
    content = content.replace(/<button/g, "<Button");
    content = content.replace(/<\/button>/g, "</Button>");
    needsButton = true;
  }

  if (/<input/g.test(content)) {
    content = content.replace(/<input/g, "<Input");
    needsInput = true;
  }

  if (content !== originalContent) {
    let importsToAdd = [];
    if (needsButton && !content.match(/import\s*\{[^}]*Button[^}]*\}\s*from\s*['"]antd['"]/)) {
      importsToAdd.push("Button");
    }
    if (needsInput && !content.match(/import\s*\{[^}]*Input[^}]*\}\s*from\s*['"]antd['"]/)) {
      importsToAdd.push("Input");
    }

    if (importsToAdd.length > 0) {
      const importStr = `import { ${importsToAdd.join(", ")} } from "antd";\n`;
      const importMatches = [...content.matchAll(/^import .* from .*$/gm)];
      if (importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const insertIndex = lastImport.index + lastImport[0].length + 1;
        content = content.slice(0, insertIndex) + importStr + content.slice(insertIndex);
      } else {
        content = importStr + content;
      }
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".jsx")) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, "..", "app"));
