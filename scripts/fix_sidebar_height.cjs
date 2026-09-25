const fs = require('fs');
let content = fs.readFileSync('app/tinh/AppTinh.tsx', 'utf8');
content = content.replace(
  'const Sidebar = ({ activePage',
  'const Sidebar = ({ activePage'
);
content = content.replace(
  '<div className="w-[230px] flex-shrink-0 bg-white border-r border-surface-container-highest flex flex-col h-full overflow-hidden">',
  '<div className="w-[230px] flex-shrink-0 bg-white border-r border-surface-container-highest flex flex-col h-screen overflow-hidden">'
);
fs.writeFileSync('app/tinh/AppTinh.tsx', content);
