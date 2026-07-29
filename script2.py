import re

with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\app\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update DanhSachDonRow
if 'toTrinhStatus?: "none" | "trinh_lanh_dao" | "da_ky";' not in content:
    content = content.replace("daNhan?: boolean;", "daNhan?: boolean;\n  toTrinhStatus?: \"none\" | \"trinh_lanh_dao\" | \"da_ky\";")

# 2. Update SAMPLE_ROWS to have toTrinhStatus
if 'toTrinhStatus: "trinh_lanh_dao"' not in content:
    content = content.replace(
        'loaiHinhThuc: "Cng van ki?n ngh?",', 
        'loaiHinhThuc: "Cng van ki?n ngh?",\n    toTrinhStatus: "trinh_lanh_dao",'
    )
    # The encoding issue is because reading python with utf-8 might not match the byte sequence if powershell output gave weird chars.
