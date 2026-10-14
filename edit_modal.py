import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_col_modal = """  const cot: ColumnsType<UngVien> = [
    { title: "Họ tên", dataIndex: "ten", render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: "Chức danh", dataIndex: "chucDanh", width: 170 },
    { title: "Đơn vị", dataIndex: "donVi", width: 250 },"""

new_col_modal = """  const cot: ColumnsType<UngVien> = [
    { title: "Họ tên", dataIndex: "ten", render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: "Chức danh", dataIndex: "chucDanh", width: 140 },
    { title: "Chức vụ", dataIndex: "chucVu", width: 140 },
    { title: "Đơn vị", dataIndex: "donVi", width: 220 },"""

c = c.replace(old_col_modal, new_col_modal)
c = c.replace(old_col_modal.replace('\n', '\r\n'), new_col_modal.replace('\n', '\r\n'))

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
