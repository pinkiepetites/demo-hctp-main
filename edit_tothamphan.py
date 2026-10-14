import re

with open('app/ToThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('];\n\n/** Danh bạ', '];\n\nconst CHUC_DANH = ["Thẩm phán", "Thư ký", "Thẩm tra viên"];\nconst CHUC_VU = ["Chánh án", "Phó Chánh án", "Trưởng phòng", "Phó Trưởng phòng", "Chánh tòa", "Phó Chánh tòa", "Không"];\n\n/** Danh bạ')
c = c.replace('];\r\n\r\n/** Danh bạ', '];\r\n\r\nconst CHUC_DANH = ["Thẩm phán", "Thư ký", "Thẩm tra viên"];\r\nconst CHUC_VU = ["Chánh án", "Phó Chánh án", "Trưởng phòng", "Phó Trưởng phòng", "Chánh tòa", "Phó Chánh tòa", "Không"];\r\n\r\n/** Danh bạ')

c = c.replace('  donVi: DON_VI[i % DON_VI.length],\n}));', '  donVi: DON_VI[i % DON_VI.length],\n  chucDanh: CHUC_DANH[i % CHUC_DANH.length],\n  chucVu: CHUC_VU[i % CHUC_VU.length],\n}));')
c = c.replace('  donVi: DON_VI[i % DON_VI.length],\r\n}));', '  donVi: DON_VI[i % DON_VI.length],\r\n  chucDanh: CHUC_DANH[i % CHUC_DANH.length],\r\n  chucVu: CHUC_VU[i % CHUC_VU.length],\r\n}));')

old_jsx = '<div className="text-[11px] text-[#94a3b8] tabular-nums">{u.taiKhoan}</div>\n              <div className="text-[11px] text-[#94a3b8] truncate">{u.donVi}</div>'
new_jsx = '<div className="text-[11px] text-[#94a3b8] tabular-nums">{u.taiKhoan}</div>\n              <div className="text-[11px] text-on-surface-variant truncate">{u.chucDanh} {u.chucVu !== "Không" ? `· ${u.chucVu}` : ""}</div>\n              <div className="text-[11px] text-[#94a3b8] truncate">{u.donVi}</div>'
c = c.replace(old_jsx, new_jsx)

old_jsx_rn = '<div className="text-[11px] text-[#94a3b8] tabular-nums">{u.taiKhoan}</div>\r\n              <div className="text-[11px] text-[#94a3b8] truncate">{u.donVi}</div>'
new_jsx_rn = '<div className="text-[11px] text-[#94a3b8] tabular-nums">{u.taiKhoan}</div>\r\n              <div className="text-[11px] text-on-surface-variant truncate">{u.chucDanh} {u.chucVu !== "Không" ? `· ${u.chucVu}` : ""}</div>\r\n              <div className="text-[11px] text-[#94a3b8] truncate">{u.donVi}</div>'
c = c.replace(old_jsx_rn, new_jsx_rn)

with open('app/ToThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
