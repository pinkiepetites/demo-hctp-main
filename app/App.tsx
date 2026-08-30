import { useState, useRef, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  X, Plus, Trash2, Edit2, FileText, ChevronDown, ChevronRight,
  ChevronUp, Search, ZoomIn, ZoomOut, RotateCcw, Download, Upload,
  CornerUpLeft, Eye, Printer, Menu, PenLine, FolderOpen, LayoutTemplate,
  MessageSquare, Copy, Home, LayoutList, Mail, List,
  Users, ArrowDownToLine, ArrowUpFromLine, Archive, Clock,
  Gavel, Scale, Settings, RefreshCw, Send, GitMerge, Check, Save, Pencil, ChevronLeft,
  AlertCircle, Bell, FilePlus, Loader2, Ban, Inbox, ArrowLeft, History as HistoryIcon, AlertTriangle
} from "lucide-react";
import Dashboard from "./Dashboard";
import HieuSuatCanBoChiTiet from "./HieuSuatCanBoChiTiet";
import SoSanhLoaiAnChiTiet, { type KyBaoCao } from "./SoSanhLoaiAnChiTiet";
import DocumentNumberingModal from "./components/DocumentNumberingModal";
import {
  VanBanTrinhKyCuaToi, PheDuyetDeXuat,
  DU_LIEU_MAU, taoTuModal, apTrinhDuyet, nguoiTheoVaiTro, timVanBanTheoDon,
  laToTrinhPhanCong, luongToTrinhPhanCong,
  PanelChiTiet, TienTrinhGon, dangChoXuLy,
  type VanBanTrinh, type BuocKy, type TrangThaiVB, type TabDS, type TabPD,
} from "./components/QuanLyVanBan";

/** Nhãn ngắn của trạng thái văn bản, dùng cho chip "Đã có trong …" ở Danh sách đơn
 *  và cột Trạng thái ở màn Danh sách biểu mẫu. */
// Nhãn tag luôn viết hoa chữ cái đầu — thống nhất với mọi badge khác trong hệ thống.
const TRANG_THAI_NHAN: Record<TrangThaiVB, string> = {
  Nhap: "Nháp", ChoDuyet: "Chờ duyệt", ChoKy: "Chờ ký", ChoButPhe: "Chờ bút phê",
  BiTraLai: "Bị trả lại",
  DaBanHanh: "Đã ban hành", DaHuy: "Đã huỷ",
};
const TRANG_THAI_CLS: Record<TrangThaiVB, string> = {
  Nhap: "bg-[#f5f5f5] text-[#666] border-[#ddd]",
  ChoDuyet: "bg-[#e8f4ff] text-[#1a73e8] border-[#a9c9f4]",
  ChoKy: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  ChoButPhe: "bg-[#f3e8ff] text-[#6d28d9] border-[#d8b4fe]",
  BiTraLai: "bg-[#fde8e8] text-[#8b1a1a] border-[#f5b7b7]",
  DaBanHanh: "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]",
  DaHuy: "bg-[#f0f0f0] text-[#999] border-[#ddd]",
};
/** Chấm tròn màu trạng thái — dùng ở cột Thông tin giải quyết, nơi cột hẹp nên
 *  pill chữ chiếm nguyên dòng. Màu lấy đúng màu chữ của pill để hai nơi khớp nhau. */
const CHAM_TRANG_THAI: Record<TrangThaiVB, string> = {
  Nhap: "bg-[#999]",
  ChoDuyet: "bg-[#1a73e8]",
  ChoKy: "bg-[#f57f17]",
  ChoButPhe: "bg-[#6d28d9]",
  BiTraLai: "bg-[#c0392b]",
  DaBanHanh: "bg-[#1a7a45]",
  DaHuy: "bg-[#ccc]",
};
import type { KetQuaTrinhDuyet } from "./components/DocumentNumberingModal";
import { lyDoDonKhongHopLe, LY_DO_YEU_CAU_BO_SUNG } from "./components/DocumentNumberingModal";

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
// Đơn nằm trong tab "Đơn chờ phê duyệt" hiển thị ở Danh sách đơn với trạng thái
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

// Danh sách tòa án cho trường "Đơn vị chuyển đến" khi Nơi chuyển đến = Tòa khác —
// gồm cả tòa thường lẫn tòa án quân sự.
const TOA_KHAC_OPTIONS = [
  "TAND cấp cao tại Hà Nội",
  "TAND cấp cao tại Đà Nẵng",
  "TAND cấp cao tại TP. Hồ Chí Minh",
  "TAND Thành phố Hà Nội",
  "TAND Thành phố Hồ Chí Minh",
  "TAND Tỉnh Bắc Ninh",
  "TAND Tỉnh Vĩnh Phúc",
  "Tòa án quân sự trung ương",
  "Tòa án quân sự quân khu 1",
  "Tòa án quân sự quân khu 2",
  "Tòa án quân sự quân khu 3",
  "Tòa án quân sự quân khu 4",
  "Tòa án quân sự quân khu 5",
  "Tòa án quân sự quân khu 7",
  "Tòa án quân sự quân khu 9",
  "Tòa án quân sự thủ đô Hà Nội",
];

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
        className={`w-full h-[30px] px-2 ${hienX && !props.disabled ? "pr-12" : "pr-7"} text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] appearance-none disabled:bg-[#f5f5f5] disabled:text-[#888] disabled:cursor-not-allowed ${className}`}
      >
        {children}
      </select>
      {hienX && !props.disabled && <NutXoaChon onClick={xoa} right="right-6" size={13} />}
      <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
    </div>
  );
};

const Lbl = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <label className="block text-[13px] font-medium text-[#333] mb-1">
    {children}{req && <span className="text-[#c0392b] ml-0.5">*</span>}
  </label>
);

const BtnPrimary = ({ children, onClick, disabled = false, type = "button", className = "", title }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; type?: "button" | "submit"; className?: string; title?: string;
}) => (
  <button type={type} onClick={onClick} disabled={disabled} title={title}
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
          // Cột Thao tác giờ chỉ có 2 icon nên ghim hẹp, khỏi ăn chỗ của
          // các cột nội dung. "Thông tin người đứng đơn" / "Thông tin đơn" của
          // bảng Danh sách đơn liên quan đổi size cho nhau theo yêu cầu.
          <th key={i} className={`border border-[#ddd] px-3 py-[6px] font-semibold text-[#333] whitespace-nowrap ${h === "Thao tác" ? "text-center w-[76px]"
              : h === "Thông tin người đứng đơn" ? "text-left w-[270px]"
                : h === "Thông tin đơn" ? "text-left w-[447px]"
                  : "text-left"}`}>
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

// Loại công văn chỉ còn 3 lựa chọn. Các mục 9.3 / 8.1 trước đây nằm ở đây thực
// chất là NƠI GỬI công văn, không phải loại công văn — nên chuyển xuống làm gợi
// ý cho ô "Đơn vị gửi" bên dưới.
const LOAI_CONG_VAN_OPTIONS = [
  { group: null, label: "Công văn chuyển" },
  { group: null, label: "Công văn đề nghị" },
  { group: null, label: "Công văn kiến nghị" },
];

// Gợi ý Đơn vị gửi — người dùng chọn từ danh sách hoặc tự gõ tên đơn vị mới.
const DON_VI_GUI_NHOM: { nhom: string; items: string[] }[] = [
  {
    nhom: "Công văn 9.3",
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
    nhom: "Các vụ việc khác thuộc mục 8.1",
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

// Đơn vị gửi TRONG NGÀNH — tòa án các cấp và cơ quan thuộc hệ thống TAND.
const DON_VI_TRONG_NGANH: { nhom: string; items: string[] }[] = [
  {
    nhom: "Tòa án nhân dân tối cao",
    items: [
      "Văn phòng Tòa án nhân dân tối cao",
      "Vụ Giám đốc kiểm tra về hình sự",
      "Vụ Giám đốc kiểm tra về dân sự",
      "Vụ Giám đốc kiểm tra về hành chính",
      "Vụ Giám đốc kiểm tra về kinh doanh, thương mại, phá sản, lao động",
      "Vụ Pháp chế và Quản lý khoa học",
      "Ban Thanh tra Tòa án nhân dân tối cao",
    ],
  },
  {
    nhom: "Tòa án nhân dân cấp cao",
    items: [
      "Tòa án nhân dân cấp cao tại Hà Nội",
      "Tòa án nhân dân cấp cao tại Đà Nẵng",
      "Tòa án nhân dân cấp cao tại TP. Hồ Chí Minh",
    ],
  },
  {
    nhom: "Tòa án nhân dân cấp tỉnh",
    items: [
      "Tòa án nhân dân tỉnh Bắc Ninh",
      "Tòa án nhân dân tỉnh Bắc Giang",
      "Tòa án nhân dân tỉnh Lạng Sơn",
      "Tòa án nhân dân tỉnh Hà Nam",
      "Tòa án nhân dân tỉnh Vĩnh Phúc",
      "Tòa án nhân dân TP. Hà Nội",
      "Tòa án nhân dân TP. Hồ Chí Minh",
      "Tòa án nhân dân TP. Đà Nẵng",
    ],
  },
];

// Đơn vị gửi là TRẠI GIAM — đơn của phạm nhân gửi qua trại.
const DON_VI_TRAI_GIAM: { nhom: string; items: string[] }[] = [
  {
    nhom: "Trại giam thuộc Bộ Công an",
    items: [
      "Trại giam Thanh Xuân", "Trại giam Suối Hai", "Trại giam Hoàng Tiến",
      "Trại giam Ngọc Lý", "Trại giam Vĩnh Quang", "Trại giam Phú Sơn 4",
      "Trại giam Nam Hà", "Trại giam Ninh Khánh", "Trại giam Xuân Nguyên",
      "Trại giam Thủ Đức", "Trại giam Xuân Lộc", "Trại giam An Phước",
    ],
  },
  {
    nhom: "Cơ sở giam giữ khác",
    items: [
      "Trại tạm giam Công an tỉnh", "Nhà tạm giữ Công an huyện",
      "Cơ sở giáo dục bắt buộc", "Trường giáo dưỡng",
    ],
  },
];

// Đơn vị gửi NGOÀI NGÀNH — cơ quan nhà nước, phân theo hệ thống tổ chức bộ máy.
// Dùng khi không tích "trong ngành" và cũng không phải trại giam.
const DON_VI_CO_QUAN_NHA_NUOC: { nhom: string; items: string[] }[] = [
  {
    nhom: "Cơ quan quyền lực nhà nước",
    items: [
      "Quốc hội",
      "Ủy ban Thường vụ Quốc hội",
      "Hội đồng Dân tộc và các Ủy ban của Quốc hội",
      "Ủy ban Tư pháp của Quốc hội",
      "Đoàn Đại biểu Quốc hội",
      "Đại biểu Quốc hội",
      "Hội đồng nhân dân cấp tỉnh",
      "Hội đồng nhân dân cấp xã",
    ],
  },
  {
    nhom: "Cơ quan quản lý hành chính nhà nước",
    items: [
      "Chính phủ",
      "Văn phòng Chính phủ",
      "Bộ Công an",
      "Bộ Quốc phòng",
      "Bộ Tư pháp",
      "Bộ Nội vụ",
      "Thanh tra Chính phủ",
      "Ủy ban nhân dân cấp tỉnh",
      "Ủy ban nhân dân cấp xã",
    ],
  },
  {
    nhom: "Chủ tịch nước và cơ quan tư pháp",
    items: [
      "Văn phòng Chủ tịch nước",
      "Viện kiểm sát nhân dân tối cao",
      "Viện kiểm sát nhân dân cấp cao",
      "Viện kiểm sát nhân dân cấp tỉnh",
      "Cơ quan điều tra",
      "Cơ quan thi hành án dân sự",
    ],
  },
  {
    nhom: "Tổ chức chính trị – xã hội và cơ quan khác",
    items: [
      "Ủy ban Trung ương Mặt trận Tổ quốc Việt Nam",
      "Ủy ban Mặt trận Tổ quốc cấp tỉnh",
      "Hội Luật gia Việt Nam",
      "Liên đoàn Luật sư Việt Nam",
      "Hội Cựu chiến binh Việt Nam",
      "Hội Liên hiệp Phụ nữ Việt Nam",
      "Cơ quan báo chí",
      "Tổ chức, cá nhân khác",
    ],
  },
];

// Ô vừa nhập vừa chọn: gõ để lọc gợi ý, chọn từ danh sách, hoặc giữ nguyên chữ
// đã gõ để thêm đơn vị chưa có trong danh mục.
const ComboNhapChon = ({ value, onChange, nhomGoiY, placeholder, chiTrongDanhMuc }: {
  value: string;
  onChange: (v: string) => void;
  nhomGoiY: { nhom: string; items: string[] }[];
  placeholder?: string;
  /** true = chỉ cho chọn từ danh mục có sẵn, không cho "Dùng đơn vị mới" khi
   *  gõ một giá trị không khớp danh mục (dùng cho ô lọc — không phải nơi khai
   *  dữ liệu mới). */
  chiTrongDanhMuc?: boolean;
}) => {
  const [mo, setMo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mo) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMo(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [mo]);

  const tuKhoa = value.trim().toLowerCase();
  const loc = nhomGoiY
    .map(g => ({ ...g, items: g.items.filter(i => !tuKhoa || i.toLowerCase().includes(tuKhoa)) }))
    .filter(g => g.items.length > 0);
  const tatCa = nhomGoiY.flatMap(g => g.items);
  const laMoi = !chiTrongDanhMuc && !!value.trim() && !tatCa.some(i => i.toLowerCase() === tuKhoa);

  return (
    <div ref={ref} className="relative">
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setMo(true); }}
        onFocus={() => setMo(true)}
        placeholder={placeholder}
        className="w-full h-[30px] px-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] placeholder:text-[#aaa]" />
      <button type="button" onClick={() => setMo(m => !m)} tabIndex={-1}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#666]">
        <ChevronDown size={13} className={`transition-transform ${mo ? "rotate-180" : ""}`} />
      </button>

      {mo && (
        <div className="absolute left-0 right-0 top-[34px] z-50 bg-white border border-[#ccc] rounded-[3px] shadow-lg max-h-[260px] overflow-y-auto">
          {laMoi && (
            <button type="button" onClick={() => setMo(false)}
              className="w-full text-left px-3 py-2 text-[12px] text-[#1a7a45] bg-[#f3fbf6] hover:bg-[#e8f7ee] border-b border-[#e8f0ea] flex items-center gap-1.5">
              <Plus size={12} className="flex-shrink-0" />
              Dùng đơn vị mới: <span className="font-semibold">{value.trim()}</span>
            </button>
          )}
          {loc.length === 0 && !laMoi && (
            <div className="px-3 py-3 text-[12px] text-[#999] italic">Không có gợi ý phù hợp.</div>
          )}
          {loc.map(g => (
            <div key={g.nhom || "_"}>
              {g.nhom && (
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8b1a1a] bg-[#fafafa] border-y border-[#f0f0f0]">
                  — {g.nhom}
                </div>
              )}
              {g.items.map(i => (
                <button key={i} type="button"
                  onClick={() => { onChange(i); setMo(false); }}
                  className={`w-full text-left px-3 py-1.5 text-[12px] leading-snug hover:bg-[#eaf4ff] transition-colors ${i === value ? "bg-[#eaf4ff] text-[#1a5a96] font-medium" : "text-[#333]"}`}>
                  {i}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface CVForm {
  soHieu: string; soCongVan: string; ngayCongVan: string; ngayNhan: string;
  loaiCongVan: string; trongNganh: boolean; traiGiam: boolean;
  congVanChinh: boolean;
  donViGui: string; nguoiKy: string; chucVu: string; yeuCauThongBao: string;
  noiDungCongVan: string;
  diaDoanhCu: boolean; tinh: string; phuong: string; diaChi: string;
}

const PopupCongVan = ({ onClose, onSave, banDau, nhung = false }: {
  onClose: () => void;
  onSave: (cv: CongVan) => void;
  /** Có giá trị ⇒ đang sửa công văn đã có, không phải thêm mới. */
  banDau?: CongVan;
  /** Nhúng thẳng vào form thay vì bật popup — dùng cho hình thức
   *  "CV kiến nghị GĐT-TT", nơi đơn CHÍNH LÀ công văn nên chỉ có đúng một bản,
   *  không cần bảng danh sách và nút Thêm mới. */
  nhung?: boolean;
}) => {
  const [f, setF] = useState<CVForm>({
    soHieu: "", soCongVan: banDau?.so ?? "", ngayCongVan: banDau?.ngay ?? "", ngayNhan: "",
    loaiCongVan: banDau?.loai ?? "", trongNganh: false, traiGiam: false,
    congVanChinh: banDau?.congVanChinh ?? false,
    donViGui: banDau?.donVi ?? "", nguoiKy: "", chucVu: "", yeuCauThongBao: "",
    noiDungCongVan: "",
    diaDoanhCu: false, tinh: "", phuong: "", diaChi: "",
  });

  const txt = (k: keyof CVForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));
  const chk = (k: keyof CVForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(p => ({ ...p, [k]: e.target.checked }));

  const handleSave = () => {
    onSave({ id: banDau?.id ?? Date.now(), loai: f.loaiCongVan || "—", so: f.soCongVan || "—", ngay: f.ngayCongVan || "—", donVi: f.donViGui || "—", congVanChinh: f.congVanChinh });
    onClose();
  };

  const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
  );

  const Field = ({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) => (
    <div><Lbl req={req}>{label}</Lbl>{children}</div>
  );

  return (
    // Chế độ nhúng: bỏ lớp phủ, header và footer — chỉ còn thân form, đặt thẳng
    // vào mục "Thông tin công văn" của màn Thêm mới.
    <div className={nhung ? "" : "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"}>
      <div className={nhung ? "" : "bg-white rounded-[4px] shadow-2xl w-[700px] max-h-[92vh] flex flex-col border border-[#bbb]"}>
        {/* Header */}
        {!nhung && (
          <div className="flex items-center justify-between bg-[#1d2e4f] px-4 py-[10px] rounded-t-[4px]">
            <span className="text-white text-[14px] font-semibold">{banDau ? "Sửa công văn" : "Thêm mới công văn"}</span>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={nhung ? "p-3 space-y-3" : "overflow-y-auto p-4 space-y-3 flex-1"}>
          {/* Bốn trường định danh công văn xếp CHUNG một dòng — chúng luôn được
              đọc cùng nhau, tách xuống nhiều dòng chỉ làm form dài ra vô ích. */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <Field label="Số công văn"><Inp value={f.soCongVan} onChange={txt("soCongVan")} placeholder="Nhập số công văn" /></Field>
            <Field label="Ngày công văn"><Inp type="date" value={f.ngayCongVan} onChange={txt("ngayCongVan")} /></Field>
            <Field label="Ngày nhận"><Inp type="date" value={f.ngayNhan} onChange={txt("ngayNhan")} /></Field>
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
          </div>

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
            {/* Danh mục gợi ý đổi theo hai ô tích ở trên — mỗi nhánh là một hệ
                thống tổ chức khác hẳn, gộp chung một danh sách thì cán bộ phải
                lọc qua hàng trăm mục không liên quan. */}
            <Field label="Đơn vị gửi" req>
              <ComboNhapChon value={f.donViGui}
                nhomGoiY={f.trongNganh ? DON_VI_TRONG_NGANH
                  : f.traiGiam ? DON_VI_TRAI_GIAM
                    : DON_VI_CO_QUAN_NHA_NUOC}
                onChange={v => setF(p => ({ ...p, donViGui: v }))}
                placeholder={f.trongNganh ? "Chọn tòa án / đơn vị trong ngành"
                  : f.traiGiam ? "Chọn trại giam / cơ sở giam giữ"
                    : "Chọn cơ quan nhà nước hoặc nhập tên đơn vị"} />
            </Field>
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

        {/* Footer — chế độ nhúng không có nút riêng, dữ liệu lưu cùng nút Lưu
            của cả màn Thêm mới. */}
        {!nhung && (
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#ddd] bg-[#f9f9f9] rounded-b-[4px]">
            <BtnSecondary onClick={onClose}>Hủy</BtnSecondary>
            <BtnPrimary onClick={handleSave}>Lưu</BtnPrimary>
          </div>
        )}
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
  /** Nguyên trạng form lúc lưu — để mở lại đúng những gì đã nhập khi bấm Sửa. */
  luuForm?: any;
}

const TU_CACH_TO_TUNG = [
  "Người khởi kiện", "Người bị kiện", "Nguyên đơn", "Bị đơn",
  "Người có quyền lợi, nghĩa vụ liên quan", "Người đại diện hợp pháp",
  "Người bảo vệ quyền và lợi ích hợp pháp", "Người làm chứng",
  "Bị cáo", "Bị hại", "Người kháng cáo", "Người đề nghị",
];

// Dữ liệu người trong bản án (mock - ưu tiên gợi ý trong autocomplete)
// Địa giới hành chính (mock): Tỉnh → Quận/Huyện → Phường/Xã.
// Sau sáp nhập cấp huyện bị bỏ nên mặc định chỉ chọn Tỉnh → Phường/Xã;
// tick "Địa danh trước sáp nhập" thì hiện thêm cấp Quận/Huyện.
const DIA_GIOI: Record<string, Record<string, string[]>> = {
  "Hà Nội": {
    "Hoàn Kiếm": ["Phường Hàng Bài", "Phường Cửa Nam", "Phường Hàng Trống"],
    "Đống Đa": ["Phường Đống Đa", "Phường Quang Trung", "Phường Cát Linh"],
    "Hai Bà Trưng": ["Phường Bạch Mai", "Phường Thanh Nhàn"],
    "Ba Đình": ["Phường Ngọc Hà", "Phường Giảng Võ"],
    "Cầu Giấy": ["Phường Dịch Vọng", "Phường Nghĩa Đô"],
    "Thanh Xuân": ["Phường Khương Đình", "Phường Thanh Xuân Bắc"],
    "Gia Lâm": ["Xã Đông Dư", "Xã Bát Tràng", "Thị trấn Trâu Quỳ"],
  },
  "TP. Hồ Chí Minh": {
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Đa Kao"],
    "Quận 3": ["Phường Võ Thị Sáu", "Phường 4"],
    "Bình Thạnh": ["Phường 12", "Phường 25"],
  },
  "Đà Nẵng": {
    "Ngũ Hành Sơn": ["Phường Mỹ An", "Phường Khuê Mỹ"],
    "Hải Châu": ["Phường Hải Châu I", "Phường Thạch Thang"],
  },
  "Bắc Ninh": {
    "TP. Bắc Ninh": ["Phường Võ Cường", "Phường Suối Hoa", "Phường Đại Phúc"],
    "Từ Sơn": ["Phường Đông Ngàn", "Phường Đình Bảng"],
  },
  "Hải Phòng": { "Ngô Quyền": ["Phường Máy Tơ", "Phường Lạch Tray"], "Lê Chân": ["Phường An Biên"] },
  "Cần Thơ": { "Ninh Kiều": ["Phường Tân An", "Phường An Hội"] },
  "Bình Dương": { "Thủ Dầu Một": ["Phường Phú Cường", "Phường Hiệp Thành"] },
  "Đồng Nai": { "Biên Hòa": ["Phường Trung Dũng", "Phường Quang Vinh"] },
  "Bà Rịa - Vũng Tàu": { "Vũng Tàu": ["Phường 1", "Phường Thắng Tam"] },
};
const DS_TINH = Object.keys(DIA_GIOI);
const dsQuan = (tinh: string) => Object.keys(DIA_GIOI[tinh] ?? {});
/** Không chọn quận thì gộp phường của cả tỉnh — đúng với mô hình 2 cấp sau sáp nhập. */
const dsPhuong = (tinh: string, quan?: string) =>
  quan ? (DIA_GIOI[tinh]?.[quan] ?? []) : Object.values(DIA_GIOI[tinh] ?? {}).flat();

interface NguoiGoiY {
  ten: string; tuCach?: string; cccd: string; gioiTinh: string; ngaySinh: string; sdt: string;
  tinh: string; quanHuyen: string; phuongXa: string;
  diaChi: string;   // số nhà / đường / thôn — phần chi tiết, không lặp lại địa giới
}

const NGUOI_BAN_AN: NguoiGoiY[] = [
  {
    ten: "Nguyễn Văn An", tuCach: "Bị cáo", cccd: "031085001234", gioiTinh: "Nam", ngaySinh: "1985-03-12", sdt: "0912345678",
    tinh: "Hà Nội", quanHuyen: "Đống Đa", phuongXa: "Phường Đống Đa", diaChi: "Số 12, ngõ 45, phố Chùa Bộc"
  },
  {
    ten: "Trần Thị Bình", tuCach: "Bị hại", cccd: "079090005678", gioiTinh: "Nữ", ngaySinh: "1990-07-25", sdt: "0987654321",
    tinh: "TP. Hồ Chí Minh", quanHuyen: "Quận 1", phuongXa: "Phường Bến Nghé", diaChi: "Số 88, đường Lê Lợi"
  },
  {
    ten: "Lê Văn Cường", tuCach: "Người kháng cáo", cccd: "026078009012", gioiTinh: "Nam", ngaySinh: "1978-11-05", sdt: "0901234567",
    tinh: "Đà Nẵng", quanHuyen: "Ngũ Hành Sơn", phuongXa: "Phường Mỹ An", diaChi: "Số 25, đường Ngũ Hành Sơn"
  },
];

// Dữ liệu con người (mock - gợi ý sau bản án)
const NGUOI_CON_NGUOI: NguoiGoiY[] = [
  {
    ten: "Phạm Thị Dung", cccd: "040088003456", gioiTinh: "Nữ", ngaySinh: "1988-05-18", sdt: "0978123456",
    tinh: "Bắc Ninh", quanHuyen: "TP. Bắc Ninh", phuongXa: "Phường Võ Cường", diaChi: "Số 7, đường Lý Thái Tổ"
  },
  {
    ten: "Hoàng Văn Em", cccd: "001075007890", gioiTinh: "Nam", ngaySinh: "1975-09-30", sdt: "0965432109",
    tinh: "Hà Nội", quanHuyen: "Hoàn Kiếm", phuongXa: "Phường Hàng Bài", diaChi: "Số 15, phố Ngô Quyền"
  },
  {
    ten: "Vũ Thị Phương", cccd: "036092001122", gioiTinh: "Nữ", ngaySinh: "1992-01-15", sdt: "0943211234",
    tinh: "Hà Nội", quanHuyen: "Gia Lâm", phuongXa: "Xã Đông Dư", diaChi: "Thôn Đông Dư Thượng"
  },
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

// ─── Người tham gia tố tụng suy từ bản án ────────────────────────────────────
// Tra cứu bản án xong là điền sẵn người tham gia, cán bộ chỉ kiểm tra và sửa.
// Vai trò khác nhau theo loại án: hình sự là BỊ CÁO (có tội danh), các loại còn
// lại là nguyên đơn / bị đơn / người liên quan.
export interface NguoiTuBanAn {
  hoTen: string; namSinh: string; diaChi: string;
  toiDanh?: string;
  /** Điểm – khoản – điều của Bộ luật Hình sự bị truy tố, hiện trong ngoặc
   *  sau tội danh. Cùng một tội danh nhưng khác khoản là khác khung hình phạt,
   *  nên cột Tội danh phải nêu rõ chứ không chỉ ghi tên tội. */
  dieuKhoan?: string;
}
interface BoNguoiThamGia {
  quanHe?: string;
  nguyenDon?: NguoiTuBanAn[];
  biDon?: NguoiTuBanAn[];
  lienQuan?: NguoiTuBanAn[];
  biCao?: NguoiTuBanAn[];
}

const NGUOI_THEO_LOAI_AN: Record<string, BoNguoiThamGia> = {
  "Hình sự": {
    biCao: [
      {
        hoTen: "Vũ Hoa Hào", namSinh: "1988", diaChi: "Số 27, ngõ 5, đường Ngô Gia Tự, Phường Tiền An, Tỉnh Bắc Ninh",
        toiDanh: "Cố ý gây thương tích", dieuKhoan: "điểm a khoản 1 Điều 134 BLHS"
      },
      {
        hoTen: "Đặng Thiên Dương", namSinh: "1992", diaChi: "Thôn Đông, xã Nam Sơn, Tỉnh Bắc Ninh",
        toiDanh: "Cố ý gây thương tích", dieuKhoan: "điểm đ khoản 2 Điều 134 BLHS"
      },
      {
        hoTen: "Lê Văn Tám", namSinh: "1979", diaChi: "Số 12, phố Cát Linh, Phường Cát Linh, Thành phố Hà Nội",
        toiDanh: "Gây rối trật tự công cộng", dieuKhoan: "khoản 1 Điều 318 BLHS"
      },
    ],
  },
  "Dân sự": {
    quanHe: "Tranh chấp quyền sử dụng đất",
    nguyenDon: [{ hoTen: "Nguyễn Văn An", namSinh: "1965", diaChi: "Phường Võ Cường, Tỉnh Bắc Ninh" }],
    biDon: [{ hoTen: "Trần Thị Bình", namSinh: "1970", diaChi: "Phường Đại Phúc, Tỉnh Bắc Ninh" }],
    lienQuan: [{ hoTen: "Nguyễn Thị Phương", namSinh: "1990", diaChi: "Phường Võ Cường, Tỉnh Bắc Ninh" }],
  },
  "Hành chính": {
    quanHe: "Khiếu kiện quyết định hành chính về quản lý đất đai",
    nguyenDon: [{ hoTen: "Nguyễn Văn An", namSinh: "1965", diaChi: "Phường Võ Cường, Tỉnh Bắc Ninh" }],
    biDon: [{ hoTen: "UBND tỉnh Bắc Ninh", namSinh: "—", diaChi: "Số 1, đường Lý Thái Tổ, Tỉnh Bắc Ninh" }],
    lienQuan: [{ hoTen: "Sở Tài nguyên và Môi trường tỉnh Bắc Ninh", namSinh: "—", diaChi: "Đường Lý Thái Tổ, Tỉnh Bắc Ninh" }],
  },
  "Kinh doanh thương mại": {
    quanHe: "Tranh chấp hợp đồng mua bán hàng hóa",
    nguyenDon: [{ hoTen: "Công ty TNHH Minh Đức", namSinh: "—", diaChi: "Số 18 Nguyễn Huệ, Thành phố Đà Nẵng" }],
    biDon: [{ hoTen: "Công ty CP Xây dựng Thăng Long", namSinh: "—", diaChi: "Quận Cầu Giấy, Thành phố Hà Nội" }],
  },
  "Hôn nhân gia đình": {
    quanHe: "Ly hôn, chia tài sản chung",
    nguyenDon: [{ hoTen: "Vũ Văn Giang", namSinh: "1985", diaChi: "Số 55 Láng Hạ, Thành phố Hà Nội" }],
    biDon: [{ hoTen: "Đinh Thị Hoa", namSinh: "1987", diaChi: "Số 55 Láng Hạ, Thành phố Hà Nội" }],
  },
  "Lao động": {
    quanHe: "Tranh chấp về đơn phương chấm dứt hợp đồng lao động",
    nguyenDon: [{ hoTen: "Trương Quang Sáng", namSinh: "1983", diaChi: "KCN Sóng Thần, Tỉnh Bình Dương" }],
    biDon: [{ hoTen: "Công ty TNHH ABC Việt Nam", namSinh: "—", diaChi: "KCN Sóng Thần, Tỉnh Bình Dương" }],
  },
};

// Một hàng trong bảng người tham gia tố tụng (nguyên đơn / bị đơn / người liên quan)
const HangNguoiThamGia = ({ n, i, onXoa, onSua }: { n: NguoiDungDon; i: number; onXoa: () => void; onSua?: () => void }) => (
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
      <div className="flex items-center justify-center gap-0.5">
        {onSua && <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sửa" onClick={onSua} />}
        <ActionBtn icon={<Trash2 size={14} />} color="red" title="Xóa" onClick={onXoa} />
      </div>
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

const PopupThemNguoiDungDon = ({ onDong, onLuu, tieuDe = "Thêm người đứng đơn", tuCachMacDinh = "", coThongKe = false, banDau }: {
  onDong: () => void;
  onLuu: (n: Omit<NguoiDungDon, "id">) => void;
  tieuDe?: string;
  tuCachMacDinh?: string;
  coThongKe?: boolean;
  /** Có giá trị ⇒ đang sửa: nạp lại nguyên trạng form đã lưu. */
  banDau?: NguoiDungDon;
}) => {
  const bd = banDau?.luuForm;
  const [laCaNhan, setLaCaNhan] = useState<boolean>(bd?.laCaNhan ?? true);
  const [tuCach, setTuCach] = useState(banDau?.tuCach ?? tuCachMacDinh);
  const [thongKe, setThongKe] = useState<string[]>(banDau?.thongKe ?? []);
  const [moThongKe, setMoThongKe] = useState(false);
  const [khongCoCanCuoc, setKhongCoCanCuoc] = useState<boolean>(bd?.khongCoCanCuoc ?? false);
  const [laDangVien, setLaDangVien] = useState<boolean>(bd?.laDangVien ?? false);
  const [coTienAn, setCoTienAn] = useState<boolean>(bd?.coTienAn ?? false);
  const [congChuc, setCongChuc] = useState<string>(bd?.congChuc ?? "Không");
  const [nghienMaTuy, setNghienMaTuy] = useState<string>(bd?.nghienMaTuy ?? "Không");
  const [diaDanhCu, setDiaDanhCu] = useState<boolean>(bd?.diaDanhCu ?? false);
  const [khongCoTT, setKhongCoTT] = useState<boolean>(bd?.khongCoTT ?? false);
  const [ghiChu, setGhiChu] = useState<string>(bd?.ghiChu ?? "");
  const [daBam, setDaBam] = useState(false);
  const [moConNguoi, setMoConNguoi] = useState(true);
  const [moNangCao, setMoNangCao] = useState(false);

  const [f, setF] = useState<Record<string, string>>(bd?.f ?? {});
  const g = (k: string) => f[k] ?? "";
  const dat = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));

  const [giayTo, setGiayTo] = useState<{ id: number; loai: string; so: string; ngayCap: string; noiCap: string }[]>(bd?.giayTo ?? []);
  const [diaChis, setDiaChis] = useState<{ ten: string; chiTiet: string; phuongXa: string; tinhTP: string; quocGia: string }[]>(
    bd?.diaChis ?? CAC_DIA_CHI.map(ten => ({ ten, chiTiet: "", phuongXa: "", tinhTP: "", quocGia: "Việt Nam" })));
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
      lienHeChinh: banDau?.lienHeChinh ?? false,
      hoTen: laCaNhan ? g("hoTen").trim() : g("tenToChuc").trim(),
      tuCach,
      diaChi: diaChiDayDu || g("noiLamViec") || "—",
      sdt: g("sdt") || "—",
      namSinh: g("ngaySinh") ? g("ngaySinh").slice(0, 4) : "—",
      thongKe,
      luuForm: {
        laCaNhan, khongCoCanCuoc, laDangVien, coTienAn, congChuc, nghienMaTuy,
        diaDanhCu, khongCoTT, ghiChu, f, giayTo, diaChis,
      },
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

          {/* Chọn từ bản án */}
          <div className="bg-[#f0f7ff] border border-[#c8def7] rounded-[4px] px-3 py-2.5">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold text-[#1d2e4f] whitespace-nowrap">Chọn từ bản án:</span>
              <div className="flex-1 relative">
                <select
                  className="w-full h-[30px] pl-2 pr-8 text-[12px] border border-[#b8d0ee] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]"
                  onChange={e => {
                    const idx = parseInt(e.target.value);
                    if (isNaN(idx)) return;
                    const ng = NGUOI_BAN_AN[idx];
                    setF(p => ({ ...p, hoTen: ng.ten, soCanCuoc: ng.cccd, gioiTinh: ng.gioiTinh, ngaySinh: ng.ngaySinh, sdt: ng.sdt }));
                    setTuCach(ng.tuCach ?? "");
                    // Điền luôn "Nơi ở hiện tại" (diaChis[4]) cho khớp hành vi
                    // autofill ở khối Người đứng đơn ngoài màn chính.
                    setDiaChis(p => p.map((d, j) =>
                      j === 4 ? { ...d, chiTiet: ng.diaChi, phuongXa: ng.phuongXa, tinhTP: ng.tinh } : d));
                    e.target.value = "";
                  }}
                >
                  <option value="">-- Chọn người từ bản án/quyết định --</option>
                  {NGUOI_BAN_AN.map((ng, i) => (
                    <option key={i} value={i}>
                      {ng.ten} — {ng.tuCach} — CCCD: {ng.cccd}
                    </option>
                  ))}
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
          </div>

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
                <div className="flex-1">
                  {/* Hàng 1: Các thông tin cơ bản */}
                  <div className="grid grid-cols-5 gap-x-4 gap-y-3 mb-3">
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
                  </div>

                  {/* Nút ẩn/hiển thị thông tin nâng cao */}
                  <div className="mb-2">
                    <button type="button" onClick={() => setMoNangCao(!moNangCao)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#ccc] rounded-[3px] bg-white text-[12px] text-[#555] hover:bg-[#fafafa] font-medium transition-colors">
                      {moNangCao ? "− Ẩn bớt thông tin nâng cao" : "+ Hiển thị thông tin nâng cao"}
                    </button>
                  </div>

                  {/* Các thông tin nâng cao */}
                  {moNangCao && (
                    <div className="grid grid-cols-5 gap-x-4 gap-y-3 border-t border-[#eee] pt-3">
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
                  )}
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
              {/* Chỉ hiển thị Nơi ở hiện tại mặc định */}
              {diaChis.map((dc, i) => {
                if (i !== 4 && !moNangCao) return null;
                return (
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
                );
              })}
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
// `dienTuDon`: khi cán bộ bấm "Chọn làm đơn bổ sung" ở bảng Đơn liên quan,
// thông tin người đứng đơn của đơn đó được đổ xuống đây — đơn bổ sung luôn
// cùng một người đứng đơn với đơn gốc nên không bắt gõ lại.
const DonFields = ({ don, dienTuDon }: { don?: DonLienQuan | null; dienTuDon?: DonLienQuan | null }) => {
  const [diaDanhCu, setDiaDanhCu] = useState(false);
  const [yKienChiDao, setYKienChiDao] = useState("Không");
  const [nguoiDungDon, setNguoiDungDon] = useState<NguoiDungDon[]>([]);
  const [showThemNDD, setShowThemNDD] = useState(false);
  const [suaNDDId, setSuaNDDId] = useState<number | null>(null);

  // ── Inline single-person fields (khi chỉ có ≤1 người) ──
  // Mở từ link "Mã đơn" ở tab mới → điền sẵn người đứng đơn của đơn đó
  const [inHoTen, setInHoTen] = useState(don?.nguoiGui ?? "");
  const [inGioiTinh, setInGioiTinh] = useState("");
  const [inNgaySinh, setInNgaySinh] = useState("");
  const [inCCCD, setInCCCD] = useState("");
  const [khongCoCccd, setKhongCoCccd] = useState(false);
  const [inSdt, setInSdt] = useState("");
  const [inDiaChi, setInDiaChi] = useState(don?.diaChi ?? "");
  // Địa giới — trước đây là 3 select không kiểm soát nên autofill không đổ vào được.
  const [inTinh, setInTinh] = useState("");
  const [inQuanHuyen, setInQuanHuyen] = useState("");
  const [inPhuongXa, setInPhuongXa] = useState("");

  // Autocomplete state
  const [hoTenGợiY, setHoTenGoiY] = useState<typeof NGUOI_BAN_AN>([]);
  const [cccdGợiY, setCccdGoiY] = useState<typeof NGUOI_BAN_AN>([]);
  const [showHoTenDD, setShowHoTenDD] = useState(false);
  const [showCccdDD, setShowCccdDD] = useState(false);

  // Tổng nguồn gợi ý: bản án trước, con người sau
  const allSuggestions = [
    ...NGUOI_BAN_AN.map(n => ({ ...n, nguon: "Bản án" as const })),
    ...NGUOI_CON_NGUOI.map(n => ({ ...n, tuCach: "Người đứng đơn", nguon: "Con người" as const })),
  ];

  const handleHoTenChange = (val: string) => {
    setInHoTen(val);
    if (val.trim().length >= 1) {
      const filtered = allSuggestions.filter(n => n.ten.toLowerCase().includes(val.toLowerCase()));
      setHoTenGoiY(filtered as any);
      setShowHoTenDD(filtered.length > 0);
    } else {
      setShowHoTenDD(false);
    }
  };

  const handleCccdChange = (val: string) => {
    setInCCCD(val);
    if (val.trim().length >= 3) {
      const filtered = allSuggestions.filter(n => n.cccd.includes(val));
      setCccdGoiY(filtered as any);
      setShowCccdDD(filtered.length > 0);
    } else {
      setShowCccdDD(false);
    }
  };

  const applyNguoiGoiY = (ng: (typeof allSuggestions)[0]) => {
    setInHoTen(ng.ten);
    setInCCCD(ng.cccd);
    setInGioiTinh(ng.gioiTinh);
    setInNgaySinh(ng.ngaySinh);
    setInSdt(ng.sdt);
    // Đổ luôn cả khối địa chỉ: Tỉnh → Quận/Huyện → Phường/Xã → số nhà.
    // Chọn một người là điền xong cả nhân thân lẫn nơi cư trú, không phải
    // gõ lại bốn ô mà hệ thống đã biết.
    setInTinh(ng.tinh);
    setInQuanHuyen(ng.quanHuyen);
    setInPhuongXa(ng.phuongXa);
    setInDiaChi(ng.diaChi);
    setShowHoTenDD(false);
    setShowCccdDD(false);
  };

  // Điền người đứng đơn từ đơn gốc khi được chọn làm đơn bổ sung. Nếu người đó
  // có sẵn trong kho (bản án / con người) thì lấy luôn CCCD, ngày sinh, địa giới.
  const [tuDonBoSung, setTuDonBoSung] = useState(false);
  useEffect(() => {
    if (!dienTuDon) return;
    const khop = allSuggestions.find(n => norm(n.ten) === norm(dienTuDon.nguoiGui));
    if (khop) {
      applyNguoiGoiY(khop);
    } else {
      setInHoTen(dienTuDon.nguoiGui);
      setInDiaChi(dienTuDon.diaChi);
    }
    setTuDonBoSung(true);
  }, [dienTuDon]);

  /** Đổi tỉnh thì quận/phường cũ không còn thuộc tỉnh mới ⇒ xoá để tránh
   *  dữ liệu chắp vá (phường Hà Nội nằm trong tỉnh Đà Nẵng). */
  const doiTinh = (t: string) => { setInTinh(t); setInQuanHuyen(""); setInPhuongXa(""); };
  const doiQuan = (q: string) => { setInQuanHuyen(q); setInPhuongXa(""); };

  // Chuyển inline → danh sách khi thêm người thứ 2+
  const chuyenSangDanhSach = () => {
    const dsPerson: NguoiDungDon[] = [];
    if (inHoTen.trim()) {
      dsPerson.push({
        id: Date.now(),
        hoTen: inHoTen,
        tuCach: "Người đứng đơn",
        diaChi: inDiaChi || "—",
        sdt: inSdt || "—",
        namSinh: inNgaySinh ? inNgaySinh.slice(0, 4) : "—",
        thongKe: [],
        lienHeChinh: true,
      });
    }
    setNguoiDungDon(dsPerson);
    setShowThemNDD(true);
  };

  // Chế độ: chỉ 1 người thì inline, ≥2 người thì list
  const useListMode = nguoiDungDon.length >= 2;
  const useSingleMode = !useListMode;

  return (
    <div className="space-y-3">
      {/* ── Người đứng đơn ── */}
      {useSingleMode ? (
        /* === Chế độ đơn: hiển thị inline === */
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold text-[#333] border-l-4 border-[#8b1a1a] pl-2 uppercase">Người đứng đơn</span>
            <button type="button"
              onClick={chuyenSangDanhSach}
              className="inline-flex items-center gap-1 h-[26px] px-2.5 border border-[#ccc] rounded-[3px] text-[11px] text-[#555] hover:bg-white transition-colors">
              <Plus size={11} /> Thêm người thứ 2
            </button>
          </div>
          <div className="grid grid-cols-6 gap-x-3 gap-y-2.5">
            {/* Họ tên với autocomplete */}
            <div className="col-span-2 relative">
              <Lbl>Họ và tên</Lbl>
              <Inp
                placeholder="Nhập hoặc tìm kiếm..."
                value={inHoTen}
                onChange={e => handleHoTenChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowHoTenDD(false), 180)}
                onFocus={() => inHoTen.length >= 1 && setShowHoTenDD(hoTenGợiY.length > 0)}
              />
              {showHoTenDD && (
                <div className="absolute z-50 top-full left-0 right-0 bg-white border border-[#ddd] rounded-[3px] shadow-lg mt-0.5 max-h-[180px] overflow-y-auto">
                  {(hoTenGợiY as any[]).map((ng, i) => (
                    <button key={i} type="button"
                      onMouseDown={() => applyNguoiGoiY(ng)}
                      className="w-full text-left px-3 py-2 hover:bg-[#f0f7ff] border-b border-[#f0f0f0] last:border-0">
                      <div className="text-[12px] font-medium text-[#1d2e4f]">{ng.ten}</div>
                      <div className="text-[11px] text-[#888] flex gap-3 mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${ng.nguon === "Bản án" ? "bg-[#fef3e2] text-[#b45309]" : "bg-[#e8f0fe] text-[#1a5a96]"}`}>{ng.nguon}</span>
                        <span>{ng.tuCach}</span>
                        <span>CCCD: {ng.cccd}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Giới tính */}
            <div>
              <Lbl>Giới tính</Lbl>
              <Sel value={inGioiTinh} onChange={e => setInGioiTinh(e.target.value)}>
                <option value="">-- Chọn --</option>
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </Sel>
            </div>
            {/* Ngày sinh */}
            <div>
              <Lbl>Ngày sinh</Lbl>
              <Inp type="date" value={inNgaySinh} onChange={e => setInNgaySinh(e.target.value)} />
            </div>
            {/* CCCD với autocomplete */}
            <div className="relative">
              <Lbl>Số CCCD</Lbl>
              <div className="flex gap-1.5">
                <Inp
                  placeholder={khongCoCccd ? "Không có thông tin" : "Nhập số CCCD..."}
                  value={khongCoCccd ? "" : inCCCD}
                  disabled={khongCoCccd}
                  onChange={e => handleCccdChange(e.target.value)}
                  onBlur={() => setTimeout(() => setShowCccdDD(false), 180)}
                  onFocus={() => !khongCoCccd && inCCCD.length >= 3 && setShowCccdDD(cccdGợiY.length > 0)}
                />
                <button type="button" disabled={khongCoCccd}
                  className="flex-shrink-0 flex items-center justify-center w-[30px] h-[30px] border border-[#ccc] rounded-[3px] bg-white hover:bg-[#f5f5f5] disabled:opacity-50 transition-colors">
                  <Search size={13} className="text-[#555]" />
                </button>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer mt-1 text-[11px] text-[#555] whitespace-nowrap">
                <input type="checkbox" className="w-[12px] h-[12px] accent-[#8b1a1a]"
                  checked={khongCoCccd} onChange={e => {
                    setKhongCoCccd(e.target.checked);
                    if (e.target.checked) setInCCCD("");
                  }} />
                Không có thông tin CCCD
              </label>
              {showCccdDD && !khongCoCccd && (
                <div className="absolute z-50 top-full left-0 right-0 bg-white border border-[#ddd] rounded-[3px] shadow-lg mt-0.5 max-h-[160px] overflow-y-auto">
                  {(cccdGợiY as any[]).map((ng, i) => (
                    <button key={i} type="button"
                      onMouseDown={() => applyNguoiGoiY(ng)}
                      className="w-full text-left px-3 py-2 hover:bg-[#f0f7ff] border-b border-[#f0f0f0] last:border-0">
                      <div className="text-[12px] font-medium text-[#333]">{ng.ten} — {ng.cccd}</div>
                      <div className="text-[11px] text-[#888]">{ng.tuCach}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* SĐT */}
            <div>
              <Lbl>Số điện thoại</Lbl>
              <Inp placeholder="Số điện thoại" value={inSdt} onChange={e => setInSdt(e.target.value)} />
            </div>
          </div>

          {/* Địa chỉ — dùng chung với khối Địa danh trước sáp nhập */}
          <div className="mt-3 pt-3 border-t border-[#eee]">
            <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#555] mb-2">
              <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                checked={diaDanhCu} onChange={e => setDiaDanhCu(e.target.checked)} />
              Địa danh trước sáp nhập
            </label>
            <div className={`grid gap-x-3 gap-y-2.5 ${diaDanhCu ? "grid-cols-5" : "grid-cols-4"}`}>
              <div>
                <Lbl>Tỉnh/Thành phố</Lbl>
                <Sel value={inTinh} onChange={(e: any) => doiTinh(e.target.value)}>
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {DS_TINH.map(t => <option key={t}>{t}</option>)}
                </Sel>
              </div>
              {diaDanhCu && (
                <div>
                  <Lbl>Quận/Huyện</Lbl>
                  <Sel value={inQuanHuyen} onChange={(e: any) => doiQuan(e.target.value)} disabled={!inTinh}>
                    <option value="">{inTinh ? "Chọn Quận/Huyện" : "Chọn Tỉnh trước"}</option>
                    {dsQuan(inTinh).map(q => <option key={q}>{q}</option>)}
                  </Sel>
                </div>
              )}
              <div>
                <Lbl>Phường/Xã</Lbl>
                <Sel value={inPhuongXa} onChange={(e: any) => setInPhuongXa(e.target.value)} disabled={!inTinh}>
                  <option value="">{inTinh ? "Chọn Phường/Xã" : "Chọn Tỉnh trước"}</option>
                  {dsPhuong(inTinh, diaDanhCu ? inQuanHuyen : undefined).map(p => <option key={p}>{p}</option>)}
                </Sel>
              </div>
              <div>
                <Lbl>Địa chỉ</Lbl>
                <Inp placeholder="Nhập địa chỉ" value={inDiaChi} onChange={e => setInDiaChi(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* === Chế độ danh sách: ≥2 người === */
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-[#333]">Danh sách người đứng đơn</span>
            <BtnAdd onClick={() => setShowThemNDD(true)}><Plus size={12} /> Thêm mới</BtnAdd>
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
                  <div className="flex items-center justify-center gap-0.5">
                    <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sửa"
                      onClick={() => { setSuaNDDId(n.id); setShowThemNDD(true); }} />
                    <ActionBtn icon={<Trash2 size={14} />} color="red" title="Xóa"
                      onClick={() => setNguoiDungDon(p => p.filter(x => x.id !== n.id))} />
                  </div>
                </Td>
              </tr>
            )) : undefined}
          </Tbl>
        </div>
      )}

      {showThemNDD && (
        <PopupThemNguoiDungDon
          key={suaNDDId ?? "moi"}
          banDau={nguoiDungDon.find(x => x.id === suaNDDId)}
          onDong={() => { setShowThemNDD(false); setSuaNDDId(null); }}
          onLuu={(n) => {
            setNguoiDungDon(p => suaNDDId
              ? p.map(x => x.id === suaNDDId ? { ...x, ...n } : x)
              : [...p, { id: Date.now(), ...n, lienHeChinh: p.length === 0 }]);
            setShowThemNDD(false);
            setSuaNDDId(null);
          }}
        />
      )}



      {/* Nội dung đơn */}
      <div>
        <Lbl req>Nội dung đơn</Lbl>
        <textarea rows={4} placeholder="Nhập nội dung đơn..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
      </div>

      {/* Ghi chú */}
      <div>
        <Lbl>Ghi chú</Lbl>
        <textarea rows={2} placeholder="Nhập ghi chú (nếu có)..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
      </div>

      {/* Ý kiến chỉ đạo */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Lbl>Ý kiến chỉ đạo</Lbl>
        </div>
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
  "chanh-an": "Chánh án / Phó Chánh án",
};
// Thứ tự hiện trong menu "Chuyển vai trò" của khối tài khoản
const DS_VAI_TRO = ["can-bo", "truong-phong", "pho-vp", "lanh-dao", "chanh-an"] as const;
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

const KhoiTaiKhoan = ({ vaiTro, onDoiVaiTro }: { vaiTro: string; onDoiVaiTro?: (v: string) => void }) => {
  const [mo, setMo] = useState(false);
  const [moVaiTro, setMoVaiTro] = useState(false);
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

          {/* Chuyển vai trò — thay cho hộp "Vai trò" nổi ở góc màn hình */}
          {onDoiVaiTro && (
            <div className="border-t border-[#eee]">
              <div onClick={() => setMoVaiTro(v => !v)}
                className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#333] hover:bg-[#f5f5f5] cursor-pointer transition-colors">
                <span className="text-[#666]"><RefreshCw size={13} /></span>
                Chuyển vai trò
                <ChevronDown size={12} className={`ml-auto text-[#888] transition-transform ${moVaiTro ? "rotate-180" : ""}`} />
              </div>
              {moVaiTro && (
                <div className="bg-[#fafbfc] border-t border-[#f0f0f0] py-1">
                  {DS_VAI_TRO.map(v => (
                    <div key={v}
                      onClick={() => { onDoiVaiTro(v); setMoVaiTro(false); setMo(false); }}
                      className={`flex items-center gap-2 pl-8 pr-3 py-1.5 text-[12px] cursor-pointer transition-colors ${v === vaiTro
                          ? "text-[#8b1a1a] font-semibold bg-[#fdeaea]"
                          : "text-[#444] hover:bg-[#f0f2f5]"}`}>
                      {v === vaiTro
                        ? <Check size={12} className="flex-shrink-0" />
                        : <span className="w-[12px] flex-shrink-0" />}
                      {NHAN_VAI_TRO[v]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
const Sidebar = ({ activePage, onNav, currentRole = "can-bo", onDoiVaiTro, vanBanList = [] }: {
  activePage: string; onNav?: (page: string) => void; currentRole?: string;
  onDoiVaiTro?: (v: string) => void;
  /** Kho văn bản thật — badge phải đếm theo dữ liệu đang chạy, không phải
   *  mảng mẫu, nếu không con số đứng yên khi người dùng duyệt/trả lại. */
  vanBanList?: VanBanTrinh[];
}) => {
  const soBiTraLai = vanBanList.filter(v => v.trangThai === "BiTraLai").length;
  const soChoDuyet = vanBanList.filter(v => dangChoXuLy(v.trangThai)).length;
  // Cùng điều kiện với thẻ "Duyệt tài liệu" trên Dashboard — 4 vai trò nằm
  // trong luồng ký duyệt văn bản.
  const coQuyenPheDuyet = currentRole === "truong-phong" || currentRole === "pho-vp"
    || currentRole === "lanh-dao" || currentRole === "chanh-an";
  const [quanLyDonOpen, setQuanLyDonOpen] = useState(true);

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
              {currentRole === "truong-phong" && (
                <SubItem icon={<Inbox size={13} />} label="Tiếp nhận đơn liên thông" active={activePage === "lienthong"} nav="lienthong" />
              )}
              <SubItem icon={<List size={13} />} label="Danh sách đơn" active={activePage === "list" || activePage === "form" || activePage === "prototype"} nav="list" />
              {/* Đặt ngay dưới Danh sách đơn vì văn bản sinh ra từ chính màn đó —
                  cán bộ tạo tờ trình ở trên, theo dõi tiến độ ở đây. */}
              <SubItem icon={<Send size={13} />} label="Danh sách văn bản"
                active={activePage === "van_ban_trinh_ky"} nav="van_ban_trinh_ky"
                badge={soBiTraLai} />
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
            Lãnh đạo đã quen vào đây; đổi vị trí chỉ tạo thêm chi phí học lại.
            Chỉ hiện với vai trò nằm trong luồng ký duyệt văn bản (Trưởng phòng,
            Phó/Chánh Văn phòng, Lãnh đạo Tòa, Chánh án/Phó Chánh án) — Cán bộ
            không có bước duyệt nào nên không cần thấy mục này. */}
        {coQuyenPheDuyet && (
          <div>
            <GroupItem icon={<Users size={15} />} label="Công tác lãnh đạo"
              open={congTacLanhDaoOpen} onToggle={() => setCongTacLanhDaoOpen(!congTacLanhDaoOpen)} />
            {congTacLanhDaoOpen && (
              <div className="pb-1">
                {/* Badge = số đề xuất còn nằm trong luồng duyệt/ký/bút phê. */}
                <SubItem icon={<Check size={13} />} label="Phê duyệt đề xuất"
                  active={activePage === "phe_duyet"} nav="phe_duyet"
                  badge={soChoDuyet} />
              </div>
            )}
          </div>
        )}

        {/* Cấu hình chung */}
        <div className="flex items-center gap-2.5 px-3 py-[8px] cursor-pointer hover:bg-[#f5f5f5] transition-colors text-[13px] text-[#333]">
          <Settings size={15} className="text-[#666]" />
          <span>Cấu hình chung</span>
        </div>


      </nav>

      {/* Tài khoản đang đăng nhập — ghim đáy sidebar */}
      <KhoiTaiKhoan vaiTro={currentRole} onDoiVaiTro={onDoiVaiTro} />
    </div>
  );
};

// ─── Row action dropdown menu ────────────────────────────────────────────────
// ─── Popup Thêm đơn trùng ────────────────────────────────────────────────────
// Một lần mở tạo được nhiều đơn trùng: mỗi dòng trong bảng là một đơn sẽ sinh ra.
// Khối "Thông tin đơn" phía trên lấy nguyên từ đơn gốc và KHÔNG sửa được — đó là
// phần làm cho các đơn này "trùng" nhau; chỉ phần định danh từng đơn mới nhập tay.
interface DongDonTrung {
  id: number;
  soHieuDon: string;
  ngayNhan: string;
  ngayTrenDon: string;
  laCongVan: boolean;
  soCV: string;
  ngayCV: string;
  trongNganh: boolean;
  donViGui: string;
  nguoiKy: string;
  chucVu: string;
}

const PopupThemDonTrung = ({ donGoc, onDong, onLuu }: {
  donGoc: DanhSachDonRow;
  onDong: () => void;
  onLuu: (dong: DongDonTrung[]) => void;
}) => {
  const homNay = new Date().toISOString().split("T")[0];
  const dongMoi = (): DongDonTrung => ({
    id: Date.now() + Math.floor(Math.random() * 1000),
    soHieuDon: "", ngayNhan: homNay, ngayTrenDon: homNay,
    laCongVan: false, soCV: "", ngayCV: "",
    trongNganh: false, donViGui: "", nguoiKy: "", chucVu: "",
  });
  const [dong, setDong] = useState<DongDonTrung[]>([dongMoi()]);
  const dat = (id: number, k: keyof DongDonTrung) => (v: any) =>
    setDong(p => p.map(d => d.id === id ? { ...d, [k]: v } : d));
  // Cột phụ chỉ chiếm chỗ khi thực sự có dòng dùng tới.
  const coCongVan = dong.some(d => d.laCongVan);
  const coTrongNganh = dong.some(d => d.trongNganh);

  const O = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props}
      className={`w-full h-[30px] px-2 text-[12px] border rounded-[3px] focus:outline-none focus:border-[#1a73e8]
        ${props.disabled ? "bg-[#f5f5f5] border-[#e0e0e0] text-[#aaa]" : "bg-white border-[#ccc] text-[#222]"}`} />
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4" onClick={onDong}>
      <div className="bg-white rounded-[6px] shadow-2xl w-full max-w-[1320px] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-5 py-3 bg-[#1d2e4f] text-white flex-shrink-0">
          <div className="text-[15px] font-bold">Thêm đơn trùng</div>
          <button onClick={onDong} className="text-white/70 hover:text-white"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Thông tin dùng chung — lấy từ đơn gốc, chỉ đọc */}
          <div className="text-[13px] font-semibold text-[#333] mb-2">Thông tin đơn</div>
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              ["Người gửi đơn", donGoc.nguoiGui],
              ["Số BA/QĐ", donGoc.thongTinDon.soBaqd],
              ["Ngày bản án", donGoc.thongTinDon.ngay],
              ["Tòa xét xử", donGoc.thongTinDon.toaXetXu],
            ].map(([nhan, giaTri]) => (
              <div key={nhan}>
                <label className="block text-[12px] text-[#888] mb-1">{nhan}:</label>
                <div className="h-[34px] px-3 flex items-center text-[13px] text-[#333] bg-[#f5f5f5] border border-[#e0e0e0] rounded-[4px]">
                  {giaTri || "—"}
                </div>
              </div>
            ))}
          </div>

          {/* Bảng KHÔNG cuộn ngang. 5 cột phụ (số/ngày công văn, đơn vị gửi,
              người ký, chức vụ) chỉ hiện khi có dòng nào tick ô tương ứng —
              trạng thái thường chỉ còn 6 cột nên vừa khít bề ngang. */}
          <div className="border border-[#ddd] rounded-[4px]">
            <table className="w-full table-fixed border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border-b border-[#ddd] px-2 py-2 w-[42px] text-center font-semibold text-[#333]">STT</th>
                  <th className="border-b border-[#ddd] px-2 py-2 text-left font-semibold text-[#333]">Số hiệu đơn</th>
                  <th className="border-b border-[#ddd] px-2 py-2 w-[130px] text-left font-semibold text-[#333]">Ngày nhận</th>
                  <th className="border-b border-[#ddd] px-2 py-2 w-[130px] text-left font-semibold text-[#333]">Ngày trên đơn</th>
                  <th className="border-b border-[#ddd] px-2 py-2 w-[64px] text-center font-semibold text-[#333]">Công văn</th>
                  {coCongVan && <>
                    <th className="border-b border-[#ddd] px-2 py-2 w-[110px] text-left font-semibold text-[#333]">Số CV</th>
                    <th className="border-b border-[#ddd] px-2 py-2 w-[130px] text-left font-semibold text-[#333]">Ngày CV</th>
                  </>}
                  <th className="border-b border-[#ddd] px-2 py-2 w-[74px] text-center font-semibold text-[#333]">Trong ngành</th>
                  {coTrongNganh && <>
                    <th className="border-b border-[#ddd] px-2 py-2 text-left font-semibold text-[#333]">Đơn vị gửi</th>
                    <th className="border-b border-[#ddd] px-2 py-2 w-[120px] text-left font-semibold text-[#333]">Người ký</th>
                    <th className="border-b border-[#ddd] px-2 py-2 w-[110px] text-left font-semibold text-[#333]">Chức vụ</th>
                  </>}
                  <th className="border-b border-[#ddd] px-2 py-2 w-[44px] text-center">
                    <button onClick={() => setDong(p => [...p, dongMoi()])} title="Thêm dòng"
                      className="w-[24px] h-[24px] rounded-full bg-[#8b1a1a] hover:bg-[#6e1414] text-white inline-flex items-center justify-center transition-colors">
                      <Plus size={14} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dong.map((d, i) => (
                  <tr key={d.id} className="border-b border-[#f0f0f0] last:border-0">
                    <td className="px-2 py-2 text-center text-[#666]">{i + 1}</td>
                    <td className="px-2 py-2"><O value={d.soHieuDon} onChange={e => dat(d.id, "soHieuDon")(e.target.value)} /></td>
                    <td className="px-2 py-2"><O type="date" value={d.ngayNhan} onChange={e => dat(d.id, "ngayNhan")(e.target.value)} /></td>
                    <td className="px-2 py-2"><O type="date" value={d.ngayTrenDon} onChange={e => dat(d.id, "ngayTrenDon")(e.target.value)} /></td>
                    <td className="px-2 py-2 text-center">
                      <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                        checked={d.laCongVan} onChange={e => dat(d.id, "laCongVan")(e.target.checked)} />
                    </td>
                    {coCongVan && <>
                      <td className="px-2 py-2"><O disabled={!d.laCongVan} value={d.soCV} onChange={e => dat(d.id, "soCV")(e.target.value)} /></td>
                      <td className="px-2 py-2"><O type="date" disabled={!d.laCongVan} value={d.ngayCV} onChange={e => dat(d.id, "ngayCV")(e.target.value)} /></td>
                    </>}
                    <td className="px-2 py-2 text-center">
                      <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                        checked={d.trongNganh} onChange={e => dat(d.id, "trongNganh")(e.target.checked)} />
                    </td>
                    {coTrongNganh && <>
                      <td className="px-2 py-2"><O disabled={!d.trongNganh} value={d.donViGui} onChange={e => dat(d.id, "donViGui")(e.target.value)} /></td>
                      <td className="px-2 py-2"><O disabled={!d.trongNganh} value={d.nguoiKy} onChange={e => dat(d.id, "nguoiKy")(e.target.value)} /></td>
                      <td className="px-2 py-2"><O disabled={!d.trongNganh} value={d.chucVu} onChange={e => dat(d.id, "chucVu")(e.target.value)} /></td>
                    </>}
                    <td className="px-2 py-2 text-center">
                      <button
                        disabled={dong.length === 1}
                        title={dong.length === 1 ? "Phải còn ít nhất một đơn" : "Xoá dòng"}
                        onClick={() => setDong(p => p.filter(x => x.id !== d.id))}
                        className={`transition-colors ${dong.length === 1 ? "text-[#ddd] cursor-not-allowed" : "text-[#c0392b] hover:text-[#8b1a1a]"}`}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-2.5 text-[11px] text-[#888] italic">
            Sẽ tạo <b className="text-[#333] not-italic">{dong.length} đơn</b> mang cùng thông tin bản án
            của {donGoc.maDon.trim()}, trạng thái <b className="text-[#333] not-italic">Đã thụ lý</b>.
          </div>
        </div>

        <div className="border-t border-[#e0e0e0] px-5 py-3 flex justify-end gap-2 flex-shrink-0">
          <button onClick={() => onLuu(dong)}
            className="h-[30px] px-4 rounded-[3px] bg-[#8b1a1a] hover:bg-[#6e1414] text-white text-[12px] font-medium transition-colors">
            Lưu
          </button>
          <button onClick={onDong}
            className="h-[30px] px-4 rounded-[3px] border border-[#ccc] text-[#333] text-[12px] font-medium hover:bg-[#f5f5f5] transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionMenu = ({ onClose, onGhepDon, onViewDetail, onEdit, onBoSung, onTaoYeuCau, onDonTrung, onThemYCBS, onChuyenDon, onHuySoThuLy, onThemKetQua }: { onClose: () => void; onGhepDon?: () => void; onViewDetail?: () => void; onEdit?: () => void; onBoSung?: () => void; onTaoYeuCau?: () => void; onDonTrung?: () => void; onThemYCBS?: () => void; onChuyenDon?: () => void; onHuySoThuLy?: () => void; onThemKetQua?: () => void; }) => {
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

    { icon: <Copy size={13} />, label: "Thêm đơn trùng", action: "dontrung" },
    { icon: <Send size={13} />, label: "Chuyển đơn", action: "chuyen" },
    ...(onGhepDon ? [{ icon: <GitMerge size={13} />, label: "Ghép đơn", action: "ghep" }] : []),
    // Chỉ đơn Chưa đủ điều kiện mới lập được Yêu cầu bổ sung — đơn khác không
    // truyền onThemYCBS nên mục này không hiện.
    ...(onThemYCBS ? [{ icon: <FilePlus size={13} />, label: "Thêm yêu cầu bổ sung", action: "themycbs" }] : []),
    ...(onBoSung ? [{ icon: <ArrowDownToLine size={13} />, label: "Bổ sung tài liệu", action: "bosung" }] : []),
    ...(onThemKetQua ? [{ icon: <Check size={13} />, label: "Thêm kết quả giải quyết", action: "themketqua" }] : []),
    ...(onHuySoThuLy ? [{ icon: <Trash2 size={13} />, label: "Hủy số thụ lý", action: "huysothuly", red: true }] : []),
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
          if (item.action === "dontrung") { onDonTrung?.(); }
          if (item.action === "themycbs") { onThemYCBS?.(); }
          if (item.action === "chuyen") { onChuyenDon?.(); }
          if (item.action === "huysothuly") { onHuySoThuLy?.(); }
          if (item.action === "themketqua") { onThemKetQua?.(); }
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
  { id: 1000, maDon: "7025", nguoiGui: "Nguyễn Thị Hoa", ngayNhap: "18/07/2026", trangThai: "Thụ lý mới", soBA: "15/2023/DS-PT", ngayBA: "12/03/2023", toaBA: "TAND tỉnh Bắc Ninh", nguoiNhap: "Nguyễn Minh An", cuaToi: true },
  {
    id: 1001, maDon: "7022", nguoiGui: "Tòa án nhân dân tỉnh Vĩnh Phúc", ngayNhap: "15/07/2026", trangThai: "Chưa đủ điều kiện", soBA: "08/2022/HS-PT", ngayBA: "20/06/2022", toaBA: "TAND tỉnh Vĩnh Phúc", nguoiNhap: "Trần Văn B", cuaToi: false,
    yeuCauBosung: [
      { soTB: "TB-01", ngayGui: "16/07/2026" },
      { soTB: "TB-02", ngayGui: "18/07/2026" },
    ],
  },
  { id: 1002, maDon: "7019", nguoiGui: "Trần Văn Bình", ngayNhap: "12/07/2026", trangThai: "Đã thụ lý", soBA: "33/2024/KDTM-PT", ngayBA: "15/11/2024", toaBA: "TAND cấp cao tại HN", nguoiNhap: "Lê Thị C", cuaToi: false },
  { id: 1003, maDon: "7015", nguoiGui: "Công ty TNHH Minh Đức", ngayNhap: "08/07/2026", trangThai: "Thụ lý mới", soBA: "21/2021/LĐ-PT", ngayBA: "05/09/2021", toaBA: "TAND tỉnh Hà Nam", nguoiNhap: "Nguyễn Minh An", cuaToi: true },
];

const VALID_GHEP_STATUSES = ["Thụ lý mới", "Đã thụ lý", "Chưa đủ điều kiện"];

// ─── Popup Thêm kết quả giải quyết ───────────────────────────────────────────
const PopupThemKetQuaGiaiQuyet = ({ row, onClose, onConfirm }: { row: any, onClose: () => void, onConfirm: (updated: any) => void }) => {
  // Đơn Thụ lý mới / Thụ lý mới trùng TP: gộp "Kết quả giải quyết" vào chung
  // ô "Nơi chuyển đến" (5 giá trị), không hiện riêng ô Kết quả giải quyết.
  // "Không thụ lý" chỉ phát sinh từ hành động Hủy số thụ lý trên chính các đơn
  // Thụ lý mới này, nên giữ nguyên ô "Nơi chuyển đến" cho luồng Thêm kết quả
  // giải quyết ngay sau khi hủy số thụ lý.
  const isThuLyMoiFlow = row.giaiQuyet?.nhan === "Thụ lý mới" || row.giaiQuyet?.nhan === "Không thụ lý";
  const [ketQuaXuLy, setKetQuaXuLy] = useState("");
  const [noiChuyenDen, setNoiChuyenDen] = useState("");
  const [donViChuyenDen, setDonViChuyenDen] = useState("");
  const [caNhanChuyenDen, setCaNhanChuyenDen] = useState("");
  const [lyDoLuuTheoDoi, setLyDoLuuTheoDoi] = useState("");
  const [lyDoTraLai, setLyDoTraLai] = useState("");
  const [yeuCauTraLai, setYeuCauTraLai] = useState("");

  const [trangThaiDon, setTrangThaiDon] = useState("");
  const [thuLyDon, setThuLyDon] = useState("");
  const [lyDoKhongDu, setLyDoKhongDu] = useState("");
  const [lyDoKhongDuKhac, setLyDoKhongDuKhac] = useState("");
  const [soThuLy, setSoThuLy] = useState("");
  const [ngayThuLy, setNgayThuLy] = useState("");

  const handleConfirm = () => {
    if (!ketQuaXuLy) return;

    let stepName = "";
    let noteText = "";
    let statusText = "";
    let statusColor = "#999999";
    let stl = row.giaiQuyet?.stl || "";
    let ngayThuLyVal = row.giaiQuyet?.ngayThuLy || "";

    if (ketQuaXuLy === "Chuyển đơn") {
      stepName = `Chuyển đơn (${noiChuyenDen})`;
      let subDetails = `Đến đơn vị: ${donViChuyenDen}${caNhanChuyenDen ? ` - ${caNhanChuyenDen}` : ""}`;
      subDetails += ` | Trạng thái: ${trangThaiDon}`;
      if (trangThaiDon === "Đơn đủ điều kiện") {
        subDetails += ` | Thụ lý: ${thuLyDon}`;
        if (thuLyDon === "Thụ lý mới") {
          subDetails += ` (Số TL: ${soThuLy}, Ngày TL: ${ngayThuLy ? ngayThuLy.split("-").reverse().join("/") : ""})`;
          stl = soThuLy;
          ngayThuLyVal = ngayThuLy ? ngayThuLy.split("-").reverse().join("/") : "";
        }
        statusText = thuLyDon;
        statusColor = thuLyDon === "Thụ lý mới" ? "#27ae60" : thuLyDon === "Đã thụ lý" ? "#1a5a96" : "#e67e22";
      } else if (trangThaiDon === "Đơn không đủ điều kiện") {
        const ldText = lyDoKhongDu === "Lý do khác" ? lyDoKhongDuKhac : lyDoKhongDu;
        subDetails += ` | Lý do: ${ldText}`;
        statusText = "Chưa đủ điều kiện";
        statusColor = "#e67e22";
      } else {
        statusText = `Đã chuyển (${noiChuyenDen})`;
        statusColor = "#1a5a96";
      }
      noteText = subDetails;
    } else if (ketQuaXuLy === "Trả lại đơn") {
      stepName = "Trả lại đơn";
      noteText = `Lý do: ${lyDoTraLai}. Yêu cầu: ${yeuCauTraLai}`;
      statusText = "Trả lại đơn";
      statusColor = "#c0392b";
    } else if (ketQuaXuLy === "Lưu theo dõi") {
      stepName = "Lưu theo dõi";
      noteText = `Lý do: ${lyDoLuuTheoDoi}`;
      statusText = "Lưu theo dõi";
      statusColor = "#7f8c8d";
    }

    const currentHistory = row.processingHistory || [];
    const newHistory = [
      ...currentHistory,
      {
        date: new Date().toLocaleDateString("vi-VN"),
        step: stepName,
        actor: "HCTP",
        note: noteText
      }
    ];

    const updated = {
      ...row,
      giaiQuyet: {
        nhan: statusText,
        color: statusColor,
        stl: stl,
        ngayThuLy: ngayThuLyVal,
        coVanBan: row.giaiQuyet?.coVanBan || false
      },
      processingHistory: newHistory
    };

    onConfirm(updated);
  };

  const isChuyenDonDisabled = ketQuaXuLy === "Chuyển đơn" && (
    !noiChuyenDen ||
    !donViChuyenDen ||
    !trangThaiDon ||
    (trangThaiDon === "Đơn đủ điều kiện" && !thuLyDon) ||
    (trangThaiDon === "Đơn đủ điều kiện" && thuLyDon === "Thụ lý mới" && (!soThuLy || !ngayThuLy)) ||
    (trangThaiDon === "Đơn không đủ điều kiện" && (!lyDoKhongDu || (lyDoKhongDu === "Lý do khác" && !lyDoKhongDuKhac.trim())))
  );

  const isDisabled = !ketQuaXuLy ||
    isChuyenDonDisabled ||
    (ketQuaXuLy === "Trả lại đơn" && !lyDoTraLai) ||
    (ketQuaXuLy === "Lưu theo dõi" && !lyDoLuuTheoDoi.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 pt-5 pb-1 sticky top-0 bg-white z-10">
          <span className="text-[16px] font-bold text-[#222]">Thêm kết quả giải quyết</span>
          <button onClick={onClose} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
        </div>
        <div className="px-6 py-4 space-y-3 text-[13px] text-[#333]">
          {isThuLyMoiFlow ? (
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Nơi chuyển đến</label>
              <select value={noiChuyenDen} onChange={e => {
                const v = e.target.value;
                setNoiChuyenDen(v);
                setKetQuaXuLy(v === "Trả lại đơn" || v === "Lưu theo dõi" ? v : (v ? "Chuyển đơn" : ""));
                setTrangThaiDon(""); setThuLyDon("");
              }}
                className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] bg-white outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]">
                <option value="">-- Chọn nơi chuyển --</option>
                <option value="Nội bộ">Nội bộ</option>
                <option value="Tòa khác">Tòa khác</option>
                <option value="Ngoài tòa án">Ngoài tòa án</option>
                <option value="Trả lại đơn">Trả lại đơn</option>
                <option value="Lưu theo dõi">Lưu theo dõi</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Kết quả giải quyết</label>
              <select value={ketQuaXuLy} onChange={e => { setKetQuaXuLy(e.target.value); setTrangThaiDon(""); setThuLyDon(""); }}
                className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] bg-white outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]">
                <option value="">-- Chọn kết quả --</option>
                <option value="Chuyển đơn">Chuyển đơn</option>
                <option value="Trả lại đơn">Trả lại đơn</option>
                <option value="Lưu theo dõi">Lưu theo dõi</option>
              </select>
            </div>
          )}

          {ketQuaXuLy === "Chuyển đơn" && (
            <>
              {!isThuLyMoiFlow && (
                <div>
                  <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Nơi chuyển đến</label>
                  <select value={noiChuyenDen} onChange={e => setNoiChuyenDen(e.target.value)}
                    className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] bg-white outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]">
                    <option value="">-- Chọn nơi chuyển --</option>
                    <option value="Nội bộ">Nội bộ</option>
                    <option value="Tòa khác">Tòa khác</option>
                    <option value="Ngoài tòa án">Ngoài tòa án</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Đơn vị nhận</label>
                <input type="text" value={donViChuyenDen} onChange={e => setDonViChuyenDen(e.target.value)}
                  placeholder="Nhập đơn vị nhận..."
                  className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]" />
              </div>
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5">Cá nhân nhận</label>
                <input type="text" value={caNhanChuyenDen} onChange={e => setCaNhanChuyenDen(e.target.value)}
                  placeholder="Nhập cán bộ/cá nhân nhận..."
                  className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]" />
              </div>
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Trạng thái đơn</label>
                <select value={trangThaiDon} onChange={e => { setTrangThaiDon(e.target.value); setThuLyDon(""); setLyDoKhongDu(""); }}
                  className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] bg-white outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]">
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="Đơn đủ điều kiện">Đơn đủ điều kiện</option>
                  <option value="Đơn không đủ điều kiện">Đơn không đủ điều kiện</option>
                </select>
              </div>

              {trangThaiDon === "Đơn đủ điều kiện" && (
                <>
                  <div>
                    <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Thụ lý đơn</label>
                    <select value={thuLyDon} onChange={e => setThuLyDon(e.target.value)}
                      className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] bg-white outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]">
                      <option value="">-- Chọn --</option>
                      <option value="Thụ lý mới">Thụ lý mới</option>
                      <option value="Đã thụ lý">Đã thụ lý</option>
                      <option value="Xin ý kiến lãnh đạo">Xin ý kiến lãnh đạo</option>
                      <option value="Không">Không</option>
                    </select>
                  </div>
                  {thuLyDon === "Thụ lý mới" && (
                    <>
                      <div>
                        <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Số thụ lý</label>
                        <input type="text" value={soThuLy} onChange={e => setSoThuLy(e.target.value)}
                          placeholder="Nhập số thụ lý..."
                          className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]" />
                      </div>
                      <div>
                        <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Ngày thụ lý</label>
                        <input type="date" value={ngayThuLy} onChange={e => setNgayThuLy(e.target.value)}
                          className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]" />
                      </div>
                    </>
                  )}
                </>
              )}

              {trangThaiDon === "Đơn không đủ điều kiện" && (
                <>
                  <div>
                    <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Lý do không đủ điều kiện</label>
                    <select value={lyDoKhongDu} onChange={e => setLyDoKhongDu(e.target.value)}
                      className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] bg-white outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]">
                      <option value="">-- Chọn lý do --</option>
                      <option value="Thiếu Bản án/quyết định có hiệu lực pháp luật">Thiếu Bản án/quyết định có hiệu lực pháp luật</option>
                      <option value="Thiếu thông tin căn cước công dân">Thiếu thông tin căn cước công dân</option>
                      <option value="Viết lại đơn">Viết lại đơn</option>
                      <option value="Lý do khác">Lý do khác</option>
                    </select>
                  </div>
                  {lyDoKhongDu === "Lý do khác" && (
                    <div>
                      <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Lý do khác</label>
                      <textarea rows={2} value={lyDoKhongDuKhac} onChange={e => setLyDoKhongDuKhac(e.target.value)}
                        placeholder="Nhập lý do khác..."
                        className="w-full border border-[#ddd] rounded-[6px] px-3 py-2 text-[13px] text-[#222] focus:outline-none focus:border-[#1a5a96] resize-none" />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {ketQuaXuLy === "Trả lại đơn" && (
            <>
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Lý do trả lại</label>
                <select value={lyDoTraLai} onChange={e => setLyDoTraLai(e.target.value)}
                  className="w-full h-[38px] px-3 text-[13px] border rounded-[6px] bg-white outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]">
                  <option value="">-- Chọn lý do --</option>
                  <option value="Đơn không đủ điều kiện xử lý">Đơn không đủ điều kiện xử lý</option>
                  <option value="Không thuộc thẩm quyền giải quyết">Không thuộc thẩm quyền giải quyết</option>
                  <option value="Đã hết thời hạn giải quyết">Đã hết thời hạn giải quyết</option>
                  <option value="Lý do khác">Lý do khác</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5">Yêu cầu trả lại đơn</label>
                <textarea rows={2} value={yeuCauTraLai} onChange={e => setYeuCauTraLai(e.target.value)}
                  placeholder="Nhập yêu cầu trả lại đơn..."
                  className="w-full border border-[#ddd] rounded-[6px] px-3 py-2 text-[13px] text-[#222] focus:outline-none focus:border-[#1a5a96] resize-none" />
              </div>
            </>
          )}

          {ketQuaXuLy === "Lưu theo dõi" && (
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><span className="text-[#c0392b] mr-1">*</span>Lý do lưu theo dõi</label>
              <textarea rows={3} value={lyDoLuuTheoDoi} onChange={e => setLyDoLuuTheoDoi(e.target.value)}
                placeholder="Nhập lý do lưu theo dõi..."
                className="w-full border border-[#ddd] rounded-[6px] px-3 py-2 text-[13px] text-[#222] focus:outline-none focus:border-[#1a5a96] resize-none" />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#e0e0e0] sticky bottom-0 bg-white z-10">
          <button onClick={onClose}
            className="h-[36px] px-5 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[6px] text-[13px] font-medium transition-colors">
            Đóng
          </button>
          <button onClick={handleConfirm} disabled={isDisabled}
            className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[6px] text-[13px] font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Chi tiết kết quả xử lý đơn ─────────────────────────────────────────
const PopupChiTietKetQuaXuLy = ({ data, onClose }: { data: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 pt-5 pb-3 sticky top-0 bg-white z-10 border-b border-[#eee]">
          <span className="text-[16px] font-bold text-[#222]">Chi tiết kết quả xử lý</span>
          <button onClick={onClose} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
        </div>
        <div className="px-6 py-4 space-y-4 text-[13px] text-[#333]">
          {(data.date || data.actor || data.step) && (
            <div className="grid grid-cols-3 gap-4 pb-3 border-b border-[#eee]">
              <div>
                <span className="block text-[#666] mb-1">Ngày chuyển đơn</span>
                <span className="font-medium text-[#222]">{data.date || "—"}</span>
              </div>
              <div>
                <span className="block text-[#666] mb-1">Người tạo</span>
                <span className="font-medium text-[#222]">{data.actor || "—"}</span>
              </div>
              <div>
                <span className="block text-[#666] mb-1">Thao tác</span>
                <span className="font-medium text-[#222]">{data.step || "—"}</span>
              </div>
            </div>
          )}
          {!data.noiChuyenDen && (
            <div>
              <span className="block text-[#666] mb-1">Nội dung</span>
              <span className="font-medium text-[#222]">{data.note || "Không có thông tin chi tiết."}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {data.noiChuyenDen && (
              <div>
                <span className="block text-[#666] mb-1">Nơi chuyển đến</span>
                <span className="font-medium text-[#222]">{data.noiChuyenDen}</span>
              </div>
            )}
            {data.noiChuyenDen === "Trả lại đơn" && (
              <>
                <div>
                  <span className="block text-[#666] mb-1">Lý do trả lại</span>
                  <span className="font-medium text-[#222]">{data.lyDoTraLai}</span>
                </div>
                <div>
                  <span className="block text-[#666] mb-1">Yêu cầu</span>
                  <span className="font-medium text-[#222]">{data.yeuCauTraLai || "—"}</span>
                </div>
              </>
            )}
            {data.noiChuyenDen === "Lưu theo dõi" && (
              <div className="col-span-2">
                <span className="block text-[#666] mb-1">Lý do lưu theo dõi</span>
                <span className="font-medium text-[#222]">{data.lyDoLuuTheoDoi}</span>
              </div>
            )}
            {data.noiChuyenDen === "Nội bộ" && (
              <>
                <div>
                  <span className="block text-[#666] mb-1">Đơn vị chuyển đến</span>
                  <span className="font-medium text-[#222]">{data.donViChuyenDen}</span>
                </div>
                {data.caNhanChuyenDen && (
                  <div>
                    <span className="block text-[#666] mb-1">Cá nhân nhận</span>
                    <span className="font-medium text-[#222]">{data.caNhanChuyenDen}</span>
                  </div>
                )}
                <div>
                  <span className="block text-[#666] mb-1">Trạng thái đơn</span>
                  <span className="font-medium text-[#222]">{data.trangThaiDon}</span>
                </div>
                {data.trangThaiDon === "Đơn đủ điều kiện" && (
                  <div>
                    <span className="block text-[#666] mb-1">Thụ lý đơn</span>
                    <span className="font-medium text-[#222]">{data.thuLyDon}</span>
                  </div>
                )}
                {data.trangThaiDon === "Đơn không đủ điều kiện" && (
                  <div>
                    <span className="block text-[#666] mb-1">Lý do không đủ điều kiện</span>
                    <span className="font-medium text-[#222]">{data.lyDoKhongDu}</span>
                  </div>
                )}
              </>
            )}
            {data.noiChuyenDen === "Tòa khác" && (
              <>
                <div>
                  <span className="block text-[#666] mb-1">Đơn vị chuyển đến</span>
                  <span className="font-medium text-[#222]">{data.donViChuyenDen}</span>
                </div>
                <div>
                  <span className="block text-[#666] mb-1">Chuyển đến</span>
                  <span className="font-medium text-[#222]">{data.chanhAnHoacToaAn}</span>
                </div>
              </>
            )}
            {data.noiChuyenDen === "Ngoài tòa án" && (
              <div className="col-span-2">
                <span className="block text-[#666] mb-1">Đơn vị chuyển đến</span>
                <span className="font-medium text-[#222]">{data.donViChuyenDen}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-[#e0e0e0] sticky bottom-0 bg-white z-10">
          <button onClick={onClose}
            className="h-[36px] px-5 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[6px] text-[13px] font-medium transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Sửa kết quả xử lý đơn (dùng trong Section 5 của form Sửa đơn) ────
// Tương tự PopupThemKetQuaGiaiQuyet nhưng mở từ nút "Sửa kết quả xử lý đơn"
// trên header Section 5. Cho phép cán bộ sửa lại kết quả đã nhập trước đó.
const PopupSuaKetQuaXuLyDon = ({
  onClose,
  onSave,
  banDau,
}: {
  onClose: () => void;
  onSave: (data: {
    noiChuyenDen: string;
    donViChuyenDen: string;
    caNhanChuyenDen: string;
    trangThaiDon: string;
    thuLyDon: string;
    lyDoKhongDu: string;
    lyDoTraLai: string;
    yeuCauTraLai: string;
    lyDoLuuTheoDoi: string;
    chanhAnHoacToaAn: string;
    vuTruong: string;
  }) => void;
  banDau?: {
    noiChuyenDen: string;
    donViChuyenDen: string;
    caNhanChuyenDen: string;
    trangThaiDon: string;
    thuLyDon: string;
    lyDoKhongDu: string;
    lyDoTraLai: string;
    yeuCauTraLai: string;
    lyDoLuuTheoDoi: string;
    chanhAnHoacToaAn: string;
    vuTruong: string;
  };
}) => {
  const [noiChuyenDen, setNoiChuyenDen] = useState(banDau?.noiChuyenDen ?? "");
  const [donViChuyenDen, setDonViChuyenDen] = useState(banDau?.donViChuyenDen ?? "");
  const [caNhanChuyenDen, setCaNhanChuyenDen] = useState(banDau?.caNhanChuyenDen ?? "");
  const [trangThaiDon, setTrangThaiDon] = useState(banDau?.trangThaiDon ?? "");
  const [thuLyDon, setThuLyDon] = useState(banDau?.thuLyDon ?? "");
  const [lyDoKhongDu, setLyDoKhongDu] = useState(banDau?.lyDoKhongDu ?? "");
  const [lyDoTraLai, setLyDoTraLai] = useState(banDau?.lyDoTraLai ?? "");
  const [yeuCauTraLai, setYeuCauTraLai] = useState(banDau?.yeuCauTraLai ?? "");
  const [lyDoLuuTheoDoi, setLyDoLuuTheoDoi] = useState(banDau?.lyDoLuuTheoDoi ?? "");
  const [chanhAnHoacToaAn, setChanhAnHoacToaAn] = useState(banDau?.chanhAnHoacToaAn ?? "Tòa án");
  const [vuTruong, setVuTruong] = useState(banDau?.vuTruong ?? "");
  const [showDonViDD, setShowDonViDD] = useState(false);

  const handleSave = () => {
    onSave({
      noiChuyenDen, donViChuyenDen, caNhanChuyenDen, trangThaiDon,
      thuLyDon, lyDoKhongDu, lyDoTraLai, yeuCauTraLai, lyDoLuuTheoDoi,
      chanhAnHoacToaAn, vuTruong,
    });
  };

  const selCls = "w-full h-[38px] px-3 text-[13px] border rounded-[6px] bg-white outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]";
  const inpCls = "w-full h-[38px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors border-[#ddd] focus:border-[#1a5a96]";
  const lblCls = "block text-[13px] text-[#333] mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 pt-5 pb-1 sticky top-0 bg-white z-10">
          <span className="text-[16px] font-bold text-[#222]">Sửa kết quả xử lý đơn</span>
          <button onClick={onClose} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
        </div>
        <div className="px-6 py-4 space-y-3 text-[13px] text-[#333]">
          {/* Nơi chuyển đến */}
          <div>
            <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Nơi chuyển đến</label>
            <select value={noiChuyenDen} onChange={e => { setNoiChuyenDen(e.target.value); setDonViChuyenDen(""); setCaNhanChuyenDen(""); }} className={selCls}>
              <option value="">-- Chọn --</option>
              <option>Nội bộ</option>
              <option>Tòa khác</option>
              <option>Ngoài tòa án</option>
              <option>Trả lại đơn</option>
              <option>Lưu theo dõi</option>
            </select>
          </div>

          {/* Trả lại đơn */}
          {noiChuyenDen === "Trả lại đơn" && (
            <>
              <div>
                <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Lý do trả lại</label>
                <select value={lyDoTraLai} onChange={e => setLyDoTraLai(e.target.value)} className={selCls}>
                  <option value="">-- Chọn lý do --</option>
                  <option>Đơn không đủ điều kiện xử lý</option>
                  <option>Không thuộc thẩm quyền giải quyết</option>
                  <option>Đã hết thời hạn giải quyết</option>
                  <option>Lý do khác</option>
                </select>
              </div>
              <div>
                <label className={lblCls}>Yêu cầu</label>
                <input type="text" value={yeuCauTraLai} onChange={e => setYeuCauTraLai(e.target.value)}
                  placeholder="Nhập yêu cầu trả lại đơn..." className={inpCls} />
              </div>
            </>
          )}

          {/* Lưu theo dõi */}
          {noiChuyenDen === "Lưu theo dõi" && (
            <div>
              <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Lý do lưu theo dõi</label>
              <textarea rows={2} value={lyDoLuuTheoDoi} onChange={e => setLyDoLuuTheoDoi(e.target.value)}
                placeholder="Nhập lý do lưu theo dõi đơn thư..."
                className="w-full border border-[#ddd] rounded-[6px] px-3 py-2 text-[13px] text-[#222] focus:outline-none focus:border-[#1a5a96] resize-none" />
            </div>
          )}

          {/* Nội bộ */}
          {noiChuyenDen === "Nội bộ" && (
            <>
              <div>
                <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Đơn vị chuyển đến</label>
                <select value={donViChuyenDen} onChange={e => { setDonViChuyenDen(e.target.value); setCaNhanChuyenDen(""); }} className={selCls}>
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
                </select>
              </div>
              {donViChuyenDen && (
                <div>
                  <label className={lblCls}>Chuyển đến cá nhân</label>
                  <select value={caNhanChuyenDen} onChange={e => setCaNhanChuyenDen(e.target.value)} className={selCls}>
                    <option value="">-- Chọn cá nhân --</option>
                    <option>Vụ trưởng - {donViChuyenDen}</option>
                    <option>Phó vụ trưởng - {donViChuyenDen}</option>
                    <option>Thẩm tra viên - {donViChuyenDen}</option>
                  </select>
                </div>
              )}
              <div>
                <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Trạng thái đơn</label>
                <select value={trangThaiDon} onChange={e => setTrangThaiDon(e.target.value)} className={selCls}>
                  <option value="">-- Chọn --</option>
                  <option>Đơn đủ điều kiện</option>
                  <option>Đơn không đủ điều kiện</option>
                </select>
              </div>
              {trangThaiDon === "Đơn đủ điều kiện" && (
                <div>
                  <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Thụ lý đơn</label>
                  <select value={thuLyDon} onChange={e => setThuLyDon(e.target.value)} className={selCls}>
                    <option value="">-- Chọn --</option>
                    <option>Thụ lý mới</option>
                    <option>Đã thụ lý</option>
                    <option>Xin ý kiến lãnh đạo</option>
                    <option>Không</option>
                  </select>
                </div>
              )}
              {trangThaiDon === "Đơn không đủ điều kiện" && (
                <div>
                  <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Lý do không đủ điều kiện</label>
                  <select value={lyDoKhongDu} onChange={e => setLyDoKhongDu(e.target.value)} className={selCls}>
                    <option value="">-- Chọn lý do --</option>
                    <option>Thiếu Bản án/quyết định có hiệu lực pháp luật</option>
                    <option>Thiếu thông tin căn cước công dân</option>
                    <option>Viết lại đơn</option>
                    <option>Lý do khác</option>
                  </select>
                </div>
              )}
            </>
          )}

          {/* Tòa khác */}
          {noiChuyenDen === "Tòa khác" && (
            <>
              <div className="relative">
                <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Đơn vị chuyển đến</label>
                <input type="text" placeholder="Nhập hoặc tìm kiếm tòa án..."
                  value={donViChuyenDen}
                  onChange={e => { setDonViChuyenDen(e.target.value); setShowDonViDD(true); }}
                  onFocus={() => setShowDonViDD(true)}
                  onBlur={() => setTimeout(() => setShowDonViDD(false), 180)}
                  className={inpCls} />
                {showDonViDD && (() => {
                  const goiY = TOA_KHAC_OPTIONS.filter(t => t.toLowerCase().includes(donViChuyenDen.toLowerCase()));
                  if (!goiY.length) return null;
                  return (
                    <div className="absolute z-50 top-full left-0 right-0 bg-white border border-[#ddd] rounded-[3px] shadow-lg mt-0.5 max-h-[220px] overflow-y-auto">
                      {goiY.map(t => (
                        <button key={t} type="button"
                          onMouseDown={() => { setDonViChuyenDen(t); setShowDonViDD(false); }}
                          className="w-full text-left px-3 py-2 text-[13px] hover:bg-[#f0f7ff] border-b border-[#f0f0f0] last:border-0">
                          {t}
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
              <div>
                <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Chuyển đến</label>
                <div className="flex items-center gap-4 h-[30px]">
                  {["Tòa án", "Chánh án"].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                      <input type="radio" name="suaChanhAnHoacToaAn" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                        checked={chanhAnHoacToaAn === opt}
                        onChange={() => setChanhAnHoacToaAn(opt)} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Ngoài tòa án */}
          {noiChuyenDen === "Ngoài tòa án" && (
            <div>
              <label className={lblCls}><span className="text-[#c0392b] mr-1">*</span>Đơn vị chuyển đến (Cơ quan/Đơn vị ngoài tòa án)</label>
              <input type="text" value={donViChuyenDen} onChange={e => setDonViChuyenDen(e.target.value)}
                placeholder="Nhập tên cơ quan/đơn vị ngoài tòa..." className={inpCls} />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#e0e0e0] sticky bottom-0 bg-white z-10">
          <button onClick={onClose}
            className="h-[36px] px-5 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[6px] text-[13px] font-medium transition-colors">
            Đóng
          </button>
          <button onClick={handleSave} disabled={!noiChuyenDen}
            className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[6px] text-[13px] font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

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
  chua: { label: "Chưa OCR", cls: "bg-[#f1f3f5] text-[#555] border-[#ccc]", icon: <FileText size={11} /> },
  dang: { label: "Đang OCR", cls: "bg-[#fff7e6] text-[#92400e] border-[#f59e0b]", icon: <Loader2 size={11} className="animate-spin" /> },
  thanhcong: { label: "OCR thành công", cls: "bg-[#e8f5e9] text-[#1b5e20] border-[#4caf50]", icon: <Check size={11} /> },
  thatbai: { label: "OCR thất bại", cls: "bg-[#fdecea] text-[#8b1a1a] border-[#e57373]", icon: <AlertCircle size={11} /> },
  dahuy: { label: "OCR đã hủy", cls: "bg-[#f1f3f5] text-[#555] border-[#ccc]", icon: <Ban size={11} /> },
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

// ─── Popup Thêm bản án / quyết định liên quan ────────────────────────────────
export interface BanAnLienQuan {
  id: number;
  vuAn: string;
  loai: string;
  giaiDoan: string;
  soBA: string;
  ngayBA: string;
  toaAn: string;
  daGiaiQuyet: boolean;
  isDuplicate: boolean;
  nguon: string;
}

const LOAI_BA_QD_OPTIONS = ["Bản án", "Quyết định", "Công văn", "Thông báo"];
const GIAI_DOAN_OPTIONS = ["Sơ thẩm", "Phúc thẩm", "Giám đốc thẩm", "Tái thẩm"];
const TOA_RA_BA_OPTIONS = [
  "TAND tối cao",
  "TAND cấp cao tại Hà Nội",
  "TAND cấp cao tại Đà Nẵng",
  "TAND cấp cao tại TP. Hồ Chí Minh",
  "TAND tỉnh Bắc Ninh",
  "TAND TP. Hà Nội",
  "TAND TP. Hồ Chí Minh",
  "TAND tỉnh Nghệ An",
];

const PopupThemBanAn = ({ onDong, onThem, banDau }: {
  onDong: () => void;
  onThem: (b: Omit<BanAnLienQuan, "id" | "nguon">) => void;
  banDau?: BanAnLienQuan;
}) => {
  const [f, setF] = useState({
    vuAn: banDau?.vuAn ?? "", loai: banDau?.loai ?? "Bản án", giaiDoan: banDau?.giaiDoan ?? "",
    soBA: banDau?.soBA ?? "",
    ngayBA: banDau?.ngayBA ? banDau.ngayBA.split("/").reverse().join("-") : "",
    toaAn: banDau?.toaAn ?? "",
    daGiaiQuyet: banDau?.daGiaiQuyet ?? false, isDuplicate: banDau?.isDuplicate ?? false,
  });
  const dat = <K extends keyof typeof f>(k: K) => (v: (typeof f)[K]) => setF(p => ({ ...p, [k]: v }));
  const [daBam, setDaBam] = useState(false);
  const thieu = !f.vuAn.trim() || !f.loai || !f.giaiDoan || !f.soBA.trim() || !f.ngayBA || !f.toaAn;

  const o = (rong: boolean) =>
    `w-full h-[36px] px-3 text-[13px] border rounded-[6px] bg-white outline-none transition-colors placeholder:text-[#bbb] ${daBam && rong ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]"}`;
  const Sao = () => <span className="text-[#c0392b] mr-1">*</span>;

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-[8px] shadow-2xl w-[720px] max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 pt-5 pb-2">
          <span className="text-[16px] font-bold text-[#222]">{banDau ? "Sửa bản án / quyết định liên quan" : "Thêm bản án / quyết định liên quan"}</span>
          <button onClick={onDong} className="text-[#888] hover:text-[#333] -mt-1"><X size={19} /></button>
        </div>

        <div className="px-6 py-3 space-y-3">
          <div>
            <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Vụ án</label>
            <input value={f.vuAn} onChange={e => dat("vuAn")(e.target.value)}
              placeholder="VD: Nguyễn Văn An kiện UBND tỉnh Bắc Ninh" className={o(!f.vuAn.trim())} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Loại BA/QĐ</label>
              <div className="relative">
                <select value={f.loai} onChange={e => dat("loai")(e.target.value)}
                  className={`${o(!f.loai)} appearance-none pr-8`}>
                  {LOAI_BA_QD_OPTIONS.map(x => <option key={x}>{x}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Giai đoạn</label>
              <div className="relative">
                <select value={f.giaiDoan} onChange={e => dat("giaiDoan")(e.target.value)}
                  className={`${o(!f.giaiDoan)} appearance-none pr-8 ${f.giaiDoan ? "text-[#222]" : "text-[#aaa]"}`}>
                  <option value="">Chọn giai đoạn</option>
                  {GIAI_DOAN_OPTIONS.map(x => <option key={x} className="text-[#222]">{x}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Số bản án / quyết định</label>
              <input value={f.soBA} onChange={e => dat("soBA")(e.target.value)}
                placeholder="VD: 15/2023/HC-PT" className={o(!f.soBA.trim())} />
            </div>
            <div>
              <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Ngày ra bản án</label>
              <input type="date" value={f.ngayBA} onChange={e => dat("ngayBA")(e.target.value)}
                className={o(!f.ngayBA)} />
            </div>
            <div className="col-span-2">
              <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Tòa án ra bản án</label>
              <div className="relative">
                <select value={f.toaAn} onChange={e => dat("toaAn")(e.target.value)}
                  className={`${o(!f.toaAn)} appearance-none pr-8 ${f.toaAn ? "text-[#222]" : "text-[#aaa]"}`}>
                  <option value="">Chọn tòa án</option>
                  {TOA_RA_BA_OPTIONS.map(x => <option key={x} className="text-[#222]">{x}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
              <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                checked={f.daGiaiQuyet} onChange={e => dat("daGiaiQuyet")(e.target.checked)} />
              Bản án đã giải quyết
            </label>
            {/* Chỉ bản án còn hiệu lực mới đề nghị xem xét GĐT/TT được */}
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
              <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                checked={f.isDuplicate} onChange={e => dat("isDuplicate")(e.target.checked)} />
              Cho phép đề nghị xem xét GĐT/TT
            </label>
          </div>

          {daBam && thieu && (
            <p className="text-[12px] text-[#c0392b]">Vui lòng nhập đủ các trường bắt buộc (*).</p>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4">
          <button onClick={onDong}
            className="h-[36px] px-5 border border-[#ccc] bg-white text-[#333] hover:bg-[#f5f5f5] rounded-[5px] text-[13px] font-medium transition-colors">Hủy</button>
          <button onClick={() => {
            setDaBam(true);
            if (thieu) return;
            onThem({
              vuAn: f.vuAn.trim(), loai: f.loai, giaiDoan: f.giaiDoan,
              soBA: f.soBA.trim(), ngayBA: f.ngayBA.split("-").reverse().join("/"),
              toaAn: f.toaAn, daGiaiQuyet: f.daGiaiQuyet, isDuplicate: f.isDuplicate,
            });
          }}
            className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[5px] text-[13px] font-semibold transition-colors">Thêm</button>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Thêm đơn thụ lý kèm ───────────────────────────────────────────────
export interface DonThuLyKem {
  id: number;
  soHieu: string;
  ngayNhan: string;
  ngayGhi: string;
  laCongVan: boolean;
}

const PopupThemDonKem = ({ onDong, onThem, banDau }: {
  onDong: () => void;
  onThem: (d: Omit<DonThuLyKem, "id">) => void;
  banDau?: DonThuLyKem;
}) => {
  const iso = (s?: string) => s ? s.split("/").reverse().join("-") : "";
  const [soHieu, setSoHieu] = useState(banDau?.soHieu ?? "");
  const [ngayNhan, setNgayNhan] = useState(iso(banDau?.ngayNhan));
  const [ngayGhi, setNgayGhi] = useState(iso(banDau?.ngayGhi));
  const [laCongVan, setLaCongVan] = useState(banDau?.laCongVan ?? false);
  const [daBam, setDaBam] = useState(false);
  const thieu = !ngayNhan;

  const oNhap = (rong: boolean) =>
    `w-full h-[36px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors placeholder:text-[#bbb] ${daBam && rong ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]"}`;

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-[8px] shadow-2xl w-[780px] overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <span className="text-[16px] font-bold text-[#222]">{banDau ? "Sửa đơn thụ lý kèm" : "Thêm đơn thụ lý kèm"}</span>
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

const LOAI_KET_QUA_OPTIONS = [
  "Thông báo trả lời đơn",
  "Quyết định kháng nghị",
  "Thông báo VKS đang giải quyết",
];

const PopupThemThongBao = ({ onDong, onThem, banDau }: {
  onDong: () => void;
  onThem: (tb: { loaiKQ: string; soTB: string; ngayTB: string; toaAn: string }) => void;
  banDau?: { loaiKQ: string; soTB: string; ngayTB: string; toaAn: string };
}) => {
  const [loaiKQ, setLoaiKQ] = useState(banDau?.loaiKQ ?? "");
  const [soTB, setSoTB] = useState(banDau?.soTB ?? "");
  const [ngayTB, setNgayTB] = useState(banDau?.ngayTB ? banDau.ngayTB.split("/").reverse().join("-") : "");
  const [toaAn, setToaAn] = useState(banDau?.toaAn ?? "");
  const [daBam, setDaBam] = useState(false);
  const thieu = !loaiKQ || !soTB.trim() || !ngayTB || !toaAn;

  const Sao = () => <span className="text-[#c0392b] mr-1">*</span>;
  const vien = (rong: boolean) =>
    daBam && rong ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]";

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-[10px] shadow-2xl w-[520px] overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-5 pb-1">
          <span className="text-[16px] font-bold text-[#222]">{banDau ? "Sửa kết quả giải quyết" : "Thêm kết quả giải quyết"}</span>
          <button onClick={onDong} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
        </div>

        <div className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Loại kết quả</label>
            <div className="relative">
              <select value={loaiKQ} onChange={e => setLoaiKQ(e.target.value)}
                className={`w-full h-[38px] pl-3 pr-8 text-[13px] border rounded-[6px] bg-white appearance-none outline-none transition-colors ${vien(!loaiKQ)} ${loaiKQ ? "text-[#222]" : "text-[#aaa]"}`}>
                <option value="">Chọn loại kết quả</option>
                {LOAI_KET_QUA_OPTIONS.map(t => <option key={t} className="text-[#222]">{t}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Số kết quả</label>
            <input value={soTB} onChange={e => setSoTB(e.target.value)} placeholder="Nhập số"
              className={`w-full h-[38px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors ${vien(!soTB.trim())}`} />
          </div>
          <div>
            <label className="block text-[13px] text-[#333] mb-1.5"><Sao />Ngày</label>
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
            onThem({ loaiKQ, soTB: soTB.trim(), ngayTB: ngayTB.split("-").reverse().join("/"), toaAn });
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
  trangThai?: string; color?: string;
  // Chỉ có khi trạng thái = "Thụ lý mới"
  stl?: string; ngayThuLy?: string;
  // Đơn Thụ lý mới đã chuyển sang vụ chuyên môn thì trạng thái hiển thị đổi
  // sang 1 trong 4 loại theo tiến độ giải quyết ở bên vụ, thay cho việc chỉ
  // đứng yên ở "Thụ lý mới".
  daChuyenVu?: boolean; trangThaiVu?: string;
  thamPhan?: string;
  ycbsSo?: string; ycbsLyDo?: string;
  ycbsDonBoSung?: string; ycbsDonBoSungLoai?: string; ycbsDonBoSungNgay?: string; ycbsDonBoSungGhiChu?: string;
  ycbsSo2?: string; ycbsLyDo2?: string;
  ycbsDonBoSung2?: string; ycbsDonBoSung2Loai?: string; ycbsDonBoSung2Ngay?: string; ycbsDonBoSung2GhiChu?: string;
  boSungKhongYcbsMa?: string; boSungKhongYcbsLoai?: string; boSungKhongYcbsNgay?: string; boSungKhongYcbsGhiChu?: string;
  canBoXuLyGanNhat?: string;
}

// 4 trạng thái vụ hiển thị cho đơn "Thụ lý mới" đã chuyển sang vụ chuyên môn.
const TRANG_THAI_VU_OPTIONS = ["Trả lời đơn", "Kháng nghị", "Xếp đơn", "Viện kiểm sát đang giải quyết"];

// ─── Xem chi tiết đơn liên quan ở tab mới ────────────────────────────────────
// Dữ liệu đơn được nhét vào hash dưới dạng base64 JSON nên tab mới đứng độc lập,
// không cần state chung giữa 2 tab (kể cả đơn vừa thêm tay).
const HASH_CHI_TIET_DON = "#don=";

const moTabChiTietDon = (d: DonLienQuan) => {
  const payload = btoa(encodeURIComponent(JSON.stringify(d)));
  window.open(`${window.location.pathname}${HASH_CHI_TIET_DON}${payload}`, "_blank", "noopener");
};

const docDonTuHash = (): DonLienQuan | null => {
  const hash = window.location.hash;
  if (!hash.startsWith(HASH_CHI_TIET_DON)) return null;
  try {
    return JSON.parse(decodeURIComponent(atob(hash.slice(HASH_CHI_TIET_DON.length)))) as DonLienQuan;
  } catch {
    return null;
  }
};

const HINH_THUC_DON_OPTIONS = [
  "Đơn đề nghị GĐT/TT",
  "CV Kiến nghị GĐT, TT",
  "Đơn khiếu nại tố cáo trong tố tụng",
  "Đơn khiếu nại tư pháp",
  "Đơn khác",
];

const PopupThemDonLienQuan = ({ onDong, onThem, banGhi }: {
  onDong: () => void;
  onThem: (d: Omit<DonLienQuan, "id">) => void;
  /** Có bản ghi ⇒ chế độ SỬA: đổ sẵn dữ liệu, lưu thì ghi đè thay vì thêm mới. */
  banGhi?: DonLienQuan | null;
}) => {
  // Ngày trong bản ghi lưu dạng dd/mm/yyyy, còn <input type="date"> cần yyyy-mm-dd.
  const veISO = (s?: string) => (s && s.includes("/") ? s.split("/").reverse().join("-") : (s ?? ""));
  const [f, setF] = useState({
    maDon: banGhi?.maDon ?? "", ngayNhan: veISO(banGhi?.ngayNhan), nguoiGui: banGhi?.nguoiGui ?? "",
    diaChi: banGhi?.diaChi ?? "",
    soBA: banGhi?.soBA ?? "", ngayBA: veISO(banGhi?.ngayBA), hinhThuc: banGhi?.hinhThuc ?? "",
    thuTuc: banGhi?.thuTuc ?? "", nguoiNhap: banGhi?.nguoiNhap ?? "",
    trangThai: banGhi?.trangThai ?? "Đã thụ lý", color: banGhi?.color ?? "#27ae60",
    stl: banGhi?.stl ?? "", ngayThuLy: veISO(banGhi?.ngayThuLy),
    daChuyenVu: banGhi?.daChuyenVu ?? false, trangThaiVu: banGhi?.trangThaiVu ?? "",
    ycbsSo: banGhi?.ycbsSo ?? "", ycbsLyDo: banGhi?.ycbsLyDo ?? "", ycbsDonBoSung: banGhi?.ycbsDonBoSung ?? "",
  });
  const [daBam, setDaBam] = useState(false);
  const dat = (k: keyof typeof f) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const batBuoc: (keyof typeof f)[] = ["maDon", "ngayNhan", "nguoiGui"];
  const thieu = batBuoc.some(k => !(f[k] as string).trim());

  const Sao = () => <span className="text-[#c0392b] mr-1">*</span>;
  const vien = (rong: boolean) => daBam && rong ? "border-[#c0392b]" : "border-[#ddd] focus:border-[#1a5a96]";
  const oInput = (rong: boolean) =>
    `w-full h-[36px] px-3 text-[13px] border rounded-[6px] outline-none transition-colors ${vien(rong)}`;

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-[10px] shadow-2xl w-[640px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 pt-5 pb-1">
          <span className="text-[16px] font-bold text-[#222]">
            {banGhi ? "Sửa đơn liên quan" : "Thêm đơn liên quan"}
          </span>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5">Người nhập</label>
                <input value={f.nguoiNhap} onChange={e => dat("nguoiNhap")(e.target.value)} placeholder="Nhập tên người nhập"
                  className={oInput(false)} />
              </div>
              <div>
                <label className="block text-[13px] text-[#333] mb-1.5">Trạng thái giải quyết</label>
                <div className="relative">
                  <select value={f.trangThai} onChange={e => {
                    const statusColors: Record<string, string> = {
                      "Đã thụ lý": "#27ae60",
                      "Chưa đủ điều kiện": "#e67e22",
                      "Thụ lý mới": "#2980b9",
                      "Không thụ lý": "#c0392b"
                    };
                    setF(p => ({ ...p, trangThai: e.target.value, color: statusColors[e.target.value] || "#7f8c8d" }));
                  }}
                    className={`w-full h-[36px] pl-3 pr-8 text-[13px] border rounded-[6px] bg-white appearance-none outline-none ${vien(false)}`}>
                    <option className="text-[#222]">Đã thụ lý</option>
                    <option className="text-[#222]">Chưa đủ điều kiện</option>
                    <option className="text-[#222]">Thụ lý mới</option>
                    <option className="text-[#222]">Không thụ lý</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {f.trangThai === "Thụ lý mới" && (
            <div className="border-t border-[#eee] pt-3">
              <div className="text-[13px] font-semibold text-[#444] mb-2">Thông tin thụ lý</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] text-[#555] mb-1">Số thụ lý</label>
                  <input value={f.stl} onChange={e => dat("stl")(e.target.value)} placeholder="Nhập số thụ lý"
                    className={oInput(false)} />
                </div>
                <div>
                  <label className="block text-[12px] text-[#555] mb-1">Ngày thụ lý</label>
                  <input type="date" value={f.ngayThuLy} onChange={e => dat("ngayThuLy")(e.target.value)}
                    className={oInput(false)} />
                </div>
                <div className="col-span-2 flex items-center gap-2 mt-1">
                  <input id="daChuyenVu" type="checkbox" checked={f.daChuyenVu}
                    onChange={e => setF(p => ({ ...p, daChuyenVu: e.target.checked, trangThaiVu: e.target.checked ? p.trangThaiVu : "" }))}
                    className="w-4 h-4" />
                  <label htmlFor="daChuyenVu" className="text-[12px] text-[#555]">Đơn đã chuyển sang vụ</label>
                </div>
                {f.daChuyenVu && (
                  <div className="col-span-2">
                    <label className="block text-[12px] text-[#555] mb-1">Trạng thái vụ</label>
                    <div className="relative">
                      <select value={f.trangThaiVu} onChange={e => dat("trangThaiVu")(e.target.value)}
                        className={`w-full h-[36px] pl-3 pr-8 text-[13px] border rounded-[6px] bg-white appearance-none outline-none ${vien(false)} ${f.trangThaiVu ? "text-[#222]" : "text-[#aaa]"}`}>
                        <option value="">Chọn trạng thái vụ</option>
                        {TRANG_THAI_VU_OPTIONS.map(o => <option key={o} className="text-[#222]">{o}</option>)}
                      </select>
                      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {f.trangThai === "Chưa đủ điều kiện" && (
            <div className="border-t border-[#eee] pt-3 bg-[#fffbf2] p-3 rounded-[6px]">
              <div className="text-[13px] font-semibold text-[#b45309] mb-2">Thông tin yêu cầu bổ sung</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[12px] text-[#555] mb-1">Số Yêu cầu bổ sung</label>
                  <input value={f.ycbsSo} onChange={e => dat("ycbsSo")(e.target.value)} placeholder="Nhập số YCBS"
                    className={oInput(false)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] text-[#555] mb-1">Ý kiến lãnh đạo</label>
                  <input value={f.ycbsLyDo} onChange={e => dat("ycbsLyDo")(e.target.value)} placeholder="Nhập ý kiến lãnh đạo trong đơn"
                    className={oInput(false)} />
                </div>
                <div className="col-span-3">
                  <label className="block text-[12px] text-[#555] mb-1">Đã có đơn bổ sung là đơn số</label>
                  <input value={f.ycbsDonBoSung} onChange={e => dat("ycbsDonBoSung")(e.target.value)} placeholder="Nhập mã đơn bổ sung"
                    className={oInput(false)} />
                </div>
              </div>
            </div>
          )}

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
              trangThai: f.trangThai,
              color: f.color,
              stl: f.stl.trim(),
              ngayThuLy: ddmmyyyy(f.ngayThuLy),
              daChuyenVu: f.daChuyenVu,
              trangThaiVu: f.daChuyenVu ? f.trangThaiVu : "",
              ycbsSo: f.ycbsSo.trim(),
              ycbsLyDo: f.ycbsLyDo.trim(),
              ycbsDonBoSung: f.ycbsDonBoSung.trim(),
            });
          }}
            className="h-[36px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[5px] text-[13px] font-semibold transition-colors">{banGhi ? "Lưu" : "Thêm"}</button>
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
  { title: "Tải tài liệu", doing: "Đang tải lên", wait: "Chờ xử lý" },
  { title: "OCR tài liệu", doing: "Đang nhận dạng văn bản", wait: "Chờ tải xong" },
  { title: "Trích xuất dữ liệu", doing: "Đang trích xuất", wait: "Chờ OCR xong" },
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


// Một lần bổ sung tài liệu của đơn
const LOAI_TAI_LIEU_BO_SUNG = [
  "Căn cước công dân",
  "BAQĐ có hiệu lực",
  "Khác",
];

type TepBoSung = { id: number; ten: string; kichThuoc: number };
type DongBoSung = { id: number; loaiTaiLieu: string; ngayBoSung: string; nguoiTai: string; tep: TepBoSung[] };

const PopupBoSungTaiLieu = ({ onClose, row, onLuu }: {
  onClose: () => void;
  row?: DanhSachDonRow;
  /** Báo kết quả lần bổ sung mới nhất lên danh sách đơn. */
  onLuu?: (ketQua: "du" | "chua_du") => void;
}) => {
  const rong = {
    // Form thêm một lần tải tài liệu — mỗi lần chỉ chọn một loại tài liệu,
    // nhưng người dùng có thể lặp lại nhiều lần để bổ sung nhiều loại khác nhau.
    ngayBoSung: "",
    loaiTaiLieu: "",
    loaiTaiLieuKhac: "",
    ketQua: "du" as "du" | "chua_du",
    lyDoChuaDu: "",
    lyDoChuaDuKhac: "",
    // Đủ điều kiện thì đi tiếp bước Thụ lý đơn — cùng logic với nhánh
    // "Trạng thái đơn = Đơn đủ điều kiện" ở màn Thêm mới đơn.
    thuLyDon: "",
    soThuLy: "",
    ngayThuLy: "",
    ghiChu: "",
  };

  const [f, setF] = useState(rong);
  const dat = <K extends keyof typeof rong>(k: K) => (v: (typeof rong)[K]) =>
    setF(p => ({ ...p, [k]: v }));
  const [daBam, setDaBam] = useState(false);

  // Danh sách các lần tải tài liệu đã thêm vào bảng
  const [danhSachBoSung, setDanhSachBoSung] = useState<DongBoSung[]>([]);
  // Tệp của lần tải đang soạn, chưa thêm vào bảng
  const [tepDangSoan, setTepDangSoan] = useState<TepBoSung[]>([]);
  const [daBamThem, setDaBamThem] = useState(false);
  const [keoVao, setKeoVao] = useState(false);
  const tepRef = useRef<HTMLInputElement>(null);

  const nhanTep = (fs: FileList | null) => {
    if (!fs?.length) return;
    setTepDangSoan(p => [
      ...p,
      ...Array.from(fs).map((x, i) => ({ id: Date.now() + i, ten: x.name, kichThuoc: x.size })),
    ]);
  };
  const coChu = (n: number) => n < 1024 * 1024
    ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1024 / 1024).toFixed(2)} MB`;

  // "Khác" ở cả hai ô đều bắt nhập rõ nội dung, không để trống chung chung
  const thieuLoaiKhac = f.loaiTaiLieu === "Khác" && !f.loaiTaiLieuKhac.trim();
  const thieuDongDangSoan = !f.ngayBoSung || !f.loaiTaiLieu || thieuLoaiKhac || tepDangSoan.length === 0;

  const themVaoDanhSach = () => {
    setDaBamThem(true);
    if (thieuDongDangSoan) return;
    setDanhSachBoSung(p => [...p, {
      id: Date.now(),
      loaiTaiLieu: f.loaiTaiLieu === "Khác" ? f.loaiTaiLieuKhac.trim() : f.loaiTaiLieu,
      ngayBoSung: f.ngayBoSung,
      nguoiTai: CURRENT_USER,
      tep: tepDangSoan,
    }]);
    // Reset phần chọn loại tài liệu + tệp để soạn lần tiếp theo, giữ nguyên ngày cho tiện
    setF(p => ({ ...p, loaiTaiLieu: "", loaiTaiLieuKhac: "" }));
    setTepDangSoan([]);
    setDaBamThem(false);
  };

  const xoaDong = (id: number) => setDanhSachBoSung(p => p.filter(x => x.id !== id));

  const thieuLyDo = f.ketQua === "chua_du" && !f.lyDoChuaDu;
  const thieuLyDoKhac = f.ketQua === "chua_du" && f.lyDoChuaDu === "Lý do khác" && !f.lyDoChuaDuKhac.trim();
  const thieuThuLy = f.ketQua === "du" && !f.thuLyDon;
  const thieuSoThuLy = f.ketQua === "du" && f.thuLyDon === "Thụ lý mới" && !f.soThuLy.trim();
  const thieuNgayThuLy = f.ketQua === "du" && f.thuLyDon === "Thụ lý mới" && !f.ngayThuLy;
  
  const thieuThongTinDon = f.ketQua === "du" && (
    !row?.nguoiGui || row.nguoiGui === "—" || 
    !row?.thongTinDon?.soBaqd || row.thongTinDon.soBaqd === "—"
  );

  const thieu = danhSachBoSung.length === 0 || thieuLyDo || thieuLyDoKhac
    || thieuThuLy || thieuSoThuLy || thieuNgayThuLy || thieuThongTinDon;

  const luu = () => {
    setDaBam(true);
    if (thieu) return;
    onLuu?.(f.ketQua);
    onClose();
  };

  const lamMoi = () => {
    setF({ ...rong }); setDanhSachBoSung([]); setTepDangSoan([]);
    setDaBam(false); setDaBamThem(false);
  };

  const oNhap = (rongTruong: boolean, bam: boolean = daBam) =>
    `w-full h-[32px] px-2 text-[13px] border rounded-[3px] focus:outline-none transition-colors ${bam && rongTruong ? "border-[#e57373] bg-[#fffbfb]" : "border-[#ccc] focus:border-[#1a73e8]"}`;
  const Sao = () => <span className="text-red-500 mr-0.5">*</span>;
  const vnDate = (iso: string) => iso ? iso.split("-").reverse().join("/") : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[6px] shadow-xl w-[760px] max-h-[94vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#eee]">
          <div>
            <h2 className="text-[16px] font-bold text-[#333]">Bổ sung tài liệu</h2>
            {row && (
              <div className="text-[12px] text-[#888] mt-0.5">
                {row.maDon.trim()} · {row.nguoiGui}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-[#333]">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Mỗi lần chỉ bổ sung một loại tài liệu — bấm "Thêm vào danh sách"
              để lặp lại cho các loại tài liệu khác, tất cả gộp vào bảng bên dưới. */}
          <div className="border border-[#ddd] rounded-[5px] p-3 bg-[#fafafa] space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#333] mb-1"><Sao /> Ngày bổ sung</label>
                <input type="date" value={f.ngayBoSung} onChange={e => dat("ngayBoSung")(e.target.value)}
                  className={oNhap(!f.ngayBoSung, daBamThem)} />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#333] mb-1"><Sao /> Loại tài liệu</label>
                <div className="relative">
                  <select value={f.loaiTaiLieu} onChange={e => dat("loaiTaiLieu")(e.target.value)}
                    className={`${oNhap(!f.loaiTaiLieu, daBamThem)} pr-8 appearance-none`}>
                    <option value="">-- Chọn loại tài liệu --</option>
                    {LOAI_TAI_LIEU_BO_SUNG.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
                </div>
                {f.loaiTaiLieu === "Khác" && (
                  <input value={f.loaiTaiLieuKhac} onChange={e => dat("loaiTaiLieuKhac")(e.target.value)}
                    placeholder="Nhập tên loại tài liệu"
                    className={`${oNhap(thieuLoaiKhac, daBamThem)} mt-2`} />
                )}
              </div>
            </div>

            {/* Tải tài liệu lên — bổ sung tài liệu mà không có tệp thì không có gì để bổ sung */}
            <div>
              <label className="block text-[12px] font-medium text-[#333] mb-1"><Sao /> Tài liệu đính kèm</label>
              <input ref={tepRef} type="file" multiple className="hidden"
                onChange={e => { nhanTep(e.target.files); e.target.value = ""; }} />
              <div
                onClick={() => tepRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setKeoVao(true); }}
                onDragLeave={() => setKeoVao(false)}
                onDrop={e => { e.preventDefault(); setKeoVao(false); nhanTep(e.dataTransfer.files); }}
                className={`border border-dashed rounded-[5px] py-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${keoVao ? "border-[#8b1a1a] bg-[#fdeaea]"
                    : daBamThem && tepDangSoan.length === 0 ? "border-[#e57373] bg-[#fffbfb]"
                      : "border-[#ccc] bg-white hover:bg-[#f2f2f2]"}`}>
                <Upload size={20} className="text-[#8b1a1a] mb-1.5" />
                <div className="text-[13px] text-[#333]">Bấm hoặc kéo thả tệp vào đây</div>
                <div className="text-[11px] text-[#888] mt-0.5">Hỗ trợ PDF, ảnh, Word · chọn được nhiều tệp</div>
              </div>

              {tepDangSoan.length > 0 && (
                <div className="mt-2 space-y-1">
                  {tepDangSoan.map(t => (
                    <div key={t.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-[#eee] rounded-[3px]">
                      <FileText size={14} className="text-[#1a73e8] flex-shrink-0" />
                      <span className="text-[12px] text-[#333] truncate flex-1">{t.ten}</span>
                      <span className="text-[11px] text-[#888] flex-shrink-0">{coChu(t.kichThuoc)}</span>
                      <button onClick={() => setTepDangSoan(p => p.filter(x => x.id !== t.id))}
                        className="text-[#888] hover:text-[#c0392b] flex-shrink-0"><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
              {daBamThem && tepDangSoan.length === 0 && (
                <div className="text-[11px] text-[#c0392b] mt-1.5">Tải lên ít nhất một tệp tài liệu.</div>
              )}
            </div>

            <div className="flex justify-end">
              <button onClick={themVaoDanhSach}
                className="h-[30px] px-3 flex items-center gap-1.5 border border-[#8b1a1a] text-[#8b1a1a] bg-white hover:bg-[#fdeaea] rounded-[3px] text-[12px] font-medium transition-colors">
                <Plus size={13} /> Thêm vào danh sách
              </button>
            </div>
          </div>

          {/* Bảng các lần bổ sung tài liệu đã thêm */}
          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-1">
              <Sao /> Danh sách tài liệu đã bổ sung ({danhSachBoSung.length})
            </label>
            {danhSachBoSung.length === 0 ? (
              <div className={`text-[12px] text-[#999] italic border border-dashed rounded-[3px] py-4 text-center ${daBam && danhSachBoSung.length === 0 ? "border-[#e57373] bg-[#fffbfb]" : "border-[#ccc]"}`}>
                Chưa có tài liệu nào được thêm
              </div>
            ) : (
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th className="border border-[#ddd] px-2 py-[6px] text-left font-semibold text-[#333]">Loại tài liệu</th>
                    <th className="border border-[#ddd] px-2 py-[6px] text-left font-semibold text-[#333]">Ngày bổ sung</th>
                    <th className="border border-[#ddd] px-2 py-[6px] text-left font-semibold text-[#333]">Người tải tài liệu</th>
                    <th className="border border-[#ddd] px-2 py-[6px] text-left font-semibold text-[#333]">File đính kèm</th>
                    <th className="border border-[#ddd] px-2 py-[6px] w-[44px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {danhSachBoSung.map(d => (
                    <tr key={d.id}>
                      <td className="border border-[#ddd] px-2 py-[6px] align-top">{d.loaiTaiLieu}</td>
                      <td className="border border-[#ddd] px-2 py-[6px] align-top whitespace-nowrap">{vnDate(d.ngayBoSung)}</td>
                      <td className="border border-[#ddd] px-2 py-[6px] align-top whitespace-nowrap">{d.nguoiTai}</td>
                      <td className="border border-[#ddd] px-2 py-[6px] align-top">
                        <div className="space-y-1">
                          {d.tep.map(t => (
                            <div key={t.id} className="flex items-center gap-1.5">
                              <FileText size={12} className="text-[#1a73e8] flex-shrink-0" />
                              <span className="text-[#333] truncate">{t.ten}</span>
                              <span className="text-[11px] text-[#888] flex-shrink-0">({coChu(t.kichThuoc)})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="border border-[#ddd] px-2 py-[6px] align-top text-center">
                        <button onClick={() => xoaDong(d.id)} title="Xóa"
                          className="text-[#888] hover:text-[#c0392b]"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-2"><Sao /> Kết quả</label>
            <div className="flex items-center gap-6">
              {([["du", "Đơn đủ điều kiện"], ["chua_du", "Đơn không đủ điều kiện"]] as const).map(([v, nhan]) => (
                <label key={v} className="flex items-center gap-2 text-[13px] cursor-pointer">
                  <input type="radio" name="ketqua" checked={f.ketQua === v}
                    onChange={() => dat("ketQua")(v)} className="w-3.5 h-3.5 accent-[#8b1a1a]" />
                  {nhan}
                </label>
              ))}
            </div>
          </div>

          {/* Vẫn không đủ điều kiện thì phải nêu lý do — dùng chung danh mục với
              ô "Lý do không đủ điều kiện" ở màn Thêm mới đơn. */}
          {f.ketQua === "chua_du" && (
            <div>
              <label className="block text-[12px] font-medium text-[#333] mb-1"><Sao /> Lý do không đủ điều kiện</label>
              <div className="relative">
                <select value={f.lyDoChuaDu} onChange={e => dat("lyDoChuaDu")(e.target.value)}
                  className={`${oNhap(thieuLyDo)} pr-8 appearance-none`}>
                  <option value="">-- Chọn lý do --</option>
                  {LY_DO_YEU_CAU_BO_SUNG.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
              </div>
              {f.lyDoChuaDu === "Lý do khác" && (
                <input value={f.lyDoChuaDuKhac} onChange={e => dat("lyDoChuaDuKhac")(e.target.value)}
                  placeholder="Nhập lý do cụ thể"
                  className={`${oNhap(thieuLyDoKhac)} mt-2`} />
              )}
            </div>
          )}

          {/* Đủ điều kiện thì đi tiếp bước Thụ lý đơn — cùng logic với nhánh
              "Trạng thái đơn = Đơn đủ điều kiện" ở màn Thêm mới đơn. */}
          {f.ketQua === "du" && (
            <div className="grid grid-cols-2 gap-4">
              <div className={f.thuLyDon === "Thụ lý mới" ? "" : "col-span-2"}>
                <label className="block text-[12px] font-medium text-[#333] mb-1"><Sao /> Thụ lý đơn</label>
                <div className="relative">
                  <select value={f.thuLyDon} onChange={e => dat("thuLyDon")(e.target.value)}
                    className={`${oNhap(thieuThuLy)} pr-8 appearance-none`}>
                    <option value="">-- Chọn --</option>
                    <option>Thụ lý mới</option>
                    <option>Đã thụ lý</option>
                    <option>Xin ý kiến lãnh đạo</option>
                    <option>Không</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
                </div>
              </div>
              {f.thuLyDon === "Thụ lý mới" && (
                <>
                  <div>
                    <label className="block text-[12px] font-medium text-[#333] mb-1"><Sao /> Số thụ lý</label>
                    <input value={f.soThuLy} onChange={e => dat("soThuLy")(e.target.value)}
                      placeholder="Nhập số thụ lý" className={oNhap(thieuSoThuLy)} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#333] mb-1"><Sao /> Ngày thụ lý</label>
                    <input type="date" value={f.ngayThuLy} onChange={e => dat("ngayThuLy")(e.target.value)}
                      className={oNhap(thieuNgayThuLy)} />
                  </div>
                </>
              )}
            </div>
          )}

          <div>
            <label className="block text-[12px] font-medium text-[#333] mb-1">Ghi chú</label>
            <textarea rows={3} placeholder="nhập dữ liệu" value={f.ghiChu}
              onChange={e => dat("ghiChu")(e.target.value)}
              className="w-full px-2 py-2 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8] resize-none" />
          </div>

          {daBam && thieu && !thieuThongTinDon && (
            <div className="text-[12px] text-[#c0392b]">Vui lòng nhập đủ các trường bắt buộc (*).</div>
          )}
          {daBam && thieuThongTinDon && (
            <div className="text-[12px] text-[#c0392b]">
              Đơn đang thiếu thông tin Bản án/Quyết định hoặc Người đứng đơn. Không thể chuyển trạng thái Đủ điều kiện thụ lý (Cần cập nhật thông tin đơn trước).
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-3 border-t border-[#eee] bg-[#fafafa]">
          <button onClick={onClose} className="h-[30px] px-4 border border-[#ccc] bg-white text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">Đóng</button>
          <button onClick={lamMoi} className="h-[30px] px-4 border border-[#8b1a1a] text-[#8b1a1a] bg-white hover:bg-[#fdeaea] rounded-[3px] text-[12px] font-medium transition-colors">Làm mới</button>
          <button onClick={luu} className="h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">Lưu</button>
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
    .filter(r => VALID_GHEP_STATUSES.includes(r.trangThai) && r.cuaToi)
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

// Nhãn rút gọn cho radio "Thời hiệu giải quyết" ở form Thêm mới/Sửa đơn
const THOI_HIEU_FORM_OPTIONS: { value: ThoiHieuKey; label: string }[] = [
  { value: "trong-han-1-nam", label: "1 năm" },
  { value: "qua-3-nam", label: "3 năm" },
  { value: "qua-5-nam", label: "5 năm" },
  { value: "khong-xac-dinh", label: "Không xác định thời hiệu" },
];

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
    ngayThuLy?: string;
    coVanBan: boolean;
    // Chỉ có khi nhan === "Trả lại đơn" — lấy từ Nhận đơn & TL vụ án → Trả lại
    nguoiTra?: string;
    ngayTra?: string;
    lyDoKhongDu?: string;
  };
  processingHistory?: { date: string; step: string; actor: string; note?: string; rawData?: any }[];
  nguoiNhap: string;
  ngayNhap: string;
  gioNhap: string;
  // Ngày sinh cán bộ nhập — chỉ hiển thị khi có 2 cán bộ trùng tên, để phân biệt
  nguoiNhapNgaySinh?: string;
  // Người SỬA gần nhất — cột "Người nhập / Sửa" hiện cả hai đầu: ai lập đơn ban
  // đầu và ai động vào sau cùng. Không có nghĩa là đơn chưa từng bị sửa.
  nguoiSua?: string;
  nguoiSuaNgaySinh?: string;
  ngaySua?: string;
  gioSua?: string;
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
  donViChuyenDen?: string;
  caNhanChuyenDen?: string;
  trungVoiDon?: string;            // mã đơn gốc, với đơn sinh từ "Thêm đơn trùng"
  // Yêu cầu bổ sung đã gửi cho đơn — nhập ở màn Thêm mới đơn, dùng lại làm lý do
  // mặc định khi lập văn bản "Yêu cầu bổ sung" ở popup lấy số.
  ycbsSo?: string; ycbsLyDo?: string;
  ycbsSo2?: string; ycbsLyDo2?: string;
  // ── Các trường phục vụ lọc ──
  loaiAn?: string;
  cuaToi?: boolean;               // thuộc tài khoản đang đăng nhập → tab "Đơn của tôi"
  hetThoiHanKhangNghi?: boolean;  // → tab "Hết thời hạn kháng nghị"
  /** Bản ghi là HỒ SƠ KHÁNG NGHỊ chứ không phải đơn thường. Trước đây nằm ở màn
   *  riêng; nay gộp vào Danh sách đơn, phân biệt bằng tag và bộ lọc. */
  laKhangNghi?: boolean;
  khangNghi?: {
    nguoiKhangNghi: string; noiNhan: string;
    soQD: string; ngayQD: string;
    trangThai: string; ketQua: string;
  };
  /** Số năm đã quá hạn xử lý — có giá trị nghĩa là đơn thuộc diện "Quá hạn giải
   *  quyết" (khác thoiHieu/"Hết thời hạn kháng nghị"). Dùng cho bộ lọc điều
   *  hướng từ Trang chủ (card "Đơn quá hạn giải quyết"). */
  quaHanNam?: number;
  thoiHieu?: ThoiHieuKey;         // nhãn thời hiệu giải quyết hiện dưới thông tin người gửi
  // Mã đơn bên màn Nhận đơn và TL vụ án — có giá trị nghĩa là đơn đang ở
  // tab "Đơn chờ phê duyệt", cột Thông tin giải quyết lấy theo kết luận của LĐ
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

/** Ngày sinh của một cán bộ bất kỳ (người nhập hoặc người sửa). */
const ngaySinhTheoTen = (ten?: string, ghiDe?: string) =>
  ghiDe ?? (ten ? NGAY_SINH_CAN_BO[ten] ?? "" : "");
/** Chỉ lấy NĂM để hiển thị trong ngoặc — đủ phân biệt, ngắn hơn cả ngày. */
const namSinh = (ngay?: string) => (ngay ?? "").split("/").pop() ?? "";

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
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682571", ngayThuLy: "21/07/2026", coVanBan: true },
    processingHistory: [
      { date: "21/07/2026", step: "Tiếp nhận hồ sơ", actor: "HCTP - Phòng tiếp nhận", note: "Đã kiểm tra tính hợp lệ" },
      { date: "22/07/2026", step: "Chuyển Vụ Giám đốc kiểm tra và dân sự", actor: "HCTP", note: "Gửi hồ sơ kèm danh sách công văn" },
    ],
    isPhanCong: true, loaiPhanCong: "chi-dinh",
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "trong-han-1-nam", quaHanNam: 0.3,
    nguoiNhap: "Vũ Văn Yên", ngayNhap: "21/07/2026", gioNhap: "17:41:29", nguoiSua: "Nguyễn Minh An", ngaySua: "06/08/2026", gioSua: "09:22:10",
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
    giaiQuyet: { nhan: "Trả lại đơn", color: "#2980b9", stl: "", coVanBan: false, nguoiTra: "Trần Quốc Hành", ngayTra: "22/07/2026" },
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
    giaiQuyet: { nhan: "Thụ lý mới", color: "#e67e22", stl: "54682575", ngayThuLy: "21/07/2026", coVanBan: true },
    isPhanCong: true, loaiPhanCong: "ngau-nhien",
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "khong-xac-dinh",
    nguoiNhap: "Phùng Trâm Anh", ngayNhap: "21/07/2026", gioNhap: "17:03:02", nguoiSua: "Vũ Văn Yên", nguoiSuaNgaySinh: "30/11/1992", ngaySua: "05/08/2026", gioSua: "16:40:55",
  },
  // ── Ca "Thụ lý mới trùng TP" ─────────────────────────────────────────────
  // Đơn vừa nhập, chọn Thụ lý mới, chưa có thẩm phán và chưa chuyển. Nhưng bản
  // án (917 · 21/07/2026 · TAND cấp cao tại TP. HCM) trùng đúng đơn Mã 7029 ở
  // ngay trên — đơn đó đã Thụ lý mới, đã phân công TP và đã chuyển vụ. Cột
  // Thông tin giải quyết vì thế phải ra "Thụ lý mới trùng TP".
  {
    id: 9999,
    nguoiGui: "Vũ Quang Đạt",
    diaChi: "Số 15, ngõ 20, đường Kim Mã, Ba Đình, Hà Nội",
    maDon: "Mã 8011",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd: "15/2026/HC-PT", ngay: "12/03/2026", toaXetXu: "TAND cấp cao tại Hà Nội",
      thuTuc: "Giám đốc thẩm",
      hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "",
      donViGui: "Vũ Quang Đạt",
      thamPhan: "",
      donViGiaiQuyet: "",
    },
    daNhan: false,
    soDon: 1,
    hinhThucTiepNhan: "Trực tiếp",
    ngayTrenDon: "26/08/2026",
    giaiQuyet: { nhan: "Chờ xử lý", color: "#1b5e20", stl: "", ngayThuLy: "", coVanBan: false },
    loaiAn: "Hành chính",
    cuaToi: true,
    thoiHieu: "trong-han-1-nam", quaHanNam: 0.2,
    nguoiNhap: "Nguyễn Minh An", ngayNhap: "26/08/2026", gioNhap: "09:00:00",
  },
  {
    id: 30,
    nguoiGui: "Trần Thị Mai Lan",
    diaChi: "Số 45, đường Nguyễn Trãi, Phường Bến Thành, Thành phố Hồ Chí Minh",
    maDon: "Mã 7048",
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      // Cùng bản án với Mã 7029 ⇒ hai đơn là "đơn liên quan" của nhau
      soBaqd: "917", ngay: "21/07/2026", toaXetXu: "TAND cấp cao tại TP. HCM",
      thuTuc: "Tái thẩm",
      hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "",
      donViGui: "Trần Thị Mai Lan",
      // Chưa phân công TP, không có "(Số: ...)" ⇒ chưa chuyển
      thamPhan: "",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự",
    },
    daNhan: true,
    soDon: 1,
    hinhThucTiepNhan: "Trực tiếp",
    ngayTrenDon: "03/08/2026",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682608", ngayThuLy: "05/08/2026", coVanBan: false },
    loaiAn: "Dân sự",
    cuaToi: true,
    thoiHieu: "trong-han-1-nam", quaHanNam: 0.6,
    nguoiNhap: "Nguyễn Minh An", ngayNhap: "05/08/2026", gioNhap: "08:15:40",
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
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682571", ngayThuLy: "15/11/2024", coVanBan: true },
    isPhanCong: true, loaiPhanCong: "chi-dinh",
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "qua-5-nam", quaHanNam: 1.1,
    nguoiNhap: "Nguyễn Thị Lan", ngayNhap: "15/11/2024", gioNhap: "09:15:44", nguoiSua: "Vũ Văn Yên", ngaySua: "02/08/2026", gioSua: "11:05:30",
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
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682571", ngayThuLy: "21/07/2026", coVanBan: true },
    // Phân công ngẫu nhiên + tờ trình đã được chánh án ký → đủ điều kiện lập
    // Thông báo phân công TP
    isPhanCong: true, loaiPhanCong: "ngau-nhien", toTrinhStatus: "da_ky",
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "trong-han-1-nam", quaHanNam: 1.4,
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
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682590", ngayThuLy: "10/07/2026", coVanBan: true },
    isPhanCong: true, loaiPhanCong: "ngau-nhien", cuaToi: true,
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "trong-han-1-nam", quaHanNam: 1.7,
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
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682591", ngayThuLy: "05/06/2025", coVanBan: true },
    isPhanCong: true, loaiPhanCong: "chi-dinh", cuaToi: true,
    thongTinChuyenDon: "Nội bộ",
    thoiHieu: "qua-3-nam", quaHanNam: 2.1,
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
    thoiHieu: "trong-han-1-nam", quaHanNam: 2.8,
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
    thoiHieu: "qua-3-nam", quaHanNam: 3.3,
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
    giaiQuyet: { nhan: "Trả lại đơn", color: "#2980b9", stl: "", coVanBan: false, nguoiTra: "Nguyễn Hảo", ngayTra: "14/02/2024" },
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
      // Đã phân công thẩm phán nhưng CHƯA chuyển vụ — mẫu cho luật
      // "Tờ trình phân công Thẩm phán" (không có "(Số: ...)" = chưa chuyển)
      thamPhan: "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)",
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: "Bưu điện",
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: "54682602", ngayThuLy: "25/08/2021", coVanBan: true },
    loaiAn: "Lao động", hetThoiHanKhangNghi: true, cuaToi: true,
    // Cán bộ khác nhưng trùng tên với "Vũ Văn Yên" ở các đơn còn lại
    thoiHieu: "qua-5-nam", quaHanNam: 4.9,
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
    thoiHieu: "qua-3-nam", quaHanNam: 6.2,
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
    giaiQuyet: { nhan: "Trả lại đơn", color: "#2980b9", stl: "", coVanBan: false, nguoiTra: "Trần Quốc Hành", ngayTra: "05/07/2025" },
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
  // ── 3 đơn đang ở tab "Đơn chờ phê duyệt" (màn Nhận đơn và TL vụ án) ──
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

  // ── Đơn đủ điều kiện lập Tờ trình phân công Thẩm phán ──
  // Cả 6 đơn: Thụ lý mới · đã có thẩm phán · CHƯA chuyển (đơn vị giải quyết
  // không kèm "(Số: ...)"). Trải trên 3 thẩm phán để màn Lưu số văn bản gom
  // nhóm theo thẩm phán có dữ liệu thật mà chạy.
  ...([
    ["Mã 7042", "Nguyễn Thị Hồng Nhung", "Phường Kim Liên, Quận Đống Đa, Thành phố Hà Nội",
      "41/2024/DS-PT", "18/03/2024", "TAND TP. Hà Nội", "Dân sự",
      "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)", "Trực tiếp", "chi-dinh", true],
    ["Mã 7043", "Trần Đình Khoa", "Thôn Trung, xã Tân Ước, Thành phố Hà Nội",
      "18/2023/HS-PT", "04/09/2023", "TAND TP. Hà Nội", "Hình sự",
      "Nguyễn Như Thắng (Thẩm phán TAND bậc 3)", "Bưu điện", "chi-dinh", true],
    ["Mã 7044", "Công ty TNHH Đại Nam Phát", "Lô B2, KCN Tiên Sơn, Tỉnh Bắc Ninh",
      "27/2024/KDTM-PT", "12/05/2024", "TAND tỉnh Bắc Ninh", "Kinh doanh thương mại",
      "Đỗ Tất Thống (Thẩm phán TAND bậc 3)", "Trực tuyến", "ngau-nhien", true],
    ["Mã 7045", "Lê Thị Kim Chi", "Số 88, đường Trần Phú, Thành phố Đà Nẵng",
      "09/2023/HNGĐ-PT", "21/06/2023", "TAND TP. Đà Nẵng", "Hôn nhân gia đình",
      "Đỗ Tất Thống (Thẩm phán TAND bậc 3)", "Tiếp công dân", "ngau-nhien", true],
    ["Mã 7046", "Phan Văn Lợi", "Ấp 3, xã Long Hòa, Thành phố Cần Thơ",
      "33/2022/LĐ-PT", "15/11/2022", "TAND TP. Cần Thơ", "Lao động",
      "Lê Thị Hoa (Thẩm phán TAND bậc 3)", "Bưu điện", "ngau-nhien", true],
    ["Mã 7047", "Hoàng Thị Vân Anh", "Số 21, phố Nguyễn Du, Tỉnh Nghệ An",
      "56/2024/HC-PT", "02/07/2024", "TAND tỉnh Nghệ An", "Hành chính",
      "Lê Thị Hoa (Thẩm phán TAND bậc 3)", "Trực tiếp", "chi-dinh", true],
  ] as const).map(([maDon, nguoiGui, diaChi, soBaqd, ngay, toaXetXu, loaiAn, thamPhan, htNhan, loaiPC, cuaToi], i) => ({
    id: 24 + i,
    nguoiGui, diaChi, maDon,
    loaiHinhThuc: "Đơn đề nghị",
    loaiHinhThucColor: "#8b1a1a",
    thongTinDon: {
      soBaqd, ngay, toaXetXu,
      thuTuc: "Giám đốc thẩm", hinhThuc: "Đơn đề nghị GĐT, TT",
      soCV: "", ngayCV: "", loaiCV: "", donViGui: nguoiGui,
      thamPhan,
      // KHÔNG có "(Số: ...)" ⇒ chưa chuyển sang vụ chuyên môn
      donViGiaiQuyet: "Vụ Giám đốc, kiểm tra và dân sự",
    },
    daNhan: true, soDon: 1, hinhThucTiepNhan: htNhan,
    giaiQuyet: { nhan: "Thụ lý mới", color: "#27ae60", stl: `5468270${i}`, ngayThuLy: `${10 + i}/07/2026`, coVanBan: false },
    loaiAn, cuaToi,
    isPhanCong: true, loaiPhanCong: loaiPC,
    thoiHieu: "trong-han-1-nam" as ThoiHieuKey,
    nguoiNhap: i % 2 === 0 ? "Vũ Văn Yên" : "Phùng Trâm Anh",
    ngayNhap: `${10 + i}/07/2026`, gioNhap: "09:30:00",
  })),

  // ── Hồ sơ kháng nghị — trước ở màn riêng, nay nằm chung Danh sách đơn ──
  // Người "gửi" là người ra quyết định kháng nghị, không phải công dân nộp đơn.
  ...([
    ["HSKN 8801", "QĐKN-2026/12", "18/05/2026", "45/2024/HS-PT", "10/09/2024", "TAND cấp cao tại Hà Nội", "Hình sự", 0, "Đã xét xử", "Hủy bản án, quyết định có hiệu lực pháp luật để xét xử lại theo thủ tục sơ thẩm"],
    ["HSKN 8802", "QĐKN-2026/15", "02/06/2026", "23/2023/DS-PT", "14/07/2023", "TAND cấp cao tại TP. Hồ Chí Minh", "Dân sự", 1, "Đã xét xử", "Sửa một phần bản án, quyết định của Tòa án đã có hiệu lực pháp luật"],
    ["HSKN 8803", "QĐKN-2026/19", "21/06/2026", "07/2025/KDTM-PT", "03/02/2025", "TAND cấp cao tại Đà Nẵng", "Kinh doanh thương mại", 0, "Đang xét xử", ""],
    ["HSKN 8804", "QĐKN-2026/24", "09/07/2026", "31/2024/HC-PT", "28/11/2024", "TAND cấp cao tại Hà Nội", "Hành chính", 1, "Đang xét xử", ""],
  ] as const).map(([maDon, soQD, ngayQD, soBaqd, ngayBA, toaXetXu, loaiAn, iDV, ttKN, kqKN], i) => {
    const dv = DON_VI_KHANG_NGHI[iDV as number];
    return {
      id: 40 + i,
      nguoiGui: dv.ten, diaChi: dv.diaChi, maDon,
      loaiHinhThuc: "Hồ sơ kháng nghị",
      loaiHinhThucColor: "#6d28d9",
      thongTinDon: {
        soBaqd, ngay: ngayBA, toaXetXu,
        thuTuc: "Giám đốc thẩm", hinhThuc: "Hồ sơ kháng nghị",
        soCV: soQD, ngayCV: ngayQD, loaiCV: "Quyết định kháng nghị",
        donViGui: dv.ten,
        thamPhan: i % 2 === 0 ? "Đỗ Tất Thống (Thẩm phán TAND bậc 3)" : "Lê Thị Hoa (Thẩm phán TAND bậc 3)",
        donViGiaiQuyet: `Vụ Giám đốc, kiểm tra và dân sự (Số: ${560 + i} - ${ngayQD})`,
      },
      daNhan: true, soDon: 1, hinhThucTiepNhan: "Nội bộ",
      giaiQuyet: { nhan: "Đã thụ lý", color: "#1a5a96", stl: `5468280${i}`, coVanBan: false },
      loaiAn, cuaToi: true,
      laKhangNghi: true,
      khangNghi: { nguoiKhangNghi: dv.ten, noiNhan: dv.noiNhan, soQD, ngayQD, trangThai: ttKN, ketQua: kqKN },
      thoiHieu: "trong-han-1-nam" as ThoiHieuKey,
      nguoiNhap: "Vũ Văn Yên", ngayNhap: ngayQD, gioNhap: "08:15:00",
    };
  }),
];

// ─── Bộ lọc Danh sách đơn: helper + luật nghiệp vụ ───────────────────────────

/** Đơn đã chuyển sang vụ chuyên môn hay chưa. Dấu hiệu duy nhất trong dữ liệu là
 *  "(Số: ...)" gắn sau tên đơn vị giải quyết — cột Thông tin đơn cũng đọc theo
 *  quy ước này để in ra nhãn "Đã chuyển" / "Chưa chuyển". */
const daChuyenVu = (r: DanhSachDonRow) => /\(Số:/.test(r.thongTinDon?.donViGiaiQuyet ?? "");

// Mỗi Loại văn bản chỉ áp được cho đơn thỏa một số điều kiện nhất định.
// Loại nào KHÔNG có trong bảng này thì không ràng buộc gì.
// Thêm luật mới = thêm 1 dòng ở đây, không phải sửa logic lọc.
//   trangThai — danh sách trạng thái giải quyết được phép (bỏ trống = không giới hạn)
//   them      — điều kiện bổ sung, mô tả bằng `moTa` để hiện lên UI
interface LuatLoaiVanBan {
  trangThai?: string[];
  them?: (r: DanhSachDonRow) => boolean;
  moTa: string;
}
const LOAI_VB_TRANG_THAI: Record<string, LuatLoaiVanBan> = {
  // Ràng buộc RIÊNG của màn Danh sách đơn, chặt hơn luật chung ở modal.
  // Tờ trình phân công chỉ lập cho đơn ĐÃ có thẩm phán và CHƯA chuyển đi vụ
  // chuyên môn — đơn đã chuyển thì việc phân công thuộc vụ đó lo.
  // "Đã chuyển" nhận biết qua "(Số: ...)" trong Đơn vị giải quyết.
  "Tờ trình phân công Thẩm phán": {
    them: r => !!r.thongTinDon?.thamPhan?.trim() && !daChuyenVu(r),
    moTa: "đơn phải đã được phân công thẩm phán và chưa chuyển",
  },
};

/** Đơn có được đưa vào văn bản loại `loaiVB` hay không — trả về lý do nếu không.
 *  Gộp hai tầng luật:
 *    1. Luật chung dùng CHÍNH hàm của màn Lưu số văn bản (`lyDoDonKhongHopLe`),
 *       nên chọn Loại văn bản ở đây là lọc đúng bằng lúc lập văn bản.
 *    2. Ràng buộc riêng thêm của màn này, nếu loại đó có trong bảng trên. */
const lyDoKhongDuocLap = (r: DanhSachDonRow, loaiVB: string, moTaTrung?: string): string | null => {
  if (!loaiVB) return null;
  const chung = lyDoDonKhongHopLe(r, loaiVB, moTaTrung);
  if (chung) return chung;
  const luat = LOAI_VB_TRANG_THAI[loaiVB];
  if (luat?.trangThai && !luat.trangThai.includes(r.giaiQuyet?.nhan ?? "")) return luat.moTa;
  if (luat?.them && !luat.them(r)) return luat.moTa;
  return null;
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

// "Ngày chuyển" của đơn chính là lúc tờ trình chứa đơn đó được duyệt. Lấy mốc
// duyệt GẦN NHẤT trong lịch sử văn bản (đơn có thể nằm trong nhiều tờ trình,
// và một tờ trình có thể bị trả lại rồi duyệt lại).
const HANH_DONG_DUYET = new Set(["Duyet", "SuaVaDuyet"]);
const ngayDuyetToTrinh = (ds: VanBanTrinh[], maDon?: string): string | undefined => {
  const mocs = timVanBanTheoDon(ds, maDon)
    .flatMap(v => v.lichSu.filter(m => HANH_DONG_DUYET.has(m.hanhDong)));
  return mocs.length ? mocs[mocs.length - 1].thoiGian : undefined;
};

// Thẩm phán lưu kèm nhiều nhóm ngoặc: (chức danh) (mã đơn vị) (số văn bản – ngày).
// Cột chỉ cần tên + chức danh; từ nhóm ngoặc thứ hai trở đi là số văn bản, bỏ đi.
const thamPhanGon = (v?: string) => {
  const t = (v ?? "").trim();
  const m = /^([^()]*\([^()]*\))/.exec(t);
  return (m ? m[1] : t.split("(")[0]).trim();
};

// Chức danh trong ngoặc viết tắt cho vừa cột:
//   (Thẩm phán TAND bậc 3) → (TPB3)
//   (Thẩm phán bậc 2)      → (TPB2)
//   (Thẩm phán TANDTC)     → (TP TANDTC)
// Chỉ áp trong ngoặc — nhãn "Thẩm phán:" và tên người vẫn giữ nguyên.
const vietTatChucDanhTP = (v?: string) =>
  (v ?? "")
    .replace(/\(\s*Thẩm phán(?:\s+TAND)?\s+bậc\s*(\d+)\s*\)/gi, "(TPB$1)")
    .replace(/\(\s*Thẩm phán\b/gi, "(TP");

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
// Đơn coi là "đã thụ lý" — gồm cả vừa thụ lý lẫn thụ lý từ trước.
// Tab Đơn Thụ lý xét THEO TRẠNG THÁI, không loại trừ đơn hết thời hiệu kháng
// nghị: hết thời hiệu vẫn là đơn đã thụ lý, chỉ khác ở cảnh báo thời hiệu.
const DA_THU_LY = ["Thụ lý mới", "Đã thụ lý"];

const TAB_MATCH: ((r: DanhSachDonRow) => boolean)[] = [
  () => true,                                                                      // Tổng số
  r => !!r.cuaToi,                                                                 // Đơn của tôi
  r => DA_THU_LY.includes(r.giaiQuyet?.nhan ?? ""),                                // Đơn Thụ lý
  r => r.giaiQuyet?.nhan === "Chưa đủ điều kiện",                                  // Chưa đủ điều kiện
  r => r.thoiHieu === "qua-3-nam" || r.thoiHieu === "qua-5-nam",                   // Hết thời hạn kháng nghị
  r => ![...DA_THU_LY, "Chưa đủ điều kiện"].includes(r.giaiQuyet?.nhan ?? ""),     // Khác
  r => r.giaiQuyet?.nhan === "Trả lại đơn",                                       // Đơn trả lại
];

/** Khóa nhận diện "đơn liên quan" = cùng một bản án/quyết định (số · ngày · tòa).
 *  Đúng bằng cái mà ô Tra cứu bản án ở màn Thêm mới dùng để kéo ra bảng "Danh
 *  sách đơn liên quan", nên hai màn hiểu chữ "liên quan" giống hệt nhau. */
const khoaBanAn = (r: DanhSachDonRow) =>
  [r.thongTinDon?.soBaqd, r.thongTinDon?.ngay, r.thongTinDon?.toaXetXu].map(norm).join("|");

/** Trạng thái "Thụ lý mới trùng TP".
 *  Đơn đang Thụ lý mới, bản thân nó chưa chuyển đi đâu, nhưng cùng bản án với
 *  một đơn khác đã Thụ lý mới · đã phân công thẩm phán · đã chuyển sang vụ
 *  chuyên môn. Hồ sơ thực chất đang nằm trong tay một thẩm phán rồi, nên đơn này
 *  phải về đúng thẩm phán đó chứ không đem phân công lại từ đầu.
 *  Trả về chính đơn liên quan đó để cột còn chỉ ra được mã đơn và tên thẩm phán. */
const donTrungThamPhan = (r: DanhSachDonRow, tatCa: DanhSachDonRow[]): DanhSachDonRow | undefined => {
  if (r.giaiQuyet?.nhan !== "Thụ lý mới" || daChuyenVu(r)) return undefined;
  // Chưa khai số bản án thì chưa có căn cứ nào để nói hai đơn liên quan nhau —
  // nếu không, mọi đơn trống bản án sẽ tự coi nhau là trùng.
  if (!norm(r.thongTinDon?.soBaqd)) return undefined;
  const khoa = khoaBanAn(r);
  return tatCa.find(o =>
    o.id !== r.id &&
    khoaBanAn(o) === khoa &&
    o.giaiQuyet?.nhan === "Thụ lý mới" &&
    !!o.thongTinDon?.thamPhan?.trim() &&
    daChuyenVu(o));
};

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
  <div className="flex flex-col gap-1 py-[2px] min-h-[48px] justify-end">
    {label && (
      <label className={`text-[11px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis ${bold ? "font-semibold text-[#222]" : "text-[#555]"}`}
        title={label}>{label}</label>
    )}
    <div className="w-full">{children}</div>
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
  "chua-trinh": { nhan: "Chưa trình ký", cls: "bg-[#f5f5f5] text-[#666] border-[#d5d5d5]" },
  "cho-tp": { nhan: "Chờ trưởng phòng duyệt", cls: "bg-[#eaf4ff] text-[#1a5a96] border-[#c5d8f8]" },
  // nhãn được thay bằng "Chờ <chức danh> ký" khi dựng tiến độ
  "cho-ky": { nhan: "Chờ ký", cls: "bg-[#fff3cd] text-[#856404] border-[#ffecb5]" },
  "cho-so": { nhan: "Đã ký, chờ lấy số", cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]" },
  "phat-hanh": { nhan: "Đã phát hành", cls: "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]" },
  "tra-lai": { nhan: "Bị trả lại để chỉnh sửa", cls: "bg-[#fdecea] text-[#c0392b] border-[#e6a5a0]" },
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
  "Cảnh báo án hết thời hiệu": "bg-[#c0392b] text-white border-[#a5281c]",
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
    {
      id: 1, maDon: "4984", ...DON_4984, ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Án QH", "Cảnh báo án hết thời hiệu"],
      maVuAn: "VA26-002012", ttv: "Nguyễn Văn A",
      tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích hoặc gây hại cho sức khoẻ người khác"
    },
    {
      id: 2, maDon: "4985", ...DON_4984, hinhThuc: "Đơn báo phát hiện vi phạm PL", ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      maVuAn: "VA26-002012", ttv: "Nguyễn Ngọc B",
      tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích"
    },
    {
      id: 3, maDon: "4984", ...DON_4984, cvChuyen: undefined, thuLyMoi: undefined, daThuLy: true,
      ndd: "Võ Hoài Trâm", toaBA: "Tòa án nhân dân khu vực 5 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Cảnh báo án hết thời hiệu"]
    },
    {
      id: 4, maDon: "4956", cvChuyen: "18 - 05/06/2026", thuLyMoi: "2329180", thamPhan: "Đỗ Tất Thống",
      hinhThuc: "Đơn khiếu nại tư pháp tố tụng", nhan: [],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", ndd: "DANH THỊ SÁ RON",
      soBA: "HKTT_0506_05", ngayBA: "01/06/2026", toaBA: "Tòa án nhân dân khu vực 1 - Cần Thơ",
      capXetXu: "Sơ thẩm", thaoTacVuAn: ["ghep", "them"]
    },
    {
      id: 5, maDon: "4943", cvChuyen: "12 - 04/06/2026", thuLyMoi: "2329155", thamPhan: "Nguyễn Như Thắng",
      hinhThuc: "Đơn đề nghị GĐT/TT", nhan: ["Án QH"],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", ndd: "Võ Hoài Trâm",
      soBA: "99", ngayBA: "28/05/2026", toaBA: "Tòa án nhân dân khu vực 3 - Hà Nội",
      capXetXu: "Phúc thẩm", thaoTacVuAn: ["ghep", "them"]
    },
  ],

  // ── Đơn chờ phê duyệt: cột 5 là Ý kiến lãnh đạo ──
  "Đơn chờ phê duyệt": [
    {
      id: 1, maDon: "4984", ...DON_4984, ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Án QH", "Cảnh báo án hết thời hiệu"],
      yKien: [
        { ketQua: "Không thụ lý", nguoi: "Nguyễn Thị Bình", chucVu: "Vụ trưởng", ngayDuyet: "10/07/2026" },
        { ketQua: "Không thụ lý", nguoi: "Nguyễn Văn Tiến", chucVu: "Phó CA", ngayDuyet: "10/07/2026" },
      ]
    },
    {
      id: 2, maDon: "4985", ...DON_4984, hinhThuc: "Đơn báo phát hiện vi phạm PL", ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      yKien: [
        { ketQua: "Thụy mới", nguoi: "Nguyễn Thị Bình", chucVu: "Vụ trưởng", ngayDuyet: "10/07/2026" },
        { ketQua: "Không thụ lý", nguoi: "Nguyễn Văn Tiến", chucVu: "Phó CA", ngayDuyet: "10/07/2026" },
      ]
    },
    {
      id: 3, maDon: "5012", cvChuyen: "44 - 10/06/2026", thuLyMoi: "2330012", thamPhan: "Lê Thị Hoa",
      hinhThuc: "Đơn đề nghị GĐT/TT", nhan: ["Án chỉ đạo"],
      nguoiKhieuNai: "Phạm Văn Tú", biCao: "Hoàng Thị Minh", ndd: "Nguyễn Quốc Bảo",
      soBA: "HKTT_1006_01", ngayBA: "08/06/2026", toaBA: "Tòa án nhân dân tỉnh Hà Nam",
      capXetXu: "Phúc thẩm",
      yKien: [{ ketQua: "Không thụ lý", nguoi: "Nguyễn Thị Bình", chucVu: "Vụ trưởng", ngayDuyet: "12/07/2026" }]
    },
  ],

  // ── Chưa có vụ án: thẩm phán là dự kiến, vụ án hiển thị mờ ──
  "Chưa có vụ án": [
    {
      id: 1, maDon: "4984", ...DON_4984, thamPhanDuKien: true, ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Án QH", "Cảnh báo án hết thời hiệu"],
      maVuAn: "VA26-002012", ttv: "Nguyễn Văn A", moVuAn: true,
      tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích hoặc gây hại cho sức khoẻ người khác"
    },
    {
      id: 2, maDon: "4985", ...DON_4984, thamPhanDuKien: true, hinhThuc: "Đơn báo phát hiện vi phạm PL",
      ndd: "Võ Hoài Trâm", toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      maVuAn: "VA26-002012", ttv: "Nguyễn Ngọc B", moVuAn: true,
      tenVuAn: "Vụ án ĐẶNG THIÊN DƯƠNG - Tội cố ý gây thương tích"
    },
    {
      id: 3, maDon: "4984", ...DON_4984, cvChuyen: undefined, thuLyMoi: undefined, daThuLy: true,
      thamPhanDuKien: true, ndd: "Võ Hoài Trâm", toaBA: "Tòa án nhân dân khu vực 5 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Cảnh báo án hết thời hiệu"]
    },
    {
      id: 4, maDon: "4956", cvChuyen: "18 - 05/06/2026", thuLyMoi: "2329180", thamPhan: "Đỗ Tất Thống",
      thamPhanDuKien: true, hinhThuc: "Đơn khiếu nại tư pháp tố tụng", nhan: [],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", ndd: "DANH THỊ SÁ RON",
      soBA: "HKTT_0506_05", ngayBA: "01/06/2026", toaBA: "Tòa án nhân dân khu vực 1 - Cần Thơ",
      capXetXu: "Sơ thẩm", thaoTacVuAn: ["ghep", "them"]
    },
    {
      id: 5, maDon: "4943", cvChuyen: "12 - 04/06/2026", thuLyMoi: "2329155", thamPhan: "Nguyễn Như Thắng",
      thamPhanDuKien: true, hinhThuc: "Đơn đề nghị GĐT/TT", nhan: ["Án QH"],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", ndd: "Võ Hoài Trâm",
      soBA: "99", ngayBA: "28/05/2026", toaBA: "Tòa án nhân dân khu vực 3 - Hà Nội",
      capXetXu: "Phúc thẩm", thaoTacVuAn: ["ghep", "them"]
    },
  ],

  // ── Đã có vụ án: thêm nút Giao tiểu hồ sơ, mỗi dòng có Chuyển / Hủy ghép ──
  "Đã có vụ án": [
    {
      id: 1, maDon: "4984", ...DON_4984, ndd: "NGUYỄN TRUNG HOÀ",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      ...VU_AN_681, ttv: "Nguyễn Văn A", thaoTacVuAn: ["chuyen", "huyghep"],
      nhanTra: { nhan: "10/6/2026" }
    },
    {
      id: 2, maDon: "4984", ...DON_4984, cvChuyen: undefined, thuLyMoi: undefined, daThuLy: true,
      ndd: "VKSNDTC", toaBA: "Tòa án nhân dân khu vực 5 - Đà Nẵng", nhan: ["Án chỉ đạo"],
      ...VU_AN_681, thaoTacVuAn: ["chuyen", "huyghep"], nhanTra: { nhan: "10/6/2026" }
    },
    {
      id: 3, maDon: "4943", cvChuyen: "12 - 04/06/2026", thuLyMoi: "2329144", thamPhan: "Đỗ Tất Thống",
      hinhThuc: "Đơn khiếu nại tư pháp tố tụng", nhan: ["Án chỉ đạo"],
      biCao: "Vũ Hoa Hào", ndd: "Phạm Hoàng Anh",
      soBA: "99", ngayBA: "02/06/2026", toaBA: "Tòa án nhân dân tỉnh Bắc Ninh", capXetXu: "Sơ thẩm",
      ...VU_AN_681, thaoTacVuAn: ["chuyen", "huyghep"],
      nhanTra: { nguoiTra: "Trần Quốc Hành", ngayTra: "08/6/2026" }
    },
    {
      id: 4, maVanThuDen: "4943 - 04/06/2026", soHSKN: "4984 - 04/06/2026", thuLyXetXu: "2329241",
      thamPhan: "Đỗ Tất Thống", hinhThuc: "Hồ sơ kháng nghị", nhan: ["Án chỉ đạo"],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", nguoiKhangNghi: "VKSNDTC",
      soBA: "HKTT_0506_05", ngayBA: "04/06/2026", toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      capXetXu: "Sơ thẩm", ...VU_AN_681, thaoTacVuAn: ["huyghep"],
      nhanTra: { nguoiThaoTac: "Nguyễn Hảo", ngayThaoTac: "10/6/2026" }
    },
  ],

  // ── Hồ sơ kháng nghị ──
  "Hồ sơ kháng nghị": [
    {
      id: 1, maVanThuDen: "4943 - 04/06/2026", soHSKN: "4984 - 04/06/2026", thuLyXetXu: "2329241",
      thamPhan: "Đỗ Tất Thống", hinhThuc: "Hồ sơ kháng nghị", nhan: ["Án chỉ đạo"],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", nguoiKhangNghi: "VKSNDTC",
      soBA: "HKTT_0506_05", ngayBA: "04/06/2026", toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      capXetXu: "Sơ thẩm", ...VU_AN_681, thaoTacVuAn: ["huyghep"],
      nhanTra: { nguoiThaoTac: "Nguyễn Hảo", ngayThaoTac: "10/6/2026" }
    },
    {
      id: 2, maVanThuDen: "4943 - 04/06/2026", soHSKN: "4984 - 04/06/2026", thuLyXetXu: "2329144",
      thamPhan: "Đỗ Tất Thống", hinhThuc: "Hồ sơ kháng nghị", nhan: [],
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hào", nguoiKhangNghi: "TANDTC",
      soBA: "99", toaBA: "Tòa án nhân dân tỉnh Bắc Ninh", capXetXu: "Sơ thẩm",
      thaoTacVuAn: ["them"], nhanTra: { nguoiThaoTac: "Nguyễn Hảo", ngayThaoTac: "10/6/2026" }
    },
    {
      id: 3, maVanThuDen: "4943 - 12 - 04/06/2026", thamPhan: "Đỗ Tất Thống",
      hinhThuc: "Hồ sơ kháng nghị", nhan: [], nguoiKhangNghi: "VKSNDTC",
      thaoTacVuAn: ["them"], nhanTra: { nhan: "10/6/2026" }
    },
  ],

  // ── Hồ sơ tử hình: cột 5 đổi thành Thông tin hồ sơ ──
  "Hồ sơ tử hình": [
    {
      id: 1, maDon: "4984", ...DON_4984, ndd: "Võ Hoài Trâm",
      toaBA: "Tòa án nhân dân khu vực 7 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Án QH", "Cảnh báo án hết thời hiệu"],
      maHS: "VA26-002012", ttv: "Nguyễn Văn A"
    },
    {
      id: 2, maDon: "4984", ...DON_4984, cvChuyen: undefined, thuLyMoi: undefined, daThuLy: true,
      ndd: "Võ Hoài Trâm", toaBA: "Tòa án nhân dân khu vực 5 - Đà Nẵng",
      nhan: ["Án chỉ đạo", "Án tử hình", "Cảnh báo án hết thời hiệu"]
    },
    {
      id: 3, maDon: "5101", cvChuyen: "62 - 18/07/2026", thuLyMoi: "2331001", thamPhan: "Nguyễn Văn Hùng",
      hinhThuc: "Đơn đề nghị GĐT/TT", nhan: ["Án tử hình", "Trong hạn 1 năm"],
      nguoiKhieuNai: "Trần Thị Ngọc", biCao: "Lê Văn Tám", ndd: "Phạm Thị Hoa",
      soBA: "HKTT_1807_01", ngayBA: "15/07/2026", capXetXu: "Sơ thẩm",
      thaoTacVuAn: ["ghepHS", "themHS"]
    },
    {
      id: 4, maDon: "5102", cvChuyen: "63 - 20/07/2026", thuLyMoi: "2331002", thamPhan: "Đỗ Tất Thống",
      hinhThuc: "Đơn đề nghị GĐT/TT", nhan: [],
      nguoiKhieuNai: "Nguyễn Văn Đức", biCao: "Trần Quang Minh", ndd: "Lê Thị Lan",
      soBA: "HKTT_2007_02", ngayBA: "18/07/2026", toaBA: "Tòa án nhân dân tỉnh Đồng Nai",
      capXetXu: "Phúc thẩm", maHS: "HSTH-2026-004201", maVuAn: "VA26-004201",
      tenVuAn: "Vụ án TRẦN QUANG MINH – Tội giết người", trangThaiHS: "Đang giải quyết GĐT,TT"
    },
  ],

  // ── Trả lại ──
  "Trả lại": [
    {
      id: 1, maDon: "5016", cvChuyen: "47 - 14/06/2026", thuLyMoi: "2330016", thamPhan: "Cao Thị Mai",
      hinhThuc: "Đơn báo phát hiện vi phạm PL", nhan: [],
      nguoiKhieuNai: "Vũ Thanh Tùng", biCao: "Đỗ Hữu Bình", ndd: "Hoàng Mỹ Linh",
      soBA: "HKTT_1406_05", ngayBA: "12/06/2026", toaBA: "Tòa án nhân dân tỉnh Vĩnh Long",
      capXetXu: "Sơ thẩm", maVuAn: "VA26-003105",
      tenVuAn: "Vụ án ĐỖ HỮU BÌNH - Tội vi phạm quy định về điều khiển phương tiện",
      tbgq: { so: "TBTLĐ SỐ QĐ -NGÀY QĐ", ttv: "Nguyễn Văn An", tp: "Đào Văn Nam" },
      nhanTra: { nguoiTra: "Trần Quốc Hành", ngayTra: "16/6/2026" }
    },
  ],
};

const NhanDonTLVuAn = () => {
  const [tab, setTab] = useState(0);
  const [moRong, setMoRong] = useState(false);
  const [chon, setChon] = useState<number[]>([]);
  useKetLuanLD();   // render lại khi kết luận của LĐ thay đổi

  // Số trên tab "Đơn chờ phê duyệt" chỉ đếm đơn LĐ chưa cho kết luận
  const soChoYKien = (DU_LIEU_TAB["Đơn chờ phê duyệt"] ?? [])
    .filter(r => !r.maDon || !layKetLuanLD(r.maDon)).length;
  const TABS = [
    { label: "Tất cả", count: "49" }, { label: "Đơn chờ phê duyệt", count: String(soChoYKien) },
    { label: "Chưa có vụ án", count: "5" }, { label: "Đã có vụ án", count: "+37" },
    { label: "Hồ sơ kháng nghị", count: "+3" }, { label: "Hồ sơ tử hình", count: "2" },
    { label: "Trả lại", count: "2" },
  ];

  const tenTab = TABS[tab].label;
  const rows = DU_LIEU_TAB[tenTab] ?? [];
  // Cấu hình khác nhau giữa các tab
  const laYKien = tenTab === "Đơn chờ phê duyệt";     // cột 5 = Ý kiến lãnh đạo, bỏ cột nhận/trả
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
                className={`px-4 py-[7px] text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${tab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#222]"}`}>
                {t.label}
                <span className={`ml-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${tab === i ? "bg-[#8b1a1a] text-white" : "bg-[#eee] text-[#666]"}`}>{t.count}</span>
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
                                <span className={`inline-block px-2 py-[2px] rounded-[10px] border text-[10px] font-medium ${y.ketQua.toLowerCase().includes("không")
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

const TP_BAC_3 = "Thẩm phán bậc 3";
const TP_TOI_CAO = "Thẩm phán tối cao";

// Chức danh chỉ nhận 1 trong 2 giá trị trên; giá trị khác (kể cả rỗng) đều
// hiển thị "-" thay vì in nguyên văn ra bảng.
const hienChucDanh = (chucDanh: string) => chucDanh === TP_BAC_3 || chucDanh === TP_TOI_CAO ? chucDanh : "-";

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
  chucDanh: string;
  donVi: string;
  chucVu: string;
  // Có nằm trong diện được phân công đơn hay không. Thẩm phán vẫn trong danh
  // sách nhưng bỏ tích thì máy không đẩy đơn mới về nữa — khác hẳn nghỉ phép,
  // vốn chỉ tạm dừng theo một khoảng thời gian.
  thamGiaGiaiQuyet: boolean;
  daNhan: number;       // số VB đề nghị GĐT,TT đã phân công trong năm (backend trả về)
  tongDaNhan: number;   // lũy kế từ khi thẩm phán bắt đầu công tác
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
  // Không có trường trạng thái/duyệt: màn này do admin phân quyền thao tác,
  // đăng ký xong là kỳ nghỉ có hiệu lực ngay.
}

// [họ tên, chức danh, đơn vị, chức vụ, đã nhận trong năm, tổng lũy kế, tham gia giải quyết đơn]
const THAM_PHAN_CAU_HINH: ThamPhanCauHinh[] = [
  // TPB3 của Vụ GĐ,KT — nhóm này sinh ra "mức chuẩn"
  ["Nguyễn Thị Lan", TP_BAC_3, VU_GD_KT, "Vụ trưởng", 6, 148, true],
  ["Trần Văn Hùng", TP_BAC_3, VU_GD_KT, "Phó Vụ trưởng", 11, 203, true],
  ["Trần Thị Hương", TP_BAC_3, VU_GD_KT, "Phó Vụ trưởng", 8, 96, true],
  ["Lê Thị Mai", TP_BAC_3, VU_GD_KT, "", 29, 312, true],
  ["Hoàng Thị Thu", TP_BAC_3, VU_GD_KT, "", 31, 175, true],
  ["Đỗ Thị Kim Oanh", TP_BAC_3, VU_GD_KT, "", 27, 264, true],
  ["Nguyễn Như Thắng", TP_BAC_3, VU_GD_KT, "", 33, 341, true],
  // TPB3 giữ chức vụ quản lý ngoài Vụ GĐ,KT — Chánh Văn phòng thiên về điều
  // hành, không nằm trong diện nhận đơn nên bỏ tích.
  ["Phạm Văn Đức", TP_BAC_3, "Văn phòng TANDTC", "Chánh Văn phòng", 9, 87, false],
  ["Lê Minh Tuấn", TP_BAC_3, "Tòa Hình sự", "Phó Chánh án", 14, 129, true],
  // TPB3 ngoài Vụ, không giữ chức vụ — dự thảo chưa quy định
  ["Vũ Thị Hạnh", TP_BAC_3, "Tòa Dân sự", "", 18, 156, true],
  ["Nguyễn Văn Hiền", TP_BAC_3, "Tòa Kinh tế", "", 21, 198, true],
  // Chức danh khác — tiêu chí không áp dụng
  ["Đỗ Tất Thống", TP_TOI_CAO, VU_GD_KT, "", 25, 287, true],
].map(([hoTen, chucDanh, donVi, chucVu, daNhan, tongDaNhan, thamGiaGiaiQuyet], i) => ({
  id: i + 1,
  hoTen: hoTen as string,
  chucDanh: chucDanh as string,
  donVi: donVi as string,
  chucVu: chucVu as string,
  thamGiaGiaiQuyet: thamGiaGiaiQuyet as boolean,
  daNhan: daNhan as number,
  tongDaNhan: tongDaNhan as number,
}));

const NGHI_PHEP_MAU: NghiPhepRow[] = [
  {
    id: 1, thamPhan: "Lê Minh Tuấn", loai: "Biệt phái", tuNgay: "01/07/2026", denNgay: "31/12/2026",
    xuLy: "chuyen-giao", chuyenCho: "Trần Văn Hùng", vuDangCam: 3,
    lyDo: "Biệt phái công tác tại TAND cấp cao Đà Nẵng"
  },
  {
    id: 2, thamPhan: "Trần Thị Hương", loai: "Thai sản", tuNgay: "15/08/2026", denNgay: "15/02/2027",
    xuLy: "tra-ve", chuyenCho: "", vuDangCam: 4,
    lyDo: "Nghỉ chế độ thai sản 6 tháng"
  },
  {
    id: 3, thamPhan: "Lê Thị Mai", loai: "Phép năm", tuNgay: "03/08/2026", denNgay: "09/08/2026",
    xuLy: "giu-nguyen", chuyenCho: "", vuDangCam: 2,
    lyDo: "Nghỉ phép năm"
  },
  {
    id: 4, thamPhan: "Hoàng Thị Thu", loai: "Đi công tác", tuNgay: "20/09/2026", denNgay: "27/09/2026",
    xuLy: "giu-nguyen", chuyenCho: "", vuDangCam: 5,
    lyDo: "Tham dự hội nghị tổng kết ngành"
  },
];

// Đang nghỉ = có kỳ nghỉ bao trùm ngày đang xét. Không xét duyệt nữa vì mọi
// đăng ký trên màn này đều do admin lập và có hiệu lực ngay.
const dangNghi = (hoTen: string, ds: NghiPhepRow[], moc: Date) => ds.find(n =>
  n.thamPhan === hoTen &&
  (() => {
    const tu = parseVNDate(n.tuNgay), den = parseVNDate(n.denNgay);
    return !!tu && !!den && moc >= tu && moc <= den;
  })());

const CauHinhPhanCongTP = () => {
  const [tab, setTab] = useState<0 | 1>(0);
  const [rows, setRows] = useState<ThamPhanCauHinh[]>(THAM_PHAN_CAU_HINH);
  const [nghiPhep, setNghiPhep] = useState<NghiPhepRow[]>(NGHI_PHEP_MAU);
  const [fHoTen, setFHoTen] = useState("");
  const [fChucDanh, setFChucDanh] = useState("");
  const [fDonVi, setFDonVi] = useState("");
  const [fChucVu, setFChucVu] = useState("");
  const [fNhanPC, setFNhanPC] = useState("");
  const [fTinhTrang, setFTinhTrang] = useState("");
  const LOC_RONG = { hoTen: "", chucDanh: "", donVi: "", chucVu: "", nhanPC: "", tinhTrang: "" };
  const [loc, setLoc] = useState(LOC_RONG);
  const [thongBao, setThongBao] = useState("");
  const [themNghi, setThemNghi] = useState(false);
  // Bản ghi nghỉ đang sửa — dùng chung popup với Đăng ký nghỉ, khác mỗi dữ liệu
  // điền sẵn và tiêu đề.
  const [suaNghi, setSuaNghi] = useState<NghiPhepRow | null>(null);

  // Cố định trong suốt phiên: nếu tạo Date mới mỗi lần render thì mọi useMemo
  // phụ thuộc nó đều tính lại, memo thành vô nghĩa.
  const homNay = useMemo(() => new Date(), []);

  // Các ô lọc chỉ liệt kê giá trị ĐANG CÓ trong bảng, không đổ từ danh mục tĩnh.
  // Danh mục tĩnh có những mục chưa thẩm phán nào mang (Chánh án, Phó Chánh Văn
  // phòng, Vụ Pháp chế...) — chọn phải là bảng trắng trơn mà không rõ vì sao.
  const { chucDanhOptions, chucVuOptions, donViOptions } = useMemo(() => {
    const uniq = (ds: string[]) => [...new Set(ds)].sort((a, b) => a.localeCompare(b, "vi"));
    return {
      chucDanhOptions: uniq(rows.map(r => r.chucDanh)),
      chucVuOptions: uniq(rows.map(r => r.chucVu)),
      donViOptions: uniq(rows.map(r => r.donVi)),
    };
  }, [rows]);

  const dsHienThi = useMemo(() => rows.filter(r =>
    (!loc.hoTen || contains(r.hoTen, loc.hoTen)) &&
    (!loc.chucDanh || r.chucDanh === loc.chucDanh) &&
    (!loc.chucVu || r.chucVu === loc.chucVu) &&
    (!loc.donVi || r.donVi === loc.donVi) &&
    (!loc.nhanPC || (loc.nhanPC === "co") === r.thamGiaGiaiQuyet) &&
    // Tình trạng không nằm trong dữ liệu thẩm phán mà suy ra từ bảng nghỉ phép,
    // nên lọc phải hỏi lại đúng hàm mà cột đang dùng để in nhãn.
    (!loc.tinhTrang || (loc.tinhTrang === "nghi") === !!dangNghi(r.hoTen, nghiPhep, homNay))
    // Thẩm phán được tích "Nhận phân công" nổi lên trên, người không nhận
    // trôi xuống dưới — sort ổn định nên trong từng nhóm vẫn giữ đúng thứ tự cũ.
  ).sort((a, b) => Number(b.thamGiaGiaiQuyet) - Number(a.thamGiaGiaiQuyet)),
    [rows, loc, nghiPhep, homNay]);

  const sua = <K extends keyof ThamPhanCauHinh>(id: number, khoa: K) => (v: ThamPhanCauHinh[K]) =>
    setRows(p => p.map(r => r.id === id ? { ...r, [khoa]: v } : r));

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
              className={`px-4 py-[7px] text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${tab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#222]"}`}>
              {t.nhan}
              <span className={`ml-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${tab === i ? "bg-[#8b1a1a] text-white" : "bg-[#eee] text-[#666]"}`}>{t.dem}</span>
            </button>
          ))}
        </div>

        {tab === 0 ? (
          <>
            {/* Bộ lọc — tất cả nằm trên MỘT dòng. Dùng flex chia đều thay vì grid
                cột cố định: 6 ô + cặp nút không chia hết cho lưới nào cũng đẹp,
                mà flex-1 thì ô nào cũng co giãn theo bề ngang màn hình.
                flex-wrap chỉ là lưới an toàn cho màn quá hẹp. */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[170px]">
                <FLbl>Họ và tên</FLbl>
                <FInp value={fHoTen} onChange={e => setFHoTen(e.target.value)}
                  placeholder="Nhập họ và tên thẩm phán" className="h-[34px]" />
              </div>
              <div className="flex-1 min-w-[130px]">
                <FLbl>Chức danh</FLbl>
                <div className="relative">
                  <select value={fChucDanh} onChange={e => setFChucDanh(e.target.value)}
                    className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                    <option value="">- Tất cả -</option>
                    {chucDanhOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div className="flex-1 min-w-[130px]">
                <FLbl>Chức vụ</FLbl>
                <div className="relative">
                  <select value={fChucVu} onChange={e => setFChucVu(e.target.value)}
                    className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                    <option value="">- Tất cả -</option>
                    {chucVuOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div className="flex-1 min-w-[150px]">
                <FLbl>Đơn vị công tác</FLbl>
                <div className="relative">
                  <select value={fDonVi} onChange={e => setFDonVi(e.target.value)}
                    className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                    <option value="">- Tất cả -</option>
                    {donViOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              {/* Hai cột mới của bảng cũng phải lọc được, nếu không cột hiện ra
                  mà không có đường nào lọc theo nó. */}
              <div className="flex-1 min-w-[130px]">
                <FLbl>Nhận phân công</FLbl>
                <div className="relative">
                  <select value={fNhanPC} onChange={e => setFNhanPC(e.target.value)}
                    className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                    <option value="">- Tất cả -</option>
                    <option value="co">Có nhận</option>
                    <option value="khong">Không nhận</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div className="flex-1 min-w-[130px]">
                <FLbl>Tình trạng</FLbl>
                <div className="relative">
                  <select value={fTinhTrang} onChange={e => setFTinhTrang(e.target.value)}
                    className="w-full h-[34px] pl-2.5 pr-7 text-[12px] border border-[#ddd] rounded-[4px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96]">
                    <option value="">- Tất cả -</option>
                    <option value="lam-viec">Đang làm việc</option>
                    <option value="nghi">Đang nghỉ</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
              </div>
              <div className="flex items-end gap-2 flex-shrink-0">
                <button onClick={() => setLoc({
                  hoTen: fHoTen, chucDanh: fChucDanh, donVi: fDonVi,
                  chucVu: fChucVu, nhanPC: fNhanPC, tinhTrang: fTinhTrang,
                })}
                  className="flex items-center gap-1.5 h-[34px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[4px] text-[12px] font-medium transition-colors flex-shrink-0">
                  <Search size={13} /> Tìm kiếm
                </button>
                <button onClick={() => {
                  setFHoTen(""); setFChucDanh(""); setFDonVi("");
                  setFChucVu(""); setFNhanPC(""); setFTinhTrang("");
                  setLoc(LOC_RONG);
                }}
                  className="h-[34px] px-3 border border-[#ccc] rounded-[4px] bg-white hover:bg-[#f5f5f5] text-[12px] text-[#555] transition-colors flex-shrink-0">
                  ↺
                </button>
              </div>
            </div>

            {/* Chỉ còn dải thông báo. Nút "Lưu cấu hình" ở ngoài đã bỏ: mỗi dòng
                thẩm phán tự có nút Lưu riêng khi thêm mới / sửa, nên nút chung
                không rõ nó lưu cái gì và dễ khiến người dùng tưởng chưa lưu. */}
            {thongBao && (
              <div className="mt-3 flex items-center gap-2 h-[38px] px-3 rounded-[4px] bg-[#eaf7ee] border border-[#a9debb] text-[13px] text-[#1a7a45]">
                <Check size={15} />
                <span className="flex-1">{thongBao}</span>
                <button onClick={() => setThongBao("")} className="text-[#1a7a45] hover:text-[#0d5c31] px-1">×</button>
              </div>
            )}

            {/* Bảng khai báo — chỉ 3 dữ kiện, backend tự áp tiêu chí và tính định mức */}
            <div className="mt-3 border-t border-[#e5e5e5] overflow-x-auto">
              <table className="w-full border-collapse text-[13px] min-w-[1120px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[46px]">STT</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[200px]">Họ và tên</th>
                    {/* Chức danh và Chức vụ đứng cạnh nhau: hai thứ hay bị đọc
                        nhầm là một, để liền thì so ngay được. */}
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[200px]">Chức danh</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[200px]">Chức vụ</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[240px]">Đơn vị công tác</th>
                    <th className="px-3 py-2.5 text-center font-semibold text-[#333] w-[110px]"
                      title="Thẩm phán có nằm trong diện được phân công đơn hay không">
                      Nhận phân công
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[150px]"
                      title="Số vụ đã nhận trong năm nay / tổng số vụ đã nhận từ khi công tác">
                      Đã nhận (năm / tổng)
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[180px]">Tình trạng</th>
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
                        <td className="px-3 py-2 align-top text-[#222]">{hienChucDanh(r.chucDanh)}</td>
                        <td className="px-3 py-2 align-top text-[#222]">{r.chucVu || "-"}</td>
                        <td className="px-3 py-2 align-top text-[#222]">{r.donVi || "-"}</td>
                        {/* Ô cao 32px cho thẳng hàng với các ô select cùng dòng */}
                        <td className="px-3 py-2 align-top text-center">
                          <div className="h-[32px] flex items-center justify-center">
                            <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a] cursor-pointer"
                              checked={r.thamGiaGiaiQuyet}
                              onChange={e => sua(r.id, "thamGiaGiaiQuyet")(e.target.checked)}
                              title={r.thamGiaGiaiQuyet
                                ? "Đang nhận phân công đơn — bỏ tích để dừng"
                                : "Không nhận phân công đơn"} />
                          </div>
                        </td>
                        {/* Số trong năm đứng trước, tổng lũy kế mờ hơn ở sau —
                            con số cần đọc hằng ngày là con số của năm nay. */}
                        <td className="px-3 py-2 align-top"
                          title={`${r.daNhan} vụ trong năm nay · tổng ${r.tongDaNhan} vụ từ khi công tác`}>
                          <span className="text-[13px] font-semibold text-[#222]">{r.daNhan}</span>
                          <span className="text-[12px] text-[#888]"> / {r.tongDaNhan} vụ</span>
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
                Thẩm phán trong kỳ nghỉ sẽ bị loại khỏi danh sách phân công tự động trong khoảng thời gian đó.
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
                      "Vụ đang cầm", "Xử lý vụ đang cầm", "Thao tác"].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left font-semibold text-[#333] whitespace-nowrap">{h}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {nghiPhep.length === 0 && (
                    <tr><td colSpan={9} className="px-3 py-10 text-center text-[#888]">Chưa có đăng ký nghỉ nào.</td></tr>
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
                        <td className="px-3 py-2 align-top whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setSuaNghi(n)} title="Sửa đăng ký nghỉ"
                              className="w-[26px] h-[26px] flex items-center justify-center rounded-[3px] border border-[#ddd] text-[#1a5a96] hover:bg-[#eaf4ff] hover:border-[#c5d8f8] transition-colors">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => setNghiPhep(p => p.filter(x => x.id !== n.id))} title="Xóa đăng ký nghỉ"
                              className="w-[26px] h-[26px] flex items-center justify-center rounded-[3px] border border-[#ddd] text-[#c0392b] hover:bg-[#fdecea] hover:border-[#f5b7b7] transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
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

      {/* key ép popup dựng lại khi đổi bản ghi, nếu không các ô vẫn giữ giá trị
          của lần mở trước vì state khởi tạo chỉ chạy lúc mount. */}
      {(themNghi || suaNghi) && (
        <PopupDangKyNghi
          key={suaNghi?.id ?? "moi"}
          thamPhans={rows.map(r => r.hoTen)}
          banGhi={suaNghi}
          onDong={() => { setThemNghi(false); setSuaNghi(null); }}
          onLuu={n => {
            if (suaNghi) setNghiPhep(p => p.map(x => x.id === suaNghi.id ? { ...x, ...n } : x));
            else setNghiPhep(p => [...p, { ...n, id: Date.now() }]);
            setThemNghi(false);
            setSuaNghi(null);
            setTab(1);
          }}
        />
      )}
    </div>
  );
};

const PopupDangKyNghi = ({ thamPhans, banGhi, onDong, onLuu }: {
  thamPhans: string[];
  /** Có bản ghi = đang sửa; không có = đăng ký mới. */
  banGhi?: NghiPhepRow | null;
  onDong: () => void;
  onLuu: (n: Omit<NghiPhepRow, "id">) => void;
}) => {
  // Bảng lưu "dd/mm/yyyy", <input type="date"> cần "yyyy-mm-dd"
  const veISO = (v?: string) => (v ? v.split("/").reverse().join("-") : "");
  const [thamPhan, setThamPhan] = useState(banGhi?.thamPhan ?? "");
  const [loai, setLoai] = useState(banGhi?.loai ?? LOAI_NGHI[0]);
  const [tuNgay, setTuNgay] = useState(veISO(banGhi?.tuNgay));
  const [denNgay, setDenNgay] = useState(veISO(banGhi?.denNgay));
  const [daBam, setDaBam] = useState(false);

  const vnDate = (iso: string) => iso ? iso.split("-").reverse().join("/") : "";
  const thieu = !thamPhan || !tuNgay || !denNgay;
  const saiThuTu = !!tuNgay && !!denNgay && denNgay < tuNgay;

  const luu = () => {
    setDaBam(true);
    if (thieu || saiThuTu) return;
    onLuu({
      thamPhan, loai, tuNgay: vnDate(tuNgay), denNgay: vnDate(denNgay),
      // Không còn hỏi cách xử lý vụ đang cầm khi đăng ký nghỉ. Lúc SỬA thì giữ
      // nguyên các trường popup không đụng tới, đừng xóa về mặc định.
      xuLy: banGhi?.xuLy ?? "giu-nguyen",
      chuyenCho: banGhi?.chuyenCho ?? "",
      vuDangCam: banGhi?.vuDangCam ?? 0,
      lyDo: banGhi?.lyDo ?? "",
    });
  };
  const loi = (rong: boolean) => daBam && rong;

  return (
    <div className="fixed inset-0 z-[210] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[6px] shadow-2xl w-[620px] max-w-[96vw] max-h-[94vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-[#1d2e4f] text-white flex-shrink-0">
          <span className="text-[15px] font-bold">
            {banGhi ? "Sửa đăng ký nghỉ phép / vắng mặt" : "Đăng ký nghỉ phép / vắng mặt"}
          </span>
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
const PopupInDanhSachDon = ({ rows, moTaBoLoc, onDong, nguoiIn, tieuDe = "DANH SÁCH ĐƠN", phuDe }: {
  rows: DanhSachDonRow[];
  moTaBoLoc: string[];
  onDong: () => void;
  /** Người in — lấy theo tài khoản đang đăng nhập, không nhập tay. */
  nguoiIn?: { nguoi: string; chucVu: string };
  /** Tiêu đề suy từ bộ lọc đang áp, ví dụ "DANH SÁCH ĐƠN CHƯA ĐỦ ĐIỀU KIỆN". */
  tieuDe?: string;
  phuDe?: string;
}) => {
  const homNay = new Date().toLocaleDateString("vi-VN");
  const gioIn = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const ngayKy = new Date();
  const ngayKyStr = `ngày ${ngayKy.getDate()} tháng ${ngayKy.getMonth() + 1} năm ${ngayKy.getFullYear()}`;

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
            {/* Quốc hiệu 2 cột theo thể thức văn bản hành chính — giống các biểu
                mẫu khác trong hệ thống, không dùng tiêu đề canh giữa kiểu web. */}
            <div className="grid grid-cols-2 text-[#111] mb-5">
              <div className="text-center">
                <div className="text-[13px]">TÒA ÁN NHÂN DÂN TỐI CAO</div>
                <div className="text-[13px] font-bold mt-1.5">VĂN PHÒNG</div>
                <div className="w-[95px] h-[1px] bg-black mx-auto mt-1" />
              </div>
              <div className="text-center">
                <div className="text-[13px] font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div className="text-[13px] font-bold mt-1.5">Độc lập - Tự do - Hạnh phúc</div>
                <div className="w-[185px] h-[1px] bg-black mx-auto mt-1" />
              </div>
            </div>

            {/* Tiêu đề nói đúng thứ đang in, suy từ bộ lọc — bản in rời khỏi màn
                hình thì tiêu đề là manh mối duy nhất còn lại về phạm vi dữ liệu. */}
            <div className="text-center mb-4">
              <div className="text-[17px] font-bold uppercase text-[#111] leading-snug">{tieuDe}</div>
              {phuDe && <div className="text-[13px] text-[#333] mt-1 italic">{phuDe}</div>}
            </div>

            <div className="text-[12px] text-[#333] mb-3 leading-relaxed">
              <div>
                <b>Điều kiện lọc:</b>{" "}
                {moTaBoLoc.length
                  ? moTaBoLoc.join("; ")
                  : <span className="italic text-[#666]">Không áp dụng bộ lọc — in toàn bộ danh sách.</span>}
              </div>
              <div><b>Tổng cộng:</b> {rows.length} đơn</div>
            </div>

            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f0f0f0]">
                  {/* Cột gộp đúng như màn Danh sách đơn — bản in và màn hình đọc
                      giống nhau thì đối chiếu mới nhanh. */}
                  {[["STT", "w-[34px]"], ["Thông tin người gửi / đơn vị gửi", "w-[280px]"],
                  ["Thông tin đơn", "w-[330px]"], ["Số đơn", "w-[46px]"],
                  ["Thông tin giải quyết", "w-[170px]"],
                  ["Người nhập / Sửa", "w-[150px]"]].map(([h, w]) => (
                    <th key={h} className={`border border-[#999] px-2 py-[6px] text-left font-semibold text-[#222] ${w}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="border border-[#999] px-2 py-8 text-center text-[#888]">
                      Không có đơn nào khớp bộ lọc.
                    </td>
                  </tr>
                )}
                {rows.map((r, i) => {
                  const d = r.thongTinDon ?? ({} as DanhSachDonRow["thongTinDon"]);
                  const Nhan = ({ children }: { children: React.ReactNode }) =>
                    <span className="text-[#777]">{children}</span>;
                  return (
                    <tr key={r.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                      <td className="border border-[#999] px-2 py-[5px] text-center align-top">{i + 1}</td>

                      {/* Thông tin người gửi / đơn vị gửi */}
                      <td className="border border-[#999] px-2 py-[5px] align-top leading-[1.5]">
                        <div className="font-medium">{vietTatTAND(r.nguoiDungDon || r.nguoiGui)}</div>
                        {r.diaChi && <div className="text-[11px] text-[#666]">{vietTatTAND(r.diaChi)}</div>}
                        {(r.ngayTrenDon || r.ngayNhap) && (
                          <div className="text-[11px]">
                            {r.ngayTrenDon && <><Nhan>Ngày trên đơn: </Nhan>{r.ngayTrenDon}  </>}
                            {r.ngayNhap && <><Nhan>Ngày nhận: </Nhan>{r.ngayNhap}</>}
                          </div>
                        )}
                        <div className="text-[11px]">
                          <Nhan>Mã đơn: </Nhan><b>{r.maDon.trim()}</b>
                          {r.soHieuDon && <>  <Nhan>Số hiệu: </Nhan>{r.soHieuDon}</>}
                        </div>
                        {(d.hinhThuc || r.loaiHinhThuc) && (
                          <div className="text-[11px]"><Nhan>Hình thức đơn: </Nhan>{d.hinhThuc || r.loaiHinhThuc}</div>
                        )}
                        {r.hinhThucTiepNhan && (
                          <div className="text-[11px]"><Nhan>Hình thức tiếp nhận: </Nhan>{r.hinhThucTiepNhan}</div>
                        )}
                      </td>

                      {/* Thông tin đơn */}
                      <td className="border border-[#999] px-2 py-[5px] align-top leading-[1.5] text-[11px]">
                        {(d.soBaqd || d.ngay || d.toaXetXu) && (
                          <div>
                            <Nhan>Số BA/QĐ: </Nhan>{d.soBaqd || "—"}
                            {d.ngay && <>  <Nhan>Ngày: </Nhan>{d.ngay}</>}
                            {d.toaXetXu && <>  {vietTatTAND(d.toaXetXu)}</>}
                          </div>
                        )}
                        {d.thuTuc && <div><Nhan>Thủ tục giải quyết: </Nhan>{d.thuTuc}</div>}
                        {(d.soCV || d.ngayCV) && (
                          <div>
                            {d.soCV && <><Nhan>Số CV: </Nhan>{d.soCV}  </>}
                            {d.ngayCV && <><Nhan>Ngày CV: </Nhan>{d.ngayCV}</>}
                          </div>
                        )}
                        {d.loaiCV && <div><Nhan>Loại CV: </Nhan>{d.loaiCV}</div>}
                        {d.thamPhan && (
                          <div><Nhan>Thẩm phán: </Nhan>{vietTatChucDanhTP(thamPhanGon(vietTatTAND(d.thamPhan)))}</div>
                        )}
                        {d.donViGiaiQuyet && <div><Nhan>Đã chuyển: </Nhan>{vietTatTAND(d.donViGiaiQuyet)}</div>}
                      </td>

                      <td className="border border-[#999] px-2 py-[5px] text-center align-top">{r.soDon ?? 1}</td>

                      {/* Thông tin giải quyết */}
                      <td className="border border-[#999] px-2 py-[5px] align-top leading-[1.5] text-[11px]">
                        <div className="font-medium">{r.giaiQuyet?.nhan || "Chưa có"}</div>
                        {r.giaiQuyet?.stl && <div><Nhan>Số: </Nhan>{r.giaiQuyet.stl}</div>}
                        {r.trungVoiDon && <div><Nhan>Trùng với đơn </Nhan>{r.trungVoiDon}</div>}
                      </td>

                      {/* Người nhập / Sửa */}
                      <td className="border border-[#999] px-2 py-[5px] align-top leading-[1.5] text-[11px]">
                        {r.nguoiNhap && (
                          <div>
                            <Nhan>Nhập: </Nhan><b>{r.nguoiNhap}</b>
                            <div>{r.ngayNhap}{r.gioNhap ? ` ${r.gioNhap}` : ""}</div>
                          </div>
                        )}
                        {r.nguoiSua && (
                          <div className="mt-[3px] pt-[3px] border-t border-dashed border-[#ccc]">
                            <Nhan>Sửa: </Nhan><b>{r.nguoiSua}</b>
                            <div>{r.ngaySua}{r.gioSua ? ` ${r.gioSua}` : ""}</div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Hai khối tách bạch hai vai trò khác nhau:
                  · Trái  — người IN, do hệ thống ghi nhận theo tài khoản đăng nhập
                  · Phải  — người LẬP danh sách, ký tay, có thể không phải người in */}
            <div className="flex items-start justify-between mt-8 text-[12px] text-[#222]">
              <div className="italic text-[#555] leading-relaxed">
                {nguoiIn && (
                  <>
                    <div>Người in danh sách: {nguoiIn.nguoi} — {nguoiIn.chucVu}</div>
                    <div>Thời điểm in: {homNay} {gioIn}</div>
                  </>
                )}
              </div>
              <div className="text-center w-[280px]">
                <div className="italic">Hà Nội, {ngayKyStr}</div>
                <div className="font-semibold uppercase mt-1">Người lập danh sách</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Tiếp nhận đơn liên thông (VBDH) panel ───────────────────────────────────
// Mẫu dữ liệu gói liên thông từ Văn bản điều hành — hiển thị phía trên
// danh sách đơn để cán bộ nắm được tình hình mà không cần chuyển màn.
// ─── Tiếp nhận & phân công đơn ──────────────────────────────────────────────
// ─── Tiếp nhận & phân công đơn ──────────────────────────────────────────────
type DonNguon = "VBDH" | "DVTT" | "DVC" | "BuuDien" | "TrucTiep";
type DonTrangThai = "cho-phan-cong" | "da-phan-cong" | "cho-xu-ly" | "tra-lai";

interface DonTiepNhan {
  maDon: string;
  soDen?: string;
  ngayTiepNhan: string;
  nguoiLamDon: string;
  hinhThucDon: string;
  loaiAn: string;
  canBoTiepNhan: string;
  trangThai: DonTrangThai;
  nguon: DonNguon;
  coDonLienQuan: boolean;
  donLienQuan?: { maDon: string; quanHe: string }[];
  soBA?: string;
  ngayBA?: string;
  toaBA?: string;
  ocrTrangThai?: "du-dieu-kien" | "khong-du-dieu-kien";
  ocrLyDo?: "Thiếu BA/QĐ có hiệu lực" | "Thiếu thông tin CCCD";
  canBoXuLyGanNhat?: string;
  ycbsData?: {
    nguoiDungDon: string;
    soBA: string;
    ngayBA: string;
    toaBA: string;
    canBoYeuCau: string;
  };
}

const DON_SAMPLE: DonTiepNhan[] = [
  {
    maDon: "001256", ngayTiepNhan: "19/08/2026 08:14", nguoiLamDon: "Nguyễn Văn Bình",
    hinhThucDon: "Đơn khiếu nại tố cáo trong tố tụng", loaiAn: "Hành chính", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [
      { maDon: "001025", quanHe: "Trùng số/ngày BA, QĐ" },
      { maDon: "000876", quanHe: "Trùng người đứng đơn" },
    ],
    soBA: "15/2026/HC-PT", ngayBA: "12/03/2026", toaBA: "TAND cấp cao tại Hà Nội",
    ocrTrangThai: "du-dieu-kien",
    canBoXuLyGanNhat: "Nguyễn Minh An"
  },
  {
    maDon: "DVTT-2026-00125", ngayTiepNhan: "18/08/2026 14:30", nguoiLamDon: "Trần Thị Lan",
    hinhThucDon: "Đơn đề nghị GĐT-TT", loaiAn: "Dân sự", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "DVTT", coDonLienQuan: false,
    ocrTrangThai: "khong-du-dieu-kien", ocrLyDo: "Thiếu BA/QĐ có hiệu lực"
  },
  {
    maDon: "001254", ngayTiepNhan: "18/08/2026 09:00", nguoiLamDon: "Lê Minh Tuấn",
    hinhThucDon: "Thông báo phát hiện vi phạm pháp luật", loaiAn: "Hình sự", canBoTiepNhan: "Phạm Quốc Hưng",
    trangThai: "da-phan-cong", nguon: "VBDH", coDonLienQuan: false,
    soBA: "33/2024/HS-PT", ngayBA: "15/11/2024", toaBA: "TAND cấp cao tại TP.HCM",
    ocrTrangThai: "du-dieu-kien"
  },
  {
    maDon: "DVC-2026-00312", ngayTiepNhan: "17/08/2026 15:45", nguoiLamDon: "Vũ Thu Hà",
    hinhThucDon: "Đơn đề nghị GĐT-TT", loaiAn: "Lao động", canBoTiepNhan: "Nguyễn Hải Trâm",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: true,
    donLienQuan: [{ maDon: "000921", quanHe: "Có yêu cầu bổ sung trước đó" }],
    soBA: "21/2026/LĐ-PT", ngayBA: "05/04/2026", toaBA: "TAND tỉnh Hà Nam",
    ocrTrangThai: "khong-du-dieu-kien", ocrLyDo: "Thiếu thông tin CCCD"
  },
  {
    maDon: "001250", ngayTiepNhan: "16/08/2026 10:20", nguoiLamDon: "Công ty TNHH ABC",
    hinhThucDon: "CV kiến nghị GĐT-TT", loaiAn: "Kinh doanh thương mại", canBoTiepNhan: "Phạm Quốc Hưng",
    trangThai: "tra-lai", nguon: "VBDH", coDonLienQuan: false,
    soBA: "07/2025/KDTM-PT", ngayBA: "18/12/2025", toaBA: "TAND tỉnh Quảng Ninh",
    ocrTrangThai: "du-dieu-kien"
  },
  {
    maDon: "001248", ngayTiepNhan: "15/08/2026 09:30", nguoiLamDon: "Hoàng Văn Nam",
    hinhThucDon: "CV chuyển đơn", loaiAn: "Hành chính", canBoTiepNhan: "Nguyễn Hải Trâm",
    trangThai: "cho-xu-ly", nguon: "DVTT", coDonLienQuan: false,
    soBA: "45/2025/HC-PT", ngayBA: "10/09/2025", toaBA: "TAND TP Hà Nội",
    ocrTrangThai: "khong-du-dieu-kien", ocrLyDo: "Thiếu BA/QĐ có hiệu lực"
  },
  {
    maDon: "001258", ngayTiepNhan: "19/08/2026 10:05", nguoiLamDon: "Đặng Bích Ngọc",
    hinhThucDon: "Đơn khác", loaiAn: "Dân sự", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: false,
    soBA: "12/2026/DS-PT", ngayBA: "22/01/2026", toaBA: "TAND TP HCM",
    ocrTrangThai: "du-dieu-kien"
  },
  {
    maDon: "DVC-2026-00315", ngayTiepNhan: "19/08/2026 11:20", nguoiLamDon: "Võ Quang Huy",
    hinhThucDon: "Đơn đề nghị GĐT-TT", loaiAn: "Kinh doanh thương mại", canBoTiepNhan: "Trần Văn Minh",
    trangThai: "cho-xu-ly", nguon: "DVC", coDonLienQuan: false,
    soBA: "09/2025/KDTM-PT", ngayBA: "05/05/2025", toaBA: "TAND tỉnh Thái Bình",
    ocrTrangThai: "du-dieu-kien"
  },
  {
    maDon: "001260", ngayTiepNhan: "20/08/2026 08:30", nguoiLamDon: "Nguyễn Thị Phương",
    hinhThucDon: "CV chuyển kiến nghị GĐT-TT", loaiAn: "Lao động", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001250", quanHe: "Liên quan đến đơn của công ty TNHH ABC" }],
    soBA: "56/2025/LĐ-PT", ngayBA: "11/11/2025", toaBA: "TAND cấp cao tại Đà Nẵng",
    ocrTrangThai: "khong-du-dieu-kien", ocrLyDo: "Thiếu thông tin CCCD"
  },
  {
    maDon: "001262", ngayTiepNhan: "20/08/2026 14:15", nguoiLamDon: "Lý Đức Trọng",
    hinhThucDon: "Tài liệu chứng cứ", loaiAn: "Hình sự", canBoTiepNhan: "Lê Thị Hoa",
    trangThai: "da-phan-cong", nguon: "DVTT", coDonLienQuan: true,
    donLienQuan: [{ maDon: "001254", quanHe: "Tài liệu bổ sung cho vụ Lê Minh Tuấn" }],
    soBA: "19/2026/HS-PT", ngayBA: "15/05/2026", toaBA: "TAND tỉnh Hải Dương",
    ocrTrangThai: "du-dieu-kien"
  },
  {
    maDon: "001263", ngayTiepNhan: "21/08/2026 09:00", nguoiLamDon: "Đỗ Mai Anh",
    hinhThucDon: "Đơn khiếu nại tố cáo trong tố tụng", loaiAn: "Dân sự", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "VBDH", coDonLienQuan: false,
    soBA: "11/2026/DS-PT", ngayBA: "10/01/2026", toaBA: "TAND TP HCM",
    ocrTrangThai: "du-dieu-kien",
    ycbsData: {
      nguoiDungDon: "Đỗ Mai Anh",
      soBA: "11/2026/DS-PT",
      ngayBA: "10/01/2026",
      toaBA: "TAND TP HCM",
      canBoYeuCau: "Nguyễn Hải Trâm"
    }
  },
  {
    maDon: "001264", ngayTiepNhan: "21/08/2026 09:30", nguoiLamDon: "Lê Văn Hùng",
    hinhThucDon: "CV chuyển đơn", loaiAn: "Hành chính", canBoTiepNhan: "Chưa phân công",
    trangThai: "cho-phan-cong", nguon: "DVTT", coDonLienQuan: false,
    soBA: "12/2026/HC-PT", ngayBA: "15/02/2026", toaBA: "TAND cấp cao tại Hà Nội",
    ocrTrangThai: "du-dieu-kien",
    ycbsData: {
      nguoiDungDon: "Lê Văn Hùng",
      soBA: "12/2026/HC-PT",
      ngayBA: "15/02/2026",
      toaBA: "TAND cấp cao tại Hà Nội",
      canBoYeuCau: "Lê Thị Hoa"
    }
  }
];

const TRANG_THAI_META: Record<DonTrangThai, { label: string; cls: string }> = {
  "cho-phan-cong": { label: "Chờ phân công", cls: "bg-[#fff4db] text-[#8b5e00] border-[#f5c842]" },
  "da-phan-cong": { label: "Đã phân công", cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#a9c9f4]" },
  "cho-xu-ly": { label: "Chờ xử lý", cls: "bg-[#e8f5e9] text-[#1b5e20] border-[#81c784]" },
  "tra-lai": { label: "Trả lại", cls: "bg-[#fdecea] text-[#8b1a1a] border-[#f5a3a3]" },
};

const NGUON_META_LT: Record<DonNguon, { label: string; cls: string }> = {
  VBDH: { label: "Hệ thống văn bản điều hành", cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]" },
  DVTT: { label: "Cổng dịch vụ tư pháp", cls: "bg-[#fce8e8] text-[#c92a2a] border-[#f8caca]" },
  DVC: { label: "Cổng DVC Quốc gia", cls: "bg-[#e6f4ea] text-[#1e8e3e] border-[#cce8d6]" },
  BuuDien: { label: "Đường bưu điện", cls: "bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]" },
  TrucTiep: { label: "Nộp trực tiếp", cls: "bg-[#f3e5f5] text-[#4a148c] border-[#e1bee7]" },
};

const CAN_BO_LIST_LT = ["Phạm Quốc Hưng", "Nguyễn Hải Trâm", "Trần Văn Minh", "Lê Thị Hoa"];

const PanelLienThong = ({ onChiTiet, currentRole = "can-bo" }: { onChiTiet?: (don: DonTiepNhan) => void, currentRole?: string }) => {
  const isTruongPhong = currentRole === "truong-phong";
  type TabKey = "tat-ca" | DonTrangThai;
  const [activeTab, setActiveTab] = useState<TabKey>("tat-ca");
  const [rows, setRows] = useState(DON_SAMPLE);
  const [showDanhSachCanBo, setShowDanhSachCanBo] = useState(false);
  const [selectedCanBoPopup, setSelectedCanBoPopup] = useState(CAN_BO_LIST_LT[0]);

  const assignmentCounts = rows.reduce((acc, r) => {
    if (r.canBoTiepNhan && r.canBoTiepNhan !== "Chưa phân công" && r.trangThai !== "tra-lai") {
      acc[r.canBoTiepNhan] = (acc[r.canBoTiepNhan] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  // Advanced filter state
  const [fNguon, setFNguon] = useState("");
  const [fNgayTu, setFNgayTu] = useState("");
  const [fNgayDen, setFNgayDen] = useState("");
  const [fNguoiDon, setFNguoiDon] = useState("");
  const [fHinhThuc, setFHinhThuc] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fCanBo, setFCanBo] = useState("");
  const [fTrangThai, setFTrangThai] = useState("");

  // Popup state
  const [donLienQuanPopup, setDonLienQuanPopup] = useState<DonTiepNhan | null>(null);
  const [phanCongAutoPopup, setPhanCongAutoPopup] = useState<DonTiepNhan | null>(null);
  const [phanCongChiDinhPopup, setPhanCongChiDinhPopup] = useState<DonTiepNhan | null>(null);
  const [thayDoiPopup, setThayDoiPopup] = useState<DonTiepNhan | null>(null);
  const [traLaiPopup, setTraLaiPopup] = useState<DonTiepNhan | null>(null);
  const [traLaiLyDo, setTraLaiLyDo] = useState("");
  const [traLaiGhiChu, setTraLaiGhiChu] = useState("");
  const [chonCanBo, setChonCanBo] = useState("");
  const [phanCongResult] = useState({ canBo: "Nguyễn Hải Trâm", tyLe: "18%", uuTien: "Có BA/QĐ liên quan đã được cán bộ xử lý" });
  
  const [filterYCBS, setFilterYCBS] = useState<"tat-ca" | "ycbs">("tat-ca");
  const [phanCongBlockPopup, setPhanCongBlockPopup] = useState(false);
  const [selectedCanBoBlock, setSelectedCanBoBlock] = useState<Set<string>>(new Set(CAN_BO_LIST_LT));

  const handleBlockAssignment = () => {
    if (selectedIds.size === 0) {
      alert("Vui lòng chọn ít nhất một đơn để phân công");
      return;
    }
    const selectedList = Array.from(selectedCanBoBlock);
    if (selectedList.length === 0) {
      alert("Vui lòng chọn ít nhất một cán bộ để phân bổ");
      return;
    }
    
    const targets = Array.from(selectedIds);
    let unitsToProcess = rows.filter(r => targets.includes(r.maDon));
    const updatedRows = [...rows];
    
    // 1. Phân bổ các đơn có YCBS trước
    unitsToProcess = unitsToProcess.map(don => {
      if (don.ycbsData) {
        // Kiểm tra khớp dữ liệu
        const match = don.nguoiLamDon === don.ycbsData.nguoiDungDon && 
                      don.soBA === don.ycbsData.soBA &&
                      don.ngayBA === don.ycbsData.ngayBA &&
                      don.toaBA === don.ycbsData.toaBA;
        if (match && selectedList.includes(don.ycbsData.canBoYeuCau)) {
          // Gán cho cán bộ yêu cầu
          const idx = updatedRows.findIndex(r => r.maDon === don.maDon);
          if (idx !== -1) {
            updatedRows[idx] = { ...updatedRows[idx], canBoTiepNhan: don.ycbsData.canBoYeuCau, trangThai: "da-phan-cong" };
          }
          return null;
        }
      }
      return don;
    }).filter(Boolean) as DonTiepNhan[];
    
    // 2. Phân bổ block cho các đơn còn lại
    // Sort theo mã đơn tăng dần
    unitsToProcess.sort((a, b) => a.maDon.localeCompare(b.maDon));
    
    const totalRemaining = unitsToProcess.length;
    if (totalRemaining > 0) {
      const chunkSize = Math.ceil(totalRemaining / selectedList.length);
      let currentOfficerIdx = 0;
      let currentChunkCount = 0;
      
      for (const don of unitsToProcess) {
        const canBo = selectedList[currentOfficerIdx];
        const idx = updatedRows.findIndex(r => r.maDon === don.maDon);
        if (idx !== -1) {
          updatedRows[idx] = { ...updatedRows[idx], canBoTiepNhan: canBo, trangThai: "da-phan-cong" };
        }
        
        currentChunkCount++;
        if (currentChunkCount >= chunkSize) {
          currentOfficerIdx++;
          currentChunkCount = 0;
          if (currentOfficerIdx >= selectedList.length) {
             // Safe guard, though Math.ceil should prevent overflow
             currentOfficerIdx = selectedList.length - 1;
          }
        }
      }
    }
    
    setRows(updatedRows);
    setSelectedIds(new Set());
    setPhanCongBlockPopup(false);
  };


  const counts = useMemo(() => ({
    "tat-ca": DON_SAMPLE.length,
    "cho-phan-cong": DON_SAMPLE.filter(d => d.trangThai === "cho-phan-cong").length,
    "da-phan-cong": DON_SAMPLE.filter(d => d.trangThai === "da-phan-cong").length,
    "cho-xu-ly": DON_SAMPLE.filter(d => d.trangThai === "cho-xu-ly").length,
    "tra-lai": DON_SAMPLE.filter(d => d.trangThai === "tra-lai").length,
  }), [refreshKey]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "tat-ca", label: `Tất cả (${counts["tat-ca"]})` },
    { key: "cho-phan-cong", label: `Chờ phân công (${counts["cho-phan-cong"]})` },
    { key: "da-phan-cong", label: `Đã phân công (${counts["da-phan-cong"]})` },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(d => {
      if (activeTab !== "tat-ca" && d.trangThai !== activeTab) return false;
      
      // Lọc YCBS
      if (filterYCBS === "ycbs" && !d.ycbsData) return false;

      if (fNguon && d.nguon !== fNguon) return false;
      if (fHinhThuc && d.hinhThucDon !== fHinhThuc) return false;
      if (fLoaiAn && d.loaiAn !== fLoaiAn) return false;
      if (fCanBo && d.canBoTiepNhan !== fCanBo) return false;
      if (fTrangThai && d.trangThai !== fTrangThai) return false;
      if (fNguoiDon && !d.nguoiLamDon.toLowerCase().includes(fNguoiDon.toLowerCase())) return false;
      if (q && ![d.maDon, d.nguoiLamDon, d.canBoTiepNhan].some(s => s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, activeTab, search, fNguon, fHinhThuc, fLoaiAn, fCanBo, fTrangThai, fNguoiDon, refreshKey, filterYCBS]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(d => d.maDon)));
  };

  const resetAdvanced = () => {
    setFNguon(""); setFNgayTu(""); setFNgayDen(""); setFNguoiDon("");
    setFHinhThuc(""); setFLoaiAn(""); setFCanBo(""); setFTrangThai("");
  };

  return (
    <div className="bg-white border border-[#ddd] rounded-[3px] overflow-hidden">
      {/* Popup: đơn liên quan */}
      {donLienQuanPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setDonLienQuanPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[480px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Đơn liên quan</div>
              <button onClick={() => setDonLienQuanPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-[#eee]">
                    {["Đơn", "Quan hệ"].map(h => <th key={h} className="text-left px-2 py-2 text-[11px] font-semibold text-[#555] bg-[#fafafa]">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(donLienQuanPopup.donLienQuan ?? []).map(dl => (
                    <tr key={dl.maDon} className="border-b border-[#f0f0f0] hover:bg-[#faf6f6]">
                      <td className="px-2 py-2 font-semibold text-[#1a5a96] cursor-pointer hover:underline">{dl.maDon}</td>
                      <td className="px-2 py-2 text-[#555]">{dl.quanHe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Popup: phân công tự động */}
      {phanCongAutoPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setPhanCongAutoPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[420px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Kết quả phân công</div>
              <button onClick={() => setPhanCongAutoPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-[#888]">Đơn:</div><div className="font-semibold text-[#1d2e4f]">{phanCongAutoPopup.maDon}</div>
                <div className="text-[#888]">Cán bộ được phân công:</div><div className="font-semibold text-[#1d2e4f]">{phanCongResult.canBo}</div>
                <div className="text-[#888]">Tỷ lệ phân công hiện tại:</div><div className="font-semibold text-[#1d2e4f]">{phanCongResult.tyLe}</div>
              </div>
              <div className="px-3 py-2 bg-[#fffbf0] border border-[#f5c842] rounded-[3px] text-[11px] text-[#7a5e00]">
                Ưu tiên: {phanCongResult.uuTien}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setPhanCongAutoPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hủy</button>
                <button onClick={() => {
                  setRows(prev => prev.map(r => selectedIds.has(r.maDon) ? { ...r, canBoTiepNhan: "Phạm Quốc Hưng", trangThai: "da-phan-cong" } : r));
                  setSelectedIds(new Set());
                  setPhanCongAutoPopup(null);
                }} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">Xác nhận phân công</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: phân công chỉ định */}
      {phanCongChiDinhPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setPhanCongChiDinhPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[380px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Chọn cán bộ tiếp nhận</div>
              <button onClick={() => setPhanCongChiDinhPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">Cán bộ HCTP</div>
                <select value={chonCanBo} onChange={e => setChonCanBo(e.target.value)}
                  className="w-full h-[30px] px-2 border border-[#ddd] rounded-[3px] text-[12px] focus:outline-none focus:border-[#8b1a1a]">
                  <option value="">— Chọn cán bộ HCTP —</option>
                  {CAN_BO_LIST_LT.map(cb => <option key={cb} value={cb}>{cb} (Đang xử lý: {assignmentCounts[cb] || 0})</option>)}
                </select>
              </div>
              <div className="px-3 py-2 bg-[#f5f5f5] border border-[#eee] rounded-[3px] text-[11px] text-[#555]">
                Tỷ lệ phân công hiện tại: Phạm Quốc Hưng 22% | Nguyễn Hải Trâm 18% | Trần Văn Minh 32% | Lê Thị Hoa 28%
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setPhanCongChiDinhPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hủy</button>
                <button onClick={() => setPhanCongChiDinhPopup(null)} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: thay đổi phân công */}
      {thayDoiPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setThayDoiPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[380px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Thay đổi phân công</div>
              <button onClick={() => setThayDoiPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div className="text-[#555]">Cán bộ hiện tại: <span className="font-semibold text-[#1d2e4f]">{thayDoiPopup.canBoTiepNhan}</span></div>
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">Cán bộ mới</div>
                <select value={chonCanBo} onChange={e => setChonCanBo(e.target.value)}
                  className="w-full h-[30px] px-2 border border-[#ddd] rounded-[3px] text-[12px] focus:outline-none focus:border-[#8b1a1a]">
                  <option value="">— Chọn cán bộ HCTP —</option>
                  {CAN_BO_LIST_LT.map(cb => <option key={cb} value={cb}>{cb} (Đang xử lý: {assignmentCounts[cb] || 0})</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setThayDoiPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hủy</button>
                <button onClick={() => setThayDoiPopup(null)} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: Phân bổ hàng loạt theo block */}
      {phanCongBlockPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setPhanCongBlockPopup(false)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[450px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Cấu hình phân công tự động</div>
              <button onClick={() => setPhanCongBlockPopup(false)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4 space-y-4 text-[12px]">
              <div>
                <div className="text-[12.5px] font-semibold text-[#333] mb-2">Chọn cán bộ tham gia phân bổ:</div>
                <div className="space-y-2 border border-[#eee] rounded-[3px] p-3 bg-[#fafafa] max-h-[150px] overflow-y-auto">
                  {CAN_BO_LIST_LT.map(cb => (
                    <label key={cb} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCanBoBlock.has(cb)}
                        onChange={(e) => {
                          const next = new Set(selectedCanBoBlock);
                          if (e.target.checked) next.add(cb);
                          else next.delete(cb);
                          setSelectedCanBoBlock(next);
                        }}
                        className="w-[14px] h-[14px] accent-[#8b1a1a]"
                      />
                      <span className="text-[#333]">{cb}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="text-[#555] italic">
                Hệ thống sẽ tự động ưu tiên gán lại cho cán bộ yêu cầu bổ sung nếu khớp thông tin. Số đơn còn lại sẽ được chia đều theo số đến tăng dần cho các cán bộ đã chọn.
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#eee]">
                <button onClick={() => setPhanCongBlockPopup(false)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hủy</button>
                <button onClick={handleBlockAssignment} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">Xác nhận phân bổ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup: trả lại */}
      {traLaiPopup && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setTraLaiPopup(null)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[440px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Trả lại đơn</div>
              <button onClick={() => setTraLaiPopup(null)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">Lý do trả lại <span className="text-[#8b1a1a]">*</span></div>
                <select value={traLaiLyDo} onChange={e => setTraLaiLyDo(e.target.value)}
                  className="w-full h-[30px] px-2 border border-[#ddd] rounded-[3px] text-[12px] focus:outline-none focus:border-[#8b1a1a]">
                  <option value="">— Chọn lý do —</option>
                  <option>Nhiều đơn khác bản án trong cùng bì – yêu cầu Văn thư tách đơn</option>
                  <option>Thiếu hồ sơ, tài liệu đính kèm</option>
                  <option>Không thuộc thẩm quyền giải quyết</option>
                  <option>Lý do khác</option>
                </select>
              </div>
              <div>
                <div className="text-[10.5px] text-[#888] mb-1">Ghi chú</div>
                <textarea value={traLaiGhiChu} onChange={e => setTraLaiGhiChu(e.target.value)}
                  placeholder="Nhập nội dung..."
                  className="w-full text-[12px] px-2 py-1.5 border border-[#ddd] rounded-[3px] focus:outline-none focus:border-[#8b1a1a] resize-none h-[64px]" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setTraLaiPopup(null)} className="h-[28px] px-4 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5]">Hủy</button>
                <button onClick={() => setTraLaiPopup(null)} className="h-[28px] px-4 bg-[#8b1a1a] text-white rounded-[3px] text-[11.5px] hover:bg-[#7a1616]">Xác nhận trả lại</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eee] bg-[#fafafa]">
        <div>
          <div className="text-[11px] text-[#888] mb-0.5">Quản lý đơn / <span className="font-medium text-[#555]">Tiếp nhận & phân công đơn</span></div>
          <div className="text-[15px] font-bold text-[#1d2e4f]">Tiếp nhận & phân công đơn</div>
        </div>
        <div className="flex items-center gap-2">
          {isTruongPhong && (
            <button onClick={() => setShowDanhSachCanBo(true)}
              className="h-[28px] px-3 border border-[#1a5a96] text-[#1a5a96] bg-white rounded-[3px] text-[11.5px] font-medium hover:bg-[#f0f6ff] transition-colors">
              Danh sách cán bộ
            </button>
          )}

          <button onClick={() => setRefreshKey(k => k + 1)}
            className="h-[28px] px-3 border border-[#ddd] bg-white text-[#555] rounded-[3px] text-[11.5px] hover:bg-[#f5f5f5] transition-colors flex items-center gap-1.5">
            <RefreshCw size={11} /> Làm mới
          </button>
        </div>
      </div>

      {showDanhSachCanBo && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShowDanhSachCanBo(false)}>
          <div className="bg-white rounded-[4px] border border-[#ddd] w-[400px] max-h-[80vh] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between bg-[#fcfcfc] shrink-0">
              <div className="text-[13px] font-bold text-[#1d2e4f]">Danh sách cán bộ tiếp nhận</div>
              <button onClick={() => setShowDanhSachCanBo(false)} className="text-[#aaa] hover:text-[#333] text-[16px]">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                    <th className="px-3 py-2 text-left font-semibold text-[#555]">Cán bộ</th>
                    <th className="px-3 py-2 text-right font-semibold text-[#555] w-[80px]">Số đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {CAN_BO_LIST_LT.map(cb => {
                    const count = assignmentCounts[cb] || 0;
                    return (
                      <tr key={cb} className="border-b border-[#eee] hover:bg-[#fafafa]">
                        <td className="px-3 py-2.5 text-[#333] font-medium">{cb}</td>
                        <td className="px-3 py-2.5 text-right">
                          <span className={`inline-block min-w-[32px] text-center px-1.5 py-0.5 rounded-[3px] text-[11px] font-bold ${count > 0 ? 'bg-[#1a5a96] text-white' : 'bg-[#e0e0e0] text-[#555]'}`}>
                            {count}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* Tabs */}
      <div className="flex items-end border-b border-[#ddd] px-4 pt-0.5 gap-0 bg-white">
        {tabs.filter(t => isTruongPhong || (t.key !== "tat-ca" && t.key !== "cho-phan-cong" && t.key !== "da-phan-cong")).map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedIds(new Set()); }}
            className={`px-3.5 py-[8px] text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${activeTab === t.key
                ? "border-[#8b1a1a] text-[#8b1a1a]"
                : "border-transparent text-[#555] hover:text-[#222]"
              }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="px-4 py-2.5 border-b border-[#eee] bg-[#fafafa]">
        <div className="flex items-center gap-5 mb-3">
          {[["tat-ca", "Tất cả"], ["ycbs", "Đơn đã có yêu cầu bổ sung"]].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer text-[13px]">
              <input type="radio" name="filterYCBS" className="accent-[#8b1a1a]"
                checked={filterYCBS === val} onChange={() => { setFilterYCBS(val as any); setSelectedIds(new Set()); }} />
              <span className={filterYCBS === val ? "font-semibold text-[#8b1a1a]" : "text-[#444]"}>{label}</span>
            </label>
          ))}
        </div>
        <div className="grid gap-x-3 gap-y-2.5 mb-3" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
          {[
            { label: "Từ khóa tìm kiếm chung", el: <input value={search} onChange={e => setSearch(e.target.value)} className="w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors border-[#ccc] bg-white" placeholder="Số đến, mã đơn..." />, advanced: false },
            { label: "Hình thức đơn", el: <select value={fHinhThuc} onChange={e => setFHinhThuc(e.target.value)} className="w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors border-[#ccc] bg-white"><option value="">Tất cả</option><optgroup label="— Đơn"><option value="Đơn đề nghị GĐT-TT">1. Đơn đề nghị GĐT-TT</option><option value="Đơn khiếu nại tố cáo trong tố tụng">2. Đơn khiếu nại tố cáo trong tố tụng</option><option value="Thông báo phát hiện vi phạm pháp luật">3. Thông báo phát hiện vi phạm pháp luật</option><option value="Đơn khác">4. Đơn khác</option></optgroup><optgroup label="— Công văn"><option value="CV kiến nghị GĐT-TT">1. CV kiến nghị GĐT-TT</option><option value="CV chuyển đơn">2. CV chuyển đơn</option><option value="CV chuyển kiến nghị GĐT-TT">3. CV chuyển kiến nghị GĐT-TT</option><option value="CV khác">4. CV khác</option></optgroup><optgroup label="— Tài liệu"><option value="Tài liệu chứng cứ">Tài liệu chứng cứ</option></optgroup></select>, advanced: true },
            { label: "Loại án", el: <select value={fLoaiAn} onChange={e => setFLoaiAn(e.target.value)} className="w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors border-[#ccc] bg-white"><option value="">Tất cả</option><option>Hành chính</option><option>Dân sự</option><option>Hình sự</option><option>Lao động</option><option>Kinh doanh thương mại</option></select>, advanced: true },
            { label: "Nguồn tiếp nhận", el: <select value={fNguon} onChange={e => setFNguon(e.target.value)} className="w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors border-[#ccc] bg-white"><option value="">Tất cả</option><option value="VBDH">Hệ thống văn bản điều hành</option><option value="DVTT">Cổng dịch vụ tư pháp</option><option value="DVC">Cổng DVC Quốc gia</option><option value="BuuDien">Đường bưu điện</option><option value="TrucTiep">Nộp trực tiếp</option></select>, advanced: true },
            { label: "Trạng thái", el: <select value={fTrangThai} onChange={e => setFTrangThai(e.target.value)} className="w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors border-[#ccc] bg-white"><option value="">Tất cả</option><option value="cho-phan-cong">Chờ phân công</option><option value="da-phan-cong">Đã phân công</option></select>, advanced: true },
            { label: "Cán bộ tiếp nhận", el: <select value={fCanBo} onChange={e => setFCanBo(e.target.value)} className="w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors border-[#ccc] bg-white"><option value="">Tất cả</option>{CAN_BO_LIST_LT.map(cb => <option key={cb} value={cb}>{cb}</option>)}</select>, advanced: true },
            { label: "Người đứng đơn", el: <input value={fNguoiDon} onChange={e => setFNguoiDon(e.target.value)} className="w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors border-[#ccc] bg-white" placeholder="Nhập tên..." />, advanced: true },
            { label: "Ngày tiếp nhận từ", el: <input type="date" value={fNgayTu} onChange={e => setFNgayTu(e.target.value)} className="w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors border-[#ccc] bg-white" />, advanced: true },
            { label: "Đến ngày", el: <input type="date" value={fNgayDen} onChange={e => setFNgayDen(e.target.value)} className="w-full h-[26px] px-2 text-[12px] border rounded-[2px] focus:outline-none focus:border-[#1a73e8] placeholder:text-[#bbb] transition-colors border-[#ccc] bg-white" />, advanced: true },
          ].filter(item => !item.advanced || showAdvanced).map(({ label, el }) => (
            <div key={label} className="min-w-0 overflow-hidden" style={{ gridColumn: (!showAdvanced && label === "Từ khóa tìm kiếm chung") ? 'span 2' : 'span 1' }}>
              <div className="text-[11px] font-semibold text-[#1a5a96] mb-0.5 truncate">{label}</div>
              {el}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => setShowAdvanced(v => !v)}
            className="flex items-center gap-1 text-[12px] text-[#1a5a96] hover:underline">
            <ChevronDown size={13} className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            {showAdvanced ? "Thu gọn" : "Mở rộng"}
          </button>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 h-[32px] px-5 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors">
              <Search size={13} /> Tìm kiếm
            </button>
            <button onClick={() => { setSearch(""); resetAdvanced(); }}
              className="flex items-center gap-1.5 h-[32px] px-4 border border-[#ccc] rounded-[3px] bg-white hover:bg-[#f5f5f5] text-[12px] text-[#555] transition-colors">
              <RotateCcw size={13} /> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {isTruongPhong && (activeTab === "cho-phan-cong" || activeTab === "da-phan-cong") && (
        <div className="flex items-center justify-end px-3 pb-2 pt-2 border-b border-[#ddd] bg-white">
          <div className="flex items-center gap-2">
            <button onClick={() => {
              if (selectedIds.size === 0) { alert("Vui lòng chọn ít nhất một đơn để phân công"); return; }
              setPhanCongBlockPopup(true);
            }} className="h-[26px] px-3 border border-[#1a5a96] text-[#1a5a96] bg-white hover:bg-[#f0f6ff] transition-colors rounded-[3px] text-[11.5px] font-medium">
              Phân công tự động
            </button>

            <select
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                if (selectedIds.size === 0) { alert("Vui lòng chọn ít nhất một đơn để phân công"); return; }
                setRows(prev => prev.map(r => selectedIds.has(r.maDon) ? {
                  ...r,
                  canBoTiepNhan: val,
                  trangThai: "da-phan-cong"
                } : r));
                setSelectedIds(new Set());
              }}
              className="w-[180px] h-[26px] px-2 border border-[#1a5a96] text-[#1a5a96] bg-white rounded-[3px] text-[11.5px] font-medium focus:outline-none cursor-pointer"
            >
              <option value="" disabled hidden>Phân công chỉ định...</option>
              {CAN_BO_LIST_LT.map(cb => {
                const count = assignmentCounts[cb] || 0;
                return <option key={cb} value={cb}>{cb} (Đang xử lý: {count})</option>
              })}
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
              <th className="px-2.5 py-2 w-[32px]">
                <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll} className="cursor-pointer" />
              </th>
              {[
                { label: "STT", cls: "w-[40px] text-center" },
                { label: "Nguồn", cls: "w-[120px]" },
                { label: "Mã đơn", cls: "w-[90px]" },
                { label: "Ngày tiếp nhận", cls: "w-[105px]" },
                { label: "Thông tin người gửi", cls: "w-[180px]" },
                { label: "Thông tin đơn", cls: "w-[240px]" },
                { label: "Cán bộ tiếp nhận", cls: "w-[140px]" },
                { label: "Trạng thái (gợi ý)", cls: "w-[110px]" },
                { label: "Thao tác", cls: "w-[75px] text-center" }
              ].map(h => (
                <th key={h.label} className={`px-2.5 py-2 text-[11px] font-semibold text-[#555] whitespace-nowrap ${h.cls.includes('text-center') ? h.cls : 'text-left ' + h.cls}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} className="px-3 py-8 text-center text-[#aaa] italic text-[12px]">Không có đơn nào phù hợp.</td></tr>
            ) : filtered.map((don, idx) => {
              const sm = TRANG_THAI_META[don.trangThai];
              const nm = NGUON_META_LT[don.nguon];
              return (
                <tr key={don.maDon} className="border-b border-[#f0f0f0] hover:bg-[#faf6f6]" onDoubleClick={() => onChiTiet?.(don)} title="Kích đúp để xem chi tiết">
                  <td className="px-2.5 py-2.5 text-center">
                    <input type="checkbox" checked={selectedIds.has(don.maDon)} onChange={() => toggleSelect(don.maDon)} className="cursor-pointer" />
                  </td>
                  <td className="px-2.5 py-2.5 text-center font-medium text-[#555]">{idx + 1}</td>
                  <td className="px-2.5 py-2.5">
                    <span className={`inline-flex items-center px-1.5 py-[1px] rounded border text-[10.5px] font-medium ${nm.cls}`}>{nm.label}</span>
                  </td>
                  <td className="px-2.5 py-2.5">
                    <div className="font-semibold text-[#1a5a96]">{don.maDon}</div>
                  </td>
                  <td className="px-2.5 py-2.5 whitespace-nowrap text-[#555]">{don.ngayTiepNhan}</td>
                  <td className="px-2.5 py-2.5">
                    <div className="font-semibold text-[#1d2e4f] leading-snug">{don.nguoiLamDon}</div>
                    <div className="text-[11px] text-[#555] mt-0.5 leading-snug">
                      {don.hinhThucDon}
                    </div>
                    <div className="mt-[3px]">
                      <span className="inline-block px-1.5 py-[2px] rounded text-[10px] font-medium bg-[#e8f0fe] text-[#1a5a96] border border-[#c5d8f8]">
                        {don.loaiAn}
                      </span>
                    </div>
                  </td>
                  <td className="px-2.5 py-2.5">
                    {don.soBA ? (
                      <div className="space-y-[2px] leading-snug text-[11px]">
                        <div><span className="text-[#888]">Số BA: </span><span className="font-medium text-[#333]">{don.soBA}</span></div>
                        <div><span className="text-[#888]">Ngày: </span><span className="text-[#333]">{don.ngayBA}</span></div>
                        <div><span className="text-[#888]">Tòa ra BA: </span><span className="text-[#333]">{don.toaBA}</span></div>
                        {don.coDonLienQuan && don.canBoXuLyGanNhat && (
                          <div className="mt-[2px]"><span className="text-[#1a7a45] font-medium">CB xử lý gần nhất: {don.canBoXuLyGanNhat}</span></div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#999] italic text-[11px]">Không có</span>
                    )}
                  </td>
                  <td className="px-2.5 py-2.5 whitespace-nowrap">
                    {isTruongPhong && (don.trangThai === "cho-phan-cong" || don.trangThai === "da-phan-cong" || don.trangThai === "cho-xu-ly") ? (
                      <select
                        value={don.canBoTiepNhan === "Chưa phân công" ? "" : don.canBoTiepNhan}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRows(prev => prev.map(r => r.maDon === don.maDon ? {
                            ...r,
                            canBoTiepNhan: val || "Chưa phân công",
                            trangThai: val ? "da-phan-cong" : "cho-phan-cong"
                          } : r));
                        }}
                        className="w-[140px] h-[26px] px-1 border border-[#ddd] rounded-[3px] text-[11px] focus:outline-none focus:border-[#8b1a1a]"
                      >
                        <option value="">-- Chưa phân công --</option>
                        {CAN_BO_LIST_LT.map(cb => {
                          const count = assignmentCounts[cb] || 0;
                          return <option key={cb} value={cb}>{cb} ({count})</option>
                        })}
                      </select>
                    ) : (
                      <span className={don.canBoTiepNhan === "Chưa phân công" ? "text-[#aaa] italic text-[11.5px]" : "text-[#333]"}>
                        {don.canBoTiepNhan}
                      </span>
                    )}
                  </td>
                  <td className="px-2.5 py-2.5">
                    <div className="flex flex-col gap-1.5">

                      {don.ocrTrangThai && (
                        <span className={`inline-flex items-center px-1.5 py-[2px] w-fit rounded border text-[10px] font-medium leading-snug whitespace-nowrap ${
                          don.ocrTrangThai === "du-dieu-kien" ? "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]" : "bg-[#fdecea] text-[#8b1a1a] border-[#f5c2c7]"
                        }`} title="Dự đoán tự động từ hệ thống">
                          {don.ocrTrangThai === "du-dieu-kien" ? "Đủ điều kiện" : "Không đủ điều kiện"}
                        </span>
                      )}
                      {don.ocrTrangThai === "khong-du-dieu-kien" && don.ocrLyDo && (
                        <div className="text-[10px] text-[#8b1a1a] leading-tight max-w-[120px]">
                          Lý do: {don.ocrLyDo}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-2.5 py-2.5">
                    <div className="flex items-center gap-1.5 justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onChiTiet?.(don); }}
                        title="Chi tiết"
                        className="w-[24px] h-[24px] flex items-center justify-center border border-[#ddd] bg-white text-[#555] hover:text-[#1a5a96] hover:border-[#1a5a96] hover:bg-[#f0f6ff] rounded-[3px] transition-colors">
                        <Eye size={13} />
                      </button>
                      {don.trangThai !== "tra-lai" && (
                        <button onClick={(e) => { e.stopPropagation(); setTraLaiPopup(don); }}
                          title="Trả lại"
                          className="w-[24px] h-[24px] flex items-center justify-center border border-[#ddd] bg-white text-[#8b1a1a] hover:bg-[#fdeaea] rounded-[3px] transition-colors">
                          <CornerUpLeft size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#eee] bg-[#fafafa]">
        <span className="text-[11.5px] text-[#888]">
          Hiển thị <b className="text-[#333]">{filtered.length}</b> / {rows.length} đơn
          {selectedIds.size > 0 && <span className="ml-2 text-[#8b1a1a]">— Đã chọn {selectedIds.size}</span>}
        </span>
      </div>
    </div>
  );
};

// ─── DanhSachDon screen ───────────────────────────────────────────────────────
const DanhSachDon = ({ onThemMoi, onBieuMau, onWordEditor, onEditRow, isTruongPhong, currentRole = "can-bo", onCreateToTrinh, onTaoVanBan, onXemVanBanDaTrinh, vanBanList, khangNghi, initialTab = 0, initialQuaHanOnly = false }: {
  onThemMoi: () => void; onBieuMau?: (row: typeof SAMPLE_ROWS[0], vbId?: string) => void; onWordEditor?: () => void; onEditRow?: (id: number) => void; isTruongPhong?: boolean;
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
  onCreateToTrinh?: (t: ToTrinh) => void;
  /** Popup "Tạo văn bản & trình ký" trả kết quả lên App để đẩy vào kho chung. */
  onTaoVanBan?: (kq: KetQuaTrinhDuyet) => void;
  /** Bấm "Xem văn bản đã trình" — sang màn Danh sách văn bản, lọc theo mã đơn
   *  (chuỗi rỗng nghĩa là trình nhiều đơn, không lọc theo mã nào). */
  onXemVanBanDaTrinh?: (maDon: string) => void;
  /** Kho văn bản dùng chung — để biết đơn nào đã nằm trong tờ trình nào. */
  vanBanList?: VanBanTrinh[];
  khangNghi?: boolean;   // dùng lại nguyên màn Danh sách đơn cho Hồ sơ kháng nghị
  /** Tab mở sẵn khi vào màn — dùng khi điều hướng từ Trang chủ (panel "Phân loại đơn nhận"). */
  initialTab?: number;
  /** Bật sẵn bộ lọc "Quá hạn giải quyết" — dùng khi điều hướng từ Trang chủ
   *  (card "Đơn quá hạn giải quyết"), luôn đi kèm initialTab=0. */
  initialQuaHanOnly?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [fQuaHanOnly, setFQuaHanOnly] = useState(initialQuaHanOnly ?? false);
  const [showNumberingModal, setShowNumberingModal] = useState<number | null>(null);
  // Mở thẳng modal Lưu số văn bản ở loại "Yêu cầu bổ sung" cho đúng một đơn
  const [ycbsRowId, setYcbsRowId] = useState<number | null>(null);
  const [assignmentNotice, setAssignmentNotice] = useState<string>("");
  const [assignmentMode, setAssignmentMode] = useState<"none" | "ngau-nhien" | "chi-dinh">("none");
  const [selectedOfficer, setSelectedOfficer] = useState<string>("");
  const OFFICERS = ["Nguyễn Văn An", "Trần Thị Bình", "Lê Thị Hà", "Phạm Văn Đức", "Hoàng Thị Thu"];
  const [rows, setRows] = useState<DanhSachDonRow[]>(SAMPLE_ROWS);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const pkgStr = localStorage.getItem('assigned_gdt_package');
        if (pkgStr) {
          const pkg = JSON.parse(pkgStr);
          localStorage.removeItem('assigned_gdt_package');
          // Add to rows if it doesn't exist
          setRows(prev => {
            if (prev.find(r => r.maDon === pkg.packageId)) return prev;
            return [{
              id: Date.now(),
              maDon: pkg.packageId,
              nguoiGui: pkg.applicant || "Trần Quang Sang",
              diaChi: "Hải Phòng",
              loaiHinhThuc: pkg.applicationKind || "Đơn đề nghị GĐT-TT",
              loaiHinhThucColor: "#1d4ed8",
              thongTinDon: {
                soBaqd: "BA_GDT_001",
                ngay: pkg.documentDate || "14/08/2026",
                toaXetXu: "TAND Cấp cao",
                thuTuc: pkg.procedure || "Giám đốc thẩm",
                hinhThuc: pkg.applicationKind || "Đơn đề nghị GĐT-TT",
                soCV: pkg.documentNumber || "",
                ngayCV: pkg.documentDate || "",
                loaiCV: pkg.applicationKind || "",
                donViGui: pkg.sender || "",
                thamPhan: "",
                donViGiaiQuyet: ""
              },
              giaiQuyet: {
                nhan: "Chờ phân công",
                color: "#f57f17",
                stl: "",
                coVanBan: false
              },
              nguoiNhap: pkg.officer || "Nguyễn Thị Mỹ Dung",
              ngayNhap: pkg.arrivalAt ? pkg.arrivalAt.split(' ')[0] : "15/08/2026",
              gioNhap: pkg.arrivalAt ? pkg.arrivalAt.split(' ')[1] : "09:15",
              trangThai: 'Chờ phân công',
              nguoiXuLy: pkg.businessOfficer,
              cuaToi: true
            }, ...prev];
          });
        }
      } catch (e) { }
    }, 1000);
    return () => clearInterval(interval);
  }, []);


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
  const [fNguoiGui, setFNguoiGui] = useState("");
  const [fSoBA, setFSoBA] = useState("");
  const [fToaBA, setFToaBA] = useState("");
  const [fNgayNhapFrom, setFNgayNhapFrom] = useState("");
  const [fNgayNhapTo, setFNgayNhapTo] = useState("");
  // ── State bộ lọc nâng cao ──
  const [fHinhThucNhan, setFHinhThucNhan] = useState("");
  const [fNguoiNhap, setFNguoiNhap] = useState("");
  const [fNgayBA, setFNgayBA] = useState("");
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
  }>>({
    // Cùng cán bộ (Phùng Trâm Anh): đã ghép ngay, row 3 (7029) là đơn chính
    6: { ghepVoi: "7029" },
  });
  const [autoMergeMap, setAutoMergeMap] = useState<Record<number, string>>({});
  const [showConfirmRow, setShowConfirmRow] = useState<number | null>(null);
  const [showHuyGhep, setShowHuyGhep] = useState<number | null>(null);
  const [showBoSungTaiLieu, setShowBoSungTaiLieu] = useState<number | null>(null);
  const [showYeuCauBoSung, setShowYeuCauBoSung] = useState<number | null>(null);
  const [showDonTrung, setShowDonTrung] = useState<number | null>(null);
  const [showChuyenDon, setShowChuyenDon] = useState<number | null>(null);
  const [showHuySoThuLy, setShowHuySoThuLy] = useState<number | null>(null);
  const [showThemKetQua, setShowThemKetQua] = useState<number | null>(null);
  const [chuyenDonOfficer, setChuyenDonOfficer] = useState<string>("");
  const [chuyenDonReason, setChuyenDonReason] = useState<string>("");
  const [transferState, setTransferState] = useState<Record<number, {
    toOfficer: string;
    fromOfficer: string;
    reason: string;
    isGroup?: boolean;
    maDons?: string[];
  }>>({
    4: {
      toOfficer: "Phùng Trâm Anh",
      fromOfficer: "Nguyễn Thị Lan",
      reason: "Chuyển giao hồ sơ do cán bộ cũ đi công tác đột xuất",
      maDons: ["Mã 7028"]
    }
  });

  /** Sinh N đơn trùng từ đơn gốc. Mọi thông tin bản án giữ nguyên — đó chính là
   *  cái làm chúng "trùng" nhau; chỉ mã đơn, số hiệu và ngày là riêng.
   *  Trạng thái đặt "Đã thụ lý" + nơi chuyển "Nội bộ" để các đơn này đủ điều kiện
   *  lập Công văn chuyển nội bộ ngay (theo luật kiểm tra ở popup lấy số). */
  const taoDonTrung = (goc: DanhSachDonRow, dsDong: DongDonTrung[]) => {
    const maxMa = rows.reduce((m, r) => {
      const n = parseInt((r.maDon || "").replace(/\D/g, ""), 10);
      return Number.isFinite(n) && n > m ? n : m;
    }, 7000);
    const ddmmyyyy = (iso: string) => {
      if (!iso) return "";
      const [y, m, d] = iso.split("-");
      return `${d}/${m}/${y}`;
    };
    const moi: DanhSachDonRow[] = dsDong.map((d, i) => ({
      ...goc,
      id: Date.now() + i,
      maDon: `Mã ${maxMa + i + 1}`,
      soHieuDon: d.soHieuDon || undefined,
      ngayNhap: ddmmyyyy(d.ngayNhan) || goc.ngayNhap,
      ngayTrenDon: ddmmyyyy(d.ngayTrenDon) || goc.ngayTrenDon,
      thongTinDon: {
        ...goc.thongTinDon,
        soCV: d.laCongVan ? d.soCV : "",
        ngayCV: d.laCongVan ? ddmmyyyy(d.ngayCV) : "",
        donViGui: d.trongNganh ? (d.donViGui || goc.thongTinDon.donViGui) : goc.thongTinDon.donViGui,
      },
      giaiQuyet: { ...goc.giaiQuyet, nhan: "Đã thụ lý", color: "#2d4b74", coVanBan: false },
      thongTinChuyenDon: "Nội bộ",
      trungVoiDon: goc.maDon.trim(),
      // Đơn mới sinh chưa đi qua quy trình nào của đơn gốc.
      toTrinhStatus: "none",
      traLai: undefined,
      processingHistory: undefined,
      daNhan: false,
    }));
    setRows(p => [...moi, ...p]);
    setShowDonTrung(null);
    triggerNoti(`Đã tạo ${moi.length} đơn trùng từ ${goc.maDon.trim()}: ${moi.map(m => m.maDon).join(", ")}`);
  };
  const [showLuuSoVanBan, setShowLuuSoVanBan] = useState(false);
  const [showInDanhSach, setShowInDanhSach] = useState(false);
  const [historyRow, setHistoryRow] = useState<DanhSachDonRow | null>(null);
  const [trinhKyRow, setTrinhKyRow] = useState<DanhSachDonRow | null>(null);
  const [suaDon, setSuaDon] = useState(false);
  const [tachDon, setTachDon] = useState(false);
  const [tachSoDon, setTachSoDon] = useState("");
  // Các điều kiện phụ nằm CÙNG khối tìm kiếm, chỉ thu/mở chứ không tách panel riêng
  const [moNangCao, setMoNangCao] = useState(false);
  const [advTab, setAdvTab] = useState("NGUON_DON");
  // Mac dinh hien CA don lan ho so khang nghi; tich de chi con don
  const [chiDon, setChiDon] = useState(false);
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
      // Đơn sinh từ "Thêm đơn trùng" KHÔNG tham gia ghép. Trùng là hệ quả của
      // việc ghép sau khi đơn đã chuyển, không phải nguyên nhân — để chúng lọt
      // vào nhóm tự ghép thì nhãn "Đã ghép với…" sẽ đè mất trạng thái Đã thụ lý,
      // và sinh ra quan hệ ghép vòng giữa các đơn vốn đã là bản sao của nhau.
      if (row.trungVoiDon) return acc;
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

  // Đơn thuộc tab "Đơn chờ phê duyệt" bên màn Nhận đơn và TL vụ án: trạng thái
  // giải quyết lấy theo kết luận của Lãnh đạo. Thay ngay từ đây để tab, bộ lọc
  // và cột Thông tin giải quyết cùng ăn theo một nguồn.
  const vLD = useKetLuanLD();
  const rowsLD = useMemo(() => rows.map(r => {
    if (!r.choYKienLD) return r;
    const nhan = layKetLuanLD(r.choYKienLD) ?? CHO_Y_KIEN_LD;
    return { ...r, giaiQuyet: { ...r.giaiQuyet, nhan, color: MAU_KET_LUAN_LD[nhan] } };
  }), [rows, vLD]);

  // Đơn nào rơi vào trạng thái "Thụ lý mới trùng TP" → đơn liên quan gây ra nó.
  // Tính trên rowsLD (đã áp kết luận của Lãnh đạo) chứ không phải rows, để đơn
  // vừa được LĐ kết luận "Thụ lý mới" cũng được đối chiếu ngay.
  const trungTPMap = useMemo(() => {
    const m: Record<number, DanhSachDonRow> = {};
    rowsLD.forEach(r => {
      const lienQuan = donTrungThamPhan(r, rowsLD);
      if (lienQuan) m[r.id] = lienQuan;
    });
    return m;
  }, [rowsLD]);

  // ── Engine lọc ────────────────────────────────────────────────────────────
  // Mọi điều kiện cộng dồn với nhau (AND). Ô rỗng = bỏ qua điều kiện đó.
  // Tách khỏi điều kiện tab để số đếm trên tab phản ánh đúng các bộ lọc đang áp.
  const rowsByFilters = useMemo(() => rowsLD.filter(r => {
    const d = r.thongTinDon ?? ({} as DanhSachDonRow["thongTinDon"]);
    const trangThai = r.giaiQuyet?.nhan ?? "";

    // Chọn Loại văn bản là lọc luôn theo điều kiện hợp lệ của loại đó — cùng
    // một luật với màn Lưu số văn bản, nên vào modal không còn đơn bị gạch đỏ.
    if (chiDon && r.laKhangNghi) return false;

    // Bộ lọc "Quá hạn giải quyết" — bật khi vào từ card cảnh báo ở Trang chủ.
    if (fQuaHanOnly && r.quaHanNam === undefined) return false;

    if (lyDoKhongDuocLap(r, loaiVanBan, donTrungMap[r.maDon])) return false;

    // Từ khóa chung — quét các trường văn bản đáng kể
    if (fKeyword) {
      const pool = [r.nguoiGui, r.diaChi, r.maDon, r.loaiHinhThuc, r.nguoiNhap,
      d.soBaqd, d.toaXetXu, d.thuTuc, d.hinhThuc, d.soCV, d.loaiCV,
      d.donViGui, d.thamPhan, d.donViGiaiQuyet, trangThai, r.giaiQuyet?.stl];
      if (!pool.some(v => contains(v, fKeyword))) return false;
    }

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
    if (fDonVi && r.donViChuyenDen !== fDonVi) return false;
    if (fNoiChuyen === "Nội bộ" && ui("chuyenCaNhan") && r.caNhanChuyenDen !== ui("chuyenCaNhan")) return false;
    if (fThuLy && trangThai !== fThuLy) return false;
    if (!inDateRange(d.ngay, fNgayBA, fNgayBA)) return false;

    // "Trạng thái đơn" là suy diễn: chưa đủ điều kiện vs còn lại
    if (fTrangThai === "Đơn không đủ điều kiện") {
      if (trangThai !== "Chưa đủ điều kiện") return false;
      const l = advUI.lyDoKhongDu;
      if (l && r.giaiQuyet?.lyDoKhongDu && !r.giaiQuyet.lyDoKhongDu.includes(l)) return false;
    }
    if (fTrangThai === "Đơn đủ điều kiện" && trangThai === "Chưa đủ điều kiện") return false;

    return true;
  }), [rowsLD, chiDon, loaiVanBan, fKeyword, fNguoiGui, fSoBA, fToaBA,
    fNgayNhapFrom, fNgayNhapTo, fHinhThuc, fHinhThucNhan, fLoaiAn, fNguoiNhap,
    fNoiChuyen, fDonVi, advUI, fThuLy, fNgayBA, fTrangThai, fQuaHanOnly]);

  const filteredRows = useMemo(
    () => rowsByFilters.filter(TAB_MATCH[activeTab] ?? (() => true)),
    [rowsByFilters, activeTab]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aChoXuLy = a.giaiQuyet?.nhan === "Chờ xử lý";
      const bChoXuLy = b.giaiQuyet?.nhan === "Chờ xử lý";
      if (aChoXuLy && !bChoXuLy) return -1;
      if (!aChoXuLy && bChoXuLy) return 1;
      
      // Mới nhất lên đầu (theo id giảm dần)
      return b.id - a.id;
    });
  }, [filteredRows]);

  // Cột "Số đơn" là số đơn của từng bản ghi; tổng của nó mới là số đơn thật sự
  // đang xem. Cộng trên filteredRows nên con số luôn ăn theo bộ lọc + tab.
  const tongSoDon = useMemo(
    () => sortedRows.reduce((s, r) => s + (r.soDon ?? 0), 0),
    [sortedRows]);

  const tabs = [
    { label: "Tổng số", count: rowsByFilters.length },
    { label: "Đơn của tôi", count: rowsByFilters.filter(TAB_MATCH[1]).length },
    { label: "Đơn Thụ lý", count: rowsByFilters.filter(TAB_MATCH[2]).length },
    { label: "Chưa đủ điều kiện", count: rowsByFilters.filter(TAB_MATCH[3]).length },
    { label: "Hết thời hạn kháng nghị", count: rowsByFilters.filter(TAB_MATCH[4]).length },
    { label: "Khác", count: rowsByFilters.filter(TAB_MATCH[5]).length },
    { label: "Đơn trả lại", count: rowsByFilters.filter(TAB_MATCH[6]).length },
  ];

  // Danh sách tòa cho ô "Tòa ra bản án" — lấy từ chính dữ liệu
  const toaOptions = useMemo(
    () => [...new Set(rows.map(r => r.thongTinDon?.toaXetXu).filter(Boolean))].sort(),
    [rows]);

  // Tên cán bộ nhập bị trùng giữa 2 người khác nhau → cột Người nhập/Sửa phải
  // kèm ngày sinh thì mới phân biệt được.
  const tenCanBoTrungLap = useMemo(() => {
    const theoTen: Record<string, Set<string>> = {};
    const them = (ten?: string, ghiDe?: string) => {
      if (!ten) return;
      (theoTen[ten] ??= new Set()).add(ngaySinhTheoTen(ten, ghiDe));
    };
    rows.forEach(r => {
      them(r.nguoiNhap, r.nguoiNhapNgaySinh);
      them(r.nguoiSua, r.nguoiSuaNgaySinh);   // người sửa cũng có thể trùng tên
    });
    return new Set(Object.keys(theoTen).filter(ten => theoTen[ten].size > 1));
  }, [rows]);
  const nguoiNhapOptions = useMemo(
    () => [...new Set(rows.map(r => r.nguoiNhap).filter(Boolean))].sort(),
    [rows]);

  const soBoLocDangApp = [fKeyword, fNguoiGui, fSoBA, fToaBA,
    fNgayNhapFrom, fNgayNhapTo, fHinhThuc, fHinhThucNhan, fLoaiAn, fNguoiNhap,
    fNoiChuyen, fThuLy, fNgayBA, fTrangThai, loaiVanBan].filter(Boolean).length
    + (chiDon ? 1 : 0) + (fQuaHanOnly ? 1 : 0);

  // Mô tả bộ lọc đang áp — in kèm lên đầu danh sách để biết bản in lấy theo gì
  const moTaBoLoc = useMemo(() => {
    // Gộp cặp từ/đến thành một mệnh đề đọc được thay vì hai dòng rời:
    //   "Ngày nhập từ 01/07 đến 31/07" thay cho "Ngày nhập từ: 01/07" + "Ngày nhập đến: 31/07"
    const khoang = (nhan: string, tu: string, den: string) =>
      tu && den ? `${nhan}: từ ${tu} đến ${den}`
        : tu ? `${nhan}: từ ${tu}`
          : den ? `${nhan}: đến ${den}` : "";
    return [
      activeTab > 0 ? `Nhóm đơn: ${tabs[activeTab]?.label ?? ""}` : "",
      fQuaHanOnly && "Chỉ hiện: Quá hạn giải quyết",
      fKeyword && `Từ khóa: ${fKeyword}`,
      fNguoiGui && `Người gửi: ${fNguoiGui}`,
      fSoBA && `Số BA/QĐ: ${fSoBA}`,
      fToaBA && `Tòa ra bản án: ${fToaBA}`,
      khoang("Ngày nhập", fNgayNhapFrom, fNgayNhapTo),
      fNgayBA && `Ngày bản án: ${fNgayBA}`,
      fHinhThuc && `Hình thức đơn: ${fHinhThuc}`,
      fHinhThucNhan && `Hình thức tiếp nhận: ${fHinhThucNhan}`,
      fLoaiAn && `Loại án: ${fLoaiAn}`,
      fNguoiNhap && `Người nhập: ${fNguoiNhap}`,
      fNoiChuyen && `Nơi chuyển đến: ${fNoiChuyen}`,
      fThuLy && `Thụ lý đơn: ${fThuLy}`,
      fTrangThai && `Trạng thái đơn: ${fTrangThai}`,
      loaiVanBan && `Loại văn bản: ${loaiVanBan}`,
    ].filter(Boolean) as string[];
  },
    [fKeyword, fNguoiGui, fSoBA, fToaBA, fNgayNhapFrom, fNgayNhapTo,
      fHinhThuc, fHinhThucNhan, fLoaiAn, fNguoiNhap, fNoiChuyen, fThuLy,
      fNgayBA, fTrangThai, loaiVanBan, activeTab, tabs, fQuaHanOnly]);

  // Tiêu đề bản in dựng từ bộ lọc. Tab quyết định phần lõi; loại án và trạng thái
  // nối thêm khi có. Bản in tách khỏi màn hình nên tiêu đề phải tự nói được
  // nó đang là danh sách gì.
  const TIEU_DE_TAB: Record<number, string> = {
    0: "DANH SÁCH ĐƠN",
    1: "DANH SÁCH ĐƠN CỦA TÔI",
    2: "DANH SÁCH ĐƠN THỤ LÝ",
    3: "DANH SÁCH ĐƠN CHƯA ĐỦ ĐIỀU KIỆN",
    4: "DANH SÁCH ĐƠN HẾT THỜI HẠN KHÁNG NGHỊ",
    5: "DANH SÁCH ĐƠN KHÁC",
    6: "DANH SÁCH ĐƠN TRẢ LẠI",
  };
  const tieuDeIn = useMemo(() => {
    let t = khangNghi ? "DANH SÁCH HỒ SƠ KHÁNG NGHỊ" : (TIEU_DE_TAB[activeTab] ?? "DANH SÁCH ĐƠN");
    if (fLoaiAn) t += ` – ÁN ${fLoaiAn.toUpperCase()}`;
    if (fTrangThai) t += ` – ${fTrangThai.toUpperCase()}`;
    return t;
  }, [activeTab, fLoaiAn, fTrangThai, khangNghi]);

  const phuDeIn = useMemo(() => {
    const khoang = (nhan: string, tu: string, den: string) =>
      tu && den ? `${nhan} từ ${tu} đến ${den}`
        : tu ? `${nhan} từ ${tu}`
          : den ? `${nhan} đến ${den}` : "";
    const phan = [
      khoang("Ngày nhập", fNgayNhapFrom, fNgayNhapTo),
      fNgayBA && `Ngày bản án ${fNgayBA}`,
      selectedRows.length ? `${selectedRows.length} đơn được chọn` : "",
    ].filter(Boolean);
    return phan.join(" · ");
  }, [fNgayNhapFrom, fNgayNhapTo, fNgayBA, selectedRows]);

  // In danh sách: ưu tiên các dòng đang tích, không tích thì lấy toàn bộ kết quả lọc
  const rowsDeIn = selectedRows.length
    ? sortedRows.filter(r => selectedRows.includes(r.id))
    : sortedRows;

  const xoaBoLoc = () => {
    setFKeyword(""); setFNguoiGui(""); setFSoBA("");
    setFToaBA(""); setFNgayNhapFrom(""); setFNgayNhapTo(""); setFHinhThuc("");
    setFHinhThucNhan(""); setFLoaiAn(""); setFNguoiNhap(""); setFNoiChuyen("");
    setFDonVi(""); setFThuLy(""); setFNgayBA(""); setFTrangThai("");
    setFAnTuHinhSelect(""); setLoaiVanBan(""); setAdvUI({}); setChiDon(false);
    setFQuaHanOnly(false);
  };

  // Số điều kiện đang áp ở phần thu gọn — để người dùng biết có gì đang chạy ngầm.
  // Ngày BA/QĐ, Địa chỉ gửi đơn/chi tiết, Trả lời đơn giờ đã hiện sẵn ở bộ lọc
  // cơ bản nên không tính vào đây nữa — tính sẽ khiến badge báo "có điều kiện
  // ẩn" dù người dùng đang nhìn thấy ngay trên màn hình.
  const CAC_KHOA_DA_LEN_CO_BAN = new Set(["diaChiGui", "diaChiCT", "traLoiDon"]);
  const soDieuKienPhu = [fHinhThucNhan, fLoaiAn, fNguoiNhap, fNoiChuyen, fThuLy,
    fTrangThai, fDonVi, fAnTuHinhSelect]
    .concat(Object.entries(advUI).filter(([k]) => !CAC_KHOA_DA_LEN_CO_BAN.has(k)).map(([, v]) => v))
    .filter(Boolean).length;

  return (
    <div className="bg-[#eef1f5] min-h-full">
      <div className="p-3 space-y-3">

        {/* Title */}
        <h2 className="text-[15px] font-semibold text-[#222]">{khangNghi ? "Hồ sơ kháng nghị" : "Danh sách đơn"}</h2>

        {/* Card */}
        <div className="bg-white border border-[#ddd] rounded-[3px]">

          {/* Tabs — Hồ sơ kháng nghị chỉ có một danh sách duy nhất → không có tabs. */}
          {!khangNghi && (
            <div className="flex items-end border-b border-[#ddd] px-3 pt-2 gap-0">
              {tabs.map((t, i) => (
                t.label === "Khác" ? null : (
                  <button key={i} onClick={() => setActiveTab(i)}
                    className={`px-4 py-[7px] text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#222]"
                      }`}>
                    {t.label}
                  </button>
                )
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
              {/* Row 1 — luôn hiện, giữ từ khóa tìm kiếm chung + hình thức đơn.
                  Nhãn bên trái ô nhập (TRow) như các hàng dưới, thay vì nhãn
                  nằm trên. Không col-span để độ rộng khớp đúng cột Người gửi /
                  Số BA/QĐ ở hàng dưới; cột 3 (thẳng hàng ô Hình thức đơn) giờ
                  còn trống nên đặt 2 checkbox vào đây, cùng hàng luôn. */}
              <div className="grid grid-cols-6 gap-x-7">
                <div className="col-span-2">
                  <TRow label="Từ khóa tìm kiếm chung">
                    <TInp placeholder="Nhập bất kỳ thông tin nào (người gửi, nội dung...)" value={fKeyword} onChange={e => setFKeyword(e.target.value)} />
                  </TRow>
                </div>
                <div className="col-span-2">
                  <TRow label="Hình thức đơn">
                    <TSel value={fHinhThuc} onChange={e => setFHinhThuc(e.target.value)}>
                      <option value="">Tất cả hình thức</option>{optionsHinhThucDon()}
                    </TSel>
                  </TRow>
                </div>
                <div className="col-span-2 flex flex-col justify-center gap-1 min-h-[30px]">
                  <label className="flex items-center gap-1.5 text-[11px] text-[#333] cursor-pointer whitespace-nowrap" title="Đơn đã giải quyết xong từ tòa Cấp cao">
                    <input type="checkbox" className="w-[12px] h-[12px] accent-[#8b1a1a] flex-shrink-0"
                      checked={ui("daGiaiQuyetCapCao") === "1"}
                      onChange={e => setUi("daGiaiQuyetCapCao")(e.target.checked ? "1" : "")} />
                    <span className="truncate">Đơn đã giải quyết xong từ tòa Cấp cao</span>
                  </label>
                  {/* Mặc định danh sách gồm CẢ đơn và hồ sơ kháng nghị; tích để
                      chỉ còn đơn. Rút gọn phần giải thích trong ngoặc thành
                      tooltip (title) để không tràn khỏi cột — chữ đầy đủ vẫn
                      xem được khi rê chuột. */}
                  <label className="flex items-center gap-1.5 text-[11px] text-[#333] cursor-pointer whitespace-nowrap">
                    <input type="checkbox" className="w-[12px] h-[12px] accent-[#8b1a1a] flex-shrink-0"
                      checked={chiDon} onChange={e => setChiDon(e.target.checked)} />
                    Chỉ danh sách đơn <span className="text-[#888]">(không tính Hồ sơ kháng nghị)</span>
                  </label>
                </div>
              </div>

              {/* Row 2-4 — luôn hiện, bố cục 6 cột theo đúng bản mẫu; các trường
                  này trước nằm trong khối "Điều kiện tìm kiếm khác" nay dời lên
                  đây, không còn lặp lại ở dưới. Dùng TRow/TInp cỡ nhỏ (như panel
                  nâng cao) thay vì FLbl/FInp cho gọn, đỡ chiếm chiều cao. */}
              <div className="grid grid-cols-6 gap-x-7 gap-y-2 mt-2">
                <TRow label="Người gửi">
                  <TInp placeholder="Nhập tên người gửi" value={fNguoiGui} onChange={e => setFNguoiGui(e.target.value)} />
                </TRow>
                <TRow label="Số BA/QĐ">
                  <TInp placeholder="Nhập số bản án/QĐ" value={fSoBA} onChange={e => setFSoBA(e.target.value)} />
                </TRow>
                <TRow label="Ngày BA/QĐ">
                  <TDate value={fNgayBA} onChange={setFNgayBA} />
                </TRow>

                <TRow label="Tòa ra BA/QĐ">
                  <TSel value={fToaBA} onChange={e => setFToaBA(e.target.value)}>
                    <option value="">Chọn tòa</option>{toaOptions.map(o => <option key={o} value={o}>{vietTatTAND(o)}</option>)}
                  </TSel>
                </TRow>
                <TRow label="Ngày nhập từ">
                  <TDate value={fNgayNhapFrom} onChange={setFNgayNhapFrom} />
                </TRow>
                <TRow label="Nhập đến ngày">
                  <TDate value={fNgayNhapTo} onChange={setFNgayNhapTo} />
                </TRow>

                <div className="col-span-2">
                  <TRow label="Tỉnh/Thành phố">
                    <ComboNhapChon value={ui("diaChiGui")} onChange={setUi("diaChiGui")}
                      nhomGoiY={[{ nhom: "", items: TINH_TP }]}
                      placeholder="Chọn tỉnh/thành phố" chiTrongDanhMuc />
                  </TRow>
                </div>
                <div className="col-span-2">
                  <TRow label="Quận/Huyện">
                    <TInp value={ui("quanHuyen")} onChange={e => setUi("quanHuyen")(e.target.value)} placeholder="Nhập quận/huyện" />
                  </TRow>
                </div>
                <div className="col-span-2">
                  <TRow label="Địa chỉ chi tiết">
                    <TInp value={ui("diaChiCT")} onChange={e => setUi("diaChiCT")(e.target.value)} placeholder="Số nhà, đường, phường/xã..." />
                  </TRow>
                </div>
              </div>

              {/* Các ô còn lại nối tiếp ngay bên dưới — cùng một khối tìm kiếm,
                  không có khung riêng hay tiêu đề phụ, chỉ thu/mở cho đỡ dài. */}
              <div className="mt-1 pt-2 border-t border-dashed border-[#e0e0e0]">
                <button onClick={() => setMoNangCao(m => !m)}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1a5a96] hover:underline mb-1">
                  <ChevronDown size={13} className={`transition-transform ${moNangCao ? "rotate-180" : ""}`} />
                  {moNangCao ? "Thu gọn điều kiện tìm kiếm" : "Điều kiện tìm kiếm khác"}
                  {!moNangCao && soDieuKienPhu > 0 && (
                    <span className="min-w-[16px] text-center bg-[#8b1a1a] text-white text-[10px] font-semibold px-1 py-[1px] rounded-full leading-[1.3]">
                      {soDieuKienPhu}
                    </span>
                  )}
                </button>
                <div className={moNangCao ? "" : "hidden"}>
                  {/* ── Lưới 6 cột, xếp theo HÀNG ──
                      Thứ tự do nghiệp vụ chốt theo từng hàng ngang, nên khối này
                      là một lưới chảy theo hàng: TRow thứ n rơi vào cột (n mod 6).
                      Nhờ vậy các bộ trường đi liền nhau nằm chung một dòng —
                      Nhận đơn từ ↔ Đến ngày, Ngày thụ lý từ ↔ Đến ngày ↔ Số thụ lý,
                      Nơi chuyển ↔ Chuyển đến, Ngày chuyển từ ↔ Đến ngày.
                      Số BA/QĐ, Ngày BA/QĐ, Địa chỉ gửi đơn / chi tiết, Trả lời đơn
                      đã có ở bộ lọc cơ bản nên không lặp lại ở đây. */}
                  <div className="flex flex-col gap-4 mt-2">
                    {/* Nhóm 1: Nguồn đơn & Văn bản */}
                    <div className="bg-white">
                      <div className="grid grid-cols-6 gap-x-7 gap-y-2">
                        {/* Hàng 1 */}
                        <TRow label="Phạm vi tìm kiếm">
                          <TSel value={ui("phamVi")} onChange={e => setUi("phamVi")(e.target.value)}>
                            <option value="">Tất cả</option>
                            <option>Đơn vị của tôi</option>
                            <option>Toàn hệ thống</option>
                          </TSel>
                        </TRow>
                        <TRow label="Nhận đơn từ">
                          <TDate value={ui("nhanDonTu")} onChange={setUi("nhanDonTu")} />
                        </TRow>
                        <TRow label="Nhận đến ngày">
                          <TDate value={ui("nhanDonDen")} onChange={setUi("nhanDonDen")} />
                        </TRow>
                        <TRow label="Hình thức nhận">
                          <TSel value={fHinhThucNhan} onChange={e => setFHinhThucNhan(e.target.value)}>
                            <option value="">--- Tất cả ---</option>
                            <option>Bưu điện</option><option>Điện tử</option><option>Trực tiếp</option>
                            <option>Trực tuyến</option><option>Nội bộ</option><option>Tiếp công dân</option>
                          </TSel>
                        </TRow>
                        <TRow label="Người nhập">
                          <TSel value={fNguoiNhap} onChange={e => setFNguoiNhap(e.target.value)}>
                            <option value="">...chọn...</option>
                            {nguoiNhapOptions.map(o => <option key={o}>{o}</option>)}
                          </TSel>
                        </TRow>
                        <TRow label="Số CMND/CCCD">
                          <TInp value={ui("cccd")} onChange={e => setUi("cccd")(e.target.value)} />
                        </TRow>

                        {/* Hàng 2 */}
                        <div className="col-span-2">
                          <TRow label="Cơ quan chuyển đơn">
                            <div className="grid grid-cols-[100px_1fr] gap-1.5">
                              <TSel value={ui("loaiCoQuanChuyen")} onChange={e => { setUi("loaiCoQuanChuyen")(e.target.value); setUi("coQuanChuyen")(""); }}>
                                <option value="">--Loại--</option>
                                <option>Tòa án</option>
                                <option>Trại giam</option>
                                <option>Ngoài tòa</option>
                              </TSel>
                              {ui("loaiCoQuanChuyen") === "Tòa án" ? (
                                <ComboNhapChon value={ui("coQuanChuyen")} onChange={setUi("coQuanChuyen")} nhomGoiY={[{ nhom: "", items: TOA_AN_OPTIONS }]} placeholder="Chọn tòa án" chiTrongDanhMuc />
                              ) : ui("loaiCoQuanChuyen") === "Trại giam" ? (
                                <ComboNhapChon value={ui("coQuanChuyen")} onChange={setUi("coQuanChuyen")} nhomGoiY={DON_VI_TRAI_GIAM} placeholder="Chọn trại giam" chiTrongDanhMuc />
                              ) : (
                                <TInp value={ui("coQuanChuyen")} onChange={e => setUi("coQuanChuyen")(e.target.value)} placeholder="Nhập tên cơ quan" />
                              )}
                            </div>
                          </TRow>
                        </div>
                        <div className="col-span-2">
                          <TRow label="Loại CV / Số CV đến">
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
                              <TInp value={ui("soCVPC")} onChange={e => setUi("soCVPC")(e.target.value)} placeholder="Số CV" />
                            </div>
                          </TRow>
                        </div>
                        <div className="col-span-2">
                          <TRow label="Ngày CV/PC">
                            <TDate value={ui("ngayCVPC")} onChange={setUi("ngayCVPC")} />
                          </TRow>
                        </div>
                        <div className={activeTab !== 1 ? "col-span-2" : "col-span-6"}>
                          <div className="grid grid-cols-2 gap-x-3">
                            <TRow label="Loại văn bản">
                              <TSel value={ui("loaiVanBan")} onChange={e => setUi("loaiVanBan")(e.target.value)}>
                                <option value="">-- Chọn loại --</option>
                                <option value="cv">Công văn (chuyển đơn, bổ sung...)</option>
                                <option value="tt">Tờ trình / Báo cáo đề xuất</option>
                                <option value="qd">Quyết định / Bản án / Thông báo</option>
                                <option value="phieu">Phiếu giao nhận / Biên nhận</option>
                              </TSel>
                            </TRow>
                            <TRow label="Số văn bản">
                              <TInp value={ui("soVanBan")} onChange={e => setUi("soVanBan")(e.target.value)} placeholder="Số VB" />
                            </TRow>
                          </div>
                        </div>
                        
                        {activeTab !== 1 && (
                          <>
                            <div className="col-span-2">
                              <TRow label="Thủ tục giải quyết">
                                <TSel value={ui("thuTuc")} onChange={e => setUi("thuTuc")(e.target.value)}>
                                  <option value="">--Tất cả--</option>
                                  <option>Giám đốc thẩm</option><option>Tái thẩm</option>
                                </TSel>
                              </TRow>
                            </div>
                            <div className="col-span-2">
                              <TRow label="Loại án">
                                <TSel value={fLoaiAn} onChange={e => setFLoaiAn(e.target.value)}>
                                  <option value="">Tất cả</option>
                                  <option>Hình sự</option><option>Dân sự</option><option>Hành chính</option>
                                  <option>KDTM</option><option>HN-GĐ</option><option>Lao động</option>
                                </TSel>
                              </TRow>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Nhóm 2: Thụ lý & Phân công */}
                    {activeTab !== 1 && (
                      <div className="bg-white">
                        <div className="grid grid-cols-6 gap-x-7 gap-y-2">
                          {/* Hàng 4 (Các trường còn lại của Nhóm 2) */}
                          <div className="col-span-2">
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
                          </div>
                          <div className="col-span-2">
                            <TRow label="Lãnh đạo chỉ đạo?">
                              <TSel value={ui("lanhDaoChiDao")} onChange={e => setUi("lanhDaoChiDao")(e.target.value)}>
                                <option value="">---Tất cả---</option><option>Có</option><option>Không</option>
                              </TSel>
                            </TRow>
                          </div>

                          <div className="col-span-2">
                            <TRow label="Án tử hình">
                              <TSel value={fAnTuHinhSelect} onChange={e => setFAnTuHinhSelect(e.target.value)}>
                                <option value="">--- Tất cả ---</option><option>Có</option><option>Không</option>
                              </TSel>
                            </TRow>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nhóm 3: Kháng nghị */}
                    {!chiDon && (
                      <div className="bg-white">
                        <div className="grid grid-cols-6 gap-x-7 gap-y-2">
                          {/* Hàng 5 */}
                          <div className="col-span-2">
                            <TRow label="Người kháng nghị">
                              <TInp value={ui("nguoiKN")} onChange={e => setUi("nguoiKN")(e.target.value)} />
                            </TRow>
                          </div>
                          <div className="col-span-2">
                            <TRow label="Số QĐKN">
                              <TInp value={ui("soQDKN")} onChange={e => setUi("soQDKN")(e.target.value)} />
                            </TRow>
                          </div>
                          <div className="col-span-2">
                            <TRow label="Ngày QĐKN">
                              <TDate value={ui("ngayQDKN")} onChange={setUi("ngayQDKN")} />
                            </TRow>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nhóm 4: Kết quả xử lý */}
                    <div className="bg-white">
                      <div className="grid grid-cols-6 gap-x-7 gap-y-2">
                        {/* Hàng 6 */}
                        <div className="col-span-1">
                          <TRow label="Trạng thái đơn">
                            <TSel value={fTrangThai} onChange={e => { setFTrangThai(e.target.value); setAdvUI(p => ({ ...p, lyDoKhongDu: "" })); }}>
                              <option value="">--- Tất cả ---</option>
                              <option>Đơn đủ điều kiện</option><option>Đơn không đủ điều kiện</option>
                            </TSel>
                          </TRow>
                        </div>
                        {fTrangThai === "Đơn không đủ điều kiện" && (
                          <div className="col-span-5">
                            <TRow label="Lý do không đủ điều kiện">
                              <TSel value={ui("lyDoKhongDu")} onChange={e => setUi("lyDoKhongDu")(e.target.value)}>
                                <option value="">--- Tất cả ---</option>
                                <option>Thiếu Bản án/quyết định có hiệu lực pháp luật</option>
                                <option>Thiếu thông tin căn cước công dân</option>
                                <option>Viết lại đơn</option>
                              </TSel>
                            </TRow>
                          </div>
                        )}
                        {fTrangThai !== "Đơn không đủ điều kiện" && (
                          <>
                            <div className="col-span-1">
                              <TRow label="Hướng xử lý / Nơi chuyển" bold>
                                <TSel value={fNoiChuyen} onChange={e => { setFNoiChuyen(e.target.value); setFDonVi(""); setAdvUI(p => ({ ...p, chuyenCaNhan: "", chuyenCATA: "", lyDoTraLai: "", yeuCauTraLai: "", lyDoLuuTheoDoi: "" })); }}>
                                  <option value="">--- Tất cả ---</option>
                                  <option value="Nội bộ">Nội bộ</option>
                                  <option value="Tòa khác">Tòa khác</option>
                                  <option value="Ngoài tòa án">Ngoài tòa án</option>
                                  <option value="Trả lại đơn">Trả lại đơn</option>
                                  <option value="Lưu theo dõi">Xếp đơn (Lưu theo dõi)</option>
                                </TSel>
                              </TRow>
                            </div>

                            {(!fNoiChuyen || fNoiChuyen === "Nội bộ" || fNoiChuyen === "Tòa khác" || fNoiChuyen === "Ngoài tòa án") && (
                              <div className={(fNoiChuyen === "Nội bộ" || fNoiChuyen === "Tòa khác") ? "col-span-2" : "col-span-4"}>
                                <TRow label="Chuyển đến" bold>
                                  <TSel value={fDonVi} onChange={e => setFDonVi(e.target.value)}>
                                    <option value="">--- Tất cả ---</option>
                                    <option>Vụ Pháp chế và Quản lý khoa học</option>
                                    <option>Vụ Giám đốc kiểm tra về hình sự</option>
                                    <option>Vụ Giám đốc kiểm tra về dân sự</option>
                                    <option>Vụ Giám đốc kiểm tra về hành chính</option>
                                  </TSel>
                                </TRow>
                              </div>
                            )}

                            {fNoiChuyen === "Trả lại đơn" && (
                              <>
                                <div className="col-span-2">
                                  <TRow label="Lý do trả lại">
                                    <TSel value={ui("lyDoTraLai")} onChange={e => setUi("lyDoTraLai")(e.target.value)}>
                                      <option value="">-- Tất cả --</option>
                                      <option>Đơn không đủ điều kiện xử lý</option>
                                      <option>Không thuộc thẩm quyền giải quyết</option>
                                      <option>Đã hết thời hạn giải quyết</option>
                                      <option>Lý do khác</option>
                                    </TSel>
                                  </TRow>
                                </div>
                                <div className="col-span-2">
                                  <TRow label="Yêu cầu">
                                    <TInp value={ui("yeuCauTraLai")} onChange={e => setUi("yeuCauTraLai")(e.target.value)} placeholder="Nhập yêu cầu..." />
                                  </TRow>
                                </div>
                              </>
                            )}

                            {fNoiChuyen === "Lưu theo dõi" && (
                              <div className="col-span-4">
                                <TRow label="Lý do xếp đơn">
                                  <TInp value={ui("lyDoLuuTheoDoi")} onChange={e => setUi("lyDoLuuTheoDoi")(e.target.value)} placeholder="Nhập lý do..." />
                                </TRow>
                              </div>
                            )}

                            {fNoiChuyen === "Nội bộ" && (
                              <>
                                <div className="col-span-2">
                                  <TRow label="Chuyển đến cá nhân">
                                    <TSel value={ui("chuyenCaNhan")} onChange={e => setUi("chuyenCaNhan")(e.target.value)}>
                                      <option value="">--- Tất cả ---</option>
                                      {OFFICERS.map(o => <option key={o}>{o}</option>)}
                                    </TSel>
                                  </TRow>
                                </div>
                                <div className="col-span-1">
                                  <TRow label="Thụ lý đơn">
                                    <TSel value={fThuLy} onChange={e => setFThuLy(e.target.value)}>
                                      <option value="">--Tất cả--</option>
                                      <option>Thụ lý mới</option><option>Đã thụ lý</option>
                                      <option>Chờ ý kiến Lãnh đạo</option><option>Không</option>
                                    </TSel>
                                  </TRow>
                                </div>
                                <div className="col-span-1">
                                  <TRow label="Số thụ lý">
                                    <TInp value={ui("soThuLy")} onChange={e => setUi("soThuLy")(e.target.value)} />
                                  </TRow>
                                </div>
                                <div className="col-span-2">
                                  <TRow label="Ngày thụ lý từ">
                                    <TDate value={ui("thuLyTu")} onChange={setUi("thuLyTu")} />
                                  </TRow>
                                </div>
                                <div className="col-span-2">
                                  <TRow label="Thụ lý đến ngày">
                                    <TDate value={ui("thuLyDen")} onChange={setUi("thuLyDen")} />
                                  </TRow>
                                </div>
                              </>
                            )}
                            {fNoiChuyen === "Tòa khác" && (
                              <div className="col-span-2">
                                <TRow label="Chuyển tới CA/TA?">
                                  <TSel value={ui("chuyenCATA")} onChange={e => setUi("chuyenCATA")(e.target.value)}>
                                    <option value="">--Tất cả--</option><option>Có</option><option>Không</option>
                                  </TSel>
                                </TRow>
                              </div>
                            )}

                          </>
                        )}

                        {/* Hàng 7 */}
                        <div className="col-span-2">
                          <TRow label="Ngày chuyển từ">
                            <TDate value={ui("chuyenTu")} onChange={setUi("chuyenTu")} />
                          </TRow>
                        </div>
                        <div className="col-span-2">
                          <TRow label="Ngày chuyển đến">
                            <TDate value={ui("chuyenDen")} onChange={setUi("chuyenDen")} />
                          </TRow>
                        </div>
                        <div className="col-span-2">
                          <TRow label="Trạng thái chuyển">
                            <TSel value={ui("ttChuyen")} onChange={e => setUi("ttChuyen")(e.target.value)}>
                              <option value="">--- Tất cả ---</option>
                              <option>Chưa chuyển</option><option>Đã chuyển</option><option>Đã nhận</option>
                            </TSel>
                          </TRow>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nhóm nút nằm cuối khối tìm kiếm, sau toàn bộ điều kiện lọc */}
              <div className="flex items-center justify-end gap-2 pt-2.5 mt-1 border-t border-[#e8e8e8]">
                <button
                  className="inline-flex items-center gap-1.5 h-[32px] px-5 rounded-[4px] bg-[#8b1a1a] hover:bg-[#6e1414] active:bg-[#5a1010] text-white text-[12px] font-semibold whitespace-nowrap shadow-sm transition-colors">
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
          </div>

          {/* ── Action bar sau tìm kiếm ── */}
          <div className="flex flex-col gap-0 border-b border-[#ddd]">
            {/* Loại văn bản đứng cùng hàng với nhóm nút thao tác, hiện ở mọi tab */}
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-[#f5f5f5]">
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
              <div className="flex-1" />
              <BtnPrimary onClick={onThemMoi} className="h-[30px] text-[12px] px-3 gap-1">
                <Plus size={13} /> Thêm mới
              </BtnPrimary>
              {/* Hiện ở mọi tab, không riêng tab "Đơn của tôi" */}
              <BtnPrimary
                onClick={() => setShowNumberingModal(selectedRows.length ? selectedRows[0] : 1)}
                disabled={sortedRows.length === 0}
                title={sortedRows.length === 0 ? "Không có văn bản hợp lệ để trình duyệt" : undefined}
                className="h-[30px] text-[12px] px-3 gap-1">
                <FileText size={13} /> Lưu số văn bản và in báo cáo
              </BtnPrimary>
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
              </button>
              {/* <BtnSecondary className="h-[30px] text-[12px] px-3 gap-1">
                <Download size={13} /> Thêm từ đơn
              </BtnSecondary> */}
            </div>

            {/* ── Radio group: chỉ hiện khi loại văn bản = Công văn chuyển đơn ── */}
            {loaiVanBan === "Công văn chuyển đơn" && (
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

          {/* Chip bộ lọc "Quá hạn giải quyết" — chỉ hiện khi vào từ card cảnh báo
              ở Trang chủ, có nút bỏ lọc riêng vì đây không nằm trong khối
              bộ lọc nâng cao phía trên. */}
          {fQuaHanOnly && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#ddd] bg-[#fef2f2]">
              <AlertTriangle size={14} className="text-[#c0392b] flex-shrink-0" />
              <span className="text-[12px] text-[#c0392b]">
                Đang lọc: <b>Quá hạn giải quyết</b> ({sortedRows.length} đơn)
              </span>
              <button onClick={() => setFQuaHanOnly(false)} className="ml-auto text-[11px] text-[#1a5a96] hover:underline">
                Bỏ lọc
              </button>
            </div>
          )}

          {/* Tổng số bản ghi — đặt ngay trên bảng, dưới thanh Loại văn bản, kèm
              số đơn để thấy quy mô danh sách trước khi cuộn xuống bảng. */}
          <div className="flex items-center px-3 py-2 border-b border-[#ddd] bg-[#fafafa]">
            <span className="text-[12px] text-[#666]">
              Tổng cộng <b className="text-[#1d2e4f]">{rows.length}</b> bản ghi
              {!khangNghi && sortedRows.length > 0 && (
                <span className="text-[#999]"> · <b className="text-[#1d2e4f]">{tongSoDon}</b> số đơn</span>
              )}
            </span>
          </div>

          {/* Table — table-fixed + độ rộng theo %, luôn khít trong 1 trang thay vì
              cuộn ngang; nội dung dài tự xuống dòng theo cột thay vì kéo bảng rộng ra. */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border border-[#ddd] px-2 py-[9px] text-center font-semibold text-[#333] w-[3%]">
                    <div className="flex items-center justify-center gap-1.5">
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                        checked={sortedRows.length > 0 && selectedRows.length === sortedRows.length}
                        onChange={e => toggleAll(e.target.checked)} />
                      <span>STT</span>
                    </div>
                  </th>
                  {/* Cột người gửi ôm thêm Hình thức đơn + thông tin công văn nên
                      cần rộng hơn; cột Thông tin đơn nhẹ đi thì thu lại. */}
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[32%]">Thông tin người gửi / đơn vị gửi</th>
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[26%]">Thông tin đơn</th>
                  {khangNghi && <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[20%]">Đơn vị giải quyết</th>}
                  {!khangNghi && (
                    <th className="border border-[#ddd] px-3 py-[9px] text-center font-semibold text-[#333] w-[5%]">
                      <div>Số đơn</div>
                      {sortedRows.length > 0 && (
                        <div className="font-normal text-[#666]">({tongSoDon})</div>
                      )}
                    </th>
                  )}
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[19%]">Thông tin giải quyết</th>
                  <th className="border border-[#ddd] px-3 py-[9px] text-left font-semibold text-[#333] w-[10%]">Người nhập / Sửa</th>
                  <th className="border border-[#ddd] px-1 py-[9px] text-center font-semibold text-[#333] w-[5%]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="border border-[#ddd] px-3 py-10 text-center text-[#888]">
                      <div className="flex flex-col items-center gap-1.5">
                        <Search size={22} className="text-[#ccc]" />
                        <span className="text-[13px]">Không có đơn nào khớp bộ lọc.</span>
                        {/* Nêu rõ vì sao rỗng: lấy lý do của chính đơn đầu tiên bị
                            loại, để cán bộ biết cần sửa gì thay vì tưởng lỗi. */}
                        {loaiVanBan && (() => {
                          const lyDo = [...new Set(rowsLD.map(r => lyDoKhongDuocLap(r, loaiVanBan, donTrungMap[r.maDon])).filter(Boolean))];
                          if (!lyDo.length) return null;
                          return (
                            <span className="text-[12px] text-[#b45309] max-w-[560px] leading-relaxed">
                              Không đơn nào đủ điều kiện lập <b>{loaiVanBan}</b>. Lý do: {lyDo.join(" · ")}.
                            </span>
                          );
                        })()}
                        {soBoLocDangApp > 0 && (
                          <button onClick={xoaBoLoc} className="text-[12px] text-[#1a5a96] hover:underline">Làm mới</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {sortedRows.map((row, i) => {
                  const d = row.thongTinDon ?? {};
                  const g = row.giaiQuyet ?? {};
                  // Đơn liên quan đã cầm thẩm phán → đơn này là "Thụ lý mới trùng TP"
                  const trungTP = trungTPMap[row.id];
                  return (
                    <tr key={row.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                      {/* STT */}
                      <td className="border border-[#ddd] px-2 py-2.5 text-center align-top">
                        <div className="flex items-center justify-center gap-1.5">
                          <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleRow(row.id)}
                            onClick={(e) => e.stopPropagation()} />
                          <span>{i + 1}</span>
                        </div>
                      </td>

                      {/* Người gửi */}
                      <td className="border border-[#ddd] px-3 py-2.5 align-top">
                        {(() => {
                          const diaChi = khangNghi ? donViKhangNghi(row.id).diaChi : row.diaChi;
                          const ngayTrenDon = row.ngayTrenDon || d.ngayCV;
                          return (
                            <div className="space-y-[5px] leading-[1.5] text-[12px]">
                              <div>
                                <span className="text-[#666]">{row.nguoiDungDon ? "Người đứng đơn: " : "Người gửi: "}</span>
                                <span className="font-semibold text-[#1a5a96] hover:underline cursor-pointer">
                                  {vietTatTAND(khangNghi ? donViKhangNghi(row.id).ten : (row.nguoiDungDon || row.nguoiGui))}
                                </span>
                              </div>
                              {diaChi && (
                                <div><span className="text-[#666]">Địa chỉ: </span><span className="font-semibold">{vietTatTAND(diaChi)}</span></div>
                              )}
                              {/* Từng cặp bọc nowrap để nhãn không bị tách khỏi giá trị khi xuống dòng */}
                              {(ngayTrenDon || row.ngayNhap) && (
                                <div className="flex flex-wrap gap-x-4">
                                  {ngayTrenDon && <span className="whitespace-nowrap"><span className="text-[#666]">Ngày trên đơn: </span>{ngayTrenDon}</span>}
                                  {row.ngayNhap && <span className="whitespace-nowrap"><span className="text-[#666]">Ngày tòa nhận: </span>{row.ngayNhap}</span>}
                                </div>
                              )}
                              {(row.maDon || row.soHieuDon) && (
                                <div className="flex flex-wrap gap-x-4">
                                  {row.maDon && <span className="whitespace-nowrap"><span className="text-[#666]">Mã đơn: </span><span className="font-semibold">{row.maDon}</span></span>}
                                  {row.soHieuDon && <span className="whitespace-nowrap"><span className="text-[#666]">Số hiệu: </span>{row.soHieuDon}</span>}
                                </div>
                              )}
                              {/* Hình thức đơn — chuyển từ cột Thông tin đơn sang đây,
                                  đứng cạnh Hình thức tiếp nhận: cả hai đều mô tả đơn
                                  đến bằng đường nào, không phải nội dung bản án. */}
                              {(row.thongTinDon?.hinhThuc || row.loaiHinhThuc) && (
                                <div>
                                  <span className="text-[#666]">Hình thức đơn: </span>
                                  <span className="font-semibold">{row.thongTinDon?.hinhThuc || row.loaiHinhThuc}</span>
                                </div>
                              )}
                              {/* Công văn chuyển đơn — chuyển từ cột Thông tin đơn sang
                                  đây: nó nói về đường đi của đơn tới tòa, cùng nhóm với
                                  Hình thức đơn / Hình thức tiếp nhận. */}
                              {d.loaiCV && (
                                <div><span className="text-[#666]">Loại CV: </span><span className="font-semibold">{d.loaiCV}</span></div>
                              )}
                              {(d.soCV || d.ngayCV) && (
                                <div className="flex flex-wrap gap-x-4">
                                  {d.soCV && <span className="whitespace-nowrap"><span className="text-[#666]">Số CV: </span>{d.soCV}</span>}
                                  {d.ngayCV && <span className="whitespace-nowrap"><span className="text-[#666]">Ngày CV: </span>{d.ngayCV}</span>}
                                </div>
                              )}
                              {/* Hình thức tiếp nhận — trước là cột riêng, gộp về đây
                                  vì đây là cách người gửi đưa đơn tới tòa. */}
                              {!khangNghi && row.hinhThucTiepNhan && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[#666]">Hình thức tiếp nhận: </span>
                                  <span className={`inline-block px-2 py-[2px] rounded-sm text-[10px] font-medium border ${row.hinhThucTiepNhan === "Trực tiếp" ? "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"
                                    : row.hinhThucTiepNhan === "Bưu điện" ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"
                                      : "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]"
                                    }`}>
                                    {row.hinhThucTiepNhan}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        {/* Tag phân biệt hồ sơ kháng nghị với đơn thường — hai loại
                            này giờ nằm chung một danh sách. */}
                        {row.laKhangNghi && (
                          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-[3px] rounded-[3px] border text-[10px] font-semibold leading-[1.4] bg-[#f3e8ff] text-[#6d28d9] border-[#d8b4fe]">
                            <Gavel size={10} className="flex-shrink-0" />
                            Hồ sơ kháng nghị
                          </div>
                        )}
                        {row.thoiHieu && (
                          <div className={`mt-1.5 inline-flex items-start gap-1 px-2 py-[3px] rounded-[3px] border text-[10px] font-medium leading-[1.4] ${THOI_HIEU[row.thoiHieu].cls}`}>
                            <AlertCircle size={10} className="flex-shrink-0 mt-[2px]" />
                            {THOI_HIEU[row.thoiHieu].nhan}
                          </div>
                        )}
                      </td>

                      {/* Thông tin đơn */}
                      <td className="border border-[#ddd] px-3 py-2.5 align-top">
                        <div className="space-y-[5px] leading-[1.5] text-[12px]">
                          {/* Số BA/QĐ — ngày — tòa gộp một dòng. Không tách "Ngày" thành
                              nhãn riêng nữa vì bên dưới còn dòng bản án gốc, hai dòng cùng
                              cặp nhãn Số/Ngày đọc ra như bị lặp. */}
                          {(d.soBaqd || d.ngay || d.toaXetXu) && (
                            <div>
                              <span className="text-[#666]">Số BA/QĐ: </span>
                              <span className="font-semibold">{d.soBaqd || "—"}</span>
                              {d.ngay && <span className="font-semibold italic"> · {d.ngay}</span>}
                              {d.toaXetXu && <span className="font-semibold"> · {vietTatTAND(d.toaXetXu)}</span>}
                            </div>
                          )}
                          {row.baGoc && (
                            <div>
                              <span className="text-[#666]">Bản án sơ thẩm gốc: </span>
                              <span className="font-semibold">{row.baGoc.so}</span>
                              <span className="font-semibold italic"> · {row.baGoc.ngay}</span>
                            </div>
                          )}
                          {d.thuTuc && <div><span className="text-[#666]">Thủ tục giải quyết: </span><span className="font-semibold">{d.thuTuc}</span></div>}
                          {/* "Hình thức đơn" và thông tin công văn chuyển đơn (Số CV /
                              Ngày CV / Loại CV) đã chuyển sang cột Thông tin người gửi —
                              chúng nói về đường đi của đơn, không phải nội dung bản án. */}
                          {/* Trùng với "Người gửi" ở cột bên cạnh thì bỏ, chỉ hiện khi thực sự khác */}
                          {d.donViGui && norm(d.donViGui) !== norm(row.nguoiDungDon || row.nguoiGui) && (
                            <div><span className="text-[#666]">Đơn vị gửi: </span><span className="font-semibold">{vietTatTAND(d.donViGui)}</span></div>
                          )}
                          {/* Nhãn giữ nguyên "Thẩm phán"; chỉ chức danh trong ngoặc
                              rút thành "TP" cho vừa cột. */}
                          {d.thamPhan && <div><span className="text-[#666]">Thẩm phán: </span><span className="font-semibold text-[#333]">{vietTatChucDanhTP(thamPhanGon(vietTatTAND(d.thamPhan)))}</span></div>}
                          {/* Ở màn Hồ sơ kháng nghị, đơn vị giải quyết tách thành cột riêng.
                              Có "(Số: ...)" nghĩa là đã chuyển sang vụ chuyên môn.
                              Đơn đã trả lại thì không còn "chưa chuyển/đã chuyển" nữa —
                              thay bằng thông tin trả đơn cho khỏi mâu thuẫn trạng thái. */}
                          {!khangNghi && row.giaiQuyet?.nhan === "Trả lại đơn" ? (
                            <div>
                              <span className="font-semibold text-[#2980b9]">Trả lại đơn</span>
                              {row.giaiQuyet.nguoiTra && (
                                <div><span className="text-[#666]">Người trả: </span><span className="font-semibold">{row.giaiQuyet.nguoiTra}</span></div>
                              )}
                              {row.giaiQuyet.ngayTra && (
                                <div><span className="text-[#666]">Ngày trả: </span><span className="font-semibold">{row.giaiQuyet.ngayTra}</span></div>
                              )}
                            </div>
                          ) : !khangNghi && d.donViGiaiQuyet && (() => {
                            const daChuyen = daChuyenVu(row);
                            return (
                              <div>
                                <span className={daChuyen ? "font-semibold text-[#c0392b]" : "font-semibold text-[#1a5a96]"}>
                                  {daChuyen ? "Đã chuyển: " : "Chưa chuyển: "}
                                </span>
                                <span className="font-semibold">{vietTatTAND(d.donViGiaiQuyet)}</span>
                              </div>
                            );
                          })()}
                          {/* Ngày chuyển = thời điểm tờ trình của đơn được duyệt,
                              lấy từ lịch sử văn bản chứ không phải trường tĩnh. */}
                          {(() => {
                            const ngay = ngayDuyetToTrinh(vanBanList ?? [], row.maDon) ?? row.ngayChuyen;
                            return ngay
                              ? <div><span className="text-[#666]">Ngày chuyển: </span><span>{ngay}</span></div>
                              : null;
                          })()}
                          {row.ghiChu && <div><span className="text-[#666]">Ghi chú: </span><span>{row.ghiChu}</span></div>}
                        </div>
                      </td>

                      {/* Đơn vị giải quyết — cột riêng của màn Hồ sơ kháng nghị */}
                      {khangNghi && (
                        <td className="border border-[#ddd] px-3 py-2.5 align-top">
                          {d.donViGiaiQuyet && <div className="text-[12px] text-[#333] leading-[1.5]">{vietTatTAND(d.donViGiaiQuyet)}</div>}
                          <div className="text-[11px] text-[#666] mt-1 leading-[1.5]">
                            <span className="text-[#888]">Nơi nhận kèm: </span>{vietTatTAND(donViKhangNghi(row.id).noiNhan)}
                          </div>
                        </td>
                      )}

                      {/* Số đơn */}
                      {!khangNghi && (
                        <td className="border border-[#ddd] px-2 py-2.5 text-center font-medium align-top">{row.soDon || ""}</td>
                      )}


                      {/* Thông tin giải quyết — chỉ chữ, không tô nền màu, để mắt
                          không bị các pill kéo sự chú ý khỏi nội dung xung quanh. */}
                      <td className="border border-[#ddd] px-3 py-2.5 leading-[1.5] align-top">
                        {khangNghi ? (() => {
                          const kn = ketQuaKhangNghi(row.id);
                          return (
                            <>
                              <span className="text-[12px] font-semibold text-[#333]">
                                {kn.trangThai}
                              </span>
                              {kn.ketQua && (
                                <div className="text-[12px] text-[#333] mt-1 leading-snug">
                                  <span className="text-[#888]">Kết quả: </span>{kn.ketQua}
                                </div>
                              )}
                            </>
                          );
                        })() : (<>
                          {row.traLai ? (
                            <span className="text-[12px] font-semibold text-[#333]">
                              {row.traLai.status === "pendingApproval" ? "Trả lại - chờ TP duyệt" : "Đã trả lại HCTP"}
                            </span>
                          ) : autoMergeMap[row.id] ? (
                            <span className="text-[12px] font-semibold text-[#333]">
                              {autoMergeMap[row.id]}
                            </span>
                          ) : row.waitingForProcessing ? (
                            <span
                              onClick={() => onEditRow?.(row.id)}
                              className="text-[12px] font-semibold text-[#333] cursor-pointer hover:underline"
                            >
                              Chờ xử lý
                            </span>
                          ) : trungTP ? (
                            /* Vẫn là Thụ lý mới, nhưng phải nói thêm "trùng TP" ngay trên
                               nhãn — nếu chỉ ghi Thụ lý mới thì cán bộ sẽ đem đi phân công
                               lại, trong khi hồ sơ đã ở tay thẩm phán của đơn liên quan. */
                            <>
                              <span className="text-[12px] font-semibold text-[#333]"
                                title={`Cùng bản án với đơn ${trungTP.maDon.trim()} — đơn đó đã phân công thẩm phán và đã chuyển vụ`}>
                                Thụ lý mới trùng TP
                              </span>
                              {g.stl && (
                                <div className="text-[12px] text-[#333] mt-1">
                                  <span className="text-[#888]">Số thụ lý: </span>{g.stl}
                                </div>
                              )}
                              {g.ngayThuLy && (
                                <div className="text-[12px] text-[#333]">
                                  <span className="text-[#888]">Ngày thụ lý: </span>{g.ngayThuLy}
                                </div>
                              )}
                            </>
                          ) : g.nhan ? (
                            <>
                              <span className="text-[12px] font-semibold text-[#333]">
                                {g.nhan}
                              </span>
                              {g.nhan === "Thụ lý mới" && g.stl && (
                                <div className="text-[12px] text-[#333] mt-1">
                                  <span className="text-[#888]">Số thụ lý: </span>{g.stl}
                                </div>
                              )}
                              {g.nhan === "Thụ lý mới" && g.ngayThuLy && (
                                <div className="text-[12px] text-[#333]">
                                  <span className="text-[#888]">Ngày thụ lý: </span>{g.ngayThuLy}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-[12px] font-medium text-[#888]">
                              Chưa có
                            </span>
                          )}
                          {/* Đơn sinh ra từ "Thêm đơn trùng" — ghi rõ nguồn gốc ngay
                            dưới trạng thái, nếu không nhìn bảng sẽ thấy mấy đơn
                            giống hệt nhau mà không biết vì sao. */}
                          {row.trungVoiDon && (
                            <div className="text-[12px] text-[#b45309] mt-1 leading-snug">
                              Trùng với đơn <b className="font-medium">{row.trungVoiDon}</b>
                            </div>
                          )}
                          {/* Chỉ đích danh đơn liên quan và thẩm phán đang giữ hồ sơ.
                            Để ngoài chuỗi pill ở trên nên dù đơn còn dính nhãn khác
                            (đã ghép, chờ xử lý...) thì lời nhắc này vẫn hiện. */}
                          {trungTP && (
                            <div className="text-[12px] text-[#b45309] mt-1 leading-snug">
                              Trùng TP với đơn <b className="font-medium">{trungTP.maDon.trim()}</b>
                              {trungTP.thongTinDon?.thamPhan && (
                                <> · {vietTatChucDanhTP(thamPhanGon(vietTatTAND(trungTP.thongTinDon.thamPhan)))}</>
                              )}
                            </div>
                          )}
                          {/* Văn bản trình ký của đơn — để phẳng ra ngoài, không
                              bọc thẻ nền nữa. Mỗi văn bản một dòng: chấm màu trạng
                              thái · tên loại · số. Trạng thái đọc bằng MÀU CHẤM +
                              chữ nhỏ, không dùng pill to chiếm nguyên một dòng. */}
                          {/* Kết quả kháng nghị — thay cho cột riêng ở màn Hồ sơ
                              kháng nghị cũ, chỉ hiện với bản ghi là kháng nghị. */}
                          {row.laKhangNghi && row.khangNghi && (
                            <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#e8e8e8]">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${row.khangNghi.trangThai === "Đã xét xử" ? "bg-[#1a7a45]" : "bg-[#e67e22]"}`} />
                                <span className="text-[11px] font-medium text-[#1d2e4f]">{row.khangNghi.trangThai}</span>
                              </div>
                              {row.khangNghi.ketQua && (
                                <div className="text-[10px] text-[#777] mt-[1px] leading-snug">{row.khangNghi.ketQua}</div>
                              )}
                              <div className="text-[10px] text-[#888] mt-[1px]">Nơi nhận kèm: {vietTatTAND(row.khangNghi.noiNhan)}</div>
                            </div>
                          )}
                          {(() => {
                            const dsVB = timVanBanTheoDon(vanBanList ?? [], row.maDon);
                            if (!dsVB.length) return null;
                            return (
                              <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#e8e8e8] space-y-1.5">
                                <div className="text-[10px] font-semibold text-[#888] uppercase tracking-wide">
                                  Văn bản trình ký ({dsVB.length})
                                </div>
                                {dsVB.map(vb => (
                                  <button key={vb.id} type="button" title={`${vb.soVanBan ? vb.soVanBan + " — " : ""}${vb.loaiVanBan} · ${TRANG_THAI_NHAN[vb.trangThai]}`}
                                    onClick={(e) => { e.stopPropagation(); onBieuMau?.(row, vb.id); }}
                                    className="group w-full text-left flex items-start gap-1.5 hover:bg-[#f4f8fd] rounded-[3px] px-1 -mx-1 py-0.5 transition-colors">
                                    <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 mt-[5px] ${CHAM_TRANG_THAI[vb.trangThai]}`} />
                                    <span className="min-w-0 flex-1 leading-snug">
                                      <span className="text-[11px] font-medium text-[#1d2e4f] group-hover:text-[#1a5a96]">
                                        {vb.soVanBan && <span className="font-mono">{vb.soVanBan} </span>}
                                        {vb.loaiVanBan}
                                      </span>
                                      <span className="text-[10px] text-[#888]"> · {TRANG_THAI_NHAN[vb.trangThai]}</span>
                                      {!vb.soVanBan && (
                                        <span className="text-[10px] text-[#b45309]"> · chưa cấp số</span>
                                      )}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            );
                          })()}
                          {/* Bỏ link "Danh sách văn bản": đơn có văn bản thì đã liệt
                              kê đủ ở khối trên và bấm được; đơn chưa có thì không hiện
                              gì. Lối vào màn biểu mẫu vẫn còn ở menu ⋮ → Xem biểu mẫu. */}
                          {(() => {
                            const normMaDon = (ma?: string) => (ma || "").trim().toLowerCase();
                            const isDonChinh = Object.values(mergeState).some(item => item.ghepVoi && normMaDon(item.ghepVoi) === normMaDon(row.maDon));
                            const donKems = isDonChinh
                              ? rows.filter(r => mergeState[r.id]?.ghepVoi && normMaDon(mergeState[r.id].ghepVoi) === normMaDon(row.maDon))
                              : [];

                            return (
                              <div className="space-y-1 mt-1">
                                {mergeState[row.id]?.ghepVoi && (
                                  <div className="flex items-center gap-2 flex-wrap bg-[#f0f9ff] border border-[#bae6fd] p-1.5 rounded-sm">
                                    <div className="flex items-center gap-1 text-[11px] text-[#0369a1] font-semibold">
                                      <GitMerge size={11} className="flex-shrink-0" />
                                      <span>Đã ghép với đơn {mergeState[row.id].ghepVoi!.startsWith("Mã") ? mergeState[row.id].ghepVoi : `Mã ${mergeState[row.id].ghepVoi}`}</span>
                                    </div>
                                    <button
                                      onClick={() => setShowHuyGhep(row.id)}
                                      className="flex items-center gap-0.5 px-1.5 py-[2px] rounded text-[10px] font-medium border border-[#c0392b] text-[#c0392b] hover:bg-[#fdecea] transition-colors whitespace-nowrap ml-auto">
                                      <X size={9} /> Hủy ghép
                                    </button>
                                  </div>
                                )}

                                {isDonChinh && (
                                  <div className="flex flex-col gap-0.5 text-left bg-[#f0fdf4] border border-[#bbf7d0] p-1.5 rounded-sm">
                                    <div className="flex items-center gap-1 text-[11px] text-[#166534] font-semibold">
                                      <GitMerge size={11} className="flex-shrink-0" />
                                      <span>Đơn chính nhóm ghép</span>
                                    </div>
                                    <div className="text-[10px] text-[#444] leading-normal">
                                      <span className="font-medium text-[#666]">Đơn kèm:</span>{" "}
                                      {donKems.map((dk, idx) => (
                                        <span key={dk.id}>
                                          {idx > 0 && ", "}
                                          <span className="font-semibold underline text-[#1a5a96]" title={dk.nguoiGui}>{dk.maDon}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                          {transferState[row.id] && (() => {
                            const ts = transferState[row.id];
                            return (
                              <div className="mt-1.5 p-1.5 bg-[#fef9c3] border border-[#fef08a] rounded-sm space-y-1">
                                <div className="flex items-center gap-1">
                                  <Clock size={11} className="text-[#856404] flex-shrink-0" />
                                  <span className="text-[10px] text-[#856404] font-semibold">
                                    Chờ xác nhận chuyển đơn
                                  </span>
                                </div>
                                <div className="text-[9.5px] text-[#666] leading-tight">
                                  <div><span className="font-semibold">Từ:</span> {ts.fromOfficer}</div>
                                  <div><span className="font-semibold">Đến:</span> {ts.toOfficer}</div>
                                  <div><span className="font-semibold">Lý do:</span> {ts.reason}</div>
                                </div>
                                {ts.toOfficer === "Phùng Trâm Anh" && (
                                  <div className="flex gap-1 mt-1 pt-1 border-t border-[#fef08a]">
                                    <button
                                      onClick={() => {
                                        setRows(prevRows => {
                                          const targetMaDons = (ts.maDons || [row.maDon]).map(m => m.trim().toLowerCase());
                                          return prevRows.map(r => {
                                            const ma = (r.maDon || "").trim().toLowerCase();
                                            if (targetMaDons.includes(ma)) {
                                              const newHistory = [
                                                ...(r.processingHistory || []),
                                                {
                                                  date: new Date().toLocaleDateString("vi-VN"),
                                                  step: "Đồng ý nhận đơn",
                                                  actor: "Phùng Trâm Anh",
                                                  note: `Đồng ý nhận quyền quản lý đơn từ ${ts.fromOfficer}.`
                                                }
                                              ];
                                              return {
                                                ...r,
                                                nguoiNhap: "Phùng Trâm Anh",
                                                cuaToi: true,
                                                processingHistory: newHistory
                                              };
                                            }
                                            return r;
                                          });
                                        });
                                        setTransferState(prev => {
                                          const next = { ...prev };
                                          delete next[row.id];
                                          if (ts.maDons) {
                                            rows.forEach(r => {
                                              if (ts.maDons?.includes(r.maDon)) {
                                                delete next[r.id];
                                              }
                                            });
                                          }
                                          return next;
                                        });
                                        triggerNoti(`Đã xác nhận nhận đơn ${row.maDon} từ cán bộ ${ts.fromOfficer}.`);
                                      }}
                                      className="px-1.5 py-[2px] rounded text-[9.5px] font-semibold bg-[#27ae60] text-white hover:bg-[#219653] transition-colors whitespace-nowrap">
                                      Đồng ý nhận
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRows(prevRows => {
                                          const targetMaDons = (ts.maDons || [row.maDon]).map(m => m.trim().toLowerCase());
                                          return prevRows.map(r => {
                                            const ma = (r.maDon || "").trim().toLowerCase();
                                            if (targetMaDons.includes(ma)) {
                                              return {
                                                ...r,
                                                processingHistory: [
                                                  ...(r.processingHistory || []),
                                                  {
                                                    date: new Date().toLocaleDateString("vi-VN"),
                                                    step: "Từ chối nhận đơn",
                                                    actor: "Phùng Trâm Anh",
                                                    note: `Từ chối nhận quyền quản lý đơn từ ${ts.fromOfficer}.`
                                                  }
                                                ]
                                              };
                                            }
                                            return r;
                                          });
                                        });
                                        setTransferState(prev => {
                                          const next = { ...prev };
                                          delete next[row.id];
                                          if (ts.maDons) {
                                            rows.forEach(r => {
                                              if (ts.maDons?.includes(r.maDon)) {
                                                delete next[r.id];
                                              }
                                            });
                                          }
                                          return next;
                                        });
                                        triggerNoti(`Đã từ chối nhận đơn ${row.maDon} từ cán bộ ${ts.fromOfficer}.`);
                                      }}
                                      className="px-1.5 py-[2px] rounded text-[9.5px] font-semibold bg-[#c0392b] text-white hover:bg-[#a93226] transition-colors whitespace-nowrap">
                                      Từ chối
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </>)}
                      </td>

                      {/* Người nhập / Sửa — hai đầu của vòng đời đơn: ai lập ban
                          đầu, ai động vào sau cùng. Trùng tên thì kèm năm sinh
                          trong ngoặc (chữ mờ) để phân biệt. */}
                      <td className="border border-[#ddd] px-3 py-2.5 align-top">
                        {(() => {
                          const TenCB = ({ ten, ghiDe }: { ten?: string; ghiDe?: string }) => {
                            if (!ten) return null;
                            const nam = namSinh(ngaySinhTheoTen(ten, ghiDe));
                            return (
                              <span className="font-medium">
                                {ten}
                                {tenCanBoTrungLap.has(ten) && nam && (
                                  <span className="font-normal text-[#aaa]"> ({nam})</span>
                                )}
                              </span>
                            );
                          };
                          return (
                            <div className="space-y-[3px] leading-[1.5]">
                              {row.nguoiNhap && (
                                <>
                                  <div className="text-[12px]">
                                    <span className="text-[#888]">Nhập: </span>
                                    <TenCB ten={row.nguoiNhap} ghiDe={row.nguoiNhapNgaySinh} />
                                  </div>
                                  {row.ngayNhap && (
                                    <div className="text-[11px] text-[#666] whitespace-nowrap">
                                      {row.ngayNhap}{row.gioNhap ? ` ${row.gioNhap}` : ""}
                                    </div>
                                  )}
                                </>
                              )}
                              {row.nguoiSua && (
                                <div className="pt-[5px] mt-[5px] border-t border-dashed border-[#eee]">
                                  <div className="text-[12px]">
                                    <span className="text-[#888]">Sửa: </span>
                                    <TenCB ten={row.nguoiSua} ghiDe={row.nguoiSuaNgaySinh} />
                                  </div>
                                  {row.ngaySua && (
                                    <div className="text-[11px] text-[#666] whitespace-nowrap">
                                      {row.ngaySua}{row.gioSua ? ` ${row.gioSua}` : ""}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Thao tác */}
                      <td className="border border-[#ddd] px-2 py-2.5 text-center align-top">
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
                              // Đơn trùng không ghép được — ẩn luôn hành động cho
                              // khỏi mời gọi một thao tác sẽ bị từ chối.
                              onGhepDon={row.trungVoiDon ? undefined
                                : () => { setGhepDonChinh(row.id); setShowGhepDon(row.id); setOpenMenu(null); }}
                              // Bổ sung tài liệu chỉ áp dụng cho đơn Chưa đủ điều kiện
                              onBoSung={row.giaiQuyet?.nhan === "Chưa đủ điều kiện"
                                ? () => { setShowBoSungTaiLieu(row.id); setOpenMenu(null); }
                                : undefined}
                              onTaoYeuCau={() => { setShowYeuCauBoSung(row.id); setOpenMenu(null); }}
                              onDonTrung={() => { setShowDonTrung(row.id); setOpenMenu(null); }}
                              // Yêu cầu bổ sung chỉ lập cho đơn Chưa đủ điều kiện
                              onThemYCBS={row.giaiQuyet?.nhan === "Chưa đủ điều kiện"
                                ? () => { setYcbsRowId(row.id); setOpenMenu(null); }
                                : undefined}
                              onChuyenDon={() => { setShowChuyenDon(row.id); setOpenMenu(null); }}
                              onHuySoThuLy={row.giaiQuyet?.nhan === "Thụ lý mới"
                                ? () => { setShowHuySoThuLy(row.id); setOpenMenu(null); }
                                : undefined}
                              onThemKetQua={() => { setShowThemKetQua(row.id); setOpenMenu(null); }}
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
                ? "Không có bản ghi nào"
                : <>Hiển thị 1-{filteredRows.length} trong tổng <b className="text-[#1d2e4f]">{filteredRows.length}</b> bản ghi</>}
              {soBoLocDangApp > 0 && filteredRows.length !== rows.length && (
                <span className="text-[#8b1a1a]"> (đã lọc từ {rows.length} bản ghi)</span>
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
        <PopupBoSungTaiLieu
          row={rows.find(r => r.id === showBoSungTaiLieu)}
          onClose={() => setShowBoSungTaiLieu(null)}
          // Lưu kết quả bổ sung ⇒ cập nhật luôn trạng thái đơn ngoài danh sách
          onLuu={(kq) => {
            setRows(prev => prev.map(r => r.id === showBoSungTaiLieu
              ? {
                ...r,
                giaiQuyet: {
                  ...r.giaiQuyet,
                  nhan: kq === "du" ? "Thụ lý mới" : "Chưa đủ điều kiện",
                  color: kq === "du" ? "#27ae60" : "#e67e22",
                },
              }
              : r));
            triggerNoti(kq === "du"
              ? "Đã ghi nhận bổ sung tài liệu — đơn chuyển sang Thụ lý mới."
              : "Đã ghi nhận bổ sung tài liệu — đơn vẫn chưa đủ điều kiện.");
          }}
        />
      )}
      {/* Popup Hủy số thụ lý */}
      {showHuySoThuLy !== null && (() => {
        const row = rows.find(r => r.id === showHuySoThuLy);
        if (!row) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-[4px] shadow-xl w-[480px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
                <span className="text-[13px] font-semibold text-[#8b1a1a]">Cảnh báo hủy số thụ lý</span>
                <button onClick={() => setShowHuySoThuLy(null)} className="text-[#888] hover:text-[#333]"><X size={15} /></button>
              </div>
              <div className="px-5 py-4 space-y-3 text-[12px] text-[#333] leading-relaxed">
                <div className="bg-[#fff3cd] border border-[#ffeeba] rounded px-3 py-2.5 text-[#856404] font-medium">
                  Hủy số thụ lý sẽ làm mất số thụ lý của đơn này. Số thụ lý này chỉ có thể cấp cho đơn thụ lý mới khác trong cùng ngày hôm nay. Nếu để qua ngày, số thụ lý sẽ bị trống.
                </div>
                <p>
                  Sau khi hủy, đơn <strong className="text-[#1d2e4f]">{row.maDon}</strong> sẽ chuyển sang trạng thái <strong>Không thụ lý</strong>.
                </p>
              </div>
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e0e0e0]">
                <button onClick={() => setShowHuySoThuLy(null)}
                  className="h-[30px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">
                  Hủy bỏ
                </button>
                <button
                  onClick={() => {
                    setRows(prev => prev.map(r => {
                      if (r.id === row.id) {
                        const currentHistory = r.processingHistory || [];
                        const newHistory = [
                          ...currentHistory,
                          {
                            date: new Date().toLocaleDateString("vi-VN"),
                            step: "Hủy số thụ lý",
                            actor: "HCTP",
                            note: `Hủy số thụ lý ${r.giaiQuyet?.stl || ""}. Đơn chuyển sang trạng thái Không thụ lý.`
                          }
                        ];
                        return {
                          ...r,
                          giaiQuyet: {
                            nhan: "Không thụ lý",
                            color: "#c0392b",
                            stl: "",
                            coVanBan: false
                          },
                          processingHistory: newHistory
                        };
                      }
                      return r;
                    }));
                    triggerNoti(`Đơn ${row.maDon} đã hủy số thụ lý thành công và chuyển sang trạng thái Không thụ lý.`);
                    setShowHuySoThuLy(null);
                  }}
                  className="h-[30px] px-4 bg-[#c0392b] hover:bg-[#a63022] text-white rounded-[3px] text-[12px] font-medium transition-colors">
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Popup Thêm kết quả giải quyết */}
      {showThemKetQua !== null && (() => {
        const row = rows.find(r => r.id === showThemKetQua);
        if (!row) return null;
        return (
          <PopupThemKetQuaGiaiQuyet
            row={row}
            onClose={() => setShowThemKetQua(null)}
            onConfirm={(updated: any) => {
              setRows(prev => prev.map(r => r.id === row.id ? updated : r));
              triggerNoti(`Đã thêm kết quả giải quyết cho đơn ${row.maDon} thành công.`);
              setShowThemKetQua(null);
            }}
          />
        );
      })()}

      {/* Popup Chuyển đơn */}
      {showChuyenDon !== null && (() => {
        const row = rows.find(r => r.id === showChuyenDon);
        if (!row) return null;

        // Kiểm tra xem đơn này có phải Đơn kèm không
        const isDonKem = !!mergeState[row.id]?.ghepVoi;
        const normMaDon = (ma?: string) => (ma || "").trim().toLowerCase();
        const isDonChinh = Object.values(mergeState).some(item => item.ghepVoi && normMaDon(item.ghepVoi) === normMaDon(row.maDon));

        // Lấy tất cả các đơn kèm trong nhóm nếu đây là đơn chính
        const nhomDonKem = isDonChinh
          ? rows.filter(r => mergeState[r.id]?.ghepVoi && normMaDon(mergeState[r.id].ghepVoi) === normMaDon(row.maDon))
          : [];

        const allOfficers = ["Phùng Trâm Anh", "Nguyễn Văn An", "Trần Thị Bình", "Lê Thị Hà", "Phạm Văn Đức", "Hoàng Thị Thu", "Vũ Văn Yên", "Nguyễn Thị Lan", "Nguyễn Minh An"];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-[4px] shadow-xl w-[480px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
                <span className="text-[13px] font-semibold text-[#8b1a1a]">Chuyển quyền quản lý đơn</span>
                <button onClick={() => { setShowChuyenDon(null); setChuyenDonOfficer(""); setChuyenDonReason(""); }} className="text-[#888] hover:text-[#333]"><X size={15} /></button>
              </div>
              <div className="px-5 py-4 space-y-3 text-[12px]">
                {isDonKem ? (
                  <div className="bg-[#fdecea] border border-[#f5c6cb] rounded px-3 py-2 text-[#721c24]">
                    <strong>Không cho phép chuyển đơn kèm!</strong> Đơn <strong>{row.maDon}</strong> đang là đơn kèm trong nhóm. Bạn phải thực hiện <strong>Hủy ghép</strong> trước khi có thể chuyển đơn này độc lập.
                  </div>
                ) : (
                  <>
                    <div className="space-y-1 bg-[#f9f9f9] p-3 border border-[#eee] rounded-sm">
                      <div><span className="text-[#666]">Mã đơn cần chuyển: </span><span className="font-semibold text-[#1d2e4f]">{row.maDon}</span></div>
                      <div><span className="text-[#666]">Người gửi: </span><span className="text-[#333]">{row.nguoiGui}</span></div>
                      <div><span className="text-[#666]">Cán bộ xử lý hiện tại: </span><span className="font-medium text-[#333]">{row.nguoiNhap}</span></div>
                      {isDonChinh && (
                        <div className="mt-2 pt-2 border-t border-[#e6e6e6]">
                          <span className="font-bold text-[#b45309]">Cảnh báo chuyển nhóm đơn (BR-06):</span>
                          <p className="text-[11px] text-[#666] mt-0.5">
                            Đơn này là <strong>Đơn chính</strong> của nhóm. Khi chuyển, toàn bộ các đơn kèm dưới đây sẽ được chuyển cùng sang cán bộ mới:
                          </p>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-[#555]">
                            {nhomDonKem.map(dk => (
                              <li key={dk.id}><strong>{dk.maDon}</strong> ({dk.nguoiGui})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">Chọn cán bộ nhận <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select value={chuyenDonOfficer} onChange={e => setChuyenDonOfficer(e.target.value)}
                          className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                          <option value="">-- Chọn cán bộ nhận --</option>
                          {allOfficers.filter(name => name !== row.nguoiNhap).map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">Lý do chuyển đơn <span className="text-red-500">*</span></label>
                      <textarea rows={3} value={chuyenDonReason} onChange={e => setChuyenDonReason(e.target.value)}
                        placeholder="Nhập lý do chuyển quyền quản lý đơn..."
                        className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#1a73e8] resize-none" />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e0e0e0]">
                <button onClick={() => { setShowChuyenDon(null); setChuyenDonOfficer(""); setChuyenDonReason(""); }}
                  className="h-[30px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[3px] text-[12px] font-medium transition-colors">
                  Đóng
                </button>
                {!isDonKem && (
                  <button
                    onClick={() => {
                      if (!chuyenDonOfficer || !chuyenDonReason.trim()) return;

                      const targetMaDons = [row.maDon, ...nhomDonKem.map(dk => dk.maDon)];

                      setTransferState(prev => {
                        const next = { ...prev };
                        next[row.id] = {
                          toOfficer: chuyenDonOfficer,
                          fromOfficer: row.nguoiNhap,
                          reason: chuyenDonReason,
                          isGroup: isDonChinh,
                          maDons: targetMaDons
                        };
                        nhomDonKem.forEach(dk => {
                          next[dk.id] = {
                            toOfficer: chuyenDonOfficer,
                            fromOfficer: dk.nguoiNhap,
                            reason: chuyenDonReason,
                            isGroup: false,
                            maDons: [dk.maDon]
                          };
                        });
                        return next;
                      });

                      const msg = isDonChinh
                        ? `Đã gửi yêu cầu chuyển toàn bộ nhóm đơn (Đơn chính ${row.maDon} và ${nhomDonKem.length} đơn kèm) sang cán bộ ${chuyenDonOfficer}. Chờ xác nhận.`
                        : `Đã gửi yêu cầu chuyển đơn ${row.maDon} sang cán bộ ${chuyenDonOfficer}. Chờ xác nhận.`;

                      triggerNoti(msg);

                      setShowChuyenDon(null);
                      setChuyenDonOfficer("");
                      setChuyenDonReason("");
                    }}
                    disabled={!chuyenDonOfficer || !chuyenDonReason.trim()}
                    className="h-[30px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] text-white rounded-[3px] text-[12px] font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                    Xác nhận chuyển
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

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
        const row = rows.find(r => r.id === ghepDonChinh) ?? rows[0];
        return (
          <PopupXacNhanGhep
            donChinh={{ maDon: row.maDon, nguoiGui: row.nguoiGui, soBA: row.thongTinDon.soBaqd, ngayBA: row.thongTinDon.ngay, toaXetXu: row.thongTinDon.toaXetXu }}
            donGhep={ghepSelected}
            onClose={() => { setShowXacNhan(false); setGhepSelected([]); }}
            onConfirm={() => {
              // Ghép ngay lập tức (vì chỉ được phép ghép đơn của cùng cán bộ xử lý)
              const donChinhRow = rows.find(r => r.id === ghepDonChinh) ?? rows[0];
              setMergeState(prev => {
                const next = { ...prev };
                ghepSelected.forEach(d => {
                  next[d.id] = { ghepVoi: donChinhRow.maDon };
                });
                return next;
              });
              triggerNoti(`Đơn [${ghepSelected.map(d => d.maDon).join("], [")}] đã được ghép thành công vào đơn chính [${donChinhRow.maDon}].`);
              setShowXacNhan(false);
              setGhepSelected([]);
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
          // Sang màn Danh sách văn bản, lọc sẵn theo mã đơn khi chỉ trình 1 đơn
          onXemVanBanDaTrinh={() => {
            const ds = filteredRows.filter(r => selectedRows.includes(r.id));
            const dsTrinh = ds.length > 0 ? ds : filteredRows;
            setShowNumberingModal(null);
            onXemVanBanDaTrinh?.(dsTrinh.length === 1 ? dsTrinh[0].maDon.trim() : "");
          }}
          onClose={() => setShowNumberingModal(null)}
          // Một đơn có thể lọt vào nhiều văn bản; lấy bản có số làm đại diện
          // (cụ thể hơn cho người dùng), kèm số lượng còn lại nếu có.
          donTrung={donTrungMap}
        />
      )}

      {/* Thêm yêu cầu bổ sung từ menu thao tác — mở thẳng modal Lưu số văn bản
          ở loại "Yêu cầu bổ sung", chỉ với đúng đơn vừa chọn */}
      {ycbsRowId !== null && (() => {
        const donYcbs = rows.find(r => r.id === ycbsRowId);
        if (!donYcbs) return null;
        return (
          <DocumentNumberingModal
            isOpen={true}
            currentRole={currentRole}
            loaiVanBanMacDinh="Yêu cầu bổ sung"
            selectedRows={[donYcbs]}
            onTrinhDuyet={(kq) => onTaoVanBan?.(kq)}
            onXemVanBanDaTrinh={() => {
              setYcbsRowId(null);
              onXemVanBanDaTrinh?.(donYcbs.maDon.trim());
            }}
            onClose={() => setYcbsRowId(null)}
            donTrung={donTrungMap}
          />
        );
      })()}

      {/* In danh sách đơn theo bộ lọc đang áp */}
      {showInDanhSach && (
        <PopupInDanhSachDon
          rows={rowsDeIn}
          moTaBoLoc={selectedRows.length ? [...moTaBoLoc, `${selectedRows.length} đơn được chọn`] : moTaBoLoc}
          nguoiIn={nguoiTheoVaiTro(currentRole)}
          tieuDe={tieuDeIn}
          phuDe={phuDeIn}
          onDong={() => setShowInDanhSach(false)}
        />
      )}

      {/* Popup Thêm đơn trùng */}
      {showDonTrung !== null && (() => {
        const goc = rows.find(r => r.id === showDonTrung);
        return goc ? (
          <PopupThemDonTrung donGoc={goc} onDong={() => setShowDonTrung(null)}
            onLuu={(ds) => taoDonTrung(goc, ds)} />
        ) : null;
      })()}

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
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
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
  row, onBack, vanBanList, setVanBanList, currentRole = "can-bo", vbId,
}: {
  row: typeof SAMPLE_ROWS[0];
  onBack: () => void;
  /** Kho văn bản dùng chung. Trước đây màn này đọc một mảng hardcode 3 dòng
   *  nên bấm từ đơn nào cũng ra cùng kết quả và không bao giờ thấy văn bản
   *  vừa tạo. Giờ lọc thật theo đơn đang mở. */
  vanBanList?: VanBanTrinh[];
  setVanBanList?: React.Dispatch<React.SetStateAction<VanBanTrinh[]>>;
  currentRole?: string;
  /** Văn bản cụ thể được bấm ở màn Danh sách đơn — chỉ hiện đúng dòng này,
   *  không hiện cả kho văn bản của đơn. */
  vbId?: string | null;
}) => {
  const vanBanTheoDon = timVanBanTheoDon(vanBanList ?? [], row.maDon);
  const vanBanCuaDon = vbId ? vanBanTheoDon.filter(v => v.id === vbId) : vanBanTheoDon;
  // Panel chi tiết mở NGAY TẠI ĐÂY thay vì nhảy sang màn khác — giữ nguyên bối
  // cảnh "tôi đang xem văn bản của đơn Mã 7031". Nếu đến từ nút "văn bản trình
  // ký" ở Danh sách đơn (đã có vbId), mở panel ngay, khỏi bắt bấm thêm lần nữa.
  const [chonId, setChonId] = useState<string | null>(vbId ?? null);
  const chon = (vanBanList ?? []).find(v => v.id === chonId) ?? null;
  const { nguoi: nguoiDung, chucVu } = nguoiTheoVaiTro(currentRole);
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
                <th className="px-3 py-2.5 text-left font-semibold text-[#333] w-[190px]">Tiến trình</th>
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
                  <tr key={vb.id} onClick={() => setChonId(vb.id)}
                    className={`border-b border-[#f0f0f0] hover:bg-[#f0f7ff] cursor-pointer ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                    <td className="px-3 py-2.5 text-[#1a5a96] font-medium">{i + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#222]">{vb.loaiVanBan}</td>
                    <td className="px-3 py-2.5">
                      {vb.soVanBan
                        ? <span className="text-[#1a5a96] hover:underline font-mono text-[12px]">{vb.soVanBan}</span>
                        : <span className="text-[#888] italic text-[12px]">— chưa số —</span>}
                    </td>
                    <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">
                      {vb.ngayBanHanh ?? vb.ngayCapSo ?? "—"}
                    </td>
                    <td className="px-3 py-2.5"><TienTrinhGon vb={vb} /></td>
                    <td className="px-3 py-2.5 font-medium text-[#333]">{nguoiKy?.nguoi ?? "—"}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-block px-2 py-[2px] rounded-full text-[10px] font-medium border ${TRANG_THAI_CLS[vb.trangThai]}`}>
                        {TRANG_THAI_NHAN[vb.trangThai]}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[#555]">{vb.nguoiTao}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={(e) => { e.stopPropagation(); setChonId(vb.id); }} title="Xem chi tiết & lịch sử"
                        className="text-[#555] hover:text-[#8b1a1a] transition-colors">
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {vanBanCuaDon.length === 0 && (
                <tr><td colSpan={9} className="py-12 text-center">
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
            <span>Hiển thị {vanBanCuaDon.length ? `1-${vanBanCuaDon.length}` : "0"} / {vanBanCuaDon.length}</span>
            <button className="w-[26px] h-[26px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee]">‹</button>
            <button className="w-[26px] h-[26px] flex items-center justify-center border border-[#8b1a1a] rounded bg-[#8b1a1a] text-white">1</button>
            <button className="w-[26px] h-[26px] flex items-center justify-center border border-[#ddd] rounded text-[#666] hover:bg-[#eee]">›</button>
          </div>
        </div>
      </div>

      {/* Panel chi tiết mở tại chỗ — không rời khỏi bối cảnh đơn đang xem */}
      {chon && setVanBanList && (
        <PanelChiTiet vb={chon} nguoiDung={nguoiDung} chucVu={chucVu}
          danhSach={vanBanList ?? []}
          onCapNhat={(vbMoi) => setVanBanList(ds => ds.map(v => v.id === vbMoi.id ? vbMoi : v))}
          onClose={() => setChonId(null)} />
      )}
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
  /** Số tờ trình phân công đã lập cho đơn này. Có giá trị = thẩm phán đã được
   *  chốt trong văn bản trình ký, cán bộ không tự đổi ở màn này được nữa. */
  toTrinh?: string;
}[] = [
    { id: 1, soThuLy: "01/2026/GĐT-HS", ngayThuLy: "05/07/2026", nguoiDungDon: "Nguyễn Văn An", diaChi: "Số 12 Lê Duẩn, Hà Nội", soBA: "15/2023/HS-PT", ngayBA: "12/03/2023", toaBA: "TAND tỉnh Bắc Ninh", loaiAn: "Hình sự", hinhThuc: "Đề nghị GĐT", thamPhan: "", capGiaiQuyet: "bac3" },
    { id: 2, soThuLy: "02/2026/GĐT-DS", ngayThuLy: "08/07/2026", nguoiDungDon: "Trần Thị Bình", diaChi: "45 Trần Hưng Đạo, TP.HCM", soBA: "08/2022/DS-PT", ngayBA: "20/06/2022", toaBA: "TAND tỉnh Vĩnh Phúc", loaiAn: "Dân sự", hinhThuc: "Đề nghị TT", thamPhan: "Nguyễn Thị Lan", capGiaiQuyet: "toicao", toTrinh: "TTr-118/2026" },
    { id: 3, soThuLy: "03/2026/GĐT-KDTM", ngayThuLy: "10/07/2026", nguoiDungDon: "Công ty TNHH Minh Đức", diaChi: "18 Nguyễn Huệ, Đà Nẵng", soBA: "33/2024/KDTM-PT", ngayBA: "15/11/2024", toaBA: "TAND cấp cao tại HN", loaiAn: "Kinh doanh thương mại", hinhThuc: "Đề nghị GĐT", thamPhan: "Trần Văn Hùng", capGiaiQuyet: "toicao", toTrinh: "TTr-119/2026" },
    { id: 4, soThuLy: "04/2026/TT-HC", ngayThuLy: "14/07/2026", nguoiDungDon: "Lê Văn Cường", diaChi: "72 Đinh Tiên Hoàng, Huế", soBA: "21/2021/HC-PT", ngayBA: "05/09/2021", toaBA: "TAND tỉnh Hà Nam", loaiAn: "Hành chính", hinhThuc: "Đề nghị TT", thamPhan: "Trần Văn Hùng", capGiaiQuyet: "bac3" },
    { id: 5, soThuLy: "05/2026/GĐT-LĐ", ngayThuLy: "16/07/2026", nguoiDungDon: "Phạm Thị Dung", diaChi: "33 Bà Triệu, Hải Phòng", soBA: "07/2023/LĐ-PT", ngayBA: "18/04/2023", toaBA: "TAND tỉnh Quảng Ninh", loaiAn: "Lao động", hinhThuc: "Đề nghị GĐT", thamPhan: "Trần Văn Hùng", capGiaiQuyet: "toicao" },
    { id: 6, soThuLy: "06/2026/GĐT-DS", ngayThuLy: "18/07/2026", nguoiDungDon: "Hoàng Văn Thái", diaChi: "20 Cầu Giấy, Hà Nội", soBA: "45/2024/DS-PT", ngayBA: "10/01/2025", toaBA: "TAND TP Hà Nội", loaiAn: "Dân sự", hinhThuc: "Đề nghị GĐT", thamPhan: "", capGiaiQuyet: "toicao" },
    { id: 7, soThuLy: "07/2026/TT-HS", ngayThuLy: "19/07/2026", nguoiDungDon: "Lê Thị Hồng", diaChi: "150 Nguyễn Trãi, TP.HCM", soBA: "12/2023/HS-PT", ngayBA: "22/08/2023", toaBA: "TAND TP HCM", loaiAn: "Hình sự", hinhThuc: "Đề nghị TT", thamPhan: "", capGiaiQuyet: "bac3" },
    { id: 8, soThuLy: "08/2026/GĐT-HNGĐ", ngayThuLy: "21/07/2026", nguoiDungDon: "Đinh Tuấn Tài", diaChi: "55 Láng Hạ, Hà Nội", soBA: "09/2023/HNGĐ-PT", ngayBA: "05/05/2023", toaBA: "TAND tỉnh Thái Bình", loaiAn: "Hôn nhân gia đình", hinhThuc: "Đề nghị GĐT", thamPhan: "Lê Thị Mai", capGiaiQuyet: "bac3", toTrinh: "TTr-124/2026" },
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

const PhanCongThamPhan = ({ initialTab = 0, onOpenThamPhanPopup, currentRole = "can-bo" }: {
  initialTab?: 0 | 1 | 2; onOpenThamPhanPopup?: () => void; currentRole?: string;
}) => {
  const [tab, setTab] = useState<0 | 1 | 2>(initialTab);
  // Người duyệt tờ trình phân công là Trưởng phòng — bước "duyet" đầu tiên của
  // luongToTrinhPhanCong(). Chỉ vai trò này mới được đổi thẩm phán sau khi đơn
  // đã nằm trong tờ trình; các vai trò còn lại chỉ xem.
  const laNguoiDuyetToTrinh = currentRole === "truong-phong";
  const [selectedThamPhanBulk, setSelectedThamPhanBulk] = useState("");
  const [lyDoChiDinh, setLyDoChiDinh] = useState("");
  const [coLyDoDacBiet, setCoLyDoDacBiet] = useState(false);
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
  const [showLyDoPopup, setShowLyDoPopup] = useState<{ show: boolean, thamPhan: string }>({ show: false, thamPhan: "" });
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

  // Tồn đọng chưa phân công — đếm trên TOÀN BỘ danh sách, không theo bộ lọc.
  // Đây là con số "còn bao nhiêu việc phải làm", bộ lọc chỉ là cách nhìn tạm
  // thời nên không được làm nó nhỏ đi. Phần đang hiển thị nói riêng ở vế sau.
  const soChuaPhanCong = rows.filter(r => !assignMap[r.id]).length;

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
          {/* Nhắc tồn đọng — chỉ ở 2 tab chưa phân công, vì đó là nơi cán bộ
              đang xử lý việc này. Tab Quản lý kết quả không cần. */}
          {tab !== 2 && (
            <div className="ml-auto flex items-center pr-4">
              {soChuaPhanCong > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-[3px] text-[11px] font-medium bg-[#fef3e2] text-[#b45309] border border-[#fcd48a]">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  Còn <b className="font-bold">{soChuaPhanCong}</b> vụ án chưa được phân công
                  {/* Bộ lọc đang cắt bớt thì nói rõ, nếu không con số trên nhãn
                      và số dòng dưới bảng lệch nhau mà không rõ vì sao. */}
                  {filtered.length !== soChuaPhanCong && (
                    <span className="font-normal text-[#8a6d3b]">· đang hiển thị {filtered.length}</span>
                  )}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-[3px] text-[11px] font-medium bg-[#e8f7ee] text-[#1a7a45] border border-[#a9debb]">
                  <Check size={12} className="flex-shrink-0" />
                  Đã phân công hết
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bộ lọc — DÙNG CHUNG cho cả 3 tab. Trước đây chỉ tab Quản lý kết quả
            mới có đủ ô lọc, hai tab chưa phân công chỉ có mỗi radio Cấp thẩm
            phán; cùng một danh sách đơn mà mỗi tab lọc được một kiểu thì cán bộ
            phải nhảy sang tab khác mới tìm được đơn cần phân công. */}
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
            <div className="flex flex-col gap-2 w-full">
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
                    value={selectedThamPhanBulk}
                    onChange={(e) => setSelectedThamPhanBulk(e.target.value)}
                    className="w-full h-[28px] px-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]"
                  >
                    <option value="">-- Chọn thẩm phán --</option>
                    {THAM_PHAN_OPTIONS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                </div>
                <input 
                  type="text" 
                  placeholder="Lý do phân công chỉ định..." 
                  value={lyDoChiDinh} 
                  onChange={e => setLyDoChiDinh(e.target.value)}
                  className="flex-1 h-[28px] px-2 text-[12px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]"
                />
                <button
                  disabled={!selectedThamPhanBulk || !lyDoChiDinh.trim() || selectedRows.length === 0}
                  onClick={() => {
                    setAssignMap(p => {
                      const n = { ...p };
                      selectedRows.forEach(id => { n[id] = selectedThamPhanBulk; });
                      return n;
                    });
                    setSelectedThamPhanBulk("");
                    setLyDoChiDinh("");
                    setCoLyDoDacBiet(false);
                    setSelectedRows([]);
                  }}
                  className="h-[28px] px-4 bg-[#8b1a1a] hover:bg-[#6e1414] disabled:bg-[#ccc] disabled:cursor-not-allowed text-white rounded-[3px] text-[12px] font-medium transition-colors whitespace-nowrap"
                >
                  Phân công
                </button>
              </div>
              <div className="flex items-center gap-1.5 ml-[134px]">
                <input 
                  type="checkbox" 
                  checked={coLyDoDacBiet} 
                  onChange={e => setCoLyDoDacBiet(e.target.checked)}
                  id="coLyDoDacBietCheckbox"
                  className="w-[13px] h-[13px] accent-[#8b1a1a]"
                />
                <label htmlFor="coLyDoDacBietCheckbox" className="text-[12px] text-[#333] cursor-pointer select-none">
                  Có lý do đặc biệt, các đơn này sẽ không phải làm tờ trình mà chỉ cần làm công văn chuyển nội bộ
                </label>
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
                      /* Đơn đã có tờ trình: thẩm phán đã được chốt trong văn bản
                         trình ký. Sửa ở đây sẽ khiến hồ sơ và tờ trình đã trình
                         nói hai chuyện khác nhau, nên khóa lại — trừ người duyệt
                         tờ trình, vì họ chính là người có thẩm quyền bác/đổi. */
                      row.toTrinh && !laNguoiDuyetToTrinh ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-medium ${assignMap[row.id] ? "text-[#27ae60]" : "text-[#999]"}`}>
                              {assignMap[row.id] || "—"}
                            </span>
                            <Ban size={11} className="text-[#b45309] flex-shrink-0" />
                          </div>
                          <div className="text-[10px] text-[#b45309] leading-snug"
                            title="Đã lập tờ trình — chỉ người duyệt tờ trình mới đổi được thẩm phán.">
                            <b className="font-semibold">{row.toTrinh.replace(/^TTr-/, "Số tờ trình-")}</b>
                          </div>
                        </div>
                      ) : editingRow === row.id ? (
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
                                {/* Lý do — BẮT BUỘC. Đổi thẩm phán giữa chừng là thay đổi
                              có hệ quả tố tụng, hồ sơ phải giải trình được vì sao. */}
                                <div>
                                  <label className="block text-[10px] text-[#888] mb-0.5">
                                    Lý do sửa phân công <span className="text-[#8b1a1a]">*</span>
                                  </label>
                                  <textarea value={currentEditForm.lyDo}
                                    onChange={e => setEditFormMap(p => ({ ...p, [row.id]: { ...(p[row.id] ?? { ngaySua: "", lyDo: "" }), lyDo: e.target.value } }))}
                                    placeholder="Nhập lý do..."
                                    rows={2}
                                    className={`w-full px-2 py-1 text-[11px] border rounded-[3px] focus:outline-none resize-none
                                ${currentEditForm.lyDo.trim().length >= 10 ? "border-[#ccc] focus:border-[#1a73e8]" : "border-[#8b1a1a]"}`} />
                                  {currentEditForm.lyDo.trim().length < 10 && (
                                    <div className="text-[10px] text-[#8b1a1a] mt-0.5 leading-snug">
                                      Nhập lý do để lưu (tối thiểu 10 ký tự).
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 pt-0.5">
                                  <button
                                    disabled={currentEditForm.lyDo.trim().length < 10}
                                    title={currentEditForm.lyDo.trim().length < 10 ? "Nhập lý do sửa phân công để lưu" : undefined}
                                    onClick={() => setEditingRow(null)}
                                    className={`flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-white transition-colors
                                ${currentEditForm.lyDo.trim().length < 10 ? "bg-[#b7d3c0] cursor-not-allowed" : "bg-[#27ae60] hover:bg-[#1e8449]"}`}>
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
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-medium ${assignMap[row.id] ? "text-[#27ae60]" : "text-[#999]"}`}>
                              {assignMap[row.id] || "—"}
                            </span>
                            <button onClick={() => startEdit(row.id)}
                              className="flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-medium text-[#1a5a96] hover:bg-[#e8f0fe] transition-colors whitespace-nowrap">
                              <Pencil size={10} /> Sửa
                            </button>
                          </div>
                          {/* Người duyệt vẫn sửa được, nhưng phải biết mình đang
                              động vào đơn đã nằm trong tờ trình nào. */}
                          {row.toTrinh && (
                            <div className="text-[10px] text-[#b45309] leading-snug">
                              Đã lập tờ trình <b className="font-semibold">{row.toTrinh}</b> — bạn đổi được với quyền duyệt tờ trình.
                            </div>
                          )}
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

      {/* Lý do phân công chỉ định — BẮT BUỘC.
          Phân công chỉ định không qua bốc thăm ngẫu nhiên nên phải ghi rõ căn cứ,
          nếu không hồ sơ không giải trình được vì sao chọn đúng thẩm phán đó.
          State showLyDoPopup đã có sẵn từ trước nhưng popup chưa bao giờ được
          render — chọn thẩm phán xong không có gì hiện ra. */}
      {showLyDoPopup.show && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50"
          onClick={() => { setShowLyDoPopup({ show: false, thamPhan: "" }); setLyDoChiDinh(""); }}>
          <div className="bg-white rounded-[6px] w-[520px] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="text-[15px] font-bold">Lý do phân công chỉ định</div>
              <button onClick={() => { setShowLyDoPopup({ show: false, thamPhan: "" }); setLyDoChiDinh(""); }}
                className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>

            <div className="p-4">
              <div className="text-[12px] leading-relaxed mb-3.5">
                <span className="text-[#666]">Chỉ định cho: </span>
                <b className="text-[#333]">{showLyDoPopup.thamPhan}</b><br />
                <span className="text-[#666]">Áp dụng cho: </span>
                <b className="text-[#333]">
                  {selectedRows.length > 0 ? `${selectedRows.length} vụ án đã chọn` : "chưa chọn vụ án nào"}
                </b>
              </div>

              <label className="block text-[11px] font-medium mb-1.5">
                Lý do phân công <span className="text-[#8b1a1a]">*</span>
              </label>
              <textarea value={lyDoChiDinh} onChange={e => setLyDoChiDinh(e.target.value)} rows={4} autoFocus
                placeholder="Ví dụ: Thẩm phán đã thụ lý vụ án liên quan, bảo đảm tính liên tục trong giải quyết…"
                aria-describedby="loi-ly-do-chi-dinh"
                className={`w-full border rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none
                  ${lyDoChiDinh.trim() ? "border-[#ccc] focus:border-[#1a73e8]" : "border-[#8b1a1a]"}`} />
              {!lyDoChiDinh.trim() && (
                <div id="loi-ly-do-chi-dinh" className="text-[11px] mt-1 text-[#8b1a1a]">
                  Nhập lý do phân công để tiếp tục.
                </div>
              )}

              <div className="mt-3.5 bg-[#fef3e2] border border-[#fcd48a] text-[#b45309] rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <div>Phân công chỉ định không qua bốc thăm ngẫu nhiên — lý do sẽ được lưu vào hồ sơ vụ án.</div>
              </div>
            </div>

            <div className="border-t border-[#e0e0e0] px-4 py-3 flex justify-end gap-2">
              <button onClick={() => { setShowLyDoPopup({ show: false, thamPhan: "" }); setLyDoChiDinh(""); }}
                className="h-[28px] px-3 rounded-[3px] border border-[#ccc] text-[12px] font-medium text-[#333] hover:bg-[#f5f5f5]">
                Huỷ
              </button>
              <button
                disabled={!lyDoChiDinh.trim() || selectedRows.length === 0}
                title={selectedRows.length === 0 ? "Chọn ít nhất một vụ án trong bảng" : undefined}
                onClick={() => {
                  setAssignMap(p => {
                    const n = { ...p };
                    selectedRows.forEach(id => { n[id] = showLyDoPopup.thamPhan; });
                    return n;
                  });
                  setShowLyDoPopup({ show: false, thamPhan: "" });
                  setLyDoChiDinh("");
                  setSelectedRows([]);
                }}
                className={`h-[28px] px-3 rounded-[3px] text-[12px] font-medium text-white transition-colors
                  ${!lyDoChiDinh.trim() || selectedRows.length === 0
                    ? "bg-[#d9c4c4] cursor-not-allowed" : "bg-[#8b1a1a] hover:bg-[#6e1414]"}`}>
                Xác nhận phân công
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [showLichSuYKien, setShowLichSuYKien] = useState(false);
  const isToTrinh = docType.toLowerCase().includes("tờ trình") || docType.toLowerCase().includes("to trinh");

  return (
    <>
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
                    className={`pb-2 text-[14px] font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === i ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#333]"
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
                              <button onClick={() => setShowLichSuYKien(true)} className="text-[11px] text-[#1a5a96] hover:underline font-medium flex items-center gap-0.5">
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
                      - Như kính trình;<br />
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

      {showLichSuYKien && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] shadow-2xl border border-[#d0d0d0] w-[560px] max-w-[95vw] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-start justify-between px-5 py-4 border-b border-[#eee] flex-shrink-0">
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-[#222]">Lịch sử cho ý kiến</span>
                <span className="text-[11px] text-[#888] mt-0.5">Đơn: TLMT-10 | Người gửi: Trần Văn Hùng | Ngày nhận: 22/05/2026</span>
              </div>
              <button onClick={() => setShowLichSuYKien(false)} className="text-[#888] hover:text-[#333] -mt-1"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="border border-[#e0e0e0] rounded-[4px] overflow-hidden">
                <table className="w-full text-[12px] border-collapse">
                  <thead>
                    <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                      <th className="px-3 py-2 text-left font-bold text-[#333] uppercase tracking-wide text-[11px] border-r border-[#e0e0e0]">Ngày</th>
                      <th className="px-3 py-2 text-left font-bold text-[#333] uppercase tracking-wide text-[11px] border-r border-[#e0e0e0]">Người cho ý kiến</th>
                      <th className="px-3 py-2 text-left font-bold text-[#333] uppercase tracking-wide text-[11px]">Nội dung ý kiến</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { ngay: "15/05/2026", nguoi: "Nguyễn Văn B", chucVu: "Vụ trưởng", noiDung: "Trả lời đơn" },
                      { ngay: "10/05/2026", nguoi: "Trần Văn C", chucVu: "Thẩm tra viên", noiDung: "Trả lời đơn" },
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-[#eee] last:border-b-0">
                        <td className="px-3 py-2.5 text-[#888] align-top whitespace-nowrap border-r border-[#eee]">{r.ngay}</td>
                        <td className="px-3 py-2.5 align-top border-r border-[#eee]">
                          <span className="font-bold text-[#222]">{r.nguoi} ({r.chucVu})</span>
                        </td>
                        <td className="px-3 py-2.5 text-[#555] align-top">{r.noiDung}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end px-5 py-3 border-t border-[#eee] bg-[#fafafa] flex-shrink-0">
              <button onClick={() => setShowLichSuYKien(false)} className="h-[32px] px-4 border border-[#ccc] text-[#555] hover:bg-[#f5f5f5] rounded-[4px] text-[12px] font-medium transition-colors">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  // Nếu URL có #don=... thì tab này mở thẳng màn đơn (giống Thêm mới) với dữ
  // liệu của đơn đó đã được điền sẵn.
  const [isLienThongMode, setIsLienThongMode] = useState(false);
  const [activeDonLienThong, setActiveDonLienThong] = useState<DonTiepNhan | null>(null);
  const [donChiTietTabMoi] = useState<DonLienQuan | null>(docDonTuHash);
  const [view, setView] = useState<"home" | "list" | "lienthong" | "form" | "prototype" | "bieumau" | "wordeditor" | "phancong" | "phe_duyet" | "nhandon_tl" | "cauhinh_pctp" | "van_ban_trinh_ky" | "hieu_suat_chi_tiet" | "so_sanh_loai_an">(donChiTietTabMoi ? "form" : "list");
  const [soSanhLoaiAnKy, setSoSanhLoaiAnKy] = useState<KyBaoCao>("year");

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
    // Tờ trình phân công còn một bước nữa sau ký số: Chánh án/Phó Chánh án bút phê
    if (laToTrinhPhanCong(kq.loaiVanBan)) {
      const b = luongToTrinhPhanCong().find(x => x.vaiTro === "but_phe")!;
      luongKy.push({ ...b, thuTu: luongKy.length + 1 });
    }
    const nguoiTao = kq.nguoiTao || nguoiTheoVaiTro(currentRole).nguoi;
    const vb = taoTuModal({ ...kq, nguoiTao, luongKy });
    // Bấm "Trình duyệt" nghĩa là tạo XONG và trình luôn — không dừng ở Nháp.
    const daTrinh = luongKy.length ? apTrinhDuyet(vb, nguoiTao, "Cán bộ", kq.yKienTrinh) : vb;
    setVanBanList(ds => [daTrinh, ...ds]);
    setVbVuaTao(daTrinh.id);
    addNotification(`Đã trình ${daTrinh.soVanBan ?? "văn bản"} — đang chờ ${luongKy[0]?.nguoi ?? "duyệt"}`);
  };
  /** Từ Danh sách đơn bấm chip "Đã có trong 545/…" → mở thẳng panel văn bản đó. */
  const [moVanBanId, setMoVanBanId] = useState<string | null>(null);
  const moVanBan = (id: string) => { setMoVanBanId(id); setView("van_ban_trinh_ky"); };

  /** Bấm "Xem văn bản đã trình" ở popup Trình duyệt thành công — nút "Đóng" của
   *  popup không điều hướng, cán bộ ở lại Danh sách đơn. */
  const [locMaDonVanBan, setLocMaDonVanBan] = useState<string | null>(null);
  const xemVanBanDaTrinh = (maDon: string) => {
    setLocMaDonVanBan(maDon || null);
    setView("van_ban_trinh_ky");
  };

  const [currentRole, setCurrentRole] = useState<"can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an">("can-bo");
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
  // Dòng "Văn bản trình ký" cụ thể mà cán bộ bấm vào ở màn Danh sách đơn —
  // màn Danh sách biểu mẫu chỉ hiện đúng dòng này, không hiện cả kho văn bản
  // của đơn.
  const [bieuMauVbId, setBieuMauVbId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [phanCongTab, setPhanCongTab] = useState<0 | 1 | 2>(0);
  // Tab mở sẵn ở Danh sách đơn khi nhấn đúp 1 trạng thái trong panel "Phân loại
  // đơn nhận" trên Trang chủ.
  const [danhSachDonTab, setDanhSachDonTab] = useState(0);
  // Bật sẵn bộ lọc "Quá hạn giải quyết" khi bấm vào card cảnh báo cùng tên
  // trên Trang chủ — luôn đi kèm danhSachDonTab = 0 (Tổng số).
  const [danhSachDonQuaHanOnly, setDanhSachDonQuaHanOnly] = useState(false);
  // Tab mở sẵn ở Danh sách văn bản khi bấm "Xem chi tiết" ở card "Đơn của tôi"
  // trên Trang chủ.
  const [vanBanTrinhKyTab, setVanBanTrinhKyTab] = useState<TabDS>("all");
  // Tab mở sẵn ở màn Phê duyệt và đề xuất khi bấm "Xem chi tiết" ở card
  // "Tài liệu cần duyệt" / "Tài liệu đã duyệt" trên Trang chủ.
  const [pheDuyetTab, setPheDuyetTab] = useState<TabPD>("cho_duyet");
  const [showPopup, setShowPopup] = useState(false);
  const [showBiCaoPopup, setShowBiCaoPopup] = useState(false);
  // Danh sách bị cáo (án hình sự) — điền tự động sau khi tra cứu bản án
  const [biCao, setBiCao] = useState<(NguoiTuBanAn & { id: number })[]>([]);
  const [quanHePhapLuat, setQuanHePhapLuat] = useState("");
  // Đánh dấu các dòng do hệ thống điền, để cán bộ biết cần rà lại
  const [nguoiTuDong, setNguoiTuDong] = useState(false);
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
  const [hinhThuc, setHinhThuc] = useState(
    donChiTietTabMoi
      ? (/kiến nghị/i.test(donChiTietTabMoi.hinhThuc) ? "CV kiến nghị GĐT-TT" : "Đơn đề nghị GĐT-TT")
      : "Đơn đề nghị GĐT-TT");
  const [loaiDonChuyenDon, setLoaiDonChuyenDon] = useState("Đơn đề nghị GĐT-TT");
  const isDon = LOAI_DON.has(hinhThuc);
  const isKhangNghi = hinhThuc === LOAI_KHANG_NGHI;
  const isDonKhieuNaiTuPhap = hinhThuc === "Đơn khiếu nại tố cáo trong tố tụng" || (hinhThuc === "CV chuyển đơn" && loaiDonChuyenDon === "Đơn khiếu nại tố cáo trong tố tụng");
  const isDonKhac = hinhThuc === "Đơn khác";
  const isCVKemDon = hinhThuc === "CV chuyển đơn";
  // CV kiến nghị: bản thân đơn là công văn ⇒ chỉ có đúng MỘT công văn, nhập
  // thẳng trên form thay vì bảng danh sách + popup thêm.
  const isCVKienNghi = hinhThuc === "CV kiến nghị GĐT-TT";
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
  // Số hiệu và hai mốc ngày của chính lá đơn. "Ngày tòa nhận" và "Ngày ghi trên
  // đơn" là hai mốc khác nhau — một là lúc đơn tới tòa, một là ngày người gửi
  // đề trên đơn — và cột Thông tin người gửi ở Danh sách đơn in cả hai, nên
  // phải nhập cả hai chứ không suy được cái này từ cái kia.
  const [soHieuDon, setSoHieuDon] = useState("");
  const [ngayToaNhan, setNgayToaNhan] = useState("");
  const [ngayGhiTrenDon, setNgayGhiTrenDon] = useState("");
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
  const [showDonViChuyenDenDD, setShowDonViChuyenDenDD] = useState(false);
  const [caNhanChuyenDen, setCaNhanChuyenDen] = useState("");
  const [lyDoLuuTheoDoi, setLyDoLuuTheoDoi] = useState("");
  const [lyDoTraLai, setLyDoTraLai] = useState("");
  const [yeuCauTraLai, setYeuCauTraLai] = useState("");
  // Popup sửa kết quả xử lý đơn (mục 5)
  const [showSuaKetQuaXuLy, setShowSuaKetQuaXuLy] = useState(false);
  const [xemChiTietHistory, setXemChiTietHistory] = useState<any>(null);

  // Đơn chuyển sang Tòa khác / Ngoài tòa án thì TAND tối cao không thẩm định
  // nội dung — cơ quan nhận mới là nơi cần thông tin bản án. Bắt cán bộ nhập đủ
  // ở đây chỉ tạo dữ liệu chép tay không ai dùng, nên bỏ dấu bắt buộc.
  // Ô vẫn hiện và vẫn nhập được nếu cán bộ có sẵn thông tin.
  const chuyenDiNoiKhac = noiChuyenDen === "Tòa khác" || noiChuyenDen === "Ngoài tòa án";
  const [chanhAnHoacToaAn, setChanhAnHoacToaAn] = useState("Tòa án");
  const [coBanAnLienQuan, setCoBanAnLienQuan] = useState(false);
  const [coCongVanPhucDap, setCoCongVanPhucDap] = useState(false);
  const [baSearched, setBaSearched] = useState(!!donChiTietTabMoi);
  const [selectedVuAnGoc, setSelectedVuAnGoc] = useState<number | null>(null);
  // Đề nghị xem xét: mặc định chọn bản án đang tra cứu (id=0)
  const [deNghiBanAn, setDeNghiBanAn] = useState<number | null>(0);
  const [deNghiKetQua, setDeNghiKetQua] = useState<number | null>(null);
  // Kết quả giải quyết liên quan — thêm qua popup
  const [thongBaoTraLoi, setThongBaoTraLoi] = useState<{ id: number; loaiKQ: string; soTB: string; ngayTB: string; toaAn: string }[]>([
    { id: 9001, loaiKQ: "Thông báo trả lời đơn", soTB: "142/TB-TANDTC", ngayTB: "15/09/2024", toaAn: "Tòa án nhân dân cấp cao tại Hà Nội" },
    { id: 9002, loaiKQ: "Thông báo VKS đang giải quyết", soTB: "87/TB-VKSTC", ngayTB: "03/12/2024", toaAn: "Viện kiểm sát nhân dân tối cao" },
  ]);
  const [showThemTB, setShowThemTB] = useState(false);
  // Đơn liên quan thêm tay — gộp chung với kết quả tra cứu để hiện ra bảng ngoài
  const [donLienQuanThem, setDonLienQuanThem] = useState<DonLienQuan[]>([]);
  const [showThemDonLQ, setShowThemDonLQ] = useState(false);
  const [suaDonLQ, setSuaDonLQ] = useState<DonLienQuan | null>(null);
  // Đơn thụ lý kèm — thêm qua popup, hiện luôn ra bảng ngoài
  const [donThuLyKem, setDonThuLyKem] = useState<DonThuLyKem[]>([]);
  const [showThemDonKem, setShowThemDonKem] = useState(false);
  // Bản án/quyết định liên quan thêm tay
  const [banAnThem, setBanAnThem] = useState<BanAnLienQuan[]>([]);
  const [showThemBanAn, setShowThemBanAn] = useState(false);
  // Id dòng đang sửa của từng bảng ở màn Thêm mới (null = đang thêm mới)
  const [suaCongVanId, setSuaCongVanId] = useState<number | null>(null);
  const [suaBanAnId, setSuaBanAnId] = useState<number | null>(null);
  const [suaDonKemId, setSuaDonKemId] = useState<number | null>(null);
  const [suaKetQuaId, setSuaKetQuaId] = useState<number | null>(null);
  // Nguyên đơn / người khởi kiện
  const [nguyenDon, setNguyenDon] = useState<NguoiDungDon[]>([]);
  const [showThemNguyenDon, setShowThemNguyenDon] = useState(false);
  // Bị đơn / người bị kiện
  const [biDon, setBiDon] = useState<NguoiDungDon[]>([]);
  const [showThemBiDon, setShowThemBiDon] = useState(false);
  // Người có quyền lợi, nghĩa vụ liên quan
  const [nguoiLienQuan, setNguoiLienQuan] = useState<NguoiDungDon[]>([]);
  const [showThemNguoiLQ, setShowThemNguoiLQ] = useState(false);
  // Id người đang sửa của 3 danh sách người tham gia tố tụng
  const [suaNguyenDonId, setSuaNguyenDonId] = useState<number | null>(null);
  const [suaBiDonId, setSuaBiDonId] = useState<number | null>(null);
  const [suaNguoiLQId, setSuaNguoiLQId] = useState<number | null>(null);
  const [loaiQDBa, setLoaiQDBa] = useState("Bản án");
  const [thuTucGQ, setThuTucGQ] = useState(donChiTietTabMoi?.thuTuc ?? "");   // Thủ tục giải quyết — bắt buộc
  const [hanhViBiKhieuNai, setHanhViBiKhieuNai] = useState("");
  const [khieuNaiToCaoHanhVi, setKhieuNaiToCaoHanhVi] = useState(false);
  const NHAN_SO_NGAY_BA: Record<string, [string, string]> = {
    "Bản án": ["Số bản án", "Ngày bản án"],
    "Quyết định": ["Số quyết định", "Ngày quyết định"],
    "Công văn": ["Số công văn", "Ngày công văn"],
    "Thông báo": ["Số thông báo", "Ngày thông báo"],
    "Hành vi": ["Số văn bản", "Ngày văn bản"],
  };
  const [selectedYcbsKey, setSelectedYcbsKey] = useState<string | null>(null);
  // Đơn gốc được chọn làm đơn bổ sung — nguồn để điền người đứng đơn xuống mục Thông tin đơn
  const [donGocBoSung, setDonGocBoSung] = useState<DonLienQuan | null>(null);
  const chonLamDonBoSung = (r: DonLienQuan, khoa: string) => {
    setSelectedYcbsKey(khoa);
    setDonGocBoSung(r);
    addNotification(`Đã liên kết đơn bổ sung với ${r.maDon} và điền người đứng đơn: ${r.nguoiGui}.`);
  };
  const [donTrungKey, setDonTrungKey] = useState<string | null>(null);
  const [donTrungGoc, setDonTrungGoc] = useState<DonLienQuan | null>(null);
  const chonLamDonTrung = (r: DonLienQuan, khoa: string) => {
    // Chuẩn hóa so sánh hinhThuc: bỏ qua ký tự phân cách (/ vs -), khoảng trắng, chữ hoa/thường
    const norm = (s: string) => s.toLowerCase().replace(/[/\-\s]+/g, '');
    if (norm(r.hinhThuc) !== norm(hinhThuc)) {
      addNotification(`Không thể liên kết: Hình thức của đơn được chọn (${r.hinhThuc}) không khớp với Hình thức đơn hiện tại (${hinhThuc}).`);
      return;
    }
    setDonTrungKey(khoa);
    setDonTrungGoc(r);
    // Clone all details from the selected record into the new ticket state fields
    if (r.soBA) setBaForm(prev => ({ ...prev, soBA: r.soBA || "" }));
    if (r.ngayBA) setBaForm(prev => ({ ...prev, ngayBA: r.ngayBA ? r.ngayBA.split("/").reverse().join("-") : "" }));
    addNotification(`Đã liên kết đơn trùng với ${r.maDon} và sao chép toàn bộ thông tin.`);
  };
  const loaiQDBaOptions = ["Bản án", "Quyết định"];
  const loaiQDBaEffective = loaiQDBaOptions.includes(loaiQDBa) ? loaiQDBa : loaiQDBaOptions[0];
  const laHanhVi = false;
  const [nhanSoBA, nhanNgayBA] = NHAN_SO_NGAY_BA[loaiQDBaEffective] ?? NHAN_SO_NGAY_BA["Bản án"];
  const [baForm, setBaForm] = useState({
    soBA: donChiTietTabMoi?.soBA ?? "",
    ngayBA: donChiTietTabMoi?.ngayBA ? donChiTietTabMoi.ngayBA.split("/").reverse().join("-") : "",
    toaBA: "",
    capXetXu: "",
    thoiHieuGiaiQuyet: "" as ThoiHieuKey | "",
  });
  const [ocrFields, setOcrFields] = useState<Set<string>>(new Set());
  const editingRow = SAMPLE_ROWS.find(r => r.id === editingRowId) ?? null;

  // Sửa đơn: mục 5 lấy theo kết quả xử lý của lần nhập/sửa gần nhất — cả bộ
  // trường (không chỉ "Nơi chuyển đến") đọc từ rawData của log lịch sử mới
  // nhất, để mở popup "Sửa kết quả xử lý đơn" thấy ngay dữ liệu đã lưu thay vì
  // trống trơn. Đơn chưa có log (hoặc log seed không có rawData) thì rơi về
  // suy luận cũ từ giaiQuyet/thongTinChuyenDon.
  useEffect(() => {
    if (!editingRow) return;
    const lastRaw = editingRow.processingHistory?.length
      ? editingRow.processingHistory[editingRow.processingHistory.length - 1].rawData
      : null;
    if (lastRaw) {
      setNoiChuyenDen(lastRaw.noiChuyenDen ?? "");
      setDonViChuyenDen(lastRaw.donViChuyenDen ?? "");
      setCaNhanChuyenDen(lastRaw.caNhanChuyenDen ?? "");
      setTrangThaiDon(lastRaw.trangThaiDon ?? "");
      setThuLyDon(lastRaw.thuLyDon ?? "");
      setLyDoKhongDu(lastRaw.lyDoKhongDu ?? "");
      setLyDoTraLai(lastRaw.lyDoTraLai ?? "");
      setYeuCauTraLai(lastRaw.yeuCauTraLai ?? "");
      setLyDoLuuTheoDoi(lastRaw.lyDoLuuTheoDoi ?? "");
      setChanhAnHoacToaAn(lastRaw.chanhAnHoacToaAn ?? "Tòa án");
      setVuTruong(lastRaw.vuTruong ?? "");
      return;
    }
    const nhan = editingRow.giaiQuyet?.nhan;
    if (nhan === "Trả lại đơn") setNoiChuyenDen("Trả lại đơn");
    else if (nhan === "Lưu theo dõi") setNoiChuyenDen("Lưu theo dõi");
    else if (editingRow.thongTinChuyenDon) setNoiChuyenDen(editingRow.thongTinChuyenDon);
  }, [editingRowId]);

  // Sau khi đã lưu kết quả xử lý lần đầu (đúng 1 lần log), các trường mục 5
  // hiện giá trị đã lưu nhưng khoá lại không cho gõ trực tiếp nữa — muốn sửa
  // phải bấm "Sửa kết quả xử lý đơn" (mở popup riêng). Chưa nhập lần nào thì
  // vẫn để mở cho gõ tự do như bình thường.
  const chiXemKetQuaLanDau = !!editingRow?.processingHistory && editingRow.processingHistory.length === 1;

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
    if (activeDonLienThong && activeDonLienThong.nguon === "VBDH") {
      setHinhThuc(activeDonLienThong.hinhThucDon);
      setLoaiAnForm(activeDonLienThong.loaiAn);
      if (activeDonLienThong.nguoiLamDon) {
        setNguyenDon([{
          id: Date.now(), tuCach: "Cá nhân", lienHeChinh: true,
          hoTen: activeDonLienThong.nguoiLamDon, namSinh: "", thongKe: [], diaChi: "", sdt: ""
        }]);
      }
    }
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
          if (activeDonLienThong && activeDonLienThong.nguon === "VBDH") {
            setHinhThuc(activeDonLienThong.hinhThucDon);
            setLoaiAnForm(activeDonLienThong.loaiAn);
            if (activeDonLienThong.nguoiLamDon) {
              setNguyenDon([{
                id: Date.now(), tuCach: "Cá nhân", lienHeChinh: true,
                hoTen: activeDonLienThong.nguoiLamDon, namSinh: "", thongKe: [], diaChi: "", sdt: ""
              }]);
            }
          }
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

  const BA_SEARCH_RESULTS_GOC = [
    { id: 1, vuAn: "Nguyễn Văn An kiện UBND tỉnh Bắc Ninh", loai: "Bản án", giaiDoan: "Sơ thẩm", soBA: "15/2021/HC-ST", ngayBA: "10/05/2021", toaAn: "TAND tỉnh Bắc Ninh", isDuplicate: false, nguon: "QLA" },
    { id: 2, vuAn: "Nguyễn Văn An kiện UBND tỉnh Bắc Ninh", loai: "Bản án", giaiDoan: "Phúc thẩm", soBA: "15/2023/HC-PT", ngayBA: "12/03/2023", toaAn: "TAND tỉnh Bắc Ninh", isDuplicate: true, nguon: "Kho số hóa" },
    { id: 3, vuAn: "Nguyễn Văn An và cộng sự — tranh chấp đất đai", loai: "Bản án", giaiDoan: "Phúc thẩm", soBA: "15/2023/HC-PT", ngayBA: "12/03/2023", toaAn: "TAND tỉnh Bắc Ninh", isDuplicate: true, nguon: "Thêm mới" },
    { id: 4, vuAn: "Nguyễn Văn An kiện UBND tỉnh Bắc Ninh", loai: "Quyết định", giaiDoan: "Giám đốc thẩm", soBA: "15/2024/GĐT-HC", ngayBA: "20/01/2024", toaAn: "TAND tỉnh Bắc Ninh", isDuplicate: true, nguon: "QLA" },
  ];

  // Bảng = kết quả tra cứu (sau khi bấm Tra cứu) + các bản án thêm tay.
  // Bản án thêm tay hiện được ngay cả khi chưa tra cứu.
  const BA_SEARCH_RESULTS = [
    ...(baSearched ? BA_SEARCH_RESULTS_GOC : []),
    ...banAnThem,
  ];

  // Đơn của cùng vụ án — hiện ra sau khi bấm "Tra cứu" để cán bộ biết vụ này đã
  // có những đơn nào vào trước.
  const DON_LIEN_QUAN_RESULTS = [
    {
      id: 1,
      maDon: "Mã 6512", ngayNhan: "15/06/2023",
      nguoiGui: "Nguyễn Văn An", diaChi: "Phường Võ Cường, Tỉnh Bắc Ninh",
      soBA: "15/2023/HC-PT", ngayBA: "12/03/2023",
      hinhThuc: "Đơn đề nghị GĐT/TT", thuTuc: "Giám đốc thẩm",
      trangThai: "Đã thụ lý", color: "#27ae60", stl: "54682310",
      nguoiNhap: "Vũ Văn Yên", ngayNhap: "15/06/2023",
      canBoXuLyGanNhat: "Nguyễn Minh An"
    },
    {
      id: 2,
      maDon: "Mã 6874", ngayNhan: "02/11/2023",
      nguoiGui: "Nguyễn Văn An", diaChi: "Phường Võ Cường, Tỉnh Bắc Ninh",
      soBA: "15/2023/HC-PT", ngayBA: "12/03/2023",
      hinhThuc: "Đơn đề nghị GĐT/TT", thuTuc: "Giám đốc thẩm",
      trangThai: "Chưa đủ điều kiện", color: "#e67e22", stl: "",
      nguoiNhap: "Phùng Trâm Anh", ngayNhap: "02/11/2023",
      ycbsSo: "Số 089/TB-TA, 15/11/2023",
      ycbsLyDo: "Thiếu tài liệu chứng minh quyền sử dụng đất hợp pháp",
      ycbsDonBoSung: "Mã 6912",
      ycbsDonBoSungLoai: "Tài liệu chứng cứ",
      ycbsDonBoSungNgay: "20/11/2023",
      ycbsDonBoSungGhiChu: "Đã nộp sổ đỏ bản sao y",
      ycbsSo2: "Số 095/TB-TA, 25/11/2023",
      ycbsLyDo2: "Thiếu giấy ủy quyền hợp lệ của các đồng sở hữu",
      ycbsDonBoSung2: "",
    },
    {
      id: 3,
      maDon: "Mã 7105", ngayNhan: "20/01/2024",
      nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh", diaChi: "Phường Phương Sơn, Tỉnh Bắc Ninh",
      soBA: "15/2024/GĐT-HC", ngayBA: "20/01/2024",
      hinhThuc: "CV Kiến nghị GĐT, TT", thuTuc: "Giám đốc thẩm",
      trangThai: "Thụ lý mới", color: "#2980b9", stl: "54682455", ngayThuLy: "22/01/2024",
      nguoiNhap: "Vũ Văn Yên", ngayNhap: "20/01/2024",
    },
    {
      id: 4,
      maDon: "Mã 7188", ngayNhan: "03/02/2024",
      nguoiGui: "Nguyễn Thị Hoa", diaChi: "Phường Ninh Xá, Tỉnh Bắc Ninh",
      soBA: "15/2024/GĐT-HC", ngayBA: "20/01/2024",
      hinhThuc: "Đơn đề nghị GĐT-TT", thuTuc: "Giám đốc thẩm",
      trangThai: "Thụ lý mới", color: "#2980b9", stl: "54682460", ngayThuLy: "05/02/2024",
      daChuyenVu: true, trangThaiVu: "Xếp đơn",
      thamPhan: "TP. Nguyễn Minh Tuấn",
      nguoiNhap: "Vũ Văn Yên", ngayNhap: "03/02/2024",
    },
    {
      id: 5,
      maDon: "Mã 7210", ngayNhan: "10/02/2024",
      nguoiGui: "Lê Văn Bốn", diaChi: "Phường Suối Hoa, Tỉnh Bắc Ninh",
      soBA: "15/2024/GĐT-HC", ngayBA: "20/01/2024",
      hinhThuc: "Đơn đề nghị GĐT-TT", thuTuc: "Giám đốc thẩm",
      trangThai: "Chưa đủ điều kiện", color: "#e67e22",
      nguoiNhap: "Phùng Trâm Anh", ngayNhap: "10/02/2024",
      // Không có YCBS nhưng vẫn có đơn bổ sung
    },
  ];

  /** Điền người tham gia tố tụng theo bản án đang khai trên màn hình.
   *  Gọi khi bấm Tra cứu và khi đổi Loại án sau lúc đã tra cứu — vì bộ vai trò
   *  của án hình sự (bị cáo) khác hẳn các loại án còn lại. */
  const dienNguoiThamGia = (loaiAn: string) => {
    const bo = NGUOI_THEO_LOAI_AN[loaiAn];
    if (!bo) {                       // loại án chưa có dữ liệu mẫu — không đụng gì
      setNguoiTuDong(false);
      return 0;
    }
    const danh = (ds: NguoiTuBanAn[] | undefined, tuCach: string): NguoiDungDon[] =>
      (ds ?? []).map((n, i) => ({
        id: Date.now() + i + Math.round(n.hoTen.length),
        lienHeChinh: false, hoTen: n.hoTen, tuCach,
        diaChi: n.diaChi, sdt: "—", namSinh: n.namSinh, thongKe: [],
      }));

    if (loaiAn === "Hình sự") {
      setBiCao((bo.biCao ?? []).map((n, i) => ({ ...n, id: Date.now() + i })));
      setNguyenDon([]); setBiDon([]); setNguoiLienQuan([]); setQuanHePhapLuat("");
      setNguoiTuDong(true);
      return (bo.biCao ?? []).length;
    }
    setBiCao([]);
    setQuanHePhapLuat(bo.quanHe ?? "");
    setNguyenDon(danh(bo.nguyenDon, "Nguyên đơn"));
    setBiDon(danh(bo.biDon, "Bị đơn"));
    setNguoiLienQuan(danh(bo.lienQuan, "Người có quyền lợi, nghĩa vụ liên quan"));
    setNguoiTuDong(true);
    return (bo.nguyenDon?.length ?? 0) + (bo.biDon?.length ?? 0) + (bo.lienQuan?.length ?? 0);
  };

  const traCuuBanAn = () => {
    setBaSearched(true);
    setSelectedVuAnGoc(null);
    const n = dienNguoiThamGia(loaiAnForm);
    addNotification(n > 0
      ? `Đã tra cứu bản án và điền sẵn ${n} người tham gia tố tụng. Vui lòng kiểm tra lại.`
      : "Đã tra cứu bản án. Chưa lấy được người tham gia tố tụng — vui lòng chọn Loại án hoặc nhập tay.");
  };

  // Bảng đơn liên quan = kết quả tra cứu (nếu đã bấm Tra cứu) + các đơn thêm tay
  const donLienQuanRows: DonLienQuan[] = [
    ...(baSearched ? DON_LIEN_QUAN_RESULTS : []),
    ...donLienQuanThem,
  ];

  const selectedBaResult = BA_SEARCH_RESULTS.find(r => r.id === selectedVuAnGoc) ?? null;
  const hasGiamDocThamResult = selectedBaResult?.giaiDoan === "Giám đốc thẩm";

  const delCV = (id: number) => setCongVans(p => p.filter(c => c.id !== id));

  // "5. Xử lý đơn" — Thao tác/Nội dung của dòng Lịch sử dựng linh hoạt theo
  // đúng những gì đang chọn trên form (nơi chuyển, lý do, đơn đủ điều kiện...).
  const thaoTacXuLy = () =>
    noiChuyenDen === "Nội bộ" || noiChuyenDen === "Tòa khác" || noiChuyenDen === "Ngoài tòa án"
      ? "Chuyển đơn" : noiChuyenDen;

  const noiDungXuLy = () => {
    if (noiChuyenDen === "Nội bộ") {
      return [
        donViChuyenDen && `Chuyển đến: ${donViChuyenDen}`,
        caNhanChuyenDen && `Cá nhân: ${caNhanChuyenDen}`,
        trangThaiDon && `Trạng thái: ${trangThaiDon}`,
        trangThaiDon === "Đơn không đủ điều kiện" && lyDoKhongDu && `Lý do: ${lyDoKhongDu}`,
        hasGiamDocThamResult
          ? (vuTruong && `Vụ trưởng: ${vuTruong}`)
          : (trangThaiDon === "Đơn đủ điều kiện" && thuLyDon && `Thụ lý: ${thuLyDon}`),
      ].filter(Boolean).join(" · ");
    }
    if (noiChuyenDen === "Tòa khác") {
      return [donViChuyenDen && `Chuyển đến: ${donViChuyenDen}`, `Hình thức: ${chanhAnHoacToaAn}`]
        .filter(Boolean).join(" · ");
    }
    if (noiChuyenDen === "Ngoài tòa án") {
      return donViChuyenDen ? `Chuyển đến: ${donViChuyenDen}` : "";
    }
    if (noiChuyenDen === "Trả lại đơn") {
      return [lyDoTraLai && `Lý do: ${lyDoTraLai}`, yeuCauTraLai && `Yêu cầu: ${yeuCauTraLai}`]
        .filter(Boolean).join(" · ");
    }
    if (noiChuyenDen === "Lưu theo dõi") {
      return lyDoLuuTheoDoi ? `Lý do: ${lyDoLuuTheoDoi}` : "";
    }
    return "";
  };

  // Ghi thẳng lên bản ghi trong SAMPLE_ROWS — Danh sách đơn và form Sửa đều đọc
  // lại mảng này từ đầu mỗi lần chuyển view nên lần mở Sửa kế tiếp thấy ngay.
  const luuLichSuXuLy = () => {
    if (!editingRow || !noiChuyenDen) return;
    if (editingRow.processingHistory && editingRow.processingHistory.length > 0) return;

    const t = new Date();
    const ngay = `${String(t.getDate()).padStart(2, "0")}/${String(t.getMonth() + 1).padStart(2, "0")}/${t.getFullYear()}`;

    const rawData = {
      noiChuyenDen, donViChuyenDen, caNhanChuyenDen, trangThaiDon,
      thuLyDon, lyDoKhongDu, lyDoTraLai, yeuCauTraLai, lyDoLuuTheoDoi,
      chanhAnHoacToaAn, vuTruong
    };

    editingRow.processingHistory = [
      ...(editingRow.processingHistory ?? []),
      { date: ngay, step: thaoTacXuLy(), actor: nguoiTheoVaiTro(currentRole).nguoi, note: noiDungXuLy(), rawData },
    ];
  };

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
          {donChiTietTabMoi
            ? `Chi tiết đơn ${donChiTietTabMoi.maDon}`
            : view === "list"
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
          {/* Tab chi tiết chỉ để xem — không có Lưu/Hủy/Trả lại */}
          {donChiTietTabMoi ? (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <button type="button" onClick={() => window.close()}
                className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-white/50 bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors">
                <X size={13} /> Đóng tab
              </button>
            </div>
          ) : view === "form" && (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              {editingRowId === null && <OcrStatusBadge status={ocrStatus} />}
              {(!isLienThongMode || (isLienThongMode && activeDonLienThong?.nguon === "VBDH")) && ocrFields.size > 0 && (
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
              <BtnPrimary onClick={() => {
                luuLichSuXuLy();
                addNotification(`Đơn ${editingRow?.maDon || "7031"} đã được thêm mới bởi cán bộ Nguyễn Văn An`);
                setView("list");
              }}>Lưu</BtnPrimary>
            </div>
          )}
        </div>
      </div>

      {/* ── Body: Sidebar + content ──────────────────────────────────────── */}
      <div className="flex" style={{ height: "calc(100vh - 46px)" }}>

        {/* Sidebar */}
        <Sidebar activePage={view} currentRole={currentRole} onNav={(page) => { setView(page as any); }}
          onDoiVaiTro={(v) => setCurrentRole(v as any)} vanBanList={vanBanList} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Breadcrumb */}
          <div className="bg-white border-b border-[#ddd] px-4 py-[6px] flex items-center gap-1 text-[12px] text-[#666] flex-shrink-0">
            <span className="text-[#1a5a96] hover:underline cursor-pointer">Trang chủ</span>
            <ChevronRight size={12} />
            <span className="text-[#1a5a96] hover:underline cursor-pointer">Quản lý đơn</span>
            <ChevronRight size={12} />
            {donChiTietTabMoi
              ? <span className="text-[#333]">Chi tiết đơn {donChiTietTabMoi.maDon}</span>
              : view === "home"
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
                              : view === "van_ban_trinh_ky"
                                ? <>
                                  <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("list")}>Danh sách đơn</span>
                                  <ChevronRight size={12} />
                                  <span className="text-[#333]">Danh sách văn bản</span>
                                </>
                                : view === "hieu_suat_chi_tiet"
                                  ? <>
                                    <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("home")}>Hiệu suất cán bộ kỳ này</span>
                                    <ChevronRight size={12} />
                                    <span className="text-[#333]">Xem chi tiết</span>
                                  </>
                                  : view === "so_sanh_loai_an"
                                    ? <>
                                      <span className="text-[#1a5a96] hover:underline cursor-pointer" onClick={() => setView("home")}>Trang chủ</span>
                                      <ChevronRight size={12} />
                                      <span className="text-[#333]">So sánh số đơn theo loại án & kết quả xử lý</span>
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
              <Dashboard onXemChiTietHieuSuat={() => setView("hieu_suat_chi_tiet")}
                onXemPheDuyet={(tab) => { setPheDuyetTab(tab ?? "cho_duyet"); setView("phe_duyet"); }}
                onXemDanhSachDon={(tab) => { setDanhSachDonTab(tab); setDanhSachDonQuaHanOnly(false); setView("list"); }}
                onXemDonQuaHan={() => { setDanhSachDonTab(0); setDanhSachDonQuaHanOnly(true); setView("list"); }}
                onXemDanhSachVanBan={(tab) => { setVanBanTrinhKyTab(tab ?? "ChoDuyet"); setView("van_ban_trinh_ky"); }}
                onXemSoSanhLoaiAn={(ky) => { setSoSanhLoaiAnKy(ky); setView("so_sanh_loai_an"); }}
                vanBanList={vanBanList} currentRole={currentRole} />
            </div>
          )}

          {/* Hiệu suất cán bộ kỳ này — Xem chi tiết */}
          {view === "hieu_suat_chi_tiet" && (
            <div className="flex-1 overflow-y-auto">
              <HieuSuatCanBoChiTiet currentRole={currentRole} onBack={() => setView("home")} />
            </div>
          )}

          {/* So sánh số đơn theo loại án & kết quả xử lý — mở từ nút "Chi tiết"
              ở biểu đồ "Phân bố đơn theo trạng thái xử lý" trên Trang chủ */}
          {view === "so_sanh_loai_an" && (
            <div className="flex-1 overflow-y-auto">
              <SoSanhLoaiAnChiTiet initialPeriod={soSanhLoaiAnKy} onBack={() => setView("home")} />
            </div>
          )}

          {/* Phê duyệt đề xuất view */}
          {view === "phe_duyet" && (
            <PheDuyetDeXuat danhSach={vanBanList} setDanhSach={setVanBanList} currentRole={currentRole} initialTab={pheDuyetTab} />
          )}

          {/* Danh sách văn bản — hàng đợi cá nhân của cán bộ (lọc mặc định: người tạo = tôi).
              Đổi vai trò ở góc phải màn hình sẽ thấy quyền sửa đổi theo:
              chỉ người đang giữ văn bản mới được sửa. */}
          {view === "van_ban_trinh_ky" && (
            <VanBanTrinhKyCuaToi danhSach={vanBanList} setDanhSach={setVanBanList}
              currentRole={currentRole} highlightId={vbVuaTao}
              openId={moVanBanId} onDaMo={() => setMoVanBanId(null)}
              locMaDon={locMaDonVanBan} initialTab={vanBanTrinhKyTab} />
          )}

          {/* Tiếp nhận đơn liên thông */}
          {view === "lienthong" && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#eef1f5]">
              <PanelLienThong currentRole={currentRole} onChiTiet={(don) => {
                setEditingRowId(null);
                setView("form");
                setActiveDonLienThong(don);
                setIsLienThongMode(true);
                setShowPDF(true); // Always show 2 panels for Lien Thong
                ocrRunId.current++;
                clearOcrTimers();
                // Fake PDF file so the left panel shows viewer instead of upload
                setOcrFile({ name: don.maDon + ".pdf", sizeMB: 1.2 });
                setOcrStatus("chua");
                setOcrStep(0);
                setOcrFields(new Set());

                if (don.nguon === "VBDH") {
                  setHinhThucNhan("VBDH");
                  setShowUploadPopup(false);
                  // Empty initially, requires OCR
                  setHinhThuc("");
                  setLoaiAnForm("");
                  setNguyenDon([]);
                } else {
                  setHinhThucNhan(don.nguon === "DVTT" ? "Điện tử" : don.nguon === "BuuDien" ? "Bưu điện" : "Trực tiếp");
                  setShowUploadPopup(false);
                  // Pre-fill everything immediately
                  setHinhThuc(don.hinhThucDon);
                  setLoaiAnForm(don.loaiAn);
                  if (don.nguoiLamDon) {
                    setNguyenDon([{
                      id: Date.now(), tuCach: "Cá nhân", lienHeChinh: true,
                      hoTen: don.nguoiLamDon, namSinh: "", thongKe: [], diaChi: "", sdt: ""
                    }]);
                  } else {
                    setNguyenDon([]);
                  }
                }

                if (don.ngayTiepNhan) {
                  const parts = don.ngayTiepNhan.split(' ')[0].split('/');
                  if (parts.length === 3) {
                    setNgayToaNhan(`${parts[2]}-${parts[1]}-${parts[0]}`);
                  }
                }

                if (don.ocrTrangThai) {
                  setTrangThaiDon(don.ocrTrangThai === "du-dieu-kien" ? "Đơn đủ điều kiện" : "Đơn không đủ điều kiện");
                  if (don.ocrTrangThai === "khong-du-dieu-kien") {
                    setLyDoKhongDu(don.ocrLyDo || "");
                  } else {
                    setLyDoKhongDu("");
                  }
                } else {
                  setTrangThaiDon("");
                  setLyDoKhongDu("");
                }
              }} />
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <div className="flex-1 overflow-y-auto">
              <DanhSachDon
                currentRole={currentRole}
                initialTab={danhSachDonTab}
                initialQuaHanOnly={danhSachDonQuaHanOnly}
                onTaoVanBan={taoVanBanTuModal}
                onXemVanBanDaTrinh={xemVanBanDaTrinh}
                vanBanList={vanBanList}
                onThemMoi={() => {
                  setEditingRowId(null);
                  setView("form");
                  setIsLienThongMode(false);
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
                onBieuMau={(r, vbId) => { setBieuMauRow(r); setBieuMauVbId(vbId ?? null); setView("bieumau"); }}
                onWordEditor={() => setView("wordeditor")}
                onEditRow={(id) => { setEditingRowId(id); setView("form"); setIsLienThongMode(false); }}
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

          {/* Biểu mẫu view */}
          {view === "bieumau" && bieuMauRow && (
            <div className="flex-1 overflow-y-auto">
              <DanhSachBieuMau row={bieuMauRow} vbId={bieuMauVbId}
                onBack={() => { setView("list"); setBieuMauVbId(null); }}
                vanBanList={vanBanList} setVanBanList={setVanBanList} currentRole={currentRole} />
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
              <PhanCongThamPhan initialTab={phanCongTab} currentRole={currentRole}
                onOpenThamPhanPopup={() => setShowThamPhanPopup(true)} />
            </div>
          )}

          {/* Form view: 2-panel */}
          <div className={`flex flex-1 overflow-hidden ${view === "form" ? "" : "hidden"}`}>

            {/* LEFT: Form panel */}
            <div className={`${showPDF ? "w-[58%]" : "w-full"} min-w-[540px] overflow-y-auto bg-[#eef1f5] transition-all`}>
              <div className="p-3 space-y-3">

                {/* Banner trạng thái OCR — chỉ ở luồng Thêm mới */}
                {(!isLienThongMode || (isLienThongMode && activeDonLienThong?.nguon === "VBDH")) && editingRowId === null && ocrStatus !== "thanhcong" && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-[3px] text-[12px] border ${ocrStatus === "dang" ? "bg-[#fffbeb] border-[#f59e0b] text-[#92400e]"
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
                {(!isLienThongMode || (isLienThongMode && activeDonLienThong?.nguon === "VBDH")) && ocrFields.size > 0 && (
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
                      <Sel disabled={isLienThongMode} value={hinhThucNhan} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHinhThucNhan(e.target.value)}>
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
                        <select disabled={isLienThongMode} value={hinhThuc} onChange={e => setHinhThuc(e.target.value)}
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
                      <Lbl req>Thủ tục giải quyết</Lbl>
                      <Sel value={thuTucGQ} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setThuTucGQ(e.target.value)}>
                        <option value="">-- Chọn --</option>
                        <option>Giám đốc thẩm</option>
                        <option>Tái thẩm</option>
                        <option>Giám đốc thẩm + Tái thẩm</option>
                        <option>Chưa xác định</option>
                      </Sel>
                    </div>
                    {/* Số hiệu đơn: do NƠI GỬI đánh trên đơn, khác mã đơn do hệ
                        thống sinh — không bắt buộc vì đơn của công dân thường
                        không có số hiệu nào.
                        Hình thức Công văn thì bỏ hẳn: công văn đã có số công văn
                        và ngày công văn riêng ở mục Thông tin công văn, hai cặp
                        trường song song chỉ gây nhập nhầm. */}
                    {isDon && (
                      <div>
                        <Lbl>Số hiệu đơn</Lbl>
                        <Inp placeholder="Số hiệu nơi gửi ghi trên đơn" value={soHieuDon}
                          onChange={e => setSoHieuDon(e.target.value)} />
                      </div>
                    )}
                    {/* Ngày tòa nhận — mốc để tính thời hiệu, nên bắt buộc.
                        Nối vào OCR: bản trích xuất có sẵn ngày nhận thì điền luôn,
                        cán bộ chỉ việc soát lại. */}
                    <OcrWrap fieldKey="ngayNhan">
                      <div>
                        <Lbl req>Ngày tòa nhận</Lbl>
                        <Inp type="date"
                          value={ngayToaNhan || (ocrFields.has("ngayNhan") ? OCR_MOCK.ngayNhan : "")}
                          onChange={e => setNgayToaNhan(e.target.value)} />
                      </div>
                    </OcrWrap>
                    {/* Ngày ghi trên đơn — người gửi tự đề, luôn có trên đơn nên
                        bắt buộc; không mặc định theo hôm nay vì đơn gửi bưu điện
                        thường đề trước ngày tòa nhận cả tuần.
                        Công văn dùng "Ngày công văn" ở mục Thông tin công văn. */}
                    {isDon && (
                      <div>
                        <Lbl req>Ngày ghi trên đơn</Lbl>
                        <Inp type="date" value={ngayGhiTrenDon}
                          onChange={e => setNgayGhiTrenDon(e.target.value)} />
                      </div>
                    )}
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
                          <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>Loại QĐ/BA</Lbl>
                          <Sel value={loaiQDBaEffective} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLoaiQDBa(e.target.value)}>
                            {loaiQDBaOptions.map(o => <option key={o}>{o}</option>)}
                          </Sel>
                        </div>
                        <div>
                          <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>Loại án</Lbl>
                          <Sel value={ocrFields.has("loaiAn") && !loaiAnForm ? "Hành chính" : loaiAnForm} onChange={e => {
                            setLoaiAnForm(e.target.value);
                            if (e.target.value !== "Hình sự") setAnTuHinh(false);
                            // Đã tra cứu rồi mới đổi loại án → điền lại đúng bộ vai trò
                            if (baSearched) dienNguoiThamGia(e.target.value);
                          }}>
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
                          <div className="col-span-2 flex flex-col gap-1 justify-end">
                            <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>Loại đơn / Nội dung khiếu kiện</Lbl>
                            <div className="flex items-center gap-5 h-[30px]">
                              {["Đơn khiếu nại", "Đơn tố cáo"].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                                  <input type="radio" name="loaiDonKhieuNai" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                                    checked={loaiDonKhieuNai === opt}
                                    onChange={() => setLoaiDonKhieuNai(opt)} />
                                  {opt}
                                </label>
                              ))}
                              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] border-l pl-4 border-[#ddd]">
                                <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                                  checked={khieuNaiToCaoHanhVi}
                                  onChange={e => setKhieuNaiToCaoHanhVi(e.target.checked)} />
                                Khiếu nại/tố cáo hành vi
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Nếu tích chọn Khiếu nại/tố cáo hành vi thì hiển thị textarea */}
                      {isDonKhieuNaiTuPhap && khieuNaiToCaoHanhVi && (
                        <div>
                          <Lbl req>Nội dung hành vi bị khiếu nại/Tố cáo</Lbl>
                          <textarea rows={3} placeholder="Nhập hành vi bị khiếu nại/tố cáo..."
                            value={hanhViBiKhieuNai} onChange={e => setHanhViBiKhieuNai(e.target.value)}
                            className={`w-full border rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none ${hanhViBiKhieuNai ? "border-[#ccc]" : "border-[#e57373]"}`} />
                        </div>
                      )}

                      <div className="grid grid-cols-4 gap-x-3 items-end">
                        <OcrWrap fieldKey="soBA">
                          <div>
                            <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>{nhanSoBA}</Lbl>
                            <Inp placeholder={`Nhập ${nhanSoBA.toLowerCase()}`} value={baForm.soBA || (ocrFields.has("soBA") ? OCR_MOCK.soBA : "")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaForm(p => ({ ...p, soBA: e.target.value }))} />
                          </div>
                        </OcrWrap>
                        <OcrWrap fieldKey="ngayBA">
                          <div>
                            <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>{nhanNgayBA}</Lbl>
                            <Inp type="date" value={baForm.ngayBA || (ocrFields.has("ngayBA") ? OCR_MOCK.ngayBA : "")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaForm(p => ({ ...p, ngayBA: e.target.value }))} />
                          </div>
                        </OcrWrap>
                        <OcrWrap fieldKey="toaXetXu">
                          <div>
                            <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>Tòa ra bản án</Lbl>
                            <Inp placeholder="Nhập tên tòa" value={baForm.toaBA || (ocrFields.has("toaXetXu") ? OCR_MOCK.toaXetXu : "")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaForm(p => ({ ...p, toaBA: e.target.value }))} />
                          </div>
                        </OcrWrap>
                        <div className="flex-1">
                          <Lbl req={!isDonKhac && !khongCoGDT && !chuyenDiNoiKhac}>Cấp xét xử</Lbl>
                          <Sel value={baForm.capXetXu || (ocrFields.has("capXetXu") ? OCR_MOCK.capXetXu : "")} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBaForm(p => ({ ...p, capXetXu: e.target.value }))}>
                            <option value="">-- Chọn --</option>
                            <option>Sơ thẩm</option>
                            <option>Phúc thẩm</option>
                            <option>Giám đốc thẩm</option>
                            <option>Tái thẩm</option>
                          </Sel>
                        </div>
                        <div className="flex items-end gap-2 mt-1">
                          <button onClick={traCuuBanAn}
                            className="flex-shrink-0 flex items-center gap-1.5 h-[30px] px-3 bg-[#1d2e4f] hover:bg-[#15223a] text-white rounded-[3px] text-[12px] font-medium transition-colors whitespace-nowrap">
                            <Search size={12} /> Tra cứu
                          </button>

                        </div>
                      </div>
                      <div className="border border-[#ddd] rounded-[3px] px-3 py-2.5">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="w-[6px] h-[6px] rounded-full bg-[#8b1a1a] flex-shrink-0" />
                          <span className="text-[13px] font-semibold text-[#222]">Thông tin</span>
                        </div>
                        <Lbl>Thời hiệu giải quyết</Lbl>
                        <div className="flex items-center gap-6 flex-wrap">
                          {THOI_HIEU_FORM_OPTIONS.map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                              <input type="radio" name="thoiHieuGiaiQuyetForm" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                                checked={baForm.thoiHieuGiaiQuyet === opt.value}
                                onChange={() => setBaForm(p => ({ ...p, thoiHieuGiaiQuyet: opt.value }))} />
                              {opt.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      {loaiAnForm === "Hình sự" && (
                        <label className="flex items-center gap-3 cursor-pointer text-[13px] text-[#333] whitespace-nowrap">
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            checked={xulychuynhuong} onChange={e => {
                              setXulychuynhuong(e.target.checked);
                              if (e.target.checked) {
                                setAnTuHinh(false);
                                setXinGiamAnTuHinh(false);
                                setKeuOanAnTuHinh(false);
                                setXinThiHanhAnSom(false);
                              }
                            }} />
                          Áp dụng biện pháp XLCH
                        </label>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-semibold text-[#444]">Danh sách bản án/quyết định liên quan</span>
                          <BtnAdd onClick={() => setShowThemBanAn(true)}><Plus size={12} /> Thêm</BtnAdd>
                        </div>
                        {BA_SEARCH_RESULTS.length === 0 ? (
                          <Tbl headers={["STT", "Đề nghị xem xét", "Vụ án", "Nguồn vụ án", "Loại BA/QĐ", "Giai đoạn", "Số bản án", "Ngày ra bản án", "Tòa án ra bản án", "Trạng thái bản án", "Thao tác"]} emptyMsg="Chưa có dữ liệu" />
                        ) : (
                          <table className="w-full border-collapse text-[12px]">
                            <thead>
                              <tr className="bg-[#f5f5f5]">
                                {["STT", "Đề nghị xem xét", "Vụ án", "Nguồn vụ án", "Loại BA/QĐ", "Giai đoạn", "Số bản án", "Ngày ra bản án", "Tòa án ra bản án", "Trạng thái bản án", "Thao tác"].map(h => (
                                  <th key={h} className={`border border-[#ddd] px-3 py-[6px] font-semibold text-[#333] whitespace-nowrap ${h === "Thao tác" ? "text-center w-[76px]" : "text-left"}`}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {BA_SEARCH_RESULTS.map((r, i) => (
                                <tr key={r.id} className={`align-top ${selectedVuAnGoc === r.id ? "bg-[#e8f7ee]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                                  <td className="border border-[#ddd] px-3 py-2 text-center text-[#666]">{i + 1}</td>
                                  <td className="border border-[#ddd] px-3 py-2 text-center">
                                    {/* Cùng name với bảng kết quả giải quyết:
                                          chỉ được đề nghị xem xét 1 bản án HOẶC
                                          1 kết quả giải quyết, không được cả hai */}
                                    <input type="radio" name="deNghiXemXet"
                                      className="w-[14px] h-[14px] accent-[#8b1a1a] cursor-pointer"
                                      checked={deNghiBanAn === r.id}
                                      onChange={() => { setDeNghiBanAn(r.id); setDeNghiKetQua(null); }} />
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2 text-[#1a5a96]">{r.vuAn}</td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-semibold ${r.nguon === "QLA"
                                        ? "bg-[#e0f2fe] text-[#0369a1]"
                                        : r.nguon === "Kho số hóa"
                                          ? "bg-[#fef3c7] text-[#d97706]"
                                          : "bg-[#f3f4f6] text-[#374151]"
                                      }`}>
                                      {r.nguon}
                                    </span>
                                  </td>
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
                                    {/* Bản án thêm tay có cờ daGiaiQuyet riêng;
                                          dữ liệu tra cứu thì suy theo giai đoạn. */}
                                    {(() => {
                                      const xong = "daGiaiQuyet" in r ? (r as BanAnLienQuan).daGiaiQuyet : r.giaiDoan !== "Sơ thẩm";
                                      return (
                                        <span className={`inline-block px-1.5 py-[2px] rounded text-[10px] font-medium border ${xong
                                          ? "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"
                                          : "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]"
                                          }`}>
                                          {xong ? "Đã giải quyết" : "Đang giải quyết"}
                                        </span>
                                      );
                                    })()}
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <div className="flex items-center justify-center gap-0.5">
                                      {/* Dòng thêm tay: sửa ngay trong popup.
                                            Dòng từ Kho số hóa: chỉ đổ ngược lên
                                            form Thông tin bản án để chỉnh, vì bản
                                            ghi gốc nằm ở kho, không sửa tại đây. */}
                                      {r.nguon === "Thêm mới" ? (
                                        <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sửa"
                                          onClick={() => { setSuaBanAnId(r.id); setShowThemBanAn(true); }} />
                                      ) : r.nguon === "Kho số hóa" ? (
                                        <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sửa trên form Thông tin bản án"
                                          onClick={() => {
                                            setLoaiQDBa(r.loai);
                                            setBaForm(p => ({
                                              ...p,
                                              soBA: r.soBA,
                                              ngayBA: r.ngayBA.split("/").reverse().join("-"),
                                              toaBA: r.toaAn,
                                              capXetXu: r.giaiDoan
                                            }));
                                          }} />
                                      ) : null}
                                      {r.nguon === "Thêm mới" && (
                                        <ActionBtn icon={<Trash2 size={14} />} color="red" title="Xóa"
                                          onClick={() => {
                                            setBanAnThem(p => p.filter(x => x.id !== r.id));
                                            if (deNghiBanAn === r.id) setDeNghiBanAn(null);
                                          }} />
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>

                      {/* Danh sách kết quả giải quyết liên quan */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-semibold text-[#444]">Danh sách kết quả giải quyết liên quan</span>
                            <span className="text-[11px] text-[#888] italic">
                              — chỉ được đề nghị xem xét 1 bản án/quyết định hoặc 1 kết quả giải quyết
                            </span>
                          </div>
                          <BtnAdd onClick={() => setShowThemTB(true)}><Plus size={12} /> Thêm</BtnAdd>
                        </div>
                        <Tbl headers={["STT", "Đề nghị xem xét", "Loại kết quả", "Số kết quả", "Ngày", "Tòa án", "Thao tác"]}
                          emptyMsg="Chưa có dữ liệu">
                          {thongBaoTraLoi.length > 0 ? thongBaoTraLoi.map((tb, i) => (
                            <tr key={tb.id} className={deNghiKetQua === tb.id ? "bg-[#e8f7ee]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                              <Td center>{i + 1}</Td>
                              <Td center>
                                <input type="radio" name="deNghiXemXet"
                                  className="w-[14px] h-[14px] accent-[#8b1a1a] cursor-pointer"
                                  checked={deNghiKetQua === tb.id}
                                  onChange={() => { setDeNghiKetQua(tb.id); setDeNghiBanAn(null); }} />
                              </Td>
                              <Td>{tb.loaiKQ}</Td>
                              <Td>{tb.soTB}</Td>
                              <Td>{tb.ngayTB}</Td>
                              <Td>{tb.toaAn}</Td>
                              <Td center>
                                <div className="flex items-center justify-center gap-0.5">
                                  <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sửa"
                                    onClick={() => { setSuaKetQuaId(tb.id); setShowThemTB(true); }} />
                                  <ActionBtn icon={<Trash2 size={14} />} color="red" title="Xóa"
                                    onClick={() => {
                                      setThongBaoTraLoi(p => p.filter(x => x.id !== tb.id));
                                      if (deNghiKetQua === tb.id) setDeNghiKetQua(null);
                                    }} />
                                </div>
                              </Td>
                            </tr>
                          )) : undefined}
                        </Tbl>
                      </div>

                      {/* Danh sách đơn liên quan */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-semibold text-[#444]">Danh sách đơn liên quan</span>
                        </div>
                        {donLienQuanRows.length === 0 ? (
                          <Tbl
                            headers={["STT", "Thông tin người đứng đơn", "Thông tin đơn", "Người nhập", "Trạng thái"]}
                            emptyMsg="Chưa có dữ liệu"
                          />
                        ) : (
                          <table className="w-full border-collapse text-[12px]">
                            <thead>
                              <tr className="bg-[#f5f5f5]">
                                {/* "Thông tin người đứng đơn" / "Thông tin đơn" đổi size cho nhau theo yêu cầu */}
                                {["STT", "Thông tin người đứng đơn", "Thông tin đơn", "Người nhập", "Trạng thái"].map(h => (
                                  <th key={h} className={`border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] whitespace-nowrap ${h === "Thông tin người đứng đơn" ? "w-[270px]" : h === "Thông tin đơn" ? "w-[447px]" : ""}`}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {donLienQuanRows.map((r, i) => (
                                <tr key={r.id} className={`align-top ${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}`}>
                                  <td className="border border-[#ddd] px-3 py-2 text-center text-[#666]">{i + 1}</td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    {/* span chứ không phải button: button không kế thừa
                                          font của bảng nên chữ bị to hơn các cột khác */}
                                    <span onClick={() => moTabChiTietDon(r)}
                                      title="Mở chi tiết đơn ở tab mới"
                                      className="font-medium text-[#1a5a96] underline cursor-pointer">
                                      {r.maDon}
                                    </span>
                                    <div className="text-[#333] leading-snug mt-0.5">{r.nguoiGui}</div>
                                    <div className="text-[11px] text-[#666] mt-0.5 leading-snug">{r.diaChi}</div>
                                    <div className="text-[11px] text-[#666] mt-0.5 whitespace-nowrap">Ngày nhận: {r.ngayNhan}</div>
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <div className="space-y-[2px] leading-snug">
                                      <div><span className="text-[#555]">Số BA/QĐ: </span><span className="font-medium">{r.soBA || "—"}</span></div>
                                      <div><span className="text-[#555]">Ngày BA/QĐ: </span><span>{r.ngayBA || "—"}</span></div>
                                      <div><span className="text-[#555]">Hình thức: </span><span>{r.hinhThuc || "—"}</span></div>
                                      <div><span className="text-[#555]">Thủ tục giải quyết: </span><span>{r.thuTuc || "—"}</span></div>
                                      {r.canBoXuLyGanNhat && (
                                        <div className="mt-1"><span className="text-[#1a7a45] font-medium">CB xử lý gần nhất: {r.canBoXuLyGanNhat}</span></div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    <div className="text-[#333]">{r.nguoiNhap}</div>
                                    <div className="text-[11px] text-[#666]">{r.ngayNhap}</div>
                                  </td>
                                  <td className="border border-[#ddd] px-3 py-2">
                                    {r.trangThai ? (
                                      <div className="flex flex-col items-start gap-1.5">
                                        <span className="text-[11px] font-semibold text-[#333] whitespace-nowrap">
                                          {r.trangThai}
                                        </span>
                                        {/* Thụ lý mới: kèm Số thụ lý/Ngày thụ lý; nếu đơn đã
                                              chuyển sang vụ chuyên môn, nêu thêm trạng thái vụ
                                              (1 trong 4 loại) — hồ sơ không còn nằm ở khâu thụ lý
                                              nữa nên phải nói rõ nó đang ở đâu. */}
                                        {r.trangThai === "Thụ lý mới" && (
                                          <div className="flex flex-col items-start gap-1 mt-1">
                                            {donTrungKey === `${r.id}-trung` ? (
                                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#1a7a45]">
                                                <Check size={9} /> trùng với đơn {r.maDon}
                                              </span>
                                            ) : (
                                              <button type="button" onClick={() => chonLamDonTrung(r, `${r.id}-trung`)}
                                                title="Lấy đơn này làm đơn trùng"
                                                className="px-1.5 py-[1px] rounded-sm border border-[#8b1a1a] text-[#8b1a1a] text-[9px] font-semibold hover:bg-[#fdecea] transition-colors">
                                                Chọn làm đơn trùng
                                              </button>
                                            )}
                                            {(r.stl || r.ngayThuLy || (r.daChuyenVu && r.trangThaiVu)) && (
                                              <div className="text-left w-[218px] space-y-[2px] leading-snug mt-1">
                                                {r.stl && <div><span className="text-[#888]">Số thụ lý: </span><span className="text-[#333]">{r.stl}</span></div>}
                                                {r.ngayThuLy && <div><span className="text-[#888]">Ngày thụ lý: </span><span className="text-[#333]">{r.ngayThuLy}</span></div>}
                                                {r.daChuyenVu && r.trangThaiVu && (
                                                  <div><span className="text-[#888]">Trạng thái vụ: </span><span className="font-medium text-[#333]">{r.trangThaiVu}</span></div>
                                                )}
                                                {r.daChuyenVu && r.thamPhan && (
                                                  <div><span className="text-[#888]">Thẩm phán: </span><span className="font-medium text-[#333]">{r.thamPhan}</span></div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        {/* Các lần YCBS — gộp hai lần vào một vòng lặp, mỗi lần
                                              gói trong 2 dòng: "YCBS n · số · kết quả" và ý kiến
                                              lãnh đạo trong đơn. Bỏ khung nền, chỉ còn vạch đỏ
                                              mảnh bên trái. */}
                                        {r.trangThai === "Chưa đủ điều kiện" && (() => {
                                          const ycbss = [
                                            { i: 1, so: r.ycbsSo, lyDo: r.ycbsLyDo },
                                            { i: 2, so: r.ycbsSo2, lyDo: r.ycbsLyDo2 },
                                          ].filter(x => x.so || x.lyDo);

                                          const bsList = [
                                            { ma: r.ycbsDonBoSung, loai: r.ycbsDonBoSungLoai, ngay: r.ycbsDonBoSungNgay, ghiChu: r.ycbsDonBoSungGhiChu },
                                            { ma: r.ycbsDonBoSung2, loai: r.ycbsDonBoSung2Loai, ngay: r.ycbsDonBoSung2Ngay, ghiChu: r.ycbsDonBoSung2GhiChu },
                                            { ma: r.boSungKhongYcbsMa, loai: r.boSungKhongYcbsLoai, ngay: r.boSungKhongYcbsNgay, ghiChu: r.boSungKhongYcbsGhiChu }
                                          ].filter(x => x.ma);

                                          const standaloneDonChon = selectedYcbsKey === `${r.id}-alone`;

                                          return (
                                            <div className="text-left w-[218px] mt-1 space-y-2 border-l-2 border-[#f3c0bb] pl-2">
                                              {/* Danh sách YCBS (chỉ hiện Số và Lý do, không gắn nút chọn BS) */}
                                              {ycbss.length > 0 && (
                                                <div className="space-y-1.5">
                                                  {ycbss.map(l => (
                                                    <div key={l.i} className="leading-snug">
                                                      <div className="flex items-center gap-1 flex-wrap">
                                                        <span className="px-1 rounded-sm bg-[#fdecea] text-[#c0392b] text-[9px] font-bold">
                                                          YCBS {l.i}
                                                        </span>
                                                        {l.so && <span className="font-mono text-[10px] text-[#333]" title="Số, ngày TB">{l.so}</span>}
                                                      </div>
                                                      {l.lyDo && (
                                                        <div title={l.lyDo} className="text-[10px] text-[#777] mt-[2px] line-clamp-2">
                                                          <span className="text-[#888]">Lý do: </span>{l.lyDo}
                                                        </div>
                                                      )}
                                                    </div>
                                                  ))}
                                                </div>
                                              )}

                                              {/* Danh sách Đơn/tài liệu bổ sung (liệt kê độc lập) */}
                                              {bsList.length > 0 && (
                                                <div className="space-y-1">
                                                  {bsList.map((bs, idx) => (
                                                    <div key={idx} className="w-full bg-[#f9f9f9] border border-[#eee] p-1.5 rounded-sm">
                                                      <div className="text-[10px] text-[#1a7a45] mb-0.5">
                                                        → <span className="font-semibold">{bs.loai || "Đơn bổ sung"}</span>: <span className="underline font-medium">{bs.ma}</span>
                                                      </div>
                                                      {bs.ngay && <div className="text-[9.5px] text-[#555]"><span className="text-[#888]">Ngày BS:</span> {bs.ngay}</div>}
                                                      {bs.ghiChu && <div className="text-[9.5px] text-[#555] italic line-clamp-2" title={bs.ghiChu}><span className="text-[#888] not-italic">Ghi chú:</span> {bs.ghiChu}</div>}
                                                    </div>
                                                  ))}
                                                </div>
                                              )}

                                              {/* Nút hành động Chọn làm đơn BS (chỉ 1 nút cho cả đơn) */}
                                              <div className="pt-0.5">
                                                {standaloneDonChon ? (
                                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#1a7a45]">
                                                    <Check size={9} /> đã liên kết
                                                  </span>
                                                ) : (
                                                  <button type="button" onClick={() => chonLamDonBoSung(r, `${r.id}-alone`)}
                                                    title="Chọn làm đơn bổ sung cho đơn này"
                                                    className="px-1.5 py-[1px] rounded-sm border border-[#8b1a1a] text-[#8b1a1a] text-[9px] font-semibold hover:bg-[#fdecea] transition-colors">
                                                    Chọn làm đơn BS
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    ) : (
                                      <span className="text-[#999]">—</span>
                                    )}
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
                    <DonFields don={donChiTietTabMoi} dienTuDon={donGocBoSung} />
                  </Section>
                )}

                {/* 3/4. Thông tin đơn / công văn / kháng nghị */}
                <Section
                  title={isKhangNghi ? "3. Quyết định kháng nghị" : isDon ? "3. Thông tin đơn" : `${3 + secOffset}. Thông tin công văn`}
                  extra={!isDon && !isCVKienNghi ? <BtnAdd onClick={() => setShowPopup(true)}><Plus size={12} /> Thêm mới</BtnAdd> : undefined}
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
                          <Lbl req>Nội dung đơn</Lbl>
                          <textarea rows={4} placeholder="Nhập nội dung đơn..." className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[12px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none" />
                        </div>
                      </div>
                    ) : isDon ? (
                      /* ── Hình thức Đơn: hiện 3 trường + bảng người đứng đơn ── */
                      <DonFields don={donChiTietTabMoi} dienTuDon={donGocBoSung} />
                    ) : (
                      /* ── Hình thức Công văn ── */
                      <>
                        {/* CV kiến nghị: nhập thẳng một công văn trên form.
                              Các loại còn lại giữ bảng danh sách + popup vì có thể
                              kèm nhiều công văn. */}
                        {isCVKienNghi ? (
                          <PopupCongVan
                            nhung
                            banDau={congVans[0]}
                            onClose={() => { }}
                            onSave={(cv) => setCongVans([cv])}
                          />
                        ) : <>
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
                                    <ActionBtn icon={<Edit2 size={14} />} color="blue" title="Sửa"
                                      onClick={() => { setSuaCongVanId(cv.id); setShowPopup(true); }} />
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
                        </>}

                        {/* Ý kiến chỉ đạo dùng chung cho mọi loại công văn */}
                        {!isCVKemDon && <>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Lbl>Ý kiến chỉ đạo</Lbl>
                            </div>
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
                            <div className="flex items-center justify-center gap-0.5">
                              <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sửa"
                                onClick={() => { setSuaDonKemId(dk.id); setShowThemDonKem(true); }} />
                              <ActionBtn icon={<Trash2 size={14} />} color="red" title="Xóa"
                                onClick={() => setDonThuLyKem(p => p.filter(x => x.id !== dk.id))} />
                            </div>
                          </Td>
                        </tr>
                      )) : undefined}
                    </Tbl>
                  </Section>
                )}

                {/* 5. Xử lý đơn / công văn */}
                <Section title={`${5 + secOffset}. ${["CV khác", "CV kiến nghị GĐT-TT", "CV chuyển kiến nghị GĐT-TT", "CV chuyển đơn"].includes(hinhThuc) ? "Xử lý công văn" : "Xử lý đơn"}`}
                  extra={
                    <button type="button" onClick={() => setShowSuaKetQuaXuLy(true)}
                      className="inline-flex items-center gap-1 bg-white hover:bg-[#f5f5f5] text-[#333] text-[12px] font-medium px-3 py-[3px] rounded-[3px] border border-[#ccc] transition-colors whitespace-nowrap">
                      <PenLine size={12} className="text-[#1a5a96]" /> Sửa kết quả xử lý đơn
                    </button>
                  }
                >
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
                        <label className={`flex items-center gap-2 cursor-pointer text-[13px] whitespace-nowrap ${xulychuynhuong ? "text-[#aaa] cursor-not-allowed opacity-60" : "text-[#333]"}`}>
                          <input type="checkbox" className="w-[15px] h-[15px] accent-[#8b1a1a]"
                            disabled={xulychuynhuong}
                            checked={!xulychuynhuong && anTuHinh}
                            onChange={e => { setAnTuHinh(e.target.checked); if (!e.target.checked) { setXinGiamAnTuHinh(false); setKeuOanAnTuHinh(false); setXinThiHanhAnSom(false); } }} />
                          Án tử hình
                        </label>
                      </>
                    )}
                  </div>

                  {/* Tùy chọn con của Án tử hình */}
                  {loaiAnForm === "Hình sự" && !xulychuynhuong && anTuHinh && (
                    <div className="flex items-center gap-5 flex-wrap mb-3 pl-6 py-2 bg-[#fffbeb] border border-dashed border-[#fcdad5] rounded-[4px]">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#b45309] font-medium whitespace-nowrap">
                        <input type="checkbox" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                          checked={keuOanAnTuHinh} onChange={e => setKeuOanAnTuHinh(e.target.checked)} />
                        Kêu oan án tử hình
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#555] whitespace-nowrap">
                        <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                          checked={xinGiamAnTuHinh} onChange={e => setXinGiamAnTuHinh(e.target.checked)} />
                        Xin ân giảm án tử hình
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
                    {/* Nơi chuyển đến — gộp thay cho "Kết quả xử lý" trước đây, kèm
                          luôn 2 giá trị Trả lại đơn / Lưu theo dõi vào chung một ô chọn.
                          Lần đầu nhập (chưa có log hoặc mới có đúng 1 lần) vẫn hiện các
                          trường này (đã điền sẵn giá trị đã lưu) — bảng Lịch sử chỉ thay
                          thế chỗ này từ lần sửa thứ 2 trở đi. */}
                    {(!editingRow?.processingHistory || editingRow.processingHistory.length <= 1) && (
                      <>
                        <div>
                          <Lbl>Nơi chuyển đến</Lbl>
                          <Sel value={noiChuyenDen} disabled={chiXemKetQuaLanDau} onChange={(e) => {
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

                        {/* Nếu chọn Trả lại đơn */}
                        {noiChuyenDen === "Trả lại đơn" && (
                          <>
                            <div>
                              <Lbl req>Lý do trả lại</Lbl>
                              <Sel value={lyDoTraLai} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLyDoTraLai(e.target.value)}>
                                <option value="">-- Chọn lý do --</option>
                                <option>Đơn không đủ điều kiện xử lý</option>
                                <option>Không thuộc thẩm quyền giải quyết</option>
                                <option>Đã hết thời hạn giải quyết</option>
                                <option>Lý do khác</option>
                              </Sel>
                            </div>
                            <div>
                              <Lbl>Yêu cầu</Lbl>
                              <Inp placeholder="Nhập yêu cầu trả lại đơn..." value={yeuCauTraLai} disabled={chiXemKetQuaLanDau}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYeuCauTraLai(e.target.value)} />
                            </div>
                          </>
                        )}

                        {/* Nếu chọn Lưu theo dõi */}
                        {noiChuyenDen === "Lưu theo dõi" && (
                          <div className="col-span-2">
                            <Lbl req>Lý do lưu theo dõi</Lbl>
                            <textarea rows={2} placeholder="Nhập lý do lưu theo dõi đơn thư..."
                              value={lyDoLuuTheoDoi} disabled={chiXemKetQuaLanDau} onChange={e => setLyDoLuuTheoDoi(e.target.value)}
                              className="w-full border border-[#ccc] rounded-[3px] px-2.5 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none disabled:bg-[#f5f5f5] disabled:text-[#888]" />
                          </div>
                        )}

                        {/* Sub-logic của Nội bộ */}
                        {noiChuyenDen === "Nội bộ" && (
                          <>
                            <div>
                              <Lbl req>Đơn vị chuyển đến</Lbl>
                              <Sel value={donViChuyenDen} disabled={chiXemKetQuaLanDau} onChange={(e) => {
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
                                <Sel value={caNhanChuyenDen} disabled={chiXemKetQuaLanDau} onChange={(e) => setCaNhanChuyenDen(e.target.value)}>
                                  <option value="">-- Chọn cá nhân --</option>
                                  <option>Vụ trưởng - {donViChuyenDen}</option>
                                  <option>Phó vụ trưởng - {donViChuyenDen}</option>
                                  <option>Thẩm tra viên - {donViChuyenDen}</option>
                                </Sel>
                              </div>
                            )}
                          </>
                        )}

                        {/* Sub-logic của Tòa khác */}
                        {noiChuyenDen === "Tòa khác" && (
                          <>
                            <div className="relative">
                              <Lbl req>Đơn vị chuyển đến</Lbl>
                              <Inp
                                placeholder="Nhập hoặc tìm kiếm tòa án..."
                                value={donViChuyenDen}
                                disabled={chiXemKetQuaLanDau}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDonViChuyenDen(e.target.value); setShowDonViChuyenDenDD(true); }}
                                onFocus={() => setShowDonViChuyenDenDD(true)}
                                onBlur={() => setTimeout(() => setShowDonViChuyenDenDD(false), 180)}
                              />
                              {showDonViChuyenDenDD && (() => {
                                const goiY = TOA_KHAC_OPTIONS.filter(t => contains(t, donViChuyenDen));
                                if (!goiY.length) return null;
                                return (
                                  <div className="absolute z-50 top-full left-0 right-0 bg-white border border-[#ddd] rounded-[3px] shadow-lg mt-0.5 max-h-[220px] overflow-y-auto">
                                    {goiY.map(t => (
                                      <button key={t} type="button"
                                        onMouseDown={() => { setDonViChuyenDen(t); setShowDonViChuyenDenDD(false); }}
                                        className="w-full text-left px-3 py-2 text-[13px] hover:bg-[#f0f7ff] border-b border-[#f0f0f0] last:border-0">
                                        {t}
                                      </button>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                            <div>
                              <Lbl req>Chuyển đến</Lbl>
                              <div className="flex items-center gap-4 h-[30px]">
                                {["Tòa án", "Chánh án"].map(opt => (
                                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                                    <input type="radio" name="chanhAnHoacToaAnOpt" className="w-[14px] h-[14px] accent-[#8b1a1a]"
                                      checked={chanhAnHoacToaAn === opt}
                                      disabled={chiXemKetQuaLanDau}
                                      onChange={() => setChanhAnHoacToaAn(opt)} />
                                    {opt}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Sub-logic của Ngoài tòa án */}
                        {noiChuyenDen === "Ngoài tòa án" && (
                          <div className="col-span-2">
                            <Lbl req>Đơn vị chuyển đến (Cơ quan/Đơn vị ngoài tòa án)</Lbl>
                            <Inp
                              value={donViChuyenDen}
                              disabled={chiXemKetQuaLanDau}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonViChuyenDen(e.target.value)}
                              placeholder="Nhập tên cơ quan/đơn vị ngoài tòa..."
                            />
                          </div>
                        )}

                        {noiChuyenDen === "Nội bộ" && hinhThuc !== "CV khác" && hinhThuc !== "Đơn khác" && (
                          <>
                            <div>
                              <Lbl req>Trạng thái đơn</Lbl>
                              <Sel value={trangThaiDon} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTrangThaiDon(e.target.value)}>
                                <option value="">-- Chọn --</option>
                                <option>Đơn đủ điều kiện</option>
                                <option>Đơn không đủ điều kiện</option>
                              </Sel>
                            </div>
                            {hasGiamDocThamResult ? (
                              <div>
                                <Lbl req>Chọn vụ trưởng</Lbl>
                                <Sel value={vuTruong} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVuTruong(e.target.value)}>
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
                                <Sel value={thuLyDon} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setThuLyDon(e.target.value)}>
                                  <option value="">-- Chọn --</option>
                                  <option>Thụ lý mới</option>
                                  <option>Đã thụ lý</option>
                                  {/* Chỉ đổi nhãn ở nhánh Kết quả xử lý = "Chuyển đơn" —
                                    field "Thụ lý đơn" chỉ render cho nhánh này. */}
                                  <option>Xin ý kiến lãnh đạo</option>
                                  <option>Không</option>
                                </Sel>
                              </div>
                            ) : (
                              <div>
                                <Lbl req>Lý do không đủ điều kiện</Lbl>
                                <Sel value={lyDoKhongDu} disabled={chiXemKetQuaLanDau} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLyDoKhongDu(e.target.value)}>
                                  <option value="">-- Chọn lý do --</option>
                                  <option>Thiếu Bản án/quyết định có hiệu lực pháp luật</option>
                                  <option>Thiếu thông tin căn cước công dân</option>
                                  <option>Viết lại đơn</option>
                                  <option>Lý do khác</option>
                                </Sel>
                              </div>
                            )}
                            {!hasGiamDocThamResult && trangThaiDon === "Đơn không đủ điều kiện" && lyDoKhongDu === "Lý do khác" && (
                              <div className="col-span-2">
                                <Lbl req>Lý do khác</Lbl>
                                <textarea rows={2} placeholder="Nhập lý do khác..." disabled={chiXemKetQuaLanDau} className="w-full border border-[#ccc] rounded-[3px] px-2 py-1.5 text-[13px] text-[#222] focus:outline-none focus:border-[#1a73e8] resize-none disabled:bg-[#f5f5f5] disabled:text-[#888]" />
                              </div>
                            )}
                            {!hasGiamDocThamResult && trangThaiDon === "Đơn đủ điều kiện" && thuLyDon === "Thụ lý mới" && (
                              <div>
                                <Lbl req>Số thụ lý</Lbl>
                                <Inp placeholder="Nhập số thụ lý" disabled={chiXemKetQuaLanDau} />
                              </div>
                            )}
                            {!hasGiamDocThamResult && trangThaiDon === "Đơn đủ điều kiện" && thuLyDon === "Thụ lý mới" && (
                              <div>
                                <Lbl req>Ngày thụ lý</Lbl>
                                <Inp type="date" disabled={chiXemKetQuaLanDau} />
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
                                  <input type="radio" name="thamQuyenDon" value={val} disabled={chiXemKetQuaLanDau} className="accent-[#8b1a1a]" />
                                  {label}
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="col-span-2 flex items-end">
                          {/* Nút Danh sách thẩm phán đã được chuyển sang màn hình Phân công thẩm phán */}
                        </div>
                      </>
                    )}

                    {/* Lịch sử — chỉ hiện từ lần sửa kết quả xử lý thứ 2 trở đi, khi đã
                          có từ 2 lần log trở lên (log cả lần đầu lẫn các lần sửa sau). */}
                    {editingRow?.processingHistory && editingRow.processingHistory.length > 1 && (
                      <div className="col-span-2 mt-1">
                        <Lbl>Lịch sử</Lbl>
                        <table className="w-full border-collapse text-[12px]">
                          <thead>
                            <tr className="bg-[#f5f5f5]">
                              <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Nội dung</th>
                              <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[180px]">Thao tác</th>
                              <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[140px]">Người tạo</th>
                              <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[110px]">Ngày chuyển đơn</th>
                              <th className="border border-[#ddd] px-3 py-[6px] text-center font-semibold text-[#333] w-[80px]">Chi tiết</th>
                            </tr>
                          </thead>
                          <tbody>
                            {editingRow.processingHistory.map((item, idx) => (
                              <tr key={idx} className={idx % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                                <td className="border border-[#ddd] px-3 py-[6px] text-[#333]">{item.note || item.step}</td>
                                <td className="border border-[#ddd] px-3 py-[6px] text-[#333]">{item.step}</td>
                                <td className="border border-[#ddd] px-3 py-[6px] text-[#333]">{item.actor}</td>
                                <td className="border border-[#ddd] px-3 py-[6px] text-[#333]">{item.date}</td>
                                <td className="border border-[#ddd] px-3 py-[6px] text-center">
                                  <button type="button" title="Xem chi tiết"
                                    onClick={() => setXemChiTietHistory({
                                      ...(item.rawData ?? {}),
                                      date: item.date, actor: item.actor, step: item.step, note: item.note,
                                    })}
                                    className="text-[#1a5a96] hover:underline font-medium text-[12px]">
                                    Xem chi tiết
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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
                    {(
                      <Section title={`${6 + secOffset}. Người tham gia tố tụng`}>
                        <div className="space-y-4">
                          {/* Điền tự động sau khi Tra cứu bản án — nêu rõ để cán bộ rà lại */}
                          {nguoiTuDong && (
                            <div className="flex items-start gap-2 rounded-[4px] bg-[#fffbeb] border border-[#fcd48a] px-3 py-2 text-[12px] text-[#b45309] leading-relaxed">
                              <AlertCircle size={14} className="flex-shrink-0 mt-[2px]" />
                              <span>
                                Thông tin dưới đây lấy tự động từ bản án vừa tra cứu. Vui lòng kiểm tra,
                                sửa hoặc bổ sung trước khi lưu.
                              </span>
                            </div>
                          )}
                          {loaiAnForm !== "Hình sự" && <>
                            <div>
                              <Lbl>Quan hệ pháp luật</Lbl>
                              <Inp placeholder="Nhập quan hệ pháp luật" value={quanHePhapLuat}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuanHePhapLuat(e.target.value)} />
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
                                    onSua={() => { setSuaNguyenDonId(n.id); setShowThemNguyenDon(true); }}
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
                                    onSua={() => { setSuaBiDonId(n.id); setShowThemBiDon(true); }}
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
                                      <div className="flex items-center justify-center gap-0.5">
                                        <ActionBtn icon={<PenLine size={14} />} color="blue" title="Sửa"
                                          onClick={() => { setSuaNguoiLQId(n.id); setShowThemNguoiLQ(true); }} />
                                        <ActionBtn icon={<Trash2 size={14} />} color="red" title="Xóa"
                                          onClick={() => setNguoiLienQuan(p => p.filter(x => x.id !== n.id))} />
                                      </div>
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
                              >
                                {biCao.length > 0 ? biCao.map((n, i) => (
                                  <tr key={n.id} className={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                                    <Td><span className="font-medium text-[#1a5a96]">{n.hoTen}</span></Td>
                                    <Td>{n.namSinh}</Td>
                                    <Td>{n.diaChi}</Td>
                                    <Td>
                                      {n.toiDanh ?? "—"}
                                      {n.dieuKhoan && (
                                        <span className="text-[#666]"> ({n.dieuKhoan})</span>
                                      )}
                                    </Td>
                                    <Td center>
                                      <button onClick={() => setBiCao(p => p.filter(x => x.id !== n.id))}
                                        className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                                        <Trash2 size={11} /> Xóa
                                      </button>
                                    </Td>
                                  </tr>
                                )) : undefined}
                              </Tbl>
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


      {/* Chuyển vai trò đã nằm trong khối tài khoản ở cuối sidebar */}

      {/* Popup */}
      {showPopup && (
        <PopupCongVan
          banDau={congVans.find(c => c.id === suaCongVanId)}
          onClose={() => { setShowPopup(false); setSuaCongVanId(null); }}
          onSave={cv => setCongVans(p =>
            p.some(c => c.id === cv.id) ? p.map(c => c.id === cv.id ? cv : c) : [...p, cv])}
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
          key={suaKetQuaId ?? "moi"}
          banDau={thongBaoTraLoi.find(x => x.id === suaKetQuaId)}
          onDong={() => { setShowThemTB(false); setSuaKetQuaId(null); }}
          onThem={(tb) => {
            setThongBaoTraLoi(p => suaKetQuaId
              ? p.map(x => x.id === suaKetQuaId ? { ...x, ...tb } : x)
              : [...p, { id: Date.now(), ...tb }]);
            setShowThemTB(false);
            setSuaKetQuaId(null);
          }}
        />
      )}
      {/* Dùng CHUNG một popup cho thêm mới và sửa — cùng bộ trường, chỉ khác
          nguồn dữ liệu đầu vào và cách ghi kết quả. key ép remount để form nạp
          lại state khi đổi bản ghi đang sửa. */}
      {(showThemDonLQ || suaDonLQ) && (
        <PopupThemDonLienQuan
          key={suaDonLQ?.id ?? "them-moi"}
          banGhi={suaDonLQ}
          onDong={() => { setShowThemDonLQ(false); setSuaDonLQ(null); }}
          onThem={(d) => {
            if (suaDonLQ) {
              setDonLienQuanThem(p => p.map(x => x.id === suaDonLQ.id ? { ...x, ...d } : x));
              setSuaDonLQ(null);
            } else {
              setDonLienQuanThem(p => [...p, { id: Date.now(), ...d }]);
              setShowThemDonLQ(false);
            }
          }}
        />
      )}
      {showThemDonKem && (
        <PopupThemDonKem
          key={suaDonKemId ?? "moi"}
          banDau={donThuLyKem.find(x => x.id === suaDonKemId)}
          onDong={() => { setShowThemDonKem(false); setSuaDonKemId(null); }}
          onThem={(d) => {
            setDonThuLyKem(p => suaDonKemId
              ? p.map(x => x.id === suaDonKemId ? { ...x, ...d } : x)
              : [...p, { id: Date.now(), ...d }]);
            setShowThemDonKem(false);
            setSuaDonKemId(null);
          }}
        />
      )}
      {showThemBanAn && (
        <PopupThemBanAn
          key={suaBanAnId ?? "moi"}
          banDau={banAnThem.find(x => x.id === suaBanAnId)}
          onDong={() => { setShowThemBanAn(false); setSuaBanAnId(null); }}
          onThem={(b) => {
            setBanAnThem(p => suaBanAnId
              ? p.map(x => x.id === suaBanAnId ? { ...x, ...b } : x)
              : [...p, { id: Date.now(), nguon: "Thêm mới", ...b }]);
            setShowThemBanAn(false);
            setSuaBanAnId(null);
          }}
        />
      )}
      {showThemNguyenDon && (
        <PopupThemNguoiDungDon
          tieuDe="Thêm nguyên đơn/người khởi kiện"
          tuCachMacDinh="Nguyên đơn"
          coThongKe
          key={suaNguyenDonId ?? "moi"}
          banDau={nguyenDon.find(x => x.id === suaNguyenDonId)}
          onDong={() => { setShowThemNguyenDon(false); setSuaNguyenDonId(null); }}
          onLuu={(n) => {
            setNguyenDon(p => suaNguyenDonId
              ? p.map(x => x.id === suaNguyenDonId ? { ...x, ...n } : x)
              : [...p, { id: Date.now(), ...n }]);
            setShowThemNguyenDon(false);
            setSuaNguyenDonId(null);
          }}
        />
      )}
      {showThemBiDon && (
        <PopupThemNguoiDungDon
          tieuDe="Thêm bị đơn/người bị kiện"
          tuCachMacDinh="Bị đơn"
          coThongKe
          key={suaBiDonId ?? "moi"}
          banDau={biDon.find(x => x.id === suaBiDonId)}
          onDong={() => { setShowThemBiDon(false); setSuaBiDonId(null); }}
          onLuu={(n) => {
            setBiDon(p => suaBiDonId
              ? p.map(x => x.id === suaBiDonId ? { ...x, ...n } : x)
              : [...p, { id: Date.now(), ...n }]);
            setShowThemBiDon(false);
            setSuaBiDonId(null);
          }}
        />
      )}
      {showThemNguoiLQ && (
        <PopupThemNguoiDungDon
          tieuDe="Thêm người có quyền lợi, nghĩa vụ liên quan"
          tuCachMacDinh="Người có quyền lợi, nghĩa vụ liên quan"
          coThongKe
          key={suaNguoiLQId ?? "moi"}
          banDau={nguoiLienQuan.find(x => x.id === suaNguoiLQId)}
          onDong={() => { setShowThemNguoiLQ(false); setSuaNguoiLQId(null); }}
          onLuu={(n) => {
            setNguoiLienQuan(p => suaNguoiLQId
              ? p.map(x => x.id === suaNguoiLQId ? { ...x, ...n } : x)
              : [...p, { id: Date.now(), ...n }]);
            setShowThemNguoiLQ(false);
            setSuaNguoiLQId(null);
          }}
        />
      )}
      {/* Popup Sửa kết quả xử lý đơn — mở từ nút trên header Section 5 */}
      {showSuaKetQuaXuLy && (
        <PopupSuaKetQuaXuLyDon
          banDau={{
            noiChuyenDen, donViChuyenDen, caNhanChuyenDen, trangThaiDon,
            thuLyDon, lyDoKhongDu, lyDoTraLai, yeuCauTraLai, lyDoLuuTheoDoi,
            chanhAnHoacToaAn, vuTruong,
          }}
          onClose={() => setShowSuaKetQuaXuLy(false)}
          onSave={(data) => {
            setNoiChuyenDen(data.noiChuyenDen);
            setDonViChuyenDen(data.donViChuyenDen);
            setCaNhanChuyenDen(data.caNhanChuyenDen);
            setTrangThaiDon(data.trangThaiDon);
            setThuLyDon(data.thuLyDon);
            setLyDoKhongDu(data.lyDoKhongDu);
            setLyDoTraLai(data.lyDoTraLai);
            setYeuCauTraLai(data.yeuCauTraLai);
            setLyDoLuuTheoDoi(data.lyDoLuuTheoDoi);
            setChanhAnHoacToaAn(data.chanhAnHoacToaAn);
            setVuTruong(data.vuTruong);

            if (editingRow) {
              const t = new Date();
              const ngay = `${String(t.getDate()).padStart(2, "0")}/${String(t.getMonth() + 1).padStart(2, "0")}/${t.getFullYear()}`;
              const step = data.noiChuyenDen === "Nội bộ" || data.noiChuyenDen === "Tòa khác" || data.noiChuyenDen === "Ngoài tòa án" ? "Chuyển đơn" : data.noiChuyenDen;

              let note = "";
              if (data.noiChuyenDen === "Nội bộ") {
                note = [
                  data.donViChuyenDen && `Chuyển đến: ${data.donViChuyenDen}`,
                  data.caNhanChuyenDen && `Cá nhân: ${data.caNhanChuyenDen}`,
                  data.trangThaiDon && `Trạng thái: ${data.trangThaiDon}`,
                  data.trangThaiDon === "Đơn không đủ điều kiện" && data.lyDoKhongDu && `Lý do: ${data.lyDoKhongDu}`,
                  hasGiamDocThamResult
                    ? (data.vuTruong && `Vụ trưởng: ${data.vuTruong}`)
                    : (data.trangThaiDon === "Đơn đủ điều kiện" && data.thuLyDon && `Thụ lý: ${data.thuLyDon}`),
                ].filter(Boolean).join(" · ");
              } else if (data.noiChuyenDen === "Tòa khác") {
                note = [data.donViChuyenDen && `Chuyển đến: ${data.donViChuyenDen}`, `Hình thức: ${data.chanhAnHoacToaAn}`].filter(Boolean).join(" · ");
              } else if (data.noiChuyenDen === "Ngoài tòa án") {
                note = data.donViChuyenDen ? `Chuyển đến: ${data.donViChuyenDen}` : "";
              } else if (data.noiChuyenDen === "Trả lại đơn") {
                note = [data.lyDoTraLai && `Lý do: ${data.lyDoTraLai}`, data.yeuCauTraLai && `Yêu cầu: ${data.yeuCauTraLai}`].filter(Boolean).join(" · ");
              } else if (data.noiChuyenDen === "Lưu theo dõi") {
                note = data.lyDoLuuTheoDoi ? `Lý do: ${data.lyDoLuuTheoDoi}` : "";
              }

              const newEntry = {
                date: ngay,
                step,
                actor: nguoiTheoVaiTro(currentRole).nguoi,
                note,
                rawData: data
              };
              editingRow.processingHistory = [...(editingRow.processingHistory ?? []), newEntry];
            }

            setShowSuaKetQuaXuLy(false);
          }}
        />
      )}
      {/* Popup Chi tiết kết quả xử lý đơn — mở từ nút Xem trên lịch sử */}
      {xemChiTietHistory && (
        <PopupChiTietKetQuaXuLy
          data={xemChiTietHistory}
          onClose={() => setXemChiTietHistory(null)}
        />
      )}
    </div>
  );
}
