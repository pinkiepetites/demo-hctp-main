const fs = require("fs");
let content = fs.readFileSync("app/tinh/AppTinh.tsx", "utf8");
content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]antd['"]/g, (match, p1) => {
  if (p1.includes("Tabs")) return match;
  return `import { ${p1}, Tabs } from "antd"`;
});
fs.writeFileSync("app/tinh/AppTinh.tsx", content);
