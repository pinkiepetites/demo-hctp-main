const fs = require('fs');

function fixAppTinhColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Root container
  content = content.replace(
    /className="min-h-screen bg-surface font-\['Be_Vietnam_Pro',system-ui,sans-serif\] text-\[13px\] text-on-surface"/,
    'className="min-h-screen bg-[#eef1f5] font-[\'Be_Vietnam_Pro\',system-ui,sans-serif] text-[13px] text-[#222]"'
  );

  // Breadcrumb container
  content = content.replace(
    /className="bg-white border-b border-surface-container px-4 py-\[6px\] flex items-center gap-1 text-\[12px\] text-on-surface-variant flex-shrink-0"/,
    'className="bg-white border-b border-[#ddd] px-4 py-[6px] flex items-center gap-1 text-[12px] text-[#666] flex-shrink-0"'
  );

  // Breadcrumb toggle button
  content = content.replace(
    /className="cursor-pointer text-on-surface-variant hover:text-on-surface mr-2"/,
    'className="cursor-pointer text-[#888] hover:text-[#333] mr-2"'
  );

  // Breadcrumb links
  content = content.replaceAll(
    /className="text-primary hover:underline cursor-pointer"/g,
    'className="text-[#1a5a96] hover:underline cursor-pointer"'
  );

  // Breadcrumb text nodes
  content = content.replaceAll(
    /className="text-on-surface"/g,
    'className="text-[#333]"'
  );
  
  // Breadcrumb right icons (Search, Grid3X3, Moon) - they use text-on-surface-variant
  content = content.replaceAll(
    /className="text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors"/g,
    'className="text-[#888] cursor-pointer hover:text-[#333] transition-colors"'
  );

  // Breadcrumb right avatar bubble
  content = content.replaceAll(
    /className="w-\[26px\] h-\[26px\] rounded-full bg-surface-container-highest flex items-center justify-center text-\[12px\] font-semibold text-on-surface cursor-pointer"/g,
    'className="w-[26px] h-[26px] rounded-full bg-[#f0f0f0] flex items-center justify-center text-[12px] font-semibold text-[#333] cursor-pointer"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed colors in ${filePath}`);
}

try {
  fixAppTinhColors('app/tinh/AppTinh.tsx');
} catch (e) {
  console.error(e);
}
