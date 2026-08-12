import React, { useMemo } from "react";
import {
  FileCheck, PenLine, Users, MessageSquareWarning, AlertTriangle, RotateCcw,
  ArrowRight, CheckCircle2, Gauge,
} from "lucide-react";
import {
  nguoiDangGiu, nguoiTheoVaiTro, type VanBanTrinh,
} from "./components/QuanLyVanBan";
import {
  laQuaHan, laSapDenHan, soNgayQuaHan, daGiaiQuyetXong,
  type DonChiSo, type BoLocTuTrangChu,
} from "./ChiSoTrangChu";

/** Trạng thái đơn "Chờ ý kiến Lãnh đạo" — lặp lại chuỗi thay vì import từ App.tsx
 *  để không tạo vòng import (App đã import file này qua Dashboard). */
const CHO_Y_KIEN_LD = "Chờ ý kiến Lãnh đạo";

/** Ngưỡng nhắc việc của Trưởng phòng: văn bản nằm chờ ở bàn mình quá số ngày này
 *  thì chuyển thành cảnh báo. Khác với hạn giải quyết đơn — đây là hạn nội bộ. */
export const HAN_DUYET_VAN_BAN_NGAY = 3;

type VaiTro = "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";

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

/** Nhãn số ngày quá hạn. Dữ liệu có đơn tồn từ nhiều năm trước, in thẳng
 *  "Quá 2244 ngày" thì vừa khó đọc vừa trông như lỗi — trên một năm thì quy ra năm. */
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
        <span className="text-[#8b1a1a] flex items-center">{icon}</span>
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
        <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{giaTri}</span>
      </div>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${nenIcon} ${mauIcon}`}>
        {icon}
      </div>
    </div>
    <div className="mt-2.5 min-h-[18px]">
      {canhBao
        ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#c0392b] bg-[#fef2f2] border border-[#fecaca] rounded-full px-2 py-0.5">
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
    <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between gap-2">
      <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
        <span className={mauIcon}>{icon}</span>
        {tieuDe}
      </h3>
      {soLuong > 0 && (
        <span className="bg-[#fee2e2] text-[#c0392b] text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
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
      <div className="p-3 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-[8px] text-center">
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
    className="w-full text-left p-3 border border-[#f1f5f9] rounded-[6px] hover:border-[#c0392b]/30 hover:bg-[#fef2f2]/50 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]">
    <div className="flex items-start justify-between gap-2 mb-1.5">
      <span className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#c0392b] transition-colors truncate">{tieuDe}</span>
      <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] flex-shrink-0 ${mauNhan}`}>{nhanPhai}</span>
    </div>
    <div className="flex items-center justify-between gap-2">
      <p className="text-[12px] text-[#64748b] line-clamp-1">{moTa}</p>
      <ArrowRight size={14} className="text-[#cbd5e1] group-hover:text-[#c0392b] transition-colors flex-shrink-0" />
    </div>
  </button>
);

// ─── Tầng 3: Tải việc của phòng ──────────────────────────────────────────────

export type TaiViecCanBo = {
  name: string;
  role: string;
  /** Tổng đơn đang xử lý trong kỳ. */
  kyNay: number;
  /** Số đơn đang giữ mà đã quá hạn. */
  quaHan?: number;
  /** Số văn bản của người này đang nằm chờ Trưởng phòng duyệt. */
  choToiDuyet?: number;
};

