import React, { useMemo, useState } from "react";
import { Inbox, CheckCircle2, Clock, AlertTriangle, ArrowRight } from "lucide-react";

/** Kiểu tối thiểu mà khối chỉ số cần đọc — cố ý khai báo theo cấu trúc (structural)
 *  để nhận thẳng `DanhSachDonRow` của màn Danh sách đơn mà không tạo vòng import.
 *  Nhờ vậy Trang chủ và Danh sách đơn đếm trên **cùng một tập dữ liệu**: bấm vào
 *  con số nào thì danh sách mở ra đúng bấy nhiêu dòng. */
export type DonChiSo = {
  giaiQuyet?: { nhan?: string };
  thongTinDon?: { donViGiaiQuyet?: string; thamPhan?: string };
  ngayNhap?: string;
  // Các trường dưới đây chỉ khối cảnh báo / việc của Trưởng phòng cần đọc.
  maDon?: string;
  nguoiNhap?: string;
  /** Cán bộ được giao xử lý đơn. Đây mới là "người đang giữ việc"; `nguoiNhap`
   *  chỉ là người gõ đơn vào hệ thống. Dùng `nguoiGiuViec()` để lấy đúng thứ tự. */
  canBoXuLy?: string;
  isPhanCong?: boolean;
  /** Hồ sơ kháng nghị — không phải đơn, phải loại khỏi mọi chỉ số về đơn. */
  laKhangNghi?: boolean;
};

/** Bộ lọc mà Trang chủ gửi sang màn Danh sách đơn khi người dùng bấm một chỉ số. */
export type BoLocTuTrangChu = {
  /** Nhãn hiển thị trên chip "Từ Trang chủ: …" ở màn Danh sách đơn. */
  nhan: string;
  tienDo?: "da-xong" | "chua-xong" | "qua-han" | "sap-den-han";
  /** Khớp đúng `giaiQuyet.nhan`. */
  trangThai?: string;
  /** Phạm vi "Của tôi" — phải đi kèm bộ lọc, nếu không bấm một con số của riêng
   *  mình lại mở ra danh sách của cả phòng, đúng kiểu lệch số cần tránh. */
  nguoiNhap?: string;
};

// ─── GIẢ ĐỊNH NGHIỆP VỤ — chờ đơn vị nghiệp vụ xác nhận ──────────────────────
// Toàn bộ số dưới đây là phương án đề xuất trong phiếu
// `_bmad-output/planning-artifacts/cau-hoi-chot-chi-so-trang-chu.md`.
// Khi có phản hồi chính thức, chỉ sửa 4 hằng số trong khối này, không sửa giao diện.

/** Câu 3.3 — thời hạn giải quyết, tính bằng ngày lịch kể từ ngày nhập đơn. */
export const HAN_GIAI_QUYET_NGAY = 30;
/** Câu 3.5 — còn bao nhiêu ngày thì cảnh báo sắp đến hạn. */
export const NGUONG_SAP_HET_HAN = 3;
/** Câu 2.2 — trạng thái coi như đã xong ở khâu Phòng HCTP. Riêng "Thụ lý mới"
 *  chỉ tính là xong khi đã chuyển sang Phòng GĐKTTT và THA (xem `daChuyenVu`). */
const TRANG_THAI_KET_THUC = ["Trả lại đơn", "Không thụ lý"];
/** Câu 3.4 — đang chờ công dân bổ sung thì dừng đếm hạn, không tính cán bộ quá hạn. */
const TRANG_THAI_TAM_DUNG_HAN = ["Chưa đủ điều kiện"];

/** Ai đang giữ đơn này. Đã giao thì là cán bộ được giao; chưa giao thì tạm tính
 *  cho người nhập — dữ liệu cũ chưa có trường phân công, bỏ hẳn thì mọi con số
 *  tải việc tụt về 0 và màn hình trông như hỏng. */
export const nguoiGiuViec = (r: DonChiSo) =>
  (r.canBoXuLy ?? "").trim() || (r.nguoiNhap ?? "").trim();

// ─── Luật phân loại ──────────────────────────────────────────────────────────

/** Cùng một luật với màn Danh sách đơn: có "(Số: …)" trong đơn vị giải quyết
 *  nghĩa là hồ sơ đã được chuyển sang Phòng GĐKTTT và THA kèm số công văn. */
