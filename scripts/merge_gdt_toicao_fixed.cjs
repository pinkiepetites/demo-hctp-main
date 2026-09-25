const fs = require('fs');

function fixAppToiCao(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix 1: Add "gdt" to view type and add gdtView states
  const oldState = 'const [view, setView] = useState<"home" | "list" | "lienthong" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "nhandon_tl" | "cauhinh_pctp" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet" | "so_sanh_loai_an" | "tiepnhan_don_lienthong">(donChiTietTabMoi ? "form" : "list");';
  const newState = 'const [view, setView] = useState<"home" | "list" | "lienthong" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "nhandon_tl" | "cauhinh_pctp" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet" | "so_sanh_loai_an" | "tiepnhan_don_lienthong" | "gdt">(donChiTietTabMoi ? "form" : "list");\n  const [gdtView, setGdtView] = useState<GdtView>("don-cho-phe-duyet");\n  const [gdtNavSeq, setGdtNavSeq] = useState(0);';

  if (content.includes(oldState)) {
    content = content.replace(oldState, newState);
  }

  // Also I need to ensure it's imported at the top. Let's see if we added `import QuanLyAnGDTTT` yet.
  if (!content.includes('import QuanLyAnGDTTT from "../gdt/App";')) {
     content = content.replace(
      /import \{ CapSwitcherPill \} from "\.\.\/components\/CapSwitcherPill";/,
      'import { CapSwitcherPill } from "../components/CapSwitcherPill";\nimport QuanLyAnGDTTT from "../gdt/App";\nimport type { View as GdtView } from "../gdt/views";'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed AppToiCao.tsx state types');
}

fixAppToiCao('app/toicao/AppToiCao.tsx');
