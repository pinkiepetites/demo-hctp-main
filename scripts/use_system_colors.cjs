const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../app/gdt/HoSoKhangNghiView.tsx");
let content = fs.readFileSync(filePath, "utf-8");

// Replace all those background colors with RED in buttons
content = content.replace(/style=\{\{\s*background:\s*"(#16a34a|#0f766e|#0284c7|#7c3aed)"\s*\}\}/g, 'style={{ background: RED, borderColor: RED }}');

fs.writeFileSync(filePath, content, "utf-8");
console.log("Replaced colors with RED");
