import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  X, ChevronDown, ChevronRight, AlertTriangle, MoreVertical,
  Check, Info, FileText, Save, Send, Printer, User, Edit, Trash2,
  ChevronsDown, ChevronsUp
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
  // Cấp 1 của Công văn chuyển nội bộ: cho phép bấm "Lấy số"
  coTheLaySo?: boolean;
  soVanBan?: string;
  ngayLaySo?: string;
  tenGoc?: string;      // tên chưa kèm số, dùng để dựng lại nhãn sau khi lấy số
  hauToSo?: string;     // "TTr-TAHN-VP" cho tờ trình, "TAHN-VP" cho công văn
  sttHienThi?: number;  // STT của đơn trong danh sách chứa nó
  // Văn bản đi kèm: vẫn giữ originalData để hiển thị đầy đủ thông tin đơn,
  // nhưng không chấm validation theo luật của loại văn bản chính.
  khongCham?: boolean;
}

/** Dữ liệu modal trả ra khi cán bộ bấm "Trình duyệt".
 *  Đây là đường ra DUY NHẤT của popup — trước kia popup là ngõ cụt, tạo văn bản
 *  xong không màn nào thấy. App nhận payload này, dựng VanBanTrinh và đẩy vào
 *  kho dùng chung của module Quản lý văn bản. */
export interface KetQuaTrinhDuyet {
  trichYeu: string;
  loaiVanBan: string;
  nguoiTao: string;
  nguoiDuyet: string;
  nguoiKy: string;
  /** Thân văn bản. Sinh từ loại văn bản + danh sách đơn kèm theo. */
  noiDung: string;
  /** Lời nhắn gửi người duyệt bước 1. Tách hẳn khỏi thân văn bản: nó là
   *  ý kiến của người trình, ghi vào lịch sử tại mốc "Trình duyệt". */
  yKienTrinh?: string;
  soVanBan?: string;   // có nếu cán bộ đã bấm "Lấy số tạm"
  donDinhKem: { ma: string; nguoiGui: string; soBA: string; hinhThuc: string }[];
}

interface DocumentNumberingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string; // "can-bo" or "truong-phong" or others
  selectedRows: any[];
  loaiVanBanMacDinh?: string; // Loại văn bản đã chọn ở bộ lọc màn Danh sách đơn
  onTrinhDuyet?: (kq: KetQuaTrinhDuyet) => void;
  /** Bấm "Xem văn bản đã trình" ở popup thành công — sang màn Danh sách văn bản. */
  onXemVanBanDaTrinh?: () => void;
  /** Mã đơn (nguyên bản) → mô tả văn bản đang chứa nó, ví dụ
   *  `"Mã 7022" → "545/2026/TTr-TAHN-VP (bị trả lại)"`.
   *  Đưa thẳng vào hệ thống "đơn không hợp lệ" sẵn có, không dựng cảnh báo riêng. */
  donTrung?: Record<string, string>;
}

// --- Mock Data ---
const DOC_TYPES = [
  "Giấy xác nhận", 
  "Giấy xác nhận cơ quan chuyển đơn", 
  "Công văn chuyển nội bộ", 
  "Công văn chuyển tòa khác", 
  "Công văn chuyển ngoài", 
  "Trả lại đơn", 
  // Đã ẩn "Thông báo phân công thẩm phán" khỏi danh mục — không còn lập từ
  // luồng Danh sách đơn nữa.
  "Tờ trình khác", 
  "Thông báo phân công TP", 
  "Yêu cầu bổ sung"
];

