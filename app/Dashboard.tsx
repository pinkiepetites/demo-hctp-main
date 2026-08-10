import React, { useState } from "react";
import {
  BarChart3,
  Users,
  Calendar,
  PieChart,
  BellRing,
  ArrowRight,
  FileCheck,
  Hourglass,
  FileText,
  Gavel,
  Scale,
  HelpCircle
} from "lucide-react";
import { dangChoXuLy, nguoiDangGiu, nguoiTheoVaiTro, type VanBanTrinh } from "./components/QuanLyVanBan";

// Biến thể của KPICard có nút "Xem chi tiết" ở góc phải — dùng cho 2 card
// duyệt tài liệu, dẫn thẳng sang màn Phê duyệt đề xuất.
const KPICardCoLink = ({ title, value, icon, colorClass, bgColorClass, trend, onXemChiTiet }: {
  title: string, value: string, icon: React.ReactNode, colorClass: string, bgColorClass: string, trend: string,
  onXemChiTiet?: () => void,
}) => (
  <div className="bg-white rounded-[8px] border border-[#eee] p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-default">
    <div className="flex items-start justify-between gap-2 mb-1.5">
      <p className="text-[13px] text-[#666] font-medium">{title}</p>
      <button
        onClick={onXemChiTiet}
        className="text-[#3b82f6] text-[11px] font-medium hover:underline flex items-center gap-0.5 flex-shrink-0"
      >
        Xem chi tiết <ArrowRight size={11} />
      </button>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-2.5">
        <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{value}</span>
        <span className={`text-[12px] font-semibold flex items-center gap-0.5 ${trend.startsWith('+') || trend.startsWith('Tăng') ? 'text-[#27ae60]' : (trend.startsWith('-') || trend.startsWith('Giảm') ? 'text-[#c0392b]' : 'text-[#f39c12]')}`}>
          {trend}
        </span>
      </div>
      <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 ${bgColorClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
  </div>
);

// Card thống kê đầu trang — nền trắng, chữ mảnh, số liệu lớn kèm % inline, icon tròn bên phải.
// Dùng chung cho cả 4 card (Tổng đơn nhận / Hình sự / Dân sự / Chưa xác định) để đồng nhất giao diện.
const StatCard = ({ title, value, trend, icon, iconColorClass, iconBgClass }: {
  title: string; value: string; trend: string; icon: React.ReactNode; iconColorClass: string; iconBgClass: string;
}) => (
  <div className="bg-white rounded-[10px] border border-[#eef1f4] p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
    <div>
      <p className="text-[13px] text-[#8a94a6] font-normal mb-1.5">{title}</p>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-[26px] font-bold text-[#1d2e4f] leading-none tracking-tight">{value}</span>
        <span className="text-[12px] font-medium text-[#22c55e] whitespace-nowrap">{trend}</span>
      </div>
    </div>
    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgClass} ${iconColorClass}`}>
      {icon}
    </div>
  </div>
);

// "Kết quả xử lý đơn" — bar ngang xếp hạng theo giá trị giảm dần, mỗi hạng mục một màu riêng
// (nominal categorical, không phải chuỗi theo Vụ GĐKT), nhãn giá trị + % đặt ngay đầu mút bar.
const KetQuaXuLyDonChart = ({ items, maxValue }: {
  items: { label: string; value: number; percent: number; color: string }[];
  maxValue: number;
}) => {
  const ticks = Array.from({ length: maxValue + 1 }, (_, i) => i);
  return (
    <div className="pt-1">
      <div className="relative">
        <div className="absolute left-[168px] right-2 top-0 bottom-0 pointer-events-none">
          {ticks.map(t => (
            <div key={t} className="absolute top-0 bottom-0 border-l border-dashed border-[#f1f5f9]" style={{ left: `${(t / maxValue) * 100}%` }} />
          ))}
        </div>
        <div className="space-y-3 relative">
          {items.map(item => (
            <div key={item.label} className="flex items-center gap-2 h-[20px]">
              <span className="w-[160px] flex-shrink-0 text-[12px] text-[#475569] text-right truncate">{item.label}</span>
              <div className="flex-1 relative h-full mr-2">
                <div
                  className="absolute inset-y-0 left-0 rounded-r-[4px] transition-all duration-700"
                  style={{ width: `${Math.max((item.value / maxValue) * 100, item.value ? 2 : 0)}%`, backgroundColor: item.color }}
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#0f172a] whitespace-nowrap"
                  style={{ left: `calc(${(item.value / maxValue) * 100}% + 8px)` }}
                >
                  {item.value} ({item.percent.toFixed(1).replace(".", ",")}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-[#e2e8f0]">
        <span className="w-[160px] flex-shrink-0" />
        <div className="flex-1 flex justify-between text-[11px] text-[#94a3b8] mr-2">
          {ticks.map(t => <span key={t}>{t}</span>)}
        </div>
      </div>
      <div className="text-center text-[11px] text-[#94a3b8] mt-1">Số đơn</div>
    </div>
  );
};

// "So sánh số đơn theo loại án & kết quả" — mỗi loại án là một nhóm cột, trong nhóm là
// 6 cột nhỏ theo hạng mục kết quả (cùng màu với KetQuaXuLyDonChart), giúp so trực quan
// loại án nào phát sinh nhiều đơn trùng/thụ lý mới/v.v. nhất trong kỳ.
const SoSanhLoaiAnChart = ({ groups, categories, maxValue }: {
  groups: { loaiAn: string; values: Record<string, number> }[];
  categories: readonly { key: string; label: string; color: string }[];
  maxValue: number;
}) => {
  const ticks = Array.from({ length: maxValue + 1 }, (_, i) => i);
  return (
    <div>
      <div className="flex items-end h-[300px] gap-1 pt-0.5 relative">
        <div className="absolute left-0 top-0 bottom-5 w-6 flex flex-col justify-between text-[11px] text-[#94a3b8] font-medium">
          {[...ticks].reverse().map(t => <span key={t}>{t}</span>)}
        </div>
        <div className="absolute left-8 right-0 top-0 bottom-5 border-l border-b border-[#e2e8f0]">
          {ticks.slice(1).map(t => (
            <div key={t} className="absolute w-full border-t border-dashed border-[#f1f5f9]" style={{ bottom: `${(t / maxValue) * 100}%` }} />
          ))}
        </div>
        <div className="ml-8 w-full flex justify-around items-end h-full z-10 pb-5">
          {groups.map(g => (
            <div key={g.loaiAn} className="flex flex-col items-center gap-1 relative h-full justify-end">
              <div className="flex items-end gap-[6px] h-full">
                {categories.map(cat => {
                  const v = g.values[cat.key] ?? 0;
                  const pct = (v / maxValue) * 100;
                  return (
                    <div key={cat.key} className="relative w-[32px] h-full flex flex-col justify-end" title={`${cat.label}: ${v}`}>
                      <span
                        className="absolute left-1/2 -translate-x-1/2 text-[11px] font-bold text-[#0f172a] whitespace-nowrap pointer-events-none"
                        style={{ bottom: `calc(${pct}% + 4px)` }}
                      >
                        {v}
                      </span>
                      <div
                        className="w-full rounded-t-[4px] transition-all duration-700 hover:brightness-110"
                        style={{ height: `${pct}%`, minHeight: v ? "2px" : 0, backgroundColor: cat.color }}
                      />
                    </div>
                  );
                })}
              </div>
              <span className="text-[13px] font-semibold text-[#334155] absolute bottom-0 translate-y-full mt-2 w-full text-center whitespace-nowrap">{g.loaiAn}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-[#f1f5f9] flex-wrap">
        {categories.map(cat => (
          <div key={cat.key} className="flex items-center gap-1.5 text-[12px] font-medium text-[#475569]">
            <div className="w-3 h-3 rounded-[3px] shadow-sm" style={{ backgroundColor: cat.color }}></div>
            {cat.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut % cơ cấu xử lý đơn — vòng tròn rỗng chia theo tỉ lệ từng trạng thái, tâm hiển thị
// tổng số đơn, chú giải liệt kê đủ nhãn + số lượng + % (đóng vai trò legend bắt buộc cho ≥2 chuỗi).
const DonutChart = ({ items }: { items: { label: string; value: number; color: string }[] }) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const size = 132, thickness = 20, radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let acc = 0;
  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
          {total > 0 && items.filter(item => item.value > 0).map(item => {
            const dash = Math.max((item.value / total) * circumference - 2, 0);
            const el = (
              <circle
                key={item.label}
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-acc}
              />
            );
            acc += (item.value / total) * circumference;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[22px] font-bold text-[#1d2e4f] leading-none">{total}</span>
          <span className="text-[10px] text-[#94a3b8] mt-1">đơn</span>
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        {items.map(item => {
          const percent = total ? (item.value / total) * 100 : 0;
          return (
            <div key={item.label} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-[#0f172a] min-w-0">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.label}</span>
              </span>
              <span className="text-right flex-shrink-0">
                <div className="text-[13px] font-bold leading-tight" style={{ color: item.color }}>{item.value} đơn</div>
                <div className="text-[11px] text-[#94a3b8] leading-tight">{percent.toFixed(1).replace(".", ",")}%</div>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Dashboard({ onXemChiTietHieuSuat, onXemPheDuyet, vanBanList = [], currentRole = "can-bo" }: {
  onXemChiTietHieuSuat?: () => void;
  onXemPheDuyet?: () => void;
  vanBanList?: VanBanTrinh[];
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
} = {}) {
  // Chỉ Trưởng phòng / Phó-Chánh Văn phòng / Lãnh đạo Tòa / Chánh án-Phó Chánh án
  // mới thấy 2 card duyệt tài liệu — đây là những vai trò nằm trong luồng ký duyệt văn bản.
  const hienThiTheDuyet = currentRole === "truong-phong" || currentRole === "pho-vp" || currentRole === "chanh-an" || currentRole === "lanh-dao";
  const { nguoi: nguoiDung } = nguoiTheoVaiTro(currentRole);
  const taiLieuChoDuyet = vanBanList.filter(v => dangChoXuLy(v.trangThai));
  const soTaiLieuCanDuyet = taiLieuChoDuyet.filter(v => nguoiDangGiu(v)?.nguoi === nguoiDung).length;
  const soTaiLieuDangChoDuyet = taiLieuChoDuyet.length;

  const [chartPeriod, setChartPeriod] = useState<"day" | "week" | "month" | "year" | "custom">("week");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [filterOfficer, setFilterOfficer] = useState("all");

  const getPeriodLabel = () => {
    switch (chartPeriod) {
      case "day": return "hôm nay";
      case "week": return "tuần này";
      case "month": return "tháng này";
      case "year": return "năm nay";
      case "custom": return "kỳ tùy chọn";
    }
  };

  const getCompareLabel = () => {
    switch (chartPeriod) {
      case "day": return "hôm qua";
      case "week": return "tuần trước";
      case "month": return "tháng trước";
      case "year": return "năm trước";
      case "custom": return "kỳ trước";
    }
  };

  // Số liệu gốc lấy từ báo cáo "Phòng Hành chính Tư pháp" (dòng Tổng cộng, kỳ 01/03/2026 - 18/03/2026)
  // — đây là nguồn duy nhất để tính 4 số của card KPI, thay vì gõ tay từng số như trước.
  const hctpReportTuanNay = {
    tongDonNhan: 27,           // "Tổng số đơn đã xử lý HCTP"
    traLaiDon: 1,               // "Trả lại đơn"
    khongThuocThamQuyen: 1,     // "Đơn không thuộc thẩm quyền TATC"
    chuaDuDieuKien: 1,          // "Đơn chưa đủ điều kiện"
    gdkt1: { trung: 5, thuLyMoi: 3 },
    gdkt2: { trung: 0, thuLyMoi: 0 },
    gdkt3: { trung: 0, thuLyMoi: 0 },
    conLaiChuaXuLy: 0,          // "Đơn còn lại chưa xử lý"
    chuyenToaAnKhac: 1,         // "Chuyển Toà án khác"
  };

  // "Kết quả xử lý đơn" — xếp hạng 6 hạng mục xử lý của kỳ báo cáo theo số lượng giảm dần,
  // % tính trên tổng số đơn đã nhận (tongDonNhan), đúng như cách báo cáo Phòng HCTP trình bày.
  const ketQuaXuLyDonItems = [
    { label: "Đơn trùng", value: hctpReportTuanNay.gdkt1.trung + hctpReportTuanNay.gdkt2.trung + hctpReportTuanNay.gdkt3.trung, color: "#ef4444" },
    { label: "Đơn thụ lý mới", value: hctpReportTuanNay.gdkt1.thuLyMoi + hctpReportTuanNay.gdkt2.thuLyMoi + hctpReportTuanNay.gdkt3.thuLyMoi, color: "#3b82f6" },
    { label: "Chưa đủ điều kiện", value: hctpReportTuanNay.chuaDuDieuKien, color: "#eab308" },
    { label: "Trả lại đơn", value: hctpReportTuanNay.traLaiDon, color: "#f97316" },
    { label: "Không thuộc thẩm quyền TATC", value: hctpReportTuanNay.khongThuocThamQuyen, color: "#06b6d4" },
    { label: "Chuyển Toà án khác", value: hctpReportTuanNay.chuyenToaAnKhac, color: "#8b5cf6" },
  ]
    .map(item => ({ ...item, percent: hctpReportTuanNay.tongDonNhan ? (item.value / hctpReportTuanNay.tongDonNhan) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
  const ketQuaXuLyDonMax = Math.max(...ketQuaXuLyDonItems.map(i => i.value), 1) + 1;

  // Công thức gộp cột báo cáo thành 4 chỉ số KPI:
  // - Tổng đơn nhận = Tổng số đơn đã xử lý HCTP.
  // - Đã xử lý = Trả lại đơn + Đơn thụ lý mới (cả 3 Vụ GĐKT).
  // - Đang giải quyết = Chưa đủ điều kiện + Không thuộc thẩm quyền TATC + Đơn trùng (cả 3 Vụ GĐKT).
  // - Tồn đọng/Quá hạn = Đơn còn lại chưa xử lý.
  const tinhKPITuBaoCao = (r: typeof hctpReportTuanNay) => {
    const tongDonTrung = r.gdkt1.trung + r.gdkt2.trung + r.gdkt3.trung;
    const tongDonThuLyMoi = r.gdkt1.thuLyMoi + r.gdkt2.thuLyMoi + r.gdkt3.thuLyMoi;
    return {
      total: r.tongDonNhan,
      processed: r.traLaiDon + tongDonThuLyMoi,
      processing: r.chuaDuDieuKien + r.khongThuocThamQuyen + tongDonTrung,
      overdue: r.conLaiChuaXuLy,
    };
  };

  const getKPIData = () => {
    const compare = getCompareLabel();
    switch (chartPeriod) {
      case "day": return { total: "45", processed: "28", processing: "12", overdue: "5", t1: `+12% so với ${compare}`, t2: `+5% so với ${compare}`, t3: `-2% so với ${compare}`, t4: `Tăng 1 so với ${compare}` };
      case "month": return { total: "1,250", processed: "980", processing: "210", overdue: "60", t1: `+15% so với ${compare}`, t2: `+18% so với ${compare}`, t3: `-5% so với ${compare}`, t4: `Giảm 10 so với ${compare}` };
      case "year": return { total: "15,400", processed: "12,800", processing: "1,500", overdue: "1,100", t1: `+8% so với ${compare}`, t2: `+10% so với ${compare}`, t3: `-2% so với ${compare}`, t4: `Giảm 5% so với ${compare}` };
      case "custom": return { total: "320", processed: "250", processing: "50", overdue: "20", t1: `---`, t2: `---`, t3: `---`, t4: `---` };
      case "week":
      default: {
        const k = tinhKPITuBaoCao(hctpReportTuanNay);
        return {
          total: String(k.total),
          processed: String(k.processed),
          processing: String(k.processing),
          overdue: String(k.overdue),
          t1: `+8% so với ${compare}`, t2: `+12% so với ${compare}`, t3: `+1% so với ${compare}`, t4: `Giảm 2 so với ${compare}`,
        };
      }
    }
  };

  const kpi = getKPIData();

  // Phân loại 4 card thống kê đầu trang theo loại đơn (Hình sự / Dân sự / Chưa xác định),
  // suy ra từ tổng đơn nhận theo tỉ lệ thực tế của kỳ báo cáo HCTP (14/10/3 trên tổng 27 đơn)
  // để 3 số cộng lại luôn khớp đúng tổng, dù đổi kỳ xem (ngày/tuần/tháng/năm).
  const getLoaiDonData = () => {
    const total = parseInt(kpi.total.replace(/,/g, ""), 10) || 0;
    const hinhSu = Math.round(total * (14 / 27));
    const danSu = Math.round(total * (10 / 27));
    const chuaXacDinh = Math.max(0, total - hinhSu - danSu);
    return {
      total,
      hinhSu,
      danSu,
      chuaXacDinh,
      percentHinhSu: total ? (hinhSu / total) * 100 : 0,
      percentDanSu: total ? (danSu / total) * 100 : 0,
      percentChuaXacDinh: total ? (chuaXacDinh / total) * 100 : 0,
    };
  };

  const loaiDon = getLoaiDonData();

  // 6 hạng mục kết quả xử lý — dùng chung màu cho cả bảng xếp hạng "Kết quả xử lý đơn"
  // và biểu đồ so sánh theo loại án bên dưới, để cùng một hạng mục luôn cùng một màu.
  const KET_QUA_CATEGORIES = [
    { key: "donTrung", label: "Đơn trùng", color: "#ef4444" },
    { key: "thuLyMoi", label: "Thụ lý mới", color: "#3b82f6" },
    { key: "chuaDuDieuKien", label: "Chưa đủ điều kiện", color: "#eab308" },
    { key: "traLai", label: "Trả lại", color: "#f97316" },
    { key: "khongThamQuyen", label: "Không thẩm quyền", color: "#06b6d4" },
    { key: "chuyenToaKhac", label: "Chuyển Toà án khác", color: "#8b5cf6" },
  ] as const;

  // Phân rã 6 hạng mục kết quả (đã có tổng ở hctpReportTuanNay/ketQuaXuLyDonItems) theo
  // loại án (Hình sự / Dân sự / Chưa xác định) — cộng theo cột phải khớp đúng tổng hạng mục:
  // Đơn trùng 5 (3+2+0), Thụ lý mới 3 (2+1+0), Chưa đủ điều kiện 1 (1+0+0), Trả lại 1 (1+0+0),
  // Không thẩm quyền 1 (1+0+0), Chuyển Toà án khác 1 (0+1+0). Chưa xác định chưa xử lý (=0 cả 6).
  const soSanhLoaiAnData = [
    { loaiAn: "Hình sự", values: { donTrung: 3, thuLyMoi: 2, chuaDuDieuKien: 1, traLai: 1, khongThamQuyen: 1, chuyenToaKhac: 0 } },
    { loaiAn: "Dân sự", values: { donTrung: 2, thuLyMoi: 1, chuaDuDieuKien: 0, traLai: 0, khongThamQuyen: 0, chuyenToaKhac: 1 } },
    { loaiAn: "Chưa xác định", values: { donTrung: 0, thuLyMoi: 0, chuaDuDieuKien: 0, traLai: 0, khongThamQuyen: 0, chuyenToaKhac: 0 } },
  ];
  const soSanhLoaiAnMax = Math.max(
    ...soSanhLoaiAnData.flatMap(g => KET_QUA_CATEGORIES.map(cat => g.values[cat.key]))
  ) + 2;

  const getOfficerData = () => {
    let mult = 1;
    if (chartPeriod === 'day') mult = 0.1;
    if (chartPeriod === 'month') mult = 4;
    if (chartPeriod === 'year') mult = 40;
    if (chartPeriod === 'custom') mult = 0.5;

    return [
      { name: "Nguyễn Văn An", role: "Thẩm phán bậc 1", total: Math.max(1, Math.round(55 * mult)), inProgress: Math.max(1, Math.round(15 * mult)), completed: Math.max(0, Math.round(40 * mult)), avatar: "N" },
      { name: "Trần Thị Bình", role: "Thẩm phán bậc 2", total: Math.max(1, Math.round(42 * mult)), inProgress: Math.max(1, Math.round(12 * mult)), completed: Math.max(0, Math.round(30 * mult)), avatar: "T" },
      { name: "Lê Minh Tuấn", role: "Thẩm phán tối cao", total: Math.max(1, Math.round(38 * mult)), inProgress: Math.max(1, Math.round(8 * mult)), completed: Math.max(0, Math.round(30 * mult)), avatar: "L" },
      { name: "Phạm Hải Yến", role: "Thẩm phán bậc 1", total: Math.max(1, Math.round(35 * mult)), inProgress: Math.max(1, Math.round(10 * mult)), completed: Math.max(0, Math.round(25 * mult)), avatar: "P" },
      { name: "Hoàng Công Cường", role: "Thẩm phán bậc 3", total: Math.max(1, Math.round(28 * mult)), inProgress: Math.max(1, Math.round(5 * mult)), completed: Math.max(0, Math.round(23 * mult)), avatar: "H" },
    ];
  };

  const officerData = getOfficerData();
  const displayedOfficers = filterOfficer === "all" ? officerData : officerData.filter(o => o.name === filterOfficer);

  // Cơ cấu xử lý đơn — donut % theo 5 trạng thái, lấy thẳng từ report HCTP dùng chung cho
  // các card/biểu đồ khác: đơn đã thụ lý = tổng đơn trùng (nghĩa là đã có hồ sơ thụ lý từ
  // trước), đơn thụ lý mới = tổng thụ lý mới 3 Vụ GĐKT, còn lại lấy thẳng các cột report.
  const coCauXuLyDonItems = [
    { label: "Đơn thụ lý mới", value: hctpReportTuanNay.gdkt1.thuLyMoi + hctpReportTuanNay.gdkt2.thuLyMoi + hctpReportTuanNay.gdkt3.thuLyMoi, color: "#22c55e" },
    { label: "Đơn đã thụ lý", value: hctpReportTuanNay.gdkt1.trung + hctpReportTuanNay.gdkt2.trung + hctpReportTuanNay.gdkt3.trung, color: "#3b82f6" },
    { label: "Trả lại đơn", value: hctpReportTuanNay.traLaiDon, color: "#8b5cf6" },
    { label: "Chưa đủ điều kiện", value: hctpReportTuanNay.chuaDuDieuKien, color: "#94a3b8" },
    { label: "Chờ xử lý", value: hctpReportTuanNay.conLaiChuaXuLy, color: "#1d2e4f" },
  ];

  return (
    <div className="p-5 space-y-5 bg-[#f4f7f9] min-h-full font-sans">
      {/* Filters */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-[8px] border border-[#e2e8f0] shadow-sm mb-5">
        <div className="flex items-center gap-5 flex-wrap w-full">
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

          <div className="w-px h-6 bg-[#cbd5e1]"></div>

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

          <div className="flex-1"></div>

          <div className="flex items-center gap-2.5">
            <label className="text-[13px] font-medium text-[#475569]">Lọc theo Cán bộ:</label>
            <select 
              value={filterOfficer} 
              onChange={e => setFilterOfficer(e.target.value)} 
              className="h-[32px] px-3 border border-[#cbd5e1] rounded-[4px] text-[13px] outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] bg-white min-w-[220px] text-[#1e293b] cursor-pointer"
            >
              <option value="all">Tất cả cán bộ</option>
              {officerData.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 1. KPIs */}
      <div>
        <h2 className="text-[16px] font-bold text-[#0f172a] mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-[#8b1a1a]" />
          Thống kê đơn nhận {getPeriodLabel()}
        </h2>
        <div className="grid grid-cols-4 gap-5">
          <StatCard
            title="Tổng đơn nhận"
            value={String(loaiDon.total)}
            trend={kpi.t1}
            icon={<FileText size={20} />}
            iconColorClass="text-[#3b82f6]"
            iconBgClass="bg-[#eff6ff]"
          />
          <StatCard
            title="Hình sự"
            value={String(loaiDon.hinhSu)}
            trend={`${loaiDon.percentHinhSu.toFixed(1).replace(".", ",")}% tổng số đơn`}
            icon={<Gavel size={20} />}
            iconColorClass="text-[#3b82f6]"
            iconBgClass="bg-[#eff6ff]"
          />
          <StatCard
            title="Dân sự"
            value={String(loaiDon.danSu)}
            trend={`${loaiDon.percentDanSu.toFixed(1).replace(".", ",")}% tổng số đơn`}
            icon={<Scale size={20} />}
            iconColorClass="text-[#22c55e]"
            iconBgClass="bg-[#f0fdf4]"
          />
          <StatCard
            title="Chưa xác định"
            value={String(loaiDon.chuaXacDinh)}
            trend={`${loaiDon.percentChuaXacDinh.toFixed(1).replace(".", ",")}% tổng số đơn`}
            icon={<HelpCircle size={20} />}
            iconColorClass="text-[#8b5cf6]"
            iconBgClass="bg-[#f5f3ff]"
          />
        </div>
      </div>

      {/* Duyệt tài liệu — chỉ Trưởng phòng / Phó Chánh án-Chánh án / Lãnh đạo Tòa */}
      {hienThiTheDuyet && (
        <div>
          <h2 className="text-[16px] font-bold text-[#0f172a] mb-4 flex items-center gap-2">
            <FileCheck size={18} className="text-[#8b1a1a]" />
            Duyệt tài liệu
          </h2>
          <div className="grid grid-cols-4 gap-5">
            <KPICardCoLink
              title="Tài liệu cần duyệt"
              value={String(soTaiLieuCanDuyet)}
              trend="Đang chờ bạn xử lý"
              icon={<FileCheck size={24} />}
              bgColorClass="bg-[#fef3e2]"
              colorClass="text-[#f39c12]"
              onXemChiTiet={onXemPheDuyet}
            />
            <KPICardCoLink
              title="Tài liệu đang chờ duyệt"
              value={String(soTaiLieuDangChoDuyet)}
              trend="Đã gửi, đang trong luồng duyệt"
              icon={<Hourglass size={24} />}
              bgColorClass="bg-[#e8f4ff]"
              colorClass="text-[#1a73e8]"
              onXemChiTiet={onXemPheDuyet}
            />
          </div>
        </div>
      )}

      {/* ROW 2: Chart & Alerts */}
      <div className="grid grid-cols-3 gap-5">
        {/* Lượng đơn Chart */}
        <div className="col-span-2 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <BarChart3 size={18} className="text-[#3b82f6]" />
              So sánh số đơn theo loại án & kết quả
            </h3>
          </div>

          <div className="flex-1 p-3 flex flex-col justify-center">
            <SoSanhLoaiAnChart groups={soSanhLoaiAnData} categories={KET_QUA_CATEGORIES} maxValue={soSanhLoaiAnMax} />
          </div>
        </div>

        {/* Kết quả xử lý đơn + Alerts / To-do */}
        <div className="col-span-1 flex flex-col gap-5">
          <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
            <div className="px-5 py-4 border-b border-[#f1f5f9]">
              <h3 className="text-[13px] font-bold text-[#8b1a1a] uppercase tracking-wide">Kết quả xử lý đơn</h3>
            </div>
            <div className="p-5">
              <KetQuaXuLyDonChart items={ketQuaXuLyDonItems} maxValue={ketQuaXuLyDonMax} />
            </div>
          </div>

          <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
                <BellRing size={18} className="text-[#ef4444]" />
                Cần chú ý / Quá hạn
              </h3>
              <span className="bg-[#fee2e2] text-[#ef4444] text-[10px] font-bold px-2 py-0.5 rounded-full">{kpi.overdue} đơn</span>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {[1, 2].map((_, i) => (
                <div key={i} className="p-3 border border-[#f1f5f9] rounded-[6px] hover:border-[#ef4444]/30 hover:bg-[#fef2f2]/50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-1.5">
                    <span className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#ef4444] transition-colors">Đơn: 102{i}/2026</span>
                    <span className="text-[11px] font-semibold text-[#ef4444] bg-[#fee2e2] px-1.5 py-0.5 rounded-[3px]">Quá hạn {i+1} ngày</span>
                  </div>
                  <p className="text-[12px] text-[#64748b] line-clamp-1 mb-2">Yêu cầu GĐT bản án dân sự số 45...</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#475569] font-medium">
                      <Users size={12} className="text-[#94a3b8]" /> Nguyễn Văn {['An', 'Bình', 'Cường', 'Dũng', 'Em'][i]}
                    </div>
                    <ArrowRight size={14} className="text-[#cbd5e1] group-hover:text-[#ef4444] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-[8px] text-center">
              <button className="text-[12px] font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">Xem tất cả cảnh báo</button>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Secondary widgets */}
      <div className="grid grid-cols-3 gap-5">
        {/* Cơ cấu xử lý đơn */}
        <div className="col-span-1 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <PieChart size={18} className="text-[#8b1a1a]" />
              Cơ cấu xử lý đơn
            </h3>
          </div>
          <div className="flex-1 p-5 flex flex-col justify-center">
            <DonutChart items={coCauXuLyDonItems} />
          </div>
        </div>

        {/* Đơn theo cán bộ */}
        <div className="col-span-2 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <Users size={18} className="text-[#8b1a1a]" />
              Hiệu suất cán bộ {getPeriodLabel()}
            </h3>
            <button onClick={onXemChiTietHieuSuat} className="text-[#3b82f6] text-[12px] font-medium hover:underline flex items-center gap-1">
              Xem chi tiết
            </button>
          </div>
          
          <div className="flex-1 p-2 overflow-y-auto">
            {displayedOfficers.map((officer, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-[#f8fafc] rounded-[6px] transition-colors border-b border-[#f1f5f9] last:border-0 group cursor-pointer">
                <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#1e293b] to-[#334155] text-white flex items-center justify-center font-bold text-[16px] flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  {officer.avatar}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#1e293b] text-[14px] truncate">{officer.name}</span>
                    <span className="font-bold text-[#0f172a] text-[14px] bg-[#f1f5f9] px-2 py-0.5 rounded-[4px]">Tổng: {officer.total}</span>
                  </div>
                  <div className="text-[11px] font-medium text-[#64748b] mb-2">{officer.role}</div>
                  
                  <div className="w-full h-[6px] bg-[#e2e8f0] rounded-full overflow-hidden flex shadow-inner">
                    <div 
                      className="bg-[#22c55e] h-full transition-all duration-700" 
                      style={{ width: `${(officer.completed / officer.total) * 100}%` }}
                      title={`Đã xử lý: ${officer.completed}`}
                    ></div>
                    <div 
                      className="bg-[#eab308] h-full transition-all duration-700" 
                      style={{ width: `${(officer.inProgress / officer.total) * 100}%` }}
                      title={`Đang giải quyết: ${officer.inProgress}`}
                    ></div>
                  </div>
                </div>
                <div className="w-[80px] text-right">
                  <div className="text-[11px] font-bold text-[#22c55e] mb-1">{Math.round((officer.completed/officer.total)*100)}% H.Thành</div>
                  <div className="text-[10px] text-[#64748b]">{officer.inProgress} đang xử lý</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3.5 bg-[#f8fafc] border-t border-[#f1f5f9] rounded-b-[8px]">
            <div className="flex items-center justify-center gap-6 text-[12px] font-medium text-[#475569]">
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#22c55e]"></div> Đã xử lý</span>
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#eab308]"></div> Đang giải quyết</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
