import { useState, useRef, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  X, Plus, Trash2, Edit2, FileText, ChevronDown, ChevronRight,
  ChevronUp, Search, ZoomIn, ZoomOut, RotateCcw, Download, Upload,
  Eye, Printer, Menu, PenLine, FolderOpen, LayoutTemplate,
  MessageSquare, Copy, CopyPlus, Home, LayoutList, Mail, List,
  Users, ArrowDownToLine, ArrowUpFromLine, Archive, Clock,
  Gavel, Scale, Settings, RefreshCw, Send, GitMerge, Check, Save, Pencil, ChevronLeft,
  AlertCircle, Bell, FilePlus, Loader2, Ban, Inbox, ArrowLeft, History as HistoryIcon,
  SlidersHorizontal
} from "lucide-react";
import Dashboard from "./Dashboard";
import DocumentNumberingModal from "./components/DocumentNumberingModal";
import {
  VanBanTrinhKyCuaToi, PheDuyetDeXuat, SoVanBanDi,
  DU_LIEU_MAU, taoTuModal, apTrinhDuyet, nguoiTheoVaiTro, timVanBanTheoDon,
  type VanBanTrinh, type BuocKy, type TrangThaiVB,
} from "./components/QuanLyVanBan";

/** Nhãn ngắn của trạng thái văn bản, dùng cho chip "Đã có trong …" ở Danh sách đơn
 *  và cột Trạng thái ở màn Danh sách biểu mẫu. */
const TRANG_THAI_NHAN: Record<TrangThaiVB, string> = {
  Nhap: "nháp", ChoDuyet: "chờ duyệt", ChoKy: "chờ ký", BiTraLai: "bị trả lại",
  DaKy: "đã ký", DaBanHanh: "đã ban hành", DaHuy: "đã huỷ",
};
const TRANG_THAI_CLS: Record<TrangThaiVB, string> = {
  Nhap: "bg-[#f5f5f5] text-[#666] border-[#ddd]",
  ChoDuyet: "bg-[#e8f4ff] text-[#1a73e8] border-[#a9c9f4]",
  ChoKy: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  BiTraLai: "bg-[#fde8e8] text-[#8b1a1a] border-[#f5b7b7]",
  DaKy: "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]",
  DaBanHanh: "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]",
  DaHuy: "bg-[#f0f0f0] text-[#999] border-[#ddd]",
};
import type { KetQuaTrinhDuyet } from "./components/DocumentNumberingModal";

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

// Tài liệu PDF đưa vào luồng OCR
export interface OcrFile {
  name: string;
  sizeMB: number;
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

// ─── Ý kiến Lãnh đạo — dùng chung giữa Danh sách đơn và Nhận đơn & TL vụ án ──
// Đơn nằm trong tab "Chờ ý kiến LĐ" hiển thị ở Danh sách đơn với trạng thái
// "Chờ ý kiến Lãnh đạo"; khi Lãnh đạo kết luận thì đổi sang Thụ lý mới /
// Không thụ lý. Hai màn nằm ở hai view khác nhau nên trạng thái để ở ngoài
// component, đăng ký lại bằng useSyncExternalStore để cả hai cùng cập nhật.
export type KetLuanLD = "Thụ lý mới" | "Không thụ lý";
export const CHO_Y_KIEN_LD = "Chờ ý kiến Lãnh đạo";
export const MAU_KET_LUAN_LD: Record<string, string> = {
  [CHO_Y_KIEN_LD]: "#e67e22",
  "Thụ lý mới": "#27ae60",
  "Không thụ lý": "#c0392b",
};

const ketLuanLD: Record<string, KetLuanLD> = {};
const ldEmitter = new EventTarget();
let phienBanLD = 0;

export const datKetLuanLD = (maDon: string, kl: KetLuanLD | null) => {
  if (kl) ketLuanLD[maDon] = kl; else delete ketLuanLD[maDon];
  phienBanLD++;
  ldEmitter.dispatchEvent(new Event("thaydoi"));
};
const dangKyLD = (cb: () => void) => {
  ldEmitter.addEventListener("thaydoi", cb);
  return () => ldEmitter.removeEventListener("thaydoi", cb);
};
export const layKetLuanLD = (maDon: string): KetLuanLD | undefined => ketLuanLD[maDon];
// Trả về số phiên bản — dùng làm dependency để component render lại khi LĐ đổi ý kiến
const useKetLuanLD = () => useSyncExternalStore(dangKyLD, () => phienBanLD, () => phienBanLD);


// ─── Shared primitives ───────────────────────────────────────────────────────
const Inp = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full h-[30px] px-2 text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 disabled:bg-[#f5f5f5] ${className}`}
  />
);

// Nút ✕ xóa lựa chọn cho mọi ô select.
// Chỉ hiện khi select CÓ option rỗng (kiểu "-- Chọn --" / "Tất cả") để xóa xong
// còn chỗ mà quay về; select không có option rỗng thì không hiện, tránh để trống vô nghĩa.
// Dùng được cho cả select có state lẫn không — dispatch 'change' để React nhận.
const useXoaChon = (value: unknown) => {
  const ref = useRef<HTMLSelectElement>(null);
  const [coOptionRong, setCoOptionRong] = useState(false);
  const [coGiaTriDOM, setCoGiaTriDOM] = useState(false);
  const controlled = value !== undefined;

  useEffect(() => {
    const el = ref.current;
    setCoOptionRong(!!el?.querySelector('option[value=""]'));
    if (!controlled) setCoGiaTriDOM(!!el?.value);
  });

  const hienX = coOptionRong && (controlled ? String(value ?? "") !== "" : coGiaTriDOM);

  const xoa = () => {
    const el = ref.current;
    if (!el) return;
    el.value = "";
    el.dispatchEvent(new Event("change", { bubbles: true }));
    setCoGiaTriDOM(false);
  };

  return { ref, hienX, xoa };
};

const NutXoaChon = ({ onClick, right, size = 12 }: { onClick: () => void; right: string; size?: number }) => (
  <button type="button" onClick={onClick} title="Xóa lựa chọn" aria-label="Xóa lựa chọn"
    className={`absolute ${right} top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#c0392b] transition-colors`}>
    <X size={size} />
  </button>
);

const Sel = ({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const { ref, hienX, xoa } = useXoaChon(props.value);
  return (
    <div className="relative">
      <select
        ref={ref}
        {...props}
        className={`w-full h-[30px] px-2 ${hienX ? "pr-12" : "pr-7"} text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] appearance-none ${className}`}
      >
        {children}
      </select>
      {hienX && <NutXoaChon onClick={xoa} right="right-6" size={13} />}
      <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
    </div>
  );
};

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
  "Đơn khiếu nại tố cáo trong tố tụng",
  "Công văn kiến nghị GĐT/TT",
  "Công văn khác",
  "Công văn liên quan",
  "Tài liệu, chứng cứ",
  "Thông báo phát hiện vi phạm pháp luật",
  "Đơn khiếu nại tố cáo trong tố tụng kèm Công văn chuyển đơn",
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

// Danh sách người cho ô "Ý kiến chỉ đạo" — Họ tên – Chức vụ – Ngày sinh
const NGUOI_CHI_DAO = [
  "Trần Văn B – Trưởng phòng – 15/04/1980",
  "Lê Thị C – Phó phòng – 22/09/1985",
  "Nguyễn Minh An – Phó CVP – 01/03/1975",
  "Hoàng Kim Long – CVP – 10/08/1970",
];

// ─── Popup Thêm người đứng đơn ───────────────────────────────────────────────
export interface NguoiDungDon {
  id: number;
  lienHeChinh: boolean;
  hoTen: string;
  tuCach: string;
  diaChi: string;
  sdt: string;
  namSinh: string;
  thongKe: string[];
}

const TU_CACH_TO_TUNG = [
  "Người khởi kiện", "Người bị kiện", "Nguyên đơn", "Bị đơn",
  "Người có quyền lợi, nghĩa vụ liên quan", "Người đại diện hợp pháp",
  "Người bảo vệ quyền và lợi ích hợp pháp", "Người làm chứng",
  "Bị cáo", "Bị hại", "Người kháng cáo", "Người đề nghị",
];
const DAN_TOC_OPTIONS = ["Kinh", "Tày", "Thái", "Mường", "Khmer", "Hoa", "Nùng", "H'Mông", "Dao", "Khác"];
const TON_GIAO_OPTIONS = ["Không", "Phật giáo", "Công giáo", "Tin lành", "Cao Đài", "Phật giáo Hòa Hảo", "Hồi giáo", "Khác"];
const QUOC_TICH_OPTIONS = ["Việt Nam", "Hoa Kỳ", "Nhật Bản", "Hàn Quốc", "Trung Quốc", "Pháp", "Khác"];
const NGHE_NGHIEP_OPTIONS = ["Nông dân", "Công nhân", "Cán bộ, công chức", "Kinh doanh", "Lao động tự do", "Hưu trí", "Học sinh, sinh viên", "Khác"];
const TRINH_DO_VH_OPTIONS = ["Tiểu học", "THCS", "THPT", "Khác"];
const TRINH_DO_DT_OPTIONS = ["Sơ cấp", "Trung cấp", "Cao đẳng", "Đại học", "Thạc sĩ", "Tiến sĩ"];
const THANH_PHAN_GD_OPTIONS = ["Bình thường", "Chính sách", "Khác"];
const PHAN_LOAI_DV_OPTIONS = ["Đảng viên chính thức", "Đảng viên dự bị"];
const LOAI_GIAY_TO_OPTIONS = ["Căn cước công dân", "Chứng minh nhân dân", "Hộ chiếu", "Giấy khai sinh", "Giấy phép lái xe", "Giấy tờ khác"];
const TINH_TP_OPTIONS = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bắc Ninh", "Huế", "Nghệ An", "Bình Dương", "Đồng Nai"];
const CAC_DIA_CHI = ["Nơi sinh", "Quê quán", "Nơi đăng kí HKTT", "Nơi tạm trú", "Nơi ở hiện tại"];

// Nhãn + ô nhập dùng riêng trong popup (nhỏ gọn, 12-13px như bản gốc)
const NDLbl = ({ req, children }: { req?: boolean; children: React.ReactNode }) => (
  <label className="block text-[12px] text-[#555] mb-[3px] whitespace-nowrap">
    {req && <span className="text-[#c0392b] mr-1">*</span>}{children}
  </label>
);
const NDInp = ({ loi, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { loi?: boolean }) => (
  <input {...props}
    className={`w-full h-[32px] px-2.5 text-[13px] border rounded-[4px] outline-none transition-colors placeholder:text-[#bbb]
      ${loi ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]"} ${props.disabled ? "bg-[#f5f5f5]" : "bg-white"}`} />
);
const NDSel = ({ loi, placeholder, options, value, onChange, disabled }: {
  loi?: boolean; placeholder: string; options: string[];
  value: string; onChange: (v: string) => void; disabled?: boolean;
}) => (
  <div className="relative">
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      className={`w-full h-[32px] pl-2.5 pr-7 text-[13px] border rounded-[4px] appearance-none outline-none transition-colors
        ${loi ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]"} ${disabled ? "bg-[#f5f5f5]" : "bg-white"} ${value ? "text-[#222]" : "text-[#bbb]"}`}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} className="text-[#222]">{o}</option>)}
    </select>
    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
  </div>
);

// Một hàng trong bảng người tham gia tố tụng (nguyên đơn / bị đơn / người liên quan)
const HangNguoiThamGia = ({ n, i, onXoa }: { n: NguoiDungDon; i: number; onXoa: () => void }) => (
  <tr className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
    <Td>
      <span className="font-medium text-[#1a5a96]">{n.hoTen}</span>
      {n.thongKe.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {n.thongKe.map(tk => (
            <span key={tk} className="inline-block px-1.5 py-[1px] rounded text-[10px] bg-[#fef3e2] text-[#b45309] border border-[#fcd48a]">{tk}</span>
          ))}
        </div>
      )}
    </Td>
    <Td>{n.namSinh}</Td>
    <Td>{n.diaChi}</Td>
    <Td center>
      <button onClick={onXoa}
        className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
        <Trash2 size={11} /> Xóa
      </button>
    </Td>
  </tr>
);

// Dùng chung cho "Thêm người đứng đơn" và "Thêm nguyên đơn/người khởi kiện" —
// hai màn giống hệt nhau, chỉ khác tiêu đề, tư cách mặc định và khối thống kê.
const THONG_TIN_THONG_KE = [
  "Nguyên đơn không thể làm sạch",
  "Nghiện hút",
  "Trẻ vị thành niên",
  "Tái phạm, tái phạm nguy hiểm",
  "Có yếu tố nước ngoài",
];