const INITIAL_TREE_DATA: DocNode[] = [
  {
    id: "doc-1",
    name: "Thông báo phân công thẩm phán",
    type: "Thông báo",
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

// Danh sách người cho luồng duyệt Thông báo phân công thẩm phán
const NGUOI_DUYET_OPTIONS = [
  "Trần Văn B - Trưởng phòng - 15/04/1980",
  "Lê Thị C - Phó phòng - 22/09/1985",
];
// Toàn bộ văn bản có thể đính kèm
const VAN_BAN_DI_KEM_TAT_CA = [
  "Giấy xác nhận",
  "Giấy xác nhận cơ quan chuyển đơn",
  "Công văn chuyển đơn",
  "Công văn chuyển nội bộ",
  "Công văn chuyển tòa khác",
  "Công văn chuyển ngoài",
  "Danh sách đơn chuyển tòa khác",
  "Danh sách thụ lý mới",
  "Trả lại đơn",
  "Thông báo phân công",
  "Tờ trình khác",
  "Thông báo phân công TP",
  "Yêu cầu bổ sung",
];

// Giới hạn theo loại văn bản chính. Loại nào không có ở đây thì cho chọn tất cả.
const VAN_BAN_DI_KEM_GIOI_HAN: Record<string, string[]> = {
  "Giấy xác nhận": [
    "Giấy xác nhận cơ quan chuyển đơn",
    "Danh sách thụ lý mới",
  ],
  "Giấy xác nhận cơ quan chuyển đơn": [
    "Giấy xác nhận",
  ],
  "Công văn chuyển nội bộ": [
    "Giấy xác nhận",
    "Giấy xác nhận cơ quan chuyển đơn",
  ],
  "Công văn chuyển tòa khác": [
    "Danh sách đơn chuyển tòa khác",
  "Danh sách thụ lý mới",
    "Giấy xác nhận cơ quan chuyển đơn",
  ],
  "Công văn chuyển ngoài": [
    "Danh sách đơn chuyển tòa khác",
  "Danh sách thụ lý mới",
    "Giấy xác nhận cơ quan chuyển đơn",
    "Giấy xác nhận",
  ],
  // DOC_TYPES đặt tên loại này là "Trả lại đơn"
  "Trả lại đơn": [
    "Giấy xác nhận",
    "Yêu cầu bổ sung",
    "Giấy xác nhận cơ quan chuyển đơn",
  ],
  "Thông báo phân công TP": [
    "Công văn chuyển nội bộ",
    "Giấy xác nhận",
    "Giấy xác nhận cơ quan chuyển đơn",
  ],
  "Yêu cầu bổ sung": [
    "Giấy xác nhận",
    "Giấy xác nhận cơ quan chuyển đơn",
  ],
};

const MUC_DO_UU_TIEN = ["Bình thường", "Thấp", "Cao"];

// ─── Primitive cho thanh cấu hình đầu màn ────────────────────────────────────
// Gom nhãn + ô nhập về một khuôn để mọi trường cùng cỡ chữ, cùng chiều cao,
// cùng cách đánh dấu bắt buộc — trước đây mỗi trường tự viết một kiểu.
const NhanTruong = ({ children, bat, phu }: { children: React.ReactNode; bat?: boolean; phu?: string }) => (
  <label className="block text-[12px] font-semibold text-on-surface-variant mb-1.5 truncate">
    {children}
    {bat && <span className="text-[#e74c3c] ml-0.5">*</span>}
    {phu && <span className="font-normal text-outline ml-1">{phu}</span>}
  </label>
);

const O_CAO = "h-[34px]";
const oNhapCls = (hopLe = true) =>
  `w-full ${O_CAO} pl-3 pr-8 text-[13px] border rounded-[4px] bg-white outline-none appearance-none transition-colors
   focus:border-primary focus:ring-2 focus:ring-primary/15
   ${hopLe ? "border-surface-container-highest text-on-surface" : "border-[#e57373] text-outline bg-[#fffbfb]"}`;

// Mức độ ưu tiên: chấm màu để quét mắt nhanh, khỏi phải đọc chữ
const MAU_UU_TIEN: Record<string, string> = {
  "Thấp": "bg-[#9aa5b1]",
  "Bình thường": "bg-[#27ae60]",
  "Cao": "bg-error",
};

// Số lần yêu cầu bổ sung của một đơn = số YCBS đã gắn với đơn + 1 (lần đang lập).
// Hệ thống tự tính, cán bộ không nhập tay để tránh đánh số lệch nhau giữa các đơn.
const demYcbsDaCo = (d: any) =>
  [d?.ycbsSo, d?.ycbsSo2].filter(x => (x ?? "").trim()).length;

// Lý do lập Yêu cầu bổ sung
export const LY_DO_YEU_CAU_BO_SUNG = [
  "Thiếu Bản án/quyết định có hiệu lực pháp luật",
  "Thiếu thông tin căn cước công dân",
  "Viết lại đơn",
  "Lý do khác",
];

// Ký hiệu số theo loại văn bản. Loại không khai ở đây dùng mặc định TAHN-VP.
const HAU_TO_SO_RIENG: Record<string, string> = {
  "Thông báo phân công TP": "TB-TA",
  "Giấy xác nhận": "TB-TA",
};
const hauToSoCua = (loaiVB: string) =>
  HAU_TO_SO_RIENG[loaiVB] ?? (loaiVB.startsWith("Tờ trình") ? "TTr-TAHN-VP" : "TAHN-VP");

const NGUOI_KY_OPTIONS = [
  "Nguyễn Minh An - Phó CVP - 01/03/1975",
  "Hoàng Kim Long - CVP - 10/08/1970",
];
// --- Biểu mẫu Thông báo phân công Thẩm phán ---
interface ToTrinhInfo {
  soTT: string; ngay: string; thang: string; nam: string;
  kinhTrinh: string;
  tieuDe: string;
  doan: string[];
  chucDanhKy: string; nguoiKy: string;
  loaiAn: string; thamPhan: string; chucDanhKyDS: string; nguoiKyDS: string;
}

const TO_TRINH_MAC_DINH: ToTrinhInfo = {
  soTT: "", ngay: "", thang: "", nam: "",
  kinhTrinh: "Đồng chí Chánh án Tòa án nhân dân thành phố Hà Nội",
  tieuDe: "Về việc thụ lý đơn và phân công Thẩm phán giải quyết đơn đề nghị xem xét lại quyết định, bản án đã có hiệu lực pháp luật theo trình tự giám đốc thẩm, tái thẩm",
  doan: [
    "Tòa Dân sự Tòa án nhân dân thành phố Hà Nội nhận và thụ lý các đơn đề nghị, kiến nghị, thông báo của công dân, tổ chức gửi Tòa án nhân dân thành phố Hà Nội đề nghị xem xét lại quyết định, bản án đã có hiệu lực pháp luật theo trình tự giám đốc thẩm và dự kiến phân công các Thẩm phán Tòa án nhân dân giải quyết đơn",
    "Sau khi xem xét các đơn đề nghị, kiến nghị theo thủ tục giám đốc thẩm, Văn phòng nhận thấy các đơn đề nghị, kiến nghị nêu trên đã đủ điều kiện thụ lý theo quy định. Căn cứ vào kết quả phân công khách quan theo tổ Thẩm phán chuyên sâu; số lượng vụ án mà các Thẩm phán đang xem xét giải quyết; các vụ án có cùng nguyên đơn, bị đơn; có cùng người khởi kiện, người bị kiện.",
    "Tòa Dân sự báo cáo và kính đề nghị đồng chí Chánh án Tòa án nhân dân thành phố Hà Nội giải quyết (có danh sách kèm theo).",
    "Kính trình Đồng chí./.",
  ],
  chucDanhKy: "KT. CHÁNH VĂN PHÒNG\nPHÓ CHÁNH VĂN PHÒNG",
  nguoiKy: "",
  loaiAn: "Hình sự",
  thamPhan: "Ngô Hồng Phúc",
  chucDanhKyDS: "CHÁNH VĂN PHÒNG",
  nguoiKyDS: "Nguyễn Tường Linh",
};

// Quốc hiệu dùng chung cho cả 2 tab
const QuocHieu = () => (
  <div className="grid grid-cols-2">
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
);

// Khổ giấy A4 dùng chung cho các biểu mẫu văn bản đi kèm
const TrangA4 = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto bg-white shadow-md w-full max-w-[794px] px-[85px] py-[55px] text-black font-['Times_New_Roman','Times',serif] text-[14px] leading-[1.55] ${className}`}>
    {children}
  </div>
);

const NoiNhan = ({ dong, ky }: { dong: string[]; ky: string[] }) => (
  <div className="grid grid-cols-2 mt-8">
    <div className="text-[12px]">
      <div className="font-bold italic">Nơi nhận:</div>
      {dong.map(d => <div key={d}>{d}</div>)}
    </div>
    <div className="text-center text-[13px] font-bold">
      {ky.map(k => <div key={k}>{k}</div>)}
    </div>
  </div>
);

// Biểu mẫu: Công văn chuyển nội bộ
const MauCongVanChuyenNoiBo = ({ so, ngay }: { so: string; ngay: string }) => (
  <TrangA4>
    <div className="grid grid-cols-2 text-center text-[13px]">
      <div>TÒA ÁN NHÂN DÂN TỐI CAO</div>
      <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
    </div>
    <div className="grid grid-cols-2 text-center text-[13px] mt-4">
      <div>
        <div className="font-bold">VĂN PHÒNG</div>
        <div className="w-[95px] h-[1px] bg-black mx-auto mt-1" />
      </div>
      <div>
        <div className="font-bold">Độc lập - Tự do - Hạnh phúc</div>
        <div className="w-[185px] h-[1px] bg-black mx-auto mt-1" />
      </div>
    </div>
    <div className="grid grid-cols-2 text-center text-[13px] mt-5">
      <div>Số: {so}/TAHN-VP</div>
      <div className="italic">{ngay}</div>
    </div>

    <div className="mt-10">Kính gửi:</div>

    <div className="mt-5 space-y-4 text-justify">
      <p className="indent-[42px]">
        Tòa Dân sự Tòa án nhân dân thành phố Hà Nội đã nhận và thụ lý các đơn của
        công dân, tổ chức gửi Tòa án nhân dân thành phố Hà Nội đề nghị xem xét lại quyết định, bản án
        đã có hiệu lực pháp luật theo trình tự giám đốc thẩm, tái thẩm
        (có danh sách đơn gửi kèm theo Công văn này).
      </p>
      <p className="indent-[42px]">
        Tòa Dân sự chuyển các đơn đề nghị, kiến nghị, thông báo đến Quý vụ
        để xem xét, giải quyết theo thẩm quyền. Đề nghị Quý vụ ký xác nhận và chuyển phát danh
        sách đã ký nhận về phòng Tiếp công dân và xử lý đơn tư pháp thuộc Vụ Giám đốc, kiểm tra
        về dân sự Tòa án nhân dân thành phố Hà Nội./.
      </p>
    </div>

    <NoiNhan
      dong={["- Như trên;", "- Đ/c Chánh án TAND TP Hà Nội (để b/c);", "- Đ/c Chánh Văn phòng TAND TP Hà Nội (để b/c);", "- Lưu: VP TAND TP Hà Nội."]}
      ky={["KT. CHÁNH VĂN PHÒNG", "PHÓ CHÁNH VĂN PHÒNG"]} />
  </TrangA4>
);

// Biểu mẫu: Giấy xác nhận cơ quan chuyển đơn
const MauGiayXacNhanCoQuan = ({ so, ngay, row }: { so: string; ngay: string; row?: any }) => {
  const d = row?.thongTinDon ?? {};
  return (
    <TrangA4>
      <div className="grid grid-cols-2 text-center text-[13px]">
        <div>
          <div>TÒA ÁN NHÂN DÂN TỐI CAO</div>
          <div className="w-[95px] h-[1px] bg-black mx-auto mt-1" />
          <div className="mt-3">Số: {so}/TAHN-VP</div>
        </div>
        <div>
          <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div className="font-bold mt-1.5">Độc lập - Tự do - Hạnh phúc</div>
          <div className="w-[185px] h-[1px] bg-black mx-auto mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-2 text-center text-[13px] mt-4">
        <div className="italic leading-[1.4]">V/v chuyển đơn đến cơ quan đơn vị<br />xem xét giải quyết</div>
        <div className="italic self-end">{ngay}</div>
      </div>

      <div className="text-center mt-9">Kính gửi: {d.donViGui || row?.nguoiGui || "……"}</div>

      <div className="mt-6 space-y-4 text-justify">
        <p className="indent-[42px]">
          Tòa án nhân dân thành phố Hà Nội nhận được công văn số {d.soCV || "……"} ngày {d.ngayCV || "……"} của{" "}
          {d.donViGui || "……"} chuyển đơn của ông/bà {row?.nguoiGui || "……"} về việc đề nghị Chánh án
          Tòa án nhân dân thành phố Hà Nội xem xét theo thủ tục giám đốc thẩm/tái thẩm đối với Bản án/Quyết định
          số {d.soBaqd || "……"} ngày {d.ngay || "……"} của {d.toaXetXu || "……"} đã có hiệu lực pháp luật.
        </p>
        <p className="indent-[42px]">
          Sau khi nghiên cứu đơn đề nghị nêu trên, Tòa Dân sự Tòa án nhân dân thành phố Hà Nội
          đã chuyển đơn của ông/bà {row?.nguoiGui || "……"} đến {d.donViGiaiQuyet || "……"} thuộc Tòa án nhân dân
          thành phố Hà Nội theo công văn số {so}/TAHN-VP ngày {ngay} để xem xét, giải quyết theo quy định pháp luật.
        </p>
        <p className="indent-[42px]">
          Tòa án nhân dân thành phố Hà Nội trân trọng thông báo để Quý cơ quan được biết./.
        </p>
      </div>

      <NoiNhan
        dong={["- Như trên;", "- Đ/c Chánh án TAND TP Hà Nội (để b/c);", "- Đ/c Chánh Văn phòng TAND TP Hà Nội (để b/c);", "- Lưu: VP TAND TP Hà Nội."]}
        ky={["TL. CHÁNH ÁN", "KT. CHÁNH VĂN PHÒNG", "PHÓ CHÁNH VĂN PHÒNG"]} />
    </TrangA4>
  );
};

// Biểu mẫu: Giấy xác nhận (Thông báo tiếp nhận đơn)
const Sup = ({ n }: { n: string }) => <sup className="text-[9px]">({n})</sup>;

const MauGiayXacNhan = ({ so, ngay, row }: { so: string; ngay: string; row?: any }) => {
  const d = row?.thongTinDon ?? {};
  return (
    <TrangA4>
      <div className="grid grid-cols-2 text-center text-[13px]">
        <div>
          <div><Sup n="1" />TÒA ÁN NHÂN DÂN TỐI CAO</div>
          <div className="w-[95px] h-[1px] bg-black mx-auto mt-1" />
          <div className="mt-3">Số: <Sup n="2" />{so}/TB-TA</div>
        </div>
        <div>
          <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div className="font-bold mt-1.5">Độc lập - Tự do - Hạnh phúc</div>
          <div className="w-[185px] h-[1px] bg-black mx-auto mt-1" />
          <div className="italic mt-3"><Sup n="3" />{ngay}</div>
        </div>
      </div>

      <div className="text-center mt-8">
        <div className="text-[15px] font-bold">THÔNG BÁO</div>
        <div className="text-[14px] font-bold mt-1 leading-[1.5]">
          Về việc tiếp nhận <Sup n="16" />Đơn đề nghị giám đốc thẩm/Kiến nghị giám đốc thẩm
          <br />đối với bản án (quyết định) của Tòa án đã có hiệu lực pháp luật
          <br />cần xem xét lại theo thủ tục giám đốc thẩm
        </div>
      </div>

      <div className="mt-7 pl-[70px]">
        <div>Kính gửi: <Sup n="4" />Ông/Bà {row?.nguoiGui || "……"}</div>
        <div>Địa chỉ: <Sup n="5" />{row?.diaChi || "……"}</div>
      </div>

      <div className="mt-6 space-y-4 text-justify">
        <p className="indent-[42px]">
          Căn cứ <Sup n="6" />Điều 375 của Bộ luật tố tụng hình sự, <Sup n="7" />Tòa án nhân dân thành phố Hà Nội
          thông báo cho <Sup n="8" />ông/bà {row?.nguoiGui || "……"} biết <Sup n="9" />ngày {ngay}{" "}
          <Sup n="10" />Tòa án nhân dân thành phố Hà Nội đã nhận được Đơn đề nghị giám đốc thẩm/Kiến nghị giám đốc
          thẩm đối với Bản án/Quyết định số: <Sup n="11" />{d.soBaqd || "……"} <Sup n="12" />ngày {d.ngay || "……"}{" "}
          của <Sup n="13" />{d.toaXetXu || "……"} đã có hiệu lực pháp luật cần xem xét theo thủ tục giám đốc thẩm.
        </p>
        <p className="indent-[42px]">
          Căn cứ các quy định của pháp luật tố tụng hình sự, <Sup n="17" />Tòa án nhân dân thành phố Hà Nội sẽ tiến
          hành xem xét Đơn đề nghị/Kiến nghị nêu trên theo thủ tục giám đốc thẩm.
        </p>
      </div>

      <div className="grid grid-cols-2 mt-8">
        <div className="text-[12px]">
          <div className="font-bold italic">Nơi nhận:</div>
          <div>- Như trên;</div>
          <div>- Đ/c Chánh Văn phòng TAND TP Hà Nội (để b/c);</div>
          <div>- Lưu: HCTP, VP.</div>
          <div className="mt-1"><Sup n="15" />09D01167596-</div>
        </div>
        <div className="text-center text-[13px] font-bold">
          <div>TL. CHÁNH ÁN</div>
          <div>KT. CHÁNH VĂN PHÒNG</div>
          <div>PHÓ CHÁNH VĂN PHÒNG</div>
          <div className="mt-14 font-bold"><Sup n="14" />Nguyễn Văn A</div>
        </div>
      </div>
    </TrangA4>
  );
};

// Biểu mẫu: Thông báo yêu cầu sửa đổi, bổ sung — gửi ĐƯƠNG SỰ
const MauYCBSDuongSu = ({ so, ngay, row }: { so: string; ngay: string; row?: any }) => {
  const d = row?.thongTinDon ?? {};
  return (
    <TrangA4>
      <div className="grid grid-cols-2 text-center text-[13px]">
        <div>
          <div>TÒA ÁN NHÂN DÂN <Sup n="1" />CẤP CAO</div>
          <div className="font-bold">TẠI HÀ NỘI</div>
          <div className="w-[95px] h-[1px] bg-black mx-auto mt-1" />
          <div className="mt-2">Số: <Sup n="2" />{so}/TB-TA</div>
        </div>
        <div>
          <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div className="font-bold mt-1">Độc lập - Tự do - Hạnh phúc</div>
          <div className="w-[185px] h-[1px] bg-black mx-auto mt-1" />
          <div className="italic mt-3"><Sup n="3" />{ngay}</div>
        </div>
      </div>

      <div className="text-center mt-7">
        <div className="text-[15px] font-bold">THÔNG BÁO</div>
        <div className="text-[14px] font-bold mt-0.5">YÊU CẦU SỬA ĐỔI, BỔ SUNG</div>
        <div className="text-[14px] font-bold mt-0.5">ĐƠN ĐỀ NGHỊ GIÁM ĐỐC THẨM, TÁI THẨM</div>
      </div>

      <div className="mt-6 pl-[70px] space-y-1">
        <div>Kính gửi: <Sup n="5" />{row?.nguoiGui || "……"}</div>
        <div>Địa chỉ: <Sup n="6" />{row?.diaChi || "……"}</div>
      </div>

      <div className="mt-5 space-y-3 text-justify">
        <p className="indent-[42px]">
          Căn cứ <Sup n="7" />khoản 2 Điều 329, Điều 353, 357 của Bộ luật tố tụng dân sự về thủ tục
          nhận đơn đề nghị xem xét bản án, quyết định của Tòa án đã có hiệu lực pháp luật theo thủ tục
          giám đốc thẩm/tái thẩm;
        </p>
        <p className="indent-[42px]">
          Xét đơn đề nghị giám đốc thẩm/tái thẩm của <Sup n="5" />{row?.nguoiGui || "……"} đề ngày{" "}
          {d.ngayCV || d.ngay || "……"} về việc đề nghị Chánh án Tòa án nhân dân thành phố Hà Nội xem xét theo
          thủ tục giám đốc thẩm/tái thẩm đối với <Sup n="8" />Bản án/Quyết định số {d.soBaqd || "……"}{" "}
          ngày {d.ngay || "……"} của {d.toaXetXu || "……"} đã có hiệu lực pháp luật;
        </p>
        <p className="indent-[42px]">
          Tòa án nhân dân thành phố Hà Nội yêu cầu <Sup n="5" />{row?.nguoiGui || "……"} sửa đổi, bổ sung các
          nội dung sau đây trong thời hạn 30 ngày, kể từ ngày nhận được thông báo này:
        </p>
        <div className="pl-[42px] space-y-1">
          <div>- <Sup n="9" />Khiếu nại Bản án/Quyết định số {d.soBaqd || "……"} ngày {d.ngay || "……"} của {d.toaXetXu || "……"};</div>
          <div>- <Sup n="9" />Xác nhận của Ủy ban nhân dân xã, phường, thị trấn nơi cư trú hoặc kèm theo bản photo giấy tờ tùy thân;</div>
          <div>- <Sup n="9" />Giấy ủy quyền và căn cước công dân.</div>
        </div>
        <p className="indent-[42px]">
          Trường hợp người đề nghị không sửa đổi, bổ sung đơn đề nghị và gửi lại cho Tòa án trong thời
          hạn trên thì Tòa án trả lại đơn đề nghị, tài liệu chứng cứ kèm theo cho người đề nghị.
        </p>
        <p className="indent-[42px] italic text-[13px]">
          (Lưu ý: Để sớm hoàn thành việc xử lý đơn, khi nộp đơn sửa đổi, bổ sung và các tài liệu kèm
          theo, đề nghị gửi kèm theo bản photo thông báo này cho Phòng Tiếp công dân và xử lý đơn tư
          pháp thuộc Văn phòng Tòa án nhân dân thành phố Hà Nội theo địa chỉ: ).
        </p>
      </div>

      <div className="grid grid-cols-2 mt-8">
        <div className="text-[12px]">
          <div className="font-bold italic">Nơi nhận:</div>
          <div>- Như trên;</div>
          <div>- Đ/c Chánh văn phòng <Sup n="10" />TANDCC (để b/c);</div>
          <div>- Lưu: GĐKT, TT & THA, VP TAND TP Hà Nội;</div>
          <div className="mt-1"><Sup n="11" />09D01167375-</div>
        </div>
        <div className="text-center text-[13px] font-bold">
          <div>TL. CHÁNH ÁN</div>
          <div>KT. CHÁNH VĂN PHÒNG</div>
          <div>PHÓ CHÁNH VĂN PHÒNG</div>
        </div>
      </div>
    </TrangA4>
  );
};

// Biểu mẫu: Hướng dẫn sửa đổi, bổ sung đơn thư — gửi TRẠI GIAM
const MauYCBSTraiGiam = ({ so, ngay, row }: { so: string; ngay: string; row?: any }) => {
  const d = row?.thongTinDon ?? {};
  const traiGiam = d.donViGui || "Trại tạm giam ……";
  return (
    <TrangA4>
      <div className="grid grid-cols-2 text-center text-[13px]">
        <div>
          <div>TÒA ÁN NHÂN DÂN TỐI CAO</div>
          <div className="w-[95px] h-[1px] bg-black mx-auto mt-1" />
          <div className="mt-3">Số: {so}/TB-TA</div>
          <div className="italic leading-tight mt-3">V/v Hướng dẫn sửa đổi,<br />Bổ sung đơn thư</div>
        </div>
        <div>
          <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div className="font-bold mt-1">Độc lập - Tự do - Hạnh phúc</div>
          <div className="w-[185px] h-[1px] bg-black mx-auto mt-1" />
          <div className="italic mt-3">{ngay}</div>
        </div>
      </div>

      <div className="mt-8 pl-[70px] space-y-1">
        <div>Kính gửi: {traiGiam}</div>
        <div>Địa chỉ:</div>
      </div>

      <div className="mt-5 space-y-3 text-justify">
        <p className="indent-[42px]">
          Tòa án nhân dân thành phố Hà Nội nhận được đơn của phạm nhân {row?.nguoiGui || "……"} đề ngày{" "}
          {d.ngayCV || d.ngay || "……"} (do {traiGiam} chuyển đến), trong đơn có nội dung đề nghị xem
          xét theo thủ tục giám đốc thẩm đối với Bản án số {d.soBaqd || "……"} ngày {d.ngay || "……"}{" "}
          của {d.toaXetXu || "……"} đã có hiệu lực pháp luật;
        </p>
        <p className="indent-[42px]">
          Để có cơ sở xem xét đơn đề nghị giám đốc thẩm nêu trên, Tòa án nhân dân thành phố Hà Nội đề nghị{" "}
          {traiGiam} hướng dẫn phạm nhân {row?.nguoiGui || "……"} bổ sung các nội dung sau:
        </p>
        <div className="pl-[42px]">
          - Cung cấp bản sao bản án/quyết định số {d.soBaqd || "……"} ngày {d.ngay || "……"} của{" "}
          {d.toaXetXu || "……"} đã có hiệu lực pháp luật và các tài liệu liên quan đến việc đề nghị
          giám đốc thẩm.
        </div>
        <p className="indent-[42px] italic text-[13px]">
          (Lưu ý: Đề nghị gửi đơn và các tài liệu kèm theo đến Phòng Tiếp công dân và xử lý đơn tư
          pháp thuộc Văn phòng Tòa án nhân dân thành phố Hà Nội theo địa chỉ: ).
        </p>
      </div>

      <div className="grid grid-cols-2 mt-8">
        <div className="text-[12px]">
          <div className="font-bold italic">Nơi nhận:</div>
          <div>- Như trên;</div>
          <div>- Lưu: Văn phòng;</div>
          <div>09D01165231-PTLH</div>
        </div>
        <div className="text-center text-[13px] font-bold">
          <div>TL. CHÁNH ÁN</div>
          <div>KT. CHÁNH VĂN PHÒNG</div>
          <div>PHÓ CHÁNH VĂN PHÒNG</div>
          <div className="mt-14">Nguyễn Văn A</div>
        </div>
      </div>
    </TrangA4>
  );
};

// Popup chặn trình duyệt khi còn đơn không hợp lệ
const PopupChanTrinhDuyet = ({ soDon, lyDo, onBoDon, onDong }: {
  soDon: number; lyDo: string[]; onBoDon: () => void; onDong: () => void;
}) => (
  <div className="fixed inset-0 z-[210] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[8px] shadow-2xl w-[560px] overflow-hidden">
      <div className="px-6 pt-7 pb-4 text-center">
        <div className="w-14 h-14 rounded-full bg-[#fdecea] border-2 border-[#e57373] flex items-center justify-center mx-auto">
          <AlertTriangle size={28} className="text-error" />
        </div>
        <div className="text-[17px] font-bold text-error mt-3">Không thể trình duyệt</div>
        <div className="text-[13px] text-on-surface-variant mt-1">
          Còn <b className="text-error">{soDon} đơn không hợp lệ</b> trong danh sách.
          Vui lòng bỏ các đơn này rồi trình duyệt lại.
        </div>
      </div>

      <div className="mx-6 mb-5 px-4 py-3 bg-[#fdf3f2] border border-[#e57373] rounded-[6px] text-[12px] text-error">
        <div className="font-semibold mb-1">Lý do:</div>
        <ul className="list-disc pl-4 space-y-0.5">
          {lyDo.map(l => <li key={l}>{l}</li>)}
        </ul>
      </div>

      <div className="flex justify-end gap-2 px-6 py-4 border-t border-surface-container-high bg-surface-bright">
        <button onClick={onDong}
          className="px-5 py-2 text-[13px] font-semibold text-on-surface-variant bg-white border border-surface-container-highest rounded-[4px] hover:bg-surface-container-low transition-colors">
          Đóng
        </button>
        <button onClick={onBoDon}
          className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-semibold text-white bg-error hover:bg-error-container rounded-[4px] transition-colors">
          <Trash2 size={14} /> Bỏ {soDon} đơn không hợp lệ
        </button>
      </div>
    </div>
  </div>
);

// Popup báo đã trình duyệt xong
const PopupTrinhDuyetXong = ({ loaiVanBan, soVanBan, daLaySo, nguoiDuyet, nguoiKy, mucDo, lyDo, onDong, onXem }: {
  loaiVanBan: string; soVanBan: number; daLaySo: number;
  nguoiDuyet: string; nguoiKy: string; mucDo: string; lyDo?: string;
  onDong: () => void; onXem?: () => void;
}) => (
  <div className="fixed inset-0 z-[210] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[8px] shadow-2xl w-[560px] overflow-hidden">
      <div className="px-6 pt-7 pb-4 text-center">
        <div className="w-14 h-14 rounded-full bg-[#e8f5e9] border-2 border-[#4caf50] flex items-center justify-center mx-auto">
          <Check size={30} className="text-[#2e7d32]" strokeWidth={3} />
        </div>
        <div className="text-[17px] font-bold text-[#1b5e20] mt-3">Trình duyệt thành công</div>
        <div className="text-[13px] text-on-surface-variant mt-1 leading-relaxed">
          Hồ sơ đã gửi tới <b>{nguoiDuyet.split(" - ")[0] || "người duyệt"}</b>.<br />
          Xem tiến độ tại màn <b>Văn bản trình ký của tôi</b> bất cứ lúc nào.
        </div>
      </div>

      <div className="mx-6 mb-4 border border-surface-container rounded-[6px] divide-y divide-[#f0f0f0] text-[13px]">
        {[
          ["Loại văn bản", loaiVanBan],
          ...(lyDo ? [["Lý do yêu cầu", lyDo]] : []),
          ["Số văn bản đã tạo", `${soVanBan} văn bản`],
          ["Đã cấp số", `${daLaySo}/${soVanBan}`],
          ["Người duyệt", nguoiDuyet.split(" - ")[0] || "—"],
          ["Người ký", nguoiKy.split(" - ")[0] || "—"],
          ["Mức độ ưu tiên", mucDo],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2">
            <span className="text-on-surface-variant">{k}</span>
            <span className="font-medium text-on-surface text-right">{v}</span>
          </div>
        ))}
      </div>

      {daLaySo < soVanBan && (
        <div className="mx-6 mb-4 flex items-start gap-2 px-3 py-2 bg-[#fff7e6] border border-[#f59e0b] rounded-[4px] text-[12px] text-[#92400e]">
          <AlertTriangle size={14} className="flex-shrink-0 mt-[1px]" />
          <span>
            Còn {soVanBan - daLaySo} văn bản chưa cấp số — hệ thống sẽ tự động cấp số
            sau khi Chánh Văn phòng/Phó Chánh Văn phòng ký.
          </span>
        </div>
      )}

      <div className="flex justify-end gap-2 px-6 py-4 border-t border-surface-container-high bg-surface-bright">
        {onXem && (
          <button onClick={onXem}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-tertiary bg-white border border-tertiary hover:bg-[#eef1f5] rounded-[4px] transition-colors">
            <FileText size={14} /> Xem văn bản đã trình
          </button>
        )}
        <button onClick={onDong}
          className="px-6 py-2 text-[13px] font-semibold text-white bg-tertiary hover:bg-[#15223a] rounded-[4px] transition-colors">
          Đóng
        </button>
      </div>
    </div>
  </div>
);

// Popup báo trình duyệt không thành công. `lyDo` nêu nguyên nhân cụ thể
// (ví dụ "Không có văn bản hợp lệ để trình duyệt") khi biết được; để trống
// thì chỉ hiện thông báo lỗi hệ thống chung chung.
const PopupTrinhDuyetLoi = ({ lyDo, onDong, onThuLai }: { lyDo?: string; onDong: () => void; onThuLai: () => void }) => (
  <div className="fixed inset-0 z-[210] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[8px] shadow-2xl w-[480px] overflow-hidden">
      <div className="px-6 pt-7 pb-4 text-center">
        <div className="w-14 h-14 rounded-full bg-[#fdecea] border-2 border-[#e57373] flex items-center justify-center mx-auto">
          <X size={28} className="text-error" strokeWidth={3} />
        </div>
        <div className="text-[17px] font-bold text-error mt-3">Trình duyệt không thành công</div>
        <div className="text-[13px] text-on-surface-variant mt-1 leading-relaxed">
          Hệ thống không thể gửi hồ sơ đi duyệt. Văn bản chưa được tạo.
        </div>
      </div>

      {lyDo && (
        <div className="mx-6 mb-5 px-4 py-3 bg-[#fdf3f2] border border-[#e57373] rounded-[6px] text-[12px] text-error">
          <span className="font-semibold">Lý do: </span>{lyDo}
        </div>
      )}

      <div className="flex justify-end gap-2 px-6 py-4 border-t border-surface-container-high bg-surface-bright">
        <button onClick={onDong}
          className="px-5 py-2 text-[13px] font-semibold text-on-surface-variant bg-white border border-surface-container-highest rounded-[4px] hover:bg-surface-container-low transition-colors">
          Đóng
        </button>
        <button onClick={onThuLai}
          className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-semibold text-white bg-error hover:bg-[#7a1717] rounded-[4px] transition-colors">
          <Send size={14} /> Thử lại
        </button>
      </div>
    </div>
  </div>
);

// Biểu mẫu: Danh sách thụ lý mới — mỗi vụ (đơn vị giải quyết) một bản riêng
const MauDanhSachThuLyMoi = ({ so, ngay, donVi, rows }: {
  so: string; ngay: string; donVi: string; rows: any[];
}) => (
  <div className="mx-auto bg-white shadow-md w-full max-w-[1100px] px-[55px] py-[45px] text-black font-['Times_New_Roman','Times',serif] text-[13px] leading-[1.45]">
    <div className="grid grid-cols-2 text-center text-[13px]">
      <div>
        <div>TÒA ÁN NHÂN DÂN TỐI CAO</div>
        <div className="font-bold mt-1">VĂN PHÒNG</div>
        <div className="w-[95px] h-[1px] bg-black mx-auto mt-1" />
      </div>
      <div>
        <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div className="font-bold mt-1">Độc lập - Tự do - Hạnh phúc</div>
        <div className="w-[185px] h-[1px] bg-black mx-auto mt-1" />
      </div>
    </div>

    <div className="text-center mt-7">
      <div className="text-[14px] font-bold leading-[1.5]">
        Danh sách đơn thụ lý
        <br />
        của Văn phòng chuyển {donVi}
      </div>
      <div className="text-[13px] font-bold italic mt-1">
        (Gửi kèm theo Tờ trình số {so}/TAHN-VP ngày {ngay} của Tòa án nhân dân thành phố Hà Nội)
      </div>
    </div>

    <table className="w-full border-collapse mt-5 text-[12px]">
      <thead>
        <tr>
          <th rowSpan={2} className="border border-black px-1 py-1 w-[34px] align-middle">TT</th>
          <th rowSpan={2} className="border border-black px-1 py-1 w-[56px] align-middle">Số Thụ lý</th>
          <th rowSpan={2} className="border border-black px-1 py-1 w-[76px] align-middle">Ngày thụ lý</th>
          <th rowSpan={2} className="border border-black px-1 py-1 w-[175px] align-middle">Người đề nghị, kiến nghị, thông báo</th>
          <th rowSpan={2} className="border border-black px-1 py-1 w-[135px] align-middle">Địa chỉ</th>
          <th colSpan={3} className="border border-black px-1 py-1">QĐ/BA đề nghị xem xét theo thủ tục GĐT/TT</th>
          <th rowSpan={2} className="border border-black px-1 py-1 w-[86px] align-middle">Thẩm phán giải quyết</th>
          <th rowSpan={2} className="border border-black px-1 py-1 w-[62px] align-middle">Số lượng đơn</th>
          <th rowSpan={2} className="border border-black px-1 py-1 w-[135px] align-middle">Ghi chú</th>
        </tr>
        <tr>
          <th className="border border-black px-1 py-1 w-[74px]">Số BA/QĐ</th>
          <th className="border border-black px-1 py-1 w-[62px]">Ngày BA/QĐ</th>
          <th className="border border-black px-1 py-1 w-[80px]">Tòa án Xét xử</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={11} className="border border-black px-2 py-6 text-center italic">Chưa có đơn nào</td></tr>
        ) : rows.map((r, i) => {
          const d = r.thongTinDon ?? {};
          return (
            <tr key={r.id ?? i} className="align-top">
              <td className="border border-black px-1 py-1.5 text-center">{i + 1}</td>
              <td className="border border-black px-1 py-1.5 text-center">{r.giaiQuyet?.stl || ""}</td>
              <td className="border border-black px-1 py-1.5 text-center">{r.ngayNhap || ""}</td>
              <td className="border border-black px-1 py-1.5">{r.nguoiGui || ""}</td>
              <td className="border border-black px-1 py-1.5">{r.diaChi || ""}</td>
              <td className="border border-black px-1 py-1.5 text-center">{d.soBaqd || ""}</td>
              <td className="border border-black px-1 py-1.5 text-center">{d.ngay || ""}</td>
              <td className="border border-black px-1 py-1.5">{d.toaXetXu || ""}</td>
              <td className="border border-black px-1 py-1.5">{(d.thamPhan || "").split(" (")[0]}</td>
              <td className="border border-black px-1 py-1.5 text-center">{r.soDon ?? 1}</td>
              <td className="border border-black px-1 py-1.5" />
            </tr>
          );
        })}
        {/* Dòng tổng + khối ký */}
        <tr>
          <td colSpan={2} className="border border-black px-1 py-2 text-[12px]">
            <span className="italic">Tổng số:</span> <b className="ml-2">{rows.length}</b>
          </td>
          <td colSpan={6} className="border border-black px-2 py-2 text-center">
            <div className="font-bold">Xác nhận của {donVi}</div>
            <div className="italic text-[11px]">(Ký ghi rõ họ tên)</div>
          </td>
          <td colSpan={3} className="border border-black px-2 py-2 text-center align-bottom">
            <div className="font-bold">CHÁNH VĂN PHÒNG</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const ToTrinhPhanCongPreview = ({ rows, loaiVanBan, vanBanDiKem = [], onClose }: {
  rows: any[]; loaiVanBan: string; vanBanDiKem?: string[]; onClose: () => void;
}) => {
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState<ToTrinhInfo>(TO_TRINH_MAC_DINH);
  // Ghi chú nhập tay theo từng đơn ở bảng danh sách
  const [ghiChu, setGhiChu] = useState<Record<number, string>>({});

  const set = (k: keyof ToTrinhInfo, v: any) => setInfo(p => ({ ...p, [k]: v }));
  const setDoan = (i: number, v: string) =>
    setInfo(p => ({ ...p, doan: p.doan.map((d, j) => (j === i ? v : d)) }));

  // Ô sửa được — trả JSX trực tiếp nên không bị mất focus khi gõ
  const edLine = (value: string, onChange: (v: string) => void, cls = "", w = "") =>
    editing ? (
      <input value={value} onChange={e => onChange(e.target.value)}
        className={`bg-[#f0f7ff] border-b border-dashed border-primary outline-none px-1 ${w} ${cls}`} />
    ) : (
      <span className={cls}>{value}</span>
    );

  const edArea = (value: string, onChange: (v: string) => void, cls = "", rows_ = 3) =>
    editing ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows_}
        className={`w-full bg-[#f0f7ff] border border-dashed border-primary outline-none px-1.5 py-1 resize-y ${cls}`} />
    ) : (
      <span className={cls}>{value}</span>
    );

  const soTTHienThi = info.soTT || "……";
  const ngayHienThi = `${info.ngay || "……"}/${info.thang || "……"}/${info.nam || "……"}`;
  const ngayVanBan = `Hà Nội, ngày ${info.ngay || "……"} tháng ${info.thang || "……"} năm ${info.nam || "……"}`;

  const laThongBaoPhanCong = loaiVanBan === "Thông báo phân công thẩm phán";

  // Các vụ (đơn vị giải quyết) có trong đợt này
  const danhSachVu = [...new Set(rows.map((r: any) => r.thongTinDon?.donViGiaiQuyet || "Chưa xác định"))];

  // "Danh sách thụ lý mới" tách mỗi vụ 1 bản; "Giấy xác nhận" tách mỗi mã đơn
  // 1 bản (đúng với cách văn bản được tạo — mỗi đơn có 1 Giấy xác nhận riêng);
  // loại khác 1 bản chung.
  const tabDiKem = vanBanDiKem.flatMap(v =>
    v === "Danh sách thụ lý mới"
      ? danhSachVu.map(vu => ({ loai: v, vu, ten: `${v} - ${vu}`, row: undefined as any }))
      : v === "Giấy xác nhận"
        ? rows.map((r: any) => ({ loai: v, vu: null as string | null, ten: `${v} - ${r.maDon || r.nguoiGui || "Đơn"}`, row: r }))
        : [{ loai: v, vu: null as string | null, ten: v, row: undefined as any }]);

  // Yêu cầu bổ sung tách sẵn 2 biểu mẫu: gửi đương sự và gửi trại giam
  const laYeuCauBoSung = loaiVanBan === "Yêu cầu bổ sung";
  // Giấy xác nhận là loại chính: mỗi mã đơn 1 bản, giống hệt cách tabDiKem tách ở trên
  const laGiayXacNhanChinh = loaiVanBan === "Giấy xác nhận" && !laThongBaoPhanCong;
  const tabChinh = laYeuCauBoSung
    ? ["Thông báo yêu cầu bổ sung với đương sự", "Thông báo yêu cầu bổ sung với trại giam"]
    : laGiayXacNhanChinh
      ? rows.map((r: any) => `${loaiVanBan} - ${r.maDon || r.nguoiGui || "Đơn"}`)
      : [loaiVanBan];

  const danhSachTab = [
    ...tabChinh,
    ...(laThongBaoPhanCong ? [`Danh sách ${loaiVanBan}`] : []),
    ...tabDiKem.map(t => t.ten),
  ];
  const viTriDiKem = tabChinh.length + (laThongBaoPhanCong ? 1 : 0);
  const mucDiKem = tab >= viTriDiKem ? tabDiKem[tab - viTriDiKem] : null;

  // Bảng ánh xạ loại văn bản → biểu mẫu. Thêm loại mới chỉ cần thêm 1 nhánh.
  const renderMau = (loai: string, vu?: string | null) => {
    if (loai === "Danh sách thụ lý mới")
      return (
        <MauDanhSachThuLyMoi so={soTTHienThi} ngay={ngayHienThi} donVi={vu ?? "—"}
          rows={rows.filter((r: any) => (r.thongTinDon?.donViGiaiQuyet || "Chưa xác định") === vu)} />
      );
    if (loai === "Công văn chuyển nội bộ")
      return <MauCongVanChuyenNoiBo so={soTTHienThi} ngay={ngayVanBan} />;
    if (loai === "Giấy xác nhận cơ quan chuyển đơn")
      return <MauGiayXacNhanCoQuan so={soTTHienThi} ngay={ngayVanBan} row={rows[0]} />;
    if (loai === "Giấy xác nhận")
      return <MauGiayXacNhan so={soTTHienThi} ngay={ngayVanBan} row={rows[0]} />;
    return (
      <TrangA4 className="text-center italic text-on-surface-variant">
        Chưa có biểu mẫu cho "{loai}".
      </TrangA4>
    );
  };


  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      {/* Khi in: ẩn toàn bộ giao diện, chỉ để lại trang văn bản đang xem */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #khu-vuc-in, #khu-vuc-in * { visibility: visible !important; }
          #khu-vuc-in {
            position: absolute !important; left: 0 !important; top: 0 !important;
            width: 100% !important; height: auto !important; max-height: none !important;
            overflow: visible !important; padding: 0 !important; background: #fff !important;
          }
          #khu-vuc-in > div { box-shadow: none !important; max-width: none !important; width: 100% !important; }
        }
      `}</style>

      {/* Rộng đủ để tab dọc 236px + trang A4 794px không phải kéo ngang.
          Tab danh sách có bảng rộng hơn nên nới thêm. */}
      <div className={`bg-white rounded-[6px] shadow-2xl max-w-[96vw] max-h-[94vh] flex flex-col overflow-hidden transition-[width] ${tab === 1 ? "w-[1420px]" : "w-[1130px]"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-tertiary text-white flex-shrink-0">
          <span className="text-[15px] font-bold">Biểu mẫu {loaiVanBan}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(e => !e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-[4px] transition-colors ${
                editing ? "bg-[#27ae60] hover:bg-[#219653]" : "bg-white/15 hover:bg-white/25"}`}>
              {editing ? <><Check size={14} /> Xong</> : <><Edit size={14} /> Sửa thông tin</>}
            </button>
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-[4px] bg-white/15 hover:bg-white/25 transition-colors">
              <Printer size={14} /> In
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {editing && (
          <div className="px-5 py-1.5 bg-[#e8f4fd] border-b border-[#b3d7f6] text-[11px] text-primary flex-shrink-0">
            Đang ở chế độ sửa — click vào các ô nền xanh để nhập
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">

          {/* Tab dọc */}
          <div className="w-[236px] flex-shrink-0 border-r border-surface-container bg-[#f7f9fb] py-2 overflow-y-auto">
            {danhSachTab.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className={`w-full text-left px-4 py-2.5 text-[13px] leading-snug border-l-[3px] transition-colors ${
                  tab === i
                    ? "border-error bg-white text-error font-semibold"
                    : "border-transparent text-on-surface-variant hover:bg-[#eef1f5]"}`}>
                {t}
              </button>
            ))}
          </div>

        {/* Nội dung — chỉ cuộn dọc, trang tự co để không phải kéo ngang */}
        <div id="khu-vuc-in" className="flex-1 overflow-y-auto overflow-x-hidden bg-[#e9ecef] p-6">

          {/* ── TAB VĂN BẢN CHÍNH ── */}
          {laYeuCauBoSung && tab === 0 && <MauYCBSDuongSu so={soTTHienThi} ngay={ngayVanBan} row={rows[0]} />}
          {laYeuCauBoSung && tab === 1 && <MauYCBSTraiGiam so={soTTHienThi} ngay={ngayVanBan} row={rows[0]} />}
          {tab === 0 && !laThongBaoPhanCong && !laYeuCauBoSung && renderMau(loaiVanBan)}
          {tab === 0 && laThongBaoPhanCong && (
            <div className="mx-auto bg-white shadow-md w-full max-w-[794px] px-[85px] py-[55px] text-black font-['Times_New_Roman','Times',serif] text-[14.5px] leading-[1.55]">
              <QuocHieu />

              <div className="grid grid-cols-2 mt-4 text-[13px]">
                <div className="text-center">
                  Số: {edLine(info.soTT, v => set("soTT", v), "", "w-[70px] text-center")}/TTr-TAHN-VP
                </div>
                <div className="text-center italic">
                  Hà Nội, ngày {edLine(info.ngay, v => set("ngay", v), "italic", "w-[46px] text-center")} tháng {edLine(info.thang, v => set("thang", v), "italic", "w-[46px] text-center")} năm {edLine(info.nam, v => set("nam", v), "italic", "w-[60px] text-center")}
                </div>
              </div>

              <div className="text-center mt-10">
                <div className="text-[15px] font-bold">TỜ TRÌNH</div>
                <div className="text-[14px] font-bold italic mt-1.5 leading-[1.5] px-4">
                  {edArea(info.tieuDe, v => set("tieuDe", v), "text-[14px] font-bold italic", 3)}
                </div>
              </div>

              <div className="text-center mt-8">
                Kính trình: {edLine(info.kinhTrinh, v => set("kinhTrinh", v), "", "w-[420px] text-center")}
              </div>

              <div className="mt-8 space-y-4 text-justify">
                {info.doan.map((d, i) => (
                  <div key={i} className={editing ? "" : "indent-[42px]"}>
                    {edArea(d, v => setDoan(i, v), "", i === info.doan.length - 1 ? 2 : 5)}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 mt-10">
                <div className="text-[12.5px]">
                  <div className="font-bold italic">Nơi nhận:</div>
                  <div className="mt-1">- Như kính trình;</div>
                  <div>- Lưu: HCTP.</div>
                </div>
                <div className="text-center text-[13px] font-bold">
                  {editing ? (
                    <textarea value={info.chucDanhKy} onChange={e => set("chucDanhKy", e.target.value)} rows={2}
                      className="w-full text-center bg-[#f0f7ff] border border-dashed border-primary outline-none px-1 font-bold" />
                  ) : (
                    info.chucDanhKy.split("\n").map((l, i) => <div key={i}>{l}</div>)
                  )}
                  <div className="mt-16">{edLine(info.nguoiKy, v => set("nguoiKy", v), "font-bold", "w-[200px] text-center")}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: DANH SÁCH KÈM THEO THÔNG BÁO PHÂN CÔNG ── */}
          {tab === 1 && laThongBaoPhanCong && (
            <div className="mx-auto bg-white shadow-md w-full max-w-[1100px] px-[55px] py-[45px] text-black font-['Times_New_Roman','Times',serif] text-[13px] leading-[1.45] relative">
              <div className="absolute right-[30px] top-[20px] text-[12px]">1</div>
              <QuocHieu />

              <div className="text-center mt-8">
                <div className="text-[14px] font-bold leading-[1.5]">
                  {laThongBaoPhanCong ? (
                    <>
                      Danh sách đơn vụ án {edLine(info.loaiAn, v => set("loaiAn", v), "font-bold", "w-[110px] text-center")} thụ lý
                      <br />
                      và phân công Thẩm phán {edLine(info.thamPhan, v => set("thamPhan", v), "font-bold", "w-[180px] text-center")} theo dõi, giải quyết
                    </>
                  ) : (
                    <>Danh sách {loaiVanBan}</>
                  )}
                </div>
                <div className="text-[13px] font-bold italic mt-1">
                  (Kèm theo {loaiVanBan.toLowerCase()} số {soTTHienThi}/{hauToSoCua(loaiVanBan)} ngày {ngayHienThi} của Văn phòng Tòa án nhân dân thành phố Hà Nội)
                </div>
              </div>

              <table className="w-full border-collapse mt-4 text-[12px]">
                <thead>
                  <tr>
                    <th rowSpan={2} className="border border-black px-1 py-1 w-[34px] align-middle">TT</th>
                    <th rowSpan={2} className="border border-black px-1 py-1 w-[52px] align-middle">Số Thụ lý</th>
                    <th rowSpan={2} className="border border-black px-1 py-1 w-[74px] align-middle">Ngày thụ lý</th>
                    <th rowSpan={2} className="border border-black px-1 py-1 w-[150px] align-middle">Người đề nghị, kiến nghị, thông báo</th>
                    <th rowSpan={2} className="border border-black px-1 py-1 w-[120px] align-middle">Địa chỉ</th>
                    <th colSpan={3} className="border border-black px-1 py-1">QĐ/BA đề nghị xem xét theo thủ tục GĐT/TT</th>
                    <th rowSpan={2} className="border border-black px-1 py-1 w-[42px] align-middle">Số đơn</th>
                    <th rowSpan={2} className="border border-black px-1 py-1 w-[105px] align-middle">Thẩm phán giải quyết</th>
                    <th rowSpan={2} className="border border-black px-1 py-1 w-[130px] align-middle">Ghi chú</th>
                  </tr>
                  <tr>
                    <th className="border border-black px-1 py-1 w-[110px]">Số BA/QĐ</th>
                    <th className="border border-black px-1 py-1 w-[74px]">Ngày BA/QĐ</th>
                    <th className="border border-black px-1 py-1 w-[105px]">Tòa án Xét xử</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={11} className="border border-black px-2 py-6 text-center italic">Chưa có đơn nào được chọn</td></tr>
                  ) : rows.map((r, i) => {
                    const d = r.thongTinDon ?? {};
                    return (
                      <tr key={r.id ?? i} className="align-top">
                        <td className="border border-black px-1 py-1.5 text-center">{i + 1}</td>
                        <td className="border border-black px-1 py-1.5 text-center">{r.giaiQuyet?.stl || r.soDon || "—"}</td>
                        <td className="border border-black px-1 py-1.5 text-center">{r.ngayNhap || "—"}</td>
                        <td className="border border-black px-1 py-1.5">{r.nguoiGui || "—"}</td>
                        <td className="border border-black px-1 py-1.5">{r.diaChi || "—"}</td>
                        <td className="border border-black px-1 py-1.5 text-center">{d.soBaqd || "—"}</td>
                        <td className="border border-black px-1 py-1.5 text-center">{d.ngay || "—"}</td>
                        <td className="border border-black px-1 py-1.5">{d.toaXetXu || "—"}</td>
                        <td className="border border-black px-1 py-1.5 text-center">{r.soDon ?? 1}</td>
                        <td className="border border-black px-1 py-1.5">{d.thamPhan || info.thamPhan}</td>
                        <td className="border border-black px-1 py-1.5">
                          {editing ? (
                            <textarea value={ghiChu[r.id] ?? ""} rows={2}
                              onChange={e => setGhiChu(p => ({ ...p, [r.id]: e.target.value }))}
                              className="w-full bg-[#f0f7ff] border border-dashed border-primary outline-none px-1 text-[12px] resize-y" />
                          ) : (ghiChu[r.id] ?? "")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex justify-end mt-8">
                <div className="text-center text-[13px] font-bold w-[300px]">
                  <div>{edLine(info.chucDanhKyDS, v => set("chucDanhKyDS", v), "font-bold", "w-[220px] text-center")}</div>
                  <div className="mt-16">{edLine(info.nguoiKyDS, v => set("nguoiKyDS", v), "font-bold", "w-[220px] text-center")}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── CÁC TAB VĂN BẢN ĐI KÈM ── */}
          {mucDiKem && renderMau(mucDiKem.loai, mucDiKem.vu)}
        </div>
        </div>
      </div>
    </div>
  );
};

// Dựng 1 văn bản cho 1 đơn — không có tầng "Danh sách đơn" vì chỉ có đúng 1 đơn.
const dungVanBanTheoDon = (
  loaiVB: string,
  row: any,
  idPrefix: string,
  chamValidation: boolean,
): DocNode => {
  const tenGoc = `${loaiVB} - ${row.maDon || row.nguoiGui || `Đơn ${row.id}`}`;
  const hauToSo = hauToSoCua(loaiVB);
  return {
    id: idPrefix,
    name: `${tenGoc} - (Số -/2026/${hauToSo})`,
    tenGoc,
    hauToSo,
    type: loaiVB,
    date: "30/07/2026",
    isExpanded: true,
    coTheLaySo: true,
    khongCham: !chamValidation,
    children: [{
      id: `${idPrefix}-don-${row.id}`,
      sttHienThi: 1,
      name: row.maDon || row.nguoiGui || `Đơn ${row.id}`,
      type: "Đơn",
      date: row.ngayNhap || "30/07/2026",
      isExpanded: false,
      originalData: row,
      khongCham: !chamValidation,
    }],
  };
};

// --- Validation Service ---
/** Chuẩn hoá mã đơn: dữ liệu mẫu có bản lẫn khoảng trắng thừa (" Mã 7031"). */
const chuanMaDon = (s: string) => (s ?? "").replace(/\s+/g, " ").trim().toLowerCase();

/** @param trungMap  mã đơn (đã chuẩn hoá) → mô tả văn bản đang chứa nó.
 *  Đơn trùng được đưa vào CHÍNH hệ thống hợp lệ này, không dựng cảnh báo riêng —
 *  một nguồn, một con số, một nút xử lý. */
/** Điều kiện để MỘT đơn được đưa vào văn bản loại `loaiVB`.
 *  Trả về lý do nếu không hợp lệ, null nếu hợp lệ.
 *
 *  Đây là NGUỒN DUY NHẤT của luật hợp lệ — màn Danh sách đơn dùng chính hàm này
 *  để lọc ngay khi chọn Loại văn bản, nên hai màn không bao giờ lệch kết luận.
 *  `moTaTrung`: mô tả văn bản đang chứa đơn (nếu đơn đã nằm trong văn bản khác). */
export const lyDoDonKhongHopLe = (
  data: any, loaiVB: string, moTaTrung?: string,
): string | null => {
  if (!loaiVB) return null;
  const tq = data?.giaiQuyet?.nhan || "";
  const tc = data?.thongTinChuyenDon || "";
  const toTrinhStatus = data?.toTrinhStatus || "none";
  // Danh mục ở màn Danh sách đơn ghi "…Thẩm phán" (T hoa), trong modal là chữ
  // thường — so khớp không phân biệt hoa thường để một luật chạy cho cả hai.
  const loai = loaiVB.toLowerCase();

  if (moTaTrung) return `Đã nằm trong ${moTaTrung}`;

  if (loai === "giấy xác nhận")
    return tc !== "Nội bộ" ? "Thông tin chuyển đơn phải là Nội bộ" : null;

  if (loai === "giấy xác nhận cơ quan chuyển đơn")
    return tc !== "Tòa khác" ? "Thông tin chuyển đơn phải là Tòa khác" : null;

  if (loai === "công văn chuyển nội bộ")
    return (tc !== "Nội bộ" || !["Thụ lý mới", "Thụ lý mới trùng TP", "Thụ lý xét xử", "Đã thụ lý", "Thụ lý mới trong thẩm phán", "Thụ lý mới trùng thẩm phán"].includes(tq))
      ? "TT Chuyển đơn là Nội bộ & TT Giải quyết phải thuộc nhóm Thụ lý mới/xét xử/Đã thụ lý" : null;

  if (loai === "công văn chuyển tòa khác")
    return (tq !== "Chuyển đơn" || tc !== "Tòa khác")
      ? "TT Giải quyết: Chuyển đơn & TT Chuyển đơn: Tòa khác" : null;

  if (loai === "công văn chuyển ngoài")
    return (tq !== "Chuyển đơn" || tc !== "Ngoài tòa án")
      ? "TT Giải quyết: Chuyển đơn & TT Chuyển đơn: Ngoài tòa án" : null;

  if (loai === "trả lại đơn")
    return tq !== "Trả lại đơn" ? "TT Giải quyết phải là Trả lại đơn" : null;

  if (loai === "thông báo phân công tp") {
    // Chánh án phân công xong là lập được Thông báo ngay. Không còn bước tờ
    // trình chờ ký ở giữa: quyết định của Chánh án chính là căn cứ, Thông báo
    // chỉ đưa quyết định đó sang Phòng GĐKT & THA.
    if (!(data?.thongTinDon?.thamPhan || "").trim()) return "Đơn chưa có thẩm phán dự kiến";
    if (!tq.toLowerCase().includes("thụ lý mới")) return "Chỉ lập cho đơn Thụ lý mới";
    return null;
  }

  if (loai === "yêu cầu bổ sung")
    // So khớp lỏng vì dữ liệu ghi "Chưa đủ điều kiện" còn danh mục cũ ghi
    // "Đơn chưa đủ điều kiện".
    return !tq.toLowerCase().includes("chưa đủ điều kiện") ? "Chỉ lập cho đơn Chưa đủ điều kiện" : null;

  return null;   // loại chưa có luật riêng → không ràng buộc
};

const validateTree = (nodes: DocNode[], selectedType: string, trungMap: Record<string, string> = {}): DocNode[] => {
  return nodes.map(node => {
    // Văn bản đi kèm: luôn hợp lệ, chỉ đi tiếp xuống con để giữ nguyên cấu trúc
    if (node.khongCham) {
      return {
        ...node,
        isValid: true,
        invalidReason: "",
        ...(node.children ? { children: validateTree(node.children, selectedType, trungMap) } : {}),
      };
    }

    // Luat hop le nam o MOT cho duy nhat: lyDoDonKhongHopLe
    const lyDo = node.originalData
      ? lyDoDonKhongHopLe(node.originalData, selectedType, trungMap[chuanMaDon(node.originalData.maDon)])
      : null;
    let isValid = !lyDo;
    let invalidReason = lyDo ?? "";

    const updatedNode = { ...node, isValid, invalidReason };
    if (node.children) {
      updatedNode.children = validateTree(node.children, selectedType, trungMap);
      
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

// Đếm số ĐƠN (lá có originalData) đang không hợp lệ — không đếm nhóm cha,
// vì nhóm chỉ đỏ lây từ con.
const countInvalidDocs = (nodes: DocNode[]): number =>
  nodes.reduce((sum, n) =>
    sum + (n.originalData && n.isValid === false ? 1 : 0) + (n.children ? countInvalidDocs(n.children) : 0), 0);

// Gom lý do không hợp lệ của các ĐƠN để hiển thị trong cảnh báo
const gomLyDoKhongHopLe = (nodes: DocNode[]): string[] =>
  nodes.flatMap(n => [
    ...(n.originalData && n.isValid === false && n.invalidReason ? [n.invalidReason] : []),
    ...(n.children ? gomLyDoKhongHopLe(n.children) : []),
  ]);

// Bỏ mọi đơn không hợp lệ, rồi dọn các nhóm trở nên rỗng.
const pruneInvalidDocs = (nodes: DocNode[]): DocNode[] =>
  nodes
    .filter(n => !(n.originalData && n.isValid === false))
    .map(n => (n.children ? { ...n, children: pruneInvalidDocs(n.children) } : n))
    .filter(n => !(n.children && n.children.length === 0));

// --- Sub-components ---

const ActionMenu = ({ onClose, onLaySo }: { onClose: () => void; onLaySo?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 z-50 w-40 bg-white border border-surface-container shadow-lg py-1 rounded-[4px] text-on-surface">
      {onLaySo && (
        <>
          <button onClick={() => { onLaySo(); onClose(); }}
            className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-tertiary hover:bg-[#eef1f5] flex items-center gap-2">
            <Save size={14} /> Lấy số
          </button>
          <div className="h-px bg-surface-container-high my-1" />
        </>
      )}
      <button onClick={onClose} className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-surface-container-low flex items-center gap-2">
        <Edit size={14} className="text-on-surface-variant"/> Sửa
      </button>
      <button onClick={onClose} className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-surface-container-low flex items-center gap-2">
        <FileText size={14} className="text-on-surface-variant"/> Chi tiết
      </button>
      <div className="h-px bg-surface-container-high my-1" />
      <button onClick={onClose} className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#fdeaea] text-error flex items-center gap-2">
        <Trash2 size={14} /> Xóa
      </button>
    </div>
  );
};

// ─── Bảng tài liệu: cột như màn lưu số, gom nhóm 3 tầng ─────────────────────
// Tầng 1 (văn bản to) và tầng 2 (thẩm phán) là dòng gộp cả bảng, có chevron.
// Tầng 3 (đơn) mới đổ vào từng cột.
const SO_COT = 7;

const OChon = ({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) => (
  <div className="relative">
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`w-full h-[30px] pl-2 pr-6 text-[12px] border border-surface-container-highest rounded-[3px] bg-white appearance-none focus:outline-none focus:border-primary ${value ? "text-on-surface" : "text-outline"}`}>
      <option value="" disabled hidden>{placeholder}</option>
      {/* value giữ chuỗi đầy đủ để khớp với ô tổng, chỉ hiển thị tên cho gọn cột */}
      {options.map(o => <option key={o} value={o} className="text-on-surface">{o.split(" - ")[0]}</option>)}
    </select>
    <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
  </div>
);

const HangTaiLieu = ({
  node, level = 0, soCongVanCha, onToggleExpand, onLaySo, nguoiTheoDon, setNguoiTheoDon,
  duyetChung, kyChung, laYCBS, lyDoTheoDon, setLyDoTheoDon,
}: {
  node: DocNode;
  level?: number;
  soCongVanCha?: string;
  onToggleExpand: (id: string) => void;
  onLaySo?: (id: string) => void;
  nguoiTheoDon: Record<string, { duyet?: string; ky?: string }>;
  setNguoiTheoDon: React.Dispatch<React.SetStateAction<Record<string, { duyet?: string; ky?: string }>>>;
  duyetChung: string;
  kyChung: string;
  laYCBS?: boolean;
  lyDoTheoDon?: Record<string, { chon: string; khac: string }>;
  setLyDoTheoDon?: React.Dispatch<React.SetStateAction<Record<string, { chon: string; khac: string }>>>;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const coCon = !!node.children?.length;
  const khongHopLe = node.isValid === false;
  const laDon = node.type === "Đơn" && !coCon;
  const d = node.originalData;

  const menu = (
    <div className="relative inline-block">
      <button onClick={() => setShowMenu(!showMenu)}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant transition-colors">
        <MoreVertical size={15} />
      </button>
      {showMenu && (
        <ActionMenu
          onClose={() => setShowMenu(false)}
          onLaySo={node.coTheLaySo && !node.soVanBan ? () => onLaySo?.(node.id) : undefined}
        />
      )}
    </div>
  );

  // ── Tầng 1 & 2: dòng gộp cả bảng ──
  if (!laDon) {
    return (
      <>
        <tr className={level === 0 ? "bg-[#eef1f5]" : "bg-[#f7f9fb]"}>
          <td colSpan={SO_COT} className={`border-b border-surface-container px-3 py-2 ${khongHopLe ? "bg-[#fdf3f2]" : ""}`}>
            <div className="flex items-center gap-2" style={{ paddingLeft: level * 22 }}>
              <button onClick={() => onToggleExpand(node.id)}
                className="w-5 h-5 flex items-center justify-center text-on-surface-variant hover:bg-black/5 rounded flex-shrink-0">
                {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <FileText size={14} className={`flex-shrink-0 ${level === 0 ? "text-error" : "text-primary"}`} />
              <span className={`${level === 0 ? "text-[13px] font-bold text-tertiary" : "text-[12.5px] font-semibold text-on-surface"}`}>
                {node.name}
              </span>
              <span className="ml-auto flex-shrink-0">
                {menu}
              </span>
            </div>
          </td>
        </tr>
        {node.isExpanded && node.children!.map((c, i) => (
          <HangTaiLieu key={c.id} node={c} level={level + 1}
            soCongVanCha={node.soVanBan ? `${node.soVanBan}/2026/${node.hauToSo ?? "TAHN-VP"}` : soCongVanCha}
            onToggleExpand={onToggleExpand} onLaySo={onLaySo}
            nguoiTheoDon={nguoiTheoDon} setNguoiTheoDon={setNguoiTheoDon}
            duyetChung={duyetChung} kyChung={kyChung}
            laYCBS={laYCBS} lyDoTheoDon={lyDoTheoDon} setLyDoTheoDon={setLyDoTheoDon} />
        ))}
      </>
    );
  }

  // ── Tầng 3: đơn, đổ vào từng cột ──
  const dat = (k: "duyet" | "ky") => (v: string) =>
    setNguoiTheoDon(p => ({ ...p, [node.id]: { ...p[node.id], [k]: v } }));

  return (
    <tr className={`align-top ${khongHopLe ? "bg-[#fdf3f2]" : "bg-white hover:bg-surface-bright"}`}>
      <td className="border-b border-surface-container-high px-2 py-2 text-center text-[12px] text-on-surface-variant">
        {node.sttHienThi ?? "-"}
      </td>
      <td className="border-b border-surface-container-high px-2 py-2 text-[12px]">
        <div className="font-semibold text-tertiary">{node.name}</div>
        <div className="text-[11px] text-on-surface-variant mt-0.5 whitespace-nowrap">{soCongVanCha ?? "— chưa lấy số"}</div>
      </td>
      <td className="border-b border-surface-container-high px-2 py-2 text-[12px]">
        <div className="font-medium text-primary">{d?.nguoiGui || "-"}</div>
        <div className="text-[11px] text-on-surface-variant mt-0.5">{d?.diaChi || ""}</div>
      </td>
      <td className="border-b border-surface-container-high px-3 py-2 text-[12px] leading-relaxed">
        <div className="grid grid-cols-2 gap-x-5 gap-y-0.5">
          <div><span className="text-on-surface-variant">Số BA/QĐ: </span><span className="font-medium">{d?.thongTinDon?.soBaqd || "-"}</span></div>
          <div><span className="text-on-surface-variant">Ngày BA/QĐ: </span>{d?.thongTinDon?.ngay || "-"}</div>
          <div className="col-span-2"><span className="text-on-surface-variant">Hình thức: </span>{d?.thongTinDon?.hinhThuc || "-"}</div>
          <div className="col-span-2"><span className="text-on-surface-variant">Thủ tục giải quyết: </span>{d?.thongTinDon?.thuTuc || "-"}</div>
        </div>

        {/* Số lần + lý do YCBS: cả hai đều do hệ thống lấy từ dữ liệu đơn, chỉ
            hiển thị dạng dòng thông tin như các trường khác trong ô này. */}
        {laYCBS && (() => {
          const v = lyDoTheoDon?.[node.id] ?? { chon: "", khac: "" };
          const lyDo = v.chon === "Lý do khác" ? (v.khac.trim() || "Lý do khác") : v.chon;
          return (
            <div className="mt-2 pt-2 border-t border-dashed border-surface-container-high space-y-0.5">
              <div>
                <span className="text-on-surface-variant">Yêu cầu bổ sung: </span>
                <span className="font-semibold text-error">lần thứ {demYcbsDaCo(d) + 1}</span>
              </div>
              <div>
                <span className="text-on-surface-variant">Lý do yêu cầu bổ sung: </span>
                <span className="text-on-surface">{lyDo || "-"}</span>
              </div>
            </div>
          );
        })()}
      </td>
      {/* Người duyệt / Người ký sửa được ở MỌI loại văn bản.
          Giá trị mặc định kế thừa từ hai ô ở thanh cấu hình; đổi ở dòng nào thì
          chỉ dòng đó đổi, không ảnh hưởng các dòng khác. */}
      <td className="border-b border-surface-container-high px-2 py-2 w-[150px]">
        <OChon value={nguoiTheoDon[node.id]?.duyet ?? duyetChung} onChange={dat("duyet")}
          options={NGUOI_DUYET_OPTIONS} placeholder="Chọn người duyệt" />
      </td>
      <td className="border-b border-surface-container-high px-2 py-2 w-[150px]">
        <OChon value={nguoiTheoDon[node.id]?.ky ?? kyChung} onChange={dat("ky")}
          options={NGUOI_KY_OPTIONS} placeholder="Chọn người ký" />
      </td>
      <td className="border-b border-surface-container-high px-2 py-2 text-right">{menu}</td>
    </tr>
  );
};

const DocumentTreeRow = ({
  node,
  level = 0,
  onToggleExpand,
  onLaySo,
}: {
  node: DocNode;
  level?: number;
  onToggleExpand: (id: string) => void;
  onLaySo?: (id: string) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isInvalid = node.isValid === false;
  const isLeafDon = node.type === "Đơn" && !hasChildren && node.originalData;
  const d = node.originalData;

  return (
    <>
      <div className={`flex items-start group border-b border-surface-container-high transition-colors
        ${isInvalid ? 'bg-[#fef2f2] hover:bg-[#fee2e2]' : 'bg-white hover:bg-surface-bright'}`}
      >
        {/* Document Info Column */}
        <div 
          className="flex-1 py-2.5 px-4 flex items-start"
          style={{ paddingLeft: `${16 + level * 24}px` }}
        >
          {hasChildren ? (
            <button 
              onClick={() => onToggleExpand(node.id)}
              className="w-5 h-5 flex items-center justify-center mr-1 mt-0.5 text-on-surface-variant hover:bg-surface-container-high rounded flex-shrink-0"
            >
              {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-5 mr-1 flex-shrink-0" />
          )}
          
          <FileText size={15} className={`mr-2 mt-0.5 flex-shrink-0 ${isInvalid ? 'text-[#e74c3c]' : level >= 2 ? 'text-[#2980b9]' : 'text-error'}`} />

          {isLeafDon ? (
            // Rich detail view for leaf Đơn nodes
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] font-semibold mb-1 ${isInvalid ? 'text-error' : 'text-[#1a1a2e]'}`}>
                {node.name}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[11.5px]">
                <div className="flex gap-1">
                  <span className="text-on-surface-variant flex-shrink-0">Người đứng đơn:</span>
                  <span className="text-on-surface font-medium truncate">{d.nguoiGui || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-on-surface-variant flex-shrink-0">Mã đơn:</span>
                  <span className="text-on-surface font-medium">{d.maDon || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-on-surface-variant flex-shrink-0">Ngày trên đơn:</span>
                  <span className="text-on-surface">{d.thongTinDon?.ngay || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-on-surface-variant flex-shrink-0">Ngày nhận:</span>
                  <span className="text-on-surface">{d.ngayNhap || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-on-surface-variant flex-shrink-0">Hình thức đơn:</span>
                  <span className="text-on-surface truncate">{d.thongTinDon?.hinhThuc || d.loaiHinhThuc || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-on-surface-variant flex-shrink-0">Số BA/QĐ:</span>
                  <span className="text-on-surface font-medium">{d.thongTinDon?.soBaqd || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-on-surface-variant flex-shrink-0">Ngày BA/QĐ:</span>
                  <span className="text-on-surface">{d.thongTinDon?.ngay || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-on-surface-variant flex-shrink-0">Thủ tục giải quyết:</span>
                  <span className="text-on-surface truncate">{d.thongTinDon?.thuTuc || "—"}</span>
                </div>
              </div>
            </div>
          ) : (
            // Standard view for parent nodes (Tờ trình / Danh sách)
            <div>
              <div className={`text-[13px] font-medium ${isInvalid ? 'text-error' : 'text-on-surface'}`}>
                {node.name}
              </div>
              <div className="text-[11px] text-on-surface-variant mt-0.5">
                Loại: {node.type} • Ngày: {node.date}
              </div>
            </div>
          )}
        </div>

        {/* Status Column */}
        <div className="w-36 px-3 flex items-center justify-center py-2.5 flex-shrink-0">
          {isInvalid && (
            <div className="flex items-center gap-1.5 text-[#e74c3c] bg-white px-2 py-1 rounded border border-[#fadbd8] text-[12px] group relative cursor-help">
              <AlertTriangle size={14} />
              <span className="font-medium">Không hợp lệ</span>
              {/* Tooltip */}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-52 p-2 bg-on-surface text-white text-[11px] rounded shadow-lg z-10 whitespace-normal">
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

        {/* Actions Column */}
        <div className="w-12 px-3 flex justify-end relative py-2.5 flex-shrink-0">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant transition-colors"
          >
            <MoreVertical size={15} />
          </button>
          {showMenu && (
            <ActionMenu
              onClose={() => setShowMenu(false)}
              onLaySo={node.coTheLaySo && !node.soVanBan ? () => onLaySo?.(node.id) : undefined}
            />
          )}
        </div>
      </div>
      
      {/* Recursively render children if expanded */}
      {hasChildren && node.isExpanded && node.children!.map(child => (
        <DocumentTreeRow
          key={child.id}
          node={child}
          level={level + 1}
          onToggleExpand={onToggleExpand}
          onLaySo={onLaySo}
        />
      ))}
    </>
  );
};


// --- Main Component ---
export default function DocumentNumberingModal({ isOpen, onClose, currentRole, selectedRows, loaiVanBanMacDinh, onTrinhDuyet, onXemVanBanDaTrinh, donTrung }: DocumentNumberingModalProps) {
  // Đổi thành true để demo nhánh "Trình duyệt không thành công".
  const TRINH_DUYET_DEMO_FAIL = false;

  // Ăn theo Loại văn bản đang chọn ngoài màn Danh sách đơn.
  // So khớp không phân biệt hoa thường vì hai danh mục viết hoa khác nhau.
  const loaiKhoiTao =
    DOC_TYPES.find(t => t.toLowerCase() === (loaiVanBanMacDinh ?? "").toLowerCase())
    ?? "Thông báo phân công thẩm phán";
  const [docType, setDocType] = useState(loaiKhoiTao);
  const [treeData, setTreeData] = useState<DocNode[]>([]);
  // Chuẩn hoá key một lần để validateTree tra cứu nhanh và khớp được cả những
  // mã đơn có khoảng trắng thừa trong dữ liệu.
  const trungMap = useMemo(() => {
    const m: Record<string, string> = {};
    Object.entries(donTrung ?? {}).forEach(([ma, mo]) => { m[chuanMaDon(ma)] = mo; });
    return m;
  }, [donTrung]);

  // New UI states
  const [nguoiTao, setNguoiTao] = useState("Vũ Văn Yên");
  const [nguoiDuyet, setNguoiDuyet] = useState("");
  // Luồng duyệt của Thông báo phân công thẩm phán
  const [nguoiKy, setNguoiKy] = useState("");
  // Ý kiến trình — gửi kèm tới người duyệt bước 1, lưu vào lịch sử văn bản.
  const [yKienDuyet, setYKienDuyet] = useState("");
  const [mucDoUuTien, setMucDoUuTien] = useState("Bình thường");
  // Yêu cầu bổ sung bắt buộc nêu lý do
  // Lý do yêu cầu bổ sung ĂN THEO TỪNG ĐƠN, không phải một giá trị chung:
  // mỗi đơn thiếu một thứ khác nhau, và lý do đã được cán bộ nhập ở màn
  // Thêm mới đơn (trường ycbsLyDo) nên đổ sẵn vào đây thay vì bắt gõ lại.
  const [lyDoTheoDon, setLyDoTheoDon] = useState<Record<string, { chon: string; khac: string }>>({});
  const [daTrinhDuyet, setDaTrinhDuyet] = useState(false);
  const [chanTrinhDuyet, setChanTrinhDuyet] = useState(false);
  // null = ẩn popup lỗi; chuỗi rỗng = lỗi hệ thống chung; chuỗi khác = lý do cụ thể.
  const [loiTrinhDuyet, setLoiTrinhDuyet] = useState<string | null>(null);
  const [showBieuMau, setShowBieuMau] = useState(false);
  const [vanBanDiKem, setVanBanDiKem] = useState<string[]>([]);
  // Người duyệt / người ký chọn riêng theo từng đơn trên bảng
  const [nguoiTheoDon, setNguoiTheoDon] = useState<Record<string, { duyet?: string; ky?: string }>>({});
  const [openDiKem, setOpenDiKem] = useState(false);
  const diKemRef = useRef<HTMLDivElement>(null);

  // Click ra ngoài thì đóng dropdown chọn nhiều
  useEffect(() => {
    if (!openDiKem) return;
    const h = (e: MouseEvent) => {
      if (diKemRef.current && !diKemRef.current.contains(e.target as Node)) setOpenDiKem(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [openDiKem]);

  const soDonKhongHopLe = countInvalidDocs(treeData);

  const loaiDiKemChoPhep = VAN_BAN_DI_KEM_GIOI_HAN[docType] ?? VAN_BAN_DI_KEM_TAT_CA;
  const laYCBS = docType === "Yêu cầu bổ sung";
  // Thiếu lý do giờ kiểm TỪNG ĐƠN, không kiểm một ô chung nữa.
  const thieuLyDoYCBS = laYCBS && Object.values(lyDoTheoDon).some(
    v => !v.chon || (v.chon === "Lý do khác" && !v.khac.trim()));
  const thieuNguoiDuyetKy = !nguoiDuyet || !nguoiKy || thieuLyDoYCBS;
  
  // Dựng cây tài liệu — MỘT luồng dùng chung cho MỌI loại văn bản, luôn 2 tầng
  // (Văn bản → Đơn), không còn tầng "Danh sách đơn" ở giữa.
  //   "Thông báo phân công thẩm phán": TẤT CẢ đơn được chọn gộp vào 1 tờ trình,
  //   đơn để thẳng dưới tờ trình.
  //   Mọi loại khác: mỗi đơn 1 văn bản riêng (ví dụ: Giấy xác nhận cơ quan
  //   chuyển đơn → Mã đơn).
  useEffect(() => {
    if (!isOpen) return;

    const nodes: DocNode[] = [];
    let n = 1;

    const dungNhom = (loaiVB: string, cham: boolean, tienTo: string) => {
      if (loaiVB === "Thông báo phân công thẩm phán") {
        // TẤT CẢ các đơn được chọn sẽ thuộc 1 tờ trình duy nhất, đơn để thẳng
        // dưới tờ trình — bỏ tầng "Danh sách đơn" theo đơn vị/thẩm phán/hình
        // thức phân công.
        const tenGoc = `${loaiVB} chung`;
        const hauToSo = hauToSoCua(loaiVB);

        const toTrinhNode: DocNode = {
          id: `${tienTo}-${n++}`,
          name: `${tenGoc} - (Số -/2026/${hauToSo})`,
          tenGoc,
          hauToSo,
          type: loaiVB,
          date: "30/07/2026",
          isExpanded: true,
          coTheLaySo: true,
          khongCham: !cham,
          children: selectedRows.map((r, j) => ({
            id: `${tienTo}-${r.id}`,
            sttHienThi: j + 1,
            name: r.maDon || r.nguoiGui || `Đơn ${r.id}`,
            type: "Đơn",
            date: r.ngayNhap || "30/07/2026",
            isExpanded: false,
            originalData: r,
            khongCham: !cham,
          })),
        };
        nodes.push(toTrinhNode);
      } else {
        selectedRows.forEach(r => nodes.push(dungVanBanTheoDon(loaiVB, r, `${tienTo}-${n++}`, cham)));
      }
    };

    dungNhom(docType, true, "vb");
    // Văn bản đi kèm — cùng cấu trúc, chỉ khác là không bị chấm validation
    vanBanDiKem.forEach(loaiVB => dungNhom(loaiVB, false, "dikem"));

    setTreeData(validateTree(nodes, docType, trungMap));

    // Autofill lý do từ màn Thêm mới đơn. Lý do ở đó là chữ tự do nên nếu không
    // khớp danh mục thì xếp vào "Lý do khác" và giữ nguyên câu chữ cán bộ đã viết.
    const map: Record<string, { chon: string; khac: string }> = {};
    const duyet = (ns: DocNode[]) => ns.forEach(n => {
      if (n.originalData) {
        const ly = (n.originalData.ycbsLyDo ?? "").trim();
        map[n.id] = !ly
          // Chưa có lý do từ màn Thêm mới đơn ⇒ điền sẵn lý do phổ biến nhất,
          // không để rỗng bắt cán bộ chọn lại từng dòng.
          ? { chon: LY_DO_YEU_CAU_BO_SUNG[0], khac: "" }
          : LY_DO_YEU_CAU_BO_SUNG.includes(ly)
            ? { chon: ly, khac: "" }
            : { chon: "Lý do khác", khac: ly };
      }
      if (n.children) duyet(n.children);
    });
    duyet(nodes);
    setLyDoTheoDon(map);
  }, [docType, isOpen, selectedRows, vanBanDiKem, donTrung]);

  // Đổi loại văn bản thì bỏ các văn bản đi kèm không còn được phép
  useEffect(() => {
    const chophep = VAN_BAN_DI_KEM_GIOI_HAN[docType] ?? VAN_BAN_DI_KEM_TAT_CA;
    setVanBanDiKem(prev => prev.filter(v => chophep.includes(v)));
  }, [docType]);

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

  // Mở/thu toàn bộ cây. Còn ít nhất một nhánh đang đóng thì nút là "Mở tất cả".
  const datMoTatCa = (mo: boolean) => {
    const dat = (nodes: DocNode[]): DocNode[] =>
      nodes.map(n => n.children?.length
        ? { ...n, isExpanded: mo, children: dat(n.children) }
        : n);
    setTreeData(dat(treeData));
  };

  const conNhanhDong = (nodes: DocNode[]): boolean =>
    nodes.some(n => n.children?.length ? !n.isExpanded || conNhanhDong(n.children) : false);
  const dangDongBot = conNhanhDong(treeData);

  // Cấp số: chạy tuần tự tiếp theo các văn bản đã có số trong phiên.
  // ids = null nghĩa là cấp cho tất cả văn bản chưa có số.
  const capSo = (nodes: DocNode[], ids: string[] | null) => {
    let dem = nodes.filter(n => n.soVanBan).length;
    const hnay = new Date().toLocaleDateString("vi-VN");
    return nodes.map(n => {
      if (!n.coTheLaySo || n.soVanBan) return n;
      if (ids && !ids.includes(n.id)) return n;
      dem++;
      const so = String(dem).padStart(2, "0");
      return {
        ...n,
        soVanBan: so,
        ngayLaySo: hnay,
        name: `${n.tenGoc ?? n.name} - (Số ${so}/2026/${n.hauToSo ?? "TAHN-VP"} - ${hnay})`,
      };
    });
  };

  const laySo = (id: string) => setTreeData(prev => capSo(prev, [id]));
  const laySoTatCa = () => setTreeData(prev => capSo(prev, null));
  const soVanBanChuaLaySo = treeData.filter(n => n.coTheLaySo && !n.soVanBan).length;

  const isApprover = currentRole === "truong-phong" || currentRole === "pho-vp" || currentRole === "lanh-dao";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-['Be_Vietnam_Pro',system-ui,sans-serif]">
      <div className="bg-[#f4f6f8] w-[96%] max-w-[1400px] h-[92vh] max-h-[880px] rounded-[6px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-tertiary text-white flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-bold">Lưu số văn bản & In báo cáo</h2>
            {selectedRows && selectedRows.length > 0 && <p className="text-[12px] text-white/70 mt-0.5">Mã tài liệu gốc: {selectedRows.map(r => r.maDon).join(", ")}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>


        {/* Configuration Bar — lưới 12 cột thay cho flex-wrap: các ô luôn thẳng
            cột, không còn cảnh mỗi hàng một độ rộng và "Mức độ ưu tiên" bị đẩy
            văng sang mép phải. */}
        <div className="bg-white border-b border-surface-container px-5 py-4 flex-shrink-0 shadow-sm z-10">
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">

            {/* ── Hàng 1: văn bản gì, ai lập, ai duyệt, ai ký ── */}
            <div className="col-span-12 md:col-span-3">
              <NhanTruong bat>Loại văn bản</NhanTruong>
              <div className="relative">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className={oNhapCls()}
                >
                  {DOC_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-[10px] text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            {/* Người tạo — chỉ đọc, làm mờ hẳn để không trông như ô nhập được */}
            <div className="col-span-12 md:col-span-3">
              <NhanTruong>Người tạo</NhanTruong>
              <div className={`${O_CAO} px-3 flex items-center gap-2 text-[13px] border border-[#e8e8e8] bg-[#f7f8f9] rounded-[4px] text-on-surface-variant`}>
                <User size={14} className="text-outline flex-shrink-0" />
                <span className="truncate">Vũ Văn Yên</span>
                <span className="text-[11px] text-outline flex-shrink-0">(Cán bộ)</span>
              </div>
            </div>

            {([
              { label: "Người duyệt", value: nguoiDuyet, set: setNguoiDuyet, placeholder: "Chọn người duyệt", options: NGUOI_DUYET_OPTIONS },
              { label: "Người ký", value: nguoiKy, set: setNguoiKy, placeholder: "Chọn người ký", options: NGUOI_KY_OPTIONS },
            ] as const).map(f => (
              <div key={f.label} className="col-span-12 md:col-span-3">
                <NhanTruong bat>{f.label}</NhanTruong>
                <div className="relative">
                  <select
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    className={oNhapCls()}
                  >
                    <option value="" disabled hidden>{f.placeholder}</option>
                    {f.options.map(o => <option key={o} className="text-on-surface">{o}</option>)}
                  </select>
                  <ChevronDown size={14} className={`absolute right-2.5 top-[10px] pointer-events-none ${f.value ? "text-on-surface-variant" : "text-surface-container-highest"}`} />
                </div>
              </div>
            ))}

            {/* ── Hàng 2: mức độ, văn bản kèm, lời nhắn ── */}
            <div className="col-span-6 md:col-span-2">
              <NhanTruong>Mức độ ưu tiên</NhanTruong>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full pointer-events-none ${MAU_UU_TIEN[mucDoUuTien] ?? "bg-surface-container-highest"}`} />
                <select
                  value={mucDoUuTien}
                  onChange={e => setMucDoUuTien(e.target.value)}
                  className={`${oNhapCls()} !pl-7 ${mucDoUuTien === "Cao" ? "text-error font-semibold" : ""}`}
                >
                  {MUC_DO_UU_TIEN.map(m => <option key={m} className="text-on-surface font-normal">{m}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-[10px] text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            <div className="col-span-6 md:col-span-4" ref={diKemRef}>
              <NhanTruong phu={vanBanDiKem.length ? `· ${vanBanDiKem.length} văn bản` : "(tuỳ chọn)"}>
                Văn bản đi kèm
              </NhanTruong>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDiKem(o => !o)}
                  className={`${oNhapCls()} text-left flex items-center ${openDiKem ? "border-primary ring-2 ring-primary/15" : ""}`}>
                  <span className={`truncate ${vanBanDiKem.length ? "text-on-surface" : "text-outline"}`}>
                    {vanBanDiKem.length === 0
                      ? "-- Chọn văn bản đi kèm --"
                      : vanBanDiKem.length === 1
                        ? vanBanDiKem[0]
                        : `Đã chọn ${vanBanDiKem.length} văn bản`}
                  </span>
                </button>
                <ChevronDown size={14} className={`absolute right-2.5 top-[10px] pointer-events-none transition-transform ${
                  openDiKem ? "rotate-180 text-primary" : vanBanDiKem.length ? "text-on-surface-variant" : "text-surface-container-highest"}`} />

                {openDiKem && (
                  <div className="absolute left-0 top-[38px] z-50 w-full min-w-[300px] bg-white border border-surface-container-highest rounded-[4px] shadow-lg py-1 max-h-[280px] overflow-y-auto">
                    {loaiDiKemChoPhep.map(v => (
                      <label key={v} className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-on-surface hover:bg-surface-container-low cursor-pointer">
                        <input type="checkbox" className="w-[14px] h-[14px] accent-[#1d2e4f] flex-shrink-0"
                          checked={vanBanDiKem.includes(v)}
                          onChange={e => setVanBanDiKem(prev =>
                            e.target.checked ? [...prev, v] : prev.filter(x => x !== v))} />
                        {v}
                      </label>
                    ))}
                    {vanBanDiKem.length > 0 && (
                      <>
                        <div className="h-px bg-surface-container-high my-1" />
                        <button type="button" onClick={() => setVanBanDiKem([])}
                          className="w-full text-left px-3 py-1.5 text-[12px] text-error hover:bg-[#fdeaea]">
                          Bỏ chọn tất cả
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* MỘT ô ý kiến duy nhất, gửi kèm tới người duyệt BƯỚC 1.
                Trước đây có hai ô: "Nội dung trình duyệt" và "Nội dung trình duyệt ký".
                Ô thứ hai bắt cán bộ viết hộ lời nhắn cho người ký — sai người, sai
                thời điểm (người ký đọc nó nhiều ngày sau, khi nội dung có thể đã bị
                người duyệt sửa), và không co giãn khi luồng ký có hơn 2 bước.
                Ý kiến của từng người duyệt/ký giờ được ghi tại đúng bước của họ. */}
            <div className="col-span-12 md:col-span-6">
              <NhanTruong phu="(tuỳ chọn)">Ý kiến trình</NhanTruong>
              <input
                value={yKienDuyet}
                onChange={e => setYKienDuyet(e.target.value)}
                placeholder="Điều muốn lưu ý người duyệt…"
                className={`${O_CAO} w-full px-3 text-[13px] border border-surface-container-highest rounded-[4px] bg-white outline-none transition-colors placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/15`} />
            </div>

          </div>
        </div>

        {/* Document Tree Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#f4f6f8]">
          <div className="bg-white border border-surface-container rounded-[6px] shadow-sm overflow-hidden">
            {/* Thanh nhỏ trên bảng: mở/thu toàn bộ cây tài liệu */}
            <div className="flex items-center justify-between gap-3 px-3 py-1.5 border-b border-surface-container-high bg-[#fbfcfd]">
              <span className="text-[11px] text-on-surface-variant">
                {treeData.length} văn bản · {countInvalidDocs(treeData) > 0
                  ? <span className="text-error font-medium">{countInvalidDocs(treeData)} đơn không hợp lệ</span>
                  : "tất cả đơn hợp lệ"}
              </span>
              <button
                type="button"
                onClick={() => datMoTatCa(dangDongBot)}
                title={dangDongBot ? "Mở toàn bộ cây tài liệu" : "Thu gọn toàn bộ cây tài liệu"}
                className="inline-flex items-center gap-1 h-[24px] px-2 rounded-[3px] border border-surface-container bg-white text-[11px] font-medium text-on-surface-variant hover:bg-[#f2f5f8] hover:border-[#bbb] hover:text-primary transition-colors">
                {dangDongBot ? <ChevronsDown size={12} /> : <ChevronsUp size={12} />}
                {dangDongBot ? "Mở tất cả" : "Thu gọn tất cả"}
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                  <th className="border-b border-surface-container px-2 py-2.5 w-[42px] text-center">STT</th>
                  <th className="border-b border-surface-container px-2 py-2.5 w-[125px] text-left">Số công văn</th>
                  <th className="border-b border-surface-container px-2 py-2.5 w-[185px] text-left">Thông tin người gửi</th>
                  <th className="border-b border-surface-container px-3 py-2.5 min-w-[360px] text-left">Thông tin đơn</th>
                  <th className="border-b border-surface-container px-2 py-2.5 w-[145px] text-left">Người duyệt</th>
                  <th className="border-b border-surface-container px-2 py-2.5 w-[145px] text-left">Người ký</th>
                  <th className="border-b border-surface-container px-2 py-2.5 w-[54px] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {treeData.length === 0 ? (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-[13px] text-outline italic">Chưa có tài liệu</td></tr>
                ) : treeData.map(node => (
                  <HangTaiLieu
                    key={node.id}
                    node={node}
                    onToggleExpand={toggleExpand}
                    onLaySo={laySo}
                    nguoiTheoDon={nguoiTheoDon}
                    setNguoiTheoDon={setNguoiTheoDon}
                    duyetChung={nguoiDuyet}
                    kyChung={nguoiKy}
                    laYCBS={laYCBS}
                    lyDoTheoDon={lyDoTheoDon}
                    setLyDoTheoDon={setLyDoTheoDon}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex items-start gap-2 bg-[#e8f4fd] p-3 rounded border border-[#b3d7f6] text-primary text-[12px]">
            <Info size={16} className="mt-0.5 flex-shrink-0" />
            <p>
              Văn bản chính sẽ được tự động cấp số sau khi được
              <strong> Chánh Văn phòng/Phó Chánh Văn phòng</strong> ký.
              Các tài liệu đính kèm sẽ được đánh số phụ lục.
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-white border-t border-surface-container p-4 flex items-center justify-between gap-3 flex-shrink-0 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            {/* Hai con số đếm hai thứ khác nhau (văn bản vs đơn) nên phải nói rõ
                đơn vị, nếu không người đọc tưởng chúng phải khớp nhau. */}
            <div className="text-[11px] text-on-surface-variant leading-[1.5]">
              {treeData.length > 0 && (
                <>
                  <div>
                    <b className="text-on-surface">{treeData.filter(n => n.isValid !== false).length}/{treeData.length}</b> văn bản hợp lệ
                  </div>
                  {soDonKhongHopLe > 0 && (
                    <div className="text-error">
                      <b>{soDonKhongHopLe}</b> đơn bên trong không hợp lệ
                    </div>
                  )}
                </>
              )}
            </div>
            {/* Bỏ tất cả đơn không hợp lệ bằng 1 nút, thay vì xóa từng dòng */}
            {soDonKhongHopLe > 0 && (
              <button
                onClick={() => setTreeData(prev => validateTree(pruneInvalidDocs(prev), docType, trungMap))}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-error bg-white border border-error rounded-[4px] hover:bg-[#fdeaea] transition-colors whitespace-nowrap">
                <Trash2 size={14} /> Bỏ {soDonKhongHopLe} đơn không hợp lệ
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Lấy số chung cho toàn bộ văn bản trong danh sách */}
            {treeData.some(n => n.coTheLaySo) && (
              <button
                onClick={laySoTatCa}
                disabled={soVanBanChuaLaySo === 0}
                title={soVanBanChuaLaySo === 0 ? "Tất cả văn bản đã có số" : undefined}
                className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-[4px] transition-colors ${
                  soVanBanChuaLaySo === 0
                    ? "text-outline bg-surface-container-low border border-surface-container cursor-not-allowed"
                    : "text-white bg-tertiary hover:bg-[#15223a] shadow-sm"}`}>
                <Save size={15} /> Lấy số tạm (tuỳ chọn)
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-on-surface-variant bg-white border border-surface-container-highest rounded-[4px] hover:bg-surface-container-low transition-colors"
            >
              Đóng
            </button>

            {(
              <button
                onClick={() => setShowBieuMau(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-primary bg-white border border-primary rounded-[4px] hover:bg-[#f0f7ff] transition-colors">
                <FileText size={15} /> Xem biểu mẫu
              </button>
            )}

            {/* Role-based action buttons */}
            {currentRole === "truong-phong" ? (
              <>
                <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#27ae60] rounded-[4px] hover:bg-[#219653] transition-colors shadow-sm">
                  <Check size={15} /> Phê duyệt
                </button>
                <button className="px-4 py-2 text-[13px] font-semibold text-error bg-white border border-error rounded-[4px] hover:bg-[#fdeaea] transition-colors">
                  Từ chối
                </button>
              </>
            ) : currentRole === "pho-vp" || currentRole === "lanh-dao" ? (
              <>
                {/* Ký số button styled like screenshot */}
                <button
                  className="flex items-center gap-2 px-5 py-2 text-[13px] font-bold text-white rounded-[4px] transition-all shadow-md hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #e91e8c 0%, #c2185b 100%)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Ký số
                </button>
                <button className="px-4 py-2 text-[13px] font-semibold text-on-surface-variant bg-white border border-surface-container-highest rounded-[4px] hover:bg-surface-container transition-colors">
                  Ký logic
                </button>
                <button className="px-4 py-2 text-[13px] font-semibold text-error bg-white border border-error rounded-[4px] hover:bg-[#fdeaea] transition-colors">
                  Từ chối
                </button>
                <button className="px-4 py-2 text-[13px] font-semibold text-white bg-primary rounded-[4px] hover:bg-[#154a7a] transition-colors shadow-sm">
                  Đồng ý
                </button>
              </>
            ) : (
              // Can bo: Luu & Trinh duyet — chặn khi chưa chọn Người duyệt / Người ký
              <button
                onClick={() => {
                  // Còn đơn không hợp lệ thì cảnh báo, không cho lưu
                  if (soDonKhongHopLe > 0) { setChanTrinhDuyet(true); return; }
                  // Không còn văn bản nào hợp lệ để trình (toàn bộ đã bị loại) —
                  // chặn trước khi gọi onTrinhDuyet, tránh tạo văn bản rỗng.
                  const soVanBanHopLe = treeData.filter(n => n.isValid !== false).length;
                  if (soVanBanHopLe === 0) {
                    setLoiTrinhDuyet("Không có văn bản hợp lệ để trình duyệt.");
                    return;
                  }
                  // Nhánh demo lỗi hệ thống khi gửi hồ sơ — không đẩy văn bản
                  // vào kho, cán bộ có thể bấm "Thử lại".
                  if (TRINH_DUYET_DEMO_FAIL) { setLoiTrinhDuyet(""); return; }
                  // Đường ra của popup: đẩy văn bản vào kho dùng chung.
                  // Trước kia chỗ này chỉ setDaTrinhDuyet(true) rồi hết —
                  // popup là ngõ cụt, tạo xong không màn nào thấy.
                  const goc = treeData[0];
                  onTrinhDuyet?.({
                    trichYeu: goc?.tenGoc ?? goc?.name ?? docType,
                    loaiVanBan: docType,
                    nguoiTao, nguoiDuyet, nguoiKy,
                    // Thân văn bản và ý kiến trình là hai thứ khác nhau — trước
                    // đây bị gộp làm một nên ý kiến bị hiểu nhầm thành nội dung.
                    noiDung: `${docType}\n\nKèm theo ${(selectedRows ?? []).length} đơn nêu tại Danh sách đơn của ${docType} này.`,
                    yKienTrinh: yKienDuyet.trim() || undefined,
                    soVanBan: goc?.soVanBan,
                    donDinhKem: (selectedRows ?? []).map((r: any) => ({
                      ma: r?.maDon ?? String(r?.id ?? "—"),
                      nguoiGui: r?.nguoiGui ?? "—",
                      soBA: r?.thongTinDon?.soBaqd ?? "—",
                      hinhThuc: r?.thongTinDon?.hinhThuc ?? r?.loaiHinhThuc ?? "—",
                    })),
                  });
                  setDaTrinhDuyet(true);
                }}
                disabled={thieuNguoiDuyetKy}
                title={thieuLyDoYCBS
                  ? "Vui lòng chọn Lý do yêu cầu bổ sung"
                  : thieuNguoiDuyetKy ? "Vui lòng chọn Người duyệt và Người ký" : undefined}
                className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded-[4px] transition-colors shadow-sm ${
                  thieuNguoiDuyetKy ? "bg-error/50 cursor-not-allowed" : "bg-error hover:bg-[#7a1717]"}`}>
                <Send size={15} /> Trình duyệt
              </button>
            )}
          </div>
        </div>

      </div>

      {chanTrinhDuyet && (
        <PopupChanTrinhDuyet
          soDon={soDonKhongHopLe}
          lyDo={[...new Set(gomLyDoKhongHopLe(treeData))]}
          onBoDon={() => {
            setTreeData(prev => validateTree(pruneInvalidDocs(prev), docType, trungMap));
            setChanTrinhDuyet(false);
          }}
          onDong={() => setChanTrinhDuyet(false)}
        />
      )}
      {loiTrinhDuyet !== null && (
        <PopupTrinhDuyetLoi
          lyDo={loiTrinhDuyet || undefined}
          onDong={() => setLoiTrinhDuyet(null)}
          onThuLai={() => setLoiTrinhDuyet(null)}
        />
      )}
      {daTrinhDuyet && (
        <PopupTrinhDuyetXong
          loaiVanBan={docType}
          soVanBan={treeData.filter(n => n.coTheLaySo).length}
          daLaySo={treeData.filter(n => n.soVanBan).length}
          nguoiDuyet={nguoiDuyet}
          nguoiKy={nguoiKy}
          mucDo={mucDoUuTien}
          // Lý do giờ theo từng đơn — popup xác nhận nêu số lượng, không nêu một
          // lý do duy nhất (các đơn có thể khác lý do nhau).
          lyDo={laYCBS ? (() => {
            const ds = Object.values(lyDoTheoDon).map(v => v.chon === "Lý do khác" ? v.khac.trim() : v.chon).filter(Boolean);
            const uniq = Array.from(new Set(ds));
            return uniq.length === 1 ? uniq[0] : `${uniq.length} lý do khác nhau theo từng đơn`;
          })() : undefined}
          onXem={onXemVanBanDaTrinh
            ? () => { setDaTrinhDuyet(false); onXemVanBanDaTrinh(); }
            : undefined}
          onDong={() => { setDaTrinhDuyet(false); onClose(); }}
        />
      )}
      {showBieuMau && (
        <ToTrinhPhanCongPreview rows={selectedRows} loaiVanBan={docType} vanBanDiKem={vanBanDiKem}
          onClose={() => setShowBieuMau(false)} />
      )}
    </div>
  );
}
