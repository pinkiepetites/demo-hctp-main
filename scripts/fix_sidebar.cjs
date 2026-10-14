const fs = require('fs');

function fixSidebar() {
  const filePath = 'app/toicao/AppToiCao.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace using a regex that handles whitespace
  const oldRegex = /<SubItem icon=\{<Inbox size=\{13\} \/>\} label="Nhận đơn và TL vụ án"[\s\S]*?active=\{activePage === "nhandon_tl"\} nav="nhandon_tl" \/>\s*<SubItem icon=\{<Scale size=\{13\} \/>\} label="Cấu hình phân công TP"[\s\S]*?active=\{activePage === "cauhinh_pctp"\} nav="cauhinh_pctp" \/>/g;

  const newCode = `{MENU_GDT.map(m => (
                <SubItem key={m.nav} icon={m.icon} label={m.label}
                  active={activePage === m.nav} nav={m.nav} />
              ))}`;

  if (oldRegex.test(content)) {
    content = content.replace(oldRegex, newCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully replaced sidebar elements.');
  } else {
    console.log('Regex did not match anything in AppToiCao.tsx');
  }
}

fixSidebar();
