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
  ChevronRight, Clock, PenLine, Save,
} from "lucide-react";

// ─── Kiểu dữ liệu ────────────────────────────────────────────────────────────
export type TrangThaiVB =
  | "Nhap" | "ChoDuyet" | "ChoKy" | "BiTraLai" | "DaKy" | "DaBanHanh" | "DaHuy";

export type HanhDong =
  | "Tao" | "LaySoTam" | "Trinh" | "Duyet" | "SuaVaDuyet" | "TraLai" | "Ky" | "BanHanh";

export interface BuocKy {
  thuTu: number;
  nguoi: string;
  chucVu: string;
  vaiTro: "duyet" | "ky";
  ketQua?: "da_duyet" | "tra_lai" | "da_ky";
  thoiGian?: string;
}

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
  if (["DaKy", "DaBanHanh", "DaHuy"].includes(vb.trangThai)) return null;
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
    case "lanh-dao": return { nguoi: "Nguyễn Thị Bình", chucVu: "Vụ trưởng" };
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
  "Tờ trình phân công": "TTr", "Tờ trình khác": "TTr", "Tờ trình": "TTr",
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
  }, 540);
  return `${max + 1}/${new Date().getFullYear()}/${kyHieuTheoLoai(loaiVanBan)}-TANDTC-VP`;
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

export const apTrinhDuyet = (vb: VanBanTrinh, nguoi: string, chucVu: string): VanBanTrinh => {
  if (!vb.luongKy.length) return vb;
  return {
    ...vb, trangThai: vb.luongKy[0].vaiTro === "ky" ? "ChoKy" : "ChoDuyet", buocHienTai: 0,
    lichSu: themMoc(vb, { thoiGian: bayGio(), nguoi, chucVu, hanhDong: "Trinh" }),
  };
};

export const apDuyet = (vb: VanBanTrinh, nguoi: string, chucVu: string, yKien?: string): VanBanTrinh => {
  const luongKy = vb.luongKy.map((b, i) =>
    i === vb.buocHienTai ? { ...b, ketQua: "da_duyet" as const, thoiGian: bayGio() } : b);
  const tiep = vb.buocHienTai + 1;
  const con = tiep < luongKy.length;
  return {
    ...vb, luongKy, buocHienTai: con ? tiep : vb.buocHienTai,
    trangThai: con ? (luongKy[tiep].vaiTro === "ky" ? "ChoKy" : "ChoDuyet") : "ChoKy",
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
    trangThai: con ? (luongKy[tiep].vaiTro === "ky" ? "ChoKy" : "ChoDuyet") : "ChoKy",
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
    trangThai: vb.luongKy[0]?.vaiTro === "ky" ? "ChoKy" : "ChoDuyet",
    luongKy: vb.luongKy.map(b => ({ ...b, ketQua: undefined, thoiGian: undefined })),
    lichSu: themMoc(vb, {
      vongTrinh: vongMoi, thoiGian: bayGio(), nguoi, chucVu, hanhDong: "Trinh",
      phienBanTruoc: truoc, phienBanSau: truoc !== undefined ? so : undefined,
    }),
  };
};

/** Ký số: nếu chưa có số thì TỰ CẤP số chính thức. Số đã có thì giữ nguyên,
 *  chỉ chuyển trạng thái tạm → chính thức. Không bao giờ đổi số. */
export const apKySo = (vb: VanBanTrinh, nguoi: string, chucVu: string, ds: VanBanTrinh[]): VanBanTrinh => {
  const luongKy = vb.luongKy.map((b, i) =>
    i === vb.buocHienTai ? { ...b, ketQua: "da_ky" as const, thoiGian: bayGio() } : b);
  const so = vb.soVanBan ?? soKeTiep(ds, vb.loaiVanBan);
  return {
    ...vb, luongKy, trangThai: "DaKy",
    soVanBan: so, trangThaiSo: "chinhThuc",
    ngayCapSo: vb.ngayCapSo ?? homNay(),
    ngayBanHanh: homNay(),
    lichSu: themMoc(vb, { thoiGian: bayGio(), nguoi, chucVu, hanhDong: "Ky" }),
  };
};

export const apBanHanh = (vb: VanBanTrinh, nguoi: string, chucVu: string): VanBanTrinh => ({
  ...vb, trangThai: "DaBanHanh",
  lichSu: themMoc(vb, { thoiGian: bayGio(), nguoi, chucVu, hanhDong: "BanHanh" }),
});

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
    donViSoanThao: "Vụ GĐKT & DS",
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
  Nhap:      { nhan: "Nháp",        cls: "bg-[#f5f5f5] text-[#666] border-[#ddd]",       icon: "📝" },
  ChoDuyet:  { nhan: "Chờ duyệt",   cls: "bg-[#e8f4ff] text-[#1a73e8] border-[#a9c9f4]", icon: "⏳" },
  ChoKy:     { nhan: "Chờ ký",      cls: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]", icon: "✍️" },
  BiTraLai:  { nhan: "Bị trả lại",  cls: "bg-[#fde8e8] text-[#8b1a1a] border-[#f5b7b7]", icon: "⛔" },
  DaKy:      { nhan: "Đã ký",       cls: "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]", icon: "✅" },
  DaBanHanh: { nhan: "Đã ban hành", cls: "bg-[#e8f0fe] text-[#1a5a96] border-[#c5d8f8]", icon: "✅" },
  DaHuy:     { nhan: "Đã huỷ",      cls: "bg-[#f0f0f0] text-[#999] border-[#ddd]",       icon: "⊘" },
};

const HANH_DONG_NHAN: Record<HanhDong, string> = {
  Tao: "Tạo văn bản", LaySoTam: "Lấy số tạm", Trinh: "Trình duyệt",
  Duyet: "Duyệt", SuaVaDuyet: "Sửa & duyệt", TraLai: "Trả lại",
  Ky: "Ký số", BanHanh: "Ban hành",
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
  if (!vb.soVanBan) return <span className="text-[11px] text-[#888] italic">— chưa số —</span>;
  const tam = vb.trangThaiSo === "tam";
  return (
    <>
      <div className="font-mono text-[12px] font-medium tracking-tight text-[#333] leading-tight">{vb.soVanBan}</div>
      <span className={`inline-block mt-[3px] px-[5px] py-[1px] rounded-[2px] text-[10px] font-medium border
        ${tam ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]" : "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"}`}>
        {tam ? "tạm" : "chính thức"}
      </span>
    </>
  );
};

