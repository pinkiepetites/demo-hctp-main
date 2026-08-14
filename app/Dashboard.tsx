import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Users,
  ArrowRight,
  FileCheck,
  Inbox,
  RotateCcw,
  Clock,
  CheckCircle2,
  CalendarRange,
  Gauge,
  PenLine,
  MessageSquare,
} from "lucide-react";
import { dangChoXuLy, nguoiDangGiu, nguoiTheoVaiTro, type VanBanTrinh, type TabDS } from "./components/QuanLyVanBan";
import { type KyBaoCao } from "./SoSanhLoaiAnChiTiet";

// ─── Tiện ích chung ──────────────────────────────────────────────────────────

/** Số ngày đã trôi qua kể từ một mốc "dd/MM/yyyy HH:mm" trong lịch sử văn bản. */
const soNgayTu = (thoiGian?: string) => {
  const m = thoiGian?.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return 0;
  const [, d, mo, y] = m;
  const moc = new Date(Number(y), Number(mo) - 1, Number(d));
  return Math.max(0, Math.floor((Date.now() - moc.getTime()) / 86400000));
};

/** % kiểu Việt Nam, 1 chữ số thập phân: 18.5 → "18,5". Chia cho 0 → "0,0". */
const pct1 = (tu: number, mau: number) => (mau > 0 ? (tu / mau) * 100 : 0).toFixed(1).replace(".", ",");

/** Trục giá trị "đẹp" cho biểu đồ cột dọc: luôn cao hơn cột cao nhất (để còn
 *  chỗ ghi số trên đầu cột), chia đúng 5 khoảng bằng nhau. */
const trucDoc = (max: number) => {
  const dinh = Math.max(5, Math.ceil((max * 1.2) / 5) * 5);
  return { dinh, moc: Array.from({ length: 6 }, (_, i) => Math.round((dinh / 5) * (5 - i))) };
};

/** Trục giá trị cho biểu đồ thanh ngang: dài hơn thanh dài nhất (để còn chỗ
 *  ghi số ở cuối thanh), chia đúng 6 khoảng bằng nhau. */
const trucNgang = (max: number) => {
  const dinh = Math.max(6, Math.ceil((max * 1.2) / 6) * 6);
  return { dinh, moc: Array.from({ length: 7 }, (_, i) => Math.round((dinh / 6) * i)) };
};

