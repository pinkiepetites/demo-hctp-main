import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Update types
c = c.replace('type DuongNhien = { id: string; ten: string; ngach: string; chucVu: string; chuTri?: boolean };', 'type DuongNhien = { id: string; ten: string; ngach: string; chucDanh: string; chucVu: string; chuTri?: boolean };')
c = c.replace('type ChiDinh = { id: string; ten: string; chucDanh: string; donVi: string; ngayVao: string };', 'type ChiDinh = { id: string; ten: string; chucDanh: string; chucVu: string; donVi: string; ngayVao: string };')
c = c.replace('type UngVien = { id: string; ten: string; chucDanh: string; donVi: string; soVu: number };', 'type UngVien = { id: string; ten: string; chucDanh: string; chucVu: string; donVi: string; soVu: number };')

# Update uyBanHaNoi mapping
c = c.replace('ngach: "Thẩm phán bậc 1", chucVu: t.chucVu, chuTri: i === 0 }));', 'ngach: "Thẩm phán bậc 1", chucDanh: "Thẩm phán TAND", chucVu: t.chucVu, chuTri: i === 0 }));')
c = c.replace('id: t.id, ten: t.ten, chucDanh: "Thẩm phán TAND",', 'id: t.id, ten: t.ten, chucDanh: "Thẩm phán TAND", chucVu: "Thẩm phán",')
c = c.replace('chucDanh: c.chucDanh, donVi: c.donVi, soVu:', 'chucDanh: c.chucDanh, chucVu: c.chucVu, donVi: c.donVi, soVu:')
c = c.replace('chucDanh: "Thẩm phán TAND", donVi: t.donVi, soVu:', 'chucDanh: "Thẩm phán TAND", chucVu: "Thẩm phán", donVi: t.donVi, soVu:')

# Update uyBanSinh mapping
c = c.replace('ngach: i === 0 ? "Thẩm phán bậc 1" : "Thẩm phán bậc 2",\n    chucVu: i === 0 ? "Chánh án" : "Phó Chánh án", chuTri: i === 0,', 'ngach: i === 0 ? "Thẩm phán bậc 1" : "Thẩm phán bậc 2",\n    chucDanh: "Thẩm phán TAND", chucVu: i === 0 ? "Chánh án" : "Phó Chánh án", chuTri: i === 0,')
c = c.replace('ngach: i === 0 ? "Thẩm phán bậc 1" : "Thẩm phán bậc 2",\r\n    chucVu: i === 0 ? "Chánh án" : "Phó Chánh án", chuTri: i === 0,', 'ngach: i === 0 ? "Thẩm phán bậc 1" : "Thẩm phán bậc 2",\r\n    chucDanh: "Thẩm phán TAND", chucVu: i === 0 ? "Chánh án" : "Phó Chánh án", chuTri: i === 0,')
c = c.replace('id: `${idx}-cd-${i}`, ten: tenTheo(s + 10 + i), chucDanh: "Thẩm phán TAND",', 'id: `${idx}-cd-${i}`, ten: tenTheo(s + 10 + i), chucDanh: "Thẩm phán TAND", chucVu: "Thẩm phán",')
c = c.replace('id: `${idx}-uv-${i}`, ten: tenTheo(s + 30 + i), chucDanh: "Thẩm phán TAND",', 'id: `${idx}-uv-${i}`, ten: tenTheo(s + 30 + i), chucDanh: "Thẩm phán TAND", chucVu: "Thẩm phán",')

# Update BangDuongNhien columns
old_col_duongnhien = """    {
      title: "Họ tên", dataIndex: "ten", width: 260,
      render: (v, r) => <div><div style={{ fontWeight: 600 }}>{v}</div><Text type="secondary" style={{ fontSize: 12 }}>{r.ngach}</Text></div>,
    },
    { title: "Chức vụ", dataIndex: "chucVu", width: 240 },"""
new_col_duongnhien = """    {
      title: "Họ tên", dataIndex: "ten", width: 260,
      render: (v, r) => <div><div style={{ fontWeight: 600 }}>{v}</div><Text type="secondary" style={{ fontSize: 12 }}>{r.ngach}</Text></div>,
    },
    { title: "Chức danh", dataIndex: "chucDanh", width: 160 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 200 },"""
c = c.replace(old_col_duongnhien, new_col_duongnhien)
c = c.replace(old_col_duongnhien.replace('\n', '\r\n'), new_col_duongnhien.replace('\n', '\r\n'))

# Update BangChiDinh columns
old_col_chidinh = """    { title: "Họ tên", dataIndex: "ten", width: 260, render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: "Chức danh", dataIndex: "chucDanh", width: 240 },"""
new_col_chidinh = """    { title: "Họ tên", dataIndex: "ten", width: 260, render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: "Chức danh", dataIndex: "chucDanh", width: 160 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 160 },"""
c = c.replace(old_col_chidinh, new_col_chidinh)
c = c.replace(old_col_chidinh.replace('\n', '\r\n'), new_col_chidinh.replace('\n', '\r\n'))

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
