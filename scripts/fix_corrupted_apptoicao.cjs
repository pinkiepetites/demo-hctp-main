const fs = require('fs');
let content = fs.readFileSync('app/toicao/AppToiCao.tsx', 'utf8');

// Fix the corrupted SubItem line
const corruptedRegex = /<SubItem icon=\{<List size=\{13\} \/>\} label="Danh sách đơn" active=\{activePage ===const \[view.*?\}\s*\/>/s;
content = content.replace(corruptedRegex, '<SubItem icon={<List size={13} />} label="Danh sách đơn" active={activePage === "list" || activePage === "form" || activePage === "prototype"} nav="list" />');

// Now, correctly add the gdt states to AppToiCao function if they are missing
if (!content.includes('const [gdtView, setGdtView]')) {
  // Let's inject them at the very beginning of the AppToiCao function
  content = content.replace(
    /export default function AppToiCao\(\{[\s\S]+?\} = \{\}\) \{/,
    `export default function AppToiCao({\n  activeRole = "toicao-pho-vp",\n  globalRoleKey,\n  onDoiVaiTro,\n  onChuyenCap\n}: AppToiCaoProps = {}) {\n  const [gdtView, setGdtView] = useState<GdtView>("don-cho-phe-duyet");\n  const [gdtNavSeq, setGdtNavSeq] = useState(0);`
  );
}

// And ensure view state includes "gdt"
content = content.replace(
  /useState<"home" \| "list" \| "form" \| "prototype" \| "bieumau" \| "wordeditor" \| "phancong" \| "phe_duyet" \| "van_ban_trinh_ky" \| "hieu_suat_chi_tiet" \| "so_sanh_loai_an">/,
  'useState<"home" | "list" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet" | "so_sanh_loai_an" | "gdt">'
);

fs.writeFileSync('app/toicao/AppToiCao.tsx', content, 'utf8');
console.log("Fixed corrupted line and injected state properly.");
