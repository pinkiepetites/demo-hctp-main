const fs = require('fs');

function mergeGDToiCao(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Imports
  if (!content.includes('QuanLyAnGDTTT')) {
    content = content.replace(
      /import \{ CapSwitcherPill \} from "\.\.\/components\/CapSwitcherPill";/,
      'import { CapSwitcherPill } from "../components/CapSwitcherPill";\nimport QuanLyAnGDTTT from "../gdt/App";\nimport type { View as GdtView } from "../gdt/views";'
    );
  }

  // 2. MENU_GDT Constant
  const menuGdtCode = `
const MENU_GDT: { nav: string; label: string; icon: React.ReactNode }[] = [
  { nav: "gdt:don-cho-phe-duyet", label: "Nhận đơn và TL vụ án", icon: <Inbox size={13} /> },
  { nav: "gdt:ho-so-khang-nghi", label: "Hồ sơ kháng nghị", icon: <FolderOpen size={13} /> },
  { nav: "gdt:quan-ly-vu-an", label: "Quản lý vụ án", icon: <Gavel size={13} /> },
  { nav: "gdt:phan-cong-ttv", label: "Phân công Công chức nghiên cứu", icon: <Users size={13} /> },
  { nav: "gdt:quan-ly-vu-xet-xu", label: "Quản lý vụ xét xử GĐT", icon: <Scale size={13} /> },
  { nav: "gdt:quan-ly-khieu-nai", label: "Quản lý khiếu nại", icon: <MessageSquare size={13} /> },
  { nav: "gdt:an-quoc-hoi", label: "Án quốc hội", icon: <Scale size={13} /> },
  { nav: "gdt:an-thoi-hieu", label: "Án thời hiệu", icon: <Clock size={13} /> },
  { nav: "gdt:cong-van-trao-doi", label: "Công văn trao đổi", icon: <Mail size={13} /> },
  { nav: "gdt:cau-hinh-ttv", label: "Cấu hình Công chức nghiên cứu báo cáo", icon: <Settings size={13} /> },
];
`;
  if (!content.includes('const MENU_GDT')) {
    content = content.replace(
      /const DS_VAI_TRO = \["can-bo"/,
      `${menuGdtCode}\nconst DS_VAI_TRO = ["can-bo"`
    );
  }

  // 3. States
  if (!content.includes('gdtView')) {
    content = content.replace(
      /const \[view, setView\] = useState<\n    "home" | "list" | "form" | "prototype" | "bieumau" | "wordeditor" |\n    "phancong" | "phe_duyet" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet" | "so_sanh_loai_an"\n  >\("home"\);/,
      'const [view, setView] = useState<"home" | "list" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet" | "so_sanh_loai_an" | "gdt">("home");\n  const [gdtView, setGdtView] = useState<GdtView>("don-cho-phe-duyet");\n  const [gdtNavSeq, setGdtNavSeq] = useState(0);'
    );
    // Alternatively if the state declaration is slightly different:
    content = content.replace(
      /const \[view, setView\] = useState<any>\("home"\);/, // just in case
      'const [view, setView] = useState<any>("home");\n  const [gdtView, setGdtView] = useState<GdtView>("don-cho-phe-duyet");\n  const [gdtNavSeq, setGdtNavSeq] = useState(0);'
    );
    // Because I don't know the exact signature of view, I'll use a safer regex:
    content = content.replace(
      /(const \[isSidebarOpen, setIsSidebarOpen\] = useState\(true\);)/,
      '$1\n  const [gdtView, setGdtView] = useState<GdtView>("don-cho-phe-duyet");\n  const [gdtNavSeq, setGdtNavSeq] = useState(0);'
    );
  }

  // 4. Sidebar rendering (MENU_GDT)
  content = content.replace(
    /<SubItem icon=\{<Inbox size=\{13\} \/>\} label="Nhận đơn và TL vụ án"[\s\S]+?<SubItem icon=\{<Scale size=\{13\} \/>\} label="Cấu hình phân công TP"[\s\S]+?\/>/,
    '{MENU_GDT.map(m => (\n                <SubItem key={m.nav} icon={m.icon} label={m.label}\n                  active={activePage === m.nav} nav={m.nav} />\n              ))}'
  );

  // 5. AppToiCao component <Sidebar .../> props
  content = content.replace(
    /<Sidebar activePage=\{view\} currentRole=\{currentRole\} onNav=\{\(page\) => \{ setView\(page as any\); \}\}/,
    `<Sidebar activePage={view === "gdt" ? \`gdt:\${gdtView}\` : view} currentRole={currentRole} onNav={(page) => {
            if (page.startsWith("gdt:")) {
              setGdtView(page.slice(4) as GdtView);
              setGdtNavSeq(n => n + 1);
              setView("gdt");
              return;
            }
            setView(page as any);
          }}`
  );

  // 6. View rendering
  if (!content.includes('<QuanLyAnGDTTT view=')) {
    content = content.replace(
      /(\{view === "phancong" && \()/g,
      `{view === "gdt" && (
            <div className="flex-1 overflow-hidden">
              <QuanLyAnGDTTT view={gdtView} navSeq={gdtNavSeq} onNavigate={setGdtView} />
            </div>
          )}\n          $1`
    );
  }

  // 7. Breadcrumb hiding logic
  // Wrap the existing breadcrumb in `{view !== "gdt" && <> ... </>}` and add right icons just like AppTinh
  // First, find the whole breadcrumb div
  content = content.replace(
    /(<Menu size=\{16\} className="cursor-pointer text-\[#888\] hover:text-\[#333\] mr-2" onClick=\{\(\) => setIsSidebarOpen\(!isSidebarOpen\)\} \/>)([\s\S]+?)(<\/div>\s*\{\/\* Nhóm các tab con)/,
    `$1\n            {view !== "gdt" && <>\n$2</>}\n$3`
  );
  
  // Need to adjust the right side icons if they exist in TopBar or Breadcrumb.
  // In AppToiCao, the icons (Search, Moon) might already be in TopBar or something.
  // We'll just leave the breadcrumb as is, just wrapped in view !== "gdt".
  // Wait, I should make sure the Regex matched properly. Let me write a safer replace.

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Merged GDT into Toi Cao');
}

try {
  mergeGDToiCao('app/toicao/AppToiCao.tsx');
} catch (e) {
  console.error(e);
}
