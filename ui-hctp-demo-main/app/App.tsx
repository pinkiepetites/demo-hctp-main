import { useState, useRef, useEffect, useMemo } from "react";
import {
  X, Plus, Trash2, Edit2, FileText, ChevronDown, ChevronRight,
  ChevronUp, Search, ZoomIn, ZoomOut, RotateCcw, Download, Upload,
  Eye, Printer, Menu, PenLine, FolderOpen, LayoutTemplate,
  MessageSquare, Copy, CopyPlus, Home, LayoutList, Mail, List,
  Users, ArrowDownToLine, ArrowUpFromLine, Archive, Clock,
  Gavel, Scale, Settings, RefreshCw, Send, GitMerge, Check, Save, Pencil, ChevronLeft,
  AlertCircle, Bell, FilePlus, Inbox, ArrowLeft, History as HistoryIcon
} from "lucide-react";
import Dashboard from "./Dashboard";
import DocumentNumberingModal from "./components/DocumentNumberingModal";

// ─── Color tokens matching the real system ───────────────────────────────────
// Primary red: #8b1a1a (dark crimson) — matches system buttons
// Section separator: 1px solid #e0e0e0
// Table header bg: #f5f5f5
// Sidebar: #1d2e4f (dark navy)

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ToTrinh {
  id: string;
  tenVuAn: string;
  noiDung: string;
  loai: string;
  nguoiDeXuat: string;
  ngayDeXuat: string;
  trangThai: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
  yKienLanhDao: string;
  danhSachDon: any[];
}

interface CongVan {
  id: number;
  loai: string;
  so: string;
  ngay: string;
  donVi: string;
  congVanChinh?: boolean;
}

export const notiEmitter = new EventTarget();
export const triggerNoti = (text: string) => {
  notiEmitter.dispatchEvent(new CustomEvent('notify', { detail: text }));
};


// ─── Shared primitives ───────────────────────────────────────────────────────
const Inp = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full h-[30px] px-2 text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 disabled:bg-[#f5f5f5] ${className}`}
  />
);

const Sel = ({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select
      {...props}
      className={`w-full h-[30px] px-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] appearance-none ${className}`}
    >
      {children}
    </select>
    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
  </div>
);

const Lbl = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <label className="block text-[13px] font-medium text-[#333] mb-1">
    {children}{req && <span className="text-[#c0392b] ml-0.5">*</span>}
  </label>
);

const BtnPrimary = ({ children, onClick, disabled = false, type = "button", className = "" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; type?: "button" | "submit"; className?: string;
}) => (
  <button type={type} onClick={onClick} disabled={disabled}
    className={`inline-flex items-center gap-1.5 bg-[#8b1a1a] hover:bg-[#6e1414] active:bg-[#5a1010] text-white text-[13px] font-medium px-4 py-[5px] rounded-[3px] border border-[#6e1414] transition-colors ${disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-[#6e1414]"} ${className}`}>
    {children}
  </button>
);

const BtnSecondary = ({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button type="button" onClick={onClick}
    className={`inline-flex items-center gap-1.5 bg-white hover:bg-[#f5f5f5] text-[#333] text-[13px] font-medium px-4 py-[5px] rounded-[3px] border border-[#ccc] transition-colors ${className}`}>
    {children}
  </button>
);

const BtnAdd = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick}
    className="inline-flex items-center gap-1 bg-[#8b1a1a] hover:bg-[#6e1414] text-white text-[12px] font-medium px-3 py-[3px] rounded-[3px] border border-[#6e1414] transition-colors whitespace-nowrap">
    {children}
  </button>
);

