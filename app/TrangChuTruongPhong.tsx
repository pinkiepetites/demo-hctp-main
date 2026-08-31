import React, { useMemo } from "react";
import {
  FileCheck, PenLine, Users, MessageSquareWarning, AlertTriangle, RotateCcw,
  ArrowRight, CheckCircle2, Gauge,
} from "lucide-react";
import {
  nguoiDangGiu, nguoiTheoVaiTro, type VanBanTrinh, type LocVanBanTuTrangChu,
} from "./components/QuanLyVanBan";
import {
  laQuaHan, laSapDenHan, soNgayQuaHan, daGiaiQuyetXong, nguoiGiuViec,
  type DonChiSo, type BoLocTuTrangChu,
} from "./ChiSoTrangChu";

/** Trạng thái đơn "Chờ ý kiến Lãnh đạo" — lặp lại chuỗi thay vì import từ App.tsx
 *  để không tạo vòng import (App đã import file này qua Dashboard). */
const CHO_Y_KIEN_LD = "Chờ ý kiến Lãnh đạo";

/** Ngưỡng nhắc việc của Trưởng phòng: văn bản nằm chờ ở bàn mình quá số ngày này
 *  thì chuyển thành cảnh báo. Khác với hạn giải quyết đơn — đây là hạn nội bộ. */
export const HAN_DUYET_VAN_BAN_NGAY = 3;

type VaiTro = "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";

/** Bốn vai trò nằm trong luồng ký duyệt văn bản — cùng nhìn Trang chủ ở góc
 *  người quản lý (có Tầng 1 "Việc của tôi" và Tầng 3 "Tải việc của phòng"). */
const VAI_TRO_QUAN_LY: readonly VaiTro[] = ["truong-phong", "pho-vp", "lanh-dao", "chanh-an"];

/** Người mà Trang chủ lấy làm "tôi" khi đếm việc.
 *
 *  Bốn vai trò quản lý cố ý cùng quy về bàn Trưởng phòng, để Trang chủ của
 *  Trưởng phòng · Phó/Chánh Văn phòng · Lãnh đạo Tòa · Chánh án/Phó Chánh án
 *  hiện ra GIỐNG HỆT NHAU — cùng số văn bản chờ duyệt/chờ ký, cùng cảnh báo,
 *  cùng bảng tải việc. Dữ liệu mẫu chỉ dựng đủ việc cho bàn Trưởng phòng; nếu
 *  lọc theo đúng người đăng nhập thì ba vai còn lại sẽ thấy phần lớn ô về 0 và
 *  hai khối cảnh báo rỗng, không còn là bản mockup để trình bày.
 *
 *  Cán bộ vẫn lọc theo chính họ — đó là màn khác (không có Tầng 1/Tầng 3). */
export const nguoiXemTrangChu = (role: VaiTro | string): string =>
  nguoiTheoVaiTro(VAI_TRO_QUAN_LY.includes(role as VaiTro) ? "truong-phong" : role).nguoi;

// ─── Tiện ích ────────────────────────────────────────────────────────────────

const parseNgayGio = (s?: string): Date | null => {
  // Chấp nhận cả "21/07/2026" lẫn "21/07/2026 16:36:55"
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec((s ?? "").trim());
  return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
};

const soNgayTu = (s: string | undefined, homNay: Date): number | null => {
  const d = parseNgayGio(s);
  return d ? Math.floor((homNay.getTime() - d.getTime()) / 86_400_000) : null;
};

/** Mốc lịch sử gần nhất ứng với một hành động — dùng để biết văn bản bị trả lại
 *  từ bao giờ, hoặc nằm ở bàn người duyệt từ bao giờ. */
const mocGanNhat = (vb: VanBanTrinh, hanhDong: string) =>
  [...(vb.lichSu ?? [])].reverse().find(m => m.hanhDong === hanhDong);

const vietTatTAND = (s: string) => s.replace(/Tòa án nhân dân/gi, "TAND");

