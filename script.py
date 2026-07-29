import re

with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\app\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'FilePlus' not in content:
    content = content.replace('from "lucide-react";', 'FilePlus,\n} from "lucide-react";')

popup_component = """
const PopupBoSungTaiLieu = ({ onClose, donId }: { onClose: () => void, donId: number }) => {
  const row = SAMPLE_ROWS.find(r => r.id === donId);
  const [isOpenHistory, setIsOpenHistory] = useState(true);
  const [ketQua, setKetQua] = useState('chua_du');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[6px] shadow-xl w-[900px] max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#eee]">
          <h2 className="text-[16px] font-bold text-[#333]">Bổ sung tài liệu</h2>
          <button onClick={onClose} className="text-[#888] hover:text-[#333]">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#333] mb-1"><span className="text-red-500">*</span> Ngày bổ sung</label>
              <input type="date" className="w-full h-[32px] px-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#333] mb-1">Số hiệu</label>
              <input type="text" placeholder="nhập dữ liệu" className="w-full h-[32px] px-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-1"><span className="text-red-500">*</span> Bổ sung cho yêu cầu nào</label>
            <div className="relative">
              <select className="w-full h-[32px] px-2 pr-8 text-[13px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8]">
                <option value="">Chọn yêu cầu bổ sung</option>
                <option value="1">Bổ sung bản án</option>
                <option value="2">Bổ sung xác nhận</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-2"><span className="text-red-500">*</span> Kết quả</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input type="radio" name="ketqua" checked={ketQua === 'du'} onChange={() => setKetQua('du')} className="w-3.5 h-3.5 text-[#d81b60] focus:ring-[#d81b60]" />
                Đơn đủ điều kiện
              </label>
              <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input type="radio" name="ketqua" checked={ketQua === 'chua_du'} onChange={() => setKetQua('chua_du')} className="w-3.5 h-3.5 text-[#d81b60] focus:ring-[#d81b60]" />
                Đơn chưa đủ điều kiện
              </label>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-2">Lý do</label>
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded-sm border-[#ccc]" /> Bản án, quyết định
              </label>
              <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded-sm border-[#ccc]" /> Xác nhận
              </label>
              <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded-sm border-[#ccc]" /> Viết lại đơn
              </label>
              <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded-sm border-[#ccc]" /> Lý do khác
              </label>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-1">Ghi chú</label>
            <textarea rows={3} placeholder="nhập dữ liệu" className="w-full px-2 py-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] resize-none" />
          </div>
          
          <div className="flex justify-end gap-2 pt-2 pb-2">
            <button onClick={onClose} className="h-[30px] px-4 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-[3px] text-[12px] font-medium transition-colors">Lưu</button>
            <button className="h-[30px] px-4 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-[3px] text-[12px] font-medium transition-colors">Làm mới</button>
            <button onClick={onClose} className="h-[30px] px-4 border border-[#ccc] bg-white text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">Đóng</button>
          </div>

          <div className="pt-2 border-t border-[#eee]">
            <button onClick={() => setIsOpenHistory(!isOpenHistory)} className="flex items-center gap-1 text-[13px] font-bold text-[#333] mb-2 hover:bg-[#f5f5f5] py-1 px-1 -ml-1 rounded">
              {isOpenHistory ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Quá trình bổ sung tài liệu
            </button>
            {isOpenHistory && (
              <div className="bg-[#f9f9f9] border border-[#eee] rounded-[4px] p-2">
                <table className="w-full text-left text-[11px] mb-6">
                  <thead className="bg-[#f0f0f0] text-[#333] font-medium">
                    <tr>
                      <th className="py-2 px-2 border border-[#eee]">STT</th>
                      <th className="py-2 px-2 border border-[#eee]">Số thụ lý</th>
                      <th className="py-2 px-2 border border-[#eee]">Ngày thụ lý</th>
                      <th className="py-2 px-2 border border-[#eee]">Số hiệu</th>
                      <th className="py-2 px-2 border border-[#eee]">Ngày bổ sung</th>
                      <th className="py-2 px-2 border border-[#eee]">Kết quả</th>
                      <th className="py-2 px-2 border border-[#eee] text-center max-w-[50px]">Thiếu bản án</th>
                      <th className="py-2 px-2 border border-[#eee] text-center max-w-[50px]">Thiếu xác nhận</th>
                      <th className="py-2 px-2 border border-[#eee]">Viết lại đơn</th>
                      <th className="py-2 px-2 border border-[#eee]">Lý do khác</th>
                      <th className="py-2 px-2 border border-[#eee]">Chi tiết lý do khác</th>
                      <th className="py-2 px-2 border border-[#eee]">Ghi chú</th>
                      <th className="py-2 px-2 border border-[#eee]">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty state */}
                    <tr>
                      <td colSpan={13} className="py-8 text-center bg-white border border-[#eee]">
                        <div className="flex flex-col items-center text-[#999]">
                          <Archive size={24} className="mb-1 opacity-50" />
                          <span>Trống</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
"""
content = content.replace('const PopupGhepDon = ({', popup_component + '\n\nconst PopupGhepDon = ({')

