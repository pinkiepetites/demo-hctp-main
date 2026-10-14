import re

with open('app/components/CauHinhUyBanThamPhan.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add `message` to antd imports
c = c.replace('  Modal, Popconfirm, Select, Table, Tabs, Tag, Tooltip, Typography,\n}', '  Modal, Popconfirm, Select, Table, Tabs, Tag, Tooltip, Typography, message,\n}')
c = c.replace('  Modal, Popconfirm, Select, Table, Tabs, Tag, Tooltip, Typography,\r\n}', '  Modal, Popconfirm, Select, Table, Tabs, Tag, Tooltip, Typography, message,\r\n}')

# Add `Save` to lucide-react imports
c = c.replace('  Clock, Eye, Pencil, Plus, Search, Send, Trash2, TriangleAlert, Info,\n}', '  Clock, Eye, Pencil, Plus, Search, Send, Trash2, TriangleAlert, Info, Save,\n}')
c = c.replace('  Clock, Eye, Pencil, Plus, Search, Send, Trash2, TriangleAlert, Info,\r\n}', '  Clock, Eye, Pencil, Plus, Search, Send, Trash2, TriangleAlert, Info, Save,\r\n}')

# Add Lưu nháp button
old_buttons = """          <Popconfirm title="Hủy bản nháp kỳ mới?" okText="Hủy nháp" cancelText="Không"
            onConfirm={() => capNhat(u => ({ ...u, nhap: null }))}>
            <Button danger>Hủy nháp</Button>
          </Popconfirm>
          <Button type="primary" icon={<Send size={14} />} disabled={!lapDeNghiDuoc} onClick={lapDeNghi}>
            Lập đề nghị
          </Button>"""

new_buttons = """          <Button icon={<Save size={14} />} onClick={() => message.success("Đã lưu bản nháp!")}>
            Lưu nháp
          </Button>
          <Popconfirm title="Hủy bản nháp kỳ mới?" okText="Hủy nháp" cancelText="Không"
            onConfirm={() => capNhat(u => ({ ...u, nhap: null }))}>
            <Button danger>Hủy nháp</Button>
          </Popconfirm>
          <Button type="primary" icon={<Send size={14} />} disabled={!lapDeNghiDuoc} onClick={lapDeNghi}>
            Lập đề nghị
          </Button>"""

c = c.replace(old_buttons, new_buttons)
c = c.replace(old_buttons.replace('\n', '\r\n'), new_buttons.replace('\n', '\r\n'))

with open('app/components/CauHinhUyBanThamPhan.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
