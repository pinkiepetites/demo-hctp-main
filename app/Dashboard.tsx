import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";

const KPICard = ({ title, value, icon, colorClass, bgColorClass, trend }: { title: string, value: string, icon: React.ReactNode, colorClass: string, bgColorClass: string, trend: string }) => (
  <div className="bg-white rounded-[6px] border border-[#ddd] p-4 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-[12px] text-[#666] font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-[24px] font-bold text-[#1d2e4f] leading-none">{value}</span>
        <span className={`text-[11px] font-medium ${trend.startsWith('+') ? 'text-[#27ae60]' : 'text-[#c0392b]'}`}>
          {trend}
        </span>
      </div>
    </div>
    <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center ${bgColorClass} ${colorClass}`}>
      {icon}
    </div>
  </div>
);

export default function Dashboard() {
  const [chartPeriod, setChartPeriod] = useState<"day" | "week" | "month" | "year" | "custom">("week");
  const [filterDate, setFilterDate] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [filterOfficer, setFilterOfficer] = useState("all");

  // Mock data for officers
  const officerData = [
    { name: "Nguyễn Văn An", role: "Thẩm phán bậc 1", total: 15, inProgress: 5, completed: 10, avatar: "N" },
    { name: "Trần Thị Bình", role: "Thẩm phán bậc 2", total: 12, inProgress: 8, completed: 4, avatar: "T" },
    { name: "Lê Minh Tuấn", role: "Thẩm phán tối cao", total: 9, inProgress: 2, completed: 7, avatar: "L" },
    { name: "Phạm Hải Yến", role: "Thẩm phán bậc 1", total: 7, inProgress: 4, completed: 3, avatar: "P" },
    { name: "Hoàng Công Cường", role: "Thẩm phán bậc 3", total: 5, inProgress: 1, completed: 4, avatar: "H" },
  ];

  // Mock chart data based on period
  const getChartData = () => {
    switch (chartPeriod) {
      case "day":
        return [
          { label: "08:00", received: 2, processed: 1 },
          { label: "10:00", received: 5, processed: 3 },
          { label: "12:00", received: 3, processed: 4 },
          { label: "14:00", received: 8, processed: 5 },
          { label: "16:00", received: 4, processed: 6 },
        ];
      case "month":
        return [
          { label: "Tuần 1", received: 45, processed: 38 },
          { label: "Tuần 2", received: 52, processed: 45 },
          { label: "Tuần 3", received: 38, processed: 40 },
          { label: "Tuần 4", received: 60, processed: 50 },
        ];
      case "year":
        return [
          { label: "Quý 1", received: 150, processed: 130 },
          { label: "Quý 2", received: 180, processed: 160 },
          { label: "Quý 3", received: 140, processed: 135 },
          { label: "Quý 4", received: 200, processed: 180 },
        ];
      case "custom":
        return [
          { label: "Ngày 1", received: 10, processed: 8 },
          { label: "Ngày 2", received: 15, processed: 10 },
          { label: "Ngày 3", received: 12, processed: 11 },
        ];
      case "week":
      default:
        return [
          { label: "T2", received: 12, processed: 10 },
          { label: "T3", received: 15, processed: 12 },
          { label: "T4", received: 10, processed: 15 },
          { label: "T5", received: 18, processed: 14 },
          { label: "T6", received: 22, processed: 20 },
          { label: "T7", received: 5, processed: 8 },
          { label: "CN", received: 2, processed: 2 },
        ];
    }
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map(d => Math.max(d.received, d.processed))) * 1.2 || 1;

  const displayedOfficers = filterOfficer === "all" ? officerData : officerData.filter(o => o.name === filterOfficer);

  return (
    <div className="p-5 space-y-5 bg-[#eef1f5] min-h-full">
      {/* Filters */}
      <div className="flex items-center justify-between bg-white p-3 rounded-[6px] border border-[#ddd] shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          {chartPeriod === "custom" ? (
            <div className="flex items-center gap-2">
              <label className="text-[13px] font-medium text-[#555]">Từ ngày:</label>
              <input 
                type="date" 
                value={customStartDate} 
                onChange={e => setCustomStartDate(e.target.value)} 
                className="h-[30px] px-2 border border-[#ccc] rounded-[3px] text-[13px] outline-none focus:border-[#1a5a96] text-[#333]" 
              />
              <span className="text-[#888]">-</span>
              <label className="text-[13px] font-medium text-[#555]">Đến ngày:</label>
              <input 
                type="date" 
                value={customEndDate} 
                onChange={e => setCustomEndDate(e.target.value)} 
                className="h-[30px] px-2 border border-[#ccc] rounded-[3px] text-[13px] outline-none focus:border-[#1a5a96] text-[#333]" 
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label className="text-[13px] font-medium text-[#555]">Lọc theo ngày:</label>
              <input 
                type="date" 
                value={filterDate} 
                onChange={e => setFilterDate(e.target.value)} 
                className="h-[30px] px-2 border border-[#ccc] rounded-[3px] text-[13px] outline-none focus:border-[#1a5a96] text-[#333]" 
              />
            </div>
          )}
          <div className="w-px h-5 bg-[#ddd]"></div>
          <div className="flex items-center gap-2">
            <label className="text-[13px] font-medium text-[#555]">Cán bộ:</label>
            <select 
              value={filterOfficer} 
              onChange={e => setFilterOfficer(e.target.value)} 
              className="h-[30px] px-2 border border-[#ccc] rounded-[3px] text-[13px] outline-none focus:border-[#1a5a96] bg-white min-w-[200px] text-[#333]"
            >
              <option value="all">Tất cả cán bộ</option>
              {officerData.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 1. Xử lý đơn trong ngày */}
      <div>
        <h2 className="text-[15px] font-bold text-[#1d2e4f] mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-[#8b1a1a]" />
          Tình hình xử lý đơn trong ngày
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            title="Tổng đơn nhận"
            value="45"
            trend="+12% so với hôm qua"
            icon={<FileText size={24} />}
            bgColorClass="bg-[#eaf4ff]"
            colorClass="text-[#1a5a96]"
          />
          <KPICard
            title="Đã xử lý (Thụ lý/Trả lại)"
            value="28"
            trend="+5% so với hôm qua"
            icon={<CheckCircle size={24} />}
            bgColorClass="bg-[#e8f7ee]"
            colorClass="text-[#27ae60]"
          />
          <KPICard
            title="Đang giải quyết"
            value="12"
            trend="-2% so với hôm qua"
            icon={<Clock size={24} />}
            bgColorClass="bg-[#fff3cd]"
            colorClass="text-[#856404]"
          />
          <KPICard
            title="Tồn đọng/Quá hạn"
            value="5"
            trend="+1 đơn so với hôm qua"
            icon={<AlertCircle size={24} />}
            bgColorClass="bg-[#fdeaea]"
            colorClass="text-[#c0392b]"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* 2. Thống kê theo ngày/tháng/tuần */}
        <div className="col-span-2 bg-white rounded-[6px] border border-[#ddd] shadow-sm flex flex-col">
          <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-[#333] flex items-center gap-1.5">
              <BarChart3 size={15} className="text-[#1a5a96]" />
              Thống kê lượng đơn
            </h3>
            <div className="flex items-center bg-[#f5f5f5] rounded-[4px] p-[2px] border border-[#ddd]">
              <button
                onClick={() => setChartPeriod("day")}
                className={`px-3 py-1 text-[11px] font-medium rounded-[3px] transition-colors ${chartPeriod === "day" ? "bg-white shadow-sm text-[#1d2e4f] border border-[#ccc]" : "text-[#666] hover:text-[#333]"}`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => setChartPeriod("week")}
                className={`px-3 py-1 text-[11px] font-medium rounded-[3px] transition-colors ${chartPeriod === "week" ? "bg-white shadow-sm text-[#1d2e4f] border border-[#ccc]" : "text-[#666] hover:text-[#333]"}`}
              >
                Tuần này
              </button>
              <button
                onClick={() => setChartPeriod("month")}
                className={`px-3 py-1 text-[11px] font-medium rounded-[3px] transition-colors ${chartPeriod === "month" ? "bg-white shadow-sm text-[#1d2e4f] border border-[#ccc]" : "text-[#666] hover:text-[#333]"}`}
              >
                Tháng này
              </button>
              <button
                onClick={() => setChartPeriod("year")}
                className={`px-3 py-1 text-[11px] font-medium rounded-[3px] transition-colors ${chartPeriod === "year" ? "bg-white shadow-sm text-[#1d2e4f] border border-[#ccc]" : "text-[#666] hover:text-[#333]"}`}
              >
                Năm nay
              </button>
              <button
                onClick={() => setChartPeriod("custom")}
                className={`px-3 py-1 text-[11px] font-medium rounded-[3px] transition-colors ${chartPeriod === "custom" ? "bg-white shadow-sm text-[#1d2e4f] border border-[#ccc]" : "text-[#666] hover:text-[#333]"}`}
              >
                Tùy chọn
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 flex flex-col justify-end min-h-[260px]">
            {/* Custom CSS Bar Chart */}
            <div className="flex items-end justify-between h-[200px] gap-2 pt-4 relative">
              {/* Y-axis labels mock */}
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-[#888] pb-1">
                <span>{Math.round(maxChartValue)}</span>
                <span>{Math.round(maxChartValue / 2)}</span>
                <span>0</span>
              </div>
              
              <div className="absolute left-8 right-0 top-1.5 bottom-6 border-l border-b border-[#eee]">
                {/* Horizontal grid lines */}
                <div className="absolute w-full top-0 border-t border-dashed border-[#eee]"></div>
                <div className="absolute w-full top-1/2 border-t border-dashed border-[#eee]"></div>
              </div>

              <div className="ml-9 w-full flex justify-around items-end h-full z-10 pb-[25px]">
                {chartData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 group relative w-full h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-[#333] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                      Nhận: {d.received} | Xử lý: {d.processed}
                    </div>
                    
                    <div className="flex items-end gap-[2px] w-full max-w-[40px] justify-center h-full">
                      <div 
                        className="w-[45%] bg-[#1a5a96] rounded-t-[2px] transition-all duration-500 hover:brightness-110" 
                        style={{ height: `${(d.received / maxChartValue) * 100}%` }}
                      ></div>
                      <div 
                        className="w-[45%] bg-[#27ae60] rounded-t-[2px] transition-all duration-500 hover:brightness-110" 
                        style={{ height: `${(d.processed / maxChartValue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-medium text-[#666] absolute bottom-0 translate-y-full mt-2 w-full text-center">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 pt-4 border-t border-[#f5f5f5]">
              <div className="flex items-center gap-2 text-[11px] text-[#555]">
                <div className="w-3 h-3 bg-[#1a5a96] rounded-sm"></div>
                Đơn tiếp nhận
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#555]">
                <div className="w-3 h-3 bg-[#27ae60] rounded-sm"></div>
                Đơn đã xử lý
              </div>
            </div>
          </div>
        </div>

        {/* 3. Đơn theo cán bộ giải quyết */}
        <div className="col-span-1 bg-white rounded-[6px] border border-[#ddd] shadow-sm flex flex-col">
          <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-[#333] flex items-center gap-1.5">
              <Users size={15} className="text-[#8b1a1a]" />
              Đơn theo cán bộ
            </h3>
            <button className="text-[#1a5a96] text-[11px] hover:underline flex items-center gap-1">
              Xem tất cả
            </button>
          </div>
          
          <div className="flex-1 p-2 overflow-y-auto">
            {displayedOfficers.map((officer, index) => (
              <div key={index} className="flex items-center gap-3 p-2.5 hover:bg-[#f9f9f9] rounded-[4px] transition-colors border-b border-[#f5f5f5] last:border-0">
                <div className="w-[36px] h-[36px] rounded-full bg-[#1d2e4f] text-white flex items-center justify-center font-bold text-[14px] flex-shrink-0">
                  {officer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-[#222] text-[12px] truncate">{officer.name}</span>
                    <span className="font-bold text-[#1a5a96] text-[13px]">{officer.total}</span>
                  </div>
                  <div className="text-[10px] text-[#777] mb-1.5">{officer.role}</div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-[5px] bg-[#eee] rounded-full overflow-hidden flex">
                    <div 
                      className="bg-[#27ae60] h-full" 
                      style={{ width: `${(officer.completed / officer.total) * 100}%` }}
                      title={`Đã xử lý: ${officer.completed}`}
                    ></div>
                    <div 
                      className="bg-[#f59e0b] h-full" 
                      style={{ width: `${(officer.inProgress / officer.total) * 100}%` }}
                      title={`Đang giải quyết: ${officer.inProgress}`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-[#fafafa] border-t border-[#eee] rounded-b-[6px]">
            <div className="flex items-center justify-between text-[11px] text-[#666]">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#27ae60]"></div> Đã xử lý</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Đang giải quyết</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
