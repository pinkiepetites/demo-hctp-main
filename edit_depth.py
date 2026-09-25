import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add headStyle and stronger shadows to cards
# 1. Thông tin kỳ
c = c.replace('title="Thông tin kỳ hiệu lực"', 'title="Thông tin kỳ hiệu lực" headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }}')

# 2. Thành viên đương nhiên
c = c.replace('title={<>Thành viên đương nhiên', 'headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }} title={<>Thành viên đương nhiên')

# 3. Thẩm phán chỉ định
c = c.replace('title="Thẩm phán được chỉ định"', 'title="Thẩm phán được chỉ định" headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }}')

# 4. Tab Lịch sử - Bộ lọc
c = c.replace('<Card size="small">\n        <div style={{ display: "flex", alignItems: "flex-end"', '<Card size="small" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>\n        <div style={{ display: "flex", alignItems: "flex-end"')
c = c.replace('<Card size="small">\r\n        <div style={{ display: "flex", alignItems: "flex-end"', '<Card size="small" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>\r\n        <div style={{ display: "flex", alignItems: "flex-end"')

# 5. Tab Lịch sử - Các kỳ hiệu lực
c = c.replace('title={<>Các kỳ hiệu lực của Ủy ban Thẩm phán', 'headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }} title={<>Các kỳ hiệu lực của Ủy ban Thẩm phán')

# 6. Main screen - BangTongHop
c = c.replace('title={<>Ủy ban Thẩm phán các tỉnh/thành', 'headStyle={{ background: "#f8fafc", padding: "0 16px" }} style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderRadius: 8 }} title={<>Ủy ban Thẩm phán các tỉnh/thành')

# 7. Main screen - Tìm tòa án (Bộ lọc)
c = c.replace('<Card size="small">\n        <div style={{ display: "flex", alignItems: "flex-end"', '<Card size="small" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>\n        <div style={{ display: "flex", alignItems: "flex-end"')
c = c.replace('<Card size="small">\r\n        <div style={{ display: "flex", alignItems: "flex-end"', '<Card size="small" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>\r\n        <div style={{ display: "flex", alignItems: "flex-end"')

# Clean up any duplicated styles if they already existed (some did)
c = c.replace('style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }} headStyle', 'headStyle')
c = c.replace('style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }} styles', 'styles')

# Tab bar styles
# Add a divider under the tabs to separate from content
c = c.replace('<Tabs activeKey={tab} onChange={setTab}', '<Tabs activeKey={tab} onChange={setTab} tabBarStyle={{ borderBottom: "2px solid #f0f0f0", marginBottom: 20 }}')

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
