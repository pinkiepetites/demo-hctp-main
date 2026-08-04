import React, { useState, useRef, useEffect } from "react";
import { 
  X, ChevronDown, ChevronRight, AlertTriangle, MoreVertical, 
  Check, Info, FileText, Save, Send, Printer, User, Edit, Trash2
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
  hauToSo?: string;     // "TTr-TANDTC-VP" cho tờ trình, "TANDTC-VP" cho công văn
  sttHienThi?: number;  // STT của đơn trong danh sách chứa nó
  // Văn bản đi kèm: vẫn giữ originalData để hiển thị đầy đủ thông tin đơn,
  // nhưng không chấm validation theo luật của loại văn bản chính.
  khongCham?: boolean;
}

interface DocumentNumberingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string; // "can-bo" or "truong-phong" or others
  selectedRows: any[];
  loaiVanBanMacDinh?: string; // Loại văn bản đã chọn ở bộ lọc màn Danh sách đơn
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
  "Tờ trình khác", 
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

// Danh sách người cho luồng duyệt Tờ trình phân công thẩm phán
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
  "Tờ trình phân công",
  "Tờ trình khác",
  "Thông báo phân công TP",
  "Yêu cầu bổ sung",
];

// Giới hạn theo loại văn bản chính. Loại nào không có ở đây thì cho chọn tất cả.
const VAN_BAN_DI_KEM_GIOI_HAN: Record<string, string[]> = {
  "Tờ trình phân công thẩm phán": [
    "Công văn chuyển nội bộ",
    "Giấy xác nhận",
    "Giấy xác nhận cơ quan chuyển đơn",
  ],
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

const MUC_DO_UU_TIEN = ["Bình thường", "Khẩn", "Thượng khẩn", "Hỏa tốc"];

// Ký hiệu số theo loại văn bản. Loại không khai ở đây dùng mặc định TANDTC-VP.
const HAU_TO_SO_RIENG: Record<string, string> = {
  "Thông báo phân công TP": "TB-TA",
  "Giấy xác nhận": "TB-TA",
};
const hauToSoCua = (loaiVB: string) =>
  HAU_TO_SO_RIENG[loaiVB] ?? (loaiVB.startsWith("Tờ trình") ? "TTr-TANDTC-VP" : "TANDTC-VP");

const NGUOI_KY_OPTIONS = [
  "Nguyễn Minh An - Phó CVP - 01/03/1975",
  "Hoàng Kim Long - CVP - 10/08/1970",
];
// --- Biểu mẫu Tờ trình phân công Thẩm phán ---
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
  kinhTrinh: "Đồng chí Chánh án Tòa án nhân dân tối cao",
  tieuDe: "Về việc thụ lý đơn và phân công Thẩm phán giải quyết đơn đề nghị xem xét lại quyết định, bản án đã có hiệu lực pháp luật theo trình tự giám đốc thẩm, tái thẩm",
  doan: [
    "Vụ Giám đốc, kiểm tra về dân sự Tòa án nhân dân tối cao nhận và thụ lý các đơn đề nghị, kiến nghị, thông báo của công dân, tổ chức gửi Tòa án nhân dân tối cao đề nghị xem xét lại quyết định, bản án đã có hiệu lực pháp luật theo trình tự giám đốc thẩm và dự kiến phân công các Thẩm phán Tòa án nhân dân giải quyết đơn",
    "Sau khi xem xét các đơn đề nghị, kiến nghị theo thủ tục giám đốc thẩm, Văn phòng nhận thấy các đơn đề nghị, kiến nghị nêu trên đã đủ điều kiện thụ lý theo quy định. Căn cứ vào kết quả phân công khách quan theo tổ Thẩm phán chuyên sâu; số lượng vụ án mà các Thẩm phán đang xem xét giải quyết; các vụ án có cùng nguyên đơn, bị đơn; có cùng người khởi kiện, người bị kiện.",
    "Vụ Giám đốc, kiểm tra về dân sự báo cáo và kính đề nghị đồng chí Chánh án Tòa án nhân dân tối cao giải quyết (có danh sách kèm theo).",
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
      <div>Số: {so}/TANDTC-VP</div>
      <div className="italic">{ngay}</div>
    </div>

    <div className="mt-10">Kính gửi:</div>

    <div className="mt-5 space-y-4 text-justify">
      <p className="indent-[42px]">
        Vụ Giám đốc, kiểm tra về dân sự Tòa án nhân dân tối cao đã nhận và thụ lý các đơn của
        công dân, tổ chức gửi Tòa án nhân dân tối cao đề nghị xem xét lại quyết định, bản án
        đã có hiệu lực pháp luật theo trình tự giám đốc thẩm, tái thẩm
        (có danh sách đơn gửi kèm theo Công văn này).
      </p>
      <p className="indent-[42px]">
        Vụ Giám đốc, kiểm tra về dân sự chuyển các đơn đề nghị, kiến nghị, thông báo đến Quý vụ
        để xem xét, giải quyết theo thẩm quyền. Đề nghị Quý vụ ký xác nhận và chuyển phát danh
        sách đã ký nhận về phòng Tiếp công dân và xử lý đơn tư pháp thuộc Vụ Giám đốc, kiểm tra
        về dân sự Tòa án nhân dân tối cao./.
      </p>
    </div>

    <NoiNhan
      dong={["- Như trên;", "- Đ/c Chánh án TANDTC (để b/c);", "- Đ/c Chánh Văn phòng TANDTC (để b/c);", "- Lưu: VP TANDTC."]}
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
          <div className="mt-3">Số: {so}/TANDTC-VP</div>
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
          Tòa án nhân dân tối cao nhận được công văn số {d.soCV || "……"} ngày {d.ngayCV || "……"} của{" "}
          {d.donViGui || "……"} chuyển đơn của ông/bà {row?.nguoiGui || "……"} về việc đề nghị Chánh án
          Tòa án nhân dân tối cao xem xét theo thủ tục giám đốc thẩm/tái thẩm đối với Bản án/Quyết định
          số {d.soBaqd || "……"} ngày {d.ngay || "……"} của {d.toaXetXu || "……"} đã có hiệu lực pháp luật.
        </p>
        <p className="indent-[42px]">
          Sau khi nghiên cứu đơn đề nghị nêu trên, Vụ Giám đốc, kiểm tra về dân sự Tòa án nhân dân tối cao
          đã chuyển đơn của ông/bà {row?.nguoiGui || "……"} đến {d.donViGiaiQuyet || "……"} thuộc Tòa án nhân dân
          tối cao theo công văn số {so}/TANDTC-VP ngày {ngay} để xem xét, giải quyết theo quy định pháp luật.
        </p>
        <p className="indent-[42px]">
          Tòa án nhân dân tối cao trân trọng thông báo để Quý cơ quan được biết./.
        </p>
      </div>

      <NoiNhan
        dong={["- Như trên;", "- Đ/c Chánh án TANDTC (để b/c);", "- Đ/c Chánh Văn phòng TANDTC (để b/c);", "- Lưu: VP TANDTC."]}
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
          Căn cứ <Sup n="6" />Điều 375 của Bộ luật tố tụng hình sự, <Sup n="7" />Tòa án nhân dân tối cao
          thông báo cho <Sup n="8" />ông/bà {row?.nguoiGui || "……"} biết <Sup n="9" />ngày {ngay}{" "}
          <Sup n="10" />Tòa án nhân dân tối cao đã nhận được Đơn đề nghị giám đốc thẩm/Kiến nghị giám đốc
          thẩm đối với Bản án/Quyết định số: <Sup n="11" />{d.soBaqd || "……"} <Sup n="12" />ngày {d.ngay || "……"}{" "}
          của <Sup n="13" />{d.toaXetXu || "……"} đã có hiệu lực pháp luật cần xem xét theo thủ tục giám đốc thẩm.
        </p>
        <p className="indent-[42px]">
          Căn cứ các quy định của pháp luật tố tụng hình sự, <Sup n="17" />Tòa án nhân dân tối cao sẽ tiến
          hành xem xét Đơn đề nghị/Kiến nghị nêu trên theo thủ tục giám đốc thẩm.
        </p>
      </div>

      <div className="grid grid-cols-2 mt-8">
        <div className="text-[12px]">
          <div className="font-bold italic">Nơi nhận:</div>
          <div>- Như trên;</div>
          <div>- Đ/c Chánh Văn phòng TANDTC (để b/c);</div>
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
          {d.ngayCV || d.ngay || "……"} về việc đề nghị Chánh án Tòa án nhân dân tối cao xem xét theo
          thủ tục giám đốc thẩm/tái thẩm đối với <Sup n="8" />Bản án/Quyết định số {d.soBaqd || "……"}{" "}
          ngày {d.ngay || "……"} của {d.toaXetXu || "……"} đã có hiệu lực pháp luật;
        </p>
        <p className="indent-[42px]">
          Tòa án nhân dân tối cao yêu cầu <Sup n="5" />{row?.nguoiGui || "……"} sửa đổi, bổ sung các
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
          pháp thuộc Văn phòng Tòa án nhân dân tối cao theo địa chỉ: ).
        </p>
      </div>

      <div className="grid grid-cols-2 mt-8">
        <div className="text-[12px]">
          <div className="font-bold italic">Nơi nhận:</div>
          <div>- Như trên;</div>
          <div>- Đ/c Chánh văn phòng <Sup n="10" />TANDCC (để b/c);</div>
          <div>- Lưu: HCTP, VP TANDTC;</div>
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
          Tòa án nhân dân tối cao nhận được đơn của phạm nhân {row?.nguoiGui || "……"} đề ngày{" "}
          {d.ngayCV || d.ngay || "……"} (do {traiGiam} chuyển đến), trong đơn có nội dung đề nghị xem
          xét theo thủ tục giám đốc thẩm đối với Bản án số {d.soBaqd || "……"} ngày {d.ngay || "……"}{" "}
          của {d.toaXetXu || "……"} đã có hiệu lực pháp luật;
        </p>
        <p className="indent-[42px]">
          Để có cơ sở xem xét đơn đề nghị giám đốc thẩm nêu trên, Tòa án nhân dân tối cao đề nghị{" "}
          {traiGiam} hướng dẫn phạm nhân {row?.nguoiGui || "……"} bổ sung các nội dung sau:
        </p>
        <div className="pl-[42px]">
          - Cung cấp bản sao bản án/quyết định số {d.soBaqd || "……"} ngày {d.ngay || "……"} của{" "}
          {d.toaXetXu || "……"} đã có hiệu lực pháp luật và các tài liệu liên quan đến việc đề nghị
          giám đốc thẩm.
        </div>
        <p className="indent-[42px] italic text-[13px]">
          (Lưu ý: Đề nghị gửi đơn và các tài liệu kèm theo đến Phòng Tiếp công dân và xử lý đơn tư
          pháp thuộc Văn phòng Tòa án nhân dân tối cao theo địa chỉ: ).
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
          <AlertTriangle size={28} className="text-[#c0392b]" />
        </div>
        <div className="text-[17px] font-bold text-[#8b1a1a] mt-3">Không thể trình duyệt</div>
        <div className="text-[13px] text-[#666] mt-1">
          Còn <b className="text-[#c0392b]">{soDon} đơn không hợp lệ</b> trong danh sách.
          Vui lòng bỏ các đơn này rồi trình duyệt lại.
        </div>
      </div>

      <div className="mx-6 mb-5 px-4 py-3 bg-[#fdf3f2] border border-[#e57373] rounded-[6px] text-[12px] text-[#8b1a1a]">
        <div className="font-semibold mb-1">Lý do:</div>
        <ul className="list-disc pl-4 space-y-0.5">
          {lyDo.map(l => <li key={l}>{l}</li>)}
        </ul>
      </div>

      <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#eee] bg-[#fafafa]">
        <button onClick={onDong}
          className="px-5 py-2 text-[13px] font-semibold text-[#555] bg-white border border-[#ccc] rounded-[4px] hover:bg-[#f5f5f5] transition-colors">
          Đóng
        </button>
        <button onClick={onBoDon}
          className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-semibold text-white bg-[#8b1a1a] hover:bg-[#6e1414] rounded-[4px] transition-colors">
          <Trash2 size={14} /> Bỏ {soDon} đơn không hợp lệ
        </button>
      </div>
    </div>
  </div>
);

// Popup báo đã trình duyệt xong
const PopupTrinhDuyetXong = ({ loaiVanBan, soVanBan, daLaySo, nguoiDuyet, nguoiKy, mucDo, onDong }: {
  loaiVanBan: string; soVanBan: number; daLaySo: number;
  nguoiDuyet: string; nguoiKy: string; mucDo: string; onDong: () => void;
}) => (
  <div className="fixed inset-0 z-[210] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[8px] shadow-2xl w-[560px] overflow-hidden">
      <div className="px-6 pt-7 pb-4 text-center">
        <div className="w-14 h-14 rounded-full bg-[#e8f5e9] border-2 border-[#4caf50] flex items-center justify-center mx-auto">
          <Check size={30} className="text-[#2e7d32]" strokeWidth={3} />
        </div>
        <div className="text-[17px] font-bold text-[#1b5e20] mt-3">Trình duyệt thành công</div>
        <div className="text-[13px] text-[#666] mt-1">
          Hồ sơ đã được gửi tới người duyệt. Bạn có thể theo dõi tại màn <b>Danh sách đơn</b>,
          chọn <b>Danh sách văn bản</b>.
        </div>
      </div>

      <div className="mx-6 mb-4 border border-[#e5e7eb] rounded-[6px] divide-y divide-[#f0f0f0] text-[13px]">
        {[
          ["Loại văn bản", loaiVanBan],
          ["Số văn bản đã tạo", `${soVanBan} văn bản`],
          ["Đã cấp số", `${daLaySo}/${soVanBan}`],
          ["Người duyệt", nguoiDuyet.split(" - ")[0] || "—"],
          ["Người ký", nguoiKy.split(" - ")[0] || "—"],
          ["Mức độ ưu tiên", mucDo],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2">
            <span className="text-[#777]">{k}</span>
            <span className="font-medium text-[#222] text-right">{v}</span>
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

      <div className="flex justify-end px-6 py-4 border-t border-[#eee] bg-[#fafafa]">
        <button onClick={onDong}
          className="px-6 py-2 text-[13px] font-semibold text-white bg-[#1d2e4f] hover:bg-[#15223a] rounded-[4px] transition-colors">
          Đóng
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
        (Gửi kèm theo Tờ trình số {so}/TANDTC-VP ngày {ngay} của Tòa án nhân dân tối cao)
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
        className={`bg-[#f0f7ff] border-b border-dashed border-[#1a5a96] outline-none px-1 ${w} ${cls}`} />
    ) : (
      <span className={cls}>{value}</span>
    );

  const edArea = (value: string, onChange: (v: string) => void, cls = "", rows_ = 3) =>
    editing ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows_}
        className={`w-full bg-[#f0f7ff] border border-dashed border-[#1a5a96] outline-none px-1.5 py-1 resize-y ${cls}`} />
    ) : (
      <span className={cls}>{value}</span>
    );

  const soTTHienThi = info.soTT || "……";
  const ngayHienThi = `${info.ngay || "……"}/${info.thang || "……"}/${info.nam || "……"}`;
  const ngayVanBan = `Hà Nội, ngày ${info.ngay || "……"} tháng ${info.thang || "……"} năm ${info.nam || "……"}`;

  const laToTrinhPhanCong = loaiVanBan === "Tờ trình phân công thẩm phán";

  // Các vụ (đơn vị giải quyết) có trong đợt này
  const danhSachVu = [...new Set(rows.map((r: any) => r.thongTinDon?.donViGiaiQuyet || "Chưa xác định"))];

  // "Danh sách thụ lý mới" tách mỗi vụ 1 bản; loại khác 1 bản chung.
  const tabDiKem = vanBanDiKem.flatMap(v =>
    v === "Danh sách thụ lý mới"
      ? danhSachVu.map(vu => ({ loai: v, vu, ten: `${v} - ${vu}` }))
      : [{ loai: v, vu: null as string | null, ten: v }]);

  // Yêu cầu bổ sung tách sẵn 2 biểu mẫu: gửi đương sự và gửi trại giam
  const laYeuCauBoSung = loaiVanBan === "Yêu cầu bổ sung";
  const tabChinh = laYeuCauBoSung
    ? ["Thông báo yêu cầu bổ sung với đương sự", "Thông báo yêu cầu bổ sung với trại giam"]
    : [loaiVanBan];

  const danhSachTab = [
    ...tabChinh,
    ...(laToTrinhPhanCong ? [`Danh sách ${loaiVanBan}`] : []),
    ...tabDiKem.map(t => t.ten),
  ];
  const viTriDiKem = tabChinh.length + (laToTrinhPhanCong ? 1 : 0);
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
      <TrangA4 className="text-center italic text-[#888]">
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
        <div className="flex items-center justify-between px-5 py-3 bg-[#1d2e4f] text-white flex-shrink-0">
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
          <div className="px-5 py-1.5 bg-[#e8f4fd] border-b border-[#b3d7f6] text-[11px] text-[#1a5a96] flex-shrink-0">
            Đang ở chế độ sửa — click vào các ô nền xanh để nhập
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">

          {/* Tab dọc */}
          <div className="w-[236px] flex-shrink-0 border-r border-[#ddd] bg-[#f7f9fb] py-2 overflow-y-auto">
            {danhSachTab.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className={`w-full text-left px-4 py-2.5 text-[13px] leading-snug border-l-[3px] transition-colors ${
                  tab === i
                    ? "border-[#8b1a1a] bg-white text-[#8b1a1a] font-semibold"
                    : "border-transparent text-[#555] hover:bg-[#eef1f5]"}`}>
                {t}
              </button>
            ))}
          </div>

        {/* Nội dung — chỉ cuộn dọc, trang tự co để không phải kéo ngang */}
        <div id="khu-vuc-in" className="flex-1 overflow-y-auto overflow-x-hidden bg-[#e9ecef] p-6">

          {/* ── TAB VĂN BẢN CHÍNH ── */}
          {laYeuCauBoSung && tab === 0 && <MauYCBSDuongSu so={soTTHienThi} ngay={ngayVanBan} row={rows[0]} />}
          {laYeuCauBoSung && tab === 1 && <MauYCBSTraiGiam so={soTTHienThi} ngay={ngayVanBan} row={rows[0]} />}
          {tab === 0 && !laToTrinhPhanCong && !laYeuCauBoSung && renderMau(loaiVanBan)}
          {tab === 0 && laToTrinhPhanCong && (
            <div className="mx-auto bg-white shadow-md w-full max-w-[794px] px-[85px] py-[55px] text-black font-['Times_New_Roman','Times',serif] text-[14.5px] leading-[1.55]">
              <QuocHieu />

              <div className="grid grid-cols-2 mt-4 text-[13px]">
                <div className="text-center">
                  Số: {edLine(info.soTT, v => set("soTT", v), "", "w-[70px] text-center")}/TTr-TANDTC-VP
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
                      className="w-full text-center bg-[#f0f7ff] border border-dashed border-[#1a5a96] outline-none px-1 font-bold" />
                  ) : (
                    info.chucDanhKy.split("\n").map((l, i) => <div key={i}>{l}</div>)
                  )}
                  <div className="mt-16">{edLine(info.nguoiKy, v => set("nguoiKy", v), "font-bold", "w-[200px] text-center")}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: DANH SÁCH KÈM THEO TỜ TRÌNH PHÂN CÔNG ── */}
          {tab === 1 && laToTrinhPhanCong && (
            <div className="mx-auto bg-white shadow-md w-full max-w-[1100px] px-[55px] py-[45px] text-black font-['Times_New_Roman','Times',serif] text-[13px] leading-[1.45] relative">
              <div className="absolute right-[30px] top-[20px] text-[12px]">1</div>
              <QuocHieu />

              <div className="text-center mt-8">
                <div className="text-[14px] font-bold leading-[1.5]">
                  {laToTrinhPhanCong ? (
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
                  (Kèm theo {loaiVanBan.toLowerCase()} số {soTTHienThi}/{hauToSoCua(loaiVanBan)} ngày {ngayHienThi} của Văn phòng Tòa án nhân dân tối cao)
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
                              className="w-full bg-[#f0f7ff] border border-dashed border-[#1a5a96] outline-none px-1 text-[12px] resize-y" />
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

// Loại văn bản cấp theo TỪNG ĐƠN (mỗi đơn 1 tờ) thay vì gộp theo đơn vị.
const CAP_THEO_TUNG_DON = new Set(["Giấy xác nhận", "Yêu cầu bổ sung"]);

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

// Dựng 1 văn bản cho 1 đơn vị chuyển đến, 3 cấp:
//   Văn bản → Danh sách đơn (mỗi thẩm phán 1 danh sách, tách theo hình thức
//   phân công) → Đơn
// chamValidation=false cho văn bản đi kèm: vẫn hiển thị đầy đủ thông tin đơn
// nhưng không bị soi bằng luật của loại văn bản chính.
const dungVanBanTheoDonVi = (
  loaiVB: string,
  donVi: string,
  rows: any[],
  idPrefix: string,
  chamValidation: boolean,
): DocNode => {
  const tenGoc = `${loaiVB} - ${donVi}`;
  const theoTP: Record<string, { tp: string; loai: string; rows: any[] }> = {};
  rows.forEach(r => {
    const tp = (r.thongTinDon?.thamPhan || "Chưa phân công").split(" (")[0];
    const loai = r.loaiPhanCong === "chi-dinh" ? "chỉ định"
      : r.loaiPhanCong === "ngau-nhien" ? "ngẫu nhiên" : "";
    (theoTP[`${tp}|${loai}`] ||= { tp, loai, rows: [] }).rows.push(r);
  });

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
    children: Object.values(theoTP).map((g, i) => ({
      id: `${idPrefix}-ds${i}`,
      name: `Danh sách đơn - Thẩm phán ${g.tp}${g.loai ? ` (phân công ${g.loai})` : ""}`,
      type: "Danh sách",
      date: "30/07/2026",
      isExpanded: true,
      khongCham: !chamValidation,
      children: g.rows.map((r, j) => ({
        id: `${idPrefix}-ds${i}-${r.id}`,
        sttHienThi: j + 1,
        name: r.maDon || r.nguoiGui || `Đơn ${r.id}`,
        type: "Đơn",
        date: r.ngayNhap || "30/07/2026",
        isExpanded: false,
        originalData: r,
        khongCham: !chamValidation,
      })),
    })),
  };
};

// --- Validation Service ---
const validateTree = (nodes: DocNode[], selectedType: string): DocNode[] => {
  return nodes.map(node => {
    // Văn bản đi kèm: luôn hợp lệ, chỉ đi tiếp xuống con để giữ nguyên cấu trúc
    if (node.khongCham) {
      return {
        ...node,
        isValid: true,
        invalidReason: "",
        ...(node.children ? { children: validateTree(node.children, selectedType) } : {}),
      };
    }

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
      } else if (selectedType === "Thông báo phân công TP") {
        if (!["Thụ lý mới", "Thụ lý mới trùng TP", "Thụ lý xét xử", "Thụ lý mới trong thẩm phán", "Thụ lý mới trùng thẩm phán"].includes(tq) || toTrinhStatus === "none") {
          isValid = false; invalidReason = "Trạng thái thụ lý & Đã tạo tờ trình";
        }
      } else if (selectedType === "Yêu cầu bổ sung") {
        // Chỉ áp dụng cho đơn chưa đủ điều kiện. So khớp lỏng vì dữ liệu ghi
        // "Chưa đủ điều kiện" còn danh mục cũ ghi "Đơn chưa đủ điều kiện".
        if (!tq.toLowerCase().includes("chưa đủ điều kiện")) {
          isValid = false; invalidReason = "Chỉ lập cho đơn Chưa đủ điều kiện";
        }
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
    <div ref={ref} className="absolute right-0 top-full mt-1 z-50 w-40 bg-white border border-[#ddd] shadow-lg py-1 rounded-[4px] text-[#333]">
      {onLaySo && (
        <>
          <button onClick={() => { onLaySo(); onClose(); }}
            className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#1d2e4f] hover:bg-[#eef1f5] flex items-center gap-2">
            <Save size={14} /> Lấy số
          </button>
          <div className="h-px bg-[#eee] my-1" />
        </>
      )}
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

// ─── Bảng tài liệu: cột như màn lưu số, gom nhóm 3 tầng ─────────────────────
// Tầng 1 (văn bản to) và tầng 2 (thẩm phán) là dòng gộp cả bảng, có chevron.
// Tầng 3 (đơn) mới đổ vào từng cột.
const SO_COT = 8;

const OChon = ({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) => (
  <div className="relative">
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`w-full h-[30px] pl-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a5a96] ${value ? "text-[#222]" : "text-[#aaa]"}`}>
      <option value="" disabled hidden>{placeholder}</option>
      {/* value giữ chuỗi đầy đủ để khớp với ô tổng, chỉ hiển thị tên cho gọn cột */}
      {options.map(o => <option key={o} value={o} className="text-[#222]">{o.split(" - ")[0]}</option>)}
    </select>
    <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
  </div>
);

const HangTaiLieu = ({
  node, level = 0, soCongVanCha, onToggleExpand, onLaySo, nguoiTheoDon, setNguoiTheoDon,
  duyetChung, kyChung,
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
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const coCon = !!node.children?.length;
  const khongHopLe = node.isValid === false;
  const laDon = node.type === "Đơn" && !coCon;
  const d = node.originalData;

  const menu = (
    <div className="relative inline-block">
      <button onClick={() => setShowMenu(!showMenu)}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#e0e0e0] text-[#555] transition-colors">
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

  const trangThai = khongHopLe ? (
    <span className="inline-flex items-center gap-1 text-[#e74c3c] bg-white px-2 py-1 rounded border border-[#fadbd8] text-[11px] whitespace-nowrap"
      title={node.invalidReason}>
      <AlertTriangle size={12} /> Không hợp lệ
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[#27ae60] text-[11px] whitespace-nowrap">
      <Check size={12} /> Hợp lệ
    </span>
  );

  // ── Tầng 1 & 2: dòng gộp cả bảng ──
  if (!laDon) {
    return (
      <>
        <tr className={level === 0 ? "bg-[#eef1f5]" : "bg-[#f7f9fb]"}>
          <td colSpan={SO_COT} className={`border-b border-[#ddd] px-3 py-2 ${khongHopLe ? "bg-[#fdf3f2]" : ""}`}>
            <div className="flex items-center gap-2" style={{ paddingLeft: level * 22 }}>
              <button onClick={() => onToggleExpand(node.id)}
                className="w-5 h-5 flex items-center justify-center text-[#555] hover:bg-black/5 rounded flex-shrink-0">
                {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <FileText size={14} className={`flex-shrink-0 ${level === 0 ? "text-[#8b1a1a]" : "text-[#1a5a96]"}`} />
              <span className={`${level === 0 ? "text-[13px] font-bold text-[#1d2e4f]" : "text-[12.5px] font-semibold text-[#333]"}`}>
                {node.name}
              </span>
              <span className="ml-auto flex items-center gap-3 flex-shrink-0">
                {trangThai}
                {menu}
              </span>
            </div>
          </td>
        </tr>
        {node.isExpanded && node.children!.map((c, i) => (
          <HangTaiLieu key={c.id} node={c} level={level + 1}
            soCongVanCha={node.soVanBan ? `${node.soVanBan}/2026/${node.hauToSo ?? "TANDTC-VP"}` : soCongVanCha}
            onToggleExpand={onToggleExpand} onLaySo={onLaySo}
            nguoiTheoDon={nguoiTheoDon} setNguoiTheoDon={setNguoiTheoDon}
            duyetChung={duyetChung} kyChung={kyChung} />
        ))}
      </>
    );
  }

  // ── Tầng 3: đơn, đổ vào từng cột ──
  const dat = (k: "duyet" | "ky") => (v: string) =>
    setNguoiTheoDon(p => ({ ...p, [node.id]: { ...p[node.id], [k]: v } }));

  return (
    <tr className={`align-top ${khongHopLe ? "bg-[#fdf3f2]" : "bg-white hover:bg-[#fafafa]"}`}>
      <td className="border-b border-[#eee] px-2 py-2 text-center text-[12px] text-[#555]">
        {node.sttHienThi ?? "-"}
      </td>
      <td className="border-b border-[#eee] px-2 py-2 text-[12px]">
        <div className="font-semibold text-[#1d2e4f]">{node.name}</div>
        <div className="text-[11px] text-[#888] mt-0.5 whitespace-nowrap">{soCongVanCha ?? "— chưa lấy số"}</div>
      </td>
      <td className="border-b border-[#eee] px-2 py-2 text-[12px]">
        <div className="font-medium text-[#1a5a96]">{d?.nguoiGui || "-"}</div>
        <div className="text-[11px] text-[#777] mt-0.5">{d?.diaChi || ""}</div>
      </td>
      <td className="border-b border-[#eee] px-3 py-2 text-[12px] leading-relaxed">
        <div className="grid grid-cols-2 gap-x-5 gap-y-0.5">
          <div><span className="text-[#888]">Số BA/QĐ: </span><span className="font-medium">{d?.thongTinDon?.soBaqd || "-"}</span></div>
          <div><span className="text-[#888]">Ngày BA/QĐ: </span>{d?.thongTinDon?.ngay || "-"}</div>
          <div className="col-span-2"><span className="text-[#888]">Hình thức: </span>{d?.thongTinDon?.hinhThuc || "-"}</div>
          <div className="col-span-2"><span className="text-[#888]">Thủ tục giải quyết: </span>{d?.thongTinDon?.thuTuc || "-"}</div>
        </div>
      </td>
      <td className="border-b border-[#eee] px-2 py-2 w-[150px]">
        <OChon value={nguoiTheoDon[node.id]?.duyet ?? duyetChung} onChange={dat("duyet")}
          options={NGUOI_DUYET_OPTIONS} placeholder="Chọn người duyệt" />
      </td>
      <td className="border-b border-[#eee] px-2 py-2 w-[150px]">
        <OChon value={nguoiTheoDon[node.id]?.ky ?? kyChung} onChange={dat("ky")}
          options={NGUOI_KY_OPTIONS} placeholder="Chọn người ký" />
      </td>
      <td className="border-b border-[#eee] px-2 py-2 text-center">{trangThai}</td>
      <td className="border-b border-[#eee] px-2 py-2 text-right">{menu}</td>
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
      <div className={`flex items-start group border-b border-[#eee] transition-colors
        ${isInvalid ? 'bg-[#fef2f2] hover:bg-[#fee2e2]' : 'bg-white hover:bg-[#f9f9f9]'}`}
      >
        {/* Document Info Column */}
        <div 
          className="flex-1 py-2.5 px-4 flex items-start"
          style={{ paddingLeft: `${16 + level * 24}px` }}
        >
          {hasChildren ? (
            <button 
              onClick={() => onToggleExpand(node.id)}
              className="w-5 h-5 flex items-center justify-center mr-1 mt-0.5 text-[#666] hover:bg-[#eee] rounded flex-shrink-0"
            >
              {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-5 mr-1 flex-shrink-0" />
          )}
          
          <FileText size={15} className={`mr-2 mt-0.5 flex-shrink-0 ${isInvalid ? 'text-[#e74c3c]' : level >= 2 ? 'text-[#2980b9]' : 'text-[#8b1a1a]'}`} />

          {isLeafDon ? (
            // Rich detail view for leaf Đơn nodes
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] font-semibold mb-1 ${isInvalid ? 'text-[#c0392b]' : 'text-[#1a1a2e]'}`}>
                {node.name}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[11.5px]">
                <div className="flex gap-1">
                  <span className="text-[#888] flex-shrink-0">Người đứng đơn:</span>
                  <span className="text-[#333] font-medium truncate">{d.nguoiGui || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[#888] flex-shrink-0">Mã đơn:</span>
                  <span className="text-[#333] font-medium">{d.maDon || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[#888] flex-shrink-0">Ngày trên đơn:</span>
                  <span className="text-[#333]">{d.thongTinDon?.ngay || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[#888] flex-shrink-0">Ngày nhận:</span>
                  <span className="text-[#333]">{d.ngayNhap || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[#888] flex-shrink-0">Hình thức đơn:</span>
                  <span className="text-[#333] truncate">{d.thongTinDon?.hinhThuc || d.loaiHinhThuc || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[#888] flex-shrink-0">Số BA/QĐ:</span>
                  <span className="text-[#333] font-medium">{d.thongTinDon?.soBaqd || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[#888] flex-shrink-0">Ngày BA/QĐ:</span>
                  <span className="text-[#333]">{d.thongTinDon?.ngay || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[#888] flex-shrink-0">Thủ tục giải quyết:</span>
                  <span className="text-[#333] truncate">{d.thongTinDon?.thuTuc || "—"}</span>
                </div>
              </div>
            </div>
          ) : (
            // Standard view for parent nodes (Tờ trình / Danh sách)
            <div>
              <div className={`text-[13px] font-medium ${isInvalid ? 'text-[#c0392b]' : 'text-[#333]'}`}>
                {node.name}
              </div>
              <div className="text-[11px] text-[#888] mt-0.5">
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
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-52 p-2 bg-[#333] text-white text-[11px] rounded shadow-lg z-10 whitespace-normal">
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
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#e0e0e0] text-[#555] transition-colors"
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
export default function DocumentNumberingModal({ isOpen, onClose, currentRole, selectedRows, loaiVanBanMacDinh }: DocumentNumberingModalProps) {
  // Ăn theo Loại văn bản đang chọn ngoài màn Danh sách đơn.
  // So khớp không phân biệt hoa thường vì hai danh mục viết hoa khác nhau.
  const loaiKhoiTao =
    DOC_TYPES.find(t => t.toLowerCase() === (loaiVanBanMacDinh ?? "").toLowerCase())
    ?? "Tờ trình phân công thẩm phán";
  const [docType, setDocType] = useState(loaiKhoiTao);
  const [treeData, setTreeData] = useState<DocNode[]>([]);

  // New UI states
  const [nguoiTao, setNguoiTao] = useState("Vũ Văn Yên");
  const [nguoiDuyet, setNguoiDuyet] = useState("");
  // Luồng duyệt của Tờ trình phân công thẩm phán
  const [nguoiKy, setNguoiKy] = useState("");
  const [yKienDuyet, setYKienDuyet] = useState("");
  const [yKienKy, setYKienKy] = useState("");
  const [mucDoUuTien, setMucDoUuTien] = useState("Bình thường");
  const [daTrinhDuyet, setDaTrinhDuyet] = useState(false);
  const [chanTrinhDuyet, setChanTrinhDuyet] = useState(false);
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
  const thieuNguoiDuyetKy = !nguoiDuyet || !nguoiKy;
  
  // Dựng cây tài liệu — MỘT luồng dùng chung cho MỌI loại văn bản.
  //   Mặc định 3 tầng: Văn bản (mỗi đơn vị chuyển đến 1 bản)
  //                    → Danh sách đơn (mỗi thẩm phán, tách theo hình thức phân công)
  //                    → Đơn
  //   Loại trong CAP_THEO_TUNG_DON: mỗi đơn 1 văn bản, bỏ tầng Danh sách đơn.
  useEffect(() => {
    if (!isOpen) return;

    const theoDonVi: Record<string, any[]> = {};
    selectedRows.forEach(row => {
      const dv = row.thongTinDon?.donViGiaiQuyet || "Chưa xác định";
      (theoDonVi[dv] ||= []).push(row);
    });

    const nodes: DocNode[] = [];
    let n = 1;

    const dungNhom = (loaiVB: string, cham: boolean, tienTo: string) => {
      if (CAP_THEO_TUNG_DON.has(loaiVB)) {
        selectedRows.forEach(r => nodes.push(dungVanBanTheoDon(loaiVB, r, `${tienTo}-${n++}`, cham)));
      } else {
        Object.entries(theoDonVi).forEach(([donVi, rowsDV]) =>
          nodes.push(dungVanBanTheoDonVi(loaiVB, donVi, rowsDV, `${tienTo}-${n++}`, cham)));
      }
    };

    dungNhom(docType, true, "vb");
    // Văn bản đi kèm — cùng cấu trúc, chỉ khác là không bị chấm validation
    vanBanDiKem.forEach(loaiVB => dungNhom(loaiVB, false, "dikem"));

    setTreeData(validateTree(nodes, docType));
  }, [docType, isOpen, selectedRows, vanBanDiKem]);

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
        name: `${n.tenGoc ?? n.name} - (Số ${so}/2026/${n.hauToSo ?? "TANDTC-VP"} - ${hnay})`,
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
        <div className="flex items-center justify-between px-5 py-3 bg-[#1d2e4f] text-white flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-bold">Lưu số văn bản & In báo cáo</h2>
            {selectedRows && selectedRows.length > 0 && <p className="text-[12px] text-white/70 mt-0.5">Mã tài liệu gốc: {selectedRows.map(r => r.maDon).join(", ")}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>


        {/* Configuration Bar */}
        <div className="bg-white border-b border-[#ddd] px-5 py-4 flex-shrink-0 shadow-sm z-10">
          <div className="flex flex-wrap gap-5 items-end">

            {/* Document Type */}
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

            {/* Creator (fixed = current user) — hiện với mọi loại văn bản */}
            {(
              <div className="min-w-[180px]">
                <label className="block text-[12px] font-semibold text-[#555] mb-1.5">
                  Người tạo
                </label>
                <div className="h-[34px] px-3 flex items-center text-[13px] border border-[#eee] bg-[#f9f9f9] rounded-[4px] text-[#444]">
                  Vũ Văn Yên (Cán bộ)
                </div>
              </div>
            )}

            {/* Luồng duyệt — dùng chung cho mọi loại văn bản */}
            {/* Luồng duyệt — dùng chung cho mọi loại văn bản */}
            {(
              <div className="flex gap-5 items-end flex-1">
                {([
                  { label: "Người duyệt", value: nguoiDuyet, set: setNguoiDuyet, placeholder: "Chọn người duyệt", options: NGUOI_DUYET_OPTIONS },
                  { label: "Người ký", value: nguoiKy, set: setNguoiKy, placeholder: "Chọn người ký", options: NGUOI_KY_OPTIONS },
                ] as const).map(f => (
                  <div key={f.label} className="flex-1 min-w-[200px]">
                    <label className="block text-[12px] font-semibold text-[#555] mb-1.5">
                      {f.label} <span className="text-[#e74c3c]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={f.value}
                        onChange={e => f.set(e.target.value)}
                        className={`w-full h-[34px] pl-3 pr-8 text-[13px] border rounded-[4px] bg-white focus:border-[#1a5a96] outline-none appearance-none ${
                          f.value ? "border-[#ccc] text-[#222]" : "border-[#e57373] text-[#aaa]"}`}
                      >
                        <option value="" disabled hidden>{f.placeholder}</option>
                        {f.options.map(o => <option key={o} className="text-[#222]">{o}</option>)}
                      </select>
                      <ChevronDown size={14} className={`absolute right-2.5 top-[10px] pointer-events-none ${f.value ? "text-[#888]" : "text-[#ccc]"}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chọn văn bản đi kèm — mỗi đơn vị chuyển đến sinh 1 công văn */}
            {/* Mức độ ưu tiên */}
            <div className="min-w-[160px]">
              <label className="block text-[12px] font-semibold text-[#555] mb-1.5">Mức độ ưu tiên</label>
              <div className="relative">
                <select
                  value={mucDoUuTien}
                  onChange={e => setMucDoUuTien(e.target.value)}
                  className={`w-full h-[34px] pl-3 pr-8 text-[13px] border rounded-[4px] bg-white focus:border-[#1a5a96] outline-none appearance-none ${
                    mucDoUuTien === "Bình thường"
                      ? "border-[#ccc] text-[#222]"
                      : "border-[#e67e22] text-[#c0392b] font-semibold"}`}
                >
                  {MUC_DO_UU_TIEN.map(m => <option key={m} className="text-[#222] font-normal">{m}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-[10px] text-[#888] pointer-events-none" />
              </div>
            </div>

            <div className="min-w-[300px]" ref={diKemRef}>
              <label className="block text-[12px] font-semibold text-[#555] mb-1.5">Chọn văn bản đi kèm</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDiKem(o => !o)}
                  className="w-full h-[34px] pl-3 pr-8 text-[13px] border border-[#ccc] rounded-[4px] bg-white focus:border-[#1a5a96] outline-none text-left flex items-center">
                  <span className={`truncate ${vanBanDiKem.length ? "text-[#222]" : "text-[#aaa]"}`}>
                    {vanBanDiKem.length === 0
                      ? "-- Chọn văn bản đi kèm --"
                      : vanBanDiKem.length === 1
                        ? vanBanDiKem[0]
                        : `Đã chọn ${vanBanDiKem.length} văn bản`}
                  </span>
                </button>
                <ChevronDown size={14} className={`absolute right-2.5 top-[10px] pointer-events-none ${
                  vanBanDiKem.length ? "text-[#888]" : "text-[#ccc]"}`} />

                {openDiKem && (
                  <div className="absolute left-0 top-[38px] z-50 w-full min-w-[300px] bg-white border border-[#ccc] rounded-[4px] shadow-lg py-1 max-h-[280px] overflow-y-auto">
                    {loaiDiKemChoPhep.map(v => (
                      <label key={v} className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#333] hover:bg-[#f5f5f5] cursor-pointer">
                        <input type="checkbox" className="w-[14px] h-[14px] accent-[#1d2e4f] flex-shrink-0"
                          checked={vanBanDiKem.includes(v)}
                          onChange={e => setVanBanDiKem(prev =>
                            e.target.checked ? [...prev, v] : prev.filter(x => x !== v))} />
                        {v}
                      </label>
                    ))}
                    {vanBanDiKem.length > 0 && (
                      <>
                        <div className="h-px bg-[#eee] my-1" />
                        <button type="button" onClick={() => setVanBanDiKem([])}
                          className="w-full text-left px-3 py-1.5 text-[12px] text-[#c0392b] hover:bg-[#fdeaea]">
                          Bỏ chọn tất cả
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Nội dung chỉ đạo — xuống hàng riêng, 2 cột khớp Người duyệt / Người ký */}
            {/* Nội dung trình duyệt — dùng chung cho mọi loại văn bản */}
            {(
              <div className="w-full grid grid-cols-2 gap-5">
                {([
                  { label: "Nội dung trình duyệt", value: yKienDuyet, set: setYKienDuyet, ph: "Nhập nội dung trình duyệt..." },
                  { label: "Nội dung trình duyệt ký", value: yKienKy, set: setYKienKy, ph: "Nhập nội dung trình duyệt ký..." },
                ] as const).map(f => (
                  <div key={f.label}>
                    <label className="block text-[12px] font-semibold text-[#555] mb-1.5">{f.label}</label>
                    <textarea
                      rows={2}
                      value={f.value}
                      onChange={e => f.set(e.target.value)}
                      placeholder={f.ph}
                      className="w-full px-3 py-2 text-[13px] border border-[#ccc] rounded-[4px] bg-white focus:border-[#1a5a96] outline-none resize-y placeholder:text-[#aaa]" />
                  </div>
                ))}
              </div>
            )}


          </div>
        </div>

        {/* Document Tree Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#f4f6f8]">
          <div className="bg-white border border-[#ddd] rounded-[6px] shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f5f5f5] text-[11px] font-bold text-[#555] uppercase tracking-wide">
                  <th className="border-b border-[#ddd] px-2 py-2.5 w-[42px] text-center">STT</th>
                  <th className="border-b border-[#ddd] px-2 py-2.5 w-[125px] text-left">Số công văn</th>
                  <th className="border-b border-[#ddd] px-2 py-2.5 w-[185px] text-left">Thông tin người gửi</th>
                  <th className="border-b border-[#ddd] px-3 py-2.5 min-w-[360px] text-left">Thông tin đơn</th>
                  <th className="border-b border-[#ddd] px-2 py-2.5 w-[145px] text-left">Người duyệt</th>
                  <th className="border-b border-[#ddd] px-2 py-2.5 w-[145px] text-left">Người ký</th>
                  <th className="border-b border-[#ddd] px-2 py-2.5 w-[105px] text-center">Trạng thái</th>
                  <th className="border-b border-[#ddd] px-2 py-2.5 w-[54px] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {treeData.length === 0 ? (
                  <tr><td colSpan={8} className="px-3 py-8 text-center text-[13px] text-[#999] italic">Chưa có tài liệu</td></tr>
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
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex items-start gap-2 bg-[#e8f4fd] p-3 rounded border border-[#b3d7f6] text-[#1a5a96] text-[12px]">
            <Info size={16} className="mt-0.5 flex-shrink-0" />
            <p>
              Văn bản chính sẽ được tự động cấp số sau khi được
              <strong> Chánh Văn phòng/Phó Chánh Văn phòng</strong> ký.
              Các tài liệu đính kèm sẽ được đánh số phụ lục.
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-white border-t border-[#ddd] p-4 flex items-center justify-between gap-3 flex-shrink-0 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-[#888]">
              {treeData.length > 0 && (
                <span>
                  {treeData.filter(n => n.isValid !== false).length}/{treeData.length} tờ trình hợp lệ
                </span>
              )}
            </div>
            {/* Bỏ tất cả đơn không hợp lệ bằng 1 nút, thay vì xóa từng dòng */}
            {soDonKhongHopLe > 0 && (
              <button
                onClick={() => setTreeData(prev => validateTree(pruneInvalidDocs(prev), docType))}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#8b1a1a] bg-white border border-[#8b1a1a] rounded-[4px] hover:bg-[#fdeaea] transition-colors whitespace-nowrap">
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
                    ? "text-[#aaa] bg-[#f5f5f5] border border-[#ddd] cursor-not-allowed"
                    : "text-white bg-[#1d2e4f] hover:bg-[#15223a] shadow-sm"}`}>
                <Save size={15} /> Lấy số
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-[#555] bg-white border border-[#ccc] rounded-[4px] hover:bg-[#f5f5f5] transition-colors"
            >
              Đóng
            </button>

            {(
              <button
                onClick={() => setShowBieuMau(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-[#1a5a96] bg-white border border-[#1a5a96] rounded-[4px] hover:bg-[#f0f7ff] transition-colors">
                <FileText size={15} /> Xem biểu mẫu
              </button>
            )}

            {/* Role-based action buttons */}
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
                {/* Ký số button styled like screenshot */}
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
              // Can bo: Luu & Trinh duyet — chặn khi chưa chọn Người duyệt / Người ký
              <button
                onClick={() => {
                  // Còn đơn không hợp lệ thì cảnh báo, không cho lưu
                  if (soDonKhongHopLe > 0) { setChanTrinhDuyet(true); return; }
                  setDaTrinhDuyet(true);
                }}
                disabled={thieuNguoiDuyetKy}
                title={thieuNguoiDuyetKy ? "Vui lòng chọn Người duyệt và Người ký" : undefined}
                className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded-[4px] transition-colors shadow-sm ${
                  thieuNguoiDuyetKy ? "bg-[#8b1a1a]/50 cursor-not-allowed" : "bg-[#8b1a1a] hover:bg-[#7a1717]"}`}>
                <Send size={15} /> Lưu & Trình duyệt
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
            setTreeData(prev => validateTree(pruneInvalidDocs(prev), docType));
            setChanTrinhDuyet(false);
          }}
          onDong={() => setChanTrinhDuyet(false)}
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