// ─── Nút ─────────────────────────────────────────────────────────────────────
const BtnPrimary = ({ children, onClick, disabled, title }: any) => (
  <button type="button" onClick={onClick} disabled={disabled} title={title}
    className={`inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] text-[12px] font-medium text-white transition-colors
      ${disabled ? "bg-[#d9c4c4] cursor-not-allowed" : "bg-[#8b1a1a] hover:bg-[#6e1414]"}`}>
    {children}
  </button>
);
const BtnOutline = ({ children, onClick }: any) => (
  <button type="button" onClick={onClick}
    className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-[#8b1a1a] text-[#8b1a1a] bg-white text-[12px] font-medium hover:bg-[#fdeaea] transition-colors">
    {children}
  </button>
);
const BtnNeutral = ({ children, onClick }: any) => (
  <button type="button" onClick={onClick}
    className="inline-flex items-center gap-1.5 h-[28px] px-3 rounded-[3px] border border-[#ccc] text-[#333] bg-white text-[12px] font-medium hover:bg-[#f5f5f5] transition-colors">
    {children}
  </button>
);

// ─── Dữ liệu mẫu ─────────────────────────────────────────────────────────────
const ND_545_V1 = `Mục 1. Căn cứ đề xuất
Căn cứ Bộ luật Tố tụng dân sự năm 2015;
Căn cứ Luật Tổ chức Tòa án nhân dân năm 2014;
Căn cứ Điều 337 Bộ luật Tố tụng dân sự;
Xét đề nghị của Vụ Giám đốc kiểm tra và dân sự,

Mục 2. Nội dung phân công
Phân công Thẩm phán Nguyễn Như Thắng chủ trì giải quyết các đơn đề nghị
giám đốc thẩm nêu tại Danh sách đơn kèm theo Tờ trình này (03 đơn).
Thời hạn giải quyết: theo quy định chung.

Mục 3. Tổ chức thực hiện
Vụ Giám đốc kiểm tra và dân sự chịu trách nhiệm theo dõi, đôn đốc.`;

const ND_545_V2 = `Mục 1. Căn cứ đề xuất
Căn cứ Bộ luật Tố tụng dân sự năm 2015;
Căn cứ Luật Tổ chức Tòa án nhân dân năm 2014;
Căn cứ khoản 2 Điều 337 Bộ luật Tố tụng dân sự;
Căn cứ Nghị quyết 03/2019/NQ-HĐTP ngày 08/5/2019 của Hội đồng Thẩm phán;
Xét đề nghị của Vụ Giám đốc kiểm tra và dân sự,

Mục 2. Nội dung phân công
Phân công Thẩm phán Nguyễn Như Thắng chủ trì giải quyết các đơn đề nghị
giám đốc thẩm nêu tại Danh sách đơn kèm theo Tờ trình này (03 đơn).
Thời hạn giải quyết: 30 ngày kể từ ngày ký Tờ trình này.

Mục 3. Tổ chức thực hiện
Vụ Giám đốc kiểm tra và dân sự chịu trách nhiệm theo dõi, đôn đốc.`;

const luong3 = (): BuocKy[] => [
  { thuTu: 1, nguoi: "Nguyễn Văn Hùng", chucVu: "Trưởng phòng", vaiTro: "duyet" },
  { thuTu: 2, nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", vaiTro: "duyet" },
  { thuTu: 3, nguoi: "Đỗ Thu Trang", chucVu: "Phó Chánh văn phòng", vaiTro: "ky" },
];

export const DU_LIEU_MAU: VanBanTrinh[] = [
  {
    id: "vb-545",
    trichYeu: "Tờ trình phân công thẩm phán – Vụ Giám đốc kiểm tra và dân sự",
    loaiVanBan: "Tờ trình phân công", donViSoanThao: "Vụ GĐKT & DS",
    soVanBan: "545/2026/TTr-TANDTC-VP", trangThaiSo: "tam", ngayCapSo: "02/08/2026",
    trangThai: "BiTraLai", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 2,
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
    trichYeu: "Công văn chuyển đơn sang Tòa án nhân dân cấp cao tại Đà Nẵng",
    loaiVanBan: "Công văn chuyển tòa khác", donViSoanThao: "Vụ GĐKT & DS",
    soVanBan: "547/2026/CV-TANDTC-VP", trangThaiSo: "tam", ngayCapSo: "05/08/2026",
    trangThai: "BiTraLai", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 2, phienBanHienTai: 2,
    phienBan: [
      { so: 1, noiDung: "Kính gửi: Tòa án nhân dân cấp cao tại Đà Nẵng\nChuyển đơn đề nghị giám đốc thẩm số 89/2025/KDTM-GDT\nđể giải quyết theo thẩm quyền.", nguoiSua: "Vũ Văn Yên", thoiGian: "05/08/2026 10:02" },
      { so: 2, noiDung: "Kính gửi: Tòa án nhân dân cấp cao tại Đà Nẵng\nChuyển đơn đề nghị giám đốc thẩm số 89/2025/KDTM-GDT\nkèm toàn bộ tài liệu để giải quyết theo thẩm quyền.", nguoiSua: "Vũ Văn Yên", thoiGian: "05/08/2026 15:40" },
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
    loaiVanBan: "Công văn chuyển nội bộ", donViSoanThao: "Vụ GĐKT & DS",
    trangThai: "Nhap", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Kính gửi: Vụ Pháp chế và Quản lý khoa học\nChuyển hồ sơ vụ án dân sự số 112/2026/DS-GDT\nđể phối hợp giải quyết.", nguoiSua: "Vũ Văn Yên", thoiGian: "05/08/2026 09:40" }],
    lichSu: [{ vongTrinh: 1, thoiGian: "05/08/2026 09:40", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 }],
    donDinhKem: [],
  },
  {
    id: "vb-546",
    trichYeu: "Tờ trình đề xuất chi phí giám định tư pháp bổ sung",
    loaiVanBan: "Tờ trình khác", donViSoanThao: "Vụ Pháp chế",
    soVanBan: "546/2026/TTr-TANDTC-VP", trangThaiSo: "tam", ngayCapSo: "03/08/2026",
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
    loaiVanBan: "Thông báo phân công TP", donViSoanThao: "Vụ GĐKT & DS",
    soVanBan: "544/2026/TB-TANDTC-VP", trangThaiSo: "tam", ngayCapSo: "01/08/2026",
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
      { ma: "Mã 7031", nguoiGui: "Tòa án nhân dân tỉnh Bắc Ninh", soBA: "BA_2107", hinhThuc: "Công văn kiến nghị" },
    ],
  },
  {
    id: "vb-551",
    trichYeu: "Tờ trình đề xuất chi phí giám định tư pháp quý III",
    loaiVanBan: "Tờ trình khác", donViSoanThao: "Vụ Kế hoạch – TC",
    soVanBan: "551/2026/TTr-TANDTC-VP", trangThaiSo: "chinhThuc",
    ngayCapSo: "06/08/2026", ngayBanHanh: "06/08/2026",
    trangThai: "DaKy", nguoiTao: "Vũ Văn Yên",
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
    loaiVanBan: "Trả lại đơn", donViSoanThao: "Vụ GĐKT & DS",
    soVanBan: "541/2026/QĐ-TANDTC", trangThaiSo: "chinhThuc",
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
    loaiVanBan: "Tờ trình khác", donViSoanThao: "Vụ Kế hoạch – TC",
    soVanBan: "549/2026/TTr-TANDTC-VP", trangThaiSo: "tam", ngayCapSo: "23/07/2026",
    trangThai: "DaHuy", nguoiTao: "Vũ Văn Yên",
    luongKy: luong3(), buocHienTai: 0, vongTrinh: 1, phienBanHienTai: 1,
    phienBan: [{ so: 1, noiDung: "Nội dung đã huỷ.", nguoiSua: "Vũ Văn Yên", thoiGian: "23/07/2026 08:00" }],
    lichSu: [
      { vongTrinh: 1, thoiGian: "23/07/2026 08:00", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "Tao", phienBanSau: 1 },
      { vongTrinh: 1, thoiGian: "23/07/2026 08:05", nguoi: "Vũ Văn Yên", chucVu: "Cán bộ", hanhDong: "LaySoTam" },
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
          <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-center justify-between">
            <div className="text-[15px] font-bold">So sánh phiên bản</div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><X size={16} /></button>
          </div>
          <div className="py-11 px-4 text-center text-[12px] text-[#666]">
            <ArrowLeftRight size={26} className="mx-auto mb-2.5 opacity-30" />
            Đây là phiên bản đầu tiên, không có bản trước để so sánh.
          </div>
          <div className="border-t border-[#e0e0e0] px-4 py-3 flex justify-end">
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
        <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-start justify-between flex-shrink-0">
          <div>
            <div className="text-[15px] font-bold">So sánh phiên bản</div>
            <div className="text-[11px] opacity-70 mt-0.5 font-mono">{vb.soVanBan ?? "— chưa số —"}</div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={16} /></button>
        </div>

        <div className="px-4 py-3 border-b border-[#e0e0e0] bg-[#fafafa] flex-shrink-0">
          <div className="flex items-center gap-2.5 text-[12px]">
            <span className="h-[28px] px-2.5 inline-flex items-center border border-[#ccc] rounded-[3px] bg-white font-medium">v{pbTruoc.so}</span>
            <span className="text-[#888]">→</span>
            <span className="h-[28px] px-2.5 inline-flex items-center border border-[#ccc] rounded-[3px] bg-white font-medium">v{pbSau.so}</span>
            <span className="ml-auto text-[11px] text-[#666]">
              {moc.nguoi} · {moc.chucVu} · {moc.thoiGian} · {HANH_DONG_NHAN[moc.hanhDong]}
            </span>
          </div>
          {moc.yKien && (
            <div className="mt-2.5 bg-[#fde8e8] border-l-[3px] border-[#8b1a1a] rounded-[3px] px-3 py-2 text-[12px] leading-relaxed">
              💬 “{moc.yKien}”
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-1.5 text-[12px] leading-[1.7]">
          {dong.map((d, i) => (
            <div key={i} className={`flex items-start pr-4
              ${d.loai === "add" ? "bg-[#e8f7ee]" : d.loai === "del" ? "bg-[#fdeaea]" : ""}`}>
              <div className={`w-[34px] flex-shrink-0 text-center font-mono select-none
                ${d.loai === "add" ? "text-[#1a7a45] font-bold" : d.loai === "del" ? "text-[#c0392b] font-bold" : "text-[#bbb]"}`}>
                {d.loai === "add" ? "+" : d.loai === "del" ? "−" : ""}
              </div>
              <div className={`flex-1 px-2 py-[2px] whitespace-pre-wrap
                ${d.loai === "add" ? "text-[#1a7a45]" : d.loai === "del" ? "text-[#c0392b]" : "text-[#333]"}
                ${d.text.startsWith("Mục ") ? "font-semibold" : ""}`}>
                {d.text || " "}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#e0e0e0] px-4 py-3 flex items-center gap-3.5 text-[11px] text-[#666] flex-shrink-0">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#e8f7ee] border border-[#a9debb] inline-block" /> {them} dòng thêm
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#fdeaea] border border-[#f5b7b7] inline-block" /> {xoa} dòng xoá
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
  const xong = ["DaKy", "DaBanHanh"].includes(vb.trangThai);
  const buoc = [
    { nhan: "Tạo", xong: true, hienTai: false },
    ...vb.luongKy.map((b, i) => ({
      nhan: b.vaiTro === "ky" ? "Ký số" : (b.chucVu.includes("Trưởng") ? "TP duyệt" : "PCVP duyệt"),
      xong: b.ketQua === "da_duyet" || b.ketQua === "da_ky",
      hienTai: !voHieu && !xong && vb.buocHienTai === i && vb.trangThai !== "Nhap",
    })),
  ];

  return (
    <div className="mb-1">
      <div className="flex items-start bg-[#fafafa] border border-[#f0f0f0] rounded-[4px] py-3 px-1">
        {buoc.map((b, i) => (
          <div key={i} className="flex-1 text-center relative text-[11px]"
            style={{ color: voHieu ? "#999" : b.xong || b.hienTai ? "#333" : "#666" }}>
            {i > 0 && <div className="absolute top-[5px] left-[-50%] w-full h-px bg-[#e0e0e0]" />}
            <div className="relative z-[1] mx-auto mb-1.5 rounded-full"
              style={{
                width: b.hienTai ? 12 : 10, height: b.hienTai ? 12 : 10,
                background: voHieu ? "#999" : b.hienTai ? "#fff" : b.xong ? "#27ae60" : "#ccc",
                border: b.hienTai ? "2px solid #e67e22" : "none",
              }} />
            {b.nhan}
          </div>
        ))}
      </div>
      <div className="text-[11px] text-[#888] text-right px-2 pt-1">
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
                  ${voHieu ? "bg-[#fafafa] text-[#999] font-medium" : "bg-[#f5f5f5] text-[#333] font-semibold"}`}>
                <span className="flex items-center gap-1.5">
                  {mo ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  Vòng {vong}
                  {voHieu ? <span className="font-normal"> · đã vô hiệu</span>
                          : <span className="font-normal text-[#666]"> (hiện tại)</span>}
                  {!mo && <span className="font-normal text-[11px] ml-1">— {mocs.length} mốc, bấm để mở</span>}
                </span>
                {laVongCuoi
                  ? <Pill tt={vb.trangThai} nhan={vb.trangThai === "ChoDuyet"
                      ? `Chờ duyệt · bước ${vb.buocHienTai + 1}/${vb.luongKy.length}` : undefined} />
                  : coTraLai ? <Pill tt="BiTraLai" /> : null}
              </div>

              {mo && (
                <div className="mt-2.5 ml-1.5 border-l border-[#e0e0e0] pl-4">
                  {mocs.map((m, i) => (
                    <div key={i} className="relative pb-4 last:pb-0.5">
                      <span className="absolute left-[-21px] top-1 w-2 h-2 rounded-full border-2 border-white"
                        style={{ background: voHieu ? "#999" : m.hanhDong === "TraLai" ? "#c0392b" : "#27ae60" }} />
                      <div className="text-[11px] text-[#888]">
                        {m.thoiGian}
                        <b className={`ml-1.5 text-[12px] font-medium ${voHieu ? "text-[#999]" : "text-[#333]"}`}>{m.nguoi}</b>
                        <span className="text-[#888]"> · {m.chucVu}</span>
                      </div>
                      <div className={`text-[12px] mt-0.5 flex items-center gap-2 ${voHieu ? "text-[#999]" : "text-[#333]"}`}>
                        {m.hanhDong === "TraLai" && <span>⛔</span>}
                        {m.hanhDong === "SuaVaDuyet" && <span>✏️</span>}
                        {HANH_DONG_NHAN[m.hanhDong]}
                        {m.hanhDong === "LaySoTam" && vb.soVanBan && (
                          <span className="font-mono">{vb.soVanBan.split("/")[0]}</span>)}
                        {m.phienBanSau !== undefined && (
                          <span className="text-[10px] text-[#888] border border-[#e0e0e0] rounded-[2px] px-1 font-mono">
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
      <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-center justify-between">
        <div className="text-[15px] font-bold">{tieuDe}</div>
        <button onClick={onClose} className="text-white/70 hover:text-white"><X size={16} /></button>
      </div>
      <div className="p-4">{children}</div>
      <div className="border-t border-[#e0e0e0] px-4 py-3 flex justify-end gap-2">{chan}</div>
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
        <span className="text-[#666]">{vb.trichYeu}</span>
      </div>
      <label className="block text-[11px] font-medium mb-1.5">Ý kiến trả lại <span className="text-[#8b1a1a]">*</span></label>
      <textarea value={yKien} onChange={e => setYKien(e.target.value)} rows={4} autoFocus
        placeholder="Nhập ý kiến trả lại…"
        aria-describedby="loi-y-kien"
        className={`w-full border rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none
          ${hopLe ? "border-[#ccc] focus:border-[#1a73e8]" : "border-[#8b1a1a]"}`} />
      <div id="loi-y-kien" className={`text-[11px] mt-1 ${hopLe ? "text-[#888]" : "text-[#8b1a1a]"}`}>
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
      <span className="text-[#666]">{vb.trichYeu}</span>
    </div>
    <div className="bg-[#e8f4ff] border border-[#a9c9f4] text-[#1a73e8] rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2">
      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
      <div>
        {vb.soVanBan
          ? <>Số <b className="font-mono">{vb.soVanBan}</b> sẽ chuyển từ <b>tạm</b> sang <b>chính thức</b>.</>
          : <>Hệ thống sẽ tự cấp số chính thức <b className="font-mono">{soSeCap}</b>.</>}
        {" "}Nội dung khoá vĩnh viễn sau bước này.
      </div>
    </div>
    <div className="mt-3.5">
      <label className="block text-[11px] font-medium mb-1.5">Chứng thư số</label>
      <select className="w-full h-[32px] border border-[#ccc] rounded-[3px] px-2 text-[12px] bg-white">
        <option>USB Token – Đỗ Thu Trang</option>
      </select>
    </div>
  </KhungHopThoai>
);

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
      <div className="bg-[#e8f4ff] border border-[#a9c9f4] text-[#1a73e8] rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2 mb-3.5">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>Sẽ lưu thành phiên bản <b>v{vMoi}</b> và duyệt bước {vb.buocHienTai + 1}.
          <b> {vb.nguoiTao}</b> sẽ thấy được thay đổi này qua nút “Xem thay đổi”.</div>
      </div>
      <label className="block text-[11px] font-medium mb-1.5">Ý kiến <span className="text-[#888] font-normal">(tuỳ chọn)</span></label>
      <textarea value={yKien} onChange={e => setYKien(e.target.value)} rows={3}
        placeholder="Nêu lý do chỉnh sửa…"
        className="w-full border border-[#ccc] rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-none focus:outline-none focus:border-[#1a73e8]" />
    </KhungHopThoai>
  );
};

// ─── Panel chi tiết — dùng chung cho cả 3 màn ────────────────────────────────
const PanelChiTiet = ({ vb, nguoiDung, chucVu, danhSach, onCapNhat, onClose }: {
  vb: VanBanTrinh; nguoiDung: string; chucVu: string;
  danhSach: VanBanTrinh[];
  onCapNhat: (vbMoi: VanBanTrinh) => void;
  onClose: () => void;
}) => {
  const [tab, setTab] = useState<"noidung" | "dinhkem" | "lichsu" | "banin">(
    vb.trangThai === "BiTraLai" ? "lichsu" : "noidung");
  const [mocDiff, setMocDiff] = useState<MocLichSu | null>(null);
  const [hopThoai, setHopThoai] = useState<"tralai" | "kyso" | "suaduyet" | null>(null);

  const pbHienTai = vb.phienBan.find(p => p.so === vb.phienBanHienTai) ?? vb.phienBan[vb.phienBan.length - 1];
  const [noiDung, setNoiDung] = useState(pbHienTai.noiDung);
  useEffect(() => { setNoiDung(pbHienTai.noiDung); }, [vb.id, vb.phienBanHienTai]);

  const giu = nguoiDangGiu(vb);
  const laNguoiGiu = !!giu && giu.nguoi === nguoiDung;
  const daKhoa = ["DaKy", "DaBanHanh", "DaHuy"].includes(vb.trangThai);
  const suaDuoc = laNguoiGiu && !daKhoa;
  const coSuaDoi = vb.lichSu.some(m => m.phienBanTruoc !== undefined);

  const xong = (vbMoi: VanBanTrinh) => { onCapNhat(vbMoi); setHopThoai(null); onClose(); };

  const hanhDong = () => {
    if (daKhoa) return (
      <>
        <BtnNeutral onClick={onClose}><Download size={13} /> Kết xuất</BtnNeutral>
        {vb.trangThai === "DaKy" && (
          <BtnOutline onClick={() => xong(apBanHanh(vb, nguoiDung, chucVu))}><Send size={13} /> Phát hành</BtnOutline>
        )}
        <BtnPrimary onClick={onClose}><Printer size={13} /> In</BtnPrimary>
      </>
    );
    if (!laNguoiGiu) return (
      <>
        <BtnNeutral onClick={onClose}><Printer size={13} /> Xem bản in</BtnNeutral>
        <BtnNeutral onClick={onClose}>Đóng</BtnNeutral>
      </>
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
        <>
          <BtnNeutral onClick={onClose}><Printer size={13} /> Xem bản in</BtnNeutral>
          <BtnPrimary onClick={() => xong(apSuaVaTrinhLai(vb, nguoiDung, chucVu, noiDung))}>
            <Pencil size={13} /> Sửa &amp; trình lại
          </BtnPrimary>
        </>
      );
      case "ChoDuyet": return (
        <>
          <BtnOutline onClick={() => setHopThoai("tralai")}><Ban size={13} /> Trả lại</BtnOutline>
          <BtnOutline onClick={() => setHopThoai("suaduyet")}><Pencil size={13} /> Sửa &amp; duyệt</BtnOutline>
          <BtnPrimary onClick={() => xong(apDuyet(vb, nguoiDung, chucVu))}><Check size={13} /> Duyệt</BtnPrimary>
        </>
      );
      case "ChoKy": return (
        <>
          <BtnOutline onClick={() => setHopThoai("tralai")}><Ban size={13} /> Trả lại</BtnOutline>
          <BtnPrimary onClick={() => setHopThoai("kyso")}><PenLine size={13} /> Ký số</BtnPrimary>
        </>
      );
      default: return <BtnNeutral onClick={onClose}>Đóng</BtnNeutral>;
    }
  };

  const TabBtn = ({ id, nhan, cham }: { id: any; nhan: string; cham?: boolean }) => (
    <div onClick={() => setTab(id)}
      className={`py-[9px] cursor-pointer text-[12px] border-b-2 flex items-center gap-1.5 transition-colors
        ${tab === id ? "border-[#8b1a1a] text-[#8b1a1a] font-semibold" : "border-transparent text-[#666] font-medium hover:text-[#333]"}`}>
      {cham && <span className="w-1.5 h-1.5 rounded-full bg-[#8b1a1a] inline-block" />}
      {nhan}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/50 flex justify-end" onClick={onClose}>
        <div className="w-[720px] bg-white h-full flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>

          <div className="bg-[#1d2e4f] text-white px-4 py-2.5 flex items-start justify-between flex-shrink-0">
            <div className="min-w-0">
              <div className="text-[15px] font-bold leading-tight truncate">{vb.trichYeu}</div>
              <div className="text-[11px] opacity-70 mt-0.5 flex items-center gap-1.5">
                <span className="font-mono">{vb.soVanBan ?? "— chưa số —"}</span>
                {vb.soVanBan && (
                  <span className={`px-[5px] py-[1px] rounded-[2px] text-[10px] font-medium border
                    ${vb.trangThaiSo === "tam"
                      ? "bg-[#fef3e2] text-[#b45309] border-[#fcd48a]"
                      : "bg-[#e8f7ee] text-[#1a7a45] border-[#a9debb]"}`}>
                    {vb.trangThaiSo === "tam" ? "tạm" : "chính thức"}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white flex-shrink-0 ml-3"><X size={16} /></button>
          </div>

          <div className="flex gap-[18px] px-4 border-b border-[#e0e0e0] bg-white flex-shrink-0">
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
              <div className="mb-3.5 rounded-[4px] px-3 py-2 text-[12px] leading-relaxed flex gap-2 bg-[#e8f4ff] text-[#1a73e8] border border-[#a9c9f4]">
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
                    <label className="block text-[11px] font-medium text-[#666] mb-1">Loại văn bản</label>
                    <div className="border border-[#f0f0f0] rounded-[3px] px-2.5 py-[7px] text-[12px]">{vb.loaiVanBan}</div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#666] mb-1">Trích yếu</label>
                    <div className="border border-[#f0f0f0] rounded-[3px] px-2.5 py-[7px] text-[12px] leading-relaxed">{vb.trichYeu}</div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#666] mb-1">
                      Nội dung <span className="text-[#888]">(v{pbHienTai.so} · {pbHienTai.nguoiSua} · {pbHienTai.thoiGian})</span>
                    </label>
                    {suaDuoc ? (
                      <textarea value={noiDung} onChange={e => setNoiDung(e.target.value)} rows={9}
                        className="w-full border border-[#ccc] rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed resize-y focus:outline-none focus:border-[#1a73e8] font-[inherit]" />
                    ) : (
                      <div className="border border-[#f0f0f0] rounded-[3px] px-2.5 py-2 text-[12px] leading-relaxed whitespace-pre-wrap min-h-[150px] bg-white">
                        {pbHienTai.noiDung}
                      </div>
                    )}
                    <div className="text-[11px] text-[#888] italic mt-1.5">
                      {daKhoa ? "Chỉ đọc — chữ vẫn chọn và sao chép được."
                        : suaDuoc ? "Bạn đang giữ văn bản này — được phép sửa."
                        : "Chỉ đọc — bạn không phải người đang giữ văn bản."}
                    </div>
                  </div>
                  {vb.luongKy.length > 0 && (
                    <div>
                      <label className="block text-[11px] font-medium text-[#666] mb-1">Luồng ký</label>
                      <div className="border border-[#f0f0f0] rounded-[3px] divide-y divide-[#f0f0f0]">
                        {vb.luongKy.map((b, i) => (
                          <div key={i} className={`px-2.5 py-[7px] text-[12px] flex items-center gap-2
                            ${!daKhoa && vb.buocHienTai === i && vb.trangThai !== "Nhap" && vb.trangThai !== "BiTraLai" ? "bg-[#fff8e1]" : ""}`}>
                            <span className="text-[#888] text-[11px] w-[46px]">bước {b.thuTu}</span>
                            <span className="font-medium">{b.nguoi}</span>
                            <span className="text-[#888] text-[11px]">· {b.chucVu}</span>
                            <span className="text-[#888] text-[11px]">· {b.vaiTro === "ky" ? "ký" : "duyệt"}</span>
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
                ? <div className="py-14 text-center text-[12px] text-[#888] italic">Không có đơn đính kèm.</div>
                : (
                  <div className="border border-[#e0e0e0] rounded-[4px] overflow-hidden">
                    <table className="w-full text-[12px] text-left">
                      <thead className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                        <tr>
                          <th className="px-3 py-2 font-medium w-[90px]">Mã đơn</th>
                          <th className="px-3 py-2 font-medium">Người gửi</th>
                          <th className="px-3 py-2 font-medium w-[150px]">Số BA/QĐ</th>
                          <th className="px-3 py-2 font-medium w-[170px]">Hình thức</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vb.donDinhKem.map((d, i) => (
                          <tr key={i} className="border-b border-[#f0f0f0] last:border-0">
                            <td className="px-3 py-2 font-medium">{d.ma}</td>
                            <td className="px-3 py-2 text-[#1a5a96]">{d.nguoiGui}</td>
                            <td className="px-3 py-2">{d.soBA}</td>
                            <td className="px-3 py-2 text-[#666]">{d.hinhThuc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
            )}

            {tab === "banin" && (
              <div className="border border-[#e0e0e0] rounded-[4px] bg-[#fafafa] p-8">
                <div className="bg-white border border-[#e0e0e0] mx-auto p-8 text-[12px] leading-[1.9]" style={{ maxWidth: 560 }}>
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

          <div className="border-t border-[#e0e0e0] px-4 py-3 flex items-center justify-end gap-2 flex-shrink-0 bg-white">
            {vb.trangThai === "BiTraLai" && (
              <div className="mr-auto text-[11px] text-[#888] italic">
                Vòng {vb.vongTrinh} vẫn giữ trong hồ sơ — không xoá, không gạch ngang.
              </div>
            )}
            {hanhDong()}
          </div>
        </div>
      </div>

      {mocDiff && <SoSanhPhienBan vb={vb} moc={mocDiff} onClose={() => setMocDiff(null)} />}

      {hopThoai === "tralai" && (
        <HopThoaiTraLai vb={vb} onClose={() => setHopThoai(null)}
          onXacNhan={yk => xong(apTraLai(vb, nguoiDung, chucVu, yk))} />
      )}
      {hopThoai === "kyso" && (
        <HopThoaiKySo vb={vb} soSeCap={soKeTiep(danhSach, vb.loaiVanBan)} onClose={() => setHopThoai(null)}
          onXacNhan={() => xong(apKySo(vb, nguoiDung, chucVu, danhSach))} />
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
  const suaDuoc = !!giu && giu.nguoi === nguoiDung && !["DaKy", "DaBanHanh", "DaHuy"].includes(vb.trangThai);
  return (
    <td className="px-3 py-2 align-top text-center whitespace-nowrap text-[#1a73e8]" onClick={e => e.stopPropagation()}>
      <button onClick={onMo} title={suaDuoc ? "Sửa" : "Xem chi tiết"} className="hover:text-[#1152a3] px-1">
        {suaDuoc ? <Pencil size={14} /> : <Eye size={15} />}
      </button>
      <button onClick={onMo} title="Lịch sử" className="hover:text-[#1152a3] px-1"><History size={14} /></button>
    </td>
  );
};

// ─── Màn "Danh sách văn bản" ──────────────────────────────────────────
type TabDS = "all" | "Nhap" | "ChoDuyet" | "ChoKy" | "BiTraLai" | "DaKy" | "DaBanHanh";

export const VanBanTrinhKyCuaToi = ({ danhSach, setDanhSach, currentRole, highlightId, openId, onDaMo }: {
  danhSach: VanBanTrinh[];
  setDanhSach: React.Dispatch<React.SetStateAction<VanBanTrinh[]>>;
  currentRole: string;
  highlightId?: string | null;
  /** Mở thẳng panel chi tiết của văn bản này khi vào màn — dùng khi người dùng
   *  bấm link "Đã có trong 545/…" từ màn Danh sách đơn. */
  openId?: string | null;
  onDaMo?: () => void;
}) => {
  const [tab, setTab] = useState<TabDS>("all");
  const [tim, setTim] = useState("");
  const [chonId, setChonId] = useState<string | null>(null);
  const { nguoi: nguoiDung, chucVu } = nguoiTheoVaiTro(currentRole);

  // "Của tôi" giờ là BỘ LỌC mặc định, không còn là tên màn — người dùng thấy
  // được và bỏ được, thay vì bị lọc ngầm mà không biết.
  const [fNguoiTao, setFNguoiTao] = useState<string>(nguoiDung);
  const [fMaDon, setFMaDon] = useState<string>("");
  useEffect(() => { setFNguoiTao(nguoiDung); }, [nguoiDung]);

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
  const coLocThem = !!fMaDon || fNguoiTao !== nguoiDung;

  const chon = danhSach.find(v => v.id === chonId) ?? null;
  const capNhat = (vbMoi: VanBanTrinh) =>
    setDanhSach(ds => ds.map(v => v.id === vbMoi.id ? vbMoi : v));

  const TABS: { id: TabDS; nhan: string }[] = [
    { id: "all", nhan: "Tất cả" }, { id: "Nhap", nhan: "Nháp" },
    { id: "ChoDuyet", nhan: "Chờ duyệt" }, { id: "ChoKy", nhan: "Chờ ký" },
    { id: "BiTraLai", nhan: "Bị trả lại" }, { id: "DaKy", nhan: "Đã ký" },
    { id: "DaBanHanh", nhan: "Đã ban hành" },
  ];

  const rong = () => {
    if (tim.trim() || coLocThem) return { m: "Không có kết quả khớp bộ lọc.", nut: true };
    switch (tab) {
      case "Nhap": return { m: "Không có bản nháp nào." };
      case "ChoDuyet": return { m: "Không có văn bản nào đang chờ duyệt." };
      case "ChoKy": return { m: "Không có văn bản nào đang chờ ký." };
      case "BiTraLai": return { m: "Chưa có văn bản nào bị trả lại." };
      case "DaKy": return { m: "Chưa có văn bản nào đã ký." };
      case "DaBanHanh": return { m: "Chưa có văn bản nào được ban hành." };
      default: return {
        m: `${fNguoiTao || "Chưa ai"} chưa khởi tạo văn bản nào.`,
        phu: chucVu !== "Cán bộ" ? "Văn bản chờ bạn xử lý nằm ở màn Phê duyệt đề xuất." : undefined,
      };
    }
  };

  const xoaBoLoc = () => { setTim(""); setFMaDon(""); setFNguoiTao(nguoiDung); };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="px-5 pt-4">
        <h1 className="text-[18px] font-bold text-[#1d2e4f] mb-3">Danh sách văn bản</h1>
      </div>

      <div className="flex items-center gap-5 border-b border-[#ddd] px-5">
        {TABS.map(t => {
          const n = dem(t.id);
          return (
            <div key={t.id} onClick={() => setTab(t.id)}
              className={`py-2 cursor-pointer font-medium text-[12px] border-b-2 flex items-center gap-1.5 transition-colors
                ${tab === t.id ? "border-[#8b1a1a] text-[#8b1a1a] font-semibold" : "border-transparent text-[#555] hover:text-[#333]"}`}>
              {t.nhan} ({n})
              {t.id === "BiTraLai" && n > 0 && (
                <span className="bg-[#8b1a1a] text-white rounded-full text-[10px] font-medium min-w-[16px] h-[16px] leading-[16px] text-center px-1">{n}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-5 py-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input value={tim} onChange={e => setTim(e.target.value)} placeholder="Tìm số / trích yếu…"
            className="h-[30px] w-[240px] border border-[#ccc] rounded-[3px] pl-7 pr-2 text-[12px] focus:outline-none focus:border-[#1a73e8]" />
        </div>
        {/* Hai bộ lọc thật, thay cho việc lọc ngầm theo người đăng nhập.
            "Của tôi" là giá trị mặc định của bộ lọc Người tạo — nhìn thấy và bỏ được. */}
        <select value={fNguoiTao} onChange={e => setFNguoiTao(e.target.value)}
          className={`h-[30px] border rounded-[3px] px-2 text-[12px] bg-white
            ${fNguoiTao !== nguoiDung ? "border-[#8b1a1a] text-[#8b1a1a] font-medium" : "border-[#ccc]"}`}>
          <option value="">Người tạo: tất cả</option>
          {dsNguoiTao.map(n => (
            <option key={n} value={n}>{n === nguoiDung ? `${n} (tôi)` : n}</option>
          ))}
        </select>
        <select value={fMaDon} onChange={e => setFMaDon(e.target.value)}
          className={`h-[30px] border rounded-[3px] px-2 text-[12px] bg-white
            ${fMaDon ? "border-[#8b1a1a] text-[#8b1a1a] font-medium" : "border-[#ccc]"}`}>
          <option value="">Mã đơn: tất cả</option>
          {dsMaDon.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        {(coLocThem || tim.trim()) && (
          <button onClick={xoaBoLoc}
            className="h-[30px] px-2.5 rounded-[3px] border border-[#ccc] text-[12px] text-[#666] hover:bg-[#f5f5f5]">
            Xoá bộ lọc
          </button>
        )}
        <div className="flex-1" />
        <span className="text-[11px] text-[#888] italic mr-1">Tạo văn bản mới từ màn Danh sách đơn</span>
        <BtnPrimary disabled><Plus size={13} /> Tạo văn bản</BtnPrimary>
      </div>

      <div className="flex-1 overflow-auto px-5 pb-5">
        <div className="border border-[#e0e0e0] rounded-[4px] overflow-hidden">
          <table className="w-full text-[12px] text-left">
            <thead className="bg-[#f5f5f5] text-[#333] border-b border-[#e0e0e0]">
              <tr>
                <th className="px-3 py-2 font-medium w-[44px]">STT</th>
                <th className="px-3 py-2 font-medium w-[175px]">Số / Ký hiệu</th>
                <th className="px-3 py-2 font-medium">Trích yếu</th>
                <th className="px-3 py-2 font-medium w-[155px]">Đang ở ai</th>
                <th className="px-3 py-2 font-medium w-[250px]">Trạng thái</th>
                <th className="px-3 py-2 font-medium w-[86px] text-center">Thao tác</th>
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
                    className={`border-b border-[#f0f0f0] last:border-0 cursor-pointer transition-colors
                      ${traLai ? "bg-[#fde8e8] hover:bg-[#fbdede]"
                        : moiTao ? "bg-[#fff8e1] hover:bg-[#fff3d0]" : "hover:bg-[#f9f9f9]"}`}
                    style={traLai ? { boxShadow: "inset 3px 0 0 #8b1a1a" }
                      : moiTao ? { boxShadow: "inset 3px 0 0 #e67e22" } : undefined}>
                    <td className="px-3 py-2 align-top text-[#666]">{i + 1}</td>
                    <td className="px-3 py-2 align-top"><ChipSo vb={v} /></td>
                    <td className="px-3 py-2 align-top">
                      <div className="leading-relaxed">{v.trichYeu}</div>
                      <div className="text-[11px] text-[#666] mt-[3px]">
                        {v.loaiVanBan}
                        {v.donDinhKem.length > 0 && ` · ${v.donDinhKem.length} đơn`}
                        {v.vongTrinh > 1 && ` · Vòng ${v.vongTrinh}`}
                        {moiTao && <span className="text-[#b45309] font-medium"> · vừa tạo</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      {giu ? (<>
                        <div className="font-medium">{giu.nguoi}</div>
                        <div className="text-[11px] text-[#666] mt-[3px]">{giu.chucVu}{laNguoiGiu && " — bạn"}</div>
                      </>) : <span className="text-[#888]">—</span>}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Pill tt={v.trangThai} />
                      <div className="text-[11px] text-[#666] mt-[3px]">
                        {(v.trangThai === "ChoDuyet" || v.trangThai === "ChoKy") && `bước ${v.buocHienTai + 1}/${v.luongKy.length}`}
                        {v.trangThai === "DaBanHanh" && v.ngayBanHanh}
                        {v.trangThai === "DaKy" && `Ký ${v.ngayBanHanh}`}
                        {v.trangThai === "Nhap" && `Sửa lần cuối ${v.phienBan[v.phienBan.length - 1].thoiGian}`}
                        {traLai && v.lichSu[v.lichSu.length - 1].thoiGian}
                      </div>
                      {traLai && yKienCuoi && (
                        <div className="text-[11px] text-[#8b1a1a] italic mt-1 leading-snug max-w-[230px]">
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
                  <FileText size={26} className="mx-auto mb-2.5 text-[#ccc]" />
                  <div className="text-[12px] text-[#666]">{rong().m}</div>
                  {(rong() as any).phu && <div className="text-[11px] text-[#888] mt-1.5">{(rong() as any).phu}</div>}
                  {(rong() as any).nut && (
                    <button onClick={xoaBoLoc}
                      className="mt-3 h-[28px] px-3 rounded-[3px] border border-[#ccc] text-[12px] font-medium hover:bg-[#f5f5f5]">
                      Xoá bộ lọc
                    </button>
                  )}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end pt-3 text-[11px] text-[#666]">
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

// ─── Màn "Phê duyệt đề xuất" — lăng kính của lãnh đạo trên CÙNG kho ──────────
type TabPD = "cho_toi" | "cho_ky" | "da_duyet" | "da_tra_lai" | "all";

export const PheDuyetDeXuat = ({ danhSach, setDanhSach, currentRole }: {
  danhSach: VanBanTrinh[];
  setDanhSach: React.Dispatch<React.SetStateAction<VanBanTrinh[]>>;
  currentRole: string;
}) => {
  const [tab, setTab] = useState<TabPD>("cho_toi");
  const [chonId, setChonId] = useState<string | null>(null);
  const { nguoi: nguoiDung, chucVu } = nguoiTheoVaiTro(currentRole);

  const dangGiu = (v: VanBanTrinh) => nguoiDangGiu(v)?.nguoi === nguoiDung;
  const nhom = {
    cho_toi: danhSach.filter(v => v.trangThai === "ChoDuyet" && dangGiu(v)),
    cho_ky: danhSach.filter(v => v.trangThai === "ChoKy" && dangGiu(v)),
    da_duyet: danhSach.filter(v => v.lichSu.some(m => m.nguoi === nguoiDung && ["Duyet", "SuaVaDuyet", "Ky"].includes(m.hanhDong))),
    da_tra_lai: danhSach.filter(v => v.lichSu.some(m => m.nguoi === nguoiDung && m.hanhDong === "TraLai")),
    all: danhSach.filter(v => v.trangThai !== "DaHuy"),
  };
  const loc = nhom[tab];

  const chon = danhSach.find(v => v.id === chonId) ?? null;
  const capNhat = (vbMoi: VanBanTrinh) => setDanhSach(ds => ds.map(v => v.id === vbMoi.id ? vbMoi : v));

  const TABS: { id: TabPD; nhan: string; alert?: boolean }[] = [
    { id: "cho_toi", nhan: "Chờ tôi duyệt", alert: true },
    { id: "cho_ky", nhan: "Chờ tôi ký", alert: true },
    { id: "da_duyet", nhan: "Tôi đã xử lý" },
    { id: "da_tra_lai", nhan: "Tôi đã trả lại" },
    { id: "all", nhan: "Tất cả" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="px-5 pt-4">
        <h1 className="text-[18px] font-bold text-[#1d2e4f] mb-1">Phê duyệt đề xuất</h1>
        <div className="text-[11px] text-[#888] mb-3">
          Đang xem với vai trò <b className="text-[#333]">{nguoiDung}</b> — {chucVu}
        </div>
      </div>

      <div className="flex items-center gap-5 border-b border-[#ddd] px-5">
        {TABS.map(t => {
          const n = nhom[t.id].length;
          return (
            <div key={t.id} onClick={() => setTab(t.id)}
              className={`py-2 cursor-pointer font-medium text-[12px] border-b-2 flex items-center gap-1.5 transition-colors
                ${tab === t.id ? "border-[#8b1a1a] text-[#8b1a1a] font-semibold" : "border-transparent text-[#555] hover:text-[#333]"}`}>
              {t.nhan} ({n})
              {t.alert && n > 0 && (
                <span className="bg-[#8b1a1a] text-white rounded-full text-[10px] font-medium min-w-[16px] h-[16px] leading-[16px] text-center px-1">{n}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-5 py-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input placeholder="Tìm số / trích yếu…"
            className="h-[30px] w-[240px] border border-[#ccc] rounded-[3px] pl-7 pr-2 text-[12px] focus:outline-none focus:border-[#1a73e8]" />
        </div>
        <div className="flex-1" />
        <span className="text-[11px] text-[#888] italic mr-1">Mở từng văn bản để duyệt, sửa &amp; duyệt hoặc trả lại</span>
        <BtnNeutral><Download size={13} /> Kết xuất</BtnNeutral>
      </div>

      <div className="flex-1 overflow-auto px-5 pb-5">
        <div className="border border-[#e0e0e0] rounded-[4px] overflow-hidden">
          <table className="w-full text-[12px] text-left">
            <thead className="bg-[#f5f5f5] text-[#333] border-b border-[#e0e0e0]">
              <tr>
                <th className="px-3 py-2 font-medium w-[44px]">STT</th>
                <th className="px-3 py-2 font-medium w-[175px]">Số / Ký hiệu</th>
                <th className="px-3 py-2 font-medium">Trích yếu</th>
                <th className="px-3 py-2 font-medium w-[125px]">Người đề xuất</th>
                <th className="px-3 py-2 font-medium w-[150px]">Đang ở ai</th>
                <th className="px-3 py-2 font-medium w-[175px]">Trạng thái</th>
                <th className="px-3 py-2 font-medium w-[86px] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loc.map((v, i) => {
                const giu = nguoiDangGiu(v);
                const cuaToi = giu?.nguoi === nguoiDung;
                return (
                  <tr key={v.id} onClick={() => setChonId(v.id)}
                    className={`border-b border-[#f0f0f0] last:border-0 cursor-pointer transition-colors
                      ${cuaToi && (v.trangThai === "ChoDuyet" || v.trangThai === "ChoKy")
                        ? "bg-[#fffdf5] hover:bg-[#fff8e1]" : "hover:bg-[#f9f9f9]"}`}>
                    <td className="px-3 py-2 align-top text-[#666]">{i + 1}</td>
                    <td className="px-3 py-2 align-top"><ChipSo vb={v} /></td>
                    <td className="px-3 py-2 align-top">
                      <div className="leading-relaxed">{v.trichYeu}</div>
                      <div className="text-[11px] text-[#666] mt-[3px]">
                        {v.loaiVanBan}{v.vongTrinh > 1 && ` · Vòng ${v.vongTrinh}`}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium">{v.nguoiTao}</div>
                      <div className="text-[11px] text-[#666] mt-[3px]">Cán bộ</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      {giu ? (<>
                        <div className="font-medium">{giu.nguoi}</div>
                        <div className="text-[11px] text-[#666] mt-[3px]">{giu.chucVu}{cuaToi && " — bạn"}</div>
                      </>) : <span className="text-[#888]">—</span>}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Pill tt={v.trangThai} />
                      <div className="text-[11px] text-[#666] mt-[3px]">
                        {(v.trangThai === "ChoDuyet" || v.trangThai === "ChoKy") && `bước ${v.buocHienTai + 1}/${v.luongKy.length}`}
                      </div>
                    </td>
                    <CotThaoTac vb={v} nguoiDung={nguoiDung} onMo={() => setChonId(v.id)} />
                  </tr>
                );
              })}
              {loc.length === 0 && (
                <tr><td colSpan={7} className="py-14 text-center">
                  <Check size={26} className="mx-auto mb-2.5 text-[#ccc]" />
                  <div className="text-[12px] text-[#666]">
                    {tab === "cho_toi" ? "Không có văn bản nào chờ bạn duyệt."
                      : tab === "cho_ky" ? "Không có văn bản nào chờ bạn ký."
                      : tab === "da_duyet" ? "Bạn chưa xử lý văn bản nào."
                      : tab === "da_tra_lai" ? "Bạn chưa trả lại văn bản nào."
                      : "Chưa có văn bản nào."}
                  </div>
                  {(tab === "cho_toi" || tab === "cho_ky") && (
                    <div className="text-[11px] text-[#888] mt-1.5">
                      Đổi vai trò ở góc phải màn hình để xem hàng đợi của người khác.
                    </div>
                  )}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {chon && (
        <PanelChiTiet vb={chon} nguoiDung={nguoiDung} chucVu={chucVu} danhSach={danhSach}
          onCapNhat={capNhat} onClose={() => setChonId(null)} />
      )}
    </div>
  );
};

// ─── Màn "Sổ văn bản đi" ─────────────────────────────────────────────────────
const NGUONG_QUA_HAN = 7; // ngày — tham số cấu hình, chưa được văn thư TANDTC xác nhận

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
        <h1 className="text-[18px] font-bold text-[#1d2e4f] mb-3">Sổ văn bản đi</h1>
        <div className="flex-1" />
        <div className="mb-3 flex items-center gap-2 text-[12px] text-[#666]">
          Kỳ:
          <select className="h-[30px] border border-[#ccc] rounded-[3px] px-2 text-[12px] bg-white">
            <option>Tháng 8/2026</option><option>Tháng 7/2026</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-5 border-b border-[#ddd] px-5">
        {TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id as any)}
            className={`py-2 cursor-pointer font-medium text-[12px] border-b-2 transition-colors
              ${tab === t.id ? "border-[#8b1a1a] text-[#8b1a1a] font-semibold" : "border-transparent text-[#555] hover:text-[#333]"}`}>
            {t.nhan}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-5 py-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input placeholder="Tìm số / trích yếu…"
            className="h-[30px] w-[240px] border border-[#ccc] rounded-[3px] pl-7 pr-2 text-[12px] focus:outline-none focus:border-[#1a73e8]" />
        </div>
        <div className="flex-1" />
        <BtnNeutral><Download size={13} /> Kết xuất Excel</BtnNeutral>
      </div>

      <div className="flex-1 overflow-auto px-5 pb-5">
        <div className="border border-[#e0e0e0] rounded-[4px] overflow-hidden">
          <table className="w-full text-[12px] text-left">
            <thead className="bg-[#f5f5f5] text-[#333] border-b border-[#e0e0e0]">
              <tr>
                <th className="px-3 py-2 font-medium w-[44px]">STT</th>
                <th className="px-3 py-2 font-medium w-[180px]">Số / Ký hiệu <span className="text-[#8b1a1a] text-[10px]">▲</span></th>
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
                    className={`border-b border-[#f0f0f0] last:border-0 ${qh ? "bg-[#fef6ea]" : "hover:bg-[#f9f9f9]"}
                      ${v.trangThai === "DaHuy" ? "text-[#999]" : ""}`}
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
                    <td className="px-3 py-2 align-top">{v.ngayBanHanh ?? <span className="text-[#888]">—</span>}</td>
                    <td className="px-3 py-2 align-top">
                      {qh
                        ? <span className="inline-block px-2 py-[2px] rounded-full text-[10px] font-medium border bg-[#fef3e2] text-[#b45309] border-[#fcd48a]">⚠️ Số tạm quá hạn</span>
                        : <Pill tt={v.trangThai} />}
                      <div className="text-[11px] text-[#666] mt-[3px]">
                        {qh && TRANG_THAI_META[v.trangThai].nhan}
                        {v.trangThai === "DaHuy" && "30/07/2026"}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-center text-[#1a73e8]"><Eye size={15} className="inline" /></td>
                  </tr>
                );
              })}
              {loc.length === 0 && (
                <tr><td colSpan={8} className="py-14 text-center text-[12px] text-[#666]">
                  {tab === "quahan" ? "Không có số tạm nào quá 7 ngày." : "Sổ chưa có số nào trong kỳ đã chọn."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-3 text-[11px] text-[#888] italic flex items-start gap-1.5">
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
