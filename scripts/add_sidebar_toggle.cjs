const fs = require('fs');

function modifyFile(filePath, isToiCao) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Add state variable
  // Find "export default function AppTinh(...)" or AppToiCao
  const functionRegex = /(export default function App[A-Za-z]+\(.*\) \{)/;
  content = content.replace(functionRegex, '$1\n  const [isSidebarOpen, setIsSidebarOpen] = useState(true);');
  
  // 2. Conditionally render Sidebar
  if (isToiCao) {
    content = content.replace(
      /(<Sidebar activePage=\{view\}[\s\S]+?\/>)/,
      '{isSidebarOpen && $1}'
    );
  } else {
    content = content.replace(
      /(<AppSidebar\s+currentCap="tinh"[\s\S]+?vanBanList=\{vanBanList\}\s*\/>)/,
      '{isSidebarOpen && $1}'
    );
  }

  // 3. Add Menu toggle button to Breadcrumb
  if (isToiCao) {
    content = content.replace(
      /(<div className="bg-white border-b border-\[#ddd\] px-4 py-\[6px\] flex items-center gap-1 text-\[12px\] text-\[#666\] flex-shrink-0">)/,
      '$1\n            <Menu size={16} className="cursor-pointer text-[#888] hover:text-[#333] mr-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />'
    );
  } else {
    // For AppTinh, it's border-surface-container, but we replaced it maybe? Wait, in my previous script I didn't replace the breadcrumb bar classes in the main content!
    // The previous script only updated `sidebar = sidebar.replace(...)`
    // Let's just look for the Breadcrumb div in AppTinh
    content = content.replace(
      /(<div className="bg-white border-b border-surface-container px-4 py-\[6px\] flex items-center gap-1 text-\[12px\] text-on-surface-variant flex-shrink-0">)/,
      '$1\n            <Menu size={16} className="cursor-pointer text-on-surface-variant hover:text-on-surface mr-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

try {
  modifyFile('app/tinh/AppTinh.tsx', false);
  modifyFile('app/toicao/AppToiCao.tsx', true);
} catch (e) {
  console.error(e);
}
