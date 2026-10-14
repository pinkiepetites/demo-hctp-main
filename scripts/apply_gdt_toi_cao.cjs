const fs = require('fs');

function applyGDTTToiCao(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. MENU_GDT definition
  const menuGdt = `
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
      'const DS_VAI_TRO = ["can-bo", "truong-phong", "pho-vp", "lanh-dao", "chanh-an"] as const;',
      menuGdt + '\nconst DS_VAI_TRO = ["can-bo", "truong-phong", "pho-vp", "lanh-dao", "chanh-an"] as const;'
    );
  }

  // 2. Sidebar component
  const oldSidebar = `<Sidebar activePage={view} currentRole={currentRole} onNav={(page) => { setView(page as any); }}`;
  const newSidebar = `<Sidebar activePage={view === "gdt" ? \`gdt:\${gdtView}\` : view} currentRole={currentRole} onNav={(page) => {
            if (page.startsWith("gdt:")) {
              setGdtView(page.slice(4) as GdtView);
              setGdtNavSeq(n => n + 1);
              setView("gdt");
              return;
            }
            setView(page as any);
          }}`;
  content = content.replace(oldSidebar, newSidebar);

  // 3. View rendering
  const oldPhanCongView = `                        </>
                        : view === "phancong"`;
  const newPhanCongView = `                        </>
                        : view === "gdt" ? (
                            <div className="flex-1 overflow-hidden">
                              <QuanLyAnGDTTT view={gdtView} navSeq={gdtNavSeq} onNavigate={setGdtView} />
                            </div>
                        ) : view === "phancong"`;
  if (content.includes(oldPhanCongView) && !content.includes('<QuanLyAnGDTTT view={gdtView}')) {
      content = content.replace(oldPhanCongView, newPhanCongView);
  } else if (!content.includes('<QuanLyAnGDTTT view={gdtView}')) {
      // Find where to put it
      content = content.replace(
          `                        </>
                        : view === "phancong"`,
          `                        </>
                        : view === "gdt" ? (
                            <div className="flex-1 overflow-hidden">
                              <QuanLyAnGDTTT view={gdtView} navSeq={gdtNavSeq} onNavigate={setGdtView} />
                            </div>
                        ) : view === "phancong"`
      );
  }

  // 4. Sidebar menu UI
  const oldMenu = `<div className="pb-1">
              <SubItem icon={<Inbox size={13} />} label="Nhận đơn và TL vụ án"
                active={activePage === "nhandon_tl"} nav="nhandon_tl" />
              <SubItem icon={<Scale size={13} />} label="Cấu hình phân công TP"
                active={activePage === "cauhinh_pctp"} nav="cauhinh_pctp" />
            </div>`;
  const newMenu = `<div className="pb-1">
              {MENU_GDT.map(m => (
                <SubItem key={m.nav} icon={m.icon} label={m.label}
                  active={activePage === m.nav} nav={m.nav} />
              ))}
            </div>`;
  content = content.replace(oldMenu, newMenu);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Applied UI fixes to AppToiCao');
}

try {
  applyGDTTToiCao('app/toicao/AppToiCao.tsx');
} catch (e) {
  console.error(e);
}
