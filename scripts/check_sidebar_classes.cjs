const fs = require('fs');

const content = fs.readFileSync('app/tinh/AppTinh.tsx', 'utf8');

const sidebarStart = content.indexOf('const Sidebar =');
const sidebarEnd = content.indexOf('<KhoiTaiKhoanChung', sidebarStart);

const sidebarContent = content.substring(sidebarStart, sidebarEnd);

if (sidebarContent.includes('surface') || sidebarContent.includes('primary')) {
  console.log("Found Tailwind semantic classes in Sidebar!");
  console.log(sidebarContent.match(/surface-[^\s\"\'\>]+|on-surface-[^\s\"\'\>]+|text-primary/g));
} else {
  console.log("No Tailwind semantic classes found in Sidebar.");
}
