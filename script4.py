import re

with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\app\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add PopupYeuCauBoSung
popup_yeucau = """
const PopupYeuCauBoSung = ({ onClose, donId }: { onClose: () => void, donId: number }) => {
  const row = SAMPLE_ROWS.find(r => r.id === donId);
  const [status, setStatus] = useState<"tao" | "in" | "ky" | "gui" | "da_gui">("tao");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[4px] shadow-xl w-[700px] flex flex-col border border-[#bbb]">
        <div className="flex items-center justify-between bg-[#1d2e4f] px-4 py-[10px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white">
            <FileText size={15} />
            <span className="text-[14px] font-semibold">Tạo Yêu cầu bổ sung</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={17} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#333] mb-1">Mã đơn</label>
              <input type="text" value={row?.maDon} disabled className="w-full h-[32px] px-2 text-[12px] border border-[#ccc] rounded-[3px] bg-gray-100 text-[#555]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#333] mb-1">Người gửi</label>
              <input type="text" value={row?.nguoiGui} disabled className="w-full h-[32px] px-2 text-[12px] border border-[#ccc] rounded-[3px] bg-gray-100 text-[#555]" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-1">Nội dung yêu cầu bổ sung</label>
            <textarea rows={4} placeholder="Nhập nội dung cần bổ sung..." disabled={status !== "tao"} 
              className={w-full px-2 py-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] resize-none } />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-1">Lãnh đạo ký</label>
            <div className="relative">
              <select disabled={status !== "tao" && status !== "in"}
                className={w-full h-[32px] px-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8] }>
                <option value="">Chọn lãnh đạo ký</option>
                <option value="1">Lãnh đạo A</option>
                <option value="2">Lãnh đạo B</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#eee] bg-[#f9f9f9] rounded-b-[4px]">
          <div className="flex items-center gap-2">
            {status === "tao" && (
              <button onClick={() => setStatus("in")} className="flex items-center gap-1.5 h-[30px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <Save size={13} /> Tạo yêu cầu
              </button>
            )}
            {status === "in" && (
              <button onClick={() => setStatus("ky")} className="flex items-center gap-1.5 h-[30px] px-3 bg-[#2980b9] hover:bg-[#1a6a9a] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <Printer size={13} /> In biểu mẫu
              </button>
            )}
            {status === "ky" && (
              <button onClick={() => setStatus("gui")} className="flex items-center gap-1.5 h-[30px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <PenLine size={13} /> Lãnh đạo ký
              </button>
            )}
            {status === "gui" && (
              <button onClick={() => { triggerNoti("Đã gửi yêu cầu bổ sung cho đương sự."); setStatus("da_gui"); }} className="flex items-center gap-1.5 h-[30px] px-3 bg-[#27ae60] hover:bg-[#1e8449] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <Send size={13} /> Gửi cho đương sự
              </button>
            )}
            {status === "da_gui" && (
              <div className="flex items-center gap-1.5 h-[30px] px-3 border border-[#27ae60] text-[#27ae60] rounded-[3px] text-[12px] font-bold">
                <Check size={13} /> Đã gửi đương sự
              </div>
            )}
          </div>
          <button onClick={onClose} className="h-[30px] px-4 border border-[#ccc] bg-white text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
"""
content = content.replace('const PopupBoSungTaiLieu = ({', popup_yeucau + '\n\nconst PopupBoSungTaiLieu = ({')


# 2. Add FilePlus to lucide-react imports if it's missing (it shouldn't be, but just in case)
# And add FileSignature or similar if needed. We have PenLine, FileText.

# 3. Update ActionMenu props and UI
action_menu_find = 'const ActionMenu = ({ onClose, onGhepDon, onViewDetail, onEdit, onBoSung }: { onClose: () => void; onGhepDon?: () => void; onViewDetail?: () => void; onEdit?: () => void; onBoSung?: () => void }) => {'
action_menu_replace = 'const ActionMenu = ({ onClose, onGhepDon, onViewDetail, onEdit, onBoSung, onTaoYeuCau }: { onClose: () => void; onGhepDon?: () => void; onViewDetail?: () => void; onEdit?: () => void; onBoSung?: () => void; onTaoYeuCau?: () => void; }) => {'
content = content.replace(action_menu_find, action_menu_replace)

items_find = '    { icon: <FilePlus size={13} />, label: "Bổ sung tài liệu", action: "bosung" },'
items_replace = '    { icon: <FileText size={13} />, label: "Tạo Yêu cầu bổ sung", action: "taoyeucau" },\n    { icon: <FilePlus size={13} />, label: "Cập nhật Bổ sung tài liệu", action: "bosung" },'
content = content.replace(items_find, items_replace)

onclick_find = '          if (item.action === "bosung") { onBoSung?.(); }'
onclick_replace = '          if (item.action === "bosung") { onBoSung?.(); }\n          if (item.action === "taoyeucau") { onTaoYeuCau?.(); }'
content = content.replace(onclick_find, onclick_replace)

# 4. Add state for showYeuCauBoSung
state_find = 'const [showBoSungTaiLieu, setShowBoSungTaiLieu] = useState<number | null>(null);'
state_replace = 'const [showBoSungTaiLieu, setShowBoSungTaiLieu] = useState<number | null>(null);\n  const [showYeuCauBoSung, setShowYeuCauBoSung] = useState<number | null>(null);'
content = content.replace(state_find, state_replace)

# 5. Render ActionMenu
action_render_find = '''                              onBoSung={() => { setShowBoSungTaiLieu(row.id); setOpenMenu(null); }}
                            />'''
action_render_replace = '''                              onBoSung={() => { setShowBoSungTaiLieu(row.id); setOpenMenu(null); }}
                              onTaoYeuCau={() => { setShowYeuCauBoSung(row.id); setOpenMenu(null); }}
                            />'''
content = content.replace(action_render_find, action_render_replace)

# 6. Render PopupYeuCauBoSung
render_popup_find = '{/* Popup Bổ sung tài liệu */}'
render_popup_replace = '''{/* Popup Yêu cầu bổ sung */}
      {showYeuCauBoSung !== null && (
        <PopupYeuCauBoSung donId={showYeuCauBoSung} onClose={() => setShowYeuCauBoSung(null)} />
      )}

      {/* Popup Bổ sung tài liệu */}'''
content = content.replace(render_popup_find, render_popup_replace)

with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\app\App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
