import re

with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\app\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update states
content = content.replace(
    'const [saved, setSaved] = useState(false);\n  const [laySo, setLaySo] = useState(false);',
    'const [status, setStatus] = useState<"tao_van_ban" | "lay_so" | "trinh_duyet" | "duyet" | "trinh_ky" | "da_ky">("tao_van_ban");'
)

# 2. Update SelectField definition
select_field_find = 'const SelectField = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) => (\n    <div className="flex-1">\n      <label className="block text-[12px] font-medium text-[#333] mb-1">{label}</label>\n      <div className="relative">\n        <select value={value} onChange={e => onChange(e.target.value)}\n          className="w-full h-[32px] px-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">'
select_field_replace = 'const SelectField = ({ label, value, onChange, placeholder, disabled }: { label: string; value: string; onChange: (v: string) => void; placeholder: string, disabled?: boolean }) => (\n    <div className="flex-1">\n      <label className="block text-[12px] font-medium text-[#333] mb-1">{label}</label>\n      <div className="relative">\n        <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}\n          className={w-full h-[32px] px-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8] }>'
content = content.replace(select_field_find, select_field_replace)

# 3. Update field usage
fields_find = '''            <SelectField label="Loại văn bản" value={loai} onChange={setLoai} placeholder="Chọn loại văn bản" />
            <SelectField label="Người duyệt" value={nguoiDuyet} onChange={setNguoiDuyet} placeholder="Chọn người duyệt" />
            <SelectField label="Người ký" value={nguoiKy} onChange={setNguoiKy} placeholder="Chọn người ký" />
            {loai === "Tờ trình" && (
              <div className="flex-1">
                <label className="block text-[12px] font-medium text-[#333] mb-1">Số tờ trình</label>
                <input type="text" value={soToTrinh} onChange={e => setSoToTrinh(e.target.value)} 
                  className="w-full h-[32px] px-2 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]" 
                  placeholder="Nhập số tờ trình..." />
              </div>
            )}'''
fields_replace = '''            <SelectField label="Loại văn bản" value={loai} onChange={setLoai} placeholder="Chọn loại văn bản" disabled={status === "da_ky"} />
            <SelectField label="Người duyệt" value={nguoiDuyet} onChange={setNguoiDuyet} placeholder="Chọn người duyệt" disabled={status === "da_ky"} />
            <SelectField label="Người ký" value={nguoiKy} onChange={setNguoiKy} placeholder="Chọn người ký" disabled={status === "da_ky"} />
            {loai === "Tờ trình" && (
              <div className="flex-1">
                <label className="block text-[12px] font-medium text-[#333] mb-1">Số tờ trình</label>
                <input type="text" value={soToTrinh} onChange={e => setSoToTrinh(e.target.value)} disabled={status === "da_ky"}
                  className={w-full h-[32px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] } 
                  placeholder="Nhập số tờ trình..." />
              </div>
            )}'''
content = content.replace(fields_find, fields_replace)

# 4. Update header action buttons
buttons_find = '''                {saved && !laySo && (
                  <button onClick={() => setLaySo(true)}
                    className="flex items-center gap-1.5 h-[28px] px-3 bg-[#27ae60] hover:bg-[#1e8449] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <ArrowDownToLine size={12} /> Lấy số
                  </button>
                )}
                {laySo && (
                  <button className="flex items-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <Send size={12} /> Trình ký
                  </button>
                )}
                {!saved && (
                  <button onClick={() => setSaved(true)}
                    className="flex items-center gap-1.5 h-[28px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <Save size={12} /> Lưu số văn bản
                  </button>
                )}'''
buttons_replace = '''                {status === "tao_van_ban" && (
                  <button onClick={() => setStatus("lay_so")} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <Save size={12} /> Tạo văn bản
                  </button>
                )}
                {status === "lay_so" && (
                  <button onClick={() => setStatus("trinh_duyet")} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#27ae60] hover:bg-[#1e8449] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <ArrowDownToLine size={12} /> Lấy số
                  </button>
                )}
                {status === "trinh_duyet" && (
                  <button onClick={() => setStatus("duyet")} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <Send size={12} /> Trình duyệt
                  </button>
                )}
                {status === "duyet" && (
                  <button onClick={() => setStatus("trinh_ky")} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <Check size={12} /> Duyệt
                  </button>
                )}
                {status === "trinh_ky" && (
                  <button onClick={() => setStatus("da_ky")} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <PenLine size={12} /> Trình ký
                  </button>
                )}
                {status === "da_ky" && (
                  <div className="flex items-center gap-1.5 h-[28px] px-3 border border-[#27ae60] text-[#27ae60] rounded-[3px] text-[11px] font-bold">
                    <Check size={12} /> Đã ký
                  </div>
                )}'''
content = content.replace(buttons_find, buttons_replace)

# 5. Update laySo reference
content = content.replace(') : laySo ? (', ') : status !== "tao_van_ban" && status !== "lay_so" ? (')

# 6. Update footer buttons check
content = content.replace('{saved ? (', '{status !== "tao_van_ban" ? (')

with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\app\App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
