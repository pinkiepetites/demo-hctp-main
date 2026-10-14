const fs = require('fs');

function refactorFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // 1. Add import
  if (!content.includes('import { AppHeader }')) {
    content = content.replace('import Dashboard from "./Dashboard";', 'import Dashboard from "./Dashboard";\nimport { AppHeader } from "../components/AppHeader";');
  }

  // Find start of Top Nav bar
  const startPattern = '{/* ── Top navigation bar ───────────────────────────────────────────── */}';
  const startIdx = content.indexOf(startPattern);
  if (startIdx === -1) {
    console.log('Could not find start pattern in ' + path);
    return;
  }

  // Find the end of the top nav bar. It is immediately followed by:
  // {/* ── Body: Sidebar + content ──────────────────────────────────────── */}
  const endPattern = '{/* ── Body: Sidebar + content ──────────────────────────────────────── */}';
  const endIdx = content.indexOf(endPattern, startIdx);
  if (endIdx === -1) {
    console.log('Could not find end pattern in ' + path);
    return;
  }

  const cap = path.includes('AppTinh') ? 'tinh' : 'toicao';

  const newHeader = `{/* ── Top navigation bar ───────────────────────────────────────────── */}
      <AppHeader
        currentCap="${cap}"
        donChiTietTabMoi={donChiTietTabMoi}
        view={view}
        editingRow={editingRow}
        editingRowId={editingRowId}
        ocrStatus={ocrStatus}
        ocrFieldsSize={ocrFields?.size || 0}
        onClearOcrFields={() => setOcrFields(new Set())}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(p => p.map(n => ({ ...n, read: true })))}
        onMarkRead={(id) => setNotifications(p => p.map(x => x.id === id ? { ...x, read: true } : x))}
        onShowTraLaiForm={() => setShowTraLaiForm(true)}
        onCancelForm={() => setView("list")}
        onSaveForm={() => {
          luuLichSuXuLy();
          addNotification(\`Đơn \${editingRow?.maDon || "7031"} đã được thêm mới bởi cán bộ Nguyễn Văn An\`);
          setView("list");
        }}
      />\n      `;

  const oldBlock = content.substring(startIdx, endIdx);
  content = content.replace(oldBlock, newHeader);
  
  fs.writeFileSync(path, content, 'utf8');
  console.log('Refactored ' + path);
}

refactorFile('app/tinh/AppTinh.tsx');
refactorFile('app/toicao/AppToiCao.tsx');