const PopupThemNguoiDungDon = ({ onDong, onLuu, tieuDe = "Thêm người đứng đơn", tuCachMacDinh = "", coThongKe = false }: {
  onDong: () => void;
  onLuu: (n: Omit<NguoiDungDon, "id">) => void;
  tieuDe?: string;
  tuCachMacDinh?: string;
  coThongKe?: boolean;
}) => {
  const [laCaNhan, setLaCaNhan] = useState(true);
  const [tuCach, setTuCach] = useState(tuCachMacDinh);
  const [thongKe, setThongKe] = useState<string[]>([]);
  const [moThongKe, setMoThongKe] = useState(true);
  const [khongCoCanCuoc, setKhongCoCanCuoc] = useState(false);
  const [laDangVien, setLaDangVien] = useState(false);
  const [coTienAn, setCoTienAn] = useState(false);
  const [congChuc, setCongChuc] = useState("Không");
  const [nghienMaTuy, setNghienMaTuy] = useState("Không");
  const [diaDanhCu, setDiaDanhCu] = useState(false);
  const [khongCoTT, setKhongCoTT] = useState(false);
  const [ghiChu, setGhiChu] = useState("");
  const [daBam, setDaBam] = useState(false);
  const [moConNguoi, setMoConNguoi] = useState(true);

  const [f, setF] = useState<Record<string, string>>({});
  const g = (k: string) => f[k] ?? "";
  const dat = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));

  const [giayTo, setGiayTo] = useState<{ id: number; loai: string; so: string; ngayCap: string; noiCap: string }[]>([]);
  const [diaChis, setDiaChis] = useState(
    CAC_DIA_CHI.map(ten => ({ ten, chiTiet: "", phuongXa: "", tinhTP: "", quocGia: "Việt Nam" })));
  const datDiaChi = (i: number, k: "chiTiet" | "phuongXa" | "tinhTP" | "quocGia") => (v: string) =>
    setDiaChis(p => p.map((d, j) => j === i ? { ...d, [k]: v } : d));

  // Trường bắt buộc khác nhau giữa cá nhân và cơ quan/tổ chức
  const thieuTruong = laCaNhan
    ? [!tuCach, !g("hoTen").trim(), !g("gioiTinh"), !g("ngaySinh"), !khongCoCanCuoc && !g("soCanCuoc").trim()]
    : [!tuCach, !g("tenToChuc").trim()];
  const thieu = thieuTruong.some(Boolean);
  const loi = (rong: boolean) => daBam && rong;

  const luu = () => {
    setDaBam(true);
    if (thieu) return;
    const noiOHienTai = diaChis[4];
    const diaChiDayDu = [noiOHienTai.chiTiet, noiOHienTai.phuongXa, noiOHienTai.tinhTP]
      .filter(Boolean).join(", ");
    onLuu({
      lienHeChinh: false,
      hoTen: laCaNhan ? g("hoTen").trim() : g("tenToChuc").trim(),
      tuCach,
      diaChi: diaChiDayDu || g("noiLamViec") || "—",
      sdt: g("sdt") || "—",
      namSinh: g("ngaySinh") ? g("ngaySinh").slice(0, 4) : "—",
      thongKe,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] overflow-y-auto p-4">
      <div className="bg-white rounded-[6px] shadow-2xl border-t-[3px] border-[#27ae60] mx-auto max-w-[1600px]">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#eee]">
          <button onClick={onDong} className="text-[#888] hover:text-[#333]"><X size={17} /></button>
          <span className="text-[14px] font-semibold text-[#222]">{tieuDe}</span>
        </div>

        <div className="px-5 py-4 space-y-4">

          {/* Phân loại + tư cách */}
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <NDLbl req>Phân loại người tham gia tố tụng</NDLbl>
              <div className="flex items-center gap-6 h-[32px]">
                {[["Cá nhân", true], ["Cơ quan/tổ chức", false]].map(([nhan, ca]) => (
                  <label key={nhan as string} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                    <input type="radio" name="phanLoaiNTG" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                      checked={laCaNhan === ca} onChange={() => setLaCaNhan(ca as boolean)} />
                    {nhan as string}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <NDLbl req>Tư cách tham gia tố tụng</NDLbl>
              <NDSel placeholder="Chọn tư cách tố tụng" options={TU_CACH_TO_TUNG}
                value={tuCach} onChange={setTuCach} loi={loi(!tuCach)} />
            </div>
          </div>

          {/* Thông tin con người / tổ chức */}
          <div className="border border-[#eee] rounded-[4px]">
            <button type="button" onClick={() => setMoConNguoi(!moConNguoi)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-[#fafafa] border-b border-[#eee] text-left">
              <span className="inline-block w-[14px] h-[14px] border border-[#888] rounded-[2px] text-center leading-[12px] text-[11px]">
                {moConNguoi ? "−" : "+"}
              </span>
              <span className="text-[13px] font-semibold text-[#333]">
                {laCaNhan ? "Thông tin con người" : "Thông tin cơ quan/tổ chức"}
              </span>
            </button>

            {moConNguoi && (laCaNhan ? (
              <div className="p-3 flex gap-4">
                <div className="w-[130px] h-[160px] flex-shrink-0 bg-[#f2f2f2] border border-[#e0e0e0] flex items-center justify-center text-[12px] text-[#999]">
                  Ảnh chân dung
                </div>
                <div className="flex-1 grid grid-cols-5 gap-x-4 gap-y-3">
                  <div><NDLbl req>Họ và tên</NDLbl><NDInp placeholder="Họ và tên" value={g("hoTen")} loi={loi(!g("hoTen").trim())} onChange={e => dat("hoTen")(e.target.value)} /></div>
                  <div><NDLbl req>Giới tính</NDLbl><NDSel placeholder="Giới tính" options={["Nam", "Nữ", "Khác"]} value={g("gioiTinh")} onChange={dat("gioiTinh")} loi={loi(!g("gioiTinh"))} /></div>
                  <div><NDLbl req>Ngày sinh</NDLbl><NDInp type="date" value={g("ngaySinh")} loi={loi(!g("ngaySinh"))} onChange={e => dat("ngaySinh")(e.target.value)} /></div>
                  <div className="col-span-2 grid grid-cols-2 gap-x-4">
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] h-[19px] mb-[3px]">
                        <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                          checked={khongCoCanCuoc} onChange={e => setKhongCoCanCuoc(e.target.checked)} />
                        Không có căn cước
                      </label>
                      <NDInp placeholder="nhập dữ liệu" disabled={khongCoCanCuoc}
                        value={g("soCanCuoc")} loi={loi(!khongCoCanCuoc && !g("soCanCuoc").trim())}
                        onChange={e => dat("soCanCuoc")(e.target.value)} />
                    </div>
                    <div><NDLbl>Ngày cấp CCCD</NDLbl><NDInp type="date" disabled={khongCoCanCuoc} value={g("ngayCapCCCD")} onChange={e => dat("ngayCapCCCD")(e.target.value)} /></div>
                  </div>

                  <div><NDLbl>Nơi cấp CCCD</NDLbl><NDInp placeholder="Nơi cấp CCCD" disabled={khongCoCanCuoc} value={g("noiCapCCCD")} onChange={e => dat("noiCapCCCD")(e.target.value)} /></div>
                  <div><NDLbl>Dân tộc</NDLbl><NDSel placeholder="Dân tộc" options={DAN_TOC_OPTIONS} value={g("danToc")} onChange={dat("danToc")} /></div>
                  <div><NDLbl>Tôn giáo</NDLbl><NDSel placeholder="Tôn giáo" options={TON_GIAO_OPTIONS} value={g("tonGiao")} onChange={dat("tonGiao")} /></div>
                  <div><NDLbl>Quốc tịch</NDLbl><NDSel placeholder="Quốc tịch" options={QUOC_TICH_OPTIONS} value={g("quocTich")} onChange={dat("quocTich")} /></div>
                  <div><NDLbl>Nghề nghiệp</NDLbl><NDSel placeholder="Nghề nghiệp" options={NGHE_NGHIEP_OPTIONS} value={g("ngheNghiep")} onChange={dat("ngheNghiep")} /></div>

                  <div><NDLbl>Nghề nghiệp rõ</NDLbl><NDInp placeholder="Nghề nghiệp rõ" value={g("ngheNghiepRo")} onChange={e => dat("ngheNghiepRo")(e.target.value)} /></div>
                  <div><NDLbl>Chức vụ/quyền hạn</NDLbl><NDSel placeholder="Chức vụ/quyền hạn" options={["Nhân viên", "Quản lý", "Lãnh đạo", "Khác"]} value={g("chucVu")} onChange={dat("chucVu")} /></div>
                  <div><NDLbl>Nơi làm việc</NDLbl><NDInp placeholder="Nơi làm việc" value={g("noiLamViec")} onChange={e => dat("noiLamViec")(e.target.value)} /></div>
                  <div><NDLbl>Ngoại ngữ</NDLbl><NDSel placeholder="Ngoại ngữ" options={["Không", "Tiếng Anh", "Tiếng Pháp", "Tiếng Trung", "Tiếng Nhật", "Khác"]} value={g("ngoaiNgu")} onChange={dat("ngoaiNgu")} /></div>
                  <div><NDLbl>Trình độ văn hóa</NDLbl><NDSel placeholder="Trình độ văn hóa" options={TRINH_DO_VH_OPTIONS} value={g("trinhDoVH")} onChange={dat("trinhDoVH")} /></div>

                  <div><NDLbl>Trình độ đào tạo</NDLbl><NDSel placeholder="Trình độ đào tạo" options={TRINH_DO_DT_OPTIONS} value={g("trinhDoDT")} onChange={dat("trinhDoDT")} /></div>
                  <div><NDLbl>Thành phần gia đình</NDLbl><NDSel placeholder="Thành phần gia đình" options={THANH_PHAN_GD_OPTIONS} value={g("thanhPhanGD")} onChange={dat("thanhPhanGD")} /></div>
                  <div><NDLbl>Số điện thoại</NDLbl><NDInp placeholder="Số điện thoại" value={g("sdt")} onChange={e => dat("sdt")(e.target.value)} /></div>
                  <div><NDLbl>Email</NDLbl><NDInp placeholder="Email" value={g("email")} onChange={e => dat("email")(e.target.value)} /></div>
                  <div><NDLbl>Số fax</NDLbl><NDInp placeholder="Số fax" value={g("soFax")} onChange={e => dat("soFax")(e.target.value)} /></div>

                  <div className="col-span-2 flex items-end gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] h-[32px] whitespace-nowrap">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={laDangVien} onChange={e => setLaDangVien(e.target.checked)} />
                      Là đảng viên
                    </label>
                    <div className="flex-1">
                      <NDLbl>Phân loại đảng viên</NDLbl>
                      <NDSel placeholder="Phân loại đảng viên" options={PHAN_LOAI_DV_OPTIONS}
                        value={g("phanLoaiDV")} onChange={dat("phanLoaiDV")} disabled={!laDangVien} />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333] h-[32px] whitespace-nowrap">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={coTienAn} onChange={e => setCoTienAn(e.target.checked)} />
                      Có tiền án tiền sự
                    </label>
                  </div>

                  <div>
                    <NDLbl req>Công chức, viên chức</NDLbl>
                    <div className="flex items-center gap-5 h-[32px]">
                      {["Không", "Có"].map(o => (
                        <label key={o} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                          <input type="radio" name="congChuc" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            checked={congChuc === o} onChange={() => setCongChuc(o)} />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <NDLbl req>Nghiện ma túy</NDLbl>
                    <div className="flex items-center gap-5 h-[32px]">
                      {["Không", "Có"].map(o => (
                        <label key={o} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                          <input type="radio" name="nghienMaTuy" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            checked={nghienMaTuy === o} onChange={() => setNghienMaTuy(o)} />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 grid grid-cols-4 gap-x-4 gap-y-3">
                <div className="col-span-2"><NDLbl req>Tên cơ quan/tổ chức</NDLbl><NDInp placeholder="Nhập tên cơ quan/tổ chức" value={g("tenToChuc")} loi={loi(!g("tenToChuc").trim())} onChange={e => dat("tenToChuc")(e.target.value)} /></div>
                <div><NDLbl>Mã số thuế</NDLbl><NDInp placeholder="Mã số thuế" value={g("maSoThue")} onChange={e => dat("maSoThue")(e.target.value)} /></div>
                <div><NDLbl>Quốc tịch</NDLbl><NDSel placeholder="Quốc tịch" options={QUOC_TICH_OPTIONS} value={g("quocTich")} onChange={dat("quocTich")} /></div>
                <div><NDLbl>Người đại diện</NDLbl><NDInp placeholder="Họ và tên người đại diện" value={g("nguoiDaiDien")} onChange={e => dat("nguoiDaiDien")(e.target.value)} /></div>
                <div><NDLbl>Chức vụ người đại diện</NDLbl><NDInp placeholder="Chức vụ" value={g("chucVu")} onChange={e => dat("chucVu")(e.target.value)} /></div>
                <div><NDLbl>Số điện thoại</NDLbl><NDInp placeholder="Số điện thoại" value={g("sdt")} onChange={e => dat("sdt")(e.target.value)} /></div>
                <div><NDLbl>Email</NDLbl><NDInp placeholder="Email" value={g("email")} onChange={e => dat("email")(e.target.value)} /></div>
              </div>
            ))}
          </div>

          {/* Danh sách giấy tờ */}
          <div>
            <div className="text-[12px] font-bold text-[#333] tracking-wide mb-2">DANH SÁCH GIẤY TỜ</div>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#fafafa] text-[#555]">
                  {["STT", "Loại giấy tờ", "Số", "Ngày cấp", "Nơi cấp", "Thao tác"].map(h => (
                    <th key={h} className="border-y border-[#eee] px-2 py-2 font-semibold text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {giayTo.length === 0 ? (
                  <tr><td colSpan={6} className="border-b border-[#eee] px-2 py-4 text-center text-[#999]">
                    Chưa có giấy tờ. Nhấn Thêm giấy tờ để bổ sung.
                  </td></tr>
                ) : giayTo.map((gt, i) => (
                  <tr key={gt.id}>
                    <td className="border-b border-[#eee] px-2 py-1.5 text-center text-[#666] w-[50px]">{i + 1}</td>
                    <td className="border-b border-[#eee] px-2 py-1.5 w-[230px]">
                      <NDSel placeholder="Chọn loại giấy tờ" options={LOAI_GIAY_TO_OPTIONS} value={gt.loai}
                        onChange={v => setGiayTo(p => p.map(x => x.id === gt.id ? { ...x, loai: v } : x))} />
                    </td>
                    <td className="border-b border-[#eee] px-2 py-1.5">
                      <NDInp placeholder="Số" value={gt.so}
                        onChange={e => setGiayTo(p => p.map(x => x.id === gt.id ? { ...x, so: e.target.value } : x))} />
                    </td>
                    <td className="border-b border-[#eee] px-2 py-1.5 w-[160px]">
                      <NDInp type="date" value={gt.ngayCap}
                        onChange={e => setGiayTo(p => p.map(x => x.id === gt.id ? { ...x, ngayCap: e.target.value } : x))} />
                    </td>
                    <td className="border-b border-[#eee] px-2 py-1.5">
                      <NDInp placeholder="Nơi cấp" value={gt.noiCap}
                        onChange={e => setGiayTo(p => p.map(x => x.id === gt.id ? { ...x, noiCap: e.target.value } : x))} />
                    </td>
                    <td className="border-b border-[#eee] px-2 py-1.5 text-center w-[80px]">
                      <button onClick={() => setGiayTo(p => p.filter(x => x.id !== gt.id))}
                        className="text-[#c0392b] hover:bg-[#fdecea] rounded p-1"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button"
              onClick={() => setGiayTo(p => [...p, { id: Date.now(), loai: "", so: "", ngayCap: "", noiCap: "" }])}
              className="w-full mt-2 py-2 border border-dashed border-[#ccc] rounded-[4px] text-[12px] text-[#555] hover:bg-[#fafafa] hover:border-[#8b1a1a] hover:text-[#8b1a1a] transition-colors">
              + Thêm giấy tờ
            </button>
          </div>

          {/* Ghi chú */}
          <div>
            <NDLbl>Ghi chú</NDLbl>
            <NDInp placeholder="Ghi chú" value={ghiChu} onChange={e => setGhiChu(e.target.value)} />
          </div>

          {/* Địa chỉ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333]">
                <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                  checked={diaDanhCu} onChange={e => setDiaDanhCu(e.target.checked)} />
                Địa danh trước sát nhập
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333]">
                <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                  checked={khongCoTT} onChange={e => setKhongCoTT(e.target.checked)} />
                Không có thông tin
              </label>
            </div>
            <div className="space-y-2">
              {diaChis.map((dc, i) => (
                <div key={dc.ten} className="grid grid-cols-[1fr_260px_260px_260px_28px] gap-x-3 items-end">
                  <div><NDLbl>{dc.ten}</NDLbl><NDInp placeholder={dc.ten} disabled={khongCoTT} value={dc.chiTiet} onChange={e => datDiaChi(i, "chiTiet")(e.target.value)} /></div>
                  <div><NDLbl>Phường/Xã</NDLbl><NDSel placeholder="Phường/Xã" options={["Phường 1", "Phường 2", "Xã An Bình", "Xã Tân Phú"]} disabled={khongCoTT} value={dc.phuongXa} onChange={datDiaChi(i, "phuongXa")} /></div>
                  <div><NDLbl>Tỉnh/Thành phố</NDLbl><NDSel placeholder="Tỉnh/Thành phố" options={TINH_TP_OPTIONS} disabled={khongCoTT} value={dc.tinhTP} onChange={datDiaChi(i, "tinhTP")} /></div>
                  <div><NDLbl>Quốc gia</NDLbl><NDSel placeholder="Quốc gia" options={QUOC_TICH_OPTIONS} disabled={khongCoTT} value={dc.quocGia} onChange={datDiaChi(i, "quocGia")} /></div>
                  <button onClick={() => setDiaChis(p => p.map((d, j) => j === i ? { ...d, chiTiet: "", phuongXa: "", tinhTP: "", quocGia: "Việt Nam" } : d))}
                    title="Xóa thông tin dòng này"
                    className="h-[32px] flex items-center justify-center text-[#c0392b] hover:bg-[#fdecea] rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin thống kê */}
          {coThongKe && (
            <div>
              <button type="button" onClick={() => setMoThongKe(!moThongKe)}
                className="flex items-center gap-2 mb-2">
                <span className="inline-block w-[14px] h-[14px] border border-[#888] rounded-[2px] text-center leading-[12px] text-[11px]">
                  {moThongKe ? "−" : "+"}
                </span>
                <span className="text-[13px] font-semibold text-[#333]">Thông tin thống kê</span>
              </button>
              {moThongKe && (
                <div className="grid grid-cols-5 gap-x-4 gap-y-2">
                  {THONG_TIN_THONG_KE.map(tk => (
                    <label key={tk} className="flex items-center gap-2 cursor-pointer text-[12px] text-[#333]">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a] flex-shrink-0"
                        checked={thongKe.includes(tk)}
                        onChange={e => setThongKe(p => e.target.checked ? [...p, tk] : p.filter(x => x !== tk))} />
                      {tk}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {daBam && thieu && (
            <p className="text-[12px] text-[#c0392b]">Vui lòng nhập đủ các trường bắt buộc (đánh dấu *).</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-2 px-5 py-4 border-t border-[#eee]">
          <button onClick={luu}
            className="h-[34px] px-6 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[13px] font-semibold transition-colors">Lưu</button>
          <button onClick={onDong}
            className="h-[34px] px-6 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[4px] text-[13px] font-medium transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  );
};

// ─── DonFields: các trường trong block Thông tin đơn ────────────────────────
const DonFields = () => {
  const [diaDanhCu, setDiaDanhCu] = useState(false);
  const [yKienChiDao, setYKienChiDao] = useState("Không");
  // Người đứng đơn thêm qua popup → hiện luôn ra bảng bên ngoài
  const [nguoiDungDon, setNguoiDungDon] = useState<NguoiDungDon[]>([]);
  const [showThemNDD, setShowThemNDD] = useState(false);

  return (
    <div className="space-y-3">
      {/* Hàng 1: Số hiệu đơn | Ngày tòa nhận | Ngày ghi trên đơn
          (checkbox "Có nội dung tố cáo" đã chuyển xuống mục Xử lý đơn) */}
      <div className="grid grid-cols-4 gap-x-4 items-end">
        <div>
          <Lbl>Số hiệu đơn</Lbl>
          <Inp placeholder="Nhập số hiệu đơn" />
        </div>
        <div>
          <Lbl req>Ngày tòa nhận</Lbl>
          <Inp type="date" />
        </div>
        <div>
          <Lbl req>Ngày ghi trên đơn</Lbl>
          <Inp type="date" />
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
            <BtnAdd onClick={() => setShowThemNDD(true)}><Plus size={12} /> Thêm mới</BtnAdd>
          </div>
        </div>
        <Tbl headers={["Liên hệ chính", "Họ và tên", "Tư cách tố tụng", "Địa chỉ", "SĐT", "Thao tác"]}
          emptyMsg="Chưa có dữ liệu">
          {nguoiDungDon.length > 0 ? nguoiDungDon.map((n, i) => (
            <tr key={n.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
              <Td center>
                <input type="radio" name="lienHeChinh" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                  checked={n.lienHeChinh}
                  onChange={() => setNguoiDungDon(p => p.map(x => ({ ...x, lienHeChinh: x.id === n.id })))} />
              </Td>
              <Td><span className="font-medium text-[#1a5a96]">{n.hoTen}</span></Td>
              <Td>{n.tuCach}</Td>
              <Td>{n.diaChi}</Td>
              <Td>{n.sdt}</Td>
              <Td center>
                <button onClick={() => setNguoiDungDon(p => p.filter(x => x.id !== n.id))}
                  className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                  <Trash2 size={11} /> Xóa
                </button>
              </Td>
            </tr>
          )) : undefined}
        </Tbl>
      </div>

      {showThemNDD && (
        <PopupThemNguoiDungDon
          onDong={() => setShowThemNDD(false)}
          onLuu={(n) => {
            // Người đầu tiên mặc định là đầu mối liên hệ chính
            setNguoiDungDon(p => [...p, { id: Date.now(), ...n, lienHeChinh: p.length === 0 }]);
            setShowThemNDD(false);
          }}
        />
      )}

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
          {NGUOI_CHI_DAO.map(n => <option key={n}>{n}</option>)}
        </Sel>
      </div>
      {yKienChiDao !== "Không" && (
        <div>
          <Lbl req>Nội dung chỉ đạo</Lbl>
          <textarea rows={3} placeholder="Nhập nội dung chỉ đạo..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
        </div>
      )}
    </div>
  );
};

// ─── Tài khoản đang đăng nhập ────────────────────────────────────────────────
const NHAN_VAI_TRO: Record<string, string> = {
  "can-bo": "Cán bộ",
  "truong-phong": "Trưởng phòng",
  "pho-vp": "Phó / Chánh Văn phòng",
  "lanh-dao": "Lãnh đạo Tòa",
};
const TAI_KHOAN = {
  hoTen: "Nguyễn Văn A",
  tenDangNhap: "nguyenvana",
  donVi: "Phòng Tiếp nhận và Xử lý công dân",
  email: "nguyenvana@toaan.gov.vn",
};
// Chữ cái đầu của họ và tên — dùng làm avatar khi chưa có ảnh
const chuVietTat = (hoTen: string) => {
  const t = hoTen.trim().split(/\s+/);
  return ((t[0]?.[0] ?? "") + (t[t.length - 1]?.[0] ?? "")).toUpperCase();
};

const KhoiTaiKhoan = ({ vaiTro }: { vaiTro: string }) => {
  const [mo, setMo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mo) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMo(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mo]);

  return (
    <div ref={ref} className="relative border-t border-[#e0e0e0] flex-shrink-0">
      {mo && (
        <div className="absolute bottom-full left-2 right-2 mb-1 bg-white rounded-[4px] shadow-[0_-2px_12px_rgba(0,0,0,0.14)] border border-[#e0e0e0] overflow-hidden">
          <div className="px-3 py-2.5 bg-[#f7f9fc] border-b border-[#eee]">
            <div className="text-[13px] font-semibold text-[#1d2e4f]">{TAI_KHOAN.hoTen}</div>
            <div className="text-[11px] text-[#666] mt-0.5">{TAI_KHOAN.email}</div>
            <div className="text-[11px] text-[#666]">{TAI_KHOAN.donVi}</div>
          </div>
          {[
            { icon: <Users size={13} />, nhan: "Thông tin tài khoản" },
            { icon: <Settings size={13} />, nhan: "Đổi mật khẩu" },
          ].map(m => (
            <div key={m.nhan} className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#333] hover:bg-[#f5f5f5] cursor-pointer transition-colors">
              <span className="text-[#666]">{m.icon}</span>{m.nhan}
            </div>
          ))}
          <div className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#c0392b] hover:bg-[#fdecea] cursor-pointer transition-colors border-t border-[#eee]">
            <ArrowLeft size={13} /> Đăng xuất
          </div>
        </div>
      )}

      <div onClick={() => setMo(m => !m)}
        className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-[#f5f5f5] transition-colors">
        <div className="w-[32px] h-[32px] flex-shrink-0 rounded-full bg-[#8b1a1a] text-white flex items-center justify-center text-[12px] font-semibold">
          {chuVietTat(TAI_KHOAN.hoTen)}
        </div>
        <div className="leading-tight min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-[#1d2e4f] truncate">{TAI_KHOAN.hoTen}</div>
          <div className="text-[11px] text-[#777] truncate">{NHAN_VAI_TRO[vaiTro] ?? vaiTro}</div>
        </div>
        <ChevronUp size={13} className={`text-[#888] flex-shrink-0 transition-transform ${mo ? "" : "rotate-180"}`} />
      </div>
    </div>
  );
};

// ─── Sidebar navigation ──────────────────────────────────────────────────────
const Sidebar = ({ activePage, onNav, currentRole = "can-bo" }: {
  activePage: string; onNav?: (page: string) => void; currentRole?: string;
}) => {
  const [quanLyDonOpen, setQuanLyDonOpen] = useState(true);
  const [tichHopOpen, setTichHopOpen] = useState(false);
  const [quanLyAnOpen, setQuanLyAnOpen] = useState(true);
  const [congTacLanhDaoOpen, setCongTacLanhDaoOpen] = useState(true);

  const SubItem = ({ icon, label, active, nav, badge }: { icon: React.ReactNode; label: string; active?: boolean; nav?: string; badge?: number }) => (
    <div onClick={() => nav && onNav?.(nav)}
      className={`flex items-center gap-2.5 px-4 py-[7px] cursor-pointer text-[13px] transition-colors rounded-[3px] mx-1
      ${active ? "bg-[#fdeaea] text-[#8b1a1a] font-semibold" : "text-[#444] hover:bg-[#f5f5f5]"}`}>
      <span className={active ? "text-[#8b1a1a]" : "text-[#888]"}>{icon}</span>
      <span className="truncate flex-1">{label}</span>
      {/* Badge đỏ: tín hiệu duy nhất kéo cán bộ vào màn "Danh sách văn bản"
          mỗi sáng. Chỉ hiện khi > 0. */}
      {!!badge && badge > 0 && (
        <span className="flex-shrink-0 bg-[#8b1a1a] text-white rounded-full text-[10px] font-medium min-w-[16px] h-[16px] leading-[16px] text-center px-1">
          {badge}
        </span>
      )}
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
    <div className="w-[230px] flex-shrink-0 bg-white border-r border-[#e0e0e0] flex flex-col h-full overflow-hidden">
      {/* Logo header */}
      <div className="flex items-center gap-2.5 px-3 py-3 border-b border-[#eee] flex-shrink-0">
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

      {/* Nav items — cuộn riêng để khối tài khoản luôn nằm đáy */}
      <nav className="flex-1 py-2 space-y-0.5 overflow-y-auto">
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
              {/* Đặt ngay dưới Danh sách đơn vì văn bản sinh ra từ chính màn đó —
                  cán bộ tạo tờ trình ở trên, theo dõi tiến độ ở đây. */}
              <SubItem icon={<Send size={13} />} label="Danh sách văn bản"
                active={activePage === "van_ban_trinh_ky"} nav="van_ban_trinh_ky"
                badge={DU_LIEU_MAU.filter(v => v.trangThai === "BiTraLai").length} />
              <SubItem icon={<Gavel size={13} />} label="Hồ sơ kháng nghị" active={activePage === "khangnghi"} nav="khangnghi" />
              <SubItem icon={<Users size={13} />} label="Phân công thẩm phán" active={activePage === "phancong"} nav="phancong" />
            </div>
          )}
        </div>

        {/* Quản lý án GĐT/TT */}
        <div>
          <GroupItem icon={<Scale size={15} />} label="Quản lý án GĐT/TT"
            open={quanLyAnOpen} onToggle={() => setQuanLyAnOpen(!quanLyAnOpen)} />
          {quanLyAnOpen && (
            <div className="pb-1">
              <SubItem icon={<Inbox size={13} />} label="Nhận đơn và TL vụ án"
                active={activePage === "nhandon_tl"} nav="nhandon_tl" />
              <SubItem icon={<Scale size={13} />} label="Cấu hình phân công TP"
                active={activePage === "cauhinh_pctp"} nav="cauhinh_pctp" />
            </div>
          )}
        </div>

        {/* Công tác lãnh đạo — Phê duyệt đề xuất ở nguyên chỗ cũ.
            Lãnh đạo đã quen vào đây; đổi vị trí chỉ tạo thêm chi phí học lại. */}
        <div>
          <GroupItem icon={<Users size={15} />} label="Công tác lãnh đạo"
            open={congTacLanhDaoOpen} onToggle={() => setCongTacLanhDaoOpen(!congTacLanhDaoOpen)} />
          {congTacLanhDaoOpen && (
            <div className="pb-1">
              <SubItem icon={<Check size={13} />} label="Phê duyệt đề xuất" active={activePage === "phe_duyet"} nav="phe_duyet" />
            </div>
          )}
        </div>

        {/* Sổ văn bản đi — mục đơn lẻ cấp 1 (nghiệp vụ văn thư, không thuộc
            nhóm nào sẵn có). Không dựng nhóm mới chỉ để chứa một mục. */}
        <div onClick={() => onNav?.("so_van_ban_di")}
          className={`flex items-center gap-2.5 px-3 py-[8px] cursor-pointer hover:bg-[#f5f5f5] transition-colors text-[13px] rounded-[3px] mx-1
            ${activePage === "so_van_ban_di" ? "bg-[#fdeaea] text-[#8b1a1a] font-semibold" : "text-[#333]"}`}>
          <Archive size={15} className={activePage === "so_van_ban_di" ? "text-[#8b1a1a]" : "text-[#666]"} />
          <span>Sổ văn bản đi</span>
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

      {/* Tài khoản đang đăng nhập — ghim đáy sidebar */}
      <KhoiTaiKhoan vaiTro={currentRole} />
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
interface GhepRow { id: number; maDon: string; nguoiGui: string; ngayNhap: string; trangThai: string; soBA?: string; ngayBA?: string; toaBA?: string; nguoiNhap?: string; cuaToi?: boolean; yeuCauBosung?: { soTB: string; ngayGui: string }[]; }

const GHEP_CANDIDATES: GhepRow[] = [
  { id: 10, maDon: "7025", nguoiGui: "Nguyễn Thị Hoa", ngayNhap: "18/07/2026", trangThai: "Thụ lý mới", soBA: "15/2023/DS-PT", ngayBA: "12/03/2023", toaBA: "TAND tỉnh Bắc Ninh", nguoiNhap: "Nguyễn Minh An", cuaToi: true },
  { id: 11, maDon: "7022", nguoiGui: "Tòa án nhân dân tỉnh Vĩnh Phúc", ngayNhap: "15/07/2026", trangThai: "Chưa đủ điều kiện", soBA: "08/2022/HS-PT", ngayBA: "20/06/2022", toaBA: "TAND tỉnh Vĩnh Phúc", nguoiNhap: "Trần Văn B", cuaToi: false,
    yeuCauBosung: [
      { soTB: "TB-01", ngayGui: "16/07/2026" },
      { soTB: "TB-02", ngayGui: "18/07/2026" },
    ],
  },
  { id: 12, maDon: "7019", nguoiGui: "Trần Văn Bình", ngayNhap: "12/07/2026", trangThai: "Đã thụ lý", soBA: "33/2024/KDTM-PT", ngayBA: "15/11/2024", toaBA: "TAND cấp cao tại HN", nguoiNhap: "Lê Thị C", cuaToi: false },
  { id: 13, maDon: "7015", nguoiGui: "Công ty TNHH Minh Đức", ngayNhap: "08/07/2026", trangThai: "Thụ lý mới", soBA: "21/2021/LĐ-PT", ngayBA: "05/09/2021", toaBA: "TAND tỉnh Hà Nam", nguoiNhap: "Nguyễn Minh An", cuaToi: true },
];

const VALID_GHEP_STATUSES = ["Thụ lý mới", "Đã thụ lý", "Chưa đủ điều kiện"];

// ─── Popup Tải lên tài liệu / OCR ────────────────────────────────────────────
const PopupUploadFile = ({ onClose, onUpload }: { onClose: () => void, onUpload: (f: OcrFile) => void }) => {
  const [tab, setTab] = useState<0 | 1>(0); // 0: PDF, 1: Scan
  const [file, setFile] = useState<OcrFile | null>(null);
  const [tenTaiLieu, setTenTaiLieu] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Tên tài liệu mặc định lấy theo tên file, bỏ phần đuôi .pdf
  const tenTheoFile = (tenFile: string) => tenFile.replace(/\.pdf$/i, "");

  const accept = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return;
    setFile({ name: f.name, sizeMB: f.size / 1024 / 1024 });
    setTenTaiLieu(tenTheoFile(f.name));   // chọn file khác = tài liệu khác, điền lại
  };

  // Bỏ file: chỉ xóa tên nếu người dùng chưa sửa, giữ nguyên nếu đã tự nhập
  const boFile = () => {
    if (file && tenTaiLieu === tenTheoFile(file.name)) setTenTaiLieu("");
    setFile(null);
  };

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
              <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden"
                onChange={e => accept(e.target.files?.[0])} />
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); accept(e.dataTransfer.files?.[0]); }}
                className={`border border-dashed rounded-[6px] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${dragOver ? "border-[#8b1a1a] bg-[#fce4ec]" : "border-[#e91e63] bg-[#fdf2f6] hover:bg-[#fce4ec]"}`}>
                <div className="w-10 h-10 bg-[#e91e63] rounded-[4px] flex items-center justify-center mb-3">
                  <Archive size={20} className="text-white" />
                </div>
                <div className="text-[14px] font-medium text-[#333] mb-1">Click hoặc kéo thả file tài liệu vào đây</div>
                <div className="text-[12px] text-[#666]">Hỗ trợ file định dạng .pdf</div>
              </div>

              {/* Selected file */}
              {file ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#f5f5f5] rounded-[4px]">
                  <FileText size={18} className="text-[#1a73e8] flex-shrink-0" />
                  <span className="text-[13px] font-medium text-[#333] truncate flex-1">{file.name}</span>
                  <span className="text-[12px] text-[#888] flex-shrink-0">{file.sizeMB.toFixed(2)} MB</span>
                  <button onClick={boFile} className="text-[#888] hover:text-[#c0392b] flex-shrink-0"><X size={14} /></button>
                </div>
              ) : (
                <div className="text-[12px] text-[#c0392b] flex items-center gap-1">
                  <AlertCircle size={12} /> Bắt buộc tải lên 1 file PDF để tiếp tục.
                </div>
              )}

              {/* Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#333] mb-1"><span className="text-[#e91e63]">*</span> Tên tài liệu</label>
                  <input value={tenTaiLieu} onChange={e => setTenTaiLieu(e.target.value)}
                    placeholder="Nhập tên tài liệu" className="w-full h-[32px] px-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
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
              <button onClick={() => file && onUpload(file)} disabled={!file}
                className={`h-[32px] px-4 rounded-[3px] text-[13px] font-medium transition-colors text-white ${file ? "bg-[#e91e63] hover:bg-[#d81b60]" : "bg-[#e91e63] opacity-50 cursor-not-allowed"}`}>Tải lên</button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="h-[32px] px-4 border border-[#ccc] bg-white text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[13px] font-medium transition-colors">Hủy</button>
              <button onClick={() => onUpload({ name: `scan-${Date.now()}.pdf`, sizeMB: 0.12 })} className="h-[32px] px-4 border border-[#ccc] bg-white text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[13px] font-medium transition-colors">Bắt đầu quét</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Luồng OCR: xác nhận → đang xử lý → hủy ──────────────────────────────────
// Trạng thái OCR của hồ sơ. "dang" vẫn chạy khi popup đã đóng (chạy nền).
type OcrStatus = "chua" | "dang" | "thanhcong" | "thatbai" | "dahuy";

const OCR_STATUS_META: Record<OcrStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  chua:       { label: "Chưa OCR",      cls: "bg-[#f1f3f5] text-[#555] border-[#ccc]",       icon: <FileText size={11} /> },
  dang:       { label: "Đang OCR",      cls: "bg-[#fff7e6] text-[#92400e] border-[#f59e0b]", icon: <Loader2 size={11} className="animate-spin" /> },
  thanhcong:  { label: "OCR thành công", cls: "bg-[#e8f5e9] text-[#1b5e20] border-[#4caf50]", icon: <Check size={11} /> },
  thatbai:    { label: "OCR thất bại",  cls: "bg-[#fdecea] text-[#8b1a1a] border-[#e57373]",  icon: <AlertCircle size={11} /> },
  dahuy:      { label: "OCR đã hủy",    cls: "bg-[#f1f3f5] text-[#555] border-[#ccc]",        icon: <Ban size={11} /> },
};

const OcrStatusBadge = ({ status, className = "" }: { status: OcrStatus; className?: string }) => {
  const m = OCR_STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-[2px] rounded-[10px] border text-[11px] font-semibold whitespace-nowrap ${m.cls} ${className}`}>
      {m.icon} {m.label}
    </span>
  );
};

// ─── Popup Thêm thông báo trả lời đơn ────────────────────────────────────────
const TOA_AN_OPTIONS = [
  "TAND tối cao",
  "TAND cấp cao tại Hà Nội",
  "TAND cấp cao tại Đà Nẵng",
  "TAND cấp cao tại TP. Hồ Chí Minh",
  "TAND tỉnh Bắc Ninh",
  "TAND TP. Hà Nội",
  "TAND TP. Hồ Chí Minh",
];

// ─── Popup Thêm đơn thụ lý kèm ───────────────────────────────────────────────
export interface DonThuLyKem {
  id: number;
  soHieu: string;
  ngayNhan: string;
  ngayGhi: string;
  laCongVan: boolean;
}

const PopupThemDonKem = ({ onDong, onThem }: {
  onDong: () => void;
  onThem: (d: Omit<DonThuLyKem, "id">) => void;
}) => {
  const [soHieu, setSoHieu] = useState("");
  const [ngayNhan, setNgayNhan] = useState("");
  const [ngayGhi, setNgayGhi] = useState("");
  const [laCongVan, setLaCongVan] = useState(false);
  const [daBam, setDaBam] = useState(false);
  const thieu = !ngayNhan;

  const oNhap = (rong: boolean) =>
    `w-full h-[36px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors placeholder:text-[#bbb] ${
      daBam && rong ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]"}`;

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-[8px] shadow-2xl w-[780px] overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <span className="text-[16px] font-bold text-[#222]">Thêm đơn thụ lý kèm</span>
          <button onClick={onDong} className="text-[#888] hover:text-[#333] -mt-1"><X size={19} /></button>
        </div>

        <div className="px-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5">Số hiệu đơn</label>
              <input value={soHieu} onChange={e => setSoHieu(e.target.value)}
                placeholder="Nhập số hiệu đơn" className={oNhap(false)} />
            </div>
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5">
                <span className="text-[#c0392b] mr-1">*</span>Ngày nhận đơn
              </label>
              <input type="date" value={ngayNhan} onChange={e => setNgayNhan(e.target.value)}
                className={oNhap(!ngayNhan)} />
            </div>
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5">Ngày ghi trên đơn</label>
              <input type="date" value={ngayGhi} onChange={e => setNgayGhi(e.target.value)}
                className={oNhap(false)} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] mt-4">
            <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]"
              checked={laCongVan} onChange={e => setLaCongVan(e.target.checked)} />
            Công văn
          </label>

          {daBam && thieu && (
            <p className="text-[12px] text-[#c0392b] mt-3">Vui lòng chọn Ngày nhận đơn.</p>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 mt-2">
          <button onClick={onDong}
            className="h-[36px] px-5 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[5px] text-[13px] font-medium transition-colors">Hủy</button>
          <button onClick={() => {
            setDaBam(true);
            if (thieu) return;
            const ddmmyyyy = (s: string) => s ? s.split("-").reverse().join("/") : "";
            onThem({
              soHieu: soHieu.trim(), ngayNhan: ddmmyyyy(ngayNhan),
              ngayGhi: ddmmyyyy(ngayGhi), laCongVan,
            });
          }}
            className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[5px] text-[13px] font-semibold transition-colors">Thêm</button>
        </div>
      </div>
    </div>
  );
};

const PopupThemThongBao = ({ onDong, onThem }: {
  onDong: () => void;
  onThem: (tb: { soTB: string; ngayTB: string; toaAn: string }) => void;
}) => {
  const [soTB, setSoTB] = useState("");
  const [ngayTB, setNgayTB] = useState("");
  const [toaAn, setToaAn] = useState("");
  const [daBam, setDaBam] = useState(false);
  const thieu = !soTB.trim() || !ngayTB || !toaAn;

  const Sao = () => <span className="text-[#c0392b] mr-1">*</span>;
  const vien = (rong: boolean) =>
    daBam && rong ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]";

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-[10px] shadow-2xl w-[520px] overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-5 pb-1">
          <span className="text-[16px] font-bold text-[#222]">Thêm thông báo trả lời đơn</span>
          <button onClick={onDong} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
        </div>

        <div className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Số thông báo</label>
            <input value={soTB} onChange={e => setSoTB(e.target.value)} placeholder="Nhập số thông báo"
              className={`w-full h-[38px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors ${vien(!soTB.trim())}`} />
          </div>
          <div>
            <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Ngày thông báo</label>
            <input type="date" value={ngayTB} onChange={e => setNgayTB(e.target.value)}
              className={`w-full h-[38px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors ${vien(!ngayTB)}`} />
          </div>
          <div>
            <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Tòa án</label>
            <div className="relative">
              <select value={toaAn} onChange={e => setToaAn(e.target.value)}
                className={`w-full h-[38px] pl-3 pr-8 text-[13px] border rounded-[6px] bg-white appearance-none outline-none transition-colors ${vien(!toaAn)} ${toaAn ? "text-[#222]" : "text-[#aaa]"}`}>
                <option value="">Chọn tòa án</option>
                {TOA_AN_OPTIONS.map(t => <option key={t} className="text-[#222]">{t}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
            </div>
          </div>
          {daBam && thieu && (
            <p className="text-[12px] text-[#c0392b]">Vui lòng nhập đủ các trường bắt buộc.</p>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 pb-5">
          <button onClick={onDong}
            className="h-[36px] px-5 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[5px] text-[13px] font-medium transition-colors">Hủy</button>
          <button onClick={() => {
            setDaBam(true);
            if (thieu) return;
            onThem({ soTB: soTB.trim(), ngayTB: ngayTB.split("-").reverse().join("/"), toaAn });
          }}
            className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[5px] text-[13px] font-semibold transition-colors">Thêm</button>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Thêm đơn liên quan ────────────────────────────────────────────────
export interface DonLienQuan {
  id: number; maDon: string; ngayNhan: string;
  nguoiGui: string; diaChi: string;
  soBA: string; ngayBA: string; hinhThuc: string; thuTuc: string;
  nguoiNhap: string; ngayNhap: string;
}

const HINH_THUC_DON_OPTIONS = [
  "Đơn đề nghị GĐT/TT",
  "CV Kiến nghị GĐT, TT",
  "Đơn khiếu nại tố cáo trong tố tụng",
  "Đơn khiếu nại tư pháp",
  "Đơn khác",
];

const PopupThemDonLienQuan = ({ onDong, onThem }: {
  onDong: () => void;
  onThem: (d: Omit<DonLienQuan, "id">) => void;
}) => {
  const [f, setF] = useState({
    maDon: "", ngayNhan: "", nguoiGui: "", diaChi: "",
    soBA: "", ngayBA: "", hinhThuc: "", thuTuc: "", nguoiNhap: "",
  });
  const [daBam, setDaBam] = useState(false);
  const dat = (k: keyof typeof f) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const batBuoc: (keyof typeof f)[] = ["maDon", "ngayNhan", "nguoiGui"];
  const thieu = batBuoc.some(k => !f[k].trim());

  const Sao = () => <span className="text-[#c0392b] mr-1">*</span>;
  const vien = (rong: boolean) => daBam && rong ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]";
  const oInput = (rong: boolean) =>
    `w-full h-[36px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors ${vien(rong)}`;

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-[10px] shadow-2xl w-[640px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 pt-5 pb-1">
          <span className="text-[16px] font-bold text-[#222]">Thêm đơn liên quan</span>
          <button onClick={onDong} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
        </div>

        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Mã đơn</label>
              <input value={f.maDon} onChange={e => dat("maDon")(e.target.value)} placeholder="Nhập mã đơn"
                className={oInput(!f.maDon.trim())} />
            </div>
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Ngày nhận</label>
              <input type="date" value={f.ngayNhan} onChange={e => dat("ngayNhan")(e.target.value)}
                className={oInput(!f.ngayNhan)} />
            </div>
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Người gửi đơn</label>
              <input value={f.nguoiGui} onChange={e => dat("nguoiGui")(e.target.value)} placeholder="Nhập tên người gửi đơn"
                className={oInput(!f.nguoiGui.trim())} />
            </div>
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5">Địa chỉ</label>
              <input value={f.diaChi} onChange={e => dat("diaChi")(e.target.value)} placeholder="Nhập địa chỉ"
                className={oInput(false)} />
            </div>
          </div>

          <div className="border-t border-[#eee] pt-3">
            <div className="text-[13px] font-semibold text-[#444] mb-2">Thông tin đơn</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5">Số BA/QĐ</label>
                <input value={f.soBA} onChange={e => dat("soBA")(e.target.value)} placeholder="Nhập số bản án/quyết định"
                  className={oInput(false)} />
              </div>
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5">Ngày BA/QĐ</label>
                <input type="date" value={f.ngayBA} onChange={e => dat("ngayBA")(e.target.value)}
                  className={oInput(false)} />
              </div>
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5">Hình thức</label>
                <div className="relative">
                  <select value={f.hinhThuc} onChange={e => dat("hinhThuc")(e.target.value)}
                    className={`w-full h-[36px] pl-3 pr-8 text-[13px] border rounded-[6px] bg-white appearance-none outline-none ${vien(false)} ${f.hinhThuc ? "text-[#222]" : "text-[#aaa]"}`}>
                    <option value="">Chọn hình thức</option>
                    {HINH_THUC_DON_OPTIONS.map(o => <option key={o} className="text-[#222]">{o}</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5">Thủ tục giải quyết</label>
                <div className="relative">
                  <select value={f.thuTuc} onChange={e => dat("thuTuc")(e.target.value)}
                    className={`w-full h-[36px] pl-3 pr-8 text-[13px] border rounded-[6px] bg-white appearance-none outline-none ${vien(false)} ${f.thuTuc ? "text-[#222]" : "text-[#aaa]"}`}>
                    <option value="">Chọn thủ tục</option>
                    <option className="text-[#222]">Giám đốc thẩm</option>
                    <option className="text-[#222]">Tái thẩm</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#eee] pt-3">
            <label className="block text-[13px] text-[#333] mb-1.5">Người nhập</label>
            <input value={f.nguoiNhap} onChange={e => dat("nguoiNhap")(e.target.value)} placeholder="Nhập tên người nhập"
              className={`${oInput(false)} max-w-[50%]`} />
          </div>

          {daBam && thieu && (
            <p className="text-[12px] text-[#c0392b]">Vui lòng nhập đủ các trường bắt buộc.</p>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 pb-5">
          <button onClick={onDong}
            className="h-[36px] px-5 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[5px] text-[13px] font-medium transition-colors">Hủy</button>
          <button onClick={() => {
            setDaBam(true);
            if (thieu) return;
            const ddmmyyyy = (s: string) => s ? s.split("-").reverse().join("/") : "";
            onThem({
              maDon: f.maDon.trim(), ngayNhan: ddmmyyyy(f.ngayNhan),
              nguoiGui: f.nguoiGui.trim(), diaChi: f.diaChi.trim(),
              soBA: f.soBA.trim(), ngayBA: ddmmyyyy(f.ngayBA),
              hinhThuc: f.hinhThuc, thuTuc: f.thuTuc,
              nguoiNhap: f.nguoiNhap.trim() || "Vũ Văn Yên",
              ngayNhap: ddmmyyyy(f.ngayNhan),
            });
          }}
            className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[5px] text-[13px] font-semibold transition-colors">Thêm</button>
        </div>
      </div>
    </div>
  );
};

// Popup 1 — Xác nhận xử lý OCR
const PopupOcrConfirm = ({ file, onBack, onStart }: { file: OcrFile; onBack: () => void; onStart: () => void }) => (
  <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
    <div className="bg-white rounded-[14px] shadow-2xl w-[560px] overflow-hidden">
      <div className="flex items-start justify-between px-6 pt-5 pb-3">
        <span className="text-[16px] font-bold text-[#222]">Xác nhận xử lý OCR</span>
        <button onClick={onBack} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
      </div>

      <div className="px-6">
        <div className="flex items-center gap-3 bg-[#f4f5f7] rounded-[8px] px-4 py-3">
          <FileText size={30} className="text-[#4a90d9] flex-shrink-0" strokeWidth={1.5} />
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-[#222] truncate">{file.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] text-[#888]">{file.sizeMB.toFixed(2)} MB</span>
              <button title="Tải xuống" className="text-[#1a73e8] hover:text-[#0f4c9e]"><Download size={13} /></button>
            </div>
          </div>
        </div>
        <p className="text-[13px] text-[#777] mt-4">
          Hệ thống sẽ trích xuất dữ liệu từ tài liệu. Quá trình này có thể mất vài phút.
        </p>
      </div>

      <div className="flex justify-end gap-2 px-6 py-4 mt-2">
        <button onClick={onBack} className="h-[36px] px-5 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[5px] text-[13px] font-medium transition-colors">Quay lại</button>
        <button onClick={onStart} className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[5px] text-[13px] font-semibold transition-colors">Bắt đầu OCR</button>
      </div>
    </div>
  </div>
);

// Popup 2 — Đang xử lý OCR (3 bước)
const OCR_STEPS = [
  { title: "Tải tài liệu",       doing: "Đang tải lên",           wait: "Chờ xử lý" },
  { title: "OCR tài liệu",       doing: "Đang nhận dạng văn bản", wait: "Chờ tải xong" },
  { title: "Trích xuất dữ liệu", doing: "Đang trích xuất",        wait: "Chờ OCR xong" },
];

const PopupOcrProgress = ({ step, onCancel, onClose }: { step: number; onCancel: () => void; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
    <div className="bg-white rounded-[14px] shadow-2xl w-[650px] overflow-hidden">
      <div className="flex items-start justify-between px-6 pt-5 pb-2">
        <span className="text-[16px] font-bold text-[#222]">Đang xử lý OCR</span>
        <button onClick={onClose} title="Đóng" className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
      </div>

      <div className="px-6 py-4">
        {/* Spinner */}
        <div className="flex justify-center gap-1.5 mb-3">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-[9px] h-[9px] rounded-full bg-[#8b1a1a] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <div className="text-center text-[14px] text-[#333] mb-6">Đang OCR tài liệu...</div>

        {/* Steps */}
        <div className="flex items-start">
          {OCR_STEPS.map((s, i) => {
            const done = i < step, doing = i === step;
            return (
              <div key={i} className="flex items-start flex-1 last:flex-none">
                <div className="flex items-start gap-2">
                  <div className="w-[22px] h-[22px] flex-shrink-0 flex items-center justify-center">
                    {done ? (
                      <span className="w-[22px] h-[22px] rounded-full border-2 border-[#2e7d32] flex items-center justify-center text-[#2e7d32]"><Check size={13} strokeWidth={3} /></span>
                    ) : doing ? (
                      <Loader2 size={20} className="text-[#8b1a1a] animate-spin" />
                    ) : (
                      <span className="w-[22px] h-[22px] rounded-full bg-[#e9ecef] text-[#999] text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                    )}
                  </div>
                  <div className="leading-tight">
                    <div className={`text-[13px] font-medium ${done || doing ? "text-[#222]" : "text-[#999]"}`}>{s.title}</div>
                    <div className={`text-[12px] ${done ? "text-[#2e7d32]" : doing ? "text-[#666]" : "text-[#aaa]"}`}>
                      {done ? "Hoàn tất" : doing ? s.doing : s.wait}
                    </div>
                  </div>
                </div>
                {i < OCR_STEPS.length - 1 && (
                  <div className={`flex-1 h-px mt-[11px] mx-3 ${i < step ? "bg-[#8b1a1a]" : "bg-[#ddd]"}`} />
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[12px] text-[#888] mt-6 px-6">
          OCR có thể mất nhiều thời gian với tài liệu lớn. Vui lòng chờ đến khi hệ thống báo OCR thành công.
        </p>
      </div>

      <div className="flex justify-end gap-2 px-6 py-4">
        <button onClick={onCancel} className="h-[36px] px-5 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[5px] text-[13px] font-medium transition-colors">Hủy OCR</button>
        <button onClick={onClose} className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[5px] text-[13px] font-semibold transition-colors">Đóng</button>
      </div>
    </div>
  </div>
);

// Popup 3 — Xác nhận hủy OCR
const PopupOcrCancelConfirm = ({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) => (
  <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
    <div className="bg-white rounded-[14px] shadow-2xl w-[520px] overflow-hidden">
      <div className="flex items-start justify-between px-6 pt-5 pb-3">
        <span className="text-[16px] font-bold text-[#222]">Xác nhận hủy OCR</span>
        <button onClick={onBack} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
      </div>
      <div className="px-6 pb-1">
        <p className="text-[14px] text-[#222] font-medium">Bạn có chắc chắn muốn hủy quá trình OCR?</p>
        <p className="text-[13px] text-[#777] mt-2">Dữ liệu sẽ không được trích xuất tự động. Bạn có thể thực hiện OCR lại sau.</p>
      </div>
      <div className="flex justify-end gap-2 px-6 py-4 mt-2">
        <button onClick={onBack} className="h-[36px] px-5 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[5px] text-[13px] font-medium transition-colors">Quay lại</button>
        <button onClick={onConfirm} className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[5px] text-[13px] font-semibold transition-colors">Xác nhận hủy</button>
      </div>
    </div>
  </div>
);


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


// Current logged-in user (mock)
const CURRENT_USER = "Nguyễn Minh An";

const PopupGhepDon = ({
  donChinh, onClose, onNext,
}: {
  donChinh: { maDon: string; nguoiGui: string; soBA?: string; ngayBA?: string; toaXetXu?: string; nguoiNhap?: string; cuaToi?: boolean };
  onClose: () => void;
  onNext: (selected: GhepRow[]) => void;
}) => {
  const parseDate = (value: string) => {
    const [day, month, year] = value.split("/").map(Number);
    return Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year) ? new Date(0) : new Date(year, month - 1, day);
  };

  const eligibleCandidates = GHEP_CANDIDATES
    .filter(r => VALID_GHEP_STATUSES.includes(r.trangThai))
    .sort((a, b) => parseDate(a.ngayNhap).getTime() - parseDate(b.ngayNhap).getTime());

  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const allChecked = eligibleCandidates.length > 0 && selected.length === eligibleCandidates.length;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-[900px] max-h-[85vh] flex flex-col border border-[#bbb]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1d2e4f] px-4 py-[10px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white">
            <GitMerge size={15} />
            <span className="text-[14px] font-semibold">Ghép đơn</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={17} /></button>
        </div>

        {/* Đơn hiện tại info bar */}
        <div className="px-4 pt-3 pb-3 bg-[#f9f9f9] border-b border-[#eee]">
          <p className="text-[12px] text-[#555] mb-2">Đơn hiện tại</p>
          <div className="flex flex-wrap items-center gap-6 text-[12px]">
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

        {/* Table — Danh sách đơn có thể ghép */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-[12px] font-semibold text-[#333] mb-2">Danh sách đơn có thể ghép</p>
          {eligibleCandidates.length === 0 ? (
            <div className="text-[13px] text-[#999] italic py-4 text-center">Không có đơn có thể ghép</div>
          ) : (
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border border-[#ddd] px-2 py-[6px] w-[36px]">
                    <input type="checkbox"
                      className="w-[13px] h-[13px] accent-[#8b1a1a]"
                      checked={allChecked}
                      onChange={e => setSelected(e.target.checked ? eligibleCandidates.map(r => r.id) : [])} />
                  </th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Mã đơn</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Thông tin bản án</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Ngày nhập</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Người nhập</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {eligibleCandidates.map((r, i) => (
                  <tr key={r.id}
                    className={`cursor-pointer ${selected.includes(r.id) ? "bg-[#eef3ff]" : i % 2 === 1 ? "bg-[#fbfbfb]" : "bg-white"}`}
                    onClick={() => toggle(r.id)}>
                    <td className="border border-[#ddd] px-2 py-[6px] text-center">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={selected.includes(r.id)} onChange={() => toggle(r.id)}
                        onClick={e => e.stopPropagation()} />
                    </td>
                    <td className="border border-[#ddd] px-3 py-[6px] align-top">
                      <div className="font-medium text-[#1a5a96]">{r.maDon}</div>
                      {r.cuaToi && (
                        <div className="mt-1 inline-flex items-center rounded-[3px] bg-[#eef7ef] border border-[#c8e3c7] px-2 py-[2px] text-[11px] font-semibold text-[#23632d]">
                          Đơn của tôi
                        </div>
                      )}
                    </td>
                    <td className="border border-[#ddd] px-3 py-[6px]">
                      {r.soBA && (
                        <div className="leading-snug space-y-[1px] text-[12px] text-[#333]">
                          <div><span className="text-[#888]">Số BA: </span><span className="font-medium text-[#333]">{r.soBA}</span></div>
                          <div><span className="text-[#888]">Ngày BA: </span><span className="text-[#555]">{r.ngayBA}</span></div>
                          <div><span className="text-[#888]">Tòa xét xử: </span><span className="text-[#555]">{r.toaBA}</span></div>
                        </div>
                      )}
                    </td>
                    <td className="border border-[#ddd] px-3 py-[6px] whitespace-nowrap">{r.ngayNhap}</td>
                    <td className="border border-[#ddd] px-3 py-[6px] whitespace-nowrap">{r.nguoiNhap ?? "—"}</td>
                    <td className="border border-[#ddd] px-3 py-[6px]">
                      <span className={`inline-block px-2 py-[2px] rounded text-[11px] font-medium
                          ${r.trangThai === "Chưa đủ điều kiện" ? "bg-[#f9e6e2] text-[#a33a29]" : r.trangThai === "Đã thụ lý" ? "bg-[#e9eff8] text-[#2d4b74]" : "bg-[#eef5f6] text-[#285662]"}`}>
                        {r.trangThai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selected.length > 0 && (
            <p className="text-[12px] text-[#1d2e4f] mt-2 font-medium">Đã chọn {selected.length} đơn để ghép.</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          <BtnSecondary onClick={onClose}>Hủy</BtnSecondary>
          <BtnPrimary
            disabled={selected.length === 0}
            onClick={() => {
              if (selected.length === 0) return;
              onNext(eligibleCandidates.filter(r => selected.includes(r.id)));
            }}
          >
            <GitMerge size={13} /> Tiếp tục
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Xác nhận Ghép đơn ─────────────────────────────────────────────────
const PopupXacNhanGhep = ({
  donChinh, donGhep, onClose, onConfirm, isRecipientConfirmation = false, onReject,
}: {
  donChinh: { maDon: string; nguoiGui: string; soBA?: string; ngayBA?: string; toaXetXu?: string; nguoiNhap?: string; cuaToi?: boolean; trangThai?: string };
  donGhep: GhepRow[];
  onClose: () => void;
  onConfirm: () => void;
  isRecipientConfirmation?: boolean;
  onReject?: () => void;
}) => {
  // Build full list: đơn chính + các đơn ghép
  const allDons = [
    { id: -1, maDon: donChinh.maDon, nguoiGui: donChinh.nguoiGui, nguoiNhap: donChinh.nguoiNhap ?? CURRENT_USER, cuaToi: donChinh.cuaToi ?? true, soBA: donChinh.soBA, ngayBA: donChinh.ngayBA, toaBA: donChinh.toaXetXu, ngayNhap: "", trangThai: donChinh.trangThai ?? "" },
    ...donGhep.map(d => ({ ...d, nguoiNhap: d.nguoiNhap ?? "—", cuaToi: d.cuaToi ?? false })),
  ];

  const myDons = allDons.filter(d => d.cuaToi);
  const othersDons = allDons.filter(d => !d.cuaToi);
  const hasOthers = othersDons.length > 0;
  const twoExactly = allDons.length === 2; // 2 đơn tổng: 1 của tôi + 1 người khác

  // Đơn chính mặc định: đơn đầu tiên của tôi, nếu không có → đơn đầu tiên
  const defaultChinh = myDons[0]?.id ?? allDons[0]?.id ?? -1;
  const [donChinhId, setDonChinhId] = useState<number>(defaultChinh);

  // Yêu cầu bổ sung liên quan (multi-select, chỉ khi có đơn Chưa đủ điều kiện)
  const selectedYeuCauOptions = donGhep.flatMap(d => (d.yeuCauBosung ?? []).map(item => ({
    label: `Yêu cầu bổ sung số ${item.soTB} - đơn ${d.maDon} - ngày ${item.ngayGui}`,
    key: `${d.maDon}-${item.soTB}-${item.ngayGui}`,
  })));
  const [selectedYeuCau, setSelectedYeuCau] = useState<string[]>([]);
  const toggleYeuCau = (v: string) => setSelectedYeuCau(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const hasRequestOptions = selectedYeuCauOptions.length > 0;

  // Kiểm tra xem đơn đang chọn làm chính có hợp lệ không
  const selectedDon = allDons.find(d => d.id === donChinhId);
  const chinhIsMine = selectedDon?.cuaToi ?? true;

  // Nếu ghép nhiều đơn (>=3): chỉ được chọn đơn của mình
  // Nếu đúng 2 đơn (1 của tôi + 1 người khác): cho phép chọn đơn người khác
  const canSelectOthersAsChinh = twoExactly && myDons.length === 1 && othersDons.length === 1;

  const isRadioDisabled = (don: typeof allDons[0]) => {
    if (!hasOthers) return false; // toàn bộ của mình → tự do
    if (canSelectOthersAsChinh) return false; // 2 đơn 1-1 → tự do
    return !don.cuaToi; // nhiều đơn có người khác → chỉ chọn đơn của mình
  };

  // Xác định luồng: cần gửi yêu cầu hay ghép thẳng?
  const needsRequest = hasOthers; // có bất kỳ đơn người khác → cần yêu cầu
  const showSelection = !isRecipientConfirmation;
  const showRecipientInfo = isRecipientConfirmation;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-[680px] max-h-[90vh] flex flex-col border border-[#bbb]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1d2e4f] px-4 py-[10px] rounded-t-[4px]">
          <div className="flex items-center gap-2 text-white">
            <Check size={15} />
            <span className="text-[14px] font-semibold">Xác nhận ghép đơn</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={17} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Hướng dẫn */}
          {hasOthers && !chinhIsMine && (
            <div className="bg-[#fff8e1] border border-[#f0c040] rounded-[3px] px-3 py-2 text-[12px] text-[#7a5c00]">
              Đơn chính là của người khác. Hệ thống sẽ gửi yêu cầu xác nhận đến người nhập đơn chính.
            </div>
          )}

          <div>
            <p className="text-[12px] font-semibold text-[#333] mb-2">
              {showSelection ? "Chọn đơn chính" : "Thông tin yêu cầu ghép"}
            </p>
            <div className="space-y-2">
              {allDons.map(d => {
                const isChinh = d.id === donChinhId;
                const disabled = isRadioDisabled(d);
                return (
                  <div key={d.id}
                    onClick={() => showSelection && !disabled && setDonChinhId(d.id)}
                    className={`border rounded-[3px] px-3 py-2 text-[12px] flex items-start gap-3 transition-colors
                      ${isChinh ? "border-[#1d2e4f] bg-[#f0f7ff]" : "border-[#ddd] bg-white"}
                      ${showSelection ? (disabled ? "opacity-50" : "cursor-pointer hover:border-[#8b1a1a] hover:bg-[#fdeaea]") : ""}`}>
                    {showSelection && (
                      <input
                        type="radio"
                        name="don-chinh"
                        checked={isChinh}
                        disabled={disabled}
                        onChange={() => !disabled && setDonChinhId(d.id)}
                        onClick={e => e.stopPropagation()}
                        className="mt-[2px] w-[14px] h-[14px] accent-[#8b1a1a] flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-[#1a5a96]">Mã đơn: {d.maDon}</span>
                        {isChinh && (
                          <span className="inline-flex items-center rounded-[3px] bg-[#1d2e4f] text-white text-[10px] font-semibold px-2 py-[2px]">
                            Đơn chính
                          </span>
                        )}
                        {!isChinh && !showSelection && (
                          <span className="inline-flex items-center rounded-[3px] bg-[#f0f4f7] text-[#3d546a] text-[10px] font-semibold px-2 py-[2px]">
                            Đơn kèm
                          </span>
                        )}
                        {!isChinh && showSelection && d.cuaToi && (
                          <span className="inline-flex items-center rounded-[3px] border border-[#cdd9d7] bg-[#f0f6f2] text-[#256029] text-[10px] font-semibold px-2 py-[2px]">
                            Đơn của tôi
                          </span>
                        )}
                        {d.trangThai && (
                          <span className={`inline-block px-2 py-[2px] rounded text-[11px] font-medium
                            ${d.trangThai === "Chưa đủ điều kiện" ? "bg-[#f9e6e2] text-[#a33a29]" : d.trangThai === "Đã thụ lý" ? "bg-[#e9eff8] text-[#2d4b74]" : "bg-[#eef5f6] text-[#285662]"}`}>
                            {d.trangThai}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#555] flex flex-wrap gap-x-4 gap-y-[2px]">
                        <span><span className="text-[#888]">Người gửi: </span>{d.nguoiGui}</span>
                        {d.nguoiNhap && <span><span className="text-[#888]">Người nhập: </span>{d.nguoiNhap}</span>}
                        {d.soBA && <span><span className="text-[#888]">Số BA: </span><span className="font-medium text-[#333]">{d.soBA}</span></span>}
                        {d.ngayBA && <span><span className="text-[#888]">Ngày BA: </span>{d.ngayBA}</span>}
                        {d.toaBA && <span><span className="text-[#888]">Tòa xét xử: </span>{d.toaBA}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Yêu cầu bổ sung liên quan — chỉ khi có đơn có yêu cầu bổ sung */}
          {hasRequestOptions && (
            <div>
              <p className="text-[12px] font-semibold text-[#333] mb-1.5">
                Yêu cầu bổ sung liên quan
                <span className="ml-1 text-[11px] font-normal text-[#888]">(không bắt buộc)</span>
              </p>
              <div className="border border-[#ddd] rounded-[3px] p-2 space-y-1.5 bg-[#fafafa]">
                {selectedYeuCauOptions.map(opt => (
                  <label key={opt.key} className="flex items-center gap-2 text-[12px] text-[#333] cursor-pointer hover:text-[#8b1a1a]">
                    <input
                      type="checkbox"
                      className="w-[13px] h-[13px] accent-[#8b1a1a]"
                      checked={selectedYeuCau.includes(opt.key)}
                      onChange={() => toggleYeuCau(opt.key)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tóm tắt luồng */}
          <div className="bg-[#f5f5f5] rounded-[3px] px-3 py-2 text-[11px] text-[#555] space-y-0.5">
            {!hasOthers && <div>Tất cả đơn đều của bạn → Ghép ngay sau xác nhận.</div>}
              {hasOthers && !chinhIsMine && (
              <div>Người nhập đơn chính sẽ nhận yêu cầu xác nhận. Sau khi họ xác nhận, ghép đơn sẽ được thực hiện.</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
          {showRecipientInfo ? (
            <>
              <BtnSecondary onClick={onReject ?? onClose}>Từ chối</BtnSecondary>
              <BtnPrimary onClick={onConfirm}>
                <Check size={13} /> Xác nhận
              </BtnPrimary>
            </>
          ) : (
            <>
              <BtnSecondary onClick={onClose}>Hủy</BtnSecondary>
              <BtnPrimary onClick={onConfirm} disabled={!selectedDon}>
                {needsRequest
                  ? <><Send size={13} /> Gửi yêu cầu ghép</>
                  : <><Check size={13} /> Xác nhận ghép đơn</>
                }
              </BtnPrimary>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Thời hiệu giải quyết đơn — hiện thành nhãn màu ngay dưới thông tin người gửi
type ThoiHieuKey = "khong-xac-dinh" | "trong-han-1-nam" | "qua-3-nam" | "qua-5-nam";

const THOI_HIEU: Record<ThoiHieuKey, { nhan: string; cls: string }> = {
  "khong-xac-dinh": {
    nhan: "Không xác định thời hiệu giải quyết",
    cls: "bg-[#f5f5f5] border-[#d5d5d5] text-[#666]",
  },
  "trong-han-1-nam": {
    nhan: "Trong thời hạn giải quyết 1 năm",
    cls: "bg-[#e8f7ee] border-[#a9debb] text-[#1a7a45]",
  },
  "qua-3-nam": {
    nhan: "Quá thời hiệu giải quyết trên 3 năm",
    cls: "bg-[#fef3e2] border-[#fcd48a] text-[#b45309]",
  },
  "qua-5-nam": {
    nhan: "Quá thời hiệu giải quyết trên 5 năm",
    cls: "bg-[#fdecea] border-[#e6a5a0] text-[#c0392b]",
  },
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
  // Ngày sinh cán bộ nhập — chỉ hiển thị khi có 2 cán bộ trùng tên, để phân biệt
  nguoiNhapNgaySinh?: string;
  soHieuDon?: string;              // số hiệu do nơi gửi ghi trên đơn
  ngayTrenDon?: string;            // ngày ghi trên đơn (khác ngày tòa nhận)
  nguoiDungDon?: string;           // dùng thay nhãn "Người gửi" khi là cá nhân đứng đơn
  baGoc?: { so: string; ngay: string };  // bản án sơ thẩm gốc của QĐ giám đốc thẩm
  ngayChuyen?: string;
  ghiChu?: string;
  waitingForProcessing?: boolean;
  traLai?: {
    status: "pendingApproval" | "returned";
    reason: string;
    by: string;
  };
  isPhanCong?: boolean;
  loaiPhanCong?: "chi-dinh" | "ngau-nhien"; // tách danh sách đơn theo hình thức phân công
  thongTinChuyenDon?: "Nội bộ" | "Tòa khác" | "Ngoài tòa án"; // Added for Document Numbering validation
  // ── Các trường phục vụ lọc ──
  loaiAn?: string;
  cuaToi?: boolean;               // thuộc tài khoản đang đăng nhập → tab "Đơn của tôi"
  hetThoiHanKhangNghi?: boolean;  // → tab "Hết thời hạn kháng nghị"
  thoiHieu?: ThoiHieuKey;         // nhãn thời hiệu giải quyết hiện dưới thông tin người gửi
  // Mã đơn bên màn Nhận đơn và TL vụ án — có giá trị nghĩa là đơn đang ở
  // tab "Chờ ý kiến LĐ", cột Thông tin giải quyết lấy theo kết luận của LĐ
  choYKienLD?: string;
}

// Ngày sinh cán bộ nhập. Chỉ đem ra hiển thị khi trong danh sách có từ 2 cán bộ
// trùng tên trở lên — lúc đó riêng mỗi tên còn lại chưa đủ để phân biệt.
const NGAY_SINH_CAN_BO: Record<string, string> = {
  "Vũ Văn Yên": "12/05/1985",
  "Phùng Trâm Anh": "03/09/1990",
  "Nguyễn Thị Lan": "24/01/1987",
  "Nguyễn Minh An": "18/02/1988",
  "Trần Văn B": "07/07/1983",
  "Lê Thị C": "22/09/1985",
};
const ngaySinhCanBo = (r: { nguoiNhap: string; nguoiNhapNgaySinh?: string }) =>
  r.nguoiNhapNgaySinh ?? NGAY_SINH_CAN_BO[r.nguoiNhap] ?? "";

// ─── Sample list data ────────────────────────────────────────────────────────
const SAMPLE_ROWS: DanhSachDonRow[] = [
  {
    id: 1,
    nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh",
    diaChi: "Số 15, đường Lý Thái Tổ, Phường Phương Sơn, Tỉnh Bắc Ninh",
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
    soHieuDon: "TEST-HSKN-432560", ngayTrenDon: "21/07/2026",
    baGoc: { so: "293/2024/KDTM-ST", ngay: "27/09/2024" },
    ngayChuyen: "21/07/2026 16:36:55",
    ghiChu: "Hồ sơ kèm 3 tập tài liệu",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682571", coVanBan: true },
    processingHistory: [
      { date: "21/07/2026", step: "Tiếp nhận hồ sơ", actor: "HCTP - Phòng tiếp nhận", note: "Đã kiểm tra tính hợp lệ" },
      { date: "22/07/2026", step: "Chuyển Vụ Giám đốc kiểm tra và dân sự", actor: "HCTP", note: "Gửi hồ sơ kèm danh sách công văn" },
    ],
    isPhanCong: true, loaiPhanCong: "chi-dinh",
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "trong-han-1-nam",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "21/07/2026", gioNhap: "17:41:29",
  },
  {
    id: 2,
    nguoiGui: "Nguyễn Văn Quyền",
    diaChi: "Số 27, ngõ 5, đường Ngô Gia Tự, Phường Tiền An, Thành phố Bắc Ninh",
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
    thoiHieu: "qua-3-nam",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "21/07/2026", gioNhap: "17:09:13",
  },
  {
    id: 3,
    nguoiGui: "Tòa án nhân dân cấp cao tại Thành phố Hồ Chí Minh",
    diaChi: "Số 262, đường Trần Phú, Phường Hoàn Kiếm, Thành phố Hà Nội",
    maDon: "Mã 7029",
    loaiHinhThuc: "Công văn kiến nghị",
    loaiHinhThucColor: "#e67e22",
    thongTinDon: {
      soBaqd: "917", ngay: "21/07/2026", toaXetXu: "TAND cấp cao tại TP. HCM",
      thuTuc: "Tái thẩm",
      hinhThuc: "CV Kiến nghị GĐT, TT",
      soCV: "2107_1433", ngayCV: "21/07/2026",
      loaiCV: "Vụ việc giám sát Quốc hội",
      donViGui: "Tòa án nhân dân cấp cao tại Thành phố Hồ Chí Minh",
      thamPhan: "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự (Số: 545 - 21/07/2026)",
    },
    daNhan: true,
    soDon: 1,
    hinhThucTiepNhan: "Trực tuyến",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#e67e22", stl: "54682575", coVanBan: true },
    isPhanCong: true, loaiPhanCong: "ngau-nhien",
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "khong-xac-dinh",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "21/07/2026", gioNhap: "17:03:02",
  },
  {
    id: 4,
    nguoiGui: "Lê Thị Mai",
    diaChi: "Số 200, đường Lý Thường Kiệt, Phường 14, Quận 10, Thành phố Hồ Chí Minh",
    maDon: "Mã 7028",
    loaiHinhThuc: "Đơn khiếu nại",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "33/2024/KDTM-PT", ngay: "15/11/2024", toaXetXu: "TAND cấp cao tại Hà Nội",
      thuTuc: "Giám đốc thẩm + Tái thẩm",
      hinhThuc: "Đơn khiếu nại tố cáo trong tố tụng",
      soCV: "1201", ngayCV: "10/11/2024",
      loaiCV: "Đơn khiếu nại tố cáo trong tố tụng",
      donViGui: "Lê Thị Mai",
      thamPhan: "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)",
      donViGiaiQuyet: "Vụ Giám đốc kiểm tra và hình sự (Số: 1730 - 21/07/2026)",
    },
    daNhan: false,
    soDon: 1,
    hinhThucTiepNhan: "Bưu điện",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682571", coVanBan: true },
    isPhanCong: true, loaiPhanCong: "chi-dinh",
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "qua-5-nam",
    nguoiNhap: "Nguyễn Thị Lan", ngayNhap: "15/11/2024", gioNhap: "09:15:44",
  },
  {
    /* TH2: cán bộ B - đang chờ xác nhận ghép với đơn 7031 của cán bộ A */
    id: 5,
    nguoiGui: "Nguyễn Thị Hoa",
    diaChi: "Số 88, phố Bạch Mai, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội",
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
    // Phân công ngẫu nhiên + tờ trình đã được chánh án ký → đủ điều kiện lập
    // Thông báo phân công TP
    isPhanCong: true, loaiPhanCong: "ngau-nhien", toTrinhStatus: "da_ky",
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "trong-han-1-nam",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "21/07/2026", gioNhap: "14:12:05",
  },
  {
    /* TH1: cùng cán bộ - đã ghép ngay với đơn 7029 */
    id: 6,
    nguoiGui: "Trần Văn Bình",
    diaChi: "Số 45, đường Nguyễn Du, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
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
    thoiHieu: "qua-3-nam",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "14/07/2026", gioNhap: "14:05:33",
  },
  {
    id: 7,
    nguoiGui: "Văn thư Tòa án nhân dân tỉnh Bắc Ninh",
    diaChi: "Số 1, đường Hai Bà Trưng, Phường Suối Hoa, Thành phố Bắc Ninh",
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
    thoiHieu: "khong-xac-dinh",
    nguoiNhap: "",
    ngayNhap: "",
    gioNhap: "",
  },
  {
    id: 8,
    nguoiGui: "Văn thư Tòa án nhân dân tỉnh Hà Nội",
    waitingForProcessing: true,
    diaChi: "Số 2, phố Hàng Bài, Phường Tràng Tiền, Quận Hoàn Kiếm, Thành phố Hà Nội",
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
    thoiHieu: "qua-5-nam",
    nguoiNhap: "",
    ngayNhap: "",
    gioNhap: "",
  },
  {
    /* MOCK: thẩm phán nhiều đơn - đơn 2/3 của Nguyễn Như Thắng trong cùng Vụ dân sự */
    id: 9,
    nguoiGui: "Hoàng Minh Tú",
    diaChi: "Số 173, phố Tây Sơn, Phường Quang Trung, Quận Đống Đa, Thành phố Hà Nội",
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
    isPhanCong: true, loaiPhanCong: "ngau-nhien", cuaToi: true,
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "trong-han-1-nam",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "10/07/2026", gioNhap: "09:30:00",
  },
  {
    /* MOCK: thẩm phán nhiều đơn - đơn 3/3 của Nguyễn Như Thắng trong cùng Vụ dân sự */
    id: 10,
    nguoiGui: "Phạm Thị Ngọc",
    diaChi: "Thôn Đông Dư Thượng, Xã Đông Dư, Huyện Gia Lâm, Thành phố Hà Nội",
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
    isPhanCong: true, loaiPhanCong: "chi-dinh", cuaToi: true,
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "qua-3-nam",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "05/06/2025", gioNhap: "14:20:00",
  },

  // ── Dòng bổ sung: phủ đủ các trạng thái để thấy rõ tác dụng của bộ lọc ──
  {
    id: 11,
    nguoiGui: "Lê Thị Mai",
    diaChi: "Số 34, ngõ 20, phố Cát Linh, Phường Cát Linh, Quận Đống Đa, Thành phố Hà Nội",
    maDon: "Mã 7032",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "312", ngay: "05/03/2026", toaXetXu: "TAND TP. Hà Nội",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: "Lê Thị Mai",
      thamPhan: "", donViGiaiQuyet: "",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Bưu điện",
    giaiQuyet: { nhan: "Chưa đủ điều kiện", color: "#e67e22", stl: "", coVanBan: false },
    loaiAn: "Dân sự", cuaToi: true,
    thoiHieu: "khong-xac-dinh",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "05/03/2026", gioNhap: "08:12:00",
  },
  {
    id: 12,
    nguoiGui: "Công ty CP Xây dựng Thăng Long",
    diaChi: "Số 9, ngách 12/3, phố Trần Đăng Ninh, Phường Dịch Vọng, Quận Cầu Giấy, Thành phố Hà Nội",
    maDon: "Mã 7033",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "88/2025/KDTM-PT", ngay: "18/09/2025", toaXetXu: "TAND cấp cao tại Hà Nội",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: "Công ty CP Xây dựng Thăng Long",
      thamPhan: "", donViGiaiQuyet: "",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Điện tử",
    giaiQuyet: { nhan: "Chưa đủ điều kiện", color: "#e67e22", stl: "", coVanBan: false },
    loaiAn: "KDTM",
    thoiHieu: "qua-5-nam",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "20/09/2025", gioNhap: "10:45:00",
  },
  {
    id: 13,
    nguoiGui: "Trần Quốc Hùng",
    diaChi: "Số 120, đại lộ Lê Lợi, Phường Lê Lợi, Thành phố Thanh Hóa, Tỉnh Thanh Hóa",
    maDon: "Mã 7034",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "45/2024/HS-PT", ngay: "12/12/2024", toaXetXu: "TAND tỉnh Thanh Hóa",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: "Trần Quốc Hùng",
      thamPhan: "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)", donViGiaiQuyet: "Vụ Giám đốc kiểm tra về hình sự",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Trực tiếp",
    giaiQuyet: { nhan: "Đã thụ lý", color: "#1a5a96", stl: "54682600", coVanBan: true },
    loaiAn: "Hình sự", cuaToi: true, isPhanCong: true, loaiPhanCong: "chi-dinh",
    thoiHieu: "trong-han-1-nam",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "15/12/2024", gioNhap: "13:05:00",
  },
  {
    id: 14,
    nguoiGui: "Phạm Thị Hồng",
    diaChi: "Số 56, đường Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
    maDon: "Mã 7035",
    loaiHinhThuc: "Đơn khiếu nại",
    loaiHinhThucColor: "#c0392b",
    thongTinDon: {
      soBaqd: "17/2023/DS-ST", ngay: "03/04/2023", toaXetXu: "TAND TP. Đà Nẵng",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn khiếu nại tố cáo trong tố tụng",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: "Phạm Thị Hồng",
      thamPhan: "", donViGiaiQuyet: "",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Tiếp công dân",
    giaiQuyet: { nhan: "Đã thụ lý", color: "#1a5a96", stl: "54682601", coVanBan: true },
    loaiAn: "Dân sự",
    thoiHieu: "qua-3-nam",
    nguoiNhap: "Nguyễn Thị Lan", ngayNhap: "10/04/2023", gioNhap: "15:40:00",
  },
  {
    id: 15,
    nguoiGui: "Tòa án nhân dân tỉnh Nghệ An",
    diaChi: "Số 3, đường Nguyễn Thị Minh Khai, Phường Hưng Bình, Thành phố Vinh, Tỉnh Nghệ An",
    maDon: "Mã 7036",
    loaiHinhThuc: "Công văn kiến nghị",
    loaiHinhThucColor: "#e67e22",
    thongTinDon: {
      soBaqd: "BA_0902", ngay: "09/02/2024", toaXetXu: "TAND tỉnh Nghệ An",
      thuTuc: "Giám đốc thẩm", hinhThuc: "CV Kiến nghị GĐT, TT",
      soCV: "0902", ngayCV: "09/02/2024", loaiCV: "Công văn kiến nghị",
      donViGui: "Tòa án nhân dân tỉnh Nghệ An",
      thamPhan: "", donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Nội bộ",
    giaiQuyet: { nhan: "Trả lại đơn", color: "#2980b9", stl: "", coVanBan: false },
    loaiAn: "Hành chính", thongTinChuyenDon: "Tòa khác",
    thoiHieu: "khong-xac-dinh",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "12/02/2024", gioNhap: "09:00:00",
  },
  {
    id: 16,
    nguoiGui: "Hoàng Văn Thịnh",
    diaChi: "Số 41, đường Nguyễn Huệ, Phường Vĩnh Ninh, Quận Thuận Hóa, Thành phố Huế",
    maDon: "Mã 7037",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "62/2021/LĐ-PT", ngay: "22/08/2021", toaXetXu: "TAND TP. Huế",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: "Hoàng Văn Thịnh",
      thamPhan: "", donViGiaiQuyet: "",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Bưu điện",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682602", coVanBan: true },
    loaiAn: "Lao động", hetThoiHanKhangNghi: true,
    // Cán bộ khác nhưng trùng tên với "Vũ Văn Yên" ở các đơn còn lại
    thoiHieu: "qua-5-nam",
    nguoiNhap: "Vũ Văn Yên", nguoiNhapNgaySinh: "30/11/1992",
    ngayNhap: "25/08/2021", gioNhap: "11:20:00",
    soHieuDon: "2021-LD-0062", ngayTrenDon: "20/08/2021",
    nguoiDungDon: "Hoàng Văn Thịnh",
    ghiChu: "Đơn gửi kèm bản sao bản án phúc thẩm",
  },
  {
    id: 17,
    nguoiGui: "Nguyễn Thị Bích Ngọc",
    diaChi: "Số 78, đường Hai Bà Trưng, Phường Tân Định, Quận 1, Thành phố Hồ Chí Minh",
    maDon: "Mã 7038",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "104/2020/HN-PT", ngay: "14/05/2020", toaXetXu: "TAND cấp cao tại TP. HCM",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: "Nguyễn Thị Bích Ngọc",
      thamPhan: "", donViGiaiQuyet: "",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Điện tử",
    giaiQuyet: { nhan: "Đã thụ lý", color: "#1a5a96", stl: "54682603", coVanBan: true },
    loaiAn: "HN-GĐ", hetThoiHanKhangNghi: true, cuaToi: true,
    thoiHieu: "qua-3-nam",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "20/05/2020", gioNhap: "16:00:00",
  },
  {
    id: 18,
    nguoiGui: "Đỗ Minh Khang",
    diaChi: "Số 15, đường Hùng Vương, Phường 2, Thành phố Tân An, Tỉnh Long An",
    maDon: "Mã 7039",
    loaiHinhThuc: "Đơn hành chính",
    loaiHinhThucColor: "#16a085",
    thongTinDon: {
      soBaqd: "29/2026/HC-ST", ngay: "11/01/2026", toaXetXu: "TAND tỉnh Long An",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: "Đỗ Minh Khang",
      thamPhan: "", donViGiaiQuyet: "",
    },
    daNhan: false, soDon: 1, hinhThucTiepNhan: "Trực tuyến",
    giaiQuyet: { nhan: "Chưa đủ điều kiện", color: "#e67e22", stl: "", coVanBan: false },
    loaiAn: "Hành chính",
    thoiHieu: "qua-3-nam",
    nguoiNhap: "Nguyễn Thị Lan", ngayNhap: "15/01/2026", gioNhap: "07:55:00",
  },
  {
    id: 19,
    nguoiGui: "Vũ Đình Nam",
    diaChi: "Số 18, đường Nguyễn Huệ, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
    maDon: "Mã 7040",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "77/2025/DS-PT", ngay: "30/06/2025", toaXetXu: "TAND cấp cao tại Đà Nẵng",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: "Vũ Đình Nam",
      thamPhan: "", donViGiaiQuyet: "",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Trực tiếp",
    giaiQuyet: { nhan: "Trả lại đơn", color: "#2980b9", stl: "", coVanBan: false },
    loaiAn: "Dân sự", cuaToi: true, thongTinChuyenDon: "Ngoài tòa án",
    thoiHieu: "khong-xac-dinh",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "02/07/2025", gioNhap: "10:10:00",
  },
  {
    id: 20,
    nguoiGui: "Bùi Thanh Sơn",
    diaChi: "Số 62, đường Lạch Tray, Phường Đằng Giang, Quận Ngô Quyền, Thành phố Hải Phòng",
    maDon: "Mã 7041",
    loaiHinhThuc: "Đơn khiếu nại",
    loaiHinhThucColor: "#c0392b",
    thongTinDon: {
      soBaqd: "51/2022/HS-ST", ngay: "07/10/2022", toaXetXu: "TAND TP. Hải Phòng",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn khiếu nại tố cáo trong tố tụng",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: "Bùi Thanh Sơn",
      thamPhan: "", donViGiaiQuyet: "",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Tiếp công dân",
    giaiQuyet: { nhan: "Chưa đủ điều kiện", color: "#e67e22", stl: "", coVanBan: false },
    loaiAn: "Hình sự",
    thoiHieu: "qua-5-nam",
    nguoiNhap: "Nguyễn Thị Lan", ngayNhap: "10/10/2022", gioNhap: "14:35:00",
  },
  // ── 3 đơn đang ở tab "Chờ ý kiến LĐ" (màn Nhận đơn và TL vụ án) ──
  // Cột Thông tin giải quyết của các đơn này lấy theo kết luận của Lãnh đạo,
  // giá trị trong giaiQuyet.nhan chỉ là trạng thái ban đầu.
  {
    id: 21,
    nguoiGui: "Đỗ Tất Đạt",
    diaChi: "Số 210, đường Trần Phú, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
    maDon: "Mã 4984",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "HKTT_0506_05", ngay: "04/06/2026", toaXetXu: "TAND khu vực 7 - Đà Nẵng",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "31", ngayCV: "05/06/2026", loaiCV: "Công văn chuyển đơn",
      donViGui: "Đỗ Tất Đạt", thamPhan: "Đỗ Tất Thống",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Trực tiếp",
    giaiQuyet: { nhan: CHO_Y_KIEN_LD, color: MAU_KET_LUAN_LD[CHO_Y_KIEN_LD], stl: "", coVanBan: false },
    loaiAn: "Hình sự", choYKienLD: "4984",
    thoiHieu: "trong-han-1-nam",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "05/06/2026", gioNhap: "09:12:00",
  },
  {
    id: 22,
    nguoiGui: "Đỗ Tất Đạt",
    diaChi: "Số 77, đường Lê Duẩn, Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
    maDon: "Mã 4985",
    loaiHinhThuc: "Đơn báo phát hiện vi phạm PL",
    loaiHinhThucColor: "#e67e22",
    thongTinDon: {
      soBaqd: "HKTT_0506_05", ngay: "04/06/2026", toaXetXu: "TAND khu vực 7 - Đà Nẵng",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn báo phát hiện vi phạm PL",
      soCV: "31", ngayCV: "05/06/2026", loaiCV: "Công văn chuyển đơn",
      donViGui: "Đỗ Tất Đạt", thamPhan: "Đỗ Tất Thống",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Bưu điện",
    giaiQuyet: { nhan: CHO_Y_KIEN_LD, color: MAU_KET_LUAN_LD[CHO_Y_KIEN_LD], stl: "", coVanBan: false },
    loaiAn: "Hình sự", choYKienLD: "4985",
    thoiHieu: "qua-3-nam",
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "05/06/2026", gioNhap: "09:20:00",
  },
  {
    id: 23,
    nguoiGui: "Phạm Văn Tú",
    diaChi: "Số 30, đường Lê Công Thanh, Phường Châu Sơn, Thành phố Phủ Lý, Tỉnh Hà Nam",
    maDon: "Mã 5012",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "HKTT_1006_01", ngay: "08/06/2026", toaXetXu: "TAND tỉnh Hà Nam",
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "44", ngayCV: "10/06/2026", loaiCV: "Công văn chuyển đơn",
      donViGui: "Phạm Văn Tú", thamPhan: "Lê Thị Hoa",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Trực tiếp",
    giaiQuyet: { nhan: CHO_Y_KIEN_LD, color: MAU_KET_LUAN_LD[CHO_Y_KIEN_LD], stl: "", coVanBan: false },
    loaiAn: "Hình sự", choYKienLD: "5012",
    thoiHieu: "khong-xac-dinh",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "10/06/2026", gioNhap: "16:05:00",
  },
];

// ─── Bộ lọc Danh sách đơn: helper + luật nghiệp vụ ───────────────────────────

// Mỗi Loại văn bản chỉ áp được cho đơn ở một số trạng thái nhất định.
// Loại nào KHÔNG có trong bảng này thì không ràng buộc trạng thái.
// Thêm luật mới = thêm 1 dòng ở đây, không phải sửa logic lọc.
const LOAI_VB_TRANG_THAI: Record<string, string[]> = {
  "Yêu cầu bổ sung": ["Chưa đủ điều kiện"],
};

// Điều kiện để một đơn được đưa vào văn bản (tờ trình, công văn...).
// Trả về LÝ DO nếu không hợp lệ, null nếu hợp lệ.
// Muốn đổi luật thì sửa đúng hàm này, UI tự bám theo.
const lyDoKhongHopLe = (r: DanhSachDonRow): string | null => {
  if (r.toTrinhStatus === "trinh_lanh_dao") return "Đã nằm trong tờ trình đang trình lãnh đạo";
  if (r.toTrinhStatus === "da_ky") return "Đã nằm trong tờ trình đã ký";
  const tt = r.giaiQuyet?.nhan ?? "";
  if (tt === "Chưa đủ điều kiện") return "Đơn chưa đủ điều kiện";
  if (tt === "Trả lại đơn") return "Đơn đã trả lại";
  if (!tt) return "Đơn chưa có trạng thái giải quyết";
  return null;
};

// Các lựa chọn của ô lọc "Loại văn bản" trên action bar Danh sách đơn
const LOAI_VAN_BAN_FILTER = [
  "Giấy xác nhận",
  "Giấy xác nhận cơ quan chuyển đơn",
  "Công văn chuyển đơn",
  "Công văn chuyển nội bộ",
  "Công văn chuyển tòa khác",
  "Công văn chuyển ngoài",
  "Trả lại đơn",
  "Tờ trình phân công Thẩm phán",
  "Tờ trình khác",
  "Thông báo phân công TP",
  "Yêu cầu bổ sung",
];

// Màn Danh sách đơn viết tắt cho gọn cột; dữ liệu gốc giữ nguyên chữ đầy đủ
const vietTatTAND = (v?: string) => (v ?? "").replace(/Tòa án nhân dân/gi, "TAND");

const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const contains = (haystack: unknown, needle: string) => norm(haystack).includes(norm(needle));

// Dữ liệu lưu "dd/mm/yyyy"; <input type="date"> trả "yyyy-mm-dd".
const parseVNDate = (s?: string): Date | null => {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((s ?? "").trim());
  return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
};
const parseISODate = (s?: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((s ?? "").trim());
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};
// Khoảng rỗng = không lọc. Có khoảng nhưng ngày không đọc được = loại.
const inDateRange = (value: string | undefined, from: string, to: string) => {
  const f = parseISODate(from), t = parseISODate(to);
  if (!f && !t) return true;
  const d = parseVNDate(value);
  if (!d) return false;
  if (f && d < f) return false;
  if (t && d > t) return false;
  return true;
};

// Tab → điều kiện. Thứ tự khớp mảng `tabs`.
const TAB_MATCH: ((r: DanhSachDonRow) => boolean)[] = [
  () => true,                                                                      // Tổng số
  r => !!r.cuaToi,                                                                 // Đơn của tôi
  r => r.giaiQuyet?.nhan === "Đã thụ lý",                                          // Đơn Thụ lý
  r => r.giaiQuyet?.nhan === "Chưa đủ điều kiện",                                  // Chưa đủ điều kiện
  r => r.thoiHieu === "qua-3-nam" || r.thoiHieu === "qua-5-nam",                   // Hết thời hạn kháng nghị
  r => !["Thụ lý mới", "Đã thụ lý", "Chưa đủ điều kiện"].includes(r.giaiQuyet?.nhan ?? ""), // Khác
];

// ─── Filter primitives (compact, 12px) ───────────────────────────────────────
// Ô lọc đang có giá trị được tô nền xanh rất nhạt + viền đậm hơn, để nhìn lướt
// là biết đang tìm kiếm theo những ô nào (kể cả khi panel nâng cao có 30+ ô).
const oLoc = (v: unknown) =>
  v !== undefined && v !== null && v !== ""
    ? "border-[#7aa7d9] bg-[#eff6fd]"
    : "border-[#ccc] bg-white";

const FInp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full h-[30px] px-2 text-[12px] border rounded-[3px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#aaa] transition-colors ${oLoc(props.value)} ${props.className ?? ""}`} />
);
const FSel = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const { ref, hienX, xoa } = useXoaChon(props.value);
  return (
    <div className="relative">
      <select ref={ref} {...props}
        className={`w-full h-[30px] px-2 ${hienX ? "pr-11" : "pr-6"} text-[12px] border rounded-[3px] focus:outline-none appearance-none transition-colors ${oLoc(props.value)}`}>
        {children}
      </select>
      {hienX && <NutXoaChon onClick={xoa} right="right-5" size={11} />}
      <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
    </div>
  );
};
const FLbl = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[12px] font-medium text-[#333] mb-[3px] whitespace-nowrap">{children}</label>
);
// Date range: "Từ ngày → Đến ngày" with calendar icon
const FDateRange = ({ from, to, onFrom, onTo }: {
  from?: string; to?: string; onFrom?: (v: string) => void; onTo?: (v: string) => void;
}) => (
  <div className="flex items-center gap-1">
    <input type="date" value={from ?? ""} onChange={e => onFrom?.(e.target.value)}
      className={`flex-1 min-w-0 h-[30px] px-1.5 text-[12px] border rounded-[3px] focus:outline-none focus:border-[#1a73e8] transition-colors ${oLoc(from)}`} />
    <span className="text-[#aaa] text-[11px] flex-shrink-0">→</span>
    <input type="date" value={to ?? ""} onChange={e => onTo?.(e.target.value)}
      className={`flex-1 min-w-0 h-[30px] px-1.5 text-[12px] border rounded-[3px] focus:outline-none focus:border-[#1a73e8] transition-colors ${oLoc(to)}`} />
  </div>
);
// Hình thức đơn — dùng chung cho ô lọc cơ bản, ô lọc nâng cao và form thêm mới
const HINH_THUC_DON_NHOM: { label: string; items: string[]; danhSo?: boolean }[] = [
  {
    label: "— Đơn", danhSo: true,
    items: [
      "Đơn đề nghị GĐT-TT",
      "Đơn khiếu nại tố cáo trong tố tụng",
      "Thông báo phát hiện vi phạm pháp luật",
      "Đơn khác",
    ],
  },
  {
    label: "— Công văn", danhSo: true,
    items: [
      "CV kiến nghị GĐT-TT",
      "CV chuyển đơn",
      "CV chuyển kiến nghị GĐT-TT",
      "CV khác",
    ],
  },
  { label: "— Tài liệu", items: ["Tài liệu chứng cứ"] },
];

// Render optgroup cho select "Hình thức đơn"
const optionsHinhThucDon = () =>
  HINH_THUC_DON_NHOM.map(g => (
    <optgroup key={g.label} label={g.label}>
      {g.items.map((o, i) => (
        <option key={o} value={o}>{g.danhSo ? `${i + 1}. ${o}` : o}</option>
      ))}
    </optgroup>
  ));

const optionsHinhThucDonPhanCong = () =>
  HINH_THUC_DON_NHOM.map(g => {
    const items = g.items.filter(o => !["Đơn khác", "CV khác", "Tài liệu chứng cứ"].includes(o));
    if (items.length === 0) return null;
    return (
      <optgroup key={g.label} label={g.label}>
        {items.map((o, i) => (
          <option key={o} value={o}>{g.danhSo ? `${i + 1}. ${o}` : o}</option>
        ))}
      </optgroup>
    );
  }).filter(Boolean);

// Dữ liệu ghi "GĐT, TT" còn danh mục ghi "GĐT-TT" → so sánh sau khi bỏ dấu câu
const chuanHoaHinhThuc = (v: unknown) =>
  String(v ?? "").toLowerCase().replace(/[\s,./-]+/g, "");

// Loại công văn — 4 mục lẻ ở đầu, sau đó 2 nhóm
const LOAI_CONG_VAN_LE = [
  "Công văn chuyển",
  "Công văn đề nghị",
  "Công văn kiến nghị",
  "Công văn nhắc lại",
];
const LOAI_CONG_VAN_NHOM: { label: string; items: string[] }[] = [
  {
    label: "— Công văn 9.3",
    items: [
      "Lãnh đạo Đảng, Nhà nước, Mặt trận Tổ quốc Việt Nam; các Ủy viên Bộ Chính trị, Ban Bí thư",
      "Các Phó Chủ tịch nước, Phó Chủ tịch Quốc hội; Phó Thủ tướng Chính phủ",
      "Trưởng các Ban Đảng",
      "Các kiến nghị GĐT, TT của Đại biểu Quốc hội",
      "Các kiến nghị GĐT, TT của Đoàn Đại biểu Quốc hội",
      "Các kiến nghị GĐT, TT của các cơ quan của Quốc hội",
      "Các kiến nghị GĐT, TT của Ủy ban Tư pháp của Quốc hội",
    ],
  },
  {
    label: "— Các vụ việc khác thuộc mục 8.1",
    items: [
      "Văn bản chuyển đơn và yêu cầu thông báo kết quả của Đoàn Đại biểu Quốc hội",
      "Văn bản chuyển đơn và yêu cầu thông báo kết quả của Đại biểu Quốc hội",
      "Văn bản chuyển đơn và yêu cầu thông báo kết quả của các cơ quan của Quốc hội",
      "Vụ việc có văn bản của lão thành cách mạng, nhân sĩ, trí thức",
      "Vụ việc có văn bản kiến nghị xem xét lại của Văn phòng Chính phủ, Tỉnh ủy, UBND tỉnh, các cơ quan báo chí",
      "Vụ việc có văn bản của các đồng chí nguyên là lãnh đạo Đảng, Nhà nước",
      "Vụ việc có giám sát Quốc hội",
      "Các loại khác",
    ],
  },
];

// Dữ liệu bì thư lấy từ hệ thống bưu chính — nhập mã bì thư là tự điền phần còn lại
const KHO_BI_THU: Record<string, { ngayDau: string; nguoiGui: string; sdt: string; diaChi: string }> = {
  "BT2026001": { ngayDau: "2026-07-18", nguoiGui: "Nguyễn Văn An", sdt: "0912345678", diaChi: "Số 12 Lê Duẩn, Phường Cửa Nam, Thành phố Hà Nội" },
  "BT2026002": { ngayDau: "2026-07-20", nguoiGui: "Trần Thị Bình", sdt: "0987654321", diaChi: "45 Trần Hưng Đạo, Phường Bến Nghé, Thành phố Hồ Chí Minh" },
  "BT2026003": { ngayDau: "2026-07-21", nguoiGui: "Công ty TNHH Minh Đức", sdt: "02363812345", diaChi: "18 Nguyễn Huệ, Phường Hải Châu, Thành phố Đà Nẵng" },
  "BT2026004": { ngayDau: "2026-07-25", nguoiGui: "Lê Thị Mai", sdt: "0934567890", diaChi: "Phường Cát Linh, Thành phố Hà Nội" },
};

// Tỉnh/TP cho ô "Địa chỉ gửi đơn" ở bộ lọc nâng cao
const TINH_TP = [
  "Thành phố Hà Nội", "Thành phố Hồ Chí Minh", "Thành phố Hải Phòng",
  "Thành phố Đà Nẵng", "Thành phố Huế", "Thành phố Cần Thơ",
  "Tỉnh Bắc Ninh", "Tỉnh Bắc Giang", "Tỉnh Thanh Hóa", "Tỉnh Nghệ An",
  "Tỉnh Hà Giang", "Tỉnh Long An", "Tỉnh Vĩnh Phúc", "Tỉnh Hà Nam",
];

// ─── Primitive cho panel "Bộ lọc nâng cao" (nhãn trái / ô phải, dày) ────────
// min-h cố định + nhãn 1 dòng để các cột luôn ngang hàng nhau
const TRow = ({ label, bold, children }: { label?: string; bold?: boolean; children?: React.ReactNode }) => (
  <div className="grid grid-cols-[146px_1fr] items-center gap-2 py-[2px] min-h-[30px]">
    <label className={`text-[12px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis ${bold ? "font-semibold text-[#222]" : "text-[#444]"}`}
      title={label}>{label}</label>
    <div>{children}</div>
  </div>
);
const TInp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props}
    className={`w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors ${oLoc(props.value)} ${props.className ?? ""}`} />
);
const TSel = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const { ref, hienX, xoa } = useXoaChon(props.value);
  return (
    <div className="relative">
      <select ref={ref} {...props}
        className={`w-full h-[26px] pl-2 ${hienX ? "pr-11" : "pr-6"} text-[12px] border rounded-[2px] appearance-none focus:outline-none focus:border-[#1a73e8] transition-colors ${oLoc(props.value)}`}>
        {children}
      </select>
      {hienX && <NutXoaChon onClick={xoa} right="right-5" size={11} />}
      <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
    </div>
  );
};
const TDate = ({ value, onChange }: { value?: string; onChange?: (v: string) => void }) => (
  <input type="date" value={value ?? ""} onChange={e => onChange?.(e.target.value)}
    className={`w-full h-[26px] px-1.5 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] transition-colors ${oLoc(value)}`} />
);

// Single date with calendar placeholder
const FDate = () => (
  <input type="date" className="w-full h-[30px] px-2 text-[12px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8]" />
);

// ─── Hồ sơ kháng nghị: kết quả xét xử ────────────────────────────────────────
const KET_QUA_KHANG_NGHI = [
  "Không chấp nhận kháng nghị",
  "Sửa toàn bộ bản án, quyết định của Tòa án đã có hiệu lực pháp luật",
  "Sửa một phần bản án, quyết định của Tòa án đã có hiệu lực pháp luật",
  "Sửa phần bồi thường thiệt hại",
  "Sửa phần hình phạt",
  "Sửa khác",
  "Hủy bản án, quyết định có hiệu lực pháp luật để xét xử lại theo thủ tục sơ thẩm",
];

// Băm nhỏ để random "ổn định": cùng một đơn luôn ra cùng kết quả, không nhảy
// lung tung mỗi lần bảng render lại (lọc, chọn dòng, mở popup...).
const hashId = (n: number) => {
  let h = (n ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
};

// Quyết định kháng nghị GĐT/TT chỉ do Chánh án TANDTC hoặc Viện trưởng VKSNDTC
// ra và gửi kèm hồ sơ vụ án → cột "người gửi" của màn Hồ sơ kháng nghị lấy theo
// 2 chức danh này (kèm nơi nhận chéo giữa hai cơ quan).
const DON_VI_KHANG_NGHI = [
  {
    ten: "Chánh án Tòa án nhân dân tối cao",
    diaChi: "Số 48 Lý Thường Kiệt, Phường Hoàn Kiếm, TP. Hà Nội",
    noiNhan: "Viện kiểm sát nhân dân tối cao",
  },
  {
    ten: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    diaChi: "Số 9 Phạm Văn Bạch, Phường Yên Hòa, TP. Hà Nội",
    noiNhan: "Tòa án nhân dân tối cao",
  },
];

const donViKhangNghi = (id: number) => DON_VI_KHANG_NGHI[hashId(id * 104729 + 11) % DON_VI_KHANG_NGHI.length];

const ketQuaKhangNghi = (id: number) => {
  const daXetXu = hashId(id) % 3 !== 0;
  return {
    trangThai: daXetXu ? "Đã xét xử" : "Đang xét xử",
    ketQua: daXetXu ? KET_QUA_KHANG_NGHI[hashId(id * 7919 + 3) % KET_QUA_KHANG_NGHI.length] : "",
  };
};

// ─── Tiến độ trình ký văn bản ────────────────────────────────────────────────
// Văn bản của đơn đi qua 4 bước cố định. Cột "Thông tin giải quyết" chỉ hiện
// KẾT QUẢ cuối cùng, chi tiết từng bước xem trong popup.
type BuocTrangThai = "xong" | "dang" | "cho" | "tuchoi";

interface BuocTrinhKy {
  ten: string;
  vaiTro: string;
  nguoi: string;
  thoiGian?: string;
  trangThai: BuocTrangThai;
  ghiChu?: string;
}

interface TienDoTrinhKy {
  ketQua: string;                 // nhãn hiển thị ngoài danh sách
  cls: string;                    // màu badge
  soVanBan?: string;
  buocs: BuocTrinhKy[];
}

const CAC_BUOC_TRINH_KY = [
  { ten: "Soạn thảo văn bản", vaiTro: "Cán bộ thụ lý" },
  { ten: "Trưởng phòng duyệt", vaiTro: "Trưởng phòng" },
  { ten: "Lãnh đạo ký", vaiTro: "Lãnh đạo" },
  { ten: "Văn thư lấy số, phát hành", vaiTro: "Văn thư" },
];

// Người ký là 1 trong 4 chức danh — nhãn ngoài danh sách ghi rõ đang chờ ai,
// không gộp chung thành "Chờ lãnh đạo ký".
const LANH_DAO_KY = [
  { chucDanh: "Chánh Văn phòng", ten: "Hoàng Kim Long" },
  { chucDanh: "Phó Chánh Văn phòng", ten: "Nguyễn Minh An" },
  { chucDanh: "Chánh án", ten: "Trịnh Minh Khôi" },
  { chucDanh: "Phó Chánh án", ten: "Đặng Quốc Hùng" },
];
const TRUONG_PHONG_DUYET = ["Bùi Ngọc Lâm (TP)", "Lê Thị C (Phó phòng)"];

// Cộng thêm số ngày vào chuỗi dd/mm/yyyy — chỉ để mock mốc thời gian từng bước
const congNgay = (ngay: string, them: number) => {
  const [d, m, y] = (ngay || "").split("/").map(Number);
  if (!d || !m || !y) return "";
  const t = new Date(y, m - 1, d + them);
  return `${String(t.getDate()).padStart(2, "0")}/${String(t.getMonth() + 1).padStart(2, "0")}/${t.getFullYear()}`;
};

const KET_QUA_TRINH_KY: Record<string, { nhan: string; cls: string }> = {
  "chua-trinh":   { nhan: "Chưa trình ký",        cls: "bg-[#f5f5f5] text-[#666] border-[#d5d5d5]" },
  "cho-tp":       { nhan: "Chờ trưởng phòng duyệt", cls: "bg-[#eaf4ff] text-[#1a5a96] border-[#c5d8f8]" },
  // nhãn được thay bằng "Chờ <chức danh> ký" khi dựng tiến độ
  "cho-ky":       { nhan: "Chờ ký",               cls: "bg-[#fff3cd] text-[#856404] border-[#ffecb5]" },
  "cho-so":       { nhan: "Đã ký, chờ lấy số",    cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]" },
  "phat-hanh":    { nhan: "Đã phát hành",         cls: "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]" },
  "tra-lai":      { nhan: "Bị trả lại để chỉnh sửa", cls: "bg-[#fdecea] text-[#c0392b] border-[#e6a5a0]" },
};

// Suy ra tiến độ từ trạng thái tờ trình của đơn; phần còn lại băm theo id cho đa
// dạng nhưng ổn định (không nhảy mỗi lần render).
const tienDoTrinhKy = (row: DanhSachDonRow): TienDoTrinhKy => {
  const h = hashId(row.id);
  const key =
    row.toTrinhStatus === "da_ky" ? (h % 2 === 0 ? "phat-hanh" : "cho-so")
      : row.toTrinhStatus === "trinh_lanh_dao" ? "cho-ky"
        : ["chua-trinh", "cho-tp", "tra-lai", "phat-hanh"][h % 4];

  const kq = KET_QUA_TRINH_KY[key];
  const nguoiSoan = row.nguoiNhap || "Cán bộ thụ lý";
  const tp = TRUONG_PHONG_DUYET[h % TRUONG_PHONG_DUYET.length];
  const ld = LANH_DAO_KY[hashId(row.id * 131 + 17) % LANH_DAO_KY.length];
  const t0 = row.ngayNhap;

  // Bước cuối cùng đã hoàn thành, tính theo kết quả
  const soBuocXong = { "chua-trinh": 0, "cho-tp": 1, "tra-lai": 1, "cho-ky": 2, "cho-so": 3, "phat-hanh": 4 }[key] ?? 0;

  const buocs: BuocTrinhKy[] = CAC_BUOC_TRINH_KY.map((b, i) => {
    const nguoi = [nguoiSoan, tp, ld.ten, "Phòng Văn thư"][i];
    // Bước ký hiển thị đúng chức danh người ký thay vì "Lãnh đạo" chung chung
    const vaiTro = i === 2 ? ld.chucDanh : b.vaiTro;
    let trangThai: BuocTrangThai =
      i < soBuocXong ? "xong" : i === soBuocXong ? "dang" : "cho";
    let ghiChu: string | undefined;

    if (key === "tra-lai" && i === 1) {
      trangThai = "tuchoi";
      ghiChu = "Trả lại: thiếu căn cứ pháp lý, đề nghị bổ sung trước khi trình lại";
    }
    if (key === "chua-trinh" && i === 0) ghiChu = "Đang soạn thảo, chưa gửi duyệt";

    return {
      ...b,
      vaiTro,
      nguoi,
      thoiGian: trangThai === "xong" || trangThai === "tuchoi" ? congNgay(t0, i + 1) : undefined,
      trangThai,
      ghiChu,
    };
  });

  return {
    ketQua: key === "cho-ky" ? `Chờ ${ld.chucDanh} ký` : kq.nhan,
    cls: kq.cls,
    soVanBan: key === "phat-hanh" ? `${1200 + (h % 800)}/TANDTC-VP` : undefined,
    buocs,
  };
};

// ─── Nhận đơn và TL vụ án (module Quản lý án GĐT/TT) ─────────────────────────
interface YKienLD { ketQua: string; nguoi: string; chucVu: string; ngayDuyet: string }

interface DonGDTRow {
  id: number;
  // Cột "Thông tin đơn" — đơn thường dùng maDon, hồ sơ kháng nghị dùng maVanThuDen
  maDon?: string;
  maVanThuDen?: string;
  soHSKN?: string;
  thuLyXetXu?: string;
  cvChuyen?: string;
  thuLyMoi?: string;
  daThuLy?: boolean;
  thamPhan: string;
  thamPhanDuKien?: boolean;
  hinhThuc: string;
  nhan: string[];
  // Cột "Đương sự"
  nguoiKhieuNai?: string;
  biCao?: string;
  ndd?: string;
  nguoiKhangNghi?: string;
  // Cột "Thông tin BA/QĐ"
  soBA?: string;
  ngayBA?: string;
  toaBA?: string;
  capXetXu?: string;
  // Cột 5 — tùy tab: vụ án / hồ sơ / ý kiến lãnh đạo
  maVuAn?: string;
  tenVuAn?: string;
  ttv?: string;
  moVuAn?: boolean;              // hiển thị mờ (tab Chưa có vụ án)
  maHS?: string;
  trangThaiHS?: string;
  yKien?: YKienLD[];
  tbgq?: { so: string; ttv: string; tp: string };
  thaoTacVuAn?: ("ghep" | "them" | "chuyen" | "huyghep" | "ghepHS" | "themHS")[];
  // Cột "Thông tin nhận/trả"
  nhanTra?: { nhan?: string; nguoiTra?: string; ngayTra?: string; nguoiThaoTac?: string; ngayThaoTac?: string };
}

const NHAN_MAU: Record<string, string> = {
  "Án chỉ đạo": "bg-[#fff8e1] text-[#8a6d00] border-[#f0d98a]",
  "Án tử hình": "bg-[#c0392b] text-white border-[#a5281c]",
  "Án QH": "bg-[#eef3fb] text-[#2c5aa0] border-[#c3d5ef]",
  "Trong hạn 1 năm": "bg-[#e8f5e9] text-[#1b5e20] border-[#a5d6a7]",
};
const nhanMau = (n: string) => NHAN_MAU[n] ?? "bg-[#fdecea] text-[#c0392b] border-[#f3c0bb]";

// Vài đơn dùng lại ở nhiều tab nên tách sẵn phần chung
const DON_4984 = {
  cvChuyen: "31 - 05/06/2026", thuLyMoi: "2329241", thamPhan: "Đỗ Tất Thống",
  hinhThuc: "Đơn đề nghị GĐT/TT", nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào",
  soBA: "HKTT_0506_05", ngayBA: "04/06/2026", capXetXu: "Sơ thẩm",
};
const VU_AN_681 = {
  maVuAn: "VA26-000681",
  tenVuAn: "Vụ án Đỗ Bị can một - Tội cố ý gây thương tích",
};

const DU_LIEU_TAB: Record<string, DonGDTRow[]> = {
  // ── Tất cả ──
  "Tất cả": [
    { id: 1, maDon: "4984", ...DON_4984, ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Án QH", "Quá TH 5 năm"],
      maVuAn: "VA26-002012", ttv: "Nguyễn Văn A",
      tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích hoặc gây hại cho sức khoẻ người khác" },
    { id: 2, maDon: "4985", ...DON_4984, hinhThuc: "Đơn báo phát hiện vi phạm PL", ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      maVuAn: "VA26-002012", ttv: "Nguyễn Ngọc B",
      tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích" },
    { id: 3, maDon: "4984", ...DON_4984, cvChuyen: undefined, thuLyMoi: undefined, daThuLy: true,
      ndd: "Võ Hoài Trâm", toaBA: "Tòa án nhân dân khu vực 5 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Quá TH 3 năm"] },
    { id: 4, maDon: "4956", cvChuyen: "18 - 05/06/2026", thuLyMoi: "2329180", thamPhan: "Đỗ Tất Thống",
      hinhThuc: "Đơn khiếu nại tư pháp tố tụng", nhan: [],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", ndd: "DANH THỊ SÁ RON",
      soBA: "HKTT_0506_05", ngayBA: "01/06/2026", toaBA: "Tòa án nhân dân khu vực 1 - Cần Thơ",
      capXetXu: "Sơ thẩm", thaoTacVuAn: ["ghep", "them"] },
    { id: 5, maDon: "4943", cvChuyen: "12 - 04/06/2026", thuLyMoi: "2329155", thamPhan: "Nguyễn Như Thắng",
      hinhThuc: "Đơn đề nghị GĐT/TT", nhan: ["Án QH"],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", ndd: "Võ Hoài Trâm",
      soBA: "99", ngayBA: "28/05/2026", toaBA: "Tòa án nhân dân khu vực 3 - Hà Nội",
      capXetXu: "Phúc thẩm", thaoTacVuAn: ["ghep", "them"] },
  ],

  // ── Chờ ý kiến LĐ: cột 5 là Ý kiến lãnh đạo ──
  "Chờ ý kiến LĐ": [
    { id: 1, maDon: "4984", ...DON_4984, ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Án QH", "Quá TH 5 năm"],
      yKien: [
        { ketQua: "Không thụ lý", nguoi: "Nguyễn Thị Bình", chucVu: "Vụ trưởng", ngayDuyet: "10/07/2026" },
        { ketQua: "Không thụ lý", nguoi: "Nguyễn Văn Tiến", chucVu: "Phó CA", ngayDuyet: "10/07/2026" },
      ] },
    { id: 2, maDon: "4985", ...DON_4984, hinhThuc: "Đơn báo phát hiện vi phạm PL", ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      yKien: [
        { ketQua: "Thụy mới", nguoi: "Nguyễn Thị Bình", chucVu: "Vụ trưởng", ngayDuyet: "10/07/2026" },
        { ketQua: "Không thụ lý", nguoi: "Nguyễn Văn Tiến", chucVu: "Phó CA", ngayDuyet: "10/07/2026" },
      ] },
    { id: 3, maDon: "5012", cvChuyen: "44 - 10/06/2026", thuLyMoi: "2330012", thamPhan: "Lê Thị Hoa",
      hinhThuc: "Đơn đề nghị GĐT/TT", nhan: ["Án chỉ đạo"],
      nguoiKhieuNai: "Phạm Văn Tú", biCao: "Hoàng Thị Minh", ndd: "Nguyễn Quốc Bảo",
      soBA: "HKTT_1006_01", ngayBA: "08/06/2026", toaBA: "Tòa án nhân dân tỉnh Hà Nam",
      capXetXu: "Phúc thẩm",
      yKien: [{ ketQua: "Không thụ lý", nguoi: "Nguyễn Thị Bình", chucVu: "Vụ trưởng", ngayDuyet: "12/07/2026" }] },
  ],

  // ── Chưa có vụ án: thẩm phán là dự kiến, vụ án hiển thị mờ ──
  "Chưa có vụ án": [
    { id: 1, maDon: "4984", ...DON_4984, thamPhanDuKien: true, ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Án QH", "Quá TH 5 năm"],
      maVuAn: "VA26-002012", ttv: "Nguyễn Văn A", moVuAn: true,
      tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích hoặc gây hại cho sức khoẻ người khác" },
    { id: 2, maDon: "4985", ...DON_4984, thamPhanDuKien: true, hinhThuc: "Đơn báo phát hiện vi phạm PL",
      ndd: "Võ Hoài Trâm", toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      maVuAn: "VA26-002012", ttv: "Nguyễn Ngọc B", moVuAn: true,
      tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích" },
    { id: 3, maDon: "4984", ...DON_4984, cvChuyen: undefined, thuLyMoi: undefined, daThuLy: true,
      thamPhanDuKien: true, ndd: "Võ Hoài Trâm", toaBA: "Tòa án nhân dân khu vực 5 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Quá TH 3 năm"] },
    { id: 4, maDon: "4956", cvChuyen: "18 - 05/06/2026", thuLyMoi: "2329180", thamPhan: "Đỗ Tất Thống",
      thamPhanDuKien: true, hinhThuc: "Đơn khiếu nại tư pháp tố tụng", nhan: [],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", ndd: "DANH THỊ SÁ RON",
      soBA: "HKTT_0506_05", ngayBA: "01/06/2026", toaBA: "Tòa án nhân dân khu vực 1 - Cần Thơ",
      capXetXu: "Sơ thẩm", thaoTacVuAn: ["ghep", "them"] },
    { id: 5, maDon: "4943", cvChuyen: "12 - 04/06/2026", thuLyMoi: "2329155", thamPhan: "Nguyễn Như Thắng",
      thamPhanDuKien: true, hinhThuc: "Đơn đề nghị GĐT/TT", nhan: ["Án QH"],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", ndd: "Võ Hoài Trâm",
      soBA: "99", ngayBA: "28/05/2026", toaBA: "Tòa án nhân dân khu vực 3 - Hà Nội",
      capXetXu: "Phúc thẩm", thaoTacVuAn: ["ghep", "them"] },
  ],

  // ── Đã có vụ án: thêm nút Giao tiểu hồ sơ, mỗi dòng có Chuyển / Hủy ghép ──
  "Đã có vụ án": [
    { id: 1, maDon: "4984", ...DON_4984, ndd: "NGUYỄN TRUNG HOÀ",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      ...VU_AN_681, ttv: "Nguyễn Văn A", thaoTacVuAn: ["chuyen", "huyghep"],
      nhanTra: { nhan: "10/6/2026" } },
    { id: 2, maDon: "4984", ...DON_4984, cvChuyen: undefined, thuLyMoi: undefined, daThuLy: true,
      ndd: "VKSNDTC", toaBA: "Tòa án nhân dân khu vực 5 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      ...VU_AN_681, thaoTacVuAn: ["chuyen", "huyghep"], nhanTra: { nhan: "10/6/2026" } },
    { id: 3, maDon: "4943", cvChuyen: "12 - 04/06/2026", thuLyMoi: "2329144", thamPhan: "Đỗ Tất Thống",
      hinhThuc: "Đơn khiếu nại tư pháp tố tụng", nhan: ["Án chỉ đạo"],
      biCao: "Vũ Hoa Hào", ndd: "Phạm Hoàng Anh",
      soBA: "99", ngayBA: "02/06/2026", toaBA: "Tòa án nhân dân tỉnh Bắc Ninh", capXetXu: "Sơ thẩm",
      ...VU_AN_681, thaoTacVuAn: ["chuyen", "huyghep"],
      nhanTra: { nguoiTra: "Trần Quốc Hành", ngayTra: "08/6/2026" } },
    { id: 4, maVanThuDen: "4943 - 04/06/2026", soHSKN: "4984 - 04/06/2026", thuLyXetXu: "2329241",
      thamPhan: "Đỗ Tất Thống", hinhThuc: "Hồ sơ kháng nghị", nhan: ["Án chỉ đạo"],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", nguoiKhangNghi: "VKSNDTC",
      soBA: "HKTT_0506_05", ngayBA: "04/06/2026", toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      capXetXu: "Sơ thẩm", ...VU_AN_681, thaoTacVuAn: ["huyghep"],
      nhanTra: { nguoiThaoTac: "Nguyễn Hảo", ngayThaoTac: "10/6/2026" } },
  ],

  // ── Hồ sơ kháng nghị ──
  "Hồ sơ kháng nghị": [
    { id: 1, maVanThuDen: "4943 - 04/06/2026", soHSKN: "4984 - 04/06/2026", thuLyXetXu: "2329241",
      thamPhan: "Đỗ Tất Thống", hinhThuc: "Hồ sơ kháng nghị", nhan: ["Án chỉ đạo"],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", nguoiKhangNghi: "VKSNDTC",
      soBA: "HKTT_0506_05", ngayBA: "04/06/2026", toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      capXetXu: "Sơ thẩm", ...VU_AN_681, thaoTacVuAn: ["huyghep"],
      nhanTra: { nguoiThaoTac: "Nguyễn Hảo", ngayThaoTac: "10/6/2026" } },
    { id: 2, maVanThuDen: "4943 - 04/06/2026", soHSKN: "4984 - 04/06/2026", thuLyXetXu: "2329144",
      thamPhan: "Đỗ Tất Thống", hinhThuc: "Hồ sơ kháng nghị", nhan: [],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", nguoiKhangNghi: "TANDTC",
      soBA: "99", toaBA: "Tòa án nhân dân tỉnh Bắc Ninh", capXetXu: "Sơ thẩm",
      thaoTacVuAn: ["them"], nhanTra: { nguoiThaoTac: "Nguyễn Hảo", ngayThaoTac: "10/6/2026" } },
    { id: 3, maVanThuDen: "4943 - 12 - 04/06/2026", thamPhan: "Đỗ Tất Thống",
      hinhThuc: "Hồ sơ kháng nghị", nhan: [], nguoiKhangNghi: "VKSNDTC",
      thaoTacVuAn: ["them"], nhanTra: { nhan: "10/6/2026" } },
  ],

  // ── Hồ sơ tử hình: cột 5 đổi thành Thông tin hồ sơ ──
  "Hồ sơ tử hình": [
    { id: 1, maDon: "4984", ...DON_4984, ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Án QH", "Quá TH 5 năm"],
      maHS: "VA26-002012", ttv: "Nguyễn Văn A" },
    { id: 2, maDon: "4984", ...DON_4984, cvChuyen: undefined, thuLyMoi: undefined, daThuLy: true,
      ndd: "Võ Hoài Trâm", toaBA: "Tòa án nhân dân khu vực 5 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Quá TH 3 năm"] },
    { id: 3, maDon: "5101", cvChuyen: "62 - 18/07/2026", thuLyMoi: "2331001", thamPhan: "Nguyễn Văn Hùng",
      hinhThuc: "Đơn đề nghị GĐT/TT", nhan: ["Án tử hình", "Trong hạn 1 năm"],
      nguoiKhieuNai: "Trần Thị Ngọc", biCao: "Lê Văn Tám", ndd: "Phạm Thị Hoa",
      soBA: "HKTT_1807_01", ngayBA: "15/07/2026", capXetXu: "Sơ thẩm",
      thaoTacVuAn: ["ghepHS", "themHS"] },
    { id: 4, maDon: "5102", cvChuyen: "63 - 20/07/2026", thuLyMoi: "2331002", thamPhan: "Đỗ Tất Thống",
      hinhThuc: "Đơn đề nghị GĐT/TT", nhan: [],
      nguoiKhieuNai: "Nguyễn Văn Đức", biCao: "Trần Quang Minh", ndd: "Lê Thị Lan",
      soBA: "HKTT_2007_02", ngayBA: "18/07/2026", toaBA: "Tòa án nhân dân tỉnh Đồng Nai",
      capXetXu: "Phúc thẩm", maHS: "HSTH-2026-004201", maVuAn: "VA26-004201",
      tenVuAn: "Vụ án TRẦN QUANG MINH – Tội giết người", trangThaiHS: "Đang giải quyết GĐT,TT" },
  ],

  // ── Trả lại ──
  "Trả lại": [
    { id: 1, maDon: "5016", cvChuyen: "47 - 14/06/2026", thuLyMoi: "2330016", thamPhan: "Cao Thị Mai",
      hinhThuc: "Đơn báo phát hiện vi phạm PL", nhan: [],
      nguoiKhieuNai: "Vũ Thanh Tùng", biCao: "Đỗ Hữu Bình", ndd: "Hoàng Mỹ Linh",
      soBA: "HKTT_1406_05", ngayBA: "12/06/2026", toaBA: "Tòa án nhân dân tỉnh Vĩnh Long",
      capXetXu: "Sơ thẩm", maVuAn: "VA26-003105",
      tenVuAn: "Vụ án ĐỖ HỮU BÌNH - Tội vi phạm quy định về điều khiển phương tiện",
      tbgq: { so: "TBTLĐ SỐ QĐ -NGÀY QĐ", ttv: "Nguyễn Văn An", tp: "Đào Văn Nam" },
      nhanTra: { nguoiTra: "Trần Quốc Hành", ngayTra: "16/6/2026" } },
  ],
};

const NhanDonTLVuAn = () => {
  const [tab, setTab] = useState(0);
  const [moRong, setMoRong] = useState(false);
  const [chon, setChon] = useState<number[]>([]);
  useKetLuanLD();   // render lại khi kết luận của LĐ thay đổi

  // Số trên tab "Chờ ý kiến LĐ" chỉ đếm đơn LĐ chưa cho kết luận
  const soChoYKien = (DU_LIEU_TAB["Chờ ý kiến LĐ"] ?? [])
    .filter(r => !r.maDon || !layKetLuanLD(r.maDon)).length;
  const TABS = [
    { label: "Tất cả", count: "49" }, { label: "Chờ ý kiến LĐ", count: String(soChoYKien) },
    { label: "Chưa có vụ án", count: "5" }, { label: "Đã có vụ án", count: "+37" },
    { label: "Hồ sơ kháng nghị", count: "+3" }, { label: "Hồ sơ tử hình", count: "2" },
    { label: "Trả lại", count: "2" },
  ];

  const tenTab = TABS[tab].label;
  const rows = DU_LIEU_TAB[tenTab] ?? [];
  // Cấu hình khác nhau giữa các tab
  const laYKien = tenTab === "Chờ ý kiến LĐ";     // cột 5 = Ý kiến lãnh đạo, bỏ cột nhận/trả
  const laHoSo = tenTab === "Hồ sơ tử hình";      // cột 5 = Thông tin hồ sơ
  const coGiaoTieuHoSo = tenTab === "Đã có vụ án";
  const tenCot5 = laYKien ? "Ý kiến lãnh đạo" : laHoSo ? "Thông tin hồ sơ" : "Thông tin vụ án";

  // Đổi tab thì bỏ chọn cho khỏi lẫn dòng giữa các tab
  const doiTab = (i: number) => { setTab(i); setChon([]); };

  const O = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><FLbl>{label}</FLbl>{children}</div>
  );
  const NutNho = ({ children, mau, onClick }: { children: React.ReactNode; mau: string; onClick?: () => void }) => (
    <button onClick={onClick} className={`h-[26px] px-3 rounded-[3px] text-[11px] font-medium transition-colors whitespace-nowrap ${mau}`}>
      {children}
    </button>
  );

  return (
    <div className="bg-[#eef1f5] min-h-full">
      <div className="p-3 space-y-3">
        <div className="bg-white rounded-[4px] border border-[#ddd] shadow-sm overflow-hidden">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 px-3 py-2 text-[12px] text-[#666] border-b border-[#eee]">
            <span className="text-[#1a5a96] cursor-pointer hover:underline">Trang chủ</span>
            <ChevronRight size={12} />
            <span className="text-[#1a5a96] cursor-pointer hover:underline">Quản lý án GĐT/TT</span>
            <ChevronRight size={12} />
            <span className="text-[#1a5a96] cursor-pointer hover:underline">Nhận đơn và TL vụ án</span>
            <ChevronRight size={12} />
            <span className="text-[#333] font-medium">Danh sách</span>
          </div>

          {/* Tabs */}
          <div className="flex items-end border-b border-[#ddd] px-3 pt-2 gap-0 overflow-x-auto">
            {TABS.map((t, i) => (
              <button key={t.label} onClick={() => doiTab(i)}
                className={`px-4 py-[7px] text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#222]"}`}>
                {t.label}
                <span className={`ml-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                  tab === i ? "bg-[#8b1a1a] text-white" : "bg-[#eee] text-[#666]"}`}>{t.count}</span>
              </button>
            ))}
          </div>

          {/* Bộ lọc */}
          <div className="border-b border-[#ddd] px-3 pt-3 pb-2">
            <div className="grid grid-cols-6 gap-x-3 gap-y-3">
              <O label="Người gửi đơn"><FInp placeholder="Người gửi đơn" /></O>
              <O label="Số bản án/quyết định"><FInp placeholder="Số bản án/quyết định" /></O>
              <O label="Ngày bản án/quyết định"><FInp type="date" /></O>
              <O label="Tòa ra bản án/quyết định"><FSel><option value="">Vui lòng chọn</option></FSel></O>
              <O label="Ngày nhận đơn"><FInp type="date" /></O>
              <O label="Thụ lý đơn"><FSel><option value="">Vui lòng chọn</option><option>Thụ lý mới</option><option>Đã thụ lý</option></FSel></O>
              {moRong && (
                <>
                  <O label="Thẩm phán"><FInp placeholder="Nhập tên thẩm phán" /></O>
                  <O label="Hình thức đơn"><FSel><option value="">Vui lòng chọn</option>{optionsHinhThucDon()}</FSel></O>
                  <O label="Cấp xét xử"><FSel><option value="">Vui lòng chọn</option><option>Sơ thẩm</option><option>Phúc thẩm</option></FSel></O>
                  <O label="Mã vụ án"><FInp placeholder="Nhập mã vụ án" /></O>
                </>
              )}
            </div>
            <div className="flex items-center justify-between mt-3">
              <button onClick={() => setMoRong(m => !m)}
                className="flex items-center gap-1 text-[12px] text-[#1a5a96] hover:underline">
                <ChevronDown size={13} className={`transition-transform ${moRong ? "rotate-180" : ""}`} />
                {moRong ? "Thu gọn" : "Mở rộng"}
              </button>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 h-[34px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                  <Search size={13} /> Tìm kiếm
                </button>
                <button className="flex items-center gap-1.5 h-[34px] px-4 border border-[#ccc] rounded-[3px] bg-white hover:bg-[#f5f5f5] text-[12px] text-[#555] transition-colors">
                  ↺ Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-end gap-2 px-3 py-2 bg-[#f5f5f5] border-b border-[#ddd]">
            <button className="flex items-center gap-1.5 h-[30px] px-3 border border-[#8b1a1a] text-[#8b1a1a] bg-white hover:bg-[#fdecea] rounded-[3px] text-[12px] font-medium transition-colors">
              ↩ Trả đơn
            </button>
            {coGiaoTieuHoSo && (
              <button className="flex items-center gap-1.5 h-[30px] px-3 bg-[#27ae60] hover:bg-[#219653] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                <Check size={13} /> Giao tiểu hồ sơ
              </button>
            )}
            <button title="Tải lại" className="w-[30px] h-[30px] flex items-center justify-center border border-[#ccc] rounded-[3px] bg-white hover:bg-[#f0f0f0] text-[#555]">
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Bảng */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f5f5f5] text-[11px] font-bold text-[#333] uppercase">
                  <th className="border border-[#ddd] px-2 py-2 w-[36px]">
                    <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                      checked={chon.length === rows.length && rows.length > 0}
                      onChange={e => setChon(e.target.checked ? rows.map(r => r.id) : [])} />
                  </th>
                  <th className="border border-[#ddd] px-2 py-2 w-[40px]">STT</th>
                  <th className="border border-[#ddd] px-3 py-2 text-left w-[270px]">Thông tin đơn</th>
                  <th className="border border-[#ddd] px-3 py-2 text-left w-[195px]">Đương sự &amp; người đứng đơn</th>
                  <th className="border border-[#ddd] px-3 py-2 text-left w-[235px]">Thông tin BA/QĐ đề nghị GĐT,TT</th>
                  <th className="border border-[#ddd] px-3 py-2 text-left w-[240px]">{tenCot5}</th>
                  {!laYKien && <th className="border border-[#ddd] px-3 py-2 text-left w-[135px]">Thông tin nhận/trả</th>}
                  <th className="border border-[#ddd] px-2 py-2 w-[56px]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={laYKien ? 7 : 8} className="border border-[#ddd] px-3 py-10 text-center text-[#999] italic">Không có bản ghi nào</td></tr>
                ) : rows.map((r, i) => (
                  <tr key={r.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                    <td className="border border-[#ddd] px-2 py-2 text-center">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={chon.includes(r.id)}
                        onChange={e => setChon(p => e.target.checked ? [...p, r.id] : p.filter(x => x !== r.id))} />
                    </td>
                    <td className="border border-[#ddd] px-2 py-2 text-center">{i + 1}</td>

                    {/* Thông tin đơn */}
                    <td className="border border-[#ddd] px-3 py-2 leading-snug">
                      {r.maVanThuDen ? (
                        <>
                          <div className="font-semibold text-[#8b1a1a]">Mã văn thư đến: {r.maVanThuDen}</div>
                          {r.soHSKN && <div>Số HSKN: {r.soHSKN}</div>}
                          {r.thuLyXetXu && <div>Thụ lý xét xử: {r.thuLyXetXu}</div>}
                        </>
                      ) : (
                        <>
                          <div className="font-semibold text-[#8b1a1a]">Mã đơn: {r.maDon}</div>
                          {r.daThuLy
                            ? <div className="text-[#e67e22]">Đã thụ lý</div>
                            : <>
                                {r.cvChuyen && <div>CV chuyển: {r.cvChuyen}</div>}
                                {r.thuLyMoi && <div>Thụ lý mới: {r.thuLyMoi}</div>}
                              </>}
                        </>
                      )}
                      <div>Thẩm phán{r.thamPhanDuKien && " (Dự kiến)"}: {r.thamPhan}</div>
                      <div>Hình thức: {r.hinhThuc}</div>
                      {r.nhan.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {r.nhan.map(n => (
                            <span key={n} className={`inline-flex items-center gap-1 px-1.5 py-[2px] rounded-[10px] border text-[10px] font-medium whitespace-nowrap ${nhanMau(n)}`}>
                              {n === "Án chỉ đạo" && "★"} {n}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Đương sự */}
                    <td className="border border-[#ddd] px-3 py-2 leading-snug">
                      {r.nguoiKhieuNai && <div>Người khiếu nại: <span className="font-medium">{r.nguoiKhieuNai}</span></div>}
                      {r.biCao && <div>Bị cáo: {r.biCao}</div>}
                      {r.ndd && <div>NĐD: {r.ndd}</div>}
                      {r.nguoiKhangNghi && <div>Người kháng nghị: <span className="font-medium">{r.nguoiKhangNghi}</span></div>}
                    </td>

                    {/* Thông tin BA/QĐ */}
                    <td className="border border-[#ddd] px-3 py-2 leading-snug">
                      {r.soBA ? (
                        <>
                          <div className="text-[#1a5a96]">Số BA: {r.soBA}{r.ngayBA && <> Ngày: {r.ngayBA}</>}</div>
                          {r.toaBA && <div className="text-[#1a5a96]">Tại: {r.toaBA}</div>}
                          {r.capXetXu && (
                            <div className="mt-1 bg-[#fff8e1] border border-[#f0d98a] rounded-[3px] px-2 py-1 text-[#8a6d00]">
                              Cấp xét xử: {r.capXetXu}
                            </div>
                          )}
                        </>
                      ) : <span className="text-[#bbb]">–</span>}
                    </td>

                    {/* Cột 5 — đổi theo tab */}
                    <td className="border border-[#ddd] px-3 py-2 leading-snug">
                      {laYKien ? (() => {
                        const kl = r.maDon ? layKetLuanLD(r.maDon) : undefined;
                        return (
                          <div className="space-y-2">
                            {(r.yKien ?? []).map((y, k) => (
                              <div key={k}>
                                <span className={`inline-block px-2 py-[2px] rounded-[10px] border text-[10px] font-medium ${
                                  y.ketQua.toLowerCase().includes("không")
                                    ? "bg-[#fdecea] text-[#c0392b] border-[#f3c0bb]"
                                    : "bg-[#e8f5e9] text-[#1b5e20] border-[#a5d6a7]"}`}>
                                  {y.ketQua}
                                </span>
                                <div className="mt-0.5">{y.nguoi} – {y.chucVu}</div>
                                <div className="text-[#27ae60]">Đã duyệt - {y.ngayDuyet}</div>
                              </div>
                            ))}

                            {/* Kết luận của LĐ — đẩy sang cột Thông tin giải quyết ở màn Danh sách đơn */}
                            <div className="pt-1.5 border-t border-dashed border-[#e0e0e0]">
                              {kl ? (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-block px-2 py-[2px] rounded-[10px] text-[10px] font-medium text-white"
                                    style={{ backgroundColor: MAU_KET_LUAN_LD[kl] }}>
                                    Kết luận: {kl}
                                  </span>
                                  <button onClick={() => datKetLuanLD(r.maDon!, null)}
                                    className="text-[10px] text-[#1a5a96] hover:underline">Hoàn tác</button>
                                </div>
                              ) : (
                                <>
                                  <span className="inline-block px-2 py-[2px] rounded-[10px] text-[10px] font-medium text-white"
                                    style={{ backgroundColor: MAU_KET_LUAN_LD[CHO_Y_KIEN_LD] }}>
                                    {CHO_Y_KIEN_LD}
                                  </span>
                                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                    <NutNho mau="bg-[#27ae60] hover:bg-[#219150] text-white"
                                      onClick={() => datKetLuanLD(r.maDon!, "Thụ lý mới")}>Thụ lý mới</NutNho>
                                    <NutNho mau="bg-white border border-[#c0392b] text-[#c0392b] hover:bg-[#fdecea]"
                                      onClick={() => datKetLuanLD(r.maDon!, "Không thụ lý")}>Không thụ lý</NutNho>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })() : laHoSo ? (
                        <>
                          {r.maHS && <div className="text-[#1a5a96]">Mã HS: {r.maHS}</div>}
                          {r.maVuAn && <div>Mã vụ án: <span className="font-medium">{r.maVuAn}</span></div>}
                          {r.tenVuAn && <div>Tên vụ án: {r.tenVuAn}</div>}
                          {r.ttv && <div className="text-[#888]">TTV: {r.ttv}</div>}
                          {r.trangThaiHS && (
                            <div className="mt-1">
                              <span className="inline-block px-2 py-[2px] rounded-[10px] border text-[10px] font-medium bg-[#eef3fb] text-[#2c5aa0] border-[#c3d5ef]">
                                {r.trangThaiHS}
                              </span>
                            </div>
                          )}
                          {(r.thaoTacVuAn ?? []).length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {r.thaoTacVuAn!.includes("ghepHS") && <NutNho mau="bg-[#8b1a1a] hover:bg-[#6e1414] text-white">Ghép hồ sơ</NutNho>}
                              {r.thaoTacVuAn!.includes("themHS") && <NutNho mau="bg-white border border-[#ccc] text-[#333] hover:bg-[#f5f5f5]">Thêm mới hồ sơ</NutNho>}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className={r.moVuAn ? "text-[#aaa]" : ""}>
                          {r.maVuAn && <div>Mã vụ án: <span className={r.moVuAn ? "" : "font-medium"}>{r.maVuAn}</span></div>}
                          {r.tenVuAn && <div>Tên vụ án: {r.tenVuAn}</div>}
                          {r.ttv && <div className="text-[#888]">TTV: {r.ttv}</div>}
                          {r.tbgq && (
                            <div className="mt-1 bg-[#f0f9f1] border border-[#a5d6a7] rounded-[3px] px-2 py-1.5 leading-relaxed">
                              <div className="font-semibold text-[#1b5e20]">ĐÃ CÓ TBGQ: {r.tbgq.so}</div>
                              <div>TTV giải quyết: <span className="font-medium">{r.tbgq.ttv}</span></div>
                              <div>TP giải quyết: <span className="font-medium">{r.tbgq.tp}</span></div>
                            </div>
                          )}
                          {(r.thaoTacVuAn ?? []).length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              {r.thaoTacVuAn!.includes("ghep") && <NutNho mau="bg-[#e8f5e9] border border-[#a5d6a7] text-[#1b5e20] hover:bg-[#d7eeda]">Ghép vụ án</NutNho>}
                              {r.thaoTacVuAn!.includes("them") && <NutNho mau="bg-[#8b1a1a] hover:bg-[#6e1414] text-white">Thêm vụ án</NutNho>}
                              {r.thaoTacVuAn!.includes("chuyen") && <NutNho mau="bg-[#eef3fb] border border-[#c3d5ef] text-[#2c5aa0] hover:bg-[#dfe9f7]">Chuyển vụ án</NutNho>}
                              {r.thaoTacVuAn!.includes("huyghep") && <NutNho mau="bg-[#fff8e1] border border-[#f0d98a] text-[#8a6d00] hover:bg-[#fdf0c8]">Hủy ghép vụ án</NutNho>}
                            </div>
                          )}
                          {!r.maVuAn && !r.tbgq && !(r.thaoTacVuAn ?? []).length && <span className="text-[#bbb]">–</span>}
                        </div>
                      )}
                    </td>

                    {/* Thông tin nhận/trả */}
                    {!laYKien && (
                      <td className="border border-[#ddd] px-3 py-2 leading-snug">
                        {r.nhanTra ? (
                          <>
                            {r.nhanTra.nhan && <div>Ngày nhận: {r.nhanTra.nhan}</div>}
                            {r.nhanTra.nguoiTra && <div>Người trả: {r.nhanTra.nguoiTra}</div>}
                            {r.nhanTra.ngayTra && <div>Ngày trả: {r.nhanTra.ngayTra}</div>}
                            {r.nhanTra.nguoiThaoTac && <div>Người thao tác: {r.nhanTra.nguoiThaoTac}</div>}
                            {r.nhanTra.ngayThaoTac && <div>Ngày thao tác: {r.nhanTra.ngayThaoTac}</div>}
                          </>
                        ) : <span className="text-[#bbb]">–</span>}
                      </td>
                    )}

                    <td className="border border-[#ddd] px-2 py-2 text-center">
                      <button title="Xem chi tiết" className="text-[#666] hover:text-[#1a5a96]">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer phân trang */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-[#ddd] bg-white">
            <span className="text-[12px] text-[#666]">
              {rows.length === 0 ? "Không có bản ghi nào"
                : `Hiển thị 1–${rows.length} trong tổng ${rows.length} bản ghi`}
            </span>
            <div className="flex items-center gap-1.5">
              <button className="w-[26px] h-[26px] border border-[#ddd] rounded-[3px] text-[#888] hover:bg-[#f5f5f5]">‹</button>
              <button className="w-[26px] h-[26px] border border-[#8b1a1a] bg-[#8b1a1a] text-white rounded-[3px] text-[12px] font-medium">1</button>
              <button className="w-[26px] h-[26px] border border-[#ddd] rounded-[3px] text-[#888] hover:bg-[#f5f5f5]">›</button>
              <select className="h-[26px] px-1.5 text-[12px] border border-[#ddd] rounded-[3px] bg-white ml-1">
                <option>10 / trang</option><option>20 / trang</option><option>50 / trang</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Cấu hình TTV báo cáo (module Quản lý án GĐT/TT) ─────────────────────────
const CHUC_DANH = [
  "Thư ký Tòa án", "Thẩm phán bậc 1", "Thẩm phán bậc 2",
  "Thẩm tra viên", "Thẩm tra viên chính", "Thẩm tra viên cao cấp",
];
const NGHIEP_VU_TTV = ["Giải quyết án", "Xử lý nghiệp vụ"];
const LANH_DAO_VU = [
  "Nguyễn Tiến Mạnh – Phó Vụ trưởng",
  "Nguyễn Văn Hiền – Phó Vụ trưởng",
  "Trần Quốc Hành – Phó Vụ trưởng",
];
const TAT_CA = "- Tất cả -";

interface CanBoTTV {
  id: number;
  hoTen: string;
  chucDanh: string;
  nghiepVu: string;
  lanhDao: string;      // "" = chưa gán, hiển thị "- Tất cả -"
  nguoiThaoTac: string;
  ngayThaoTac: string;
}

// Tên có hậu tố (TK) thư ký, (TP) thẩm phán, (TTV) thẩm tra viên
const CAN_BO_TTV: CanBoTTV[] = [
  ["Bùi Nguyễn Khánh (TK)", "Thư ký Tòa án", "Giải quyết án", 0],
  ["Bùi Quang Huy (TK)", "Thư ký Tòa án", "Giải quyết án", 1],
  ["Bùi Thị Vân Anh (TP)", "Thẩm phán bậc 1", "Xử lý nghiệp vụ", 1],
  ["Bùi Việt Anh (TP)", "Thẩm phán bậc 2", "Giải quyết án", 1],
  ["Chi Thị Đức (TK)", "Thẩm tra viên", "Giải quyết án", 1],
  ["Chu Thị Thoam (TP)", "Thẩm tra viên", "Giải quyết án", 1],
  ["Chị Thị Nhụng (TTV)", "Thẩm tra viên", "Giải quyết án", 1],
  ["Dương Thảo Phương (TTV)", "Thẩm tra viên", "Giải quyết án", -1],
  ["Giáng Tiêu Thọ (TK)", "Thư ký Tòa án", "Xử lý nghiệp vụ", -1],
  ["Hoàng Ngô An (TK)", "Thư ký Tòa án", "Xử lý nghiệp vụ", 1],
  ["Hoàng Ngọc Điệu (TTV)", "Thẩm tra viên chính", "Giải quyết án", 2],
  ["Hoàng Thanh Thủy (TK)", "Thẩm tra viên", "Giải quyết án", 1],
  ["Lê Minh Quân (TTV)", "Thẩm tra viên chính", "Xử lý nghiệp vụ", 0],
  ["Lê Thị Bích Ngọc (TK)", "Thư ký Tòa án", "Giải quyết án", 2],
  ["Nguyễn Đức Toàn (TP)", "Thẩm phán bậc 2", "Giải quyết án", 0],
  ["Phạm Thu Hà (TTV)", "Thẩm tra viên", "Xử lý nghiệp vụ", -1],
  ["Trần Quang Vinh (TTV)", "Thẩm tra viên cao cấp", "Giải quyết án", 2],
  ["Vũ Thị Lan Anh (TK)", "Thư ký Tòa án", "Giải quyết án", 1],
].map(([hoTen, chucDanh, nghiepVu, iLD], i) => ({
  id: i + 1,
  hoTen: hoTen as string,
  chucDanh: chucDanh as string,
  nghiepVu: nghiepVu as string,
  lanhDao: (iLD as number) >= 0 ? LANH_DAO_VU[iLD as number] : "",
  nguoiThaoTac: "Nguyễn Văn A",
  ngayThaoTac: "11/06/2026",
}));

const CauHinhTTVBaoCao = () => {
  const [rows, setRows] = useState<CanBoTTV[]>(CAN_BO_TTV);
  // Bộ lọc: giá trị đã bấm Tìm kiếm mới áp, để ô chọn không lọc ngay khi gõ
  const [fLanhDao, setFLanhDao] = useState("");
  const [fTTV, setFTTV] = useState("");
  const [locLanhDao, setLocLanhDao] = useState("");
  const [locTTV, setLocTTV] = useState("");
  const [thongBao, setThongBao] = useState(false);
  const [inBieuMau, setInBieuMau] = useState(false);

  const dsTTV = useMemo(() => rows.map(r => r.hoTen).sort((a, b) => a.localeCompare(b, "vi")), [rows]);
  const dsHienThi = useMemo(() => rows.filter(r =>
    (!locLanhDao || r.lanhDao === locLanhDao) && (!locTTV || r.hoTen === locTTV)), [rows, locLanhDao, locTTV]);

  const sua = (id: number, khoa: "chucDanh" | "nghiepVu" | "lanhDao") => (v: string) =>
    setRows(p => p.map(r => r.id === id ? { ...r, [khoa]: v } : r));

  const luu = () => {
    setRows(p => p.map(r => ({ ...r, nguoiThaoTac: "Nguyễn Văn A", ngayThaoTac: "11/06/2026" })));
    setThongBao(true);
  };

  // Ô chọn trong bảng — gọn hơn FSel, không có nút xóa
  const OChon = ({ value, onChange, options, rong }: {
    value: string; onChange: (v: string) => void; options: string[]; rong?: boolean;
  }) => (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`w-full h-[32px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96] transition-colors ${rong ? "text-[#888]" : "text-[#222]"}`}>
        <option value="">{TAT_CA}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
    </div>
  );

  return (
    <div className="bg-white min-h-full">
      <div className="px-4 py-3">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#666] mb-3">
          <span className="text-[#1a5a96] cursor-pointer hover:underline">Trang chủ</span>
          <span className="text-[#bbb]">›</span>
          <span className="text-[#1a5a96] cursor-pointer hover:underline">Quản lý án GĐT/TT</span>
          <span className="text-[#bbb]">›</span>
          <span className="text-[#333] font-medium">Cấu hình TTV báo cáo</span>
        </div>

        {/* Bộ lọc */}
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <FLbl>Lãnh đạo</FLbl>
            <div className="relative">
              <select value={fLanhDao} onChange={e => setFLanhDao(e.target.value)}
                className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                <option value="">{TAT_CA}</option>
                {LANH_DAO_VU.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-[280px]">
            <FLbl>Thẩm tra viên</FLbl>
            <div className="relative">
              <select value={fTTV} onChange={e => setFTTV(e.target.value)}
                className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                <option value="">{TAT_CA}</option>
                {dsTTV.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
            </div>
          </div>
          <button onClick={() => { setLocLanhDao(fLanhDao); setLocTTV(fTTV); }}
            className="flex items-center gap-1.5 h-[34px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[12px] font-medium transition-colors">
            <Search size={13} /> Tìm kiếm
          </button>
          <button onClick={() => setInBieuMau(true)}
            className="flex items-center gap-1.5 h-[34px] px-4 border border-[#ccc] rounded-[4px] bg-white hover:bg-[#f5f5f5] text-[12px] text-[#333] transition-colors">
            <Printer size={13} /> In biểu mẫu
          </button>
        </div>

        {/* Thông báo + Lưu cấu hình */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1">
            {thongBao && (
              <div className="flex items-center gap-2 h-[38px] px-3 rounded-[4px] bg-[#eaf7ee] border border-[#a9debb] text-[13px] text-[#1a7a45]">
                <Check size={15} />
                <span className="flex-1">Cập nhật dữ liệu thành công!</span>
                <button onClick={() => setThongBao(false)} className="text-[#1a7a45] hover:text-[#0d5c31] px-1">×</button>
              </div>
            )}
          </div>
          <button onClick={luu}
            className="flex items-center gap-1.5 h-[38px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[13px] font-medium transition-colors flex-shrink-0">
            <Save size={14} /> Lưu cấu hình
          </button>
        </div>

        {/* Bảng cấu hình */}
        <div className="mt-3 border-t border-[#e5e5e5] overflow-x-auto">
          <table className="w-full border-collapse text-[13px] min-w-[1180px]">
            <thead>
              <tr className="border-b border-[#e5e5e5]">
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[52px]">STT</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[300px]">Họ và tên</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[280px]">Chức danh</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[280px]">Nghiệp vụ Thẩm tra viên</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333]">Lãnh đạo</th>
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[190px]">Người thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dsHienThi.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-[#888]">
                    Không có cán bộ nào khớp điều kiện tìm kiếm.
                  </td>
                </tr>
              )}
              {dsHienThi.map((r, i) => (
                <tr key={r.id} className="border-b border-[#eee] hover:bg-[#fafbfc] transition-colors">
                  <td className="px-3 py-2 text-[#555] align-middle">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-[#222] align-middle">{r.hoTen}</td>
                  <td className="px-3 py-2 align-middle">
                    <OChon value={r.chucDanh} onChange={sua(r.id, "chucDanh")} options={CHUC_DANH} />
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <OChon value={r.nghiepVu} onChange={sua(r.id, "nghiepVu")} options={NGHIEP_VU_TTV} />
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <OChon value={r.lanhDao} onChange={sua(r.id, "lanhDao")} options={LANH_DAO_VU} rong={!r.lanhDao} />
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <div className="font-medium text-[#222]">{r.nguoiThaoTac}</div>
                    <div className="text-[12px] text-[#c0392b]">{r.ngayThaoTac}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {inBieuMau && <PopupInCauHinhTTV rows={dsHienThi} onDong={() => setInBieuMau(false)} />}
    </div>
  );
};

// Biểu mẫu in của màn Cấu hình TTV báo cáo
const PopupInCauHinhTTV = ({ rows, onDong }: { rows: CanBoTTV[]; onDong: () => void }) => {
  const homNay = new Date().toLocaleDateString("vi-VN");
  return (
    <div className="fixed inset-0 z-[210] bg-black/50 flex items-center justify-center p-4">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #khu-vuc-in-ttv, #khu-vuc-in-ttv * { visibility: visible !important; }
          #khu-vuc-in-ttv {
            position: absolute !important; left: 0 !important; top: 0 !important;
            width: 100% !important; height: auto !important; max-height: none !important;
            overflow: visible !important; padding: 0 !important; background: #fff !important;
          }
          #khu-vuc-in-ttv tr { break-inside: avoid; }
          @page { size: A4 portrait; margin: 14mm; }
        }
      `}</style>
      <div className="bg-white rounded-[6px] shadow-2xl w-[1000px] max-w-[96vw] max-h-[94vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-[#1d2e4f] text-white flex-shrink-0">
          <span className="text-[15px] font-bold">Biểu mẫu cấu hình TTV báo cáo</span>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-[4px] bg-white/15 hover:bg-white/25 transition-colors">
              <Printer size={14} /> In
            </button>
            <button onClick={onDong} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        <div id="khu-vuc-in-ttv" className="flex-1 overflow-auto bg-[#e9ecef] p-5">
          <div className="bg-white mx-auto p-8 shadow-sm" style={{ maxWidth: 900 }}>
            <div className="text-center mb-4">
              <div className="text-[12px] uppercase tracking-wide text-[#333]">Tòa án nhân dân tối cao</div>
              <div className="text-[17px] font-bold uppercase mt-1 text-[#111]">Danh sách cấu hình TTV báo cáo</div>
              <div className="text-[12px] text-[#555] mt-1">Ngày in: {homNay}</div>
            </div>
            <div className="text-[12px] text-[#333] mb-3"><b>Tổng cộng:</b> {rows.length} cán bộ</div>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f0f0f0]">
                  {["STT", "Họ và tên", "Chức danh", "Nghiệp vụ TTV", "Lãnh đạo"].map(h => (
                    <th key={h} className="border border-[#999] px-2 py-[6px] text-left font-semibold text-[#222]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                    <td className="border border-[#999] px-2 py-[5px] text-center">{i + 1}</td>
                    <td className="border border-[#999] px-2 py-[5px]">{r.hoTen}</td>
                    <td className="border border-[#999] px-2 py-[5px]">{r.chucDanh}</td>
                    <td className="border border-[#999] px-2 py-[5px]">{r.nghiepVu}</td>
                    <td className="border border-[#999] px-2 py-[5px]">{r.lanhDao || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-8 text-[12px] text-[#222]">
              <div className="text-center w-[260px]">
                <div className="italic">Hà Nội, ngày {homNay}</div>
                <div className="font-semibold uppercase mt-1">Người lập biểu</div>
                <div className="text-[#777] mt-12">(Ký, ghi rõ họ tên)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Cấu hình phân công Thẩm phán ────────────────────────────────────────────
// Màn này CHỈ khai báo 3 dữ kiện của thẩm phán: cấp bậc, đơn vị công tác,
// chức vụ. Việc áp tiêu chí phân công tự động theo dự thảo —
//   1. TPB3 là Vụ trưởng Vụ GĐ,KT        → = 1/5 mức chuẩn TPB3 của Vụ
//   2. TPB3 là Phó Vụ trưởng Vụ GĐ,KT    → = 1/3 mức chuẩn TPB3 của Vụ
//   3. TPB3 giữ chức vụ quản lý ngoài Vụ → ≥ 12 VB đề nghị/năm (sàn tối thiểu)
// — do BACKEND xử lý, vì cần đếm VB đề nghị toàn hệ thống và phải chạy trong
// transaction lúc phân công. FE không tính, không hiển thị định mức suy ra.
const VU_GD_KT = "Vụ Giám đốc, kiểm tra";
const DON_VI_CONG_TAC = [
  VU_GD_KT,
  "Vụ Pháp chế và Quản lý khoa học",
  "Văn phòng TANDTC",
  "Tòa Hình sự",
  "Tòa Dân sự",
  "Tòa Kinh tế",
];

const CHUC_VU_TP = [
  "Thẩm phán",            // không giữ chức vụ quản lý
  "Vụ trưởng",
  "Phó Vụ trưởng",
  "Chánh Văn phòng",
  "Phó Chánh Văn phòng",
  "Chánh tòa",
  "Phó Chánh tòa",
];
const TP_BAC_3 = "Thẩm phán bậc 3";

const LOAI_NGHI = ["Phép năm", "Nghỉ ốm", "Thai sản", "Đi công tác", "Biệt phái", "Khác"];

// Câu hỏi nghiệp vụ còn treo #2 — vụ đang cầm khi thẩm phán nghỉ thì xử lý sao
const XU_LY_VU_DANG_CAM: Record<string, string> = {
  "giu-nguyen": "Giữ nguyên — thẩm phán tiếp tục giải quyết sau khi đi làm lại",
  "tra-ve": "Trả về danh sách chờ phân công",
  "chuyen-giao": "Chuyển cho thẩm phán khác",
};

interface ThamPhanCauHinh {
  id: number;
  hoTen: string;
  capBac: string;
  donVi: string;
  chucVu: string;
  daNhan: number;       // số VB đề nghị GĐT,TT đã phân công trong năm (backend trả về)
  nguoiThaoTac: string;
  ngayThaoTac: string;
}

interface NghiPhepRow {
  id: number;
  thamPhan: string;
  loai: string;
  tuNgay: string;   // dd/mm/yyyy
  denNgay: string;
  xuLy: string;     // khóa của XU_LY_VU_DANG_CAM
  chuyenCho: string;
  vuDangCam: number;
  lyDo: string;
  trangThai: "Chờ duyệt" | "Đã duyệt";
}

const THAM_PHAN_CAU_HINH: ThamPhanCauHinh[] = [
  // TPB3 của Vụ GĐ,KT — nhóm này sinh ra "mức chuẩn"
  ["Nguyễn Thị Lan", TP_BAC_3, VU_GD_KT, "Vụ trưởng", 6],
  ["Trần Văn Hùng", TP_BAC_3, VU_GD_KT, "Phó Vụ trưởng", 11],
  ["Trần Thị Hương", TP_BAC_3, VU_GD_KT, "Phó Vụ trưởng", 8],
  ["Lê Thị Mai", TP_BAC_3, VU_GD_KT, "Thẩm phán", 29],
  ["Hoàng Thị Thu", TP_BAC_3, VU_GD_KT, "Thẩm phán", 31],
  ["Đỗ Thị Kim Oanh", TP_BAC_3, VU_GD_KT, "Thẩm phán", 27],
  ["Nguyễn Như Thắng", TP_BAC_3, VU_GD_KT, "Thẩm phán", 33],
  // TPB3 giữ chức vụ quản lý ngoài Vụ GĐ,KT
  ["Phạm Văn Đức", TP_BAC_3, "Văn phòng TANDTC", "Chánh Văn phòng", 9],
  ["Lê Minh Tuấn", TP_BAC_3, "Tòa Hình sự", "Phó Chánh tòa", 14],
  // TPB3 ngoài Vụ, không giữ chức vụ — dự thảo chưa quy định
  ["Vũ Thị Hạnh", TP_BAC_3, "Tòa Dân sự", "Thẩm phán", 18],
  // Cấp bậc khác — tiêu chí không áp dụng
  ["Đỗ Tất Thống", "Thẩm phán TANDTC", VU_GD_KT, "Thẩm phán", 25],
  ["Nguyễn Văn Hiền", "Thẩm phán bậc 2", "Tòa Kinh tế", "Thẩm phán", 21],
].map(([hoTen, capBac, donVi, chucVu, daNhan], i) => ({
  id: i + 1,
  hoTen: hoTen as string,
  capBac: capBac as string,
  donVi: donVi as string,
  chucVu: chucVu as string,
  daNhan: daNhan as number,
  nguoiThaoTac: "Nguyễn Văn A",
  ngayThaoTac: "11/06/2026",
}));

const NGHI_PHEP_MAU: NghiPhepRow[] = [
  { id: 1, thamPhan: "Lê Minh Tuấn", loai: "Biệt phái", tuNgay: "01/07/2026", denNgay: "31/12/2026",
    xuLy: "chuyen-giao", chuyenCho: "Trần Văn Hùng", vuDangCam: 3,
    lyDo: "Biệt phái công tác tại TAND cấp cao Đà Nẵng", trangThai: "Đã duyệt" },
  { id: 2, thamPhan: "Trần Thị Hương", loai: "Thai sản", tuNgay: "15/08/2026", denNgay: "15/02/2027",
    xuLy: "tra-ve", chuyenCho: "", vuDangCam: 4,
    lyDo: "Nghỉ chế độ thai sản 6 tháng", trangThai: "Đã duyệt" },
  { id: 3, thamPhan: "Lê Thị Mai", loai: "Phép năm", tuNgay: "03/08/2026", denNgay: "09/08/2026",
    xuLy: "giu-nguyen", chuyenCho: "", vuDangCam: 2,
    lyDo: "Nghỉ phép năm", trangThai: "Đã duyệt" },
  { id: 4, thamPhan: "Hoàng Thị Thu", loai: "Đi công tác", tuNgay: "20/09/2026", denNgay: "27/09/2026",
    xuLy: "giu-nguyen", chuyenCho: "", vuDangCam: 5,
    lyDo: "Tham dự hội nghị tổng kết ngành", trangThai: "Chờ duyệt" },
];

// Đang nghỉ = có kỳ nghỉ ĐÃ DUYỆT bao trùm ngày đang xét
const dangNghi = (hoTen: string, ds: NghiPhepRow[], moc: Date) => ds.find(n =>
  n.thamPhan === hoTen && n.trangThai === "Đã duyệt" &&
  (() => {
    const tu = parseVNDate(n.tuNgay), den = parseVNDate(n.denNgay);
    return !!tu && !!den && moc >= tu && moc <= den;
  })());

const CauHinhPhanCongTP = () => {
  const [tab, setTab] = useState<0 | 1>(0);
  const [rows, setRows] = useState<ThamPhanCauHinh[]>(THAM_PHAN_CAU_HINH);
  const [nghiPhep, setNghiPhep] = useState<NghiPhepRow[]>(NGHI_PHEP_MAU);
  const [fHoTen, setFHoTen] = useState("");
  const [fCapBac, setFCapBac] = useState("");
  const [fDonVi, setFDonVi] = useState("");
  const [fChucVu, setFChucVu] = useState("");
  const [loc, setLoc] = useState({ hoTen: "", capBac: "", donVi: "", chucVu: "" });
  const [thongBao, setThongBao] = useState("");
  const [themNghi, setThemNghi] = useState(false);

  const homNay = new Date();

  const capBacOptions = useMemo(
    () => [...new Set(rows.map(r => r.capBac))].sort((a, b) => a.localeCompare(b, "vi")), [rows]);

  const dsHienThi = useMemo(() => rows.filter(r =>
    (!loc.hoTen || contains(r.hoTen, loc.hoTen)) &&
    (!loc.capBac || r.capBac === loc.capBac) &&
    (!loc.donVi || r.donVi === loc.donVi) &&
    (!loc.chucVu || r.chucVu === loc.chucVu)), [rows, loc]);

  const sua = <K extends keyof ThamPhanCauHinh>(id: number, khoa: K) => (v: ThamPhanCauHinh[K]) =>
    setRows(p => p.map(r => r.id === id ? { ...r, [khoa]: v } : r));

  const OChon = ({ value, onChange, options, rong }: {
    value: string; onChange: (v: string) => void; options: { v: string; t: string }[]; rong?: boolean;
  }) => (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`w-full h-[32px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96] transition-colors ${rong ? "text-[#888]" : "text-[#222]"}`}>
        {options.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
    </div>
  );

  return (
    <div className="bg-white min-h-full">
      <div className="px-4 py-3">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#666] mb-3">
          <span className="text-[#1a5a96] cursor-pointer hover:underline">Trang chủ</span>
          <span className="text-[#bbb]">›</span>
          <span className="text-[#1a5a96] cursor-pointer hover:underline">Quản lý án GĐT/TT</span>
          <span className="text-[#bbb]">›</span>
          <span className="text-[#333] font-medium">Cấu hình phân công Thẩm phán</span>
        </div>

        {/* Tabs */}
        <div className="flex items-end border-b border-[#ddd] gap-0 mb-3">
          {[
            { nhan: "Thông tin thẩm phán", dem: rows.length },
            { nhan: "Nghỉ phép / vắng mặt", dem: nghiPhep.length },
          ].map((t, i) => (
            <button key={t.nhan} onClick={() => setTab(i as 0 | 1)}
              className={`px-4 py-[7px] text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#222]"}`}>
              {t.nhan}
              <span className={`ml-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                tab === i ? "bg-[#8b1a1a] text-white" : "bg-[#eee] text-[#666]"}`}>{t.dem}</span>
            </button>
          ))}
        </div>

        {tab === 0 ? (
          <>
            {/* Bộ lọc */}
            <div className="grid grid-cols-4 gap-3 items-end">
              <div>
                <FLbl>Họ và tên</FLbl>
                <FInp value={fHoTen} onChange={e => setFHoTen(e.target.value)}
                  placeholder="Nhập họ và tên thẩm phán" className="h-[34px]" />
              </div>
              <div>
                <FLbl>Cấp bậc</FLbl>
                <div className="relative">
                  <select value={fCapBac} onChange={e => setFCapBac(e.target.value)}
                    className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                    <option value="">- Tất cả -</option>
                    {capBacOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div>
                <FLbl>Đơn vị công tác</FLbl>
                <div className="relative">
                  <select value={fDonVi} onChange={e => setFDonVi(e.target.value)}
                    className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                    <option value="">- Tất cả -</option>
                    {DON_VI_CONG_TAC.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <FLbl>Chức vụ</FLbl>
                  <div className="relative">
                    <select value={fChucVu} onChange={e => setFChucVu(e.target.value)}
                      className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                      <option value="">- Tất cả -</option>
                      {CHUC_VU_TP.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  </div>
                </div>
                <button onClick={() => setLoc({ hoTen: fHoTen, capBac: fCapBac, donVi: fDonVi, chucVu: fChucVu })}
                  className="flex items-center gap-1.5 h-[34px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[12px] font-medium transition-colors flex-shrink-0">
                  <Search size={13} /> Tìm kiếm
                </button>
                <button onClick={() => { setFHoTen(""); setFCapBac(""); setFDonVi(""); setFChucVu(""); setLoc({ hoTen: "", capBac: "", donVi: "", chucVu: "" }); }}
                  className="h-[34px] px-3 border border-[#ccc] rounded-[4px] bg-white hover:bg-[#f5f5f5] text-[12px] text-[#555] transition-colors flex-shrink-0">
                  ↺
                </button>
              </div>
            </div>

            {/* Thông báo + Lưu */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 space-y-2">
                {thongBao && (
                  <div className="flex items-center gap-2 h-[38px] px-3 rounded-[4px] bg-[#eaf7ee] border border-[#a9debb] text-[13px] text-[#1a7a45]">
                    <Check size={15} />
                    <span className="flex-1">{thongBao}</span>
                    <button onClick={() => setThongBao("")} className="text-[#1a7a45] hover:text-[#0d5c31] px-1">×</button>
                  </div>
                )}
              </div>
              <button onClick={() => setThongBao("Cập nhật thông tin thẩm phán thành công!")}
                className="flex items-center gap-1.5 h-[38px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[13px] font-medium transition-colors flex-shrink-0">
                <Save size={14} /> Lưu cấu hình
              </button>
            </div>

            {/* Bảng khai báo — chỉ 3 dữ kiện, backend tự áp tiêu chí và tính định mức */}
            <div className="mt-3 border-t border-[#e5e5e5] overflow-x-auto">
              <table className="w-full border-collapse text-[13px] min-w-[1120px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[46px]">STT</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[200px]">Họ và tên</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[200px]">Cấp bậc</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[240px]">Đơn vị công tác</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[200px]">Chức vụ</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[130px]">Đã nhận trong năm</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[180px]">Tình trạng</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[140px]">Người thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dsHienThi.length === 0 && (
                    <tr><td colSpan={8} className="px-3 py-10 text-center text-[#888]">Không có thẩm phán nào khớp điều kiện.</td></tr>
                  )}
                  {dsHienThi.map((r, i) => {
                    const nghi = dangNghi(r.hoTen, nghiPhep, homNay);
                    return (
                      <tr key={r.id} className="border-b border-[#eee] hover:bg-[#fafbfc] transition-colors">
                        <td className="px-3 py-2 text-[#555] align-top">{i + 1}</td>
                        <td className="px-3 py-2 font-medium text-[#222] align-top">{r.hoTen}</td>
                        <td className="px-3 py-2 align-top">
                          <OChon value={r.capBac} onChange={v => sua(r.id, "capBac")(v)}
                            options={[TP_BAC_3, "Thẩm phán TANDTC", "Thẩm phán bậc 2"].map(c => ({ v: c, t: c }))} />
                        </td>
                        <td className="px-3 py-2 align-top">
                          <OChon value={r.donVi} onChange={v => sua(r.id, "donVi")(v)}
                            options={DON_VI_CONG_TAC.map(d => ({ v: d, t: d }))} />
                        </td>
                        <td className="px-3 py-2 align-top">
                          <OChon value={r.chucVu} onChange={v => sua(r.id, "chucVu")(v)}
                            options={CHUC_VU_TP.map(c => ({ v: c, t: c }))} />
                        </td>
                        <td className="px-3 py-2 align-top">
                          <span className="text-[13px] font-semibold text-[#222]">{r.daNhan}</span>
                          <span className="text-[12px] text-[#888]"> vụ</span>
                        </td>
                        <td className="px-3 py-2 align-top">
                          {nghi ? (
                            <>
                              <span className="inline-block px-2 py-[2px] rounded text-[10px] font-medium border bg-[#fef3e2] text-[#b45309] border-[#fcd48a]">
                                Đang nghỉ · {nghi.loai}
                              </span>
                              <div className="text-[11px] text-[#666] mt-1">Đến {nghi.denNgay}</div>
                            </>
                          ) : (
                            <span className="inline-block px-2 py-[2px] rounded text-[10px] font-medium border bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]">
                              Đang làm việc
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <div className="font-medium text-[#222] text-[12px]">{r.nguoiThaoTac}</div>
                          <div className="text-[12px] text-[#c0392b]">{r.ngayThaoTac}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            {/* Tab Nghỉ phép */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-[12px] text-[#666]">
                Thẩm phán trong kỳ nghỉ <b>đã duyệt</b> sẽ bị loại khỏi danh sách phân công tự động trong khoảng thời gian đó.
              </div>
              <button onClick={() => setThemNghi(true)}
                className="flex items-center gap-1.5 h-[34px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[12px] font-medium transition-colors flex-shrink-0">
                <Plus size={13} /> Đăng ký nghỉ
              </button>
            </div>

            <div className="mt-3 border-t border-[#e5e5e5] overflow-x-auto">
              <table className="w-full border-collapse text-[13px] min-w-[1180px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    {["STT", "Thẩm phán", "Loại nghỉ", "Từ ngày", "Đến ngày", "Số ngày",
                      "Vụ đang cầm", "Xử lý vụ đang cầm", "Trạng thái", "Thao tác"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold text-[#333] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nghiPhep.length === 0 && (
                    <tr><td colSpan={10} className="px-3 py-10 text-center text-[#888]">Chưa có đăng ký nghỉ nào.</td></tr>
                  )}
                  {nghiPhep.map((n, i) => {
                    const tu = parseVNDate(n.tuNgay), den = parseVNDate(n.denNgay);
                    const soNgay = tu && den ? Math.max(0, Math.round((den.getTime() - tu.getTime()) / 86400000) + 1) : 0;
                    return (
                      <tr key={n.id} className="border-b border-[#eee] hover:bg-[#fafbfc] transition-colors">
                        <td className="px-3 py-2 text-[#555] align-top">{i + 1}</td>
                        <td className="px-3 py-2 font-medium text-[#222] align-top whitespace-nowrap">{n.thamPhan}</td>
                        <td className="px-3 py-2 align-top whitespace-nowrap">{n.loai}</td>
                        <td className="px-3 py-2 align-top whitespace-nowrap">{n.tuNgay}</td>
                        <td className="px-3 py-2 align-top whitespace-nowrap">{n.denNgay}</td>
                        <td className="px-3 py-2 align-top whitespace-nowrap">{soNgay} ngày</td>
                        <td className="px-3 py-2 align-top text-center">{n.vuDangCam}</td>
                        <td className="px-3 py-2 align-top">
                          <div>{XU_LY_VU_DANG_CAM[n.xuLy]?.split("—")[0].trim()}</div>
                          {n.xuLy === "chuyen-giao" && n.chuyenCho && (
                            <div className="text-[11px] text-[#1a5a96] mt-0.5">→ {n.chuyenCho}</div>
                          )}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-medium border whitespace-nowrap ${
                            n.trangThai === "Đã duyệt"
                              ? "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"
                              : "bg-[#fff4e5] text-[#8a5c00] border-[#f5c16b]"}`}>
                            {n.trangThai}
                          </span>
                        </td>
                        <td className="px-3 py-2 align-top whitespace-nowrap">
                          {n.trangThai === "Chờ duyệt" && (
                            <button onClick={() => setNghiPhep(p => p.map(x => x.id === n.id ? { ...x, trangThai: "Đã duyệt" } : x))}
                              className="text-[11px] text-[#1a7a45] hover:underline mr-2">Duyệt</button>
                          )}
                          <button onClick={() => setNghiPhep(p => p.filter(x => x.id !== n.id))}
                            className="text-[11px] text-[#c0392b] hover:underline">Xóa</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {themNghi && (
        <PopupDangKyNghi
          thamPhans={rows.map(r => r.hoTen)}
          onDong={() => setThemNghi(false)}
          onLuu={n => {
            setNghiPhep(p => [...p, { ...n, id: Date.now() }]);
            setThemNghi(false);
            setTab(1);
          }}
        />
      )}
    </div>
  );
};

const PopupDangKyNghi = ({ thamPhans, onDong, onLuu }: {
  thamPhans: string[];
  onDong: () => void;
  onLuu: (n: Omit<NghiPhepRow, "id">) => void;
}) => {
  const [thamPhan, setThamPhan] = useState("");
  const [loai, setLoai] = useState(LOAI_NGHI[0]);
  const [tuNgay, setTuNgay] = useState("");
  const [denNgay, setDenNgay] = useState("");
  const [xuLy, setXuLy] = useState("giu-nguyen");
  const [chuyenCho, setChuyenCho] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [daBam, setDaBam] = useState(false);

  const vnDate = (iso: string) => iso ? iso.split("-").reverse().join("/") : "";
  const thieu = !thamPhan || !tuNgay || !denNgay || (xuLy === "chuyen-giao" && !chuyenCho);
  const saiThuTu = !!tuNgay && !!denNgay && denNgay < tuNgay;

  const luu = () => {
    setDaBam(true);
    if (thieu || saiThuTu) return;
    onLuu({
      thamPhan, loai, tuNgay: vnDate(tuNgay), denNgay: vnDate(denNgay),
      xuLy, chuyenCho: xuLy === "chuyen-giao" ? chuyenCho : "",
      vuDangCam: 0, lyDo, trangThai: "Chờ duyệt",
    });
  };
  const loi = (rong: boolean) => daBam && rong;

  return (
    <div className="fixed inset-0 z-[210] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[6px] shadow-2xl w-[620px] max-w-[96vw] max-h-[94vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-[#1d2e4f] text-white flex-shrink-0">
          <span className="text-[15px] font-bold">Đăng ký nghỉ phép / vắng mặt</span>
          <button onClick={onDong} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FLbl><span className="text-[#c0392b] mr-1">*</span>Thẩm phán</FLbl>
              <div className="relative">
                <select value={thamPhan} onChange={e => setThamPhan(e.target.value)}
                  className={`w-full h-[34px] pl-2.5 pr-7 text-[12px] border rounded-[4px] bg-white appearance-none focus:outline-none ${loi(!thamPhan) ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]"}`}>
                  <option value="">-- Chọn thẩm phán --</option>
                  {thamPhans.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
            <div>
              <FLbl>Loại nghỉ</FLbl>
              <div className="relative">
                <select value={loai} onChange={e => setLoai(e.target.value)}
                  className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                  {LOAI_NGHI.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
            <div>
              <FLbl><span className="text-[#c0392b] mr-1">*</span>Từ ngày</FLbl>
              <FInp type="date" value={tuNgay} onChange={e => setTuNgay(e.target.value)} />
            </div>
            <div>
              <FLbl><span className="text-[#c0392b] mr-1">*</span>Đến ngày</FLbl>
              <FInp type="date" value={denNgay} onChange={e => setDenNgay(e.target.value)} />
              {saiThuTu && <div className="text-[11px] text-[#c0392b] mt-1">Đến ngày phải sau Từ ngày.</div>}
            </div>
          </div>

          {/* Chốt câu hỏi: vụ đang cầm xử lý thế nào */}
          <div>
            <FLbl>Xử lý vụ án đang giải quyết</FLbl>
            <div className="space-y-1.5 rounded-[4px] border border-[#e0e6ef] bg-[#f7f9fc] px-3 py-2.5">
              {Object.entries(XU_LY_VU_DANG_CAM).map(([k, t]) => (
                <label key={k} className="flex items-start gap-2 cursor-pointer text-[12px] text-[#333]">
                  <input type="radio" name="xu-ly-vu" className="w-[14px] h-[14px] accent-[#8b1a1a] mt-[2px]"
                    checked={xuLy === k} onChange={() => setXuLy(k)} />
                  <span>{t}</span>
                </label>
              ))}
              {xuLy === "chuyen-giao" && (
                <div className="pl-6 pt-1">
                  <div className="relative max-w-[300px]">
                    <select value={chuyenCho} onChange={e => setChuyenCho(e.target.value)}
                      className={`w-full h-[32px] pl-2.5 pr-7 text-[12px] border rounded-[4px] bg-white appearance-none focus:outline-none ${loi(!chuyenCho) ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]"}`}>
                      <option value="">-- Chọn thẩm phán tiếp nhận --</option>
                      {thamPhans.filter(t => t !== thamPhan).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <FLbl>Lý do</FLbl>
            <textarea value={lyDo} onChange={e => setLyDo(e.target.value)} rows={2}
              placeholder="Nhập lý do nghỉ"
              className="w-full px-2.5 py-2 text-[12px] border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#1a5a96] placeholder:text-[#aaa] resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e5e5e5] bg-[#fafafa]">
          <BtnSecondary onClick={onDong}>Hủy</BtnSecondary>
          <BtnPrimary onClick={luu}>Lưu</BtnPrimary>
        </div>
      </div>
    </div>
  );
};

// ─── In danh sách đơn theo bộ lọc ────────────────────────────────────────────
// In đúng những đơn đang hiển thị theo bộ lọc/tab của màn Danh sách đơn.
const PopupInDanhSachDon = ({ rows, moTaBoLoc, onDong }: {
  rows: DanhSachDonRow[];
  moTaBoLoc: string[];
  onDong: () => void;
}) => {
  const homNay = new Date().toLocaleDateString("vi-VN");

  return (
    <div className="fixed inset-0 z-[210] bg-black/50 flex items-center justify-center p-4">
      {/* Khi in: ẩn giao diện, chỉ để lại vùng danh sách */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #khu-vuc-in-ds, #khu-vuc-in-ds * { visibility: visible !important; }
          #khu-vuc-in-ds {
            position: absolute !important; left: 0 !important; top: 0 !important;
            width: 100% !important; height: auto !important; max-height: none !important;
            overflow: visible !important; padding: 0 !important; background: #fff !important;
          }
          #khu-vuc-in-ds table { font-size: 11px !important; }
          #khu-vuc-in-ds tr { break-inside: avoid; }
          @page { size: A4 landscape; margin: 12mm; }
        }
      `}</style>

      <div className="bg-white rounded-[6px] shadow-2xl w-[1240px] max-w-[96vw] max-h-[94vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-[#1d2e4f] text-white flex-shrink-0">
          <span className="text-[15px] font-bold">In danh sách đơn</span>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} disabled={rows.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-[4px] bg-white/15 hover:bg-white/25 disabled:opacity-40 disabled:hover:bg-white/15 transition-colors">
              <Printer size={14} /> In
            </button>
            <button onClick={onDong} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Vùng in */}
        <div id="khu-vuc-in-ds" className="flex-1 overflow-auto bg-[#e9ecef] p-5">
          <div className="bg-white mx-auto p-8 shadow-sm" style={{ maxWidth: 1120 }}>
            <div className="text-center mb-4">
              <div className="text-[12px] uppercase tracking-wide text-[#333]">Tòa án nhân dân tối cao</div>
              <div className="text-[17px] font-bold uppercase mt-1 text-[#111]">Danh sách đơn</div>
              <div className="text-[12px] text-[#555] mt-1">Ngày in: {homNay}</div>
            </div>

            <div className="text-[12px] text-[#333] mb-3 leading-relaxed">
              <div><b>Điều kiện lọc:</b> {moTaBoLoc.length ? moTaBoLoc.join(" · ") : "Không áp dụng bộ lọc"}</div>
              <div><b>Tổng cộng:</b> {rows.length} đơn</div>
            </div>

            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f0f0f0]">
                  {[["STT", "w-[34px]"], ["Mã đơn", "w-[68px]"], ["Người gửi / đơn vị gửi", "w-[190px]"],
                    ["Hình thức đơn", "w-[120px]"], ["Số BA/QĐ", "w-[100px]"], ["Ngày BA/QĐ", "w-[76px]"],
                    ["Tòa xét xử", "w-[140px]"], ["Hình thức tiếp nhận", "w-[74px]"],
                    ["Thẩm phán", "w-[120px]"], ["Trạng thái giải quyết", "w-[86px]"],
                    ["Người nhập", "w-[96px]"], ["Ngày nhập", "w-[76px]"]].map(([h, w]) => (
                    <th key={h} className={`border border-[#999] px-2 py-[6px] text-left font-semibold text-[#222] ${w}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={12} className="border border-[#999] px-2 py-8 text-center text-[#888]">
                      Không có đơn nào khớp bộ lọc.
                    </td>
                  </tr>
                )}
                {rows.map((r, i) => {
                  const d = r.thongTinDon ?? ({} as DanhSachDonRow["thongTinDon"]);
                  // Thẩm phán lưu kèm chức danh + số văn bản trong ngoặc, bản in chỉ cần tên
                  const tenThamPhan = vietTatTAND(d.thamPhan || "").split("(")[0].trim();
                  return (
                    <tr key={r.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                      <td className="border border-[#999] px-2 py-[5px] text-center align-top">{i + 1}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top whitespace-nowrap">{r.maDon.trim()}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top">
                        <div>{vietTatTAND(r.nguoiGui)}</div>
                        {r.diaChi && <div className="text-[11px] text-[#666]">{vietTatTAND(r.diaChi)}</div>}
                      </td>
                      <td className="border border-[#999] px-2 py-[5px] align-top">{d.hinhThuc || r.loaiHinhThuc}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top">{d.soBaqd || "—"}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top whitespace-nowrap">{d.ngay || "—"}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top">{vietTatTAND(d.toaXetXu) || "—"}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top">{r.hinhThucTiepNhan || "—"}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top">{tenThamPhan || "—"}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top">{r.giaiQuyet?.nhan || "Chưa có"}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top">{r.nguoiNhap}</td>
                      <td className="border border-[#999] px-2 py-[5px] align-top whitespace-nowrap">{r.ngayNhap}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-end mt-8 text-[12px] text-[#222]">
              <div className="text-center w-[260px]">
                <div className="italic">Hà Nội, ngày {homNay}</div>
                <div className="font-semibold uppercase mt-1">Người lập danh sách</div>
                <div className="text-[#777] mt-12">(Ký, ghi rõ họ tên)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DanhSachDon screen ───────────────────────────────────────────────────────
const DanhSachDon = ({ onThemMoi, onBieuMau, onWordEditor, onEditRow, isTruongPhong, currentRole = "can-bo", onCreateToTrinh, onTaoVanBan, onDongPopupVanBan, vanBanList, onMoVanBan, khangNghi }: { onThemMoi: () => void; onBieuMau?: (row: typeof SAMPLE_ROWS[0]) => void; onWordEditor?: () => void; onEditRow?: (id: number) => void; isTruongPhong?: boolean;
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao";
  onCreateToTrinh?: (t: ToTrinh) => void;
  /** Popup "Tạo văn bản & trình ký" trả kết quả lên App để đẩy vào kho chung. */
  onTaoVanBan?: (kq: KetQuaTrinhDuyet) => void;
  /** Popup đóng hẳn (sau khi người dùng xem xong hộp thoại "Trình duyệt thành công").
   *  Điều hướng sang màn theo dõi xảy ra ở đây, không phải lúc bấm Trình duyệt. */
  onDongPopupVanBan?: () => void;
  /** Kho văn bản dùng chung — để biết đơn nào đã nằm trong tờ trình nào. */
  vanBanList?: VanBanTrinh[];
  onMoVanBan?: (id: string) => void;
  khangNghi?: boolean;   // dùng lại nguyên màn Danh sách đơn cho Hồ sơ kháng nghị
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showNumberingModal, setShowNumberingModal] = useState<number | null>(null);
  const [assignmentNotice, setAssignmentNotice] = useState<string>("");
  const [assignmentMode, setAssignmentMode] = useState<"none" | "ngau-nhien" | "chi-dinh">("none");
  const [selectedOfficer, setSelectedOfficer] = useState<string>("");
  const OFFICERS = ["Nguyễn Văn An", "Trần Thị Bình", "Lê Thị Hà", "Phạm Văn Đức", "Hoàng Thị Thu"];
  const [rows, setRows] = useState<DanhSachDonRow[]>(SAMPLE_ROWS);

  // Mã đơn → mô tả văn bản đang chứa nó. Đưa thẳng vào hệ thống "đơn không hợp lệ"
  // của popup lấy số thay vì dựng một cảnh báo song song với con số riêng.
  const donTrungMap = useMemo(() => {
    const m: Record<string, string> = {};
    rows.forEach(r => {
      const vbs = timVanBanTheoDon(vanBanList ?? [], r.maDon);
      if (!vbs.length) return;
      // Ưu tiên bản đã có số — cụ thể hơn với người dùng.
      const dd = vbs.find(v => v.soVanBan) ?? vbs[0];
      const ten = dd.soVanBan ?? "văn bản chưa cấp số";
      m[r.maDon] = vbs.length > 1
        ? `${ten} (${TRANG_THAI_NHAN[dd.trangThai]}) và ${vbs.length - 1} văn bản khác`
        : `${ten} (${TRANG_THAI_NHAN[dd.trangThai]})`;
    });
    return m;
  }, [rows, vanBanList]);

  // ── State bộ lọc cơ bản ──
  const [fKeyword, setFKeyword] = useState("");
  const [fSoToTrinh, setFSoToTrinh] = useState("");
  const [fMaDon, setFMaDon] = useState("");
  const [fNguoiGui, setFNguoiGui] = useState("");
  const [fSoBA, setFSoBA] = useState("");
  const [fToaBA, setFToaBA] = useState("");
  const [fNgayNhapFrom, setFNgayNhapFrom] = useState("");
  const [fNgayNhapTo, setFNgayNhapTo] = useState("");
  // ── State bộ lọc nâng cao ──
  const [fHinhThucNhan, setFHinhThucNhan] = useState("");
  const [fNguoiNhap, setFNguoiNhap] = useState("");
  const [fNgayBAFrom, setFNgayBAFrom] = useState("");
  const [fNgayBATo, setFNgayBATo] = useState("");
  // Các ô ở panel nâng cao chưa có dữ liệu để lọc — gom 1 chỗ cho gọn
  const [advUI, setAdvUI] = useState<Record<string, string>>({});
  const ui = (k: string) => advUI[k] ?? "";
  const setUi = (k: string) => (v: string) => setAdvUI(p => ({ ...p, [k]: v }));

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
  const [showInDanhSach, setShowInDanhSach] = useState(false);
  const [historyRow, setHistoryRow] = useState<DanhSachDonRow | null>(null);
  const [trinhKyRow, setTrinhKyRow] = useState<DanhSachDonRow | null>(null);
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
  // Chọn tất cả = chọn tất cả dòng ĐANG hiển thị, không phải toàn bộ dữ liệu
  const toggleAll = (checked: boolean) =>
    setSelectedRows(checked ? filteredRows.map(r => r.id) : []);

  useEffect(() => {
    const groups = rows.reduce((acc: Record<string, DanhSachDonRow[]>, row) => {
      const caseKey = `${row.thongTinDon.soBaqd}|${row.ngayNhap}`;
      // Đơn đang chờ ý kiến LĐ giữ nguyên trạng thái theo kết luận của LĐ,
      // không để nhãn ghép đơn tự động đè lên
      if (row.choYKienLD) return acc;
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

  // Đơn thuộc tab "Chờ ý kiến LĐ" bên màn Nhận đơn và TL vụ án: trạng thái
  // giải quyết lấy theo kết luận của Lãnh đạo. Thay ngay từ đây để tab, bộ lọc
  // và cột Thông tin giải quyết cùng ăn theo một nguồn.
  const vLD = useKetLuanLD();
  const rowsLD = useMemo(() => rows.map(r => {
    if (!r.choYKienLD) return r;
    const nhan = layKetLuanLD(r.choYKienLD) ?? CHO_Y_KIEN_LD;
    return { ...r, giaiQuyet: { ...r.giaiQuyet, nhan, color: MAU_KET_LUAN_LD[nhan] } };
  }), [rows, vLD]);

  // ── Engine lọc ────────────────────────────────────────────────────────────
  // Mọi điều kiện cộng dồn với nhau (AND). Ô rỗng = bỏ qua điều kiện đó.
  // Tách khỏi điều kiện tab để số đếm trên tab phản ánh đúng các bộ lọc đang áp.
  const rowsByFilters = useMemo(() => rowsLD.filter(r => {
    const d = r.thongTinDon ?? ({} as DanhSachDonRow["thongTinDon"]);
    const trangThai = r.giaiQuyet?.nhan ?? "";

    // Luật nghiệp vụ: Loại văn bản giới hạn trạng thái đơn được phép
    const chiTrangThai = LOAI_VB_TRANG_THAI[loaiVanBan];
    if (chiTrangThai && !chiTrangThai.includes(trangThai)) return false;

    // Từ khóa chung — quét các trường văn bản đáng kể
    if (fKeyword) {
      const pool = [r.nguoiGui, r.diaChi, r.maDon, r.loaiHinhThuc, r.nguoiNhap,
        d.soBaqd, d.toaXetXu, d.thuTuc, d.hinhThuc, d.soCV, d.loaiCV,
        d.donViGui, d.thamPhan, d.donViGiaiQuyet, trangThai, r.giaiQuyet?.stl];
      if (!pool.some(v => contains(v, fKeyword))) return false;
    }

    if (fSoToTrinh && !contains(r.giaiQuyet?.stl, fSoToTrinh) && !contains(d.soCV, fSoToTrinh)) return false;
    if (fMaDon && !contains(r.maDon, fMaDon)) return false;
    if (fNguoiGui && !contains(r.nguoiGui, fNguoiGui)) return false;
    if (fSoBA && !contains(d.soBaqd, fSoBA)) return false;
    if (fToaBA && d.toaXetXu !== fToaBA) return false;
    if (!inDateRange(r.ngayNhap, fNgayNhapFrom, fNgayNhapTo)) return false;

    if (fHinhThuc) {
      const muc = chuanHoaHinhThuc(fHinhThuc);
      if (chuanHoaHinhThuc(d.hinhThuc) !== muc && chuanHoaHinhThuc(r.loaiHinhThuc) !== muc) return false;
    }
    if (fHinhThucNhan && r.hinhThucTiepNhan !== fHinhThucNhan) return false;
    if (fLoaiAn && r.loaiAn !== fLoaiAn) return false;
    if (fNguoiNhap && r.nguoiNhap !== fNguoiNhap) return false;
    if (fNoiChuyen && r.thongTinChuyenDon !== fNoiChuyen) return false;
    if (fThuLy && trangThai !== fThuLy) return false;
    if (!inDateRange(d.ngay, fNgayBAFrom, fNgayBATo)) return false;

    // "Trạng thái đơn" là suy diễn: chưa đủ điều kiện vs còn lại
    if (fTrangThai === "Đơn không đủ điều kiện" && trangThai !== "Chưa đủ điều kiện") return false;
    if (fTrangThai === "Đơn đủ điều kiện" && trangThai === "Chưa đủ điều kiện") return false;

    return true;
  }), [rowsLD, loaiVanBan, fKeyword, fSoToTrinh, fMaDon, fNguoiGui, fSoBA, fToaBA,
    fNgayNhapFrom, fNgayNhapTo, fHinhThuc, fHinhThucNhan, fLoaiAn, fNguoiNhap,
    fNoiChuyen, fThuLy, fNgayBAFrom, fNgayBATo, fTrangThai]);

  const filteredRows = useMemo(
    () => rowsByFilters.filter(TAB_MATCH[activeTab] ?? (() => true)),
    [rowsByFilters, activeTab]);

  const tabs = [
    { label: "Tổng số", count: rowsByFilters.length },
    { label: "Đơn của tôi", count: rowsByFilters.filter(TAB_MATCH[1]).length },
    { label: "Đơn Thụ lý", count: rowsByFilters.filter(TAB_MATCH[2]).length },
    { label: "Chưa đủ điều kiện", count: rowsByFilters.filter(TAB_MATCH[3]).length },
    { label: "Hết thời hạn kháng nghị", count: rowsByFilters.filter(TAB_MATCH[4]).length },
    { label: "Khác", count: rowsByFilters.filter(TAB_MATCH[5]).length },
  ];

  // Danh sách tòa cho ô "Tòa ra bản án" — lấy từ chính dữ liệu
  const toaOptions = useMemo(
    () => [...new Set(rows.map(r => r.thongTinDon?.toaXetXu).filter(Boolean))].sort(),
    [rows]);

  // Tên cán bộ nhập bị trùng giữa 2 người khác nhau → cột Người nhập/Sửa phải
  // kèm ngày sinh thì mới phân biệt được.
  const tenCanBoTrungLap = useMemo(() => {
    const theoTen: Record<string, Set<string>> = {};
    rows.forEach(r => {
      if (!r.nguoiNhap) return;
      (theoTen[r.nguoiNhap] ??= new Set()).add(ngaySinhCanBo(r));
    });
    return new Set(Object.keys(theoTen).filter(ten => theoTen[ten].size > 1));
  }, [rows]);
  const nguoiNhapOptions = useMemo(
    () => [...new Set(rows.map(r => r.nguoiNhap).filter(Boolean))].sort(),
    [rows]);

  const soBoLocDangApp = [fKeyword, fSoToTrinh, fMaDon, fNguoiGui, fSoBA, fToaBA,
    fNgayNhapFrom, fNgayNhapTo, fHinhThuc, fHinhThucNhan, fLoaiAn, fNguoiNhap,
    fNoiChuyen, fThuLy, fNgayBAFrom, fNgayBATo, fTrangThai, loaiVanBan].filter(Boolean).length;

  // Mô tả bộ lọc đang áp — in kèm lên đầu danh sách để biết bản in lấy theo gì
  const moTaBoLoc = useMemo(() => ([
    ["Từ khóa", fKeyword], ["Số tờ trình", fSoToTrinh], ["Mã đơn", fMaDon],
    ["Người gửi", fNguoiGui], ["Số BA/QĐ", fSoBA], ["Tòa xét xử", fToaBA],
    ["Ngày nhập từ", fNgayNhapFrom], ["Ngày nhập đến", fNgayNhapTo],
    ["Hình thức đơn", fHinhThuc], ["Hình thức nhận", fHinhThucNhan],
    ["Loại án", fLoaiAn], ["Người nhập", fNguoiNhap], ["Nơi chuyển đến", fNoiChuyen],
    ["Thụ lý đơn", fThuLy], ["Ngày BA từ", fNgayBAFrom], ["Ngày BA đến", fNgayBATo],
    ["Trạng thái đơn", fTrangThai], ["Loại văn bản", loaiVanBan],
  ] as [string, string][])
    .filter(([, v]) => Boolean(v))
    .map(([k, v]) => `${k}: ${v}`)
    .concat(activeTab > 0 ? [`Tab: ${tabs[activeTab]?.label ?? ""}`] : []),
    [fKeyword, fSoToTrinh, fMaDon, fNguoiGui, fSoBA, fToaBA, fNgayNhapFrom, fNgayNhapTo,
      fHinhThuc, fHinhThucNhan, fLoaiAn, fNguoiNhap, fNoiChuyen, fThuLy,
      fNgayBAFrom, fNgayBATo, fTrangThai, loaiVanBan, activeTab, tabs]);

  // In danh sách: ưu tiên các dòng đang tích, không tích thì lấy toàn bộ kết quả lọc
  const rowsDeIn = selectedRows.length
    ? filteredRows.filter(r => selectedRows.includes(r.id))
    : filteredRows;

  const xoaBoLoc = () => {
    setFKeyword(""); setFSoToTrinh(""); setFMaDon(""); setFNguoiGui(""); setFSoBA("");
    setFToaBA(""); setFNgayNhapFrom(""); setFNgayNhapTo(""); setFHinhThuc("");
    setFHinhThucNhan(""); setFLoaiAn(""); setFNguoiNhap(""); setFNoiChuyen("");
    setFDonVi(""); setFThuLy(""); setFNgayBAFrom(""); setFNgayBATo(""); setFTrangThai("");
    setFAnTuHinhSelect(""); setLoaiVanBan(""); setAdvUI({});
  };

  return (
    <div className="bg-[#eef1f5] min-h-full">
      <div className="p-3 space-y-3">

        {/* Title */}
        <h2 className="text-[15px] font-semibold text-[#222]">{khangNghi ? "Hồ sơ kháng nghị" : "Danh sách đơn"}</h2>

        {/* Card */}
        <div className="bg-white border border-[#ddd] rounded-[3px]">

          {/* Tabs — về tab "Tổng số" thì ô Loại văn bản bị ẩn, nên xóa luôn giá
              trị để không còn bộ lọc chạy ngầm mà người dùng không nhìn thấy.
              Hồ sơ kháng nghị chỉ có một danh sách duy nhất → không có tabs. */}
          {!khangNghi && (
          <div className="flex items-end border-b border-[#ddd] px-3 pt-2 gap-0">
            {tabs.map((t, i) => (
              <button key={i} onClick={() => { setActiveTab(i); if (i === 0) setLoaiVanBan(""); }}
                className={`px-4 py-[7px] text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#222]"
                  }`}>
                {t.label}
                {t.label === "Đơn của tôi"}
                <span className={`ml-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${activeTab === i ? "bg-[#8b1a1a] text-white" : "bg-[#eee] text-[#666]"
                  }`}>{t.count}</span>
              </button>
            ))}

          </div>
          )}

          {/* "Đơn của tôi" filter notice */}
          {!khangNghi && activeTab === 1 && (
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
                <div className="col-span-2"><FLbl>Từ khóa tìm kiếm chung</FLbl><FInp placeholder="Nhập bất kỳ thông tin nào (người gửi, nội dung...)" value={fKeyword} onChange={e => setFKeyword(e.target.value)} /></div>
                <div><FLbl>Số tờ trình / Văn bản</FLbl><FInp placeholder="Nhập số tờ trình/văn bản" value={fSoToTrinh} onChange={e => setFSoToTrinh(e.target.value)} /></div>
                <div><FLbl>Mã đơn / Số hiệu đơn</FLbl><FInp placeholder="Nhập mã đơn" value={fMaDon} onChange={e => setFMaDon(e.target.value)} /></div>
                <div><FLbl>Hình thức đơn</FLbl><FSel value={fHinhThuc} onChange={(e: any) => setFHinhThuc(e.target.value)}><option value="">Tất cả hình thức</option>{optionsHinhThucDon()}</FSel></div>
                <div><FLbl>Người gửi</FLbl><FInp placeholder="Nhập tên người gửi" value={fNguoiGui} onChange={e => setFNguoiGui(e.target.value)} /></div>
              </div>

              {/* Row 2 — luôn hiện */}
              <div className="grid grid-cols-6 gap-x-3 items-end mt-3">
                <div><FLbl>Số bản án/QĐ</FLbl><FInp placeholder="Nhập số bản án/QĐ" value={fSoBA} onChange={e => setFSoBA(e.target.value)} /></div>
                <div><FLbl>Tòa ra bản án / quyết định</FLbl><FSel value={fToaBA} onChange={(e: any) => setFToaBA(e.target.value)}><option value="">Chọn tòa</option>{toaOptions.map(o => <option key={o} value={o}>{vietTatTAND(o)}</option>)}</FSel></div>
                <div><FLbl>Ngày nhập</FLbl><FDateRange from={fNgayNhapFrom} to={fNgayNhapTo} onFrom={setFNgayNhapFrom} onTo={setFNgayNhapTo} /></div>
                
                {/* Thu gọn: 3 ô còn lại dành cho nút (luôn hiện ở filter cơ bản).
                    Cả 3 nút cùng cao 32px, cùng bo góc — Tìm kiếm là nút đặc,
                    hai nút còn lại là viền nhẹ để không tranh chấp thị giác. */}
                <div className="col-span-3 flex items-center justify-end gap-2 h-[30px]">
                  {/* Bấm lần nữa thì thu gọn luôn */}
                  <button onClick={() => setCollapsed(c => !c)}
                    className={`inline-flex items-center gap-1.5 h-[32px] px-3 rounded-[4px] border text-[12px] font-medium whitespace-nowrap transition-colors ${
                      collapsed
                        ? "text-[#555] bg-white border-[#ccc] hover:bg-[#f5f5f5] hover:border-[#bbb]"
                        : "text-[#8b1a1a] bg-[#fdecea] border-[#e0a9a4] hover:bg-[#fbdcd9]"}`}>
                    <SlidersHorizontal size={13} />
                    Bộ lọc nâng cao
                    <ChevronDown size={13} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
                  </button>
                  <button onClick={() => setCollapsed(true)}
                    className="inline-flex items-center gap-1.5 h-[32px] px-4 rounded-[4px] bg-[#8b1a1a] hover:bg-[#6e1414] active:bg-[#5a1010] text-white text-[12px] font-semibold whitespace-nowrap shadow-sm transition-colors">
                    <Search size={13} />
                    Tìm kiếm
                  </button>
                  <button onClick={xoaBoLoc}
                    className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-[4px] border border-[#ccc] bg-white text-[12px] text-[#555] whitespace-nowrap transition-colors hover:bg-[#f5f5f5] hover:border-[#bbb]">
                    <RotateCcw size={13} />
                    Làm mới
                    {soBoLocDangApp > 0 && (
                      <span className="ml-0.5 min-w-[16px] text-center bg-[#8b1a1a] text-white text-[10px] font-semibold px-1 py-[1px] rounded-full leading-[1.3]">
                        {soBoLocDangApp}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* ── Bộ lọc nâng cao: panel inline ngay trên màn Danh sách đơn ── */}
              {!collapsed && (
                <div className="mt-2 border border-[#ccc] rounded-[3px] bg-white">
                  <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#ddd] bg-[#f7f9fb]">
                    <span className="text-[12px] font-bold text-[#1d2e4f]">Tìm kiếm nâng cao</span>
                    <button onClick={() => setCollapsed(true)} className="text-[12px] text-[#1a73e8] hover:underline">
                      [ Thu gọn ]
                    </button>
                    <label className="ml-auto flex items-center gap-1.5 text-[12px] text-[#333] cursor-pointer">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={ui("daGiaiQuyetCapCao") === "1"}
                        onChange={e => setUi("daGiaiQuyetCapCao")(e.target.checked ? "1" : "")} />
                      Đơn đã giải quyết xong từ tòa Cấp cao
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-x-7 px-3 py-2">

                    {/* ── Cột 1 ──
                        Các ô Người gửi / Tòa ra BA-QĐ / Hình thức đơn đã có ở bộ
                        lọc cơ bản phía trên nên không lặp lại ở đây. */}
                    <div>
                      <TRow label="Địa chỉ gửi đơn">
                        <TSel value={ui("diaChiGui")} onChange={e => setUi("diaChiGui")(e.target.value)}>
                          <option value="">Tỉnh/Huyện</option>
                          {TINH_TP.map(o => <option key={o}>{o}</option>)}
                        </TSel>
                      </TRow>
                      <TRow label="Hình thức nhận">
                        <TSel value={fHinhThucNhan} onChange={e => setFHinhThucNhan(e.target.value)}>
                          <option value="">--- Tất cả ---</option>
                          <option>Bưu điện</option><option>Điện tử</option><option>Trực tiếp</option>
                          <option>Trực tuyến</option><option>Nội bộ</option><option>Tiếp công dân</option>
                        </TSel>
                      </TRow>
                      <TRow label="Ngày thụ lý từ" bold>
                        <TDate value={ui("thuLyTu")} onChange={setUi("thuLyTu")} />
                      </TRow>
                      <TRow label="Phạm vi tìm kiếm">
                        <TSel value={ui("phamVi")} onChange={e => setUi("phamVi")(e.target.value)}>
                          <option value="">Tất cả</option>
                          <option>Đơn vị của tôi</option>
                          <option>Toàn hệ thống</option>
                        </TSel>
                      </TRow>
                      <TRow label="Tên cơ quan chuyển đơn">
                        <TInp value={ui("coQuanChuyen")} onChange={e => setUi("coQuanChuyen")(e.target.value)} />
                      </TRow>
                      <TRow label="Thẩm phán">
                        <div className="grid grid-cols-[112px_1fr] gap-1.5">
                          <TSel value={ui("bacTP")} onChange={e => setUi("bacTP")(e.target.value)}>
                            <option>Thẩm phán bậc 3</option>
                            <option>Thẩm phán TANDTC</option>
                          </TSel>
                          <TSel value={ui("tenTP")} onChange={e => setUi("tenTP")(e.target.value)}>
                            <option value="">--- Chọn ---</option>
                            <option>Nguyễn Thế Lệ - 20/10/1966</option>
                            <option>Ngô Hồng Phúc - 05/02/1970</option>
                            <option>Nguyễn Như Thắng - 18/07/1973</option>
                          </TSel>
                        </div>
                      </TRow>
                      <TRow label="Nơi chuyển" bold>
                        <TSel value={fNoiChuyen} onChange={e => { setFNoiChuyen(e.target.value); setFDonVi(""); }}>
                          <option value="">--- Tất cả ---</option>
                          <option>Nội bộ</option><option>Tòa khác</option><option>Ngoài tòa án</option>
                        </TSel>
                      </TRow>
                      <TRow label="Chuyển tới CA/TA?">
                        <TSel value={ui("chuyenCATA")} onChange={e => setUi("chuyenCATA")(e.target.value)}>
                          <option value="">--Tất cả--</option><option>Có</option><option>Không</option>
                        </TSel>
                      </TRow>
                      <TRow label="Ngày chuyển từ">
                        <TDate value={ui("chuyenTu")} onChange={setUi("chuyenTu")} />
                      </TRow>
                      <TRow label="Án tử hình">
                        <TSel value={fAnTuHinhSelect} onChange={e => setFAnTuHinhSelect(e.target.value)}>
                          <option value="">--- Tất cả ---</option><option>Có</option><option>Không</option>
                        </TSel>
                      </TRow>
                      <TRow label="Trạng thái chuyển">
                        <TSel value={ui("ttChuyen")} onChange={e => setUi("ttChuyen")(e.target.value)}>
                          <option value="">--- Tất cả ---</option>
                          <option>Chưa chuyển</option><option>Đã chuyển</option><option>Đã nhận</option>
                        </TSel>
                      </TRow>
                    </div>

                    {/* ── Cột 2 ──
                        Số BA/QĐ và khoảng Ngày nhập đã nằm ở bộ lọc cơ bản. */}
                    <div>
                      <TRow label="Địa chỉ chi tiết">
                        <TInp value={ui("diaChiCT")} onChange={e => setUi("diaChiCT")(e.target.value)} />
                      </TRow>
                      <TRow label="Số CMND/CCCD">
                        <TInp value={ui("cccd")} onChange={e => setUi("cccd")(e.target.value)} />
                      </TRow>
                      <TRow label="Nhận đơn từ">
                        <TDate value={ui("nhanDonTu")} onChange={setUi("nhanDonTu")} />
                      </TRow>
                      <TRow label="Số CV/PC đến">
                        <TInp value={ui("soCVPC")} onChange={e => setUi("soCVPC")(e.target.value)} />
                      </TRow>
                      <TRow label="Lãnh đạo chỉ đạo?">
                        <TSel value={ui("lanhDaoChiDao")} onChange={e => setUi("lanhDaoChiDao")(e.target.value)}>
                          <option value="">---Tất cả---</option><option>Có</option><option>Không</option>
                        </TSel>
                      </TRow>
                      {/* Ngang hàng với "Hình thức công văn" ở cột 1, dùng chung danh sách */}
                      <TRow label="Loại công văn">
                        <div className="grid grid-cols-[1fr_96px] gap-1.5">
                          <TSel value={ui("loaiCongVan")} onChange={e => setUi("loaiCongVan")(e.target.value)}>
                            <option value="">-- Chọn loại công văn --</option>
                            {LOAI_CONG_VAN_LE.map(o => <option key={o}>{o}</option>)}
                            {LOAI_CONG_VAN_NHOM.map(g => (
                              <optgroup key={g.label} label={g.label}>
                                {g.items.map(o => <option key={o}>{o}</option>)}
                              </optgroup>
                            ))}
                          </TSel>
                          <TInp value={ui("soCVChuyenDen")} onChange={e => setUi("soCVChuyenDen")(e.target.value)}
                            placeholder="Nhập số" />
                        </div>
                      </TRow>
                      <TRow label="Chuyển đến" bold>
                        <TSel value={fDonVi} onChange={e => setFDonVi(e.target.value)}>
                          <option value="">--- Tất cả ---</option>
                          <option>Vụ Pháp chế và Quản lý khoa học</option>
                          <option>Vụ Giám đốc kiểm tra về hình sự</option>
                          <option>Vụ Giám đốc kiểm tra về dân sự</option>
                          <option>Vụ Giám đốc kiểm tra về hành chính</option>
                        </TSel>
                      </TRow>
                      <TRow label="Loại án">
                        <TSel value={fLoaiAn} onChange={e => setFLoaiAn(e.target.value)}>
                          <option value="">Tất cả</option>
                          <option>Hình sự</option><option>Dân sự</option><option>Hành chính</option>
                          <option>KDTM</option><option>HN-GĐ</option><option>Lao động</option>
                        </TSel>
                      </TRow>
                      <TRow label="Ngày BA/QĐ từ">
                        <TDate value={fNgayBAFrom} onChange={setFNgayBAFrom} />
                      </TRow>
                      <TRow label="Đến ngày">
                        <TDate value={fNgayBATo} onChange={setFNgayBATo} />
                      </TRow>
                      <TRow label="Người nhập">
                        <TSel value={fNguoiNhap} onChange={e => setFNguoiNhap(e.target.value)}>
                          <option value="">...chọn...</option>
                          {nguoiNhapOptions.map(o => <option key={o}>{o}</option>)}
                        </TSel>
                      </TRow>
                    </div>

                    {/* ── Cột 3 ──
                        Mã đơn/Số hiệu đơn và Số thụ lý (Số tờ trình/Văn bản) đã
                        nằm ở bộ lọc cơ bản. */}
                    <div>
                      <TRow label="Trả lời đơn">
                        <TSel value={ui("traLoiDon")} onChange={e => setUi("traLoiDon")(e.target.value)}>
                          <option value="">--- Tất cả ---</option><option>Đã trả lời</option><option>Chưa trả lời</option>
                        </TSel>
                      </TRow>
                      <TRow label="Ngày CV/PC">
                        <TDate value={ui("ngayCVPC")} onChange={setUi("ngayCVPC")} />
                      </TRow>
                      <TRow label="Ngày thụ lý đến">
                        <TDate value={ui("thuLyDen")} onChange={setUi("thuLyDen")} />
                      </TRow>
                      <TRow label="Nhận đơn đến">
                        <TDate value={ui("nhanDonDen")} onChange={setUi("nhanDonDen")} />
                      </TRow>
                      <TRow label="Ngày chuyển đến">
                        <TDate value={ui("chuyenDen")} onChange={setUi("chuyenDen")} />
                      </TRow>
                      <TRow label="Trại giam?">
                        <TSel value={ui("traiGiam")} onChange={e => setUi("traiGiam")(e.target.value)}>
                          <option value="">--- Tất cả ---</option><option>Có</option><option>Không</option>
                        </TSel>
                      </TRow>
                      <TRow label="Trạng thái đơn">
                        <TSel value={fTrangThai} onChange={e => setFTrangThai(e.target.value)}>
                          <option value="">--- Tất cả ---</option>
                          <option>Đơn đủ điều kiện</option><option>Đơn không đủ điều kiện</option>
                        </TSel>
                      </TRow>
                      <TRow label="Thụ lý đơn">
                        <TSel value={fThuLy} onChange={e => setFThuLy(e.target.value)}>
                          <option value="">--Tất cả--</option>
                          <option>Thụ lý mới</option><option>Đã thụ lý</option>
                          <option>Chờ ý kiến Lãnh đạo</option><option>Không</option>
                        </TSel>
                      </TRow>
                      <TRow label="Thủ tục giải quyết">
                        <TSel value={ui("thuTuc")} onChange={e => setUi("thuTuc")(e.target.value)}>
                          <option value="">--Tất cả--</option>
                          <option>Giám đốc thẩm</option><option>Tái thẩm</option>
                        </TSel>
                      </TRow>
                      <TRow label="Số QĐKN">
                        <TInp value={ui("soQDKN")} onChange={e => setUi("soQDKN")(e.target.value)} />
                      </TRow>
                      <TRow label="Người kháng nghị">
                        <TInp value={ui("nguoiKN")} onChange={e => setUi("nguoiKN")(e.target.value)} />
                      </TRow>
                      <TRow label="Ngày QĐKN">
                        <TDate value={ui("ngayQDKN")} onChange={setUi("ngayQDKN")} />
                      </TRow>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Action bar sau tìm kiếm ── */}
          <div className="flex flex-col gap-0 border-b border-[#ddd]">
            {/* Loại văn bản đứng cùng hàng với nhóm nút thao tác */}
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-[#f5f5f5]">
              {activeTab !== 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#333] whitespace-nowrap">Loại văn bản:</span>
                    <div className="relative">
                      <select
                        value={loaiVanBan}
                        onChange={e => {
                          setLoaiVanBan(e.target.value);
                          if (e.target.value !== "Công văn chuyển đơn") setLoaiDon("gdt");
                        }}
                        className={`h-[30px] px-2 pr-7 text-[12px] border rounded-[3px] appearance-none min-w-[200px] transition-colors ${oLoc(loaiVanBan)} ${loaiVanBan ? "text-[#222]" : "text-[#aaa]"}`}
                      >
                        {/* disabled+hidden: chỉ làm nhãn gợi ý, không nằm trong danh sách chọn */}
                        <option value="" disabled hidden>Chọn loại văn bản</option>
                        {/* text-[#222] để danh sách bung ra không bị xám lây từ select */}
                        {LOAI_VAN_BAN_FILTER.map(o => <option key={o} className="text-[#222]">{o}</option>)}
                      </select>
                      <ChevronDown size={11} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${loaiVanBan ? "text-[#888]" : "text-[#ccc]"}`} />
                    </div>
                    {/* Xóa nhanh bộ lọc Loại văn bản */}
                    {loaiVanBan && (
                      <button
                        onClick={() => { setLoaiVanBan(""); setLoaiDon("gdt"); }}
                        title="Xóa lọc loại văn bản"
                        aria-label="Xóa lọc loại văn bản"
                        className="w-[24px] h-[24px] flex items-center justify-center rounded-full text-[#888] hover:text-[#8b1a1a] hover:bg-[#f0e0e0] transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>
              )}
              <div className="flex-1" />
              {activeTab === 1 ? (
                <BtnPrimary onClick={() => setShowNumberingModal(selectedRows.length ? selectedRows[0] : 1)} className="h-[30px] text-[12px] px-3 gap-1">
                  <FileText size={13} /> Lưu số văn bản và in báo cáo
                </BtnPrimary>
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
              <button onClick={() => setShowInDanhSach(true)} disabled={rowsDeIn.length === 0}
                title={selectedRows.length
                  ? `In ${selectedRows.length} đơn đang chọn`
                  : "In toàn bộ đơn đang hiển thị theo bộ lọc"}
                className="flex items-center gap-1.5 h-[30px] px-3 border border-[#1d2e4f] text-[#1d2e4f] hover:bg-[#eef1f5] disabled:opacity-40 disabled:hover:bg-transparent rounded-[3px] text-[12px] font-medium transition-colors">
                <Printer size={13} /> In danh sách
                <span className="text-[11px] text-[#666]">({rowsDeIn.length} đơn)</span>
              </button>
              <BtnPrimary onClick={onThemMoi} className="h-[30px] text-[12px] px-3 gap-1">
                <Plus size={13} /> Thêm mới
              </BtnPrimary>
              {/* <BtnSecondary className="h-[30px] text-[12px] px-3 gap-1">
                <Download size={13} /> Thêm từ đơn
              </BtnSecondary> */}
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
                    <span className="text-[12px] text-[#222]">Đơn khiếu nại tố cáo trong tố tụng</span>
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
          </div>

          {/* Table — min-width để bảng cuộn ngang thay vì bóp chữ xuống dòng lung tung */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px] min-w-[1480px]">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border border-[#ddd] px-2 py-[9px] text-center font-semibold text-[#333] w-[52px]">
                    <div className="flex items-center justify-center gap-1.5">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={filteredRows.length > 0 && selectedRows.length === filteredRows.length}
                        onChange={e => toggleAll(e.target.checked)} />
                      <span>STT</span>
                    </div>
                  </th>
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[300px]">Thông tin người gửi / đơn vị gửi</th>
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] min-w-[420px]">Thông tin đơn</th>
                  {khangNghi && <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[200px]">Đơn vị giải quyết</th>}
                  {!khangNghi && <th className="border border-[#ddd] px-3 py-[9px] text-center font-semibold text-[#333] w-[60px]">Số đơn</th>}
                  {!khangNghi && <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[105px]">Hình thức tiếp nhận</th>}
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[185px]">Thông tin giải quyết</th>
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[145px]">Người nhập / Sửa</th>
                  <th className="border border-[#ddd] px-2 py-[9px] text-center font-semibold text-[#333] w-[56px]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={khangNghi ? 7 : 8} className="border border-[#ddd] px-3 py-10 text-center text-[#888]">
                      <div className="flex flex-col items-center gap-1.5">
                        <Search size={22} className="text-[#ccc]" />
                        <span className="text-[13px]">Không có đơn nào khớp bộ lọc.</span>
                        {soBoLocDangApp > 0 && (
                          <button onClick={xoaBoLoc} className="text-[12px] text-[#1a5a96] hover:underline">Làm mới</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {filteredRows.map((row, i) => {
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
                      <td className="border border-[#ddd] px-3 py-2.5">
                        {(() => {
                          const diaChi = khangNghi ? donViKhangNghi(row.id).diaChi : row.diaChi;
                          const ngayTrenDon = row.ngayTrenDon || d.ngayCV;
                          return (
                            <div className="space-y-[5px] leading-[1.5] text-[12px]">
                              <div>
                                <span className="text-[#666]">{row.nguoiDungDon ? "Người đứng đơn: " : "Người gửi: "}</span>
                                <span className="font-medium text-[#1a5a96] hover:underline cursor-pointer">
                                  {vietTatTAND(khangNghi ? donViKhangNghi(row.id).ten : (row.nguoiDungDon || row.nguoiGui))}
                                </span>
                              </div>
                              {diaChi && (
                                <div><span className="text-[#666]">Địa chỉ: </span><span>{vietTatTAND(diaChi)}</span></div>
                              )}
                              {/* Từng cặp bọc nowrap để nhãn không bị tách khỏi giá trị khi xuống dòng */}
                              {(ngayTrenDon || row.ngayNhap) && (
                                <div className="flex flex-wrap gap-x-4">
                                  {ngayTrenDon && <span className="whitespace-nowrap"><span className="text-[#666]">Ngày trên đơn: </span>{ngayTrenDon}</span>}
                                  {row.ngayNhap && <span className="whitespace-nowrap"><span className="text-[#666]">Ngày nhận: </span>{row.ngayNhap}</span>}
                                </div>
                              )}
                              {(row.maDon || row.soHieuDon) && (
                                <div className="flex flex-wrap gap-x-4">
                                  {row.maDon && <span className="whitespace-nowrap"><span className="text-[#666]">Mã đơn: </span><span className="font-medium">{row.maDon}</span></span>}
                                  {row.soHieuDon && <span className="whitespace-nowrap"><span className="text-[#666]">Số hiệu: </span>{row.soHieuDon}</span>}
                                </div>
                              )}
                              {/* Chiều ngược lại: đơn này đã nằm trong tờ trình nào chưa.
                                  Không có dòng này thì cán bộ vẫn lấy số trùng cho cùng một đơn. */}
                              {timVanBanTheoDon(vanBanList ?? [], row.maDon).map(vb => (
                                <button key={vb.id} type="button"
                                  onClick={(e) => { e.stopPropagation(); onMoVanBan?.(vb.id); }}
                                  className="mt-1 inline-flex items-center gap-1 px-2 py-[3px] rounded-[3px] border border-[#c5d8f8] bg-[#e8f0fe] text-[#1a5a96] text-[10px] font-medium leading-[1.4] hover:bg-[#d9e6fb] transition-colors">
                                  <FileText size={10} className="flex-shrink-0" />
                                  Đã có trong <span className="font-mono">{vb.soVanBan ?? "văn bản chưa số"}</span>
                                  <span className="text-[#888]">· {TRANG_THAI_NHAN[vb.trangThai]}</span>
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                        {row.thoiHieu && (
                          <div className={`mt-1.5 inline-flex items-start gap-1 px-2 py-[3px] rounded-[3px] border text-[10px] font-medium leading-[1.4] ${THOI_HIEU[row.thoiHieu].cls}`}>
                            <AlertCircle size={10} className="flex-shrink-0 mt-[2px]" />
                            {THOI_HIEU[row.thoiHieu].nhan}
                          </div>
                        )}
                      </td>

                      {/* Thông tin đơn */}
                      <td className="border border-[#ddd] px-3 py-2.5">
                        <div className="space-y-[5px] leading-[1.5] text-[12px]">
                          {/* Dòng gộp Số BA/QĐ — Ngày — Tòa, theo đúng bố cục hệ thống thật */}
                          {(d.soBaqd || d.ngay || d.toaXetXu) && (
                            <div className="flex flex-wrap gap-x-4">
                              {d.soBaqd && <span className="whitespace-nowrap"><span className="text-[#666]">Số BA/QĐ: </span><span className="font-medium">{d.soBaqd}</span></span>}
                              {d.ngay && <span className="whitespace-nowrap"><span className="text-[#666]">Ngày: </span><span className="italic">{d.ngay}</span></span>}
                              {d.toaXetXu && <span>{vietTatTAND(d.toaXetXu)}</span>}
                            </div>
                          )}
                          {row.baGoc && (
                            <div className="whitespace-nowrap">
                              <span className="text-[#666]">BA: </span><span>{row.baGoc.so}</span>
                              <span className="text-[#666] ml-2">ngày: </span><span className="italic">{row.baGoc.ngay}</span>
                            </div>
                          )}
                          {d.thuTuc && <div><span className="text-[#666]">Thủ tục giải quyết: </span><span>{d.thuTuc}</span></div>}
                          {(d.hinhThuc || row.loaiHinhThuc) && (
                            <div><span className="text-[#666]">Hình thức: </span><span>{d.hinhThuc || row.loaiHinhThuc}</span></div>
                          )}
                          {(d.soCV || d.ngayCV) && (
                            <div className="flex flex-wrap gap-x-4">
                              {d.soCV && <span className="whitespace-nowrap"><span className="text-[#666]">Số CV: </span>{d.soCV}</span>}
                              {d.ngayCV && <span className="whitespace-nowrap"><span className="text-[#666]">Ngày CV: </span>{d.ngayCV}</span>}
                            </div>
                          )}
                          {d.loaiCV && <div><span className="text-[#666]">Loại CV: </span><span>{d.loaiCV}</span></div>}
                          {/* Trùng với "Người gửi" ở cột bên cạnh thì bỏ, chỉ hiện khi thực sự khác */}
                          {d.donViGui && norm(d.donViGui) !== norm(row.nguoiDungDon || row.nguoiGui) && (
                            <div><span className="text-[#666]">Đơn vị gửi: </span><span>{vietTatTAND(d.donViGui)}</span></div>
                          )}
                          {d.thamPhan && <div><span className="text-[#666]">Thẩm phán: </span><span className="text-[#333]">{vietTatTAND(d.thamPhan)}</span></div>}
                          {/* Ở màn Hồ sơ kháng nghị, đơn vị giải quyết tách thành cột riêng.
                              Có "(Số: ...)" nghĩa là đã chuyển sang vụ chuyên môn. */}
                          {!khangNghi && d.donViGiaiQuyet && (() => {
                            const daChuyen = /\(Số:/.test(d.donViGiaiQuyet);
                            return (
                              <div>
                                <span className={daChuyen ? "font-semibold text-[#c0392b]" : "font-semibold text-[#1a5a96]"}>
                                  {daChuyen ? "Đã chuyển: " : "Chưa chuyển: "}
                                </span>
                                <span>{vietTatTAND(d.donViGiaiQuyet)}</span>
                              </div>
                            );
                          })()}
                          {row.ngayChuyen && (
                            <div><span className="text-[#666]">Ngày chuyển: </span><span>{row.ngayChuyen}</span></div>
                          )}
                          {row.ghiChu && <div><span className="text-[#666]">Ghi chú: </span><span>{row.ghiChu}</span></div>}
                        </div>
                      </td>

                      {/* Đơn vị giải quyết — cột riêng của màn Hồ sơ kháng nghị */}
                      {khangNghi && (
                        <td className="border border-[#ddd] px-3 py-2.5">
                          {d.donViGiaiQuyet && <div className="text-[12px] text-[#333] leading-[1.5]">{vietTatTAND(d.donViGiaiQuyet)}</div>}
                          <div className="text-[11px] text-[#666] mt-1 leading-[1.5]">
                            <span className="text-[#888]">Nơi nhận kèm: </span>{vietTatTAND(donViKhangNghi(row.id).noiNhan)}
                          </div>
                        </td>
                      )}

                      {/* Số đơn */}
                      {!khangNghi && (
                        <td className="border border-[#ddd] px-2 py-2.5 text-center font-medium">{row.soDon || ""}</td>
                      )}

                      {/* Hình thức tiếp nhận */}
                      {!khangNghi && (
                      <td className="border border-[#ddd] px-3 py-2.5 align-top">
                        {row.hinhThucTiepNhan && (
                          <span className={`inline-block px-2 py-[2px] rounded-sm text-[10px] font-medium border ${row.hinhThucTiepNhan === "Trực tiếp" ? "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"
                            : row.hinhThucTiepNhan === "Bưu điện" ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"
                              : "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]"
                            }`}>
                            {row.hinhThucTiepNhan}
                          </span>
                        )}
                      </td>
                      )}

                      {/* Thông tin giải quyết */}
                      <td className="border border-[#ddd] px-3 py-2.5 leading-[1.5]">
                        {khangNghi ? (() => {
                          const kn = ketQuaKhangNghi(row.id);
                          return (
                            <>
                              <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-medium border ${kn.trangThai === "Đã xét xử"
                                ? "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"
                                : "bg-[#fff3cd] text-[#856404] border-[#ffecb5]"}`}>
                                {kn.trangThai}
                              </span>
                              {kn.ketQua && (
                                <div className="text-[11px] text-[#333] mt-1 leading-snug">
                                  <span className="text-[#888]">Kết quả: </span>{kn.ketQua}
                                </div>
                              )}
                            </>
                          );
                        })() : (<>
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
                          <div className="text-[11px] text-[#555] mt-1">
                            Số: {g.stl}{row.ngayNhap ? ` - ${row.ngayNhap}` : ""}
                          </div>
                        )}
                        {/* Trình ký văn bản — chỉ hiện KẾT QUẢ cuối, chi tiết xem popup */}
                        {(() => {
                          const tk = tienDoTrinhKy(row);
                          return (
                            <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#e8e8e8]">
                              <div className="text-[10px] text-[#888] mb-0.5">Trình ký văn bản</div>
                              <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-medium border leading-[1.4] ${tk.cls}`}>
                                {tk.ketQua}
                              </span>
                              {tk.soVanBan && (
                                <div className="text-[11px] text-[#555] mt-0.5">Số VB: {tk.soVanBan}</div>
                              )}
                              <div>
                                <button type="button" onClick={() => setTrinhKyRow(row)}
                                  className="text-[11px] text-[#1a5a96] hover:underline cursor-pointer mt-0.5">
                                  Xem tiến độ
                                </button>
                              </div>
                            </div>
                          );
                        })()}
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
                        </>)}
                      </td>

                      {/* Người nhập / Sửa — trùng tên thì kèm ngày sinh để phân biệt */}
                      <td className="border border-[#ddd] px-3 py-2.5">
                        {row.nguoiNhap && <div className="font-medium text-[12px] leading-[1.5]">{row.nguoiNhap}</div>}
                        {tenCanBoTrungLap.has(row.nguoiNhap) && ngaySinhCanBo(row) && (
                          <div className="text-[11px] text-[#8b1a1a] whitespace-nowrap leading-[1.5]">
                            Ngày sinh: {ngaySinhCanBo(row)}
                          </div>
                        )}
                        {row.ngayNhap && (
                          <div className="text-[11px] text-[#666] whitespace-nowrap mt-1 leading-[1.5]">
                            {row.ngayNhap}{row.gioNhap ? ` ${row.gioNhap}` : ""}
                          </div>
                        )}
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
            <span className="text-[12px] text-[#666]">
              {filteredRows.length === 0
                ? "Không có văn bản nào"
                : `Hiển thị 1-${filteredRows.length} trong tổng ${filteredRows.length} văn bản`}
              {soBoLocDangApp > 0 && filteredRows.length !== rows.length && (
                <span className="text-[#8b1a1a]"> (đã lọc từ {rows.length})</span>
              )}
            </span>
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
            isRecipientConfirmation={true}
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
            onReject={() => {
              setMergeState(prev => {
                const next = { ...prev };
                delete next[showConfirmRow!]?.pendingFrom;
                if (chinhRow) {
                  const { pendingTo, ...rest } = next[chinhRow.id] ?? {};
                  next[chinhRow.id] = rest;
                }
                return next;
              });
              triggerNoti(`Đơn [${row?.maDon}] của ${row?.nguoiGui} đã từ chối yêu cầu ghép.`);
              setShowConfirmRow(null);
            }}
          />
        );
      })()}

      {/* Popup Lưu số văn bản (NEW) */}
      {showNumberingModal !== null && (
        <DocumentNumberingModal
          isOpen={true}
          currentRole={currentRole}
          loaiVanBanMacDinh={loaiVanBan}
          // Chưa tick dòng nào thì lấy toàn bộ đơn đang hiển thị theo bộ lọc
          selectedRows={
            filteredRows.filter(r => selectedRows.includes(r.id)).length > 0
              ? filteredRows.filter(r => selectedRows.includes(r.id))
              : filteredRows
          }
          // Chỉ ghi vào kho — KHÔNG đóng modal ở đây, để popup "Trình duyệt
          // thành công" của chính modal còn kịp hiện ra.
          onTrinhDuyet={(kq) => onTaoVanBan?.(kq)}
          onClose={() => { setShowNumberingModal(null); onDongPopupVanBan?.(); }}
          // Một đơn có thể lọt vào nhiều văn bản; lấy bản có số làm đại diện
          // (cụ thể hơn cho người dùng), kèm số lượng còn lại nếu có.
          donTrung={donTrungMap}
        />
      )}

      {/* In danh sách đơn theo bộ lọc đang áp */}
      {showInDanhSach && (
        <PopupInDanhSachDon
          rows={rowsDeIn}
          moTaBoLoc={selectedRows.length ? [...moTaBoLoc, `${selectedRows.length} đơn được chọn`] : moTaBoLoc}
          onDong={() => setShowInDanhSach(false)}
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
      {/* Popup tiến độ trình ký — timeline 4 bước */}
      {trinhKyRow && (() => {
        const tk = tienDoTrinhKy(trinhKyRow);
        const soXong = tk.buocs.filter(b => b.trangThai === "xong").length;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-[4px] shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-hidden">
              <div className="flex items-start justify-between px-4 py-3 border-b border-[#e0e0e0]">
                <div>
                  <div className="text-[14px] font-semibold text-[#1d2e4f]">Tiến độ trình ký văn bản</div>
                  <div className="text-[12px] text-[#666]">{trinhKyRow.maDon} · {trinhKyRow.nguoiGui}</div>
                </div>
                <button onClick={() => setTrinhKyRow(null)} className="text-[#888] hover:text-[#333]"><X size={18} /></button>
              </div>

              {/* Kết quả cuối + thanh tiến độ */}
              <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[12px] text-[#555]">Kết quả hiện tại:</span>
                  <span className={`inline-block px-2 py-[3px] rounded text-[11px] font-semibold border ${tk.cls}`}>
                    {tk.ketQua}
                  </span>
                  {tk.soVanBan && <span className="text-[12px] text-[#555]">· Số VB: <span className="font-medium text-[#333]">{tk.soVanBan}</span></span>}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-[6px] rounded-full bg-[#e4e9ef] overflow-hidden">
                    <div className="h-full bg-[#27ae60] transition-all"
                      style={{ width: `${(soXong / tk.buocs.length) * 100}%` }} />
                  </div>
                  <span className="text-[11px] text-[#666] whitespace-nowrap">{soXong}/{tk.buocs.length} bước</span>
                </div>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(90vh-210px)]">
                {tk.buocs.map((b, i) => {
                  const mau = {
                    xong: { vien: "border-[#a9debb]", nen: "bg-[#e8f7ee]", chu: "text-[#1a7a45]", icon: <Check size={13} /> },
                    dang: { vien: "border-[#ffecb5]", nen: "bg-[#fff8e6]", chu: "text-[#856404]", icon: <Clock size={13} /> },
                    cho: { vien: "border-[#e0e0e0]", nen: "bg-white", chu: "text-[#999]", icon: <Clock size={13} /> },
                    tuchoi: { vien: "border-[#e6a5a0]", nen: "bg-[#fdecea]", chu: "text-[#c0392b]", icon: <X size={13} /> },
                  }[b.trangThai];
                  return (
                    <div key={i} className="flex gap-3">
                      {/* Cột mốc + đường nối */}
                      <div className="flex flex-col items-center">
                        <div className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center flex-shrink-0 ${mau.vien} ${mau.nen} ${mau.chu}`}>
                          {mau.icon}
                        </div>
                        {i < tk.buocs.length - 1 && (
                          <div className={`w-[2px] flex-1 min-h-[26px] ${b.trangThai === "xong" ? "bg-[#a9debb]" : "bg-[#e4e4e4]"}`} />
                        )}
                      </div>
                      <div className="pb-4 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[13px] font-medium ${b.trangThai === "cho" ? "text-[#999]" : "text-[#333]"}`}>
                            {i + 1}. {b.ten}
                          </span>
                          <span className={`text-[10px] px-1.5 py-[1px] rounded border ${mau.vien} ${mau.nen} ${mau.chu}`}>
                            {{ xong: "Hoàn thành", dang: "Đang xử lý", cho: "Chờ", tuchoi: "Trả lại" }[b.trangThai]}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#555] mt-0.5">
                          {b.vaiTro}: <span className="text-[#333]">{b.nguoi}</span>
                          {b.thoiGian && <span className="text-[#888]"> · {b.thoiGian}</span>}
                        </div>
                        {b.ghiChu && <div className="text-[11px] text-[#c0392b] mt-0.5">{b.ghiChu}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end px-4 py-3 border-t border-[#e0e0e0]">
                <button onClick={() => setTrinhKyRow(null)}
                  className="h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}
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

  // Đơn không đủ điều kiện đưa vào văn bản — bỏ hàng loạt thay vì xóa từng dòng
  const invalidRows = useMemo(() => localRows.filter(r => lyDoKhongHopLe(r)), [localRows]);
  const removeInvalidRows = () => setLocalRows(prev => prev.filter(r => !lyDoKhongHopLe(r)));

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
            {/* Cảnh báo đơn không hợp lệ + bỏ tất cả bằng 1 nút */}
            {invalidRows.length > 0 && (
              <div className="flex items-start gap-2 px-3 py-2 mb-3 bg-[#fdecea] border border-[#e57373] rounded-[3px] text-[12px] text-[#8b1a1a]">
                <AlertCircle size={14} className="flex-shrink-0 mt-[1px]" />
                <div className="min-w-0">
                  <div>
                    <b>{invalidRows.length}/{localRows.length}</b> đơn không đủ điều kiện đưa vào văn bản.
                  </div>
                  <div className="text-[11px] text-[#a94442] mt-0.5">
                    {[...new Set(invalidRows.map(r => lyDoKhongHopLe(r)))].join(" · ")}
                  </div>
                </div>
                <button
                  onClick={removeInvalidRows}
                  className="ml-auto flex-shrink-0 inline-flex items-center gap-1 h-[26px] px-2.5 rounded-[3px] bg-[#8b1a1a] hover:bg-[#6e1414] text-white text-[11px] font-semibold transition-colors whitespace-nowrap">
                  <Trash2 size={11} /> Bỏ {invalidRows.length} đơn không hợp lệ
                </button>
              </div>
            )}

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
                          const lyDo = lyDoKhongHopLe(row);
                          return (
                            <tr key={row.id} className={`align-top ${lyDo ? "bg-[#fdf3f2]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                              <td className="border border-[#ddd] px-2 py-2 text-center">
                                <div>{i + 1}</div>
                                {lyDo && <AlertCircle size={12} className="mx-auto mt-1 text-[#c0392b]" />}
                              </td>
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
                                  {lyDo && (
                                    <div className="mb-1">
                                      <span className="inline-flex items-center gap-1 bg-[#fdecea] text-[#8b1a1a] border border-[#e57373] text-[10px] font-bold px-1.5 py-[2px] rounded-sm">
                                        <AlertCircle size={10} /> Không hợp lệ
                                      </span>
                                      <span className="ml-1.5 text-[11px] text-[#a94442]">{lyDo}</span>
                                    </div>
                                  )}
                                  <div><span className="text-[#888]">Thông tin giải quyết: </span><span>{row.giaiQuyet.nhan || "—"}</span></div>
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
  "Đơn khiếu nại tố cáo trong tố tụng",
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
const DanhSachBieuMau = ({
  row, onBack, vanBanList, onMoVanBan,
}: {
  row: typeof SAMPLE_ROWS[0];
  onBack: () => void;
  /** Kho văn bản dùng chung. Trước đây màn này đọc một mảng hardcode 3 dòng
   *  nên bấm từ đơn nào cũng ra cùng kết quả và không bao giờ thấy văn bản
   *  vừa tạo. Giờ lọc thật theo đơn đang mở. */
  vanBanList?: VanBanTrinh[];
  onMoVanBan?: (id: string) => void;
}) => {
  const vanBanCuaDon = timVanBanTheoDon(vanBanList ?? [], row.maDon);
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
              {vanBanCuaDon.map((vb, i) => {
                const nguoiKy = vb.luongKy.find(b => b.vaiTro === "ky");
                return (
                  <tr key={vb.id} className={`border-b border-[#f0f0f0] hover:bg-[#fafafa] ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                    <td className="px-3 py-2.5 text-[#1a5a96] font-medium">{i + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#222]">{vb.loaiVanBan}</td>
                    <td className="px-3 py-2.5">
                      {vb.soVanBan
                        ? <button type="button" onClick={() => onMoVanBan?.(vb.id)}
                            className="text-[#1a5a96] hover:underline font-mono text-[12px]">{vb.soVanBan}</button>
                        : <span className="text-[#888] italic text-[12px]">— chưa số —</span>}
                    </td>
                    <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">
                      {vb.ngayBanHanh ?? vb.ngayCapSo ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-[#333]">{nguoiKy?.nguoi ?? "—"}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-block px-2 py-[2px] rounded-full text-[10px] font-medium border ${TRANG_THAI_CLS[vb.trangThai]}`}>
                        {TRANG_THAI_NHAN[vb.trangThai]}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[#555]">{vb.nguoiTao}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={() => onMoVanBan?.(vb.id)} title="Xem văn bản"
                        className="text-[#555] hover:text-[#8b1a1a] transition-colors">
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {vanBanCuaDon.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center">
                  <FileText size={24} className="mx-auto mb-2 text-[#ccc]" />
                  <div className="text-[13px] text-[#666]">Đơn {row.maDon.trim()} chưa có văn bản nào.</div>
                  <div className="text-[12px] text-[#888] mt-1">
                    Lập văn bản từ màn Danh sách đơn — nút “Lưu số văn bản và in báo cáo”.
                  </div>
                </td></tr>
              )}
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
  const [editFormMap, setEditFormMap] = useState<Record<number, { ngaySua: string; lyDo: string }>>({});
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const startEdit = (id: number) => {
    setEditingRow(id);
    setEditFormMap(prev => {
      if (prev[id]) return prev;
      return { ...prev, [id]: { ngaySua: new Date().toISOString().split("T")[0], lyDo: "" } };
    });
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
        {tab === 2 ? (
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
                    <option value="">Tất cả hình thức</option>
                    {optionsHinhThucDonPhanCong()}
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


          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center gap-5">
              {[["tatca", "Tất cả"], ["toicao", "Thẩm phán tối cao"], ["bac3", "Thẩm phán bậc 3"]].map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer text-[13px]">
                  <input type="radio" name="capTP" className="accent-[#8b1a1a]"
                    checked={capTP === val} onChange={() => setCapTP(val as "tatca" | "toicao" | "bac3")} />
                  <span className={capTP === val ? "font-semibold text-[#8b1a1a]" : "text-[#444]"}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[4px] border border-[#ddd] overflow-hidden">
        <div className="px-4 py-[9px] border-b border-[#ddd] flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#1d2e4f]">Danh sách phân công</span>
          {tab === 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenThamPhanPopup && onOpenThamPhanPopup()}
                className="flex items-center justify-center gap-1.5 h-[28px] px-3 border border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#fcf5f5] rounded-[3px] text-[11px] font-medium transition-colors"
              >
                <Users size={12} />
                <span className="leading-none">Danh sách thẩm phán</span>
              </button>
              <button onClick={() => { handleRandomAssign(); alert("Đã phân công ngẫu nhiên thành công!"); }} className="flex items-center justify-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                <Users size={12} /> Phân công ngẫu nhiên
              </button>
            </div>
          )}
          {tab === 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenThamPhanPopup && onOpenThamPhanPopup()}
                className="flex items-center justify-center gap-1.5 h-[28px] px-3 border border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#fcf5f5] rounded-[3px] text-[11px] font-medium transition-colors"
              >
                <Users size={12} />
                <span className="leading-none">Danh sách thẩm phán</span>
              </button>
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
          {tab === 2 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenThamPhanPopup && onOpenThamPhanPopup()}
                className="flex items-center justify-center gap-1.5 h-[28px] px-3 border border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#fcf5f5] rounded-[3px] text-[11px] font-medium transition-colors"
              >
                <Users size={12} />
                <span className="leading-none">Danh sách thẩm phán</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 h-[28px] px-3 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[11px] font-medium transition-colors">
                <Search size={12} />
                <span className="leading-none">Tìm kiếm</span>
              </button>
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
                          {(() => {
                            const currentEditForm = editFormMap[row.id] ?? { ngaySua: new Date().toISOString().split("T")[0], lyDo: "" };
                            return (
                              <>
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
                          {/* Ngày sửa */}
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Ngày sửa</label>
                            <input type="date" value={currentEditForm.ngaySua}
                              onChange={e => setEditFormMap(p => ({ ...p, [row.id]: { ...(p[row.id] ?? { ngaySua: "", lyDo: "" }), ngaySua: e.target.value } }))}
                              className="w-full h-[26px] px-2 text-[11px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
                          </div>
                          {/* Lý do */}
                          <div>
                            <label className="block text-[10px] text-[#888] mb-0.5">Lý do sửa phân công</label>
                            <textarea value={currentEditForm.lyDo}
                              onChange={e => setEditFormMap(p => ({ ...p, [row.id]: { ...(p[row.id] ?? { ngaySua: "", lyDo: "" }), lyDo: e.target.value } }))}
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
                              </>
                            );
                          })()}
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

export default function App() {
  const [view, setView] = useState<"home" | "list" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "khangnghi" | "nhandon_tl" | "cauhinh_pctp" | "van_ban_trinh_ky" | "so_van_ban_di">("list");

  // ─── KHO VĂN BẢN DÙNG CHUNG ────────────────────────────────────────────────
  // Một nguồn sự thật duy nhất cho cả ba màn của module Quản lý văn bản:
  //   · Danh sách văn bản (cán bộ)
  //   · Phê duyệt đề xuất        (lãnh đạo)
  //   · Sổ văn bản đi            (văn thư)
  // Popup "Tạo văn bản & trình ký" đẩy bản ghi mới vào đây. Trước kia mỗi màn
  // có kho riêng nên tạo văn bản xong không màn nào thấy — đó là lý do gộp.
  const [vanBanList, setVanBanList] = useState<VanBanTrinh[]>(DU_LIEU_MAU);
  // Dòng vừa tạo, để highlight khi nhảy sang màn Danh sách văn bản.
  const [vbVuaTao, setVbVuaTao] = useState<string | null>(null);

  /** Đóng vòng phản hồi: popup "Tạo văn bản & trình ký" → kho chung → màn cán bộ.
   *  Dropdown người duyệt/ký trả về chuỗi "Tên - Chức vụ - Ngày sinh". */
  const tachNguoi = (s: string) => {
    const [nguoi, chucVu] = s.split(" - ");
    return { nguoi: (nguoi ?? s).trim(), chucVu: (chucVu ?? "Lãnh đạo").trim() };
  };
  const taoVanBanTuModal = (kq: KetQuaTrinhDuyet) => {
    const luongKy: BuocKy[] = [];
    if (kq.nguoiDuyet) {
      const n = tachNguoi(kq.nguoiDuyet);
      luongKy.push({ thuTu: 1, nguoi: n.nguoi, chucVu: n.chucVu, vaiTro: "duyet" });
    }
    if (kq.nguoiKy) {
      const n = tachNguoi(kq.nguoiKy);
      luongKy.push({ thuTu: luongKy.length + 1, nguoi: n.nguoi, chucVu: n.chucVu, vaiTro: "ky" });
    }
    const nguoiTao = kq.nguoiTao || nguoiTheoVaiTro(currentRole).nguoi;
    const vb = taoTuModal({ ...kq, nguoiTao, luongKy });
    // Bấm "Trình duyệt" nghĩa là tạo XONG và trình luôn — không dừng ở Nháp.
    const daTrinh = luongKy.length ? apTrinhDuyet(vb, nguoiTao, "Cán bộ", kq.yKienTrinh) : vb;
    setVanBanList(ds => [daTrinh, ...ds]);
    setVbVuaTao(daTrinh.id);
    setChoDieuHuongVanBan(true);
    addNotification(`Đã trình ${daTrinh.soVanBan ?? "văn bản"} — đang chờ ${luongKy[0]?.nguoi ?? "duyệt"}`);
  };
  /** Chỉ điều hướng SAU KHI người dùng đóng hộp thoại "Trình duyệt thành công",
   *  để họ kịp đọc xác nhận thay vì bị nhảy màn ngay. */
  const [choDieuHuongVanBan, setChoDieuHuongVanBan] = useState(false);
  const dongPopupVanBan = () => {
    if (!choDieuHuongVanBan) return;
    setChoDieuHuongVanBan(false);
    setView("van_ban_trinh_ky");
  };
  /** Từ Danh sách đơn bấm chip "Đã có trong 545/…" → mở thẳng panel văn bản đó. */
  const [moVanBanId, setMoVanBanId] = useState<string | null>(null);
  const moVanBan = (id: string) => { setMoVanBanId(id); setView("van_ban_trinh_ky"); };

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
  // ── Luồng OCR ────────────────────────────────────────────────────────────
  const [ocrFile, setOcrFile] = useState<OcrFile | null>(null);
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>("chua");
  const [showOcrConfirm, setShowOcrConfirm] = useState(false);
  const [showOcrProgress, setShowOcrProgress] = useState(false);
  const [showOcrCancel, setShowOcrCancel] = useState(false);
  const [ocrStep, setOcrStep] = useState(0);
  // runId tăng mỗi lần chạy — timer của job cũ tự bỏ qua kết quả sau khi hủy
  const ocrRunId = useRef(0);
  const ocrTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [showTraLaiForm, setShowTraLaiForm] = useState(false);
  const [traLaiReason, setTraLaiReason] = useState("");
  const [congVans, setCongVans] = useState<CongVan[]>([]);
  const [hinhThuc, setHinhThuc] = useState("Đơn đề nghị GĐT-TT");
  const [loaiDonChuyenDon, setLoaiDonChuyenDon] = useState("Đơn đề nghị GĐT-TT");
  const isDon = LOAI_DON.has(hinhThuc);
  const isKhangNghi = hinhThuc === LOAI_KHANG_NGHI;
  const isDonKhieuNaiTuPhap = hinhThuc === "Đơn khiếu nại tố cáo trong tố tụng" || (hinhThuc === "CV chuyển đơn" && loaiDonChuyenDon === "Đơn khiếu nại tố cáo trong tố tụng");
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
  const [coNoiDungToCao, setCoNoiDungToCao] = useState(false);
  const [xinHoanThiHanhAn, setXinHoanThiHanhAn] = useState(false);
  // Hình thức nhận + thông tin bì thư (chỉ dùng cho Trực tiếp / Bưu điện)
  const [hinhThucNhan, setHinhThucNhan] = useState("");
  const [biThu, setBiThu] = useState({ ma: "", ngayDau: "", nguoiGui: "", sdt: "", diaChi: "" });
  const canBiThu = hinhThucNhan === "Trực tiếp" || hinhThucNhan === "Bưu điện";
  // Tra mã bì thư trong kho dữ liệu bưu chính, khớp thì tự điền các trường còn lại
  const traBiThu = (ma: string) => {
    const kq = KHO_BI_THU[ma.trim().toUpperCase()];
    setBiThu(p => kq ? { ...p, ma, ...kq } : { ...p, ma });
  };
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
  // Thông báo trả lời đơn — thêm qua popup, hiện luôn ra bảng ngoài
  const [thongBaoTraLoi, setThongBaoTraLoi] = useState<{ id: number; soTB: string; ngayTB: string; toaAn: string }[]>([]);
  const [showThemTB, setShowThemTB] = useState(false);
  // Đơn liên quan thêm tay — gộp chung với kết quả tra cứu để hiện ra bảng ngoài
  const [donLienQuanThem, setDonLienQuanThem] = useState<DonLienQuan[]>([]);
  const [showThemDonLQ, setShowThemDonLQ] = useState(false);
  // Đơn thụ lý kèm — thêm qua popup, hiện luôn ra bảng ngoài
  const [donThuLyKem, setDonThuLyKem] = useState<DonThuLyKem[]>([]);
  const [showThemDonKem, setShowThemDonKem] = useState(false);
  // Nguyên đơn / người khởi kiện
  const [nguyenDon, setNguyenDon] = useState<NguoiDungDon[]>([]);
  const [showThemNguyenDon, setShowThemNguyenDon] = useState(false);
  // Bị đơn / người bị kiện
  const [biDon, setBiDon] = useState<NguoiDungDon[]>([]);
  const [showThemBiDon, setShowThemBiDon] = useState(false);
  // Người có quyền lợi, nghĩa vụ liên quan
  const [nguoiLienQuan, setNguoiLienQuan] = useState<NguoiDungDon[]>([]);
  const [showThemNguoiLQ, setShowThemNguoiLQ] = useState(false);
  const [loaiQDBa, setLoaiQDBa] = useState("Bản án");
  const [hanhViBiKhieuNai, setHanhViBiKhieuNai] = useState("");
  const NHAN_SO_NGAY_BA: Record<string, [string, string]> = {
    "Bản án": ["Số bản án", "Ngày bản án"],
    "Quyết định": ["Số quyết định", "Ngày quyết định"],
    "Công văn": ["Số công văn", "Ngày công văn"],
    "Thông báo": ["Số thông báo", "Ngày thông báo"],
    "Hành vi": ["Số văn bản", "Ngày văn bản"],
  };
  const loaiQDBaOptions = hinhThuc === "Đơn khiếu nại tố cáo trong tố tụng"
    ? ["Bản án", "Quyết định", "Hành vi"]
    : ["Bản án", "Quyết định"];
  const loaiQDBaEffective = loaiQDBaOptions.includes(loaiQDBa) ? loaiQDBa : loaiQDBaOptions[0];
  // Chọn "Hành vi" thì nhập nội dung hành vi bị khiếu nại tố cáo
  const laHanhVi = loaiQDBaEffective === "Hành vi";
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

  // Sửa đơn đã có: giữ nguyên hành vi cũ — highlight sẵn các trường OCR.
  // Thêm mới: chỉ điền sau khi OCR chạy xong (xem startOcr bên dưới).
  useEffect(() => {
    if (view === "form" && editingRowId !== null) setOcrFields(new Set(Object.keys(OCR_MOCK)));
  }, [view, editingRowId]);

  // Đổi thành true để demo nhánh "OCR thất bại".
  const OCR_DEMO_FAIL = false;
  // Mốc thời gian mô phỏng job OCR (ms): tải xong → OCR xong → trích xuất xong.
  const OCR_TIMINGS = [1000, 4500, 6800];

  const clearOcrTimers = () => {
    ocrTimers.current.forEach(clearTimeout);
    ocrTimers.current = [];
  };

  const startOcr = () => {
    clearOcrTimers();
    const runId = ++ocrRunId.current;
    const alive = () => ocrRunId.current === runId;

    setOcrStatus("dang");
    setOcrStep(0);
    setOcrFields(new Set());
    setShowOcrConfirm(false);
    setShowOcrProgress(true);
    setShowPDF(true);

    ocrTimers.current.push(
      setTimeout(() => { if (alive()) setOcrStep(1); }, OCR_TIMINGS[0]),
      setTimeout(() => { if (alive()) setOcrStep(2); }, OCR_TIMINGS[1]),
      setTimeout(() => {
        if (!alive()) return;
        setShowOcrProgress(false);
        if (OCR_DEMO_FAIL) {
          setOcrStatus("thatbai");
          addNotification(`OCR thất bại cho tài liệu ${ocrFile?.name ?? ""}. Vui lòng thực hiện OCR lại.`);
        } else {
          setOcrStatus("thanhcong");
          setOcrFields(new Set(Object.keys(OCR_MOCK)));
          addNotification(`OCR thành công cho tài liệu ${ocrFile?.name ?? ""}. Dữ liệu đã được trích xuất.`);
        }
      }, OCR_TIMINGS[2]),
    );
  };

  // Dừng hẳn job: tăng runId nên mọi timer còn treo đều bị vô hiệu.
  const cancelOcr = () => {
    ocrRunId.current++;
    clearOcrTimers();
    setOcrStatus("dahuy");
    setOcrStep(0);
    setShowOcrCancel(false);
    setShowOcrProgress(false);
    addNotification("Đã hủy quá trình OCR. Bạn có thể thực hiện OCR lại bất cứ lúc nào.");
  };

  // Mở lại luồng OCR từ đầu (chọn file mới).
  const reOcr = () => {
    ocrRunId.current++;
    clearOcrTimers();
    setOcrStep(0);
    setShowUploadPopup(true);
  };

  // Dọn timer khi unmount để tránh setState trên component đã gỡ.
  useEffect(() => clearOcrTimers, []);

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

  // Đơn của cùng vụ án — hiện ra sau khi bấm "Tra cứu" để cán bộ biết vụ này đã
  // có những đơn nào vào trước.
  const DON_LIEN_QUAN_RESULTS = [
    {
      id: 1, maDon: "Mã 6512", ngayNhan: "15/06/2023",
      nguoiGui: "Nguyễn Văn An", diaChi: "Phường Võ Cường, Tỉnh Bắc Ninh",
      soBA: "15/2023/HC-PT", ngayBA: "12/03/2023",
      hinhThuc: "Đơn đề nghị GĐT/TT", thuTuc: "Giám đốc thẩm",
      trangThai: "Đã thụ lý", color: "#27ae60", stl: "54682310",
      nguoiNhap: "Vũ Văn Yên", ngayNhap: "15/06/2023",
    },
    {
      id: 2, maDon: "Mã 6874", ngayNhan: "02/11/2023",
      nguoiGui: "Nguyễn Văn An", diaChi: "Phường Võ Cường, Tỉnh Bắc Ninh",
      soBA: "15/2023/HC-PT", ngayBA: "12/03/2023",
      hinhThuc: "Đơn đề nghị GĐT/TT", thuTuc: "Giám đốc thẩm",
      trangThai: "Chưa đủ điều kiện", color: "#e67e22", stl: "",
      nguoiNhap: "Phùng Trâm Anh", ngayNhap: "02/11/2023",
    },
    {
      id: 3, maDon: "Mã 7105", ngayNhan: "20/01/2024",
      nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh", diaChi: "Phường Phương Sơn, Tỉnh Bắc Ninh",
      soBA: "15/2024/GĐT-HC", ngayBA: "20/01/2024",
      hinhThuc: "CV Kiến nghị GĐT, TT", thuTuc: "Giám đốc thẩm",
      trangThai: "Thụ lý mới", color: "#2980b9", stl: "54682455",
      nguoiNhap: "Vũ Văn Yên", ngayNhap: "20/01/2024",
    },
  ];

  // Bảng đơn liên quan = kết quả tra cứu (nếu đã bấm Tra cứu) + các đơn thêm tay
  const donLienQuanRows: DonLienQuan[] = [
    ...(baSearched ? DON_LIEN_QUAN_RESULTS : []),
    ...donLienQuanThem,
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
            : view === "khangnghi"
            ? "Hồ sơ kháng nghị"
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
              {editingRowId === null && <OcrStatusBadge status={ocrStatus} />}
              {ocrFields.size > 0 && (
                <button onClick={() => setOcrFields(new Set())}
                  className="flex items-center gap-1 h-[28px] px-2 rounded-[3px] border border-white/20 text-white/80 hover:bg-white/10 text-[11px] transition-colors">
                  <X size={10} /> Xóa highlight
                </button>
              )}
              {/* Không dùng BtnSecondary ở đây: nền trắng mặc định của nó chống
                  lại các lớp ghi đè nên nút bị trắng-trên-trắng, mất chữ. */}
              <button type="button" onClick={() => setShowTraLaiForm(true)}
                className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-white/50 bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors">
                <RotateCcw size={13} /> Trả lại
              </button>
              <button type="button" onClick={() => setView("list")}
                className="inline-flex items-center h-[28px] px-4 rounded-[3px] border border-white/50 bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors">
                Hủy
              </button>
              <BtnPrimary onClick={() => { addNotification(`Đơn ${editingRow?.maDon || "7031"} đã được thêm mới bởi cán bộ Nguyễn Văn An`); setView("list"); }}>Lưu</BtnPrimary>
            </div>
          )}
        </div>
      </div>

      {/* ── Body: Sidebar + content ──────────────────────────────────────── */}
      <div className="flex" style={{ height: "calc(100vh - 46px)" }}>

        {/* Sidebar */}
        <Sidebar activePage={view} currentRole={currentRole} onNav={(page) => setView(page as any)} />

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
                : view === "khangnghi"
                ? <span className="text-[#333]">Hồ sơ kháng nghị</span>
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
                        : view === "van_ban_trinh_ky"
                          ? <>
                              <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh sách đơn</span>
                              <ChevronRight size={12} />
                              <span className="text-[#333]">Danh sách văn bản</span>
                            </>
                        : view === "so_van_ban_di"
                          ? <span className="text-[#333]">Sổ văn bản đi</span>
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
            <PheDuyetDeXuat danhSach={vanBanList} setDanhSach={setVanBanList} currentRole={currentRole} />
          )}

          {/* Danh sách văn bản — hàng đợi cá nhân của cán bộ (lọc mặc định: người tạo = tôi).
              Đổi vai trò ở góc phải màn hình sẽ thấy quyền sửa đổi theo:
              chỉ người đang giữ văn bản mới được sửa. */}
          {view === "van_ban_trinh_ky" && (
            <VanBanTrinhKyCuaToi danhSach={vanBanList} setDanhSach={setVanBanList}
              currentRole={currentRole} highlightId={vbVuaTao}
              openId={moVanBanId} onDaMo={() => setMoVanBanId(null)} />
          )}

          {/* Sổ văn bản đi — bề mặt đối chiếu số của văn thư */}
          {view === "so_van_ban_di" && (
            <SoVanBanDi danhSach={vanBanList} />
          )}


          {/* List view */}
          {view === "list" && (
            <div className="flex-1 overflow-y-auto">
              <DanhSachDon
                currentRole={currentRole}
                onTaoVanBan={taoVanBanTuModal}
                onDongPopupVanBan={dongPopupVanBan}
                vanBanList={vanBanList}
                onMoVanBan={moVanBan}
                onThemMoi={() => {
                  setEditingRowId(null);
                  setView("form");
                  setShowPDF(false);
                  // Thêm mới luôn bắt đầu bằng luồng nhập PDF → OCR.
                  ocrRunId.current++;
                  clearOcrTimers();
                  setOcrFile(null);
                  setOcrStatus("chua");
                  setOcrStep(0);
                  setOcrFields(new Set());
                  setShowUploadPopup(true);
                }}
                onBieuMau={(r) => { setBieuMauRow(r); setView("bieumau"); }}
                onWordEditor={() => setView("wordeditor")}
                onEditRow={(id) => { setEditingRowId(id); setView("form"); }}
                isTruongPhong={false}
              />
            </div>
          )}

          {/* Hồ sơ kháng nghị view — dùng lại màn Danh sách đơn, khác cột Thông tin giải quyết */}
          {/* Nhận đơn và TL vụ án — module Quản lý án GĐT/TT */}
          {view === "nhandon_tl" && (
            <div className="flex-1 overflow-y-auto">
              <NhanDonTLVuAn />
            </div>
          )}

          {/* Cấu hình phân công Thẩm phán — quy tắc phân công + nghỉ phép */}
          {view === "cauhinh_pctp" && (
            <div className="flex-1 overflow-y-auto">
              <CauHinhPhanCongTP />
            </div>
          )}

          {view === "khangnghi" && (
            <div className="flex-1 overflow-y-auto">
              <DanhSachDon
                khangNghi
                currentRole={currentRole}
                onTaoVanBan={taoVanBanTuModal}
                onDongPopupVanBan={dongPopupVanBan}
                vanBanList={vanBanList}
                onMoVanBan={moVanBan}
                onThemMoi={() => {
                  setEditingRowId(null);
                  setView("form");
                  setShowPDF(false);
                  ocrRunId.current++;
                  clearOcrTimers();
                  setOcrFile(null);
                  setOcrStatus("chua");
                  setOcrStep(0);
                  setOcrFields(new Set());
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
              <DanhSachBieuMau row={bieuMauRow} onBack={() => setView("list")}
                vanBanList={vanBanList} onMoVanBan={moVanBan} />
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

                {/* Banner trạng thái OCR — chỉ ở luồng Thêm mới */}
                {editingRowId === null && ocrStatus !== "thanhcong" && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-[3px] text-[12px] border ${
                    ocrStatus === "dang"    ? "bg-[#fffbeb] border-[#f59e0b] text-[#92400e]"
                    : ocrStatus === "thatbai" ? "bg-[#fdecea] border-[#e57373] text-[#8b1a1a]"
                    : "bg-[#f5f7fa] border-[#ccd3dd] text-[#4a5568]"}`}>
                    <OcrStatusBadge status={ocrStatus} />
                    <span className="truncate">
                      {ocrStatus === "dang"
                        ? <>Đang trích xuất dữ liệu từ <b>{ocrFile?.name}</b>. Bạn có thể tiếp tục nhập tay, hệ thống sẽ thông báo khi xong.</>
                        : ocrStatus === "thatbai"
                          ? <>Không trích xuất được dữ liệu từ <b>{ocrFile?.name}</b>. Vui lòng thực hiện OCR lại hoặc nhập tay.</>
                          : ocrStatus === "dahuy"
                            ? <>Đã hủy OCR cho <b>{ocrFile?.name}</b>. Dữ liệu chưa được trích xuất tự động.</>
                            : <>Chưa có tài liệu OCR. Tải lên file PDF để hệ thống tự trích xuất dữ liệu.</>}
                    </span>
                    <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                      {ocrStatus === "dang" ? (
                        <>
                          <button onClick={() => setShowOcrProgress(true)}
                            className="h-[24px] px-2 rounded-[3px] border border-black/20 hover:bg-black/5 text-[11px] font-medium transition-colors">Xem tiến trình</button>
                          <button onClick={() => setShowOcrCancel(true)}
                            className="h-[24px] px-2 rounded-[3px] border border-black/20 hover:bg-black/5 text-[11px] font-medium transition-colors">Hủy OCR</button>
                        </>
                      ) : (
                        <button onClick={reOcr}
                          className="inline-flex items-center gap-1 h-[24px] px-2 rounded-[3px] bg-[#8b1a1a] hover:bg-[#6e1414] text-white text-[11px] font-medium transition-colors">
                          <RefreshCw size={11} /> {ocrStatus === "chua" ? "Thực hiện OCR" : "Thực hiện OCR lại"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* OCR notice banner */}
                {ocrFields.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#fffbeb] border border-[#f59e0b] rounded-[3px] text-[12px] text-[#92400e]">
                    <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[10px] font-bold px-1.5 py-[2px] rounded-sm">OCR</span>
                    <span>Các trường được đánh dấu đã được trích xuất tự động từ tài liệu. Vui lòng kiểm tra và xác nhận lại thông tin.</span>
                    <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                      {editingRowId === null && ocrStatus === "thanhcong" && (
                        <button onClick={reOcr} className="inline-flex items-center gap-1 h-[24px] px-2 rounded-[3px] border border-[#f59e0b] hover:bg-[#fef3c7] text-[11px] font-medium transition-colors">
                          <RefreshCw size={11} /> Thực hiện OCR lại
                        </button>
                      )}
                      <button onClick={() => setOcrFields(new Set())} className="text-[#92400e] hover:text-[#78350f]"><X size={13} /></button>
                    </div>
                  </div>
                )}

                {/* 1. Thông tin chung */}
                <Section title="1. Thông tin chung">
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      <Lbl req>Hình thức nhận</Lbl>
                      <Sel value={hinhThucNhan} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHinhThucNhan(e.target.value)}>
                        <option value="">-- Chọn hình thức nhận --</option>
                        <option>Bưu điện</option>
                        <option>Điện tử</option>
                        <option>Trực tiếp</option>
                        <option>Nội bộ</option>
                        <option>Tiếp công dân</option>
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
                            <option value="Đơn khiếu nại tố cáo trong tố tụng">2. Đơn khiếu nại tố cáo trong tố tụng</option>
                            <option value="Thông báo phát hiện vi phạm pháp luật">3. Thông báo phát hiện vi phạm pháp luật</option>
                            <option value="Đơn khác">4. Đơn khác</option>
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
                    {/* Thông tin bì thư — chỉ với Trực tiếp / Bưu điện.
                        Nhập mã bì thư sẽ tự điền phần còn lại từ hệ thống bưu chính. */}
                    {canBiThu && (
                      <div className="col-span-3 border border-[#d6e4f0] bg-[#f7fbff] rounded-[4px] p-3 mb-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[12px] font-semibold text-[#1a5a96]">Thông tin bì thư</span>
                          <span className="text-[11px] text-[#888]">— nhập mã bì thư để lấy dữ liệu từ hệ thống bưu chính</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-end">
                          <div>
                            <Lbl>Mã bì thư</Lbl>
                            <Inp placeholder="VD: BT2026001" value={biThu.ma}
                              onChange={e => traBiThu(e.target.value)} />
                          </div>
                          <div>
                            <Lbl req>Ngày trên dấu bưu điện</Lbl>
                            <Inp type="date" value={biThu.ngayDau}
                              onChange={e => setBiThu(p => ({ ...p, ngayDau: e.target.value }))}
                              className={biThu.ngayDau ? "" : "border-[#e57373]"} />
                          </div>
                          <div>
                            <Lbl>Họ tên người gửi</Lbl>
                            <Inp placeholder="Nhập họ tên người gửi" value={biThu.nguoiGui}
                              onChange={e => setBiThu(p => ({ ...p, nguoiGui: e.target.value }))} />
                          </div>
                          <div>
                            <Lbl>Số điện thoại</Lbl>
                            <Inp placeholder="Nhập số điện thoại" value={biThu.sdt}
                              onChange={e => setBiThu(p => ({ ...p, sdt: e.target.value }))} />
                          </div>
                          <div className="col-span-2">
                            <Lbl>Địa chỉ</Lbl>
                            <Inp placeholder="Nhập địa chỉ" value={biThu.diaChi}
                              onChange={e => setBiThu(p => ({ ...p, diaChi: e.target.value }))} />
                          </div>
                        </div>
                      </div>
                    )}

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
                              value="Đơn khiếu nại tố cáo trong tố tụng"
                              checked={loaiDonChuyenDon === "Đơn khiếu nại tố cáo trong tố tụng"}
                              onChange={(e) => setLoaiDonChuyenDon(e.target.value)}
                              className="w-[14px] h-[14px] accent-[#8b1a1a]"
                            />
                            <span className="text-[12px] text-[#222]">Đơn khiếu nại tố cáo trong tố tụng</span>
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

                      {/* Loại QĐ/BA = Hành vi thì nhập nội dung hành vi bị khiếu nại/tố cáo.
                          Đặt ngay dưới ô chọn để đọc theo đúng thứ tự thao tác. */}
                      {laHanhVi && (
                        <div>
                          <Lbl req>Hành vi bị khiếu nại/Tố cáo</Lbl>
                          <textarea rows={3} placeholder="Nhập hành vi bị khiếu nại/tố cáo..."
                            value={hanhViBiKhieuNai} onChange={e => setHanhViBiKhieuNai(e.target.value)}
                            className={`w-full border rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none ${
                              hanhViBiKhieuNai ? "border-[#ccc]" : "border-[#e57373]"}`} />
                        </div>
                      )}

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
                          Không xác định thời hiệu giải quyết
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]" />
                          Trong hạn giải quyết 1 năm
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
                          <BtnAdd onClick={() => setShowThemTB(true)}><Plus size={12} /> Thêm</BtnAdd>
                        </div>
                        <Tbl headers={["STT", "Số thông báo", "Ngày thông báo", "Tòa án", "Thao tác"]}
                          emptyMsg="Chưa có dữ liệu">
                          {thongBaoTraLoi.length > 0 ? thongBaoTraLoi.map((tb, i) => (
                            <tr key={tb.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                              <Td center>{i + 1}</Td>
                              <Td>{tb.soTB}</Td>
                              <Td>{tb.ngayTB}</Td>
                              <Td>{tb.toaAn}</Td>
                              <Td center>
                                <button onClick={() => setThongBaoTraLoi(p => p.filter(x => x.id !== tb.id))}
                                  className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                                  <Trash2 size={11} /> Xóa
                                </button>
                              </Td>
                            </tr>
                          )) : undefined}
                        </Tbl>
                      </div>

                      {/* Danh sách đơn liên quan */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-semibold text-[#444]">Danh sách đơn liên quan</span>
                          <BtnAdd onClick={() => setShowThemDonLQ(true)}><Plus size={12} /> Thêm</BtnAdd>
                        </div>
                        {donLienQuanRows.length === 0 ? (
                          <Tbl
                            headers={["STT", "Mã đơn", "Ngày nhận", "Người gửi đơn", "Thông tin đơn", "Người nhập", "Thao tác"]}
                            emptyMsg="Chưa có dữ liệu"
                          />
                        ) : (
                          <table className="w-full border-collapse text-[12px]">
                            <thead>
                              <tr className="bg-[#f5f5f5]">
                                {["STT", "Mã đơn", "Ngày nhận", "Người gửi đơn", "Thông tin đơn", "Người nhập", "Thao tác"].map(h => (
                                  <th key={h} className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] whitespace-nowrap">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {donLienQuanRows.map((r, i) => (
                                <tr key={r.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                                  <td className="border border-[#ddd] px-3 py-2 text-center text-[#666]">{i + 1}</td>
                                  <td className="border border-[#ddd] px-3 py-2 font-medium text-[#1a5a96] whitespace-nowrap">{r.maDon}</td>
                                  <td className="border border-[#ddd] px-3 py-2 text-[#555] whitespace-nowrap">{r.ngayNhan}</td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <div className="text-[#333] leading-snug">{r.nguoiGui}</div>
                                    <div className="text-[11px] text-[#666] mt-0.5 leading-snug">{r.diaChi}</div>
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <div className="space-y-[2px] leading-snug">
                                      <div><span className="text-[#555]">Số BA/QĐ: </span><span className="font-medium">{r.soBA || "—"}</span></div>
                                      <div><span className="text-[#555]">Ngày BA/QĐ: </span><span>{r.ngayBA || "—"}</span></div>
                                      <div><span className="text-[#555]">Hình thức: </span><span>{r.hinhThuc || "—"}</span></div>
                                      <div><span className="text-[#555]">Thủ tục giải quyết: </span><span>{r.thuTuc || "—"}</span></div>
                                    </div>
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <div className="text-[#333]">{r.nguoiNhap}</div>
                                    <div className="text-[11px] text-[#666]">{r.ngayNhap}</div>
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <button className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#1a5a96] hover:bg-[#eaf4ff] transition-colors whitespace-nowrap">
                                        <Eye size={10} /> Xem chi tiết
                                      </button>
                                      <button onClick={() => setDonLienQuanThem(p => p.filter(x => x.id !== r.id))}
                                        className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
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
                              {NGUOI_CHI_DAO.map(n => <option key={n}>{n}</option>)}
                            </Sel>
                          </div>
                          {yKienChiDaoCV !== "Không" && (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Lbl req>Nội dung chỉ đạo</Lbl>
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
                    extra={<BtnAdd onClick={() => setShowThemDonKem(true)}><Plus size={12} /> Thêm mới</BtnAdd>}
                  >
                    <Tbl headers={["STT", "Số đơn", "Ngày tiếp nhận", "Ngày ghi trên đơn", "Loại văn bản", "Thao tác"]}
                      emptyMsg="Chưa có đơn thụ lý kèm">
                      {donThuLyKem.length > 0 ? donThuLyKem.map((dk, i) => (
                        <tr key={dk.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                          <Td center>{i + 1}</Td>
                          <Td><span className="font-medium text-[#1a5a96]">{dk.soHieu || "— chưa có số —"}</span></Td>
                          <Td>{dk.ngayNhan}</Td>
                          <Td>{dk.ngayGhi || "—"}</Td>
                          <Td>
                            <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-medium border ${dk.laCongVan
                              ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"
                              : "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]"}`}>
                              {dk.laCongVan ? "Công văn" : "Đơn"}
                            </span>
                          </Td>
                          <Td center>
                            <button onClick={() => setDonThuLyKem(p => p.filter(x => x.id !== dk.id))}
                              className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                              <Trash2 size={11} /> Xóa
                            </button>
                          </Td>
                        </tr>
                      )) : undefined}
                    </Tbl>
                  </Section>
                )}

                {/* 5. Xử lý đơn / công văn */}
                <Section title={`${5 + secOffset}. ${["CV khác", "CV kiến nghị GĐT-TT", "CV chuyển kiến nghị GĐT-TT", "CV chuyển đơn"].includes(hinhThuc) ? "Xử lý công văn" : "Xử lý đơn"}`}>
                  {/* Gộp toàn bộ checkbox của mục Xử lý đơn về một chỗ.
                      Xin hoãn thi hành án: mọi loại án / hình thức đơn, trừ Đơn khác và CV khác.
                      Án tử hình và Áp dụng biện pháp XLCH: chỉ với án Hình sự. */}
                  <div className="flex items-center gap-6 flex-wrap mb-2">
                    {!["Đơn khác", "CV khác"].includes(hinhThuc) && (
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                        <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                          checked={xinHoanThiHanhAn} onChange={e => setXinHoanThiHanhAn(e.target.checked)} />
                        Xin hoãn thi hành án
                      </label>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                      <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                        checked={coNoiDungToCao} onChange={e => setCoNoiDungToCao(e.target.checked)} />
                      Có nội dung tố cáo
                    </label>
                    {loaiAnForm === "Hình sự" && (
                      <>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={anTuHinh}
                            onChange={e => { setAnTuHinh(e.target.checked); if (!e.target.checked) { setXinGiamAnTuHinh(false); setKeuOanAnTuHinh(false); setXinThiHanhAnSom(false); } }} />
                          Án tử hình
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={xulychuynhuong} onChange={e => setXulychuynhuong(e.target.checked)} />
                          Áp dụng biện pháp XLCH
                        </label>
                      </>
                    )}
                  </div>

                  {/* Tùy chọn con của Án tử hình */}
                  {loaiAnForm === "Hình sự" && anTuHinh && (
                    <div className="flex items-center gap-5 flex-wrap mb-2 pl-6">
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
                    </div>
                  )}

                  {coNoiDungToCao && (
                    <div className="mb-3">
                      <Lbl req>Nội dung tố cáo</Lbl>
                      <textarea rows={3} placeholder="Nhập nội dung tố cáo..."
                        className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
                    </div>
                  )}

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
                    {noiChuyenDen !== "Lưu theo dõi" && hinhThuc !== "CV khác" && hinhThuc !== "Đơn khác" && (
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
                              <option>Chờ ý kiến Lãnh đạo</option>
                              <option>Không</option>
                            </Sel>
                          </div>
                        ) : (
                          <div>
                            <Lbl req>Lý do không đủ điều kiện</Lbl>
                            <Sel value={lyDoKhongDu} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLyDoKhongDu(e.target.value)}>
                              <option value="">-- Chọn lý do --</option>
                              <option>Bản án/quyết định có hiệu lực pháp luật</option>
                              <option>Thiếu thông tin căn cước công dân</option>
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
                    {/* 6. Người tham gia tố tụng */}
                    {!isDonKhieuNaiTuPhap && (
                      <Section title={`${6 + secOffset}. Người tham gia tố tụng`}>
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
                                <BtnAdd onClick={() => setShowThemNguyenDon(true)}><Plus size={12} /> Thêm</BtnAdd>
                              </div>
                              <Tbl headers={["Họ và tên", "Năm sinh", "Địa chỉ", "Thao tác"]} emptyMsg="Chưa có thông tin">
                                {nguyenDon.length > 0 ? nguyenDon.map((n, i) => (
                                  <HangNguoiThamGia key={n.id} n={n} i={i}
                                    onXoa={() => setNguyenDon(p => p.filter(x => x.id !== n.id))} />
                                )) : undefined}
                              </Tbl>
                            </div>

                            {/* Bị đơn / người bị kiện */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] font-semibold text-[#444]">Bị đơn / người bị kiện</span>
                                <BtnAdd onClick={() => setShowThemBiDon(true)}><Plus size={12} /> Thêm</BtnAdd>
                              </div>
                              <Tbl headers={["Họ và tên", "Năm sinh", "Địa chỉ", "Thao tác"]} emptyMsg="Chưa có thông tin">
                                {biDon.length > 0 ? biDon.map((n, i) => (
                                  <HangNguoiThamGia key={n.id} n={n} i={i}
                                    onXoa={() => setBiDon(p => p.filter(x => x.id !== n.id))} />
                                )) : undefined}
                              </Tbl>
                            </div>

                            {/* Người có quyền lợi, nghĩa vụ liên quan */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] font-semibold text-[#444]">Người có quyền lợi, nghĩa vụ liên quan</span>
                                <BtnAdd onClick={() => setShowThemNguoiLQ(true)}><Plus size={12} /> Thêm</BtnAdd>
                              </div>
                              <Tbl headers={["Họ và tên", "Năm sinh", "Địa chỉ", "Thao tác"]} emptyMsg="Chưa có dữ liệu">
                                {nguoiLienQuan.length > 0 ? nguoiLienQuan.map((n, i) => (
                                  <tr key={n.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                                    <Td>
                                      <span className="font-medium text-[#1a5a96]">{n.hoTen}</span>
                                      {n.thongKe.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {n.thongKe.map(tk => (
                                            <span key={tk} className="inline-block px-1.5 py-[1px] rounded text-[10px] bg-[#fef3e2] text-[#b45309] border border-[#fcd48a]">{tk}</span>
                                          ))}
                                        </div>
                                      )}
                                    </Td>
                                    <Td>{n.namSinh}</Td>
                                    <Td>{n.diaChi}</Td>
                                    <Td center>
                                      <button onClick={() => setNguoiLienQuan(p => p.filter(x => x.id !== n.id))}
                                        className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                                        <Trash2 size={11} /> Xóa
                                      </button>
                                    </Td>
                                  </tr>
                                )) : undefined}
                              </Tbl>
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
          onUpload={(f) => {
            setOcrFile(f);
            setShowUploadPopup(false);
            setShowOcrConfirm(true);
          }}
        />
      )}
      {showOcrConfirm && ocrFile && (
        <PopupOcrConfirm
          file={ocrFile}
          onBack={() => { setShowOcrConfirm(false); setShowUploadPopup(true); }}
          onStart={startOcr}
        />
      )}
      {showOcrProgress && (
        <PopupOcrProgress
          step={ocrStep}
          onCancel={() => setShowOcrCancel(true)}
          // Đóng popup nhưng job vẫn chạy nền — hồ sơ giữ trạng thái "Đang OCR".
          onClose={() => setShowOcrProgress(false)}
        />
      )}
      {showOcrCancel && (
        <PopupOcrCancelConfirm
          onBack={() => setShowOcrCancel(false)}
          onConfirm={cancelOcr}
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
      {showThemTB && (
        <PopupThemThongBao
          onDong={() => setShowThemTB(false)}
          onThem={(tb) => {
            setThongBaoTraLoi(p => [...p, { id: Date.now(), ...tb }]);
            setShowThemTB(false);
          }}
        />
      )}
      {showThemDonLQ && (
        <PopupThemDonLienQuan
          onDong={() => setShowThemDonLQ(false)}
          onThem={(d) => {
            setDonLienQuanThem(p => [...p, { id: Date.now(), ...d }]);
            setShowThemDonLQ(false);
          }}
        />
      )}
      {showThemDonKem && (
        <PopupThemDonKem
          onDong={() => setShowThemDonKem(false)}
          onThem={(d) => {
            setDonThuLyKem(p => [...p, { id: Date.now(), ...d }]);
            setShowThemDonKem(false);
          }}
        />
      )}
      {showThemNguyenDon && (
        <PopupThemNguoiDungDon
          tieuDe="Thêm nguyên đơn/người khởi kiện"
          tuCachMacDinh="Nguyên đơn"
          coThongKe
          onDong={() => setShowThemNguyenDon(false)}
          onLuu={(n) => {
            setNguyenDon(p => [...p, { id: Date.now(), ...n }]);
            setShowThemNguyenDon(false);
          }}
        />
      )}
      {showThemBiDon && (
        <PopupThemNguoiDungDon
          tieuDe="Thêm bị đơn/người bị kiện"
          tuCachMacDinh="Bị đơn"
          coThongKe
          onDong={() => setShowThemBiDon(false)}
          onLuu={(n) => {
            setBiDon(p => [...p, { id: Date.now(), ...n }]);
            setShowThemBiDon(false);
          }}
        />
      )}
      {showThemNguoiLQ && (
        <PopupThemNguoiDungDon
          tieuDe="Thêm người có quyền lợi, nghĩa vụ liên quan"
          tuCachMacDinh="Người có quyền lợi, nghĩa vụ liên quan"
          coThongKe
          onDong={() => setShowThemNguoiLQ(false)}
          onLuu={(n) => {
            setNguoiLienQuan(p => [...p, { id: Date.now(), ...n }]);
            setShowThemNguoiLQ(false);
          }}
        />
      )}
    </div>
  );
}