action_menu_find = 'const ActionMenu = ({ onClose, onGhepDon, onViewDetail, onEdit }: { onClose: () => void; onGhepDon?: () => void; onViewDetail?: () => void; onEdit?: () => void }) => {'
action_menu_replace = 'const ActionMenu = ({ onClose, onGhepDon, onViewDetail, onEdit, onBoSung }: { onClose: () => void; onGhepDon?: () => void; onViewDetail?: () => void; onEdit?: () => void; onBoSung?: () => void }) => {'
content = content.replace(action_menu_find, action_menu_replace)

items_find = '    { icon: <GitMerge size={13} />, label: "Ghép đơn", action: "ghep" },'
items_replace = '    { icon: <GitMerge size={13} />, label: "Ghép đơn", action: "ghep" },\n    { icon: <FilePlus size={13} />, label: "Bổ sung tài liệu", action: "bosung" },'
content = content.replace(items_find, items_replace)

onclick_find = '          if (item.action === "ghep") { onGhepDon?.(); }'
onclick_replace = '          if (item.action === "ghep") { onGhepDon?.(); }\n          if (item.action === "bosung") { onBoSung?.(); }'
content = content.replace(onclick_find, onclick_replace)

state_find = 'const [showHuyGhep, setShowHuyGhep] = useState<number | null>(null);'
state_replace = 'const [showHuyGhep, setShowHuyGhep] = useState<number | null>(null);\n  const [showBoSungTaiLieu, setShowBoSungTaiLieu] = useState<number | null>(null);'
content = content.replace(state_find, state_replace)

action_render_find = '''                            <ActionMenu
                              onClose={() => setOpenMenu(null)}
                              onViewDetail={() => onEditRow?.(row.id)}
                              onEdit={() => onEditRow?.(row.id)}
                              onGhepDon={() => { setGhepDonChinh(row.id); setShowGhepDon(row.id); setOpenMenu(null); }}
                            />'''
action_render_replace = '''                            <ActionMenu
                              onClose={() => setOpenMenu(null)}
                              onViewDetail={() => onEditRow?.(row.id)}
                              onEdit={() => onEditRow?.(row.id)}
                              onGhepDon={() => { setGhepDonChinh(row.id); setShowGhepDon(row.id); setOpenMenu(null); }}
                              onBoSung={() => { setShowBoSungTaiLieu(row.id); setOpenMenu(null); }}
                            />'''
content = content.replace(action_render_find, action_render_replace)

render_popup_find = '{/* Popup Ghép đơn */}'
render_popup_replace = '''{/* Popup Bổ sung tài liệu */}
      {showBoSungTaiLieu !== null && (
        <PopupBoSungTaiLieu donId={showBoSungTaiLieu} onClose={() => setShowBoSungTaiLieu(null)} />
      )}

      {/* Popup Ghép đơn */}'''
content = content.replace(render_popup_find, render_popup_replace)

with open(r'c:\Users\Gtel-Ict\Desktop\demo-hctp-main\app\App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
