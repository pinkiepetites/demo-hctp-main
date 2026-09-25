import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update Select label
c = c.replace('options={[{ value: "dn", label: "Đương nhiên" }', 'options={[{ value: "dn", label: "Thành viên đương nhiên" }')

# 2. Update Tag
c = c.replace('<Tag color="blue">Đương nhiên</Tag>', '<Tag color="blue">Thành viên đương nhiên</Tag>')

# 3. Update Text in TabLichSu
c = c.replace('${k.duongNhien.length} đương nhiên + ${k.chiDinh.length} chỉ định', '${k.duongNhien.length} thành viên đương nhiên + ${k.chiDinh.length} chỉ định')

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