const BangTaiViec = ({ canBo, onXemChiTiet }: {
  canBo: TaiViecCanBo[]; onXemChiTiet?: () => void;
}) => {
  // Thang đo dùng chung cho mọi thanh — nếu mỗi thanh tự co giãn theo giá trị
  // của chính nó thì không so sánh được giữa các cán bộ.
  const max = Math.max(...canBo.map(c => c.kyNay), 1);
  const tongTai = canBo.reduce((s, c) => s + c.kyNay, 0);
  const trungBinh = canBo.length ? tongTai / canBo.length : 0;

  return (
    <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between gap-2">
        {/* Tên khối phải chứa chữ "hiệu suất": đó là từ người dùng đi tìm, và
            màn mở ra từ đây tên là "Hiệu suất cán bộ kỳ này". Trước đây khối tên
            "Tải việc của phòng" còn màn chi tiết tên "Hiệu suất" — một luồng hai
            tên, tìm mãi không ra. */}
        <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
          <Gauge size={18} className="text-[#8b1a1a]" />
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

      <div className="p-3 space-y-1">
        {canBo.map(c => {
          const lechTrungBinh = trungBinh ? ((c.kyNay - trungBinh) / trungBinh) * 100 : 0;
          const quaTai = lechTrungBinh >= 30;
          return (
            <div key={c.name} className="flex items-center gap-3 px-2 py-2.5 rounded-[6px] hover:bg-[#f8fafc] transition-colors">
              <div className="w-[190px] flex-shrink-0 min-w-0">
                <div className="text-[13px] font-semibold text-[#1e293b] truncate">{c.name}</div>
                <div className="text-[11px] text-[#94a3b8] truncate">{c.role}</div>
              </div>

              {/* Thanh tải — một sắc độ duy nhất vì đây là ĐỘ LỚN, không phải danh
                  tính. Tô mỗi người một màu sẽ ngầm biến bảng thành bảng xếp hạng. */}
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <div className="flex-1 h-[14px] bg-[#f1f5f9] rounded-[3px] overflow-hidden">
                  <div
                    className={`h-full rounded-r-[4px] transition-all duration-700 ${quaTai ? "bg-[#8b1a1a]" : "bg-[#1d2e4f]"}`}
                    style={{ width: `${(c.kyNay / max) * 100}%` }}
                  />
                </div>
                <span className="text-[13px] font-bold text-[#0f172a] w-[54px] flex-shrink-0 tabular-nums">
                  {c.kyNay} đơn
                </span>
              </div>

              {/* Nhãn trạng thái — chữ + biểu tượng, không dựa vào màu đơn thuần */}
              <div className="w-[210px] flex-shrink-0 flex items-center justify-end gap-1.5 flex-wrap">
                {quaTai && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#8b1a1a] bg-[#fdeaea] border border-[#f5c6c6] rounded-full px-2 py-0.5">
                    <AlertTriangle size={9} /> Cao hơn TB {Math.round(lechTrungBinh)}%
                  </span>
                )}
                {!!c.quaHan && c.quaHan > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#c0392b] bg-[#fef2f2] border border-[#fecaca] rounded-full px-2 py-0.5">
                    {c.quaHan} quá hạn
                  </span>
                )}
                {!!c.choToiDuyet && c.choToiDuyet > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#b45309] bg-[#fffbeb] border border-[#fde68a] rounded-full px-2 py-0.5">
                    {c.choToiDuyet} chờ tôi duyệt
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-2.5 bg-[#f8fafc] border-t border-[#f1f5f9] rounded-b-[8px]">
        <p className="text-[11px] text-[#94a3b8]">
          Thanh đo <span className="font-medium text-[#64748b]">số đơn chưa giải quyết xong đang giữ</span>, không phải thành tích.
          Thanh đỏ = tải cao hơn trung bình phòng từ 30% trở lên, nên cân nhắc khi phân công đơn mới.
        </p>
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
  onMoDanhSachVanBan?: () => void;
  onXemHieuSuat?: () => void;
}) {
  const homNay = useMemo(() => new Date(), []);
  const { nguoi: toiLaAi } = nguoiTheoVaiTro(currentRole);

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

  const vanBanBiTraLai = useMemo(
    () => vanBanList
      .filter(v => v.trangThai === "BiTraLai")
      .map(v => {
        const moc = mocGanNhat(v, "TraLai");
        return { vb: v, nguoiTra: moc?.nguoi ?? "—", soNgay: soNgayTu(moc?.thoiGian, homNay) };
      })
      .sort((a, b) => (b.soNgay ?? 0) - (a.soNgay ?? 0)),
    [vanBanList, homNay]);

  // ── Tầng 3 — tải việc dựng TỪ CHÍNH DANH SÁCH ĐƠN ─────────────────────────
  // Cố ý không lấy số đơn từ `canBoList`: bảng hiệu suất và dữ liệu đơn là hai
  // tập mẫu rời nhau, ghép lại sẽ ra nghịch lý kiểu "giữ 3 đơn nhưng 8 đơn quá
  // hạn". Ở đây đếm thẳng đơn đang giữ, rồi mới tra chức danh theo tên.
  const taiViec = useMemo<TaiViecCanBo[]>(() => {
    const chucDanh = new Map(canBoList.map(c => [c.name, c.role]));
    const dangGiu = donList.filter(d => !daGiaiQuyetXong(d) && d.nguoiNhap);

    const theoNguoi = new Map<string, TaiViecCanBo>();
    dangGiu.forEach(d => {
      const ten = d.nguoiNhap!;
      const muc = theoNguoi.get(ten)
        ?? { name: ten, role: chucDanh.get(ten) ?? "Cán bộ", kyNay: 0, quaHan: 0, choToiDuyet: 0 };
      muc.kyNay += 1;
      if (laQuaHan(d, homNay)) muc.quaHan = (muc.quaHan ?? 0) + 1;
      theoNguoi.set(ten, muc);
    });

    theoNguoi.forEach((muc, ten) => {
      muc.choToiDuyet = vanBanList.filter(
        v => v.nguoiTao === ten && nguoiDangGiu(v)?.nguoi === toiLaAi).length;
    });

    return [...theoNguoi.values()].sort((a, b) => b.kyNay - a.kyNay);
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
            icon={<FileCheck size={20} />} mauIcon="text-[#f39c12]" nenIcon="bg-[#fef3e2]"
            onClick={onMoPheDuyet}
          />
          <TheViec
            nhan="Văn bản chờ tôi ký / bút phê"
            giaTri={viec.choKy}
            phuChu={viec.choKy ? "Đã duyệt xong, chờ chữ ký" : "Không còn văn bản nào chờ ký"}
            icon={<PenLine size={20} />} mauIcon="text-[#1a73e8]" nenIcon="bg-[#e8f4ff]"
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
            icon={<AlertTriangle size={18} />} mauIcon="text-[#c0392b]"
            soLuong={donQuaHan.length}
            trong="Không có đơn nào quá hạn"
            onXemTatCa={() => onMoDanhSachDon?.({ nhan: "Quá hạn giải quyết", tienDo: "qua-han" })}
          >
            {donQuaHan.slice(0, 3).map((d, i) => (
              <DongCanhBao
                key={`${d.maDon}-${i}`}
                tieuDe={`Đơn ${(d.maDon ?? "").trim() || "—"}`}
                moTa={`Cán bộ xử lý: ${vietTatTAND(d.nguoiNhap ?? "chưa phân công")} · ${d.giaiQuyet?.nhan || "Chưa có trạng thái"}`}
                nhanPhai={nhanQuaHan(soNgayQuaHan(d, homNay))}
                mauNhan="text-[#c0392b] bg-[#fee2e2]"
                onClick={() => onMoDanhSachDon?.({ nhan: "Quá hạn giải quyết", tienDo: "qua-han" })}
              />
            ))}
            {donSapDenHan > 0 && (
              <p className="text-[11px] text-[#b45309] bg-[#fffbeb] border border-[#fde68a] rounded-[4px] px-2.5 py-1.5">
                Thêm <span className="font-bold">{donSapDenHan}</span> đơn sắp đến hạn — nên xử lý trước khi thành quá hạn.
              </p>
            )}
          </KhungCanhBao>

          <KhungCanhBao
            tieuDe="Văn bản tôi đã trả lại, chưa thấy sửa"
            icon={<RotateCcw size={18} />} mauIcon="text-[#e67e22]"
            soLuong={vanBanBiTraLai.length}
            trong="Không có văn bản nào bị trả lại"
            onXemTatCa={onMoDanhSachVanBan}
          >
            {vanBanBiTraLai.slice(0, 3).map(({ vb, nguoiTra, soNgay }) => (
              <DongCanhBao
                key={vb.id}
                tieuDe={vb.trichYeu || vb.loaiVanBan}
                moTa={`Người phải sửa: ${vb.nguoiTao} · Trả lại bởi ${nguoiTra}`}
                nhanPhai={soNgay === null ? "Chưa rõ ngày" : soNgay === 0 ? "Trả lại hôm nay" : `Đã ${soNgay} ngày`}
                mauNhan={soNgay !== null && soNgay > HAN_DUYET_VAN_BAN_NGAY ? "text-[#c0392b] bg-[#fee2e2]" : "text-[#b45309] bg-[#fef3c7]"}
                onClick={onMoDanhSachVanBan}
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
