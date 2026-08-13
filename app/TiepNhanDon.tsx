import React, { useMemo, useRef, useState } from "react";
import {
  Mail, Truck, Globe, User, Building2, Paperclip, Upload, X, Check,
  ChevronDown, AlertCircle, FileText, ZoomIn, ZoomOut, RotateCw, Trash2, Eye,
  ArrowLeft, Search, Send, ChevronLeft, ChevronRight, ChevronUp, SlidersHorizontal,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
 * MÀN TIẾP NHẬN ĐƠN
 *
 * Khác biệt so với bản tham khảo (Stitch) — và lý do:
 *  1. "Hình thức nhận" là dải nút chọn, không phải dropdown. Nó QUYẾT ĐỊNH
 *     những ô nào hiện ra bên dưới, mà thứ điều khiển cả biểu mẫu thì không nên
 *     giấu trong danh sách xổ.
 *  2. Khối bì thư chỉ hiện khi nhận qua Bưu điện. Bản gốc luôn hiện, nên nhận
 *     trực tiếp vẫn phải nhìn 3 ô "mã bưu điện / dấu bưu điện / mã bì thư" bỏ trống.
 *  3. "Số đến" chỉ còn MỘT ô. Bản gốc có "Số đến Văn bản điều hành" ở khối bì thư
 *     và "Số đến" ở khối phân loại — hai ô cùng tên trên một biểu mẫu là nguồn
 *     nhập sai kinh điển.
 *  4. Địa chỉ theo mô hình 2 cấp (Tỉnh/Thành → Phường/Xã), bỏ quận/huyện. Người
 *     gửi ở nước ngoài thì thu về một ô địa chỉ tự do, vì danh mục xã của Việt Nam
 *     không dùng được.
 *  5. Nút Lưu chỉ bật khi đủ điều kiện, và luôn nói rõ CÒN THIẾU GÌ ngay cạnh nút,
 *     thay vì bấm xong mới báo lỗi.
 * ────────────────────────────────────────────────────────────────────────────*/

// ─── Thành phần dùng chung (khớp kiểu với các màn còn lại) ───────────────────

const Lbl = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <label className="block text-[13px] font-medium text-[#333] mb-1">
    {children}{req && <span className="text-[#c0392b] ml-0.5">*</span>}
  </label>
);

const Inp = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props}
    className={`w-full h-[30px] px-2 text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 disabled:bg-[#f5f5f5] disabled:text-[#999] ${className}`} />
);