/** Nhãn số ngày quá hạn. Bình thường đơn quá hạn chỉ tính bằng ngày; nếu gặp đơn
 *  tồn quá một năm thì quy ra năm, vì in thẳng "Quá 2244 ngày" vừa khó đọc vừa
 *  trông như lỗi. */
const nhanQuaHan = (soNgay: number) =>
  soNgay >= 365
    ? `Quá ${(soNgay / 365).toFixed(1).replace(".", ",")} năm`
    : `Quá ${soNgay} ngày`;

// ─── Tiêu đề mục (cấp 1) ─────────────────────────────────────────────────────

/** Tiêu đề của một MỤC trên Trang chủ — cấp cao nhất, có gạch chân chạy hết bề
 *  ngang để thấy rõ "mọi thứ bên dưới thuộc về mục này". Các khối con bên trong
 *  mục dùng cỡ chữ nhỏ hơn, chữ hoa, màu xám (xem ChiSoTrangChu). Trước đây cả
 *  hai cấp cùng một kiểu 16px đậm + icon đỏ nên nhìn vào không biết cái nào chứa
 *  cái nào. */
export const TieuDeMuc = ({ icon, tieuDe, moTa, phu }: {
  icon: React.ReactNode; tieuDe: string; moTa?: React.ReactNode; phu?: React.ReactNode;
}) => (
  <div className="pt-1">
    <div className="flex items-baseline justify-between gap-3 flex-wrap pb-2.5 border-b-2 border-[#dde3ec]">
      <h2 className="text-[18px] font-bold text-[#0f172a] tracking-tight flex items-center gap-2">
        <span className="text-error flex items-center">{icon}</span>
        {tieuDe}
      </h2>
      {phu}
    </div>
    {moTa && <p className="text-[12px] text-[#8a94a6] mt-2.5">{moTa}</p>}
  </div>
);

/** Khối con của một mục — thụt vào kèm đường kẻ dọc, để quan hệ cha–con đọc được
 *  cả khi cuộn qua nhanh mà không đọc chữ. */
export const NhomCon = ({ children }: { children: React.ReactNode }) => (
  <div className="pl-4 border-l-2 border-[#e8edf4] space-y-5">{children}</div>
);

// ─── Tầng 1: Việc của tôi hôm nay ────────────────────────────────────────────