// Section header with collapse toggle (matches real system's □ icon pattern)
const Section = ({
  title, children, extra, defaultOpen = true,
}: {
  title: string; children: React.ReactNode; extra?: React.ReactNode; defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-[#ddd] rounded-[3px]">
      <div
        className="flex items-center justify-between px-3 py-[7px] border-b border-[#ddd] cursor-pointer select-none hover:bg-[#fafafa]"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[#555] flex-shrink-0">
            {open
              ? <span className="inline-block w-[14px] h-[14px] border border-[#888] rounded-[2px] text-center leading-[12px] text-[11px]">−</span>
              : <span className="inline-block w-[14px] h-[14px] border border-[#888] rounded-[2px] text-center leading-[12px] text-[11px]">+</span>
            }
          </span>
          <span className="text-[13px] font-semibold text-[#222]">{title}</span>
        </div>
        {extra && <div onClick={e => e.stopPropagation()}>{extra}</div>}
      </div>
      {open && <div className="px-3 py-3">{children}</div>}
    </div>
  );
};

// Simple table wrapper
const Tbl = ({ headers, children, emptyMsg }: {
  headers: string[]; children?: React.ReactNode; emptyMsg?: string;
}) => (
  <table className="w-full border-collapse text-[13px]">
    <thead>
      <tr className="bg-[#f5f5f5]">
        {headers.map((h, i) => (
          <th key={i} className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] whitespace-nowrap">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {children ?? (
        <tr>
          <td colSpan={headers.length} className="border border-[#ddd] px-3 py-5 text-center text-[#999] italic text-[13px]">
            {emptyMsg ?? "Không có dữ liệu"}
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

const Td = ({ children, center }: { children?: React.ReactNode; center?: boolean }) => (
  <td className={`border border-[#ddd] px-3 py-[5px] ${center ? "text-center" : ""}`}>{children}</td>
);

const ActionBtn = ({ icon, color = "blue", onClick, title }: {
  icon: React.ReactNode; color?: "blue" | "red"; onClick?: () => void; title?: string;
}) => (
  <button title={title} onClick={onClick}
    className={`p-[3px] rounded hover:bg-[#f0f0f0] transition-colors ${color === "blue" ? "text-[#1a5a96] hover:text-[#0d3d6b]" : "text-[#8b1a1a] hover:text-[#6e1414]"}`}>
    {icon}
  </button>
);

// ─── Popup Thêm Công Văn ─────────────────────────────────────────────────────
const LOAI_CV = [
  "Đơn đề nghị GĐT/TT",
  "Đơn khiếu nại tư pháp - tố tụng",
  "Công văn kiến nghị GĐT/TT",
  "Công văn khác",
  "Công văn liên quan",
  "Tài liệu, chứng cứ",
  "Thông báo phát hiện vi phạm pháp luật",
  "Đơn khiếu nại tư pháp - tố tụng kèm Công văn chuyển đơn",
  "Hồ sơ kháng nghị GĐT,TT",
];

const LOAI_CONG_VAN_OPTIONS = [
  { group: null, label: "Công văn chuyển" },
  { group: null, label: "Công văn đề nghị" },
  { group: null, label: "Công văn kiến nghị" },
  { group: null, label: "Công văn nhắc lại" },
  { group: "Công văn 9.3", label: "Lãnh đạo Đảng, Nhà nước, Mặt trận Tổ quốc Việt Nam; các Ủy viên Bộ Chính trị, Ban Bí thư" },
  { group: "Công văn 9.3", label: "Các Phó Chủ tịch nước, Phó Chủ tịch Quốc hội; Phó Thủ tướng Chính phủ" },
  { group: "Công văn 9.3", label: "Trưởng các Ban Đảng" },
  { group: "Công văn 9.3", label: "Các kiến nghị GĐT, TT của Đại biểu Quốc hội" },
  { group: "Công văn 9.3", label: "Các kiến nghị GĐT, TT của Đoàn Đại biểu Quốc hội" },
  { group: "Công văn 9.3", label: "Các kiến nghị GĐT, TT của các cơ quan của Quốc hội" },
  { group: "Công văn 9.3", label: "Các kiến nghị GĐT, TT của Ủy ban Tư pháp của Quốc hội" },
  { group: "Các vụ việc khác thuộc mục 8.1", label: "Văn bản chuyển đơn và yêu cầu thông báo kết quả của Đoàn Đại biểu Quốc hội" },
  { group: "Các vụ việc khác thuộc mục 8.1", label: "Văn bản chuyển đơn và yêu cầu thông báo kết quả của Đại biểu Quốc hội" },
  { group: "Các vụ việc khác thuộc mục 8.1", label: "Văn bản chuyển đơn và yêu cầu thông báo kết quả của các cơ quan của Quốc hội" },
  { group: "Các vụ việc khác thuộc mục 8.1", label: "Vụ việc có văn bản của lão thành cách mạng, nhân sĩ, trí thức" },
  { group: "Các vụ việc khác thuộc mục 8.1", label: "Vụ việc có văn bản kiến nghị xem xét lại của Văn phòng Chính phủ, Tỉnh ủy, UBND tỉnh, các cơ quan báo chí" },
  { group: "Các vụ việc khác thuộc mục 8.1", label: "Vụ việc có văn bản của các đồng chí nguyên là lãnh đạo Đảng, Nhà nước" },
  { group: "Các vụ việc khác thuộc mục 8.1", label: "Vụ việc có giám sát Quốc hội" },
  { group: "Các vụ việc khác thuộc mục 8.1", label: "Các loại khác" },
];

interface CVForm {
  soHieu: string; soCongVan: string; ngayCongVan: string; ngayNhan: string;
  loaiCongVan: string; trongNganh: boolean; traiGiam: boolean;
  congVanChinh: boolean;
  donViGui: string; nguoiKy: string; chucVu: string; yeuCauThongBao: string;
  noiDungCongVan: string;
  diaDoanhCu: boolean; tinh: string; phuong: string; diaChi: string;
}

const PopupCongVan = ({ onClose, onSave }: { onClose: () => void; onSave: (cv: CongVan) => void }) => {
  const [f, setF] = useState<CVForm>({
    soHieu: "", soCongVan: "", ngayCongVan: "", ngayNhan: "",
    loaiCongVan: "", trongNganh: false, traiGiam: false, congVanChinh: false,
    donViGui: "", nguoiKy: "", chucVu: "", yeuCauThongBao: "",
    noiDungCongVan: "",
    diaDoanhCu: false, tinh: "", phuong: "", diaChi: "",
  });

  const txt = (k: keyof CVForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));
  const chk = (k: keyof CVForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(p => ({ ...p, [k]: e.target.checked }));

  const handleSave = () => {
    onSave({ id: Date.now(), loai: f.loaiCongVan || "—", so: f.soCongVan || "—", ngay: f.ngayCongVan || "—", donVi: f.donViGui || "—", congVanChinh: f.congVanChinh });
    onClose();
  };

  const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
  );

  const Field = ({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) => (
    <div><Lbl req={req}>{label}</Lbl>{children}</div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-[700px] max-h-[92vh] flex flex-col border border-[#bbb]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1d2e4f] px-4 py-[10px] rounded-t-[4px]">
          <span className="text-white text-[14px] font-semibold">Thêm mới công văn</span>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          <Row>
            <Field label="Số công văn"><Inp value={f.soCongVan} onChange={txt("soCongVan")} placeholder="Nhập số công văn" /></Field>
            <Field label="Ngày công văn"><Inp type="date" value={f.ngayCongVan} onChange={txt("ngayCongVan")} /></Field>
          </Row>
          <Row>
            <Field label="Ngày nhận"><Inp type="date" value={f.ngayNhan} onChange={txt("ngayNhan")} /></Field>
          </Row>
          <Field label="Loại công văn" req>
            <div className="relative">
              <select value={f.loaiCongVan} onChange={txt("loaiCongVan") as React.ChangeEventHandler<HTMLSelectElement>}
                className="w-full h-[30px] px-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] appearance-none">
                <option value="">-- Chọn loại công văn --</option>
                {(() => {
                  const groups = Array.from(new Set(LOAI_CONG_VAN_OPTIONS.map(o => o.group)));
                  const noGroup = LOAI_CONG_VAN_OPTIONS.filter(o => o.group === null);
                  const withGroup = groups.filter(g => g !== null);
                  return <>
                    {noGroup.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
                    {withGroup.map(g => (
                      <optgroup key={g!} label={`— ${g}`}>
                        {LOAI_CONG_VAN_OPTIONS.filter(o => o.group === g).map(o => (
                          <option key={o.label} value={o.label}>{o.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </>;
                })()}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
            </div>
          </Field>

          {/* Checkboxes */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-[13px] text-[#333] cursor-pointer">
              <input type="checkbox" checked={f.trongNganh} onChange={chk("trongNganh")}
                className="w-[15px] h-[15px] accent-[#8b1a1a]" />
              Đơn vị gửi trong ngành
            </label>
            <label className="flex items-center gap-2 text-[13px] text-[#333] cursor-pointer">
              <input type="checkbox" checked={f.traiGiam} onChange={chk("traiGiam")}
                className="w-[15px] h-[15px] accent-[#8b1a1a]" />
              Đơn vị là trại giam
            </label>
            {/* <label className="flex items-center gap-2 text-[13px] text-[#333] cursor-pointer">
              <input type="checkbox" checked={f.congVanChinh} onChange={chk("congVanChinh")}
                className="w-[15px] h-[15px] accent-[#8b1a1a]" />
              Công văn chính
            </label> */}
          </div>

          <Row>
            <Field label="Đơn vị gửi" req><Inp value={f.donViGui} onChange={txt("donViGui")} placeholder="Tên đơn vị gửi" /></Field>
            <Field label="Người ký"><Inp value={f.nguoiKy} onChange={txt("nguoiKy")} placeholder="Họ tên người ký" /></Field>
          </Row>
          <Row>
            <Field label="Chức vụ"><Inp value={f.chucVu} onChange={txt("chucVu")} placeholder="Chức vụ người ký" /></Field>
            <Field label="Yêu cầu thông báo giải quyết">
              <Sel value={f.yeuCauThongBao} onChange={txt("yeuCauThongBao")}>
                <option value="">-- Chọn --</option>
                <option>Có</option>
                <option>Không</option>
              </Sel>
            </Field>
          </Row>

          {/* Nội dung công văn */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lbl>Nội dung công văn</Lbl>
              <a href="#" onClick={e => e.preventDefault()} className="text-[12px] text-[#1a73e8] hover:underline">[Gợi ý]</a>
            </div>
            <textarea
              rows={4}
              value={f.noiDungCongVan}
              onChange={e => setF(p => ({ ...p, noiDungCongVan: e.target.value }))}
              placeholder="Nhập nội dung công văn"
              className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none"
            />
          </div>

          {/* Địa danh trước sáp nhập block */}
          <div className="border border-[#ddd] rounded-[3px] p-3 bg-[#fafafa]">
            <label className="flex items-center gap-2 text-[13px] font-medium text-[#333] cursor-pointer mb-3">
              <input type="checkbox" checked={f.diaDoanhCu} onChange={chk("diaDoanhCu")}
                className="w-[15px] h-[15px] accent-[#8b1a1a]" />
              Địa danh trước sáp nhập
            </label>
            <Row>
              <Field label="Tỉnh/Thành phố">
                <Sel value={f.tinh} onChange={txt("tinh")} disabled={!f.diaDoanhCu}>
                  <option value="">-- Chọn --</option>
                  <option>Hà Nội</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                  <option>Cần Thơ</option>
                  <option>Hải Phòng</option>
                  <option>Bình Dương</option>
                  <option>Đồng Nai</option>
                  <option>Bà Rịa - Vũng Tàu</option>
                </Sel>
              </Field>
              <Field label="Phường/Xã">
                <Sel value={f.phuong} onChange={txt("phuong")} disabled={!f.diaDoanhCu}>
                  <option value="">-- Chọn --</option>
                </Sel>
              </Field>
            </Row>
            <div className="mt-3">
              <Field label="Địa chỉ liên hệ">
                <Inp value={f.diaChi} onChange={txt("diaChi")} disabled={!f.diaDoanhCu} placeholder="Nhập địa chỉ liên hệ" />
              </Field>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={onClose}>Hủy</BtnSecondary>
          <BtnPrimary onClick={handleSave}>Lưu</BtnPrimary>
        </div>
      </div>
    </div>
  );
};

// ─── DonFields: các trường trong block Thông tin đơn ────────────────────────
const DonFields = () => {
  const [diaDanhCu, setDiaDanhCu] = useState(false);
  const [coNoiDungToCao, setCoNoiDungToCao] = useState(false);
  const [yKienChiDao, setYKienChiDao] = useState("Không");

  return (
    <div className="space-y-3">
      {/* Hàng 1: Số hiệu đơn | Ngày nhận | Ngày ghi trên đơn | Có nội dung tố cáo */}
      <div className="grid grid-cols-4 gap-x-4 items-end">
        <div>
          <Lbl>Số hiệu đơn</Lbl>
          <Inp placeholder="Nhập số hiệu đơn" />
        </div>
        <div>
          <Lbl req>Ngày nhận</Lbl>
          <Inp type="date" />
        </div>
        <div>
          <Lbl req>Ngày ghi trên đơn</Lbl>
          <Inp type="date" />
        </div>
        <div className="flex items-center h-[30px]">
          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
            <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
              checked={coNoiDungToCao} onChange={e => setCoNoiDungToCao(e.target.checked)} />
            Có nội dung tố cáo
          </label>
        </div>
      </div>

      {/* Danh sách người đứng đơn */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-[#333]">Danh sách người đứng đơn</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select className="h-[28px] pl-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8] min-w-[180px]">
                <option value="">-- Chọn người đứng đơn --</option>
                <option>Nguyễn Văn An</option>
                <option>Trần Thị Bình</option>
                <option>Lê Văn Cường</option>
                <option>Phạm Thị Dung</option>
                <option>Hoàng Văn Em</option>
              </select>
              <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
            </div>
            <BtnAdd><Plus size={12} /> Thêm mới</BtnAdd>
          </div>
        </div>
        <Tbl
          headers={["Liên hệ chính", "Họ và tên", "Tư cách tố tụng", "Địa chỉ", "SĐT", "Thao tác"]}
          emptyMsg="Chưa có dữ liệu"
        />
      </div>

      {/* Checkbox Địa danh trước sáp nhập */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] mb-2">
          <input
            type="checkbox"
            checked={diaDanhCu}
            onChange={e => setDiaDanhCu(e.target.checked)}
            className="w-[15px] h-[15px] accent-[#8b1a1a]"
          />
          Địa danh trước sáp nhập
        </label>
        <div className={`grid gap-x-4 gap-y-3 ${diaDanhCu ? "grid-cols-5" : "grid-cols-4"}`}>
          <div>
            <Lbl>Tỉnh/Thành phố</Lbl>
            <Sel disabled={!diaDanhCu}>
              <option value="">Chọn Tỉnh/Thành phố</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
              <option>Cần Thơ</option>
              <option>Hải Phòng</option>
              <option>Bình Dương</option>
              <option>Đồng Nai</option>
              <option>Bà Rịa - Vũng Tàu</option>
            </Sel>
          </div>
          {diaDanhCu && (
            <div>
              <Lbl>Quận/Huyện</Lbl>
              <Sel>
                <option value="">Chọn Quận/Huyện</option>
                <option>Hoàn Kiếm</option>
                <option>Hai Bà Trưng</option>
                <option>Đống Đa</option>
                <option>Ba Đình</option>
                <option>Cầu Giấy</option>
                <option>Thanh Xuân</option>
              </Sel>
            </div>
          )}
          <div>
            <Lbl>Phường/Xã</Lbl>
            <Sel disabled={!diaDanhCu}>
              <option value="">Chọn Phường/Xã</option>
            </Sel>
          </div>
          <div>
            <Lbl>Địa chỉ liên hệ</Lbl>
            <Inp disabled={!diaDanhCu} placeholder="Nhập địa chỉ liên hệ" />
          </div>
          <div>
            <Lbl>Số điện thoại</Lbl>
            <Inp placeholder="Nhập số điện thoại" />
          </div>
        </div>
      </div>

      {/* Nội dung đơn */}
      <div>
        <Lbl>Nội dung đơn</Lbl>
        <textarea rows={4} placeholder="Nhập nội dung đơn..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
      </div>

      {/* Ý kiến chỉ đạo */}
      <div>
        <Lbl>Ý kiến chỉ đạo</Lbl>
        <Sel value={yKienChiDao} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setYKienChiDao(e.target.value)}>
          <option>Không</option>
          <option>Danh sách các Chánh án</option>
          <option>Danh sách các Phó chánh án</option>
          <option>Danh sách các Thẩm phán tối cao</option>
        </Sel>
      </div>
      {yKienChiDao !== "Không" && (
        <div>
          <Lbl>Nội dung chỉ đạo</Lbl>
          <textarea rows={3} placeholder="Nhập nội dung chỉ đạo..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
        </div>
      )}
    </div>
  );
};

// ─── Sidebar navigation ──────────────────────────────────────────────────────
const Sidebar = ({ activePage, onNav }: { activePage: string; onNav?: (page: string) => void }) => {
  const [quanLyDonOpen, setQuanLyDonOpen] = useState(true);
  const [hinhSuOpen, setHinhSuOpen] = useState(false);
  const [thiHanhAnOpen, setThiHanhAnOpen] = useState(false);
  const [tichHopOpen, setTichHopOpen] = useState(false);
  const [congTacLanhDaoOpen, setCongTacLanhDaoOpen] = useState(true);

  const SubItem = ({ icon, label, active, nav }: { icon: React.ReactNode; label: string; active?: boolean; nav?: string }) => (
    <div onClick={() => nav && onNav?.(nav)}
      className={`flex items-center gap-2.5 px-4 py-[7px] cursor-pointer text-[13px] transition-colors rounded-[3px] mx-1
      ${active ? "bg-[#fdeaea] text-[#8b1a1a] font-semibold" : "text-[#444] hover:bg-[#f5f5f5]"}`}>
      <span className={active ? "text-[#8b1a1a]" : "text-[#888]"}>{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );

  const GroupItem = ({ icon, label, open, onToggle }: {
    icon: React.ReactNode; label: string; open: boolean; onToggle: () => void;
  }) => (
    <div className="flex items-center justify-between px-3 py-[8px] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
      onClick={onToggle}>
      <div className="flex items-center gap-2.5 text-[13px] font-semibold text-[#333]">
        <span className="text-[#666]">{icon}</span>
        {label}
      </div>
      {open ? <ChevronUp size={13} className="text-[#888]" /> : <ChevronDown size={13} className="text-[#888]" />}
    </div>
  );

  return (
    <div className="w-[230px] flex-shrink-0 bg-white border-r border-[#e0e0e0] flex flex-col h-full overflow-y-auto">
      {/* Logo header */}
      <div className="flex items-center gap-2.5 px-3 py-3 border-b border-[#eee]">
        <div className="w-[38px] h-[38px] flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="#8b1a1a" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c518" strokeWidth="3" />
            <text x="50" y="56" textAnchor="middle" fill="#f5c518" fontSize="28" fontWeight="bold">⚖</text>
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-[10px] text-[#666] font-medium">PHÒNG TIẾP NHẬN VÀ XỬ LÝ CÔNG DÂN</div>
          <div className="text-[13px] font-bold text-[#1d2e4f]">HỆ THỐNG QUẢN LÝ ÁN</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-2 space-y-0.5">
        {/* Trang chủ */}
        <div onClick={() => onNav?.("home")} className={`flex items-center gap-2.5 px-3 py-[8px] cursor-pointer hover:bg-[#f5f5f5] transition-colors text-[13px] rounded-[3px] mx-1 ${activePage === "home" ? "bg-[#fdeaea] text-[#8b1a1a] font-semibold" : "text-[#333]"}`}>
          <LayoutList size={15} className={activePage === "home" ? "text-[#8b1a1a]" : "text-[#666]"} />
          <span>Trang chủ</span>
        </div>

        {/* Quản lý đơn */}
        <div>
          <GroupItem icon={<FileText size={15} />} label="Quản lý đơn"
            open={quanLyDonOpen} onToggle={() => setQuanLyDonOpen(!quanLyDonOpen)} />
          {quanLyDonOpen && (
            <div className="pb-1">
              <SubItem icon={<List size={13} />} label="Danh sách đơn" active={activePage === "list" || activePage === "form" || activePage === "prototype"} nav="list" />
              <SubItem icon={<FileText size={13} />} label="Vụ án TPB3 đề xuất kháng..." />
              <SubItem icon={<Users size={13} />} label="Phân công thẩm phán" active={activePage === "phancong"} nav="phancong" />
              <SubItem icon={<ArrowDownToLine size={13} />} label="Nhận đơn từ tòa khác" />
              <SubItem icon={<FolderOpen size={13} />} label="Kháng cáo" />
              <SubItem icon={<FileText size={13} />} label="Kháng nghị" />
              <SubItem icon={<Clock size={13} />} label="Giải quyết KC quá hạn" />
              <SubItem icon={<FileText size={13} />} label="Đơn khởi kiện / yêu cầu" />
              <SubItem icon={<ArrowDownToLine size={13} />} label="Đơn chuyển đến" />
              <SubItem icon={<ArrowUpFromLine size={13} />} label="Đơn chuyển đi" />
              <SubItem icon={<Archive size={13} />} label="Hồ sơ tổng hợp vụ án" />
            </div>
          )}
        </div>

        {/* Công tác lãnh đạo */}
        <div>
          <GroupItem icon={<Users size={15} />} label="Công tác lãnh đạo"
            open={congTacLanhDaoOpen} onToggle={() => setCongTacLanhDaoOpen(!congTacLanhDaoOpen)} />
          {congTacLanhDaoOpen && (
            <div className="pb-1">
              <SubItem icon={<Check size={13} />} label="Phê duyệt đề xuất" active={activePage === "phe_duyet"} nav="phe_duyet" />
            </div>
          )}
        </div>

        {/* Hình sự */}
        <div>
          <GroupItem icon={<Scale size={15} />} label="Hình sự"
            open={hinhSuOpen} onToggle={() => setHinhSuOpen(!hinhSuOpen)} />
        </div>

        {/* Thi hành án */}
        <div>
          <GroupItem icon={<Gavel size={15} />} label="Thi hành án"
            open={thiHanhAnOpen} onToggle={() => setThiHanhAnOpen(!thiHanhAnOpen)} />
        </div>

        {/* Cấu hình chung */}
        <div className="flex items-center gap-2.5 px-3 py-[8px] cursor-pointer hover:bg-[#f5f5f5] transition-colors text-[13px] text-[#333]">
          <Settings size={15} className="text-[#666]" />
          <span>Cấu hình chung</span>
        </div>

        {/* Tích hợp - Đồng bộ */}
        <div>
          <GroupItem icon={<RefreshCw size={15} />} label="Tích hợp - Đồng bộ"
            open={tichHopOpen} onToggle={() => setTichHopOpen(!tichHopOpen)} />
        </div>
      </nav>
    </div>
  );
};

// ─── Row action dropdown menu ────────────────────────────────────────────────
const ActionMenu = ({ onClose, onGhepDon, onViewDetail, onEdit, onBoSung, onTaoYeuCau }: { onClose: () => void; onGhepDon?: () => void; onViewDetail?: () => void; onEdit?: () => void; onBoSung?: () => void; onTaoYeuCau?: () => void; }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items: { icon: React.ReactNode; label: string; red?: boolean; divider?: boolean; action?: string }[] = [
    { icon: <PenLine size={13} />, label: "Sửa", action: "edit" },
    { icon: <Eye size={13} />, label: "Xem chi tiết", action: "view" },
    { icon: <FolderOpen size={13} />, label: "Xem hồ sơ đơn" },
    { icon: <LayoutTemplate size={13} />, label: "Xem biểu mẫu" },
    { icon: <MessageSquare size={13} />, label: "Ý kiến lãnh đạo" },
    { icon: <Copy size={13} />, label: "Thêm một đơn trùng" },
    { icon: <CopyPlus size={13} />, label: "Thêm nhiều đơn trùng" },
    { icon: <GitMerge size={13} />, label: "Ghép đơn", action: "ghep" },
    { icon: <FileText size={13} />, label: "Tạo Yêu cầu bổ sung", action: "taoyeucau" },
    { icon: <FilePlus size={13} />, label: "Cập nhật Bổ sung tài liệu", action: "bosung" },
    { icon: <Trash2 size={13} />, label: "Xóa", red: true },
  ];

  return (
    <div ref={ref}
      className="absolute right-0 top-full mt-1 z-50 bg-white border border-[#ddd] rounded-[4px] shadow-lg py-1 min-w-[190px]">
      {items.map((item, i) => (
        <button key={i} onClick={() => {
          if (item.action === "ghep") { onGhepDon?.(); }
          if (item.action === "bosung") { onBoSung?.(); }
          if (item.action === "taoyeucau") { onTaoYeuCau?.(); }
          if (item.action === "view") { onViewDetail?.(); }
          if (item.action === "edit") { onEdit?.(); }
          onClose();
        }}
          className={`w-full flex items-center gap-2.5 px-3 py-[6px] text-[13px] hover:bg-[#f5f5f5] transition-colors text-left
            ${item.red ? "text-[#c0392b] border-t border-[#eee] mt-1 pt-[7px]" : "text-[#333]"}`}>
          <span className={item.red ? "text-[#c0392b]" : "text-[#666]"}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
};

// ─── Popup Ghép đơn ──────────────────────────────────────────────────────────
interface GhepRow { id: number; maDon: string; nguoiGui: string; ngayNhap: string; trangThai: string; soBA?: string; ngayBA?: string; toaBA?: string; }

const GHEP_CANDIDATES: GhepRow[] = [
  { id: 10, maDon: "7025", nguoiGui: "Nguyễn Thị Hoa", ngayNhap: "18/07/2026", trangThai: "Chưa đủ điều kiện", soBA: "15/2023/DS-PT", ngayBA: "12/03/2023", toaBA: "TAND tỉnh Bắc Ninh" },
  { id: 11, maDon: "7022", nguoiGui: "Tòa án nhân dân tỉnh Vĩnh Phúc", ngayNhap: "15/07/2026", trangThai: "Chưa đủ điều kiện", soBA: "08/2022/HS-PT", ngayBA: "20/06/2022", toaBA: "TAND tỉnh Vĩnh Phúc" },
  { id: 12, maDon: "7019", nguoiGui: "Trần Văn Bình", ngayNhap: "12/07/2026", trangThai: "Chưa đủ điều kiện", soBA: "33/2024/KDTM-PT", ngayBA: "15/11/2024", toaBA: "TAND cấp cao tại HN" },
  { id: 13, maDon: "7015", nguoiGui: "Công ty TNHH Minh Đức", ngayNhap: "08/07/2026", trangThai: "Chưa đủ điều kiện", soBA: "21/2021/LĐ-PT", ngayBA: "05/09/2021", toaBA: "TAND tỉnh Hà Nam" },
];

// ─── Popup Tải lên tài liệu / OCR ────────────────────────────────────────────
const PopupUploadFile = ({ onClose, onUpload }: { onClose: () => void, onUpload: () => void }) => {
  const [tab, setTab] = useState<0 | 1>(0); // 0: PDF, 1: Scan
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[6px] shadow-2xl w-[500px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#eee]">
          <span className="text-[15px] font-bold text-[#333]">Thêm đơn từ tài liệu OCR</span>
          <button onClick={onClose} className="text-[#888] hover:text-[#333]"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-3">
          <div className="flex bg-[#f5f5f5] p-1 rounded-[4px]">
            <button onClick={() => setTab(0)} className={`flex-1 py-1.5 text-[13px] font-medium rounded-[3px] transition-colors ${tab === 0 ? "bg-white shadow text-[#1d2e4f]" : "text-[#666] hover:text-[#333]"}`}>Tải file PDF</button>
            <button onClick={() => setTab(1)} className={`flex-1 py-1.5 text-[13px] font-medium rounded-[3px] transition-colors ${tab === 1 ? "bg-white shadow text-[#1d2e4f]" : "text-[#666] hover:text-[#333]"}`}>Quét từ máy scan</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {tab === 0 ? (
            <>
              {/* Drag drop area */}
              <div className="border border-dashed border-[#e91e63] rounded-[6px] p-6 flex flex-col items-center justify-center text-center bg-[#fdf2f6] cursor-pointer hover:bg-[#fce4ec] transition-colors">
                <div className="w-10 h-10 bg-[#e91e63] rounded-[4px] flex items-center justify-center mb-3">
                  <Archive size={20} className="text-white" />
                </div>
                <div className="text-[14px] font-medium text-[#333] mb-1">Click hoặc kéo thả file tài liệu vào đây</div>
                <div className="text-[12px] text-[#666]">Hỗ trợ file định dạng .pdf</div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#333] mb-1"><span className="text-[#e91e63]">*</span> Tên tài liệu</label>
                  <input placeholder="Nhập tên tài liệu" className="w-full h-[32px] px-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                </div>
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-[12px] font-medium text-[#333] mb-1">Loại tài liệu</label>
                    <div className="relative">
                      <select className="w-full h-[32px] px-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8]">
                        <option value="">Chọn loại tài liệu</option>
                        <option value="Quyết định">Quyết định</option>
                        <option value="Công văn">Công văn</option>
                        <option value="Thông báo">Thông báo</option>
                        <option value="Biên bản">Biên bản</option>
                        <option value="Tờ trình">Tờ trình</option>
                        <option value="Đơn">Đơn</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                    </div>
                  </div>
                  <div className="h-[32px] flex items-center">
                    <label className="flex items-center gap-2 text-[12px] cursor-pointer text-[#333]">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded-[3px] border-[#ccc]" /> Tài liệu cá nhân
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-[#333] mb-1">Số văn bản</label>
                    <input placeholder="Nhập số văn bản" className="w-full h-[32px] px-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#333] mb-1">Ngày văn bản</label>
                    <input type="date" className="w-full h-[32px] px-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] text-[#888]" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#333] mb-1">Máy quét</label>
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <select className="w-full h-[32px] px-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8]">
                      <option value="">Chọn máy quét</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  </div>
                  <button className="h-[32px] w-[32px] flex items-center justify-center border border-[#ccc] rounded-[3px] text-[#666] hover:bg-[#f5f5f5]"><RotateCcw size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#333] mb-1">Độ phân giải (DPI)</label>
                  <div className="relative">
                    <select className="w-full h-[32px] px-2 pr-7 text-[13px] border border-[#e91e63] rounded-[3px] appearance-none focus:outline-none">
                      <option>300</option>
                      <option>600</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#333] mb-1">Chế độ màu</label>
                  <div className="relative">
                    <select className="w-full h-[32px] px-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8]">
                      <option>Đen trắng</option>
                      <option>Màu</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#333] mb-1">2 mặt</label>
                  <div className="relative">
                    <select className="w-full h-[32px] px-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8]">
                      <option>Không</option>
                      <option>Có</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#eee]">
          {tab === 0 ? (
            <>
              <button onClick={onClose} className="h-[32px] px-4 border border-[#ccc] bg-white text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[13px] font-medium transition-colors">Quay lại</button>
              <button onClick={onUpload} className="h-[32px] px-4 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-[3px] text-[13px] font-medium transition-colors">Tải lên</button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="h-[32px] px-4 border border-[#ccc] bg-white text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[13px] font-medium transition-colors">Hủy</button>
              <button onClick={onUpload} className="h-[32px] px-4 border border-[#ccc] bg-white text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[13px] font-medium transition-colors">Bắt đầu quét</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


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
              className={`w-full px-2 py-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] resize-none ${status !== "tao" ? "bg-gray-100 text-gray-500" : "bg-white"}`} />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-1">Lãnh đạo ký</label>
            <div className="relative">
              <select disabled={status !== "tao" && status !== "in"}
                className={`w-full h-[32px] px-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8] ${status !== "tao" && status !== "in" ? "bg-gray-100 text-gray-500" : "bg-white"}`}>
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


const PopupGhepDon = ({
  donChinh, onClose, onNext,
}: {
  donChinh: { maDon: string; nguoiGui: string; soBA?: string; ngayBA?: string; toaXetXu?: string };
  onClose: () => void;
  onNext: (selected: GhepRow[]) => void;
}) => {
  const parseDate = (value: string) => {
    const [day, month, year] = value.split("/").map(Number);
    return Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year) ? new Date(0) : new Date(year, month - 1, day);
  };

  const sameCaseCandidates = GHEP_CANDIDATES
    .filter(r => donChinh.soBA && r.soBA === donChinh.soBA)
    .sort((a, b) => parseDate(a.ngayNhap).getTime() - parseDate(b.ngayNhap).getTime());

  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (sameCaseCandidates.length > 0) {
      setSelected([sameCaseCandidates[0].id]);
    }
  }, [sameCaseCandidates]);

  const sortedCandidates = [...GHEP_CANDIDATES].sort((a, b) => {
    const aSame = donChinh.soBA && a.soBA === donChinh.soBA;
    const bSame = donChinh.soBA && b.soBA === donChinh.soBA;
    if (aSame !== bSame) return aSame ? -1 : 1;
    return parseDate(a.ngayNhap).getTime() - parseDate(b.ngayNhap).getTime();
  });

  const toggle = (id: number) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-[860px] max-h-[85vh] flex flex-col border border-[#bbb]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1d2e4f] px-4 py-[10px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white">
            <GitMerge size={15} />
            <span className="text-[14px] font-semibold">Ghép đơn</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={17} /></button>
        </div>

        {/* Đơn chính */}
        <div className="px-4 pt-3 pb-3 bg-[#f9f9f9] border-b border-[#eee]">
          <p className="text-[12px] text-[#555] mb-2">Đơn chính (đang chọn ghép vào)</p>
          <div className="flex items-start gap-6 text-[12px]">
            <div className="flex items-center gap-2">
              <span className="text-[#888]">Mã đơn:</span>
              <span className="font-semibold text-[#1d2e4f]">{donChinh.maDon}</span>
            </div>
            {donChinh.soBA && (
              <div className="flex items-center gap-2">
                <span className="text-[#888]">Số BA:</span>
                <span className="font-medium text-[#333]">{donChinh.soBA}</span>
              </div>
            )}
            {donChinh.ngayBA && (
              <div className="flex items-center gap-2">
                <span className="text-[#888]">Ngày BA:</span>
                <span className="text-[#333]">{donChinh.ngayBA}</span>
              </div>
            )}
            {donChinh.toaXetXu && (
              <div className="flex items-center gap-2">
                <span className="text-[#888]">Tòa xét xử:</span>
                <span className="text-[#333]">{donChinh.toaXetXu}</span>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f5f5f5]">
                <th className="border border-[#ddd] px-2 py-[6px] w-[36px]">
                  <input type="checkbox"
                    className="w-[13px] h-[13px] accent-[#8b1a1a]"
                    checked={selected.length === GHEP_CANDIDATES.length}
                    onChange={e => setSelected(e.target.checked ? GHEP_CANDIDATES.map(r => r.id) : [])} />
                </th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Mã đơn</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Thông tin bản án</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Ngày nhập</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {GHEP_CANDIDATES.map((r, i) => (
                <tr key={r.id} className={`cursor-pointer ${selected.includes(r.id) ? "bg-[#fdeaea]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}
                  onClick={() => toggle(r.id)}>
                  <td className="border border-[#ddd] px-2 py-[6px] text-center">
                    <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                      checked={selected.includes(r.id)} onChange={() => toggle(r.id)}
                      onClick={e => e.stopPropagation()} />
                  </td>
                  <td className="border border-[#ddd] px-3 py-[6px] font-medium text-[#1a5a96]">{r.maDon}</td>
                  <td className="border border-[#ddd] px-3 py-[6px]">
                    {r.soBA && (
                      <div className="leading-snug space-y-[1px]">
                        <div><span className="text-[#888]">Số BA: </span><span className="font-medium text-[#333]">{r.soBA}</span></div>
                        <div><span className="text-[#888]">Ngày BA: </span><span className="text-[#555]">{r.ngayBA}</span></div>
                        <div><span className="text-[#888]">Tòa XX: </span><span className="text-[#555]">{r.toaBA}</span></div>
                      </div>
                    )}
                  </td>
                  <td className="border border-[#ddd] px-3 py-[6px] whitespace-nowrap">{r.ngayNhap}</td>
                  <td className="border border-[#ddd] px-3 py-[6px]">
                    <span className="inline-block px-2 py-[2px] rounded text-[11px] font-medium bg-[#e67e22] text-white">{r.trangThai}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selected.length > 0 && (
            <p className="text-[12px] text-[#1d2e4f] mt-2 font-medium">
              Đã chọn {selected.length} đơn để ghép.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={onClose}>Hủy</BtnSecondary>
          <BtnPrimary onClick={() => {
            if (selected.length === 0) return;
            onNext(GHEP_CANDIDATES.filter(r => selected.includes(r.id)));
          }} className={selected.length === 0 ? "opacity-50 cursor-not-allowed" : ""}>
            <GitMerge size={13} /> Tiếp tục
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Xác nhận Ghép đơn ─────────────────────────────────────────────────
const PopupXacNhanGhep = ({
  donChinh, donGhep, onClose, onConfirm,
}: {
  donChinh: { maDon: string; nguoiGui: string; soBA?: string; ngayBA?: string; toaXetXu?: string };
  donGhep: GhepRow[];
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [canBoB, setCanBoB] = useState(false); // TH2: cần cán bộ B xác nhận
  const [xacNhanB, setXacNhanB] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-[620px] max-h-[85vh] flex flex-col border border-[#bbb]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1d2e4f] px-4 py-[10px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white">
            <Check size={15} />
            <span className="text-[14px] font-semibold">Xác nhận ghép đơn</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={17} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* Đơn chính */}
          <div>
            <p className="text-[12px] font-semibold text-[#333] mb-1.5">Đơn chính</p>
            <div className="border border-[#ddd] rounded-[3px] px-3 py-2 bg-[#f0f7ff] text-[12px]">
              <div className="flex items-center gap-3 mb-1.5">
                <GitMerge size={13} className="text-[#1d2e4f] flex-shrink-0" />
                <span className="font-semibold text-[#1d2e4f]">Mã đơn: {donChinh.maDon}</span>
                <span className="text-[#555]">{donChinh.nguoiGui}</span>
              </div>
              {(donChinh.soBA || donChinh.ngayBA || donChinh.toaXetXu) && (
                <div className="ml-6 flex items-center gap-4 text-[11px]">
                  {donChinh.soBA && <span><span className="text-[#888]">Số BA: </span><span className="font-medium text-[#333]">{donChinh.soBA}</span></span>}
                  {donChinh.ngayBA && <span><span className="text-[#888]">Ngày BA: </span><span className="text-[#555]">{donChinh.ngayBA}</span></span>}
                  {donChinh.toaXetXu && <span><span className="text-[#888]">Tòa xét xử: </span><span className="text-[#555]">{donChinh.toaXetXu}</span></span>}
                </div>
              )}
            </div>
          </div>

          {/* Đơn được ghép vào */}
          <div>
            <p className="text-[12px] font-semibold text-[#333] mb-1.5">Các đơn sẽ được ghép vào ({donGhep.length})</p>
            <div className="space-y-1.5">
              {donGhep.map(d => (
                <div key={d.id} className="border border-[#ddd] rounded-[3px] px-3 py-2 bg-[#fafafa] text-[12px]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-[#1a5a96]">Mã đơn: {d.maDon}</span>
                      <span className="text-[#999]">{d.ngayNhap}</span>
                    </div>
                    <span className="px-2 py-[2px] rounded text-[10px] font-medium bg-[#e67e22] text-white">{d.trangThai}</span>
                  </div>
                  {(d.soBA || d.ngayBA || d.toaBA) && (
                    <div className="flex items-center gap-4 text-[11px] mt-0.5">
                      {d.soBA && <span><span className="text-[#888]">Số BA: </span><span className="font-medium text-[#333]">{d.soBA}</span></span>}
                      {d.ngayBA && <span><span className="text-[#888]">Ngày BA: </span><span className="text-[#555]">{d.ngayBA}</span></span>}
                      {d.toaBA && <span><span className="text-[#888]">Tòa xét xử: </span><span className="text-[#555]">{d.toaBA}</span></span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={onClose}>Hủy</BtnSecondary>
          <BtnPrimary
            onClick={onConfirm}
            className={canBoB && !xacNhanB ? "opacity-50 cursor-not-allowed" : ""}>
            <Check size={13} /> Xác nhận ghép đơn
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

interface DanhSachDonRow {
  id: number;
  nguoiGui: string;
  diaChi: string;
  maDon: string;
  loaiHinhThuc: string;
  loaiHinhThucColor: string;
  thongTinDon: {
    soBaqd: string;
    ngay: string;
    toaXetXu: string;
    thuTuc: string;
    hinhThuc: string;
    soCV: string;
    ngayCV: string;
    loaiCV: string;
    donViGui: string;
    thamPhan: string;
    donViGiaiQuyet: string;
  };
  daNhan?: boolean;
  toTrinhStatus?: "none" | "trinh_lanh_dao" | "da_ky";
  soDon?: number;
  hinhThucTiepNhan?: string;
  giaiQuyet: {
    nhan: string;
    color: string;
    stl: string;
    coVanBan: boolean;
  };
  processingHistory?: { date: string; step: string; actor: string; note?: string }[];
  nguoiNhap: string;
  ngayNhap: string;
  gioNhap: string;
  waitingForProcessing?: boolean;
  traLai?: {
    status: "pendingApproval" | "returned";
    reason: string;
    by: string;
  };
  isPhanCong?: boolean;
  thongTinChuyenDon?: "Nội bộ" | "Tòa khác" | "Ngoài tòa án"; // Added for Document Numbering validation
}

// ─── Sample list data ────────────────────────────────────────────────────────
const SAMPLE_ROWS: DanhSachDonRow[] = [
  {
    id: 1,
    nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh",
    diaChi: "Phường Phương Sơn, Tỉnh Bắc Ninh",
    maDon: " Mã 7031",
    loaiHinhThuc: "Công văn kiến nghị",
    loaiHinhThucColor: "#e67e22",
    toTrinhStatus: "trinh_lanh_dao",
    thongTinDon: {
      soBaqd: "BA_2107", ngay: "21/07/2026", toaXetXu: "TAND tỉnh Bắc Ninh",
      thuTuc: "Giám đốc thẩm",
      hinhThuc: "CV Kiến nghị GĐT, TT",
      soCV: "2107", ngayCV: "21/07/2026",
      loaiCV: "Công văn kiến nghị",
      donViGui: "Tòa án nhân dân tỉnh Bắc Ninh",
      thamPhan: "Nguyễn Văn Hiền (Thẩm phán TAND bậc 3) (TT-TANDTC-VP) (54682577 TANDTC-TB 21/07/2026)",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự (Số: 545 - 21/07/2026)",
    },
    daNhan: true,
    soDon: 1,
    hinhThucTiepNhan: "Trực tiếp",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682571", coVanBan: true },
    processingHistory: [
      { date: "21/07/2026", step: "Tiếp nhận hồ sơ", actor: "HCTP - Phòng tiếp nhận", note: "Đã kiểm tra tính hợp lệ" },
      { date: "22/07/2026", step: "Chuyển Vụ Giám đốc kiểm tra và dân sự", actor: "HCTP", note: "Gửi hồ sơ kèm danh sách công văn" },
    ],
    isPhanCong: true,
    thongTinChuyenDon: "Nội bộ",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "21/07/2026", gioNhap: "17:41:29",
  },
  {
    id: 2,
    nguoiGui: "Nguyễn Văn Quyền",
    diaChi: "Bắc Ninh, Thành phố Bắc Ninh",
    maDon: "Mã 7030",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "207", ngay: "21/07/2026", toaXetXu: "TAND TP. Bắc Ninh",
      thuTuc: "Giám đốc thẩm",
      hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "2107", ngayCV: "21/07/2026",
      loaiCV: "Đơn đề nghị GĐT/TT",
      donViGui: "Nguyễn Văn Quyền",
      thamPhan: "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)",
      donViGiaiQuyet: "Chưa quyết",
    },
    daNhan: true,
    soDon: 1,
    hinhThucTiepNhan: "Bưu điện",
    giaiQuyet: { nhan: "Trả lại đơn", color: "#2980b9", stl: "", coVanBan: false },
    processingHistory: [
      { date: "21/07/2026", step: "Yêu cầu bổ sung hồ sơ", actor: "HCTP", note: "Chờ cán bộ trả hồ sơ" },
      { date: "22/07/2026", step: "Trả lại đơn", actor: "HCTP", note: "Lý do: thiếu tài liệu kèm theo" },
    ],
    thongTinChuyenDon: "Ngoài tòa án",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "21/07/2026", gioNhap: "17:09:13",
  },
  {
    id: 3,
    nguoiGui: "Tòa án nhân dân cấp cao tại Thành phố Hồ Chí Minh",
    diaChi: "Phường Hoàn Kiếm, Thành phố Hà Nội",
    maDon: "Mã 7029",
    loaiHinhThuc: "Công văn kiến nghị",
    loaiHinhThucColor: "#e67e22",
    thongTinDon: {
      soBaqd: "917", ngay: "21/07/2026", toaXetXu: "TAND cấp cao tại TP. HCM",
      thuTuc: "Tái thẩm",
      hinhThuc: "CV Kiến nghị GĐT, TT",
      soCV: "2107_1433", ngayCV: "21/07/2026",
      loaiCV: "Vụ việc giám sát Quốc hội",
      donViGui: "Tòa án nhân dân cấp cao tại TP. Hồ Chí Minh",
      thamPhan: "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự (Số: 545 - 21/07/2026)",
    },
    daNhan: true,
    soDon: 1,
    hinhThucTiepNhan: "Trực tuyến",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#e67e22", stl: "54682575", coVanBan: true },
    isPhanCong: true,
    thongTinChuyenDon: "Nội bộ",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "21/07/2026", gioNhap: "17:03:02",
  },
  {
    id: 4,
    nguoiGui: "Lê Thị Mai",
    diaChi: "200 Lý Thường Kiệt, TP. Hồ Chí Minh",
    maDon: "Mã 7028",
    loaiHinhThuc: "Đơn khiếu nại",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "33/2024/KDTM-PT", ngay: "15/11/2024", toaXetXu: "TAND cấp cao tại Hà Nội",
      thuTuc: "Giám đốc thẩm + Tái thẩm",
      hinhThuc: "Đơn khiếu nại tư pháp - tố tụng",
      soCV: "1201", ngayCV: "10/11/2024",
      loaiCV: "Đơn khiếu nại tư pháp - tố tụng",
      donViGui: "Lê Thị Mai",
      thamPhan: "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)",
      donViGiaiQuyet: "Vụ Giám đốc kiểm tra và hình sự (Số: 1730 - 21/07/2026)",
    },
    daNhan: false,
    soDon: 1,
    hinhThucTiepNhan: "Bưu điện",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682571", coVanBan: true },
    isPhanCong: true,
    thongTinChuyenDon: "Nội bộ",
    nguoiNhap: "Nguyễn Thị Lan", ngayNhap: "15/11/2024", gioNhap: "09:15:44",
  },
  {
    /* TH2: cán bộ B - đang chờ xác nhận ghép với đơn 7031 của cán bộ A */
    id: 5,
    nguoiGui: "Nguyễn Thị Hoa",
    diaChi: "Quận Hai Bà Trưng, Thành phố Hà Nội",
    maDon: "Mã 7027",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "15/2023/DS-PT", ngay: "12/03/2023", toaXetXu: "TAND tỉnh Bắc Ninh",
      thuTuc: "Giám đốc thẩm",
      hinhThuc: "Đơn đề nghị GĐT/TT",
      soCV: "", ngayCV: "12/03/2023",
      loaiCV: "Đơn đề nghị GĐT/TT",
      donViGui: "Nguyễn Thị Hoa",
      thamPhan: "Trần Văn Bình (Thẩm phán TAND bậc 2)",
      donViGiaiQuyet: "Vụ Giám đốc kiểm tra và hình sự (Số: 1730 - 21/07/2026)",
    },
    daNhan: true,
    soDon: 1,
    hinhThucTiepNhan: "Trực tiếp",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682571", coVanBan: true },
    isPhanCong: true,
    thongTinChuyenDon: "Nội bộ",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "21/07/2026", gioNhap: "14:12:05",
  },
  {
    /* TH1: cùng cán bộ - đã ghép ngay với đơn 7029 */
    id: 6,
    nguoiGui: "Trần Văn Bình",
    diaChi: "Quận 1, Thành phố Hồ Chí Minh",
    maDon: "Mã 7026",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "08/2022/HS-PT", ngay: "20/06/2022", toaXetXu: "TAND tỉnh Vĩnh Phúc",
      thuTuc: "Tái thẩm",
      hinhThuc: "Đơn đề nghị GĐT/TT",
      soCV: "", ngayCV: "20/06/2022",
      loaiCV: "Đơn đề nghị GĐT/TT",
      donViGui: "Trần Văn Bình",
      thamPhan: "",
      donViGiaiQuyet: "",
    },
    daNhan: false,
    soDon: 1,
    hinhThucTiepNhan: "Trực tuyến",
    giaiQuyet: { nhan: "Chưa đủ điều kiện", color: "#e67e22", stl: "", coVanBan: false },
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "14/07/2026", gioNhap: "14:05:33",
  },
  {
    id: 7,
    nguoiGui: "Văn thư Tòa án nhân dân tỉnh Bắc Ninh",
    diaChi: "Số 1 Hai Bà Trưng, Thành phố Bắc Ninh",
    maDon: "Mã 7024",
    loaiHinhThuc: "Đơn hành chính",
    waitingForProcessing: true,
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "",
      ngay: "",
      toaXetXu: "",
      thuTuc: "",
      hinhThuc: "",
      soCV: "",
      ngayCV: "",
      loaiCV: "",
      donViGui: "",
      thamPhan: "",
      donViGiaiQuyet: "",
    },
    daNhan: false,
    soDon: 0,
    hinhThucTiepNhan: "",
    giaiQuyet: { nhan: "", color: "#999999", stl: "", coVanBan: false },
    nguoiNhap: "",
    ngayNhap: "",
    gioNhap: "",
  },
  {
    id: 8,
    nguoiGui: "Văn thư Tòa án nhân dân tỉnh Hà Nội",
    waitingForProcessing: true,
    diaChi: "Số 2 Hàng Bài, Hà Nội",
    maDon: "Mã 7023",
    loaiHinhThuc: "Đơn khiếu nại",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "Công văn 123",
      ngay: "",
      toaXetXu: "",
      thuTuc: "",
      hinhThuc: "",
      soCV: "",
      ngayCV: "",
      loaiCV: "",
      donViGui: "",
      thamPhan: "",
      donViGiaiQuyet: "",
    },
    daNhan: false,
    soDon: 0,
    hinhThucTiepNhan: "",
    giaiQuyet: { nhan: "", color: "#999999", stl: "", coVanBan: false },
    nguoiNhap: "",
    ngayNhap: "",
    gioNhap: "",
  },
  {
    /* MOCK: thẩm phán nhiều đơn - đơn 2/3 của Nguyễn Như Thắng trong cùng Vụ dân sự */
    id: 9,
    nguoiGui: "Hoàng Minh Tú",
    diaChi: "Quận Đống Đa, Thành phố Hà Nội",
    maDon: "Mã 7022",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "112/2026/DS-GDT", ngay: "10/07/2026", toaXetXu: "TAND tỉnh Phú Thọ",
      thuTuc: "Giám đốc thẩm",
      hinhThuc: "Đơn đề nghị GĐT/TT",
      soCV: "1001", ngayCV: "10/07/2026",
      loaiCV: "Đơn đề nghị GĐT/TT",
      donViGui: "Hoàng Minh Tú",
      thamPhan: "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự (Số: 545 - 21/07/2026)",
    },
    daNhan: true,
    soDon: 1,
    hinhThucTiepNhan: "Bưu điện",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682590", coVanBan: true },
    isPhanCong: true,
    thongTinChuyenDon: "Nội bộ",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "10/07/2026", gioNhap: "09:30:00",
  },
  {
    /* MOCK: thẩm phán nhiều đơn - đơn 3/3 của Nguyễn Như Thắng trong cùng Vụ dân sự */
    id: 10,
    nguoiGui: "Phạm Thị Ngọc",
    diaChi: "Huyện Gia Lâm, Thành phố Hà Nội",
    maDon: "Mã 7021",
    loaiHinhThuc: "Công văn kiến nghị",
    loaiHinhThucColor: "#e67e22",
    thongTinDon: {
      soBaqd: "89/2025/HS-GDT", ngay: "05/06/2025", toaXetXu: "TAND cấp cao tại Hà Nội",
      thuTuc: "Giám đốc thẩm",
      hinhThuc: "CV Kiến nghị GĐT, TT",
      soCV: "2255", ngayCV: "05/06/2025",
      loaiCV: "Công văn kiến nghị",
      donViGui: "Phạm Thị Ngọc",
      thamPhan: "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự (Số: 545 - 21/07/2026)",
    },
    daNhan: true,
    soDon: 1,
    hinhThucTiepNhan: "Trực tiếp",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682591", coVanBan: true },
    isPhanCong: true,
    thongTinChuyenDon: "Nội bộ",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "05/06/2025", gioNhap: "14:20:00",
  },
];

// ─── Filter primitives (compact, 12px) ───────────────────────────────────────
const FInp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] placeholder:text-[#aaa] ${props.className ?? ""}`} />
);
const FSel = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select {...props} className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none appearance-none">
      {children}
    </select>
    <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
  </div>
);
const FLbl = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[12px] font-medium text-[#333] mb-[3px] whitespace-nowrap">{children}</label>
);
// Date range: "Từ ngày → Đến ngày" with calendar icon
const FDateRange = ({ placeholderFrom = "Từ ngày", placeholderTo = "Đến ngày" }: { placeholderFrom?: string; placeholderTo?: string }) => (
  <div className="flex items-center gap-1">
    <input type="date" className="flex-1 min-w-0 h-[30px] px-1.5 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]" />
    <span className="text-[#aaa] text-[11px] flex-shrink-0">→</span>
    <input type="date" className="flex-1 min-w-0 h-[30px] px-1.5 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]" />
  </div>
);
// Single date with calendar placeholder
const FDate = () => (
  <input type="date" className="w-full h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]" />
);

// ─── DanhSachDon screen ───────────────────────────────────────────────────────
const DanhSachDon = ({ onThemMoi, onBieuMau, onWordEditor, onEditRow, isTruongPhong, currentRole = "can-bo", onCreateToTrinh }: { onThemMoi: () => void; onBieuMau?: (row: typeof SAMPLE_ROWS[0]) => void; onWordEditor?: () => void; onEditRow?: (id: number) => void; isTruongPhong?: boolean;
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao";
  onCreateToTrinh?: (t: ToTrinh) => void;
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showNumberingModal, setShowNumberingModal] = useState<number | null>(null);
  const [assignmentNotice, setAssignmentNotice] = useState<string>("");
  const [assignmentMode, setAssignmentMode] = useState<"none" | "ngau-nhien" | "chi-dinh">("none");
  const [selectedOfficer, setSelectedOfficer] = useState<string>("");
  const OFFICERS = ["Nguyễn Văn An", "Trần Thị Bình", "Lê Thị Hà", "Phạm Văn Đức", "Hoàng Thị Thu"];
  const [rows, setRows] = useState<DanhSachDonRow[]>(SAMPLE_ROWS);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const selectedPhanCongRows = rows.filter(row => selectedRows.includes(row.id) && row.isPhanCong);
  const selectedPhanCongCount = selectedPhanCongRows.length;

  const handleAssignment = (type: "ngau-nhien" | "chi-dinh") => {
    const invalidRows = selectedPhanCongRows.filter(r => r.toTrinhStatus === 'trinh_lanh_dao' || r.toTrinhStatus === 'da_ky');
    if (invalidRows.length > 0) {
      setAssignmentMode("none");
      setSelectedOfficer("");
      setAssignmentNotice("Không thể phân công: Đơn đã nằm trong tờ trình (đã trình lãnh đạo). Vui lòng tạo tờ trình thay đổi phân công.");
      window.setTimeout(() => setAssignmentNotice(""), 4500);
      return;
    }

    if (type === "chi-dinh") {
      if (selectedRows.length === 0) {
        setAssignmentMode("none");
        setSelectedOfficer("");
        // setAssignmentNotice("Vui lòng chọn đơn trước khi phân công chỉ định.");
        window.setTimeout(() => setAssignmentNotice(""), 4500);
        return;
      }
      if (selectedPhanCongCount === 0) {
        setAssignmentMode("none");
        setSelectedOfficer("");
        // setAssignmentNotice("Vui lòng chọn ít nhất một đơn phân công để phân công chỉ định.");
        window.setTimeout(() => setAssignmentNotice(""), 4500);
        return;
      }
      setAssignmentMode("chi-dinh");
      setSelectedOfficer("");
      // setAssignmentNotice(`Chọn cán bộ để phân công chỉ định cho ${selectedPhanCongCount} đơn đã chọn.`);
      return;
    }
    if (selectedRows.length === 0) {
      setAssignmentMode("none");
      setSelectedOfficer("");
      setAssignmentNotice("Vui lòng chọn đơn trước khi phân công ngẫu nhiên.");
      window.setTimeout(() => setAssignmentNotice(""), 4500);
      return;
    }
    setAssignmentMode("ngau-nhien");
    setSelectedOfficer("");
    setAssignmentNotice("Phân công ngẫu nhiên đã được kích hoạt cho đơn đã chọn.");
    triggerNoti("Phân công ngẫu nhiên đã được kích hoạt cho các đơn đã chọn.");
    window.setTimeout(() => setAssignmentNotice(""), 4500);
  };
  const [collapsed, setCollapsed] = useState(true);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showGhepDon, setShowGhepDon] = useState<number | null>(null);
  const [ghepDonChinh, setGhepDonChinh] = useState<number | null>(null);
  const [ghepSelected, setGhepSelected] = useState<GhepRow[]>([]);
  const [showTraLai, setShowTraLai] = useState(false);
  const [traLaiReason, setTraLaiReason] = useState("");
  const [showXacNhan, setShowXacNhan] = useState(false);
  // mergeState tracks per-row: pending (chờ cán bộ B xác nhận) hoặc đã ghép
  const [mergeState, setMergeState] = useState<Record<number, {
    ghepVoi?: string;
    pendingFrom?: { maDon: string; nguoiGui: string };
    pendingTo?: { maDon: string; nguoiGui: string };
  }>>({
    // TH1 - cùng cán bộ (Phùng Trâm Anh): đã ghép ngay, row 3 (7029) là đơn chính
    6: { ghepVoi: "7029" },
    // TH2 - đơn chính của cán bộ A: đã gửi yêu cầu, đang chờ cán bộ B xác nhận
    1: { pendingTo: { maDon: "7027", nguoiGui: "Nguyễn Thị Hoa" } },
    // TH2 - đơn của cán bộ B: nhận được yêu cầu ghép, chờ xác nhận
    5: { pendingFrom: { maDon: "7031", nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh" } },
  });
  const [autoMergeMap, setAutoMergeMap] = useState<Record<number, string>>({});
  const [showConfirmRow, setShowConfirmRow] = useState<number | null>(null);
  const [showHuyGhep, setShowHuyGhep] = useState<number | null>(null);
  const [showBoSungTaiLieu, setShowBoSungTaiLieu] = useState<number | null>(null);
  const [showYeuCauBoSung, setShowYeuCauBoSung] = useState<number | null>(null);
  const [showLuuSoVanBan, setShowLuuSoVanBan] = useState(false);
  const [historyRow, setHistoryRow] = useState<DanhSachDonRow | null>(null);
  const [suaDon, setSuaDon] = useState(false);
  const [tachDon, setTachDon] = useState(false);
  const [tachSoDon, setTachSoDon] = useState("");
  const [loaiVanBan, setLoaiVanBan] = useState("");
  const [loaiDon, setLoaiDon] = useState<"gdt" | "kn" | "tb">("gdt");

  // Filter specific states for conditional rendering
  const [fHinhThuc, setFHinhThuc] = useState("");
  const [fNoiChuyen, setFNoiChuyen] = useState("");
  const [fDonVi, setFDonVi] = useState("");
  const [fTrangThai, setFTrangThai] = useState("");
  const [fThuLy, setFThuLy] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fAnTuHinhSelect, setFAnTuHinhSelect] = useState("");

  const canReturn = selectedRows.length > 0;

  const toggleRow = (id: number) =>
    setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = (checked: boolean) =>
    setSelectedRows(checked ? rows.map(r => r.id) : []);

  useEffect(() => {
    const groups = rows.reduce((acc: Record<string, DanhSachDonRow[]>, row) => {
      const caseKey = `${row.thongTinDon.soBaqd}|${row.ngayNhap}`;
      if (!row.thongTinDon.soBaqd) return acc;
      acc[caseKey] = [...(acc[caseKey] || []), row];
      return acc;
    }, {});

    const nextAuto: Record<number, string> = {};
    Object.values(groups).forEach(group => {
      if (group.length <= 1) return;
      group.forEach(row => {
        const others = group.filter(r => r.id !== row.id).map(r => r.maDon).join(", ");
        nextAuto[row.id] = `Đã ghép với ${others}`;
      });
    });
    setAutoMergeMap(nextAuto);
  }, [rows]);

  const tabs = [
    { label: "Tổng số", count: 77 },
    { label: "Đơn của tôi", count: 12 },
    { label: "Đã thụ lý", count: 5 },
    { label: "Chưa đủ điều kiện", count: 0 },
    { label: "Hết thời hạn kháng nghị", count: 1 },
    { label: "Khác", count: 1 },
  ];

  return (
    <div className="bg-[#eef1f5] min-h-full">
      <div className="p-3 space-y-3">

        {/* Title */}
        <h2 className="text-[15px] font-semibold text-[#222]">Danh sách đơn</h2>

        {/* Card */}
        <div className="bg-white border border-[#ddd] rounded-[3px]">

          {/* Tabs */}
          <div className="flex items-end border-b border-[#ddd] px-3 pt-2 gap-0">
            {tabs.map((t, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`px-4 py-[7px] text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#222]"
                  }`}>
                {t.label}
                {t.label === "Đơn của tôi"}
                <span className={`ml-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${activeTab === i ? "bg-[#8b1a1a] text-white" : "bg-[#eee] text-[#666]"
                  }`}>{t.count}</span>
              </button>
            ))}

          </div>

          {/* "Đơn của tôi" filter notice */}
          {activeTab === 1 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#eef1f5] border-b border-[#ddd] text-[12px] text-[#1d2e4f]">
              <Users size={13} className="flex-shrink-0" />
              <span>Hiển thị đơn được giao cho tất cả cán bộ thuộc tài khoản: <span className="font-semibold">Phùng Trâm Anh</span></span>
            </div>
          )}

          {/* ── Filter section ── */}
          <div className="border-b border-[#ddd] px-3 pt-3 pb-2">
            <div className="space-y-2">
              {/* Row 1 — luôn hiện, tối ưu tìm kiếm chung */}
              <div className="grid grid-cols-6 gap-x-3 gap-y-3">
                <div className="col-span-2"><FLbl>Từ khóa tìm kiếm chung</FLbl><FInp placeholder="Nhập bất kỳ thông tin nào (người gửi, nội dung...)" /></div>
                <div><FLbl>Số tờ trình / Văn bản</FLbl><FInp placeholder="Nhập số tờ trình/văn bản" /></div>
                <div><FLbl>Mã đơn / Số hiệu đơn</FLbl><FInp placeholder="Nhập mã đơn" /></div>
                <div><FLbl>Hình thức đơn</FLbl><FSel value={fHinhThuc} onChange={(e: any) => setFHinhThuc(e.target.value)}><option value="">Tất cả hình thức</option>{LOAI_CV.map(o => <option key={o}>{o}</option>)}</FSel></div>
                <div><FLbl>Người gửi</FLbl><FInp placeholder="Nhập tên người gửi" /></div>
              </div>

              {/* Row 2 — luôn hiện */}
              <div className="grid grid-cols-6 gap-x-3 items-end mt-3">
                <div><FLbl>Số bản án/QĐ</FLbl><FInp placeholder="Nhập số bản án/QĐ" /></div>
                <div><FLbl>Tòa ra bản án / quyết định</FLbl><FSel><option value="">Chọn tòa</option></FSel></div>
                <div><FLbl>Ngày nhập</FLbl><FDateRange /></div>
                
                {/* Thu gọn: 3 ô còn lại dành cho nút (luôn hiện ở filter cơ bản) */}
                <div className="col-span-3 flex items-center justify-end gap-2">
                  <button onClick={() => setCollapsed(false)}
                    className="flex items-center justify-center gap-1.5 text-[12px] text-[#555] bg-[#f0f0f0] hover:bg-[#e4e4e4] px-4 h-[46px] rounded-[3px] border border-[#ddd] transition-colors whitespace-nowrap font-medium">
                    <ChevronDown size={14} /> Bộ lọc Nâng cao
                  </button>
                  <button className="flex flex-col items-center justify-center bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] px-6 h-[46px] gap-0.5 transition-colors">
                    <Search size={14} />
                    <span className="text-[11px] font-medium leading-none">Tìm kiếm</span>
                  </button>
                  <button className="flex items-center gap-1.5 h-[46px] px-4 border border-[#ccc] rounded-[3px] bg-white hover:bg-[#f5f5f5] text-[12px] text-[#555] whitespace-nowrap transition-colors">
                    ↺ Xóa bộ lọc
                  </button>
                </div>
              </div>

              {/* Modal/Drawer Bộ lọc nâng cao */}
              {!collapsed && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                  {/* Backdrop */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setCollapsed(true)}></div>
                  
                  {/* Drawer Content */}
                  <div className="relative w-[950px] bg-[#f8f9fa] h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#eee] shrink-0">
                      <h2 className="text-[16px] font-semibold text-[#1d2e4f] flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#8b1a1a] rounded-sm"></span>
                        Bộ lọc tìm kiếm nâng cao
                      </h2>
                      <button onClick={() => setCollapsed(true)} className="text-[#888] hover:text-[#333] transition-colors p-1 bg-[#f5f5f5] rounded-full hover:bg-[#e0e0e0]">
                        <X size={20} />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                      
                      {/* Nhóm 1: Thông tin chung */}
                      <div className="bg-white p-5 rounded-[4px] shadow-sm border border-[#eee]">
                        <h3 className="text-[13px] font-semibold text-[#1d2e4f] mb-4 border-b border-[#eee] pb-2">Thông tin chung</h3>
                        <div className="grid grid-cols-4 gap-x-5 gap-y-4">
                          <div><FLbl>Ngày bản án / quyết định</FLbl><FDateRange /></div>
                          <div><FLbl>Hình thức nhận</FLbl><FSel><option value="">— Tất cả —</option><option>Bưu điện</option><option>Điện tử</option><option>Trực tiếp</option><option>Nội bộ</option></FSel></div>
                          <div><FLbl>Loại đơn</FLbl><FSel><option value="">— Tất cả —</option><option>Đơn đề nghị GĐT-TT</option><option>Đơn khiếu nại tư pháp - tố tụng</option><option>Thông báo phát hiện vi phạm pháp luật</option></FSel></div>
                          <div><FLbl>Ngày ghi trên đơn</FLbl><FDateRange /></div>
                          <div><FLbl>Ngày nhận đơn</FLbl><FDateRange /></div>
                          <div><FLbl>Người nhập hồ sơ</FLbl><FSel><option value="">Chọn người nhập</option></FSel></div>
                        </div>
                      </div>

                      {/* Nhóm 2: Thông tin bản án/quyết định */}
                      <div className="bg-white p-5 rounded-[4px] shadow-sm border border-[#eee]">
                        <h3 className="text-[13px] font-semibold text-[#1d2e4f] mb-4 border-b border-[#eee] pb-2">Thông tin bản án / Quyết định</h3>
                        <div className="grid grid-cols-4 gap-x-5 gap-y-4">
                          <div><FLbl>Loại án</FLbl><FSel value={fLoaiAn} onChange={(e: any) => setFLoaiAn(e.target.value)}><option value="">Chọn loại án</option><option>Hình sự</option><option>Dân sự</option><option>Hành chính</option><option>KDTM</option><option>HN-GĐ</option><option>Lao động</option></FSel></div>
                          <div><FLbl>Loại QĐ/BA</FLbl><FSel><option value="">— Tất cả —</option><option>Bản án</option><option>Quyết định</option><option>Quyết định GQKN</option><option>Quyết định đình chỉ</option></FSel></div>
                          <div><FLbl>Cấp xét xử</FLbl><FSel><option value="">— Tất cả —</option><option>Sơ thẩm</option><option>Phúc thẩm</option><option>Giám đốc thẩm</option><option>Tái thẩm</option></FSel></div>
                          <div><FLbl>Thủ tục giải quyết</FLbl><FSel><option>— Tất cả —</option><option>Giám đốc thẩm</option><option>Tái thẩm</option><option>Giám đốc thẩm + Tái thẩm</option><option>Chưa xác định</option></FSel></div>
                          <div><FLbl>Án tử hình</FLbl><FSel value={fAnTuHinhSelect} onChange={(e: any) => setFAnTuHinhSelect(e.target.value)}><option value="">— Tất cả —</option><option>Có</option><option>Không</option></FSel></div>
                          <div><FLbl>Trại giam</FLbl><FSel><option>— Tất cả —</option></FSel></div>
                        </div>
                      </div>

                      {/* Nhóm 3: Đương sự & Kháng nghị */}
                      <div className="bg-white p-5 rounded-[4px] shadow-sm border border-[#eee]">
                        <h3 className="text-[13px] font-semibold text-[#1d2e4f] mb-4 border-b border-[#eee] pb-2">Đương sự & Kháng nghị</h3>
                        <div className="grid grid-cols-4 gap-x-5 gap-y-4">
                          <div><FLbl>Số CCCD</FLbl><FInp placeholder="Nhập số CCCD" /></div>
                          <div><FLbl>Địa chỉ gửi đơn</FLbl><FSel><option value="">Chọn tỉnh/xã</option></FSel></div>
                          <div className="col-span-2"><FLbl>Địa chỉ chi tiết</FLbl><FInp placeholder="Nhập địa chỉ chi tiết" /></div>
                          <div><FLbl>Tỉnh/TP cũ</FLbl><FSel><option value="">Chọn tỉnh/TP cũ</option></FSel></div>
                          <div><FLbl>Quận/Huyện cũ</FLbl><FSel><option value="">Chọn quận/huyện cũ</option></FSel></div>
                          <div className="col-span-2"><FLbl>Phường/Xã cũ</FLbl><FSel><option value="">Chọn phường/xã cũ</option></FSel></div>
                          
                          <div><FLbl>Số QĐKN</FLbl><FInp placeholder="Nhập số QĐKN" /></div>
                          <div><FLbl>Ngày QĐKN</FLbl><FDateRange /></div>
                          <div className="col-span-2"><FLbl>Người kháng nghị</FLbl><FInp placeholder="Tên người kháng nghị" /></div>
                          <div><FLbl>Ngày nhận QĐKN</FLbl><FDateRange /></div>
                        </div>
                      </div>

                      {/* Nhóm 4: Xử lý & Phân công */}
                      <div className="bg-white p-5 rounded-[4px] shadow-sm border border-[#eee]">
                        <h3 className="text-[13px] font-semibold text-[#1d2e4f] mb-4 border-b border-[#eee] pb-2">Xử lý đơn & Phân công</h3>
                        <div className="grid grid-cols-4 gap-x-5 gap-y-4">
                          <div><FLbl>Cấp thẩm phán</FLbl><FSel><option>Tất cả thẩm phán</option></FSel></div>
                          <div><FLbl>Lãnh đạo chỉ đạo</FLbl><FSel><option value="">Chọn lãnh đạo</option></FSel></div>
                          <div className="col-span-2"><FLbl>Nơi chuyển đơn</FLbl><FSel value={fNoiChuyen} onChange={(e: any) => { setFNoiChuyen(e.target.value); setFDonVi(""); }}><option value="">Chọn nơi chuyển</option><option>Nội bộ</option><option>Tòa khác</option><option>Ngoài tòa án</option><option>Trả lại đơn</option><option>Lưu theo dõi</option><option>Chờ ý kiến lãnh đạo</option></FSel></div>
                          
                          {fNoiChuyen === "Nội bộ" && (
                            <>
                              <div className="col-span-2"><FLbl>Đơn vị chuyển đến</FLbl><FSel value={fDonVi} onChange={(e: any) => setFDonVi(e.target.value)}><option value="">-- Chọn đơn vị --</option><option>Vụ Pháp chế và Quản lý khoa học</option><option>Hội đồng Thẩm phán TANDTC</option><option>Vụ Giám đốc kiểm tra về hình sự</option></FSel></div>
                              {fDonVi && (
                                <div className="col-span-2"><FLbl>Cá nhân nhận</FLbl><FSel><option value="">-- Chọn cá nhân --</option><option>Vụ trưởng - {fDonVi}</option><option>Phó vụ trưởng - {fDonVi}</option><option>Thẩm tra viên - {fDonVi}</option></FSel></div>
                              )}
                            </>
                          )}
                          {fNoiChuyen === "Tòa khác" && (
                            <div className="col-span-2"><FLbl>Đơn vị chuyển đến</FLbl><FSel value={fDonVi} onChange={(e: any) => setFDonVi(e.target.value)}><option value="">-- Chọn Tòa án --</option><option>TAND cấp cao tại Hà Nội</option><option>TAND cấp cao tại Đà Nẵng</option><option>TAND cấp cao tại TP. Hồ Chí Minh</option><option>TAND Thành phố Hà Nội</option></FSel></div>
                          )}
                          {fNoiChuyen === "Ngoài tòa án" && (
                            <div className="col-span-2"><FLbl>Đơn vị chuyển đến</FLbl><FInp placeholder="Nhập tên cơ quan/đơn vị..." value={fDonVi} onChange={(e: any) => setFDonVi(e.target.value)} /></div>
                          )}
                          {fNoiChuyen === "Trả lại đơn" && (
                            <>
                              <div className="col-span-2"><FLbl>Lý do trả lại</FLbl><FSel><option value="">— Tất cả —</option><option>Đơn không đủ điều kiện xử lý</option><option>Không thuộc thẩm quyền giải quyết</option><option>Đã hết thời hạn giải quyết</option><option>Lý do khác</option></FSel></div>
                              <div className="col-span-2"><FLbl>Yêu cầu trả lại</FLbl><FInp placeholder="Nhập yêu cầu" /></div>
                            </>
                          )}
                          {fNoiChuyen !== "Lưu theo dõi" && fNoiChuyen !== "Chờ ý kiến lãnh đạo" && fHinhThuc !== "CV khác" && fHinhThuc !== "Đơn khác" && (
                            <div className="col-span-2"><FLbl>Trạng thái đơn</FLbl><FSel value={fTrangThai} onChange={(e: any) => setFTrangThai(e.target.value)}><option value="">— Tất cả —</option><option>Đơn đủ điều kiện</option><option>Đơn không đủ điều kiện</option></FSel></div>
                          )}

                          {(fNoiChuyen !== "Lưu theo dõi" && fNoiChuyen !== "Chờ ý kiến lãnh đạo" && fHinhThuc !== "CV khác" && fHinhThuc !== "Đơn khác") && (
                            <>
                              {fTrangThai === "Đơn đủ điều kiện" && (
                                <div className="col-span-2"><FLbl>Thụ lý đơn</FLbl><FSel value={fThuLy} onChange={(e: any) => setFThuLy(e.target.value)}><option value="">— Tất cả —</option><option>Thụ lý mới</option><option>Đã thụ lý</option><option>Không</option></FSel></div>
                              )}
                              {fTrangThai === "Đơn không đủ điều kiện" && (
                                <div className="col-span-2"><FLbl>Lý do không đủ điều kiện</FLbl><FSel><option value="">— Tất cả —</option><option>Thiếu bản án quyết định</option><option>Thiếu xác nhận CCCD</option><option>Viết lại đơn</option><option>Lý do khác</option></FSel></div>
                              )}
                              <div className="col-span-2"><FLbl>Thẩm quyền đơn</FLbl><FSel><option value="">— Tất cả —</option><option>Thẩm phán bậc 3</option><option>Thẩm phán tối cao</option></FSel></div>
                            </>
                          )}

                          <div><FLbl>Chuyển tới CA/TA</FLbl><FSel><option>— Tất cả —</option></FSel></div>
                          <div><FLbl>Ngày chuyển</FLbl><FDateRange /></div>
                          <div><FLbl>Trạng thái chuyển đơn</FLbl><FSel><option>— Tất cả —</option></FSel></div>
                          <div><FLbl>Loại thụ lý đơn</FLbl><FSel><option>— Tất cả —</option></FSel></div>
                          
                          <div><FLbl>Trả lời đơn</FLbl><FSel><option>— Tất cả —</option><option>Có</option><option>Không</option></FSel></div>
                          <div>
                            <FLbl>Đã giải quyết từ tòa cấp cao</FLbl>
                            <div className="flex items-center h-[30px]"><input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]" /></div>
                          </div>
                          <div><FLbl>Số thụ lý</FLbl><FInp placeholder="Nhập số thụ lý" /></div>
                          <div><FLbl>Ngày thụ lý</FLbl><FDateRange /></div>
                          <div className="col-span-2"><FLbl>Tên cơ quan chuyển đơn</FLbl><FInp placeholder="Nhập tên cơ quan" /></div>

                          <div><FLbl>Trả lại đơn</FLbl><FSel><option>— Tất cả —</option><option>Có</option><option>Không</option></FSel></div>
                          <div><FLbl>Ngày trả lại đơn</FLbl><FDate /></div>
                          <div><FLbl>Số CV/PC đến</FLbl><FInp placeholder="Nhập số CV/PC" /></div>
                          <div><FLbl>Ngày CV/PC</FLbl><FDateRange /></div>
                          <div className="col-span-2"><FLbl>Phạm vi tìm kiếm</FLbl><FInp placeholder="Nhập phạm vi" /></div>
                        </div>
                      </div>

                      {/* Nhóm Các Checkbox */}
                      <div className="bg-white p-5 rounded-[4px] shadow-sm border border-[#eee]">
                        <h3 className="text-[13px] font-semibold text-[#1d2e4f] mb-4 border-b border-[#eee] pb-2">Các thuộc tính khác</h3>
                        <div className="grid grid-cols-3 gap-y-3">
                          {fHinhThuc === "CV khác" && (
                            <>
                              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                                <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Có bản án/QĐ liên quan
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                                <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Có công văn phúc đáp
                              </label>
                            </>
                          )}
                          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                            <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Quá thời hiệu 1 năm
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                            <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Quá thời hiệu 3 năm
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                            <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Quá thời hiệu 5 năm
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                            <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Không có nội dung GĐT, TT
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                            <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Có nội dung tố cáo
                          </label>

                          {/* Hình sự specific checkboxes */}
                          {fLoaiAn === "Hình sự" && (
                            <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                              <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Áp dụng biện pháp XLCH
                            </label>
                          )}
                          {fLoaiAn === "Hình sự" && fAnTuHinhSelect === "Có" && (
                            <>
                              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                                <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Xin ân giảm án tử hình
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                                <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Kêu oan án tử hình
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] font-medium whitespace-nowrap">
                                <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" /> Xin thi hành án sớm
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-white border-t border-[#ddd] flex justify-end gap-3 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                      <button onClick={() => setCollapsed(true)} className="px-6 py-[9px] border border-[#ccc] rounded-[4px] bg-white text-[13px] text-[#555] hover:bg-[#f0f0f0] font-medium transition-colors">
                        Đóng
                      </button>
                      <button className="flex items-center gap-1.5 px-6 py-[9px] border border-[#ccc] rounded-[4px] bg-white text-[13px] text-[#555] hover:bg-[#f0f0f0] font-medium transition-colors">
                        ↺ Xóa bộ lọc
                      </button>
                      <button onClick={() => setCollapsed(true)} className="flex items-center gap-1.5 px-8 py-[9px] bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[13px] font-medium transition-colors">
                        <Search size={14} /> Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Action bar sau tìm kiếm ── */}
          <div className="flex flex-col gap-0 border-b border-[#ddd]">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#f5f5f5]">
              {activeTab !== 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#333] whitespace-nowrap">Loại văn bản:</span>
                    <div className="relative">
                      <select
                        value={loaiVanBan}
                        onChange={e => {
                          setLoaiVanBan(e.target.value);
                          if (e.target.value !== "Công văn chuyển đơn") setLoaiDon("gdt");
                        }}
                        className="h-[30px] px-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none min-w-[200px]"
                      >
                        <option value="">Chọn loại văn bản</option>
                        <option>Giấy xác nhận</option>
                        <option>Giấy xác nhận cơ quan chuyển đơn</option>
                        <option>Công văn chuyển đơn</option>
                        <option>Công văn chuyển nội bộ</option>
                        <option>Công văn chuyển tòa khác</option>
                        <option>Công văn chuyển ngoài</option>
                        <option>Trả lại đơn</option>
                        <option>Tờ trình</option>
                        <option>Tờ trình xét xử GĐT</option>
                        <option>Thông báo phân công TP</option>
                        <option>Tờ trình thụ lý lại</option>
                        <option>Yêu cầu bổ sung</option>
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-1" />
                </>
              ) : <div className="flex-1" />}
            </div>

            {/* ── Radio group: chỉ hiện khi loại văn bản = Công văn chuyển đơn ── */}
            {activeTab !== 0 && loaiVanBan === "Công văn chuyển đơn" && (
              <div className="flex items-center gap-1 px-3 py-[6px] bg-[#fffaf7] border-t border-[#e8d9cc]">
                <span className="text-[12px] font-medium text-[#c0392b] mr-1 whitespace-nowrap">
                  Loại đơn<span className="ml-0.5 text-[#c0392b]">*</span>:
                </span>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="loai-don-cong-van"
                      value="gdt"
                      checked={loaiDon === "gdt"}
                      onChange={() => setLoaiDon("gdt")}
                      className="w-[14px] h-[14px] accent-[#8b1a1a]"
                    />
                    <span className="text-[12px] text-[#222]">Đơn đề nghị GĐT/TT</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="loai-don-cong-van"
                      value="kn"
                      checked={loaiDon === "kn"}
                      onChange={() => setLoaiDon("kn")}
                      className="w-[14px] h-[14px] accent-[#8b1a1a]"
                    />
                    <span className="text-[12px] text-[#222]">Đơn khiếu nại tư pháp - tố tụng</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="loai-don-cong-van"
                      value="tb"
                      checked={loaiDon === "tb"}
                      onChange={() => setLoaiDon("tb")}
                      className="w-[14px] h-[14px] accent-[#8b1a1a]"
                    />
                    <span className="text-[12px] text-[#222]">Thông báo phát hiện vi phạm pháp luật</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 px-3 py-2 bg-[#f5f5f5] border-t border-[#ddd]">
              {activeTab === 1 ? (
                <>
                  <BtnPrimary onClick={() => setShowNumberingModal(selectedRows.length ? selectedRows[0] : 1)} className="h-[30px] text-[12px] px-3 gap-1">
                    <FileText size={13} /> Lưu số văn bản và in báo cáo
                  </BtnPrimary>
                  <BtnPrimary onClick={() => triggerNoti("Đã hoàn thành phân công.")} className="h-[30px] text-[12px] px-3 gap-1">
                    ⇄ Hoàn thành
                  </BtnPrimary>
                  <BtnPrimary onClick={() => triggerNoti("Đã thu hồi phân công.")} className="h-[30px] text-[12px] px-3 gap-1">
                    ↩ Thu hồi
                  </BtnPrimary>
                </>
              ) : null}
              {activeTab > 1 && (
                <BtnPrimary onClick={() => setShowTraLai(true)} disabled={!canReturn} className="h-[30px] text-[12px] px-3 gap-1">
                  <RotateCcw size={13} /> Trả lại
                </BtnPrimary>
              )}
              {assignmentMode === "chi-dinh" && selectedPhanCongCount > 0 && (
                <div className="ml-4 flex flex-wrap items-center gap-2">
                  <div className="text-[12px] text-[#333] whitespace-nowrap">Chọn cán bộ:</div>
                  <div className="relative min-w-[220px]">
                    <select value={selectedOfficer} onChange={e => setSelectedOfficer(e.target.value)}
                      className="h-[30px] w-full px-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                      <option value="">-- Chọn cán bộ --</option>
                      {OFFICERS.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  </div>
                  <BtnPrimary onClick={() => {
                    if (!selectedOfficer) return;
                    const assignedMaDons = selectedPhanCongRows.map(r => r.maDon).join(", ");
                    setAssignmentNotice(`Đã chỉ định ${selectedOfficer} cho ${selectedPhanCongCount} đơn: ${assignedMaDons}.`);
                    triggerNoti(`Đã phân công ${selectedOfficer} cho ${selectedPhanCongCount} đơn.`);
                    setAssignmentMode("none");
                    setSelectedOfficer("");
                    window.setTimeout(() => setAssignmentNotice(""), 4500);
                  }} disabled={!selectedOfficer} className="h-[30px] text-[12px] px-3 gap-1">
                    Xác nhận
                  </BtnPrimary>
                </div>
              )}
              {assignmentNotice && (
                <div className="ml-4 rounded-[3px] bg-[#fff4e5] border border-[#f5c16b] px-3 py-2 text-[12px] text-[#8a5c00] max-w-[360px]">
                  {assignmentNotice}
                </div>
              )}
              <BtnPrimary onClick={onThemMoi} className="h-[30px] text-[12px] px-3 gap-1">
                <Plus size={13} /> Thêm mới
              </BtnPrimary>
              {/* <BtnSecondary className="h-[30px] text-[12px] px-3 gap-1">
                <Download size={13} /> Thêm từ đơn
              </BtnSecondary> */}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border border-[#ddd] px-2 py-[7px] text-center font-semibold text-[#333] w-[52px]">
                    <div className="flex items-center justify-center gap-1.5">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={selectedRows.length === rows.length}
                        onChange={e => toggleAll(e.target.checked)} />
                      <span>STT</span>
                    </div>
                  </th>
                  <th className="border border-[#ddd] px-3 py-[7px] text-left font-semibold text-[#333] w-[190px]">Thông tin người gửi / đơn vị gửi</th>
                  <th className="border border-[#ddd] px-3 py-[7px] text-left font-semibold text-[#333]">Thông tin đơn</th>
                  <th className="border border-[#ddd] px-3 py-[7px] text-center font-semibold text-[#333] w-[60px]">Số đơn</th>
                  <th className="border border-[#ddd] px-3 py-[7px] text-left font-semibold text-[#333] w-[110px]">Hình thức tiếp nhận</th>
                  <th className="border border-[#ddd] px-3 py-[7px] text-left font-semibold text-[#333] w-[170px]">Thông tin giải quyết</th>
                  <th className="border border-[#ddd] px-3 py-[7px] text-left font-semibold text-[#333] w-[110px]">Người nhập / Sửa</th>
                  <th className="border border-[#ddd] px-2 py-[7px] text-center font-semibold text-[#333] w-[56px]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const d = row.thongTinDon ?? {};
                  const g = row.giaiQuyet ?? {};
                  return (
                    <tr key={row.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                      {/* STT */}
                      <td className="border border-[#ddd] px-2 py-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleRow(row.id)}
                            onClick={(e) => e.stopPropagation()} />
                          <span>{i + 1}</span>
                        </div>
                      </td>

                      {/* Người gửi */}
                      <td className="border border-[#ddd] px-3 py-2">
                        <div className="font-medium text-[#1a5a96] hover:underline cursor-pointer leading-snug">{row.nguoiGui}</div>
                        <div className="text-[11px] text-[#666] mt-0.5 leading-snug">{row.diaChi}</div>
                        <div className="text-[11px] text-[#666] mt-0.5">{row.maDon}</div>
                      </td>

                      {/* Thông tin đơn */}
                      <td className="border border-[#ddd] px-3 py-2">
                        <div className="space-y-[2px] leading-snug text-[12px]">
                          <div><span className="text-[#555]">Số BA: </span><span className="font-medium">{d.soBaqd || "—"}</span></div>
                          <div><span className="text-[#555]">Ngày BA: </span><span>{d.ngay || "—"}</span></div>
                          <div><span className="text-[#555]">Tòa xét xử: </span><span>{d.toaXetXu || "—"}</span></div>
                          <div><span className="text-[#555]">Thủ tục giải quyết: </span><span>{d.thuTuc || "—"}</span></div>
                          <div><span className="text-[#555]">Hình thức: </span><span>{d.hinhThuc || "—"}</span></div>
                          <div><span className="text-[#555]">Số CV: </span><span>{d.soCV || "—"}</span><span className="text-[#555] ml-3">Ngày CV: </span><span>{d.ngayCV || "—"}</span></div>
                          <div><span className="text-[#555]">Loại CV: </span><span>{d.loaiCV || "—"}</span></div>
                          <div><span className="text-[#555]">Đơn vị gửi: </span><span>{d.donViGui || "—"}</span></div>
                          <div><span className="text-[#555]">Thẩm phán: </span><span className="text-[#333]">{d.thamPhan || "—"}</span></div>
                          <div><span className="text-[#555]">Đơn vị giải quyết: </span><span>{d.donViGiaiQuyet || "—"}</span></div>
                        </div>
                        {row.daNhan && (
                          <span className="inline-block mt-2 px-2 py-[2px] rounded text-[10px] font-medium bg-[#27ae60] text-white">Đã nhận</span>
                        )}
                      </td>

                      {/* Số đơn */}
                      <td className="border border-[#ddd] px-2 py-2 text-center font-medium">{row.soDon ? row.soDon : "—"}</td>

                      {/* Hình thức tiếp nhận */}
                      <td className="border border-[#ddd] px-3 py-2 align-top">
                        <span className={`inline-block px-2 py-[2px] rounded-sm text-[10px] font-medium border ${row.hinhThucTiepNhan === "Trực tiếp" ? "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"
                          : row.hinhThucTiepNhan === "Bưu điện" ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"
                            : row.hinhThucTiepNhan ? "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]" : "bg-[#f5f5f5] text-[#777] border-[#ddd]"
                          }`}>
                          {row.hinhThucTiepNhan || "—"}
                        </span>
                      </td>

                      {/* Thông tin giải quyết */}
                      <td className="border border-[#ddd] px-3 py-2">
                        {row.traLai ? (
                          <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-medium ${row.traLai.status === "pendingApproval" ? "bg-[#fff3cd] text-[#856404] border border-[#ffecb5]" : "bg-[#e8f7ee] text-[#1a7a45] border border-[#a9debb]"}`}>
                            {row.traLai.status === "pendingApproval" ? "Trả lại - chờ TP duyệt" : "Đã trả lại HCTP"}
                          </span>
                        ) : autoMergeMap[row.id] ? (
                          <span className="inline-block px-2 py-[2px] rounded text-[10px] font-medium bg-[#e8f7ee] text-[#1a7a45] border border-[#a9debb]">
                            {autoMergeMap[row.id]}
                          </span>
                        ) : row.waitingForProcessing ? (
                          <span
                            onClick={() => onEditRow?.(row.id)}
                            className="inline-block px-2 py-[2px] rounded text-[10px] font-medium text-[#1a5a96] bg-[#eaf4ff] border border-[#c5d8f8] cursor-pointer hover:bg-[#d4e8ff]"
                          >
                            Chờ xử lý
                          </span>
                        ) : g.nhan ? (
                          <span className="inline-block px-2 py-[2px] rounded text-[10px] font-medium text-white leading-snug"
                            style={{ backgroundColor: g.color || "#999" }}>
                            {g.nhan}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-[2px] rounded text-[10px] font-medium bg-[#f5f5f5] text-[#777] border border-[#ddd]">
                            Chưa có
                          </span>
                        )}
                        {g.stl && (
                          <div className="text-[11px] text-[#555] mt-1">STL: {g.stl}</div>
                        )}
                        {row.processingHistory && row.processingHistory.length > 0 && (
                          <div className="mt-1">
                            <button
                              type="button"
                              onClick={() => setHistoryRow(row)}
                              className="text-[11px] text-[#1a5a96] hover:underline cursor-pointer"
                            >
                              Lịch sử xử lý HCTP
                            </button>
                          </div>
                        )}
                        {g.coVanBan && (
                          <div className="mt-1">
                            <span className="text-[11px] text-[#1a5a96] hover:underline cursor-pointer"
                              onClick={() => onBieuMau?.(row)}>Danh sách văn bản</span>
                          </div>
                        )}
                        {mergeState[row.id]?.ghepVoi && (
                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                              <GitMerge size={11} className="text-[#27ae60] flex-shrink-0" />
                              <span className="text-[11px] text-[#27ae60] font-medium">Đã ghép với {mergeState[row.id].ghepVoi}</span>
                            </div>
                            <button
                              onClick={() => setShowHuyGhep(row.id)}
                              className="flex items-center gap-0.5 px-1.5 py-[2px] rounded text-[10px] font-medium border border-[#c0392b] text-[#c0392b] hover:bg-[#fdecea] transition-colors whitespace-nowrap">
                              <X size={9} /> Hủy ghép
                            </button>
                          </div>
                        )}
                        {mergeState[row.id]?.pendingTo && (
                          <div className="mt-1 flex items-center gap-1">
                            <Clock size={11} className="text-[#856404] flex-shrink-0" />
                            <span className="text-[11px] text-[#856404] font-medium">
                              Chờ xác nhận ghép · {mergeState[row.id].pendingTo!.maDon}
                            </span>
                          </div>
                        )}
                        {mergeState[row.id]?.pendingFrom && (
                          <div className="mt-1">
                            <button
                              onClick={() => setShowConfirmRow(row.id)}
                              className="flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium bg-[#fff3cd] border border-[#ffc107] text-[#856404] hover:bg-[#ffe69c] transition-colors">
                              <GitMerge size={11} />
                              Xác nhận ghép đơn
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Người nhập */}
                      <td className="border border-[#ddd] px-3 py-2">
                        <div className="font-medium text-[12px]">{row.nguoiNhap || "—"}</div>
                        <div className="text-[11px] text-[#666]">{row.ngayNhap || "—"}</div>
                        <div className="text-[11px] text-[#999]">{row.gioNhap || "—"}</div>
                      </td>

                      {/* Thao tác */}
                      <td className="border border-[#ddd] px-2 py-2 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === row.id ? null : row.id); }}
                            className="w-[28px] h-[28px] flex items-center justify-center rounded border border-[#ddd] hover:bg-[#f0f0f0] text-[#555]">
                            <span className="text-[16px] leading-none tracking-tighter">···</span>
                          </button>
                          {openMenu === row.id && (
                            <ActionMenu
                              onClose={() => setOpenMenu(null)}
                              onViewDetail={() => onEditRow?.(row.id)}
                              onEdit={() => onEditRow?.(row.id)}
                              onGhepDon={() => { setGhepDonChinh(row.id); setShowGhepDon(row.id); setOpenMenu(null); }}
                              onBoSung={() => { setShowBoSungTaiLieu(row.id); setOpenMenu(null); }}
                              onTaoYeuCau={() => { setShowYeuCauBoSung(row.id); setOpenMenu(null); }}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-[#ddd] bg-[#fafafa]">
            <span className="text-[12px] text-[#666]">Hiển thị 1-5 trong tổng 77 văn bản</span>
            <div className="flex items-center gap-1">
              <button className="w-[28px] h-[28px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee] text-[12px]">‹</button>
              <button className="w-[28px] h-[28px] flex items-center justify-center border border-[#8b1a1a] rounded bg-[#8b1a1a] text-white text-[12px]">1</button>
              <button className="w-[28px] h-[28px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee] text-[12px]">2</button>
              <button className="w-[28px] h-[28px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee] text-[12px]">›</button>
              <div className="relative ml-2">
                <select className="h-[28px] px-2 pr-6 text-[12px] border border-[#ddd] rounded bg-white appearance-none">
                  <option>10 / trang</option>
                  <option>20 / trang</option>
                  <option>50 / trang</option>
                </select>
                <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Popup Hủy ghép đơn */}
      {showHuyGhep !== null && (() => {
        const row = SAMPLE_ROWS.find(r => r.id === showHuyGhep);
        const ghepVoi = mergeState[showHuyGhep]?.ghepVoi;
        if (!row || !ghepVoi) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-[4px] shadow-xl w-[420px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
                <span className="text-[13px] font-semibold text-[#8b1a1a]">Hủy ghép đơn</span>
                <button onClick={() => setShowHuyGhep(null)} className="text-[#888] hover:text-[#333]"><X size={15} /></button>
              </div>
              <div className="px-5 py-4 space-y-3 text-[12px]">
                <p className="text-[#333]">Bạn có chắc chắn muốn hủy ghép đơn <span className="font-semibold text-[#1d2e4f]">{row.maDon}</span> với đơn <span className="font-semibold text-[#1d2e4f]">{ghepVoi}</span>?</p>
                <p className="text-[11px] text-[#888]">Sau khi hủy, hai đơn sẽ được tách độc lập và không còn liên kết với nhau.</p>
                <div>
                  <label className="block text-[11px] font-medium text-[#555] mb-1">Lý do hủy ghép <span className="text-red-500">*</span></label>
                  <textarea rows={3} placeholder="Nhập lý do hủy ghép đơn..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#1a73e8] resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e0e0e0]">
                <button onClick={() => setShowHuyGhep(null)}
                  className="h-[30px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setMergeState(prev => {
                      const next = { ...prev };
                      // Xóa merge state của đơn hiện tại
                      const { ghepVoi: _, ...rest } = next[showHuyGhep!] ?? {};
                      if (Object.keys(rest).length === 0) delete next[showHuyGhep!]; else next[showHuyGhep!] = rest;
                      // Xóa merge state của đơn đối ứng nếu có
                      const matchId = SAMPLE_ROWS.find(r => r.maDon === ghepVoi)?.id;
                      if (matchId != null) {
                        const { ghepVoi: _2, ...rest2 } = next[matchId] ?? {};
                        if (Object.keys(rest2).length === 0) delete next[matchId]; else next[matchId] = rest2;
                      }
                      return next;
                    });
                    const matchRow = SAMPLE_ROWS.find(r => r.maDon === ghepVoi);
                    triggerNoti(`Đơn [${row.maDon}] của ${row.nguoiGui} đã hủy ghép với đơn [${matchRow?.maDon || ghepVoi}] của ${matchRow?.nguoiGui || "không xác định"}`);
                    setShowHuyGhep(null);
                  }}
                  className="h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                  Xác nhận hủy ghép
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Popup Yêu cầu bổ sung */}
      {showYeuCauBoSung !== null && (
        <PopupYeuCauBoSung donId={showYeuCauBoSung} onClose={() => setShowYeuCauBoSung(null)} />
      )}

      {/* Popup Bổ sung tài liệu */}
      {showBoSungTaiLieu !== null && (
        <PopupBoSungTaiLieu donId={showBoSungTaiLieu} onClose={() => setShowBoSungTaiLieu(null)} />
      )}

      {/* Popup Ghép đơn */}
      {showGhepDon !== null && (() => {
        const row = SAMPLE_ROWS.find(r => r.id === showGhepDon);
        if (!row) return null;
        return (
          <PopupGhepDon
            donChinh={{ maDon: row.maDon, nguoiGui: row.nguoiGui, soBA: row.thongTinDon.soBaqd, ngayBA: row.thongTinDon.ngay, toaXetXu: row.thongTinDon.toaXetXu }}
            onClose={() => setShowGhepDon(null)}
            onNext={(sel) => { setGhepSelected(sel); setShowGhepDon(null); setShowXacNhan(true); }}

          />
        );
      })()}

      {/* Popup Xác nhận ghép */}
      {showXacNhan && (() => {
        const row = SAMPLE_ROWS.find(r => r.id === ghepDonChinh) ?? SAMPLE_ROWS[0];
        return (
          <PopupXacNhanGhep
            donChinh={{ maDon: row.maDon, nguoiGui: row.nguoiGui, soBA: row.thongTinDon.soBaqd, ngayBA: row.thongTinDon.ngay, toaXetXu: row.thongTinDon.toaXetXu }}
            donGhep={ghepSelected}
            onClose={() => { setShowXacNhan(false); setGhepSelected([]); }}
            onConfirm={() => {
              // Tạo pending request trên từng đơn được ghép (cán bộ B cần xác nhận)
              const donChinhRow = SAMPLE_ROWS.find(r => r.id === ghepDonChinh) ?? SAMPLE_ROWS[0];
              setMergeState(prev => {
                const next = { ...prev };
                // Đơn chính: hiển thị "Chờ xác nhận ghép"
                next[donChinhRow.id] = {
                  ...next[donChinhRow.id],
                  pendingTo: { maDon: ghepSelected.map(d => d.maDon).join(", "), nguoiGui: ghepSelected[0]?.nguoiGui ?? "" },
                };
                // Đơn được ghép: hiển thị "Xác nhận ghép đơn"
                ghepSelected.forEach(d => {
                  next[d.id] = { pendingFrom: { maDon: donChinhRow.maDon, nguoiGui: donChinhRow.nguoiGui } };
                });
                return next;
              });
              triggerNoti(`Đơn [${donChinhRow.maDon}] của ${donChinhRow.nguoiGui} đã được gửi yêu cầu ghép với đơn [${ghepSelected.map(d => d.maDon).join("], [")}] của ${ghepSelected.map(d => d.nguoiGui).join(", ")}`);
              setShowXacNhan(false);
              setGhepSelected([]);
            }}
          />
        );
      })()}
      {/* Popup xác nhận ghép cho cán bộ B (đơn được ghép vào) */}
      {showConfirmRow !== null && (() => {
        const row = SAMPLE_ROWS.find(r => r.id === showConfirmRow);
        const pending = mergeState[showConfirmRow]?.pendingFrom;
        if (!row || !pending) return null;
        const chinhRow = SAMPLE_ROWS.find(r => r.maDon === pending.maDon);
        return (
          <PopupXacNhanGhep
            donChinh={{
              maDon: pending.maDon,
              nguoiGui: pending.nguoiGui,
              soBA: chinhRow?.thongTinDon.soBaqd,
              ngayBA: chinhRow?.thongTinDon.ngay,
              toaXetXu: chinhRow?.thongTinDon.toaXetXu,
            }}
            donGhep={[{
              id: row.id,
              maDon: row.maDon,
              nguoiGui: row.nguoiGui,
              ngayNhap: row.ngayNhap,
              trangThai: row.giaiQuyet.nhan,
              soBA: row.thongTinDon.soBaqd,
              ngayBA: row.thongTinDon.ngay,
              toaBA: row.thongTinDon.toaXetXu,
            }]}
            onClose={() => setShowConfirmRow(null)}
            onConfirm={() => {
              setMergeState(prev => {
                const next = { ...prev };
                next[showConfirmRow!] = { ghepVoi: pending.maDon };
                if (chinhRow) {
                  const { pendingTo, ...rest } = next[chinhRow.id] ?? {};
                  next[chinhRow.id] = { ...rest, ghepVoi: row.maDon };
                }
                return next;
              });
              triggerNoti(`Đơn [${row?.maDon}] của ${row?.nguoiGui} đã được ghép với đơn [${chinhRow?.maDon}] của ${chinhRow?.nguoiGui}`);
              setShowConfirmRow(null);
            }}
          />
        );
      })()}

      {/* Popup Lưu số văn bản (NEW) */}
      {showNumberingModal !== null && (
        <DocumentNumberingModal
          isOpen={true}
          onClose={() => setShowNumberingModal(null)}
          currentRole={currentRole}
          selectedRows={rows.filter(r => selectedRows.includes(r.id)).length > 0 ? rows.filter(r => selectedRows.includes(r.id)) : [rows[0]]}
        />
      )}

      {/* Popup Lưu số văn bản */}
      {showLuuSoVanBan && (
        <PopupLuuSoVanBan
          rows={rows.filter(r => selectedRows.includes(r.id))}
          onClose={() => setShowLuuSoVanBan(false)}
          onXemBieuMau={() => { setShowLuuSoVanBan(false); onWordEditor?.(); }}
        />
      )}
      {historyRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[4px] shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
              <div>
                <div className="text-[14px] font-semibold text-[#1d2e4f]">Lịch sử xử lý HCTP</div>
                <div className="text-[12px] text-[#666]">{historyRow.maDon} · {historyRow.nguoiGui}</div>
              </div>
              <button onClick={() => setHistoryRow(null)} className="text-[#888] hover:text-[#333]"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(90vh-112px)]">
              {historyRow.processingHistory?.map((item, idx) => (
                <div key={idx} className="rounded-[4px] bg-[#f8fafc] border border-[#d6e4ef] p-3">
                  <div className="text-[12px] text-[#1d2e4f] font-semibold">{item.date}</div>
                  <div className="text-[13px] font-medium text-[#333]">{item.step}</div>
                  <div className="text-[12px] text-[#555]">{item.actor}{item.note ? ` · ${item.note}` : ""}</div>
                </div>
              )) ?? (
                  <div className="text-[12px] text-[#666]">Không có lịch sử xử lý.</div>
                )}
            </div>
            <div className="flex justify-end px-4 py-3 border-t border-[#e0e0e0]">
              <button onClick={() => setHistoryRow(null)}
                className="h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {showTraLai && (
        <PopupTraLaiDon
          count={selectedRows.length}
          reason={traLaiReason}
          onChangeReason={setTraLaiReason}
          isTruongPhong={!!isTruongPhong}
          onClose={() => { setShowTraLai(false); setTraLaiReason(""); }}
          onConfirm={() => {
            const nextRows = rows.map(row => selectedRows.includes(row.id)
              ? {
                ...row,
                traLai: {
                  status: isTruongPhong ? "returned" as const : "pendingApproval" as const,
                  reason: traLaiReason || "Không có lý do cụ thể",
                  by: isTruongPhong ? "Trưởng phòng" : "Cán bộ",
                },
              }
              : row
            );
            setRows(nextRows);
            setShowTraLai(false);
            setSelectedRows([]);
            setTraLaiReason("");
          }}
        />
      )}
    </div>
  );
};

// ─── Popup Lưu số văn bản ─────────────────────────────────────────────────────
const LOAI_VAN_BAN_OPTIONS = [
  "Giấy xác nhận",
  "Giấy xác nhận cơ quan chuyển đơn",
  "Công văn chuyển nội bộ",
  "Công văn chuyển tòa khác",
  "Công văn chuyển ngoài",
  "Trả lại đơn",
  "Tờ trình",
  "Tờ trình xét xử GĐT",
  "Thông báo phân công TP",
  "Tờ trình thụ lý lại",
  "Yêu cầu bổ sung",
];

const NGUOI_OPTIONS = ["Phạm Văn Nha", "Nguyễn Văn Hiền", "Trần Thị Lan", "Lê Văn Đức"];

const PopupLuuSoVanBan = ({ rows: initialRows, onClose, onXemBieuMau, currentRole = "can-bo", onCreateToTrinh }: {
  rows: typeof SAMPLE_ROWS;
  onClose: () => void;
  onXemBieuMau: () => void;
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao";
  onCreateToTrinh?: (t: ToTrinh) => void;
}) => {
  const [loai, setLoai] = useState("");
  const [nguoiDuyet, setNguoiDuyet] = useState("");
  const [nguoiKy, setNguoiKy] = useState("");
  const [status, setStatus] = useState<"tao_van_ban" | "lay_so" | "trinh_duyet" | "duyet" | "trinh_ky" | "da_ky">("tao_van_ban");
  const [localRows, setLocalRows] = useState(initialRows);

  const [soToTrinh, setSoToTrinh] = useState("");
  const [nguoiDuyetRow, setNguoiDuyetRow] = useState<Record<number, string>>({});
  const [nguoiKyRow, setNguoiKyRow] = useState<Record<number, string>>({});

  const groupedRows = useMemo(() => {
    if (loai !== "Tờ trình") return { "Tất cả": localRows };
    const groups: Record<string, typeof localRows> = {};
    localRows.forEach(row => {
      const tp = row.thongTinDon?.thamPhan || "Chưa xác định";
      if (!groups[tp]) groups[tp] = [];
      groups[tp].push(row);
    });
    return groups;
  }, [localRows, loai]);

  const removeRow = (id: number) => setLocalRows(prev => prev.filter(r => r.id !== id));

  const BIEU_MAU_PER_ROW: Record<number, { ten: string; so: string }[]> = {
    1: [
      { ten: "Thông báo phân công Thẩm phán", so: "54682577/2026/TANDTC-TB" },
      { ten: "Tờ trình thụ lý lại", so: "107/2026/TTr-TANDTC-VP" },
    ],
    2: [
      { ten: "Công văn gửi nội bộ", so: "545/2026/TANDTC-VP" },
    ],
    3: [
      { ten: "Thông báo phân công Thẩm phán", so: "54682578/2026/TANDTC-TB" },
      { ten: "Tờ trình xét xử GĐT", so: "108/2026/TTr-TANDTC-VP" },
    ],
    4: [
      { ten: "Công văn chuyển tòa khác", so: "546/2026/TANDTC-VP" },
    ],
    5: [
      { ten: "Trả lại đơn", so: "201/2026/TANDTC-VP" },
    ],
    6: [
      { ten: "Giấy xác nhận", so: "301/2026/TANDTC-GXN" },
    ],
  };

  const getSoCongVan = (rowId: number, idx: number) =>
    `${String(54682570 + rowId * 3 + idx).slice(-5)}/2026/TANDTC-CV`;

  const CONG_VAN_OPTIONS = [
    "Thông báo phân công Thẩm phán",
    "Tờ trình thụ lý lại",
    "Tờ trình xét xử GĐT",
    "Công văn chuyển nội bộ",
    "Công văn chuyển tòa khác",
    "Công văn chuyển ngoài",
    "Giấy xác nhận",
    "Trả lại đơn",
    "Yêu cầu bổ sung",
  ];

  const [selectedCongVan, setSelectedCongVan] = useState<Record<number, string[]>>({});
  const [openDropRow, setOpenDropRow] = useState<number | null>(null);

  const toggleCongVan = (rowId: number, val: string) => {
    setSelectedCongVan(prev => {
      const cur = prev[rowId] ?? [];
      return { ...prev, [rowId]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] };
    });
  };

  const SelectField = ({ label, value, onChange, placeholder, disabled }: { label: string; value: string; onChange: (v: string) => void; placeholder: string, disabled?: boolean }) => (
    <div className="flex-1">
      <label className="block text-[12px] font-medium text-[#333] mb-1">{label}</label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
          className={`w-full h-[32px] px-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] appearance-none focus:outline-none focus:border-[#1a73e8] ${disabled ? "bg-gray-100 text-gray-500" : "bg-white"}`}>
          <option value="">{placeholder}</option>
          {(label === "Loại văn bản" ? LOAI_VAN_BAN_OPTIONS : NGUOI_OPTIONS).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-[960px] max-h-[90vh] flex flex-col border border-[#bbb]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1d2e4f] px-4 py-[10px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white">
            <FileText size={15} />
            <span className="text-[14px] font-semibold">Lưu văn bản & in báo cáo</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={17} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Fields row */}
          <div className="flex items-end gap-3">
            <SelectField label="Loại văn bản" value={loai} onChange={setLoai} placeholder="Chọn loại văn bản" disabled={status === "da_ky"} />
            <SelectField label="Người duyệt" value={nguoiDuyet} onChange={setNguoiDuyet} placeholder="Chọn người duyệt" disabled={status === "da_ky"} />
            <SelectField label="Người ký" value={nguoiKy} onChange={setNguoiKy} placeholder="Chọn người ký" disabled={status === "da_ky"} />
            {loai === "Tờ trình" && (
              <div className="flex-1">
                <label className="block text-[12px] font-medium text-[#333] mb-1">Số tờ trình</label>
                <input type="text" value={soToTrinh} onChange={e => setSoToTrinh(e.target.value)} disabled={status === "da_ky"}
                  className={`w-full h-[32px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] ${status === "da_ky" ? "bg-gray-100 text-gray-500" : "bg-white"}`}
                  placeholder="Nhập số tờ trình..." />
              </div>
            )}
            <div className="flex-shrink-0">
              <button className="flex items-center gap-1.5 h-[32px] px-3 bg-[#2980b9] hover:bg-[#1a6a9a] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <Printer size={13} /> In văn bản
              </button>
            </div>
          </div>

          {/* Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold text-[#333]">
                Danh sách công văn ({localRows.length})
              </p>
              <div className="flex items-center gap-2">
                {status === "tao_van_ban" && (
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
                  <button onClick={() => { setStatus("da_ky"); if (onCreateToTrinh) { onCreateToTrinh({ id: String(Math.floor(Math.random() * 1000) + 100), tenVuAn: "-", noiDung: "Tờ trình phân công", loai: "Tờ trình", nguoiDeXuat: "Phó Chánh Văn Phòng", ngayDeXuat: new Date().toLocaleString("vi-VN"), trangThai: "Chờ duyệt", yKienLanhDao: "", danhSachDon: initialRows }); } }} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                    <PenLine size={12} /> Trình ký
                  </button>
                )}
                {status === "da_ky" && (
                  <div className="flex items-center gap-1.5 h-[28px] px-3 border border-[#27ae60] text-[#27ae60] rounded-[3px] text-[11px] font-bold">
                    <Check size={12} /> Đã ký
                  </div>
                )}
              </div>
            </div>
            {localRows.length === 0 ? (
              <div className="border border-[#ddd] rounded-[3px] py-8 text-center text-[12px] text-[#999]">
                Chưa có đơn nào
              </div>
            ) : (
              <div className="space-y-4">
                {(Object.entries(groupedRows) as [string, typeof localRows][]).map(([groupName, gRows]) => (
                  <div key={groupName}>
                    {loai === "Tờ trình" && (
                      <div className="bg-[#e8f0fe] text-[#1a5a96] font-semibold text-[13px] px-3 py-1.5 rounded-t-[3px] border border-[#c5d8f8] border-b-0">
                        Thẩm phán: {groupName} ({gRows.length} đơn)
                      </div>
                    )}
                    <table className="w-full border-collapse text-[12px]">
                      <thead>
                        <tr className="bg-[#f5f5f5]">
                          <th className="border border-[#ddd] px-2 py-[6px] text-center font-semibold text-[#333] w-[36px]">STT</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[90px]">Số công văn</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Thông tin người gửi</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Thông tin đơn</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[110px]">Người duyệt</th>
                          <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[110px]">Người ký</th>
                          <th className="border border-[#ddd] px-2 py-[6px] text-center font-semibold text-[#333] w-[90px]">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gRows.map((row: (typeof localRows)[0], i: number) => {
                          const d = row.thongTinDon;
                          return (
                            <tr key={row.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                              <td className="border border-[#ddd] px-2 py-2 text-center">{i + 1}</td>
                              <td className="border border-[#ddd] px-3 py-2">
                                {loai === "Tờ trình" ? (
                                  <span className="text-[#999] font-bold">—</span>
                                ) : status !== "tao_van_ban" && status !== "lay_so" ? (
                                  <div className="space-y-1.5">
                                    <div className="font-medium text-[#1d2e4f] text-[11px] mb-1">{getSoCongVan(row.id, i)}</div>
                                    {/* Combobox chọn công văn kèm theo (cho loại khác Tờ trình) */}
                                    <div className="relative">
                                      <button
                                        onClick={() => setOpenDropRow(openDropRow === row.id ? null : row.id)}
                                        className="flex items-center justify-between w-full h-[26px] px-2 border border-[#ccc] rounded-[3px] bg-white text-[11px] text-[#333] hover:border-[#1a73e8] transition-colors">
                                        <span className="truncate text-[#666]">
                                          {(selectedCongVan[row.id] ?? []).length === 0
                                            ? "Văn bản kèm theo..."
                                            : `${(selectedCongVan[row.id] ?? []).length} văn bản`}
                                        </span>
                                        <ChevronDown size={10} className="shrink-0 text-[#888] ml-1" />
                                      </button>
                                      {openDropRow === row.id && (
                                        <div className="absolute left-0 top-[28px] z-50 bg-white border border-[#ccc] rounded-[3px] shadow-lg w-[220px]">
                                          {CONG_VAN_OPTIONS.map(opt => (
                                            <label key={opt}
                                              className="flex items-center gap-2 px-2 py-[5px] hover:bg-[#f0f7ff] cursor-pointer text-[11px] text-[#333]">
                                              <input type="checkbox"
                                                className="w-[12px] h-[12px] accent-[#8b1a1a] shrink-0"
                                                checked={(selectedCongVan[row.id] ?? []).includes(opt)}
                                                onChange={() => toggleCongVan(row.id, opt)} />
                                              {opt}
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {(selectedCongVan[row.id] ?? []).map((cv, ci) => (
                                      <button key={ci} onClick={onXemBieuMau}
                                        className="flex items-center gap-1 text-left w-full group mt-1">
                                        <FileText size={10} className="text-[#2980b9] shrink-0" />
                                        <span className="text-[10px] text-[#2980b9] group-hover:underline leading-snug truncate">{cv}</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[#999]">—</span>
                                )}
                              </td>
                              <td className="border border-[#ddd] px-3 py-2">
                                {loai === "Tờ trình" ? (
                                  <div className="space-y-1.5">
                                    <div className="font-semibold text-[#8b1a1a]">Tờ trình</div>
                                    <div className="relative">
                                      <button
                                        onClick={() => setOpenDropRow(openDropRow === row.id ? null : row.id)}
                                        className="flex items-center justify-between w-full h-[26px] px-2 border border-[#ccc] rounded-[3px] bg-[#fffaf7] text-[11px] text-[#333] hover:border-[#8b1a1a] transition-colors">
                                        <span className="truncate text-[#666]">
                                          {(selectedCongVan[row.id] ?? []).length === 0
                                            ? "Văn bản kèm theo..."
                                            : `${(selectedCongVan[row.id] ?? []).length} văn bản`}
                                        </span>
                                        <ChevronDown size={10} className="shrink-0 text-[#888] ml-1" />
                                      </button>
                                      {openDropRow === row.id && (
                                        <div className="absolute left-0 top-[28px] z-50 bg-white border border-[#ccc] rounded-[3px] shadow-lg w-[220px]">
                                          {CONG_VAN_OPTIONS.map(opt => (
                                            <label key={opt}
                                              className="flex items-center gap-2 px-2 py-[5px] hover:bg-[#fff5f5] cursor-pointer text-[11px] text-[#333]">
                                              <input type="checkbox"
                                                className="w-[12px] h-[12px] accent-[#8b1a1a] shrink-0"
                                                checked={(selectedCongVan[row.id] ?? []).includes(opt)}
                                                onChange={() => toggleCongVan(row.id, opt)} />
                                              {opt}
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {(selectedCongVan[row.id] ?? []).map((cv, ci) => (
                                      <button key={ci} onClick={onXemBieuMau}
                                        className="flex items-center gap-1 text-left w-full group mt-1">
                                        <FileText size={10} className="text-[#8b1a1a] shrink-0" />
                                        <span className="text-[10px] text-[#8b1a1a] group-hover:underline leading-snug truncate">{cv}</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    <div className="font-medium text-[#1a5a96] leading-snug">{row.nguoiGui}</div>
                                    <div className="text-[11px] text-[#666] mt-0.5 leading-snug">{row.diaChi}</div>
                                  </>
                                )}
                              </td>
                              <td className="border border-[#ddd] px-3 py-2">
                                <div className="space-y-[2px] leading-snug">
                                  <div><span className="text-[#888]">Thông tin giải quyết: </span><span>{row.giaiQuyet.nhan}</span></div>
                                  <div><span className="text-[#888]">Người đứng đơn: </span><span>{row.nguoiGui}</span></div>
                                  <div><span className="text-[#888]">Ngày trên đơn: </span><span>{d.ngayCV}</span></div>
                                  <div><span className="text-[#888]">Ngày nhận: </span><span>{row.ngayNhap}</span></div>
                                  <div><span className="text-[#888]">Mã đơn: </span><span className="font-medium text-[#1a5a96]">{row.maDon}</span></div>
                                  <div><span className="text-[#888]">Hình thức: </span><span>{d.hinhThuc}</span></div>
                                  <div><span className="text-[#888]">Số BA/QĐ: </span><span>{d.soBaqd}</span></div>
                                  <div><span className="text-[#888]">Ngày: </span><span>{d.ngay}</span></div>
                                  <div><span className="text-[#888]">Thủ tục giải quyết: </span><span>{d.thuTuc}</span></div>
                                  <div><span className="text-[#888]">Thẩm phán: </span><span>{d.thamPhan || "—"}</span></div>
                                  <div className="mt-1">
                                    <span className="inline-block px-1.5 py-[1px] rounded text-[10px] bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8]">Chưa chuyển</span>
                                    <span className="text-[#888] ml-1 text-[11px]">{d.donViGiaiQuyet}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="border border-[#ddd] px-2 py-2">
                                {loai === "Tờ trình" ? (
                                  <select
                                    value={nguoiDuyetRow[row.id] ?? nguoiDuyet}
                                    onChange={(e) => setNguoiDuyetRow({ ...nguoiDuyetRow, [row.id]: e.target.value })}
                                    className="w-full h-[26px] px-1 text-[11px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]"
                                  >
                                    <option value="">Chọn người duyệt...</option>
                                    {NGUOI_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                  </select>
                                ) : (
                                  <div className="text-[11px] text-[#555]">{nguoiDuyet || "—"}</div>
                                )}
                              </td>
                              <td className="border border-[#ddd] px-2 py-2">
                                {loai === "Tờ trình" ? (
                                  <select
                                    value={nguoiKyRow[row.id] ?? nguoiKy}
                                    onChange={(e) => setNguoiKyRow({ ...nguoiKyRow, [row.id]: e.target.value })}
                                    className="w-full h-[26px] px-1 text-[11px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]"
                                  >
                                    <option value="">Chọn người ký...</option>
                                    {NGUOI_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                  </select>
                                ) : (
                                  <div className="text-[11px] text-[#555]">{nguoiKy || "—"}</div>
                                )}
                              </td>
                              <td className="border border-[#ddd] px-2 py-2">
                                <div className="flex flex-col items-center gap-1">
                                  {/* Xem biểu mẫu */}
                                  <button
                                    onClick={onXemBieuMau}
                                    className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8] hover:bg-[#d0e3fc] transition-colors whitespace-nowrap">
                                    <Eye size={11} /> Xem biểu mẫu
                                  </button>
                                  {/* Xóa */}
                                  <button
                                    onClick={() => removeRow(row.id)}
                                    className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                                    <Trash2 size={11} /> Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          {/* Nút sau khi lưu */}
          {status !== "tao_van_ban" ? (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 h-[32px] px-3 bg-[#27ae60] hover:bg-[#1e8449] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <ArrowDownToLine size={13} /> Lấy số
              </button>
              <button className="flex items-center gap-1.5 h-[32px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <Send size={13} /> Trình ký
              </button>
            </div>
          ) : <div />}
          <div className="flex items-center gap-2">
            <BtnSecondary onClick={onClose}>Hủy</BtnSecondary>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopupTraLaiDon = ({
  count,
  reason,
  onChangeReason,
  isTruongPhong,
  onClose,
  onConfirm,
}: {
  count: number;
  reason: string;
  onChangeReason: (value: string) => void;
  isTruongPhong: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [suaDon, setSuaDon] = useState(false);
  const [tachDon, setTachDon] = useState(false);
  const [tachSoDon, setTachSoDon] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-[480px] max-w-full border border-[#bbb]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
          <div>
            <div className="text-[15px] font-semibold text-[#1d2e4f]">Trả lại đơn</div>
            <div className="text-[12px] text-[#555]">Đang trả lại {count} đơn đã chọn</div>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-[#333]"><X size={16} /></button>
        </div>
        <div className="px-4 py-4 space-y-4 text-[12px]">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-[12px] text-[#333]">
              <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]" checked={suaDon} onChange={() => setSuaDon(prev => !prev)} />
              Sửa đơn
            </label>
            <label className="flex flex-col gap-2 text-[12px] text-[#333]">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-[14px] h-[14px] accent-[#8b1a1a]"
                  checked={tachDon}
                  onChange={() => {
                    setTachDon(prev => {
                      const nextState = !prev;
                      if (!nextState) setTachSoDon("");
                      return nextState;
                    });
                  }}
                />
                Tách đơn
              </span>
              {tachDon && (
                <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                  <label className="text-[12px] text-[#333]">Số đơn muốn tách</label>
                  <input
                    type="text"
                    value={tachSoDon}
                    onChange={e => setTachSoDon(e.target.value)}
                    placeholder="Nhập số đơn"
                    className="w-full h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]"
                  />
                </div>
              )}
            </label>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-1">Lý do trả lại <span className="text-red-500">*</span></label>
            <textarea
              value={reason}
              onChange={e => onChangeReason(e.target.value)}
              rows={5}
              className="w-full border border-[#ccc] rounded-[3px] px-2 py-2 text-[12px] focus:outline-none focus:border-[#1a73e8] resize-none"
              placeholder="Nhập lý do trả lại đơn..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#e0e0e0]">
          <button onClick={onClose}
            className="h-[34px] px-4 border border-[#ccc] text-[#444] rounded-[3px] text-[12px] hover:bg-[#f5f5f5]">
            Hủy
          </button>
          <button
            disabled={!reason.trim()}
            onClick={onConfirm}
            className="h-[34px] px-4 rounded-[3px] text-[12px] font-medium text-white bg-[#8b1a1a] hover:bg-[#6e1414] disabled:bg-[#ccc] disabled:cursor-not-allowed"
          >
            Xác nhận trả lại
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Prototype: Luồng Ghép đơn ───────────────────────────────────────────────

const PROTO_STEPS_TH1 = [
  { label: "Trạng thái ban đầu" },
  { label: "Popup Ghép đơn" },
  { label: "Popup Xác nhận" },
  { label: "Kết quả ghép" },
];

const PROTO_STEPS_TH2 = [
  { label: "Trạng thái ban đầu" },
  { label: "Popup Ghép đơn" },
  { label: "Popup Xác nhận" },
  { label: "Chờ B xác nhận" },
  { label: "B xác nhận" },
  { label: "Kết quả ghép" },
];

function protoStepDesc(step: number, th: 1 | 2): string {
  if (th === 1) return ([
    "Cán bộ A quản lý cả 2 đơn: 7031 (Thụ lý mới) và 7025 (Chưa đủ điều kiện).",
    "A nhấn ··· → Ghép đơn trên đơn 7031. Popup hiển thị danh sách đơn đủ điều kiện ghép.",
    "A chọn đơn 7025 và nhấn Tiếp tục. Vì cùng cán bộ nên chỉ cần A xác nhận.",
    "Ghép hoàn tất. Đơn 7025 xuất hiện trong Danh sách đơn thụ lý kèm của đơn 7031.",
  ] as string[])[step] ?? "";
  return ([
    "Cán bộ A có đơn 7031 (Thụ lý mới). Cán bộ B có đơn 7025 (Chưa đủ điều kiện).",
    "A nhấn ··· → Ghép đơn trên đơn 7031. Popup hiển thị đơn 7025 của cán bộ B.",
    "A xác nhận ghép. Hệ thống gửi yêu cầu tới cán bộ B — chờ B xác nhận.",
    "A thấy 'Chờ B xác nhận'. Cán bộ B thấy nút 'Xác nhận ghép đơn' trên đơn 7025.",
    "B nhấn nút xác nhận → popup xác nhận của B hiện ra để B đồng ý hoặc từ chối.",
    "Ghép hoàn tất. Cả A và B đều thấy nhãn 'Đã ghép với...' và Danh sách đơn thụ lý kèm.",
  ] as string[])[step] ?? "";
}

function protoBRNotes(step: number, th: 1 | 2): { br: string; text: string }[] {
  if (step === 0) return [
    { br: "BR-01 TH3", text: "Đơn chính ở trạng thái Thụ lý mới có thể ghép với đơn Chưa đủ điều kiện." },
    { br: "BR-02", text: "Popup chỉ hiển thị đơn chưa đủ điều kiện và chưa được ghép với bất kỳ đơn nào." },
  ];
  if (step === 1) return [
    { br: "BR-02", text: "Danh sách trong popup lọc theo: chưa đủ điều kiện + chưa được ghép." },
  ];
  if (step === 2) return [
    { br: "BR-03", text: th === 1 ? "TH1: Cùng cán bộ — chỉ cần xác nhận của cán bộ A, ghép ngay." : "TH2: Khác cán bộ — cần cán bộ B xác nhận trước mới hoàn tất ghép." },
  ];
  if (step >= 3) return [
    { br: "BR-04", text: "Trạng thái đơn chính không đổi (Thụ lý mới). Đơn kèm giữ nguyên trạng thái Chưa đủ điều kiện." },
    { br: "BR-04", text: "Đơn kèm gắn nhãn 'Đã ghép với [mã]' và hiển thị trong Danh sách đơn thụ lý kèm của đơn chính." },
  ];
  return [];
}

const ProtoRow = ({
  maDon, nguoiGui, ngayNhap, trangThai, trangThaiColor = "#888", extra, showAction = false,
}: {
  maDon: string; nguoiGui: string; ngayNhap: string;
  trangThai: string; trangThaiColor?: string;
  extra?: React.ReactNode; showAction?: boolean;
}) => (
  <div className="border border-[#ddd] rounded-[3px] p-2.5 bg-white text-[12px]">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <span className="font-semibold text-[#1d2e4f] text-[11px]">Mã {maDon}</span>
          <span className="px-1.5 py-[1px] rounded text-[9px] font-medium text-white"
            style={{ backgroundColor: trangThaiColor }}>{trangThai}</span>
        </div>
        <div className="text-[#444] text-[11px] leading-snug mb-0.5">{nguoiGui}</div>
        <div className="text-[#aaa] text-[10px]">Nhập: {ngayNhap}</div>
        {extra && <div className="mt-1.5">{extra}</div>}
      </div>
      {showAction && (
        <button className="w-[24px] h-[24px] flex items-center justify-center rounded border border-[#ddd] hover:bg-[#f0f0f0] text-[#555] text-[12px] flex-shrink-0">···</button>
      )}
    </div>
  </div>
);

const ProtoMergeBadge = ({ maDon }: { maDon: string }) => (
  <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded border border-[#27ae60] bg-[#eafaf1] text-[10px] font-medium text-[#27ae60]">
    <GitMerge size={10} /> Đã ghép với {maDon}
  </span>
);

const PrototypeGhepDon = () => {
  const [th, setTh] = useState<1 | 2>(2);
  const [step, setStep] = useState(0);

  const steps = th === 1 ? PROTO_STEPS_TH1 : PROTO_STEPS_TH2;
  const maxStep = steps.length - 1;

  const goStep = (s: number) => setStep(Math.max(0, Math.min(maxStep, s)));
  const handleTHChange = (t: 1 | 2) => { setTh(t); setStep(0); };

  const showPopupGhep = step === 1;
  const showPopupXacNhan = step === 2;
  const showPopupBConfirm = th === 2 && step === 4;

  // TH1: A controls both dons
  // TH2: A has 7031, B has 7025
  const aDonMerged = th === 1 ? step >= 3 : step >= 5;
  const aDonPending = th === 2 && step >= 3 && step <= 4;
  const bDonMerged = step >= 5;
  const bDonPending = th === 2 && step >= 3 && step <= 4;

  const renderARows = () => (
    <>
      <ProtoRow maDon="7031" nguoiGui="Tòa án nhân dân tỉnh Bắc Ninh"
        ngayNhap="21/07/2026" trangThai="Thụ lý mới" trangThaiColor="#e67e22" showAction
        extra={
          aDonMerged ? (
            <div className="space-y-2">
              <ProtoMergeBadge maDon="7025" />
              <div className="border border-[#b0d4e8] rounded-[3px] bg-[#f0f7ff] p-2">
                <div className="font-semibold text-[#1d2e4f] text-[11px] mb-1.5 flex items-center gap-1">
                  <List size={11} /> Danh sách đơn thụ lý kèm
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#e0e0e0] rounded px-2 py-1 text-[11px]">
                  <GitMerge size={11} className="text-[#27ae60]" />
                  <span className="font-medium text-[#333]">Mã 7025</span>
                  <span className="text-[#666]">— Nguyễn Thị Hoa</span>
                  <span className="ml-auto px-1.5 py-[1px] rounded text-[9px] bg-[#e67e22] text-white font-medium">Chưa đủ ĐK</span>
                </div>
              </div>
            </div>
          ) : aDonPending ? (
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded border border-[#ffc107] bg-[#fff3cd] text-[10px] font-medium text-[#856404]">
              <Clock size={10} /> Đã gửi yêu cầu ghép · Chờ B xác nhận
            </span>
          ) : undefined
        }
      />
      {/* TH1: A also has don 7025 */}
      {th === 1 && (
        <ProtoRow maDon="7025" nguoiGui="Nguyễn Thị Hoa"
          ngayNhap="18/07/2026" trangThai="Chưa đủ điều kiện" trangThaiColor="#e67e22"
          extra={aDonMerged ? <ProtoMergeBadge maDon="7031" /> : undefined}
        />
      )}
    </>
  );

  const renderBRows = () => (
    <ProtoRow maDon="7025" nguoiGui="Nguyễn Thị Hoa"
      ngayNhap="18/07/2026" trangThai="Chưa đủ điều kiện" trangThaiColor="#e67e22"
      extra={
        bDonMerged ? <ProtoMergeBadge maDon="7031" /> :
          bDonPending ? (
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded border border-[#ffc107] bg-[#fff3cd] text-[10px] font-medium text-[#856404]">
                <GitMerge size={10} /> Đang được yêu cầu ghép với 7031
              </span>
              <button onClick={() => goStep(4)}
                className="flex items-center gap-1 px-2 py-[3px] rounded border border-[#ffc107] bg-[#fff3cd] text-[10px] font-medium text-[#856404] hover:bg-[#ffe69c] transition-colors w-fit">
                <Check size={10} /> Xác nhận ghép đơn
              </button>
            </div>
          ) : undefined
      }
    />
  );

  const renderPopupGhep = () => (
    <div className="absolute inset-0 bg-black/30 flex items-start justify-center z-10 pt-6 px-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[500px] border border-[#bbb]">
        <div className="flex items-center justify-between bg-[#1d2e4f] px-3 py-[9px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white text-[13px] font-semibold">
            <GitMerge size={13} /> Ghép đơn
          </div>
          <button onClick={() => goStep(0)} className="text-white/70 hover:text-white"><X size={15} /></button>
        </div>
        <div className="px-3 pt-2 pb-1 bg-[#f9f9f9] border-b border-[#eee]">
          <p className="text-[11px] text-[#555] mb-0.5">Đơn chính</p>
          <p className="text-[12px] font-semibold text-[#1d2e4f]">Mã 7031 — Tòa án nhân dân tỉnh Bắc Ninh</p>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[11px] text-[#555] mb-1.5">Chọn đơn để ghép vào (chưa đủ điều kiện, chưa được ghép):</p>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                <th className="border border-[#ddd] px-2 py-[5px] w-7"><input type="checkbox" className="w-[12px] h-[12px] accent-[#8b1a1a]" /></th>
                <th className="border border-[#ddd] px-2 py-[5px] text-left font-semibold">Mã</th>
                <th className="border border-[#ddd] px-2 py-[5px] text-left font-semibold">Người gửi</th>
                <th className="border border-[#ddd] px-2 py-[5px] text-left font-semibold">Ngày nhập</th>
                <th className="border border-[#ddd] px-2 py-[5px] text-left font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "7025", nguoi: "Nguyễn Thị Hoa", ngay: "18/07", checked: true },
                { id: "7022", nguoi: "TAND tỉnh Vĩnh Phúc", ngay: "15/07", checked: false },
                { id: "7019", nguoi: "Trần Văn Bình", ngay: "12/07", checked: false },
              ].map((r, i) => (
                <tr key={i} className={r.checked ? "bg-[#fdeaea]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                  <td className="border border-[#ddd] px-2 py-[5px] text-center">
                    <input type="checkbox" className="w-[12px] h-[12px] accent-[#8b1a1a]" defaultChecked={r.checked} />
                  </td>
                  <td className="border border-[#ddd] px-2 py-[5px] font-medium text-[#1a5a96]">{r.id}</td>
                  <td className="border border-[#ddd] px-2 py-[5px]">{r.nguoi}</td>
                  <td className="border border-[#ddd] px-2 py-[5px] text-[#888]">{r.ngay}</td>
                  <td className="border border-[#ddd] px-2 py-[5px]">
                    <span className="px-1.5 py-[1px] rounded text-[9px] font-medium bg-[#e67e22] text-white">Chưa đủ ĐK</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-[#1d2e4f] mt-1.5 font-medium">Đã chọn 1 đơn để ghép.</p>
        </div>
        <div className="flex justify-end gap-2 px-3 py-2 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={() => goStep(0)}>Hủy</BtnSecondary>
          <BtnPrimary onClick={() => goStep(2)}><GitMerge size={12} /> Tiếp tục</BtnPrimary>
        </div>
      </div>
    </div>
  );

  const renderPopupXacNhan = () => (
    <div className="absolute inset-0 bg-black/30 flex items-start justify-center z-10 pt-6 px-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[460px] border border-[#bbb]">
        <div className="flex items-center justify-between bg-[#1d2e4f] px-3 py-[9px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white text-[13px] font-semibold">
            <Check size={13} /> Xác nhận ghép đơn
          </div>
          <button onClick={() => goStep(1)} className="text-white/70 hover:text-white"><X size={15} /></button>
        </div>
        <div className="px-3 py-3 space-y-2 text-[12px]">
          <div className={`px-3 py-2 rounded border text-[11px] font-medium ${th === 1 ? "bg-[#e8f5e9] border-[#81c784] text-[#2e7d32]" : "bg-[#fff3cd] border-[#ffc107] text-[#856404]"}`}>
            {th === 1 ? "✓ TH1: Cùng 1 cán bộ — Chỉ cần xác nhận của cán bộ A để ghép ngay" : "⚠ TH2: 2 cán bộ khác nhau — Sau khi A xác nhận, cán bộ B cần xác nhận để hoàn tất"}
          </div>
          <div className="border border-[#ddd] rounded p-2 bg-[#f0f7ff]">
            <p className="text-[11px] text-[#888] mb-0.5">Đơn chính</p>
            <span className="font-semibold text-[#1d2e4f]">Mã 7031</span>
            <span className="text-[#666] ml-2 text-[11px]">Tòa án nhân dân tỉnh Bắc Ninh</span>
          </div>
          <div className="border border-[#ddd] rounded p-2 bg-white">
            <p className="text-[11px] text-[#888] mb-0.5">Đơn được ghép vào</p>
            <span className="font-semibold text-[#1a5a96]">Mã 7025</span>
            <span className="text-[#666] ml-2 text-[11px]">Nguyễn Thị Hoa — Chưa đủ ĐK</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-3 py-2 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={() => goStep(1)}>Hủy</BtnSecondary>
          <BtnPrimary onClick={() => goStep(th === 1 ? 3 : 3)}><Check size={12} /> Xác nhận ghép đơn</BtnPrimary>
        </div>
      </div>
    </div>
  );

  const renderPopupBConfirm = () => (
    <div className="absolute inset-0 bg-black/30 flex items-start justify-center z-10 pt-6 px-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[420px] border border-[#2980b9]">
        <div className="flex items-center justify-between bg-[#2980b9] px-3 py-[9px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white text-[13px] font-semibold">
            <GitMerge size={13} /> Xác nhận ghép đơn (Cán bộ B)
          </div>
          <button onClick={() => goStep(3)} className="text-white/70 hover:text-white"><X size={15} /></button>
        </div>
        <div className="px-3 py-3 space-y-2 text-[12px]">
          <div className="bg-[#fff3cd] border border-[#ffc107] rounded px-3 py-2 text-[11px] font-medium text-[#856404]">
            Cán bộ A gửi yêu cầu ghép đơn của bạn vào đơn chính. Bạn có muốn xác nhận?
          </div>
          <div className="border border-[#ddd] rounded p-2 bg-[#f0f7ff]">
            <p className="text-[11px] text-[#888] mb-0.5">Đơn chính (Cán bộ A)</p>
            <span className="font-semibold text-[#1d2e4f]">Mã 7031</span>
            <span className="text-[#666] ml-2 text-[11px]">Tòa án nhân dân tỉnh Bắc Ninh</span>
            <div className="mt-0.5"><span className="px-1.5 py-[1px] rounded text-[9px] font-medium bg-[#e67e22] text-white">Thụ lý mới</span></div>
          </div>
          <div className="border border-[#2980b9] rounded p-2 bg-[#f0f7ff]">
            <p className="text-[11px] text-[#888] mb-0.5">Đơn của bạn (Cán bộ B)</p>
            <span className="font-semibold text-[#2980b9]">Mã 7025</span>
            <span className="text-[#666] ml-2 text-[11px]">Nguyễn Thị Hoa</span>
            <div className="mt-0.5"><span className="px-1.5 py-[1px] rounded text-[9px] font-medium bg-[#e67e22] text-white">Chưa đủ ĐK</span></div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-3 py-2 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={() => goStep(3)}>Từ chối</BtnSecondary>
          <BtnPrimary onClick={() => goStep(5)}><Check size={12} /> Xác nhận ghép đơn</BtnPrimary>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#eef1f5] min-h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#ddd] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-[14px] font-semibold text-[#222]">Prototype · Luồng Ghép đơn</h2>
          <p className="text-[11px] text-[#888]">Mô phỏng tương tác theo SRS — BR-01 đến BR-04</p>
        </div>
        <div className="flex items-center gap-1 bg-[#f0f0f0] rounded-[4px] p-[3px]">
          {([1, 2] as const).map(t => (
            <button key={t} onClick={() => handleTHChange(t)}
              className={`px-3 py-[5px] rounded-[3px] text-[12px] font-medium transition-all ${th === t ? "bg-white shadow text-[#1d2e4f] border border-[#ccc]" : "text-[#666] hover:text-[#333]"}`}>
              {t === 1 ? "TH1: Cùng cán bộ" : "TH2: Khác cán bộ"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 gap-4 p-4 overflow-auto">
        {/* Step navigator */}
        <div className="w-[185px] flex-shrink-0 space-y-3">
          <div className="bg-white border border-[#ddd] rounded-[4px] overflow-hidden">
            <div className="px-3 py-2 bg-[#f5f5f5] border-b border-[#ddd]">
              <span className="text-[12px] font-semibold text-[#333]">Các bước</span>
            </div>
            <div className="p-2 space-y-0.5">
              {steps.map((s, i) => (
                <button key={i} onClick={() => goStep(i)}
                  className={`w-full text-left px-2 py-[7px] rounded-[3px] text-[12px] flex items-center gap-2 transition-colors ${step === i ? "bg-[#fdeaea] text-[#8b1a1a] font-semibold" : "text-[#555] hover:bg-[#f5f5f5]"}`}>
                  <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${step === i ? "bg-[#8b1a1a] text-white" : i < step ? "bg-[#27ae60] text-white" : "bg-[#e0e0e0] text-[#888]"}`}>
                    {i < step ? "✓" : i + 1}
                  </span>
                  <span className="leading-tight text-[11px]">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => goStep(step - 1)} disabled={step === 0}
              className="flex-1 py-[6px] text-[11px] border border-[#ccc] rounded-[3px] bg-white text-[#555] hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed">← Trước</button>
            <button onClick={() => goStep(step + 1)} disabled={step === maxStep}
              className="flex-1 py-[6px] text-[11px] bg-[#1d2e4f] text-white rounded-[3px] hover:bg-[#16253d] disabled:opacity-40 disabled:cursor-not-allowed">Tiếp →</button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 space-y-3 min-w-0 flex flex-col">
          {/* Step description */}
          <div className="bg-[#1d2e4f] rounded-[4px] px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">{step + 1}</span>
            <div>
              <p className="text-white font-semibold text-[12px]">{steps[step].label}</p>
              <p className="text-white/70 text-[11px] mt-0.5 leading-snug">{protoStepDesc(step, th)}</p>
            </div>
          </div>

          {/* Dual panel */}
          <div className="relative flex gap-3 flex-1" style={{ minHeight: 280 }}>
            {/* A panel */}
            <div className="flex-1 bg-white border border-[#ddd] rounded-[4px] p-3">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#eee]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1d2e4f] flex-shrink-0" />
                <span className="text-[12px] font-bold text-[#1d2e4f]">Cán bộ A</span>
                {th === 1 && <span className="text-[9px] bg-[#eee] text-[#666] px-1.5 py-[1px] rounded-full ml-1">Quản lý cả 2 đơn</span>}
              </div>
              <div className="space-y-2">{renderARows()}</div>
            </div>

            {/* B panel (TH2) */}
            {th === 2 && (
              <div className="flex-1 bg-white border border-[#2980b9]/40 rounded-[4px] p-3">
                <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#eee]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2980b9] flex-shrink-0" />
                  <span className="text-[12px] font-bold text-[#2980b9]">Cán bộ B</span>
                </div>
                <div className="space-y-2">{renderBRows()}</div>
              </div>
            )}

            {showPopupGhep && renderPopupGhep()}
            {showPopupXacNhan && renderPopupXacNhan()}
            {showPopupBConfirm && renderPopupBConfirm()}
          </div>

          {/* BR notes */}
          <div className="bg-white border border-[#ddd] rounded-[4px] p-3 flex-shrink-0">
            <p className="text-[11px] font-semibold text-[#333] mb-1.5">Quy tắc nghiệp vụ áp dụng</p>
            <div className="space-y-1">
              {protoBRNotes(step, th).map((n, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className="font-bold text-[#8b1a1a] flex-shrink-0 min-w-[70px]">{n.br}</span>
                  <span className="text-[#555]">{n.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Các loại hình thức được coi là "Đơn" → hiện block Thông tin đơn
const LOAI_DON = new Set([
  "Đơn đề nghị GĐT-TT",
  "Đơn khiếu nại tư pháp - tố tụng",
  "Thông báo phát hiện vi phạm pháp luật",
  "Đơn khác",
]);
const LOAI_KHANG_NGHI = "";

// ─── Word Editor ─────────────────────────────────────────────────────────────
const WordEditor = ({ onBack }: { onBack: () => void }) => {
  const [content, setContent] = useState(`CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
───────────────────────────────

TÒA ÁN NHÂN DÂN TỐI CAO
Số: ____/2026/TANDTC-VP

THÔNG BÁO
Về việc phân công Thẩm phán xem xét đơn đề nghị giám đốc thẩm, tái thẩm

Kính gửi: ...

Căn cứ Bộ luật Tố tụng dân sự năm 2015;
Căn cứ Luật Tổ chức Tòa án nhân dân năm 2014;

Tòa án nhân dân tối cao thông báo phân công Thẩm phán như sau:

1. Thẩm phán được phân công: ...
2. Nhiệm vụ: Xem xét đơn đề nghị giám đốc thẩm số ...
3. Thời hạn giải quyết: ...

Nơi nhận:
- Như trên;
- Lưu VP.

                                    TL. CHÁNH ÁN
                                    KT. CHÁNH VĂN PHÒNG
                                    PHÓ CHÁNH VĂN PHÒNG

                                    (đã ký)

                                    Phạm Văn Nha`);

  return (
    <div className="flex flex-col h-full bg-[#eef1f5]">
      {/* Toolbar */}
      <div className="bg-white border-b border-[#ddd] px-4 py-2 flex items-center gap-2 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1 text-[12px] text-[#1a5a96] hover:underline mr-2">
          <ChevronRight size={13} className="rotate-180" /> Quay lại
        </button>
        <div className="h-4 w-px bg-[#ddd] mr-1" />
        {["B", "I", "U"].map(f => (
          <button key={f} className="w-[26px] h-[26px] rounded border border-[#ccc] text-[12px] font-bold hover:bg-[#f0f0f0] flex items-center justify-center">
            {f}
          </button>
        ))}
        <div className="h-4 w-px bg-[#ddd] mx-1" />
        <select className="h-[26px] px-1 text-[12px] border border-[#ccc] rounded-[2px] bg-white">
          <option>Times New Roman</option><option>Arial</option>
        </select>
        <select className="h-[26px] px-1 text-[12px] border border-[#ccc] rounded-[2px] bg-white w-[52px]">
          {[10, 11, 12, 13, 14].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 h-[28px] px-3 bg-[#27ae60] hover:bg-[#1e8449] text-white rounded-[3px] text-[12px] font-medium transition-colors">
          <ArrowDownToLine size={12} /> Lấy số
        </button>
        <button className="flex items-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">
          <Send size={12} /> Trình ký
        </button>
        <button className="flex items-center gap-1.5 h-[28px] px-3 bg-[#2980b9] hover:bg-[#1a6a9a] text-white rounded-[3px] text-[12px] font-medium transition-colors">
          <Download size={12} /> Tải xuống
        </button>
        <button className="flex items-center gap-1.5 h-[28px] px-3 bg-[#1d2e4f] hover:bg-[#162440] text-white rounded-[3px] text-[12px] font-medium transition-colors">
          <Save size={12} /> Lưu
        </button>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-auto flex justify-center py-6 px-4">
        <div className="bg-white shadow-md w-[794px] min-h-[1123px] relative">
          {/* Page margin area */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="absolute inset-0 w-full h-full resize-none p-[80px] text-[13px] font-['Times_New_Roman',serif] leading-relaxed text-[#222] focus:outline-none bg-transparent"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Danh sách biểu mẫu đơn ──────────────────────────────────────────────────
const BIEU_MAU_ROWS = [
  { id: 1, tenQD: "Thông báo phân công Thẩm phán", soQD: "54682577/2026/TANDTC-TB", ngayQD: "21/07/2026", nguoiKy: "Phạm Văn Nha", trangThai: "Đã có hiệu lực", nguoiTao: "Vũ Văn Yên" },
  { id: 2, tenQD: "Tờ trình thụ lý lại", soQD: "107/2026/TTr-TANDTC-VP", ngayQD: "21/07/2026", nguoiKy: "Phạm Văn Nha", trangThai: "Đã có hiệu lực", nguoiTao: "Vũ Văn Yên" },
  { id: 3, tenQD: "Công văn gửi nội bộ", soQD: "545/2026/TANDTC-VP", ngayQD: "21/07/2026", nguoiKy: "Phạm Văn Nha", trangThai: "Đã có hiệu lực", nguoiTao: "Vũ Văn Yên" },
];

const DanhSachBieuMau = ({
  row, onBack,
}: {
  row: typeof SAMPLE_ROWS[0];
  onBack: () => void;
}) => {
  const d = row.thongTinDon;
  const infoLeft = [
    { label: "Số bản án", value: d.soBaqd },
    { label: "Ngày bản án", value: d.ngay },
    { label: "Tòa xét xử", value: d.toaXetXu ?? "—" },
    { label: "Mã đơn", value: row.maDon },
  ];
  const infoRight = [
    { label: "Người đứng đơn", value: row.nguoiGui },
    { label: "Địa chỉ người đứng đơn", value: row.diaChi },
    { label: "Nơi chuyển đến", value: "Nội bộ" },
    { label: "Đơn vị chuyển đến", value: d.donViGiaiQuyet },
  ];

  return (
    <div className="bg-[#eef1f5] min-h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#ddd] px-4 py-3">
        <div className="flex items-center gap-2 text-[13px] text-[#666] mb-2">
          <span className="hover:text-[#1a5a96] cursor-pointer" onClick={onBack}>Trang chủ</span>
          <ChevronRight size={12} />
          <span className="hover:text-[#1a5a96] cursor-pointer" onClick={onBack}>Quản lý đơn</span>
          <ChevronRight size={12} />
          <span className="text-[#333]">Danh sách biểu mẫu đơn</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-[#555] hover:text-[#222] p-1 rounded hover:bg-[#f0f0f0]">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <h1 className="text-[16px] font-semibold text-[#222]">Danh sách biểu mẫu</h1>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Thông tin đơn */}
        <div className="bg-white border border-[#ddd] rounded-[4px]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eee]">
            <span className="text-[13px] font-semibold text-[#333]">Thông tin đơn</span>
            <span className="px-3 py-[3px] rounded-full border border-[#e67e22] text-[12px] font-medium text-[#e67e22]">
              • {row.giaiQuyet.nhan}
            </span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-[#eee]">
            <table className="w-full text-[13px]">
              <tbody>
                {infoLeft.map(({ label, value }) => (
                  <tr key={label} className="border-b border-[#f5f5f5] last:border-0">
                    <td className="px-4 py-2.5 text-[#888] w-[160px] whitespace-nowrap">{label}</td>
                    <td className="px-4 py-2.5 font-medium text-[#222]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="w-full text-[13px]">
              <tbody>
                {infoRight.map(({ label, value }) => (
                  <tr key={label} className="border-b border-[#f5f5f5] last:border-0">
                    <td className="px-4 py-2.5 text-[#1a5a96] w-[200px] whitespace-nowrap">{label}</td>
                    <td className="px-4 py-2.5 font-medium text-[#222]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[#ccc] rounded-[3px] bg-white overflow-hidden h-[32px]">
            <input type="text" placeholder="Nhập từ khóa tìm kiếm"
              className="px-3 text-[12px] outline-none w-[220px] h-full" />
            <button className="w-[32px] h-[32px] bg-[#8b1a1a] flex items-center justify-center text-white flex-shrink-0">
              <Search size={13} />
            </button>
          </div>
          <div className="flex-1" />
          <BtnPrimary className="text-[12px] py-[5px] px-3 gap-1.5">
            <FileText size={13} /> Nhập hồi quyết định cũ
          </BtnPrimary>
          <BtnPrimary className="text-[12px] py-[5px] px-3 gap-1.5">
            <Plus size={13} /> Thêm biểu mẫu
          </BtnPrimary>
          <button className="w-[32px] h-[32px] border border-[#ccc] rounded-[3px] bg-white flex items-center justify-center text-[#555] hover:bg-[#f5f5f5]">
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#ddd] rounded-[4px] overflow-hidden">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[50px]">STT</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Tên quyết định</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Số QĐ</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] whitespace-nowrap">Ngày ra QĐ</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Người ký</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Trạng thái</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Người tạo</th>
                <th className="px-3 py-2.5 text-center font-semibold text-[#333]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {BIEU_MAU_ROWS.map((r, i) => (
                <tr key={r.id} className={`border-b border-[#f0f0f0] hover:bg-[#fafafa] ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                  <td className="px-3 py-2.5 text-[#1a5a96] font-medium">{r.id}</td>
                  <td className="px-3 py-2.5 font-semibold text-[#222]">{r.tenQD}</td>
                  <td className="px-3 py-2.5 text-[#1a5a96]">{r.soQD}</td>
                  <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{r.ngayQD}</td>
                  <td className="px-3 py-2.5 font-medium text-[#333]">{r.nguoiKy}</td>
                  <td className="px-3 py-2.5 text-[#27ae60] font-medium">{r.trangThai}</td>
                  <td className="px-3 py-2.5 text-[#555]">{r.nguoiTao}</td>
                  <td className="px-3 py-2.5 text-center">
                    <button className="text-[#555] hover:text-[#8b1a1a] transition-colors">
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-end px-4 py-2.5 border-t border-[#eee] text-[12px] text-[#666] gap-2">
            <span>Hiển thị 1-3 / 3</span>
            <button className="w-[26px] h-[26px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee]">‹</button>
            <button className="w-[26px] h-[26px] flex items-center justify-center border border-[#8b1a1a] rounded bg-[#8b1a1a] text-white">1</button>
            <button className="w-[26px] h-[26px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee]">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Phân công Thẩm phán ──────────────────────────────────────────────────────
const LOAI_AN_OPTIONS = [
  "Hình sự", "Dân sự", "Hành chính", "Kinh doanh thương mại",
  "Hôn nhân gia đình", "Lao động", "Sở hữu trí tuệ", "Phá sản",
];

const PHANCONG_SAMPLE: {
  id: number; soThuLy: string; ngayThuLy: string; nguoiDungDon: string; diaChi: string;
  soBA: string; ngayBA: string; toaBA: string; loaiAn: string; hinhThuc: string; thamPhan: string; capGiaiQuyet: "toicao" | "bac3";
}[] = [
    { id: 1, soThuLy: "01/2026/GĐT-HS", ngayThuLy: "05/07/2026", nguoiDungDon: "Nguyễn Văn An", diaChi: "Số 12 Lê Duẩn, Hà Nội", soBA: "15/2023/HS-PT", ngayBA: "12/03/2023", toaBA: "TAND tỉnh Bắc Ninh", loaiAn: "Hình sự", hinhThuc: "Đề nghị GĐT", thamPhan: "", capGiaiQuyet: "bac3" },
    { id: 2, soThuLy: "02/2026/GĐT-DS", ngayThuLy: "08/07/2026", nguoiDungDon: "Trần Thị Bình", diaChi: "45 Trần Hưng Đạo, TP.HCM", soBA: "08/2022/DS-PT", ngayBA: "20/06/2022", toaBA: "TAND tỉnh Vĩnh Phúc", loaiAn: "Dân sự", hinhThuc: "Đề nghị TT", thamPhan: "Nguyễn Thị Lan", capGiaiQuyet: "toicao" },
    { id: 3, soThuLy: "03/2026/GĐT-KDTM", ngayThuLy: "10/07/2026", nguoiDungDon: "Công ty TNHH Minh Đức", diaChi: "18 Nguyễn Huệ, Đà Nẵng", soBA: "33/2024/KDTM-PT", ngayBA: "15/11/2024", toaBA: "TAND cấp cao tại HN", loaiAn: "Kinh doanh thương mại", hinhThuc: "Đề nghị GĐT", thamPhan: "Trần Văn Hùng", capGiaiQuyet: "toicao" },
    { id: 4, soThuLy: "04/2026/TT-HC", ngayThuLy: "14/07/2026", nguoiDungDon: "Lê Văn Cường", diaChi: "72 Đinh Tiên Hoàng, Huế", soBA: "21/2021/HC-PT", ngayBA: "05/09/2021", toaBA: "TAND tỉnh Hà Nam", loaiAn: "Hành chính", hinhThuc: "Đề nghị TT", thamPhan: "Trần Văn Hùng", capGiaiQuyet: "bac3" },
    { id: 5, soThuLy: "05/2026/GĐT-LĐ", ngayThuLy: "16/07/2026", nguoiDungDon: "Phạm Thị Dung", diaChi: "33 Bà Triệu, Hải Phòng", soBA: "07/2023/LĐ-PT", ngayBA: "18/04/2023", toaBA: "TAND tỉnh Quảng Ninh", loaiAn: "Lao động", hinhThuc: "Đề nghị GĐT", thamPhan: "Trần Văn Hùng", capGiaiQuyet: "toicao" },
    { id: 6, soThuLy: "06/2026/GĐT-DS", ngayThuLy: "18/07/2026", nguoiDungDon: "Hoàng Văn Thái", diaChi: "20 Cầu Giấy, Hà Nội", soBA: "45/2024/DS-PT", ngayBA: "10/01/2025", toaBA: "TAND TP Hà Nội", loaiAn: "Dân sự", hinhThuc: "Đề nghị GĐT", thamPhan: "", capGiaiQuyet: "toicao" },
    { id: 7, soThuLy: "07/2026/TT-HS", ngayThuLy: "19/07/2026", nguoiDungDon: "Lê Thị Hồng", diaChi: "150 Nguyễn Trãi, TP.HCM", soBA: "12/2023/HS-PT", ngayBA: "22/08/2023", toaBA: "TAND TP HCM", loaiAn: "Hình sự", hinhThuc: "Đề nghị TT", thamPhan: "", capGiaiQuyet: "bac3" },
    { id: 8, soThuLy: "08/2026/GĐT-HNGĐ", ngayThuLy: "21/07/2026", nguoiDungDon: "Đinh Tuấn Tài", diaChi: "55 Láng Hạ, Hà Nội", soBA: "09/2023/HNGĐ-PT", ngayBA: "05/05/2023", toaBA: "TAND tỉnh Thái Bình", loaiAn: "Hôn nhân gia đình", hinhThuc: "Đề nghị GĐT", thamPhan: "Lê Thị Mai", capGiaiQuyet: "bac3" },
    { id: 9, soThuLy: "09/2026/TT-KDTM", ngayThuLy: "22/07/2026", nguoiDungDon: "Công ty Cổ phần Alpha", diaChi: "Tòa nhà Bitexco, TP.HCM", soBA: "56/2024/KDTM-PT", ngayBA: "11/12/2024", toaBA: "TAND cấp cao tại TP.HCM", loaiAn: "Kinh doanh thương mại", hinhThuc: "Đề nghị TT", thamPhan: "", capGiaiQuyet: "toicao" },
    { id: 10, soThuLy: "10/2026/GĐT-HC", ngayThuLy: "23/07/2026", nguoiDungDon: "Vũ Trọng Phụng", diaChi: "Số 8 Tràng Thi, Hà Nội", soBA: "19/2021/HC-PT", ngayBA: "15/07/2021", toaBA: "TAND tỉnh Hải Dương", loaiAn: "Hành chính", hinhThuc: "Đề nghị GĐT", thamPhan: "Phạm Văn Đức", capGiaiQuyet: "bac3" },
    { id: 11, soThuLy: "11/2026/GĐT-DS", ngayThuLy: "24/07/2026", nguoiDungDon: "Bùi Thị Yến", diaChi: "KĐT Times City, Hà Nội", soBA: "22/2022/DS-PT", ngayBA: "09/09/2022", toaBA: "TAND tỉnh Nam Định", loaiAn: "Dân sự", hinhThuc: "Đề nghị GĐT", thamPhan: "", capGiaiQuyet: "toicao" },
    { id: 12, soThuLy: "12/2026/TT-LĐ", ngayThuLy: "25/07/2026", nguoiDungDon: "Trương Quang Sáng", diaChi: "KCN Sóng Thần, Bình Dương", soBA: "04/2024/LĐ-PT", ngayBA: "20/02/2024", toaBA: "TAND tỉnh Bình Dương", loaiAn: "Lao động", hinhThuc: "Đề nghị TT", thamPhan: "Hoàng Thị Thu", capGiaiQuyet: "toicao" },
    { id: 13, soThuLy: "13/2026/GĐT-HS", ngayThuLy: "26/07/2026", nguoiDungDon: "Nguyễn Hải Long", diaChi: "Thôn 4, xã Hòa Tiến, Đắk Lắk", soBA: "31/2023/HS-PT", ngayBA: "17/10/2023", toaBA: "TAND tỉnh Đắk Lắk", loaiAn: "Hình sự", hinhThuc: "Đề nghị GĐT", thamPhan: "", capGiaiQuyet: "bac3" },
    { id: 14, soThuLy: "14/2026/TT-DS", ngayThuLy: "27/07/2026", nguoiDungDon: "Lý Mỹ Châu", diaChi: "Chợ Nổi, Cần Thơ", soBA: "11/2021/DS-PT", ngayBA: "03/04/2021", toaBA: "TAND TP Cần Thơ", loaiAn: "Dân sự", hinhThuc: "Đề nghị TT", thamPhan: "Nguyễn Thị Lan", capGiaiQuyet: "bac3" },
    { id: 15, soThuLy: "15/2026/GĐT-KDTM", ngayThuLy: "28/07/2026", nguoiDungDon: "Ngân hàng Thương mại ABC", diaChi: "Quận 1, TP.HCM", soBA: "77/2024/KDTM-PT", ngayBA: "05/01/2025", toaBA: "TAND cấp cao tại TP.HCM", loaiAn: "Kinh doanh thương mại", hinhThuc: "Đề nghị GĐT", thamPhan: "", capGiaiQuyet: "toicao" },
  ];

const THAM_PHAN_OPTIONS = [
  "Nguyễn Thị Lan", "Trần Văn Hùng", "Lê Thị Mai", "Phạm Văn Đức", "Hoàng Thị Thu",
];

const PhanCongThamPhan = ({ initialTab = 0, onOpenThamPhanPopup }: { initialTab?: 0 | 1 | 2; onOpenThamPhanPopup?: () => void }) => {
  const [tab, setTab] = useState<0 | 1 | 2>(initialTab);
  const [showLyDoPopup, setShowLyDoPopup] = useState<{show: boolean, thamPhan: string}>({show: false, thamPhan: ""});
  const [lyDoChiDinh, setLyDoChiDinh] = useState("");
  const [capTP, setCapTP] = useState<"tatca" | "toicao" | "bac3">("tatca");
  const [loaiAnFilter, setLoaiAnFilter] = useState<string[]>([]);
  const [hinhThucFilter, setHinhThucFilter] = useState("");
  const [rows, setRows] = useState(PHANCONG_SAMPLE);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ soToTrinh: string; ngaySua: string; lyDo: string }>({ soToTrinh: "", ngaySua: "", lyDo: "" });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const startEdit = (id: number) => {
    setEditingRow(id);
    setEditForm({ soToTrinh: "", ngaySua: new Date().toISOString().split("T")[0], lyDo: "" });
  };
  const [assignMap, setAssignMap] = useState<Record<number, string>>(
    Object.fromEntries(PHANCONG_SAMPLE.map(r => [r.id, r.thamPhan]))
  );
  const ASSIGN_WARNING_THRESHOLD = 3;
  const assignmentCounts = Object.values(assignMap).reduce((acc, tp) => {
    if (!tp) return acc;
    acc[tp] = (acc[tp] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const hasHighLoad = (tp: string) => tp && (assignmentCounts[tp] ?? 0) >= ASSIGN_WARNING_THRESHOLD;
  const optionLabel = (tp: string) => tp + (assignmentCounts[tp] ? ` (${assignmentCounts[tp]} đơn)` : "");

  const toggleLoaiAn = (v: string) =>
    setLoaiAnFilter(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const filtered = rows.filter(r => {
    if (capTP !== "tatca" && r.capGiaiQuyet !== capTP) return false;
    if (loaiAnFilter.length > 0 && !loaiAnFilter.includes(r.loaiAn)) return false;
    if (hinhThucFilter && !r.hinhThuc.includes(hinhThucFilter)) return false;
    if (tab === 0) return !assignMap[r.id];
    if (tab === 1) return !assignMap[r.id];
    return !!assignMap[r.id];
  });

  const handleRandomAssign = () => {
    if (filtered.length === 0) return;
    const newAssign = { ...assignMap };
    filtered.forEach(r => {
      const randomTP = THAM_PHAN_OPTIONS[Math.floor(Math.random() * THAM_PHAN_OPTIONS.length)];
      newAssign[r.id] = randomTP;
    });
    setAssignMap(newAssign);
    // triggerNoti("Đã phân công ngẫu nhiên cho tất cả đơn trong danh sách."); // TriggerNoti is not imported directly, it's global or passed? Wait, triggerNoti is defined in App.tsx globally?
  };

  const handleBulkAssign = (tp: string) => {
    if (!tp) return;
    if (selectedRows.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn để phân công.");
      return;
    }
    const newAssign = { ...assignMap };
    selectedRows.forEach(id => newAssign[id] = tp);
    setAssignMap(newAssign);
    setSelectedRows([]);
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };
  
  const toggleSelectAll = () => {
    if (selectedRows.length === filtered.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filtered.map(r => r.id));
    }
  };

  const tabs = ["DS chưa phân công ngẫu nhiên", "DS chưa phân công chỉ định", "Quản lý kết quả phân công"];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {/* Tabs */}
      <div className="bg-white rounded-[4px] border border-[#ddd] overflow-hidden">
        <div className="flex border-b border-[#ddd]">
          {tabs.map((t, i) => (
            <button key={i} onClick={() => { setTab(i as 0 | 1 | 2); setSelectedRows([]); }}
              className={`px-4 py-[9px] text-[13px] font-medium transition-colors border-b-2 -mb-px
                ${tab === i ? "border-[#8b1a1a] text-[#8b1a1a] bg-white" : "border-transparent text-[#666] hover:text-[#333] bg-[#fafafa]"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 space-y-3">
          {/* Cấp thẩm phán */}
          <div className="flex items-center gap-5">
            {[["tatca", "Tất cả"], ["toicao", "Thẩm phán tối cao"], ["bac3", "Thẩm phán bậc 3"]].map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer text-[13px]">
                <input type="radio" name="capTP" className="accent-[#8b1a1a]"
                  checked={capTP === val} onChange={() => setCapTP(val as "tatca" | "toicao" | "bac3")} />
                <span className={capTP === val ? "font-semibold text-[#8b1a1a]" : "text-[#444]"}>{label}</span>
              </label>
            ))}
          </div>

          {/* Row 1: Tên tòa, Ngày nhập, Hình thức, Người nhập */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Tên tòa án</label>
              <div className="relative">
                <select className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                  <option>Tòa án nhân dân tối cao</option>
                  <option>TAND cấp cao tại HN</option>
                  <option>TAND cấp cao tại TP.HCM</option>
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Ngày nhập đơn</label>
              <div className="flex items-center gap-1">
                <input type="date" className="flex-1 h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                <span className="text-[#888] text-[11px]">—</span>
                <input type="date" className="flex-1 h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Hình thức</label>
              <div className="relative">
                <select value={hinhThucFilter} onChange={e => setHinhThucFilter(e.target.value)}
                  className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                  <option value="">-- Chọn hình thức đơn --</option>
                  <option value="GĐT">Đề nghị GĐT</option>
                  <option value="TT">Đề nghị TT</option>
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">Người nhập đơn</label>
              <div className="relative">
                <select className="w-full h-[30px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                  <option value="">-- Chọn người nhập đơn --</option>
                  {["Vũ Văn Yên", "Lê Thị Hà", "Phùng Trâm Anh"].map(n => <option key={n}>{n}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Loại án checkboxes */}
          <div>
            <label className="block text-[11px] font-medium text-[#555] mb-1.5">Loại án</label>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {LOAI_AN_OPTIONS.map(la => (
                <label key={la} className="flex items-center gap-1.5 cursor-pointer text-[12px] text-[#333]">
                  <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                    checked={loaiAnFilter.includes(la)} onChange={() => toggleLoaiAn(la)} />
                  {la}
                </label>
              ))}
            </div>
          </div>

          {/* Tìm kiếm */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onOpenThamPhanPopup && onOpenThamPhanPopup()}
              className="flex items-center justify-center border border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#fcf5f5] rounded-[3px] px-5 h-[46px] gap-2 transition-colors">
              <Users size={14} />
              <span className="text-[11px] font-medium leading-none">Danh sách thẩm phán</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] px-5 h-[46px] gap-0.5 transition-colors">
              <Search size={14} />
              <span className="text-[11px] font-medium leading-none">Tìm kiếm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[4px] border border-[#ddd] overflow-hidden">
        <div className="px-4 py-[9px] border-b border-[#ddd] flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#1d2e4f]">Danh sách phân công</span>
          {tab === 0 && (
            <div className="flex items-center gap-4">
              <button onClick={() => { handleRandomAssign(); alert("Đã phân công ngẫu nhiên thành công!"); }} className="flex items-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                <Users size={12} /> Phân công ngẫu nhiên
              </button>
            </div>
          )}
          {tab === 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-[#555]">Chỉ định cho:</span>
              <div className="relative w-[180px]">
                <select 
                  value=""
                  onChange={(e) => { if(e.target.value) setShowLyDoPopup({show: true, thamPhan: e.target.value}); e.target.value = ""; }}
                  className="w-full h-[28px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]"
                >
                  <option value="">-- Chọn thẩm phán --</option>
                  {THAM_PHAN_OPTIONS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f5f5f5]">
                {tab === 1 && (
                  <th className="border border-[#ddd] px-2 py-[6px] text-center w-[30px]">
                    <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]" 
                      checked={selectedRows.length === filtered.length && filtered.length > 0} 
                      onChange={toggleSelectAll} 
                    />
                  </th>
                )}
                <th className="border border-[#ddd] px-2 py-[6px] text-center font-semibold text-[#333] w-[36px]">STT</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[130px]">Số thụ lý</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[95px]">Ngày thụ lý</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Thông tin người đứng đơn</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Thông tin BA/QĐ đề nghị GĐT, TT</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[130px]">Loại án</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[110px]">Hình thức đơn</th>
                <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[160px]">Thẩm phán</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={tab === 1 ? 9 : 8} className="border border-[#ddd] px-4 py-10 text-center text-[#999]">Không có dữ liệu</td>
                </tr>
              ) : filtered.map((row, i) => (
                <tr key={row.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                  {tab === 1 && (
                    <td className="border border-[#ddd] px-2 py-2 text-center">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                      />
                    </td>
                  )}
                  <td className="border border-[#ddd] px-2 py-2 text-center text-[#666]">{i + 1}</td>
                  <td className="border border-[#ddd] px-3 py-2 font-medium text-[#1a5a96]">{row.soThuLy}</td>
                  <td className="border border-[#ddd] px-3 py-2 text-[#555]">{row.ngayThuLy}</td>
                  <td className="border border-[#ddd] px-3 py-2">
                    <div className="font-medium text-[#1d2e4f] leading-snug">{row.nguoiDungDon}</div>
                    <div className="text-[11px] text-[#888] mt-0.5 leading-snug">{row.diaChi}</div>
                  </td>
                  <td className="border border-[#ddd] px-3 py-2">
                    <div className="space-y-[2px] leading-snug">
                      <div><span className="text-[#888]">Số BA: </span><span className="font-medium">{row.soBA}</span></div>
                      <div><span className="text-[#888]">Ngày: </span><span>{row.ngayBA}</span></div>
                      <div><span className="text-[#888]">Tòa xx: </span><span>{row.toaBA}</span></div>
                    </div>
                  </td>
                  <td className="border border-[#ddd] px-3 py-2">
                    <span className="inline-block px-1.5 py-[2px] rounded text-[10px] font-medium bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8]">{row.loaiAn}</span>
                  </td>
                  <td className="border border-[#ddd] px-3 py-2 text-[#555]">{row.hinhThuc}</td>
                  <td className="border border-[#ddd] px-3 py-2">
                    {tab === 2 ? (
                      editingRow === row.id ? (
                        <div className="space-y-2 min-w-[220px]">
                          {/* Thẩm phán mới */}
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Thẩm phán</label>
                            <div className="relative">
                              <select value={assignMap[row.id] ?? ""}
                                onChange={e => setAssignMap(p => ({ ...p, [row.id]: e.target.value }))}
                                className="w-full h-[26px] px-2 pr-6 text-[11px] border border-[#1a73e8] rounded-[3px] bg-white appearance-none focus:outline-none">
                                <option value="">-- Chọn thẩm phán --</option>
                                {THAM_PHAN_OPTIONS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                              </select>
                              <ChevronDown size={9} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                            </div>
                          </div>
                          {/* Số tờ trình */}
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Số tờ trình</label>
                            <input value={editForm.soToTrinh}
                              onChange={e => setEditForm(p => ({ ...p, soToTrinh: e.target.value }))}
                              placeholder="VD: 12/2026/TTr-TANDTC"
                              className="w-full h-[26px] px-2 text-[11px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                          </div>
                          {/* Ngày sửa */}
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Ngày sửa</label>
                            <input type="date" value={editForm.ngaySua}
                              onChange={e => setEditForm(p => ({ ...p, ngaySua: e.target.value }))}
                              className="w-full h-[26px] px-2 text-[11px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                          </div>
                          {/* Lý do */}
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Lý do sửa phân công</label>
                            <textarea value={editForm.lyDo}
                              onChange={e => setEditForm(p => ({ ...p, lyDo: e.target.value }))}
                              placeholder="Nhập lý do..."
                              rows={2}
                              className="w-full px-2 py-1 text-[11px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] resize-none" />
                          </div>
                          <div className="flex items-center gap-1 pt-0.5">
                            <button onClick={() => setEditingRow(null)}
                              className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium bg-[#27ae60] text-white hover:bg-[#1e8449] transition-colors">
                              <Check size={10} /> Lưu
                            </button>
                            <button onClick={() => setEditingRow(null)}
                              className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#666] hover:bg-[#f0f0f0] transition-colors">
                              <X size={10} /> Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-medium ${assignMap[row.id] ? "text-[#27ae60]" : "text-[#999]"}`}>
                            {assignMap[row.id] || "—"}
                          </span>
                          <button onClick={() => startEdit(row.id)}
                            className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#1a5a96] hover:bg-[#e8f0fe] transition-colors whitespace-nowrap">
                            <Pencil size={10} /> Sửa
                          </button>
                        </div>
                      )
                    ) : (
                      <span className="text-[#999]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Bị cáo ─────────────────────────────────────────────────────────────
const PopupBiCao = ({ onClose }: { onClose: () => void }) => {
  const [phanLoai, setPhanLoai] = useState<"canhan" | "tochuc">("canhan");
  const [khongCoCCCD, setKhongCoCCCD] = useState(false);
  const [isDangVien, setIsDangVien] = useState(false);
  const [coTienAn, setCoTienAn] = useState(false);
  const [diaChiTruoc, setDiaChiTruoc] = useState(false);

  const FLbl = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
    <label className="block text-[11px] font-medium text-[#555] mb-1">
      {children}{req && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
  const FInp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full h-[28px] border border-[#ccc] rounded-[3px] px-2 text-[12px] text-[#222] focus:outline-none focus:border-[#1a73e8]" />
  );
  const FSel = ({ children }: { children: React.ReactNode }) => (
    <div className="relative">
      <select className="w-full h-[28px] border border-[#ccc] rounded-[3px] px-2 pr-6 text-[12px] text-[#222] appearance-none focus:outline-none focus:border-[#1a73e8] bg-white">
        {children}
      </select>
      <ChevronDown size={9} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
    </div>
  );
  const Row2 = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
  );
  const Row3 = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3">{children}</div>
  );
  const SectionHdr = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[11px] font-semibold text-[#1d2e4f] uppercase tracking-wide pt-2 pb-1 border-b border-[#e0e0e0] mb-2">{children}</div>
  );
  const Chk = ({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) => (
    <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333]">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-[13px] h-[13px] accent-[#1d2e4f]" />
      {children}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[4px] shadow-xl w-[820px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
          <span className="text-[13px] font-semibold text-[#1d2e4f]">Thêm bị cáo</span>
          <button onClick={onClose} className="text-[#888] hover:text-[#333] transition-colors"><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 text-[12px]">

          {/* Phân loại */}
          <div className="flex items-center gap-6">
            <span className="text-[11px] font-medium text-[#555]">Phân loại người tham gia tố tụng</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px]">
              <input type="radio" name="phanloai" value="canhan" checked={phanLoai === "canhan"} onChange={() => setPhanLoai("canhan")} className="accent-[#1d2e4f]" />
              Cá nhân
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px]">
              <input type="radio" name="phanloai" value="tochuc" checked={phanLoai === "tochuc"} onChange={() => setPhanLoai("tochuc")} className="accent-[#1d2e4f]" />
              Cơ quan/tổ chức
            </label>
          </div>

          {/* Tư cách tham gia */}
          <div className="grid grid-cols-2 gap-x-4">
            <div>
              <FLbl req>Tư cách tham gia tố tụng</FLbl>
              <FSel>
                <option value="">-- Chọn --</option>
                <option>Bị cáo</option>
                <option>Bị hại</option>
                <option>Nguyên đơn dân sự</option>
                <option>Bị đơn dân sự</option>
                <option>Người có quyền lợi và nghĩa vụ liên quan</option>
              </FSel>
            </div>
          </div>

          {/* Thông tin con người */}
          <SectionHdr>Thông tin con người</SectionHdr>
          <div className="flex gap-4">
            {/* Ảnh */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-[80px] h-[100px] border border-dashed border-[#ccc] rounded-[3px] flex flex-col items-center justify-center text-[#bbb] cursor-pointer hover:border-[#1a73e8] transition-colors text-center px-1">
                <Upload size={18} className="text-[#ccc]" />
                <span className="text-[10px] mt-1 leading-tight">Ảnh chân dung</span>
              </div>
            </div>
            {/* Basic fields */}
            <div className="flex-1 space-y-3">
              <Row2>
                <div><FLbl req>Họ và tên</FLbl><FInp placeholder="Nhập họ và tên" /></div>
                <div><FLbl>Ngày sinh</FLbl><FInp type="date" /></div>
              </Row2>
              <Row2>
                <div>
                  <FLbl>Giới tính</FLbl>
                  <FSel><option value="">-- Giới tính --</option><option>Nam</option><option>Nữ</option><option>Khác</option></FSel>
                </div>
                <div className="flex items-end pb-1">
                  <Chk checked={khongCoCCCD} onChange={setKhongCoCCCD}>Không có căn cước</Chk>
                </div>
              </Row2>
              {!khongCoCCCD && (
                <Row3>
                  <div><FLbl>Số căn cước</FLbl><FInp placeholder="Số CCCD" /></div>
                  <div><FLbl>Ngày cấp CCCD</FLbl><FInp type="date" /></div>
                  <div><FLbl>Nơi cấp CCCD</FLbl><FInp placeholder="Nơi cấp" /></div>
                </Row3>
              )}
            </div>
          </div>

          <Row3>
            <div><FLbl>Dân tộc</FLbl><FSel><option value="">-- Dân tộc --</option><option>Kinh</option><option>Tày</option><option>Thái</option><option>Khác</option></FSel></div>
            <div><FLbl>Tôn giáo</FLbl><FSel><option value="">-- Tôn giáo --</option><option>Không</option><option>Phật giáo</option><option>Công giáo</option><option>Khác</option></FSel></div>
            <div><FLbl>Quốc tịch</FLbl><FSel><option value="">-- Quốc tịch --</option><option>Việt Nam</option><option>Khác</option></FSel></div>
          </Row3>
          <Row3>
            <div><FLbl>Nghề nghiệp</FLbl><FSel><option value="">-- Nghề nghiệp --</option><option>Công nhân</option><option>Nông dân</option><option>Cán bộ</option><option>Khác</option></FSel></div>
            <div><FLbl>Nghề nghiệp rõ</FLbl><FInp placeholder="Mô tả cụ thể" /></div>
            <div><FLbl>Chức vụ/quyền hạn</FLbl><FSel><option value="">-- Chọn --</option><option>Không có</option><option>Cán bộ</option><option>Lãnh đạo</option></FSel></div>
          </Row3>
          <Row3>
            <div className="col-span-2"><FLbl>Nơi làm việc</FLbl><FInp placeholder="Tên cơ quan, đơn vị" /></div>
            <div><FLbl>Ngoại ngữ</FLbl><FSel><option value="">-- Ngoại ngữ --</option><option>Không</option><option>Tiếng Anh</option><option>Khác</option></FSel></div>
          </Row3>
          <Row3>
            <div><FLbl>Trình độ văn hóa</FLbl><FSel><option value="">-- Chọn --</option><option>Tiểu học</option><option>THCS</option><option>THPT</option></FSel></div>
            <div><FLbl>Trình độ đào tạo</FLbl><FSel><option value="">-- Chọn --</option><option>Không có</option><option>Trung cấp</option><option>Cao đẳng</option><option>Đại học</option><option>Sau đại học</option></FSel></div>
            <div><FLbl>Thành phần gia đình</FLbl><FSel><option value="">-- Chọn --</option><option>Bình thường</option><option>Chính sách</option><option>Khác</option></FSel></div>
          </Row3>
          <Row3>
            <div><FLbl>Số điện thoại</FLbl><FInp placeholder="Số điện thoại" /></div>
            <div><FLbl>Email</FLbl><FInp type="email" placeholder="Email" /></div>
            <div><FLbl>Số fax</FLbl><FInp placeholder="Số fax" /></div>
          </Row3>

          <div className="flex items-center gap-6 pt-1">
            <Chk checked={isDangVien} onChange={setIsDangVien}>Là đảng viên</Chk>
            {isDangVien && (
              <div className="w-52">
                <FSel><option value="">-- Phân loại đảng viên --</option><option>Đảng viên chính thức</option><option>Đảng viên dự bị</option></FSel>
              </div>
            )}
            <Chk checked={coTienAn} onChange={setCoTienAn}>Có tiền án tiền sự</Chk>
          </div>

          {/* Danh sách giấy tờ */}
          <SectionHdr>Danh sách giấy tờ</SectionHdr>
          <div className="border border-[#e0e0e0] rounded-[3px] overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                  {["STT", "Loại giấy tờ", "Số", "Ngày cấp", "Nơi cấp", "Thao tác"].map(h => (
                    <th key={h} className="px-3 py-[6px] text-left font-semibold text-[#333] border-r last:border-r-0 border-[#e0e0e0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={6} className="text-center text-[#aaa] py-4 italic">Chưa có giấy tờ. Nhấn Thêm giấy tờ để bổ sung.</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <FLbl>Ghi chú</FLbl>
            <textarea rows={2} placeholder="Ghi chú..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#1a73e8] resize-none" />
          </div>

          {/* Địa danh */}
          <SectionHdr>Địa danh trước sát nhập</SectionHdr>
          <Chk checked={diaChiTruoc} onChange={setDiaChiTruoc}>Địa chỉ trước sát nhập</Chk>

          {(["Nơi sinh", "Quê quán", "Nơi đăng kí HKTT", "Nơi tạm trú", "Nơi ở hiện tại"] as const).map(label => (
            <div key={label}>
              <div className="text-[11px] font-medium text-[#444] mb-1.5">{label}</div>
              <div className={`grid gap-x-4 gap-y-2 ${diaChiTruoc ? "grid-cols-4" : "grid-cols-3"}`}>
                {diaChiTruoc && <div><FLbl>Quận/Huyện</FLbl><FInp placeholder="Quận/Huyện" /></div>}
                <div><FLbl>Phường/Xã</FLbl><FSel><option value="">-- Phường/Xã --</option></FSel></div>
                <div><FLbl>Tỉnh/Thành phố</FLbl><FSel><option value="">-- Tỉnh/TP --</option><option>Hà Nội</option><option>TP. Hồ Chí Minh</option><option>Bắc Ninh</option></FSel></div>
                <div><FLbl>Quốc gia</FLbl><FSel><option value="">-- Quốc gia --</option><option>Việt Nam</option></FSel></div>
              </div>
            </div>
          ))}

          {/* Thông tin quan hệ */}
          <SectionHdr>Thông tin quan hệ</SectionHdr>
          <div className="border border-[#e0e0e0] rounded-[3px] overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                  {["STT", "Họ tên", "Ngày sinh", "Giới tính", "CCCD/CMT", "Quan hệ", "Nơi ở hiện nay", "Chú thích", "Thao tác"].map(h => (
                    <th key={h} className="px-2 py-[5px] text-left font-semibold text-[#333] border-r last:border-r-0 border-[#e0e0e0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={9} className="text-center text-[#aaa] py-4 italic">Không có dữ liệu</td></tr>
              </tbody>
            </table>
          </div>

          {/* Thông tin tội danh */}
          <SectionHdr>Thông tin tội danh</SectionHdr>
          <div className="border border-[#e0e0e0] rounded-[3px] overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                  {["STT", "Điều", "Khoản", "Điểm", "Bộ luật TTHS", "Tội danh chính", "Thao tác"].map(h => (
                    <th key={h} className="px-3 py-[5px] text-left font-semibold text-[#333] border-r last:border-r-0 border-[#e0e0e0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={7} className="text-center text-[#aaa] py-4 italic">Không có dữ liệu</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-[#999] italic">Chọn một tội danh để xem hoặc thêm hình phạt.</p>

          {/* Thông tin thống kê */}
          <SectionHdr>Thông tin thống kê</SectionHdr>
          <div className="flex items-center gap-6">
            <Chk checked={false} onChange={() => { }}>Đầu vụ</Chk>
            <Chk checked={false} onChange={() => { }}>Trẻ vị thành niên</Chk>
            <Chk checked={false} onChange={() => { }}>Tái phạm, tái phạm nguy hiểm</Chk>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e0e0e0]">
          <BtnSecondary onClick={onClose}>Hủy</BtnSecondary>
          <BtnPrimary>Lưu</BtnPrimary>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Danh sách Thẩm phán ────────────────────────────────────────────────
const THAM_PHAN_DATA = [
  {
    id: 1, hoTen: "Nguyễn Thị Lan", bac: "Thẩm phán TANDTC", donang: [
      { maVu: "15/2024/GĐT-HS", loai: "Hình sự", tenVu: "Nguyễn Văn An — kháng nghị bản án 12/2022/HS-PT" },
      { maVu: "08/2024/GĐT-DS", loai: "Dân sự", tenVu: "Trần Thị Bình kiện tranh chấp đất đai" },
      { maVu: "21/2024/GĐT-HC", loai: "Hành chính", tenVu: "Lê Văn Cường kiện UBND tỉnh Vĩnh Phúc" },
    ]
  },
  {
    id: 2, hoTen: "Phạm Văn Đức", bac: "Thẩm phán TANDTC", donang: [
      { maVu: "03/2024/GĐT-KDTM", loai: "KDTM", tenVu: "Công ty Minh Đức kiện đối tác vi phạm hợp đồng" },
      { maVu: "19/2024/GĐT-HS", loai: "Hình sự", tenVu: "Hoàng Văn Em — đề nghị giám đốc thẩm" },
    ]
  },
  {
    id: 3, hoTen: "Trần Thị Hương", bac: "Thẩm phán TANDTC", donang: [
      { maVu: "07/2024/GĐT-DS", loai: "Dân sự", tenVu: "Nguyễn Thị Phương — tranh chấp thừa kế" },
      { maVu: "11/2024/GĐT-HN", loai: "Hôn nhân GĐ", tenVu: "Vũ Văn Giang xin ly hôn, chia tài sản" },
      { maVu: "25/2024/GĐT-HS", loai: "Hình sự", tenVu: "Đinh Thị Hoa — kêu oan án tử hình" },
      { maVu: "31/2024/GĐT-LĐ", loai: "Lao động", tenVu: "Công ty ABC kiện tranh chấp lao động" },
    ]
  },
  {
    id: 4, hoTen: "Lê Minh Tuấn", bac: "Thẩm phán bậc 3", donang: [
      { maVu: "02/2024/GĐT-HC", loai: "Hành chính", tenVu: "Trương Văn Inh kiện UBND huyện Gia Lâm" },
    ]
  },
  {
    id: 5, hoTen: "Đỗ Thị Kim Oanh", bac: "Thẩm phán bậc 3", donang: [
      { maVu: "14/2024/GĐT-DS", loai: "Dân sự", tenVu: "Bùi Văn Khoa — tranh chấp hợp đồng vay" },
      { maVu: "22/2024/GĐT-KDTM", loai: "KDTM", tenVu: "Doanh nghiệp Long Phát kiện đối tác" },
    ]
  },
];

const LOAI_COLOR: Record<string, string> = {
  "Hình sự": "bg-[#fde8e8] text-[#8b1a1a] border-[#f5b7b7]",
  "Dân sự": "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]",
  "Hành chính": "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]",
  "KDTM": "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]",
  "Hôn nhân GĐ": "bg-[#f3e8ff] text-[#6d28d9] border-[#d8b4fe]",
  "Lao động": "bg-[#f0fdf4] text-[#166534] border-[#86efac]",
};

const PopupThamPhan = ({ onClose }: { onClose: () => void }) => {
  const [search, setSearch] = useState("");
  const [filterLoai, setFilterLoai] = useState("");

  const filtered = THAM_PHAN_DATA.filter(tp => {
    const matchName = tp.hoTen.toLowerCase().includes(search.toLowerCase());
    const matchLoai = !filterLoai || tp.donang.some(d => d.loai === filterLoai);
    return matchName && matchLoai;
  });

  const loaiOptions = Array.from(new Set(THAM_PHAN_DATA.flatMap(tp => tp.donang.map(d => d.loai))));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[4px] shadow-xl w-[860px] max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-[#1d2e4f]" />
            <span className="text-[13px] font-semibold text-[#1d2e4f]">Danh sách thẩm phán đang giải quyết vụ việc</span>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-[#333] transition-colors"><X size={16} /></button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#f0f0f0] bg-[#fafafa]">
          <div className="relative flex-1 max-w-[280px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên thẩm phán..."
              className="w-full h-[30px] pl-7 pr-3 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]"
            />
          </div>
          <div className="relative">
            <select value={filterLoai} onChange={e => setFilterLoai(e.target.value)}
              className="h-[30px] pl-2 pr-7 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
              <option value="">-- Tất cả loại án --</option>
              {loaiOptions.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
          </div>
          <span className="text-[11px] text-[#888] ml-auto">{filtered.length} thẩm phán</span>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-[12px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                <th className="px-4 py-[8px] text-left font-semibold text-[#333] border-r border-[#e0e0e0] w-[180px]">Thẩm phán</th>
                <th className="px-4 py-[8px] text-left font-semibold text-[#333] border-r border-[#e0e0e0] w-[120px]">Bậc</th>
                <th className="px-4 py-[8px] text-left font-semibold text-[#333] border-r border-[#e0e0e0]">Vụ việc đang giải quyết</th>
                <th className="px-4 py-[8px] text-center font-semibold text-[#333] w-[90px]">Tổng số đơn</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tp, idx) => (
                <tr key={tp.id} className={idx % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                  <td className="px-4 py-3 border-r border-[#e8e8e8] align-top">
                    <div className="font-medium text-[#1d2e4f]">{tp.hoTen}</div>
                  </td>
                  <td className="px-4 py-3 border-r border-[#e8e8e8] align-top">
                    <span className="inline-block px-2 py-[3px] rounded-sm text-[10px] font-medium bg-[#eef1f5] text-[#1d2e4f] border border-[#c5cfe0]">{tp.bac}</span>
                  </td>
                  <td className="px-4 py-3 border-r border-[#e8e8e8] align-top">
                    <div className="space-y-1.5">
                      {tp.donang.filter(d => !filterLoai || d.loai === filterLoai).map(d => (
                        <div key={d.maVu} className="flex items-start gap-2">
                          <span className={`flex-shrink-0 inline-block px-1.5 py-[2px] rounded-sm text-[10px] font-medium border ${LOAI_COLOR[d.loai] ?? "bg-[#f5f5f5] text-[#555] border-[#ddd]"}`}>
                            {d.loai}
                          </span>
                          <span className="text-[#333] leading-snug">
                            <span className="font-medium text-[#555] mr-1">{d.maVu}</span>
                            {d.tenVu}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-center">
                    <span className={`inline-flex items-center justify-center w-[32px] h-[32px] rounded-full text-[13px] font-bold border-2 ${tp.donang.length >= 4 ? "bg-[#fde8e8] text-[#8b1a1a] border-[#f5b7b7]" : tp.donang.length >= 2 ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]" : "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"}`}>
                      {tp.donang.length}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="text-center text-[#aaa] italic py-8">Không tìm thấy thẩm phán phù hợp</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e0e0e0] bg-[#fafafa] text-[11px] text-[#888]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#e8f7ee] border-2 border-[#a9debb] inline-block" /> 1 đơn</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#fef3e2] border-2 border-[#fcd48a] inline-block" /> 2–3 đơn</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#fde8e8] border-2 border-[#f5b7b7] inline-block" /> Từ 4 đơn trở lên</span>
          </div>
          <button onClick={onClose} className="h-[28px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Lãnh đạo phê duyệt ý kiến ──────────────────────────────────────
const PopupLanhDaoPheDuyetYkien = ({ onClose, initialLoaiDeXuat }: { onClose: () => void; initialLoaiDeXuat?: string }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [rutGon, setRutGon] = useState(false);
  const [docType, setDocType] = useState(initialLoaiDeXuat || "Tờ trình phân công");
  const [toTrinhExpanded, setToTrinhExpanded] = useState(true);
  const [d1Expanded, setD1Expanded] = useState(true);
  const [d2Expanded, setD2Expanded] = useState(true);
  const [d3Expanded, setD3Expanded] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState("to-trinh-1");
  const isToTrinh = docType.toLowerCase().includes("tờ trình") || docType.toLowerCase().includes("to trinh");
  
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[8px] shadow-2xl w-[1300px] max-w-[95vw] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee] flex-shrink-0">
          <div className="flex flex-col">
            <div className="text-[11px] text-[#666] flex items-center gap-1 font-medium">
              <span>Trang chủ</span> / <span>Công tác lãnh đạo</span> / <span>Phê duyệt đề xuất</span> / <span className="font-semibold text-[#8b1a1a]">Ý kiến lãnh đạo</span>
            </div>
            <h2 className="text-[18px] font-bold text-[#1d2e4f] mt-1">Lãnh đạo phê duyệt ý kiến</h2>
            <div className="text-[12px] text-[#888] font-semibold mt-0.5">VA26-001201 - Vụ giải quyết đơn 5777</div>
          </div>
          <button onClick={onClose} className="h-[32px] px-3 bg-white border border-[#ccc] hover:bg-gray-50 text-[12px] font-medium rounded text-[#333] flex items-center gap-1 transition-colors">
            <ArrowLeft size={14} /> Quay lại
          </button>
        </div>
        
        {/* Body: Split Layout */}
        <div className="flex-1 overflow-hidden flex flex-row">
          
          {/* LEFT: Processing Panel */}
          <div className="w-[50%] border-r border-[#eee] overflow-y-auto p-5 bg-[#fbfbfb] flex flex-col">


            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-[#eee] mb-4 flex-shrink-0">
              {["Ý kiến lãnh đạo", isToTrinh ? "Thông tin tờ trình" : "Thông tin văn bản"].map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)}
                  className={`pb-2 text-[14px] font-medium transition-colors border-b-2 -mb-[1px] ${
                    activeTab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#333]"
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 flex flex-col border border-[#eee] bg-white rounded-[4px] p-4 shadow-sm min-h-[350px]">
              {activeTab === 0 && (
                isToTrinh ? (
                  // ──────────────── TỜ TRÌNH LAYOUT ────────────────
                  <div className="flex flex-col h-full flex-1">
                    {/* Collapsible Accordion Header */}
                    <div className="border border-[#e2e8f0] rounded-[6px] bg-white mb-3 shadow-sm overflow-hidden flex-shrink-0">
                      <div className="p-3 bg-white flex items-center justify-between border-b border-[#eee]">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#1d2e4f] flex items-center gap-1">
                            <ChevronDown size={14} /> Tờ trình phân công thẩm phán - Số 112/2026/TTr-TANDTC-VP
                          </span>
                          <span className="text-[11px] text-[#666] ml-4.5">TLM: 5467614 - Ngày TL: 18/06/2026</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white space-y-3">
                        {/* Light blue proposal opinion box */}
                        <div className="bg-[#eaf4fe] border border-[#bee2ff] rounded-[4px] p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[12px] font-bold text-[#1a5a96]">Ý kiến đề xuất | Phó chánh văn phòng - Nguyễn Mạnh Hùng</span>
                            <button className="text-[11px] text-[#1a5a96] hover:underline font-medium flex items-center gap-0.5">
                              <HistoryIcon size={11} /> Xem diễn biến
                            </button>
                          </div>
                          <div className="text-[12px] text-[#333] font-medium">
                            Đồng ý, trình Phó Chánh án Nguyễn Hải Trâm
                          </div>
                        </div>

                        {/* Leadership opinion content textarea */}
                        <div className="border border-[#e2e8f0] rounded-[4px] p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[12px] font-bold text-[#333]">Ý kiến lãnh đạo</span>
                            <button className="text-[#888] hover:text-[#555]"><RotateCcw size={13} /></button>
                          </div>
                          <div className="border-t border-dashed border-[#e2e8f0] pt-2">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-red-500 font-bold text-[12px]">*</span>
                              <span className="text-[11px] font-semibold text-[#666]">Nội dung ý kiến lãnh đạo</span>
                            </div>
                            <textarea
                              defaultValue="Lãnh đạo đề xuất ý kiến:"
                              className="w-full p-2.5 text-[12px] border border-[#ccc] rounded-[4px] focus:outline-none focus:border-[#8b1a1a] min-h-[90px] resize-none"
                            />
                            <div className="text-right text-[10px] text-[#888] mt-1">24 / 4000</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f0f5fa] rounded-[6px] border border-[#d6e4f0] overflow-hidden mt-auto flex-shrink-0">
                      <div className="px-4 py-2 bg-[#e6eff8] border-b border-[#d6e4f0] text-[13px] font-bold text-[#1d2e4f]">
                        Đề xuất trình tiếp
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-6 bg-white">
                        <div>
                          <label className="block text-[12px] text-[#666] mb-1.5 font-medium">Cấp trình tiếp</label>
                          <div className="relative">
                            <select className="w-full h-[32px] pl-3 pr-8 text-[13px] border border-[#ccc] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                              <option value="">Chọn cấp trình tiếp</option>
                              <option value="1">Lãnh đạo tòa</option>
                              <option value="2">Chánh án</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] text-[#666] mb-1.5 font-medium">Người đề xuất trình</label>
                          <div className="relative">
                            <select className="w-full h-[32px] pl-3 pr-8 text-[13px] border border-[#ccc] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                              <option value="">Chọn người đề xuất trình</option>
                              <option value="1">Nguyễn Văn A</option>
                              <option value="2">Trần Thị B</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 border-t border-[#eee] bg-white flex items-center justify-end gap-2 flex-wrap">
                        <button className="h-[32px] px-3 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[4px] text-[12px] font-medium transition-colors">
                          Chỉnh sửa Word
                        </button>
                        <button className="h-[32px] px-3 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[4px] text-[12px] font-medium transition-colors">
                          Lưu
                        </button>
                        <button className="h-[32px] px-3 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-[4px] text-[12px] font-medium transition-colors shadow-sm">
                          Lưu và ký
                        </button>
                        <button className="h-[32px] px-3 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-[4px] text-[12px] font-medium transition-colors shadow-sm">
                          Lưu và ký logic
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // ──────────────── NORMAL SIGNING LAYOUT ────────────────
                  <div className="flex flex-col h-full flex-1 justify-between">
                    <div>
                      <label className="block text-[13px] font-bold text-[#1d2e4f] mb-2">Ý kiến chỉ đạo / Phê duyệt</label>
                      <textarea 
                        placeholder="Nhập ý kiến chỉ đạo hoặc nhận xét của Lãnh đạo đối với văn bản/quyết định này..."
                        className="w-full p-3 text-[13px] border border-[#ccc] rounded-[4px] focus:outline-none focus:border-[#8b1a1a] min-h-[140px] resize-none"
                      />
                    </div>

                    <div className="bg-[#fcfcfc] border border-[#e2e8f0] p-4 rounded-[6px] mt-4">
                      <div className="text-[12px] text-[#555] mb-2 font-medium">Thông tin ký số:</div>
                      <div className="text-[13px] text-[#333]">Người ký: <span className="font-semibold">Phạm Văn Nha</span> (Phó Chánh Văn phòng)</div>
                    </div>

                    <div className="px-4 py-3 border-t border-[#eee] bg-white flex items-center justify-end gap-3 mt-6">
                      <button className="h-[32px] px-4 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[4px] text-[13px] font-medium transition-colors">
                        Chỉnh sửa Word
                      </button>
                      <button className="h-[32px] px-4 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[4px] text-[13px] font-medium transition-colors">
                        Lưu ý kiến
                      </button>
                      <button className="h-[32px] px-4 bg-[#27ae60] hover:bg-[#219653] text-white rounded-[4px] text-[13px] font-medium transition-colors shadow-sm">
                        Ký số phê duyệt
                      </button>
                      <button className="h-[32px] px-4 bg-[#7f8c8d] hover:bg-[#6c7a89] text-white rounded-[4px] text-[13px] font-medium transition-colors shadow-sm">
                        Trả lại văn bản
                      </button>
                    </div>
                  </div>
                )
              )}
              {activeTab === 1 && (
                <div className="flex flex-col h-full flex-1 gap-4 overflow-y-auto">
                  <div className="border border-[#e2e8f0] rounded-[6px] p-4 bg-white shadow-sm flex flex-col flex-1">
                    <div className="text-[12px] font-bold text-[#1d2e4f] mb-2 uppercase tracking-wider">Cấu trúc tài liệu trình ký</div>
                    <div className="text-[11px] text-[#666] mb-3 italic">
                      Lưu ý: Một tờ trình bao gồm nhiều danh sách đơn đề xuất. Mỗi Thẩm phán thuộc một Vụ Giám đốc kiểm tra cấu thành một danh sách riêng biệt.
                    </div>
                    
                    <div className="border border-[#eee] rounded-[4px] bg-white overflow-hidden text-[12px] flex-1">
                      
                      {/* LEVEL 1: Tờ trình duy nhất */}
                      <div className="flex flex-col">
                        <div className={`flex items-center hover:bg-[#f9f9f9] border-b border-[#eee] py-2.5 px-3 cursor-pointer ${selectedNodeId === "to-trinh-1" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                          onClick={() => setSelectedNodeId("to-trinh-1")}
                        >
                          <button onClick={(e) => { e.stopPropagation(); setToTrinhExpanded(!toTrinhExpanded); }} className="p-1 hover:bg-[#eee] rounded mr-1">
                            {toTrinhExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          <FileText size={15} className="text-[#8b1a1a] mr-2 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1d2e4f]">{docType} phân công TP - Số 112/2026/TTr-TANDTC-VP</span>
                            <span className="text-[9px] text-[#666]">Số lượng: 3 Danh sách | 4 Đơn trình duyệt</span>
                          </div>
                        </div>

                        {toTrinhExpanded && (
                          <div className="flex flex-col">
                            
                            {/* LEVEL 2: Danh sách 1 (Thẩm phán Bùi Ngọc Lâm - Vụ GĐKT Dân sự) */}
                            <div className={`flex items-center hover:bg-[#f9f9f9] border-b border-[#eee] py-2 px-3 pl-8 cursor-pointer ${selectedNodeId === "danh-sach-1" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                              onClick={() => setSelectedNodeId("danh-sach-1")}
                            >
                              <button onClick={(e) => { e.stopPropagation(); setD1Expanded(!d1Expanded); }} className="p-1 hover:bg-[#eee] rounded mr-1">
                                {d1Expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <FileText size={15} className="text-[#1a5a96] mr-2 flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#333]">Danh sách đơn - TP. Bùi Ngọc Lâm (Vụ GĐKT Dân sự)</span>
                                <span className="text-[9px] text-[#666]">Đơn vị chuyển đến: TAND tỉnh Bắc Ninh</span>
                              </div>

                            </div>

                            {d1Expanded && (
                              <div className="flex flex-col bg-[#fafafa]">
                                {/* LEVEL 3: Các Đơn thuộc Danh sách 1 */}
                                <div className={`flex items-center hover:bg-[#f5f5f5] border-b border-[#eee] py-2 px-3 pl-16 cursor-pointer ${selectedNodeId === "don-7031" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                                  onClick={() => setSelectedNodeId("don-7031")}
                                >
                                  <FileText size={14} className="text-[#666] mr-2 flex-shrink-0" />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-[#333]">Đơn đề nghị GĐT/TT (7031) - Bùi Phương Thảo</span>
                                    <span className="text-[10px] text-[#666]">Mã thụ lý: VA26-001201 | Ngày nhận: 18/06/2026</span>
                                  </div>

                                </div>
                                <div className={`flex items-center hover:bg-[#f5f5f5] border-b border-[#eee] py-2 px-3 pl-16 cursor-pointer ${selectedNodeId === "don-7034" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                                  onClick={() => setSelectedNodeId("don-7034")}
                                >
                                  <FileText size={14} className="text-[#666] mr-2 flex-shrink-0" />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-[#333]">Đơn đề nghị GĐT/TT (7034) - Lê Văn D</span>
                                    <span className="text-[10px] text-[#666]">Mã thụ lý: VA26-001204 | Ngày nhận: 21/06/2026</span>
                                  </div>

                                </div>
                              </div>
                            )}

                            {/* LEVEL 2: Danh sách 2 (Thẩm phán Bùi Ngọc Lâm - Vụ GĐKT Hình sự) */}
                            <div className={`flex items-center hover:bg-[#f9f9f9] border-b border-[#eee] py-2 px-3 pl-8 cursor-pointer ${selectedNodeId === "danh-sach-2" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                              onClick={() => setSelectedNodeId("danh-sach-2")}
                            >
                              <button onClick={(e) => { e.stopPropagation(); setD2Expanded(!d2Expanded); }} className="p-1 hover:bg-[#eee] rounded mr-1">
                                {d2Expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <FileText size={15} className="text-[#1a5a96] mr-2 flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#333]">Danh sách đơn - TP. Bùi Ngọc Lâm (Vụ GĐKT Hình sự)</span>
                                <span className="text-[9px] text-[#666]">Đơn vị chuyển đến: TAND tỉnh Lạng Sơn</span>
                              </div>

                            </div>

                            {d2Expanded && (
                              <div className="flex flex-col bg-[#fafafa]">
                                {/* LEVEL 3: Các Đơn thuộc Danh sách 2 */}
                                <div className={`flex items-center hover:bg-[#f5f5f5] border-b border-[#eee] py-2 px-3 pl-16 cursor-pointer ${selectedNodeId === "don-7033" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                                  onClick={() => setSelectedNodeId("don-7033")}
                                >
                                  <FileText size={14} className="text-[#666] mr-2 flex-shrink-0" />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-[#333]">Đơn đề nghị GĐT/TT (7033) - Trần Thị B</span>
                                    <span className="text-[10px] text-[#666]">Mã thụ lý: VA26-001203 | Ngày nhận: 20/06/2026</span>
                                  </div>

                                </div>
                              </div>
                            )}

                            {/* LEVEL 2: Danh sách 3 (Thẩm phán Nguyễn Văn C - Vụ GĐKT Hành chính) */}
                            <div className={`flex items-center hover:bg-[#f9f9f9] border-b border-[#eee] py-2 px-3 pl-8 cursor-pointer ${selectedNodeId === "danh-sach-3" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                              onClick={() => setSelectedNodeId("danh-sach-3")}
                            >
                              <button onClick={(e) => { e.stopPropagation(); setD3Expanded(!d3Expanded); }} className="p-1 hover:bg-[#eee] rounded mr-1">
                                {d3Expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <FileText size={15} className="text-[#1a5a96] mr-2 flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#333]">Danh sách đơn - TP. Nguyễn Văn C (Vụ GĐKT Hành chính)</span>
                                <span className="text-[9px] text-[#666]">Đơn vị chuyển đến: TAND tỉnh Bắc Giang</span>
                              </div>

                            </div>

                            {d3Expanded && (
                              <div className="flex flex-col bg-[#fafafa]">
                                {/* LEVEL 3: Các Đơn thuộc Danh sách 3 */}
                                <div className={`flex items-center hover:bg-[#f5f5f5] py-2 px-3 pl-16 cursor-pointer ${selectedNodeId === "don-7032" ? "bg-[#eaf4fe] hover:bg-[#eaf4fe]" : ""}`}
                                  onClick={() => setSelectedNodeId("don-7032")}
                                >
                                  <FileText size={14} className="text-[#666] mr-2 flex-shrink-0" />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-[#333]">Đơn đề nghị GĐT/TT (7032) - Nguyễn Văn A</span>
                                    <span className="text-[10px] text-[#666]">Mã thụ lý: VA26-001202 | Ngày nhận: 19/06/2026</span>
                                  </div>

                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Document Preview Panel */}
          <div className="w-[50%] bg-[#f0f0f0] overflow-y-auto flex flex-col items-center py-6 px-4 gap-4">
            {/* Toolbar */}
            <div className="w-full max-w-[520px] flex items-center justify-between bg-white border border-[#ccc] rounded px-3 py-2 shadow-sm flex-shrink-0">
              <span className="text-[12px] font-bold text-[#1d2e4f] flex items-center gap-1.5">
                <FileText size={14} className="text-[#1a5a96]" /> Xem trước tài liệu ({
                  selectedNodeId.startsWith("to-trinh-") ? "Tờ trình" : selectedNodeId.startsWith("danh-sach-") ? "Danh sách phụ lục" : "Chi tiết Đơn"
                })
              </span>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Phóng to"><ZoomIn size={14} className="text-[#666]" /></button>
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Thu nhỏ"><ZoomOut size={14} className="text-[#666]" /></button>
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Xoay"><RotateCcw size={14} className="text-[#666]" /></button>
                <button className="p-1 hover:bg-[#eee] rounded transition-colors" title="Tải về"><Download size={14} className="text-[#666]" /></button>
              </div>
            </div>

            {selectedNodeId.startsWith("to-trinh-") ? (
              /* MẪU PREVIEW TỜ TRÌNH */
              <div className="w-full max-w-[520px] bg-white border border-[#ccc] shadow-md rounded p-7 relative min-h-[580px] font-serif text-[11px] leading-relaxed text-[#000]">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-center w-[160px]">
                    <div className="text-[10px] font-normal uppercase">TÒA ÁN NHÂN DÂN TỐI CAO</div>
                    <div className="text-[10px] font-bold uppercase underline decoration-solid underline-offset-4">VĂN PHÒNG</div>
                    <div className="text-[9px] mt-2">Số: /TTr-TANDTC-VP</div>
                  </div>
                  <div className="text-center w-[250px]">
                    <div className="text-[10px] font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="text-[10px] font-bold underline decoration-solid underline-offset-4">Độc lập - Tự do - Hạnh phúc</div>
                    <div className="text-[9.5px] italic mt-2">Hà Nội, ngày..... tháng..... năm 2026</div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-6 space-y-1">
                  <div className="text-[12px] font-bold uppercase">TỜ TRÌNH</div>
                  <div className="text-[11px] font-bold max-w-[400px] mx-auto leading-normal">
                    Về việc thụ lý đơn và phân công Thẩm phán giải quyết đơn đề nghị xem xét lại quyết định, bản án đã có hiệu lực pháp luật theo trình tự giám đốc thẩm, tái thẩm
                  </div>
                </div>

                {/* Recipient */}
                <div className="mb-4">
                  <span className="font-bold">Kính trình:</span> Đồng chí Chánh án Tòa án nhân dân tối cao
                </div>

                {/* Body */}
                <div className="space-y-3 text-justify text-[10.5px]">
                  <p>
                    Văn phòng Tòa án nhân dân tối cao nhận và thụ lý các đơn đề nghị, kiến nghị, thông báo của công dân, tổ chức gửi Tòa án nhân dân tối cao để đề nghị xem xét lại quyết định, bản án đã có hiệu lực pháp luật theo trình tự giám đốc thẩm và dự kiến phân công các Thẩm phán Tòa án nhân dân giải quyết đơn
                  </p>
                  <p>
                    Sau khi xem xét các đơn đề nghị, kiến nghị theo thủ tục giám đốc thẩm, Văn phòng nhận thấy các đơn đề nghị, kiến nghị nêu trên đã đủ điều kiện thụ lý theo quy định. Căn cứ vào kết quả phân công khách quan theo tổ Thẩm phán chuyên sâu; số lượng vụ án mà các Thẩm phán đang xem xét giải quyết; các vụ án có cùng nguyên đơn, bị đơn; có cùng người khởi kiện, người bị kiện.
                  </p>
                  <p>
                    Văn phòng Tòa án nhân dân tối cao báo cáo và kính đề nghị đồng chí Chánh án Tòa án nhân dân tối cao giải quyết (có danh sách kèm theo).
                  </p>
                  <p className="italic">Kính trình Đồng chí./.</p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-start mt-10 pt-4 border-t border-dashed border-[#eee]">
                  <div className="text-[9px] leading-relaxed">
                    <span className="font-bold block">Nơi nhận:</span>
                    - Như kính trình;<br/>
                    - Lưu: HCTP.
                  </div>
                  <div className="text-center w-[200px] text-[9.5px]">
                    <div className="font-bold">KT. CHÁNH VĂN PHÒNG</div>
                    <div className="font-bold uppercase">PHÓ CHÁNH VĂN PHÒNG</div>
                    <div className="h-[45px]"></div>
                    <div className="font-bold text-[#1d2e4f] text-[11px] underline">Phạm Văn Nha</div>
                  </div>
                </div>
              </div>
            ) : selectedNodeId.startsWith("danh-sach-") ? (
              /* MẪU DANH SÁCH */
              <div className="w-full max-w-[520px] bg-white border border-[#ccc] shadow-md rounded p-5 relative min-h-[580px] font-sans text-[10px] text-[#000]">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-center">
                    <div className="text-[8px] uppercase">TÒA ÁN NHÂN DÂN TỐI CAO</div>
                    <div className="text-[8.5px] font-bold uppercase underline underline-offset-2">VĂN PHÒNG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8.5px] font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="text-[8px] font-bold underline underline-offset-2">Độc lập - Tự do - Hạnh phúc</div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-4 space-y-1">
                  <div className="font-bold uppercase text-[10.5px]">
                    Danh sách đơn vụ án {selectedNodeId === "danh-sach-1" ? "Dân sự" : selectedNodeId === "danh-sach-2" ? "Hình sự" : "Hành chính"} thụ lý
                  </div>
                  <div className="font-bold text-[9.5px]">
                    và phân công Thẩm phán {selectedNodeId === "danh-sach-3" ? "Nguyễn Văn C" : "Bùi Ngọc Lâm"} theo dõi, giải quyết
                  </div>
                  <div className="text-[8.5px] italic text-[#444]">
                    (Kèm theo tờ trình số 112/TTr-TANDTC-VP ngày 27/01/2026 của Văn phòng Tòa án nhân dân tối cao)
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto my-3">
                  <table className="w-full border-collapse border border-black text-[8px] leading-tight">
                    <thead>
                      <tr className="bg-[#f2f2f2]">
                        <th className="border border-black p-1 text-center w-[20px]" rowSpan={2}>STT</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Số thụ lý</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Ngày thụ lý</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Người đề nghị, kiến nghị, thông báo</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Địa chỉ</th>
                        <th className="border border-black p-1 text-center" colSpan={3}>QĐ/BA đề nghị xem xét theo thủ tục GĐT/TT</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Số đơn</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Thẩm phán giải quyết</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>Ghi chú</th>
                      </tr>
                      <tr className="bg-[#f2f2f2]">
                        <th className="border border-black p-1 text-center">Số BA/QĐ</th>
                        <th className="border border-black p-1 text-center">Ngày BA/QĐ</th>
                        <th className="border border-black p-1 text-center">Tòa án Xét xử</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedNodeId === "danh-sach-1" ? (
                        <>
                          <tr>
                            <td className="border border-black p-1 text-center">1</td>
                            <td className="border border-black p-1 text-center">07</td>
                            <td className="border border-black p-1 text-center">27/01/2026</td>
                            <td className="border border-black p-1">
                              Bùi Phương Thảo (Do TAND tỉnh Bắc Ninh chuyển đến theo Công văn số 11111 ngày 26/01/2026)
                            </td>
                            <td className="border border-black p-1">Chi tiết Người đứng đơn CTH0123, TP. Bắc Ninh, tỉnh Bắc Ninh</td>
                            <td className="border border-black p-1 text-center">27012026_01_DS</td>
                            <td className="border border-black p-1 text-center">27/01/2026</td>
                            <td className="border border-black p-1">Tòa án nhân dân tỉnh Bắc Ninh</td>
                            <td className="border border-black p-1 text-center">1</td>
                            <td className="border border-black p-1 font-medium">Bùi Ngọc Lâm</td>
                            <td className="border border-black p-1">Lưu ý kiểm tra kỹ tài liệu đính kèm</td>
                          </tr>
                          <tr>
                            <td className="border border-black p-1 text-center">2</td>
                            <td className="border border-black p-1 text-center">08</td>
                            <td className="border border-black p-1 text-center">28/01/2026</td>
                            <td className="border border-black p-1">
                              Lê Văn D (Tự nộp trực tiếp tại Ban tiếp công dân)
                            </td>
                            <td className="border border-black p-1">Số 45, Đường Lý Thái Tổ, TP. Bắc Ninh</td>
                            <td className="border border-black p-1 text-center">28012026_02_DS</td>
                            <td className="border border-black p-1 text-center">20/01/2026</td>
                            <td className="border border-black p-1">Tòa án nhân dân TP. Bắc Ninh</td>
                            <td className="border border-black p-1 text-center">1</td>
                            <td className="border border-black p-1 font-medium">Bùi Ngọc Lâm</td>
                            <td className="border border-black p-1">Tài liệu bổ sung đầy đủ</td>
                          </tr>
                        </>
                      ) : selectedNodeId === "danh-sach-2" ? (
                        <tr>
                          <td className="border border-black p-1 text-center">1</td>
                          <td className="border border-black p-1 text-center">09</td>
                          <td className="border border-black p-1 text-center">29/01/2026</td>
                          <td className="border border-black p-1">
                            Trần Thị B (Chuyển đơn từ Viện kiểm sát nhân dân tối cao theo Công văn 2222)
                          </td>
                          <td className="border border-black p-1">Ấp Lộc Bình, huyện Lộc Bình, tỉnh Lạng Sơn</td>
                          <td className="border border-black p-1 text-center">29012026_03_HS</td>
                          <td className="border border-black p-1 text-center">15/01/2026</td>
                          <td className="border border-black p-1">Tòa án nhân dân huyện Lộc Bình</td>
                          <td className="border border-black p-1 text-center">1</td>
                          <td className="border border-black p-1 font-medium">Bùi Ngọc Lâm</td>
                          <td className="border border-black p-1">Đơn kèm chứng cứ ngoại phạm mới</td>
                        </tr>
                      ) : (
                        <tr>
                          <td className="border border-black p-1 text-center">1</td>
                          <td className="border border-black p-1 text-center">10</td>
                          <td className="border border-black p-1 text-center">30/01/2026</td>
                          <td className="border border-black p-1">
                            Nguyễn Văn A (Do TAND tỉnh Bắc Giang chuyển đến theo Công văn số 33333 ngày 29/01/2026)
                          </td>
                          <td className="border border-black p-1">Xã Dĩnh Kế, thành phố Bắc Giang, tỉnh Bắc Giang</td>
                          <td className="border border-black p-1 text-center">30012026_04_HC</td>
                          <td className="border border-black p-1 text-center">25/01/2026</td>
                          <td className="border border-black p-1">Tòa án nhân dân tỉnh Bắc Giang</td>
                          <td className="border border-black p-1 text-center">1</td>
                          <td className="border border-black p-1 font-medium">Nguyễn Văn C</td>
                          <td className="border border-black p-1">Khiếu nại QĐHC của UBND tỉnh</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-8">
                  <div className="text-center w-[180px] text-[8.5px]">
                    <div className="font-bold uppercase">CHÁNH VĂN PHÒNG</div>
                    <div className="h-[40px]"></div>
                    <div className="font-bold underline">Nguyễn Tường Linh</div>
                  </div>
                </div>
              </div>
            ) : (
              /* MẪU ĐƠN */
              <div className="w-full max-w-[520px] bg-white border border-[#ccc] shadow-md rounded p-8 relative min-h-[580px] font-serif text-[11px] leading-relaxed text-[#000]">
                {/* Top note */}
                <div className="absolute right-6 top-4 text-[9px] font-mono text-gray-500 italic">YLBS. đơn</div>
                
                {/* Header */}
                <div className="flex flex-col items-end mb-6">
                  <div className="text-center w-[260px] leading-tight">
                    <div className="font-bold uppercase text-[9.5px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="font-bold text-[9.5px] underline decoration-solid underline-offset-4">Độc lập - Tự do - Hạnh phúc</div>
                    <div className="italic text-[9px] mt-2">Dương Minh Châu, ngày 25 tháng 02 năm 2026</div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-6 space-y-1">
                  <div className="text-[12px] font-bold uppercase tracking-wide">ĐƠN ĐỀ NGHỊ</div>
                  <div className="text-[11px] font-bold uppercase tracking-wider">THEO THỦ TỤC GIÁM ĐỐC THẨM</div>
                  <div className="text-[10px] italic">
                    Đối với Bản án số: {
                      selectedNodeId === "don-7031" ? "120/2026/DS-PT ngày 26-01-2026 của Tòa án nhân dân tỉnh Tây Ninh" :
                      selectedNodeId === "don-7032" ? "134/2026/HC-PT ngày 15-02-2026 của Tòa án nhân dân tỉnh Bắc Giang" :
                      selectedNodeId === "don-7033" ? "88/2026/HS-PT ngày 10-01-2026 của Tòa án nhân dân tỉnh Lạng Sơn" :
                      "412/2026/DS-PT ngày 18-02-2026 của Tòa án nhân dân tỉnh Bắc Ninh"
                    }.
                  </div>
                </div>

                {/* Recipient */}
                <div className="mb-4 pl-4 space-y-1 text-[10.5px]">
                  <div><span className="font-bold italic">Kính gửi:</span> - Chánh án Tòa án nhân dân tối cao.</div>
                  <div className="pl-13">- Viện trưởng Viện kiểm sát nhân dân tối cao.</div>
                </div>

                {/* Body details */}
                <div className="space-y-2.5 text-[10.5px] text-justify leading-relaxed">
                  <p>
                    Tôi tên: <span className="font-bold">{
                      selectedNodeId === "don-7031" ? "Bùi Phương Thảo (ủy quyền Nguyễn Văn Lụa)" :
                      selectedNodeId === "don-7032" ? "Nguyễn Văn A" :
                      selectedNodeId === "don-7033" ? "Trần Thị B" : "Lê Văn D"
                    }</span>, sinh năm 1972; địa chỉ: Ấp Phước Tân 3, xã Dương Minh Châu, tỉnh Tây Ninh.
                  </p>
                  <p>Số điện thoại di động: 0786.453.749</p>
                  <p>
                    Là người khởi kiện trong vụ án <span className="italic">“Yêu cầu tuyên bố hợp đồng chuyển nhượng quyền sử dụng đất vô hiệu”</span>.
                  </p>
                  <p>
                    Nay tôi làm đơn này yêu cầu Chánh án Tòa án nhân dân tối cao; Viện trưởng Viện kiểm sát nhân dân tối cao xem xét lại Bản án sơ thẩm và bản án phúc thẩm:
                  </p>
                  <p>
                    + Bản án phúc thẩm số: 120/2026/DS-PT ngày 26-01-2026 của Tòa án nhân dân tỉnh Tây Ninh và bản án sơ thẩm số: 122/2025/DS-ST ngày 22-9-2025 của Tòa án nhân dân khu vực 11-Tây Ninh với những nội dung và nhận định như sau:
                  </p>
                  
                  <div className="border-t border-[#eee] pt-2 mt-4">
                    <span className="font-bold block mb-1">Về vấn đề trước khi tôi khởi kiện:</span>
                    <p className="text-[10px] text-[#444] italic">
                      Tháng 4 năm 2024, tôi có khởi kiện ông Phạm Văn Bốn và bà Nguyễn Thị Đào số tiền 700.000.000 đồng. Đến ngày 21-8-2024, Tòa án nhân dân huyện Dương Minh Châu xét xử vụ án bằng bản án dân sự sơ thẩm số: 118/2024/DS-ST buộc các bên thực thi trách nhiệm...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
const PheDuyetDeXuat = ({ toTrinhList, setToTrinhList, currentRole }: { toTrinhList: ToTrinh[], setToTrinhList: React.Dispatch<React.SetStateAction<ToTrinh[]>>, currentRole: string }) => {
  const [activeTab, setActiveTab] = useState<"all" | "cho_duyet" | "da_duyet" | "tu_choi">("all");
  const [showDuyetPopup, setShowDuyetPopup] = useState<ToTrinh | null>(null);
  const [yKienInput, setYKienInput] = useState("");
  const [nextPersonType, setNextPersonType] = useState<"duyet" | "ky">("duyet");
  const [nextPerson, setNextPerson] = useState("");

  const filteredList = toTrinhList.filter(t => {
    if (activeTab === "cho_duyet" && t.trangThai !== "Chờ duyệt") return false;
    if (activeTab === "da_duyet" && t.trangThai !== "Đã duyệt") return false;
    if (activeTab === "tu_choi" && t.trangThai !== "Từ chối") return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ duyệt": return "bg-[#e8f4ff] text-[#1a73e8] border-[#a9c9f4]";
      case "Đã duyệt": return "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]";
      case "Từ chối": return "bg-[#fde8e8] text-[#8b1a1a] border-[#f5b7b7]";
      case "Chờ ký": return "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]";
      case "Đã ký": return "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]";
      case "Có hiệu lực": return "bg-[#e8f7ee] text-[#1a5a96] border-[#a9c9f4]";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const isTP = currentRole === "truong-phong";
  const isPCVP = currentRole === "pho-vp";
  const isLanhDao = currentRole === "lanh-dao";

  // Workflow steps based on current status
  const getWorkflowSteps = (status: string) => [
    { label: "Tạo", done: true },
    { label: "TP duyệt", done: ["Chờ ký", "Đã ký", "Có hiệu lực"].includes(status) },
    { label: "PCVP duyệt", done: ["Đã ký", "Có hiệu lực"].includes(status) },
    { label: "Ký số", done: ["Có hiệu lực"].includes(status) },
    { label: "CA/PCA", done: false },
  ];

  const openPopup = (t: ToTrinh) => {
    setShowDuyetPopup(t);
    setYKienInput(t.yKienLanhDao || "");
    setNextPersonType("duyet");
    setNextPerson("");
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="px-5 py-4 border-b border-[#e0e0e0]">
        <h1 className="text-[18px] font-bold text-[#1d2e4f] mb-4">Danh sách đề xuất</h1>
        <div className="flex items-center gap-6 border-b border-[#ddd]">
          {(["all","cho_duyet","da_duyet","tu_choi"] as const).map(tab => {
            const labels = { all: "Tất cả", cho_duyet: "Chờ duyệt", da_duyet: "Đã duyệt", tu_choi: "Từ chối" };
            const count = tab === "all" ? toTrinhList.length : toTrinhList.filter(t => t.trangThai === labels[tab]).length;
            return (
              <div
                key={tab}
                className={`px-2 py-2 cursor-pointer font-medium text-[13px] border-b-2 ${activeTab === tab ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#333]"}`}
                onClick={() => setActiveTab(tab)}
              >
                {labels[tab]} ({count})
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-[13px] font-semibold text-[#333]">Danh sách đề xuất</div>
          <div className="flex gap-2">
            <button className="h-[28px] px-3 bg-[#8b1a1a] text-white rounded-[3px] text-[12px] font-medium hover:bg-[#6e1414] transition-colors">Phê duyệt</button>
            <button className="h-[28px] px-3 border border-[#8b1a1a] text-[#8b1a1a] bg-[#fff] rounded-[3px] text-[12px] font-medium hover:bg-[#fdeaea] transition-colors">Trả lại</button>
            <button className="flex items-center gap-1.5 h-[28px] px-3 border border-[#ccc] text-[#333] bg-white rounded-[3px] text-[12px] font-medium hover:bg-gray-50 transition-colors">
              <Download size={14} /> Kết xuất
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#e0e0e0] rounded-[4px] overflow-hidden">
          <table className="w-full text-[12px] text-left">
            <thead className="bg-[#f5f5f5] text-[#333] border-b border-[#e0e0e0]">
              <tr>
                <th className="px-3 py-2 text-center w-[40px]"><input type="checkbox" /></th>
                <th className="px-3 py-2 font-semibold">STT</th>
                <th className="px-3 py-2 font-semibold w-[220px]">Tên vụ án/Tên quyết định</th>
                <th className="px-3 py-2 font-semibold">Nội dung đề xuất</th>
                <th className="px-3 py-2 font-semibold">Loại đề xuất</th>
                <th className="px-3 py-2 font-semibold">Người đề xuất</th>
                <th className="px-3 py-2 font-semibold">Ngày đề xuất</th>
                <th className="px-3 py-2 font-semibold text-center">Trạng thái</th>
                <th className="px-3 py-2 font-semibold w-[150px]">Ý kiến lãnh đạo</th>
                <th className="px-3 py-2 font-semibold text-center w-[70px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((t, idx) => (
                <tr key={t.id} className="border-b border-[#f0f0f0] hover:bg-[#f9f9f9]">
                  <td className="px-3 py-2 text-center"><input type="checkbox" /></td>
                  <td className="px-3 py-2 text-center text-[#666]">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium text-[#333]">{t.tenVuAn}</td>
                  <td className="px-3 py-2 text-[#444]">{t.noiDung}</td>
                  <td className="px-3 py-2 text-[#666]">{t.loai}</td>
                  <td className="px-3 py-2 text-[#333] font-medium">{t.nguoiDeXuat}</td>
                  <td className="px-3 py-2 text-[#666]">{t.ngayDeXuat}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-[10px] text-[10px] font-medium border ${getStatusColor(t.trangThai)}`}>
                      {t.trangThai}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[11px] text-[#666] italic">{t.yKienLanhDao}</td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => openPopup(t)} className="text-[#1a73e8] hover:text-[#1152a3]" title="Xem chi tiết">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr><td colSpan={10} className="text-center py-8 text-[#888] italic">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDuyetPopup && (
        showDuyetPopup.loai.toLowerCase().includes("tờ trình") || showDuyetPopup.loai.toLowerCase().includes("to trinh") ? (
          <PopupLanhDaoPheDuyetYkien onClose={() => setShowDuyetPopup(null)} initialLoaiDeXuat={showDuyetPopup.loai} />
        ) : (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-[6px] shadow-2xl w-[1100px] max-h-[92vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#1d2e4f] text-white flex-shrink-0">
              <div>
                <div className="font-bold text-[15px]">Ký số văn bản — {showDuyetPopup.noiDung}</div>
                <div className="text-[11px] text-white/60 mt-0.5">Công tác lãnh đạo / Phê duyệt đề xuất / Ý kiến lãnh đạo</div>
              </div>
              <button onClick={() => setShowDuyetPopup(null)} className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>


            {/* Body: 2 columns */}
            <div className="flex flex-1 overflow-hidden">

              {/* LEFT: Document preview */}
              <div className="w-[55%] border-r border-[#e0e0e0] bg-[#f0f0f0] overflow-y-auto flex flex-col items-center py-6 px-4 gap-4">
                {/* Document list sidebar within left */}
                <div className="w-full max-w-[520px] bg-white border border-[#ccc] rounded shadow-sm">
                  <div className="px-3 py-2 bg-[#f5f5f5] border-b border-[#ddd] text-[12px] font-semibold text-[#333]">Danh sách tài liệu</div>
                  <div className="p-2 space-y-1">
                    <div className="flex items-center gap-2 p-2 bg-[#e8f4ff] rounded border border-[#b3d4f5] text-[12px] font-medium text-[#1a5a96] cursor-pointer">
                      <FileText size={14} /> Văn bản
                    </div>
                    <div className="pl-4 space-y-1">
                      <div className="flex items-center gap-2 p-1.5 bg-[#fff8e1] rounded text-[11px] text-[#555] cursor-pointer hover:bg-[#fff3cd]">
                        <FileText size={12} className="text-[#f57f17]" /> Tờ trình phân công thẩm phán
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 text-[12px] text-[#555] cursor-pointer hover:bg-[#f9f9f9] rounded">
                      Tài liệu, hồ sơ đính kèm
                    </div>
                    <div className="pl-4 text-[11px] text-[#aaa] italic px-2">Không có tài liệu</div>
                  </div>
                </div>

                {/* Document preview */}
                <div className="w-full max-w-[520px] bg-white border border-[#ccc] shadow-md rounded p-8 relative min-h-[500px]">
                  <div className="text-center mb-6">
                    <div className="text-[11px] font-bold">TÒA ÁN NHÂN DÂN TỐI CAO</div>
                    <div className="text-[10px]">VĂN PHÒNG</div>
                    <div className="w-[60px] h-px bg-black mx-auto my-1" />
                    <div className="text-[10px] text-[#666]">Số: ..../2026/TB-TA</div>
                  </div>
                  <div className="flex justify-end mb-4">
                    <div className="text-[10px] text-center">
                      <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div className="font-medium">Độc lập - Tự do - Hạnh phúc</div>
                      <div className="w-[80px] h-px bg-black mx-auto my-1" />
                      <div className="italic">TP. Hà Nội, ngày..... tháng..... năm.....</div>
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-[13px] font-bold">TỜ TRÌNH</div>
                    <div className="text-[11px] font-semibold mt-1">{showDuyetPopup.noiDung}</div>
                  </div>
                  <div className="text-[11px] leading-relaxed space-y-3">
                    <p>Kính gửi: Lãnh đạo Tòa án nhân dân tối cao.</p>
                    <p>Văn phòng trình Lãnh đạo xem xét phê duyệt danh sách phân công Thẩm phán giải quyết các đơn như sau:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tổng số đơn trình: {showDuyetPopup.danhSachDon?.length || 5} đơn.</li>
                      <li>Phân công cho {showDuyetPopup.danhSachDon?.length || 2} Thẩm phán.</li>
                    </ul>
                    <div className="flex justify-end mt-8">
                      <div className="text-center text-[10px]">
                        <div className="font-bold">TL. CHÁNH ÁN</div>
                        <div className="font-bold">KT. CHÁNH VĂN PHÒNG</div>
                        <div className="font-bold">PHÓ CHÁNH VĂN PHÒNG</div>
                        <div className="italic text-[9px] mt-1">(Ký tên, ghi rõ họ tên, đóng dấu)</div>
                      </div>
                    </div>
                  </div>
                  {showDuyetPopup.trangThai === "Đã duyệt" && (
                    <div className="absolute right-8 bottom-16 text-[#a31515] border-2 border-[#a31515] px-4 py-1.5 font-bold text-[14px] transform -rotate-12 opacity-80 rounded">
                      ĐÃ PHÊ DUYỆT
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Action panel */}
              <div className="w-[45%] flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">

                  {/* Ý kiến lãnh đạo */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#333] mb-1">
                      Nội dung ý kiến lãnh đạo
                    </label>
                    <textarea
                      className="w-full h-[90px] p-2.5 text-[12px] border border-[#ccc] rounded-[3px] outline-none focus:border-[#1a5a96] resize-none"
                      placeholder="Nhập ý kiến chỉ đạo, phê duyệt..."
                      value={yKienInput}
                      onChange={e => setYKienInput(e.target.value)}
                      disabled={showDuyetPopup.trangThai !== "Chờ duyệt"}
                    />
                  </div>

                  {/* Đánh dấu & Ghi chú */}
                  <div className="border border-[#eee] rounded-[4px] overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#f9f9f9] border-b border-[#eee] text-[12px] font-semibold text-[#444]">
                      Đánh dấu & Ghi chú (0)
                    </div>
                    <div className="p-4 text-center text-[11px] text-[#aaa] italic">Chưa có đánh dấu</div>
                    <div className="px-3 pb-3">
                      <button className="w-full h-[30px] border border-dashed border-[#ccc] text-[12px] text-[#888] rounded hover:bg-[#f5f5f5] transition-colors">
                        + Thêm ghi chú mới
                      </button>
                    </div>
                  </div>

                  {/* Ý kiến của lãnh đạo (freetext) */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#333] mb-1">Ý kiến của lãnh đạo</label>
                    <textarea
                      className="w-full h-[70px] p-2.5 text-[12px] border border-[#ccc] rounded-[3px] outline-none focus:border-[#1a5a96] resize-none"
                      placeholder="Nhập ý kiến lãnh đạo..."
                      disabled={showDuyetPopup.trangThai !== "Chờ duyệt"}
                    />
                  </div>


                </div>

                {/* Action Buttons — role-based */}
                <div className="flex items-center justify-between p-4 border-t border-[#e0e0e0] bg-[#fafafa] flex-shrink-0">
                  <button onClick={() => setShowDuyetPopup(null)} className="h-[32px] px-4 bg-white border border-[#ccc] text-[#333] rounded-[3px] text-[12px] font-medium hover:bg-gray-50">
                    Quay lại
                  </button>

                  <div className="flex items-center gap-2">
                    {showDuyetPopup.trangThai === "Chờ duyệt" ? (
                      <>
                        {/* Từ chối — all roles */}
                        <button
                          onClick={() => {
                            setToTrinhList(prev => prev.map(t => t.id === showDuyetPopup.id ? { ...t, trangThai: "Từ chối" } : t));
                            setShowDuyetPopup(null);
                          }}
                          className="h-[32px] px-4 bg-white border border-[#c0392b] text-[#c0392b] rounded-[3px] text-[12px] font-medium hover:bg-[#fdeaea] transition-colors"
                        >
                          Từ chối
                        </button>

                        {isTP ? (
                          /* Trưởng phòng */
                          <>
                            <button className="h-[32px] px-4 bg-white border border-[#1a5a96] text-[#1a5a96] rounded-[3px] text-[12px] font-medium hover:bg-[#f0f7ff] transition-colors">
                              Đồng ý
                            </button>
                            <button
                              onClick={() => {
                                setToTrinhList(prev => prev.map(t => t.id === showDuyetPopup.id ? { ...t, trangThai: "Đã duyệt", yKienLanhDao: yKienInput } : t));
                                triggerNoti(`Tờ trình "${showDuyetPopup.noiDung}" đã được Trưởng phòng phê duyệt.`);
                                setShowDuyetPopup(null);
                              }}
                              className="h-[32px] px-4 bg-[#27ae60] text-white rounded-[3px] text-[12px] font-bold hover:bg-[#219653] transition-colors"
                            >
                              Phê duyệt
                            </button>
                          </>
                        ) : (isPCVP || isLanhDao) ? (
                          /* PCVP / Lãnh đạo */
                          <>
                            <button className="h-[32px] px-4 bg-white border border-[#1a5a96] text-[#1a5a96] rounded-[3px] text-[12px] font-medium hover:bg-[#f0f7ff] transition-colors">
                              Đồng ý
                            </button>
                            <button className="h-[32px] px-4 bg-white border border-[#555] text-[#444] rounded-[3px] text-[12px] font-medium hover:bg-[#f0f0f0] transition-colors">
                              Ký logic
                            </button>
                            <button
                              onClick={() => {
                                setToTrinhList(prev => prev.map(t => t.id === showDuyetPopup.id ? { ...t, trangThai: "Đã duyệt", yKienLanhDao: yKienInput } : t));
                                triggerNoti(`Tờ trình "${showDuyetPopup.noiDung}" đã được Lãnh đạo ký số.`);
                                setShowDuyetPopup(null);
                              }}
                              className="h-[34px] px-5 font-bold text-white rounded-[4px] text-[12px] flex items-center gap-2 shadow-md hover:opacity-90 transition-all"
                              style={{ background: "linear-gradient(135deg, #e91e8c 0%, #c2185b 100%)" }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                              Ký số
                            </button>
                          </>
                        ) : (
                          /* Cán bộ: nút trình duyệt */
                          <button
                            onClick={() => {
                              setToTrinhList(prev => prev.map(t => t.id === showDuyetPopup.id ? { ...t, trangThai: "Chờ duyệt" } : t));
                              triggerNoti(`Tờ trình "${showDuyetPopup.noiDung}" đã được trình duyệt.`);
                              setShowDuyetPopup(null);
                            }}
                            className="h-[32px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[12px] font-bold hover:bg-[#6e1414] flex items-center gap-1.5 transition-colors"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            Trình duyệt
                          </button>
                        )}
                      </>
                    ) : showDuyetPopup.trangThai === "Đã duyệt" ? (
                      /* Đã duyệt: chỉ cho in */
                      <button className="h-[32px] px-4 bg-white border border-[#1a5a96] text-[#1a5a96] rounded-[3px] text-[12px] font-medium hover:bg-[#f0f7ff] flex items-center gap-1.5 transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        In văn bản
                      </button>
                    ) : showDuyetPopup.trangThai === "Từ chối" ? (
                      /* Từ chối: cho sửa và gửi lại */
                      <button
                        onClick={() => {
                          setToTrinhList(prev => prev.map(t => t.id === showDuyetPopup.id ? { ...t, trangThai: "Chờ duyệt", yKienLanhDao: "" } : t));
                          triggerNoti(`Tờ trình "${showDuyetPopup.noiDung}" đã được trình lại.`);
                          setShowDuyetPopup(null);
                        }}
                        className="h-[32px] px-4 bg-[#f57f17] text-white rounded-[3px] text-[12px] font-bold hover:bg-[#e65100] flex items-center gap-1.5 transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                        Gửi lại
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          )
        )}
    </div>
  );
};


export default function App() {
  const [view, setView] = useState<"home" | "list" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet">("home");
  const [toTrinhList, setToTrinhList] = useState<ToTrinh[]>([
    {
      id: "TT-2026-001",
      tenVuAn: "Đơn đề nghị số 41/2024/DS-PT - TAND tỉnh Bắc Ninh",
      noiDung: "V/v Xác nhận đã thụ lý hồ sơ giám đốc thẩm",
      loai: "Giấy xác nhận",
      nguoiDeXuat: "Vũ Văn Yên",
      ngayDeXuat: "30/07/2026 08:15",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7031", nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh", thamPhan: "Nguyễn Văn Hiền" }],
    },
    {
      id: "TT-2026-002",
      tenVuAn: "Đơn chuyển giao hồ sơ của TAND tỉnh Bắc Giang",
      noiDung: "V/v Xác nhận cơ quan chuyển đơn hợp lệ",
      loai: "Giấy xác nhận cơ quan chuyển đơn",
      nguoiDeXuat: "Phùng Trâm Anh",
      ngayDeXuat: "29/07/2026 14:32",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7028", nguoiGui: "Lê Thị Mai", thamPhan: "Nguyễn Như Thắng" }],
    },
    {
      id: "TT-2026-003",
      tenVuAn: "Vụ án dân sự số 112/2025/DS-GDT",
      noiDung: "V/v Chuyển hồ sơ giải quyết nội bộ vụ án dân sự",
      loai: "Công văn chuyển nội bộ",
      nguoiDeXuat: "Vũ Văn Yên",
      ngayDeXuat: "28/07/2026 09:00",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7022", nguoiGui: "Hoàng Minh Tú", thamPhan: "Nguyễn Như Thắng" }],
    },
    {
      id: "TT-2026-004",
      tenVuAn: "Đơn tranh chấp thương mại số 89/2025/KDTM-GDT",
      noiDung: "V/v Chuyển đơn sang Tòa án nhân dân cấp cao tại Đà Nẵng",
      loai: "Công văn chuyển tòa khác",
      nguoiDeXuat: "Phùng Trâm Anh",
      ngayDeXuat: "25/07/2026 16:45",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7026", nguoiGui: "Trần Văn Bình", thamPhan: "" }],
    },
    {
      id: "TT-2026-005",
      tenVuAn: "Vụ án hành chính số 15/2026/HC-GDT - TAND tỉnh Hà Nam",
      noiDung: "V/v Chuyển hồ sơ ngoài ngành liên quan khiếu kiện",
      loai: "Công văn chuyển ngoài",
      nguoiDeXuat: "Vũ Văn Yên",
      ngayDeXuat: "22/07/2026 10:20",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7030", nguoiGui: "Nguyễn Văn Quyền", thamPhan: "Nguyễn Như Thắng" }],
    },
    {
      id: "TT-2026-006",
      tenVuAn: "Đơn đề nghị giám đốc thẩm số 54682577",
      noiDung: "Quyết định trả lại đơn đề nghị giám đốc thẩm do hết thời hạn",
      loai: "Trả lại đơn",
      nguoiDeXuat: "Vũ Văn Yên",
      ngayDeXuat: "30/07/2026 17:41",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7031", nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh", thamPhan: "Nguyễn Văn Hiền" }],
    },
    {
      id: "TT-2026-007",
      tenVuAn: "Vụ án hình sự sơ thẩm quận Hoàn Kiếm",
      noiDung: "Tờ trình phân công thẩm phán chủ trì giải quyết vụ án",
      loai: "Tờ trình phân công",
      nguoiDeXuat: "Phạm Minh Đức",
      ngayDeXuat: "31/07/2026 09:30",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7040", nguoiGui: "TAND Quận Hoàn Kiếm", thamPhan: "" }],
    },
    {
      id: "TT-2026-008",
      tenVuAn: "Yêu cầu giám định tài chính doanh nghiệp",
      noiDung: "Tờ trình đề xuất chi phí giám định tư pháp bổ sung",
      loai: "Tờ trình khác",
      nguoiDeXuat: "Đỗ Thu Trang",
      ngayDeXuat: "01/08/2026 14:15",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7041", nguoiGui: "Ngân hàng Nhà nước", thamPhan: "" }],
    },
    {
      id: "TT-2026-009",
      tenVuAn: "Vụ án dân sự tranh chấp đất đai tại Từ Sơn",
      noiDung: "Thông báo phân công Thẩm phán Nguyễn Như Thắng",
      loai: "Thông báo phân công TP",
      nguoiDeXuat: "Nguyễn Văn Hiền",
      ngayDeXuat: "01/08/2026 16:00",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7042", nguoiGui: "TAND TP Từ Sơn", thamPhan: "" }],
    },
    {
      id: "TT-2026-010",
      tenVuAn: "Tranh chấp ly hôn có yếu tố nước ngoài",
      noiDung: "Yêu cầu đương sự bổ sung tài liệu hợp pháp hóa lãnh sự",
      loai: "Yêu cầu bổ sung",
      nguoiDeXuat: "Trần Thị Lan",
      ngayDeXuat: "02/08/2026 10:00",
      trangThai: "Chờ duyệt",
      yKienLanhDao: "",
      danhSachDon: [{ maDon: "Mã 7043", nguoiGui: "Lê Văn Tám", thamPhan: "" }],
    },
  ]);

  const [currentRole, setCurrentRole] = useState<"can-bo" | "truong-phong" | "pho-vp" | "lanh-dao">("can-bo");
  const [notifications, setNotifications] = useState<{ id: number, text: string, time: string, read: boolean }[]>([
    { id: 1, text: "Đơn 7031 đã được phân công cho cán bộ Nguyễn Văn An", time: "08:30", read: false }
  ]);
  const [showNoti, setShowNoti] = useState(false);
  const addNotification = (text: string) => {
    setNotifications(prev => [{
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      read: false
    }, ...prev]);
  };

  useEffect(() => {
    const handler = (e: any) => addNotification(e.detail);
    notiEmitter.addEventListener('notify', handler);
    return () => notiEmitter.removeEventListener('notify', handler);
  }, []);

  const [bieuMauRow, setBieuMauRow] = useState<typeof SAMPLE_ROWS[0] | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [phanCongTab, setPhanCongTab] = useState<0 | 1 | 2>(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showBiCaoPopup, setShowBiCaoPopup] = useState(false);
  const [showThamPhanPopup, setShowThamPhanPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showTraLaiForm, setShowTraLaiForm] = useState(false);
  const [traLaiReason, setTraLaiReason] = useState("");
  const [congVans, setCongVans] = useState<CongVan[]>([]);
  const [hinhThuc, setHinhThuc] = useState("Đơn đề nghị GĐT-TT");
  const [loaiDonChuyenDon, setLoaiDonChuyenDon] = useState("Đơn đề nghị GĐT-TT");
  const isDon = LOAI_DON.has(hinhThuc);
  const isKhangNghi = hinhThuc === LOAI_KHANG_NGHI;
  const isDonKhieuNaiTuPhap = hinhThuc === "Đơn khiếu nại tư pháp - tố tụng" || (hinhThuc === "CV chuyển đơn" && loaiDonChuyenDon === "Đơn khiếu nại tư pháp - tố tụng");
  const isDonKhac = hinhThuc === "Đơn khác";
  const isCVKemDon = hinhThuc === "CV chuyển đơn";
  const secOffset = isCVKemDon ? 1 : 0;
  const [loaiDonKhieuNai, setLoaiDonKhieuNai] = useState("");
  const [yKienChiDaoCV, setYKienChiDaoCV] = useState("Không");
  const [loaiAnForm, setLoaiAnForm] = useState("");
  const [anTuHinh, setAnTuHinh] = useState(false);
  const [showPDF, setShowPDF] = useState(true);
  const [xinGiamAnTuHinh, setXinGiamAnTuHinh] = useState(false);
  const [keuOanAnTuHinh, setKeuOanAnTuHinh] = useState(false);
  const [xinThiHanhAnSom, setXinThiHanhAnSom] = useState(false);
  const [khongCoGDT, setKhongCoGDT] = useState(false);
  const [xulychuynhuong, setXulychuynhuong] = useState(false);
  const [trangThaiDon, setTrangThaiDon] = useState("");
  const [thuLyDon, setThuLyDon] = useState("");
  const [vuTruong, setVuTruong] = useState("");
  const [lyDoKhongDu, setLyDoKhongDu] = useState("");
  const [noiChuyenDen, setNoiChuyenDen] = useState("");
  const [donViChuyenDen, setDonViChuyenDen] = useState("");
  const [caNhanChuyenDen, setCaNhanChuyenDen] = useState("");
  const [coBanAnLienQuan, setCoBanAnLienQuan] = useState(false);
  const [coCongVanPhucDap, setCoCongVanPhucDap] = useState(false);
  const [baSearched, setBaSearched] = useState(false);
  const [selectedVuAnGoc, setSelectedVuAnGoc] = useState<number | null>(null);
  const [loaiQDBa, setLoaiQDBa] = useState("Bản án");
  const NHAN_SO_NGAY_BA: Record<string, [string, string]> = {
    "Bản án": ["Số bản án", "Ngày bản án"],
    "Quyết định": ["Số quyết định", "Ngày quyết định"],
    "Công văn": ["Số công văn", "Ngày công văn"],
    "Thông báo": ["Số thông báo", "Ngày thông báo"],
  };
  const loaiQDBaOptions = hinhThuc === "Đơn khiếu nại tư pháp - tố tụng"
    ? ["Bản án", "Quyết định", "Công văn", "Thông báo"]
    : ["Bản án", "Quyết định"];
  const loaiQDBaEffective = loaiQDBaOptions.includes(loaiQDBa) ? loaiQDBa : loaiQDBaOptions[0];
  const [nhanSoBA, nhanNgayBA] = NHAN_SO_NGAY_BA[loaiQDBaEffective] ?? NHAN_SO_NGAY_BA["Bản án"];
  const [baForm, setBaForm] = useState({ soBA: "", ngayBA: "", toaBA: "", capXetXu: "" });
  const [ocrFields, setOcrFields] = useState<Set<string>>(new Set());
  const editingRow = SAMPLE_ROWS.find(r => r.id === editingRowId) ?? null;

  const OCR_MOCK: Record<string, string> = {
    nguoiGui: "Nguyễn Văn An",
    ngayNhan: "2024-03-15",
    loaiQDBa: "Bản án",
    soBA: "15/2021/HC-ST",
    ngayBA: "2021-05-10",
    toaXetXu: "TAND tỉnh Bắc Ninh",
    capXetXu: "Sơ thẩm",
    loaiAn: "Hành chính",
    quanHe: "Tranh chấp hành chính về đất đai",
  };

  useEffect(() => {
    if (view === "form") setOcrFields(new Set(Object.keys(OCR_MOCK)));
  }, [view]);

  const OcrWrap = ({ fieldKey, children }: { fieldKey: string; children: React.ReactNode }) => {
    const isOcr = ocrFields.has(fieldKey);
    return (
      <div className={`relative transition-all ${isOcr ? "rounded-[3px] bg-[#fffbeb]" : ""}`}>
        {children}
        {isOcr && (
          <span title="OCR · Trích xuất tự động, vui lòng kiểm tra lại" className="absolute top-0 right-0 flex items-center gap-0.5 text-[#b45309] text-[9px] font-bold leading-none z-10 whitespace-nowrap cursor-default">
            <AlertCircle size={9} /> OCR
          </span>
        )}
      </div>
    );
  };

  const BA_SEARCH_RESULTS = [
    { id: 1, vuAn: "Nguyễn Văn An kiện UBND tỉnh Bắc Ninh", loai: "Bản án", giaiDoan: "Sơ thẩm", soBA: "15/2021/HC-ST", ngayBA: "10/05/2021", toaAn: "TAND tỉnh Bắc Ninh", isDuplicate: false },
    { id: 2, vuAn: "Nguyễn Văn An kiện UBND tỉnh Bắc Ninh", loai: "Bản án", giaiDoan: "Phúc thẩm", soBA: "15/2023/HC-PT", ngayBA: "12/03/2023", toaAn: "TAND tỉnh Bắc Ninh", isDuplicate: true },
    { id: 3, vuAn: "Nguyễn Văn An và cộng sự — tranh chấp đất đai", loai: "Bản án", giaiDoan: "Phúc thẩm", soBA: "15/2023/HC-PT", ngayBA: "12/03/2023", toaAn: "TAND tỉnh Bắc Ninh", isDuplicate: true },
    { id: 4, vuAn: "Nguyễn Văn An kiện UBND tỉnh Bắc Ninh", loai: "Quyết định", giaiDoan: "Giám đốc thẩm", soBA: "15/2024/GĐT-HC", ngayBA: "20/01/2024", toaAn: "TAND tỉnh Bắc Ninh", isDuplicate: true },
  ];

  const selectedBaResult = BA_SEARCH_RESULTS.find(r => r.id === selectedVuAnGoc) ?? null;
  const hasGiamDocThamResult = selectedBaResult?.giaiDoan === "Giám đốc thẩm";

  const delCV = (id: number) => setCongVans(p => p.filter(c => c.id !== id));

  return (
    <div className="min-h-screen bg-[#eef1f5] font-['Be_Vietnam_Pro',system-ui,sans-serif] text-[13px] text-[#222]">

      {/* ── Top navigation bar ───────────────────────────────────────────── */}
      <div className="bg-[#1d2e4f] text-white flex items-center h-[46px] px-3 gap-3 shadow-md">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-[30px] h-[30px] bg-white/20 rounded flex items-center justify-center">
            <Menu size={16} />
          </div>
          <div>
            <div className="text-[10px] text-white/70 leading-none">TÒA ÁN NHÂN DÂN TỐI CAO</div>
            <div className="text-[12px] font-bold leading-none">HỆ THỐNG QUẢN LÝ ÁN</div>
          </div>
        </div>
        <div className="h-5 w-px bg-white/30" />
        <span className="text-[13px] font-semibold text-white/90 flex items-center gap-1.5">
          <FileText size={14} />
          {view === "list"
            ? "Danh sách đơn"
            : view === "prototype"
              ? "Prototype: Luồng Ghép đơn"
              : view === "bieumau"
                ? "Danh sách biểu mẫu đơn"
                : view === "wordeditor"
                  ? "Chỉnh sửa biểu mẫu"
                  : editingRow
                    ? `Sửa đơn ${editingRow.maDon}`
                    : "Thêm mới Đơn đề nghị GĐT/TT"}
        </span>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setShowNoti(!showNoti)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white relative">
              <Bell size={16} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[#e74c3c] rounded-full border border-[#1d2e4f]" />
              )}
            </button>
            {showNoti && (
              <div className="absolute right-0 top-full mt-2 w-[320px] bg-white rounded-[4px] shadow-lg border border-[#ddd] z-50 text-[#333] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#f9f9f9] border-b border-[#eee]">
                  <span className="font-semibold text-[13px]">Thông báo</span>
                  <button onClick={() => setNotifications(p => p.map(n => ({ ...n, read: true })))} className="text-[11px] text-[#1a5a96] hover:underline">Đánh dấu đã đọc</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-[#888] text-[12px]">Không có thông báo nào</div>
                  ) : notifications.map(n => (
                    <div key={n.id} onClick={() => setNotifications(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))} className={`p-3 border-b border-[#f5f5f5] last:border-0 hover:bg-[#fafafa] cursor-pointer transition-colors ${!n.read ? 'bg-[#f0f7ff]' : ''}`}>
                      <p className="text-[12px] leading-snug">{n.text}</p>
                      <span className="text-[10px] text-[#888] mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {view === "form" && (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              {ocrFields.size > 0 && (
                <button onClick={() => setOcrFields(new Set())}
                  className="flex items-center gap-1 h-[28px] px-2 rounded-[3px] border border-white/20 text-white/80 hover:bg-white/10 text-[11px] transition-colors">
                  <X size={10} /> Xóa highlight
                </button>
              )}
              <BtnSecondary onClick={() => setShowTraLaiForm(true)} className="h-[28px] text-[12px] px-3 gap-1 bg-transparent border border-white/20 text-white hover:bg-white/10">
                <RotateCcw size={13} /> Trả lại
              </BtnSecondary>
              <BtnSecondary onClick={() => setView("list")} className="bg-transparent border border-white/20 text-white hover:bg-white/10">Hủy</BtnSecondary>
              <BtnPrimary onClick={() => { addNotification(`Đơn ${editingRow?.maDon || "7031"} đã được thêm mới bởi cán bộ Nguyễn Văn An`); setView("list"); }}>Lưu</BtnPrimary>
            </div>
          )}
        </div>
      </div>

      {/* ── Body: Sidebar + content ──────────────────────────────────────── */}
      <div className="flex" style={{ height: "calc(100vh - 46px)" }}>

        {/* Sidebar */}
        <Sidebar activePage={view} onNav={(page) => setView(page as any)} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Breadcrumb */}
          <div className="bg-white border-b border-[#ddd] px-4 py-[6px] flex items-center gap-1 text-[12px] text-[#666] flex-shrink-0">
            <span className="text-[#1a5a96] hover:underline cursor-pointer">Trang chủ</span>
            <ChevronRight size={12} />
            <span className="text-[#1a5a96] hover:underline cursor-pointer">Quản lý đơn</span>
            <ChevronRight size={12} />
            {view === "home"
              ? <span className="text-[#333]">Tổng quan</span>
              : view === "list"
                ? <span className="text-[#333]">Danh sách đơn</span>
                : view === "prototype"
                  ? <>
                    <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh sách đơn</span>
                    <ChevronRight size={12} />
                    <span className="text-[#333]">Prototype: Ghép đơn</span>
                  </>
                  : view === "bieumau"
                    ? <>
                      <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh sách đơn</span>
                      <ChevronRight size={12} />
                      <span className="text-[#333]">Danh sách biểu mẫu đơn</span>
                    </>
                    : view === "wordeditor"
                      ? <>
                        <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh sách đơn</span>
                        <ChevronRight size={12} />
                        <span className="text-[#333]">Chỉnh sửa biểu mẫu</span>
                      </>
                                            : view === "phancong"
                        ? <span className="text-[#333]">Phân công thẩm phán</span>
                        : view === "phe_duyet"
                          ? <>
                              <span className="text-[#1a5a96] hover:underline cursor-pointer">Công tác lãnh đạo</span>
                              <ChevronRight size={12} />
                              <span className="text-[#333]">Phê duyệt đề xuất</span>
                            </>
                          : <>
                          <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh sách đơn</span>
                          <ChevronRight size={12} />
                          <span className="text-[#333]">Thêm mới</span>
                        </>
            }
          </div>

          {/* Home view */}
          {view === "home" && (
            <div className="flex-1 overflow-y-auto">
              <Dashboard />
            </div>
          )}

          {/* Phê duyệt đề xuất view */}
          {view === "phe_duyet" && (
            <PheDuyetDeXuat toTrinhList={toTrinhList} setToTrinhList={setToTrinhList} currentRole={currentRole} />
          )}


          {/* List view */}
          {view === "list" && (
            <div className="flex-1 overflow-y-auto">
              <DanhSachDon
                currentRole={currentRole}
                onCreateToTrinh={(t) => setToTrinhList([t, ...toTrinhList])}
                onThemMoi={() => { 
                  setEditingRowId(null); 
                  setView("form"); 
                  setShowPDF(false);
                  setShowUploadPopup(true);
                }}
                onBieuMau={(r) => { setBieuMauRow(r); setView("bieumau"); }}
                onWordEditor={() => setView("wordeditor")}
                onEditRow={(id) => { setEditingRowId(id); setView("form"); }}
                isTruongPhong={false}
              />
            </div>
          )}

          {/* Biểu mẫu view */}
          {view === "bieumau" && bieuMauRow && (
            <div className="flex-1 overflow-y-auto">
              <DanhSachBieuMau row={bieuMauRow} onBack={() => setView("list")} />
            </div>
          )}

          {/* Word editor view */}
          {view === "wordeditor" && (
            <div className="flex-1 overflow-y-auto">
              <WordEditor onBack={() => setView("list")} />
            </div>
          )}

          {/* Phân công thẩm phán view */}
          {view === "phancong" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <PhanCongThamPhan initialTab={phanCongTab} onOpenThamPhanPopup={() => setShowThamPhanPopup(true)} />
            </div>
          )}

          {/* Form view: 2-panel */}
          <div className={`flex flex-1 overflow-hidden ${view === "form" ? "" : "hidden"}`}>

            {/* LEFT: Form panel */}
            <div className={`${showPDF ? "w-[58%]" : "w-full"} min-w-[540px] overflow-y-auto bg-[#eef1f5] transition-all`}>
              <div className="p-3 space-y-3">

                {/* OCR notice banner */}
                {ocrFields.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#fffbeb] border border-[#f59e0b] rounded-[3px] text-[12px] text-[#92400e]">
                    <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[10px] font-bold px-1.5 py-[2px] rounded-sm">OCR</span>
                    <span>Các trường được đánh dấu đã được trích xuất tự động từ tài liệu. Vui lòng kiểm tra và xác nhận lại thông tin.</span>
                    <button onClick={() => setOcrFields(new Set())} className="ml-auto flex-shrink-0 text-[#92400e] hover:text-[#78350f]"><X size={13} /></button>
                  </div>
                )}

                {/* 1. Thông tin chung */}
                <Section title="1. Thông tin chung">
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      <Lbl req>Hình thức nhận</Lbl>
                      <Sel>
                        <option value="">-- Chọn hình thức nhận --</option>
                        <option>Bưu điện</option>
                        <option>Điện tử</option>
                        <option>Trực tiếp</option>
                        <option>Nội bộ</option>
                      </Sel>
                    </div>
                    <div>
                      <Lbl req>Hình thức đơn</Lbl>
                      <div className="relative">
                        <select value={hinhThuc} onChange={e => setHinhThuc(e.target.value)}
                          className="w-full h-[30px] px-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] appearance-none">
                          <option value="">-- Chọn hình thức --</option>
                          <optgroup label="— Đơn">
                            <option value="Đơn đề nghị GĐT-TT">1. Đơn đề nghị GĐT-TT</option>
                            <option value="Đơn khiếu nại tư pháp - tố tụng">2. Đơn khiếu nại tư pháp - tố tụng</option>
            <option value="Đơn khiếu nại tư pháp - hành vi">3. Đơn khiếu nại tư pháp - hành vi</option>
                            <option value="Thông báo phát hiện vi phạm pháp luật">4. Thông báo phát hiện vi phạm pháp luật</option>
                            <option value="Đơn khác">5. Đơn khác</option>
                          </optgroup>
                          <optgroup label="— Công văn">
                            <option value="CV kiến nghị GĐT-TT">1. CV kiến nghị GĐT-TT</option>
                            <option value="CV chuyển đơn">2. CV chuyển đơn</option>
                            <option value="CV chuyển kiến nghị GĐT-TT">3. CV chuyển kiến nghị GĐT-TT</option>
                            <option value="CV khác">4. CV khác</option>
                          </optgroup>
                          <optgroup label="— Tài liệu">
                            <option value="Tài liệu chứng cứ">Tài liệu chứng cứ</option>
                          </optgroup>
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
                      </div>
                    </div>
                    {/* Radio group cho CV chuyển đơn */}
                    {hinhThuc === "CV chuyển đơn" && (
                      <div className="col-span-3 flex items-center gap-1 px-3 py-[6px] bg-[#fffaf7] border border-[#e8d9cc] rounded mb-1">
                        <span className="text-[12px] font-medium text-[#c0392b] mr-1 whitespace-nowrap">
                          Loại đơn<span className="ml-0.5 text-[#c0392b]">*</span>:
                        </span>
                        <div className="flex items-center gap-5">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="loai-don-cv-chuyen-don"
                              value="Đơn đề nghị GĐT-TT"
                              checked={loaiDonChuyenDon === "Đơn đề nghị GĐT-TT"}
                              onChange={(e) => setLoaiDonChuyenDon(e.target.value)}
                              className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            />
                            <span className="text-[12px] text-[#222]">Đơn đề nghị GĐT/TT</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="loai-don-cv-chuyen-don"
                              value="Đơn khiếu nại tư pháp - tố tụng"
                              checked={loaiDonChuyenDon === "Đơn khiếu nại tư pháp - tố tụng"}
                              onChange={(e) => setLoaiDonChuyenDon(e.target.value)}
                              className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            />
                            <span className="text-[12px] text-[#222]">Đơn khiếu nại tư pháp - tố tụng</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="loai-don-cv-chuyen-don"
                              value="Thông báo phát hiện vi phạm pháp luật"
                              checked={loaiDonChuyenDon === "Thông báo phát hiện vi phạm pháp luật"}
                              onChange={(e) => setLoaiDonChuyenDon(e.target.value)}
                              className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            />
                            <span className="text-[12px] text-[#222]">Thông báo phát hiện vi phạm pháp luật</span>
                          </label>
                        </div>
                      </div>
                    )}
                    {/* Các checkbox thêm khi hinhThuc === "CV khác" */}
                    {hinhThuc === "CV khác" && (
                      <div className="flex flex-col gap-2 pb-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={coBanAnLienQuan} onChange={e => setCoBanAnLienQuan(e.target.checked)} />
                          Có bản án/quyết định liên quan
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={coCongVanPhucDap} onChange={e => setCoCongVanPhucDap(e.target.checked)} />
                          Có công văn phúc đáp
                        </label>
                      </div>
                    )}
                    <div>
                      <Lbl>Thủ tục giải quyết</Lbl>
                      <Sel>
                        <option value="">-- Chọn --</option>
                        <option>Giám đốc thẩm</option>
                        <option>Tái thẩm</option>
                        <option>Giám đốc thẩm + Tái thẩm</option>
                        <option>Chưa xác định</option>
                      </Sel>
                    </div>
                  </div>
                </Section>

                {/* 2. Thông tin bản án đề nghị */}
                {(hinhThuc !== "CV khác" || coBanAnLienQuan) && (
                  <Section title="2. Thông tin bản án đề nghị" defaultOpen={!isDonKhac}>
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-x-4 items-end">
                        <div>
                          <Lbl req={!isDonKhac && !khongCoGDT}>Loại QĐ/BA</Lbl>
                          <Sel value={loaiQDBaEffective} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLoaiQDBa(e.target.value)}>
                            {loaiQDBaOptions.map(o => <option key={o}>{o}</option>)}
                          </Sel>
                        </div>
                        <div>
                          <Lbl req={!isDonKhac && !khongCoGDT}>Loại án</Lbl>
                          <Sel value={ocrFields.has("loaiAn") && !loaiAnForm ? "Hành chính" : loaiAnForm} onChange={e => { setLoaiAnForm(e.target.value); if (e.target.value !== "Hình sự") setAnTuHinh(false); }}>
                            <option value="">-- Chọn --</option>
                            <option>Hình sự</option>
                            <option>Dân sự</option>
                            <option>Hành chính</option>
                            <option>Kinh doanh thương mại</option>
                            <option>Hôn nhân gia đình</option>
                            <option>Lao động</option>
                            <option>Sở hữu trí tuệ</option>
                            <option>Phá sản</option>
                          </Sel>
                        </div>
                        {isDonKhieuNaiTuPhap && (
                          <div>
                            <Lbl req={!isDonKhac && !khongCoGDT}>Loại đơn</Lbl>
                            <div className="flex items-center gap-5 h-[30px]">
                              {["Đơn khiếu nại", "Đơn tố cáo"].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                                  <input type="radio" name="loaiDonKhieuNai" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                                    checked={loaiDonKhieuNai === opt}
                                    onChange={() => setLoaiDonKhieuNai(opt)} />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-x-3 items-end">
                        <OcrWrap fieldKey="soBA">
                          <div>
                            <Lbl req={!isDonKhac && !khongCoGDT}>{nhanSoBA}</Lbl>
                            <Inp placeholder={`Nhập ${nhanSoBA.toLowerCase()}`} value={baForm.soBA || (ocrFields.has("soBA") ? OCR_MOCK.soBA : "")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaForm(p => ({ ...p, soBA: e.target.value }))} />
                          </div>
                        </OcrWrap>
                        <OcrWrap fieldKey="ngayBA">
                          <div>
                            <Lbl req={!isDonKhac && !khongCoGDT}>{nhanNgayBA}</Lbl>
                            <Inp type="date" value={baForm.ngayBA || (ocrFields.has("ngayBA") ? OCR_MOCK.ngayBA : "")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaForm(p => ({ ...p, ngayBA: e.target.value }))} />
                          </div>
                        </OcrWrap>
                        <OcrWrap fieldKey="toaXetXu">
                          <div>
                            <Lbl req={!isDonKhac && !khongCoGDT}>Tòa ra bản án</Lbl>
                            <Inp placeholder="Nhập tên tòa" value={baForm.toaBA || (ocrFields.has("toaXetXu") ? OCR_MOCK.toaXetXu : "")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaForm(p => ({ ...p, toaBA: e.target.value }))} />
                          </div>
                        </OcrWrap>
                        <div className="flex-1">
                          <Lbl req={!isDonKhac && !khongCoGDT}>Cấp xét xử</Lbl>
                          <Sel value={baForm.capXetXu || (ocrFields.has("capXetXu") ? OCR_MOCK.capXetXu : "")} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBaForm(p => ({ ...p, capXetXu: e.target.value }))}>
                            <option value="">-- Chọn --</option>
                            <option>Sơ thẩm</option>
                            <option>Phúc thẩm</option>
                            <option>Giám đốc thẩm</option>
                            <option>Tái thẩm</option>
                          </Sel>
                        </div>
                        <div className="flex items-end gap-2 mt-1">
                          <button onClick={() => { setBaSearched(true); setSelectedVuAnGoc(null); }}
                            className="flex-shrink-0 flex items-center gap-1.5 h-[30px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[12px] font-medium transition-colors whitespace-nowrap">
                            <Search size={12} /> Tra cứu
                          </button>

                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="flex items-center gap-3 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]" />
                          Án quá thời hiệu 1 năm
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]" />
                          Án quá thời hiệu 3 năm
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]" />
                          Án quá thời hiệu 5 năm
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={khongCoGDT} onChange={e => setKhongCoGDT(e.target.checked)} />
                          Không có nội dung GĐT,TT
                        </label>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-semibold text-[#444]">Danh sách bản án/quyết định liên quan</span>
                          <BtnAdd><Plus size={12} /> Thêm</BtnAdd>
                        </div>
                        {!baSearched ? (
                          <Tbl headers={["STT", "Vụ án", "Loại BA/QĐ", "Giai đoạn", "Số bản án", "Ngày ra bản án", "Tòa án ra bản án", "Trạng thái bản án", "Thao tác"]} emptyMsg="Chưa có dữ liệu" />
                        ) : (
                          <table className="w-full border-collapse text-[12px]">
                            <thead>
                              <tr className="bg-[#f5f5f5]">
                                {["STT", "Vụ án", "Loại BA/QĐ", "Giai đoạn", "Số bản án", "Ngày ra bản án", "Tòa án ra bản án", "Trạng thái bản án", "Thao tác"].map(h => (
                                  <th key={h} className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] whitespace-nowrap">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {BA_SEARCH_RESULTS.map((r, i) => (
                                <tr key={r.id} className={`align-top ${selectedVuAnGoc === r.id ? "bg-[#e8f7ee]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                                  <td className="border border-[#ddd] px-3 py-2 text-center text-[#666]">{i + 1}</td>
                                  <td className="border border-[#ddd] px-3 py-2 text-[#1a5a96]">{r.vuAn}</td>
                                  <td className="border border-[#ddd] px-3 py-2 text-[#555]">{r.loai}</td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <span className={`inline-block px-1.5 py-[2px] rounded text-[10px] font-medium border ${r.giaiDoan === "Sơ thẩm" ? "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]" : "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"}`}>
                                      {r.giaiDoan}
                                    </span>
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2 font-medium">{r.soBA}</td>
                                  <td className="border border-[#ddd] px-3 py-2 text-[#555]">{r.ngayBA}</td>
                                  <td className="border border-[#ddd] px-3 py-2 text-[#555]">{r.toaAn}</td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <span className={`inline-block px-1.5 py-[2px] rounded text-[10px] font-medium border ${r.giaiDoan === "Sơ thẩm"
                                      ? "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]"
                                      : "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"
                                      }`}>
                                      {r.giaiDoan === "Sơ thẩm" ? "Đang giải quyết" : "Đã giải quyết"}
                                    </span>
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      {r.isDuplicate && (
                                        selectedVuAnGoc === r.id ? (
                                          <span className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium bg-[#27ae60] text-white">
                                            <Check size={10} /> Đã chọn
                                          </span>
                                        ) : (
                                          <button onClick={() => {
                                            setSelectedVuAnGoc(r.id);
                                            setBaForm({ soBA: r.soBA, ngayBA: r.ngayBA.split("/").reverse().join("-"), toaBA: r.toaAn, capXetXu: r.giaiDoan });
                                          }}
                                            className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium bg-[#fff3cd] border border-[#ffc107] text-[#856404] hover:bg-[#ffe69c] transition-colors whitespace-nowrap">
                                            Chọn vụ án gốc
                                          </button>
                                        )
                                      )}
                                      <button className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                                        <Trash2 size={10} /> Xóa
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>

                      {/* Thông báo trả lời đơn */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-semibold text-[#444]">Thông báo trả lời đơn</span>
                          <BtnAdd><Plus size={12} /> Thêm</BtnAdd>
                        </div>
                        <Tbl
                          headers={["STT", "Số thông báo", "Ngày thông báo", "Tòa án", "Thao tác"]}
                          emptyMsg="Chưa có dữ liệu"
                        />
                      </div>

                      {/* Danh sách đơn liên quan */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-semibold text-[#444]">Danh sách đơn liên quan</span>
                          <BtnAdd><Plus size={12} /> Thêm</BtnAdd>
                        </div>
                        <Tbl
                          headers={["STT", "Mã đơn", "Ngày nhận", "Người gửi đơn", "Thông tin đơn", "Thông tin giải quyết đơn", "Người nhập", "Thao tác"]}
                          emptyMsg="Chưa có dữ liệu"
                        />
                      </div>
                    </div>
                  </Section>
                )}

                {/* 3. Thông tin đơn (chỉ CV chuyển đơn: hiện thêm khối Thông tin đơn trước Thông tin công văn) */}
                {isCVKemDon && (
                  <Section title="3. Thông tin đơn">
                    <DonFields />
                  </Section>
                )}

                {/* 3/4. Thông tin đơn / công văn / kháng nghị */}
                <Section
                  title={isKhangNghi ? "3. Quyết định kháng nghị" : isDon ? "3. Thông tin đơn" : `${3 + secOffset}. Thông tin công văn`}
                  extra={!isDon ? <BtnAdd onClick={() => setShowPopup(true)}><Plus size={12} /> Thêm mới</BtnAdd> : undefined}
                >
                  <div className="space-y-4">
                    {isKhangNghi ? (
                      /* ── Hồ sơ kháng nghị GĐT,TT: thông tin QĐKN ── */
                      <div className="space-y-3">
                        <p className="text-[12px] font-semibold text-[#1d2e4f]">Thông tin Quyết định kháng nghị</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          <div>
                            <Lbl req>Số QĐKN</Lbl>
                            <Inp placeholder="Nhập số quyết định kháng nghị" />
                          </div>
                          <div>
                            <Lbl req>Ngày QĐKN</Lbl>
                            <Inp type="date" />
                          </div>
                          <div>
                            <Lbl>Người kháng nghị</Lbl>
                            <Inp placeholder="Nhập tên người kháng nghị" />
                          </div>
                          <div>
                            <Lbl req>Chọn người kháng nghị</Lbl>
                            <Sel>
                              <option value="">-- Chọn --</option>
                              <option>Chánh án TAND Tối cao</option>
                              <option>Viện trưởng VKSND Tối cao</option>
                              <option>Chánh án TAND Cấp cao</option>
                              <option>Viện trưởng VKSND Cấp cao</option>
                            </Sel>
                          </div>
                          <div>
                            <Lbl req>Ngày nhận QĐKN</Lbl>
                            <Inp type="date" />
                          </div>
                        </div>
                        <div>
                          <Lbl>Nội dung đơn</Lbl>
                          <textarea rows={4} placeholder="Nhập nội dung đơn..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
                        </div>
                      </div>
                    ) : isDon ? (
                      /* ── Hình thức Đơn: hiện 3 trường + bảng người đứng đơn ── */
                      <DonFields />
                    ) : (
                      /* ── Hình thức Công văn: hiện bảng danh sách công văn ── */
                      <>
                        <Tbl
                          headers={["STT", "Loại công văn", "Số công văn", "Ngày công văn", "Công văn chính", "Đơn vị gửi", "Thao tác"]}
                          emptyMsg="Chưa có công văn"
                        >
                          {congVans.length > 0 ? congVans.map((cv, i) => (
                            <tr key={cv.id} className={i % 2 === 1 ? "bg-[#fafafa]" : ""}>
                              <Td center>{i + 1}</Td>
                              <Td>{cv.loai}</Td>
                              <Td>{cv.so}</Td>
                              <Td>{cv.ngay}</Td>
                              <Td center>
                                <input
                                  type="checkbox"
                                  checked={cv.congVanChinh ?? false}
                                  onChange={() => {
                                    setCongVans(prev => prev.map(item => ({
                                      ...item,
                                      congVanChinh: item.id === cv.id
                                    })));
                                  }}
                                  className="w-[14px] h-[14px] accent-[#8b1a1a] cursor-pointer"
                                />
                              </Td>
                              <Td>{cv.donVi}</Td>
                              <Td center>
                                <div className="flex items-center justify-center gap-1">
                                  <ActionBtn icon={<Edit2 size={14} />} color="blue" title="Sửa" />
                                  <ActionBtn icon={<Trash2 size={14} />} color="red" onClick={() => delCV(cv.id)} title="Xóa" />
                                </div>
                              </Td>
                            </tr>
                          )) : undefined}
                        </Tbl>
                        {congVans.length === 0 && (
                          <p className="text-center text-[#999] italic text-[13px] py-2">
                            Chưa có công văn. Nhấn "Thêm mới" để thêm.
                          </p>
                        )}

                        {!isCVKemDon && <>
                          <div>
                            <Lbl>Ý kiến chỉ đạo</Lbl>
                            <Sel value={yKienChiDaoCV} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setYKienChiDaoCV(e.target.value)}>
                              <option>Không</option>
                              <option>Danh sách các Chánh án</option>
                              <option>Danh sách các Phó chánh án</option>
                              <option>Danh sách các Thẩm phán tối cao</option>
                            </Sel>
                          </div>
                          {yKienChiDaoCV !== "Không" && (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Lbl>Nội dung chỉ đạo</Lbl>
                                <a href="#" onClick={e => e.preventDefault()} className="text-[12px] text-[#1a73e8] hover:underline">[Gợi ý]</a>
                              </div>
                              <textarea rows={3} placeholder="Nhập nội dung chỉ đạo" className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
                            </div>
                          )}
                        </>}
                      </>
                    )}
                  </div>
                </Section>


                {/* 4. Đơn thụ lý kèm */}
                {hinhThuc !== "CV khác" && (
                  <Section
                    title={`${4 + secOffset}. Đơn thụ lý kèm`}
                    extra={<BtnAdd><Plus size={12} /> Thêm mới</BtnAdd>}
                  >
                    <Tbl
                      headers={["STT", "Số đơn", "Ngày tiếp nhận", "Loại án", "Trạng thái", "Thao tác"]}
                      emptyMsg="Chưa có đơn thụ lý kèm"
                    />
                  </Section>
                )}

                {/* 5. Xử lý đơn / công văn */}
                <Section title={`${5 + secOffset}. ${["CV khác", "CV kiến nghị GĐT-TT", "CV chuyển kiến nghị GĐT-TT", "CV chuyển đơn"].includes(hinhThuc) ? "Xử lý công văn" : "Xử lý đơn"}`}>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <Lbl>Nơi chuyển đến</Lbl>
                      <Sel value={noiChuyenDen} onChange={(e) => {
                        setNoiChuyenDen(e.target.value);
                        setDonViChuyenDen("");
                        setCaNhanChuyenDen("");
                      }}>
                        <option value="">-- Chọn --</option>
                        <option>Nội bộ</option>
                        <option>Tòa khác</option>
                        <option>Ngoài tòa án</option>
                        <option>Trả lại đơn</option>
                        <option>Lưu theo dõi</option>
                        <option>Chờ ý kiến lãnh đạo</option>
                      </Sel>
                    </div>

                    {noiChuyenDen === "Nội bộ" && (
                      <>
                        <div>
                          <Lbl req>Đơn vị chuyển đến</Lbl>
                          <Sel value={donViChuyenDen} onChange={(e) => {
                            setDonViChuyenDen(e.target.value);
                            setCaNhanChuyenDen("");
                          }}>
                            <option value="">-- Chọn đơn vị --</option>
                            <option>Vụ Pháp chế và Quản lý khoa học</option>
                            <option>Hội đồng Thẩm phán TANDTC</option>
                            <option>Vụ Giám đốc kiểm tra về hình sự</option>
                            <option>Vụ Giám đốc kiểm tra về kinh doanh, thương mại, phá sản, lao động, gia đình và người chưa thành niên</option>
                            <option>Vụ Thi đua - Khen thưởng</option>
                            <option>Vụ Tổ chức - Cán bộ</option>
                            <option>Thanh tra Tòa án nhân dân tối cao</option>
                            <option>Vụ Giám đốc, kiểm tra về dân sự</option>
                            <option>Vụ Giám đốc, kiểm tra về hành chính</option>
                            <option>Vụ Tổng hợp</option>
                            <option>Vụ Hợp tác quốc tế</option>
                            <option>Vụ Công tác phía Nam</option>
                            
                          </Sel>
                        </div>
                        {donViChuyenDen && (
                          <div>
                            <Lbl>Chuyển đến cá nhân</Lbl>
                            <Sel value={caNhanChuyenDen} onChange={(e) => setCaNhanChuyenDen(e.target.value)}>
                              <option value="">-- Chọn cá nhân --</option>
                              <option>Vụ trưởng - {donViChuyenDen}</option>
                              <option>Phó vụ trưởng - {donViChuyenDen}</option>
                              <option>Thẩm tra viên - {donViChuyenDen}</option>
                            </Sel>
                          </div>
                        )}
                      </>
                    )}

                    {noiChuyenDen === "Tòa khác" && (
                      <div>
                        <Lbl req>Đơn vị chuyển đến</Lbl>
                        <Sel value={donViChuyenDen} onChange={(e) => setDonViChuyenDen(e.target.value)}>
                          <option value="">-- Chọn Tòa án --</option>
                          <option>TAND cấp cao tại Hà Nội</option>
                          <option>TAND cấp cao tại Đà Nẵng</option>
                          <option>TAND cấp cao tại TP. Hồ Chí Minh</option>
                          <option>TAND Thành phố Hà Nội</option>
                          <option>TAND Thành phố Hồ Chí Minh</option>
                          <option>TAND Tỉnh Bắc Ninh</option>
                          <option>TAND Tỉnh Vĩnh Phúc</option>
                          {/* Có thể bổ sung thêm các tòa khác nếu cần */}
                        </Sel>
                      </div>
                    )}

                    {noiChuyenDen === "Ngoài tòa án" && (
                      <div className="col-span-2">
                        <Lbl req>Đơn vị chuyển đến</Lbl>
                        <Inp
                          value={donViChuyenDen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonViChuyenDen(e.target.value)}
                          placeholder="Nhập tên cơ quan/đơn vị..."
                        />
                      </div>
                    )}

                    {noiChuyenDen === "Trả lại đơn" && (
                      <>
                        <div>
                          <Lbl req>Lý do trả lại</Lbl>
                          <Sel>
                            <option value="">-- Chọn lý do --</option>
                            <option>Đơn không đủ điều kiện xử lý</option>
                            <option>Không thuộc thẩm quyền giải quyết</option>
                            <option>Đã hết thời hạn giải quyết</option>
                            <option>Lý do khác</option>
                          </Sel>
                        </div>
                        <div>
                          <Lbl>Yêu cầu</Lbl>
                          <Inp placeholder="Nhập yêu cầu trả lại đơn..." />
                        </div>
                      </>
                    )}
                    {noiChuyenDen !== "Lưu theo dõi" && noiChuyenDen !== "Chờ ý kiến lãnh đạo" && hinhThuc !== "CV khác" && hinhThuc !== "Đơn khác" && (
                      <>
                        <div>
                          <Lbl req>Trạng thái đơn</Lbl>
                          <Sel value={trangThaiDon} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTrangThaiDon(e.target.value)}>
                            <option value="">-- Chọn --</option>
                            <option>Đơn đủ điều kiện</option>
                            <option>Đơn không đủ điều kiện</option>
                          </Sel>
                        </div>
                        {hasGiamDocThamResult ? (
                          <div>
                            <Lbl req>Chọn vụ trưởng</Lbl>
                            <Sel value={vuTruong} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVuTruong(e.target.value)}>
                              <option value="">-- Chọn vụ trưởng --</option>
                              <option>Vụ trưởng Vụ Pháp chế và Quản lý khoa học</option>
                              <option>Vụ trưởng Vụ Giám đốc kiểm tra về hình sự</option>
                              <option>Vụ trưởng Vụ Giám đốc kiểm tra về dân sự</option>
                              <option>Vụ trưởng Vụ Giám đốc kiểm tra về hành chính</option>
                              <option>Vụ trưởng Vụ Giám đốc kiểm tra về kinh doanh, thương mại, phá sản, lao động, gia đình và người chưa thành niên</option>
                            </Sel>
                          </div>
                        ) : trangThaiDon !== "Đơn không đủ điều kiện" ? (
                          <div>
                            <Lbl req>Thụ lý đơn</Lbl>
                            <Sel value={thuLyDon} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setThuLyDon(e.target.value)}>
                              <option value="">-- Chọn --</option>
                              <option>Thụ lý mới</option>
                              <option>Đã thụ lý</option>
                              <option>Không</option>
                            </Sel>
                          </div>
                        ) : (
                          <div>
                            <Lbl req>Lý do không đủ điều kiện</Lbl>
                            <Sel value={lyDoKhongDu} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLyDoKhongDu(e.target.value)}>
                              <option value="">-- Chọn lý do --</option>
                              <option>Thiếu bản án quyết định</option>
                              <option>Thiếu xác nhận căn cước công dân</option>
                              <option>Viết lại đơn</option>
                              <option>Lý do khác</option>
                            </Sel>
                          </div>
                        )}
                        {!hasGiamDocThamResult && trangThaiDon === "Đơn không đủ điều kiện" && lyDoKhongDu === "Lý do khác" && (
                          <div className="col-span-2">
                            <Lbl req>Lý do khác</Lbl>
                            <textarea rows={2} placeholder="Nhập lý do khác..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
                          </div>
                        )}
                        {!hasGiamDocThamResult && trangThaiDon === "Đơn đủ điều kiện" && thuLyDon === "Thụ lý mới" && (
                          <div>
                            <Lbl req>Số thụ lý</Lbl>
                            <Inp placeholder="Nhập số thụ lý" />
                          </div>
                        )}
                        {!hasGiamDocThamResult && trangThaiDon === "Đơn đủ điều kiện" && thuLyDon === "Thụ lý mới" && (
                          <div>
                            <Lbl req>Ngày thụ lý</Lbl>
                            <Inp type="date" />
                          </div>
                        )}
                      </>
                    )}
                    {loaiAnForm === "Hình sự" && (
                      <div className="flex items-end pb-[5px] gap-4 flex-wrap col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={anTuHinh} onChange={e => { setAnTuHinh(e.target.checked); if (!e.target.checked) { setXinGiamAnTuHinh(false); setKeuOanAnTuHinh(false); setXinThiHanhAnSom(false); } }} />
                          Án tử hình
                        </label>
                        {anTuHinh && <>
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#555] whitespace-nowrap">
                            <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                              checked={xinGiamAnTuHinh} onChange={e => setXinGiamAnTuHinh(e.target.checked)} />
                            Xin ân giảm án tử hình
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#555] whitespace-nowrap">
                            <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                              checked={keuOanAnTuHinh} onChange={e => setKeuOanAnTuHinh(e.target.checked)} />
                            Kêu oan án tử hình
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#555] whitespace-nowrap">
                            <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                              checked={xinThiHanhAnSom} onChange={e => setXinThiHanhAnSom(e.target.checked)} />
                            Xin thi hành án sớm
                          </label>
                        </>}
                      </div>
                    )}

                    {loaiAnForm === "Hình sự" && (
                      <div className="col-span-2 flex items-center pt-1 pb-2">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] font-medium whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={xulychuynhuong} onChange={e => setXulychuynhuong(e.target.checked)} />
                          Áp dụng biện pháp XLCH
                        </label>
                      </div>
                    )}
                    {hinhThuc !== "CV khác" && hinhThuc !== "Đơn khác" && (
                      <div className="col-span-2">
                        <Lbl>Thẩm quyền đơn</Lbl>
                        <div className="flex items-center gap-5 h-[30px]">
                          {[["bac3", "Thẩm phán bậc 3"], ["toicao", "Thẩm phán tối cao"]].map(([val, label]) => (
                            <label key={val} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                              <input type="radio" name="thamQuyenDon" value={val} className="accent-[#8b1a1a]" />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="col-span-2 flex items-end">
                      {/* Nút Danh sách thẩm phán đã được chuyển sang màn hình Phân công thẩm phán */}
                    </div>
                  </div>
                </Section>

                {/* Thông tin công văn phúc đáp */}
                {hinhThuc === "CV khác" && coCongVanPhucDap && (
                  <Section title="6. Thông tin công văn phúc đáp">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Lbl req>Số công văn phúc đáp</Lbl>
                        <Inp placeholder="Nhập số công văn phúc đáp" />
                      </div>
                      <div>
                        <Lbl req>Ngày công văn phúc đáp</Lbl>
                        <Inp type="date" />
                      </div>
                      <div className="col-span-2">
                        <Lbl req>Trích yếu</Lbl>
                        <textarea
                          className="w-full min-h-[80px] p-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] resize-y"
                          placeholder="Nhập trích yếu công văn phúc đáp"
                        />
                      </div>
                    </div>
                  </Section>
                )}

                {/* Các thành phần chỉ dành cho Đơn */}
                {hinhThuc !== "CV khác" && (
                  <>
                    {/* 6. Đương sự */}
                    {!isDonKhieuNaiTuPhap && (
                      <Section title={`${6 + secOffset}. Đương sự`}>
                        <div className="space-y-4">
                          {loaiAnForm !== "Hình sự" && <>
                            <div>
                              <Lbl>Quan hệ pháp luật</Lbl>
                              <Inp placeholder="Nhập quan hệ pháp luật" />
                            </div>

                            {/* Nguyên đơn / người khởi kiện */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] font-semibold text-[#444]">Nguyên đơn / người khởi kiện</span>
                                <BtnAdd><Plus size={12} /> Thêm</BtnAdd>
                              </div>
                              <Tbl headers={["Họ và tên", "Năm sinh", "Địa chỉ", "Thao tác"]} emptyMsg="Chưa có thông tin" />
                            </div>

                            {/* Bị đơn / người bị kiện */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] font-semibold text-[#444]">Bị đơn / người bị kiện</span>
                                <BtnAdd><Plus size={12} /> Thêm</BtnAdd>
                              </div>
                              <Tbl headers={["Họ và tên", "Năm sinh", "Địa chỉ", "Thao tác"]} emptyMsg="Chưa có thông tin" />
                            </div>

                            {/* Người có quyền lợi, nghĩa vụ liên quan */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] font-semibold text-[#444]">Người có quyền lợi, nghĩa vụ liên quan</span>
                                <BtnAdd><Plus size={12} /> Thêm</BtnAdd>
                              </div>
                              <Tbl headers={["Họ và tên", "Năm sinh", "Địa chỉ", "Thao tác"]} emptyMsg="Chưa có dữ liệu" />
                            </div>
                          </>}

                          {/* Hình sự: Danh sách bị cáo + Danh sách thông tin khiếu nại */}
                          {loaiAnForm === "Hình sự" && <>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] font-semibold text-[#444]">Danh sách bị cáo</span>
                                <BtnAdd onClick={() => setShowBiCaoPopup(true)}><Plus size={12} /> Thêm</BtnAdd>
                              </div>
                              <Tbl
                                headers={["Họ và tên", "Năm sinh", "Địa chỉ", "Tội danh", "Thao tác"]}
                                emptyMsg="Chưa có bị cáo"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] font-semibold text-[#444]">Danh sách thông tin khiếu nại</span>
                                <BtnAdd><Plus size={12} /> Thêm</BtnAdd>
                              </div>
                              <Tbl
                                headers={["Người đứng đơn", "Khiếu nại cho bị cáo", "Nội dung khiếu nại", "Thao tác"]}
                                emptyMsg="Chưa có thông tin khiếu nại"
                              />
                            </div>
                          </>}
                        </div>
                      </Section>
                    )}
                  </>
                )}

                {/* Bottom action bar */}
                <div className="flex justify-end gap-2 pb-2 pt-1">
                  <BtnSecondary>Hủy</BtnSecondary>
                  {thuLyDon !== "Đã thụ lý" && thuLyDon !== "Thụ lý mới" && (
                    <button className="flex items-center gap-1.5 h-[30px] px-3 border border-[#1d2e4f] text-[#1d2e4f] hover:bg-[#eef1f5] rounded-[3px] text-[12px] font-medium transition-colors">
                      <Save size={13} /> Lưu nháp
                    </button>
                  )}
                  <BtnPrimary>Lưu</BtnPrimary>
                </div>

              </div>
            </div>

            {/* RIGHT: PDF Viewer panel */}
            {showPDF && <div className="flex-1 flex flex-col bg-[#404040] border-l border-[#333]">
              {/* PDF toolbar */}
              <div className="bg-[#323232] flex items-center justify-between px-3 py-[7px] border-b border-[#555] gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowPDF(false)}
                    className="text-white/60 hover:text-white transition-colors p-1 rounded" title="Ẩn tài liệu">
                    <ChevronRight size={15} />
                  </button>
                  <button className="flex items-center gap-1.5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white text-[12px] px-3 py-[4px] rounded-[3px] border border-[#6e1414] transition-colors">
                    <Upload size={13} /> Tải lên
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded">
                    <Download size={14} />
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded">
                    <Printer size={14} />
                  </button>
                </div>
                <span className="text-white/70 text-[12px] flex-1 text-center truncate">
                  Don_de_nghi_GDT_TT_mau.pdf
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded"><ZoomOut size={14} /></button>
                  <span className="text-white/80 text-[12px] min-w-[40px] text-center">100%</span>
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded"><ZoomIn size={14} /></button>
                  <div className="w-px h-4 bg-white/20 mx-1" />
                  <span className="text-white/60 text-[12px]">1 / 3</span>
                  <button className="text-white/60 hover:text-white transition-colors p-1 rounded"><RotateCcw size={14} /></button>
                </div>
              </div>

              {/* PDF page display */}
              <div className="flex-1 overflow-auto flex flex-col items-center py-6 gap-4">
                {/* Page 1 */}
                <div className="bg-white shadow-xl" style={{ width: "595px", minHeight: "842px" }}>
                  <div className="p-[72px] text-[#111]">
                    <div className="text-center mb-8">
                      <p className="text-[11px] font-medium">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                      <p className="text-[11px] underline decoration-1">Độc lập - Tự do - Hạnh phúc</p>
                      <p className="text-[11px] mt-1 italic">---------------</p>
                      <p className="text-[14px] font-bold uppercase mt-5">ĐƠN ĐỀ NGHỊ</p>
                      <p className="text-[12px] font-semibold">Xem xét lại bản án, quyết định của Tòa án đã có</p>
                      <p className="text-[12px] font-semibold">hiệu lực pháp luật theo thủ tục giám đốc thẩm</p>
                    </div>

                    <div className="text-[11px] space-y-3 leading-relaxed">
                      <p>Kính gửi: <span className="font-semibold">TÒA ÁN NHÂN DÂN TỐI CAO</span></p>
                      <div className="flex gap-2">
                        <span className="whitespace-nowrap">Họ và tên:</span>
                        <span className="flex-1 border-b border-dotted border-[#999]">&nbsp;</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="whitespace-nowrap">Địa chỉ:</span>
                        <span className="flex-1 border-b border-dotted border-[#999]">&nbsp;</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="whitespace-nowrap">Điện thoại:</span>
                        <span className="flex-1 border-b border-dotted border-[#999]">&nbsp;</span>
                      </div>

                      <p className="font-semibold mt-4">I. NỘI DUNG VỤ VIỆC:</p>
                      <div className="space-y-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="border-b border-dotted border-[#ccc] h-[20px]" />
                        ))}
                      </div>

                      <p className="font-semibold mt-4">II. LÝ DO ĐỀ NGHỊ XEM XÉT THEO THỦ TỤC GIÁM ĐỐC THẨM:</p>
                      <div className="space-y-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="border-b border-dotted border-[#ccc] h-[20px]" />
                        ))}
                      </div>

                      <p className="font-semibold mt-4">III. YÊU CẦU:</p>
                      <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="border-b border-dotted border-[#ccc] h-[20px]" />
                        ))}
                      </div>

                      <div className="mt-8 flex justify-between">
                        <div className="text-center">
                          <p className="font-semibold">XÁC NHẬN CỦA ĐỊA PHƯƠNG</p>
                          <p className="italic text-[10px]">(Ký tên, đóng dấu)</p>
                        </div>
                        <div className="text-center">
                          <p>Hà Nội, ngày .... tháng .... năm .....</p>
                          <p className="font-semibold">NGƯỜI LÀM ĐƠN</p>
                          <p className="italic text-[10px]">(Ký và ghi rõ họ tên)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-white/40 text-[11px]">Trang 1 / 3</p>
              </div>
            </div>}
            {!showPDF && (
              <div className="flex-shrink-0 border-l border-[#ccc] bg-[#f5f5f5] flex items-start pt-3">
                <button onClick={() => setShowPDF(true)} title="Hiện tài liệu"
                  className="flex flex-col items-center gap-1 px-2 py-2 text-[#555] hover:text-[#1d2e4f] hover:bg-[#e8edf5] rounded-[3px] transition-colors">
                  <ChevronLeft size={15} />
                  <span className="text-[10px] font-medium [writing-mode:vertical-rl] rotate-180">Tài liệu</span>
                </button>
              </div>
            )}
          </div>{/* end form 2-panel */}
        </div>{/* end main content area */}
      </div>{/* end body flex */}

      {/* Popup bị cáo */}
      {showBiCaoPopup && <PopupBiCao onClose={() => setShowBiCaoPopup(false)} />}

      {/* Popup danh sách thẩm phán */}
      {showThamPhanPopup && <PopupThamPhan onClose={() => setShowThamPhanPopup(false)} />}

      
      {/* Role Switcher */}
      <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow-lg border border-gray-200 z-[9999] text-xs">
        <label className="font-bold mr-2 text-gray-700">Vai trò:</label>
        <select value={currentRole} onChange={e => setCurrentRole(e.target.value as any)} className="border p-1 rounded">
          <option value="can-bo">Cán bộ</option>
          <option value="truong-phong">Trưởng phòng</option>
          <option value="pho-vp">Phó / Chánh VP</option>
          <option value="lanh-dao">Lãnh đạo Tòa</option>
        </select>
      </div>

      {/* Popup */}
      {showPopup && (
        <PopupCongVan
          onClose={() => setShowPopup(false)}
          onSave={cv => setCongVans(p => [...p, cv])}
        />
      )}
      {showUploadPopup && (
        <PopupUploadFile 
          onClose={() => setShowUploadPopup(false)} 
          onUpload={() => {
            setShowUploadPopup(false);
            setShowPDF(true);
          }}
        />
      )}
      {showTraLaiForm && (
        <PopupTraLaiDon
          count={1}
          reason={traLaiReason}
          onChangeReason={setTraLaiReason}
          isTruongPhong={false}
          onClose={() => { setShowTraLaiForm(false); setTraLaiReason(""); }}
          onConfirm={() => { addNotification("Đã trả lại đơn thành công."); setShowTraLaiForm(false); setTraLaiReason(""); }}
        />
      )}
    </div>
  );
}
