const fs = require("fs");
const path = require("path");

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  // Replace type="button" and type="submit" inside <Button tags
  // Using a replacer function for precision
  content = content.replace(/<Button([\s\S]*?)>/g, (match, p1) => {
    let newProps = p1;
    newProps = newProps.replace(/type=(['"])button(['"])/g, 'htmlType=$1button$2');
    newProps = newProps.replace(/type=(['"])submit(['"])/g, 'htmlType=$1submit$2');
    newProps = newProps.replace(/type=(['"])reset(['"])/g, 'htmlType=$1reset$2');
    return `<Button${newProps}>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Fixed Button type in ${filePath}`);
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