const Sel = ({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select {...props}
      className={`w-full h-[30px] pl-2 pr-7 text-[13px] border border-[#ccc] rounded-[3px] bg-white focus:outline-none focus:border-[#1a73e8] appearance-none disabled:bg-[#f5f5f5] disabled:text-[#999] ${className}`}>
      {children}
    </select>
    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
  </div>
);

const Khoi = ({ icon, tieuDe, moTa, children, extra }: {
  icon: React.ReactNode; tieuDe: string; moTa?: string;
  children: React.ReactNode; extra?: React.ReactNode;
}) => (
  <div className="bg-white border border-[#ddd] rounded-[4px]">
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 border-b border-[#eee]">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[#8b1a1a] flex-shrink-0">{icon}</span>
        <span className="text-[13px] font-semibold text-[#1d2e4f]">{tieuDe}</span>
        {moTa && <span className="text-[12px] text-[#94a3b8] truncate">· {moTa}</span>}
      </div>
      {extra}
    </div>
    <div className="p-3.5">{children}</div>
  </div>
);

// ─── Danh mục ────────────────────────────────────────────────────────────────

type HinhThuc = "buu-dien" | "dien-tu" | "noi-bo";

/** Ba hình thức tiếp nhận tỉnh chốt dùng. Bản trước có thêm "Trực tiếp" và
 *  "Tiếp công dân" — đã bỏ theo yêu cầu nghiệp vụ. */
const HINH_THUC: { ma: HinhThuc; nhan: string; icon: React.ReactNode }[] = [
  { ma: "buu-dien", nhan: "Bưu điện", icon: <Truck size={14} /> },
  { ma: "dien-tu", nhan: "Điện tử", icon: <Globe size={14} /> },
  { ma: "noi-bo", nhan: "Nội bộ", icon: <Building2 size={14} /> },
];

const CAN_BO_TIEP_NHAN = ["Vũ Văn Yên", "Phùng Trâm Anh", "Nguyễn Thị Lan", "Nguyễn Minh An"];

/** Danh mục Loại văn bản — 10 loại, chia 4 nhóm. Nhóm quyết định biểu mẫu nhập,
 *  cờ `gdtTT` quyết định luồng đi VÀ đơn vị xử lý mặc định (xem `donViMacDinh`).
 *  Trước đây danh mục ở đây chỉ có 5 loại nên văn thư không vào sổ được công văn
 *  kiến nghị và hồ sơ kháng nghị. */
const LOAI_VAN_BAN_DM: { nhan: string; nhom: string; gdtTT: boolean }[] = [
  { nhan: "Đơn đề nghị GĐT/TT", nhom: "Đơn", gdtTT: true },
  { nhan: "Đơn khiếu nại tố cáo trong tố tụng", nhom: "Đơn", gdtTT: false },
  { nhan: "Thông báo phát hiện vi phạm pháp luật", nhom: "Đơn", gdtTT: false },
  { nhan: "Đơn khác", nhom: "Đơn", gdtTT: false },
  { nhan: "CV kiến nghị GĐT/TT", nhom: "Công văn", gdtTT: true },
  { nhan: "CV chuyển đơn", nhom: "Công văn", gdtTT: true },
  { nhan: "CV chuyển kiến nghị GĐT/TT", nhom: "Công văn", gdtTT: true },
  { nhan: "Công văn khác", nhom: "Công văn", gdtTT: false },
  { nhan: "Hồ sơ kháng nghị", nhom: "Hồ sơ", gdtTT: true },
  { nhan: "Tài liệu chứng cứ", nhom: "Tài liệu", gdtTT: false },
];

const LOAI_VAN_BAN = LOAI_VAN_BAN_DM.map(l => l.nhan);

/** Nhóm để đổ optgroup, giữ đúng thứ tự khai báo ở trên. */
const LOAI_VAN_BAN_THEO_NHOM = LOAI_VAN_BAN_DM.reduce<{ nhom: string; items: string[] }[]>((acc, l) => {
  const g = acc.find(x => x.nhom === l.nhom);
  if (g) g.items.push(l.nhan); else acc.push({ nhom: l.nhom, items: [l.nhan] });
  return acc;
}, []);

/** Loại văn bản nào thì đi vào luồng GĐT/TT. Suy thẳng từ Loại văn bản, không có
 *  ô đánh dấu riêng: trước đây có thêm câu hỏi "Là đơn đề nghị GĐT/TT?" nhưng nó
 *  hỏi lại đúng thứ vừa chọn ở trên, và cho phép hai câu trả lời mâu thuẫn. */
const MAC_DINH_GDT_TT = (loai: string) =>
  LOAI_VAN_BAN_DM.find(l => l.nhan === loai)?.gdtTT ?? false;

/** Địa bàn 2 cấp. Tòa đang đăng nhập là TAND thành phố Hà Nội nên phường/xã Hà Nội
 *  để đầu; các tỉnh khác vẫn chọn được vì đơn có thể gửi từ nơi khác đến. */
const TINH_THANH = [
  "Thành phố Hà Nội", "Thành phố Hồ Chí Minh", "Thành phố Hải Phòng",
  "Thành phố Đà Nẵng", "Thành phố Cần Thơ", "Tỉnh Bắc Ninh", "Tỉnh Hưng Yên",
  "Tỉnh Ninh Bình", "Tỉnh Phú Thọ", "Tỉnh Quảng Ninh", "Tỉnh Thanh Hóa",
];

const PHUONG_XA: Record<string, string[]> = {
  "Thành phố Hà Nội": [
    "Phường Hoàn Kiếm", "Phường Cửa Nam", "Phường Ba Đình", "Phường Ngọc Hà",
    "Phường Hai Bà Trưng", "Phường Vĩnh Tuy", "Phường Đống Đa", "Phường Láng",
    "Phường Cầu Giấy", "Phường Nghĩa Đô", "Phường Thanh Xuân", "Phường Hà Đông",
    "Phường Long Biên", "Phường Hoàng Mai", "Phường Tây Hồ", "Phường Sơn Tây",
    "Xã Đông Anh", "Xã Gia Lâm", "Xã Thanh Trì", "Xã Quang Minh", "Xã Sóc Sơn",
  ],
};

const QUOC_GIA = ["Việt Nam", "Hoa Kỳ", "Nhật Bản", "Hàn Quốc", "Đức", "Pháp", "Úc", "Khác"];

// ─── Tài liệu đính kèm ───────────────────────────────────────────────────────

type NhomTep = "don" | "banAn" | "khac";

type TepDinhKem = { ten: string; kb: number };

const NHOM_TEP: { ma: NhomTep; nhan: string; batBuoc?: boolean; moTa: string }[] = [
  { ma: "don", nhan: "Đơn", batBuoc: true, moTa: "Bản chụp/scan đơn của công dân" },
  { ma: "banAn", nhan: "Bản án / Quyết định", moTa: "Bản án, quyết định bị đề nghị xem xét lại" },
  { ma: "khac", nhan: "Tài liệu khác", moTa: "Chứng cứ, giấy ủy quyền, tài liệu kèm theo" },
];

const coChu = (kb: number) => kb >= 1024 ? `${(kb / 1024).toFixed(1).replace(".", ",")} MB` : `${Math.round(kb)} KB`;

const OTaiLieu = ({ nhan, moTa, batBuoc, tep, dangXem, onThem, onXoa, onXem }: {
  nhan: string; moTa: string; batBuoc?: boolean; tep: TepDinhKem[]; dangXem: boolean;
  onThem: (ds: TepDinhKem[]) => void; onXoa: (i: number) => void; onXem: () => void;
}) => {
  const oFile = useRef<HTMLInputElement>(null);

  return (
    <div className={`rounded-[4px] border transition-colors ${dangXem ? "border-[#8b1a1a] bg-[#fdf7f7]" : "border-[#e0e0e0] bg-[#fafafa]"}`}>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <FileText size={16} className={tep.length ? "text-[#27ae60]" : "text-[#aaa]"} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-[#333]">
            {nhan}{batBuoc && <span className="text-[#c0392b] ml-0.5">*</span>}
            {tep.length > 0 && (
              <span className="ml-2 text-[11px] font-semibold text-[#27ae60]">{tep.length} tệp</span>
            )}
          </div>
          <div className="text-[11px] text-[#94a3b8] truncate">{moTa}</div>
        </div>
        <button type="button" onClick={() => oFile.current?.click()}
          className="flex items-center gap-1.5 h-[28px] px-2.5 border border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#fcf5f5] rounded-[3px] text-[12px] font-medium transition-colors flex-shrink-0">
          <Upload size={12} /> Tải lên
        </button>
        <input ref={oFile} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.tif" className="hidden"
          onChange={e => {
            const ds = Array.from(e.target.files ?? []).map(f => ({ ten: f.name, kb: f.size / 1024 }));
            if (ds.length) onThem(ds);
            e.target.value = "";
          }} />
      </div>

      {tep.length > 0 && (
        <div className="border-t border-[#eee] divide-y divide-[#f0f0f0]">
          {tep.map((t, i) => (
            <div key={`${t.ten}-${i}`} className="flex items-center gap-2 px-3 py-1.5 bg-white">
              <Paperclip size={11} className="text-[#94a3b8] flex-shrink-0" />
              <span className="text-[12px] text-[#333] truncate flex-1">{t.ten}</span>
              <span className="text-[11px] text-[#94a3b8] flex-shrink-0 tabular-nums">{coChu(t.kb)}</span>
              <button type="button" onClick={onXem} title="Xem ở khung bên phải"
                className="text-[#1a5a96] hover:text-[#0f3f6e] flex-shrink-0"><Eye size={13} /></button>
              <button type="button" onClick={() => onXoa(i)} title="Xóa tệp"
                className="text-[#aaa] hover:text-[#c0392b] flex-shrink-0"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Màn hình ────────────────────────────────────────────────────────────────

const homNayISO = () => new Date().toISOString().split("T")[0];

/** Biểu mẫu nhập một đơn. Chỉ mở từ nút "Thêm mới" ở màn danh sách — vào thẳng
 *  biểu mẫu thì cán bộ không thấy được đơn mình vừa nhập nằm ở đâu. */
function FormTiepNhanDon({ canBoDangNhap = "Vũ Văn Yên", onHuy, onMoDanhSachGDT, onLuuDonGDT, onDaLuu, banGhi }: {
  canBoDangNhap?: string;
  onHuy?: () => void;
  /** Bản ghi văn thư đang mở để sửa — điền sẵn vào biểu mẫu. */
  banGhi?: {
    soDen: string; ngayNhan: string; trichYeu: string; nguoiGui: string;
    noiGui: string; loaiVanBan: string; hinhThucNhan: string; laGDTTT: boolean;
  };
  /** Ghi một dòng vào danh sách văn thư đến sau mỗi lần lưu. */
  onDaLuu?: (d: {
    nguoiGui: string; tinh: string; trichYeu: string; loaiVanBan: string;
    hinhThucNhan: string; ngayTiepNhan: string; laGDTTT: boolean; soDen: string;
  }) => void;
  /** Mở Danh sách đơn GĐT/TT — nơi đơn được đánh dấu GĐT/TT sẽ đi tới. */
  onMoDanhSachGDT?: () => void;
  /** Gọi khi lưu một đơn ĐƯỢC ĐÁNH DẤU GĐT/TT — App đẩy đơn vào Danh sách đơn.
   *  Đơn không phải GĐT/TT thì chỉ vào sổ văn bản đến, không gọi hàm này. */
  onLuuDonGDT?: (d: {
    nguoiGui: string; diaChi: string; trichYeu: string; loaiVanBan: string;
    ngayTiepNhan: string; canBoTiepNhan: string; hinhThucTiepNhan: string;
  }) => void;
}) {
  // Giá trị điền sẵn khi mở một bản ghi để sửa. Component được gắn `key` theo id
  // bản ghi nên mỗi lần mở dòng khác là dựng lại, useState lấy đúng giá trị mới.
  const [hinhThuc, setHinhThuc] = useState<HinhThuc>(
    HINH_THUC.find(h => h.nhan === banGhi?.hinhThucNhan)?.ma ?? "buu-dien");

  // Thông tin tiếp nhận
  const [ngayTiepNhan, setNgayTiepNhan] = useState(banGhi ? sangISO(banGhi.ngayNhan) : homNayISO());
  const [ngayDauBuuDien, setNgayDauBuuDien] = useState("");
  /** Mốc thời hiệu của đơn nộp qua kênh điện tử — vai trò đúng như dấu bưu điện
   *  của đơn giấy, nhưng là ngày hệ thống ghi nhận bên gửi bấm gửi. */
  const [ngayGui, setNgayGui] = useState("");
  const [maBuuDien, setMaBuuDien] = useState("");
  const [maBiThu, setMaBiThu] = useState("");
  const [canBoTiepNhan, setCanBoTiepNhan] = useState(canBoDangNhap);
  const [soDen, setSoDen] = useState(banGhi?.soDen ?? "");
  /** Văn bản đã được hệ Văn bản điều hành cấp số → điền sẵn, không cho sửa tay. */
  const soDenTuDong = !!(banGhi?.soDen ?? "").trim();

  // Người gửi
  const [nguoiGuiLa, setNguoiGuiLa] = useState<"ca-nhan" | "to-chuc">("ca-nhan");
  const [tenNguoiGui, setTenNguoiGui] = useState(banGhi?.nguoiGui ?? "");
  const [nguoiDaiDien, setNguoiDaiDien] = useState("");
  const [dienThoai, setDienThoai] = useState("");
  const [quocGia, setQuocGia] = useState("Việt Nam");
  // noiGui trong danh sách là chuỗi "Phường X, TP Hà Nội" — tách ra để điền lại
  // đúng hai ô Tỉnh/Xã; phần nào không khớp danh mục thì bỏ trống để cán bộ chọn.
  const [tinh, setTinh] = useState(() => {
    const phan = (banGhi?.noiGui ?? "").split(",").map(s => s.trim());
    return TINH_THANH.find(t => phan.some(p => t.endsWith(p.replace(/^(TP|Tỉnh)\s+/, "")))) ?? "";
  });
  const [xa, setXa] = useState(() => {
    const phan = (banGhi?.noiGui ?? "").split(",").map(s => s.trim());
    return Object.values(PHUONG_XA).flat().find(x => phan.includes(x)) ?? "";
  });
  const [diaChiChiTiet, setDiaChiChiTiet] = useState("");

  // Nội dung
  const [loaiVanBan, setLoaiVanBan] = useState(banGhi?.loaiVanBan ?? LOAI_VAN_BAN[0]);
  const [trichYeu, setTrichYeu] = useState(banGhi?.trichYeu ?? "");
  /** Đường đi của đơn suy thẳng từ Loại văn bản, không hỏi lại thành một ô riêng:
   *  chọn "Đơn đề nghị GĐT/TT" đã là câu trả lời rồi. Hỏi hai lần cùng một chuyện
   *  chỉ tạo cơ hội cho hai câu trả lời mâu thuẫn. */
  const laGDTTT = MAC_DINH_GDT_TT(loaiVanBan);

  // Tài liệu
  const [tep, setTep] = useState<Record<NhomTep, TepDinhKem[]>>({ don: [], banAn: [], khac: [] });
  const [nhomDangXem, setNhomDangXem] = useState<NhomTep>("don");
  /** Thu gọn khung tài liệu để biểu mẫu chiếm hết bề ngang — cùng cơ chế với
   *  màn Danh sách đơn, vì lúc gõ liệu thì khung xem tài liệu chỉ chiếm chỗ. */
  const [hienTaiLieu, setHienTaiLieu] = useState(true);
  const soTepTong = tep.don.length + tep.banAn.length + tep.khac.length;

  // Số đơn đã lưu trong cùng một bì thư — hiện thành dải nhắc, vì đây là lý do
  // duy nhất để dùng nút "Lưu & thêm cùng bì".
  const [soDonCungBi, setSoDonCungBi] = useState(0);
  const [thongBao, setThongBao] = useState("");
  /** Đơn vừa lưu có vào luồng GĐT/TT không — quyết định có hiện lối tắt sang
   *  Danh sách đơn GĐT/TT trên dải thông báo hay không. */
  const [daLuuVaoGDT, setDaLuuVaoGDT] = useState(false);

  /** Mở một bản ghi đã có nghĩa là XEM CHI TIẾT — không có quyền sửa. Loại văn
   *  bản và Đơn vị xử lý sửa ở màn danh sách; ở đây chỉ đọc. */
  const chiXem = !!banGhi;

  const quaBuuDien = hinhThuc === "buu-dien";
  /** Đơn chuyển bằng đường công văn giấy — bưu điện hoặc nội bộ — đều đến kèm
   *  dấu bưu điện, nên cùng hỏi một mốc ngày. Riêng mã bì thư / mã bưu điện thì
   *  chỉ đơn qua bưu điện mới có. */
  const coDauBuuDien = hinhThuc === "buu-dien" || hinhThuc === "noi-bo";
  const quaDienTu = hinhThuc === "dien-tu";
  const trongNuoc = quocGia === "Việt Nam";
  const dsXa = PHUONG_XA[tinh] ?? [];

  // Điều kiện lưu — liệt kê được, để nút không bao giờ "im lặng vô hiệu hóa".
  const conThieu = useMemo(() => {
    const t: string[] = [];
    if (!ngayTiepNhan) t.push("Ngày tiếp nhận");
    if (!canBoTiepNhan) t.push("Cán bộ tiếp nhận");
    if (quaBuuDien && !ngayDauBuuDien) t.push("Ngày trên dấu bưu điện");
    if (quaDienTu && !ngayGui) t.push("Ngày gửi");
    if (quaBuuDien && !maBiThu.trim()) t.push("Mã bì thư");
    if (!tenNguoiGui.trim()) t.push(nguoiGuiLa === "ca-nhan" ? "Tên người gửi" : "Tên cơ quan/tổ chức");
    if (trongNuoc && !tinh) t.push("Tỉnh/Thành");
    if (!trichYeu.trim()) t.push("Trích yếu");
    // Sửa bản ghi đã có thì tệp đơn đã nộp từ trước, không bắt tải lại.
    if (!banGhi && tep.don.length === 0) t.push("Tệp đơn");
    return t;
  }, [ngayTiepNhan, canBoTiepNhan, quaBuuDien, ngayDauBuuDien, quaDienTu, ngayGui,
      maBiThu, tenNguoiGui, nguoiGuiLa, trongNuoc, tinh, trichYeu, tep.don.length, banGhi]);

  const luuDuoc = conThieu.length === 0;

  const datLai = (giuBiThu: boolean) => {
    if (!giuBiThu) {
      setMaBiThu(""); setMaBuuDien(""); setNgayDauBuuDien(""); setSoDonCungBi(0);
    }
    setTenNguoiGui(""); setNguoiDaiDien(""); setDienThoai("");
    setTinh(""); setXa(""); setDiaChiChiTiet(""); setQuocGia("Việt Nam");
    setTrichYeu(""); setSoDen(""); setNgayGui("");
    setTep({ don: [], banAn: [], khac: [] });
  };

  const luu = (che: "dong" | "moi" | "cung-bi") => {
    if (!luuDuoc) return;
    // Nói rõ đơn vừa đi đâu — cờ GĐT/TT là thứ quyết định, nên nhắc lại lúc lưu.
    const dich = laGDTTT ? " Đơn đã vào Danh sách đơn GĐT/TT." : " Đơn đã vào sổ văn bản đến.";
    setDaLuuVaoGDT(laGDTTT);

    // Mọi văn thư đều vào danh sách tiếp nhận, kể cả loại không phải GĐT/TT.
    onDaLuu?.({
      nguoiGui: tenNguoiGui.trim(),
      tinh: trongNuoc ? tinh : quocGia,
      trichYeu: trichYeu.trim(),
      loaiVanBan,
      hinhThucNhan: HINH_THUC.find(h => h.ma === hinhThuc)?.nhan ?? "",
      ngayTiepNhan,
      laGDTTT,
      soDen: soDen.trim(),
    });

    if (laGDTTT) {
      onLuuDonGDT?.({
        nguoiGui: tenNguoiGui.trim(),
        // Ghép địa chỉ theo thứ tự đọc quen: chi tiết → xã → tỉnh.
        diaChi: [diaChiChiTiet.trim(), xa, tinh].filter(Boolean).join(", ")
          || (trongNuoc ? "" : quocGia),
        trichYeu: trichYeu.trim(),
        loaiVanBan,
        ngayTiepNhan,
        canBoTiepNhan,
        hinhThucTiepNhan: HINH_THUC.find(h => h.ma === hinhThuc)?.nhan ?? "",
      });
    }

    if (che === "cung-bi") {
      setSoDonCungBi(n => n + 1);
      datLai(true);
      setThongBao(`Đã lưu đơn.${dich} Tiếp tục nhập đơn kế tiếp trong bì ${maBiThu || "—"}.`);
    } else if (che === "moi") {
      datLai(false);
      setThongBao(`Đã lưu đơn.${dich} Biểu mẫu đã sẵn sàng cho bì thư mới.`);
    } else {
      setThongBao(`Đã lưu đơn tiếp nhận.${dich}`);
    }
    window.setTimeout(() => setThongBao(""), 8000);
  };

  const tepDangXem = tep[nhomDangXem];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#eef1f5]">
      {/* ══ Thanh tiêu đề màn chi tiết ══
          Nút quay lại phải ở ĐẦU màn. Trước đây chỉ có ở thanh đáy, mà biểu mẫu
          này dài hơn một màn hình — mở ra là mất luôn đường về, phải cuộn hết
          xuống mới thấy. Kèm tên bản ghi để biết mình đang đứng ở đâu. */}
      {onHuy && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-[#d8dee6] flex-shrink-0">
          <button type="button" onClick={onHuy}
            className="flex items-center gap-1.5 h-[30px] px-3 border border-[#ccc] rounded-[3px] bg-white hover:bg-[#f5f5f5] text-[13px] font-medium text-[#333] transition-colors flex-shrink-0">
            <ArrowLeft size={14} /> Quay lại danh sách
          </button>
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-[#1d2e4f] leading-tight flex items-center gap-2">
              {banGhi ? "Chi tiết văn thư đến" : "Tiếp nhận đơn mới"}
              {chiXem && (
                <span className="px-1.5 py-[1px] rounded text-[10px] font-semibold bg-[#eef1f5] text-[#64748b] border border-[#d8dee6]">
                  Chỉ xem
                </span>
              )}
            </div>
            {banGhi && (
              <div className="text-[11px] text-[#8a94a6] truncate">
                Nhận {banGhi.ngayNhan} · {banGhi.trichYeu}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dải trạng thái bì thư — chỉ hiện khi đang nhập nhiều đơn cùng một bì */}
      {soDonCungBi > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#fff8e6] border-b border-[#f0d9a0] text-[12px] text-[#7a5b00] flex-shrink-0">
          <Mail size={13} className="flex-shrink-0" />
          Đang nhập tiếp trong bì thư <b className="font-semibold">{maBiThu || "—"}</b>
          — đã lưu <b className="font-semibold">{soDonCungBi}</b> đơn.
          <button type="button" onClick={() => { datLai(false); setThongBao(""); }}
            className="ml-auto text-[#8b1a1a] hover:underline font-medium">
            Kết thúc bì này
          </button>
        </div>
      )}

      {thongBao && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#eaf7ee] border-b border-[#a9debb] text-[12px] text-[#1a7a45] flex-shrink-0">
          <Check size={14} className="flex-shrink-0" />
          <span className="flex-1">{thongBao}</span>
          {/* Lối tắt sang đúng nơi đơn vừa tới — đỡ phải tự đi tìm trong menu */}
          {daLuuVaoGDT && onMoDanhSachGDT && (
            <button type="button" onClick={onMoDanhSachGDT}
              className="flex-shrink-0 font-semibold text-[#1a5a96] hover:underline">
              Mở Danh sách đơn GĐT/TT →
            </button>
          )}
          <button type="button" onClick={() => setThongBao("")} className="text-[#1a7a45] hover:text-[#0d5c31] px-1">×</button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* ══ TRÁI: biểu mẫu ══ */}
        <div className={`${hienTaiLieu ? "w-[58%]" : "w-full"} min-w-[540px] overflow-y-auto bg-[#eef1f5] transition-all`}>
          {/* Mở một bản ghi đã có = XEM CHI TIẾT, không có quyền sửa. Dùng
              <fieldset disabled> thay vì rải `disabled` lên từng ô: trình duyệt
              tự khoá mọi input/select/textarea bên trong, thêm ô mới sau này
              cũng tự động bị khoá — không sót ô nào. */}
          <fieldset disabled={chiXem} className="p-3 space-y-3 min-w-0">

            {/* Hình thức tiếp nhận — dải nút, vì nó quyết định các ô bên dưới */}
            <Khoi icon={<Mail size={15} />} tieuDe="Hình thức tiếp nhận">
              <div className="grid grid-cols-3 gap-2">
                {HINH_THUC.map(h => {
                  const chon = hinhThuc === h.ma;
                  return (
                    <button key={h.ma} type="button" onClick={() => setHinhThuc(h.ma)}
                      aria-pressed={chon}
                      className={`flex items-center justify-center gap-1.5 h-[34px] rounded-[3px] text-[13px] font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]
                        ${chon
                          ? "bg-[#fdeaea] border-[#8b1a1a] text-[#8b1a1a]"
                          : "bg-white border-[#ccc] text-[#555] hover:border-[#999]"}`}>
                      {h.icon}{h.nhan}
                    </button>
                  );
                })}
              </div>
            </Khoi>

            {/* Thông tin tiếp nhận / bì thư */}
            <Khoi
              icon={<Truck size={15} />}
              tieuDe={quaBuuDien ? "Thông tin bì thư" : "Thông tin tiếp nhận"}
              moTa={quaBuuDien ? "Một bì thư có thể chứa nhiều đơn" : undefined}
            >
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <div>
                  <Lbl req>Ngày tiếp nhận</Lbl>
                  <Inp type="date" value={ngayTiepNhan} onChange={e => setNgayTiepNhan(e.target.value)} />
                </div>
                <div>
                  <Lbl req>Cán bộ tiếp nhận</Lbl>
                  <Sel value={canBoTiepNhan} onChange={e => setCanBoTiepNhan(e.target.value)}>
                    {CAN_BO_TIEP_NHAN.map(c => <option key={c}>{c}</option>)}
                  </Sel>
                </div>
                <div>
                  {/* Chỉ MỘT ô "Số đến" trên toàn biểu mẫu.
                      Số đến do hệ Văn bản điều hành cấp, không phải cán bộ tự đặt.
                      Đã có số thì điền sẵn và khóa lại — gõ đè lên sẽ làm số trên
                      sổ văn bản đến và số trong hồ sơ lệch nhau. */}
                  <Lbl>Số đến (Văn bản điều hành)</Lbl>
                  <Inp value={soDen} onChange={e => setSoDen(e.target.value)}
                    readOnly={soDenTuDong}
                    className={soDenTuDong ? "bg-[#f5f7fa] text-[#1a5a96] font-semibold cursor-default" : ""}
                    placeholder="Chưa có số" />
                  {/* Chỉ chú thích khi CÓ số — lúc đó mới cần giải thích vì sao ô
                      bị khóa. Chưa có số thì ô trống đã tự nói hết, thêm chữ chỉ
                      làm hàng ô cao lệch nhau. */}
                  {soDenTuDong && (
                    <p className="text-[11px] mt-1 leading-snug flex items-center gap-1 text-[#1a7a45]">
                      <Check size={11} className="flex-shrink-0" /> Tự động lấy từ Văn bản điều hành
                    </p>
                  )}
                </div>

                {/* Bưu điện và Nội bộ cùng đến bằng công văn giấy nên cùng hỏi
                    ngày trên dấu bưu điện; đơn điện tử không có dấu, mốc tương
                    đương là ngày bên gửi bấm gửi. */}
                {coDauBuuDien && (
                  <div>
                    <Lbl req={quaBuuDien}>Ngày trên dấu bưu điện</Lbl>
                    <Inp type="date" value={ngayDauBuuDien} onChange={e => setNgayDauBuuDien(e.target.value)} />
                    {/* Dấu bưu điện là mốc tính thời hiệu, không phải ngày cán bộ mở bì */}
                    <p className="text-[11px] text-[#94a3b8] mt-1 leading-snug">Mốc tính thời hiệu đề nghị.</p>
                  </div>
                )}

                {quaDienTu && (
                  <div>
                    <Lbl req>Ngày gửi</Lbl>
                    <Inp type="date" value={ngayGui} onChange={e => setNgayGui(e.target.value)} />
                    <p className="text-[11px] text-[#94a3b8] mt-1 leading-snug">
                      Ngày bên gửi nộp trên hệ thống — mốc tính thời hiệu đề nghị.
                    </p>
                  </div>
                )}

                {quaBuuDien && (
                  <>
                    <div>
                      <Lbl req>Mã bì thư</Lbl>
                      <Inp value={maBiThu} onChange={e => setMaBiThu(e.target.value)} placeholder="VD: 0429/2024" />
                    </div>
                    <div>
                      <Lbl>Mã bưu điện</Lbl>
                      <Inp value={maBuuDien} onChange={e => setMaBuuDien(e.target.value)} placeholder="Nhập mã bưu điện…" />
                    </div>
                  </>
                )}
              </div>
            </Khoi>

            {/* Người gửi */}
            <Khoi icon={nguoiGuiLa === "ca-nhan" ? <User size={15} /> : <Building2 size={15} />} tieuDe="Người gửi đơn">
              <div className="flex items-center gap-5 mb-3">
                {([["ca-nhan", "Cá nhân"], ["to-chuc", "Cơ quan / tổ chức"]] as const).map(([ma, nhan]) => (
                  <label key={ma} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                    <input type="radio" name="nguoiGuiLa" className="accent-[#8b1a1a]"
                      checked={nguoiGuiLa === ma} onChange={() => setNguoiGuiLa(ma)} />
                    {nhan}
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <div className={nguoiGuiLa === "to-chuc" ? "col-span-1" : "col-span-2"}>
                  <Lbl req>{nguoiGuiLa === "ca-nhan" ? "Họ và tên người gửi" : "Tên cơ quan / tổ chức"}</Lbl>
                  <Inp value={tenNguoiGui} onChange={e => setTenNguoiGui(e.target.value)}
                    placeholder={nguoiGuiLa === "ca-nhan" ? "Nguyễn Văn A" : "Công ty TNHH…"} />
                </div>
                {nguoiGuiLa === "to-chuc" && (
                  <div>
                    <Lbl>Người đại diện</Lbl>
                    <Inp value={nguoiDaiDien} onChange={e => setNguoiDaiDien(e.target.value)} placeholder="Họ và tên…" />
                  </div>
                )}
                <div>
                  <Lbl>Số điện thoại</Lbl>
                  <Inp value={dienThoai} onChange={e => setDienThoai(e.target.value)} placeholder="09xx…" inputMode="tel" />
                </div>

                <div>
                  <Lbl>Quốc gia</Lbl>
                  <Sel value={quocGia} onChange={e => { setQuocGia(e.target.value); setTinh(""); setXa(""); }}>
                    {QUOC_GIA.map(q => <option key={q}>{q}</option>)}
                  </Sel>
                </div>

                {/* Địa chỉ 2 cấp cho trong nước; ngoài nước thì một ô tự do —
                    danh mục phường/xã Việt Nam không dùng được cho địa chỉ nước ngoài. */}
                {trongNuoc ? (
                  <>
                    <div>
                      <Lbl req>Tỉnh / Thành phố</Lbl>
                      <Sel value={tinh} onChange={e => { setTinh(e.target.value); setXa(""); }}>
                        <option value="">-- Chọn tỉnh/thành --</option>
                        {TINH_THANH.map(t => <option key={t}>{t}</option>)}
                      </Sel>
                    </div>
                    <div>
                      <Lbl>Phường / Xã</Lbl>
                      <Sel value={xa} onChange={e => setXa(e.target.value)} disabled={!tinh}>
                        <option value="">{tinh ? "-- Chọn phường/xã --" : "Chọn tỉnh trước"}</option>
                        {dsXa.map(x => <option key={x}>{x}</option>)}
                      </Sel>
                      {tinh && dsXa.length === 0 && (
                        <p className="text-[11px] text-[#94a3b8] mt-1 leading-snug">
                          Chưa có danh mục xã cho tỉnh này — ghi vào ô địa chỉ chi tiết.
                        </p>
                      )}
                    </div>
                    <div className="col-span-3">
                      <Lbl>Địa chỉ chi tiết</Lbl>
                      <Inp value={diaChiChiTiet} onChange={e => setDiaChiChiTiet(e.target.value)}
                        placeholder="Số nhà, tên đường, thôn/tổ dân phố…" />
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <Lbl>Địa chỉ</Lbl>
                    <Inp value={diaChiChiTiet} onChange={e => setDiaChiChiTiet(e.target.value)}
                      placeholder="Địa chỉ đầy đủ ở nước ngoài…" />
                  </div>
                )}
              </div>
            </Khoi>

            {/* Nội dung & phân loại */}
            <Khoi icon={<FileText size={15} />} tieuDe="Nội dung & phân loại">
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <div>
                  <Lbl req>Loại văn bản</Lbl>
                  <Sel value={loaiVanBan} onChange={e => setLoaiVanBan(e.target.value)}>
                    {LOAI_VAN_BAN.map(l => <option key={l}>{l}</option>)}
                  </Sel>
                </div>

                {/* Đã bỏ dải thông báo "Đơn sẽ vào Danh sách đơn GĐT/TT…": Loại văn
                    bản đã nói rõ, thêm một dải nữa chỉ là nhắc lại. Luồng đi của đơn
                    vẫn suy từ `laGDTTT` như cũ, chỉ không in ra màn hình nữa. */}
                <div className="col-span-3">
                  <Lbl req>Trích yếu / Nội dung</Lbl>
                  <textarea value={trichYeu} onChange={e => setTrichYeu(e.target.value)} rows={3}
                    placeholder="Tóm tắt nội dung đơn — đây là dòng cán bộ khác đọc để nhận ra đơn này."
                    className="w-full px-2 py-1.5 text-[13px] border border-[#ccc] rounded-[3px] bg-white resize-y focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20" />
                </div>
              </div>
            </Khoi>

            {/* Tài liệu */}
            <Khoi icon={<Paperclip size={15} />} tieuDe="Tài liệu đính kèm"
              moTa="PDF, JPG, PNG, TIF">
              <div className="space-y-2">
                {NHOM_TEP.map(n => (
                  <OTaiLieu key={n.ma}
                    nhan={n.nhan} moTa={n.moTa} batBuoc={n.batBuoc}
                    tep={tep[n.ma]}
                    dangXem={nhomDangXem === n.ma && tep[n.ma].length > 0}
                    onThem={ds => { setTep(p => ({ ...p, [n.ma]: [...p[n.ma], ...ds] })); setNhomDangXem(n.ma); }}
                    onXoa={i => setTep(p => ({ ...p, [n.ma]: p[n.ma].filter((_, k) => k !== i) }))}
                    onXem={() => setNhomDangXem(n.ma)}
                  />
                ))}
              </div>
            </Khoi>

            <div className="h-2" />
          </fieldset>
        </div>

        {/* ══ PHẢI: xem tài liệu ══
            Dùng đúng bộ màu và cơ chế thu gọn của khung tài liệu ở màn Danh sách
            đơn (nền #404040, thanh công cụ #323232, nút ▸ để ẩn, dải dọc "Tài liệu"
            để mở lại) — hai màn cùng một thao tác thì phải trông và bấm như nhau. */}
        {hienTaiLieu && (
        <div className="flex-1 min-w-[380px] flex flex-col bg-[#404040] border-l border-[#333]">
          <div className="bg-[#323232] flex items-center gap-1 px-2 border-b border-[#555] flex-shrink-0">
            <button type="button" onClick={() => setHienTaiLieu(false)} title="Ẩn tài liệu"
              className="text-white/60 hover:text-white transition-colors p-1 rounded flex-shrink-0">
              <ChevronRight size={15} />
            </button>
            {NHOM_TEP.map(n => (
              <button key={n.ma} type="button" onClick={() => setNhomDangXem(n.ma)}
                className={`px-3 py-2 text-[12px] font-medium border-b-2 -mb-px transition-colors
                  ${nhomDangXem === n.ma
                    ? "border-[#8b1a1a] text-white"
                    : "border-transparent text-white/60 hover:text-white"}`}>
                {n.nhan}
                {tep[n.ma].length > 0 && (
                  <span className="ml-1.5 text-[10px] font-semibold bg-white/20 text-white rounded-full px-1.5 py-0.5">
                    {tep[n.ma].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-[7px] bg-[#3a3a3a] border-b border-[#555] flex-shrink-0">
            {[<ZoomOut key="a" size={14} />, <ZoomIn key="b" size={14} />, <RotateCw key="c" size={14} />].map((ic, i) => (
              <button key={i} type="button" disabled={tepDangXem.length === 0}
                className="p-1 rounded text-white/60 hover:text-white disabled:opacity-30 transition-colors">
                {ic}
              </button>
            ))}
            <span className="text-white/70 text-[12px] flex-1 text-center truncate">
              {tepDangXem.length > 0 ? tepDangXem[0].ten : "Chưa có tệp"}
            </span>
            <span className="text-white/60 text-[12px] flex-shrink-0">
              {tepDangXem.length > 0 ? `1 / ${tepDangXem.length}` : "—"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {tepDangXem.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-white/40">
                <FileText size={38} strokeWidth={1.2} />
                <p className="text-[13px]">Chưa có tệp trong mục này</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tepDangXem.map((t, i) => (
                  <div key={`${t.ten}-${i}`} className="bg-white rounded-[3px] shadow-lg overflow-hidden">
                    <div className="px-3 py-1.5 bg-[#f5f5f5] border-b border-[#e0e0e0] flex items-center gap-2">
                      <FileText size={13} className="text-[#8b1a1a] flex-shrink-0" />
                      <span className="text-[12px] font-medium text-[#333] truncate flex-1">{t.ten}</span>
                      <span className="text-[11px] text-[#888] flex-shrink-0 tabular-nums">{coChu(t.kb)}</span>
                    </div>
                    <div className="h-[190px] flex flex-col items-center justify-center gap-1.5 text-[#b0b7c0] bg-[#fbfbfb]">
                      <FileText size={30} strokeWidth={1.2} />
                      <span className="text-[11px]">Bản xem trước hiển thị sau khi tải lên máy chủ</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Dải dọc mở lại khung tài liệu — giống hệt màn Danh sách đơn */}
        {!hienTaiLieu && (
          <div className="flex-shrink-0 border-l border-[#ccc] bg-[#f5f5f5] flex items-start pt-3">
            <button type="button" onClick={() => setHienTaiLieu(true)} title="Hiện tài liệu"
              className="flex flex-col items-center gap-1 px-2 py-2 text-[#555] hover:text-[#1d2e4f] hover:bg-[#e8edf5] rounded-[3px] transition-colors">
              <ChevronLeft size={15} />
              <span className="text-[10px] font-medium [writing-mode:vertical-rl] rotate-180">Tài liệu</span>
              {soTepTong > 0 && (
                <span className="text-[10px] font-semibold bg-[#8b1a1a] text-white rounded-full px-1.5 py-0.5">
                  {soTepTong}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ══ Thanh hành động dính đáy ══
          Chi tiết chỉ xem thì không có hành động lưu — thay bằng một dòng nói rõ
          sửa được ở đâu, để người dùng không đi tìm nút Lưu không tồn tại. */}
      {chiXem ? (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-t border-[#d8dee6] flex-shrink-0 text-[12px] text-[#64748b]">
          <Eye size={13} className="flex-shrink-0" />
          <span>
            Bản ghi ở chế độ chỉ xem. Đổi <b className="font-semibold text-[#334155]">Loại văn bản</b> và{" "}
            <b className="font-semibold text-[#334155]">Đơn vị xử lý</b> ngay trên màn danh sách.
          </span>
          <button type="button" onClick={onHuy}
            className="ml-auto h-[30px] px-4 rounded-[3px] border border-[#ccc] bg-white hover:bg-[#f5f5f5] text-[13px] font-medium text-[#333] transition-colors">
            Quay lại danh sách
          </button>
        </div>
      ) : (
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-white border-t border-[#d8dee6] flex-shrink-0">
        {/* Nút mờ mà không nói vì sao là lỗi hay gặp nhất ở biểu mẫu dài */}
        <div className="min-w-0 flex-1">
          {luuDuoc ? (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1a7a45]">
              <Check size={13} /> Đã đủ thông tin bắt buộc
            </span>
          ) : (
            <span className="inline-flex items-start gap-1.5 text-[12px] text-[#b45309]">
              <AlertCircle size={13} className="flex-shrink-0 mt-[1px]" />
              <span>Còn thiếu: <b className="font-semibold">{conThieu.join(" · ")}</b></span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Nút quay lại nằm ở thanh tiêu đề đầu màn, không lặp lại ở đây —
              vùng này chỉ dành cho hành động lưu. */}
          <>
              <button type="button" disabled={!luuDuoc} onClick={() => luu("dong")}
                className={`h-[32px] px-4 border rounded-[3px] text-[13px] font-medium transition-colors
                  ${luuDuoc ? "border-[#8b1a1a] text-[#8b1a1a] bg-white hover:bg-[#fcf5f5]" : "border-[#ddd] text-[#aaa] bg-[#f7f7f7] cursor-not-allowed"}`}>
                Lưu
              </button>
              {/* Chỉ có nghĩa khi nhận qua bưu điện — một bì mới chứa được nhiều đơn */}
              {quaBuuDien && (
                <button type="button" disabled={!luuDuoc} onClick={() => luu("cung-bi")}
                  className={`h-[32px] px-4 border rounded-[3px] text-[13px] font-medium transition-colors
                    ${luuDuoc ? "border-[#8b1a1a] text-[#8b1a1a] bg-white hover:bg-[#fcf5f5]" : "border-[#ddd] text-[#aaa] bg-[#f7f7f7] cursor-not-allowed"}`}>
                  Lưu &amp; thêm cùng bì
                </button>
              )}
              <button type="button" disabled={!luuDuoc} onClick={() => luu("moi")}
                className={`h-[32px] px-4 rounded-[3px] text-[13px] font-medium text-white transition-colors
                  ${luuDuoc ? "bg-[#8b1a1a] hover:bg-[#6e1414]" : "bg-[#d9c4c4] cursor-not-allowed"}`}>
                Lưu &amp; thêm mới
              </button>
          </>
        </div>
      </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DANH SÁCH VĂN THƯ ĐẾN — màn mặc định khi vào "Tiếp nhận đơn"
// ═════════════════════════════════════════════════════════════════════════════

/** Trạng thái của văn bản đến ở khâu văn thư chỉ còn một trục: đã chuyển cho
 *  đơn vị xử lý hay chưa. Việc cấp số đến không theo dõi ở màn này. */
type TrangThaiVT = "Chờ chuyển xử lý" | "Đã chuyển xử lý";

type VanThuDen = {
  id: number;
  soDen: string;
  ngayNhan: string;       // dd/mm/yyyy
  trichYeu: string;
  nguoiGui: string;
  noiGui: string;
  loaiVanBan: string;
  hinhThucNhan: string;
  donViXuLy: string;
  /** Người dùng đã tự chọn Đơn vị xử lý ⇒ từ đó đổi Loại văn bản KHÔNG ghi đè
   *  nữa. Không có cờ này thì hệ thống không phân biệt được "đang trùng giá trị
   *  mặc định" với "người dùng cố ý chọn đúng giá trị đó", và một thao tác thủ
   *  công sẽ bị nuốt mất trong im lặng. */
  donViXuLyTuSua?: boolean;
  trangThai: TrangThaiVT;
  laGDTTT: boolean;
};

/** Màu theo LOẠI văn bản — dùng lại đúng dải màu của các màn khác để một loại
 *  luôn cùng một màu ở mọi nơi. */
const MAU_LOAI: Record<string, string> = {
  "Đơn đề nghị GĐT/TT": "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]",
  "Đơn khiếu nại tố cáo trong tố tụng": "bg-[#fff7ed] text-[#b45309] border-[#fcd48a]",
  "Thông báo phát hiện vi phạm pháp luật": "bg-[#f0fdf4] text-[#1a7a45] border-[#a9debb]",
  "Đơn khác": "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
  "CV kiến nghị GĐT/TT": "bg-[#eef4ff] text-[#3b52a4] border-[#c7d3f5]",
  "CV chuyển đơn": "bg-[#eef4ff] text-[#3b52a4] border-[#c7d3f5]",
  "CV chuyển kiến nghị GĐT/TT": "bg-[#eef4ff] text-[#3b52a4] border-[#c7d3f5]",
  "Công văn khác": "bg-[#f5f5f5] text-[#555] border-[#ddd]",
  "Hồ sơ kháng nghị": "bg-[#f3e8ff] text-[#6d28d9] border-[#d8b4fe]",
  "Tài liệu chứng cứ": "bg-[#ecfeff] text-[#0e7490] border-[#a5e8f0]",
};

const MAU_TRANG_THAI: Record<TrangThaiVT, string> = {
  "Chờ chuyển xử lý": "bg-[#fff7ed] text-[#b45309] border-[#fcd48a]",
  "Đã chuyển xử lý": "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]",
};

const VAN_THU_MAU: VanThuDen[] = [
  { id: 1, soDen: "", ngayNhan: "10/08/2026", trichYeu: "Đơn đề nghị xét lại bản án hình sự sơ thẩm số 15/2023/HS-ST", nguoiGui: "Nguyễn Văn An", noiGui: "Phường Cửa Nam, TP Hà Nội", loaiVanBan: "Đơn đề nghị GĐT/TT", hinhThucNhan: "Điện tử", donViXuLy: "Phòng GĐKT, TT & THA", trangThai: "Chờ chuyển xử lý", laGDTTT: true },
  { id: 2, soDen: "", ngayNhan: "10/08/2026", trichYeu: "Đơn khiếu nại về việc chậm trả kết quả giải quyết", nguoiGui: "Trần Minh Tâm", noiGui: "Phường Hà Đông, TP Hà Nội", loaiVanBan: "Đơn khiếu nại tố cáo trong tố tụng", hinhThucNhan: "Bưu điện", donViXuLy: "Văn phòng", trangThai: "Chờ chuyển xử lý", laGDTTT: false },
  { id: 3, soDen: "", ngayNhan: "09/08/2026", trichYeu: "Đơn đề nghị xem xét lại bản án dân sự tranh chấp đất đai", nguoiGui: "Phạm Minh Hoàng", noiGui: "Xã Đông Anh, TP Hà Nội", loaiVanBan: "Đơn đề nghị GĐT/TT", hinhThucNhan: "Bưu điện", donViXuLy: "Phòng GĐKT, TT & THA", trangThai: "Chờ chuyển xử lý", laGDTTT: true },
  { id: 4, soDen: "", ngayNhan: "09/08/2026", trichYeu: "Thông báo phát hiện vi phạm pháp luật trong tố tụng dân sự", nguoiGui: "VKSND TP Hà Nội", noiGui: "Phường Hoàn Kiếm, TP Hà Nội", loaiVanBan: "Thông báo phát hiện vi phạm pháp luật", hinhThucNhan: "Nội bộ", donViXuLy: "Văn phòng", trangThai: "Chờ chuyển xử lý", laGDTTT: false },
  { id: 5, soDen: "123/2026", ngayNhan: "08/08/2026", trichYeu: "Công văn kiến nghị xử lý vi phạm trong thi hành án", nguoiGui: "Công ty TNHH Minh Đức", noiGui: "Phường Cầu Giấy, TP Hà Nội", loaiVanBan: "Công văn khác", hinhThucNhan: "Điện tử", donViXuLy: "Văn phòng", trangThai: "Chờ chuyển xử lý", laGDTTT: false },
  { id: 6, soDen: "124/2026", ngayNhan: "08/08/2026", trichYeu: "Đơn đề nghị giám đốc thẩm bản án kinh doanh thương mại", nguoiGui: "Ngân hàng Thương mại ABC", noiGui: "Phường Hoàn Kiếm, TP Hà Nội", loaiVanBan: "Đơn đề nghị GĐT/TT", hinhThucNhan: "Bưu điện", donViXuLy: "Phòng GĐKT, TT & THA", trangThai: "Đã chuyển xử lý", laGDTTT: true },
  // Đơn khác nhưng đã được văn thư chuyển tay sang Phòng TCCB — mẫu cho trạng
  // thái "đã sửa tay": đổi Loại văn bản sau đó cũng không kéo về Văn phòng nữa.
  { id: 7, soDen: "125/2026", ngayNhan: "07/08/2026", trichYeu: "Đơn phản ánh thái độ tiếp công dân của cán bộ", nguoiGui: "Lê Hoàng Nam", noiGui: "Phường Thanh Xuân, TP Hà Nội", loaiVanBan: "Đơn khác", hinhThucNhan: "Bưu điện", donViXuLy: "Phòng Tổ chức cán bộ", donViXuLyTuSua: true, trangThai: "Chờ chuyển xử lý", laGDTTT: false },
  { id: 8, soDen: "126/2026", ngayNhan: "07/08/2026", trichYeu: "Đơn đề nghị tái thẩm vụ án lao động", nguoiGui: "Trương Quang Sáng", noiGui: "Xã Quang Minh, TP Hà Nội", loaiVanBan: "Đơn đề nghị GĐT/TT", hinhThucNhan: "Bưu điện", donViXuLy: "Phòng GĐKT, TT & THA", trangThai: "Đã chuyển xử lý", laGDTTT: true },
  // Ba loại mới mở cho văn thư: công văn kiến nghị, công văn chuyển đơn, hồ sơ
  // kháng nghị — trước đây không có trong danh mục nên không vào sổ được.
  { id: 9, soDen: "", ngayNhan: "06/08/2026", trichYeu: "Công văn kiến nghị giám đốc thẩm bản án hành chính số 21/2024/HC-PT", nguoiGui: "VKSND Cấp cao tại Hà Nội", noiGui: "Phường Ba Đình, TP Hà Nội", loaiVanBan: "CV kiến nghị GĐT/TT", hinhThucNhan: "Nội bộ", donViXuLy: "Phòng GĐKT, TT & THA", trangThai: "Chờ chuyển xử lý", laGDTTT: true },
  { id: 10, soDen: "", ngayNhan: "06/08/2026", trichYeu: "Công văn chuyển đơn đề nghị giám đốc thẩm của bà Nguyễn Thị Thu", nguoiGui: "Ban Dân nguyện Quốc hội", noiGui: "Phường Ba Đình, TP Hà Nội", loaiVanBan: "CV chuyển đơn", hinhThucNhan: "Nội bộ", donViXuLy: "Phòng GĐKT, TT & THA", trangThai: "Chờ chuyển xử lý", laGDTTT: true },
  { id: 11, soDen: "127/2026", ngayNhan: "05/08/2026", trichYeu: "Hồ sơ kháng nghị giám đốc thẩm kèm Quyết định kháng nghị QĐKN-2026/31", nguoiGui: "TAND Cấp cao tại Hà Nội", noiGui: "Phường Cầu Giấy, TP Hà Nội", loaiVanBan: "Hồ sơ kháng nghị", hinhThucNhan: "Nội bộ", donViXuLy: "Phòng GĐKT, TT & THA", trangThai: "Đã chuyển xử lý", laGDTTT: true },
];

const Chip = ({ children, mau }: { children: React.ReactNode; mau: string }) => (
  <span className={`inline-block px-1.5 py-[2px] rounded text-[11px] font-medium border whitespace-nowrap ${mau}`}>
    {children}
  </span>
);

/** Các đơn vị trong TAND thành phố Hà Nội. Định tuyến đi HAI CHẶNG: văn thư chỉ
 *  chuyển tới đầu mối, việc chia tiếp về tòa chuyên trách là khâu sau — lúc đó
 *  mới đọc hồ sơ và biết loại án. Vì vậy 6 tòa chuyên trách để `nhanTiepNhan:
 *  false`: bắt văn thư chọn tòa ở đây là bắt họ đoán loại án khi chưa đọc đơn. */
const DON_VI: { ten: string; nhom: "dau-moi" | "toa-chuyen-trach"; nhanTiepNhan: boolean }[] = [
  { ten: "Phòng GĐKT, TT & THA", nhom: "dau-moi", nhanTiepNhan: true },
  { ten: "Văn phòng", nhom: "dau-moi", nhanTiepNhan: true },
  { ten: "Phòng Tổ chức cán bộ", nhom: "dau-moi", nhanTiepNhan: true },
  { ten: "Tòa Hình sự", nhom: "toa-chuyen-trach", nhanTiepNhan: false },
  { ten: "Tòa Dân sự", nhom: "toa-chuyen-trach", nhanTiepNhan: false },
  { ten: "Tòa Hành chính", nhom: "toa-chuyen-trach", nhanTiepNhan: false },
  { ten: "Tòa Kinh tế", nhom: "toa-chuyen-trach", nhanTiepNhan: false },
  { ten: "Tòa Lao động", nhom: "toa-chuyen-trach", nhanTiepNhan: false },
  { ten: "Tòa Gia đình và người chưa thành niên", nhom: "toa-chuyen-trach", nhanTiepNhan: false },
];

/** Ô chọn của văn thư chỉ liệt kê đơn vị nhận tiếp nhận. */
const DON_VI_XU_LY = DON_VI.filter(d => d.nhanTiepNhan).map(d => d.ten);

/** Đơn vị xử lý ăn theo Loại văn bản. Sau khi chốt định tuyến hai chặng, ánh xạ
 *  10 loại → 2 đầu mối trùng khít với cờ luồng GĐT/TT, nên không cần bảng tra
 *  riêng: cùng MỘT nguồn sự thật vừa quyết định luồng đi vừa quyết định nơi nhận,
 *  hai thứ không thể lệch nhau. */
const donViMacDinh = (loaiVanBan: string) =>
  MAC_DINH_GDT_TT(loaiVanBan) ? "Phòng GĐKT, TT & THA" : "Văn phòng";

function DanhSachVanThu({ rows, onSua, onDoiLoai, onDoiDonVi, onGoiLaiMacDinh, onChuyenDon }: {
  rows: VanThuDen[];
  onSua: (r: VanThuDen) => void;
  onDoiLoai: (id: number, loai: string) => void;
  onDoiDonVi: (id: number, donVi: string) => void;
  /** Bỏ trạng thái "đã sửa tay", trả ô Đơn vị xử lý về ăn theo Loại văn bản. */
  onGoiLaiMacDinh: (id: number) => void;
  onChuyenDon: (ids: number[]) => void;
}) {
  // Hai trục lọc của bản tham khảo giữ nguyên ý nghĩa nhưng đổi hình thức:
  // trạng thái xử lý thành tab, loại văn bản thành dải chip. Bản gốc dùng 7 thẻ
  // to cho loại văn bản, ăn gần hết chiều cao màn trước khi thấy dòng dữ liệu nào.
  const [tab, setTab] = useState<"cho" | "xong" | "tatca">("cho");
  const [loai, setLoai] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  // ── Bộ lọc chi tiết ───────────────────────────────────────────────────────
  // Ô từ khoá ở trên quét chung 3 trường và không nói được "người gửi tên X"
  // khác "nơi gửi tên X". Khối này lọc theo từng trường, và cộng dồn với nhau
  // (AND) chứ không thay thế ô từ khoá.
  // Mặc định thu gọn: màn này là bàn làm việc hằng ngày của văn thư, mở sẵn 6 ô
  // lọc sẽ đẩy bảng dữ liệu xuống dưới nếp gấp — đúng lỗi mà dải chip loại văn
  // bản đã được thiết kế để tránh.
  const [moBoLoc, setMoBoLoc] = useState(false);
  const [fSoDen, setFSoDen] = useState("");
  const [fNguoiGui, setFNguoiGui] = useState("");
  const [fNoiGui, setFNoiGui] = useState("");
  const [fHinhThucNhan, setFHinhThucNhan] = useState("");
  const [fDonViXuLy, setFDonViXuLy] = useState("");
  const [fTuNgay, setFTuNgay] = useState("");
  const [fDenNgay, setFDenNgay] = useState("");

  const dieuKienPhu = [fSoDen, fNguoiGui, fNoiGui, fHinhThucNhan, fDonViXuLy, fTuNgay, fDenNgay];
  const soDieuKienPhu = dieuKienPhu.filter(Boolean).length;

  const xoaBoLocPhu = () => {
    setFSoDen(""); setFNguoiGui(""); setFNoiGui("");
    setFHinhThucNhan(""); setFDonViXuLy(""); setFTuNgay(""); setFDenNgay("");
  };
  /** Đơn đang tích để chuyển. Đơn đã chuyển rồi thì không tích lại được. */
  const [daChon, setDaChon] = useState<number[]>([]);
  const [hoiXacNhan, setHoiXacNhan] = useState(false);

  const theoTab = useMemo(() => rows.filter(r =>
    tab === "tatca" ? true
      : tab === "cho" ? r.trangThai !== "Đã chuyển xử lý"
        : r.trangThai === "Đã chuyển xử lý"), [rows, tab]);

  const dsLoai = useMemo(() => {
    const dem = new Map<string, number>();
    theoTab.forEach(r => dem.set(r.loaiVanBan, (dem.get(r.loaiVanBan) ?? 0) + 1));
    return [...dem.entries()].sort((a, b) => b[1] - a[1]);
  }, [theoTab]);

  /** Danh mục cho 2 ô chọn — rút từ chính dữ liệu đang xem, không phải danh mục
   *  cố định, nên mọi lựa chọn đều chắc chắn ra kết quả. */
  const dsHinhThucNhan = useMemo(
    () => [...new Set(theoTab.map(r => r.hinhThucNhan).filter(Boolean))].sort(), [theoTab]);
  const dsNoiGui = useMemo(
    () => [...new Set(theoTab.map(r => r.noiGui).filter(Boolean))].sort(), [theoTab]);
  const dsDonViXuLy = useMemo(
    () => [...new Set(theoTab.map(r => r.donViXuLy).filter(Boolean))].sort(), [theoTab]);

  const hienThi = useMemo(() => theoTab.filter(r => {
    if (loai && r.loaiVanBan !== loai) return false;

    // Bộ lọc chi tiết — cộng dồn với ô từ khoá, không thay thế.
    const chua = (v: string, k: string) => v.toLowerCase().includes(k.trim().toLowerCase());
    if (fSoDen && !chua(r.soDen, fSoDen)) return false;
    if (fNguoiGui && !chua(r.nguoiGui, fNguoiGui)) return false;
    if (fNoiGui && r.noiGui !== fNoiGui) return false;
    if (fHinhThucNhan && r.hinhThucNhan !== fHinhThucNhan) return false;
    if (fDonViXuLy && r.donViXuLy !== fDonViXuLy) return false;
    // Ngày lưu dạng dd/mm/yyyy, ô <input type="date"> trả yyyy-mm-dd → so ở dạng ISO.
    // KHÔNG dùng `sangISO` ở đây: hàm đó trả về ngày hôm nay khi không đọc được,
    // hợp cho ô nhập của form nhưng sai cho bộ lọc — một dòng hỏng ngày sẽ bị coi
    // như nhận hôm nay và lọt vào kết quả sai. Ở đây đọc chặt, không đọc được thì
    // dòng đó nằm ngoài mọi khoảng ngày.
    if (fTuNgay || fDenNgay) {
      const iso = ngayNhanISO(r.ngayNhan);
      if (!iso) return false;
      if (fTuNgay && iso < fTuNgay) return false;
      if (fDenNgay && iso > fDenNgay) return false;
    }

    if (!tuKhoa.trim()) return true;
    const k = tuKhoa.toLowerCase();
    return [r.trichYeu, r.nguoiGui, r.noiGui].some(v => v.toLowerCase().includes(k));
  }), [theoTab, loai, tuKhoa, fSoDen, fNguoiGui, fNoiGui, fHinhThucNhan, fDonViXuLy, fTuNgay, fDenNgay]);

  // ── Gợi ý cho ô tìm kiếm ──────────────────────────────────────────────────
  // Lấy thẳng từ danh sách ĐANG hiển thị (đã lọc theo tab + chip loại văn bản),
  // nên mọi gợi ý bấm vào đều chắc chắn ra kết quả — khác với một danh mục cố
  // định, gõ trúng giá trị không có trong tập đang xem thì ra bảng rỗng.
  const [moGoiY, setMoGoiY] = useState(false);
  const [viTriGoiY, setViTriGoiY] = useState(-1);

  const goiY = useMemo(() => {
    const nguon = theoTab.filter(r => !loai || r.loaiVanBan === loai);
    const k = tuKhoa.trim().toLowerCase();
    // Thứ tự trường theo đúng thứ tự trong placeholder, và giá trị ngắn đứng
    // trước để danh sách đọc được ngay chứ không phải một khối trích yếu dài.
    const truongs: { truong: string; lay: (r: VanThuDen) => string }[] = [
      { truong: "Người gửi", lay: r => r.nguoiGui },
      { truong: "Nơi gửi", lay: r => r.noiGui },
      { truong: "Trích yếu", lay: r => r.trichYeu },
    ];
    const daCo = new Set<string>();
    const ds: { truong: string; giaTri: string }[] = [];
    for (const { truong, lay } of truongs) {
      for (const r of nguon) {
        const giaTri = (lay(r) ?? "").trim();
        if (!giaTri) continue;
        if (k && !giaTri.toLowerCase().includes(k)) continue;
        const khoa = `${truong}|${giaTri.toLowerCase()}`;
        if (daCo.has(khoa)) continue;
        daCo.add(khoa);
        ds.push({ truong, giaTri });
      }
    }
    return ds.slice(0, 8);
  }, [theoTab, loai, tuKhoa]);

  const chonGoiY = (giaTri: string) => {
    setTuKhoa(giaTri);
    setMoGoiY(false);
    setViTriGoiY(-1);
  };

  const phimGoiY = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { setMoGoiY(false); setViTriGoiY(-1); return; }
    if (!goiY.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setMoGoiY(true);
      setViTriGoiY(i => {
        const buoc = e.key === "ArrowDown" ? 1 : -1;
        return (i + buoc + goiY.length) % goiY.length;
      });
      return;
    }
    if (e.key === "Enter" && moGoiY && viTriGoiY >= 0) {
      e.preventDefault();
      chonGoiY(goiY[viTriGoiY].giaTri);
    }
  };

  // Đơn đã chuyển thì không chuyển lại — loại khỏi cả "chọn tất cả".
  const coTheChuyen = useMemo(
    () => hienThi.filter(r => r.trangThai !== "Đã chuyển xử lý"), [hienThi]);
  const donSeChuyen = useMemo(
    () => rows.filter(r => daChon.includes(r.id)), [rows, daChon]);

  const TABS: { ma: "cho" | "xong" | "tatca"; nhan: string; dem: number }[] = [
    { ma: "cho", nhan: "Chờ xử lý", dem: rows.filter(r => r.trangThai !== "Đã chuyển xử lý").length },
    { ma: "xong", nhan: "Đã xử lý", dem: rows.filter(r => r.trangThai === "Đã chuyển xử lý").length },
    { ma: "tatca", nhan: "Tất cả", dem: rows.length },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#eef1f5]">
      {/* Tabs */}
      <div className="bg-white border-b border-[#ddd] flex items-end px-3 pt-2 gap-0 flex-shrink-0">
        {TABS.map(t => (
          <button key={t.ma} type="button" onClick={() => { setTab(t.ma); setLoai(""); }}
            className={`px-4 py-[7px] text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap
              ${tab === t.ma ? "border-[#8b1a1a] text-[#8b1a1a]" : "border-transparent text-[#555] hover:text-[#222]"}`}>
            {t.nhan}
            <span className={`ml-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full
              ${tab === t.ma ? "bg-[#8b1a1a] text-white" : "bg-[#eee] text-[#666]"}`}>{t.dem}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Thanh tìm kiếm + hành động */}
        <div className="bg-white border border-[#ddd] rounded-[4px] p-3 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[260px]">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
              <input value={tuKhoa}
                onChange={e => { setTuKhoa(e.target.value); setMoGoiY(true); setViTriGoiY(-1); }}
                onFocus={() => setMoGoiY(true)}
                onBlur={() => { setMoGoiY(false); setViTriGoiY(-1); }}
                onKeyDown={phimGoiY}
                placeholder="Tìm theo trích yếu, người gửi, nơi gửi…"
                className="w-full h-[32px] pl-7 pr-7 text-[13px] border border-[#ccc] rounded-[3px] focus:outline-none focus:border-[#1a73e8]" />
              {tuKhoa && (
                <button type="button" onClick={() => { setTuKhoa(""); setViTriGoiY(-1); }}
                  title="Xoá từ khoá"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#666]">
                  <X size={13} />
                </button>
              )}
              {/* Gợi ý rút từ chính các dòng đang hiển thị. onMouseDown chặn
                  blur, nếu không input mất focus trước khi onClick kịp chạy. */}
              {moGoiY && goiY.length > 0 && (
                <div className="absolute left-0 right-0 top-[34px] z-20 bg-white border border-[#ddd] rounded-[4px] shadow-lg max-h-[260px] overflow-y-auto">
                  <p className="px-3 py-1.5 text-[11px] text-[#8a94a6] border-b border-[#f0f0f0]">
                    Gợi ý từ {hienThi.length} dòng đang hiển thị
                  </p>
                  {goiY.map((g, i) => (
                    <button
                      key={`${g.truong}-${g.giaTri}`}
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onMouseEnter={() => setViTriGoiY(i)}
                      onClick={() => chonGoiY(g.giaTri)}
                      className={`w-full text-left px-3 py-[6px] text-[12px] flex items-baseline gap-2 border-b border-[#f5f5f5] last:border-0
                        ${i === viTriGoiY ? "bg-[#eef4fd]" : "hover:bg-[#f7f9fc]"}`}
                    >
                      <span className="text-[10px] text-[#8a94a6] border border-[#e0e0e0] rounded-[2px] px-1 py-[1px] flex-shrink-0">
                        {g.truong}
                      </span>
                      <span className="text-[#222] truncate">{g.giaTri}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Chuyển đơn sang phòng khác — thao tác của văn thư. Đơn vị nhận
                chọn ngay trên từng dòng, nút này chỉ chốt lại và hỏi xác nhận. */}
            <button type="button" onClick={() => setHoiXacNhan(true)} disabled={daChon.length === 0}
              className={`flex items-center gap-1.5 h-[32px] px-4 rounded-[3px] text-[13px] font-medium transition-colors
                ${daChon.length === 0
                  ? "border border-[#ddd] bg-[#f7f7f7] text-[#aaa] cursor-not-allowed"
                  : "bg-[#8b1a1a] hover:bg-[#6e1414] text-white"}`}>
              <Send size={13} /> Chuyển đơn{daChon.length > 0 && ` (${daChon.length})`}
            </button>
          </div>

          {/* Lọc theo loại văn bản — dải chip thay cho 7 thẻ lớn */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Nút mở khối lọc chi tiết. Badge số điều kiện đang chạy là bắt buộc:
                khối thu gọn lại mà vẫn lọc ngầm thì người dùng tưởng mất dữ liệu. */}
            <button type="button" onClick={() => setMoBoLoc(v => !v)}
              className={`flex items-center gap-1.5 h-[26px] px-2.5 rounded-[3px] border text-[12px] font-medium transition-colors
                ${soDieuKienPhu > 0
                  ? "border-[#8b1a1a] text-[#8b1a1a] bg-[#fdecea]"
                  : "border-[#ccc] text-[#555] bg-white hover:border-[#999]"}`}>
              <SlidersHorizontal size={12} />
              Bộ lọc chi tiết
              {soDieuKienPhu > 0 && (
                <span className="bg-[#8b1a1a] text-white rounded-full text-[10px] font-semibold min-w-[15px] h-[15px] leading-[15px] text-center px-1">
                  {soDieuKienPhu}
                </span>
              )}
              {moBoLoc ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            <span className="w-px h-5 bg-[#e0e0e0]" />
            <span className="text-[12px] text-[#8a94a6]">Loại văn bản:</span>
            <button type="button" onClick={() => setLoai("")}
              className={`px-2.5 py-[3px] rounded-full text-[12px] font-medium border transition-colors
                ${!loai ? "bg-[#1d2e4f] border-[#1d2e4f] text-white" : "bg-white border-[#ccc] text-[#555] hover:border-[#999]"}`}>
              Tất cả <span className="opacity-70">{theoTab.length}</span>
            </button>
            {dsLoai.map(([ten, dem]) => (
              <button key={ten} type="button" onClick={() => setLoai(l => l === ten ? "" : ten)}
                className={`px-2.5 py-[3px] rounded-full text-[12px] font-medium border transition-colors
                  ${loai === ten ? "bg-[#1d2e4f] border-[#1d2e4f] text-white" : "bg-white border-[#ccc] text-[#555] hover:border-[#999]"}`}>
                {ten} <span className="opacity-70">{dem}</span>
              </button>
            ))}
          </div>

          {/* ── Bộ lọc chi tiết ── */}
          {moBoLoc && (
            <div className="border-t border-[#eee] pt-3 space-y-2.5">
              <div className="grid grid-cols-4 gap-x-3 gap-y-2.5">
                <div>
                  <Lbl>Số đến</Lbl>
                  <Inp value={fSoDen} onChange={e => setFSoDen(e.target.value)} placeholder="Nhập số đến…" />
                </div>
                <div>
                  <Lbl>Người gửi</Lbl>
                  <Inp value={fNguoiGui} onChange={e => setFNguoiGui(e.target.value)} placeholder="Nhập tên người gửi…" />
                </div>
                <div>
                  <Lbl>Nơi gửi</Lbl>
                  <Sel value={fNoiGui} onChange={e => setFNoiGui(e.target.value)}>
                    <option value="">Tất cả nơi gửi</option>
                    {dsNoiGui.map(v => <option key={v} value={v}>{v}</option>)}
                  </Sel>
                </div>
                <div>
                  <Lbl>Hình thức nhận</Lbl>
                  <Sel value={fHinhThucNhan} onChange={e => setFHinhThucNhan(e.target.value)}>
                    <option value="">Tất cả hình thức</option>
                    {dsHinhThucNhan.map(v => <option key={v} value={v}>{v}</option>)}
                  </Sel>
                </div>
                <div className="col-span-2">
                  <Lbl>Ngày nhận</Lbl>
                  <div className="flex items-center gap-1.5">
                    <Inp type="date" value={fTuNgay} onChange={e => setFTuNgay(e.target.value)} />
                    <span className="text-[12px] text-[#888] flex-shrink-0">đến</span>
                    <Inp type="date" value={fDenNgay} onChange={e => setFDenNgay(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Lbl>Đơn vị xử lý</Lbl>
                  <Sel value={fDonViXuLy} onChange={e => setFDonViXuLy(e.target.value)}>
                    <option value="">Tất cả đơn vị</option>
                    {dsDonViXuLy.map(v => <option key={v} value={v}>{v}</option>)}
                  </Sel>
                </div>
                <div className="flex items-end">
                  <button type="button" onClick={xoaBoLocPhu} disabled={soDieuKienPhu === 0}
                    className={`w-full h-[30px] rounded-[3px] border text-[12px] font-medium transition-colors
                      ${soDieuKienPhu === 0
                        ? "border-[#e0e0e0] text-[#bbb] cursor-not-allowed"
                        : "border-[#ccc] text-[#555] hover:border-[#8b1a1a] hover:text-[#8b1a1a]"}`}>
                    Xoá bộ lọc chi tiết
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[#8a94a6]">
                Các điều kiện trên cộng dồn với nhau và với ô tìm kiếm ở trên, không thay thế nhau.
              </p>
            </div>
          )}
        </div>

        {/* Bảng */}
        <div className="bg-white border border-[#ddd] rounded-[4px] overflow-hidden">
          <div className="px-3.5 py-2 border-b border-[#eee] flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold text-[#1d2e4f]">Văn thư đến</span>
            {/* Bấm đúp là thao tác ẩn — không nói ra thì không ai đoán được */}
            <span className="text-[12px] text-[#8a94a6]">
              Bấm đúp vào một dòng để sửa · {hienThi.length} văn bản
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border border-[#ddd] px-2 py-[6px] text-center w-[34px]">
                    <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a]"
                      title="Chọn tất cả đơn chưa chuyển đang hiển thị"
                      checked={coTheChuyen.length > 0 && daChon.length === coTheChuyen.length}
                      onChange={() => setDaChon(daChon.length === coTheChuyen.length ? [] : coTheChuyen.map(r => r.id))} />
                  </th>
                  <th className="border border-[#ddd] px-2 py-[6px] text-center font-semibold text-[#333] w-[42px]">STT</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[100px]">Ngày nhận</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333]">Trích yếu</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[190px]">Người gửi</th>
                  {/* Hình thức nhận đứng trước Loại văn bản, để Loại văn bản và
                      Đơn vị xử lý nằm sát nhau — hai ô này ràng buộc lẫn nhau
                      (đổi loại là kéo theo đơn vị), tách rời thì không thấy được
                      quan hệ đó khi nhìn lướt qua bảng. */}
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[110px]">Hình thức nhận</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[170px]">Loại văn bản</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[210px]">Đơn vị xử lý</th>
                  <th className="border border-[#ddd] px-3 py-[6px] text-left font-semibold text-[#333] w-[135px]">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {hienThi.length === 0 ? (
                  <tr><td colSpan={9} className="border border-[#ddd] px-4 py-10 text-center text-[#999]">
                    Không có văn bản nào khớp điều kiện.
                  </td></tr>
                ) : hienThi.map((r, i) => {
                  const daChuyen = r.trangThai === "Đã chuyển xử lý";
                  const tich = daChon.includes(r.id);
                  return (
                  <tr key={r.id}
                    onDoubleClick={() => onSua(r)}
                    title="Bấm đúp để sửa văn bản này"
                    className={`align-top cursor-pointer select-none transition-colors
                      ${tich ? "bg-[#eef4fd]" : i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"} hover:bg-[#f5f8fc]`}>
                    {/* Ô tích và ô chọn đơn vị chặn sự kiện, nếu không bấm hai lần
                        vào chúng sẽ vô tình mở màn sửa. */}
                    <td className="border border-[#ddd] px-2 py-2 text-center"
                      onDoubleClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="w-[13px] h-[13px] accent-[#8b1a1a] disabled:opacity-40"
                        checked={tich} disabled={daChuyen}
                        title={daChuyen ? "Đơn đã chuyển, không chuyển lại" : "Chọn để chuyển đơn"}
                        onChange={() => setDaChon(p => p.includes(r.id) ? p.filter(x => x !== r.id) : [...p, r.id])} />
                    </td>
                    <td className="border border-[#ddd] px-2 py-2 text-center text-[#666]">{i + 1}</td>
                    <td className="border border-[#ddd] px-3 py-2 text-[#333] whitespace-nowrap">{r.ngayNhan}</td>
                    <td className="border border-[#ddd] px-3 py-2">
                      <div className="text-[#333] leading-snug">{r.trichYeu}</div>
                      {r.laGDTTT && (
                        <span className="inline-block mt-1 px-1.5 py-[1px] rounded text-[10px] font-semibold bg-[#fdeaea] text-[#8b1a1a] border border-[#f0c9c9]">
                          GĐT/TT
                        </span>
                      )}
                    </td>
                    <td className="border border-[#ddd] px-3 py-2">
                      <div className="font-medium text-[#1d2e4f] leading-snug">{r.nguoiGui}</div>
                      <div className="text-[11px] text-[#888] mt-0.5 leading-snug">{r.noiGui}</div>
                    </td>
                    <td className="border border-[#ddd] px-3 py-2 text-[#555]">{r.hinhThucNhan}</td>
                    {/* Loại văn bản sửa tại chỗ: màn chi tiết chỉ để xem, nên đây
                        là nơi duy nhất đổi được — và nó kéo theo Đơn vị xử lý ở
                        ngay ô bên cạnh. */}
                    <td className="border border-[#ddd] px-2 py-2" onDoubleClick={e => e.stopPropagation()}>
                      {daChuyen ? (
                        <Chip mau={MAU_LOAI[r.loaiVanBan] ?? "bg-[#f5f5f5] text-[#555] border-[#ddd]"}>{r.loaiVanBan}</Chip>
                      ) : (
                        <div className="relative">
                          <select value={r.loaiVanBan}
                            onChange={e => onDoiLoai(r.id, e.target.value)}
                            className="w-full h-[28px] pl-2 pr-6 text-[12px] border border-[#ccc] rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]">
                            {LOAI_VAN_BAN_THEO_NHOM.map(g => (
                              <optgroup key={g.nhom} label={`— ${g.nhom}`}>
                                {g.items.map(l => <option key={l} value={l}>{l}</option>)}
                              </optgroup>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                        </div>
                      )}
                    </td>
                    <td className="border border-[#ddd] px-2 py-2" onDoubleClick={e => e.stopPropagation()}>
                      {/* Đã chuyển rồi thì khóa lại — đổi đơn vị sau khi chuyển
                          sẽ khiến nơi đã nhận đơn và nơi ghi trên sổ khác nhau. */}
                      {daChuyen ? (
                        <span className="text-[#555]">{r.donViXuLy}</span>
                      ) : (
                        <>
                          <div className="relative">
                            <select value={r.donViXuLy}
                              onChange={e => onDoiDonVi(r.id, e.target.value)}
                              className={`w-full h-[28px] pl-2 pr-6 text-[12px] border rounded-[3px] bg-white appearance-none focus:outline-none focus:border-[#1a73e8]
                                ${r.donViXuLyTuSua ? "border-[#b45309] text-[#b45309] font-medium" : "border-[#ccc]"}`}>
                              {DON_VI_XU_LY.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                          </div>
                          {/* Phân biệt "tự điền" với "người chọn": người duyệt cần
                              biết dòng nào là quyết định của con người. Ô đã sửa tay
                              thì không bị Loại văn bản ghi đè nữa, nên phải có đường
                              gỡ — không thì một lần lỡ tay khoá vĩnh viễn. */}
                          {r.donViXuLyTuSua ? (
                            <button type="button" onClick={() => onGoiLaiMacDinh(r.id)}
                              title={`Trả về mặc định theo loại văn bản (${donViMacDinh(r.loaiVanBan)})`}
                              className="mt-1 text-[10px] text-[#b45309] hover:underline">
                              Đã sửa tay · trả về mặc định
                            </button>
                          ) : (
                            <span className="mt-1 block text-[10px] text-[#94a3b8]">Tự điền theo loại văn bản</span>
                          )}
                        </>
                      )}
                    </td>
                    <td className="border border-[#ddd] px-3 py-2">
                      <Chip mau={MAU_TRANG_THAI[r.trangThai]}>{r.trangThai}</Chip>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Xác nhận chuyển đơn ──
          Chuyển đơn là thao tác đẩy hồ sơ sang đơn vị khác, thu hồi được thì cũng
          mất công — nên hỏi lại và liệt kê rõ đơn nào đi đâu trước khi thực hiện. */}
      {hoiXacNhan && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50"
          onClick={() => setHoiXacNhan(false)}>
          <div className="bg-white rounded-[6px] w-[560px] max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-center justify-between flex-shrink-0">
              <div className="text-[15px] font-bold">Xác nhận chuyển đơn</div>
              <button type="button" onClick={() => setHoiXacNhan(false)}
                className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>

            <div className="p-4 overflow-y-auto">
              <p className="text-[13px] text-[#333] mb-3">
                Chuyển <b className="font-semibold">{donSeChuyen.length}</b> đơn sang đơn vị xử lý đã chọn.
                Sau khi chuyển, đơn vị nhận sẽ thấy đơn trong danh sách của họ.
              </p>

              <div className="border border-[#e0e0e0] rounded-[4px] divide-y divide-[#f0f0f0]">
                {donSeChuyen.map(r => (
                  <div key={r.id} className="px-3 py-2 flex items-start gap-2">
                    <FileText size={13} className="text-[#8b1a1a] flex-shrink-0 mt-[2px]" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] text-[#333] leading-snug truncate">{r.trichYeu}</div>
                      <div className="text-[11px] text-[#888] mt-0.5">
                        Nhận {r.ngayNhan} · {r.nguoiGui}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#1a5a96] flex-shrink-0 whitespace-nowrap">
                      → {r.donViXuLy}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#e0e0e0] px-4 py-3 flex justify-end gap-2 flex-shrink-0">
              <button type="button" onClick={() => setHoiXacNhan(false)}
                className="h-[30px] px-4 rounded-[3px] border border-[#ccc] text-[13px] font-medium text-[#333] hover:bg-[#f5f5f5]">
                Huỷ
              </button>
              <button type="button"
                onClick={() => { onChuyenDon(daChon); setDaChon([]); setHoiXacNhan(false); }}
                className="flex items-center gap-1.5 h-[30px] px-4 rounded-[3px] bg-[#8b1a1a] hover:bg-[#6e1414] text-white text-[13px] font-medium transition-colors">
                <Send size={13} /> Chuyển {donSeChuyen.length} đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════

/** dd/mm/yyyy → yyyy-mm-dd cho <input type="date"> */
const sangISO = (ngay: string) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(ngay.trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : homNayISO();
};

/** Như `sangISO` nhưng KHÔNG đoán: đọc không được thì trả "" để nơi gọi tự quyết.
 *  Dùng cho bộ lọc khoảng ngày — ở đó đoán thành hôm nay là ra kết quả sai. */
const ngayNhanISO = (ngay: string) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((ngay ?? "").trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
};

export default function TiepNhanDon(props: {
  canBoDangNhap?: string;
  onHuy?: () => void;
  onMoDanhSachGDT?: () => void;
  onLuuDonGDT?: (d: {
    nguoiGui: string; diaChi: string; trichYeu: string; loaiVanBan: string;
    ngayTiepNhan: string; canBoTiepNhan: string; hinhThucTiepNhan: string;
  }) => void;
}) {
  const [vanThu, setVanThu] = useState<VanThuDen[]>(VAN_THU_MAU);
  /** Bản ghi đang mở để sửa. null = đang ở màn danh sách. */
  const [dangSua, setDangSua] = useState<VanThuDen | null>(null);

  if (!dangSua) {
    return (
      <DanhSachVanThu
        rows={vanThu}
        onSua={setDangSua}
        // Đổi Loại văn bản kéo theo cờ luồng GĐT/TT và Đơn vị xử lý — TRỪ dòng
        // người dùng đã tự chọn đơn vị: ghi đè lên đó là nuốt mất thao tác của họ.
        onDoiLoai={(id, loai) =>
          setVanThu(prev => prev.map(r => r.id === id
            ? {
                ...r,
                loaiVanBan: loai,
                laGDTTT: MAC_DINH_GDT_TT(loai),
                donViXuLy: r.donViXuLyTuSua ? r.donViXuLy : donViMacDinh(loai),
              }
            : r))}
        onDoiDonVi={(id, donVi) =>
          setVanThu(prev => prev.map(r => r.id === id
            ? { ...r, donViXuLy: donVi, donViXuLyTuSua: donVi !== donViMacDinh(r.loaiVanBan) }
            : r))}
        onGoiLaiMacDinh={id =>
          setVanThu(prev => prev.map(r => r.id === id
            ? { ...r, donViXuLy: donViMacDinh(r.loaiVanBan), donViXuLyTuSua: false }
            : r))}
        onChuyenDon={ids =>
          setVanThu(prev => prev.map(r => ids.includes(r.id)
            ? { ...r, trangThai: "Đã chuyển xử lý" as const }
            : r))}
      />
    );
  }

  return (
    <FormTiepNhanDon
      {...props}
      // key = id bản ghi: mở dòng khác thì biểu mẫu dựng lại từ đầu, không giữ
      // sót giá trị của dòng vừa xem.
      key={dangSua.id}
      banGhi={dangSua}
      onHuy={() => setDangSua(null)}
      onDaLuu={d => {
        setVanThu(prev => prev.map(r => r.id === dangSua.id
          ? {
              ...r,
              soDen: d.soDen,
              ngayNhan: (() => { const [y, m, dd] = d.ngayTiepNhan.split("-"); return y ? `${dd}/${m}/${y}` : d.ngayTiepNhan; })(),
              trichYeu: d.trichYeu,
              nguoiGui: d.nguoiGui,
              noiGui: d.tinh,
              loaiVanBan: d.loaiVanBan,
              hinhThucNhan: d.hinhThucNhan,
              // Đơn GĐT/TT được đẩy sang Danh sách đơn ngay lúc lưu; loại khác
              // còn nằm chờ ở sổ văn bản đến.
              trangThai: d.laGDTTT ? "Đã chuyển xử lý" : "Chờ chuyển xử lý",
              laGDTTT: d.laGDTTT,
            }
          : r));
        setDangSua(null);
      }}
    />
  );
}
