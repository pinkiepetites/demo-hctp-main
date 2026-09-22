// ─────────────────────────────────────────────────────────────────────────────
// Module "Quản lý văn bản" — vòng đời văn bản trình ký.
//
// Đặc tả: {output_folder}/planning-artifacts/ux-designs/ux-quan-ly-van-ban-2026-08-06/
//         EXPERIENCE.md · DESIGN.md · wireframes/wireframes-ascii.md
//
// QUY TẮC TRUNG TÂM — mọi thứ trong file này xoay quanh nó:
//   Quyền sửa luôn thuộc về người đang giữ văn bản.
//   nguoiDangGiu = luongKy[buocHienTai].nguoi
//   Đây là điều kiện DUY NHẤT mở khoá mọi nút Sửa. Không có quyền phụ,
//   không có admin ghi đè, không có "người tạo luôn được sửa".
//
// KHO DÙNG CHUNG: `VanBanTrinh[]` sống ở state của App và được cả ba màn
// (Danh sách văn bản · Phê duyệt đề xuất · Sổ văn bản đi) cùng đọc,
// cùng ghi. Popup "Tạo văn bản & trình ký" đẩy bản ghi mới vào đây.
// Không có kho thứ hai — đó là lý do trước kia ba màn không ăn nhập gì nhau.
//
// Các hệ quả đã chốt:
//   · Không có nút "Thu hồi" (mâu thuẫn quy tắc trung tâm).
//   · Trả lại LUÔN về thẳng người tạo, ý kiến bắt buộc.
//   · Vòng trình MỚI mở lúc TRÌNH LẠI (không phải lúc trả lại): trả lại chỉ
//     vô hiệu phê duyệt của vòng hiện tại; trình lại mới tăng vongTrinh.
//   · Không có thảo luận 2 chiều ⇒ diff phiên bản là kênh giao tiếp DUY NHẤT.
//   · Một số duy nhất: cấp tạm thủ công hoặc tự cấp khi ký; không thu hồi số.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo, useEffect } from "react";
import {
  X, Plus, Search, Eye, Pencil, History, FileText, Printer, Download,
  Check, Send, Lock, AlertCircle, ArrowLeftRight, Ban, Trash2, ChevronDown,
  ChevronRight, Clock, PenLine, Save, ZoomIn, ZoomOut, RotateCcw, MessageSquare,
  Inbox, Home,
} from "lucide-react";

// ─── Kiểu dữ liệu ────────────────────────────────────────────────────────────
export type TrangThaiVB =
  | "Nhap" | "ChoDuyet" | "ChoKy" | "ChoButPhe" | "BiTraLai" | "DaBanHanh" | "DaHuy";

export type HanhDong =
  | "Tao" | "LaySoTam" | "Trinh" | "Duyet" | "SuaVaDuyet" | "TraLai" | "Ky" | "ButPhe" | "BanHanh";

export interface BuocKy {
  thuTu: number;
  nguoi: string;
  chucVu: string;
  vaiTro: "duyet" | "ky" | "but_phe";
  ketQua?: "da_duyet" | "tra_lai" | "da_ky" | "da_but_phe";
  thoiGian?: string;
}

/** Trạng thái chờ tương ứng với vai trò của bước đang tới. */
export const trangThaiCho = (vaiTro: BuocKy["vaiTro"]): TrangThaiVB =>
  vaiTro === "ky" ? "ChoKy" : vaiTro === "but_phe" ? "ChoButPhe" : "ChoDuyet";

/** Bước đã đi qua — dùng để tô xanh trên stepper và khoá nút. */
export const daXong = (b: BuocKy) =>
  b.ketQua === "da_duyet" || b.ketQua === "da_ky" || b.ketQua === "da_but_phe";

/** Văn bản còn nằm trong luồng ký, đang chờ ai đó xử lý. */
export const dangChoXuLy = (tt: TrangThaiVB) =>
  tt === "ChoDuyet" || tt === "ChoKy" || tt === "ChoButPhe";

/** Nhãn ngắn của vai trò từng bước trong khối "Luồng ký". */
export const NHAN_VAI_TRO_BUOC: Record<BuocKy["vaiTro"], string> = {
  duyet: "duyệt", ky: "ký số", but_phe: "bút phê",
};

export interface PhienBan {
  so: number;
  noiDung: string;      // mỗi dòng cách nhau bằng \n — dùng cho diff
  nguoiSua: string;
  thoiGian: string;
}

export interface MocLichSu {
  vongTrinh: number;
  thoiGian: string;
  nguoi: string;
  chucVu: string;
  hanhDong: HanhDong;
  yKien?: string;
  phienBanTruoc?: number;
  phienBanSau?: number;
}

export interface VanBanTrinh {
  id: string;
  trichYeu: string;
  loaiVanBan: string;
  donViSoanThao: string;
  soVanBan?: string;
  trangThaiSo?: "tam" | "chinhThuc";
  ngayCapSo?: string;
  ngayBanHanh?: string;
  trangThai: TrangThaiVB;
  nguoiTao: string;
  luongKy: BuocKy[];
  buocHienTai: number;
  vongTrinh: number;
  phienBanHienTai: number;
  phienBan: PhienBan[];
  lichSu: MocLichSu[];
  donDinhKem: { ma: string; nguoiGui: string; soBA: string; hinhThuc: string }[];
}

// ─── Trường dẫn xuất & tiện ích ──────────────────────────────────────────────

/** Người đang giữ văn bản. Vừa hiển thị cột "Đang ở ai", vừa là điều kiện
 *  DUY NHẤT mở khoá mọi nút Sửa trên toàn module. */
export const nguoiDangGiu = (vb: VanBanTrinh): BuocKy | null => {
  if (vb.trangThai === "Nhap" || vb.trangThai === "BiTraLai") {
    return { thuTu: 0, nguoi: vb.nguoiTao, chucVu: "Cán bộ", vaiTro: "duyet" };
  }
  if (["DaBanHanh", "DaHuy"].includes(vb.trangThai)) return null;
  return vb.luongKy[vb.buocHienTai] ?? null;
};

/** Các văn bản đang chứa một đơn. Dùng cho chiều ngược lại: từ Danh sách đơn
 *  nhìn ra "đơn này đã nằm trong tờ trình nào rồi" — chốt chặn lấy số trùng.
 *  Văn bản đã huỷ không tính: số của nó không còn hiệu lực. */
export const timVanBanTheoDon = (ds: VanBanTrinh[], maDon?: string): VanBanTrinh[] => {
  // Mã đơn trong dữ liệu mẫu có bản lẫn khoảng trắng thừa (" Mã 7031") nên phải
  // chuẩn hoá cả hai vế, không so khớp chuỗi thô.
  const chuan = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
  if (!maDon || !chuan(maDon)) return [];
  const k = chuan(maDon);
  return ds.filter(v => v.trangThai !== "DaHuy" && v.donDinhKem.some(d => chuan(d.ma) === k));
};

/** Người đăng nhập suy ra từ widget "Vai trò" ở góc phải màn hình.
 *  Đổi vai trò ⇒ quyền sửa đổi theo — quy tắc trung tâm vận hành ngay trên mockup. */
