import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }} title="Thông tin kỳ hiệu lực" headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }}', 'title="Thông tin kỳ hiệu lực" headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }}')

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
