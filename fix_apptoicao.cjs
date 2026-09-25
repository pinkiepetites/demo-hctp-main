const fs = require('fs');

const path = 'app/toicao/AppToiCao.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add import if not present
if (!content.includes('import TiepNhanDonLienThong from "./components/TiepNhanDonLienThong";')) {
  content = content.replace('import Dashboard from "./Dashboard";', 'import Dashboard from "./Dashboard";\nimport TiepNhanDonLienThong from "./components/TiepNhanDonLienThong";');
}

// Fix the view rendering condition and use the imported component
// The old block is:
// {view === "lienthong" && (
//   <div className="flex-1 overflow-y-auto p-4 bg-[#eef1f5]">
//     <PanelLienThong currentRole={currentRole} onChiTiet={(don) => {
//       setEditingRowId(null);
//       setView("form");
//       setActiveDonLienThong(don);
//     }} />
//   </div>
// )}

const searchStr = '{view === "lienthong" && (';
const startIdx = content.indexOf(searchStr);
if (startIdx !== -1) {
  // Find the closing of this block
  const endStr = ')}';
  const endIdx = content.indexOf(endStr, startIdx + searchStr.length);
  
  if (endIdx !== -1) {
    const oldBlock = content.substring(startIdx, endIdx + endStr.length);
    const newBlock = `{view === "tiepnhan_don_lienthong" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <TiepNhanDonLienThong 
                currentRole={currentRole} 
                onPhanLoaiGDT={(don) => {
                  setEditingRowId(null);
                  setView("form");
                  setActiveDonLienThong(don);
                }} 
              />
            </div>
          )}`;
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Fixed AppToiCao.tsx view routing and component usage.');
  } else {
    console.log('Could not find end of lienthong block');
  }
} else {
  console.log('Could not find lienthong block in AppToiCao.tsx');
}
