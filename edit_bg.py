import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<div className="flex-1 overflow-y-auto" style={{ background: "#f4f6f8" }}>', '<div className="flex-1 overflow-y-auto" style={{ background: "#ffffff" }}>')

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