const TheViec = ({ nhan, giaTri, phuChu, canhBao, icon, mauIcon, nenIcon, onClick }: {
  nhan: string; giaTri: number; phuChu?: string; canhBao?: string;
  icon: React.ReactNode; mauIcon: string; nenIcon: string; onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group text-left bg-white rounded-[10px] border border-[#eef1f4] p-4 shadow-sm hover:shadow-md hover:border-[#cbd5e1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] transition-all duration-200 flex flex-col"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-[#8a94a6] font-normal mb-1.5 leading-snug">{nhan}</p>
        <span className="text-[28px] font-bold text-tertiary leading-none tracking-tight">{giaTri}</span>
      </div>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${nenIcon} ${mauIcon}`}>
        {icon}
      </div>
    </div>
    <div className="mt-2.5 min-h-[18px]">
      {canhBao
        ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-error bg-[#fef2f2] border border-[#fecaca] rounded-full px-2 py-0.5">
            <AlertTriangle size={10} className="flex-shrink-0" /> {canhBao}
          </span>
        : <span className="text-[11px] text-[#94a3b8]">{phuChu}</span>}
    </div>
    <span className="mt-auto pt-3 text-[11px] font-medium text-[#94a3b8] group-hover:text-[#3b82f6] flex items-center gap-1 transition-colors">
      Xử lý ngay <ArrowRight size={11} />
    </span>
  </button>
);

// ─── Tầng 2: Cảnh báo ────────────────────────────────────────────────────────

const KhungCanhBao = ({ tieuDe, icon, mauIcon, soLuong, trong, onXemTatCa, children }: {
  tieuDe: string; icon: React.ReactNode; mauIcon: string; soLuong: number;
  trong: string; onXemTatCa?: () => void; children: React.ReactNode;
}) => (
  <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
    <div className="px-5 py-4 border-b border-surface-container-high flex items-center justify-between gap-2">
      <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
        <span className={mauIcon}>{icon}</span>
        {tieuDe}
      </h3>
      {soLuong > 0 && (
        <span className="bg-[#fee2e2] text-error text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
          {soLuong}
        </span>
      )}
    </div>
    <div className="flex-1 p-3 space-y-2 min-h-[132px]">
      {soLuong === 0
        ? <div className="h-full min-h-[108px] flex flex-col items-center justify-center text-center gap-1.5">
            <CheckCircle2 size={20} className="text-[#27ae60]" />
            <span className="text-[12px] text-[#64748b]">{trong}</span>
          </div>
        : children}
    </div>
    {soLuong > 0 && (
      <div className="p-3 border-t border-surface-container-high bg-[#f8fafc] rounded-b-[8px] text-center">
        <button type="button" onClick={onXemTatCa}
          className="text-[12px] font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">
          Xem tất cả {soLuong} mục
        </button>
      </div>
    )}
  </div>
);

const DongCanhBao = ({ tieuDe, moTa, nhanPhai, mauNhan, onClick }: {
  tieuDe: string; moTa: string; nhanPhai: string; mauNhan: string; onClick?: () => void;
}) => (
  <button type="button" onClick={onClick}
    className="w-full text-left p-3 border border-surface-container-high rounded-[6px] hover:border-error/30 hover:bg-[#fef2f2]/50 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]">
    <div className="flex items-start justify-between gap-2 mb-1.5">
      <span className="text-[13px] font-bold text-[#1e293b] group-hover:text-error transition-colors truncate">{tieuDe}</span>
      <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] flex-shrink-0 ${mauNhan}`}>{nhanPhai}</span>
    </div>
    <div className="flex items-center justify-between gap-2">
      <p className="text-[12px] text-[#64748b] line-clamp-1">{moTa}</p>
      <ArrowRight size={14} className="text-[#cbd5e1] group-hover:text-error transition-colors flex-shrink-0" />
    </div>
  </button>
);

// ─── Tầng 3: Tải việc của phòng ──────────────────────────────────────────────

export type TaiViecCanBo = {
  name: string;
  role: string;
  /** Tổng đơn quy cho người này — gồm cả đã xong lẫn đang giữ. */
  tong: number;
  /** Đơn đã giải quyết xong. */
  daXong: number;
  /** Đơn còn đang giữ = tong − daXong. */
  dangXuLy: number;
  /** Trong số đang giữ, bao nhiêu đơn đã quá hạn. */
  quaHan?: number;
  /** Số văn bản của người này đang nằm chờ Trưởng phòng duyệt. */
  choToiDuyet?: number;
};

/** Hai màu của thanh xếp chồng. Xanh lá lấy đúng mã đã dùng ở màn Tiếp nhận đơn.
 *  Cặp này qua được kiểm tra phân biệt dưới mắt mù màu (ΔE 20,8 — ngưỡng an toàn
 *  là 8); cặp #27ae60 + vàng của bản mẫu chỉ đạt 6,8, người mù màu đỏ-lục nhìn
 *  hai đoạn gần như một. */
const MAU_DA_XONG = "#1a7a45";
const MAU_DANG_XU_LY = "#e6a700";

/** Chữ trên nền trắng phải đủ tương phản: bản thân #1a7a45 đạt, nhưng màu vàng
 *  của thanh thì không, nên số "đang xử lý" dùng mực nâu đậm thay vì màu thanh. */
const CHU_DA_XONG = "#1a7a45";
const CHU_DANG_XU_LY = "#8a6d00";

const BangTaiViec = ({ canBo, onXemChiTiet }: {
  canBo: TaiViecCanBo[]; onXemChiTiet?: () => void;
}) => {
  const tongTai = canBo.reduce((s, c) => s + c.dangXuLy, 0);
  const trungBinh = canBo.length ? tongTai / canBo.length : 0;

  return (
    <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <div className="px-5 py-4 border-b border-surface-container-high flex items-center justify-between gap-2">
        {/* Tên khối phải chứa chữ "hiệu suất": đó là từ người dùng đi tìm, và
            màn mở ra từ đây tên là "Hiệu suất cán bộ kỳ này". Trước đây khối tên
            "Tải việc của phòng" còn màn chi tiết tên "Hiệu suất" — một luồng hai
            tên, tìm mãi không ra. */}
        <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
          <Gauge size={18} className="text-error" />
          Tải việc &amp; hiệu suất của phòng
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#94a3b8]">
            Trung bình <span className="font-semibold text-[#475569]">{trungBinh.toFixed(1).replace(".", ",")}</span> đơn/người
          </span>
          <button type="button" onClick={onXemChiTiet}
            className="text-[#3b82f6] text-[12px] font-medium hover:underline flex items-center gap-1">
            Xem hiệu suất chi tiết <ArrowRight size={11} />
          </button>
        </div>
      </div>

      <div className="py-1">
        {canBo.map((c, i) => {
          const tyLeXong = c.tong ? (c.daXong / c.tong) * 100 : 0;
          const quaTai = trungBinh ? ((c.dangXuLy - trungBinh) / trungBinh) * 100 >= 30 : false;
          const chuCai = c.name.trim().split(" ").pop()?.[0] ?? "?";
          return (
            <div key={c.name}
              className={`flex items-center gap-3.5 px-5 py-3 ${i % 2 === 1 ? "bg-[#f8fafc]" : ""}`}>
              {/* Chữ cái đầu của TÊN (không phải họ) — người Việt gọi nhau bằng tên */}
              <div className="w-[38px] h-[38px] rounded-full bg-tertiary text-white flex items-center justify-center text-[15px] font-semibold flex-shrink-0">
                {chuCai}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[13px] font-bold text-[#1e293b] truncate">{c.name}</span>
                  <span className="text-[11px] font-semibold text-[#475569] bg-surface-container-high border border-[#e2e8f0] rounded-[4px] px-2 py-0.5 flex-shrink-0 tabular-nums">
                    Tổng: {c.tong}
                  </span>
                  {quaTai && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-error bg-[#fdeaea] border border-[#f5c6c6] rounded-full px-2 py-0.5 flex-shrink-0">
                      <AlertTriangle size={9} /> Tải cao
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#94a3b8] mt-0.5 truncate">{c.role}</div>

                {/* Thanh xếp chồng — khe 2px màu nền ngăn hai đoạn, không dùng viền:
                    viền là mực thừa không mang dữ liệu. */}
                <div className="flex h-[9px] rounded-full overflow-hidden bg-[#eef1f5] mt-2">
                  <div className="h-full transition-all duration-700"
                    style={{ width: `${tyLeXong}%`, background: MAU_DA_XONG }} />
                  {c.daXong > 0 && c.dangXuLy > 0 && (
                    <div className="h-full w-[2px] bg-white flex-shrink-0" />
                  )}
                  <div className="h-full transition-all duration-700"
                    style={{ width: `${100 - tyLeXong}%`, background: MAU_DANG_XU_LY }} />
                </div>
              </div>

              <div className="w-[132px] flex-shrink-0 text-right">
                <div className="text-[12px] font-bold tabular-nums" style={{ color: CHU_DA_XONG }}>
                  {tyLeXong.toFixed(0)}% hoàn thành
                </div>
                <div className="text-[11px] font-medium mt-1 tabular-nums" style={{ color: CHU_DANG_XU_LY }}>
                  {c.dangXuLy} đang xử lý
                </div>
                {/* Quá hạn là tín hiệu rủi ro, giữ lại dù bản mẫu không có: đây là
                    thứ Trưởng phòng cần thấy nhất khi nhìn vào một cán bộ. */}
                {!!c.quaHan && c.quaHan > 0 && (
                  <div className="text-[11px] font-semibold text-error mt-1 tabular-nums">
                    {c.quaHan} quá hạn
                  </div>
                )}
                {!!c.choToiDuyet && c.choToiDuyet > 0 && (
                  <div className="text-[11px] font-medium text-[#b45309] mt-1 tabular-nums">
                    {c.choToiDuyet} chờ tôi duyệt
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hai đoạn màu → bắt buộc có chú giải, không để người đọc tự đoán */}
      <div className="px-5 py-3 border-t border-surface-container-high bg-white rounded-b-[8px] flex items-center justify-center gap-6 flex-wrap">
        <span className="flex items-center gap-1.5 text-[12px] text-[#475569]">
          <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: MAU_DA_XONG }} /> Đã giải quyết xong
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-[#475569]">
          <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: MAU_DANG_XU_LY }} /> Đang xử lý
        </span>
      </div>
    </div>
  );
};

// ─── Màn hình ────────────────────────────────────────────────────────────────

export default function TrangChuTruongPhong({
  donList = [], vanBanList = [], canBoList = [], currentRole = "truong-phong",
  laVaiTroQuanLy = true,
  onMoDanhSachDon, onMoPheDuyet, onMoDanhSachVanBan, onXemHieuSuat,
}: {
  donList?: DonChiSo[];
  vanBanList?: VanBanTrinh[];
  /** Chỉ dùng để tra chức vụ theo tên — số đơn luôn đếm từ `donList`, không lấy
   *  từ đây, để không ghép hai tập dữ liệu rời nhau. */
  canBoList?: { name: string; role: string }[];
  currentRole?: VaiTro;
  /** Tầng "Việc của tôi" (duyệt/ký) chỉ có nghĩa với vai nằm trong luồng ký.
   *  Cán bộ vẫn thấy tầng Cảnh báo vì đơn quá hạn là việc của họ, và thấy bản
   *  rút gọn của tầng Tải việc — phần số liệu của chính họ. */
  laVaiTroQuanLy?: boolean;
  onMoDanhSachDon?: (loc: BoLocTuTrangChu) => void;
  onMoPheDuyet?: () => void;
  onMoDanhSachVanBan?: (loc?: LocVanBanTuTrangChu) => void;
  onXemHieuSuat?: () => void;
}) {
  const homNay = useMemo(() => new Date(), []);
  // Bốn vai trò quản lý cùng nhìn một màn hình — xem chú thích nguoiXemTrangChu.
  const toiLaAi = nguoiXemTrangChu(currentRole);

  // ── Tầng 1 — việc đang đứng chờ chính tôi ──────────────────────────────────
  const viec = useMemo(() => {
    const dangOBanToi = vanBanList.filter(v => nguoiDangGiu(v)?.nguoi === toiLaAi);
    const choDuyet = dangOBanToi.filter(v => v.trangThai === "ChoDuyet");
    const choKy = dangOBanToi.filter(v => v.trangThai === "ChoKy" || v.trangThai === "ChoButPhe");

    // Văn bản đã nằm ở bàn mình quá ngưỡng — tính từ lần trình gần nhất.
    const treHan = dangOBanToi.filter(v => {
      const moc = mocGanNhat(v, "Trinh") ?? mocGanNhat(v, "Tao");
      const ngay = soNgayTu(moc?.thoiGian, homNay);
      return ngay !== null && ngay > HAN_DUYET_VAN_BAN_NGAY;
    }).length;

    const choPhanCong = donList.filter(
      d => d.giaiQuyet?.nhan === "Thụ lý mới" && !d.isPhanCong).length;
    const choYKienLD = donList.filter(d => d.giaiQuyet?.nhan === CHO_Y_KIEN_LD).length;

    return { choDuyet: choDuyet.length, choKy: choKy.length, treHan, choPhanCong, choYKienLD };
  }, [vanBanList, donList, toiLaAi, homNay]);

  // ── Tầng 2 — hai loại cảnh báo, cố ý tách riêng vì đòi hai hành động khác nhau ──
  const donQuaHan = useMemo(
    () => donList
      .filter(d => laQuaHan(d, homNay))
      .sort((a, b) => soNgayQuaHan(b, homNay) - soNgayQuaHan(a, homNay)),
    [donList, homNay]);

  const donSapDenHan = useMemo(
    () => donList.filter(d => laSapDenHan(d, homNay)).length,
    [donList, homNay]);

  // Văn bản bị trả lại — LỌC THEO VAI, vì hai vai đứng ở hai đầu của cùng một
  // sự việc: cán bộ là người phải sửa, người duyệt là người đã trả lại. Trước đây
  // khối này đổ toàn bộ văn bản bị trả lại của mọi người mà tiêu đề vẫn ghi
  // "tôi đã trả lại" — cán bộ nhìn vào thấy mình bị nói là người trả lại.
  const vanBanBiTraLai = useMemo(
    () => vanBanList
      .filter(v => v.trangThai === "BiTraLai")
      .map(v => {
        const moc = mocGanNhat(v, "TraLai");
        return { vb: v, nguoiTra: moc?.nguoi ?? "—", soNgay: soNgayTu(moc?.thoiGian, homNay) };
      })
      .filter(({ vb, nguoiTra }) => laVaiTroQuanLy
        ? nguoiTra === toiLaAi        // người duyệt: việc mình đã trả lại
        : vb.nguoiTao === toiLaAi)    // cán bộ: việc mình phải sửa
      .sort((a, b) => (b.soNgay ?? 0) - (a.soNgay ?? 0)),
    [vanBanList, homNay, laVaiTroQuanLy, toiLaAi]);

  const tieuDeBiTraLai = laVaiTroQuanLy
    ? "Văn bản tôi đã trả lại, chưa thấy sửa"
    : "Văn bản bị trả lại";

  // Bấm vào khối phải mở ra ĐÚNG tập vừa đếm, nên bộ lọc mang sang phải lặp lại
  // cùng điều kiện lọc theo vai ở trên — không chỉ là "mở màn Danh sách văn bản".
  const locBiTraLai: LocVanBanTuTrangChu = {
    nhan: tieuDeBiTraLai,
    trangThai: "BiTraLai",
    ...(laVaiTroQuanLy ? { nguoiTraLai: toiLaAi } : { nguoiTao: toiLaAi }),
  };

  // ── Tầng 3 — tải việc dựng TỪ CHÍNH DANH SÁCH ĐƠN ─────────────────────────
  // Cố ý không lấy số đơn từ `canBoList`: bảng hiệu suất và dữ liệu đơn là hai
  // tập mẫu rời nhau, ghép lại sẽ ra nghịch lý kiểu "giữ 3 đơn nhưng 8 đơn quá
  // hạn". Ở đây đếm thẳng đơn đang giữ, rồi mới tra chức danh theo tên.
  const taiViec = useMemo<TaiViecCanBo[]>(() => {
    const chucDanh = new Map(canBoList.map(c => [c.name, c.role]));
    // Đếm TOÀN BỘ đơn quy cho mỗi người, kể cả đã xong — thanh xếp chồng cần cả
    // hai phần. Trước đây chỉ đếm đơn đang giữ nên không dựng được tỉ lệ hoàn thành.
    const theoNguoi = new Map<string, TaiViecCanBo>();
    donList.forEach(d => {
      // Tính theo NGƯỜI ĐƯỢC GIAO xử lý, không phải người nhập đơn.
      const ten = nguoiGiuViec(d);
      if (!ten) return;
      const muc = theoNguoi.get(ten) ?? {
        name: ten, role: chucDanh.get(ten) ?? "Cán bộ",
        tong: 0, daXong: 0, dangXuLy: 0, quaHan: 0, choToiDuyet: 0,
      };
      muc.tong += 1;
      if (daGiaiQuyetXong(d)) {
        muc.daXong += 1;
      } else {
        muc.dangXuLy += 1;
        if (laQuaHan(d, homNay)) muc.quaHan = (muc.quaHan ?? 0) + 1;
      }
      theoNguoi.set(ten, muc);
    });

    theoNguoi.forEach((muc, ten) => {
      muc.choToiDuyet = vanBanList.filter(
        v => v.nguoiTao === ten && nguoiDangGiu(v)?.nguoi === toiLaAi).length;
    });

    // Xếp theo TỔNG đơn giảm dần, không xếp theo tỉ lệ hoàn thành: xếp theo tỉ lệ
    // sẽ biến khối này thành bảng xếp hạng thi đua, trong khi việc của Trưởng phòng
    // ở đây là nhìn khối lượng để cân khi phân công.
    return [...theoNguoi.values()].sort((a, b) => b.tong - a.tong);
  }, [donList, canBoList, vanBanList, toiLaAi, homNay]);

  return (
    <div className="space-y-5">
      {/* ══ TẦNG 1 ══ */}
      {laVaiTroQuanLy && <div className="space-y-4">
        <TieuDeMuc
          icon={<FileCheck size={19} />}
          tieuDe="Việc của tôi hôm nay"
          phu={<span className="text-[12px] text-[#8a94a6]">
            Việc đang dừng ở bàn <span className="font-medium text-[#475569]">{toiLaAi}</span> — không ai xử lý thay được
          </span>}
        />

        <div className="grid grid-cols-4 gap-5">
          <TheViec
            nhan="Văn bản chờ tôi duyệt"
            giaTri={viec.choDuyet}
            phuChu={viec.choDuyet ? "Đang chờ ý kiến duyệt của bạn" : "Không còn văn bản nào chờ duyệt"}
            canhBao={viec.treHan > 0 ? `${viec.treHan} văn bản chờ quá ${HAN_DUYET_VAN_BAN_NGAY} ngày` : undefined}
            icon={<FileCheck size={20} />} mauIcon="text-warning" nenIcon="bg-[#fef3e2]"
            onClick={onMoPheDuyet}
          />
          <TheViec
            nhan="Văn bản chờ tôi ký / bút phê"
            giaTri={viec.choKy}
            phuChu={viec.choKy ? "Đã duyệt xong, chờ chữ ký" : "Không còn văn bản nào chờ ký"}
            icon={<PenLine size={20} />} mauIcon="text-primary" nenIcon="bg-info-container"
            onClick={onMoPheDuyet}
          />
          <TheViec
            nhan="Đơn chờ phân công Thẩm phán"
            giaTri={viec.choPhanCong}
            phuChu={viec.choPhanCong ? "Đơn đã thụ lý mới, chưa có người xử lý" : "Đã phân công hết"}
            icon={<Users size={20} />} mauIcon="text-[#8e44ad]" nenIcon="bg-[#f5f3ff]"
            onClick={() => onMoDanhSachDon?.({ nhan: "Chờ phân công Thẩm phán", trangThai: "Thụ lý mới" })}
          />
          <TheViec
            nhan="Đơn chờ ý kiến Lãnh đạo"
            giaTri={viec.choYKienLD}
            phuChu={viec.choYKienLD ? "Cần theo dõi và đôn đốc" : "Không có đơn nào chờ"}
            icon={<MessageSquareWarning size={20} />} mauIcon="text-[#e67e22]" nenIcon="bg-[#fff7ed]"
            onClick={() => onMoDanhSachDon?.({ nhan: CHO_Y_KIEN_LD, trangThai: CHO_Y_KIEN_LD })}
          />
        </div>
      </div>}

      {/* ══ TẦNG 2 ══ */}
      <div className="space-y-4">
        <TieuDeMuc
          icon={<AlertTriangle size={19} />}
          tieuDe="Cảnh báo cần xử lý"
          phu={<span className="text-[12px] text-[#8a94a6]">Hai loại tách riêng vì đòi hai hành động khác nhau</span>}
        />

        <div className="grid grid-cols-2 gap-5">
          <KhungCanhBao
            tieuDe="Đơn quá hạn giải quyết"
            icon={<AlertTriangle size={18} />} mauIcon="text-error"
            soLuong={donQuaHan.length}
            trong="Không có đơn nào quá hạn"
            onXemTatCa={() => onMoDanhSachDon?.({ nhan: "Quá hạn giải quyết", tienDo: "qua-han" })}
          >
            {donQuaHan.slice(0, 3).map((d, i) => (
              <DongCanhBao
                key={`${d.maDon}-${i}`}
                tieuDe={`Đơn ${(d.maDon ?? "").trim() || "—"}`}
                // Nhãn ghi "Cán bộ xử lý" thì phải đọc người ĐƯỢC GIAO, không phải
                // người nhập đơn — nguoiGiuViec() lùi về người nhập khi chưa giao.
                moTa={`Cán bộ xử lý: ${vietTatTAND(nguoiGiuViec(d) || "chưa phân công")} · ${d.giaiQuyet?.nhan || "Chưa có trạng thái"}`}
                nhanPhai={nhanQuaHan(soNgayQuaHan(d, homNay))}
                mauNhan="text-error bg-[#fee2e2]"
                onClick={() => onMoDanhSachDon?.({ nhan: "Quá hạn giải quyết", tienDo: "qua-han" })}
              />
            ))}
            {donSapDenHan > 0 && (
              // Trước đây là <p> tĩnh: người dùng thấy con số thì bấm, nhưng không
              // có gì xảy ra. Mọi con số trên Trang chủ đều phải mở được danh sách
              // đứng sau nó, nếu không thì đó là ngõ cụt.
              <button
                type="button"
                onClick={() => onMoDanhSachDon?.({ nhan: "Sắp đến hạn giải quyết", tienDo: "sap-den-han" })}
                className="w-full text-left text-[11px] text-[#b45309] bg-[#fffbeb] border border-[#fde68a] rounded-[4px] px-2.5 py-1.5 hover:bg-[#fef3c7] hover:border-[#fcd34d] transition-colors cursor-pointer"
              >
                Thêm <span className="font-bold">{donSapDenHan}</span> đơn sắp đến hạn — nên xử lý trước khi thành quá hạn.
                <span className="ml-1 underline underline-offset-2">Xem danh sách</span>
              </button>
            )}
          </KhungCanhBao>

          {/* Cùng một khối, hai cách đọc: cán bộ đọc là "việc tôi phải làm",
              người duyệt đọc là "việc tôi đang chờ người khác làm". */}
          <KhungCanhBao
            tieuDe={tieuDeBiTraLai}
            icon={<RotateCcw size={18} />} mauIcon="text-[#e67e22]"
            soLuong={vanBanBiTraLai.length}
            trong={laVaiTroQuanLy
              ? "Không có văn bản nào bạn trả lại đang chờ sửa"
              : "Bạn không có văn bản nào bị trả lại"}
            onXemTatCa={() => onMoDanhSachVanBan?.(locBiTraLai)}
          >
            {vanBanBiTraLai.slice(0, 3).map(({ vb, nguoiTra, soNgay }) => (
              <DongCanhBao
                key={vb.id}
                tieuDe={vb.trichYeu || vb.loaiVanBan}
                // Cán bộ đã biết mình phải sửa — thứ họ cần biết là AI trả lại.
                // Người duyệt đã biết mình trả lại — thứ họ cần biết là AI phải sửa.
                moTa={laVaiTroQuanLy
                  ? `Người phải sửa: ${vb.nguoiTao}`
                  : `Trả lại bởi ${nguoiTra} — sửa xong trình lại`}
                nhanPhai={soNgay === null ? "Chưa rõ ngày"
                  : soNgay === 0 ? "Trả lại hôm nay"
                  : laVaiTroQuanLy ? `Đã ${soNgay} ngày` : `Chờ ${soNgay} ngày`}
                mauNhan={soNgay !== null && soNgay > HAN_DUYET_VAN_BAN_NGAY ? "text-error bg-[#fee2e2]" : "text-[#b45309] bg-[#fef3c7]"}
                onClick={() => onMoDanhSachVanBan?.(locBiTraLai)}
              />
            ))}
          </KhungCanhBao>
        </div>
      </div>

      {/* ══ TẦNG 3 ══
          Chỉ quản lý mới có khối này, vì so tải giữa các cán bộ là việc của người
          phân công. Cán bộ xem số của mình bằng chip "Của tôi" trong khối Tiến độ
          giải quyết đơn — một chỗ đọc duy nhất, không đặt thêm khối cạnh tranh. */}
      {laVaiTroQuanLy && taiViec.length > 0 && (
        <BangTaiViec canBo={taiViec} onXemChiTiet={onXemHieuSuat} />
      )}
    </div>
  );
}