export const nguoiTheoVaiTro = (role: string): { nguoi: string; chucVu: string } => {
  switch (role) {
    case "truong-phong": return { nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng" };
    case "pho-vp": return { nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng" };
    case "lanh-dao": return { nguoi: "Nguyễn Thị Bình", chucVu: "Chánh tòa" };
    // Người bút phê thông báo phân công — bước cuối của luồng ký
    case "chanh-an": return { nguoi: "Đặng Quốc Trung", chucVu: "Phó Chánh án" };
    case "van-thu": return { nguoi: "Phạm Thị Lan", chucVu: "Văn thư" };
    default: return { nguoi: "Vũ Văn Yên", chucVu: "Cán bộ" };
  }
};

const p2 = (n: number) => String(n).padStart(2, "0");
const bayGio = () => {
  const d = new Date();
  return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
};
const homNay = () => bayGio().split(" ")[0];

const KY_HIEU: Record<string, string> = {
  "Thông báo phân công": "TB", "Tờ trình khác": "TTr", "Tờ trình": "TTr",
  "Thông báo phân công TP": "TB", "Thông báo": "TB",
  "Trả lại đơn": "QĐ", "Quyết định": "QĐ",
};
const kyHieuTheoLoai = (loai: string) => {
  for (const k of Object.keys(KY_HIEU)) if (loai.includes(k)) return KY_HIEU[k];
  if (loai.toLowerCase().includes("tờ trình")) return "TTr";
  if (loai.toLowerCase().includes("thông báo")) return "TB";
  if (loai.toLowerCase().includes("quyết định")) return "QĐ";
  return "CV";
};

/** Số kế tiếp trong sổ. Số KHÔNG bao giờ tái sử dụng — kể cả số đã huỷ. */
export const soKeTiep = (ds: VanBanTrinh[], loaiVanBan: string): string => {
  const max = ds.reduce((m, v) => {
    const n = parseInt((v.soVanBan ?? "").split("/")[0], 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 120);
  return `${max + 1}/${new Date().getFullYear()}/${kyHieuTheoLoai(loaiVanBan)}-TAHN-VP`;
};

// ─── Hành động: reducer thuần, luôn trả bản ghi MỚI ──────────────────────────

const themMoc = (vb: VanBanTrinh, m: Omit<MocLichSu, "vongTrinh"> & { vongTrinh?: number }): MocLichSu[] =>
  [...vb.lichSu, { vongTrinh: m.vongTrinh ?? vb.vongTrinh, ...m } as MocLichSu];

const themPhienBan = (vb: VanBanTrinh, noiDung: string, nguoi: string): { pb: PhienBan[]; so: number } => {
  const so = Math.max(...vb.phienBan.map(p => p.so), 0) + 1;
  return { pb: [...vb.phienBan, { so, noiDung, nguoiSua: nguoi, thoiGian: bayGio() }], so };
};

export const apLaySoTam = (vb: VanBanTrinh, nguoi: string, chucVu: string, ds: VanBanTrinh[]): VanBanTrinh => {
  if (vb.soVanBan) return vb;
  const so = soKeTiep(ds, vb.loaiVanBan);
  return {
    ...vb, soVanBan: so, trangThaiSo: "tam", ngayCapSo: homNay(),
    lichSu: themMoc(vb, { thoiGian: bayGio(), nguoi, chucVu, hanhDong: "LaySoTam" }),
  };
};

export const apTrinhDuyet = (vb: VanBanTrinh, nguoi: string, chucVu: string, yKien?: string): VanBanTrinh => {
  if (!vb.luongKy.length) return vb;
  return {
    ...vb, trangThai: trangThaiCho(vb.luongKy[0].vaiTro), buocHienTai: 0,
    // Ý kiến trình gắn vào chính mốc "Trình duyệt" — cùng một dòng thời gian với
    // ý kiến của người duyệt và người ký, không phải một trường lơ lửng.
    lichSu: themMoc(vb, { thoiGian: bayGio(), nguoi, chucVu, hanhDong: "Trinh", yKien: yKien?.trim() || undefined }),
  };
};

export const apDuyet = (vb: VanBanTrinh, nguoi: string, chucVu: string, yKien?: string): VanBanTrinh => {
  const luongKy = vb.luongKy.map((b, i) =>
    i === vb.buocHienTai ? { ...b, ketQua: "da_duyet" as const, thoiGian: bayGio() } : b);
  const tiep = vb.buocHienTai + 1;
  const con = tiep < luongKy.length;
  return {
    ...vb, luongKy, buocHienTai: con ? tiep : vb.buocHienTai,
    trangThai: con ? trangThaiCho(luongKy[tiep].vaiTro) : "ChoKy",
    lichSu: themMoc(vb, { thoiGian: bayGio(), nguoi, chucVu, hanhDong: "Duyet", yKien }),
  };
};

export const apSuaVaDuyet = (vb: VanBanTrinh, nguoi: string, chucVu: string, noiDungMoi: string, yKien?: string): VanBanTrinh => {
  const truoc = vb.phienBanHienTai;
  const { pb, so } = themPhienBan(vb, noiDungMoi, nguoi);
  const luongKy = vb.luongKy.map((b, i) =>
    i === vb.buocHienTai ? { ...b, ketQua: "da_duyet" as const, thoiGian: bayGio() } : b);
  const tiep = vb.buocHienTai + 1;
  const con = tiep < luongKy.length;
  return {
    ...vb, phienBan: pb, phienBanHienTai: so, luongKy,
    buocHienTai: con ? tiep : vb.buocHienTai,
    trangThai: con ? trangThaiCho(luongKy[tiep].vaiTro) : "ChoKy",
    // MỘT mốc duy nhất, không tách thành "sửa" rồi "duyệt".
    lichSu: themMoc(vb, {
      thoiGian: bayGio(), nguoi, chucVu, hanhDong: "SuaVaDuyet", yKien,
      phienBanTruoc: truoc, phienBanSau: so,
    }),
  };
};

/** Trả lại: LUÔN về thẳng người tạo. Vô hiệu mọi phê duyệt của vòng hiện tại.
 *  vongTrinh CHƯA tăng ở đây — vòng mới mở lúc cán bộ trình lại. */
export const apTraLai = (vb: VanBanTrinh, nguoi: string, chucVu: string, yKien: string): VanBanTrinh => ({
  ...vb,
  trangThai: "BiTraLai",
  buocHienTai: 0,
  luongKy: vb.luongKy.map(b => ({ ...b, ketQua: undefined, thoiGian: undefined })),
  lichSu: themMoc(vb, { thoiGian: bayGio(), nguoi, chucVu, hanhDong: "TraLai", yKien }),
});

/** Sửa & trình lại: mở VÒNG MỚI, chạy lại từ bước 1. */
export const apSuaVaTrinhLai = (vb: VanBanTrinh, nguoi: string, chucVu: string, noiDungMoi?: string): VanBanTrinh => {
  const vongMoi = vb.vongTrinh + 1;
  let pb = vb.phienBan, so = vb.phienBanHienTai, truoc: number | undefined;
  if (noiDungMoi !== undefined && noiDungMoi !== vb.phienBan.find(p => p.so === vb.phienBanHienTai)?.noiDung) {
    truoc = vb.phienBanHienTai;
    const r = themPhienBan(vb, noiDungMoi, nguoi);
    pb = r.pb; so = r.so;
  }
  return {
    ...vb, vongTrinh: vongMoi, phienBan: pb, phienBanHienTai: so,
    buocHienTai: 0,
    trangThai: vb.luongKy[0] ? trangThaiCho(vb.luongKy[0].vaiTro) : "ChoDuyet",
    luongKy: vb.luongKy.map(b => ({ ...b, ketQua: undefined, thoiGian: undefined })),
    lichSu: themMoc(vb, {
      vongTrinh: vongMoi, thoiGian: bayGio(), nguoi, chucVu, hanhDong: "Trinh",
      phienBanTruoc: truoc, phienBanSau: truoc !== undefined ? so : undefined,
    }),
  };
};

/** Ký số: nếu chưa có số thì TỰ CẤP số chính thức. Số đã có thì giữ nguyên,
 *  chỉ chuyển trạng thái tạm → chính thức. Không bao giờ đổi số.
 *  Ký số KHÔNG mặc nhiên là bước cuối — thông báo phân công còn phải qua bút phê
 *  của Chánh án/Phó Chánh án, nên nếu luồng còn bước thì đẩy sang bước đó. */
export const apKySo = (vb: VanBanTrinh, nguoi: string, chucVu: string, ds: VanBanTrinh[]): VanBanTrinh => {
  const luongKy = vb.luongKy.map((b, i) =>
    i === vb.buocHienTai ? { ...b, ketQua: "da_ky" as const, thoiGian: bayGio() } : b);
  const tiep = vb.buocHienTai + 1;
  const con = tiep < luongKy.length;
  const so = vb.soVanBan ?? soKeTiep(ds, vb.loaiVanBan);
  return {
    ...vb, luongKy,
    buocHienTai: con ? tiep : vb.buocHienTai,
    trangThai: con ? trangThaiCho(luongKy[tiep].vaiTro) : "DaBanHanh",
    soVanBan: so, trangThaiSo: "chinhThuc",
    ngayCapSo: vb.ngayCapSo ?? homNay(),
    // Chỉ coi là ban hành được khi luồng đã đi hết
    ngayBanHanh: con ? vb.ngayBanHanh : homNay(),
    lichSu: themMoc(vb, { thoiGian: bayGio(), nguoi, chucVu, hanhDong: "Ky" }),
  };
};

/** Bút phê của Chánh án / Phó Chánh án — bước cuối của thông báo phân công.
 *  Ý kiến bút phê là bắt buộc, vì đây chính là nội dung chỉ đạo. */
export const apButPhe = (vb: VanBanTrinh, nguoi: string, chucVu: string, yKien: string): VanBanTrinh => {
  const luongKy = vb.luongKy.map((b, i) =>
    i === vb.buocHienTai ? { ...b, ketQua: "da_but_phe" as const, thoiGian: bayGio() } : b);
  const tiep = vb.buocHienTai + 1;
  const con = tiep < luongKy.length;
  return {
    ...vb, luongKy,
    buocHienTai: con ? tiep : vb.buocHienTai,
    trangThai: con ? trangThaiCho(luongKy[tiep].vaiTro) : "DaBanHanh",
    ngayBanHanh: con ? vb.ngayBanHanh : homNay(),
    lichSu: themMoc(vb, { thoiGian: bayGio(), nguoi, chucVu, hanhDong: "ButPhe", yKien }),
  };
};

/** Tạo VanBanTrinh từ popup "Tạo văn bản & trình ký". */
export const taoTuModal = (input: {
  trichYeu: string; loaiVanBan: string; nguoiTao: string;
  luongKy: BuocKy[]; noiDung: string;
  donDinhKem: VanBanTrinh["donDinhKem"];
  soVanBan?: string;
}): VanBanTrinh => {
  const id = `vb-${Date.now()}`;
  return {
    id,
    trichYeu: input.trichYeu,
    loaiVanBan: input.loaiVanBan,
    donViSoanThao: "Tòa Dân sự",
    soVanBan: input.soVanBan,
    trangThaiSo: input.soVanBan ? "tam" : undefined,
    ngayCapSo: input.soVanBan ? homNay() : undefined,
    trangThai: "Nhap",
    nguoiTao: input.nguoiTao,
    luongKy: input.luongKy,
    buocHienTai: 0,
    vongTrinh: 1,
    phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: input.noiDung, nguoiSua: input.nguoiTao, thoiGian: bayGio() }],
    lichSu: [
      { vongTrinh: 1, thoiGian: bayGio(), nguoi: input.nguoiTao, chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      ...(input.soVanBan
        ? [{ vongTrinh: 1, thoiGian: bayGio(), nguoi: input.nguoiTao, chucVu: "Cán bộ", hanhDong: "LaySoTam" as HanhDong }]
        : []),
    ],
    donDinhKem: input.donDinhKem,
  };
};

// ─── Token trạng thái ────────────────────────────────────────────────────────
const TRANG_THAI_META: Record<TrangThaiVB, { nhan: string; cls: string; icon: string }> = {
  Nhap:      { nhan: "Nháp",        cls: "bg-surface-container-low text-on-surface-variant border-surface-container",       icon: "📝" },
  ChoDuyet:  { nhan: "Chờ duyệt",   cls: "bg-info-container text-primary border-surface-variant", icon: "⏳" },
  ChoKy:     { nhan: "Chờ ký",      cls: "bg-warning-container text-warning border-warning-container", icon: "✍️" },
  ChoButPhe: { nhan: "Chờ bút phê", cls: "bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary-fixed-dim", icon: "🖊️" },
  BiTraLai:  { nhan: "Bị trả lại",  cls: "bg-error-container text-error border-error-container", icon: "⛔" },
  DaBanHanh: { nhan: "Đã ban hành", cls: "bg-info-container text-primary border-surface-variant", icon: "✅" },
  DaHuy:     { nhan: "Đã huỷ",      cls: "bg-surface-container text-outline border-surface-container",       icon: "⊘" },
};

const HANH_DONG_NHAN: Record<HanhDong, string> = {
  Tao: "Tạo văn bản", LaySoTam: "Lấy số tạm", Trinh: "Trình duyệt",
  Duyet: "Duyệt", SuaVaDuyet: "Sửa & duyệt", TraLai: "Trả lại",
  Ky: "Ký số", ButPhe: "Bút phê", BanHanh: "Ban hành",
};

const Pill = ({ tt, nhan }: { tt: TrangThaiVB; nhan?: string }) => {
  const m = TRANG_THAI_META[tt];
  return (
    <span className={`inline-block px-2 py-[2px] rounded-full text-[10px] font-medium border whitespace-nowrap ${m.cls}`}>
      {m.icon} {nhan ?? m.nhan}
    </span>
  );
};

const ChipSo = ({ vb }: { vb: VanBanTrinh }) => {
  if (!vb.soVanBan) return <span className="text-[11px] text-on-surface-variant italic">— chưa số —</span>;
  const tam = vb.trangThaiSo === "tam";
  return (
    <>
      <div className="font-mono text-[12px] font-medium tracking-tight text-on-surface leading-tight">{vb.soVanBan}</div>
      <span className={`inline-block mt-[3px] px-[5px] py-[1px] rounded-[2px] text-[10px] font-medium border
        ${tam ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]" : "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"}`}>
        {tam ? "Dự thảo" : "Chính thức"}
      </span>
    </>
  );
};

// ─── Nút ─────────────────────────────────────────────────────────────────────
const BtnPrimary = ({ children, onClick, disabled, title }: any) => (
  <button type="button" onClick={onClick} disabled={disabled} title={title}
    className={`inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] text-[12px] font-medium text-white transition-colors
      ${disabled ? "bg-[#d9c4c4] cursor-not-allowed" : "bg-error hover:bg-error-container"}`}>
    {children}
  </button>
);
const BtnOutline = ({ children, onClick }: any) => (
  <button type="button" onClick={onClick}
    className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-error text-error bg-white text-[12px] font-medium hover:bg-[#fdeaea] transition-colors">
    {children}
  </button>
);
const BtnNeutral = ({ children, onClick }: any) => (
  <button type="button" onClick={onClick}
    className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-surface-container-highest text-on-surface bg-white text-[12px] font-medium hover:bg-surface-container-low transition-colors">
    {children}
  </button>
);

// ─── Dữ liệu mẫu ─────────────────────────────────────────────────────────────
const ND_545_V1 = `Mục 1. Căn cứ đề xuất
Căn cứ Bộ luật Tố tụng dân sự năm 2015;
Căn cứ Luật Tổ chức Tòa án nhân dân năm 2014;
Căn cứ Điều 337 Bộ luật Tố tụng dân sự;
Xét đề nghị của Tòa Dân sự,

Mục 2. Nội dung phân công
Phân công Thẩm phán Nguyễn Như Thắng chủ trì giải quyết các đơn đề nghị
giám đốc thẩm nêu tại Danh sách đơn kèm theo Tờ trình này (03 đơn).
Thời hạn giải quyết: theo quy định chung.

Mục 3. Tổ chức thực hiện
Tòa Dân sự chịu trách nhiệm theo dõi, đôn đốc.`;

const ND_545_V2 = `Mục 1. Căn cứ đề xuất
Căn cứ Bộ luật Tố tụng dân sự năm 2015;
Căn cứ Luật Tổ chức Tòa án nhân dân năm 2014;
Căn cứ khoản 2 Điều 337 Bộ luật Tố tụng dân sự;
Căn cứ Nghị quyết 03/2019/NQ-HĐTP ngày 08/5/2019 của Hội đồng Thẩm phán;
Xét đề nghị của Tòa Dân sự,

Mục 2. Nội dung phân công
Phân công Thẩm phán Nguyễn Như Thắng chủ trì giải quyết các đơn đề nghị
giám đốc thẩm nêu tại Danh sách đơn kèm theo Tờ trình này (03 đơn).
Thời hạn giải quyết: 30 ngày kể từ ngày ký Tờ trình này.

Mục 3. Tổ chức thực hiện
Tòa Dân sự chịu trách nhiệm theo dõi, đôn đốc.`;

/** Luồng chung: Trưởng phòng duyệt → PCVP duyệt → PCVP ký số. */
const luong3 = (): BuocKy[] => [
  { thuTu: 1, nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", vaiTro: "duyet" },
  { thuTu: 2, nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", vaiTro: "duyet" },
  { thuTu: 3, nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", vaiTro: "ky" },
];

/** Luồng của THÔNG BÁO PHÂN CÔNG — khác luồng chung ở hai điểm:
 *  CVP/PCVP ký số luôn (không có bước duyệt riêng), và sau khi ký còn phải
 *  chuyển Chánh án/Phó Chánh án bút phê thì mới xong.
 *      Tạo → Trưởng phòng duyệt → CVP/PCVP ký số → Chánh án bút phê          */
export const luongToTrinhPhanCong = (): BuocKy[] => [
  { thuTu: 1, nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", vaiTro: "duyet" },
  { thuTu: 2, nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", vaiTro: "ky" },
  { thuTu: 3, nguoi: "Đặng Quốc Trung", chucVu: "Phó Chánh án", vaiTro: "but_phe" },
];

/** Nhận diện thông báo phân công để áp đúng luồng. */
export const laToTrinhPhanCong = (loaiVanBan: string) =>
  /tờ trình/i.test(loaiVanBan) && /phân công/i.test(loaiVanBan);

/** Luồng ký mặc định theo loại văn bản. */
export const luongMacDinh = (loaiVanBan: string): BuocKy[] =>
  laToTrinhPhanCong(loaiVanBan) ? luongToTrinhPhanCong() : luong3();

export const DU_LIEU_MAU: VanBanTrinh[] = [
  {
    id: "vb-545",
    trichYeu: "Thông báo phân công thẩm phán – Tòa Dân sự",
    loaiVanBan: "Thông báo phân công", donViSoanThao: "Tòa Dân sự",
    soVanBan: "125/2026/TTr-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "02/08/2026",
    trangThai: "BiTraLai", nguoiTao: "Vũ Văn Yên",
    luongKy: luongToTrinhPhanCong(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 2,
    phienBan: [
      { so: 1, noiDung: ND_545_V1, nguoiSua: "Vũ Văn Yên", thoiGian: "02/08/2026 09:12" },
      { so: 2, noiDung: ND_545_V2, nguoiSua: "Nguyễn Văn Hùng", thoiGian: "03/08/2026 08:05" },
    ],
    lichSu: [
      { vongTrinh: 1, thoiGian: "02/08/2026 09:12", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "02/08/2026 09:13", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "LaySoTam" },
      { vongTrinh: 1, thoiGian: "02/08/2026 10:40", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh" },
      { vongTrinh: 1, thoiGian: "03/08/2026 08:05", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng",
        hanhDong: "SuaVaDuyet", yKien: "Điều chỉnh căn cứ pháp lý tại mục 2.", phienBanTruoc: 1, phienBanSau: 2 },
      { vongTrinh: 1, thoiGian: "03/08/2026 16:30", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng",
        hanhDong: "TraLai", yKien: "Thiếu căn cứ phân công cho đơn Mã 7021. Bổ sung biên bản họp trước khi trình lại." },
    ],
    donDinhKem: [
      { ma: "Mã 7022", nguoiGui: "Hoàng Minh Tú", soBA: "112/2026/DS-GDT", hinhThuc: "Đơn đề nghị GĐT/TT" },
      { ma: "Mã 7021", nguoiGui: "Phạm Thị Ngọc", soBA: "89/2025/HS-GDT", hinhThuc: "CV Kiến nghị GĐT, TT" },
      { ma: "Mã 7032", nguoiGui: "Trần Văn Bình", soBA: "33/2024/KDTM-PT", hinhThuc: "Đơn đề nghị GĐT/TT" },
    ],
  },
  {
    id: "vb-547",
    trichYeu: "Công văn chuyển đơn sang Tòa án nhân dân thành phố Hà Nội",
    loaiVanBan: "Công văn chuyển tòa khác", donViSoanThao: "Tòa Dân sự",
    soVanBan: "127/2026/CV-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "05/08/2026",
    trangThai: "BiTraLai", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 2, phienBanHienTai: 2,
    phienBan: [
      { so: 1, noiDung: "Kính gửi: Tòa án nhân dân thành phố Hà Nội\nChuyển đơn đề nghị giám đốc thẩm số 89/2025/KDTM-GDT\nđể giải quyết theo thẩm quyền.", nguoiSua: "Vũ Văn Yên", thoiGian: "05/08/2026 10:02" },
      { so: 2, noiDung: "Kính gửi: Tòa án nhân dân thành phố Hà Nội\nChuyển đơn đề nghị giám đốc thẩm số 89/2025/KDTM-GDT\nkèm toàn bộ tài liệu để giải quyết theo thẩm quyền.", nguoiSua: "Vũ Văn Yên", thoiGian: "05/08/2026 15:40" },
    ],
    lichSu: [
      { vongTrinh: 1, thoiGian: "05/08/2026 10:02", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "05/08/2026 10:05", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh" },
      { vongTrinh: 1, thoiGian: "05/08/2026 14:10", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng",
        hanhDong: "TraLai", yKien: "Sai thẩm quyền chuyển. Kiểm tra lại địa hạt trước khi trình lại." },
      { vongTrinh: 2, thoiGian: "05/08/2026 15:40", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ",
        hanhDong: "Trinh", phienBanTruoc: 1, phienBanSau: 2 },
      { vongTrinh: 2, thoiGian: "05/08/2026 16:12", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng",
        hanhDong: "TraLai", yKien: "Vẫn chưa đính kèm quyết định thụ lý. Bổ sung rồi trình lại." },
    ],
    donDinhKem: [{ ma: "Mã 7034", nguoiGui: "Công ty TNHH Minh Đức", soBA: "89/2025/KDTM-GDT", hinhThuc: "Đơn đề nghị GĐT/TT" }],
  },
  {
    id: "vb-nhap-1",
    trichYeu: "Công văn chuyển hồ sơ giải quyết nội bộ vụ án dân sự",
    loaiVanBan: "Công văn chuyển nội bộ", donViSoanThao: "Tòa Dân sự",
    trangThai: "Nhap", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Kính gửi: Vụ Pháp chế và Quản lý khoa học\nChuyển hồ sơ vụ án dân sự số 112/2026/DS-GDT\nđể phối hợp giải quyết.", nguoiSua: "Vũ Văn Yên", thoiGian: "05/08/2026 09:40" }],
    lichSu: [{ vongTrinh: 1, thoiGian: "05/08/2026 09:40", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 }],
    donDinhKem: [],
  },
  {
    id: "vb-546",
    trichYeu: "Tờ trình đề xuất chi phí giám định tư pháp bổ sung",
    loaiVanBan: "Tờ trình khác", donViSoanThao: "Phòng GĐKT, TT & THA",
    soVanBan: "126/2026/TTr-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "03/08/2026",
    trangThai: "ChoDuyet", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Mục 1. Căn cứ\nCăn cứ Luật Giám định tư pháp năm 2020;\n\nMục 2. Đề xuất\nKính trình phê duyệt chi phí giám định tư pháp bổ sung\nđối với yêu cầu giám định tài chính doanh nghiệp.", nguoiSua: "Vũ Văn Yên", thoiGian: "03/08/2026 08:15" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "03/08/2026 08:15", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "03/08/2026 08:20", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "LaySoTam" },
      { vongTrinh: 1, thoiGian: "03/08/2026 08:22", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh" },
    ],
    donDinhKem: [{ ma: "Mã 7038", nguoiGui: "Đỗ Thu Trang", soBA: "15/2026/HC-GDT", hinhThuc: "Yêu cầu giám định" }],
  },
  {
    id: "vb-544",
    trichYeu: "Thông báo phân công Thẩm phán Nguyễn Như Thắng",
    loaiVanBan: "Thông báo phân công TP", donViSoanThao: "Tòa Dân sự",
    soVanBan: "124/2026/TB-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "01/08/2026",
    trangThai: "ChoKy", nguoiTao: "Vũ Văn Yên",
    luongKy: [
      { ...luong3()[0], ketQua: "da_duyet", thoiGian: "01/08/2026 14:00" },
      { ...luong3()[1], ketQua: "da_duyet", thoiGian: "02/08/2026 09:30" },
      { ...luong3()[2] },
    ],
    buocHienTai: 2, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Thông báo phân công Thẩm phán Nguyễn Như Thắng\nchủ trì giải quyết vụ án dân sự số 112/2026/DS-GDT.", nguoiSua: "Vũ Văn Yên", thoiGian: "01/08/2026 08:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "01/08/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "01/08/2026 08:05", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "LaySoTam" },
      { vongTrinh: 1, thoiGian: "01/08/2026 08:10", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh" },
      { vongTrinh: 1, thoiGian: "01/08/2026 14:00", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", hanhDong: "Duyet" },
      { vongTrinh: 1, thoiGian: "02/08/2026 09:30", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", hanhDong: "Duyet" },
    ],
    donDinhKem: [
      { ma: "Mã 7031", nguoiGui: "Tòa án nhân dân khu vực 4 - Hà Nội", soBA: "BA_2107", hinhThuc: "Công văn kiến nghị" },
    ],
  },
  {
    id: "vb-551",
    trichYeu: "Tờ trình đề xuất chi phí giám định tư pháp quý III",
    loaiVanBan: "Tờ trình khác", donViSoanThao: "Văn phòng",
    soVanBan: "131/2026/TTr-TAHN-VP", trangThaiSo: "chinhThuc",
    ngayCapSo: "06/08/2026", ngayBanHanh: "06/08/2026",
    trangThai: "DaBanHanh", nguoiTao: "Vũ Văn Yên",
    luongKy: [
      { ...luong3()[0], ketQua: "da_duyet", thoiGian: "05/08/2026 10:00" },
      { ...luong3()[1], ketQua: "da_duyet", thoiGian: "06/08/2026 09:00" },
      { ...luong3()[2], ketQua: "da_ky", thoiGian: "06/08/2026 14:20" },
    ],
    buocHienTai: 2, vongTrinh: 2, phienBanHienTai: 2,
    phienBan: [
      { so: 1, noiDung: "Mục 1. Căn cứ\nCăn cứ dự toán ngân sách năm 2026;\n\nMục 2. Đề xuất\nKính trình phê duyệt chi phí giám định quý III.", nguoiSua: "Vũ Văn Yên", thoiGian: "04/08/2026 08:00" },
      { so: 2, noiDung: "Mục 1. Căn cứ\nCăn cứ dự toán ngân sách năm 2026;\nCăn cứ Thông tư 215/2015/TT-BTC;\n\nMục 2. Đề xuất\nKính trình phê duyệt chi phí giám định quý III\ntheo bảng kê chi tiết đính kèm.", nguoiSua: "Nguyễn Văn Hùng", thoiGian: "05/08/2026 10:00" },
    ],
    lichSu: [
      { vongTrinh: 1, thoiGian: "01/08/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "01/08/2026 09:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh" },
      { vongTrinh: 1, thoiGian: "02/08/2026 11:00", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng",
        hanhDong: "TraLai", yKien: "Thiếu bảng kê chi tiết. Bổ sung rồi trình lại." },
      { vongTrinh: 2, thoiGian: "04/08/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh" },
      { vongTrinh: 2, thoiGian: "05/08/2026 10:00", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng",
        hanhDong: "SuaVaDuyet", yKien: "Bổ sung căn cứ Thông tư 215/2015/TT-BTC.", phienBanTruoc: 1, phienBanSau: 2 },
      { vongTrinh: 2, thoiGian: "06/08/2026 09:00", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", hanhDong: "Duyet" },
      { vongTrinh: 2, thoiGian: "06/08/2026 14:20", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", hanhDong: "Ky" },
    ],
    donDinhKem: [],
  },
  {
    id: "vb-541",
    trichYeu: "Quyết định trả lại đơn đề nghị giám đốc thẩm do hết thời hạn",
    loaiVanBan: "Trả lại đơn", donViSoanThao: "Tòa Dân sự",
    soVanBan: "121/2026/QĐ-TAHN", trangThaiSo: "chinhThuc",
    ngayCapSo: "30/07/2026", ngayBanHanh: "04/08/2026",
    trangThai: "DaBanHanh", nguoiTao: "Vũ Văn Yên",
    luongKy: [
      { ...luong3()[0], ketQua: "da_duyet", thoiGian: "31/07/2026 10:00" },
      { ...luong3()[1], ketQua: "da_duyet", thoiGian: "03/08/2026 09:00" },
      { ...luong3()[2], ketQua: "da_ky", thoiGian: "04/08/2026 08:30" },
    ],
    buocHienTai: 2, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Quyết định trả lại đơn đề nghị giám đốc thẩm số 54682577\ndo nộp quá thời hạn quy định tại Điều 329 BLTTDS.", nguoiSua: "Vũ Văn Yên", thoiGian: "30/07/2026 08:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "30/07/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "30/07/2026 08:10", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "LaySoTam" },
      { vongTrinh: 1, thoiGian: "30/07/2026 08:15", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh" },
      { vongTrinh: 1, thoiGian: "31/07/2026 10:00", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", hanhDong: "Duyet" },
      { vongTrinh: 1, thoiGian: "03/08/2026 09:00", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", hanhDong: "Duyet" },
      { vongTrinh: 1, thoiGian: "04/08/2026 08:30", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", hanhDong: "Ky" },
      { vongTrinh: 1, thoiGian: "04/08/2026 09:00", nguoi: "Phạm Thị Lan", chucVu: "Văn thư", hanhDong: "BanHanh" },
    ],
    donDinhKem: [],
  },
  {
    id: "vb-549",
    trichYeu: "Tờ trình đề xuất kinh phí giám định tư pháp quý III (đã bỏ)",
    loaiVanBan: "Tờ trình khác", donViSoanThao: "Văn phòng",
    soVanBan: "129/2026/TTr-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "23/07/2026",
    trangThai: "DaHuy", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Nội dung đã huỷ.", nguoiSua: "Vũ Văn Yên", thoiGian: "23/07/2026 08:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "23/07/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "23/07/2026 08:05", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "LaySoTam" },
    ],
    donDinhKem: [],
  },

  // ── Dữ liệu cho màn Phê duyệt đề xuất ──────────────────────────────────────
  // Các tab ở màn đó lọc THEO NGƯỜI ĐANG ĐĂNG NHẬP, nên phải có bản ghi riêng
  // cho từng vai trò duyệt thì đổi vai trò mới thấy đủ tab:
  //   Chờ duyệt      — đang dừng đúng ở bước của người đó
  //   Sắp đến lượt   — đang ở người khác, người đó nằm ở bước phía sau
  //   Đã duyệt       — lịch sử có mốc Duyet/Ky/ButPhe của người đó
  //   Từ chối        — lịch sử có mốc TraLai của người đó

  // Trưởng phòng: CHỜ DUYỆT (bước 1 của luồng 3 bước)
  {
    id: "vb-560",
    trichYeu: "Thông báo phân công thẩm phán – Tòa Hình sự",
    loaiVanBan: "Thông báo phân công", donViSoanThao: "Tòa Hình sự",
    soVanBan: "140/2026/TTr-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "05/08/2026",
    trangThai: "ChoDuyet", nguoiTao: "Vũ Văn Yên",
    luongKy: luongToTrinhPhanCong(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Kính trình phân công Thẩm phán giải quyết 04 đơn đề nghị GĐT.", nguoiSua: "Vũ Văn Yên", thoiGian: "05/08/2026 08:10" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "05/08/2026 08:10", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "05/08/2026 08:25", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh", yKien: "Kính trình Trưởng phòng xem xét, các đơn đều đã đủ điều kiện thụ lý." },
    ],
    donDinhKem: [{ ma: "Mã 7031", nguoiGui: "TAND khu vực 4 - Hà Nội", soBA: "BA_2107", hinhThuc: "CV kiến nghị GĐT, TT" }],
  },
  // Phó CVP: CHỜ DUYỆT (bước 2) · Trưởng phòng: ĐÃ DUYỆT · Chánh án: SẮP ĐẾN LƯỢT
  {
    id: "vb-561",
    trichYeu: "Thông báo phân công thẩm phán – Tòa Dân sự",
    loaiVanBan: "Thông báo phân công", donViSoanThao: "Tòa Dân sự",
    soVanBan: "141/2026/TTr-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "04/08/2026",
    trangThai: "ChoKy", nguoiTao: "Vũ Văn Yên",
    luongKy: luongToTrinhPhanCong().map((b, i) =>
      i === 0 ? { ...b, ketQua: "da_duyet" as const, thoiGian: "04/08/2026 14:30" } : b),
    buocHienTai: 1, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Kính trình phân công Thẩm phán giải quyết 06 đơn đề nghị GĐT.", nguoiSua: "Vũ Văn Yên", thoiGian: "04/08/2026 09:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "04/08/2026 09:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "04/08/2026 09:12", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh", yKien: "Trình duyệt danh sách phân công tháng 8." },
      { vongTrinh: 1, thoiGian: "04/08/2026 14:30", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", hanhDong: "Duyet", yKien: "Nhất trí danh sách phân công, đề nghị PCVP ký ban hành." },
    ],
    donDinhKem: [{ ma: "Mã 7029", nguoiGui: "TAND thành phố Hà Nội", soBA: "917", hinhThuc: "CV kiến nghị GĐT, TT" }],
  },
  // Chánh án: CHỜ DUYỆT (bút phê) · Trưởng phòng + Phó CVP: ĐÃ DUYỆT
  {
    id: "vb-562",
    trichYeu: "Thông báo phân công thẩm phán – Tòa Hành chính",
    loaiVanBan: "Thông báo phân công", donViSoanThao: "Tòa Hành chính",
    soVanBan: "142/2026/TTr-TAHN-VP", trangThaiSo: "chinhThuc", ngayCapSo: "03/08/2026",
    trangThai: "ChoButPhe", nguoiTao: "Vũ Văn Yên",
    luongKy: luongToTrinhPhanCong().map((b, i) =>
      i === 0 ? { ...b, ketQua: "da_duyet" as const, thoiGian: "03/08/2026 10:05" }
        : i === 1 ? { ...b, ketQua: "da_ky" as const, thoiGian: "03/08/2026 15:40" } : b),
    buocHienTai: 2, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Kính trình phân công Thẩm phán giải quyết 03 đơn hành chính.", nguoiSua: "Vũ Văn Yên", thoiGian: "03/08/2026 08:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "03/08/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "03/08/2026 08:30", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh", yKien: "Trình phân công 03 đơn án hành chính." },
      { vongTrinh: 1, thoiGian: "03/08/2026 10:05", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", hanhDong: "Duyet", yKien: "Đồng ý, đề nghị lãnh đạo xem xét." },
      { vongTrinh: 1, thoiGian: "03/08/2026 15:40", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", hanhDong: "Ky", yKien: "Đã ký số, chuyển Phó Chánh án bút phê." },
    ],
    donDinhKem: [{ ma: "Mã 7040", nguoiGui: "TAND Quận Hoàn Kiếm", soBA: "22/2024/HC-PT", hinhThuc: "Đơn đề nghị GĐT/TT" }],
  },
  // ĐÃ DUYỆT cho cả 3 vai trò — đi hết luồng
  {
    id: "vb-563",
    trichYeu: "Thông báo phân công thẩm phán – Tòa Lao động",
    loaiVanBan: "Thông báo phân công", donViSoanThao: "Tòa Lao động",
    soVanBan: "143/2026/TTr-TAHN-VP", trangThaiSo: "chinhThuc", ngayCapSo: "01/08/2026",
    trangThai: "DaBanHanh", nguoiTao: "Vũ Văn Yên",
    luongKy: luongToTrinhPhanCong().map((b, i) => ({
      ...b,
      ketQua: (i === 0 ? "da_duyet" : i === 1 ? "da_ky" : "da_but_phe") as "da_duyet" | "da_ky" | "da_but_phe",
      thoiGian: ["01/08/2026 09:20", "01/08/2026 11:00", "01/08/2026 16:10"][i],
    })),
    buocHienTai: 2, vongTrinh: 1, phienBanHienTai: 1, ngayBanHanh: "01/08/2026",
    phienBan: [{ so: 1, noiDung: "Kính trình phân công Thẩm phán giải quyết 05 đơn lao động.", nguoiSua: "Vũ Văn Yên", thoiGian: "01/08/2026 08:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "01/08/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "01/08/2026 08:40", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh", yKien: "Trình phân công 05 đơn lao động." },
      { vongTrinh: 1, thoiGian: "01/08/2026 09:20", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", hanhDong: "Duyet", yKien: "Nhất trí." },
      { vongTrinh: 1, thoiGian: "01/08/2026 11:00", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", hanhDong: "Ky", yKien: "Ký ban hành." },
      { vongTrinh: 1, thoiGian: "01/08/2026 16:10", nguoi: "Đặng Quốc Trung", chucVu: "Phó Chánh án", hanhDong: "ButPhe", yKien: "Đồng ý phân công. Yêu cầu báo cáo tiến độ giải quyết trước 30/9." },
    ],
    donDinhKem: [{ ma: "Mã 7037", nguoiGui: "Hoàng Văn Thịnh", soBA: "62/2021/LĐ-PT", hinhThuc: "Đơn đề nghị GĐT, TT" }],
  },
  // TỪ CHỐI — Trưởng phòng trả lại
  {
    id: "vb-564",
    trichYeu: "Tờ trình đề xuất bổ sung kinh phí xác minh tại địa phương",
    loaiVanBan: "Tờ trình khác", donViSoanThao: "Văn phòng",
    soVanBan: "144/2026/TTr-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "02/08/2026",
    trangThai: "BiTraLai", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Đề xuất bổ sung 45 triệu đồng kinh phí xác minh tại Hà Nội.", nguoiSua: "Vũ Văn Yên", thoiGian: "02/08/2026 08:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "02/08/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "02/08/2026 08:30", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh", yKien: "Trình duyệt kinh phí xác minh." },
      { vongTrinh: 1, thoiGian: "02/08/2026 10:15", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", hanhDong: "TraLai", yKien: "Thiếu dự toán chi tiết và căn cứ định mức. Đề nghị bổ sung rồi trình lại." },
    ],
    donDinhKem: [],
  },
  // TỪ CHỐI — Phó CVP trả lại sau khi Trưởng phòng đã duyệt
  {
    id: "vb-565",
    trichYeu: "Tờ trình đề xuất mua sắm thiết bị số hoá hồ sơ",
    loaiVanBan: "Tờ trình khác", donViSoanThao: "Văn phòng",
    soVanBan: "145/2026/TTr-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "31/07/2026",
    trangThai: "BiTraLai", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 1, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Đề xuất mua 10 máy quét khổ A3 phục vụ số hoá hồ sơ.", nguoiSua: "Vũ Văn Yên", thoiGian: "31/07/2026 09:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "31/07/2026 09:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "31/07/2026 09:30", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh", yKien: "Trình duyệt mua sắm thiết bị." },
      { vongTrinh: 1, thoiGian: "31/07/2026 14:00", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", hanhDong: "Duyet", yKien: "Nhất trí về chủ trương." },
      { vongTrinh: 1, thoiGian: "31/07/2026 16:45", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", hanhDong: "TraLai", yKien: "Chưa có trong kế hoạch mua sắm năm 2026, đề nghị rà soát lại nguồn vốn." },
    ],
    donDinhKem: [],
  },
  // TỪ CHỐI — Phó Chánh án trả lại ở bước bút phê
  {
    id: "vb-567",
    trichYeu: "Thông báo phân công thẩm phán – Tòa Kinh tế",
    loaiVanBan: "Thông báo phân công", donViSoanThao: "Tòa Kinh tế",
    soVanBan: "147/2026/TTr-TAHN-VP", trangThaiSo: "chinhThuc", ngayCapSo: "30/07/2026",
    trangThai: "BiTraLai", nguoiTao: "Vũ Văn Yên",
    luongKy: luongToTrinhPhanCong().map((b, i) =>
      i === 0 ? { ...b, ketQua: "da_duyet" as const, thoiGian: "30/07/2026 10:00" }
        : i === 1 ? { ...b, ketQua: "da_ky" as const, thoiGian: "30/07/2026 14:20" } : b),
    buocHienTai: 2, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Kính trình phân công Thẩm phán giải quyết 02 đơn KDTM.", nguoiSua: "Vũ Văn Yên", thoiGian: "30/07/2026 08:30" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "30/07/2026 08:30", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "30/07/2026 09:10", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh", yKien: "Trình phân công 02 đơn kinh doanh thương mại." },
      { vongTrinh: 1, thoiGian: "30/07/2026 10:00", nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", hanhDong: "Duyet", yKien: "Nhất trí." },
      { vongTrinh: 1, thoiGian: "30/07/2026 14:20", nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", hanhDong: "Ky", yKien: "Đã ký, trình Phó Chánh án bút phê." },
      { vongTrinh: 1, thoiGian: "30/07/2026 17:05", nguoi: "Đặng Quốc Trung", chucVu: "Phó Chánh án", hanhDong: "TraLai", yKien: "Thẩm phán được đề xuất đang quá tải 12 vụ. Đề nghị phân công lại cho thẩm phán khác." },
    ],
    donDinhKem: [{ ma: "Mã 7042", nguoiGui: "TAND TP Từ Sơn", soBA: "33/2024/KDTM-PT", hinhThuc: "Đơn đề nghị GĐT/TT" }],
  },
  // SẮP ĐẾN LƯỢT của Phó CVP — đang dừng ở Trưởng phòng
  {
    id: "vb-566",
    trichYeu: "Tờ trình đề xuất điều chỉnh lịch xét xử giám đốc thẩm quý IV",
    loaiVanBan: "Tờ trình khác", donViSoanThao: "Văn phòng",
    soVanBan: "146/2026/TTr-TAHN-VP", trangThaiSo: "tam", ngayCapSo: "06/08/2026",
    trangThai: "ChoDuyet", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Đề xuất dời 03 phiên giám đốc thẩm sang tháng 11.", nguoiSua: "Vũ Văn Yên", thoiGian: "06/08/2026 08:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "06/08/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "06/08/2026 08:20", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Trinh", yKien: "Trình xin điều chỉnh lịch xét xử." },
    ],
    donDinhKem: [],
  },
];

// ─── Diff theo dòng (LCS) ────────────────────────────────────────────────────
type DongDiff = { loai: "ctx" | "add" | "del"; text: string };

function dienDiff(truoc: string, sau: string): DongDiff[] {
  const a = truoc.split("\n"), b = sau.split("\n");
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DongDiff[] = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { out.push({ loai: "ctx", text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ loai: "del", text: a[i] }); i++; }
    else { out.push({ loai: "add", text: b[j] }); j++; }
  }
  while (i < m) out.push({ loai: "del", text: a[i++] });
  while (j < n) out.push({ loai: "add", text: b[j++] });
  return out;
}

// ─── Màn so sánh phiên bản ───────────────────────────────────────────────────
const SoSanhPhienBan = ({ vb, moc, onClose }: { vb: VanBanTrinh; moc: MocLichSu; onClose: () => void }) => {
  const pbTruoc = vb.phienBan.find(p => p.so === moc.phienBanTruoc);
  const pbSau = vb.phienBan.find(p => p.so === moc.phienBanSau);

  if (!pbTruoc || !pbSau) {
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-white rounded-[6px] w-[560px] overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="bg-tertiary text-white px-4 py-2.5 flex items-center justify-between">
            <div className="text-[15px] font-bold">So sánh phiên bản</div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><X size={16} /></button>
          </div>
          <div className="py-11 px-4 text-center text-[12px] text-on-surface-variant">
            <ArrowLeftRight size={26} className="mx-auto mb-2.5 opacity-30" />
            Đây là phiên bản đầu tiên, không có bản trước để so sánh.
          </div>
          <div className="border-t border-surface-container-highest px-4 py-3 flex justify-end">
            <BtnNeutral onClick={onClose}>Đóng</BtnNeutral>
          </div>
        </div>
      </div>
    );
  }

  const dong = dienDiff(pbTruoc.noiDung, pbSau.noiDung);
  const them = dong.filter(d => d.loai === "add").length;
  const xoa = dong.filter(d => d.loai === "del").length;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-[6px] w-[900px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="bg-tertiary text-white px-4 py-2.5 flex items-start justify-between flex-shrink-0">
          <div>
            <div className="text-[15px] font-bold">So sánh phiên bản</div>
            <div className="text-[11px] opacity-70 mt-0.5 font-mono">{vb.soVanBan ?? "— chưa số —"}</div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={16} /></button>
        </div>

        <div className="px-4 py-3 border-b border-surface-container-highest bg-surface-bright flex-shrink-0">
          <div className="flex items-center gap-2.5 text-[12px]">
            <span className="h-[28px] px-2.5 inline-flex items-center border border-surface-container-highest rounded-[3px] bg-white font-medium">v{pbTruoc.so}</span>
            <span className="text-on-surface-variant">→</span>
            <span className="h-[28px] px-2.5 inline-flex items-center border border-surface-container-highest rounded-[3px] bg-white font-medium">v{pbSau.so}</span>
            <span className="ml-auto text-[11px] text-on-surface-variant">
              {moc.nguoi} · {moc.chucVu} · {moc.thoiGian} · {HANH_DONG_NHAN[moc.hanhDong]}
            </span>
          </div>
          {moc.yKien && (
            <div className="mt-2.5 bg-error-container border-l-[3px] border-error rounded-[3px] px-3 py-2 text-[12px] leading-relaxed">
              💬 “{moc.yKien}”
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-1.5 text-[12px] leading-[1.7]">
          {dong.map((d, i) => (
            <div key={i} className={`flex items-start pr-4
              ${d.loai === "add" ? "bg-[#e8f7ee]" : d.loai === "del" ? "bg-[#fdeaea]" : ""}`}>
              <div className={`w-[34px] flex-shrink-0 text-center font-mono select-none
                ${d.loai === "add" ? "text-[#1a7a45] font-bold" : d.loai === "del" ? "text-error font-bold" : "text-[#bbb]"}`}>
                {d.loai === "add" ? "+" : d.loai === "del" ? "−" : ""}
              </div>
              <div className={`flex-1 px-2 py-[2px] whitespace-pre-wrap
                ${d.loai === "add" ? "text-[#1a7a45]" : d.loai === "del" ? "text-error" : "text-on-surface"}
                ${d.text.startsWith("Mục ") ? "font-semibold" : ""}`}>
                {d.text || " "}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-container-highest px-4 py-3 flex items-center gap-3.5 text-[11px] text-on-surface-variant flex-shrink-0">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#e8f7ee] border border-[#a9debb] inline-block" /> {them} dòng thêm
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#fdeaea] border border-error-container inline-block" /> {xoa} dòng xoá
          </span>
          <span className="ml-auto"><BtnNeutral onClick={onClose}>Đóng</BtnNeutral></span>
        </div>
      </div>
    </div>
  );
};

// ─── Stepper luồng ký ────────────────────────────────────────────────────────
const Stepper = ({ vb }: { vb: VanBanTrinh }) => {
  const voHieu = vb.trangThai === "BiTraLai";
  const xong = ["DaBanHanh"].includes(vb.trangThai);
  // Nhãn bước lấy theo VAI TRÒ trước, chỉ khi là bước duyệt mới phân biệt
  // Trưởng phòng / PCVP. Trước đây nhãn suy từ chức vụ nên bước ký của PCVP
  // vẫn ra "PCVP duyệt" — sai với luồng thông báo phân công.
  const nhanBuoc = (b: BuocKy) => {
    if (b.vaiTro === "ky") return "Ký số";
    if (b.vaiTro === "but_phe") return "Bút phê";
    return b.chucVu.includes("Trưởng phòng") ? "TP duyệt" : "PCVP duyệt";
  };
  const buoc = [
    { nhan: "Tạo", chuThich: "Cán bộ", xong: true, hienTai: false },
    ...vb.luongKy.map((b, i) => ({
      nhan: nhanBuoc(b),
      chuThich: b.chucVu,
      xong: daXong(b),
      hienTai: !voHieu && !xong && vb.buocHienTai === i && vb.trangThai !== "Nhap",
    })),
  ];

  return (
    <div className="mb-1">
      <div className="flex items-start bg-surface-bright border border-surface-container rounded-[4px] py-3 px-1">
        {buoc.map((b, i) => (
          <div key={i} className="flex-1 text-center relative text-[11px]"
            style={{ color: voHieu ? "#999" : b.xong || b.hienTai ? "#333" : "#666" }}>
            {i > 0 && <div className="absolute top-[5px] left-[-50%] w-full h-px bg-surface-container-highest" />}
            <div className="relative z-[1] mx-auto mb-1.5 rounded-full"
              style={{
                width: b.hienTai ? 12 : 10, height: b.hienTai ? 12 : 10,
                background: voHieu ? "#999" : b.hienTai ? "#fff" : b.xong ? "#27ae60" : "#ccc",
                border: b.hienTai ? "2px solid #e67e22" : "none",
              }} />
            <div className={b.hienTai ? "font-semibold" : ""}>{b.nhan}</div>
            <div className="text-[10px] text-outline leading-tight mt-0.5 px-1">{b.chuThich}</div>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-on-surface-variant text-right px-2 pt-1">
        {voHieu ? `Vòng ${vb.vongTrinh} · phê duyệt đã vô hiệu`
          : xong ? `Hoàn tất · Vòng ${vb.vongTrinh}`
          : vb.trangThai === "Nhap" ? "Chưa trình — luồng ký chưa bắt đầu"
          : `Vòng ${vb.vongTrinh} · bước ${vb.buocHienTai + 1}/${vb.luongKy.length}`}
      </div>
    </div>
  );
};

// ─── Tab Lịch sử & Ý kiến ────────────────────────────────────────────────────
const TabLichSu = ({ vb, onXemThayDoi }: { vb: VanBanTrinh; onXemThayDoi: (m: MocLichSu) => void }) => {
  const vongMax = Math.max(...vb.lichSu.map(m => m.vongTrinh), 1);
  const [dong, setDong] = useState<Record<number, boolean>>({});

  const theoVong = useMemo(() => {
    const map = new Map<number, MocLichSu[]>();
    vb.lichSu.forEach(m => {
      if (!map.has(m.vongTrinh)) map.set(m.vongTrinh, []);
      map.get(m.vongTrinh)!.push(m);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [vb]);

  return (
    <div>
      <Stepper vb={vb} />
      <div className="mt-4 space-y-3.5">
        {theoVong.map(([vong, mocs]) => {
          const laVongCuoi = vong === vongMax;
          const voHieu = !laVongCuoi;   // vòng cũ ⇒ phê duyệt trong đó mất hiệu lực
          const mo = dong[vong] ?? laVongCuoi;
          const coTraLai = mocs.some(m => m.hanhDong === "TraLai");

          return (
            <div key={vong}>
              <div onClick={() => setDong(s => ({ ...s, [vong]: !mo }))}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-[3px] cursor-pointer text-[12px]
                  ${voHieu ? "bg-surface-bright text-outline font-medium" : "bg-surface-container-low text-on-surface font-semibold"}`}>
                <span className="flex items-center gap-1.5">
                  {mo ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  Vòng {vong}
                  {voHieu ? <span className="font-normal"> · đã vô hiệu</span>
                          : <span className="font-normal text-on-surface-variant"> (hiện tại)</span>}
                  {!mo && <span className="font-normal text-[11px] ml-1">— {mocs.length} mốc, bấm để mở</span>}
                </span>
                {laVongCuoi
                  ? <Pill tt={vb.trangThai} nhan={vb.trangThai === "ChoDuyet"
                      ? `Chờ duyệt · bước ${vb.buocHienTai + 1}/${vb.luongKy.length}` : undefined} />
                  : coTraLai ? <Pill tt="BiTraLai" /> : null}
              </div>

              {mo && (
                <div className="mt-2.5 ml-1.5 border-l border-surface-container-highest pl-4">
                  {mocs.map((m, i) => (
                    <div key={i} className="relative pb-4 last:pb-0.5">
                      <span className="absolute left-[-21px] top-1 w-2 h-2 rounded-full border-2 border-white"
                        style={{ background: voHieu ? "#999" : m.hanhDong === "TraLai" ? "#c0392b" : "#27ae60" }} />
                      <div className="text-[11px] text-on-surface-variant">
                        {m.thoiGian}
                        <b className={`ml-1.5 text-[12px] font-medium ${voHieu ? "text-outline" : "text-on-surface"}`}>{m.nguoi}</b>
                        <span className="text-on-surface-variant"> · {m.chucVu}</span>
                      </div>
                      <div className={`text-[12px] mt-0.5 flex items-center gap-2 ${voHieu ? "text-outline" : "text-on-surface"}`}>
                        {m.hanhDong === "TraLai" && <span>⛔</span>}
                        {m.hanhDong === "SuaVaDuyet" && <span>✏️</span>}
                        {HANH_DONG_NHAN[m.hanhDong]}
                        {m.hanhDong === "LaySoTam" && vb.soVanBan && (
                          <span className="font-mono">{vb.soVanBan.split("/")[0]}</span>)}
                        {m.phienBanSau !== undefined && (
                          <span className="text-[10px] text-on-surface-variant border border-surface-container-highest rounded-[2px] px-1 font-mono">
                            {m.phienBanTruoc !== undefined ? `v${m.phienBanTruoc} → v${m.phienBanSau}` : `v${m.phienBanSau}`}
                          </span>
                        )}
                      </div>

                      {m.yKien && (
                        <div className="mt-1.5 rounded-[3px] px-3 py-2 text-[12px] leading-relaxed border-l-[3px]"
                          style={{
                            background: voHieu ? "#fafafa" : "#fde8e8",
                            borderLeftColor: voHieu ? "#999" : "#8b1a1a",
                            color: voHieu ? "#999" : "#333",
                          }}>
                          💬 “{m.yKien}”
                        </div>
                      )}

                      {/* Không có thảo luận 2 chiều ⇒ nút này là kênh giao tiếp duy nhất. */}
                      {m.phienBanTruoc !== undefined && m.phienBanSau !== undefined && (
                        <button type="button" onClick={() => onXemThayDoi(m)}
                          className="mt-1.5 inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-[3px] border bg-white text-[11px] font-medium"
                          style={{ borderColor: voHieu ? "#999" : "#1a73e8", color: voHieu ? "#999" : "#1a73e8" }}>
                          <ArrowLeftRight size={11} /> Xem thay đổi
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Hộp thoại ───────────────────────────────────────────────────────────────
const KhungHopThoai = ({ tieuDe, children, chan, onClose, rong = 520 }: any) => (
  <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/50" onClick={onClose}>
    <div className="bg-white rounded-[6px] overflow-hidden shadow-2xl" style={{ width: rong }}
      onClick={(e: any) => e.stopPropagation()}>
      <div className="bg-tertiary text-white px-4 py-2.5 flex items-center justify-between">
        <div className="text-[15px] font-bold">{tieuDe}</div>
        <button onClick={onClose} className="text-white/70 hover:text-white"><X size={16} /></button>
      </div>
      <div className="p-4">{children}</div>
      <div className="border-t border-surface-container-highest px-4 py-3 flex justify-end gap-2">{chan}</div>
    </div>
  </div>
);

/** Trả lại — ý kiến BẮT BUỘC, tối thiểu 10 ký tự. */
const HopThoaiTraLai = ({ vb, onXacNhan, onClose }: {
  vb: VanBanTrinh; onXacNhan: (yKien: string) => void; onClose: () => void;
}) => {
  const [yKien, setYKien] = useState("");
  const hopLe = yKien.trim().length >= 10;
  return (
    <KhungHopThoai tieuDe="Trả lại văn bản" onClose={onClose}
      chan={<>
        <BtnNeutral onClick={onClose}>Huỷ</BtnNeutral>
        <BtnPrimary disabled={!hopLe} onClick={() => hopLe && onXacNhan(yKien.trim())}
          title={hopLe ? undefined : "Nhập ý kiến trả lại để tiếp tục"}>Xác nhận trả lại</BtnPrimary>
      </>}>
      <div className="text-[12px] leading-relaxed mb-3.5">
        <span className="font-mono font-medium">{vb.soVanBan ?? "— chưa số —"}</span><br />
        <span className="text-on-surface-variant">{vb.trichYeu}</span>
      </div>
      <label className="block text-[11px] font-medium mb-1.5">Ý kiến trả lại <span className="text-error">*</span></label>
      <textarea value={yKien} onChange={e => setYKien(e.target.value)} rows={4} autoFocus
        placeholder="Nhập ý kiến trả lại…"
        aria-describedby="loi-y-kien"
        className={`w-full border rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none
          ${hopLe ? "border-surface-container-highest focus:border-primary" : "border-error"}`} />
      <div id="loi-y-kien" className={`text-[11px] mt-1 ${hopLe ? "text-on-surface-variant" : "text-error"}`}>
        {hopLe ? `${yKien.trim().length} / tối thiểu 10 ký tự` : "Nhập ý kiến trả lại để tiếp tục."}
      </div>
      <div className="mt-3.5 bg-[#fef3e2] border border-[#fcd48a] text-[#b45309] rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          Văn bản sẽ về <b>{vb.nguoiTao}</b> và toàn bộ phê duyệt của Vòng {vb.vongTrinh} mất hiệu lực.
          Khi trình lại sẽ chạy lại từ bước 1.
        </div>
      </div>
    </KhungHopThoai>
  );
};

/** Ký số — nêu thẳng hai hệ quả không đảo ngược được. */
const HopThoaiKySo = ({ vb, soSeCap, onXacNhan, onClose }: {
  vb: VanBanTrinh; soSeCap: string; onXacNhan: () => void; onClose: () => void;
}) => (
  <KhungHopThoai tieuDe="Ký số văn bản" onClose={onClose}
    chan={<><BtnNeutral onClick={onClose}>Huỷ</BtnNeutral>
      <BtnPrimary onClick={onXacNhan}><PenLine size={13} /> Ký số</BtnPrimary></>}>
    <div className="text-[12px] leading-relaxed mb-3.5">
      <span className="font-mono font-medium">{vb.soVanBan ?? "— chưa số —"}</span><br />
      <span className="text-on-surface-variant">{vb.trichYeu}</span>
    </div>
    <div className="bg-info-container border border-surface-variant text-primary rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2">
      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
      <div>
        {vb.soVanBan
          ? <>Số <b className="font-mono">{vb.soVanBan}</b> sẽ chuyển từ <b>dự thảo</b> sang <b>chính thức</b>.</>
          : <>Hệ thống sẽ tự cấp số chính thức <b className="font-mono">{soSeCap}</b>.</>}
        {" "}Nội dung khoá vĩnh viễn sau bước này.
      </div>
    </div>
    <div className="mt-3.5">
      <label className="block text-[11px] font-medium mb-1.5">Chứng thư số</label>
      <select className="w-full h-[32px] border border-surface-container-highest rounded-[3px] px-2 text-[12px] bg-white">
        <option>USB Token – Đỗ Thu Trang</option>
      </select>
    </div>
  </KhungHopThoai>
);

/** Bút phê — bước cuối của thông báo phân công, do Chánh án/Phó Chánh án thực hiện.
 *  Khác Ký số: không cấp số, không dùng chứng thư số. Khác Duyệt: ý kiến BẮT BUỘC,
 *  vì bút phê chính là nội dung chỉ đạo ghi trên tờ trình. */
const HopThoaiButPhe = ({ vb, onXacNhan, onClose }: {
  vb: VanBanTrinh; onXacNhan: (yKien: string) => void; onClose: () => void;
}) => {
  const [yKien, setYKien] = useState("");
  const hopLe = yKien.trim().length >= 5;
  return (
    <KhungHopThoai tieuDe="Bút phê của lãnh đạo" onClose={onClose}
      chan={<><BtnNeutral onClick={onClose}>Huỷ</BtnNeutral>
        <BtnPrimary disabled={!hopLe} onClick={() => hopLe && onXacNhan(yKien.trim())}
          title={hopLe ? undefined : "Nhập nội dung bút phê để tiếp tục"}>
          <PenLine size={13} /> Bút phê
        </BtnPrimary></>}>
      <div className="text-[12px] leading-relaxed mb-3.5">
        <span className="font-mono font-medium">{vb.soVanBan ?? "— chưa số —"}</span><br />
        <span className="text-on-surface-variant">{vb.trichYeu}</span>
      </div>
      <label className="block text-[11px] font-medium mb-1.5">
        Nội dung bút phê <span className="text-error">*</span>
      </label>
      <textarea value={yKien} onChange={e => setYKien(e.target.value)} rows={4} autoFocus
        placeholder="Ví dụ: Đồng ý phân công theo đề nghị. Giao Vụ GĐKT&DS triển khai…"
        className={`w-full border rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none
          ${hopLe ? "border-surface-container-highest focus:border-primary" : "border-error"}`} />
      <div className={`text-[11px] mt-1 ${hopLe ? "text-on-surface-variant" : "text-error"}`}>
        {hopLe ? "Bút phê sẽ hiển thị ở tab Lịch sử & Ý kiến." : "Nhập nội dung bút phê để tiếp tục."}
      </div>
      <div className="mt-3.5 bg-tertiary-fixed border border-tertiary-fixed-dim text-on-tertiary-fixed-variant rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>Đây là bước cuối. Bút phê xong, tờ trình chuyển sang <b>Đã ký</b> và có thể phát hành.</div>
      </div>
    </KhungHopThoai>
  );
};

/** Duyệt — ô ý kiến tuỳ chọn gửi người ở bước sau.
 *  Đây là chỗ THAY THẾ ô "Nội dung trình duyệt ký" cũ: lời nhắn cho người ký
 *  do chính người duyệt viết, tại thời điểm duyệt, khi đã đọc bản mới nhất. */
const HopThoaiDuyet = ({ vb, onXacNhan, onClose }: {
  vb: VanBanTrinh; onXacNhan: (yKien: string) => void; onClose: () => void;
}) => {
  const [yKien, setYKien] = useState("");
  const tiep = vb.luongKy[vb.buocHienTai + 1];
  return (
    <KhungHopThoai tieuDe="Duyệt văn bản" onClose={onClose}
      chan={<><BtnNeutral onClick={onClose}>Huỷ</BtnNeutral>
        <BtnPrimary onClick={() => onXacNhan(yKien.trim())}><Check size={13} /> Duyệt</BtnPrimary></>}>
      <div className="text-[12px] leading-relaxed mb-3.5">
        <span className="font-mono font-medium">{vb.soVanBan ?? "— chưa số —"}</span><br />
        <span className="text-on-surface-variant">{vb.trichYeu}</span>
      </div>
      <label className="block text-[11px] font-medium mb-1.5">
        Ý kiến <span className="text-on-surface-variant font-normal">(tuỳ chọn)</span>
      </label>
      <textarea value={yKien} onChange={e => setYKien(e.target.value)} rows={3} autoFocus
        placeholder={tiep ? `Điều muốn lưu ý ${tiep.nguoi}…` : "Ghi chú khi duyệt…"}
        className="w-full border border-surface-container-highest rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none focus:border-primary" />
      <div className="mt-2.5 bg-info-container border border-surface-variant text-primary rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          {tiep
            ? <>Duyệt xong văn bản chuyển sang <b>{tiep.nguoi}</b> — {tiep.chucVu} ({tiep.vaiTro === "ky" ? "ký số" : tiep.vaiTro === "but_phe" ? "bút phê" : "duyệt"}).</>
            : <>Đây là bước cuối của luồng duyệt.</>}
        </div>
      </div>
    </KhungHopThoai>
  );
};

/** Sửa & duyệt — xác nhận rằng thay đổi sẽ hiện ra cho người tạo. */
const HopThoaiSuaVaDuyet = ({ vb, onXacNhan, onClose }: {
  vb: VanBanTrinh; onXacNhan: (yKien: string) => void; onClose: () => void;
}) => {
  const [yKien, setYKien] = useState("");
  const vMoi = Math.max(...vb.phienBan.map(p => p.so)) + 1;
  return (
    <KhungHopThoai tieuDe="Sửa & duyệt" onClose={onClose}
      chan={<><BtnNeutral onClick={onClose}>Huỷ</BtnNeutral>
        <BtnPrimary onClick={() => onXacNhan(yKien.trim())}><Check size={13} /> Xác nhận</BtnPrimary></>}>
      <div className="bg-info-container border border-surface-variant text-primary rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2 mb-3.5">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>Sẽ lưu thành phiên bản <b>v{vMoi}</b> và duyệt bước {vb.buocHienTai + 1}.
          <b> {vb.nguoiTao}</b> sẽ thấy được thay đổi này qua nút “Xem thay đổi”.</div>
      </div>
      <label className="block text-[11px] font-medium mb-1.5">Ý kiến <span className="text-on-surface-variant font-normal">(tuỳ chọn)</span></label>
      <textarea value={yKien} onChange={e => setYKien(e.target.value)} rows={3}
        placeholder="Nêu lý do chỉnh sửa…"
        className="w-full border border-surface-container-highest rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none focus:border-primary" />
    </KhungHopThoai>
  );
};

/** Tiến trình gọn — dùng ở bảng, nơi không đủ chỗ cho Stepper đầy đủ.
 *  Trả lời hai câu trong bốn dòng chữ: đi được bao xa, và đang tắc ở ai. */
export const TienTrinhGon = ({ vb }: { vb: VanBanTrinh }) => {
  const giu = nguoiDangGiu(vb);
  const voHieu = vb.trangThai === "BiTraLai";
  const xong = ["DaBanHanh"].includes(vb.trangThai);
  const buoc = [{ xong: true, hienTai: false }, ...vb.luongKy.map((b, i) => ({
    xong: b.ketQua === "da_duyet" || b.ketQua === "da_ky",
    hienTai: !voHieu && !xong && vb.buocHienTai === i && vb.trangThai !== "Nhap",
  }))];

  return (
    <div>
      <div className="flex items-center gap-[3px]">
        {buoc.map((b, i) => (
          <span key={i} className="flex items-center gap-[3px]">
            {i > 0 && <span className="w-2.5 h-px bg-surface-container inline-block" />}
            <span className="rounded-full inline-block"
              style={{
                width: b.hienTai ? 9 : 7, height: b.hienTai ? 9 : 7,
                background: voHieu ? "#c0392b" : b.hienTai ? "#fff" : b.xong ? "#27ae60" : "#d5d5d5",
                border: b.hienTai ? "2px solid #e67e22" : "none",
              }} />
          </span>
        ))}
        <span className="ml-1.5 text-[10px] text-on-surface-variant">
          {voHieu ? `Vòng ${vb.vongTrinh}`
            : xong ? "Hoàn tất"
            : vb.trangThai === "Nhap" ? "Chưa trình"
            : `${vb.buocHienTai + 1}/${vb.luongKy.length}`}
        </span>
      </div>
      <div className="text-[11px] mt-1 leading-snug">
        {giu
          ? <><span className="text-on-surface-variant">Đang ở </span><span className="font-medium text-on-surface">{giu.nguoi}</span></>
          : <span className="text-on-surface-variant">Không còn chờ ai</span>}
      </div>
    </div>
  );
};

// ─── Panel chi tiết — dùng chung cho mọi màn ─────────────────────────────────
export const PanelChiTiet = ({ vb, nguoiDung, chucVu, danhSach, onCapNhat, onClose }: {
  vb: VanBanTrinh; nguoiDung: string; chucVu: string;
  danhSach: VanBanTrinh[];
  onCapNhat: (vbMoi: VanBanTrinh) => void;
  onClose: () => void;
}) => {
  const [tab, setTab] = useState<"noidung" | "dinhkem" | "lichsu" | "banin">(
    vb.trangThai === "BiTraLai" ? "lichsu" : "noidung");
  const [mocDiff, setMocDiff] = useState<MocLichSu | null>(null);
  const [hopThoai, setHopThoai] = useState<"tralai" | "kyso" | "butphe" | "suaduyet" | "duyet" | null>(null);

  const pbHienTai = vb.phienBan.find(p => p.so === vb.phienBanHienTai) ?? vb.phienBan[vb.phienBan.length - 1];
  const [noiDung, setNoiDung] = useState(pbHienTai.noiDung);
  useEffect(() => { setNoiDung(pbHienTai.noiDung); }, [vb.id, vb.phienBanHienTai]);

  const giu = nguoiDangGiu(vb);
  const laNguoiGiu = !!giu && giu.nguoi === nguoiDung;
  const daKhoa = ["DaBanHanh", "DaHuy"].includes(vb.trangThai);
  const suaDuoc = laNguoiGiu && !daKhoa;
  const coSuaDoi = vb.lichSu.some(m => m.phienBanTruoc !== undefined);

  const xong = (vbMoi: VanBanTrinh) => { onCapNhat(vbMoi); setHopThoai(null); onClose(); };

  const hanhDong = () => {
    if (daKhoa) return (
      <>
        <BtnNeutral onClick={onClose}><Download size={13} /> Kết xuất</BtnNeutral>
        <BtnPrimary onClick={onClose}><Printer size={13} /> In</BtnPrimary>
      </>
    );
    if (!laNguoiGiu) return (
      <BtnNeutral onClick={onClose}>Đóng</BtnNeutral>
    );
    switch (vb.trangThai) {
      case "Nhap": return (
        <>
          <BtnNeutral onClick={onClose}><Trash2 size={13} /> Xoá</BtnNeutral>
          {!vb.soVanBan && (
            <BtnNeutral onClick={() => onCapNhat(apLaySoTam(vb, nguoiDung, chucVu, danhSach))}>
              <Save size={13} /> Lấy số tạm (tuỳ chọn)
            </BtnNeutral>
          )}
          <BtnPrimary onClick={() => xong(apTrinhDuyet(vb, nguoiDung, chucVu))}>
            <Send size={13} /> Trình duyệt
          </BtnPrimary>
        </>
      );
      case "BiTraLai": return (
        <BtnPrimary onClick={() => xong(apSuaVaTrinhLai(vb, nguoiDung, chucVu, noiDung))}>
          <Pencil size={13} /> Sửa &amp; trình lại
        </BtnPrimary>
      );
      case "ChoDuyet": return (
        <>
          <BtnOutline onClick={() => setHopThoai("tralai")}><Ban size={13} /> Trả lại</BtnOutline>
          <BtnOutline onClick={() => setHopThoai("suaduyet")}><Pencil size={13} /> Sửa &amp; duyệt</BtnOutline>
          <BtnPrimary onClick={() => setHopThoai("duyet")}><Check size={13} /> Duyệt</BtnPrimary>
        </>
      );
      case "ChoKy": return (
        <>
          <BtnOutline onClick={() => setHopThoai("tralai")}><Ban size={13} /> Trả lại</BtnOutline>
          <BtnPrimary onClick={() => setHopThoai("kyso")}><PenLine size={13} /> Ký số</BtnPrimary>
        </>
      );
      case "ChoButPhe": return (
        <>
          <BtnOutline onClick={() => setHopThoai("tralai")}><Ban size={13} /> Trả lại</BtnOutline>
          <BtnPrimary onClick={() => setHopThoai("butphe")}><PenLine size={13} /> Bút phê</BtnPrimary>
        </>
      );
      default: return <BtnNeutral onClick={onClose}>Đóng</BtnNeutral>;
    }
  };

  const TabBtn = ({ id, nhan, cham }: { id: any; nhan: string; cham?: boolean }) => (
    <div onClick={() => setTab(id)}
      className={`py-[9px] cursor-pointer text-[12px] border-b-2 flex items-center gap-1.5 transition-colors
        ${tab === id ? "border-error text-error font-semibold" : "border-transparent text-on-surface-variant font-medium hover:text-on-surface"}`}>
      {cham && <span className="w-1.5 h-1.5 rounded-full bg-error inline-block" />}
      {nhan}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/50 flex justify-end" onClick={onClose}>
        <div className="w-[720px] bg-white h-full flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>

          <div className="bg-tertiary text-white px-4 py-2.5 flex items-start justify-between flex-shrink-0">
            <div className="min-w-0">
              <div className="text-[15px] font-bold leading-tight truncate">{vb.trichYeu}</div>
              <div className="text-[11px] opacity-70 mt-0.5 flex items-center gap-1.5">
                <span className="font-mono">{vb.soVanBan ?? "— chưa số —"}</span>
                {vb.soVanBan && (
                  <span className={`px-[5px] py-[1px] rounded-[2px] text-[10px] font-medium border
                    ${vb.trangThaiSo === "tam"
                      ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"
                      : "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"}`}>
                    {vb.trangThaiSo === "tam" ? "dự thảo" : "chính thức"}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white flex-shrink-0 ml-3"><X size={16} /></button>
          </div>

          <div className="flex gap-[18px] px-4 border-b border-surface-container-highest bg-white flex-shrink-0">
            <TabBtn id="noidung" nhan="Nội dung" />
            <TabBtn id="dinhkem" nhan={`Đơn đính kèm (${vb.donDinhKem.length})`} />
            <TabBtn id="lichsu" nhan="Lịch sử & Ý kiến" cham={vb.trangThai === "BiTraLai" || coSuaDoi} />
            <TabBtn id="banin" nhan="Bản in" />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {daKhoa && vb.trangThai !== "DaHuy" && (
              <div className="mb-3.5 rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2 bg-[#e8f7ee] text-[#1a7a45] border border-[#a9debb]">
                <Lock size={14} className="flex-shrink-0 mt-0.5" />
                <div>Văn bản đã ký ngày {vb.ngayBanHanh}. Nội dung đã khoá vĩnh viễn.</div>
              </div>
            )}
            {!daKhoa && !laNguoiGiu && giu && (
              <div className="mb-3.5 rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2 bg-info-container text-primary border border-surface-variant">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <div>Văn bản đang ở {giu.nguoi} — {giu.chucVu}. Bạn chỉ có quyền xem.</div>
              </div>
            )}

            {tab === "lichsu" && <TabLichSu vb={vb} onXemThayDoi={setMocDiff} />}

            {tab === "noidung" && (
              <div>
                <Stepper vb={vb} />
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Loại văn bản</label>
                    <div className="border border-surface-container rounded-[3px] px-2.5 py-[7px] text-[12px]">{vb.loaiVanBan}</div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Trích yếu</label>
                    <div className="border border-surface-container rounded-[3px] px-2.5 py-[7px] text-[12px] leading-relaxed">{vb.trichYeu}</div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                      Nội dung <span className="text-on-surface-variant">(v{pbHienTai.so} · {pbHienTai.nguoiSua} · {pbHienTai.thoiGian})</span>
                    </label>
                    {suaDuoc ? (
                      <textarea value={noiDung} onChange={e => setNoiDung(e.target.value)} rows={9}
                        className="w-full border border-surface-container-highest rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-y focus:outline-none focus:border-primary font-[inherit]" />
                    ) : (
                      <div className="border border-surface-container rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed whitespace-pre-wrap min-h-[150px] bg-white">
                        {pbHienTai.noiDung}
                      </div>
                    )}
                    <div className="text-[11px] text-on-surface-variant italic mt-1.5">
                      {daKhoa ? "Chỉ đọc — chữ vẫn chọn và sao chép được."
                        : suaDuoc ? "Bạn đang giữ văn bản này — được phép sửa."
                        : "Chỉ đọc — bạn không phải người đang giữ văn bản."}
                    </div>
                  </div>
                  {vb.luongKy.length > 0 && (
                    <div>
                      <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Luồng ký</label>
                      <div className="border border-surface-container rounded-[3px] divide-y divide-[#f0f0f0]">
                        {vb.luongKy.map((b, i) => (
                          <div key={i} className={`px-2.5 py-[7px] text-[12px] flex items-center gap-2
                            ${!daKhoa && vb.buocHienTai === i && vb.trangThai !== "Nhap" && vb.trangThai !== "BiTraLai" ? "bg-warning-container" : ""}`}>
                            <span className="text-on-surface-variant text-[11px] w-[46px]">bước {b.thuTu}</span>
                            <span className="font-medium">{b.nguoi}</span>
                            <span className="text-on-surface-variant text-[11px]">· {b.chucVu}</span>
                            <span className="text-on-surface-variant text-[11px]">· {NHAN_VAI_TRO_BUOC[b.vaiTro]}</span>
                            {b.ketQua && <span className="ml-auto text-[11px] text-[#1a7a45]">✓ {b.thoiGian}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "dinhkem" && (
              vb.donDinhKem.length === 0
                ? <div className="py-14 text-center text-[12px] text-on-surface-variant italic">Không có đơn đính kèm.</div>
                : (
                  <div className="border border-surface-container-highest rounded-[4px] overflow-hidden">
                    <table className="w-full text-[12px] text-left">
                      <thead className="bg-surface-container-low border-b border-surface-container-highest">
                        <tr>
                          <th className="px-3 py-2 font-medium w-[90px]">Mã đơn</th>
                          <th className="px-3 py-2 font-medium">Người gửi</th>
                          <th className="px-3 py-2 font-medium w-[150px]">Số BA/QĐ</th>
                          <th className="px-3 py-2 font-medium w-[170px]">Hình thức</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vb.donDinhKem.map((d, i) => (
                          <tr key={i} className="border-b border-surface-container last:border-0">
                            <td className="px-3 py-2 font-medium">{d.ma}</td>
                            <td className="px-3 py-2 text-primary">{d.nguoiGui}</td>
                            <td className="px-3 py-2">{d.soBA}</td>
                            <td className="px-3 py-2 text-on-surface-variant">{d.hinhThuc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
            )}

            {tab === "banin" && (
              <div className="border border-surface-container-highest rounded-[4px] bg-surface-bright p-8">
                <div className="bg-white border border-surface-container-highest mx-auto p-8 text-[12px] leading-[1.9]" style={{ maxWidth: 560 }}>
                  <div className="text-center font-bold">TÒA ÁN NHÂN DÂN TỐI CAO</div>
                  <div className="text-center text-[11px] mb-1">──────────</div>
                  <div className="text-center font-mono text-[11px] mb-5">Số: {vb.soVanBan ?? "……/2026/……"}</div>
                  <div className="text-center font-bold uppercase mb-4">{vb.loaiVanBan}</div>
                  <div className="font-semibold mb-3">{vb.trichYeu}</div>
                  <div className="whitespace-pre-wrap">{pbHienTai.noiDung}</div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-surface-container-highest px-4 py-3 flex items-center justify-end gap-2 flex-shrink-0 bg-white">
            {vb.trangThai === "BiTraLai" && (
              <div className="mr-auto text-[11px] text-on-surface-variant italic">
                Vòng {vb.vongTrinh} vẫn giữ trong hồ sơ — không xoá, không gạch ngang.
              </div>
            )}
            {tab === "banin" && !daKhoa && (
              <BtnPrimary onClick={onClose}><Printer size={13} /> In văn bản</BtnPrimary>
            )}
            {hanhDong()}
          </div>
        </div>
      </div>

      {mocDiff && <SoSanhPhienBan vb={vb} moc={mocDiff} onClose={() => setMocDiff(null)} />}

      {hopThoai === "duyet" && (
        <HopThoaiDuyet vb={vb} onClose={() => setHopThoai(null)}
          onXacNhan={yk => xong(apDuyet(vb, nguoiDung, chucVu, yk || undefined))} />
      )}
      {hopThoai === "tralai" && (
        <HopThoaiTraLai vb={vb} onClose={() => setHopThoai(null)}
          onXacNhan={yk => xong(apTraLai(vb, nguoiDung, chucVu, yk))} />
      )}
      {hopThoai === "kyso" && (
        <HopThoaiKySo vb={vb} soSeCap={soKeTiep(danhSach, vb.loaiVanBan)} onClose={() => setHopThoai(null)}
          onXacNhan={() => xong(apKySo(vb, nguoiDung, chucVu, danhSach))} />
      )}
      {hopThoai === "butphe" && (
        <HopThoaiButPhe vb={vb} onClose={() => setHopThoai(null)}
          onXacNhan={yk => xong(apButPhe(vb, nguoiDung, chucVu, yk))} />
      )}
      {hopThoai === "suaduyet" && (
        <HopThoaiSuaVaDuyet vb={vb} onClose={() => setHopThoai(null)}
          onXacNhan={yk => xong(apSuaVaDuyet(vb, nguoiDung, chucVu, noiDung, yk || undefined))} />
      )}
    </>
  );
};

// ─── Thanh công cụ & bảng dùng chung ─────────────────────────────────────────
const CotThaoTac = ({ vb, nguoiDung, onMo }: { vb: VanBanTrinh; nguoiDung: string; onMo: () => void }) => {
  const giu = nguoiDangGiu(vb);
  const suaDuoc = !!giu && giu.nguoi === nguoiDung && !["DaBanHanh", "DaHuy"].includes(vb.trangThai);
  return (
    <td className="px-3 py-2 align-top text-center whitespace-nowrap text-primary" onClick={e => e.stopPropagation()}>
      <button onClick={onMo} title={suaDuoc ? "Sửa" : "Xem chi tiết"} className="hover:text-[#1152a3] px-1">
        {suaDuoc ? <Pencil size={14} /> : <Eye size={15} />}
      </button>
      <button onClick={onMo} title="Lịch sử" className="hover:text-[#1152a3] px-1"><History size={14} /></button>
    </td>
  );
};

// ─── Màn "Danh sách văn bản" ──────────────────────────────────────────
export type TabDS = "all" | "Nhap" | "ChoDuyet" | "ChoKy" | "BiTraLai" | "DaBanHanh";

/** Bộ lọc mang sang từ khối cảnh báo trên Trang chủ. Khối đó đếm theo VAI —
 *  cán bộ đọc "văn bản tôi phải sửa" (theo người tạo), người duyệt đọc "văn bản
 *  tôi đã trả lại" (theo người trả lại) — nên bộ lọc phải mang được cả hai vế,
 *  nếu không bấm vào con số lại mở ra một danh sách khác hẳn. */
export type LocVanBanTuTrangChu = {
  /** Chữ hiện trên chip, lấy đúng tiêu đề khối trên Trang chủ */
  nhan: string;
  /** Tab trạng thái sẽ nhảy tới — giới hạn đúng các tab màn này có. */
  trangThai?: TabDS;
  nguoiTao?: string;
  nguoiTraLai?: string;
};

/** Người trả lại ở lần gần nhất — cùng cách đọc với Trang chủ. */
const nguoiTraLaiGanNhat = (vb: VanBanTrinh) =>
  [...(vb.lichSu ?? [])].reverse().find(m => m.hanhDong === "TraLai")?.nguoi;

export const VanBanTrinhKyCuaToi = ({ danhSach, setDanhSach, currentRole, highlightId, openId, onDaMo, locMaDon, locTuTrangChu, onXoaLocTuTrangChu }: {
  danhSach: VanBanTrinh[];
  setDanhSach: React.Dispatch<React.SetStateAction<VanBanTrinh[]>>;
  currentRole: string;
  highlightId?: string | null;
  /** Mở thẳng panel chi tiết của văn bản này khi vào màn — dùng khi người dùng
   *  bấm link "Đã có trong 545/…" từ màn Danh sách đơn. */
  openId?: string | null;
  onDaMo?: () => void;
  /** Lọc sẵn theo mã đơn — dùng khi sang màn từ nút "Xem văn bản đã trình". */
  locMaDon?: string | null;
  locTuTrangChu?: LocVanBanTuTrangChu | null;
  onXoaLocTuTrangChu?: () => void;
}) => {
  const [tab, setTab] = useState<TabDS>("all");
  const [tim, setTim] = useState("");
  const [chonId, setChonId] = useState<string | null>(null);
  const { nguoi: nguoiDung, chucVu } = nguoiTheoVaiTro(currentRole);

  // "Của tôi" giờ là BỘ LỌC mặc định, không còn là tên màn — người dùng thấy
  // được và bỏ được, thay vì bị lọc ngầm mà không biết.
  const [fNguoiTao, setFNguoiTao] = useState<string>(nguoiDung);
  const [fMaDon, setFMaDon] = useState<string>(locMaDon ?? "");
  useEffect(() => { setFNguoiTao(nguoiDung); }, [nguoiDung]);
  // Sang màn kèm mã đơn ⇒ áp luôn bộ lọc đó (bỏ lọc "của tôi" để không giấu mất
  // văn bản nếu người tạo là cán bộ khác).
  useEffect(() => {
    if (locMaDon) { setFMaDon(locMaDon); setFNguoiTao(""); }
  }, [locMaDon]);

  // Sang màn từ Trang chủ ⇒ áp đúng điều kiện của khối vừa bấm: nhảy sang tab
  // trạng thái tương ứng và ĐẶT LẠI hai ô lọc kia. Bỏ mặc định "người tạo = tôi"
  // là bắt buộc với vai người duyệt — văn bản họ trả lại do cán bộ khác tạo,
  // giữ mặc định thì bấm vào số 5 lại mở ra danh sách rỗng.
  useEffect(() => {
    if (!locTuTrangChu) return;
    setTab(locTuTrangChu.trangThai ?? "all");
    setFNguoiTao(locTuTrangChu.nguoiTao ?? "");
    setFMaDon("");
    setTim("");
  }, [locTuTrangChu]);

  useEffect(() => {
    if (openId) { setChonId(openId); onDaMo?.(); }
  }, [openId]);

  const dsNguoiTao = useMemo(
    () => Array.from(new Set(danhSach.map(v => v.nguoiTao))).sort(), [danhSach]);
  const dsMaDon = useMemo(
    () => Array.from(new Set(danhSach.flatMap(v => v.donDinhKem.map(d => d.ma.trim())))).sort(), [danhSach]);

  const theoBoLoc = danhSach.filter(v => {
    if (v.trangThai === "DaHuy") return false;
    if (fNguoiTao && v.nguoiTao !== fNguoiTao) return false;
    if (fMaDon && !v.donDinhKem.some(d => d.ma.trim() === fMaDon)) return false;
    if (locTuTrangChu?.nguoiTraLai && nguoiTraLaiGanNhat(v) !== locTuTrangChu.nguoiTraLai) return false;
    return true;
  });
  const dem = (t: TabDS) => t === "all" ? theoBoLoc.length : theoBoLoc.filter(v => v.trangThai === t).length;

  const loc = theoBoLoc.filter(v => {
    if (tab !== "all" && v.trangThai !== tab) return false;
    if (tim.trim()) {
      const q = tim.toLowerCase();
      if (!(v.trichYeu.toLowerCase().includes(q) || (v.soVanBan ?? "").toLowerCase().includes(q))) return false;
    }
    return true;
  });
  const coLocThem = !!fMaDon || fNguoiTao !== nguoiDung || !!locTuTrangChu;

  const chon = danhSach.find(v => v.id === chonId) ?? null;
  const capNhat = (vbMoi: VanBanTrinh) =>
    setDanhSach(ds => ds.map(v => v.id === vbMoi.id ? vbMoi : v));

  const TABS: { id: TabDS; nhan: string }[] = [
    { id: "all", nhan: "Tất cả" }, { id: "Nhap", nhan: "Nháp" },
    { id: "ChoDuyet", nhan: "Chờ duyệt" }, { id: "ChoKy", nhan: "Chờ ký" },
    { id: "BiTraLai", nhan: "Bị trả lại" },
    { id: "DaBanHanh", nhan: "Đã ban hành" },
  ];

  const rong = () => {
    if (tim.trim() || coLocThem) return { m: "Không có kết quả khớp bộ lọc.", nut: true };
    switch (tab) {
      case "Nhap": return { m: "Không có bản nháp nào." };
      case "ChoDuyet": return { m: "Không có văn bản nào đang chờ duyệt." };
      case "ChoKy": return { m: "Không có văn bản nào đang chờ ký." };
      case "BiTraLai": return { m: "Chưa có văn bản nào bị trả lại." };
      case "DaBanHanh": return { m: "Chưa có văn bản nào được ban hành." };
      default: return {
        m: `${fNguoiTao || "Chưa ai"} chưa khởi tạo văn bản nào.`,
        phu: chucVu !== "Cán bộ" ? "Văn bản chờ bạn xử lý nằm ở màn Phê duyệt đề xuất." : undefined,
      };
    }
  };

  const xoaBoLoc = () => {
    setTim(""); setFMaDon(""); setFNguoiTao(nguoiDung);
    onXoaLocTuTrangChu?.();
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="px-5 pt-4">
        <h1 className="text-[18px] font-bold text-tertiary mb-3">Danh sách văn bản</h1>
      </div>

      {/* Chip bộ lọc đến từ Trang chủ — nhìn thấy được và xoá được, để không có
          điều kiện lọc nào chạy ngầm sau khi nhảy màn. Cùng kiểu với chip ở
          màn Danh sách đơn. */}
      {locTuTrangChu && (
        <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-2 bg-[#fff8e6] border border-[#f0d9a0] rounded-[4px] text-[12px] text-[#7a5b00]">
          <Home size={13} className="flex-shrink-0" />
          <span>Đang lọc từ Trang chủ:</span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-[#e0c274] rounded-full pl-2.5 pr-1 py-0.5 font-semibold text-error">
            {locTuTrangChu.nhan}
            <button
              type="button"
              onClick={onXoaLocTuTrangChu}
              title="Bỏ lọc, xem toàn bộ danh sách"
              className="w-[16px] h-[16px] rounded-full flex items-center justify-center hover:bg-[#f3e3c0] transition-colors"
            >
              <X size={11} />
            </button>
          </span>
          <span className="text-[#a08340]">— {loc.length} văn bản</span>
        </div>
      )}

      <div className="flex items-center gap-5 border-b border-surface-container px-5">
        {TABS.map(t => {
          const n = dem(t.id);
          return (
            <div key={t.id} onClick={() => setTab(t.id)}
              className={`py-2 cursor-pointer font-medium text-[13px] border-b-2 flex items-center gap-1.5 transition-colors
                ${tab === t.id ? "border-error text-error font-semibold" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
              {t.nhan} ({n})
              {t.id === "BiTraLai" && n > 0 && (
                <span className="bg-error text-white rounded-full text-[10px] font-medium min-w-[16px] h-[16px] leading-[16px] text-center px-1">{n}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-5 py-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input value={tim} onChange={e => setTim(e.target.value)} placeholder="Tìm số / trích yếu…"
            className="h-[30px] w-[240px] border border-surface-container-highest rounded-[3px] pl-7 pr-2 text-[12px] focus:outline-none focus:border-primary" />
        </div>
        {/* Hai bộ lọc thật, thay cho việc lọc ngầm theo người đăng nhập.
            "Của tôi" là giá trị mặc định của bộ lọc Người tạo — nhìn thấy và bỏ được. */}
        <select value={fNguoiTao} onChange={e => setFNguoiTao(e.target.value)}
          className={`h-[30px] border rounded-[3px] px-2 text-[12px] bg-white
            ${fNguoiTao !== nguoiDung ? "border-error text-error font-medium" : "border-surface-container-highest"}`}>
          <option value="">Người tạo: tất cả</option>
          {dsNguoiTao.map(n => (
            <option key={n} value={n}>{n === nguoiDung ? `${n} (tôi)` : n}</option>
          ))}
        </select>
        <select value={fMaDon} onChange={e => setFMaDon(e.target.value)}
          className={`h-[30px] border rounded-[3px] px-2 text-[12px] bg-white
            ${fMaDon ? "border-error text-error font-medium" : "border-surface-container-highest"}`}>
          <option value="">Mã đơn: tất cả</option>
          {dsMaDon.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        {(coLocThem || tim.trim()) && (
          <button onClick={xoaBoLoc}
            className="h-[30px] px-2.5 rounded-[3px] border border-surface-container-highest text-[12px] text-on-surface-variant hover:bg-surface-container-low">
            Xoá bộ lọc
          </button>
        )}
        <div className="flex-1" />
        <span className="text-[11px] text-on-surface-variant italic mr-1">Tạo văn bản mới từ màn Danh sách đơn</span>
        <BtnPrimary disabled><Plus size={13} /> Tạo văn bản</BtnPrimary>
      </div>

      <div className="flex-1 overflow-auto px-5 pb-5">
        <div className="border border-surface-container-highest rounded-[4px] overflow-hidden">
          <table className="w-full text-[13px] text-left">
            <thead className="bg-surface-container-low text-on-surface border-b border-surface-container-highest">
              <tr>
                <th className="px-3 py-2 font-semibold w-[44px]">STT</th>
                <th className="px-3 py-2 font-semibold w-[175px]">Số / Ký hiệu</th>
                <th className="px-3 py-2 font-semibold">Trích yếu</th>
                <th className="px-3 py-2 font-semibold w-[155px]">Đang ở ai</th>
                <th className="px-3 py-2 font-semibold w-[250px]">Trạng thái</th>
                <th className="px-3 py-2 font-semibold w-[86px] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loc.map((v, i) => {
                const giu = nguoiDangGiu(v);
                const laNguoiGiu = !!giu && giu.nguoi === nguoiDung;
                const traLai = v.trangThai === "BiTraLai";
                const yKienCuoi = [...v.lichSu].reverse().find(m => m.hanhDong === "TraLai")?.yKien;
                const moiTao = v.id === highlightId;
                return (
                  <tr key={v.id} onClick={() => setChonId(v.id)}
                    className={`border-b border-surface-container last:border-0 cursor-pointer transition-colors
                      ${traLai ? "bg-error-container hover:bg-[#fbdede]"
                        : moiTao ? "bg-warning-container hover:bg-[#fff3d0]" : "hover:bg-surface-bright"}`}
                    style={traLai ? { boxShadow: "inset 3px 0 0 #8b1a1a" }
                      : moiTao ? { boxShadow: "inset 3px 0 0 #e67e22" } : undefined}>
                    <td className="px-3 py-2 align-top text-on-surface-variant">{i + 1}</td>
                    <td className="px-3 py-2 align-top"><ChipSo vb={v} /></td>
                    <td className="px-3 py-2 align-top">
                      <div className="leading-relaxed">{v.trichYeu}</div>
                      <div className="text-[11px] text-on-surface-variant mt-[3px]">
                        {v.loaiVanBan}
                        {v.donDinhKem.length > 0 && ` · ${v.donDinhKem.length} đơn`}
                        {v.vongTrinh > 1 && ` · Vòng ${v.vongTrinh}`}
                        {moiTao && <span className="text-[#b45309] font-medium"> · Vừa tạo</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      {giu ? (<>
                        <div className="font-medium">{giu.nguoi}</div>
                        <div className="text-[11px] text-on-surface-variant mt-[3px]">{giu.chucVu}{laNguoiGiu && " — bạn"}</div>
                      </>) : <span className="text-on-surface-variant">—</span>}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Pill tt={v.trangThai} />
                      <div className="text-[11px] text-on-surface-variant mt-[3px]">
                        {dangChoXuLy(v.trangThai) && `bước ${v.buocHienTai + 1}/${v.luongKy.length}`}
                        {v.trangThai === "DaBanHanh" && v.ngayBanHanh}
                        {v.trangThai === "Nhap" && `Sửa lần cuối ${v.phienBan[v.phienBan.length - 1].thoiGian}`}
                        {traLai && v.lichSu[v.lichSu.length - 1].thoiGian}
                      </div>
                      {traLai && yKienCuoi && (
                        <div className="text-[11px] text-error italic mt-1 leading-snug max-w-[230px]">
                          💬 “{yKienCuoi.length > 62 ? yKienCuoi.slice(0, 62) + "…" : yKienCuoi}”
                        </div>
                      )}
                    </td>
                    <CotThaoTac vb={v} nguoiDung={nguoiDung} onMo={() => setChonId(v.id)} />
                  </tr>
                );
              })}
              {loc.length === 0 && (
                <tr><td colSpan={6} className="py-14 text-center">
                  <FileText size={26} className="mx-auto mb-2.5 text-surface-container-highest" />
                  <div className="text-[12px] text-on-surface-variant">{rong().m}</div>
                  {(rong() as any).phu && <div className="text-[11px] text-on-surface-variant mt-1.5">{(rong() as any).phu}</div>}
                  {(rong() as any).nut && (
                    <button onClick={xoaBoLoc}
                      className="mt-3 h-[28px] px-3 rounded-[3px] border border-surface-container-highest text-[12px] font-medium hover:bg-surface-container-low">
                      Xoá bộ lọc
                    </button>
                  )}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end pt-3 text-[11px] text-on-surface-variant">
          Hiển thị 1–{loc.length} / {loc.length}
        </div>
      </div>

      {chon && (
        <PanelChiTiet vb={chon} nguoiDung={nguoiDung} chucVu={chucVu} danhSach={danhSach}
          onCapNhat={capNhat} onClose={() => setChonId(null)} />
      )}
    </div>
  );
};

// ─── Màn "Phê duyệt đề xuất" — bảng đề xuất, đọc CÙNG kho văn bản ────────────
// Bố cục theo đúng bản gốc (tabs Tất cả/Chờ duyệt/Đã duyệt/Từ chối, 3 nút thao
// tác hàng loạt, cột Ý kiến lãnh đạo). Khác bản gốc ở chỗ dữ liệu lấy từ
// vanBanList chứ không phải mảng ToTrinh riêng — nên tờ trình vừa tạo hiện ngay.
type TabPD = "all" | "sap_den" | "cho_duyet" | "da_duyet" | "tu_choi";
// Nhóm trạng thái để tô chip ở cột Trạng thái — KHÁC danh sách tab, vì
// "Sắp đến lượt" là lát cắt theo người chứ không phải một trạng thái.
type NhomPD = "cho_duyet" | "da_duyet" | "tu_choi";

/** Gộp 8 trạng thái nội bộ về 3 nhóm mà lãnh đạo quan tâm. */
const nhomTrangThai = (tt: TrangThaiVB): NhomPD | null => {
  if (tt === "ChoDuyet" || tt === "ChoKy" || tt === "ChoButPhe") return "cho_duyet";
  if (tt === "DaBanHanh") return "da_duyet";
  if (tt === "BiTraLai") return "tu_choi";
  return null;   // Nhap / DaHuy: chưa hoặc không còn nằm trong luồng duyệt
};
const NHAN_NHOM: Record<NhomPD, { nhan: string; cls: string }> = {
  cho_duyet: { nhan: "Chờ duyệt", cls: "bg-info-container text-primary border-surface-variant" },
  da_duyet: { nhan: "Đã duyệt", cls: "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]" },
  tu_choi: { nhan: "Từ chối", cls: "bg-error-container text-error border-error-container" },
};

export const PheDuyetDeXuat = ({ danhSach, setDanhSach, currentRole }: {
  danhSach: VanBanTrinh[];
  setDanhSach: React.Dispatch<React.SetStateAction<VanBanTrinh[]>>;
  currentRole: string;
}) => {
  // Mở màn là vào thẳng việc cần làm, không phải "Tất cả" rồi tự lọc lại.
  const [tab, setTab] = useState<TabPD>("cho_duyet");
  const [chonId, setChonId] = useState<string | null>(null);
  const [tick, setTick] = useState<string[]>([]);
  const [hopThoaiTraLai, setHopThoaiTraLai] = useState(false);
  const [thongBao, setThongBao] = useState("");
  const { nguoi: nguoiDung, chucVu } = nguoiTheoVaiTro(currentRole);

  const dangOToi = (v: VanBanTrinh) => nguoiDangGiu(v)?.nguoi === nguoiDung;
  const daCoHanhDong = (v: VanBanTrinh, cacHanhDong: HanhDong[]) =>
    v.lichSu.some(m => cacHanhDong.includes(m.hanhDong));

  // "Tất cả" là nguồn dữ liệu duy nhất; 4 tab còn lại đều cắt ra từ đây.
  const trongLuong = danhSach.filter(v => nhomTrangThai(v.trangThai) !== null);

  // Trước đây 4 tab dưới lọc theo NGƯỜI đang đăng nhập, nên vai trò nào không
  // nằm trong luồng ký (mặc định là Cán bộ) sẽ thấy tab Tất cả đầy dữ liệu còn
  // 4 tab kia trắng trơn — trông như mất dữ liệu. Giờ cả 5 tab cùng cắt từ
  // `trongLuong` theo TRẠNG THÁI văn bản; phần "của tôi" chuyển thành dấu nhấn
  // (đếm riêng trên nhãn tab, nền vàng, chip "Đang ở bạn") chứ không còn là
  // điều kiện lọc làm rỗng cả tab.
  const LOC_TAB: Record<TabPD, (v: VanBanTrinh) => boolean> = {
    all: () => true,
    sap_den: v => dangChoXuLy(v.trangThai) && !dangOToi(v),
    cho_duyet: v => dangChoXuLy(v.trangThai),
    da_duyet: v => daCoHanhDong(v, ["Duyet", "SuaVaDuyet", "Ky", "ButPhe", "BanHanh"]),
    tu_choi: v => v.trangThai === "BiTraLai" || daCoHanhDong(v, ["TraLai"]),
  };
  const dem = (t: TabPD) => trongLuong.filter(LOC_TAB[t]).length;
  // Việc đang ở chân mình xếp lên đầu — tab không còn lọc theo người thì thứ tự
  // phải gánh vai trò đó, nếu không việc của mình lẫn giữa việc của người khác.
  const loc = trongLuong.filter(LOC_TAB[tab])
    .slice()
    .sort((a, b) => Number(dangOToi(b)) - Number(dangOToi(a)));

  const chon = danhSach.find(v => v.id === chonId) ?? null;
  const capNhat = (vbMoi: VanBanTrinh) => setDanhSach(ds => ds.map(v => v.id === vbMoi.id ? vbMoi : v));
  const daTick = danhSach.filter(v => tick.includes(v.id));
  // Chỉ cần tích là thao tác được. Đề xuất đã đóng (đã ký / ban hành) thì bỏ qua
  // vì không còn bước nào để duyệt.
  const xuLyDuoc = daTick.filter(v => dangChoXuLy(v.trangThai) || v.trangThai === "BiTraLai");
  const apDuocHangLoat = xuLyDuoc.length > 0;
  const lyDoChan = daTick.length === 0
    ? "Chọn ít nhất một đề xuất"
    : "Các đề xuất đã chọn đều đã xử lý xong";

  const pheDuyetHangLoat = () => {
    const n = xuLyDuoc.filter(v => dangChoXuLy(v.trangThai)).length;
    setDanhSach(ds => ds.map(v => {
      if (!tick.includes(v.id) || !dangChoXuLy(v.trangThai)) return v;
      return v.trangThai === "ChoKy" ? apKySo(v, nguoiDung, chucVu, ds) : apDuyet(v, nguoiDung, chucVu);
    }));
    setTick([]);
    setThongBao(`Đã phê duyệt ${n} đề xuất.`);
  };
  const traLaiHangLoat = (yKien: string) => {
    const n = xuLyDuoc.filter(v => dangChoXuLy(v.trangThai)).length;
    setDanhSach(ds => ds.map(v =>
      tick.includes(v.id) && dangChoXuLy(v.trangThai) ? apTraLai(v, nguoiDung, chucVu, yKien) : v));
    setTick([]);
    setHopThoaiTraLai(false);
    setThongBao(`Đã trả lại ${n} đề xuất về người tạo.`);
  };

  const TABS: { id: TabPD; nhan: string; mo: string; rong: string }[] = [
    { id: "all", nhan: "Tất cả",
      mo: "Toàn bộ đề xuất đang trong luồng duyệt, kể cả của người khác.",
      rong: "Chưa có đề xuất nào trong luồng duyệt." },
    { id: "cho_duyet", nhan: "Chờ duyệt",
      mo: `Mọi đề xuất đang chờ duyệt / ký / bút phê. Việc đang ở ${nguoiDung} được tô nền vàng và xếp lên đầu.`,
      rong: "Hiện chưa có đề xuất nào chờ xử lý." },
    { id: "da_duyet", nhan: "Đã duyệt",
      mo: "Đề xuất đã qua ít nhất một bước duyệt / ký / bút phê.",
      rong: "Chưa có đề xuất nào được duyệt." },
    { id: "tu_choi", nhan: "Từ chối",
      mo: "Đề xuất đã bị trả lại về người tạo.",
      rong: "Chưa có đề xuất nào bị trả lại." },
    { id: "sap_den", nhan: "Sắp đến lượt xử lý",
      mo: `Đang chờ xử lý ở người khác — theo luồng ký sẽ chuyển tiếp, chưa tới tay ${nguoiDung}.`,
      rong: "Không có đề xuất nào đang chờ ở người khác." },
  ];
  const tabHienTai = TABS.find(t => t.id === tab)!;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-container-highest">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-[18px] font-bold text-tertiary">Danh sách đề xuất</h1>
            <div className="text-[11px] text-on-surface-variant mt-0.5">
              Đang xem với vai trò <b className="text-on-surface">{nguoiDung}</b> — {chucVu}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 border-b border-surface-container">
          {TABS.map(t => (
            <div key={t.id} onClick={() => { setTab(t.id); setTick([]); }} title={t.mo}
              className={`px-2 py-2 cursor-pointer font-medium text-[13px] border-b-2 transition-colors whitespace-nowrap
                ${tab === t.id ? "border-error text-error" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
              {t.nhan} ({dem(t.id)})
            </div>
          ))}
        </div>
        {/* Mỗi tab một phạm vi khác nhau — nói rõ để không tưởng hệ thống mất dữ liệu */}
        <div className="text-[11px] text-on-surface-variant mt-2">{tabHienTai.mo}</div>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {/* Xác nhận sau thao tác — nếu không, bấm Phê duyệt xong bảng chỉ đổi
            lặng lẽ và người dùng không chắc hệ thống đã nhận lệnh. */}
        {thongBao && (
          <div className="mb-3 flex items-center gap-2 h-[38px] px-3 rounded-[4px] bg-[#eaf7ee] border border-[#a9debb] text-[13px] text-[#1a7a45]">
            <Check size={15} />
            <span className="flex-1">{thongBao}</span>
            <button onClick={() => setThongBao("")} className="text-[#1a7a45] hover:text-[#0d5c31] px-1">×</button>
          </div>
        )}

        <div className="flex justify-between items-center mb-3">
          <div className="text-[13px] font-semibold text-on-surface">Danh sách đề xuất</div>
          <div className="flex gap-2">
            <button type="button" onClick={pheDuyetHangLoat} disabled={!apDuocHangLoat}
              title={apDuocHangLoat ? undefined : lyDoChan}
              className={`h-[28px] px-3 rounded-[3px] text-[12px] font-medium text-white transition-colors
                ${apDuocHangLoat ? "bg-error hover:bg-error-container" : "bg-[#d9c4c4] cursor-not-allowed"}`}>
              Phê duyệt
            </button>
            <button type="button" onClick={() => setHopThoaiTraLai(true)} disabled={!apDuocHangLoat}
              title={apDuocHangLoat ? undefined : lyDoChan}
              className={`h-[28px] px-3 border rounded-[3px] bg-white text-[12px] font-medium transition-colors
                ${apDuocHangLoat ? "border-error text-error hover:bg-[#fdeaea]" : "border-surface-container text-[#bbb] cursor-not-allowed"}`}>
              Trả lại
            </button>
            <button type="button"
              className="flex items-center gap-1.5 h-[28px] px-3 border border-surface-container-highest text-on-surface bg-white rounded-[3px] text-[12px] font-medium hover:bg-gray-50 transition-colors">
              <Download size={14} /> Kết xuất
            </button>
          </div>
        </div>

        <div className="border border-surface-container-highest rounded-[4px] overflow-hidden">
          <table className="w-full text-[13px] text-left">
            <thead className="bg-surface-container-low text-on-surface border-b border-surface-container-highest">
              <tr>
                <th className="px-3 py-2 text-center w-[40px]">
                  <input type="checkbox"
                    checked={loc.length > 0 && tick.length === loc.length}
                    onChange={e => setTick(e.target.checked ? loc.map(v => v.id) : [])} />
                </th>
                <th className="px-3 py-2 font-semibold w-[44px]">STT</th>
                <th className="px-3 py-2 font-semibold w-[170px]">Thông tin văn bản</th>
                <th className="px-3 py-2 font-semibold">Tên văn bản</th>
                <th className="px-3 py-2 font-semibold w-[125px]">Người đề xuất</th>
                <th className="px-3 py-2 font-semibold w-[135px]">Ngày đề xuất</th>
                <th className="px-3 py-2 font-semibold text-center w-[130px]">Trạng thái</th>
                <th className="px-3 py-2 font-semibold w-[260px]">Ý kiến</th>
              </tr>
            </thead>
            <tbody>
              {loc.map((v, i) => {
                const nhom = nhomTrangThai(v.trangThai)!;
                const mocTrinh = [...v.lichSu].reverse().find(m => m.hanhDong === "Trinh" || m.hanhDong === "Tao");
                // Ý kiến của MỌI người trong luồng, không chỉ ý kiến gần nhất
                const cacYKien = v.lichSu.filter(m => m.yKien?.trim());
                return (
                  <tr key={v.id}
                    onDoubleClick={() => setChonId(v.id)}
                    title="Bấm đúp để xem tờ trình / văn bản"
                    className={`border-b border-surface-container last:border-0 hover:bg-surface-bright cursor-pointer
                    ${dangOToi(v) ? "bg-[#fffdf5]" : ""}`}>
                    <td className="px-3 py-2 text-center align-top">
                      <input type="checkbox" checked={tick.includes(v.id)}
                        onClick={e => e.stopPropagation()}
                        onChange={e => setTick(p => e.target.checked ? [...p, v.id] : p.filter(x => x !== v.id))} />
                    </td>
                    <td className="px-3 py-2 text-center text-on-surface-variant align-top">{i + 1}</td>
                    {/* Thông tin văn bản = số tờ trình + ngày tờ trình */}
                    <td className="px-3 py-2 align-top leading-relaxed">
                      <div className="font-mono font-medium text-tertiary">{v.soVanBan ?? "— chưa số —"}</div>
                      <div className="text-[11px] text-on-surface-variant mt-0.5">{v.ngayCapSo ?? mocTrinh?.thoiGian?.split(" ")[0] ?? "—"}</div>
                    </td>
                    <td className="px-3 py-2 text-on-surface align-top leading-relaxed">
                      <div className="font-medium">{v.trichYeu}</div>
                      <div className="text-[11px] text-on-surface-variant mt-0.5">{v.loaiVanBan}</div>
                    </td>
                    <td className="px-3 py-2 text-on-surface font-medium align-top">{v.nguoiTao}</td>
                    <td className="px-3 py-2 text-on-surface-variant align-top">{mocTrinh?.thoiGian ?? "—"}</td>
                    <td className="px-3 py-2 text-center align-top">
                      {/* Tab "Chờ duyệt": trạng thái thay bằng nút phê duyệt luôn,
                          bấm là chuyển sang đã phê duyệt — bớt một lần mở popup. */}
                      {tab === "cho_duyet" && dangChoXuLy(v.trangThai) ? (
                        <button type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setDanhSach(ds => ds.map(x => x.id !== v.id ? x
                              : x.trangThai === "ChoKy" ? apKySo(x, nguoiDung, chucVu, ds)
                                : apDuyet(x, nguoiDung, chucVu)));
                            setThongBao(`Đã phê duyệt ${v.soVanBan ?? v.trichYeu}.`);
                          }}
                          className="inline-flex items-center gap-1 h-[26px] px-2.5 rounded-[3px] bg-error hover:bg-error-container text-white text-[11px] font-medium transition-colors whitespace-nowrap">
                          <Check size={12} /> Phê duyệt
                        </button>
                      ) : (
                        <>
                          <span className={`inline-block px-2 py-[2px] rounded-[10px] text-[10px] font-medium border ${NHAN_NHOM[nhom].cls}`}>
                            {NHAN_NHOM[nhom].nhan}
                          </span>
                          {dangOToi(v) && <div className="text-[10px] text-[#b45309] mt-1">Đang ở bạn</div>}
                        </>
                      )}
                    </td>
                    {/* Ý kiến của tất cả các bước, kèm người và thời điểm */}
                    <td className="px-3 py-2 align-top leading-snug">
                      {cacYKien.length === 0
                        ? <span className="text-[11px] text-[#bbb] italic">—</span>
                        : (
                          <div className="space-y-1">
                            {cacYKien.map((m, k) => (
                              <div key={k} className="text-[11px] leading-snug">
                                <span className="font-medium text-on-surface">{m.nguoi}</span>
                                <span className="text-outline"> · {m.chucVu} · {m.thoiGian}</span>
                                <div className="text-on-surface-variant italic">{m.yKien}</div>
                              </div>
                            ))}
                          </div>
                        )}
                    </td>
                  </tr>
                );
              })}
              {loc.length === 0 && (
                <tr><td colSpan={8} className="py-12">
                  <div className="flex items-center justify-center gap-6">
                    {/* Minh hoạ hộp thư rỗng — vòng tròn hồng nhạt, hộp nét đứt,
                        cánh thư bay ra góc trên phải */}
                    <div className="relative w-[110px] h-[110px] flex-shrink-0">
                      <div className="absolute inset-0 rounded-full bg-[#fdeaea]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Inbox size={44} strokeWidth={1.2} className="text-[#e0a9a4]" />
                      </div>
                      <svg viewBox="0 0 110 110" className="absolute inset-0 w-full h-full pointer-events-none">
                        <path d="M14 78 C 16 46, 40 26, 74 22" fill="none"
                          stroke="#e8bcb8" strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" />
                      </svg>
                      <Send size={18} className="absolute top-[12px] right-[16px] text-error -rotate-12" />
                    </div>
                    <div className="text-left">
                      <div className="text-[15px] font-semibold text-tertiary">Chưa có đề xuất nào</div>
                      <div className="text-[13px] text-on-surface-variant mt-1">{tabHienTai.rong}</div>
                      {/* Trống vì phạm vi của tab chứ không phải hệ thống rỗng */}
                      {tab !== "all" && trongLuong.length > 0 && (
                        <button onClick={() => { setTab("all"); setTick([]); }}
                          className="text-[12px] text-primary hover:underline mt-2">
                          Xem tất cả {trongLuong.length} đề xuất
                        </button>
                      )}
                    </div>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Con mắt mở màn nào là tuỳ loại văn bản:
          · Tờ trình  → "Lãnh đạo phê duyệt ý kiến" (xoay quanh ý kiến + trình tiếp)
          · Còn lại   → "Ký số văn bản" (xoay quanh bản in + ký) */}
      {chon && (laToTrinh(chon.loaiVanBan) ? (
        <ManPheDuyetYKien vb={chon} nguoiDung={nguoiDung} chucVu={chucVu} danhSach={danhSach}
          onCapNhat={capNhat} onClose={() => setChonId(null)} />
      ) : (
        <ManKySoVanBan vb={chon} nguoiDung={nguoiDung} chucVu={chucVu} danhSach={danhSach}
          onCapNhat={capNhat} onClose={() => setChonId(null)} />
      ))}

      {hopThoaiTraLai && daTick.length > 0 && (
        <HopThoaiTraLai vb={daTick[0]} onClose={() => setHopThoaiTraLai(false)}
          onXacNhan={traLaiHangLoat} />
      )}
    </div>
  );
};

// ─── Màn Ký số văn bản (mở từ nút con mắt ở Phê duyệt đề xuất) ───────────────
// Ba cột: danh sách tài liệu · bản xem trước · khối ý kiến lãnh đạo.
// Nút cuối đổi theo bước hiện tại — lãnh đạo có thể đang phải duyệt, ký số
// hoặc bút phê, dùng chung một màn thay vì ba màn na ná nhau.
interface GhiChuVB { id: number; noiDung: string; nguoi: string; thoiGian: string }

const ManKySoVanBan = ({ vb, nguoiDung, chucVu, danhSach, onCapNhat, onClose }: {
  vb: VanBanTrinh; nguoiDung: string; chucVu: string; danhSach: VanBanTrinh[];
  onCapNhat: (v: VanBanTrinh) => void; onClose: () => void;
}) => {
  const [yKien, setYKien] = useState("");
  const [ghiChu, setGhiChu] = useState<GhiChuVB[]>([]);
  const [dangThemGhiChu, setDangThemGhiChu] = useState(false);
  const [ghiChuMoi, setGhiChuMoi] = useState("");
  const [zoom, setZoom] = useState(100);
  const [xoay, setXoay] = useState(0);
  const [moDinhKem, setMoDinhKem] = useState(true);

  const noiDung = vb.phienBan.find(p => p.so === vb.phienBanHienTai)?.noiDung ?? "";
  const laNguoiGiu = nguoiDangGiu(vb)?.nguoi === nguoiDung;
  const buoc = vb.luongKy[vb.buocHienTai];

  // Nút chính đổi theo việc lãnh đạo đang phải làm gì ở bước này
  const nutChinh =
    vb.trangThai === "ChoKy" ? { nhan: "Ký số", icon: <PenLine size={14} /> }
      : vb.trangThai === "ChoButPhe" ? { nhan: "Bút phê", icon: <PenLine size={14} /> }
        : { nhan: "Phê duyệt", icon: <Check size={14} /> };

  // Bút phê bắt buộc có ý kiến — đó chính là nội dung chỉ đạo
  const thieuYKien = vb.trangThai === "ChoButPhe" && yKien.trim().length < 5;

  const xong = (v: VanBanTrinh) => { onCapNhat(v); onClose(); };
  const duyet = () => {
    if (thieuYKien) return;
    if (vb.trangThai === "ChoKy") return xong(apKySo(vb, nguoiDung, chucVu, danhSach));
    if (vb.trangThai === "ChoButPhe") return xong(apButPhe(vb, nguoiDung, chucVu, yKien.trim()));
    xong(apDuyet(vb, nguoiDung, chucVu, yKien.trim() || undefined));
  };
  const tuChoi = () => {
    if (yKien.trim().length < 10) return;
    xong(apTraLai(vb, nguoiDung, chucVu, yKien.trim()));
  };

  const NutIcon = ({ children, onClick, title }: any) => (
    <button onClick={onClick} title={title}
      className="w-[26px] h-[26px] flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container transition-colors">
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[6px] shadow-2xl w-[1200px] max-w-[97vw] h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-tertiary text-white px-5 py-3 flex items-start justify-between flex-shrink-0">
          <div className="min-w-0">
            <div className="text-[15px] font-bold leading-tight truncate">
              Ký số văn bản — {vb.trichYeu}
            </div>
            <div className="text-[11px] opacity-70 mt-0.5">
              Công tác lãnh đạo / Phê duyệt đề xuất / Ý kiến lãnh đạo
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 flex min-h-0">

          {/* ── Cột trái: danh sách tài liệu ── */}
          <div className="w-[210px] flex-shrink-0 border-r border-[#e5e5e5] bg-surface-bright overflow-y-auto py-3">
            <div className="px-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wide mb-2">
              Danh sách tài liệu
            </div>
            <div className="px-2">
              <div className="flex items-center gap-1.5 px-1.5 py-1.5 text-[12px] font-medium text-on-surface">
                <ChevronDown size={13} className="text-on-surface-variant" />
                Văn bản
                <span className="ml-auto min-w-[16px] h-[16px] leading-[16px] text-center bg-error text-white rounded-full text-[10px] font-semibold px-1">1</span>
              </div>
              <div className="ml-3 flex items-center gap-1.5 px-2 py-1.5 rounded-[3px] bg-[#fdeaea] border border-[#f3c0bb] text-[12px] text-error font-medium">
                <FileText size={12} className="flex-shrink-0" />
                <span className="truncate">{vb.trichYeu}</span>
              </div>

              <div onClick={() => setMoDinhKem(m => !m)}
                className="flex items-center gap-1.5 px-1.5 py-1.5 mt-2 text-[12px] font-medium text-on-surface cursor-pointer">
                {moDinhKem ? <ChevronDown size={13} className="text-on-surface-variant" /> : <ChevronRight size={13} className="text-on-surface-variant" />}
                Tài liệu đính kèm
                {vb.donDinhKem.length > 0 && (
                  <span className="ml-auto min-w-[16px] h-[16px] leading-[16px] text-center bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-semibold px-1">
                    {vb.donDinhKem.length}
                  </span>
                )}
              </div>
              {moDinhKem && (
                vb.donDinhKem.length === 0
                  ? <div className="px-3 py-1 text-[11px] text-outline italic">Không có tài liệu đính kèm</div>
                  : <div className="ml-3 space-y-1">
                    {vb.donDinhKem.map(d => (
                      <div key={d.ma} className="flex items-center gap-1.5 px-2 py-1.5 rounded-[3px] hover:bg-surface-container text-[12px] text-on-surface cursor-pointer">
                        <FileText size={12} className="flex-shrink-0 text-on-surface-variant" />
                        <span className="truncate">{d.ma} — {d.nguoiGui}</span>
                      </div>
                    ))}
                  </div>
              )}
            </div>
          </div>

          {/* ── Cột giữa: xem trước tài liệu ── */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#eef1f5]">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-[#e5e5e5] flex-shrink-0">
              <FileText size={14} className="text-primary flex-shrink-0" />
              <span className="text-[13px] font-medium text-primary truncate">
                Xem trước tài liệu ({vb.trichYeu})
              </span>
              <div className="ml-auto flex items-center gap-0.5 flex-shrink-0">
                <NutIcon title="Phóng to" onClick={() => setZoom(z => Math.min(180, z + 10))}><ZoomIn size={14} /></NutIcon>
                <NutIcon title="Thu nhỏ" onClick={() => setZoom(z => Math.max(60, z - 10))}><ZoomOut size={14} /></NutIcon>
                <NutIcon title="Xoay" onClick={() => setXoay(x => (x + 90) % 360)}><RotateCcw size={14} /></NutIcon>
                <NutIcon title="Tải xuống" onClick={() => { }}><Download size={14} /></NutIcon>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <div className="bg-white mx-auto shadow-sm border border-surface-container p-10 origin-top transition-transform"
                style={{ width: 720, transform: `scale(${zoom / 100}) rotate(${xoay}deg)` }}>
                {vb.soVanBan && (
                  <div className="text-center text-[12px] text-on-surface-variant mb-4">
                    Số: {vb.soVanBan}
                    {vb.trangThaiSo === "tam" && <span className="ml-1 text-[#b45309]">(số tạm)</span>}
                  </div>
                )}
                <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-on-surface"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}>{noiDung}</pre>
              </div>
            </div>
          </div>

          {/* ── Cột phải: ý kiến lãnh đạo ── */}
          <div className="w-[330px] flex-shrink-0 border-l border-[#e5e5e5] flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">

              <div>
                <div className="text-[12px] font-semibold text-on-surface mb-1.5">Nội dung xin ý kiến lãnh đạo</div>
                <div className="relative">
                  <div className="w-full min-h-[80px] border border-surface-container rounded-[4px] px-2.5 py-2 text-[12px] leading-relaxed bg-white text-on-surface">
                    {vb.trichYeu}
                  </div>
                  {buoc && (
                    <div className="text-[11px] text-on-surface-variant mt-1">
                      Bước {vb.buocHienTai + 1}/{vb.luongKy.length} · {buoc.nguoi} — {buoc.chucVu} ({NHAN_VAI_TRO_BUOC[buoc.vaiTro]})
                    </div>
                  )}
                </div>
              </div>

              {/* Đánh dấu & ghi chú */}
              <div className="border border-[#e5e5e5] rounded-[4px] overflow-hidden">
                <div className="flex items-center gap-1.5 px-2.5 py-2 bg-surface-bright border-b border-surface-container-high text-[12px] font-semibold text-on-surface">
                  <History size={13} className="text-on-surface-variant" />
                  Đánh dấu &amp; Ghi chú ({ghiChu.length})
                </div>
                <div className="p-2.5">
                  {ghiChu.length === 0 ? (
                    <div className="border border-dashed border-surface-container rounded-[4px] py-6 flex flex-col items-center gap-1.5 text-outline">
                      <MessageSquare size={18} />
                      <span className="text-[11px]">Chưa có đánh dấu</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ghiChu.map(g => (
                        <div key={g.id} className="rounded-[4px] bg-[#fffbeb] border border-[#fcd48a] px-2.5 py-2">
                          <div className="text-[12px] text-on-surface leading-relaxed">{g.noiDung}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-on-surface-variant">{g.nguoi} · {g.thoiGian}</span>
                            <button onClick={() => setGhiChu(p => p.filter(x => x.id !== g.id))}
                              className="ml-auto text-[10px] text-error hover:underline">Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {dangThemGhiChu ? (
                    <div className="mt-2">
                      <textarea value={ghiChuMoi} onChange={e => setGhiChuMoi(e.target.value)} rows={3} autoFocus
                        placeholder="Nhập nội dung ghi chú…"
                        className="w-full border border-surface-container-highest rounded-[3px] px-2 py-1.5 text-[12px] leading-relaxed resize-none focus:outline-none focus:border-primary" />
                      <div className="flex justify-end gap-2 mt-1.5">
                        <button onClick={() => { setDangThemGhiChu(false); setGhiChuMoi(""); }}
                          className="h-[26px] px-2.5 border border-surface-container-highest rounded-[3px] text-[11px] text-on-surface-variant hover:bg-surface-container-low">Hủy</button>
                        <button disabled={!ghiChuMoi.trim()}
                          onClick={() => {
                            setGhiChu(p => [...p, { id: p.length + 1, noiDung: ghiChuMoi.trim(), nguoi: nguoiDung, thoiGian: bayGio() }]);
                            setGhiChuMoi(""); setDangThemGhiChu(false);
                          }}
                          className="h-[26px] px-3 rounded-[3px] bg-error hover:bg-error-container disabled:opacity-40 text-white text-[11px] font-semibold">Lưu</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setDangThemGhiChu(true)}
                      className="w-full mt-2 h-[32px] rounded-[4px] bg-error hover:bg-error-container text-white text-[12px] font-semibold transition-colors">
                      + Thêm ghi chú mới
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-semibold text-on-surface mb-1.5">
                  Ý kiến của lãnh đạo
                  {vb.trangThai === "ChoButPhe" && <span className="text-error ml-1">*</span>}
                </div>
                <textarea value={yKien} onChange={e => setYKien(e.target.value)} rows={7}
                  placeholder="Nhập ý kiến lãnh đạo..."
                  className={`w-full border rounded-[4px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none
                    ${thieuYKien ? "border-error" : "border-surface-container focus:border-primary"}`} />
                <div className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                  {vb.trangThai === "ChoButPhe"
                    ? "Bút phê là nội dung chỉ đạo — bắt buộc nhập."
                    : "Từ chối bắt buộc nêu lý do (tối thiểu 10 ký tự)."}
                </div>
              </div>
            </div>

            {/* Footer hành động */}
            <div className="flex items-center justify-end gap-2 px-3 py-2.5 border-t border-[#e5e5e5] bg-surface-bright flex-shrink-0">
              <button onClick={onClose}
                className="h-[32px] px-3 border border-surface-container-highest rounded-[4px] bg-white text-[12px] text-on-surface-variant hover:bg-surface-container-low transition-colors">
                Quay lại
              </button>
              {laNguoiGiu && (
                <>
                  <button onClick={tuChoi} disabled={yKien.trim().length < 10}
                    title={yKien.trim().length < 10 ? "Nhập ý kiến từ chối (tối thiểu 10 ký tự)" : undefined}
                    className="h-[32px] px-3 border border-error rounded-[4px] bg-white text-[12px] font-medium text-error hover:bg-[#fdecea] disabled:opacity-40 disabled:hover:bg-white transition-colors">
                    <span className="inline-flex items-center gap-1.5"><Ban size={13} /> Từ chối</span>
                  </button>
                  <button onClick={duyet} disabled={thieuYKien}
                    title={thieuYKien ? "Nhập nội dung bút phê để tiếp tục" : undefined}
                    className="h-[32px] px-4 rounded-[4px] bg-[#1a7a45] hover:bg-[#14653a] disabled:opacity-40 disabled:hover:bg-[#1a7a45] text-white text-[12px] font-semibold transition-colors">
                    <span className="inline-flex items-center gap-1.5">{nutChinh.icon} {nutChinh.nhan}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Màn "Lãnh đạo phê duyệt ý kiến" (riêng cho TỜ TRÌNH) ────────────────────
// Tờ trình là văn bản xin ý kiến, không phải văn bản ban hành — nên thay vì
// khối ký số, màn này xoay quanh ô Ý kiến lãnh đạo và việc đề xuất trình tiếp.
const laToTrinh = (loaiVanBan: string) => /tờ trình/i.test(loaiVanBan);

const CAP_TRINH_TIEP = [
  "Phó Chánh văn phòng", "Chánh Văn phòng", "Phó Chánh án", "Chánh án",
];
const NGUOI_TRINH_TIEP = [
  "Nguyễn Mạnh Hùng — Phó Chánh văn phòng",
  "Đỗ Thu Trang — Phó Chánh văn phòng",
  "Phạm Văn Nha — Chánh Văn phòng",
  "Đặng Quốc Trung — Phó Chánh án",
];

// Ghi nhớ Cấp trình tiếp / Người đề xuất trình theo từng loại văn bản, để lần
// trình tiếp sau (cùng loại văn bản) tự điền lại thay vì phải chọn lại từ đầu.
const KEY_GHI_NHO_TRINH_TIEP = "hctp_ghiNho_deXuatTrinhTiep";
type GhiNhoTrinhTiep = { capTrinh: string; nguoiTrinh: string };

const docGhiNhoTrinhTiep = (loaiVanBan: string): GhiNhoTrinhTiep | null => {
  try {
    const map = JSON.parse(localStorage.getItem(KEY_GHI_NHO_TRINH_TIEP) ?? "{}");
    return map[loaiVanBan] ?? null;
  } catch { return null; }
};
const luuGhiNhoTrinhTiep = (loaiVanBan: string, data: GhiNhoTrinhTiep) => {
  try {
    const map = JSON.parse(localStorage.getItem(KEY_GHI_NHO_TRINH_TIEP) ?? "{}");
    map[loaiVanBan] = data;
    localStorage.setItem(KEY_GHI_NHO_TRINH_TIEP, JSON.stringify(map));
  } catch { /* localStorage không khả dụng — bỏ qua */ }
};

const ManPheDuyetYKien = ({ vb, nguoiDung, chucVu, danhSach, onCapNhat, onClose }: {
  vb: VanBanTrinh; nguoiDung: string; chucVu: string; danhSach: VanBanTrinh[];
  onCapNhat: (v: VanBanTrinh) => void; onClose: () => void;
}) => {
  const [tab, setTab] = useState<"ykien" | "thongtin">("ykien");
  const [yKien, setYKien] = useState("Lãnh đạo đề xuất ý kiến:");
  const [capTrinh, setCapTrinh] = useState(() => docGhiNhoTrinhTiep(vb.loaiVanBan)?.capTrinh ?? "");
  const [nguoiTrinh, setNguoiTrinh] = useState(() => docGhiNhoTrinhTiep(vb.loaiVanBan)?.nguoiTrinh ?? "");
  const chonCapTrinh = (v: string) => { setCapTrinh(v); luuGhiNhoTrinhTiep(vb.loaiVanBan, { capTrinh: v, nguoiTrinh }); };
  const chonNguoiTrinh = (v: string) => { setNguoiTrinh(v); luuGhiNhoTrinhTiep(vb.loaiVanBan, { capTrinh, nguoiTrinh: v }); };
  const [zoom, setZoom] = useState(100);
  const [xoay, setXoay] = useState(0);
  const [suaWord, setSuaWord] = useState(false);
  const [moThongTin, setMoThongTin] = useState(true);
  const [xemDienBien, setXemDienBien] = useState(false);
  const [bao, setBao] = useState("");
  /** null = đang xem chính tờ trình; mã đơn = đang xem danh sách đơn kèm theo. */
  const [taiLieuXem, setTaiLieuXem] = useState<string | null>(null);
  const donDangXem = taiLieuXem ? vb.donDinhKem.find(d => d.ma === taiLieuXem) ?? null : null;

  const pbHienTai = vb.phienBan.find(p => p.so === vb.phienBanHienTai);
  const [noiDung, setNoiDung] = useState(pbHienTai?.noiDung ?? "");
  const laNguoiGiu = nguoiDangGiu(vb)?.nguoi === nguoiDung;
  const buoc = vb.luongKy[vb.buocHienTai];

  // Ý kiến của người ở bước trước — cái mà lãnh đạo đang phải cho ý kiến tiếp
  const yKienTruoc = [...vb.lichSu].reverse().find(m => m.yKien?.trim());

  const MAX = 4000;
  // Trình ký: nội dung đề xuất là tuỳ chọn. Từ chối: bắt buộc nêu lý do.
  const duLyDoTuChoi = yKien.trim().length >= 10;
  const [daBamTuChoi, setDaBamTuChoi] = useState(false);
  const thieuLyDoTuChoi = daBamTuChoi && !duLyDoTuChoi;

  const xong = (v: VanBanTrinh) => { onCapNhat(v); onClose(); };
  const luuVaKy = (logic: boolean) => {
    const ghiChuY = yKien.trim();
    const ghi = ghiChuY ? (logic ? `${ghiChuY} (ký logic)` : ghiChuY) : undefined;
    if (vb.trangThai === "ChoButPhe") return xong(apButPhe(vb, nguoiDung, chucVu, ghi ?? ""));
    if (vb.trangThai === "ChoKy") return xong(apKySo(vb, nguoiDung, chucVu, danhSach));
    xong(apDuyet(vb, nguoiDung, chucVu, ghi));
  };
  const tuChoi = () => {
    setDaBamTuChoi(true);
    if (!duLyDoTuChoi) return;
    xong(apTraLai(vb, nguoiDung, chucVu, yKien.trim()));
  };

  const NutIcon = ({ children, onClick, title }: any) => (
    <button onClick={onClick} title={title}
      className="w-[26px] h-[26px] flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container transition-colors">
      {children}
    </button>
  );
  const OSel = ({ value, onChange, holder, options }: any) => (
    <div className="relative">
      <select value={value} onChange={(e: any) => onChange(e.target.value)}
        className={`w-full h-[36px] pl-2.5 pr-7 text-[13px] border border-surface-container rounded-[4px] bg-white appearance-none focus:outline-none focus:border-primary ${value ? "text-on-surface" : "text-outline"}`}>
        <option value="">{holder}</option>
        {options.map((o: string) => <option key={o} value={o} className="text-on-surface">{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col">

      {/* Thanh trên */}
      <div className="px-6 pt-4 pb-3 border-b border-surface-container-high flex items-start justify-between flex-shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[12px] text-on-surface-variant mb-1">
            <span>Trang chủ</span><span className="text-[#bbb]">/</span>
            <span>Công tác lãnh đạo</span><span className="text-[#bbb]">/</span>
            <span>Phê duyệt đề xuất</span><span className="text-[#bbb]">/</span>
            <span className="text-error font-medium">Ý kiến lãnh đạo</span>
          </div>
          <h1 className="text-[19px] font-bold text-tertiary leading-tight">Lãnh đạo phê duyệt ý kiến</h1>
          <div className="text-[12px] text-on-surface-variant mt-0.5">
            {vb.soVanBan ?? "— chưa số —"} · {vb.trichYeu}
          </div>
        </div>
        <button onClick={onClose}
          className="flex items-center gap-1.5 h-[34px] px-3.5 border border-surface-container-highest rounded-[4px] bg-white text-[13px] text-on-surface hover:bg-surface-container-low transition-colors flex-shrink-0">
          <ChevronRight size={14} className="rotate-180" /> Quay lại
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-surface-container-high flex items-end gap-6 flex-shrink-0">
        {([["ykien", "Ý kiến lãnh đạo"], ["thongtin", "Thông tin tờ trình"]] as const).map(([id, nhan]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`py-2.5 text-[14px] border-b-2 transition-colors ${tab === id
              ? "border-error text-error font-semibold" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
            {nhan}
          </button>
        ))}
      </div>

      <div className="flex-1 flex min-h-0">

        {/* ── Trái: ý kiến ── */}
        <div className="w-[640px] flex-shrink-0 overflow-y-auto p-5 space-y-4">
          {tab === "ykien" ? (
            <>
              <div className="border border-[#e5e5e5] rounded-[6px] overflow-hidden">
                <div onClick={() => setMoThongTin(m => !m)}
                  className="px-4 py-3 cursor-pointer hover:bg-surface-bright transition-colors">
                  <div className="flex items-center gap-1.5 text-[14px] font-semibold text-tertiary">
                    {moThongTin ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {vb.loaiVanBan} - Số {vb.soVanBan ?? "— chưa số —"}
                  </div>
                  <div className="text-[12px] text-on-surface-variant mt-0.5 ml-5">
                    TLM: {vb.id.replace(/\D/g, "") || "—"} · Ngày TL: {vb.ngayCapSo ?? "—"}
                  </div>
                </div>

                {moThongTin && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Ý kiến của bước trước */}
                    {yKienTruoc && (
                      <div className="rounded-[4px] bg-[#eaf4ff] border border-surface-variant px-3 py-2.5">
                        <div className="flex items-start gap-2">
                          <div className="text-[13px] font-semibold text-primary leading-snug">
                            Ý kiến đề xuất <span className="font-normal text-on-surface-variant">|</span> {yKienTruoc.chucVu} - {yKienTruoc.nguoi}
                          </div>
                          <button onClick={() => setXemDienBien(v => !v)}
                            className="ml-auto flex items-center gap-1 text-[12px] text-primary hover:underline flex-shrink-0">
                            <History size={12} /> Xem diễn biến
                          </button>
                        </div>
                        <div className="text-[13px] text-on-surface mt-1 leading-relaxed">{yKienTruoc.yKien}</div>
                        {xemDienBien && (
                          <div className="mt-2.5 pt-2.5 border-t border-surface-variant space-y-1.5">
                            {vb.lichSu.map((m, i) => (
                              <div key={i} className="text-[12px] text-on-surface-variant leading-snug">
                                <span className="text-on-surface-variant">{m.thoiGian}</span> · <b>{m.nguoi}</b> ({m.chucVu}) — {HANH_DONG_NHAN[m.hanhDong]}
                                {m.yKien && <span className="italic"> : {m.yKien}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Ô ý kiến lãnh đạo */}
                    <div className="border border-[#e5e5e5] rounded-[4px]">
                      <div className="flex items-center px-3 py-2 border-b border-surface-container-high">
                        <span className="text-[13px] text-on-surface-variant">Ý kiến lãnh đạo</span>
                        <button onClick={() => setYKien("Lãnh đạo đề xuất ý kiến:")} title="Đặt lại"
                          className="ml-auto text-on-surface-variant hover:text-on-surface"><RotateCcw size={13} /></button>
                      </div>
                      <div className="p-3">
                        {/* Không đánh dấu bắt buộc cố định: trình ký thì để trống
                            được, chỉ TỪ CHỐI mới bắt buộc nêu lý do. */}
                        <label className="block text-[13px] text-on-surface mb-1.5">
                          Nội dung đề xuất
                          <span className="text-on-surface-variant font-normal"> (bắt buộc khi từ chối)</span>
                        </label>
                        <textarea value={yKien} maxLength={MAX} rows={4}
                          onChange={e => setYKien(e.target.value)}
                          placeholder="Nhập nội dung đề xuất…"
                          className={`w-full border rounded-[4px] px-2.5 py-2 text-[13px] leading-relaxed resize-none focus:outline-none
                            ${thieuLyDoTuChoi ? "border-error" : "border-surface-container focus:border-primary"}`} />
                        <div className="flex items-center mt-1">
                          {thieuLyDoTuChoi && (
                            <span className="text-[12px] text-error">Từ chối phải nêu lý do, tối thiểu 10 ký tự.</span>
                          )}
                          <span className="ml-auto text-[12px] text-outline">{yKien.length} / {MAX}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Đề xuất trình tiếp */}
              <div className="border border-[#e5e5e5] rounded-[6px] overflow-hidden">
                <div className="px-4 py-2.5 bg-[#eaf4ff] border-b border-surface-variant text-[13px] font-semibold text-tertiary">
                  Đề xuất trình tiếp
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] text-on-surface mb-1.5">Cấp trình tiếp</label>
                    <OSel value={capTrinh} onChange={chonCapTrinh} holder="Chọn cấp trình tiếp" options={CAP_TRINH_TIEP} />
                  </div>
                  <div>
                    <label className="block text-[13px] text-on-surface mb-1.5">Người đề xuất trình</label>
                    <OSel value={nguoiTrinh} onChange={chonNguoiTrinh} holder="Chọn người đề xuất trình" options={NGUOI_TRINH_TIEP} />
                  </div>
                </div>

                {bao && (
                  <div className="mx-4 mb-3 rounded-[4px] bg-[#eaf7ee] border border-[#a9debb] px-3 py-2 text-[12px] text-[#1a7a45]">
                    {bao}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 px-4 pb-4">
                  <button onClick={() => setSuaWord(s => !s)}
                    className={`h-[36px] px-3.5 border rounded-[4px] text-[13px] transition-colors ${suaWord
                      ? "border-primary bg-[#eaf4ff] text-primary font-medium"
                      : "border-surface-container-highest bg-white text-on-surface hover:bg-surface-container-low"}`}>
                    {suaWord ? "Xong chỉnh sửa" : "Chỉnh sửa Word"}
                  </button>
                  <button onClick={() => setBao("Đã lưu ý kiến. Văn bản vẫn ở bước hiện tại.")}
                    className="h-[36px] px-4 border border-surface-container-highest rounded-[4px] bg-white text-[13px] text-on-surface hover:bg-surface-container-low transition-colors">
                    Lưu
                  </button>
                  {laNguoiGiu && (
                    <>
                      {/* Từ chối — trả văn bản về người tạo, bắt buộc nêu lý do. */}
                      <button onClick={tuChoi}
                        title={duLyDoTuChoi ? undefined : "Nhập nội dung đề xuất (tối thiểu 10 ký tự) để từ chối"}
                        className="h-[36px] px-4 border border-error rounded-[4px] bg-white text-[13px] font-medium text-error hover:bg-[#fdecea] transition-colors">
                        <span className="inline-flex items-center gap-1.5"><Ban size={14} /> Từ chối</span>
                      </button>
                      {/* Trình ký: nội dung đề xuất không bắt buộc nên nút không khoá. */}
                      <button onClick={() => luuVaKy(false)}
                        className="h-[36px] px-4 rounded-[4px] bg-error hover:bg-error-container text-white text-[13px] font-semibold transition-colors">
                        Lưu và ký
                      </button>
                      <button onClick={() => luuVaKy(true)}
                        title="Ký logic — xác nhận trên hệ thống, không dùng chứng thư số"
                        className="h-[36px] px-4 rounded-[4px] bg-error hover:bg-error-container text-white text-[13px] font-semibold transition-colors">
                        Lưu và ký logic
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Tab Thông tin tờ trình — cây tài liệu giống màn tạo tờ trình phân
               công: tờ trình ở gốc, dưới là các danh sách đơn kèm theo. Bỏ bảng
               thuộc tính và mục "Đơn đính kèm" vì cùng một thông tin đã nằm ở
               ô xem trước bên phải và ở tab Ý kiến. */
            <div className="border border-[#e5e5e5] rounded-[6px] overflow-hidden">
              <div className="px-3 py-2 bg-surface-bright border-b border-surface-container-high text-[12px] font-semibold text-on-surface">
                Danh sách tài liệu
              </div>
              <div className="p-2 space-y-1">
                {/* Gốc: chính tờ trình */}
                <button type="button" onClick={() => setTaiLieuXem(null)}
                  className={`w-full text-left flex items-start gap-2 px-2 py-2 rounded-[4px] border transition-colors
                    ${taiLieuXem === null
                      ? "bg-[#fdeaea] border-error-container text-error"
                      : "bg-white border-transparent hover:bg-surface-container-low text-on-surface"}`}>
                  <FileText size={14} className="flex-shrink-0 mt-[2px]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-semibold leading-snug">{vb.loaiVanBan}</span>
                    <span className="block text-[11px] text-on-surface-variant mt-0.5 font-mono">
                      {vb.soVanBan ?? "— chưa số —"}{vb.trangThaiSo === "tam" ? " (số tạm)" : ""}
                    </span>
                  </span>
                </button>

                {/* Các danh sách đơn kèm theo — bấm để xem nội dung bên phải */}
                {vb.donDinhKem.map(d => (
                  <button key={d.ma} type="button" onClick={() => setTaiLieuXem(d.ma)}
                    className={`w-full text-left flex items-start gap-2 pl-6 pr-2 py-2 rounded-[4px] border transition-colors
                      ${taiLieuXem === d.ma
                        ? "bg-[#eaf4ff] border-surface-variant text-primary"
                        : "bg-white border-transparent hover:bg-surface-container-low text-on-surface"}`}>
                    <FileText size={13} className="flex-shrink-0 mt-[2px] text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium leading-snug">Danh sách đơn — {d.ma}</span>
                      <span className="block text-[11px] text-on-surface-variant mt-0.5 truncate">{d.nguoiGui} · {d.soBA}</span>
                    </span>
                  </button>
                ))}
                {vb.donDinhKem.length === 0 && (
                  <div className="pl-6 py-2 text-[12px] text-outline italic">Không có tài liệu kèm theo</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Phải: xem trước tài liệu ── */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#eef1f5] border-l border-[#e5e5e5]">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-[#e5e5e5] flex-shrink-0">
            <FileText size={14} className="text-primary flex-shrink-0" />
            <span className="text-[13px] font-medium text-primary">Xem trước tài liệu (Tờ trình)</span>
            <div className="ml-auto flex items-center gap-0.5">
              <NutIcon title="Phóng to" onClick={() => setZoom(z => Math.min(180, z + 10))}><ZoomIn size={14} /></NutIcon>
              <NutIcon title="Thu nhỏ" onClick={() => setZoom(z => Math.max(60, z - 10))}><ZoomOut size={14} /></NutIcon>
              <NutIcon title="Xoay" onClick={() => setXoay(x => (x + 90) % 360)}><RotateCcw size={14} /></NutIcon>
              <NutIcon title="Tải xuống" onClick={() => { }}><Download size={14} /></NutIcon>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-5">
            <div className="bg-white mx-auto shadow-sm border border-surface-container p-10 origin-top transition-transform"
              style={{ width: 700, transform: `scale(${zoom / 100}) rotate(${xoay}deg)` }}>
              {/* Đang chọn một danh sách đơn kèm theo ⇒ xem nội dung của danh sách
                  đó, không phải nội dung tờ trình. */}
              {donDangXem ? (
                <>
                  <div className="text-center text-[12px] text-on-surface-variant mb-4">
                    Danh sách đơn kèm theo — {donDangXem.ma}
                  </div>
                  <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-on-surface"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}>
{`Mục 1. Thông tin đơn
Mã đơn: ${donDangXem.ma}
Người gửi: ${donDangXem.nguoiGui}
Số bản án/quyết định: ${donDangXem.soBA}
Hình thức: ${donDangXem.hinhThuc}

Mục 2. Nội dung
Đơn nêu trên được lập danh sách kèm theo ${vb.loaiVanBan}
số ${vb.soVanBan ?? "……"} để trình cấp có thẩm quyền xem xét.

Mục 3. Kiến nghị
Kính đề nghị xem xét, cho ý kiến đối với đơn nêu trên.`}
                  </pre>
                </>
              ) : suaWord ? (
                <textarea value={noiDung} onChange={e => setNoiDung(e.target.value)} rows={26}
                  className="w-full text-[13px] leading-relaxed text-on-surface resize-none focus:outline-none"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }} />
              ) : (
                <>
                  {vb.soVanBan && (
                    <div className="text-center text-[12px] text-on-surface-variant mb-4">
                      Số: {vb.soVanBan}{vb.trangThaiSo === "tam" && <span className="ml-1 text-[#b45309]">(số tạm)</span>}
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-on-surface"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}>{noiDung}</pre>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Màn "Sổ văn bản đi" ─────────────────────────────────────────────────────
const NGUONG_QUA_HAN = 7; // ngày — tham số cấu hình, chưa được văn thư TAND TP Hà Nội xác nhận

const soNgayGiu = (ngayCapSo?: string): number | null => {
  if (!ngayCapSo) return null;
  const [d, m, y] = ngayCapSo.split("/").map(Number);
  return Math.floor((Date.now() - new Date(y, m - 1, d).getTime()) / 86400000);
};

export const SoVanBanDi = ({ danhSach }: { danhSach: VanBanTrinh[] }) => {
  const [tab, setTab] = useState<"all" | "tam" | "quahan" | "banhanh" | "huy">("all");

  const coSo = danhSach.filter(v => !!v.soVanBan);
  const quaHan = (v: VanBanTrinh) =>
    v.trangThaiSo === "tam" && v.trangThai !== "DaHuy" && (soNgayGiu(v.ngayCapSo) ?? 0) > NGUONG_QUA_HAN;

  const nhom = {
    all: coSo,
    tam: coSo.filter(v => v.trangThaiSo === "tam" && v.trangThai !== "DaHuy"),
    quahan: coSo.filter(quaHan),
    banhanh: coSo.filter(v => !!v.ngayBanHanh),
    huy: coSo.filter(v => v.trangThai === "DaHuy"),
  };
  const loc = [...nhom[tab]].sort((a, b) =>
    parseInt((a.soVanBan ?? "0").split("/")[0], 10) - parseInt((b.soVanBan ?? "0").split("/")[0], 10));

  const TABS = [
    { id: "all", nhan: `Tất cả (${nhom.all.length})` },
    { id: "tam", nhan: `Số tạm (${nhom.tam.length})` },
    { id: "quahan", nhan: `⚠️ Số tạm quá hạn (${nhom.quahan.length})` },
    { id: "banhanh", nhan: `Đã ban hành (${nhom.banhanh.length})` },
    { id: "huy", nhan: `Đã huỷ (${nhom.huy.length})` },
  ] as const;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="px-5 pt-4 flex items-center gap-3">
        <h1 className="text-[18px] font-bold text-tertiary mb-3">Sổ văn bản đi</h1>
        <div className="flex-1" />
        <div className="mb-3 flex items-center gap-2 text-[12px] text-on-surface-variant">
          Kỳ:
          <select className="h-[30px] border border-surface-container-highest rounded-[3px] px-2 text-[12px] bg-white">
            <option>Tháng 8/2026</option><option>Tháng 7/2026</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-5 border-b border-surface-container px-5">
        {TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id as any)}
            className={`py-2 cursor-pointer font-medium text-[12px] border-b-2 transition-colors
              ${tab === t.id ? "border-error text-error font-semibold" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
            {t.nhan}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-5 py-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input placeholder="Tìm số / trích yếu…"
            className="h-[30px] w-[240px] border border-surface-container-highest rounded-[3px] pl-7 pr-2 text-[12px] focus:outline-none focus:border-primary" />
        </div>
        <div className="flex-1" />
        <BtnNeutral><Download size={13} /> Kết xuất Excel</BtnNeutral>
      </div>

      <div className="flex-1 overflow-auto px-5 pb-5">
        <div className="border border-surface-container-highest rounded-[4px] overflow-hidden">
          <table className="w-full text-[12px] text-left">
            <thead className="bg-surface-container-low text-on-surface border-b border-surface-container-highest">
              <tr>
                <th className="px-3 py-2 font-medium w-[44px]">STT</th>
                <th className="px-3 py-2 font-medium w-[180px]">Số / Ký hiệu <span className="text-error text-[10px]">▲</span></th>
                <th className="px-3 py-2 font-medium">Trích yếu</th>
                <th className="px-3 py-2 font-medium w-[125px]">Đơn vị soạn thảo</th>
                <th className="px-3 py-2 font-medium w-[105px]">Ngày cấp số</th>
                <th className="px-3 py-2 font-medium w-[110px]">Ngày ban hành</th>
                <th className="px-3 py-2 font-medium w-[165px]">Trạng thái</th>
                <th className="px-3 py-2 font-medium w-[62px] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loc.map((v, i) => {
                const qh = quaHan(v);
                const ngay = soNgayGiu(v.ngayCapSo);
                return (
                  <tr key={v.id}
                    className={`border-b border-surface-container last:border-0 ${qh ? "bg-[#fef6ea]" : "hover:bg-surface-bright"}
                      ${v.trangThai === "DaHuy" ? "text-outline" : ""}`}
                    style={qh ? { boxShadow: "inset 3px 0 0 #e67e22" } : undefined}>
                    <td className="px-3 py-2 align-top">{i + 1}</td>
                    <td className="px-3 py-2 align-top"><ChipSo vb={v} /></td>
                    <td className="px-3 py-2 align-top">
                      <div className="leading-relaxed">{v.trichYeu}</div>
                      {qh && (
                        <div className="text-[11px] text-[#b45309] font-medium mt-1">
                          ⚠️ Số {v.soVanBan?.split("/")[0]} đã cấp {ngay} ngày, chưa ban hành.
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">{v.donViSoanThao}</td>
                    <td className="px-3 py-2 align-top">{v.ngayCapSo}</td>
                    <td className="px-3 py-2 align-top">{v.ngayBanHanh ?? <span className="text-on-surface-variant">—</span>}</td>
                    <td className="px-3 py-2 align-top">
                      {qh
                        ? <span className="inline-block px-2 py-[2px] rounded-full text-[10px] font-medium border bg-[#fef3e2] text-[#b45309] border-[#fcd48a]">⚠️ Số tạm quá hạn</span>
                        : <Pill tt={v.trangThai} />}
                      <div className="text-[11px] text-on-surface-variant mt-[3px]">
                        {qh && TRANG_THAI_META[v.trangThai].nhan}
                        {v.trangThai === "DaHuy" && "30/07/2026"}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-center text-primary"><Eye size={15} className="inline" /></td>
                  </tr>
                );
              })}
              {loc.length === 0 && (
                <tr><td colSpan={8} className="py-14 text-center text-[12px] text-on-surface-variant">
                  {tab === "quahan" ? "Không có số tạm nào quá 7 ngày." : "Sổ chưa có số nào trong kỳ đã chọn."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-3 text-[11px] text-on-surface-variant italic flex items-start gap-1.5">
          <Clock size={12} className="mt-0.5 flex-shrink-0" />
          <span>
            Sắp theo <b>số</b>, không theo ngày ban hành — hệ quả bình thường của quy tắc
            “một số duy nhất, không thu hồi”. Sổ bày ra thay vì giấu.
          </span>
        </div>
      </div>
    </div>
  );
};