const daChuyenVu = (r: DonChiSo) => /\(Số:/.test(r.thongTinDon?.donViGiaiQuyet ?? "");

export const daGiaiQuyetXong = (r: DonChiSo) => {
  const t = r.giaiQuyet?.nhan ?? "";
  if (TRANG_THAI_KET_THUC.includes(t)) return true;
  return t === "Thụ lý mới" && daChuyenVu(r);
};

const parseVNDate = (s?: string): Date | null => {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((s ?? "").trim());
  return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
};

/** Số ngày đã trôi qua kể từ ngày nhập. Không đọc được ngày → null (không kết luận). */
const soNgayDaQua = (r: DonChiSo, homNay: Date): number | null => {
  const d = parseVNDate(r.ngayNhap);
  if (!d) return null;
  return Math.floor((homNay.getTime() - d.getTime()) / 86_400_000);
};

/** Số ngày quá hạn. ≤ 0 nghĩa là còn trong hạn. */
export const soNgayQuaHan = (r: DonChiSo, homNay: Date): number => {
  const qua = soNgayDaQua(r, homNay);
  return qua === null ? 0 : qua - HAN_GIAI_QUYET_NGAY;
};

const dangDemHan = (r: DonChiSo) =>
  !daGiaiQuyetXong(r) && !TRANG_THAI_TAM_DUNG_HAN.includes(r.giaiQuyet?.nhan ?? "");

export const laQuaHan = (r: DonChiSo, homNay: Date) =>
  dangDemHan(r) && soNgayQuaHan(r, homNay) > 0;

export const laSapDenHan = (r: DonChiSo, homNay: Date) => {
  if (!dangDemHan(r)) return false;
  // Không đọc được ngày nhập thì KHÔNG kết luận gì. Bỏ qua bước này là dính bẫy:
  // `soNgayQuaHan` trả 0 cho cả hai trường hợp "đúng ngày đến hạn" và "không biết
  // ngày nào", nên mọi đơn thiếu ngày nhập đều bị đếm nhầm thành sắp đến hạn.
  // `laQuaHan` không dính vì nó đòi > 0, còn ở đây 0 lại là giá trị hợp lệ.
  if (soNgayDaQua(r, homNay) === null) return false;
  const con = -soNgayQuaHan(r, homNay);
  return con >= 0 && con <= NGUONG_SAP_HET_HAN;
};

/** 6 trạng thái thụ lý. Màu lấy đúng bảng ở `docs/man-hinh-danh-sach-don.md` mục 5.2
 *  để một trạng thái luôn cùng một màu ở mọi màn hình. */
export const TRANG_THAI_THU_LY = [
  { nhan: "Thụ lý mới", mau: "#27ae60" },
  { nhan: "Đã thụ lý", mau: "#1a5a96" },
  { nhan: "Chưa đủ điều kiện", mau: "#e67e22" },
  { nhan: "Chờ ý kiến Lãnh đạo", mau: "#e67e22" },
  { nhan: "Trả lại đơn", mau: "#2980b9" },
  { nhan: "Không thụ lý", mau: "#c0392b" },
] as const;

export const tinhChiSo = (rows: DonChiSo[], homNay: Date) => {
  const tong = rows.length;
  const daXong = rows.filter(daGiaiQuyetXong).length;
  const chuaXong = tong - daXong;
  const quaHan = rows.filter(r => laQuaHan(r, homNay)).length;
  const sapDenHan = rows.filter(r => laSapDenHan(r, homNay)).length;
  return {
    tong, daXong, chuaXong, quaHan, sapDenHan,
    tyLeXong: tong ? (daXong / tong) * 100 : 0,
    tyLeChuaXong: tong ? (chuaXong / tong) * 100 : 0,
    /** Quá hạn tính trên **số đơn chưa giải quyết**, đúng như đơn vị nghiệp vụ yêu cầu. */
    tyLeQuaHan: chuaXong ? (quaHan / chuaXong) * 100 : 0,
    theoTrangThai: TRANG_THAI_THU_LY.map(t => ({
      ...t,
      soLuong: rows.filter(r => (r.giaiQuyet?.nhan ?? "") === t.nhan).length,
    })),
  };
};

const phanTram = (n: number) => `${n.toFixed(1).replace(".", ",")}%`;

// ─── Thành phần giao diện ────────────────────────────────────────────────────

/** Ô chỉ số bấm được. Toàn bộ ô là một <button> để bấm đâu cũng vào, và để
 *  di chuyển bằng bàn phím (Tab → Enter) vẫn dùng được. */
const OChiSo = ({ nhan, giaTri, phuDe, icon, mauIcon, nenIcon, onClick, children }: {
  nhan: string; giaTri: number; phuDe?: React.ReactNode;
  icon: React.ReactNode; mauIcon: string; nenIcon: string;
  onClick?: () => void; children?: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group text-left bg-white rounded-[10px] border border-[#eef1f4] p-4 shadow-sm hover:shadow-md hover:border-[#cbd5e1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] transition-all duration-200 flex flex-col"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[13px] text-[#8a94a6] font-normal mb-1.5">{nhan}</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[26px] font-bold text-[#1d2e4f] leading-none tracking-tight">{giaTri}</span>
          {phuDe}
        </div>
      </div>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${nenIcon} ${mauIcon}`}>
        {icon}
      </div>
    </div>
    {children}
    <span className="mt-auto pt-3 text-[11px] font-medium text-[#94a3b8] group-hover:text-[#3b82f6] flex items-center gap-1 transition-colors">
      Xem danh sách <ArrowRight size={11} />
    </span>
  </button>
);

export default function ChiSoTrangChu({ rows, onMoDanhSach, toiLaAi, macDinhCuaToi = false, onXemHieuSuat }: {
  rows: DonChiSo[];
  onMoDanhSach?: (loc: BoLocTuTrangChu) => void;
  /** Tên người đang đăng nhập — có giá trị thì hiện cặp chip "Của tôi / Toàn phòng". */
  toiLaAi?: string;
  /** Vai không quản lý thì mở màn ở phạm vi "Của tôi". */
  macDinhCuaToi?: boolean;
  onXemHieuSuat?: () => void;
}) {
  const homNay = useMemo(() => new Date(), []);
  // Phạm vi số liệu. Gộp "của tôi" vào ngay khối này thay vì dựng một khối riêng
  // ở trên: hai khối cùng đếm đơn, xếp chồng nhau, mỗi khối một mẫu số thì người
  // đọc phải tự đối chiếu hai con số — đó chính là lỗi khối "Tải việc của tôi" cũ.
  const [pham, setPham] = useState<"toi" | "phong">(macDinhCuaToi && toiLaAi ? "toi" : "phong");
  const cuaToi = pham === "toi" && !!toiLaAi;

  const rowsTrongPham = useMemo(
    () => cuaToi ? rows.filter(r => r.nguoiNhap === toiLaAi) : rows,
    [rows, cuaToi, toiLaAi]);
  const cs = useMemo(() => tinhChiSo(rowsTrongPham, homNay), [rowsTrongPham, homNay]);

  // Bộ lọc gửi sang Danh sách đơn luôn mang theo phạm vi đang xem.
  const mo = (loc: BoLocTuTrangChu) => onMoDanhSach?.(
    cuaToi ? { ...loc, nguoiNhap: toiLaAi, nhan: `${loc.nhan} · của tôi` } : loc);

  return (
    <div className="space-y-5">
      {/* ── Khối 1: Tiến độ giải quyết ── */}
      <div>
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Cấp 2 — nhỏ hơn, chữ hoa, màu xám. Đây là khối CON của mục "Hiện
                trạng đơn"; để cùng cỡ 16px đậm + icon đỏ như tiêu đề mục thì nhìn
                vào không biết cái nào chứa cái nào. */}
            <h3 className="text-[12.5px] font-bold uppercase tracking-[0.07em] text-[#5b6577] flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#94a3b8]" />
              Tiến độ giải quyết đơn
            </h3>
            {toiLaAi && (
              <div className="flex items-center bg-[#f1f5f9] rounded-[6px] p-1 border border-[#e2e8f0]">
                {([["toi", "Của tôi"], ["phong", "Toàn phòng"]] as const).map(([gt, nhan]) => (
                  <button key={gt} type="button" onClick={() => setPham(gt)}
                    aria-pressed={pham === gt}
                    className={`px-3 py-1 text-[12px] font-medium rounded-[4px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] ${
                      pham === gt
                        ? "bg-white shadow-sm text-[#0f172a] border border-[#cbd5e1]"
                        : "text-[#64748b] hover:text-[#0f172a] border border-transparent"}`}>
                    {nhan}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[12px] text-[#8a94a6]">
              {cuaToi ? "Đơn do tôi nhập, chưa giải quyết xong" : "Toàn bộ đơn đang theo dõi"} · cập nhật theo thời gian thực
            </span>
            {onXemHieuSuat && (
              <button type="button" onClick={onXemHieuSuat}
                className="text-[#3b82f6] text-[12px] font-medium hover:underline flex items-center gap-1">
                Xem hiệu suất chi tiết <ArrowRight size={11} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Tổng — kèm thanh tỉ lệ xong / chưa xong để thấy ngay tương quan */}
          <OChiSo
            nhan="Tổng số đơn"
            giaTri={cs.tong}
            icon={<Inbox size={20} />}
            mauIcon="text-[#3b82f6]" nenIcon="bg-[#eff6ff]"
            onClick={() => mo({ nhan: "Tổng số đơn" })}
          >
            <div className="mt-3.5">
              <div className="flex h-[8px] rounded-full overflow-hidden bg-[#f1f5f9]">
                <div className="h-full bg-[#27ae60] transition-all duration-700"
                  style={{ width: `${cs.tyLeXong}%` }} />
                {/* Khe 2px màu nền ngăn hai đoạn — không viền, để mực thừa không đè lên dữ liệu */}
                <div className="h-full w-[2px] bg-white flex-shrink-0" />
                <div className="h-full bg-[#e67e22] transition-all duration-700"
                  style={{ width: `${cs.tyLeChuaXong}%` }} />
              </div>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-[#64748b]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#27ae60]" /> Đã giải quyết
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#e67e22]" /> Chưa giải quyết
                </span>
              </div>
            </div>
          </OChiSo>

          {/* Đã giải quyết xong */}
          <OChiSo
            nhan="Đã giải quyết xong"
            giaTri={cs.daXong}
            phuDe={<span className="text-[12px] font-medium text-[#27ae60] whitespace-nowrap">{phanTram(cs.tyLeXong)} tổng số đơn</span>}
            icon={<CheckCircle2 size={20} />}
            mauIcon="text-[#27ae60]" nenIcon="bg-[#f0fdf4]"
            onClick={() => mo({ nhan: "Đã giải quyết xong", tienDo: "da-xong" })}
          >
            <p className="mt-3.5 text-[11px] text-[#94a3b8] leading-relaxed">
              Đơn đã trả lại, không thụ lý, hoặc đã phân công và chuyển sang Phòng GĐKTTT và THA.
            </p>
          </OChiSo>

          {/* Chưa giải quyết — quá hạn nằm BÊN TRONG, không tách thành ô thứ 4,
              để người đọc không cộng nhầm ba số thành lớn hơn tổng. */}
          <OChiSo
            nhan="Chưa giải quyết"
            giaTri={cs.chuaXong}
            phuDe={<span className="text-[12px] font-medium text-[#e67e22] whitespace-nowrap">{phanTram(cs.tyLeChuaXong)} tổng số đơn</span>}
            icon={<Clock size={20} />}
            mauIcon="text-[#e67e22]" nenIcon="bg-[#fff7ed]"
            onClick={() => mo({ nhan: "Chưa giải quyết", tienDo: "chua-xong" })}
          >
            <div className="mt-3.5 rounded-[6px] bg-[#fef2f2] border border-[#fecaca] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#c0392b]">
                  <AlertTriangle size={13} className="flex-shrink-0" /> Quá hạn giải quyết
                </span>
                <span
                  role="link" tabIndex={0}
                  onClick={e => { e.stopPropagation(); mo({ nhan: "Quá hạn giải quyết", tienDo: "qua-han" }); }}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); mo({ nhan: "Quá hạn giải quyết", tienDo: "qua-han" }); } }}
                  className="text-[15px] font-bold text-[#c0392b] leading-none hover:underline cursor-pointer"
                >
                  {cs.quaHan}
                </span>
              </div>
              {/* Đồng hồ đo: nền là bậc nhạt của chính dải màu đỏ, không phải xám —
                  để mức độ nghiêm trọng đọc được trên toàn thanh. */}
              <div className="h-[6px] rounded-full bg-[#fadbd8] overflow-hidden mt-2">
                <div className="h-full bg-[#c0392b] rounded-full transition-all duration-700"
                  style={{ width: `${cs.tyLeQuaHan}%` }} />
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-1.5 leading-tight">
                Chiếm <span className="font-semibold text-[#c0392b]">{phanTram(cs.tyLeQuaHan)}</span> số đơn chưa giải quyết
                {cs.sapDenHan > 0 && <> · còn <span className="font-semibold text-[#e67e22]">{cs.sapDenHan}</span> đơn sắp đến hạn</>}
              </p>
            </div>
          </OChiSo>
        </div>
      </div>

      {/* ── Khối 2: Trạng thái thụ lý ── */}
      <div>
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-[12.5px] font-bold uppercase tracking-[0.07em] text-[#5b6577] flex items-center gap-2">
            <Clock size={15} className="text-[#94a3b8]" />
            Đơn theo trạng thái thụ lý
          </h3>
          <span className="text-[12px] text-[#8a94a6]">Bấm vào từng trạng thái để mở danh sách đơn tương ứng</span>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {cs.theoTrangThai.map(t => (
            <button
              key={t.nhan}
              type="button"
              onClick={() => mo({ nhan: t.nhan, trangThai: t.nhan })}
              className="group text-left bg-white rounded-[10px] border border-[#eef1f4] p-3.5 shadow-sm hover:shadow-md hover:border-[#cbd5e1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] transition-all duration-200"
            >
              {/* Màu chỉ là kênh phụ — nhãn chữ mới là kênh nhận diện chính, nên
                  hai trạng thái dùng chung màu cam vẫn không thể đọc nhầm nhau. */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.mau }} />
                <span className="text-[11px] text-[#64748b] font-medium leading-tight line-clamp-2">{t.nhan}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[22px] font-bold text-[#1d2e4f] leading-none tracking-tight">{t.soLuong}</span>
                <ArrowRight size={13} className="text-[#cbd5e1] group-hover:text-[#3b82f6] transition-colors mb-0.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
