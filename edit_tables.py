import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update DuongNhien type
c = c.replace('type DuongNhien = { id: string; ten: string; ngach: string; chucDanh: string; chucVu: string; chuTri?: boolean };', 'type DuongNhien = { id: string; ten: string; ngach: string; chucDanh: string; chucVu: string; chuTri?: boolean; ngayVao?: string; };')

# 2. Update BangDuongNhien columns
old_bdn = """  const cot: ColumnsType<DuongNhien> = [
    cotSTT,
    {
      title: "Họ tên", dataIndex: "ten", width: 260,
      render: (v, r) => <div><div style={{ fontWeight: 600 }}>{v}</div><Text type="secondary" style={{ fontSize: 12 }}>{r.ngach}</Text></div>,
    },
    { title: "Chức danh", dataIndex: "chucDanh", width: 160 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 200 },
    { title: "Đơn vị", width: 280, render: () => toaAn },
    {
      title: "Loại thành viên",
      render: (_, r) => <>
        <Tag color="blue">Thành viên đương nhiên</Tag>
        {r.chuTri && <Tag color="success">Chủ trì phiên họp</Tag>}
      </>,
    },
  ];"""

new_bdn = """  const cot: ColumnsType<DuongNhien> = [
    cotSTT,
    {
      title: "Họ tên", dataIndex: "ten", width: 240,
      render: (v, r) => <div><div style={{ fontWeight: 600 }}>{v}</div><Text type="secondary" style={{ fontSize: 12 }}>{r.ngach}</Text></div>,
    },
    { title: "Chức danh", dataIndex: "chucDanh", width: 140 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 160 },
    { title: "Đơn vị", width: 200, render: (_, r) => (r as any).donVi || toaAn },
    { title: "Ngày vào ủy ban", width: 140, render: (_, r) => r.ngayVao || "-" },
    {
      title: "Loại thành viên",
      render: (_, r) => <>
        <Tag color="blue">Thành viên đương nhiên</Tag>
        {r.chuTri && <Tag color="success">Chủ trì phiên họp</Tag>}
      </>,
    },
  ];"""
c = c.replace(old_bdn, new_bdn)
c = c.replace(old_bdn.replace('\n', '\r\n'), new_bdn.replace('\n', '\r\n'))

# 3. Update BangChiDinh columns
old_bcd = """  const cot: ColumnsType<ChiDinh> = [
    cotSTT,
    { title: "Họ tên", dataIndex: "ten", width: 260, render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: "Chức danh", dataIndex: "chucDanh", width: 160 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 160 },
    { title: "Đơn vị", dataIndex: "donVi", width: 280 },
    onBo
      ? {
        title: "", width: 80, align: "center",
        render: (_, r) => (
          <Tooltip title="Bỏ khỏi Ủy ban">
            <Button danger size="small" aria-label="Bỏ khỏi Ủy ban" icon={<Trash2 size={14} />} onClick={() => onBo(r.id)} />
          </Tooltip>
        ),
      }
      : { title: "Ngày vào Ủy ban", dataIndex: "ngayVao" },
  ];"""

new_bcd = """  const cot: ColumnsType<ChiDinh> = [
    cotSTT,
    { title: "Họ tên", dataIndex: "ten", width: 240, render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: "Chức danh", dataIndex: "chucDanh", width: 140 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 160 },
    { title: "Đơn vị", dataIndex: "donVi", width: 200 },
    { title: "Ngày vào ủy ban", dataIndex: "ngayVao", width: 140 },
    { title: "Loại thành viên", render: () => <Tag color="cyan">Thẩm phán được chỉ định</Tag> },
  ];
  
  if (onBo) {
    cot.push({
      title: "", width: 60, align: "center",
      render: (_, r) => (
        <Tooltip title="Bỏ khỏi Ủy ban">
          <Button danger size="small" aria-label="Bỏ khỏi Ủy ban" icon={<Trash2 size={14} />} onClick={() => onBo(r.id)} />
        </Tooltip>
      ),
    });
  }"""
c = c.replace(old_bcd, new_bcd)
c = c.replace(old_bcd.replace('\n', '\r\n'), new_bcd.replace('\n', '\r\n'))

# 4. In TabKyHienHanh, only pass onSua/onXoa if dangNhap is true
old_pass_dn = """        <BangDuongNhien ds={dnHien} toaAn={uyBan.toaAn}
          onSua={chiXem ? undefined : r => setSuaDN(r)}
          onXoa={chiXem ? undefined : id => datDuongNhien(ds => ds.filter(d => d.id !== id))} />"""

new_pass_dn = """        <BangDuongNhien ds={dnHien} toaAn={uyBan.toaAn}
          onSua={dangNhap ? r => setSuaDN(r) : undefined}
          onXoa={dangNhap ? id => datDuongNhien(ds => ds.filter(d => d.id !== id)) : undefined} />"""
c = c.replace(old_pass_dn, new_pass_dn)
c = c.replace(old_pass_dn.replace('\n', '\r\n'), new_pass_dn.replace('\n', '\r\n'))

old_dn_extra = """extra={!chiXem && <Button icon={<Plus size={14} />} onClick={() => setSuaDN("moi")}>Thêm thành viên đương nhiên</Button>}>"""
new_dn_extra = """extra={dangNhap && <Button icon={<Plus size={14} />} onClick={() => setSuaDN("moi")}>Thêm thành viên đương nhiên</Button>}>"""
c = c.replace(old_dn_extra, new_dn_extra)
c = c.replace(old_dn_extra.replace('\n', '\r\n'), new_dn_extra.replace('\n', '\r\n'))

old_dn_desc = """tự nạp theo chức vụ — Điều 57{!chiXem && "; sửa được khi nhân sự thay đổi mà chưa kịp cập nhật"}"""
new_dn_desc = """tự nạp theo chức vụ — Điều 57"""
c = c.replace(old_dn_desc, new_dn_desc)
c = c.replace(old_dn_desc.replace('\n', '\r\n'), new_dn_desc.replace('\n', '\r\n'))

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
