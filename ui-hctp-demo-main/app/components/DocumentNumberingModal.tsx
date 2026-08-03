import React, { useState, useRef, useEffect } from "react";
import { 
  X, ChevronDown, ChevronRight, AlertTriangle, MoreVertical, 
  Check, Info, FileText, Save, Send, Printer, User, Edit, Trash2,
  ZoomIn, ZoomOut, RotateCcw, Download
} from "lucide-react";

// --- Types ---
export interface DocNode {
  id: string;
  name: string;
  type: string;
  date: string;
  children?: DocNode[];
  isValid?: boolean;
  invalidReason?: string;
  isExpanded?: boolean;
  originalData?: any;
}

interface DocumentNumberingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string; // "can-bo" or "truong-phong" or others
  selectedRows: any[];
}

// --- Mock Data ---
const DOC_TYPES = [
  "Giấy xác nhận", 
  "Giấy xác nhận cơ quan chuyển đơn", 
  "Công văn chuyển nội bộ", 
  "Công văn chuyển tòa khác", 
  "Công văn chuyển ngoài", 
  "Trả lại đơn", 
  "Tờ trình phân công thẩm phán", 
  "Tờ trình xét xử GĐT", 
  "Tờ trình thụ lý lại", 
  "Tờ trình đơn trùng", 
  "Thông báo phân công TP", 
  "Yêu cầu bổ sung"
];

const INITIAL_TREE_DATA: DocNode[] = [
  {
    id: "doc-1",
    name: "Tờ trình phân công thẩm phán",
    type: "Tờ trình",
    date: "30/07/2026",
    isExpanded: true,
    children: [
      {
        id: "doc-1-1",
        name: "Đơn đề nghị GĐT/TT (7031)",
        type: "Đơn",
        date: "29/07/2026",
      },
      {
        id: "doc-1-2",
        name: "Danh sách đơn (Phụ lục)",
        type: "Danh sách",
        date: "30/07/2026",
      }
    ]
  }
];

// --- Validation Service ---
const validateTree = (nodes: DocNode[], selectedType: string): DocNode[] => {
  return nodes.map(node => {
    let isValid = true;
    let invalidReason = "";

    if (node.originalData && selectedType) {
      const data = node.originalData;
      const tq = data.giaiQuyet?.nhan || "";
      const tc = data.thongTinChuyenDon || "";
      const isPhanCong = data.isPhanCong;
      const toTrinhStatus = data.toTrinhStatus || "none";

      if (selectedType === "Giấy xác nhận") {
        if (tc !== "Nội bộ") { isValid = false; invalidReason = "Thông tin chuyển đơn phải là Nội bộ"; }
      } else if (selectedType === "Giấy xác nhận cơ quan chuyển đơn") {
        if (tc !== "Tòa khác") { isValid = false; invalidReason = "Thông tin chuyển đơn phải là Tòa khác"; }
      } else if (selectedType === "Công văn chuyển nội bộ") {
        if (tc !== "Nội bộ" || !["Thụ lý mới", "Thụ lý mới trùng TP", "Thụ lý xét xử", "Đã thụ lý", "Thụ lý mới trong thẩm phán", "Thụ lý mới trùng thẩm phán"].includes(tq)) {
          isValid = false; invalidReason = "TT Chuyển đơn là Nội bộ & TT Giải quyết phải thuộc nhóm Thụ lý mới/xét xử/Đã thụ lý";
        }
      } else if (selectedType === "Công văn chuyển tòa khác") {
        if (tq !== "Chuyển đơn" || tc !== "Tòa khác") { isValid = false; invalidReason = "TT Giải quyết: Chuyển đơn & TT Chuyển đơn: Tòa khác"; }
      } else if (selectedType === "Công văn chuyển ngoài") {
        if (tq !== "Chuyển đơn" || tc !== "Ngoài tòa án") { isValid = false; invalidReason = "TT Giải quyết: Chuyển đơn & TT Chuyển đơn: Ngoài tòa án"; }
      } else if (selectedType === "Trả lại đơn") {
        if (tq !== "Trả lại đơn") { isValid = false; invalidReason = "TT Giải quyết phải là Trả lại đơn"; }
      } else if (selectedType === "Tờ trình phân công thẩm phán" || selectedType === "Tờ trình") {
        if (!tq.includes("Thụ lý mới") || !isPhanCong) { isValid = false; invalidReason = "TT Giải quyết: Thụ lý mới & Đã phân công"; }
      } else if (selectedType === "Tờ trình xét xử GĐT") {
        if (tc !== "Nội bộ" || !isPhanCong || tq !== "Thụ lý xét xử") { isValid = false; invalidReason = "Nội bộ, Đã phân công & Thụ lý xét xử"; }
      } else if (selectedType === "Thông báo phân công TP") {
        if (!["Thụ lý mới", "Thụ lý mới trùng TP", "Thụ lý xét xử", "Thụ lý mới trong thẩm phán", "Thụ lý mới trùng thẩm phán"].includes(tq) || toTrinhStatus === "none") {
          isValid = false; invalidReason = "Trạng thái thụ lý & Đã tạo tờ trình";
        }
      } else if (selectedType === "Tờ trình thụ lý lại") {
        if (!tq.includes("Thụ lý mới trùng")) { isValid = false; invalidReason = "TT Giải quyết: Thụ lý mới trùng thẩm phán"; }
      } else if (selectedType === "Tờ trình đơn trùng") {
        if (tq !== "Đã thụ lý") { isValid = false; invalidReason = "TT Giải quyết: Đã thụ lý"; }
      } else if (selectedType === "Yêu cầu bổ sung") {
        if (tq !== "Đơn chưa đủ điều kiện") { isValid = false; invalidReason = "TT Giải quyết: Đơn chưa đủ điều kiện"; }
      }
    }

    const updatedNode = { ...node, isValid, invalidReason };
    if (node.children) {
      updatedNode.children = validateTree(node.children, selectedType);
      
      if (updatedNode.children.some(c => c.isValid === false)) {
        updatedNode.isValid = false;
        if (!updatedNode.invalidReason) {
            updatedNode.invalidReason = "Có tài liệu đính kèm không hợp lệ.";
        }
      }
    }
    return updatedNode;
  });
};

