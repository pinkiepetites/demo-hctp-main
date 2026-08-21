import codecs

with codecs.open('app/App.tsx', 'r', 'utf-8') as f:
    app = f.read()

with codecs.open('recovered_panel_edited.tsx', 'r', 'utf-8') as f:
    panel = f.read()

# remove trailing DanhSachDon from panel if any
panel = panel.replace('// ─── DanhSachDon screen ───────────────────────────────────────────────────────\n', '')
panel = panel.replace('// ─── DanhSachDon screen ───────────────────────────────────────────────────────', '')

app = app.replace('// ─── DanhSachDon screen ───────────────────────────────────────────────────────', panel + '\n// ─── DanhSachDon screen ───────────────────────────────────────────────────────', 1)

app = app.replace('const [view, setView] = useState<"home" | "list" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "nhandon_tl" | "cauhinh_pctp" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet">(donChiTietTabMoi ? "form" : "list");',
'const [view, setView] = useState<"home" | "list" | "lienthong" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "nhandon_tl" | "cauhinh_pctp" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet">(donChiTietTabMoi ? "form" : "list");', 1)

app = app.replace('<SubItem icon={<List size={13} />} label="Danh sách đơn" active={activePage === "list" || activePage === "form" || activePage === "prototype"} nav="list" />',
'<SubItem icon={<Inbox size={13} />} label="Tiếp nhận đơn liên thông" active={activePage === "lienthong"} nav="lienthong" />\n              <SubItem icon={<List size={13} />} label="Danh sách đơn" active={activePage === "list" || activePage === "form" || activePage === "prototype"} nav="list" />', 1)

app = app.replace('              : view === "list"\n                ? <span className="text-[#333]">Danh sách đơn</span>\n                : view === "prototype"',
'              : view === "list"\n                ? <span className="text-[#333]">Danh sách đơn</span>\n              : view === "lienthong"\n                ? <span className="text-[#333]">Tiếp nhận đơn liên thông</span>\n                : view === "prototype"', 1)

render_view = '''          {/* Tiếp nhận đơn liên thông */}
          {view === "lienthong" && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#eef1f5]">
              <PanelLienThong />
            </div>
          )}

          {/* List view */}'''
app = app.replace('          {/* List view */}', render_view, 1)

with codecs.open('app/App.tsx', 'w', 'utf-8') as f:
    f.write(app)

print('Done')
