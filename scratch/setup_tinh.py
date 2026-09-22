import shutil
import os

os.makedirs('app/tinh/components', exist_ok=True)

files = [
    ('app/App.tsx', 'app/tinh/AppTinh.tsx'),
    ('app/Dashboard.tsx', 'app/tinh/Dashboard.tsx'),
    ('app/ChiSoTrangChu.tsx', 'app/tinh/ChiSoTrangChu.tsx'),
    ('app/TrangChuTruongPhong.tsx', 'app/tinh/TrangChuTruongPhong.tsx'),
    ('app/TiepNhanDon.tsx', 'app/tinh/TiepNhanDon.tsx'),
    ('app/ToThamPhan.tsx', 'app/tinh/ToThamPhan.tsx'),
    ('app/HieuSuatCanBoChiTiet.tsx', 'app/tinh/HieuSuatCanBoChiTiet.tsx'),
    ('app/components/DocumentNumberingModal.tsx', 'app/tinh/components/DocumentNumberingModal.tsx'),
    ('app/components/QuanLyVanBan.tsx', 'app/tinh/components/QuanLyVanBan.tsx'),
    ('app/components/TiepNhanDonLienThong.tsx', 'app/tinh/components/TiepNhanDonLienThong.tsx'),
]

for src, dst in files:
    shutil.copy2(src, dst)
    print(f'Copied {src} -> {dst}')

# Fix imports in app/tinh/AppTinh.tsx:
with open('app/tinh/AppTinh.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# in app/App.tsx: import ... from "./gdt/..." -> in app/tinh/AppTinh.tsx it should be from "../gdt/..."
text = text.replace('from "./gdt/', 'from "../gdt/')
text = text.replace("from './gdt/", "from '../gdt/")

with open('app/tinh/AppTinh.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# Fix imports in app/tinh/components/TiepNhanDonLienThong.tsx:
with open('app/tinh/components/TiepNhanDonLienThong.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('from "./ui/', 'from "../../components/ui/')
text = text.replace("from './ui/", "from '../../components/ui/")

# Also fix the duplicate key warning we found earlier:
# In TRANG_THAI_META: duplicate "cho-phan-loai"
# Let's fix that too
text = text.replace('"cho-phan-loai":  { label: "Đã phân công"', '"da-phan-cong":   { label: "Đã phân công"')
text = text.replace('"cho-phan-loai":     { label: "Chờ xử lý"', '"cho-xu-ly":      { label: "Chờ xử lý"')

with open('app/tinh/components/TiepNhanDonLienThong.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated app/tinh imports successfully.')