// --- Sub-components ---

const ActionMenu = ({ onClose }: { onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 z-50 w-36 bg-white border border-[#ddd] shadow-lg py-1 rounded-[4px] text-[#333]">
      <button onClick={onClose} className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#f5f5f5] flex items-center gap-2">
        <Edit size={14} className="text-[#666]"/> Sửa
      </button>
      <button onClick={onClose} className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#f5f5f5] flex items-center gap-2">
        <FileText size={14} className="text-[#666]"/> Chi tiết
      </button>
      <div className="h-px bg-[#eee] my-1" />
      <button onClick={onClose} className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#fdeaea] text-[#c0392b] flex items-center gap-2">
        <Trash2 size={14} /> Xóa
      </button>
    </div>
  );
};

const DocumentTreeRow = ({ 
  node, 
  level = 0, 
  onToggleExpand,
  selectedNodeId,
  onSelectNode
}: { 
  node: DocNode; 
  level?: number; 
  onToggleExpand: (id: string) => void;
  selectedNodeId?: string;
  onSelectNode: (node: DocNode) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isInvalid = node.isValid === false;
  const isLeafDon = node.type === "Đơn" && !hasChildren && node.originalData;
  const d = node.originalData;
  const isSelected = selectedNodeId === node.id;

  return (
    <>
      <div className={`flex items-start group border-b border-[#eee] transition-colors cursor-pointer
        ${isSelected ? 'bg-[#e8f4ff] border-l-4 border-l-[#1a5a96]' : ''}
        ${isInvalid ? 'bg-[#fef2f2] hover:bg-[#fee2e2]' : 'bg-white hover:bg-[#f9f9f9]'}`}
        onClick={() => onSelectNode(node)}
      >
        <div 
          className="flex-1 py-2.5 px-4 flex items-start"
          style={{ paddingLeft: `${16 + level * 24}px` }}
        >
          {hasChildren ? (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleExpand(node.id); }}
              className="w-5 h-5 flex items-center justify-center mr-1 mt-0.5 text-[#666] hover:bg-[#eee] rounded flex-shrink-0"
            >
              {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-5 mr-1 flex-shrink-0" />
          )}
          
          <FileText size={15} className={`mr-2 mt-0.5 flex-shrink-0 ${isInvalid ? 'text-[#e74c3c]' : level >= 2 ? 'text-[#2980b9]' : 'text-[#8b1a1a]'}`} />

          <div>
            <div className={`text-[13px] font-medium ${isInvalid ? 'text-[#c0392b]' : 'text-[#333]'}`}>
              {node.name}
            </div>
            {!isLeafDon && (
              <div className="text-[11px] text-[#888] mt-0.5">
                Loại: {node.type} • Ngày: {node.date}
              </div>
            )}
          </div>
        </div>

        <div className="w-36 px-3 flex items-center justify-center py-2.5 flex-shrink-0">
          {isInvalid && (
            <div className="flex items-center gap-1.5 text-[#e74c3c] bg-white px-2 py-1 rounded border border-[#fadbd8] text-[12px] group relative cursor-help">
              <AlertTriangle size={14} />
              <span className="font-medium">Không hợp lệ</span>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-1 w-52 p-2 bg-[#333] text-white text-[11px] rounded shadow-lg z-10 whitespace-normal">
                {node.invalidReason}
              </div>
            </div>
          )}
          {node.isValid && (
            <div className="flex items-center gap-1.5 text-[#27ae60] text-[12px]">
              <Check size={14} />
              <span>Hợp lệ</span>
            </div>
          )}
        </div>

        <div className="w-12 px-3 flex justify-end relative py-2.5 flex-shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#e0e0e0] text-[#555] transition-colors"
          >
            <MoreVertical size={15} />
          </button>
          {showMenu && <ActionMenu onClose={() => setShowMenu(false)} />}
        </div>
      </div>
      
      {hasChildren && node.isExpanded && node.children!.map(child => (
        <DocumentTreeRow 
          key={child.id} 
          node={child} 
          level={level + 1} 
          onToggleExpand={onToggleExpand} 
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      ))}
    </>
  );
};


// --- Main Component ---
export default function DocumentNumberingModal({ isOpen, onClose, currentRole, selectedRows }: DocumentNumberingModalProps) {
  const [docType, setDocType] = useState("Tờ trình phân công thẩm phán");
  const [treeData, setTreeData] = useState<DocNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<DocNode | null>(null);
  const [approvalNote, setApprovalNote] = useState("");

  const [nguoiDuyet, setNguoiDuyet] = useState("");
  
  useEffect(() => {
    if (isOpen) {
      let initialNodes: DocNode[] = [];

      if (docType.includes("Tờ trình") && docType !== "Tờ trình đơn trùng") {
        const groups: Record<string, { dvgq: string; tp: string; rows: any[] }> = {};
        
        selectedRows.forEach(row => {
          const dvgq = row.thongTinDon?.donViGiaiQuyet || "Chưa xác định";
          const tp = row.thongTinDon?.thamPhan || "Chưa phân công";
          const key = `${dvgq}||${tp}`;
          
          if (!groups[key]) {
            groups[key] = { dvgq, tp, rows: [] };
          }
          groups[key].rows.push(row);
        });

        let idCounter = 1;
        Object.values(groups).forEach(({ dvgq, tp, rows }) => {
          const tqNode: DocNode = {
            id: `totrinh-${idCounter++}`,
            name: `${docType} - Thẩm phán: ${tp.split(' (')[0]} - Đơn vị: ${dvgq}`,
            type: docType,
            date: "30/07/2026",
            isExpanded: true,
            children: []
          };

          const listNode: DocNode = {
            id: `danhsach-${idCounter++}`,
            name: `Danh sách đơn (Phụ lục) - Thẩm phán: ${tp.split(' (')[0]} - Đơn vị: ${dvgq}`,
            type: "Danh sách",
            date: "30/07/2026",
            isExpanded: true,
            children: rows.map(r => ({
              id: `doc-${r.id}`,
              name: r.maDon || r.nguoiGui || `Đơn ${r.id}`,
              type: "Đơn",
              date: r.ngayNhap || "30/07/2026",
              isExpanded: false,
              originalData: r
            }))
          };

          tqNode.children!.push(listNode);
          initialNodes.push(tqNode);
        });
      } else {
        initialNodes = selectedRows.map(row => ({
          id: `doc-${row.id}`,
          name: row.maDon || row.nguoiGui || `Đơn ${row.id}`,
          type: "Đơn",
          date: row.ngayNhap || "30/07/2026",
          isExpanded: true,
          originalData: row,
          children: []
        }));
      }

      const validated = validateTree(initialNodes, docType);
      setTreeData(validated);
      if (validated.length > 0) {
        setSelectedNode(validated[0]);
      }
    }
  }, [docType, isOpen, selectedRows]);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    const toggleNode = (nodes: DocNode[]): DocNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };
    setTreeData(toggleNode(treeData));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-['Be_Vietnam_Pro',system-ui,sans-serif]">
      <div className="bg-[#f4f6f8] w-[95vw] max-w-[1300px] h-[90vh] max-h-[850px] rounded-[6px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-5 py-3 bg-[#1d2e4f] text-white flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-bold">Lưu số văn bản & In báo cáo</h2>
            {selectedRows && selectedRows.length > 0 && <p className="text-[12px] text-white/70 mt-0.5">Mã tài liệu gốc: {selectedRows.map(r => r.maDon).join(", ")}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>

        {docType.includes("Tờ trình") && (
          <div className="bg-[#1d2e4f]/5 border-b border-[#ddd] px-6 py-3 flex-shrink-0">
            <div className="flex items-center gap-0">
              {[
                { step: 1, label: "Tạo", done: true, active: true },
                { step: 2, label: "TP duyệt", done: currentRole === "truong-phong", active: currentRole !== "truong-phong" },
                { step: 3, label: "Cấp số & PCVP", done: false, active: false },
                { step: 4, label: "Ký số", done: false, active: false },
                { step: 5, label: "CA/PCA phê duyệt", done: false, active: false },
              ].map((s, i, arr) => (
                <React.Fragment key={s.step}>
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                      s.done ? "bg-[#27ae60] border-[#27ae60] text-white"
                      : s.active ? "bg-[#1d2e4f] border-[#1d2e4f] text-white"
                      : "bg-white border-[#ccc] text-[#bbb]"
                    }`}>
                      {s.done ? <Check size={13} /> : s.step}
                    </div>
                    <span className={`text-[10px] mt-1 text-center max-w-[64px] leading-tight ${
                      s.done ? "text-[#27ae60] font-semibold"
                      : s.active ? "text-[#1d2e4f] font-semibold"
                      : "text-[#aaa]"
                    }`}>{s.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-[2px] mb-4 ${
                      s.done ? "bg-[#27ae60]" : "bg-[#ddd]"
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border-b border-[#ddd] px-5 py-4 flex-shrink-0 shadow-sm z-10">
          <div className="flex flex-wrap gap-5 items-end">
            <div className="min-w-[220px]">
              <label className="block text-[12px] font-semibold text-[#555] mb-1.5">
                Loại văn bản <span className="text-[#e74c3c]">*</span>
              </label>
              <div className="relative">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full h-[34px] pl-3 pr-8 text-[13px] border border-[#ccc] rounded-[4px] bg-white focus:border-[#1a5a96] outline-none appearance-none"
                >
                  {DOC_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-[10px] text-[#888] pointer-events-none" />
              </div>
            </div>

            {(docType.includes("Tờ trình") || docType === "Yêu cầu bổ sung") && (
              <div className="min-w-[180px]">
                <label className="block text-[12px] font-semibold text-[#555] mb-1.5">
                  Người tạo
                </label>
                <div className="h-[34px] px-3 flex items-center text-[13px] border border-[#eee] bg-[#f9f9f9] rounded-[4px] text-[#444]">
                  Vũ Văn Yên (Cán bộ)
                </div>
              </div>
            )}

            {(docType.includes("Tờ trình") || docType === "Yêu cầu bổ sung") && (
              <div className="flex gap-4 items-end flex-1">
                <div className="flex-1 min-w-[260px]">
                  <label className="block text-[12px] font-semibold text-[#555] mb-1.5">
                    Chuyển tiếp cho <span className="text-[#e74c3c]">*</span>
                  </label>
                  <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                      <input type="radio" name="nextActionType" value="duyet" checked={nguoiDuyet.startsWith("duyet:")} onChange={() => setNguoiDuyet("duyet:")} className="accent-[#1d2e4f]" />
                      <span className="text-[#333]">Người duyệt</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                      <input type="radio" name="nextActionType" value="ky" checked={nguoiDuyet.startsWith("ky:")} onChange={() => setNguoiDuyet("ky:")} className="accent-[#1d2e4f]" />
                      <span className="text-[#333]">Người ký</span>
                    </label>
                  </div>
                  <div className="relative">
                    <select
                      value={nguoiDuyet}
                      onChange={(e) => setNguoiDuyet(e.target.value)}
                      className="w-full h-[34px] pl-3 pr-8 text-[13px] border border-[#ccc] rounded-[4px] bg-white focus:border-[#1a5a96] outline-none appearance-none"
                    >
                      {nguoiDuyet === "" ? (
                        <>
                          <option value="">-- Chọn người --</option>
                          <option value="duyet:Trần Văn B">Trần Văn B - Trưởng phòng - 15/04/1980</option>
                          <option value="duyet:Lê Thị C">Lê Thị C - Phó phòng - 22/09/1985</option>
                          <option value="ky:Nguyễn Minh An">Nguyễn Minh An - Phó CVP - 01/03/1975</option>
                          <option value="ky:Hoàng Kim Long">Hoàng Kim Long - CVP - 10/08/1970</option>
                        </>
                      ) : nguoiDuyet.startsWith("duyet:") ? (
                        <>
                          <option value="duyet:">-- Chọn người duyệt --</option>
                          <option value="duyet:Trần Văn B">Trần Văn B - Trưởng phòng - 15/04/1980</option>
                          <option value="duyet:Lê Thị C">Lê Thị C - Phó phòng - 22/09/1985</option>
                        </>
                      ) : (
                        <>
                          <option value="ky:">-- Chọn người ký --</option>
                          <option value="ky:Nguyễn Minh An">Nguyễn Minh An - Phó CVP - 01/03/1975</option>
                          <option value="ky:Hoàng Kim Long">Hoàng Kim Long - CVP - 10/08/1970</option>
                        </>
                      )}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-[10px] text-[#888] pointer-events-none" />
                  </div>
                </div>

                {currentRole === "truong-phong" && (
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-[12px] font-semibold text-[#555] mb-1.5">
                      Ý kiến duyệt
                    </label>
                    <textarea
                      placeholder="Nhập ý kiến (Không bắt buộc)..."
                      value={approvalNote}
                      onChange={(e) => setApprovalNote(e.target.value)}
                      className="w-full h-[34px] min-h-[34px] py-1.5 px-3 text-[13px] border border-[#ccc] rounded-[4px] focus:border-[#1a5a96] outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-[50%] overflow-y-auto p-5 bg-[#f4f6f8] border-r border-[#ddd] flex flex-col justify-between">
            <div className="bg-white border border-[#ddd] rounded-[6px] shadow-sm overflow-hidden flex-shrink-0 mb-4">
              <div className="flex items-center bg-[#f5f5f5] border-b border-[#ddd] text-[12px] font-bold text-[#555] uppercase tracking-wide">
                <div className="flex-1 py-2.5 px-4">Cấu trúc tài liệu</div>
                <div className="w-36 py-2.5 px-3 text-center">Trạng thái Validation</div>
                <div className="w-12 py-2.5 px-3 text-right">Thao tác</div>
              </div>
              <div className="flex flex-col">
                {treeData.map(node => (
                  <DocumentTreeRow 
                    key={node.id} 
                    node={node} 
                    onToggleExpand={toggleExpand} 
                    selectedNodeId={selectedNode?.id}
                    onSelectNode={(n) => setSelectedNode(n)}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-auto flex items-start gap-2 bg-[#e8f4fd] p-3 rounded border border-[#b3d7f6] text-[#1a5a96] text-[12px]">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <p>
                Văn bản chính sẽ được tự động cấp số theo sổ <strong>Công văn đi</strong> của hệ thống sau khi được phê duyệt.
                Các tài liệu đính kèm sẽ được đánh số phụ lục.
              </p>
            </div>
          </div>

          <div className="w-[50%] bg-[#eaebed] overflow-y-auto p-5 border-l border-[#ddd] flex flex-col items-center gap-4">
            <div className="w-full max-w-[540px] flex items-center justify-between bg-white border border-[#ccc] rounded px-3 py-2 shadow-sm flex-shrink-0">
              <span className="text-[12px] font-bold text-[#1d2e4f] flex items-center gap-1.5">
                <FileText size={14} className="text-[#1a5a96]" /> Xem trước tài liệu: {selectedNode?.type || "Tài liệu"}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Phóng to"><ZoomIn size={14} className="text-[#666]" /></button>
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Thu nhỏ"><ZoomOut size={14} className="text-[#666]" /></button>
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Xoay"><RotateCcw size={14} className="text-[#666]" /></button>
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Tải về"><Download size={14} className="text-[#666]" /></button>
              </div>
            </div>

            <div className="w-full max-w-[540px] bg-white border border-[#ccc] shadow-md rounded p-8 relative min-h-[580px] text-[11px] leading-relaxed text-[#333]">
              {selectedNode ? (
                selectedNode.type.includes("Tờ trình") ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-[11px] font-bold">TÒA ÁN NHÂN DÂN TỐI CAO</div>
                      <div className="text-[10px] font-medium">VĂN PHÒNG TỔNG HỢP</div>
                      <div className="w-[60px] h-px bg-black mx-auto my-1" />
                      <div className="text-[9px] text-[#666]">Số: ..../2026/TTr-VP</div>
                    </div>
                    
                    <div className="flex justify-end mb-4">
                      <div className="text-[9px] text-center">
                        <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                        <div className="font-medium">Độc lập - Tự do - Hạnh phúc</div>
                        <div className="w-[80px] h-px bg-black mx-auto my-1" />
                        <div className="italic">TP. Hà Nội, ngày..... tháng..... năm 2026</div>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-[13px] font-bold uppercase">{selectedNode.type.toUpperCase()}</div>
                      <div className="text-[11px] font-semibold mt-1 text-[#8b1a1a]">{selectedNode.name}</div>
                    </div>

                    <div className="space-y-3">
                      <p className="font-medium">Kính gửi: Lãnh đạo Tòa án nhân dân tối cao.</p>
                      <p>
                        Văn phòng kính đề xuất Lãnh đạo xem xét phê duyệt tờ trình công tác liên quan đến phân công thẩm phán giải quyết đơn/hồ sơ vụ việc theo các tiêu chí:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 bg-[#fafafa] p-3 rounded border border-[#f0f0f0]">
                        <li><span className="font-semibold">Thẩm phán đề xuất:</span> {selectedNode.name.split("Thẩm phán: ")[1]?.split(" - ")[0] || "Chưa phân công"}</li>
                        <li><span className="font-semibold">Đơn vị xử lý:</span> {selectedNode.name.split("Đơn vị: ")[1] || "Chưa xác định"}</li>
                        <li><span className="font-semibold">Hình thức phân nhóm:</span> Cùng Thẩm phán và Đơn vị chuyển đến</li>
                      </ul>
                      <p className="mt-4">Kính trình Lãnh đạo xem xét và cho ý kiến chỉ đạo./.</p>
                      
                      <div className="flex justify-between items-start mt-12 pt-4 border-t border-dashed border-[#eee]">
                        <div className="text-[9px] italic text-[#666]">
                          Nơi nhận:<br/>
                          - Như trên;<br/>
                          - Lưu VP.
                        </div>
                        <div className="text-center text-[9px] w-[180px]">
                          <div className="font-bold">TL. CHÁNH ÁN</div>
                          <div className="font-bold">KT. CHÁNH VĂN PHÒNG</div>
                          <div className="font-bold text-[#8b1a1a]">PHÓ CHÁNH VĂN PHÒNG</div>
                          <div className="italic text-[8px] text-[#888] mt-1">(Đã ký số hệ thống)</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : selectedNode.type === "Danh sách" ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-[12px] font-bold">DANH SÁCH CHI TIẾT ĐƠN ĐỀ XUẤT PHÂN CÔNG</div>
                      <div className="text-[10px] text-[#555] italic mt-1">{selectedNode.name}</div>
                    </div>

                    <table className="w-full border-collapse border border-[#ddd] text-[10px] my-4">
                      <thead>
                        <tr className="bg-[#f5f5f5]">
                          <th className="border border-[#ddd] p-2 text-left">Mã đơn</th>
                          <th className="border border-[#ddd] p-2 text-left">Người gửi</th>
                          <th className="border border-[#ddd] p-2 text-left">Ngày nhận</th>
                          <th className="border border-[#ddd] p-2 text-left">Nội dung</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedNode.children?.map(c => {
                          const r = c.originalData;
                          return (
                            <tr key={c.id}>
                              <td className="border border-[#ddd] p-2 font-medium">{r?.maDon || "—"}</td>
                              <td className="border border-[#ddd] p-2">{r?.nguoiGui || "—"}</td>
                              <td className="border border-[#ddd] p-2">{r?.ngayNhap || "—"}</td>
                              <td className="border border-[#ddd] p-2 truncate max-w-[150px]">{r?.noiDung || "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <p className="italic text-[9px] text-[#666] mt-4">Kèm theo Tờ trình số 112/2026/TTr-TANDTC-VP.</p>
                  </>
                ) : (
                  <>
                    <div className="border-b border-[#eee] pb-3 mb-4">
                      <div className="text-[14px] font-bold text-[#1d2e4f]">{selectedNode.name}</div>
                      <div className="text-[10px] text-[#888] mt-1">Mã hồ sơ gốc hệ thống: {selectedNode.originalData?.id}</div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-[#f8fafc] p-3 rounded border border-[#e2e8f0] grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[9px] text-[#888] font-bold uppercase">Người nộp đơn</span>
                          <span className="text-[12px] font-semibold text-[#1d2e4f]">{selectedNode.originalData?.nguoiGui || "—"}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-[#888] font-bold uppercase">Số điện thoại / Địa chỉ</span>
                          <span className="text-[11px]">{selectedNode.originalData?.diaChi || "Hà Nội"}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-[#888] font-bold uppercase">Thẩm phán thụ lý</span>
                          <span className="text-[11px] font-semibold text-[#8b1a1a]">{selectedNode.originalData?.thongTinDon?.thamPhan || "Chưa phân công"}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-[#888] font-bold uppercase">Đơn vị giải quyết</span>
                          <span className="text-[11px] font-semibold text-[#1a5a96]">{selectedNode.originalData?.thongTinDon?.donViGiaiQuyet || "Chưa xác định"}</span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[9px] text-[#888] font-bold uppercase mb-1">Nội dung tóm tắt</span>
                        <div className="p-3 bg-[#fff] border border-[#eee] rounded text-[11px] leading-relaxed text-[#555]">
                          {selectedNode.originalData?.noiDung || "Không có nội dung mô tả chi tiết."}
                        </div>
                      </div>
                    </div>
                  </>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-[#999] italic">
                  Chọn một tài liệu trong cây thư mục để xem trước
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-[#ddd] p-4 flex items-center justify-between gap-3 flex-shrink-0 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] text-[#888]">
            {treeData.length > 0 && (
              <span>
                {treeData.filter(n => n.isValid !== false).length}/{treeData.length} tờ trình hợp lệ
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-[#555] bg-white border border-[#ccc] rounded-[4px] hover:bg-[#f5f5f5] transition-colors"
            >
              Đóng
            </button>

            <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-[#1a5a96] bg-white border border-[#1a5a96] rounded-[4px] hover:bg-[#f0f7ff] transition-colors">
              <Printer size={15} /> In dự thảo
            </button>

            {currentRole === "truong-phong" ? (
              <>
                <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#27ae60] rounded-[4px] hover:bg-[#219653] transition-colors shadow-sm">
                  <Check size={15} /> Phê duyệt
                </button>
                <button className="px-4 py-2 text-[13px] font-semibold text-[#8b1a1a] bg-white border border-[#8b1a1a] rounded-[4px] hover:bg-[#fdeaea] transition-colors">
                  Từ chối
                </button>
              </>
            ) : currentRole === "pho-vp" || currentRole === "lanh-dao" ? (
              <>
                <button
                  className="flex items-center gap-2 px-5 py-2 text-[13px] font-bold text-white rounded-[4px] transition-all shadow-md hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #e91e8c 0%, #c2185b 100%)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Ký số
                </button>
                <button className="px-4 py-2 text-[13px] font-semibold text-[#555] bg-white border border-[#ccc] rounded-[4px] hover:bg-[#f0f0f0] transition-colors">
                  Ký logic
                </button>
                <button className="px-4 py-2 text-[13px] font-semibold text-[#8b1a1a] bg-white border border-[#8b1a1a] rounded-[4px] hover:bg-[#fdeaea] transition-colors">
                  Từ chối
                </button>
                <button className="px-4 py-2 text-[13px] font-semibold text-white bg-[#1a5a96] rounded-[4px] hover:bg-[#154a7a] transition-colors shadow-sm">
                  Đồng ý
                </button>
              </>
            ) : (
              <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#8b1a1a] rounded-[4px] hover:bg-[#7a1717] transition-colors shadow-sm">
                <Send size={15} /> Lưu & Trình duyệt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
