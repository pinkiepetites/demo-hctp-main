import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add state
c = c.replace('const [soQD, setSoQD] = useState("");', 'const [soQD, setSoQD] = useState("");\n  const [tenTP, setTenTP] = useState("");')
c = c.replace('const [soQD, setSoQD] = useState("");\r\n', 'const [soQD, setSoQD] = useState("");\r\n  const [tenTP, setTenTP] = useState("");\r\n')

# Add filter logic
old_filter = """    if (soQD.trim() && !k.soQD.toLowerCase().includes(soQD.trim().toLowerCase())) return false;
    // Kỳ giao với khoảng lọc thì giữ lại"""

new_filter = """    if (soQD.trim() && !k.soQD.toLowerCase().includes(soQD.trim().toLowerCase())) return false;
    if (tenTP.trim()) {
      const tk = tenTP.trim().toLowerCase();
      if (!k.duongNhien.some(d => d.ten.toLowerCase().includes(tk)) &&
          !k.chiDinh.some(c => c.ten.toLowerCase().includes(tk))) return false;
    }
    // Kỳ giao với khoảng lọc thì giữ lại"""

c = c.replace(old_filter, new_filter)
c = c.replace(old_filter.replace('\n', '\r\n'), new_filter.replace('\n', '\r\n'))

# Add input UI
old_ui = """          <div style={{ width: 250 }}>
            <Nhan>Số quyết định</Nhan>
            <Input allowClear prefix={<Search size={14} color={MUTED} />} placeholder="Số QĐ của Chánh án TANDTC..."
              value={soQD} onChange={e => setSoQD(e.target.value)} />
          </div>
          <span style={{ flex: 1 }} />
          <Button onClick={() => { setTrangThai(undefined); setTuNgay(null); setDenNgay(null); setSoQD(""); }}>Xóa lọc</Button>"""

new_ui = """          <div style={{ width: 250 }}>
            <Nhan>Số quyết định</Nhan>
            <Input allowClear prefix={<Search size={14} color={MUTED} />} placeholder="Số QĐ của Chánh án TANDTC..."
              value={soQD} onChange={e => setSoQD(e.target.value)} />
          </div>
          <div style={{ width: 200 }}>
            <Nhan>Tên thẩm phán</Nhan>
            <Input allowClear prefix={<Search size={14} color={MUTED} />} placeholder="Tên thành viên Ủy ban..."
              value={tenTP} onChange={e => setTenTP(e.target.value)} />
          </div>
          <span style={{ flex: 1 }} />
          <Button onClick={() => { setTrangThai(undefined); setTuNgay(null); setDenNgay(null); setSoQD(""); setTenTP(""); }}>Xóa lọc</Button>"""

c = c.replace(old_ui, new_ui)
c = c.replace(old_ui.replace('\n', '\r\n'), new_ui.replace('\n', '\r\n'))

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
