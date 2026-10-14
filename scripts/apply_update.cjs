const fs = require('fs');
const file = 'app/gdt/QuanLyHoSoGiaoNhanView.tsx';
let content = fs.readFileSync(file, 'utf8');

const repScript = fs.readFileSync('scripts/update_giao_nhan.cjs', 'utf8');
const replacement = repScript.split('`')[1];

const m1 = content.indexOf('<Typography.Title level={4} style={{ marginBottom: 5 }}>Quản lý hồ sơ giao nhận</Typography.Title>');
const m2 = content.indexOf('{showTuChoi && selectedRecord && <ModalTuChoiTiepNhan');

if (m1 !== -1 && m2 !== -1) {
  const newContent = content.slice(0, m1) + replacement + '\n\n        ' + content.slice(m2);
  fs.writeFileSync(file, newContent, 'utf8');
  console.log('Replaced successfully');
} else {
  console.log('Could not find markers', m1, m2);
}

