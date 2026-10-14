const fs = require("fs");
const path = require("path");

function fixTabs(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Add Tabs to antd imports
  if (!content.includes(' Tabs')) {
    content = content.replace(
      /import \{ Input, Select, DatePicker, ConfigProvider, Radio, Checkbox, Space/g,
      `import { Input, Select, DatePicker, ConfigProvider, Radio, Checkbox, Space, Tabs`
    );
  }

  // Replace Tab rendering in AppToiCao and AppTinh
  const tabRegex = /<div className="flex items-end border-b border-\[#ddd\] px-3 pt-2 gap-0">[\s\S]*?\{tabs\.map\(\(t, i\) => \([\s\S]*?t\.label === "Khác" \? null : \([\s\S]*?<Button key=\{i\} onClick=\{\(\) => setActiveTab\(i\)\}[\s\S]*?className=\{`px-4 py-\[7px\] text-\[13px\] font-medium border-b-2 transition-colors whitespace-nowrap \$\{activeTab === i \? "border-\[#8b1a1a\] text-\[#8b1a1a\]" : "border-transparent text-\[#555\] hover:text-\[#222\]"[\s\S]*?\}`\}>[\s\S]*?\{t\.label\}[\s\S]*?<\/Button>[\s\S]*?\)[\s\S]*?\)\)}[\s\S]*?<\/div>/;

  const tabNew = `<Tabs
              activeKey={activeTab.toString()}
              onChange={(k) => setActiveTab(Number(k))}
              className="px-4 pt-2"
              items={tabs.map((t, i) => t.label === "Khác" ? null : {
                key: i.toString(),
                label: t.label,
              }).filter(Boolean) as any}
            />`;

  // AppTinh might have a slightly different className string because of single/double quotes or formatting.
  // I will use a more robust regex.
  const robustTabRegex = /<div className="flex items-end border-b border-\[#ddd\] px-3 pt-2 gap-0">[\s\S]*?<\/div>/;

  // Let's ensure we only replace the specific tabs block!
  // It's under `{!khangNghi && (`
  
  // A safe string replacement approach:
  let startIndex = content.indexOf('<div className="flex items-end border-b border-[#ddd] px-3 pt-2 gap-0">');
  if (startIndex !== -1) {
    let endIndex = content.indexOf('</div>', startIndex);
    if (endIndex !== -1) {
      let blockToReplace = content.substring(startIndex, endIndex + 6);
      if (blockToReplace.includes('tabs.map')) {
        content = content.replace(blockToReplace, tabNew);
        console.log("Successfully replaced tabs in", filePath);
      }
    }
  }

  fs.writeFileSync(filePath, content, "utf8");
}

fixTabs(path.join(__dirname, "..", "app", "toicao", "AppToiCao.tsx"));
fixTabs(path.join(__dirname, "..", "app", "tinh", "AppTinh.tsx"));
