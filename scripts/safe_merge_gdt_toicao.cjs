const fs = require('fs');

function mergeGDToiCao(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Imports
  content = content.replace(
    /import \{ CapSwitcherPill \} from "\.\.\/components\/CapSwitcherPill";/,
    'import { CapSwitcherPill } from "../components/CapSwitcherPill";\nimport QuanLyAnGDTTT from "../gdt/App";\nimport type { View as GdtView } from "../gdt/views";'
  );

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
  content = content.replace(
    /const DS_VAI_TRO = \["can-bo"/,
    `${menuGdtCode}\nconst DS_VAI_TRO = ["can-bo"`
  );

  // 3. States & toggle
  // Replace the exact view hook declaration safely
  const viewHookRegex = /const \[view, setView\] = useState<\n\s*"home" \| "list" \| "form" \| "prototype" \| "bieumau" \| "wordeditor" \|\n\s*"phancong" \| "phe_duyet" \| "van_ban_trinh_ky" \| "hieu_suat_chi_tiet" \| "so_sanh_loai_an"\n\s*>\("home"\);/m;
  const newViewHook = `const [view, setView] = useState<"home" | "list" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet" | "so_sanh_loai_an" | "gdt">("home");
  const [gdtView, setGdtView] = useState<GdtView>("don-cho-phe-duyet");
  const [gdtNavSeq, setGdtNavSeq] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);`;
  content = content.replace(viewHookRegex, newViewHook);

  // 4. Sidebar rendering (MENU_GDT)
  const sidebarGdtGroup = /<SubItem icon=\{<Inbox size=\{13\} \/>\} label="Nhận đơn và TL vụ án"[\s\S]*?<SubItem icon=\{<Scale size=\{13\} \/>\} label="Cấu hình phân công TP"[\s\S]*?\/>/;
  content = content.replace(sidebarGdtGroup, `{MENU_GDT.map(m => (
                <SubItem key={m.nav} icon={m.icon} label={m.label}
                  active={activePage === m.nav} nav={m.nav} />
              ))}`);

  // 5. AppToiCao component <Sidebar .../> props & wrapper
  // We need to wrap it in {isSidebarOpen && <Sidebar ... />}
  // And change activePage and onNav
  const oldSidebarStr = /<Sidebar activePage=\{view\} currentRole=\{currentRole\} onNav=\{\(page\) => \{ setView\(page as any\); \}\}/;
  content = content.replace(
    oldSidebarStr,
    `{isSidebarOpen && <Sidebar activePage={view === "gdt" ? \`gdt:\${gdtView}\` : view} currentRole={currentRole} onNav={(page) => {
            if (page.startsWith("gdt:")) {
              setGdtView(page.slice(4) as GdtView);
              setGdtNavSeq(n => n + 1);
              setView("gdt");
              return;
            }
            setView(page as any);
          }}`
  );
  // Also fix the closing tag of Sidebar to close the condition
  content = content.replace(/vanBanList=\{vanBanList\} \/>/, 'vanBanList={vanBanList} />}');

  // 6. View rendering for GDT
  // Inject right before phancong
  content = content.replace(
    /(\{view === "phancong" && \()/g,
    `{view === "gdt" && (
            <div className="flex-1 overflow-hidden">
              <QuanLyAnGDTTT view={gdtView} navSeq={gdtNavSeq} onNavigate={setGdtView} />
            </div>
          )}\n          $1`
  );

  // 7. Breadcrumb hiding logic and toggle button
  // In AppToiCao, Breadcrumb is exactly:
  // <div className="bg-white border-b border-[#ddd] px-4 py-[6px] flex items-center gap-1 text-[12px] text-[#666] flex-shrink-0">
  //   <span className="text-[#1a5a96] hover:underline cursor-pointer">Trang chủ</span>
  const breadcrumbStart = /<div className="bg-white border-b border-\[#ddd\] px-4 py-\[6px\] flex items-center gap-1 text-\[12px\] text-\[#666\] flex-shrink-0">/;
  content = content.replace(breadcrumbStart, `<div className="bg-white border-b border-[#ddd] px-4 py-[6px] flex items-center gap-1 text-[12px] text-[#666] flex-shrink-0">
            <Menu size={16} className="cursor-pointer text-[#888] hover:text-[#333] mr-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            {view !== "gdt" && <>`);

  // We need to close the `</>` right before the right-side icons
  // In AppToiCao, there are no right-side icons in the breadcrumb directly. It just closes the div.
  // Wait, let's look at the end of the breadcrumb.
  const breadcrumbEnd = /<span className="text-\[#333\]">Thêm mới<\/span>\n\s*<\/>\n\s*\}/;
  content = content.replace(breadcrumbEnd, `<span className="text-[#333]">Thêm mới</span>\n                  </>\n            }\n            </>}`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Merged GDT into Toi Cao with toggle');
}

try {
  mergeGDToiCao('app/toicao/AppToiCao.tsx');
} catch (e) {
  console.error(e);
}
