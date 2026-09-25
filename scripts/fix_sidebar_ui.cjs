const fs = require('fs');
let content = fs.readFileSync('app/tinh/AppTinh.tsx', 'utf8');

const sidebarRegex = /(const Sidebar = [\s\S]+?)(?=\nconst [A-Z]|export default)/;
const match = content.match(sidebarRegex);
if (!match) { console.log('Sidebar not found'); process.exit(1); }

let sidebar = match[1];

// Make replacements
sidebar = sidebar.replace(/\$\{active \? "bg-\[#fdeaea\] text-error font-semibold" : "text-\[#444\] hover:bg-surface-container-low"\}\`\}/g, '${active ? "bg-[#fdeaea] text-[#8b1a1a] font-semibold" : "text-[#444] hover:bg-[#f5f5f5]"}`}');
sidebar = sidebar.replace(/<span className=\{active \? "text-error" : "text-on-surface-variant"\}>\{icon\}<\/span>/g, '<span className={active ? "text-[#8b1a1a]" : "text-[#888]"}>{icon}</span>');

sidebar = sidebar.replace(/bg-error/g, 'bg-[#8b1a1a]');
sidebar = sidebar.replace(/hover:bg-surface-container-low/g, 'hover:bg-[#f5f5f5]');
sidebar = sidebar.replace(/text-on-surface-variant/g, 'text-[#666]');

// Fix chevron icons to match AppToiCao #888
sidebar = sidebar.replace(/className="text-\[#666\]" \/> : <ChevronDown size=\{13\} className="text-\[#666\]"/g, 'className="text-[#888]" /> : <ChevronDown size={13} className="text-[#888]"');

sidebar = sidebar.replace(/text-on-surface/g, 'text-[#333]');
sidebar = sidebar.replace(/text-tertiary/g, 'text-[#1d2e4f]');

sidebar = sidebar.replace(/border-surface-container-highest/g, 'border-[#e0e0e0]');
sidebar = sidebar.replace(/border-surface-container-high/g, 'border-[#eee]');

sidebar = sidebar.replace(/text-error/g, 'text-[#8b1a1a]');

content = content.replace(sidebarRegex, sidebar);
fs.writeFileSync('app/tinh/AppTinh.tsx', content, 'utf8');
console.log('Sidebar updated');