// ─── Thẻ "Việc của tôi hôm nay" ──────────────────────────────────────────────
// Việc đang dừng ở đúng bàn người đang đăng nhập — không ai xử lý thay được,
// nên đặt ngay đầu trang, trước mọi số liệu thống kê.
const TheViecCuaToi = ({ title, value, icon, bgColorClass, colorClass, canhBao, moTa, onXuLy }: {
  title: string; value: number; icon: React.ReactNode;
  bgColorClass: string; colorClass: string;
  /** Dòng cảnh báo (nền đỏ nhạt) — có thì hiện thay cho {moTa}. */
  canhBao?: string;
  moTa: string;
  onXuLy?: () => void;
}) => (
  <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
    <div className="flex items-start justify-between gap-2 mb-2">
      <p className="text-[13px] text-[#666] font-medium leading-snug">{title}</p>
      <div className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${bgColorClass} ${colorClass}`}>
        {icon}
      </div>
    </div>
    <span className="text-[30px] font-bold text-[#1d2e4f] leading-none tracking-tight mb-2.5">{value}</span>
    {canhBao ? (
      <span className="self-start text-[11.5px] font-semibold text-[#c0392b] bg-[#fee2e2] border border-[#fecaca] rounded-[4px] px-2 py-1 flex items-center gap-1.5 mb-3">
        <AlertTriangle size={12} /> {canhBao}
      </span>
    ) : (
      <p className="text-[12px] text-[#94a3b8] mb-3">{moTa}</p>
    )}
    <button onClick={onXuLy} className="mt-auto self-start text-[12px] font-medium text-[#64748b] hover:text-[#3b82f6] transition-colors flex items-center gap-1">
      Xử lý ngay <ArrowRight size={11} />
    </button>
  </div>
);

// ─── Khối "Hiện trạng đơn" ───────────────────────────────────────────────────
// Đếm trực tiếp trên danh sách đơn tại thời điểm hiện tại (khác "Báo cáo kết
// quả xử lý theo kỳ" — số chốt kỳ). Dùng chung cho mọi vai trò, chỉ khác bộ số
// truyền vào.
type SoLieuHienTrang = {
  daGiaiQuyet: number; chuaGiaiQuyet: number; quaHan: number; sapDenHan: number;
  trangThai: { nhan: string; mau: string; tab: number; soLuong: number }[];
};

const HienTrangDon = ({ hienTrang, phamVi, onDoiPhamVi, onXemDanhSachDon, onXemDonQuaHan, onXemChiTietHieuSuat }: {
  hienTrang: SoLieuHienTrang;
  phamVi: "toi" | "phong";
  onDoiPhamVi: (p: "toi" | "phong") => void;
  onXemDanhSachDon?: (tab: number) => void;
  onXemDonQuaHan?: () => void;
  onXemChiTietHieuSuat?: () => void;
}) => {
  const tongDon = hienTrang.daGiaiQuyet + hienTrang.chuaGiaiQuyet;
  const pctDa = tongDon > 0 ? (hienTrang.daGiaiQuyet / tongDon) * 100 : 0;
  const pctChua = tongDon > 0 ? 100 - pctDa : 0;

  return (
    <div>
      <h2 className="text-[16px] font-bold text-[#0f172a] mb-1 flex items-center gap-2">
        <BarChart3 size={18} className="text-[#8b1a1a]" />
        Hiện trạng đơn
      </h2>
      <p className="text-[12px] text-[#94a3b8] mb-4">
        Đếm trực tiếp trên danh sách đơn tại thời điểm hiện tại — bấm vào số nào mở đúng danh sách đó.
      </p>

      <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#8b1a1a]" />
              Tiến độ giải quyết đơn
            </span>
            <div className="flex items-center bg-[#f1f5f9] rounded-[6px] p-1 border border-[#e2e8f0]">
              {(["toi", "phong"] as const).map(pham => (
                <button
                  key={pham}
                  onClick={() => onDoiPhamVi(pham)}
                  className={`px-3 py-1 text-[12px] font-medium rounded-[4px] transition-all duration-200 ${phamVi === pham ? "bg-white shadow-sm text-[#0f172a] border border-[#cbd5e1]" : "text-[#64748b] hover:text-[#0f172a] border border-transparent"}`}
                >
                  {pham === "toi" ? "Của tôi" : "Toàn phòng"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#94a3b8]">
              {phamVi === "toi" ? "Đơn do tôi nhập, chưa giải quyết xong" : "Đơn toàn phòng, chưa giải quyết xong"} · cập nhật theo thời gian thực
            </span>
            <button onClick={onXemChiTietHieuSuat} className="text-[#3b82f6] text-[12px] font-medium hover:underline flex items-center gap-1 whitespace-nowrap">
              Xem hiệu suất chi tiết <ArrowRight size={11} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Tổng số đơn */}
          <div className="border border-[#eee] rounded-[8px] p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[13px] text-[#666] font-medium">Tổng số đơn</span>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#eff6ff] text-[#3b82f6] flex-shrink-0">
                <Inbox size={17} />
              </div>
            </div>
            <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{tongDon}</span>
            <div className="flex items-center gap-0.5 h-[7px] rounded-full overflow-hidden mt-3 mb-2 bg-[#e2e8f0]">
              <div className="h-full bg-[#22c55e]" style={{ width: `${pctDa}%` }} />
              <div className="h-full bg-[#f97316]" style={{ width: `${pctChua}%` }} />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#64748b] mb-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22c55e]" />Đã giải quyết</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f97316]" />Chưa giải quyết</span>
            </div>
            <button onClick={() => onXemDanhSachDon?.(phamVi === "toi" ? 1 : 0)} className="text-[12px] font-medium text-[#3b82f6] hover:underline flex items-center gap-1">
              Xem danh sách <ArrowRight size={11} />
            </button>
          </div>

          {/* Đã giải quyết xong */}
          <div className="border border-[#eee] rounded-[8px] p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[13px] text-[#666] font-medium">Đã giải quyết xong</span>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f0fdf4] text-[#16a34a] flex-shrink-0">
                <CheckCircle2 size={17} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{hienTrang.daGiaiQuyet}</span>
              <span className="text-[12px] font-semibold text-[#16a34a]">{pct1(hienTrang.daGiaiQuyet, tongDon)}% tổng số đơn</span>
            </div>
            <p className="text-[12px] text-[#64748b] mb-3">Đơn đã trả lại, không thụ lý, hoặc đã phân công và chuyển sang Phòng GĐKTTT và THA.</p>
            <button onClick={() => onXemDanhSachDon?.(6)} className="text-[12px] font-medium text-[#3b82f6] hover:underline flex items-center gap-1">
              Xem danh sách <ArrowRight size={11} />
            </button>
          </div>

          {/* Chưa giải quyết */}
          <div className="border border-[#eee] rounded-[8px] p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[13px] text-[#666] font-medium">Chưa giải quyết</span>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#fff7ed] text-[#f97316] flex-shrink-0">
                <Clock size={17} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{hienTrang.chuaGiaiQuyet}</span>
              <span className="text-[12px] font-semibold text-[#e67e22]">{pct1(hienTrang.chuaGiaiQuyet, tongDon)}% tổng số đơn</span>
            </div>
            <p className="text-[12px] text-[#64748b] mb-3">Đơn đang trong quá trình thụ lý, xem xét hoặc chờ ý kiến — chưa ra kết quả cuối cùng.</p>
            <button onClick={() => onXemDonQuaHan?.()} className="text-[12px] font-medium text-[#3b82f6] hover:underline flex items-center gap-1">
              Xem danh sách <ArrowRight size={11} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── Lưới "Đơn theo trạng thái thụ lý" ───────────────────────────────────────
// Vẫn là số đếm HIỆN TRẠNG (giống khối "Hiện trạng đơn", không co giãn theo kỳ)
// nhưng đặt trong khối báo cáo, ngay dưới bộ lọc kỳ — nên phải nói rõ điều đó
// trong dòng chú thích để người đọc không hiểu nhầm là số chốt kỳ.
const DonTheoTrangThaiThuLy = ({ trangThai, onXemDanhSachDon }: {
  trangThai: SoLieuHienTrang["trangThai"];
  onXemDanhSachDon?: (tab: number) => void;
}) => (
  <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm p-5 mb-5">
    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
      <span className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wide flex items-center gap-1.5">
        <Clock size={14} className="text-[#8b1a1a]" />
        Đơn theo trạng thái thụ lý
      </span>
      <span className="text-[11px] text-[#94a3b8]">Số liệu hiện tại, không đổi theo kỳ báo cáo · bấm vào từng trạng thái để mở danh sách đơn tương ứng</span>
    </div>
    <div className="grid grid-cols-6 gap-3">
      {trangThai.map(t => (
        <button
          key={t.nhan}
          onClick={() => onXemDanhSachDon?.(t.tab)}
          className="text-left border border-[#eee] rounded-[8px] p-3 hover:border-[#cbd5e1] hover:bg-[#f8fafc] transition-colors group"
        >
          <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-[#475569] mb-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.mau }} />
            {t.nhan}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-bold text-[#1d2e4f] leading-none">{t.soLuong}</span>
            <ArrowRight size={13} className="text-[#cbd5e1] group-hover:text-[#3b82f6] transition-colors" />
          </div>
        </button>
      ))}
    </div>
  </div>
);

// ─── Khối "Báo cáo kết quả xử lý theo kỳ" ────────────────────────────────────
// Nguồn: báo cáo chốt kỳ của Phòng HCTP — KHÁC "Hiện trạng đơn" ở trên (đếm
// tại thời điểm hiện tại), nên hai khối không cần trùng số. Bộ lọc kỳ nằm
// trong khối này vì chỉ chi phối 2 biểu đồ ở đây.
const KET_QUA_LIST: { key: string; nhanBaoCao: string; color: string }[] = [
  { key: "Đơn trùng", nhanBaoCao: "Đơn trùng", color: "#e74c3c" },
  { key: "Thụ lý mới", nhanBaoCao: "Đơn thụ lý mới", color: "#3b82f6" },
  { key: "Chưa đủ điều kiện", nhanBaoCao: "Chưa đủ điều kiện", color: "#eab308" },
  { key: "Trả lại", nhanBaoCao: "Trả lại đơn", color: "#f97316" },
  { key: "Không thẩm quyền", nhanBaoCao: "Không thuộc thẩm quyền", color: "#06b6d4" },
  { key: "Chuyển Toà án khác", nhanBaoCao: "Chuyển Toà án khác", color: "#8b5cf6" },
];
// Loại án trên báo cáo chốt kỳ gồm 3 nhóm — đơn chưa phân loại được nằm ở
// "Chưa xác định".
const LOAI_AN_BAO_CAO = ["Hình sự", "Dân sự", "Chưa xác định"] as const;
// Ma trận Loại án × Kết quả của kỳ "Tuần này"; các kỳ khác co giãn theo cùng
// một hệ số nhân để mọi số trên trang nhất quán với nhau.
const BAO_CAO_KET_QUA_TUAN: Record<typeof LOAI_AN_BAO_CAO[number], Record<string, number>> = {
  "Hình sự": { "Đơn trùng": 3, "Thụ lý mới": 2, "Chưa đủ điều kiện": 1, "Trả lại": 1, "Không thẩm quyền": 1, "Chuyển Toà án khác": 0 },
  "Dân sự": { "Đơn trùng": 2, "Thụ lý mới": 1, "Chưa đủ điều kiện": 0, "Trả lại": 0, "Không thẩm quyền": 0, "Chuyển Toà án khác": 1 },
  "Chưa xác định": { "Đơn trùng": 0, "Thụ lý mới": 0, "Chưa đủ điều kiện": 0, "Trả lại": 0, "Không thẩm quyền": 0, "Chuyển Toà án khác": 0 },
};
// Tổng số đơn NHẬN trong kỳ — mẫu số của cột % ở panel "Kết quả xử lý đơn"
// (đơn đã nhận nhưng chưa ra kết quả nên tổng các kết quả luôn nhỏ hơn số này).
const DON_NHAN_TUAN = 27;

const BaoCaoKetQuaTheoKy = ({ trangThai, onXemDanhSachDon, onXemSoSanhLoaiAn }: {
  trangThai: SoLieuHienTrang["trangThai"];
  onXemDanhSachDon?: (tab: number) => void;
  onXemSoSanhLoaiAn?: (ky: KyBaoCao) => void;
}) => {
  const [chartPeriod, setChartPeriod] = useState<KyBaoCao>("week");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const mult = chartPeriod === "day" ? 0.1 : chartPeriod === "month" ? 4 : chartPeriod === "year" ? 40 : chartPeriod === "custom" ? 0.5 : 1;
  const loaiAnKetQua = LOAI_AN_BAO_CAO.map(loaiAn => ({
    loaiAn,
    ketQua: KET_QUA_LIST.map(kq => ({ ...kq, soLuong: Math.round(BAO_CAO_KET_QUA_TUAN[loaiAn][kq.key] * mult) })),
  }));
  const tongDonNhan = Math.round(DON_NHAN_TUAN * mult);
  const trucCot = trucDoc(Math.max(...loaiAnKetQua.flatMap(l => l.ketQua.map(k => k.soLuong)), 0));
  // Tổng theo từng loại kết quả (cộng dồn qua mọi loại án) — nguồn cho panel
  // xếp hạng bên phải; giữ nguyên thứ tự chú giải của biểu đồ cột.
  const ketQuaTong = KET_QUA_LIST.map(kq => ({
    ...kq,
    soLuong: loaiAnKetQua.reduce((s, l) => s + (l.ketQua.find(k => k.key === kq.key)?.soLuong ?? 0), 0),
  }));
  const trucThanh = trucNgang(Math.max(...ketQuaTong.map(k => k.soLuong), 0));

  return (
    <div>
      <h2 className="text-[16px] font-bold text-[#0f172a] mb-1 flex items-center gap-2">
        <CalendarRange size={18} className="text-[#8b1a1a]" />
        Báo cáo kết quả xử lý theo kỳ
      </h2>
      <p className="text-[12px] text-[#94a3b8] mb-4">
        Nguồn: báo cáo chốt kỳ của Phòng Hành chính Tư pháp. Số liệu chốt theo kỳ nên không trùng với phần “Hiện trạng đơn” ở trên.
      </p>

      <div className="flex items-center gap-5 flex-wrap bg-white p-3.5 rounded-[8px] border border-[#e2e8f0] shadow-sm mb-5">
        <label className="text-[13px] font-medium text-[#475569]">Kỳ báo cáo:</label>
        <div className="flex items-center bg-[#f1f5f9] rounded-[6px] p-1 border border-[#e2e8f0]">
          {(["day", "week", "month", "year", "custom"] as const).map((period, idx) => {
            const labels = ["Hôm nay", "Tuần này", "Tháng này", "Năm nay", "Tùy chọn"];
            return (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-3.5 py-1.5 text-[12px] font-medium rounded-[4px] transition-all duration-200 ${chartPeriod === period ? "bg-white shadow-sm text-[#0f172a] border border-[#cbd5e1]" : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/50 border border-transparent"}`}
              >
                {labels[idx]}
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-[#cbd5e1]" />

        {chartPeriod === "custom" && (
          <div className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-2 duration-300">
            <label className="text-[13px] font-medium text-[#475569]">Từ:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={e => setCustomStartDate(e.target.value)}
              className="h-[32px] px-2.5 border border-[#cbd5e1] rounded-[4px] text-[13px] outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] text-[#1e293b]"
            />
            <span className="text-[#94a3b8]">-</span>
            <label className="text-[13px] font-medium text-[#475569]">Đến:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={e => setCustomEndDate(e.target.value)}
              className="h-[32px] px-2.5 border border-[#cbd5e1] rounded-[4px] text-[13px] outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] text-[#1e293b]"
            />
          </div>
        )}
      </div>

      <DonTheoTrangThaiThuLy trangThai={trangThai} onXemDanhSachDon={onXemDanhSachDon} />

      <div className="grid grid-cols-3 gap-5">
        {/* So sánh số đơn theo loại án & kết quả — cột nhóm: 3 loại án × 6 kết quả */}
        <div className="col-span-2 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between gap-3">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <BarChart3 size={18} className="text-[#3b82f6]" />
              So sánh số đơn theo loại án & kết quả
            </h3>
            {/* Sang màn "So sánh loại án chi tiết" — mang theo đúng kỳ đang chọn
                để hai màn không lệch số. */}
            <button onClick={() => onXemSoSanhLoaiAn?.(chartPeriod)}
              className="text-[#3b82f6] text-[12px] font-medium hover:underline flex items-center gap-1 whitespace-nowrap">
              Xem chi tiết <ArrowRight size={11} />
            </button>
          </div>

          <div className="flex-1 p-5 flex flex-col">
            <div className="flex h-[260px]">
              {/* Chỗ trống cho nhãn trục giá trị — nhãn được đặt tuyệt đối theo
                  đúng đường lưới của nó (xem bên dưới) nên luôn thẳng hàng. */}
              <div className="w-8 flex-shrink-0" />

              <div className="flex-1 flex flex-col">
                <div className="flex-1 relative border-l border-b border-[#e2e8f0]">
                  {/* Nhãn + lưới ngang tại từng mốc (mốc 0 đã có đường trục) */}
                  {trucCot.moc.map((v, i) => (
                    <React.Fragment key={v}>
                      <span className="absolute right-full pr-2 -translate-y-1/2 text-[11px] font-medium text-[#94a3b8]"
                        style={{ top: `${(i / (trucCot.moc.length - 1)) * 100}%` }}>{v}</span>
                      {i < trucCot.moc.length - 1 && (
                        <div className="absolute left-0 right-0 border-t border-[#f1f5f9]"
                          style={{ top: `${(i / (trucCot.moc.length - 1)) * 100}%` }} />
                      )}
                    </React.Fragment>
                  ))}
                  <div className="absolute inset-0 flex">
                    {loaiAnKetQua.map(nhom => (
                      <div key={nhom.loaiAn} className="flex-1 flex items-end justify-center gap-[5px] px-3">
                        {nhom.ketQua.map(kq => (
                          <div key={kq.key} title={`${kq.key}: ${kq.soLuong}`} className="h-full flex flex-col justify-end items-center">
                            <span className="text-[10px] font-bold text-[#0f172a] leading-none mb-1">{kq.soLuong}</span>
                            <div
                              className="w-[18px] rounded-t-[2px] flex-shrink-0 transition-all duration-700 hover:brightness-110"
                              style={{ height: `${(kq.soLuong / trucCot.dinh) * 100}%`, backgroundColor: kq.color }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Nhãn loại án */}
                <div className="h-[26px] pt-2 flex">
                  {loaiAnKetQua.map(nhom => (
                    <span key={nhom.loaiAn} className="flex-1 text-center text-[11.5px] font-semibold text-[#334155]">{nhom.loaiAn}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-[#f1f5f9] flex-wrap">
              {KET_QUA_LIST.map(kq => (
                <div key={kq.key} className="flex items-center gap-2 text-[12px] font-medium text-[#475569]">
                  <span className="w-3.5 h-3.5 rounded-[3px] shadow-sm" style={{ backgroundColor: kq.color }} />
                  {kq.key}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kết quả xử lý đơn — thanh ngang, % tính trên tổng đơn nhận trong kỳ */}
        <div className="col-span-1 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4">
            <h3 className="text-[13px] font-bold text-[#8b1a1a] uppercase tracking-wide">Kết quả xử lý đơn</h3>
          </div>
          <div className="flex-1 px-4 pb-2 flex flex-col justify-center gap-3">
            {ketQuaTong.map(kq => (
              <div key={kq.key} className="flex items-center gap-2">
                <span className="w-[110px] flex-shrink-0 text-right text-[11.5px] font-medium text-[#475569] leading-tight">{kq.nhanBaoCao}</span>
                <div className="flex-1 relative h-[15px]">
                  <div
                    className="h-full rounded-r-[2px] transition-all duration-700"
                    style={{ width: `${(kq.soLuong / trucThanh.dinh) * 100}%`, backgroundColor: kq.color }}
                    title={`${kq.nhanBaoCao}: ${kq.soLuong}`}
                  />
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-[11px] font-bold whitespace-nowrap"
                    style={{ left: `calc(${(kq.soLuong / trucThanh.dinh) * 100}% + 6px)`, color: kq.color }}
                  >
                    {kq.soLuong} ({pct1(kq.soLuong, tongDonNhan)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Trục số đơn */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-[110px] flex-shrink-0" />
              <div className="flex-1 relative h-[18px] border-t border-[#e2e8f0]">
                {trucThanh.moc.map((v, i) => (
                  <span key={v} className="absolute top-1 text-[10px] text-[#94a3b8]"
                    style={{ left: `${(i / (trucThanh.moc.length - 1)) * 100}%`, transform: "translateX(-50%)" }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center text-[11px] text-[#94a3b8] mt-2">Số đơn</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Số liệu "Hiện trạng đơn" theo vai trò ───────────────────────────────────
// Vai trò quản lý không tự nhập đơn ⇒ phạm vi "Của tôi" bằng 0; toàn bộ khối
// lượng nằm ở phạm vi "Toàn phòng". Trong bộ số của quản lý:
//   tổng 28 đơn = tổng bảng "Tải việc & hiệu suất của phòng"
//   quá hạn 12  = số đơn ở "Cảnh báo cần xử lý"
const HIEN_TRANG_QUAN_LY: Record<"toi" | "phong", SoLieuHienTrang> = {
  toi: {
    daGiaiQuyet: 0, chuaGiaiQuyet: 0, quaHan: 0, sapDenHan: 0,
    trangThai: [
      { nhan: "Thụ lý mới", mau: "#22c55e", tab: 2, soLuong: 0 },
      { nhan: "Đã thụ lý", mau: "#3b82f6", tab: 2, soLuong: 0 },
      { nhan: "Chưa đủ điều kiện", mau: "#f59e0b", tab: 3, soLuong: 0 },
      { nhan: "Chờ ý kiến Lãnh đạo", mau: "#f97316", tab: 0, soLuong: 0 },
      { nhan: "Trả lại đơn", mau: "#3b82f6", tab: 6, soLuong: 0 },
      { nhan: "Không thụ lý", mau: "#ef4444", tab: 0, soLuong: 0 },
    ],
  },
  phong: {
    daGiaiQuyet: 9, chuaGiaiQuyet: 19, quaHan: 12, sapDenHan: 1,
    trangThai: [
      { nhan: "Thụ lý mới", mau: "#22c55e", tab: 2, soLuong: 12 },
      { nhan: "Đã thụ lý", mau: "#3b82f6", tab: 2, soLuong: 4 },
      { nhan: "Chưa đủ điều kiện", mau: "#f59e0b", tab: 3, soLuong: 3 },
      { nhan: "Chờ ý kiến Lãnh đạo", mau: "#f97316", tab: 0, soLuong: 3 },
      { nhan: "Trả lại đơn", mau: "#3b82f6", tab: 6, soLuong: 5 },
      { nhan: "Không thụ lý", mau: "#ef4444", tab: 0, soLuong: 1 },
    ],
  },
};
const HIEN_TRANG_CAN_BO: Record<"toi" | "phong", SoLieuHienTrang> = {
  toi: {
    daGiaiQuyet: 5, chuaGiaiQuyet: 7, quaHan: 5, sapDenHan: 1,
    trangThai: [
      { nhan: "Thụ lý mới", mau: "#22c55e", tab: 2, soLuong: 7 },
      { nhan: "Đã thụ lý", mau: "#3b82f6", tab: 2, soLuong: 0 },
      { nhan: "Chưa đủ điều kiện", mau: "#f59e0b", tab: 3, soLuong: 1 },
      { nhan: "Chờ ý kiến Lãnh đạo", mau: "#f97316", tab: 0, soLuong: 2 },
      { nhan: "Trả lại đơn", mau: "#3b82f6", tab: 6, soLuong: 2 },
      { nhan: "Không thụ lý", mau: "#ef4444", tab: 0, soLuong: 0 },
    ],
  },
  phong: {
    daGiaiQuyet: 20, chuaGiaiQuyet: 28, quaHan: 10, sapDenHan: 5,
    trangThai: [
      { nhan: "Thụ lý mới", mau: "#22c55e", tab: 2, soLuong: 26 },
      { nhan: "Đã thụ lý", mau: "#3b82f6", tab: 2, soLuong: 4 },
      { nhan: "Chưa đủ điều kiện", mau: "#f59e0b", tab: 3, soLuong: 6 },
      { nhan: "Chờ ý kiến Lãnh đạo", mau: "#f97316", tab: 0, soLuong: 5 },
      { nhan: "Trả lại đơn", mau: "#3b82f6", tab: 6, soLuong: 6 },
      { nhan: "Không thụ lý", mau: "#ef4444", tab: 0, soLuong: 1 },
    ],
  },
};

// ─── Cảnh báo: đơn quá hạn giải quyết ────────────────────────────────────────
// Số liệu ảo; mã đơn / cán bộ xử lý / trạng thái lấy đúng theo SAMPLE_ROWS của
// Danh sách đơn để khi bấm "Xem tất cả" sang tab Tổng số + bộ lọc "Quá hạn
// giải quyết" thì khớp danh sách.

/** Bản của CÁN BỘ — chỉ đơn do chính mình theo dõi, tính theo số năm quá hạn. */
const DON_QUA_HAN_CUA_TOI = [
  { maDon: "7038", canBoXuLy: "Phùng Trâm Anh", trangThai: "Đã thụ lý", quaHanNam: 6.2 },
  { maDon: "7037", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNam: 4.9 },
  { maDon: "7035", canBoXuLy: "Nguyễn Thị Lan", trangThai: "Đã thụ lý", quaHanNam: 3.3 },
  { maDon: "7034", canBoXuLy: "Phùng Trâm Anh", trangThai: "Đã thụ lý", quaHanNam: 2.8 },
  { maDon: "7021", canBoXuLy: "Phùng Trâm Anh", trangThai: "Thụ lý mới", quaHanNam: 2.1 },
  { maDon: "7022", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNam: 1.7 },
  { maDon: "7027", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNam: 1.4 },
  { maDon: "7028", canBoXuLy: "Nguyễn Thị Lan", trangThai: "Thụ lý mới", quaHanNam: 1.1 },
  { maDon: "7048", canBoXuLy: "Nguyễn Minh An", trangThai: "Thụ lý mới", quaHanNam: 0.6 },
  { maDon: "7031", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNam: 0.3 },
];
const SO_DON_SAP_DEN_HAN_CUA_TOI = 5;

/** Bản của QUẢN LÝ — đơn quá hạn của TOÀN PHÒNG, tính theo số ngày quá hạn
 *  (mốc đôn đốc của Trưởng phòng là ngày, không phải năm). Phân bổ theo cán bộ
 *  khớp cột "quá hạn" của bảng Tải việc: 6 + 5 + 1 = 12. */
const DON_QUA_HAN_PHONG = [
  { maDon: "7038", canBoXuLy: "Phùng Trâm Anh", trangThai: "Đã thụ lý", quaHanNgay: 47 },
  { maDon: "4984", canBoXuLy: "Vũ Văn Yên", trangThai: "Chờ ý kiến Lãnh đạo", quaHanNgay: 40 },
  { maDon: "4985", canBoXuLy: "Vũ Văn Yên", trangThai: "Chờ ý kiến Lãnh đạo", quaHanNgay: 40 },
  { maDon: "7037", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNgay: 35 },
  { maDon: "7034", canBoXuLy: "Phùng Trâm Anh", trangThai: "Đã thụ lý", quaHanNgay: 31 },
  { maDon: "7021", canBoXuLy: "Phùng Trâm Anh", trangThai: "Thụ lý mới", quaHanNgay: 28 },
  { maDon: "7035", canBoXuLy: "Nguyễn Thị Lan", trangThai: "Đã thụ lý", quaHanNgay: 24 },
  { maDon: "7027", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNgay: 19 },
  { maDon: "7029", canBoXuLy: "Phùng Trâm Anh", trangThai: "Thụ lý mới", quaHanNgay: 15 },
  { maDon: "7022", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNgay: 11 },
  { maDon: "7026", canBoXuLy: "Phùng Trâm Anh", trangThai: "Chưa đủ điều kiện", quaHanNgay: 7 },
  { maDon: "7031", canBoXuLy: "Vũ Văn Yên", trangThai: "Thụ lý mới", quaHanNgay: 4 },
];
const SO_DON_SAP_DEN_HAN_PHONG = 1;

// ─── Tải việc & hiệu suất của phòng ──────────────────────────────────────────
// Số liệu ảo, ràng buộc chéo với các khối khác trên trang: tổng "quá hạn" = 12
// (bằng "Cảnh báo cần xử lý"), tổng đơn = 28 (bằng "Đơn theo trạng thái thụ
// lý" phạm vi Toàn phòng). Đã xong = tổng − đang xử lý, không có cột thứ ba.
const TAI_VIEC_PHONG = [
  { ten: "Vũ Văn Yên", chucVu: "Cán bộ", tong: 12, dangXuLy: 7, quaHan: 6 },
  { ten: "Phùng Trâm Anh", chucVu: "Cán bộ", tong: 11, dangXuLy: 8, quaHan: 5 },
  { ten: "Nguyễn Thị Lan", chucVu: "Thư ký Tòa án", tong: 4, dangXuLy: 3, quaHan: 1 },
  { ten: "Nguyễn Minh An", chucVu: "Chuyên viên", tong: 1, dangXuLy: 1, quaHan: 0 },
];
/** Từ ngưỡng này trở lên thì gắn cờ "Tải cao". */
const NGUONG_TAI_CAO = 10;

// Đơn chờ phân công Thẩm phán / chờ ý kiến Lãnh đạo — số liệu ảo, khớp lưới
// "Đơn theo trạng thái thụ lý" (Toàn phòng) của bộ số quản lý.
const SO_DON_CHO_PHAN_CONG = 2;
const SO_DON_CHO_Y_KIEN_LD = 3;

export default function Dashboard({ onXemChiTietHieuSuat, onXemPheDuyet, onXemDanhSachDon, onXemDonQuaHan, onXemDanhSachVanBan, onXemSoSanhLoaiAn, vanBanList = [], currentRole = "can-bo" }: {
  onXemChiTietHieuSuat?: () => void;
  /** Sang màn Phê duyệt; App tự mở đúng tab (mặc định "cho_duyet"). */
  onXemPheDuyet?: (tab?: "cho_duyet" | "da_duyet") => void;
  /** Nhấn đúp vào 1 trạng thái trong panel "Phân loại đơn nhận" — đưa số thứ tự
   *  tab (theo tabs của Danh sách đơn) lên App để chuyển màn + chọn đúng tab. */
  onXemDanhSachDon?: (tab: number) => void;
  /** Bấm vào card/dòng "Đơn quá hạn giải quyết" — sang màn Danh sách đơn, tab
   *  "Tổng số" (0), có bật sẵn bộ lọc "Quá hạn giải quyết". */
  onXemDonQuaHan?: () => void;
  /** Bấm "Xem chi tiết" ở card "Đơn của tôi" (hoặc card "Văn bản trả lại") —
   *  sang thẳng màn Danh sách văn bản, mở sẵn tab tương ứng (mặc định "Chờ duyệt"). */
  onXemDanhSachVanBan?: (tab?: TabDS) => void;
  /** Bấm "Xem chi tiết" trên biểu đồ "So sánh số đơn theo loại án & kết quả" —
   *  sang màn So sánh loại án chi tiết, giữ nguyên kỳ báo cáo đang chọn. */
  onXemSoSanhLoaiAn?: (ky: KyBaoCao) => void;
  vanBanList?: VanBanTrinh[];
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
} = {}) {
  // Mọi vai trò quản lý (khác Cán bộ) dùng chung một bố cục: "Việc của tôi hôm
  // nay" → "Cảnh báo cần xử lý" → "Tải việc & hiệu suất của phòng" → "Hiện
  // trạng đơn" → "Báo cáo kết quả xử lý theo kỳ" (Trưởng phòng · Phó/Chánh Văn
  // phòng · Lãnh đạo Tòa · Chánh án/Phó Chánh án).
  const laVaiTroQuanLy = currentRole !== "can-bo";
  const { nguoi: nguoiDung } = nguoiTheoVaiTro(currentRole);
  const [phamViHienTrang, setPhamViHienTrang] = useState<"toi" | "phong">("toi");
  const hienTrang = (laVaiTroQuanLy ? HIEN_TRANG_QUAN_LY : HIEN_TRANG_CAN_BO)[phamViHienTrang];

  // ── Việc đang dừng ở bàn người đang đăng nhập (dữ liệu văn bản THẬT) ───────
  const viecCuaToi = useMemo(() => {
    const toiDangGiu = (v: VanBanTrinh) => dangChoXuLy(v.trangThai) && nguoiDangGiu(v)?.nguoi === nguoiDung;
    const choDuyet = vanBanList.filter(v => v.trangThai === "ChoDuyet" && toiDangGiu(v));
    const choKy = vanBanList.filter(v => (v.trangThai === "ChoKy" || v.trangThai === "ChoButPhe") && toiDangGiu(v));
    // Số ngày văn bản nằm chờ = tính từ mốc lịch sử gần nhất — chính là lúc nó
    // được đẩy tới bàn mình.
    const soNgayCho = (v: VanBanTrinh) => soNgayTu(v.lichSu[v.lichSu.length - 1]?.thoiGian);
    return {
      choDuyet, choKy,
      choDuyetQua3Ngay: choDuyet.filter(v => soNgayCho(v) > 3).length,
      choKyQua3Ngay: choKy.filter(v => soNgayCho(v) > 3).length,
      /** Văn bản đang chờ chính mình xử lý, gom theo người soạn — cột "chờ tôi
       *  duyệt" của bảng "Tải việc & hiệu suất của phòng". */
      choToiDuyetTheoNguoi: (ten: string) => [...choDuyet, ...choKy].filter(v => v.nguoiTao === ten).length,
    };
  }, [vanBanList, nguoiDung]);

  const taiViec = TAI_VIEC_PHONG.map(cb => ({
    ...cb,
    xong: cb.tong - cb.dangXuLy,
    pctHoanThanh: cb.tong > 0 ? Math.round(((cb.tong - cb.dangXuLy) / cb.tong) * 100) : 0,
    choToiDuyet: viecCuaToi.choToiDuyetTheoNguoi(cb.ten),
    chuCai: cb.ten.trim().split(" ").slice(-1)[0][0],
  }));
  // "Tải việc" tính trên số đơn ĐANG xử lý trên đầu người, không tính đơn đã xong.
  const trungBinhTaiViec = taiViec.length
    ? (taiViec.reduce((s, c) => s + c.dangXuLy, 0) / taiViec.length).toFixed(1).replace(".", ",")
    : "0,0";

  // ── Văn bản bị trả lại, chưa thấy sửa ──────────────────────────────────────
  // Tính thẳng từ vanBanList thật (không phải số ảo) nên số ngày "Đã chờ sửa"
  // luôn khớp với mốc TraLai gần nhất trong lichSu.
  const vanBanTraLai = useMemo(() => (
    vanBanList
      .filter(v => v.trangThai === "BiTraLai")
      .map(v => {
        const moc = [...v.lichSu].reverse().find(m => m.hanhDong === "TraLai");
        return { vb: v, traLaiBoi: moc?.nguoi ?? "", soNgay: soNgayTu(moc?.thoiGian) };
      })
      .sort((a, b) => b.soNgay - a.soNgay)
  ), [vanBanList]);
  // Vai trò quản lý chỉ quan tâm văn bản do CHÍNH MÌNH trả lại — đó là việc
  // mình đã yêu cầu sửa mà chưa thấy quay lại.
  const vanBanToiTraLai = useMemo(
    () => vanBanTraLai.filter(x => x.traLaiBoi === nguoiDung),
    [vanBanTraLai, nguoiDung]);

  return (
    <div className="p-5 space-y-5 bg-[#f4f7f9] min-h-full font-sans">
      {laVaiTroQuanLy ? (
        <>
          {/* 1. Việc của tôi hôm nay — việc đang dừng đúng ở bàn người đang
              đăng nhập, không ai xử lý thay được nên đứng đầu trang. */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2">
                <FileCheck size={18} className="text-[#8b1a1a]" />
                Việc của tôi hôm nay
              </h2>
              <span className="text-[11px] text-[#94a3b8]">
                Việc đang dừng ở bàn <b className="text-[#475569]">{nguoiDung}</b> — không ai xử lý thay được
              </span>
            </div>
            <div className="grid grid-cols-4 gap-5">
              <TheViecCuaToi
                title="Văn bản chờ tôi duyệt"
                value={viecCuaToi.choDuyet.length}
                icon={<FileCheck size={19} />}
                bgColorClass="bg-[#fef3e2]" colorClass="text-[#f39c12]"
                canhBao={viecCuaToi.choDuyetQua3Ngay > 0 ? `${viecCuaToi.choDuyetQua3Ngay} văn bản chờ quá 3 ngày` : undefined}
                moTa={viecCuaToi.choDuyet.length ? "Đang chờ bạn duyệt" : "Không còn văn bản nào chờ duyệt"}
                onXuLy={onXemPheDuyet}
              />
              <TheViecCuaToi
                title="Văn bản chờ tôi ký / bút phê"
                value={viecCuaToi.choKy.length}
                icon={<PenLine size={19} />}
                bgColorClass="bg-[#e8f4ff]" colorClass="text-[#1a73e8]"
                canhBao={viecCuaToi.choKyQua3Ngay > 0 ? `${viecCuaToi.choKyQua3Ngay} văn bản chờ quá 3 ngày` : undefined}
                moTa={viecCuaToi.choKy.length ? "Đang chờ bạn ký / bút phê" : "Không còn văn bản nào chờ ký"}
                onXuLy={onXemPheDuyet}
              />
              <TheViecCuaToi
                title="Đơn chờ phân công Thẩm phán"
                value={SO_DON_CHO_PHAN_CONG}
                icon={<Users size={19} />}
                bgColorClass="bg-[#f5f3ff]" colorClass="text-[#8b5cf6]"
                moTa="Đơn đã thụ lý mới, chưa có người xử lý"
                onXuLy={() => onXemDanhSachDon?.(2)}
              />
              <TheViecCuaToi
                title="Đơn chờ ý kiến Lãnh đạo"
                value={SO_DON_CHO_Y_KIEN_LD}
                icon={<MessageSquare size={19} />}
                bgColorClass="bg-[#fff7ed]" colorClass="text-[#f97316]"
                moTa="Cần theo dõi và đôn đốc"
                onXuLy={() => onXemDanhSachDon?.(0)}
              />
            </div>
          </div>

          {/* 2. Cảnh báo cần xử lý — 2 bảng tách riêng vì đòi hai hành động khác
              nhau: đơn quá hạn cần được XỬ LÝ TIẾP, còn văn bản mình đã trả lại
              cần được ĐÔN ĐỐC sửa. Gộp chung sẽ nhoè mất sự khác biệt đó. */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#c0392b]" />
                Cảnh báo cần xử lý
              </h2>
              <span className="text-[11px] text-[#94a3b8]">Hai loại tách riêng vì đòi hai hành động khác nhau</span>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {/* Đơn quá hạn giải quyết */}
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
                  <h3 className="text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#c0392b]" />
                    Đơn quá hạn giải quyết
                  </h3>
                  <span className="bg-[#fee2e2] text-[#c0392b] text-[11px] font-bold px-2 py-0.5 rounded-full">{DON_QUA_HAN_PHONG.length}</span>
                </div>
                <div className="p-3 space-y-2">
                  {DON_QUA_HAN_PHONG.slice(0, 3).map(d => (
                    <div key={d.maDon} onClick={() => onXemDonQuaHan?.()}
                      className="p-3 border border-[#f1f5f9] rounded-[6px] hover:border-[#c0392b]/30 hover:bg-[#fef2f2]/50 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#c0392b] transition-colors">Đơn Mã {d.maDon}</span>
                        <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#fee2e2] text-[#c0392b] whitespace-nowrap">
                          Quá {d.quaHanNgay} ngày
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] text-[#64748b]">Cán bộ xử lý: {d.canBoXuLy} · {d.trangThai}</p>
                        <ArrowRight size={14} className="text-[#cbd5e1] group-hover:text-[#c0392b] transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                  {SO_DON_SAP_DEN_HAN_PHONG > 0 && (
                    <div className="px-3 py-2 rounded-[6px] bg-[#fffbeb] border border-[#fde68a] text-[12px] text-[#92400e]">
                      Thêm <b>{SO_DON_SAP_DEN_HAN_PHONG}</b> đơn sắp đến hạn — nên xử lý trước khi thành quá hạn.{" "}
                      <button onClick={() => onXemDonQuaHan?.()} className="font-semibold underline hover:text-[#78350f]">Xem danh sách</button>
                    </div>
                  )}
                </div>
                <div className="mt-auto p-3 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-[8px] text-center">
                  <button onClick={() => onXemDonQuaHan?.()} className="text-[12px] font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                    Xem tất cả {DON_QUA_HAN_PHONG.length} mục
                  </button>
                </div>
              </div>

              {/* Văn bản tôi đã trả lại, chưa thấy sửa */}
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
                  <h3 className="text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2">
                    <RotateCcw size={16} className="text-[#e67e22]" />
                    Văn bản tôi đã trả lại, chưa thấy sửa
                  </h3>
                  <span className="bg-[#ffedd5] text-[#c2610a] text-[11px] font-bold px-2 py-0.5 rounded-full">{vanBanToiTraLai.length}</span>
                </div>
                <div className="p-3 space-y-2 flex-1">
                  {vanBanToiTraLai.length === 0 && (
                    <p className="text-[12px] text-[#94a3b8] py-6 text-center">Không có văn bản nào bạn trả lại đang chờ sửa.</p>
                  )}
                  {vanBanToiTraLai.slice(0, 3).map(({ vb, soNgay }) => (
                    <div key={vb.id} onClick={() => onXemDanhSachVanBan?.("BiTraLai")}
                      className="p-3 border border-[#f1f5f9] rounded-[6px] hover:border-[#e67e22]/30 hover:bg-[#fff7ed]/50 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#e67e22] transition-colors line-clamp-1">{vb.trichYeu}</span>
                        <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#ffedd5] text-[#c2610a] whitespace-nowrap">
                          Đã {soNgay} ngày
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[12px] text-[#64748b] truncate">Người phải sửa: {vb.nguoiTao}</p>
                        <ArrowRight size={14} className="text-[#cbd5e1] group-hover:text-[#e67e22] transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto p-3 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-[8px] text-center">
                  <button onClick={() => onXemDanhSachVanBan?.("BiTraLai")} className="text-[12px] font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                    Xem tất cả {vanBanToiTraLai.length} mục
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Tải việc & hiệu suất của phòng — ai đang gánh nhiều, ai đang tồn
              quá hạn, và trong đó bao nhiêu việc đang nằm chờ chính mình. */}
          <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm">
            <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
                <Gauge size={18} className="text-[#8b1a1a]" />
                Tải việc & hiệu suất của phòng
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#94a3b8]">Trung bình {trungBinhTaiViec} đơn/người</span>
                <button onClick={onXemChiTietHieuSuat} className="text-[#3b82f6] text-[12px] font-medium hover:underline flex items-center gap-1 whitespace-nowrap">
                  Xem hiệu suất chi tiết <ArrowRight size={11} />
                </button>
              </div>
            </div>

            <div className="p-2">
              {taiViec.map((cb, i) => (
                <div key={cb.ten} className={`flex items-center gap-4 px-3 py-3 rounded-[6px] ${i % 2 === 0 ? "bg-[#f8fafc]" : ""}`}>
                  <div className="w-[38px] h-[38px] rounded-full bg-[#e8eef6] text-[#475569] flex items-center justify-center font-bold text-[15px] flex-shrink-0">
                    {cb.chuCai}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-[#1e293b] text-[13.5px]">{cb.ten}</span>
                      <span className="text-[11px] font-semibold text-[#0f172a] bg-[#f1f5f9] border border-[#e2e8f0] px-1.5 py-0.5 rounded-[4px]">Tổng: {cb.tong}</span>
                      {cb.tong >= NGUONG_TAI_CAO && (
                        <span className="text-[11px] font-semibold text-[#c0392b] bg-[#fee2e2] border border-[#fecaca] px-1.5 py-0.5 rounded-[4px] flex items-center gap-1">
                          <AlertTriangle size={10} /> Tải cao
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium text-[#94a3b8] mb-2">{cb.chucVu}</div>
                    <div className="w-full h-[7px] bg-[#e2e8f0] rounded-full overflow-hidden flex">
                      <div className="bg-[#16a34a] h-full transition-all duration-700" style={{ width: `${(cb.xong / cb.tong) * 100}%` }} title={`Đã giải quyết xong: ${cb.xong}`} />
                      <div className="bg-[#eab308] h-full transition-all duration-700" style={{ width: `${(cb.dangXuLy / cb.tong) * 100}%` }} title={`Đang xử lý: ${cb.dangXuLy}`} />
                    </div>
                  </div>
                  <div className="w-[130px] text-right leading-[1.6]">
                    <div className="text-[12px] font-bold text-[#16a34a]">{cb.pctHoanThanh}% hoàn thành</div>
                    <div className="text-[11px] text-[#64748b]">{cb.dangXuLy} đang xử lý</div>
                    {cb.quaHan > 0 && <div className="text-[11px] font-medium text-[#c0392b]">{cb.quaHan} quá hạn</div>}
                    {cb.choToiDuyet > 0 && <div className="text-[11px] font-medium text-[#d97706]">{cb.choToiDuyet} chờ tôi duyệt</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-[#f8fafc] border-t border-[#f1f5f9] rounded-b-[8px]">
              <div className="flex items-center justify-center gap-6 text-[12px] font-medium text-[#475569]">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[2px] bg-[#16a34a]" /> Đã giải quyết xong</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[2px] bg-[#eab308]" /> Đang xử lý</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Cảnh báo cần xử lý — vai trò Cán bộ. 2 bảng tách riêng vì đòi hai hành
           động khác nhau: đơn quá hạn cần được XỬ LÝ TIẾP, còn văn bản bị trả
           lại cần được SỬA LẠI rồi trình lại. */
        <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
            <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#c0392b]" />
              Cảnh báo cần xử lý
            </h2>
            <span className="text-[11px] text-[#94a3b8]">Hai loại tách riêng vì đòi hai hành động khác nhau</span>
          </div>
          <div className="grid grid-cols-2 gap-5 p-5">
            {/* Đơn quá hạn giải quyết */}
            <div className="border border-[#eee] rounded-[8px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
                <h3 className="text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2">
                  <AlertTriangle size={16} className="text-[#c0392b]" />
                  Đơn quá hạn giải quyết
                </h3>
                <span className="bg-[#fee2e2] text-[#c0392b] text-[11px] font-bold px-2 py-0.5 rounded-full">{DON_QUA_HAN_CUA_TOI.length}</span>
              </div>
              <div className="p-3 space-y-2">
                {DON_QUA_HAN_CUA_TOI.slice(0, 3).map(d => (
                  <div key={d.maDon} onClick={() => onXemDonQuaHan?.()}
                    className="p-3 border border-[#f1f5f9] rounded-[6px] hover:border-[#c0392b]/30 hover:bg-[#fef2f2]/50 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#c0392b] transition-colors">Đơn Mã {d.maDon}</span>
                      <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#fee2e2] text-[#c0392b] whitespace-nowrap">
                        Quá {d.quaHanNam.toFixed(1).replace(".", ",")} năm
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] text-[#64748b]">Cán bộ xử lý: {d.canBoXuLy} · {d.trangThai}</p>
                      <ArrowRight size={14} className="text-[#cbd5e1] group-hover:text-[#c0392b] transition-colors flex-shrink-0" />
                    </div>
                  </div>
                ))}
                {SO_DON_SAP_DEN_HAN_CUA_TOI > 0 && (
                  <div className="px-3 py-2 rounded-[6px] bg-[#fffbeb] border border-[#fde68a] text-[12px] text-[#92400e]">
                    Thêm <b>{SO_DON_SAP_DEN_HAN_CUA_TOI}</b> đơn sắp đến hạn — nên xử lý trước khi thành quá hạn.
                  </div>
                )}
              </div>
              <div className="mt-auto p-3 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-[8px] text-center">
                <button onClick={() => onXemDonQuaHan?.()} className="text-[12px] font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                  Xem tất cả {DON_QUA_HAN_CUA_TOI.length} mục
                </button>
              </div>
            </div>

            {/* Đơn trả lại, chưa thấy sửa */}
            <div className="border border-[#eee] rounded-[8px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
                <h3 className="text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2">
                  <RotateCcw size={16} className="text-[#e67e22]" />
                  Đơn trả lại, chưa thấy sửa
                </h3>
                <span className="bg-[#ffedd5] text-[#c2610a] text-[11px] font-bold px-2 py-0.5 rounded-full">{vanBanTraLai.length}</span>
              </div>
              <div className="p-3 space-y-2 flex-1">
                {vanBanTraLai.length === 0 && (
                  <p className="text-[12px] text-[#94a3b8] py-6 text-center">Không có đơn nào đang chờ sửa lại.</p>
                )}
                {vanBanTraLai.slice(0, 3).map(({ vb, traLaiBoi, soNgay }) => (
                  <div key={vb.id} onClick={() => onXemDanhSachVanBan?.("BiTraLai")}
                    className="p-3 border border-[#f1f5f9] rounded-[6px] hover:border-[#e67e22]/30 hover:bg-[#fff7ed]/50 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#e67e22] transition-colors line-clamp-1">{vb.trichYeu}</span>
                      <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#ffedd5] text-[#c2610a] whitespace-nowrap">
                        Đã {soNgay} ngày
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] text-[#64748b] truncate">Người phải sửa: {vb.nguoiTao} · Trả lại bởi {traLaiBoi}</p>
                      <ArrowRight size={14} className="text-[#cbd5e1] group-hover:text-[#e67e22] transition-colors flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto p-3 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-[8px] text-center">
                <button onClick={() => onXemDanhSachVanBan?.("BiTraLai")} className="text-[12px] font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                  Xem tất cả {vanBanTraLai.length} mục
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hiện trạng đơn — chung cho mọi vai trò, khác nhau ở bộ số */}
      <HienTrangDon
        hienTrang={hienTrang}
        phamVi={phamViHienTrang}
        onDoiPhamVi={setPhamViHienTrang}
        onXemDanhSachDon={onXemDanhSachDon}
        onXemDonQuaHan={onXemDonQuaHan}
        onXemChiTietHieuSuat={onXemChiTietHieuSuat}
      />

      {/* Báo cáo kết quả xử lý theo kỳ — chung cho mọi vai trò. Lưới "Đơn theo
          trạng thái thụ lý" nằm trong khối này, ngay dưới bộ lọc kỳ. */}
      <BaoCaoKetQuaTheoKy trangThai={hienTrang.trangThai} onXemDanhSachDon={onXemDanhSachDon} onXemSoSanhLoaiAn={onXemSoSanhLoaiAn} />
    </div>
  );
}
