const fs = require('fs');

function fixAppTinhSidebar(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix container classes (remove inline style, add h-full)
  content = content.replace(
    /<div className="w-\[230px\] flex-shrink-0 bg-white border-r border-\[#e0e0e0\] flex flex-col overflow-hidden" style=\{\{ height: "100vh" \}\}>/,
    '<div className="w-[230px] flex-shrink-0 bg-white border-r border-[#e0e0e0] flex flex-col h-full overflow-hidden">'
  );
  content = content.replace(
    /<div className="w-\[230px\] flex-shrink-0 bg-white border-r border-\[#e0e0e0\] flex flex-col overflow-hidden">/,
    '<div className="w-[230px] flex-shrink-0 bg-white border-r border-[#e0e0e0] flex flex-col h-full overflow-hidden">'
  );

  // 2. Fix account block wrapper (remove mt-auto div)
  content = content.replace(
    /<div className="mt-auto">(<KhoiTaiKhoanChung[\s\S]+?\/>)<\/div>/,
    '$1'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed styling in ${filePath}`);
}

try {
  fixAppTinhSidebar('app/tinh/AppTinh.tsx');
} catch (e) {
  console.error(e);
}
