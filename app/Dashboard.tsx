import React, { useRef, useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Users,
  Calendar,
  PieChart,
  BellRing,
  ArrowRight,
  FileCheck,
  Hourglass,
  X
} from "lucide-react";
import { dangChoXuLy, nguoiDangGiu, nguoiTheoVaiTro, type VanBanTrinh } from "./components/QuanLyVanBan";

const KPICard = ({ title, value, icon, colorClass, bgColorClass, trend }: { title: string, value: string, icon: React.ReactNode, colorClass: string, bgColorClass: string, trend: string }) => (
  <div className="bg-white rounded-[8px] border border-[#eee] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-default">
    <div>
      <p className="text-[13px] text-[#666] font-medium mb-1.5">{title}</p>
      <div className="flex items-baseline gap-2.5">
        <span className="text-[28px] font-bold text-[#1d2e4f] leading-none tracking-tight">{value}</span>
        <span className={`text-[12px] font-semibold flex items-center gap-0.5 ${trend.startsWith('+') || trend.startsWith('Tăng') ? 'text-[#27ae60]' : (trend.startsWith('-') || trend.startsWith('Giảm') ? 'text-[#c0392b]' : 'text-[#f39c12]')}`}>
          {trend}
        </span>
      </div>
    </div>
    <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center ${bgColorClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
  </div>
);

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

export default function Dashboard({ onXemChiTietHieuSuat, onXemPheDuyet, vanBanList = [], currentRole = "can-bo" }: {
  onXemChiTietHieuSuat?: () => void;
  onXemPheDuyet?: () => void;
  vanBanList?: VanBanTrinh[];
  currentRole?: "can-bo" | "truong-phong" | "pho-vp" | "lanh-dao" | "chanh-an";
} = {}) {
  // Chỉ Trưởng phòng / Phó Chánh án-Chánh án / Lãnh đạo Tòa mới thấy 2 card
  // duyệt tài liệu — đây là những vai trò nằm trong luồng ký duyệt văn bản.
  const hienThiTheDuyet = currentRole === "truong-phong" || currentRole === "chanh-an" || currentRole === "lanh-dao";
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
  };

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

  // Màu theo Vụ GĐKT — dùng chung cho biểu đồ cột chồng và phần chú giải.
  const GDKT_COLORS = {
    gdkt1: "#3b82f6", // Vụ GĐKT 1 — xanh dương
    gdkt2: "#22c55e", // Vụ GĐKT 2 — xanh lá
    gdkt3: "#f97316", // Vụ GĐKT 3 — cam
    chuaDu: "#94a3b8", // Đơn chưa đủ điều kiện — xám, không phân theo Vụ
  };

  // Dữ liệu chi tiết theo từng ngày trong tuần (Thứ 2 - Thứ 6), chia nhỏ đúng theo dòng
  // "Tổng cộng" của báo cáo Phòng HCTP dùng cho card KPI ở trên (hctpReportTuanNay) —
  // cộng dồn 5 ngày phải khớp 100% với số liệu report: Vụ GĐKT 1 trùng=5, thụ lý mới=3,
  // Vụ GĐKT 2 và 3 chưa phát sinh (=0), chưa đủ điều kiện=1.
  const gdktWeekdayData = [
    { day: "Thứ 2", trung: { gdkt1: 2, gdkt2: 0, gdkt3: 0 }, thuLyMoi: { gdkt1: 1, gdkt2: 0, gdkt3: 0 }, chuaDu: 0 },
    { day: "Thứ 3", trung: { gdkt1: 1, gdkt2: 0, gdkt3: 0 }, thuLyMoi: { gdkt1: 1, gdkt2: 0, gdkt3: 0 }, chuaDu: 0 },
    { day: "Thứ 4", trung: { gdkt1: 1, gdkt2: 0, gdkt3: 0 }, thuLyMoi: { gdkt1: 0, gdkt2: 0, gdkt3: 0 }, chuaDu: 1 },
    { day: "Thứ 5", trung: { gdkt1: 1, gdkt2: 0, gdkt3: 0 }, thuLyMoi: { gdkt1: 1, gdkt2: 0, gdkt3: 0 }, chuaDu: 0 },
    { day: "Thứ 6", trung: { gdkt1: 0, gdkt2: 0, gdkt3: 0 }, thuLyMoi: { gdkt1: 0, gdkt2: 0, gdkt3: 0 }, chuaDu: 0 },
  ];

  const gdktGroupTotal = (g: { gdkt1: number; gdkt2: number; gdkt3: number }) => g.gdkt1 + g.gdkt2 + g.gdkt3;
  const maxGDKTValue = Math.max(
    ...gdktWeekdayData.flatMap(d => [gdktGroupTotal(d.trung), gdktGroupTotal(d.thuLyMoi), d.chuaDu])
  ) * 1.15 || 1;

  const chartAreaRef = useRef<HTMLDivElement>(null);
  const [gdktPopup, setGdktPopup] = useState<{
    x: number;
    day: string;
    title: string;
    total: number;
    breakdown?: { gdkt1: number; gdkt2: number; gdkt3: number };
  } | null>(null);

  const handleGdktColClick = (
    e: React.MouseEvent<HTMLDivElement>,
    day: string,
    col: { title: string; stacked?: { gdkt1: number; gdkt2: number; gdkt3: number }; single?: number }
  ) => {
    const container = chartAreaRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const barRect = e.currentTarget.getBoundingClientRect();
    const half = 140;
    const rawX = barRect.left - containerRect.left + barRect.width / 2;
    const x = Math.min(Math.max(rawX, half), containerRect.width - half);
    const total = col.stacked ? gdktGroupTotal(col.stacked) : (col.single ?? 0);
    setGdktPopup({ x, day, title: col.title, total, breakdown: col.stacked });
  };

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

  // Data for new "Loại án" widget
  const caseTypes = [
    { label: "Dân sự", percent: 45, color: "bg-[#3498db]" },
    { label: "Hình sự", percent: 30, color: "bg-[#e74c3c]" },
    { label: "Hành chính", percent: 15, color: "bg-[#f39c12]" },
    { label: "Kinh doanh - Thương mại", percent: 10, color: "bg-[#9b59b6]" },
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
          Tình hình xử lý đơn {getPeriodLabel()}
        </h2>
        <div className="grid grid-cols-4 gap-5">
          <KPICard
            title="Tổng đơn nhận"
            value={kpi.total}
            trend={kpi.t1}
            icon={<FileText size={24} />}
            bgColorClass="bg-[#eff6ff]"
            colorClass="text-[#3b82f6]"
          />
          <KPICard
            title="Đã xử lý (Thụ lý/Trả lại)"
            value={kpi.processed}
            trend={kpi.t2}
            icon={<CheckCircle size={24} />}
            bgColorClass="bg-[#f0fdf4]"
            colorClass="text-[#22c55e]"
          />
          <KPICard
            title="Đang giải quyết"
            value={kpi.processing}
            trend={kpi.t3}
            icon={<Clock size={24} />}
            bgColorClass="bg-[#fefce8]"
            colorClass="text-[#eab308]"
          />
          <KPICard
            title="Tồn đọng / Quá hạn"
            value={kpi.overdue}
            trend={kpi.t4}
            icon={<AlertCircle size={24} />}
            bgColorClass="bg-[#fef2f2]"
            colorClass="text-[#ef4444]"
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
              Thống kê đơn theo Vụ GĐKT tuần này
            </h3>
          </div>

          <div className="flex-1 p-5 flex flex-col justify-end min-h-[320px]">
            {gdktPopup && <div className="fixed inset-0 z-20" onClick={() => setGdktPopup(null)} />}
            <div ref={chartAreaRef} className="flex items-end justify-between h-[230px] gap-2 pt-10 relative">
              <div className="absolute left-0 top-6 bottom-6 w-8 flex flex-col justify-between text-[11px] text-[#94a3b8] pb-1 font-medium">
                <span>{Math.round(maxGDKTValue)}</span>
                <span>{Math.round(maxGDKTValue / 2)}</span>
                <span>0</span>
              </div>

              <div className="absolute left-10 right-0 top-7 bottom-6 border-l border-b border-[#e2e8f0]">
                <div className="absolute w-full top-0 border-t border-dashed border-[#e2e8f0]"></div>
                <div className="absolute w-full top-1/2 border-t border-dashed border-[#e2e8f0]"></div>
              </div>

              <div className="ml-10 w-full flex justify-evenly items-end h-full z-10 pb-[25px]">
                {gdktWeekdayData.map((d) => {
                  const columns = [
                    { key: "trung", title: "Đơn trùng", stacked: d.trung, single: undefined as number | undefined },
                    { key: "thuLyMoi", title: "Đơn thụ lý mới", stacked: d.thuLyMoi, single: undefined as number | undefined },
                    { key: "chuaDu", title: "Đơn chưa đủ điều kiện", stacked: undefined as typeof d.trung | undefined, single: d.chuaDu },
                  ];
                  return (
                    <div key={d.day} className="flex flex-col items-center gap-1 relative h-full justify-end">
                      <div className="flex items-end gap-2 h-full">
                        {columns.map(col => {
                          const total = col.stacked ? gdktGroupTotal(col.stacked) : (col.single ?? 0);
                          const fillPct = (total / maxGDKTValue) * 100;
                          const isActive = gdktPopup?.day === d.day && gdktPopup?.title === col.title;
                          return (
                            <div
                              key={col.key}
                              onClick={(e) => handleGdktColClick(e, d.day, col)}
                              className="relative w-[28px] h-full cursor-pointer"
                            >
                              <span
                                className="absolute left-1/2 -translate-x-1/2 text-[11px] font-bold text-[#0f172a] whitespace-nowrap pointer-events-none"
                                style={{ bottom: `calc(${fillPct}% + 4px)` }}
                              >
                                {total}
                              </span>
                              <div
                                className={`absolute inset-0 flex flex-col-reverse rounded-t-[4px] overflow-hidden ring-offset-2 transition-all ${isActive ? "ring-2 ring-[#0f172a]/40" : ""}`}
                              >
                                {col.stacked ? (
                                  <>
                                    <div
                                      className="w-full transition-all duration-700 hover:brightness-110"
                                      style={{ height: `${(col.stacked.gdkt1 / maxGDKTValue) * 100}%`, backgroundColor: GDKT_COLORS.gdkt1 }}
                                    />
                                    <div
                                      className="w-full transition-all duration-700 hover:brightness-110"
                                      style={{ height: `${(col.stacked.gdkt2 / maxGDKTValue) * 100}%`, backgroundColor: GDKT_COLORS.gdkt2 }}
                                    />
                                    <div
                                      className="w-full transition-all duration-700 hover:brightness-110"
                                      style={{ height: `${(col.stacked.gdkt3 / maxGDKTValue) * 100}%`, backgroundColor: GDKT_COLORS.gdkt3 }}
                                    />
                                  </>
                                ) : (
                                  <div
                                    className="w-full transition-all duration-700 hover:brightness-110"
                                    style={{ height: `${((col.single ?? 0) / maxGDKTValue) * 100}%`, backgroundColor: GDKT_COLORS.chuaDu }}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-[12px] font-semibold text-[#334155] absolute bottom-0 translate-y-full mt-2 w-full text-center">{d.day}</span>
                    </div>
                  );
                })}
              </div>

              {gdktPopup && (
                <div
                  className="absolute z-30 w-[280px] bg-white rounded-[10px] border border-[#e2e8f0] shadow-xl"
                  style={{ left: gdktPopup.x, top: 0, transform: "translate(-50%, calc(-100% - 14px))" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#f1f5f9]">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#0f172a] leading-tight">Chi tiết điều chuyển - {gdktPopup.title}</h4>
                      <span className="text-[11px] text-[#94a3b8]">{gdktPopup.day}</span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-[12px] text-[#475569] whitespace-nowrap">Tổng: <span className="font-bold text-[#0f172a]">{gdktPopup.total}</span></span>
                      <button onClick={() => setGdktPopup(null)} className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {gdktPopup.breakdown ? (
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide pb-2 border-b border-[#f1f5f9]">
                        <span>Vụ GĐKT</span>
                        <span>Số lượng</span>
                      </div>
                      {[
                        { label: "Vụ GĐKT 1", value: gdktPopup.breakdown.gdkt1, color: GDKT_COLORS.gdkt1 },
                        { label: "Vụ GĐKT 2", value: gdktPopup.breakdown.gdkt2, color: GDKT_COLORS.gdkt2 },
                        { label: "Vụ GĐKT 3", value: gdktPopup.breakdown.gdkt3, color: GDKT_COLORS.gdkt3 },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#f8fafc]">
                          <span className="flex items-center gap-2 text-[13px] text-[#334155]">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }}></span>
                            {row.label}
                          </span>
                          <span className="text-[13px] font-semibold" style={{ color: row.color }}>{row.value}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#e2e8f0]">
                        <span className="text-[13px] font-bold text-[#0f172a]">Tổng cộng</span>
                        <span className="text-[13px] font-bold text-[#0f172a]">{gdktPopup.total}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-[13px] text-[#64748b]">Không phân theo Vụ GĐKT</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 mt-10 pt-4 border-t border-[#f1f5f9] flex-wrap">
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#475569]">
                <div className="w-3.5 h-3.5 rounded-[3px] shadow-sm" style={{ backgroundColor: GDKT_COLORS.gdkt1 }}></div>
                Vụ GĐKT 1
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#475569]">
                <div className="w-3.5 h-3.5 rounded-[3px] shadow-sm" style={{ backgroundColor: GDKT_COLORS.gdkt2 }}></div>
                Vụ GĐKT 2
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#475569]">
                <div className="w-3.5 h-3.5 rounded-[3px] shadow-sm" style={{ backgroundColor: GDKT_COLORS.gdkt3 }}></div>
                Vụ GĐKT 3
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#475569]">
                <div className="w-3.5 h-3.5 rounded-[3px] shadow-sm" style={{ backgroundColor: GDKT_COLORS.chuaDu }}></div>
                Đơn chưa đủ điều kiện
              </div>
            </div>
            <div className="text-center text-[11px] text-[#94a3b8] mt-2">Mỗi ngày: 3 cột — Đơn trùng · Đơn thụ lý mới · Đơn chưa đủ điều kiện. Bấm vào cột để xem chi tiết theo Vụ.</div>
          </div>
        </div>

        {/* Alerts / To-do */}
        <div className="col-span-1 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <BellRing size={18} className="text-[#ef4444]" />
              Cần chú ý / Quá hạn
            </h3>
            <span className="bg-[#fee2e2] text-[#ef4444] text-[10px] font-bold px-2 py-0.5 rounded-full">{kpi.overdue} đơn</span>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {[1, 2, 3, 4, 5].map((_, i) => (
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

      {/* ROW 3: Secondary widgets */}
      <div className="grid grid-cols-3 gap-5">
        {/* Phân loại án */}
        <div className="col-span-1 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
              <PieChart size={18} className="text-[#8b1a1a]" />
              Cơ cấu loại hình án
            </h3>
          </div>
          <div className="flex-1 p-5 flex flex-col justify-center space-y-5">
            {caseTypes.map((type, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#334155]">{type.label}</span>
                  <span className="text-[13px] font-bold text-[#0f172a]">{type.percent}%</span>
                </div>
                <div className="w-full h-[8px] bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${type.color} rounded-full transition-all duration-1000`} 
                    style={{ width: `${type.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
