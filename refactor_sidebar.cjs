const fs = require('fs');

function refactorFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // 1. Add import
  if (!content.includes('import { AppSidebar }')) {
    content = content.replace('import Dashboard from "./Dashboard";', 'import Dashboard from "./Dashboard";\nimport { AppSidebar } from "../components/AppSidebar";');
  }

  // 2. Replace Sidebar usage
  const oldSidebarRegex = /<Sidebar activePage=\{view === "gdt" \? `gdt:\$\{gdtView\}` : view\} currentRole=\{currentRole\}(.|\n|\r)*?vanBanList=\{vanBanList\} \/>/m;

  const cap = path.includes('AppTinh') ? 'tinh' : 'toicao';

  const newSidebar = `<AppSidebar
          currentCap="${cap}"
          activePage={view === "gdt" ? \`gdt:\${gdtView}\` : view} 
          currentRole={currentRole}
          onNav={(page) => {
            if (page.startsWith("gdt:")) {
              setGdtView(page.slice(4) as GdtView);
              setGdtNavSeq(n => n + 1);
              setView("gdt");
              return;
            }
            setView(page as any);
          }}
          onDoiVaiTro={(v) => {
            if (onDoiVaiTro) onDoiVaiTro(v);
            else setCurrentRole(v as any);
          }}
          globalRoleKey={globalRoleKey}
          onChuyenCap={onChuyenCap}
          vanBanList={vanBanList} 
        />`;

  content = content.replace(oldSidebarRegex, newSidebar);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Refactored ' + path);
}

refactorFile('app/tinh/AppTinh.tsx');
refactorFile('app/toicao/AppToiCao.tsx');
