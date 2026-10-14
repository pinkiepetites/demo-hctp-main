const fs = require('fs');

let content = fs.readFileSync('app/toicao/AppToiCao.tsx', 'utf8');

// 1. Imports
const importsTarget = `  import { AppHeader } from "../components/AppHeader";
  import { AppSidebar as Sidebar } from "../components/AppSidebar";`;
const importsReplace = `  import { AppHeader } from "../components/AppHeader";
  import { AppSidebar as Sidebar } from "../components/AppSidebar";
  import QuanLyAnGDTTT from "../gdt/App";
  import type { View as GdtView } from "../gdt/views";`;
content = content.replace(importsTarget, importsReplace);

// 2. MENU_GDT
const dsVaiTroTarget = `  const DS_VAI_TRO = ["can-bo", "lanh-dao-phong", "lanh-dao-vu", "toicao", "cuc-qlt", "hdtt"];`;
const dsVaiTroReplace = `  const MENU_GDT: { nav: string; label: string; icon: React.ReactNode }[] = [
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
  const DS_VAI_TRO = ["can-bo", "lanh-dao-phong", "lanh-dao-vu", "toicao", "cuc-qlt", "hdtt"];`;
content = content.replace(dsVaiTroTarget, dsVaiTroReplace);

// 3. States
const statesTarget = `  const [view, setView] = useState<
    "home" | "list" | "form" | "prototype" | "bieumau" | "wordeditor" |
    "phancong" | "phe_duyet" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet" | "so_sanh_loai_an"
  >("home");`;
const statesReplace = `  const [view, setView] = useState<
    "home" | "list" | "form" | "prototype" | "bieumau" | "wordeditor" |
    "phancong" | "phe_duyet" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet" | "so_sanh_loai_an" | "gdt"
  >("home");
  const [gdtView, setGdtView] = useState<GdtView>("don-cho-phe-duyet");
  const [gdtNavSeq, setGdtNavSeq] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);`;
content = content.replace(statesTarget, statesReplace);

// 4. Sidebar items
const sidebarGdtTarget = `        {/* Quản lý án GĐT/TT */}
        <div>
          <GroupItem icon={<Scale size={15} />} label="Quản lý án GĐT/TT"
            open={quanLyAnOpen} onToggle={() => setQuanLyAnOpen(!quanLyAnOpen)} />
          {quanLyAnOpen && (
            <div className="pb-1">
              <SubItem icon={<Inbox size={13} />} label="Nhận đơn và TL vụ án"
                active={activePage === "nhandon_tl"} nav="nhandon_tl" />
              <SubItem icon={<Scale size={13} />} label="Cấu hình phân công TP"
                active={activePage === "cauhinh_pctp"} nav="cauhinh_pctp" />
            </div>
          )}
        </div>`;
const sidebarGdtReplace = `        {/* Quản lý án GĐT/TT */}
        <div>
          <GroupItem icon={<Scale size={15} />} label="Quản lý án GĐT/TT"
            open={quanLyAnOpen} onToggle={() => setQuanLyAnOpen(!quanLyAnOpen)} />
          {quanLyAnOpen && (
            <div className="pb-1">
              {MENU_GDT.map(m => (
                <SubItem key={m.nav} icon={m.icon} label={m.label}
                  active={activePage === m.nav} nav={m.nav} />
              ))}
            </div>
          )}
        </div>`;
content = content.replace(sidebarGdtTarget, sidebarGdtReplace);

// 5. Sidebar rendering
const renderSidebarTarget = `        {/* Sidebar */}
        <Sidebar activePage={view} currentRole={currentRole} onNav={(page) => { setView(page as any); }}
          onDoiVaiTro={(v) => {
            if (onDoiVaiTro) onDoiVaiTro(v);
            else setCurrentRole(v as any);
          }}
          globalRoleKey={globalRoleKey}
          onChuyenCap={onChuyenCap}
          vanBanList={vanBanList} />`;
const renderSidebarReplace = `        {/* Sidebar */}
        {isSidebarOpen && <Sidebar activePage={view === "gdt" ? \`gdt:\${gdtView}\` : view} currentRole={currentRole} onNav={(page) => {
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
          vanBanList={vanBanList} />}`;
content = content.replace(renderSidebarTarget, renderSidebarReplace);

// 6. View rendering GDT
const renderViewTarget = `          {/* Home view */}
          {view === "home" && (`;
const renderViewReplace = `          {/* Module Quản lý án GĐT/TT */}
          {view === "gdt" && (
            <div className="flex-1 overflow-hidden">
              <QuanLyAnGDTTT view={gdtView} navSeq={gdtNavSeq} onNavigate={setGdtView} />
            </div>
          )}

          {/* Home view */}
          {view === "home" && (`;
content = content.replace(renderViewTarget, renderViewReplace);

// 7. Breadcrumb wrap
const breadcrumbTarget = `          {/* Breadcrumb */}
          <div className="bg-white border-b border-[#ddd] px-4 py-[6px] flex items-center gap-1 text-[12px] text-[#666] flex-shrink-0">
            <span className="text-[#1a5a96] hover:underline cursor-pointer">Trang chủ</span>`;
const breadcrumbReplace = `          {/* Breadcrumb */}
          <div className="bg-white border-b border-[#ddd] px-4 py-[6px] flex items-center gap-1 text-[12px] text-[#666] flex-shrink-0">
            <Menu size={16} className="cursor-pointer text-[#888] hover:text-[#333] mr-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            {view !== "gdt" && <>
              <span className="text-[#1a5a96] hover:underline cursor-pointer">Trang chủ</span>`;
content = content.replace(breadcrumbTarget, breadcrumbReplace);

const breadcrumbCloseTarget = `                                    <span className="text-[#333]">Thêm mới</span>
                                  </>
            }
          </div>`;
const breadcrumbCloseReplace = `                                    <span className="text-[#333]">Thêm mới</span>
                                  </>
            }
            </>}
          </div>`;
content = content.replace(breadcrumbCloseTarget, breadcrumbCloseReplace);

fs.writeFileSync('app/toicao/AppToiCao.tsx', content, 'utf8');
console.log("AppToiCao fully merged without regex.");
