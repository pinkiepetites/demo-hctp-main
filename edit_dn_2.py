import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('${u.kyHienHanh.duongNhien.length} đương nhiên + ${u.kyHienHanh.chiDinh.length} chỉ định', '${u.kyHienHanh.duongNhien.length} thành viên đương nhiên + ${u.kyHienHanh.chiDinh.length} chỉ định')

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
