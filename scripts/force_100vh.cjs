const fs = require('fs');
let c = fs.readFileSync('app/tinh/AppTinh.tsx', 'utf8');
c = c.replace(
  '<div className="w-[230px] flex-shrink-0 bg-white border-r border-surface-container-highest flex flex-col h-screen overflow-hidden">',
  '<div className="w-[230px] flex-shrink-0 bg-white border-r border-surface-container-highest flex flex-col overflow-hidden" style={{ height: "100vh" }}>'
);
fs.writeFileSync('app/tinh/AppTinh.tsx', c);
